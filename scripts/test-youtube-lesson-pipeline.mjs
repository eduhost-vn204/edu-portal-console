import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  readLessonManifest,
  uploadVideoToYouTube,
  createDraftLessonOnBackend,
  runPipeline,
  loadCheckpoint
} from './youtube-lesson-pipeline.mjs';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🧪 KIỂM THỬ HỆ THỐNG: VIDEO → YOUTUBE PRIVATE → BÀI HỌC DRAFT`);
  console.log(`======================================================\n`);

  const tmpDir = path.join(os.tmpdir(), `vlxt-pipeline-test-${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    // ── TEST 1: Xác thực đọc Manifest ──
    console.log(`Test 1: Kiểm tra đọc và chuẩn hóa manifest.json`);
    const validManifest = {
      title: 'B4. Khí Lý Tưởng',
      course: 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12',
      chapter: 'CHƯƠNG 1 – VẬT LÝ NHIỆT',
      description: 'Mô tả bài học',
      videoFile: 'video.mp4',
      pdfUrl: 'https://drive.google.com/test'
    };
    fs.writeFileSync(path.join(tmpDir, 'manifest.json'), JSON.stringify(validManifest), 'utf8');

    const parsed = readLessonManifest(tmpDir);
    assert(parsed.title === 'B4. Khí Lý Tưởng', 'Title khớp chính xác');
    assert(parsed.lessonName === '[DRAFT] B4. Khí Lý Tưởng', 'Tự động thêm tiền tố [DRAFT]');
    assert(parsed.course === 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12', 'Course khớp');

    // ── TEST 2: Upload Video Mock & Checkpoint ──
    console.log(`\nTest 2: Tải video YouTube Private (Mock Mode) & Lưu Checkpoint`);
    const videoRes1 = await uploadVideoToYouTube(tmpDir, parsed, { mock: true });
    assert(videoRes1.videoId && videoRes1.videoId.startsWith('mock_'), 'Tạo videoId mock thành công');
    assert(videoRes1.isResumed === false, 'Lần chạy đầu tiên isResumed = false');

    const cp1 = loadCheckpoint(tmpDir);
    assert(cp1 && cp1.uploadStatus === 'UPLOADED_PRIVATE', 'Lưu checkpoint uploadStatus = UPLOADED_PRIVATE');
    assert(cp1.videoId === videoRes1.videoId, 'Checkpoint lưu đúng videoId');

    // ── TEST 3: Idempotency (Không upload lại khi đã có checkpoint) ──
    console.log(`\nTest 3: Kiểm tra tính Idempotent (chạy lại không upload trùng)`);
    const videoRes2 = await uploadVideoToYouTube(tmpDir, parsed, { mock: true });
    assert(videoRes2.videoId === videoRes1.videoId, 'Giữ nguyên videoId cũ');
    assert(videoRes2.isResumed === true, 'Phát hiện checkpoint và đánh dấu isResumed = true');

    // ── TEST 4: Tạo bài học DRAFT với Mock Fetch ──
    console.log(`\nTest 4: Gửi bài học DRAFT lên backend với Mock Server`);
    let capturedPayload = null;
    const mockFetch = async (url, opts) => {
      capturedPayload = JSON.parse(opts.body);
      return {
        ok: true,
        json: async () => ({ ok: true, action: 'created' })
      };
    };

    const backendRes1 = await createDraftLessonOnBackend(tmpDir, parsed, videoRes1, { fetchImpl: mockFetch });
    assert(backendRes1.ok === true, 'Tạo bài học DRAFT trả về ok: true');
    assert(capturedPayload && capturedPayload.action === 'savebaihoc', 'Payload action = savebaihoc');
    assert(capturedPayload.TenBai === '[DRAFT] B4. Khí Lý Tưởng', 'TenBai có tiền tố [DRAFT]');
    assert(capturedPayload.Video === videoRes1.youtubeUrl, 'Gắn đúng link YouTube Private');

    const cp2 = loadCheckpoint(tmpDir);
    assert(cp2.lessonStatus === 'DRAFT_SAVED', 'Checkpoint cập nhật lessonStatus = DRAFT_SAVED');

    // ── TEST 5: Resume bài học đã tạo ──
    console.log(`\nTest 5: Không tạo trùng bài học khi checkpoint đã hoàn tất`);
    let fetchCalled = false;
    const mockFetchNoCall = async () => {
      fetchCalled = true;
      return { ok: true, json: async () => ({ ok: true }) };
    };
    const backendRes2 = await createDraftLessonOnBackend(tmpDir, parsed, videoRes1, { fetchImpl: mockFetchNoCall });
    assert(backendRes2.isResumed === true, 'Backend step đánh dấu isResumed = true');
    assert(fetchCalled === false, 'Không gọi network dư thừa khi đã lưu DRAFT');

    // ── TEST 6: Toàn bộ quy trình End-to-End ──
    console.log(`\nTest 6: Chạy toàn bộ pipeline trơn tru (runPipeline)`);
    const tmpDir2 = path.join(os.tmpdir(), `vlxt-pipeline-test2-${Date.now()}`);
    fs.mkdirSync(tmpDir2, { recursive: true });
    fs.writeFileSync(path.join(tmpDir2, 'manifest.json'), JSON.stringify(validManifest), 'utf8');

    const fullRunRes = await runPipeline(tmpDir2, { mock: true, fetchImpl: mockFetch });
    assert(fullRunRes.success === true, 'runPipeline trả về success = true');
    assert(fullRunRes.videoResult.videoId.startsWith('mock_'), 'Video ID hợp lệ');
    assert(fullRunRes.backendResult.ok === true, 'Backend DRAFT lesson được tạo');

  } finally {
    // Dọn dẹp thư mục tạm
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }

  console.log(`\n======================================================`);
  console.log(`📊 KẾT QUẢ KIỂM THỬ: ${passed} PASS / ${failed} FAIL`);
  console.log(`======================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('LỖI KIỂM THỬ:', err);
  process.exit(1);
});
