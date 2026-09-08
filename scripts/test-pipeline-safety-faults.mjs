/**
 * Bộ kiểm thử An toàn và Fault-Injection cho YouTube Lesson Pipeline (Pilot B10)
 * Kiểm tra chuyên sâu 4 Blockers theo yêu cầu QA của Codex:
 * - Blocker 1: FSM 3 bước, chống ghi trùng, fault-injection step 1/2/3, network drop & duplicate rows detection
 * - Blocker 2: Không gán READY_FOR_TEACHER khi verify fail; gán READY_MOCK_ONLY khi mock run
 * - Blocker 3: Mutation testing 14 trường đối soát Bài 10 thật
 * - Blocker 4: Fingerprint SHA-256 chống sửa file, xác thực 20+20 câu & 20 mốc, chặn OAuth production
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import assert from 'assert';

import {
  compareRealB10Snapshot,
  REAL_B10_REQUIRED_FIELDS
} from './verify_real_b10.mjs';

import {
  calculateFileHash,
  calculatePayloadHash,
  readLessonManifest,
  loadCheckpoint,
  saveCheckpoint,
  verifyInputsAndFingerprint,
  validateQuestionsAndTimestamps,
  uploadTwoVideosToYouTube,
  createFullDraftLessonOnBackend,
  verifyBackendReadBack,
  runFullPipeline,
  PILOT_B10_LESSON_NAME
} from './youtube-lesson-pipeline.mjs';

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`          ${err.message}`);
    throw err;
  }
}

async function itAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`          ${err.message}`);
    throw err;
  }
}

function createTempDir(prefix = 'pilot-test-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function cleanupTempDir(dir) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch {}
}

console.log(`\n======================================================`);
console.log(`🛡️ KIỂM THỬ AN TOÀN & FAULT-INJECTION CHUYÊN SÂU`);
console.log(`======================================================\n`);

// =========================================================================
// SUITE 1: MUTATION TESTING 14 TRƯỜNG BÀI 10 THẬT (Blocker 3)
// =========================================================================
console.log(`--- [SUITE 1] Mutation Testing 14 Trường Đối Soát Bài 10 Thật (Blocker 3) ---`);

const baseSnapshot = {
  MaBai: 'B10REAL123',
  KhoaHoc: 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12',
  Chuong: 'CHƯƠNG 2 – KHÍ LÍ TƯỞNG',
  TenBai: 'B10. PHƯƠNG TRÌNH TRẠNG THÁI KHÍ LÝ TƯỞNG',
  Video: 'https://www.youtube.com/watch?v=real_theory_b10',
  VideoGiai: 'https://www.youtube.com/watch?v=real_practice_b10',
  MoTaBai: 'Mô tả bài học vật lý 12 chuẩn',
  NgayDang: '2025-01-15T00:00:00.000Z',
  PDF: 'https://drive.google.com/file/d/real_pdf_app/view',
  PDFLyThuyet: 'https://drive.google.com/file/d/real_pdf_theory/view',
  PDFLuyenTap: 'https://drive.google.com/file/d/real_pdf_practice/view',
  BaiTap: 'Luyện tập phương trình trạng thái',
  ThoiGianLamBai: '45',
  ThuTuBai: 10
};

it('Snapshot gốc khớp 14/14 trường với chính nó', () => {
  const res = compareRealB10Snapshot(baseSnapshot, { ...baseSnapshot }, REAL_B10_REQUIRED_FIELDS);
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.totalFields, 14);
  assert.strictEqual(res.matchedCount, 14);
  assert.strictEqual(res.diffs.length, 0);
});

for (const field of REAL_B10_REQUIRED_FIELDS) {
  it(`Đột biến trường [${field}] phải làm compareRealB10Snapshot trả về ok: false`, () => {
    const mutated = { ...baseSnapshot };
    if (typeof mutated[field] === 'number') {
      mutated[field] = mutated[field] + 999;
    } else {
      mutated[field] = `${mutated[field]}_MUTATED_VALUE`;
    }

    const res = compareRealB10Snapshot(baseSnapshot, mutated, REAL_B10_REQUIRED_FIELDS);
    assert.strictEqual(res.ok, false, `Đột biến trường ${field} nhưng hàm không phát hiện lỗi!`);
    assert.strictEqual(res.diffs.length, 1, `Phải có đúng 1 trường sai lệch`);
    assert.strictEqual(res.diffs[0].field, field, `Trường sai lệch phải là ${field}`);
  });
}

it('Thiếu 1 trường bắt buộc trong đối tượng hiện tại cũng phải trả về ok: false', () => {
  const incomplete = { ...baseSnapshot };
  delete incomplete.PDFLyThuyet;
  const res = compareRealB10Snapshot(baseSnapshot, incomplete, REAL_B10_REQUIRED_FIELDS);
  assert.strictEqual(res.ok, false);
  assert.ok(res.diffs.some(m => m.field === 'PDFLyThuyet'));
});

// =========================================================================
// SUITE 2: TOÀN VẸN ĐẦU VÀO SHA-256 FINGERPRINT & VALIDATION (Blocker 4)
// =========================================================================
console.log(`\n--- [SUITE 2] Fingerprint SHA-256 & Xác Thực Dữ Liệu (Blocker 4) ---`);

function setupSampleInbox(inboxDir) {
  const manifest = {
    title: 'B10 - QUY TRÌNH ĐĂNG BÀI TỰ ĐỘNG',
    course: 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12',
    chapter: 'CHƯƠNG 2 – KHÍ LÍ TƯỞNG',
    videoTheoryFile: 'video_theory.mp4',
    videoPracticeFile: 'video_practice.mp4',
    pdfTheoryFile: 'theory.pdf',
    pdfAppliedFile: 'applied.pdf',
    pdfPracticeFile: 'practice.pdf',
    docxAppliedWedFile: 'applied_wed.docx',
    docxPracticeWedFile: 'practice_wed.docx',
    order: 999
  };
  fs.writeFileSync(path.join(inboxDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  // Tạo các file giả lập
  fs.writeFileSync(path.join(inboxDir, manifest.videoTheoryFile), 'mock theory video stream');
  fs.writeFileSync(path.join(inboxDir, manifest.videoPracticeFile), 'mock practice video stream');
  fs.writeFileSync(path.join(inboxDir, manifest.pdfTheoryFile), '%PDF-1.4 mock theory pdf content');
  fs.writeFileSync(path.join(inboxDir, manifest.pdfAppliedFile), '%PDF-1.4 mock applied pdf content');
  fs.writeFileSync(path.join(inboxDir, manifest.pdfPracticeFile), '%PDF-1.4 mock practice pdf content');
  fs.writeFileSync(path.join(inboxDir, manifest.docxAppliedWedFile), 'mock docx applied content');
  fs.writeFileSync(path.join(inboxDir, manifest.docxPracticeWedFile), 'mock docx practice content');

  return readLessonManifest(inboxDir);
}

it('Tạo fingerprint SHA-256 cho đủ 7 file đầu vào', () => {
  const tempDir = createTempDir('fingerprint-init-');
  try {
    const manifest = setupSampleInbox(tempDir);
    const hashes = verifyInputsAndFingerprint(tempDir, manifest);
    assert.strictEqual(Object.keys(hashes).length, 7);
    const cp = loadCheckpoint(tempDir);
    assert.strictEqual(cp.state, 'INPUTS_VERIFIED');
    assert.ok(cp.inputFingerprint.hashes.videoTheory);
  } finally {
    cleanupTempDir(tempDir);
  }
});

it('Phát hiện sửa đổi nội dung file đầu vào và chặn pipeline fail-closed', () => {
  const tempDir = createTempDir('fingerprint-tamper-');
  try {
    const manifest = setupSampleInbox(tempDir);
    verifyInputsAndFingerprint(tempDir, manifest);

    // Cố tình sửa 1 file
    fs.writeFileSync(path.join(tempDir, manifest.docxPracticeWedFile), 'tampered content modified by attacker');

    let threw = false;
    try {
      verifyInputsAndFingerprint(tempDir, manifest);
    } catch (err) {
      threw = true;
      assert.ok(err.message.includes('PHÁT HIỆN THAY ĐỔI ĐẦU VÀO'));
      assert.ok(err.message.includes('docxPractice'));
    }
    assert.strictEqual(threw, true, 'Hàm phải throw error khi phát hiện file bị thay đổi hash');
  } finally {
    cleanupTempDir(tempDir);
  }
});

it('Cờ --force cho phép ghi nhận fingerprint mới khi file thay đổi', () => {
  const tempDir = createTempDir('fingerprint-force-');
  try {
    const manifest = setupSampleInbox(tempDir);
    verifyInputsAndFingerprint(tempDir, manifest);

    fs.writeFileSync(path.join(tempDir, manifest.docxPracticeWedFile), 'new valid content');
    const newHashes = verifyInputsAndFingerprint(tempDir, manifest, { force: true });
    assert.ok(newHashes.docxPractice);
  } finally {
    cleanupTempDir(tempDir);
  }
});

function createSampleQuestions(count = 20) {
  const questions = [];
  for (let i = 1; i <= count; i++) {
    questions.push({
      stem: `Nội dung câu hỏi số ${i}?`,
      options: { A: `Phương án A ${i}`, B: `Phương án B ${i}`, C: `Phương án C ${i}`, D: `Phương án D ${i}` },
      correct: ['A', 'B', 'C', 'D'][i % 4]
    });
  }
  return questions;
}

function createSampleTimestamps(count = 20) {
  const timestamps = [];
  for (let i = 1; i <= count; i++) {
    timestamps.push({
      questionIndex: i,
      timestamp: i * 60 // 60, 120, 180...
    });
  }
  return timestamps;
}

it('validateQuestionsAndTimestamps: Pass với 20+20 câu chuẩn và 20 mốc tăng dần', () => {
  const qApp = createSampleQuestions(20);
  const qPrac = createSampleQuestions(20);
  const ts = createSampleTimestamps(20);
  const ok = validateQuestionsAndTimestamps(qApp, qPrac, ts, 3600);
  assert.strictEqual(ok, true);
});

it('validateQuestionsAndTimestamps: Từ chối nếu mốc thời gian không đơn điệu (non-monotonic)', () => {
  const qApp = createSampleQuestions(20);
  const qPrac = createSampleQuestions(20);
  const ts = createSampleTimestamps(20);
  ts[5].timestamp = ts[4].timestamp - 10; // Không tăng dần

  let threw = false;
  try {
    validateQuestionsAndTimestamps(qApp, qPrac, ts, 3600);
  } catch (err) {
    threw = true;
    assert.ok(err.message.includes('VI PHẠM TÍNH ĐƠN ĐIỆU'));
  }
  assert.strictEqual(threw, true);
});

it('validateQuestionsAndTimestamps: Từ chối nếu mốc thời gian vượt thời lượng video', () => {
  const qApp = createSampleQuestions(20);
  const qPrac = createSampleQuestions(20);
  const ts = createSampleTimestamps(20);
  ts[19].timestamp = 5000; // Vượt quá maxDuration = 3600s

  let threw = false;
  try {
    validateQuestionsAndTimestamps(qApp, qPrac, ts, 3600);
  } catch (err) {
    threw = true;
    assert.ok(err.message.includes('vượt quá thời lượng video'));
  }
  assert.strictEqual(threw, true);
});

it('validateQuestionsAndTimestamps: Từ chối nếu thiếu câu hoặc đáp án sai', () => {
  const qApp = createSampleQuestions(19); // Chỉ có 19 câu
  const qPrac = createSampleQuestions(20);
  const ts = createSampleTimestamps(20);

  let threw = false;
  try {
    validateQuestionsAndTimestamps(qApp, qPrac, ts, 3600);
  } catch (err) {
    threw = true;
    assert.ok(err.message.includes('yêu cầu đúng 20 câu'));
  }
  assert.strictEqual(threw, true);

  const qApp2 = createSampleQuestions(20);
  qApp2[0].correct = 'X'; // Không phải A/B/C/D
  threw = false;
  try {
    validateQuestionsAndTimestamps(qApp2, qPrac, ts, 3600);
  } catch (err) {
    threw = true;
    assert.ok(err.message.includes('đáp án không hợp lệ'));
  }
  assert.strictEqual(threw, true);
});

it('Khóa an toàn OAuth: Cấm cứng OAuth profile "production" trong Pilot', async () => {
  const tempDir = createTempDir('oauth-guard-');
  try {
    const manifest = setupSampleInbox(tempDir);
    let threw = false;
    try {
      await uploadTwoVideosToYouTube(tempDir, manifest, { oauthProfile: 'production' });
    } catch (err) {
      threw = true;
      assert.ok(err.message.includes('VI PHẠM HÀNG RÀO AN TOÀN'));
      assert.ok(err.message.includes('production'));
    }
    assert.strictEqual(threw, true);
  } finally {
    cleanupTempDir(tempDir);
  }
});

// =========================================================================
// SUITE 3: FSM 3 BƯỚC & FAULT INJECTION (Blocker 1)
// =========================================================================
console.log(`\n--- [SUITE 3] FSM 3 Bước & Fault Injection Backend Writes (Blocker 1) ---`);

function createMockBackendState() {
  return {
    lessons: [],
    videoCauHoi: [],
    baiTapTracNghiem: [],
    calls: []
  };
}

function createFaultInjectionFetch(state, failurePlan = {}) {
  return async function mockFetch(url, options = {}) {
    state.calls.push({ url, options });

    if (failurePlan.isDown) {
      throw new Error(`Simulated Network Connection Reset (offline)`);
    }

    if (!options.method || options.method === 'GET') {
      const parsedUrl = new URL(url);
      const type = parsedUrl.searchParams.get('type');
      const bai = parsedUrl.searchParams.get('bai');

      if (type === 'baihoc') {
        return {
          ok: true,
          status: 200,
          json: async () => ({ status: 'success', data: state.lessons })
        };
      }
      if (type === 'videocauhoi') {
        const filtered = state.videoCauHoi.filter(q => q.baiKey === bai);
        return {
          ok: true,
          status: 200,
          json: async () => ({ status: 'success', data: filtered })
        };
      }
      if (type === 'baitaptracnghiem') {
        const filtered = state.baiTapTracNghiem.filter(q => q.baiKey === bai);
        return {
          ok: true,
          status: 200,
          json: async () => ({ status: 'success', data: filtered })
        };
      }
      return { ok: true, status: 200, json: async () => ({ status: 'success', data: [] }) };
    }

    // POST
    const body = JSON.parse(options.body || '{}');
    const action = body.action;

    if (failurePlan.failAction === action) {
      if (failurePlan.mode === 'NETWORK_DROP_AFTER_WRITE') {
        failurePlan.isDown = true;
        // Server thực sự đã ghi vào state, nhưng ném lỗi mạng về client
        if (action === 'savebaihoc') {
          state.lessons.push({
            MaBai: 'B10PILOT_RECOVERED',
            KhoaHoc: body.KhoaHoc,
            Chuong: body.Chuong,
            TenBai: body.TenBai,
            Video: body.Video,
            VideoGiai: body.VideoGiai,
            PDFLyThuyet: body.PDFLyThuyet,
            PDF: body.PDF,
            PDFLuyenTap: body.PDFLuyenTap,
            ThuTuBai: body.ThuTuBai
          });
        }
        throw new Error(`Simulated Network Connection Reset / Drop during [${action}]`);
      }

      if (failurePlan.mode === 'SERVER_ERROR') {
        return {
          ok: false,
          status: 500,
          json: async () => ({ status: 'error', message: `Server error during [${action}]` })
        };
      }
    }

    if (action === 'savebaihoc') {
      const idx = state.lessons.findIndex(l => l.TenBai === body.TenBai);
      const row = {
        MaBai: body.maBai || 'B10PILOT_MOCK_ID',
        KhoaHoc: body.KhoaHoc,
        Chuong: body.Chuong,
        TenBai: body.TenBai,
        Video: body.Video,
        VideoGiai: body.VideoGiai,
        PDFLyThuyet: body.PDFLyThuyet,
        PDF: body.PDF,
        PDFLuyenTap: body.PDFLuyenTap,
        ThuTuBai: body.ThuTuBai
      };
      if (idx >= 0) {
        state.lessons[idx] = row;
      } else {
        state.lessons.push(row);
      }
      return { ok: true, status: 200, json: async () => ({ status: 'success', data: row }) };
    }

    if (action === 'savevideocauhoi') {
      state.videoCauHoi = state.videoCauHoi.filter(q => q.baiKey !== body.baiKey);
      for (const item of (body.items || [])) {
        state.videoCauHoi.push({
          baiKey: body.baiKey,
          question: item.q,
          options: [item.A, item.B, item.C, item.D],
          answer: item.correct,
          timestamp: item.timestamp
        });
      }
      return { ok: true, status: 200, json: async () => ({ status: 'success', count: body.items?.length || 0 }) };
    }

    if (action === 'savebaitaptracnghiem') {
      state.baiTapTracNghiem = state.baiTapTracNghiem.filter(q => q.baiKey !== body.baiKey);
      for (const item of (body.items || [])) {
        state.baiTapTracNghiem.push({
          baiKey: body.baiKey,
          question: item.q,
          options: [item.A, item.B, item.C, item.D],
          answer: item.correct
        });
      }
      return { ok: true, status: 200, json: async () => ({ status: 'success', count: body.items?.length || 0 }) };
    }

    return { ok: true, status: 200, json: async () => ({ status: 'success' }) };
  };
}

const mockVideoRes = {
  theoryUrl: 'https://www.youtube.com/watch?v=mock_theory_url',
  practiceUrl: 'https://www.youtube.com/watch?v=mock_practice_url'
};
const mockDriveRes = {
  theoryPdfUrl: 'https://drive.google.com/file/d/mock_theory_pdf/view',
  appliedPdfUrl: 'https://drive.google.com/file/d/mock_app_pdf/view',
  practicePdfUrl: 'https://drive.google.com/file/d/mock_prac_pdf/view'
};
const mockQuestionsApp = Array.from({ length: 20 }, (_, i) => ({
  q: `Câu áp dụng ${i + 1}`,
  A: 'A', B: 'B', C: 'C', D: 'D',
  correct: 'A',
  timestamp: (i + 1) * 60
}));
const mockQuestionsPrac = Array.from({ length: 20 }, (_, i) => ({
  q: `Câu luyện tập ${i + 1}`,
  A: 'A', B: 'B', C: 'C', D: 'D',
  correct: 'B'
}));

await itAsync('Fault-Injection 1: Lỗi ở Request 1 (savebaihoc thất bại) -> fail-closed, không chạy step 2/3', async () => {
  const tempDir = createTempDir('fault-step1-');
  try {
    const manifest = setupSampleInbox(tempDir);
    const backendState = createMockBackendState();
    const mockFetch = createFaultInjectionFetch(backendState, { failAction: 'savebaihoc', mode: 'SERVER_ERROR' });

    let threw = false;
    try {
      await createFullDraftLessonOnBackend(
        tempDir, manifest, mockVideoRes, mockDriveRes,
        mockQuestionsApp, mockQuestionsPrac,
        { fetchImpl: mockFetch, adminKey: 'test_admin_key' }
      );
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'BACKEND_WRITE_FAILED_STEP1');
    }
    assert.strictEqual(threw, true);

    const cp = loadCheckpoint(tempDir) || {};
    assert.strictEqual(cp.backend?.lesson?.status, undefined);
    assert.strictEqual(cp.backend?.videoCauHoi, undefined);
    assert.strictEqual(cp.backend?.baiTapTracNghiem, undefined);
    assert.strictEqual(backendState.videoCauHoi.length, 0);
  } finally {
    cleanupTempDir(tempDir);
  }
});

await itAsync('Fault-Injection 2: Lỗi ở Request 2 (savevideocauhoi) -> Step 1 đã lưu; chạy lại chỉ gửi step 2 & 3', async () => {
  const tempDir = createTempDir('fault-step2-');
  try {
    const manifest = setupSampleInbox(tempDir);
    const backendState = createMockBackendState();
    const mockFetchFailing = createFaultInjectionFetch(backendState, { failAction: 'savevideocauhoi', mode: 'SERVER_ERROR' });

    // Lần 1: Bị fail ở step 2
    let threw = false;
    try {
      await createFullDraftLessonOnBackend(
        tempDir, manifest, mockVideoRes, mockDriveRes,
        mockQuestionsApp, mockQuestionsPrac,
        { fetchImpl: mockFetchFailing, adminKey: 'test_admin_key' }
      );
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'BACKEND_WRITE_FAILED_STEP2');
    }
    assert.strictEqual(threw, true);

    // Kiểm tra checkpoint sau lần 1: Step 1 đã lưu, Step 2 & 3 chưa có
    const cpAfterFail = loadCheckpoint(tempDir);
    assert.strictEqual(cpAfterFail.backend.lesson.status, 'SAVED');
    assert.strictEqual(cpAfterFail.backend.videoCauHoi, undefined);
    assert.strictEqual(backendState.lessons.length, 1);

    // Lần 2: Hệ thống phục hồi (fetch bình thường)
    backendState.calls = [];
    const mockFetchRecovered = createFaultInjectionFetch(backendState, {});
    const res = await createFullDraftLessonOnBackend(
      tempDir, manifest, mockVideoRes, mockDriveRes,
      mockQuestionsApp, mockQuestionsPrac,
      { fetchImpl: mockFetchRecovered, adminKey: 'test_admin_key' }
    );
    assert.strictEqual(res.ok, true);

    // Xác nhận savebaihoc KHÔNG bị gọi lại trong lần 2!
    const saveBaiHocCalls = backendState.calls.filter(c => c.options.body && JSON.parse(c.options.body).action === 'savebaihoc');
    assert.strictEqual(saveBaiHocCalls.length, 0, 'savebaihoc không được gửi lại vì step 1 đã lưu');

    // Cả 3 bước đều hoàn tất
    const cpFinal = loadCheckpoint(tempDir);
    assert.strictEqual(cpFinal.backend.lesson.status, 'SAVED');
    assert.strictEqual(cpFinal.backend.videoCauHoi.status, 'SAVED');
    assert.strictEqual(cpFinal.backend.baiTapTracNghiem.status, 'SAVED');
    assert.strictEqual(backendState.videoCauHoi.length, 20);
    assert.strictEqual(backendState.baiTapTracNghiem.length, 20);
  } finally {
    cleanupTempDir(tempDir);
  }
});

await itAsync('Fault-Injection 3: Network drop sau khi server ghi thành công -> Tự động Read-Back Match không append trùng', async () => {
  const tempDir = createTempDir('fault-netdrop-');
  try {
    const manifest = setupSampleInbox(tempDir);
    const backendState = createMockBackendState();
    const mockFetchDrop = createFaultInjectionFetch(backendState, {
      failAction: 'savebaihoc',
      mode: 'NETWORK_DROP_AFTER_WRITE'
    });

    // Lần 1: Bị rớt mạng sau khi server đã ghi
    let threw = false;
    try {
      await createFullDraftLessonOnBackend(
        tempDir, manifest, mockVideoRes, mockDriveRes,
        mockQuestionsApp, mockQuestionsPrac,
        { fetchImpl: mockFetchDrop, adminKey: 'test_admin_key' }
      );
    } catch (err) {
      threw = true;
      assert.ok(err.message.includes('Simulated Network Connection Reset'));
    }
    assert.strictEqual(threw, true);

    // Server thực tế đã có bản ghi
    assert.strictEqual(backendState.lessons.length, 1);
    assert.strictEqual(backendState.lessons[0].MaBai, 'B10PILOT_RECOVERED');

    // Lần 2: Chạy lại, mock bình thường
    backendState.calls = [];
    const mockFetchRecovered = createFaultInjectionFetch(backendState, {});
    const res = await createFullDraftLessonOnBackend(
      tempDir, manifest, mockVideoRes, mockDriveRes,
      mockQuestionsApp, mockQuestionsPrac,
      { fetchImpl: mockFetchRecovered, adminKey: 'test_admin_key' }
    );
    assert.strictEqual(res.ok, true);

    // Không sinh ra bản ghi bài học thứ 2!
    assert.strictEqual(backendState.lessons.length, 1, 'Không được có 2 bài học trùng nhau trên backend');
    const cp = loadCheckpoint(tempDir);
    assert.strictEqual(cp.backend.lesson.method, 'READBACK_MATCH');
    assert.strictEqual(cp.backend.lesson.maBai, 'B10PILOT_RECOVERED');
  } finally {
    cleanupTempDir(tempDir);
  }
});

await itAsync('Phát hiện Duplicate Rows trên backend -> fail-closed với MANUAL_RECOVERY_REQUIRED', async () => {
  const tempDir = createTempDir('duplicate-rows-');
  try {
    const manifest = setupSampleInbox(tempDir);
    const backendState = createMockBackendState();

    // Giả lập backend đã bị ai đó vô tình tạo 2 bài trùng tên
    backendState.lessons.push({
      MaBai: 'B10_DUP_1',
      TenBai: manifest.lessonName,
      KhoaHoc: manifest.course
    });
    backendState.lessons.push({
      MaBai: 'B10_DUP_2',
      TenBai: manifest.lessonName,
      KhoaHoc: manifest.course
    });

    const mockFetch = createFaultInjectionFetch(backendState, {});
    let threw = false;
    try {
      await createFullDraftLessonOnBackend(
        tempDir, manifest, mockVideoRes, mockDriveRes,
        mockQuestionsApp, mockQuestionsPrac,
        { fetchImpl: mockFetch, adminKey: 'test_admin_key' }
      );
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'MANUAL_RECOVERY_REQUIRED');
      assert.ok(err.message.includes('MANUAL_RECOVERY_REQUIRED'));
    }
    assert.strictEqual(threw, true);

    const cp = loadCheckpoint(tempDir);
    assert.strictEqual(cp.state, 'MANUAL_RECOVERY_REQUIRED');
  } finally {
    cleanupTempDir(tempDir);
  }
});

// =========================================================================
// SUITE 4: CHECKPOINT STATES & ERROR PROPAGATION (Blocker 2)
// =========================================================================
console.log(`\n--- [SUITE 4] Nhãn Checkpoint & Trạng Thái Lỗi (Blocker 2) ---`);

await itAsync('Thất bại ở Step 8 verify: Phải re-throw, set BACKEND_VERIFICATION_FAILED, KHÔNG ĐƯỢC set READY_FOR_TEACHER', async () => {
  const tempDir = createTempDir('verify-fail-');
  try {
    const manifest = setupSampleInbox(tempDir);
    const backendState = createMockBackendState();

    // Tạo sẵn bài pilot nhưng thiếu câu hỏi để verify read-back thất bại
    backendState.lessons.push({
      MaBai: 'B10PILOT_MOCK',
      TenBai: manifest.lessonName,
      KhoaHoc: manifest.course,
      Video: mockVideoRes.theoryUrl,
      VideoGiai: mockVideoRes.practiceUrl,
      PDFLyThuyet: mockDriveRes.theoryPdfUrl,
      PDF: mockDriveRes.appliedPdfUrl,
      PDFLuyenTap: mockDriveRes.practicePdfUrl,
      ThuTuBai: 999
    });
    // videoCauHoi rỗng -> verify thất bại

    const mockFetch = createFaultInjectionFetch(backendState, {});

    // Tạo sẵn các file bổ trợ để chạy tới step 8
    fs.writeFileSync(path.join(tempDir, 'pdf_qa_report.json'), JSON.stringify({ passed: true }));
    fs.writeFileSync(path.join(tempDir, 'transcript.json'), JSON.stringify({ text: 'sample' }));
    fs.writeFileSync(path.join(tempDir, 'questions_applied_raw.json'), JSON.stringify(createSampleQuestions(20)));
    fs.writeFileSync(path.join(tempDir, 'questions_practice_raw.json'), JSON.stringify(createSampleQuestions(20)));
    fs.writeFileSync(path.join(tempDir, 'timestamps_report.json'), JSON.stringify(createSampleTimestamps(20)));
    fs.writeFileSync(path.join(tempDir, 'timestamps_report.md'), '# Timestamps Report');

    // Giả lập Bài 10 thật trên backend bị thay đổi link Video so với snapshot trước chạy
    const mutatedB10OnBackend = { ...baseSnapshot, Video: 'https://tampered_external_url_b10' };
    backendState.lessons.push(mutatedB10OnBackend);
    fs.writeFileSync(path.join(tempDir, 'real_b10_snapshot_before.json'), JSON.stringify(baseSnapshot, null, 2));

    let threw = false;
    try {
      await runFullPipeline(tempDir, {
        mock: true,
        mockBackend: false, // Dùng mockFetch để đi qua code verifyBackendReadBack thật
        adminKey: 'test_admin_key',
        fetchImpl: mockFetch,
        snapshotPath: path.join(tempDir, 'real_b10_snapshot_before.json')
      });
    } catch (err) {
      threw = true;
      assert.ok(err.message.includes('VI PHẠM AN TOÀN: Bài 10 thật bị sai lệch'));
    }
    assert.strictEqual(threw, true, 'Hàm runFullPipeline phải ném lỗi khi verify thất bại');

    const cp = loadCheckpoint(tempDir);
    assert.strictEqual(cp.state, 'BACKEND_VERIFICATION_FAILED');
    assert.notStrictEqual(cp.state, 'READY_FOR_TEACHER');
    assert.notStrictEqual(cp.state, 'READY_MOCK_ONLY');
    assert.ok(cp.verificationError);
  } finally {
    cleanupTempDir(tempDir);
  }
});

await itAsync('Chạy ở chế độ Mock thành công: Checkpoint phải là READY_MOCK_ONLY, KHÔNG PHẢI READY_FOR_TEACHER', async () => {
  const tempDir = createTempDir('mock-only-');
  try {
    const manifest = setupSampleInbox(tempDir);

    fs.writeFileSync(path.join(tempDir, 'pdf_qa_report.json'), JSON.stringify({ passed: true }));
    fs.writeFileSync(path.join(tempDir, 'transcript.json'), JSON.stringify({ text: 'sample' }));
    fs.writeFileSync(path.join(tempDir, 'questions_applied_raw.json'), JSON.stringify(createSampleQuestions(20)));
    fs.writeFileSync(path.join(tempDir, 'questions_practice_raw.json'), JSON.stringify(createSampleQuestions(20)));
    fs.writeFileSync(path.join(tempDir, 'timestamps_report.json'), JSON.stringify(createSampleTimestamps(20)));
    fs.writeFileSync(path.join(tempDir, 'timestamps_report.md'), '# Timestamps Report');

    const res = await runFullPipeline(tempDir, { mock: true });
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.finalState, 'READY_MOCK_ONLY');

    const cp = loadCheckpoint(tempDir);
    assert.strictEqual(cp.state, 'READY_MOCK_ONLY');
    assert.notStrictEqual(cp.state, 'READY_FOR_TEACHER');
  } finally {
    cleanupTempDir(tempDir);
  }
});

console.log(`\n======================================================`);
console.log(`🎉 HOÀN THÀNH TẤT CẢ KIỂM THỬ: ${passedTests}/${totalTests} PASS (0 FAIL)`);
console.log(`======================================================\n`);
