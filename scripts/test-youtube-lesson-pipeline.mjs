import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  readLessonManifest,
  uploadTwoVideosToYouTube,
  uploadThreePdfsToDrive,
  createFullDraftLessonOnBackend,
  verifyBackendReadBack,
  runFullPipeline,
  loadCheckpoint,
  REAL_B10_LESSON_NAME,
  PILOT_B10_LESSON_NAME
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
  console.log(`🧪 KIỂM THỬ TOÀN DIỆN HỆ THỐNG: AUTO-PUBLISH-LESSON-PILOT-B10`);
  console.log(`======================================================\n`);

  const tmpDir = path.join(os.tmpdir(), `vlxt-pipeline-test-${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    // ── TEST 1: Xác thực đọc Manifest ──
    console.log(`Test 1: Kiểm tra đọc và chuẩn hóa manifest.json`);
    const validManifest = {
      title: 'B10 - QUY TRÌNH ĐĂNG BÀI TỰ ĐỘNG',
      course: 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12',
      chapter: 'CHƯƠNG 2 – KHÍ LÍ TƯỞNG',
      description: 'Mô tả bài học thử nghiệm',
      videoTheoryFile: 'Bài 10 lý thuyết.mp4',
      videoPracticeFile: 'Luyện tập.mp4',
      pdfTheoryFile: 'theory.pdf',
      pdfAppliedFile: 'applied.pdf',
      pdfPracticeFile: 'practice.pdf'
    };
    fs.writeFileSync(path.join(tmpDir, 'manifest.json'), JSON.stringify(validManifest), 'utf8');

    const parsed = readLessonManifest(tmpDir);
    assert(parsed.title === 'B10 - QUY TRÌNH ĐĂNG BÀI TỰ ĐỘNG', 'Title khớp chính xác');
    assert(parsed.lessonName === PILOT_B10_LESSON_NAME, 'Tự động thêm tiền tố [BẢN NHÁP THỬ NGHIỆM]');
    assert(parsed.course === 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12', 'Course khớp');

    // ── TEST 2: Khóa an toàn bắt buộc: Chặn ghi vào Bài 10 thật ──
    console.log(`\nTest 2: Khóa an toàn: Từ chối nếu tiêu đề trùng Bài 10 thật`);
    const dangerousManifest = {
      title: REAL_B10_LESSON_NAME,
      course: 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12',
      chapter: 'CHƯƠNG 2 – KHÍ LÍ TƯỞNG'
    };
    fs.writeFileSync(path.join(tmpDir, 'manifest.json'), JSON.stringify(dangerousManifest), 'utf8');
    let safetyTriggered = false;
    try {
      readLessonManifest(tmpDir);
    } catch (err) {
      if (err.message.includes('VI PHẠM KHÓA AN TOÀN')) {
        safetyTriggered = true;
      }
    }
    assert(safetyTriggered === true, 'Đã kích hoạt khóa an toàn và chặn thành công bản ghi trùng Bài 10 thật');
    // Khôi phục manifest hợp lệ
    fs.writeFileSync(path.join(tmpDir, 'manifest.json'), JSON.stringify(validManifest), 'utf8');

    // ── TEST 3: Upload 2 Video Mock & Checkpoint ──
    console.log(`\nTest 3: Tải 2 video YouTube Private (Mock Mode) & Lưu Checkpoint`);
    const videoRes1 = await uploadTwoVideosToYouTube(tmpDir, parsed, { mock: true });
    assert(videoRes1.theoryVideoId && videoRes1.theoryVideoId.startsWith('mock_'), 'Tạo theoryVideoId mock thành công');
    assert(videoRes1.practiceVideoId && videoRes1.practiceVideoId.startsWith('mock_'), 'Tạo practiceVideoId mock thành công');
    assert(videoRes1.isResumed === false, 'Lần chạy đầu tiên isResumed = false');

    const cp1 = loadCheckpoint(tmpDir);
    assert(cp1 && cp1.youtube && cp1.youtube.status === 'UPLOADED_PRIVATE', 'Checkpoint lưu trạng thái YouTube UPLOADED_PRIVATE');

    // ── TEST 4: Upload 3 PDF Mock lên Drive ──
    console.log(`\nTest 4: Tải 3 file PDF lên Google Drive (Mock Mode)`);
    const driveRes1 = await uploadThreePdfsToDrive(tmpDir, parsed, { mock: true });
    assert(driveRes1.theoryPdfUrl && driveRes1.theoryPdfUrl.includes('mock_'), 'Tạo theoryPdfUrl mock thành công');
    assert(driveRes1.appliedPdfUrl && driveRes1.appliedPdfUrl.includes('mock_'), 'Tạo appliedPdfUrl mock thành công');
    assert(driveRes1.practicePdfUrl && driveRes1.practicePdfUrl.includes('mock_'), 'Tạo practicePdfUrl mock thành công');

    // ── TEST 5: Idempotency (Không upload lại khi đã có checkpoint) ──
    console.log(`\nTest 5: Kiểm tra tính Idempotent (chạy lại không upload trùng)`);
    const videoRes2 = await uploadTwoVideosToYouTube(tmpDir, parsed, { mock: true });
    assert(videoRes2.theoryVideoId === videoRes1.theoryVideoId, 'Giữ nguyên theoryVideoId cũ');
    assert(videoRes2.isResumed === true, 'Phát hiện checkpoint và đánh dấu isResumed = true');

    const driveRes2 = await uploadThreePdfsToDrive(tmpDir, parsed, { mock: true });
    assert(driveRes2.theoryPdfUrl === driveRes1.theoryPdfUrl, 'Giữ nguyên theoryPdfUrl cũ');
    assert(driveRes2.isResumed === true, 'Phát hiện checkpoint Drive isResumed = true');

    // ── TEST 6: Tạo bài học DRAFT + VideoCauHoi + BaiTapTracNghiem với Mock Server ──
    console.log(`\nTest 6: Gửi bài học DRAFT & 2 nhóm câu hỏi lên backend với Mock Server`);
    const capturedPayloads = [];
    const inMemoryDb = {
      baihoc: [],
      videocauhoi: {},
      baitaptracnghiem: {}
    };

    const mockFetch = async (url, opts) => {
      if (opts && opts.body) {
        const body = JSON.parse(opts.body);
        capturedPayloads.push(body);
        if (body.action === 'getbaihocadmin') {
          return { ok: true, json: async () => ({ ok: true, data: inMemoryDb.baihoc }) };
        }
        if (body.action === 'getvideocauhoiadmin') {
          const baiKey = body.bai || body.baiKey;
          return { ok: true, json: async () => ({ ok: true, data: inMemoryDb.videocauhoi[baiKey] || [] }) };
        }
        if (body.action === 'getbaitaptracnghiemadmin') {
          const baiKey = body.bai || body.baiKey;
          return { ok: true, json: async () => ({ ok: true, data: inMemoryDb.baitaptracnghiem[baiKey] || [] }) };
        }
        if (body.action === 'savebaihoc') {
          inMemoryDb.baihoc.push({
            MaBai: body.maBai || 'Bmock123456',
            KhoaHoc: body.KhoaHoc,
            Chuong: body.Chuong,
            TenBai: body.TenBai,
            Video: body.Video,
            VideoGiai: body.VideoGiai,
            PDFLyThuyet: body.PDFLyThuyet,
            PDF: body.PDF,
            PDFLuyenTap: body.PDFLuyenTap,
            ThuTuBai: body.ThuTuBai,
            MoTaBai: body.MoTaBai || '',
            TrangThai: body.TrangThai || 'draft'
          });
          return { ok: true, json: async () => ({ ok: true }) };
        }
        if (body.action === 'savevideocauhoi') {
          inMemoryDb.videocauhoi[body.baiKey] = body.items.map((it, idx) => ({
            thuTu: idx + 1,
            thoiGian: it.t,
            type: it.type || 'mc',
            question: it.q,
            optA: it.A,
            optB: it.B,
            optC: it.C,
            optD: it.D,
            correct: (it.ans || it.correct || '').toUpperCase().trim()
          }));
          return { ok: true, json: async () => ({ ok: true, count: body.items.length }) };
        }
        if (body.action === 'savebaitaptracnghiem') {
          inMemoryDb.baitaptracnghiem[body.baiKey] = body.items.map((it, idx) => ({
            thuTu: idx + 1,
            type: it.type || 'mc',
            question: it.q,
            optA: it.A,
            optB: it.B,
            optC: it.C,
            optD: it.D,
            correct: (it.correct || it.ans || '').toUpperCase().trim()
          }));
          return { ok: true, json: async () => ({ ok: true, count: body.items.length }) };
        }
      }

      if (url.includes('type=baihoc')) {
        const list = inMemoryDb.baihoc.filter(b => (b.TrangThai || 'published') === 'published');
        return { ok: true, json: async () => ({ ok: true, data: list }) };
      }
      if (url.includes('type=videocauhoi')) {
        const match = url.match(/bai=([^&]+)/);
        const baiKey = match ? decodeURIComponent(match[1]) : '';
        const lesson = inMemoryDb.baihoc.find(b => b.MaBai === baiKey || b.TenBai === baiKey);
        if (lesson && (lesson.TrangThai || 'published') !== 'published') {
          return { ok: true, json: async () => ({ ok: true, data: [] }) };
        }
        return { ok: true, json: async () => ({ ok: true, data: inMemoryDb.videocauhoi[baiKey] || [] }) };
      }
      if (url.includes('type=baitaptracnghiem')) {
        const match = url.match(/bai=([^&]+)/);
        const baiKey = match ? decodeURIComponent(match[1]) : '';
        const lesson = inMemoryDb.baihoc.find(b => b.MaBai === baiKey || b.TenBai === baiKey);
        if (lesson && (lesson.TrangThai || 'published') !== 'published') {
          return { ok: true, json: async () => ({ ok: true, data: [] }) };
        }
        return { ok: true, json: async () => ({ ok: true, data: inMemoryDb.baitaptracnghiem[baiKey] || [] }) };
      }
      return { ok: true, json: async () => ({ ok: true, data: [] }) };
    };

    const mockAppliedQs = Array.from({ length: 20 }, (_, i) => ({
      thuTu: i + 1, t: (i + 1) * 60, nhId: '', type: 'mc', q: `Câu ${i + 1}`, A: 'A', B: 'B', C: 'C', D: 'D', ans: 'A'
    }));
    const mockPracticeQs = Array.from({ length: 20 }, (_, i) => ({
      thuTu: i + 1, type: 'mc', q: `Câu ${i + 1}`, A: 'A', B: 'B', C: 'C', D: 'D', correct: 'B'
    }));

    const backendRes1 = await createFullDraftLessonOnBackend(
      tmpDir, parsed, videoRes1, driveRes1, mockAppliedQs, mockPracticeQs,
      { fetchImpl: mockFetch, adminKey: 'test_admin_key' }
    );
    assert(backendRes1.ok === true, 'Tạo bài học DRAFT và 2 nhóm câu hỏi trả về ok: true');
    const writePayloads = capturedPayloads.filter(p => p.action && p.action.startsWith('save'));
    assert(writePayloads.length === 3, 'Backend nhận đúng 3 payloads (savebaihoc, savevideocauhoi, savebaitaptracnghiem)');
    assert(writePayloads[0].action === 'savebaihoc', 'Payload 1 là savebaihoc');
    assert(writePayloads[0].TenBai === PILOT_B10_LESSON_NAME, 'TenBai đúng khóa pilot');
    assert(writePayloads[0].Video === videoRes1.theoryUrl, 'Link Video bài giảng khớp');
    assert(writePayloads[0].VideoGiai === videoRes1.practiceUrl, 'Link VideoGiai chữa bài khớp');
    assert(writePayloads[0].PDFLyThuyet === driveRes1.theoryPdfUrl, 'Link PDFLyThuyet khớp');
    assert(writePayloads[0].adminKey === 'test_admin_key', 'Tự động gắn adminKey vào savebaihoc');

    assert(writePayloads[1].action === 'savevideocauhoi', 'Payload 2 là savevideocauhoi');
    assert(writePayloads[1].items.length === 20, 'Gán đúng 20 câu VideoCauHoi có mốc');
    assert(writePayloads[1].adminKey === 'test_admin_key', 'Tự động gắn adminKey vào savevideocauhoi');

    assert(writePayloads[2].action === 'savebaitaptracnghiem', 'Payload 3 là savebaitaptracnghiem');
    assert(writePayloads[2].items.length === 20, 'Gán đúng 20 câu BaiTapTracNghiem không mốc');
    assert(writePayloads[2].adminKey === 'test_admin_key', 'Tự động gắn adminKey vào savebaitaptracnghiem');

    // ── TEST 7: Resume bài học đã tạo ──
    console.log(`\nTest 7: Không tạo trùng bài học khi checkpoint đã hoàn tất`);
    let fetchCalled = false;
    const mockFetchNoCall = async () => {
      fetchCalled = true;
      return { ok: true, json: async () => ({ ok: true }) };
    };
    const backendRes2 = await createFullDraftLessonOnBackend(
      tmpDir, parsed, videoRes1, driveRes1, mockAppliedQs, mockPracticeQs,
      { fetchImpl: mockFetchNoCall }
    );
    assert(backendRes2.isResumed === true, 'Backend step đánh dấu isResumed = true');
    assert(fetchCalled === false, 'Không gọi network dư thừa khi đã lưu DRAFT');

    // ── TEST 8: Đối soát Backend (Read-Back) & Bảo vệ Bài 10 thật ──
    console.log(`\nTest 8: Đối soát Backend (Read-Back) & Bảo vệ Bài 10 thật`);
    const mockRealSnapshot = {
      MaBai: 'B10_REAL_MOCK',
      KhoaHoc: 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12',
      Chuong: 'CHƯƠNG 2 – KHÍ LÍ TƯỞNG',
      TenBai: REAL_B10_LESSON_NAME,
      Video: 'https://youtu.be/real-b10',
      VideoGiai: 'https://youtu.be/real-b10-giai',
      MoTaBai: 'Mô tả bài 10 thật',
      NgayDang: '2026-09-07T17:00:00.000Z',
      PDF: 'https://drive.google.com/real-pdf',
      PDFLyThuyet: 'https://drive.google.com/real-pdf-lt',
      PDFLuyenTap: 'https://drive.google.com/real-pdf-bt',
      BaiTap: '',
      ThoiGianLamBai: '',
      ThuTuBai: 3
    };
    const mockSnapshotPath = path.join(tmpDir, 'real_b10_snapshot_before.json');
    fs.writeFileSync(mockSnapshotPath, JSON.stringify(mockRealSnapshot, null, 2), 'utf8');

    const mockVerifiedVchRows = mockAppliedQs.map((q, idx) => ({
      thuTu: idx + 1,
      thoiGian: q.t,
      type: q.type || 'mc',
      question: q.q,
      optA: q.A,
      optB: q.B,
      optC: q.C,
      optD: q.D,
      correct: q.ans
    }));
    const mockVerifiedBtRows = mockPracticeQs.map((q, idx) => ({
      thuTu: idx + 1,
      type: q.type || 'mc',
      question: q.q,
      optA: q.A,
      optB: q.B,
      optC: q.C,
      optD: q.D,
      correct: q.correct
    }));

    const mockVerifyFetch = async (url, opts) => {
      if (opts && opts.body) {
        const body = JSON.parse(opts.body);
        if (body.action === 'getbaihocadmin') {
          return {
            ok: true,
            json: async () => ({
              ok: true,
              data: [
                { ...mockRealSnapshot },
                {
                  KhoaHoc: parsed.course,
                  Chuong: parsed.chapter,
                  TenBai: PILOT_B10_LESSON_NAME,
                  ThuTuBai: 999,
                  MoTaBai: parsed.description,
                  Video: videoRes1.theoryUrl,
                  VideoGiai: videoRes1.practiceUrl,
                  PDFLyThuyet: driveRes1.theoryPdfUrl,
                  PDF: driveRes1.appliedPdfUrl,
                  PDFLuyenTap: driveRes1.practicePdfUrl,
                  TrangThai: 'draft'
                }
              ]
            })
          };
        }
        if (body.action === 'getvideocauhoiadmin') {
          return { ok: true, json: async () => ({ ok: true, data: mockVerifiedVchRows }) };
        }
        if (body.action === 'getbaitaptracnghiemadmin') {
          return { ok: true, json: async () => ({ ok: true, data: mockVerifiedBtRows }) };
        }
      }

      if (url.includes('type=baihoc')) {
        return { ok: true, json: async () => ({ ok: true, data: [ { ...mockRealSnapshot } ] }) };
      }
      if (url.includes('type=videocauhoi') || url.includes('type=baitaptracnghiem')) {
        return { ok: true, json: async () => ({ ok: true, data: [] }) };
      }
      return { ok: true, json: async () => ({ ok: true, data: [] }) };
    };

    const verifyResult = await verifyBackendReadBack(parsed, {
      fetchImpl: mockVerifyFetch,
      snapshotPath: mockSnapshotPath,
      videoResult: videoRes1,
      driveResult: driveRes1,
      questionsApplied: mockAppliedQs,
      questionsPractice: mockPracticeQs
    });
    assert(verifyResult.verified === true, 'Read-back verification thành công 100%');
    assert(verifyResult.realLessonUntouched === true, 'Bài 10 thật được xác minh nguyên vẹn');
    assert(verifyResult.videoCauHoiCount === 20, 'Xác nhận đúng 20 câu VideoCauHoi');
    assert(verifyResult.baiTapCount === 20, 'Xác nhận đúng 20 câu BaiTapTracNghiem');

  } finally {
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
