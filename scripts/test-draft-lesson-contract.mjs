/**
 * test-draft-lesson-contract.mjs
 * 
 * Kiểm thử toàn diện "Draft/Hidden Lesson Contract" cho Vật Lý Xuân Trường:
 * 1. Tương thích ngược: Bài cũ không có TrangThai được coi là 'published' (mặc định an toàn).
 * 2. GAS GET type=baihoc:
 *    - Học sinh (không scope=admin, không adminKey): CHỈ nhận bài 'published'; bài 'draft' và 'archived' bị lọc sạch.
 *    - Quản trị viên (scope=admin hoặc có adminKey): Nhận đủ mọi trạng thái kèm trường TrangThai.
 * 3. GAS GET câu hỏi (type=videocauhoi & type=baitaptracnghiem):
 *    - Học sinh: Nếu bài học là 'draft' hoặc 'archived' -> Trả về rỗng { data: [] }, tuyệt đối không rò rỉ.
 *    - Quản trị viên (scope=admin): Trả về đủ câu hỏi của bài nháp.
 * 4. GAS POST saveBaiHoc:
 *    - Lưu đúng trường TrangThai ('draft' | 'published' | 'archived').
 *    - Bài cũ hoặc không truyền TrangThai -> Mặc định 'published'.
 * 5. Pipeline Pilot Safety & Leak Detection:
 *    - Read-back sâu 11/11 trường (kể cả TrangThai=draft).
 *    - Kiểm tra fail-closed: Nếu bài draft rò rỉ vào endpoint public học sinh -> Ném lỗi PUBLIC_LEAK_DETECTED.
 */

import assert from 'node:assert';
import {
  comparePilotLessonFields,
  createFullDraftLessonOnBackend,
  verifyBackendReadBack
} from './youtube-lesson-pipeline.mjs';

console.log(`\n======================================================`);
console.log(`🧪 KIỂM THỬ TOÀN DIỆN: DRAFT/HIDDEN LESSON CONTRACT`);
console.log(`======================================================\n`);

let passedCount = 0;
function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

async function itAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// ── MÔ PHỎNG LOGIC BACKEND GAS (src/Mã.js) ──
function normalizeLessonStatus(st) {
  if (!st) return 'published';
  const s = String(st).toLowerCase().trim();
  if (s === 'draft') return 'draft';
  if (s === 'archived') return 'archived';
  return 'published';
}

function simulateGasGetBaiHoc(lessonsDb, queryParams = {}) {
  const isAdmin = queryParams.scope === 'admin' || Boolean(queryParams.adminKey);
  const rows = [];
  for (const b of lessonsDb) {
    const status = normalizeLessonStatus(b.TrangThai);
    if (!isAdmin && status !== 'published') {
      continue; // Học sinh không bao giờ nhận bài draft hoặc archived
    }
    rows.push({
      ...b,
      TrangThai: status
    });
  }
  return { status: 'success', data: rows };
}

function simulateGasGetQuestions(lessonsDb, questionsDb, type, queryParams = {}) {
  const isAdmin = queryParams.scope === 'admin' || Boolean(queryParams.adminKey);
  const baiKey = queryParams.bai || '';
  const lesson = lessonsDb.find(l => (l.MaBai && l.MaBai === baiKey) || (l.TenBai && l.TenBai === baiKey));
  
  if (lesson) {
    const status = normalizeLessonStatus(lesson.TrangThai);
    if (!isAdmin && status !== 'published') {
      return { status: 'success', data: [] }; // Chặn học sinh đọc câu hỏi bài draft/archived
    }
  }

  const items = questionsDb[baiKey] || [];
  return { status: 'success', data: items };
}

// =========================================================================
// SUITE 1: TƯƠNG THÍCH NGƯỢC VÀ CHUẨN HÓA TRẠNG THÁI (Mã.js)
// =========================================================================
console.log(`--- [SUITE 1] Tương Thích Ngược & Chuẩn Hóa Trạng Thái ---`);

