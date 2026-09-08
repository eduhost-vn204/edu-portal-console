/**
 * YouTube Private Video & Draft Lesson Pipeline (Pilot B10)
 * Hệ thống tự động: Nhận inbox -> Upload YouTube Private -> Drive PDF -> Bài học DRAFT trên hệ thống
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { postAdminWriteCore, attachAdminKeyCore } from './postAdminWrite.mjs';
import { compareRealB10Snapshot, REAL_B10_REQUIRED_FIELDS } from './verify_real_b10.mjs';
import {
  getTrialOAuthCredentials,
  refreshAccessToken,
  verifyTrialIdentity,
  uploadYouTubeVideoResumable,
  uploadYouTubeCaption,
  uploadDrivePdfWithHash
} from './google-oauth-trial-client.mjs';

export const DEFAULT_DB_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';
export const REAL_B10_LESSON_NAME = 'B10. PHƯƠNG TRÌNH TRẠNG THÁI KHÍ LÝ TƯỞNG';
export const PILOT_B10_LESSON_NAME = '[BẢN NHÁP THỬ NGHIỆM] B10 - QUY TRÌNH ĐĂNG BÀI TỰ ĐỘNG';

export const CHECKPOINT_STEPS = [
  'DISCOVERED',
  'VALIDATED',
  'INPUTS_VERIFIED',
  'PDF_EXPORTED',
  'TRANSCRIBED',
  'TIMESTAMPS_MATCHED',
  'DRIVE_UPLOADED',
  'YOUTUBE_UPLOADED',
  'YOUTUBE_PROCESSING_PENDING',
  'DRAFT_SAVED',
  'BACKEND_VERIFIED',
  'READY_MOCK_ONLY',
  'READY_FOR_TEACHER',
  'BACKEND_VERIFICATION_FAILED',
  'MANUAL_RECOVERY_REQUIRED',
  'INPUT_CHANGED_NEW_SESSION_REQUIRED',
  'OAUTH_ACTION_REQUIRED',
  'CONTRACT_BLOCKER_STUDENT_VISIBILITY'
];

/**
 * Chuẩn hóa giá trị để so sánh chuỗi/số an toàn (bỏ ký tự escape ', chuẩn hóa Unicode NFC, trim)
 */
export function canonicalizeVal(val) {
  if (val === null || val === undefined) return '';
  let str = String(val).trim();
  if (str.startsWith("'")) {
    str = str.substring(1).trim();
  }
  return str.normalize('NFC');
}

/**
 * Đối soát sâu toàn diện 10 trường của bài pilot giữa dữ liệu kỳ vọng và bản ghi trên backend
 */
export function comparePilotLessonFields(expected, actual) {
  const fieldsToCheck = [
    { key: 'KhoaHoc', expected: expected.KhoaHoc || expected.course },
    { key: 'Chuong', expected: expected.Chuong || expected.chapter },
    { key: 'TenBai', expected: expected.TenBai || expected.lessonName },
    { key: 'ThuTuBai', expected: Number(expected.ThuTuBai !== undefined ? expected.ThuTuBai : expected.order), isNumber: true },
    { key: 'MoTaBai', expected: expected.MoTaBai || expected.description || '' },
    { key: 'Video', expected: expected.Video || expected.theoryUrl },
    { key: 'VideoGiai', expected: expected.VideoGiai || expected.practiceUrl },
    { key: 'PDFLyThuyet', expected: expected.PDFLyThuyet || expected.theoryPdfUrl },
    { key: 'PDF', expected: expected.PDF || expected.appliedPdfUrl },
    { key: 'PDFLuyenTap', expected: expected.PDFLuyenTap || expected.practicePdfUrl }
  ];

  const diffs = [];
  for (const item of fieldsToCheck) {
    const actVal = actual ? actual[item.key] : undefined;
    if (item.isNumber) {
      const expNum = Number(item.expected);
      const actNum = Number(canonicalizeVal(actVal));
      if (isNaN(actNum) || expNum !== actNum) {
        diffs.push({ field: item.key, expected: expNum, actual: actVal });
      }
    } else {
      const expNorm = canonicalizeVal(item.expected);
      const actNorm = canonicalizeVal(actVal);
      if (expNorm !== actNorm) {
        diffs.push({ field: item.key, expected: expNorm, actual: actNorm });
      }
    }
  }

  return {
    ok: diffs.length === 0,
    diffCount: diffs.length,
    diffs
  };
}

/**
 * Đối soát sâu từng câu hỏi VideoCauHoi (thuTu, thoiGian, type, question, optA, optB, optC, optD, correct)
 */
export function compareVideoCauHoiList(expectedItems, actualRows) {
  const diffs = [];
  if (!Array.isArray(actualRows) || actualRows.length !== expectedItems.length) {
    return {
      ok: false,
      diffCount: 1,
      diffs: [{ field: 'count', expected: expectedItems.length, actual: actualRows?.length || 0 }]
    };
  }

  for (let i = 0; i < expectedItems.length; i++) {
    const exp = expectedItems[i];
    const act = actualRows[i];
    const itemNum = i + 1;

    // 1. thuTu
    const actThuTu = Number(canonicalizeVal(act.thuTu));
    if (actThuTu !== itemNum) {
      diffs.push({ index: i, field: `item[${itemNum}].thuTu`, expected: itemNum, actual: act.thuTu });
    }

    // 2. thoiGian vs t (hoặc timestamp)
    const expT = Number(exp.t !== undefined ? exp.t : exp.timestamp);
    const actT = Number(canonicalizeVal(act.thoiGian));
    if (isNaN(actT) || expT !== actT) {
      diffs.push({ index: i, field: `item[${itemNum}].thoiGian`, expected: expT, actual: act.thoiGian });
    }

    // 3. type
    const expType = canonicalizeVal(exp.type || 'mc');
    const actType = canonicalizeVal(act.type || 'mc');
    if (expType !== actType) {
      diffs.push({ index: i, field: `item[${itemNum}].type`, expected: expType, actual: act.type });
    }

    // 4. question vs q
    const expQ = canonicalizeVal(exp.q || exp.stem || exp.question);
    const actQ = canonicalizeVal(act.question);
    if (expQ !== actQ) {
      diffs.push({ index: i, field: `item[${itemNum}].question`, expected: expQ, actual: actQ });
    }

    // 5. optA, optB, optC, optD
    for (const opt of ['A', 'B', 'C', 'D']) {
      const expOpt = canonicalizeVal(exp[opt] || exp.options?.[opt]);
      const actOpt = canonicalizeVal(act[`opt${opt}`]);
      if (expOpt !== actOpt) {
        diffs.push({ index: i, field: `item[${itemNum}].opt${opt}`, expected: expOpt, actual: actOpt });
      }
    }

    // 6. correct vs ans / correct / answer
    const expAns = canonicalizeVal(exp.ans !== undefined ? exp.ans : (exp.correct !== undefined ? exp.correct : (exp.answer !== undefined ? exp.answer : ''))).toUpperCase();
    const actAns = canonicalizeVal(act.correct !== undefined ? act.correct : '').toUpperCase();
    if (!actAns || expAns !== actAns) {
      diffs.push({ index: i, field: `item[${itemNum}].correct`, expected: expAns || '(đáp án hợp lệ)', actual: actAns || '(rỗng)' });
    }
  }

  return {
    ok: diffs.length === 0,
    diffCount: diffs.length,
    diffs
  };
}

/**
 * Đối soát sâu từng câu hỏi BaiTapTracNghiem (thuTu, type, question, optA, optB, optC, optD, correct)
 */
export function compareBaiTapTracNghiemList(expectedItems, actualRows) {
  const diffs = [];
  if (!Array.isArray(actualRows) || actualRows.length !== expectedItems.length) {
    return {
      ok: false,
      diffCount: 1,
      diffs: [{ field: 'count', expected: expectedItems.length, actual: actualRows?.length || 0 }]
    };
  }

  for (let i = 0; i < expectedItems.length; i++) {
    const exp = expectedItems[i];
    const act = actualRows[i];
    const itemNum = i + 1;

    // 1. thuTu
    const actThuTu = Number(canonicalizeVal(act.thuTu));
    if (actThuTu !== itemNum) {
      diffs.push({ index: i, field: `item[${itemNum}].thuTu`, expected: itemNum, actual: act.thuTu });
    }

    // 2. type
    const expType = canonicalizeVal(exp.type || 'mc');
    const actType = canonicalizeVal(act.type || 'mc');
    if (expType !== actType) {
      diffs.push({ index: i, field: `item[${itemNum}].type`, expected: expType, actual: act.type });
    }

    // 3. question vs q
    const expQ = canonicalizeVal(exp.q || exp.stem || exp.question);
    const actQ = canonicalizeVal(act.question);
    if (expQ !== actQ) {
      diffs.push({ index: i, field: `item[${itemNum}].question`, expected: expQ, actual: actQ });
    }

    // 4. optA, optB, optC, optD
    for (const opt of ['A', 'B', 'C', 'D']) {
      const expOpt = canonicalizeVal(exp[opt] || exp.options?.[opt]);
      const actOpt = canonicalizeVal(act[`opt${opt}`]);
      if (expOpt !== actOpt) {
        diffs.push({ index: i, field: `item[${itemNum}].opt${opt}`, expected: expOpt, actual: actOpt });
      }
    }

    // 5. correct vs correct / ans / answer
    const expAns = canonicalizeVal(exp.correct !== undefined ? exp.correct : (exp.ans !== undefined ? exp.ans : (exp.answer !== undefined ? exp.answer : ''))).toUpperCase();
    const actAns = canonicalizeVal(act.correct !== undefined ? act.correct : '').toUpperCase();
    if (!actAns || expAns !== actAns) {
      diffs.push({ index: i, field: `item[${itemNum}].correct`, expected: expAns || '(đáp án hợp lệ)', actual: actAns || '(rỗng)' });
    }
  }

  return {
    ok: diffs.length === 0,
    diffCount: diffs.length,
    diffs
  };
}

