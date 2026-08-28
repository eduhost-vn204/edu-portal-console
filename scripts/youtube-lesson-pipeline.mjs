/**
 * YouTube Private Video & Draft Lesson Pipeline
 * Hệ thống tự động: Nhận inbox -> Upload YouTube Private -> Tạo bài học DRAFT trên hệ thống
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { postAdminWriteCore } from './postAdminWrite.mjs';

export const DEFAULT_DB_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';

/**
 * Tính hash SHA256 của file để kiểm tra idempotency
 */
export function calculateFileHash(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Đọc và chuẩn hóa manifest
 */
export function readLessonManifest(inboxDir) {
  const manifestPath = path.join(inboxDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Không tìm thấy file manifest.json tại: ${inboxDir}`);
  }

  const content = fs.readFileSync(manifestPath, 'utf8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (err) {
    throw new Error(`Lỗi cú pháp JSON trong ${manifestPath}: ${err.message}`);
  }

  if (!data.course || !data.chapter || !data.title) {
    throw new Error(`Manifest thiếu các trường bắt buộc (course, chapter, title). Vui lòng kiểm tra lại.`);
  }

  const lessonName = data.lessonName || data.title;
  const draftLessonName = lessonName.startsWith('[DRAFT]') ? lessonName : `[DRAFT] ${lessonName}`;

  return {
    title: data.title.trim(),
    course: data.course.trim(),
    chapter: data.chapter.trim(),
    lessonName: draftLessonName,
    description: data.description || '',
    videoFile: data.videoFile || 'video.mp4',
    privacyStatus: data.privacyStatus || 'private',
    pdfUrl: data.pdfUrl || '',
    pdfTheoryUrl: data.pdfTheoryUrl || '',
    pdfPracticeUrl: data.pdfPracticeUrl || '',
    order: data.order !== undefined ? data.order : '',
    tags: Array.isArray(data.tags) ? data.tags : []
  };
}

/**
 * Đọc / Ghi checkpoint để đảm bảo không bao giờ upload trùng
 */
export function loadCheckpoint(inboxDir) {
  const cpPath = path.join(inboxDir, '.checkpoint.json');
  if (!fs.existsSync(cpPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(cpPath, 'utf8'));
  } catch {
    return null;
  }
}

export function saveCheckpoint(inboxDir, checkpointData) {
  const cpPath = path.join(inboxDir, '.checkpoint.json');
  fs.writeFileSync(cpPath, JSON.stringify(checkpointData, null, 2), 'utf8');
}

/**
 * Upload Video lên YouTube ở chế độ Private (hoặc Mock khi kiểm thử)
 */
export async function uploadVideoToYouTube(inboxDir, manifest, options = {}) {
  const isMock = options.mock || process.env.MOCK_YOUTUBE === 'true' || process.env.MOCK_YOUTUBE === '1';
  const videoPath = path.join(inboxDir, manifest.videoFile);

  const checkpoint = loadCheckpoint(inboxDir);
  if (checkpoint && checkpoint.uploadStatus === 'UPLOADED_PRIVATE' && checkpoint.videoId) {
    console.log(`[YouTube] Video đã được tải lên trước đó (ID: ${checkpoint.videoId}). Bỏ qua upload.`);
    return {
      videoId: checkpoint.videoId,
      youtubeUrl: checkpoint.youtubeUrl,
      isResumed: true
    };
  }

  console.log(`[YouTube] Bắt đầu tải video lên YouTube (Chế độ: PRIVATE)...`);
  console.log(`          - Tiêu đề: ${manifest.title}`);
  console.log(`          - File video: ${manifest.videoFile}`);

  if (isMock) {
    // Mock upload cho kiểm thử tự động
    const mockHash = crypto.createHash('md5').update(manifest.title + (manifest.course || '')).digest('hex').substring(0, 11);
    const mockVideoId = `mock_${mockHash}`;
    const mockUrl = `https://www.youtube.com/watch?v=${mockVideoId}`;

    const newCp = {
      manifestHash: calculateFileHash(path.join(inboxDir, 'manifest.json')),
      videoFile: manifest.videoFile,
      videoId: mockVideoId,
      youtubeUrl: mockUrl,
      uploadStatus: 'UPLOADED_PRIVATE',
      privacyStatus: 'private',
      uploadedAt: new Date().toISOString()
    };
    saveCheckpoint(inboxDir, newCp);

    console.log(`[YouTube] [MOCK] Tải video thành công! Video ID: ${mockVideoId}`);
    return {
      videoId: mockVideoId,
      youtubeUrl: mockUrl,
      isResumed: false
    };
  }

  // Real Upload via YouTube Data API v3 OAuth
  const token = options.oauthToken || process.env.YOUTUBE_OAUTH_TOKEN;
  if (!token) {
    throw new Error(
      `Yêu cầu YouTube OAuth Token để tải video thật. ` +
      `Nếu đang kiểm thử, hãy dùng cờ --mock.`
    );
  }

  // Upload logic using resumable upload protocol
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Không tìm thấy file video tại: ${videoPath}`);
  }

  const stats = fs.statSync(videoPath);
  const metadata = {
    snippet: {
      title: manifest.title,
      description: manifest.description,
      tags: manifest.tags
    },
    status: {
      privacyStatus: 'private',
      selfDeclaredMadeForKids: false
    }
  };

  const initRes = await (options.fetchImpl || fetch)(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': 'video/*',
        'X-Upload-Content-Length': stats.size.toString()
      },
      body: JSON.stringify(metadata)
    }
  );

  if (!initRes.ok) {
    const errText = await initRes.text();
    throw new Error(`Lỗi khởi tạo upload YouTube (${initRes.status}): ${errText}`);
  }

  const uploadLocation = initRes.headers.get('location');
  if (!uploadLocation) throw new Error('Không nhận được upload location từ YouTube API.');

  const videoStream = fs.createReadStream(videoPath);
  const uploadRes = await (options.fetchImpl || fetch)(uploadLocation, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/*',
      'Content-Length': stats.size.toString()
    },
    body: videoStream,
    duplex: 'half'
  });

  const ytJson = await uploadRes.json();
  if (!ytJson || !ytJson.id) {
    throw new Error(`Tải video thất bại: ${JSON.stringify(ytJson)}`);
  }

  const videoId = ytJson.id;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  saveCheckpoint(inboxDir, {
    manifestHash: calculateFileHash(path.join(inboxDir, 'manifest.json')),
    videoFile: manifest.videoFile,
    videoId: videoId,
    youtubeUrl: youtubeUrl,
    uploadStatus: 'UPLOADED_PRIVATE',
    privacyStatus: 'private',
    uploadedAt: new Date().toISOString()
  });

  console.log(`[YouTube] Tải video PRIVATE thành công! Video ID: ${videoId}`);
  return { videoId, youtubeUrl, isResumed: false };
}

/**
 * Tạo bài học DRAFT trên hệ thống
 */
export async function createDraftLessonOnBackend(inboxDir, manifest, videoResult, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const dbUrl = options.dbUrl || DEFAULT_DB_URL;

  const checkpoint = loadCheckpoint(inboxDir) || {};
  if (checkpoint.lessonStatus === 'DRAFT_SAVED' && !options.force) {
    console.log(`[Backend] Bài học nháp đã được tạo trước đó trên hệ thống. Bỏ qua ghi.`);
    return { ok: true, isResumed: true };
  }

  console.log(`[Backend] Đang tạo bài học DRAFT: "${manifest.lessonName}"...`);
  const payload = {
    action: 'savebaihoc',
    KhoaHoc: manifest.course,
    Chuong: manifest.chapter,
    TenBai: manifest.lessonName,
    Video: videoResult.youtubeUrl,
    MoTaBai: manifest.description,
    PDF: manifest.pdfUrl || '',
    PDFLyThuyet: manifest.pdfTheoryUrl || '',
    PDFLuyenTap: manifest.pdfPracticeUrl || '',
    ThuTuBai: manifest.order || '',
    NgayDang: new Date().toISOString()
  };

  const ok = await postAdminWriteCore(fetchImpl, dbUrl, payload);
  if (!ok) {
    throw new Error(`Tạo bài học DRAFT trên server thất bại. Server không xác nhận ghi JSON ok: true.`);
  }

  checkpoint.lessonStatus = 'DRAFT_SAVED';
  checkpoint.savedAt = new Date().toISOString();
  checkpoint.lessonPayload = payload;
  saveCheckpoint(inboxDir, checkpoint);

  console.log(`[Backend] ✅ Tạo bài học DRAFT thành công!`);
  return { ok: true, isResumed: false };
}

/**
 * Chạy toàn bộ quy trình: Inbox -> YouTube Private -> Bài học DRAFT
 */
export async function runPipeline(inboxDir, options = {}) {
  console.log(`\n======================================================`);
  console.log(`🚀 BẮT ĐẦU QUY TRÌNH VIDEO → YOUTUBE PRIVATE → BÀI HỌC DRAFT`);
  console.log(`📁 Thư mục Inbox: ${inboxDir}`);
  console.log(`======================================================\n`);

  // Bước 1: Đọc và xác thực Manifest
  console.log(`[1/3] Đang đọc thông tin bài học từ manifest.json...`);
  const manifest = readLessonManifest(inboxDir);
  console.log(`      ✓ Khóa: ${manifest.course}`);
  console.log(`      ✓ Chương: ${manifest.chapter}`);
  console.log(`      ✓ Tiêu đề: ${manifest.lessonName}`);

  // Bước 2: Upload Video YouTube Private
  console.log(`\n[2/3] Xử lý Video YouTube Private...`);
  const videoResult = await uploadVideoToYouTube(inboxDir, manifest, options);

  // Bước 3: Tạo bài học DRAFT trên Backend
  console.log(`\n[3/3] Tạo bài học DRAFT trên hệ thống...`);
  const backendResult = await createDraftLessonOnBackend(inboxDir, manifest, videoResult, options);

  console.log(`\n======================================================`);
  console.log(`🎉 HOÀN TẤT TOÀN BỘ QUY TRÌNH!`);
  console.log(`   - Video URL (Private): ${videoResult.youtubeUrl}`);
  console.log(`   - Bài học DRAFT: ${manifest.lessonName}`);
  console.log(`   - Checkpoint đã lưu tại: ${path.join(inboxDir, '.checkpoint.json')}`);
  console.log(`======================================================\n`);

  return {
    success: true,
    manifest,
    videoResult,
    backendResult
  };
}

// Cho phép chạy trực tiếp từ dòng lệnh Node
import { fileURLToPath } from 'url';
const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (executedFilePath === currentFilePath) {
  const inboxDir = process.argv[2] || path.join(process.cwd(), 'inbox', 'sample-lesson');
  const isMock = process.argv.includes('--mock');
  const isForce = process.argv.includes('--force');

  runPipeline(inboxDir, { mock: isMock, force: isForce }).catch(err => {
    console.error(`\n❌ LỖI QUY TRÌNH:`, err.message);
    process.exit(1);
  });
}