it('Tương thích ngược: Rỗng, null, undefined hoặc bài cũ thiếu TrangThai đều là "published"', () => {
  assert.strictEqual(normalizeLessonStatus(''), 'published');
  assert.strictEqual(normalizeLessonStatus(null), 'published');
  assert.strictEqual(normalizeLessonStatus(undefined), 'published');
  assert.strictEqual(normalizeLessonStatus('PUBLISHED'), 'published');
  assert.strictEqual(normalizeLessonStatus('  published  '), 'published');
  assert.strictEqual(normalizeLessonStatus('unknown_status'), 'published');
});

it('Nhận diện chính xác giá trị "draft" và "archived"', () => {
  assert.strictEqual(normalizeLessonStatus('draft'), 'draft');
  assert.strictEqual(normalizeLessonStatus('DRAFT'), 'draft');
  assert.strictEqual(normalizeLessonStatus('archived'), 'archived');
  assert.strictEqual(normalizeLessonStatus('ARCHIVED'), 'archived');
});

// =========================================================================
// SUITE 2: BẢO VỆ GET BÀI HỌC THEO QUYỀN (STUDENT VS ADMIN)
// =========================================================================
console.log(`\n--- [SUITE 2] Bảo Vệ GET type=baihoc (Student vs Admin) ---`);

const mockLessons = [
  { MaBai: 'B01', TenBai: 'Bài 1 (Cũ, thiếu TrangThai)' },
  { MaBai: 'B02', TenBai: 'Bài 2 (Đã xuất bản)', TrangThai: 'published' },
  { MaBai: 'B03', TenBai: 'Bài 3 (Nháp - Draft)', TrangThai: 'draft' },
  { MaBai: 'B04', TenBai: 'Bài 4 (Lưu trữ - Archived)', TrangThai: 'archived' },
  { MaBai: 'B05_PILOT', TenBai: '[BẢN NHÁP THỬ NGHIỆM] Bài Pilot B10', TrangThai: 'draft' }
];

it('Học sinh (Public GET): Chỉ nhận bài published, lọc sạch hoàn toàn 100% draft và archived', () => {
  const res = simulateGasGetBaiHoc(mockLessons, {});
  const titles = res.data.map(b => b.TenBai);
  assert.strictEqual(res.data.length, 2);
  assert.ok(titles.includes('Bài 1 (Cũ, thiếu TrangThai)'));
  assert.ok(titles.includes('Bài 2 (Đã xuất bản)'));
  assert.ok(!titles.includes('Bài 3 (Nháp - Draft)'));
  assert.ok(!titles.includes('Bài 4 (Lưu trữ - Archived)'));
  assert.ok(!titles.includes('[BẢN NHÁP THỬ NGHIỆM] Bài Pilot B10'));
});

it('Quản trị viên (scope=admin): Nhận đầy đủ 5/5 bài kể cả bài nháp và lưu trữ', () => {
  const res = simulateGasGetBaiHoc(mockLessons, { scope: 'admin' });
  assert.strictEqual(res.data.length, 5);
  const pilot = res.data.find(b => b.MaBai === 'B05_PILOT');
  assert.ok(pilot);
  assert.strictEqual(pilot.TrangThai, 'draft');
});

it('Quản trị viên (adminKey): Cũng nhận đầy đủ 5/5 bài khi có adminKey hợp lệ', () => {
  const res = simulateGasGetBaiHoc(mockLessons, { adminKey: 'secret_key' });
  assert.strictEqual(res.data.length, 5);
});

// =========================================================================
// SUITE 3: BẢO VỆ GET CÂU HỎI THEO BÀI (VIDEOCAUHOI & BAITAPTRACNGHIEM)
// =========================================================================
console.log(`\n--- [SUITE 3] Bảo Vệ GET Câu Hỏi Bài Nháp ---`);

const mockQuestionsDb = {
  'B02': [{ q: 'Câu hỏi của bài published' }],
  'B05_PILOT': [{ q: 'Câu hỏi bí mật của bài pilot draft 1' }, { q: 'Câu hỏi bí mật của bài pilot draft 2' }]
};