/**
 * Tính hash SHA256 của file để kiểm tra toàn vẹn
 */
export function calculateFileHash(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Tính hash SHA256 của chuỗi payload JSON
 */
export function calculatePayloadHash(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

/**
 * Đọc và chuẩn hóa manifest với Khóa An Toàn bắt buộc
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

  // KHÓA AN TOÀN BẮT BUỘC: Không được sửa Bài 10 thật
  const rawTitle = (data.title || '').trim();
  const rawLessonName = (data.lessonName || rawTitle).trim();
  if (rawLessonName === REAL_B10_LESSON_NAME || rawTitle === REAL_B10_LESSON_NAME) {
    throw new Error(`VI PHẠM KHÓA AN TOÀN: Tiêu đề bài học trùng với Bài 10 thật ("${REAL_B10_LESSON_NAME}")! Pipeline pilot bị chặn.`);
  }

  // Phải có tiền tố nháp thử nghiệm
  const lessonName = rawLessonName.startsWith('[BẢN NHÁP THỬ NGHIỆM]')
    ? rawLessonName
    : `[BẢN NHÁP THỬ NGHIỆM] ${rawLessonName}`;

  return {
    title: rawTitle,
    lessonName: lessonName,
    course: (data.course || 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12').trim(),
    chapter: (data.chapter || 'CHƯƠNG 2 – KHÍ LÍ TƯỞNG').trim(),
    order: data.order !== undefined ? data.order : 999,
    description: data.description || '',
    videoTheoryFile: data.videoTheoryFile || 'Bài 10 lý thuyết.mp4',
    videoPracticeFile: data.videoPracticeFile || 'Luyện tập.mp4',
    pdfTheoryFile: data.pdfTheoryFile || 'Bai 10 - Phương trình trạng thái khí lý tưởng - Ban Lí thuyết.pdf',
    pdfAppliedFile: data.pdfAppliedFile || 'Bai 10 - Phương trình trạng thái khí lý tưởng - Bài tập áp dụng.pdf',
    pdfPracticeFile: data.pdfPracticeFile || 'Bai 10 - Phương trình trạng thái khí lý tưởng - Bài tập luyện tập.pdf',
    docxAppliedWedFile: data.docxAppliedWedFile || 'Bai 10 - Phương trình trạng thái khí lý tưởng - Bài tập áp dụng - wed.docx',
    docxPracticeWedFile: data.docxPracticeWedFile || 'Bai 10 - Phương trình trạng thái khí lý tưởng - Bài tập luyện tập - wed.docx',
    sourceDir: data.sourceDir || '',
    privacyStatus: data.privacyStatus || 'private',
    tags: Array.isArray(data.tags) ? data.tags : [],
    oauthProfile: data.oauthProfile || 'trial'
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
  let existing = {};
  if (fs.existsSync(cpPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(cpPath, 'utf8'));
    } catch {}
  }
  const merged = { ...existing, ...checkpointData, updatedAt: new Date().toISOString() };
  fs.writeFileSync(cpPath, JSON.stringify(merged, null, 2), 'utf8');
}

/**
 * Xác thực đầu vào & Quản lý SHA-256 Fingerprint (Blocker 4)
 */
export function verifyInputsAndFingerprint(inboxDir, manifest, options = {}) {
  const srcDir = manifest.sourceDir || inboxDir;
  const inputFiles = {
    videoTheory: path.join(srcDir, manifest.videoTheoryFile),
    videoPractice: path.join(srcDir, manifest.videoPracticeFile),
    pdfTheory: path.join(srcDir, manifest.pdfTheoryFile),
    pdfApplied: path.join(srcDir, manifest.pdfAppliedFile),
    pdfPractice: path.join(srcDir, manifest.pdfPracticeFile),
    docxApplied: path.join(srcDir, manifest.docxAppliedWedFile),
    docxPractice: path.join(srcDir, manifest.docxPracticeWedFile)
  };

  for (const [key, fpath] of Object.entries(inputFiles)) {
    if (!fs.existsSync(fpath)) {
      throw new Error(`THIẾU ĐẦU VÀO: Không tìm thấy file [${key}] tại đường dẫn: ${fpath}`);
    }
  }

  const currentHashes = {};
  for (const [key, fpath] of Object.entries(inputFiles)) {
    currentHashes[key] = calculateFileHash(fpath);
  }

  const checkpoint = loadCheckpoint(inboxDir) || {};
  if (checkpoint.inputFingerprint) {
    const prevHashes = checkpoint.inputFingerprint.hashes || {};
    for (const [key, curHash] of Object.entries(currentHashes)) {
      if (prevHashes[key] && prevHashes[key] !== curHash) {
        const errMsg = `INPUT_CHANGED_NEW_SESSION_REQUIRED: File đầu vào [${key}] đã bị thay đổi sau khi checkpoint được tạo! (Cũ: ${prevHashes[key]}, Mới: ${curHash}). Nghiêm cấm ghi đè hoặc dùng lại session/upload/backend cũ với --force. Bắt buộc phải tạo thư mục/session mới!`;
        const err = new Error(errMsg);
        err.code = 'INPUT_CHANGED_NEW_SESSION_REQUIRED';
        checkpoint.state = 'INPUT_CHANGED_NEW_SESSION_REQUIRED';
        checkpoint.inputMismatch = { key, prevHash: prevHashes[key], newHash: curHash };
        saveCheckpoint(inboxDir, checkpoint);
        throw err;
      }
    }
  }

  checkpoint.inputFingerprint = {
    hashes: currentHashes,
    verifiedAt: new Date().toISOString()
  };
  checkpoint.state = 'INPUTS_VERIFIED';
  saveCheckpoint(inboxDir, checkpoint);

  return currentHashes;
}

/**
 * Kiểm tra tính hợp lệ của danh sách câu hỏi và 20 mốc thời gian (Blocker 4)
 */
export function validateQuestionsAndTimestamps(rawApplied, rawPractice, timestamps, maxDuration = 3600) {
  if (!Array.isArray(rawApplied) || rawApplied.length !== 20) {
    throw new Error(`XÁC THỰC CÂU HỎI THẤT BẠI: Số câu hỏi Áp dụng là ${rawApplied?.length || 0}, yêu cầu đúng 20 câu!`);
  }
  if (!Array.isArray(rawPractice) || rawPractice.length !== 20) {
    throw new Error(`XÁC THỰC CÂU HỎI THẤT BẠI: Số câu hỏi Luyện tập là ${rawPractice?.length || 0}, yêu cầu đúng 20 câu!`);
  }

  const validAnswers = ['A', 'B', 'C', 'D'];
  for (let i = 0; i < 20; i++) {
    const qa = rawApplied[i];
    if (!qa.stem || !qa.stem.trim()) throw new Error(`Câu áp dụng ${i + 1} có nội dung stem rỗng!`);
    if (!qa.options || !qa.options.A || !qa.options.B || !qa.options.C || !qa.options.D) {
      throw new Error(`Câu áp dụng ${i + 1} thiếu một trong 4 phương án A, B, C, D!`);
    }
    if (!validAnswers.includes(qa.correct)) {
      throw new Error(`Câu áp dụng ${i + 1} có đáp án không hợp lệ: "${qa.correct}"!`);
    }

    const qp = rawPractice[i];
    if (!qp.stem || !qp.stem.trim()) throw new Error(`Câu luyện tập ${i + 1} có nội dung stem rỗng!`);
    if (!qp.options || !qp.options.A || !qp.options.B || !qp.options.C || !qp.options.D) {
      throw new Error(`Câu luyện tập ${i + 1} thiếu một trong 4 phương án A, B, C, D!`);
    }
    if (!validAnswers.includes(qp.correct)) {
      throw new Error(`Câu luyện tập ${i + 1} có đáp án không hợp lệ: "${qp.correct}"!`);
    }
  }

  if (!Array.isArray(timestamps) || timestamps.length !== 20) {
    throw new Error(`XÁC THỰC MỐC THỜI GIAN THẤT BẠI: Số mốc thời gian là ${timestamps?.length || 0}, yêu cầu đúng 20 mốc!`);
  }

  let lastT = -1;
  for (let i = 0; i < 20; i++) {
    const t = timestamps[i].timestamp;
    if (typeof t !== 'number' || isNaN(t) || t < 0) {
      throw new Error(`Mốc thời gian câu ${i + 1} không hợp lệ: ${t}`);
    }
    if (t > maxDuration) {
      throw new Error(`Mốc thời gian câu ${i + 1} (${t}s) vượt quá thời lượng video (${maxDuration}s)!`);
    }
    if (t <= lastT) {
      throw new Error(`VI PHẠM TÍNH ĐƠN ĐIỆU: Mốc thời gian câu ${i + 1} (${t}s) không lớn hơn mốc trước (${lastT}s)!`);
    }
    lastT = t;
  }

  return true;
}

/**
 * Upload 2 Video lên YouTube ở chế độ Private (hoặc Mock khi kiểm thử)
 */
export async function uploadTwoVideosToYouTube(inboxDir, manifest, options = {}) {
  const profile = options.oauthProfile || manifest.oauthProfile || process.env.OAUTH_PROFILE || 'trial';
  if (profile === 'production') {
    throw new Error(`VI PHẠM HÀNG RÀO AN TOÀN: Tuyệt đối cấm sử dụng OAuth Profile 'production' trong quá trình chạy Pilot!`);
  }

  const isMock = options.mock || process.env.MOCK_YOUTUBE === 'true' || process.env.MOCK_YOUTUBE === '1';
  const checkpoint = loadCheckpoint(inboxDir) || {};

  if (checkpoint.youtube && (checkpoint.youtube.status === 'UPLOADED_PRIVATE' || checkpoint.youtube.status === 'PROCESSING_PENDING')) {
    console.log('[YouTube] Hai video đã được tải lên trước đó. Bỏ qua upload.');
    return { ...checkpoint.youtube, isResumed: true };
  }

  console.log(`[YouTube] Tải 2 video lên YouTube (Profile: ${profile}, Chế độ: PRIVATE)...`);
  console.log(`          1. Video bài giảng: ${manifest.videoTheoryFile}`);
  console.log(`          2. Video chữa bài:  ${manifest.videoPracticeFile}`);

  if (isMock) {
    const hash1 = crypto.createHash('md5').update('theory_' + manifest.title).digest('hex').substring(0, 11);
    const hash2 = crypto.createHash('md5').update('practice_' + manifest.title).digest('hex').substring(0, 11);
    const result = {
      status: 'UPLOADED_PRIVATE',
      privacyStatus: 'private',
      oauthProfile: 'trial_mock',
      theoryVideoId: `mock_${hash1}`,
      theoryUrl: `https://www.youtube.com/watch?v=mock_${hash1}`,
      practiceVideoId: `mock_${hash2}`,
      practiceUrl: `https://www.youtube.com/watch?v=mock_${hash2}`,
      uploadedAt: new Date().toISOString(),
      isResumed: false
    };
    checkpoint.youtube = result;
    checkpoint.state = 'YOUTUBE_UPLOADED';
    saveCheckpoint(inboxDir, checkpoint);
    console.log('[YouTube] [MOCK] Tải 2 video thành công:');
    console.log(`          - Bài giảng: ${result.theoryUrl}`);
    console.log(`          - Chữa bài:  ${result.practiceUrl}`);
    return result;
  }

  // Chạy THẬT với OAuth Profile trial
  let credentials;
  try {
    credentials = getTrialOAuthCredentials(options);
  } catch (err) {
    checkpoint.state = 'OAUTH_ACTION_REQUIRED';
    saveCheckpoint(inboxDir, checkpoint);
    throw err;
  }

  let accessToken;
  try {
    accessToken = await refreshAccessToken(credentials, options);
  } catch (err) {
    checkpoint.state = 'OAUTH_ACTION_REQUIRED';
    saveCheckpoint(inboxDir, checkpoint);
    throw err;
  }

  // Bắt buộc xác minh danh tính tài khoản trial trước khi upload
  let identity;
  try {
    identity = await verifyTrialIdentity(credentials, accessToken, options);
  } catch (err) {
    checkpoint.state = err.code || 'OAUTH_ACTION_REQUIRED';
    saveCheckpoint(inboxDir, checkpoint);
    throw err;
  }

  const srcDir = manifest.sourceDir ? path.resolve(manifest.sourceDir) : inboxDir;
  const theoryVideoPath = path.join(srcDir, manifest.videoTheoryFile);
  const practiceVideoPath = path.join(srcDir, manifest.videoPracticeFile);

  // 1. Upload Video 1 (Bài giảng lí thuyết) - Checkpoint độc lập
  let theoryRes = null;
  if (checkpoint.youtubeTheory && (checkpoint.youtubeTheory.status === 'UPLOADED_PRIVATE' || checkpoint.youtubeTheory.videoId)) {
    console.log(`[YouTube] Video bài giảng đã tải lên trước đó (ID: ${checkpoint.youtubeTheory.videoId}). Tái sử dụng.`);
    theoryRes = checkpoint.youtubeTheory;
  } else {
    console.log(`[YouTube] Bắt đầu resumable upload video 1: Bài giảng...`);
    theoryRes = await uploadYouTubeVideoResumable(
      theoryVideoPath,
      {
        title: `${manifest.lessonName} - Phần 1: Bài giảng lí thuyết`,
        description: manifest.description || 'Bài học Vật Lý 12 Pilot',
        tags: manifest.tags || ['Vật Lý 12', 'Pilot']
      },
      accessToken,
      {
        ...options,
        existingCheckpoint: checkpoint.youtubeTheory,
        onProgress: async (prog) => {
          checkpoint.youtubeTheory = {
            status: prog.status,
            sessionUrl: prog.sessionUrl,
            bytesConfirmed: prog.bytesConfirmed,
            fileSize: prog.fileSize,
            fileHash: prog.fileHash,
            videoId: prog.videoId || checkpoint.youtubeTheory?.videoId,
            channelId: identity.youtubeChannelId,
            updatedAt: new Date().toISOString()
          };
          checkpoint.state = 'YOUTUBE_THEORY_UPLOADING';
          saveCheckpoint(inboxDir, checkpoint);
        }
      }
    );

    checkpoint.youtubeTheory = {
      ...theoryRes,
      status: 'UPLOADED_PRIVATE',
      channelId: identity.youtubeChannelId,
      updatedAt: new Date().toISOString()
    };
    checkpoint.state = 'YOUTUBE_THEORY_UPLOADED';
    saveCheckpoint(inboxDir, checkpoint);
    console.log(`[YouTube] ✓ Video 1 (Bài giảng) đã checkpoint độc lập thành công (ID: ${theoryRes.videoId})`);
  }

  // 2. Upload Video 2 (Chữa bài tập) - Checkpoint độc lập sau khi Video 1 hoàn tất
  let practiceRes = null;
  if (checkpoint.youtubePractice && (checkpoint.youtubePractice.status === 'UPLOADED_PRIVATE' || checkpoint.youtubePractice.videoId)) {
    console.log(`[YouTube] Video chữa bài đã tải lên trước đó (ID: ${checkpoint.youtubePractice.videoId}). Tái sử dụng.`);
    practiceRes = checkpoint.youtubePractice;
  } else {
    console.log(`[YouTube] Bắt đầu resumable upload video 2: Chữa bài tập...`);
    practiceRes = await uploadYouTubeVideoResumable(
      practiceVideoPath,
      {
        title: `${manifest.lessonName} - Phần 2: Chữa bài tập áp dụng & luyện tập`,
        description: manifest.description || 'Bài học Vật Lý 12 Pilot',
        tags: manifest.tags || ['Vật Lý 12', 'Pilot']
      },
      accessToken,
      {
        ...options,
        existingCheckpoint: checkpoint.youtubePractice,
        onProgress: async (prog) => {
          checkpoint.youtubePractice = {
            status: prog.status,
            sessionUrl: prog.sessionUrl,
            bytesConfirmed: prog.bytesConfirmed,
            fileSize: prog.fileSize,
            fileHash: prog.fileHash,
            videoId: prog.videoId || checkpoint.youtubePractice?.videoId,
            channelId: identity.youtubeChannelId,
            updatedAt: new Date().toISOString()
          };
          checkpoint.state = 'YOUTUBE_PRACTICE_UPLOADING';
          saveCheckpoint(inboxDir, checkpoint);
        }
      }
    );

    checkpoint.youtubePractice = {
      ...practiceRes,
      status: 'UPLOADED_PRIVATE',
      channelId: identity.youtubeChannelId,
      updatedAt: new Date().toISOString()
    };
    checkpoint.state = 'YOUTUBE_PRACTICE_UPLOADED';
    saveCheckpoint(inboxDir, checkpoint);
    console.log(`[YouTube] ✓ Video 2 (Chữa bài) đã checkpoint độc lập thành công (ID: ${practiceRes.videoId})`);
  }

  // 3. Upload phụ đề nếu cấu hình bật (lỗi phải ném dừng, không nuốt)
  const shouldUploadCaptions = Boolean(manifest.uploadCaptions || options.uploadCaptions);
  const srtPath = path.join(inboxDir, 'subtitles.srt');
  const vttPath = path.join(inboxDir, 'subtitles.vtt');
  let captionTheoryResult = null;

  if (shouldUploadCaptions) {
    const captionFile = fs.existsSync(srtPath) ? srtPath : (fs.existsSync(vttPath) ? vttPath : null);
    if (captionFile) {
      console.log(`[YouTube] Tải phụ đề lên video bài giảng (${path.basename(captionFile)})...`);
      try {
        captionTheoryResult = await uploadYouTubeCaption(theoryRes.videoId, captionFile, accessToken, options);
        console.log(`          ✓ Đã tải phụ đề thành công (ID: ${captionTheoryResult.captionId})`);
      } catch (e) {
        checkpoint.state = 'CAPTION_UPLOAD_FAILED';
        saveCheckpoint(inboxDir, checkpoint);
        throw e;
      }
    }
  }

  // 4. Kiểm tra trạng thái xử lý tổng thể
  const isProcessingPending = theoryRes.processingStatus === 'processing' || practiceRes.processingStatus === 'processing';
  const finalStatus = isProcessingPending ? 'PROCESSING_PENDING' : 'UPLOADED_PRIVATE';

  const result = {
    status: finalStatus,
    privacyStatus: 'private',
    oauthProfile: 'trial',
    channelId: identity.youtubeChannelId,
    theoryVideoId: theoryRes.videoId,
    theoryUrl: theoryRes.url,
    theoryFileHash: theoryRes.fileHash,
    theoryProcessingStatus: theoryRes.processingStatus,
    practiceVideoId: practiceRes.videoId,
    practiceUrl: practiceRes.url,
    practiceFileHash: practiceRes.fileHash,
    practiceProcessingStatus: practiceRes.processingStatus,
    caption: captionTheoryResult,
    uploadedAt: new Date().toISOString(),
    isResumed: false
  };

  checkpoint.youtube = result;
  checkpoint.state = isProcessingPending ? 'YOUTUBE_PROCESSING_PENDING' : 'YOUTUBE_UPLOADED';
  saveCheckpoint(inboxDir, checkpoint);

  console.log(`[YouTube] Tải 2 video lên kênh trial thành công (Trạng thái: ${finalStatus}):`);
  console.log(`          - Bài giảng: ${result.theoryUrl} [${result.theoryProcessingStatus}]`);
  console.log(`          - Chữa bài:  ${result.practiceUrl} [${result.practiceProcessingStatus}]`);

  return result;
}

/**
 * Upload 3 file PDF lên Google Drive (hoặc Mock khi kiểm thử)
 */
export async function uploadThreePdfsToDrive(inboxDir, manifest, options = {}) {
  const profile = options.oauthProfile || manifest.oauthProfile || process.env.OAUTH_PROFILE || 'trial';
  if (profile === 'production') {
    throw new Error(`VI PHẠM HÀNG RÀO AN TOÀN: Tuyệt đối cấm sử dụng OAuth Profile 'production' cho Drive trong quá trình chạy Pilot!`);
  }

  const isMock = options.mock || process.env.MOCK_DRIVE === 'true' || process.env.MOCK_DRIVE === '1';
  const checkpoint = loadCheckpoint(inboxDir) || {};

  if (checkpoint.drive && checkpoint.drive.status === 'UPLOADED_DRIVE') {
    console.log('[Drive] Ba file PDF đã được tải lên trước đó. Bỏ qua upload.');
    return { ...checkpoint.drive, isResumed: true };
  }

  console.log(`[Drive] Tải 3 file PDF lên Google Drive (Profile: ${profile})...`);
  console.log(`        1. PDF Lý thuyết:  ${manifest.pdfTheoryFile}`);
  console.log(`        2. PDF Áp dụng:    ${manifest.pdfAppliedFile}`);
  console.log(`        3. PDF Luyện tập:  ${manifest.pdfPracticeFile}`);

  if (isMock) {
    const h1 = crypto.createHash('md5').update('pdf_th_' + manifest.pdfTheoryFile).digest('hex').substring(0, 16);
    const h2 = crypto.createHash('md5').update('pdf_ap_' + manifest.pdfAppliedFile).digest('hex').substring(0, 16);
    const h3 = crypto.createHash('md5').update('pdf_pr_' + manifest.pdfPracticeFile).digest('hex').substring(0, 16);
    const result = {
      status: 'UPLOADED_DRIVE',
      oauthProfile: 'trial_mock',
      theoryPdfUrl: `https://drive.google.com/file/d/mock_${h1}/view`,
      appliedPdfUrl: `https://drive.google.com/file/d/mock_${h2}/view`,
      practicePdfUrl: `https://drive.google.com/file/d/mock_${h3}/view`,
      uploadedAt: new Date().toISOString(),
      isResumed: false
    };
    checkpoint.drive = result;
    checkpoint.state = 'DRIVE_UPLOADED';
    saveCheckpoint(inboxDir, checkpoint);
    console.log('[Drive] [MOCK] Tải 3 file PDF thành công:');
    console.log(`        - Lý thuyết:  ${result.theoryPdfUrl}`);
    console.log(`        - Áp dụng:    ${result.appliedPdfUrl}`);
    console.log(`        - Luyện tập:  ${result.practicePdfUrl}`);
    return result;
  }

  // Chạy THẬT với Drive Trial
  const folderId = options.driveFolderId || manifest.pilotDriveFolderId || process.env.EXPECTED_TRIAL_DRIVE_FOLDER_ID;
  if (!folderId) {
    const err = new Error(`OAUTH_ACTION_REQUIRED: Chưa có Google Drive pilot folder ID (EXPECTED_TRIAL_DRIVE_FOLDER_ID hoặc manifest.pilotDriveFolderId).`);
    err.code = 'OAUTH_ACTION_REQUIRED';
    checkpoint.state = 'OAUTH_ACTION_REQUIRED';
    saveCheckpoint(inboxDir, checkpoint);
    throw err;
  }

  let credentials;
  try {
    credentials = getTrialOAuthCredentials(options);
  } catch (err) {
    checkpoint.state = 'OAUTH_ACTION_REQUIRED';
    saveCheckpoint(inboxDir, checkpoint);
    throw err;
  }

  let accessToken;
  try {
    accessToken = await refreshAccessToken(credentials, options);
  } catch (err) {
    checkpoint.state = 'OAUTH_ACTION_REQUIRED';
    saveCheckpoint(inboxDir, checkpoint);
    throw err;
  }

  const srcDir = manifest.sourceDir ? path.resolve(manifest.sourceDir) : inboxDir;
  const thPath = path.join(srcDir, manifest.pdfTheoryFile);
  const apPath = path.join(srcDir, manifest.pdfAppliedFile);
  const prPath = path.join(srcDir, manifest.pdfPracticeFile);

  console.log(`[Drive] Đang tải/đối soát file 1: PDF Lí thuyết...`);
  const thRes = await uploadDrivePdfWithHash(thPath, folderId, accessToken, options);

  console.log(`[Drive] Đang tải/đối soát file 2: PDF Bài tập áp dụng...`);
  const apRes = await uploadDrivePdfWithHash(apPath, folderId, accessToken, options);

  console.log(`[Drive] Đang tải/đối soát file 3: PDF Bài tập luyện tập...`);
  const prRes = await uploadDrivePdfWithHash(prPath, folderId, accessToken, options);

  const result = {
    status: 'UPLOADED_DRIVE',
    oauthProfile: 'trial',
    driveFolderId: folderId,
    theoryPdfId: thRes.fileId,
    theoryPdfUrl: thRes.webViewLink,
    theoryPdfHash: thRes.sha256Hash,
    theoryPdfReused: thRes.isReused,
    appliedPdfId: apRes.fileId,
    appliedPdfUrl: apRes.webViewLink,
    appliedPdfHash: apRes.sha256Hash,
    appliedPdfReused: apRes.isReused,
    practicePdfId: prRes.fileId,
    practicePdfUrl: prRes.webViewLink,
    practicePdfHash: prRes.sha256Hash,
    practicePdfReused: prRes.isReused,
    uploadedAt: new Date().toISOString(),
    isResumed: false
  };

  checkpoint.drive = result;
  checkpoint.state = 'DRIVE_UPLOADED';
  saveCheckpoint(inboxDir, checkpoint);

  console.log('[Drive] Hoàn tất nạp 3 file PDF lên Google Drive pilot:');
  console.log(`        - Lý thuyết:  ${result.theoryPdfUrl} (Reused: ${result.theoryPdfReused})`);
  console.log(`        - Áp dụng:    ${result.appliedPdfUrl} (Reused: ${result.appliedPdfReused})`);
  console.log(`        - Luyện tập:  ${result.practicePdfUrl} (Reused: ${result.practicePdfReused})`);

  return result;
}

/**
 * Tạo bài học DRAFT và 2 nhóm câu hỏi trên hệ thống Backend với FSM 3 bước an toàn (Blocker 1)
 */
export async function createFullDraftLessonOnBackend(inboxDir, manifest, videoRes, driveRes, questionsApplied, questionsPractice, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const dbUrl = options.dbUrl || DEFAULT_DB_URL;
  const adminKey = options.adminKey || process.env.ADMIN_KEY || '';
  const checkpoint = loadCheckpoint(inboxDir) || {};
  const isMockBackend = Boolean(options.mockBackend || (options.mock && !adminKey));

  if (!checkpoint.backend) {
    checkpoint.backend = {};
  }

  // Khóa an toàn: Kiểm tra rủi ro hiển thị bài pilot cho học sinh khi gọi Live Production
  // Backend Google Apps Script hiện tại chưa có trường 'draft' hay 'hidden' trong bảng BaiHoc.
  const isCustomFetch = Boolean(options.fetchImpl && options.fetchImpl !== globalThis.fetch);
  const isProductionLive = !isMockBackend && !isCustomFetch;
  if (isProductionLive && !options.allowPublicPilotOnStudentPortal) {
    const err = new Error(
      `CONTRACT_BLOCKER_STUDENT_VISIBILITY: Bảng tính BaiHoc trong Google Apps Script (src/Mã.js COLS) chưa hỗ trợ cột 'draft' hoặc 'hidden'. Nếu ghi bài học pilot thật lên database, bài học sẽ xuất hiện công khai trên giao diện web học sinh (danhsach-ly12.html). Quy trình pilot dừng an toàn. Cần Thầy xác nhận thay đổi contract hoặc chọn khóa học riêng!`
    );
    err.code = 'CONTRACT_BLOCKER_STUDENT_VISIBILITY';
    checkpoint.state = 'CONTRACT_BLOCKER_STUDENT_VISIBILITY';
    saveCheckpoint(inboxDir, checkpoint);
    throw err;
  }

  // Khóa an toàn: Kiểm tra nếu toàn bộ 3 bước đã hoàn thành
  if (checkpoint.lessonStatus === 'DRAFT_SAVED' && !options.force) {
    console.log(`[Backend] Bài học DRAFT và 2 nhóm câu hỏi đã được ghi và xác minh hoàn tất trước đó. Bỏ qua ghi.`);
    return { ok: true, isResumed: true, checkpoint: checkpoint.backend };
  }

  // Trường hợp Mock Backend (chạy kiểm thử không có adminKey thật)
  if (isMockBackend) {
    console.log(`[Backend] [MOCK] Đang giả lập tạo bài học DRAFT & 20+20 câu hỏi qua 3 bước an toàn...`);
    const mockRecord = {
      manifest,
      lessonPayload: {
        action: 'savebaihoc',
        KhoaHoc: manifest.course,
        Chuong: manifest.chapter,
        TenBai: manifest.lessonName,
        Video: videoRes.theoryUrl,
        VideoGiai: videoRes.practiceUrl,
        PDFLyThuyet: driveRes.theoryPdfUrl,
        PDF: driveRes.appliedPdfUrl,
        PDFLuyenTap: driveRes.practicePdfUrl,
        ThuTuBai: manifest.order,
        MoTaBai: manifest.description,
        NgayDang: new Date().toISOString()
      },
      videoCauHoiCount: questionsApplied.length,
      baiTapTracNghiemCount: questionsPractice.length,
      savedAt: new Date().toISOString()
    };
    fs.writeFileSync(path.join(inboxDir, 'mock_backend_payload.json'), JSON.stringify(mockRecord, null, 2), 'utf8');

    checkpoint.backend = {
      lesson: { status: 'SAVED', payloadHash: calculatePayloadHash(mockRecord.lessonPayload), verified: true, isMock: true },
      videoCauHoi: { status: 'SAVED', count: questionsApplied.length, payloadHash: calculatePayloadHash(questionsApplied), verified: true, isMock: true },
      baiTapTracNghiem: { status: 'SAVED', count: questionsPractice.length, payloadHash: calculatePayloadHash(questionsPractice), verified: true, isMock: true }
    };
    checkpoint.lessonStatus = 'DRAFT_SAVED';
    checkpoint.state = 'DRAFT_SAVED';
    checkpoint.savedAt = new Date().toISOString();
    saveCheckpoint(inboxDir, checkpoint);
    console.log(`          ✓ [MOCK] Giả lập lưu bài DRAFT & 40 câu hỏi thành công!`);
    return { ok: true, isMock: true, isResumed: false };
  }

  // =========================================================================
  // BƯỚC 7.1: GHI BÀI HỌC DRAFT (savebaihoc) VỚI READ-BACK CHECK
  // =========================================================================
  const expectedLessonData = {
    KhoaHoc: manifest.course,
    Chuong: manifest.chapter,
    TenBai: manifest.lessonName,
    Video: videoRes.theoryUrl,
    VideoGiai: videoRes.practiceUrl,
    PDFLyThuyet: driveRes.theoryPdfUrl,
    PDF: driveRes.appliedPdfUrl,
    PDFLuyenTap: driveRes.practicePdfUrl,
    ThuTuBai: manifest.order,
    MoTaBai: manifest.description
  };
  const lessonPayload = {
    action: 'savebaihoc',
    ...expectedLessonData,
    NgayDang: new Date().toISOString()
  };
  const lessonPayloadHash = calculatePayloadHash(lessonPayload);

  let existingMaBai = '';
  let lessonNeedsWrite = true;

  if (checkpoint.backend?.lesson?.status === 'SAVED' && checkpoint.backend.lesson.verified && !options.force) {
    console.log(`[Backend] [1/3] Bài học DRAFT đã được xác minh trước đó trong checkpoint. Bỏ qua ghi.`);
    existingMaBai = checkpoint.backend.lesson.maBai || '';
    lessonNeedsWrite = false;
  } else {
    console.log(`[Backend] [1/3] Đang đối soát danh sách bài học hiện có trên backend...`);
    const checkRes = await fetchImpl(`${dbUrl}?type=baihoc&t=${Date.now()}`);
    const checkJson = await checkRes.json();
    const existingList = Array.isArray(checkJson.data) ? checkJson.data : (Array.isArray(checkJson) ? checkJson : []);
    const matchingLessons = existingList.filter(b => String(b.TenBai).trim() === manifest.lessonName);

    if (matchingLessons.length > 1) {
      const err = new Error(`MANUAL_RECOVERY_REQUIRED: Phát hiện ${matchingLessons.length} bản ghi trùng tiêu đề "${manifest.lessonName}" trên backend! Dừng quy trình fail-closed.`);
      err.code = 'MANUAL_RECOVERY_REQUIRED';
      checkpoint.state = 'MANUAL_RECOVERY_REQUIRED';
      saveCheckpoint(inboxDir, checkpoint);
      throw err;
    }

    if (matchingLessons.length === 1) {
      const found = matchingLessons[0];
      existingMaBai = found.MaBai || '';
      const lessonComp = comparePilotLessonFields(expectedLessonData, found);

      if (lessonComp.ok) {
        console.log(`          ✓ Bài học pilot đã tồn tại và khớp toàn bộ 10/10 trường trên backend! (MaBai: ${existingMaBai})`);
        lessonNeedsWrite = false;
        checkpoint.backend.lesson = {
          status: 'SAVED',
          maBai: existingMaBai,
          payloadHash: lessonPayloadHash,
          verified: true,
          method: 'READBACK_MATCH',
          verifiedAt: new Date().toISOString()
        };
        saveCheckpoint(inboxDir, checkpoint);
      } else {
        console.log(`          ⚠️ Bài học đã có mã [${existingMaBai}], nhưng có ${lessonComp.diffCount} trường chưa khớp (${lessonComp.diffs.map(d=>d.field).join(', ')}). Cập nhật ghi đè in-place an toàn...`);
        lessonPayload.maBai = existingMaBai;
        lessonPayload.originalKey = `${found.KhoaHoc}|||${found.Chuong}|||${found.TenBai}`;
      }
    }
  }

  if (lessonNeedsWrite) {
    console.log(`[Backend] [1/3] Đang gửi request savebaihoc lên backend...`);
    const signedLessonPayload = attachAdminKeyCore(lessonPayload, adminKey);
    const okLesson = await postAdminWriteCore(fetchImpl, dbUrl, signedLessonPayload);
    if (!okLesson) {
      console.warn(`          ⚠️ Request savebaihoc không nhận phản hồi HTTP 200, kiểm tra read-back ngay lập tức...`);
    }

    const verifyRes = await fetchImpl(`${dbUrl}?type=baihoc&t=${Date.now()}`);
    const verifyJson = await verifyRes.json();
    const listAfter = Array.isArray(verifyJson.data) ? verifyJson.data : (Array.isArray(verifyJson) ? verifyJson : []);
    const verifiedLesson = listAfter.find(b => String(b.TenBai).trim() === manifest.lessonName);

    if (!verifiedLesson) {
      const err = new Error(`Ghi bài học DRAFT thất bại: Backend không ghi nhận bài học sau request.`);
      err.code = 'BACKEND_WRITE_FAILED_STEP1';
      throw err;
    }

    const postLessonComp = comparePilotLessonFields(expectedLessonData, verifiedLesson);
    if (!postLessonComp.ok) {
      const err = new Error(`Ghi bài học DRAFT thất bại: Đối soát sâu phát hiện ${postLessonComp.diffCount} trường sai lệch (${postLessonComp.diffs.map(d=>d.field).join(', ')}).`);
      err.code = 'BACKEND_WRITE_FAILED_STEP1';
      err.diffs = postLessonComp.diffs;
      throw err;
    }

    existingMaBai = verifiedLesson.MaBai || '';
    checkpoint.backend.lesson = {
      status: 'SAVED',
      maBai: existingMaBai,
      payloadHash: lessonPayloadHash,
      verified: true,
      method: 'WRITE_AND_VERIFIED',
      verifiedAt: new Date().toISOString()
    };
    saveCheckpoint(inboxDir, checkpoint);
    console.log(`          ✓ Đã xác minh bài học DRAFT được lưu thành công và khớp 10/10 trường! (MaBai: ${existingMaBai})`);
  }

  // =========================================================================
  // BƯỚC 7.2: GHI 20 CÂU VIDEO CÂU HỎI (savevideocauhoi) VỚI READ-BACK CHECK
  // =========================================================================
  const vchPayloadHash = calculatePayloadHash(questionsApplied);
  let vchNeedsWrite = true;

  if (checkpoint.backend?.videoCauHoi?.status === 'SAVED' && checkpoint.backend.videoCauHoi.verified && !options.force) {
    console.log(`[Backend] [2/3] 20 câu VideoCauHoi đã được xác minh trước đó trong checkpoint. Bỏ qua ghi.`);
    vchNeedsWrite = false;
  } else {
    console.log(`[Backend] [2/3] Đang đối soát 20 câu VideoCauHoi trên backend...`);
    const resVchCheck = await fetchImpl(`${dbUrl}?type=videocauhoi&bai=${encodeURIComponent(manifest.lessonName)}&t=${Date.now()}`);
    const jsonVchCheck = await resVchCheck.json();
    const rowsVch = Array.isArray(jsonVchCheck.data) ? jsonVchCheck.data : [];

    const compVch = compareVideoCauHoiList(questionsApplied, rowsVch);
    if (compVch.ok) {
      console.log(`          ✓ 20 câu VideoCauHoi đã tồn tại và khớp toàn bộ 20/20 câu chi tiết trên backend!`);
      vchNeedsWrite = false;
      checkpoint.backend.videoCauHoi = {
        status: 'SAVED',
        count: 20,
        payloadHash: vchPayloadHash,
        verified: true,
        method: 'READBACK_MATCH',
        verifiedAt: new Date().toISOString()
      };
      saveCheckpoint(inboxDir, checkpoint);
    }
  }

  if (vchNeedsWrite) {
    console.log(`[Backend] [2/3] Đang gửi 20 câu VideoCauHoi lên backend (ghi đè an toàn theo baiKey)...`);
    const vchPayload = attachAdminKeyCore({
      action: 'savevideocauhoi',
      baiKey: manifest.lessonName,
      originalKey: manifest.lessonName,
      items: questionsApplied
    }, adminKey);

    await postAdminWriteCore(fetchImpl, dbUrl, vchPayload);

    const resVerifyVch = await fetchImpl(`${dbUrl}?type=videocauhoi&bai=${encodeURIComponent(manifest.lessonName)}&t=${Date.now()}`);
    const jsonVerifyVch = await resVerifyVch.json();
    const rowsAfter = Array.isArray(jsonVerifyVch.data) ? jsonVerifyVch.data : [];

    const postCompVch = compareVideoCauHoiList(questionsApplied, rowsAfter);
    if (!postCompVch.ok) {
      const err = new Error(`Ghi VideoCauHoi thất bại: Đối soát sâu phát hiện ${postCompVch.diffCount} điểm sai lệch (${postCompVch.diffs.slice(0, 3).map(d => `${d.field}: exp=${d.expected}, act=${d.actual}`).join('; ')}).`);
      err.code = 'BACKEND_WRITE_FAILED_STEP2';
      err.diffs = postCompVch.diffs;
      throw err;
    }

    checkpoint.backend.videoCauHoi = {
      status: 'SAVED',
      count: 20,
      payloadHash: vchPayloadHash,
      verified: true,
      method: 'WRITE_AND_VERIFIED',
      verifiedAt: new Date().toISOString()
    };
    saveCheckpoint(inboxDir, checkpoint);
    console.log(`          ✓ Đã xác minh nạp đủ 20 câu VideoCauHoi có mốc thành công (khớp 100% chi tiết)!`);
  }

  // =========================================================================
  // BƯỚC 7.3: GHI 20 CÂU BÀI TẬP TRẮC NGHIỆM (savebaitaptracnghiem) VỚI READ-BACK
  // =========================================================================
  const btPayloadHash = calculatePayloadHash(questionsPractice);
  let btNeedsWrite = true;

  if (checkpoint.backend?.baiTapTracNghiem?.status === 'SAVED' && checkpoint.backend.baiTapTracNghiem.verified && !options.force) {
    console.log(`[Backend] [3/3] 20 câu BaiTapTracNghiem đã được xác minh trước đó trong checkpoint. Bỏ qua ghi.`);
    btNeedsWrite = false;
  } else {
    console.log(`[Backend] [3/3] Đang đối soát 20 câu BaiTapTracNghiem trên backend...`);
    const resBtCheck = await fetchImpl(`${dbUrl}?type=baitaptracnghiem&bai=${encodeURIComponent(manifest.lessonName)}&t=${Date.now()}`);
    const jsonBtCheck = await resBtCheck.json();
    const rowsBt = Array.isArray(jsonBtCheck.data) ? jsonBtCheck.data : [];

    const compBt = compareBaiTapTracNghiemList(questionsPractice, rowsBt);
    if (compBt.ok) {
      console.log(`          ✓ 20 câu BaiTapTracNghiem đã tồn tại và khớp toàn bộ 20/20 câu chi tiết trên backend!`);
      btNeedsWrite = false;
      checkpoint.backend.baiTapTracNghiem = {
        status: 'SAVED',
        count: 20,
        payloadHash: btPayloadHash,
        verified: true,
        method: 'READBACK_MATCH',
        verifiedAt: new Date().toISOString()
      };
      saveCheckpoint(inboxDir, checkpoint);
    }
  }

  if (btNeedsWrite) {
    console.log(`[Backend] [3/3] Đang gửi 20 câu BaiTapTracNghiem lên backend (ghi đè an toàn theo baiKey)...`);
    const btPayload = attachAdminKeyCore({
      action: 'savebaitaptracnghiem',
      baiKey: manifest.lessonName,
      originalKey: manifest.lessonName,
      items: questionsPractice
    }, adminKey);

    await postAdminWriteCore(fetchImpl, dbUrl, btPayload);

    const resVerifyBt = await fetchImpl(`${dbUrl}?type=baitaptracnghiem&bai=${encodeURIComponent(manifest.lessonName)}&t=${Date.now()}`);
    const jsonVerifyBt = await resVerifyBt.json();
    const rowsBtAfter = Array.isArray(jsonVerifyBt.data) ? jsonVerifyBt.data : [];

    const postCompBt = compareBaiTapTracNghiemList(questionsPractice, rowsBtAfter);
    if (!postCompBt.ok) {
      const err = new Error(`Ghi BaiTapTracNghiem thất bại: Đối soát sâu phát hiện ${postCompBt.diffCount} điểm sai lệch (${postCompBt.diffs.slice(0, 3).map(d => `${d.field}: exp=${d.expected}, act=${d.actual}`).join('; ')}).`);
      err.code = 'BACKEND_WRITE_FAILED_STEP3';
      err.diffs = postCompBt.diffs;
      throw err;
    }

    checkpoint.backend.baiTapTracNghiem = {
      status: 'SAVED',
      count: 20,
      payloadHash: btPayloadHash,
      verified: true,
      method: 'WRITE_AND_VERIFIED',
      verifiedAt: new Date().toISOString()
    };
    saveCheckpoint(inboxDir, checkpoint);
    console.log(`          ✓ Đã xác minh nạp đủ 20 câu BaiTapTracNghiem thành công (khớp 100% chi tiết)!`);
  }

  // Toàn bộ 3 bước backend đã được xác minh chặt chẽ
  checkpoint.lessonStatus = 'DRAFT_SAVED';
  checkpoint.state = 'DRAFT_SAVED';
  checkpoint.savedAt = new Date().toISOString();
  saveCheckpoint(inboxDir, checkpoint);

  return { ok: true, isResumed: false, checkpoint: checkpoint.backend };
}

/**
 * Đọc lại Backend để đối soát sâu dữ liệu & Xác minh Bài 10 thật 14 trường (Blocker 3, 4)
 */
export async function verifyBackendReadBack(manifest, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const dbUrl = options.dbUrl || DEFAULT_DB_URL;
  const snapshotPath = options.snapshotPath || path.join(process.cwd(), 'inbox', 'b10-pilot', 'real_b10_snapshot_before.json');

  console.log(`[Verify] Bắt đầu đối soát sâu dữ liệu Backend...`);

  // 1. Đọc danh sách bài học
  const resBaiHoc = await fetchImpl(`${dbUrl}?type=baihoc&t=${Date.now()}`);
  const jsonBaiHoc = await resBaiHoc.json();
  const baiHocList = Array.isArray(jsonBaiHoc.data) ? jsonBaiHoc.data : (Array.isArray(jsonBaiHoc) ? jsonBaiHoc : []);

  // 1.1 Xác minh sâu toàn bộ 10 trường của bài pilot
  const pilotLesson = baiHocList.find(b => String(b.TenBai).trim() === manifest.lessonName);
  if (!pilotLesson) {
    throw new Error(`Đối soát thất bại: Không tìm thấy bài pilot [${manifest.lessonName}] trên backend!`);
  }
  if (!pilotLesson.TenBai.startsWith('[BẢN NHÁP THỬ NGHIỆM]')) {
    throw new Error(`Đối soát thất bại: Tiêu đề bài pilot thiếu tiền tố an toàn bắt buộc!`);
  }

  const expTheory = options.videoResult?.theoryUrl || options.theoryUrl;
  const expPractice = options.videoResult?.practiceUrl || options.practiceUrl;
  const expPdfTheory = options.driveResult?.theoryPdfUrl || options.theoryPdfUrl;
  const expPdfApp = options.driveResult?.appliedPdfUrl || options.appliedPdfUrl;
  const expPdfPrac = options.driveResult?.practicePdfUrl || options.practicePdfUrl;

  if (expTheory || expPractice || expPdfTheory || expPdfApp || expPdfPrac) {
    const expectedFields = {
      course: manifest.course,
      chapter: manifest.chapter,
      lessonName: manifest.lessonName,
      order: manifest.order,
      description: manifest.description,
      theoryUrl: expTheory,
      practiceUrl: expPractice,
      theoryPdfUrl: expPdfTheory,
      appliedPdfUrl: expPdfApp,
      practicePdfUrl: expPdfPrac
    };
    const compPilot = comparePilotLessonFields(expectedFields, pilotLesson);
    if (!compPilot.ok) {
      throw new Error(`Đối soát bài pilot thất bại: ${compPilot.diffCount} trường không khớp (${compPilot.diffs.map(d=>`${d.field}: exp=${d.expected}, act=${d.actual}`).join('; ')})!`);
    }
    console.log(`         ✓ Bài pilot khớp 10/10 trường chi tiết (Course, Chapter, Title, Order, Description, Video, VideoGiai, PDFLyThuyet, PDF, PDFLuyenTap)!`);
  } else {
    if (pilotLesson.ThuTuBai !== 999 && pilotLesson.ThuTuBai !== '999') {
      throw new Error(`Đối soát thất bại: Thứ tự bài pilot không phải 999 (Thực tế: ${pilotLesson.ThuTuBai})!`);
    }
    console.log(`         ✓ Tìm thấy bài pilot: ${pilotLesson.TenBai} (Thứ tự: ${pilotLesson.ThuTuBai})`);
    console.log(`           - Video:       ${pilotLesson.Video}`);
    console.log(`           - VideoGiai:   ${pilotLesson.VideoGiai}`);
    console.log(`           - PDFLyThuyet: ${pilotLesson.PDFLyThuyet}`);
  }

  // 1.2 KHÓA AN TOÀN BẮT BUỘC: Kiểm tra toàn diện 14 trường của Bài 10 thật
  if (fs.existsSync(snapshotPath)) {
    const beforeSnapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
    const realLesson = baiHocList.find(b => String(b.TenBai).trim() === REAL_B10_LESSON_NAME);
    if (!realLesson) {
      throw new Error(`VI PHẠM AN TOÀN NGHIÊM TRỌNG: Không tìm thấy Bài 10 thật ("${REAL_B10_LESSON_NAME}") trên backend!`);
    }
    const realB10Compare = compareRealB10Snapshot(beforeSnapshot, realLesson);
    if (!realB10Compare.ok) {
      throw new Error(`VI PHẠM AN TOÀN: Bài 10 thật bị sai lệch ${realB10Compare.diffCount}/${realB10Compare.totalFields} trường so với snapshot!`);
    }
    console.log(`         ✓ [BẢO VỆ AN TOÀN] Bài 10 thật: "${realLesson.TenBai}" NGUYÊN VẸN 100% (${realB10Compare.totalFields}/${realB10Compare.totalFields} trường khớp)!`);
  }

  // 2. Đọc và đối soát chi tiết 20 câu VideoCauHoi
  const resVCH = await fetchImpl(`${dbUrl}?type=videocauhoi&bai=${encodeURIComponent(manifest.lessonName)}&t=${Date.now()}`);
  const jsonVCH = await resVCH.json();
  const vchRows = Array.isArray(jsonVCH.data) ? jsonVCH.data : [];
  console.log(`         ✓ Đọc VideoCauHoi của bài pilot: ${vchRows.length} câu (yêu cầu đúng 20 câu).`);

  if (options.questionsApplied) {
    const compVch = compareVideoCauHoiList(options.questionsApplied, vchRows);
    if (!compVch.ok) {
      throw new Error(`Đối soát VideoCauHoi thất bại: ${compVch.diffCount} điểm sai lệch (${compVch.diffs.slice(0, 3).map(d => `${d.field}: exp=${d.expected}, act=${d.actual}`).join('; ')})!`);
    }
    console.log(`         ✓ 20/20 câu VideoCauHoi khớp chi tiết từng câu, thứ tự, timestamp, options và đáp án!`);
  } else if (vchRows.length !== 20) {
    throw new Error(`Đối soát VideoCauHoi thất bại: Số câu thực tế là ${vchRows.length}, yêu cầu đúng 20!`);
  }

  // 3. Đọc và đối soát chi tiết 20 câu BaiTapTracNghiem
  const resBT = await fetchImpl(`${dbUrl}?type=baitaptracnghiem&bai=${encodeURIComponent(manifest.lessonName)}&t=${Date.now()}`);
  const jsonBT = await resBT.json();
  const btRows = Array.isArray(jsonBT.data) ? jsonBT.data : [];
  console.log(`         ✓ Đọc BaiTapTracNghiem của bài pilot: ${btRows.length} câu (yêu cầu đúng 20 câu).`);

  if (options.questionsPractice) {
    const compBt = compareBaiTapTracNghiemList(options.questionsPractice, btRows);
    if (!compBt.ok) {
      throw new Error(`Đối soát BaiTapTracNghiem thất bại: ${compBt.diffCount} điểm sai lệch (${compBt.diffs.slice(0, 3).map(d => `${d.field}: exp=${d.expected}, act=${d.actual}`).join('; ')})!`);
    }
    console.log(`         ✓ 20/20 câu BaiTapTracNghiem khớp chi tiết từng câu, thứ tự, options và đáp án!`);
  } else if (btRows.length !== 20) {
    throw new Error(`Đối soát BaiTapTracNghiem thất bại: Số câu thực tế là ${btRows.length}, yêu cầu đúng 20!`);
  }

  return {
    verified: true,
    pilotLesson,
    realLessonUntouched: true,
    videoCauHoiCount: vchRows.length,
    baiTapCount: btRows.length
  };
}

/**
 * Chạy toàn bộ quy trình từ Pha A đến Pha D
 */
export async function runFullPipeline(inboxDir, options = {}) {
  console.log(`\n======================================================`);
  console.log(`🚀 XƯỞNG XUẤT BẢN BÀI HỌC TỰ ĐỘNG (AUTO-PUBLISH-LESSON-PILOT-B10)`);
  console.log(`📁 Thư mục Inbox: ${inboxDir}`);
  console.log(`======================================================\n`);

  // Bước 1: DISCOVER & VALIDATE
  console.log(`[Step 1/8] Đọc và xác thực thông tin bài học từ manifest.json...`);
  const manifest = readLessonManifest(inboxDir);
  const cp = loadCheckpoint(inboxDir) || {};
  cp.state = 'VALIDATED';
  saveCheckpoint(inboxDir, cp);
  console.log(`           ✓ Tiêu đề: ${manifest.lessonName}`);
  console.log(`           ✓ Khóa học: ${manifest.course} | Chương: ${manifest.chapter}`);

  // Bước 2: INPUT FINGERPRINTING & INTEGRITY CHECK (Blocker 4)
  console.log(`\n[Step 2/8] Kiểm tra tính toàn vẹn và tạo SHA-256 fingerprint cho toàn bộ đầu vào...`);
  verifyInputsAndFingerprint(inboxDir, manifest, options);
  console.log(`           ✓ Đã xác thực toàn vẹn 7 file đầu vào (2 video, 3 PDF, 2 Word wed)!`);

  // Bước 3: PDF QA & EXPORT
  console.log(`\n[Step 3/8] Kiểm tra chất lượng và xuất 3 file PDF...`);
  const pdfQaPath = path.join(inboxDir, 'pdf_qa_report.json');
  if (!fs.existsSync(pdfQaPath) || options.force) {
    const srcDir = manifest.sourceDir || inboxDir;
    execFileSync('py', ['-3.12', 'scripts/qa_pdf.py', inboxDir,
      path.join(srcDir, manifest.pdfTheoryFile),
      path.join(srcDir, manifest.pdfAppliedFile),
      path.join(srcDir, manifest.pdfPracticeFile)
    ], { stdio: 'inherit' });
  }
  const pdfQa = JSON.parse(fs.readFileSync(pdfQaPath, 'utf8'));
  cp.pdfQa = pdfQa;
  cp.state = 'PDF_EXPORTED';
  saveCheckpoint(inboxDir, cp);
  console.log(`           ✓ 3 file PDF đã đạt tiêu chuẩn QA!`);

  // Bước 4: TRANSCRIBE VIDEO BÀI GIẢNG
  console.log(`\n[Step 4/8] Nhận dạng âm thanh và phụ đề video bài giảng...`);
  const transcriptPath = path.join(inboxDir, 'transcript.json');
  if (!fs.existsSync(transcriptPath) || options.force) {
    const srcDir = manifest.sourceDir || inboxDir;
    execFileSync('py', ['-3.12', 'scripts/extract_transcribe.py',
      path.join(srcDir, manifest.videoTheoryFile),
      inboxDir, 'small'
    ], { stdio: 'inherit' });
  }
  cp.state = 'TRANSCRIBED';
  saveCheckpoint(inboxDir, cp);
  console.log(`           ✓ Đã có transcript.json, subtitles.srt, subtitles.vtt!`);

  // Bước 5: PARSE CÂU HỎI TỪ 2 FILE WED.DOCX
  console.log(`\n[Step 5/8] Phân tích 20+20 câu hỏi từ hai file Word web...`);
  const qAppliedRawPath = path.join(inboxDir, 'questions_applied_raw.json');
  const qPracticeRawPath = path.join(inboxDir, 'questions_practice_raw.json');
  const srcDir = manifest.sourceDir || inboxDir;
  if (!fs.existsSync(qAppliedRawPath) || options.force) {
    execFileSync('py', ['-3.12', 'scripts/parse_wed_docx.py',
      path.join(srcDir, manifest.docxAppliedWedFile),
      '--output', qAppliedRawPath
    ], { stdio: 'inherit' });
  }
  if (!fs.existsSync(qPracticeRawPath) || options.force) {
    execFileSync('py', ['-3.12', 'scripts/parse_wed_docx.py',
      path.join(srcDir, manifest.docxPracticeWedFile),
      '--output', qPracticeRawPath
    ], { stdio: 'inherit' });
  }
  const rawApplied = JSON.parse(fs.readFileSync(qAppliedRawPath, 'utf8'));
  const rawPractice = JSON.parse(fs.readFileSync(qPracticeRawPath, 'utf8'));
  console.log(`           ✓ Parse thành công ${rawApplied.length} câu áp dụng & ${rawPractice.length} câu luyện tập!`);

  // Bước 6: DÒ VÀ KHỚP 20 MỐC THỜI GIAN
  console.log(`\n[Step 6/8] Dò mốc thời gian tự động từ transcript...`);
  const tsReportJson = path.join(inboxDir, 'timestamps_report.json');
  const tsReportMd = path.join(inboxDir, 'timestamps_report.md');
  if (!fs.existsSync(tsReportJson) || options.force) {
    execFileSync('py', ['-3.12', 'scripts/match_timestamps.py',
      transcriptPath,
      path.join(srcDir, manifest.docxAppliedWedFile),
      tsReportJson, tsReportMd
    ], { stdio: 'inherit' });
  }
  const timestamps = JSON.parse(fs.readFileSync(tsReportJson, 'utf8'));

  // Xác thực chặt chẽ câu hỏi và mốc thời gian (Blocker 4)
  validateQuestionsAndTimestamps(rawApplied, rawPractice, timestamps);
  cp.timestamps = timestamps;
  cp.state = 'TIMESTAMPS_MATCHED';
  saveCheckpoint(inboxDir, cp);
  console.log(`           ✓ Dò đủ 20 mốc thời gian tăng dần nghiêm ngặt cho câu hỏi trong video!`);

  // Chuẩn bị payload câu hỏi backend
  const questionsAppliedForBackend = rawApplied.map((q, idx) => ({
    thuTu: idx + 1,
    t: timestamps[idx] ? timestamps[idx].timestamp : '',
    nhId: '',
    type: 'mc',
    q: q.stem,
    A: q.options.A || '',
    B: q.options.B || '',
    C: q.options.C || '',
    D: q.options.D || '',
    ans: q.correct
  }));

  const questionsPracticeForBackend = rawPractice.map((q, idx) => ({
    thuTu: idx + 1,
    type: 'mc',
    q: q.stem,
    A: q.options.A || '',
    B: q.options.B || '',
    C: q.options.C || '',
    D: q.options.D || '',
    correct: q.correct
  }));

  // Bước 7: UPLOAD YOUTUBE & DRIVE
  console.log(`\n[Step 7/8] Xử lý Video YouTube Private & PDF Drive...`);
  const videoResult = await uploadTwoVideosToYouTube(inboxDir, manifest, options);
  const driveResult = await uploadThreePdfsToDrive(inboxDir, manifest, options);

  // Ghi bài học DRAFT và 2 nhóm câu hỏi lên Backend (với FSM 3 bước)
  console.log(`\n          Ghi bài học DRAFT và 2 nhóm câu hỏi lên Backend...`);
  const draftResult = await createFullDraftLessonOnBackend(
    inboxDir, manifest, videoResult, driveResult,
    questionsAppliedForBackend, questionsPracticeForBackend, options
  );

  // Bước 8: ĐỐI SOÁT VÀ BẢO VỆ BÀI THẬT (Blocker 2: KHÔNG BAO GIỜ nuốt lỗi)
  console.log(`\n[Step 8/8] Kiểm tra đối soát sâu backend & xác minh Bài 10 thật...`);
  const finalCp = loadCheckpoint(inboxDir) || cp;
  const isMockBackend = Boolean(options.mockBackend || (options.mock && !options.adminKey && !process.env.ADMIN_KEY));
  let verifyResult = { verified: false };

  if (!isMockBackend) {
    try {
      verifyResult = await verifyBackendReadBack(manifest, {
        ...options,
        videoResult,
        driveResult,
        questionsApplied: questionsAppliedForBackend,
        questionsPractice: questionsPracticeForBackend
      });
      finalCp.state = 'BACKEND_VERIFIED';
      finalCp.verifiedAt = new Date().toISOString();
      saveCheckpoint(inboxDir, finalCp);
    } catch (err) {
      console.error(`\n❌ ĐỐI SOÁT BACKEND THẤT BẠI: ${err.message}`);
      finalCp.state = 'BACKEND_VERIFICATION_FAILED';
      finalCp.verificationError = err.message;
      finalCp.failedAt = new Date().toISOString();
      saveCheckpoint(inboxDir, finalCp);
      throw err;
    }
  } else {
    verifyResult = { verified: true, mock: true, realLessonUntouched: true };
    finalCp.state = 'BACKEND_VERIFIED';
    finalCp.verifiedAt = new Date().toISOString();
    saveCheckpoint(inboxDir, finalCp);
  }

  // Phân biệt trạng thái MOCK ONLY và READY THẬT (Blocker 2)
  const isAnyMock = Boolean(options.mock || options.mockBackend || (videoResult && String(videoResult.theoryVideoId).startsWith('mock_')));
  if (isAnyMock) {
    finalCp.state = 'READY_MOCK_ONLY';
    finalCp.readyAt = new Date().toISOString();
    saveCheckpoint(inboxDir, finalCp);

    console.log(`\n======================================================`);
    console.log(`🧪 HOÀN THÀNH QUY TRÌNH Ở CHẾ ĐỘ MOCK KIỂM THỬ!`);
    console.log(`   - Trạng thái Checkpoint: READY_MOCK_ONLY`);
    console.log(`   - Lưu ý quan trọng: Đây là bản chạy MOCK KIỂM THỬ CỤC BỘ.`);
    console.log(`     Tuyệt đối KHÔNG diễn giải là đã xuất bản thật lên YouTube/Drive/Backend.`);
    console.log(`   - Bài học pilot: ${manifest.lessonName}`);
    console.log(`   - Video bài giảng (Mock): ${videoResult.theoryUrl}`);
    console.log(`   - Video chữa bài  (Mock): ${videoResult.practiceUrl}`);
    console.log(`   - Báo cáo 20 mốc: ${tsReportMd}`);
    console.log(`======================================================\n`);
  } else {
    finalCp.state = 'READY_FOR_TEACHER';
    finalCp.readyAt = new Date().toISOString();
    saveCheckpoint(inboxDir, finalCp);

    console.log(`\n======================================================`);
    console.log(`🎉 HOÀN THÀNH TOÀN TRÌNH XUẤT BẢN BÀI HỌC (THẬT)!`);
    console.log(`   - Trạng thái Checkpoint: READY_FOR_TEACHER`);
    console.log(`   - Bài học pilot: ${manifest.lessonName}`);
    console.log(`   - Video bài giảng: ${videoResult.theoryUrl}`);
    console.log(`   - Video chữa bài:  ${videoResult.practiceUrl}`);
    console.log(`   - Báo cáo 20 mốc:  ${tsReportMd}`);
    console.log(`======================================================\n`);
  }

  return {
    success: true,
    manifest,
    videoResult,
    driveResult,
    timestamps,
    pdfQa,
    draftResult,
    verifyResult,
    finalState: finalCp.state
  };
}

// Backward compatibility
export const runPipeline = runFullPipeline;

// Cho phép chạy trực tiếp từ dòng lệnh Node
import { fileURLToPath } from 'url';
const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (executedFilePath === currentFilePath) {
  const inboxDir = process.argv[2] || path.join(process.cwd(), 'inbox', 'b10-pilot');
  const isMock = process.argv.includes('--mock');
  const isForce = process.argv.includes('--force');

  runFullPipeline(inboxDir, { mock: isMock, force: isForce }).catch(err => {
    console.error(`\n❌ LỖI QUY TRÌNH:`, err.message);
    process.exit(1);
  });
}