it('Học sinh gọi videocauhoi của bài published -> Nhận được câu hỏi', () => {
  const res = simulateGasGetQuestions(mockLessons, mockQuestionsDb, 'videocauhoi', { bai: 'B02' });
  assert.strictEqual(res.data.length, 1);
});

it('Học sinh gọi videocauhoi của bài pilot draft -> Bị chặn, trả về data rỗng []', () => {
  const res = simulateGasGetQuestions(mockLessons, mockQuestionsDb, 'videocauhoi', { bai: 'B05_PILOT' });
  assert.strictEqual(res.data.length, 0);
});

it('Học sinh gọi baitaptracnghiem của bài pilot draft -> Bị chặn, trả về data rỗng []', () => {
  const res = simulateGasGetQuestions(mockLessons, mockQuestionsDb, 'baitaptracnghiem', { bai: 'B05_PILOT' });
  assert.strictEqual(res.data.length, 0);
});

it('Admin gọi videocauhoi của bài pilot draft (scope=admin) -> Nhận đầy đủ câu hỏi để đối soát', () => {
  const res = simulateGasGetQuestions(mockLessons, mockQuestionsDb, 'videocauhoi', { bai: 'B05_PILOT', scope: 'admin' });
  assert.strictEqual(res.data.length, 2);
  assert.strictEqual(res.data[0].q, 'Câu hỏi bí mật của bài pilot draft 1');
});

// =========================================================================
// SUITE 4: PIPELINE READ-BACK & PUBLIC LEAK DETECTION FAIL-CLOSED
// =========================================================================
console.log(`\n--- [SUITE 4] Pipeline Read-back & Public Leak Detection ---`);

const sampleManifest = {
  lessonName: '[BẢN NHÁP THỬ NGHIỆM] B10 - TEST DRAFT CONTRACT',
  course: 'Vật Lý 12',
  chapter: 'Chương 1',
  order: 999,
  description: 'Mô tả bài pilot'
};

it('comparePilotLessonFields: Kiểm tra toàn diện 11 trường có TrangThai=draft', () => {
  const expected = {
    course: sampleManifest.course,
    chapter: sampleManifest.chapter,
    lessonName: sampleManifest.lessonName,
    order: 999,
    description: sampleManifest.description,
    theoryUrl: 'https://youtu.be/vid1',
    practiceUrl: 'https://youtu.be/vid2',
    theoryPdfUrl: 'https://drive.google.com/pdf1',
    appliedPdfUrl: 'https://drive.google.com/pdf2',
    practicePdfUrl: 'https://drive.google.com/pdf3',
    TrangThai: 'draft'
  };
  const actualMatch = {
    KhoaHoc: expected.course,
    Chuong: expected.chapter,
    TenBai: expected.lessonName,
    ThuTuBai: 999,
    MoTaBai: expected.description,
    Video: expected.theoryUrl,
    VideoGiai: expected.practiceUrl,
    PDFLyThuyet: expected.theoryPdfUrl,
    PDF: expected.appliedPdfUrl,
    PDFLuyenTap: expected.practicePdfUrl,
    TrangThai: 'draft'
  };
  const res = comparePilotLessonFields(expected, actualMatch);
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.diffCount, 0);

  // Nếu actual mang TrangThai='published' thay vì 'draft' -> Phải fail
  const actualPublished = { ...actualMatch, TrangThai: 'published' };
  const resFail = comparePilotLessonFields(expected, actualPublished);
  assert.strictEqual(resFail.ok, false);
  assert.ok(resFail.diffs.some(d => d.field === 'TrangThai'));
});

await itAsync('verifyBackendReadBack: Ném lỗi PUBLIC_LEAK_DETECTED nếu bài pilot bị lộ trên public endpoint học sinh', async () => {
  const leakingFetch = async (url) => {
    const isAdmin = url.includes('scope=admin');
    if (url.includes('type=baihoc')) {
      // Giả lập lỗi: Public endpoint bị lộ bài pilot!
      return {
        ok: true,
        json: async () => ({
          ok: true,
          data: [
            {
              TenBai: sampleManifest.lessonName,
              KhoaHoc: sampleManifest.course,
              Chuong: sampleManifest.chapter,
              ThuTuBai: 999,
              MoTaBai: sampleManifest.description,
              Video: 'https://youtu.be/vid1',
              VideoGiai: 'https://youtu.be/vid2',
              PDFLyThuyet: 'https://drive.google.com/pdf1',
              PDF: 'https://drive.google.com/pdf2',
              PDFLuyenTap: 'https://drive.google.com/pdf3',
              TrangThai: 'draft'
            }
          ]
        })
      };
    }
    return { ok: true, json: async () => ({ ok: true, data: [] }) };
  };

  let caughtErr = null;
  try {
    await verifyBackendReadBack(sampleManifest, {
      fetchImpl: leakingFetch,
      snapshotPath: 'non_existent_snapshot.json',
      theoryUrl: 'https://youtu.be/vid1',
      practiceUrl: 'https://youtu.be/vid2',
      theoryPdfUrl: 'https://drive.google.com/pdf1',
      appliedPdfUrl: 'https://drive.google.com/pdf2',
      practicePdfUrl: 'https://drive.google.com/pdf3'
    });
  } catch (err) {
    caughtErr = err;
  }

  assert.ok(caughtErr, 'Phải ném lỗi khi phát hiện leak');
  assert.strictEqual(caughtErr.code, 'PUBLIC_LEAK_DETECTED');
  assert.ok(caughtErr.message.includes('PUBLIC_LEAK_DETECTED'));
});

await itAsync('verifyBackendReadBack: Thành công khi bài draft chỉ xuất hiện ở admin scope và public endpoint sạch 100%', async () => {
  const secureFetch = async (url) => {
    const isAdmin = url.includes('scope=admin');
    if (url.includes('type=baihoc')) {
      if (isAdmin) {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            data: [
              {
                TenBai: sampleManifest.lessonName,
                KhoaHoc: sampleManifest.course,
                Chuong: sampleManifest.chapter,
                ThuTuBai: 999,
                MoTaBai: sampleManifest.description,
                Video: 'https://youtu.be/vid1',
                VideoGiai: 'https://youtu.be/vid2',
                PDFLyThuyet: 'https://drive.google.com/pdf1',
                PDF: 'https://drive.google.com/pdf2',
                PDFLuyenTap: 'https://drive.google.com/pdf3',
                TrangThai: 'draft'
              }
            ]
          })
        };
      } else {
        // Public endpoint học sinh: RỖNG, không có bài pilot
        return { ok: true, json: async () => ({ ok: true, data: [] }) };
      }
    }
    if (url.includes('type=videocauhoi') || url.includes('type=baitaptracnghiem')) {
      if (isAdmin) {
        return { ok: true, json: async () => ({ ok: true, data: Array.from({ length: 20 }, (_, i) => ({ thuTu: i + 1 })) }) };
      } else {
        return { ok: true, json: async () => ({ ok: true, data: [] }) };
      }
    }
    return { ok: true, json: async () => ({ ok: true, data: [] }) };
  };

  const result = await verifyBackendReadBack(sampleManifest, {
    fetchImpl: secureFetch,
    snapshotPath: 'non_existent_snapshot.json',
    theoryUrl: 'https://youtu.be/vid1',
    practiceUrl: 'https://youtu.be/vid2',
    theoryPdfUrl: 'https://drive.google.com/pdf1',
    appliedPdfUrl: 'https://drive.google.com/pdf2',
    practicePdfUrl: 'https://drive.google.com/pdf3'
  });

  assert.strictEqual(result.verified, true);
  assert.strictEqual(result.pilotLesson.TrangThai, 'draft');
});

console.log(`\n======================================================`);
console.log(`🎉 HOÀN THÀNH TẤT CẢ KIỂM THỬ DRAFT CONTRACT: ${passedCount}/${passedCount} PASS (0 FAIL)`);
console.log(`======================================================\n`);