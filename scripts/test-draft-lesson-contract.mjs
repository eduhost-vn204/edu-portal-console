/**
 * test-draft-lesson-contract.mjs
 *
 * Kiểm thử toàn diện "Draft/Hidden Lesson Contract" cho Vật Lý Xuân Trường:
 * CHẠY TRỰC TIẾP QUA VM SANDBOX CỦA src/Mã.js (THẬT 100%, KHÔNG DÙNG MOCK GIẢ).
 *
 * 1. Tương thích ngược: Bài cũ không có TrangThai được coi là 'published'.
 * 2. Public GET (doGet):
 *    - GET type=baihoc: Dù truyền scope=admin, includeDraft=true, hay query key giả mạo -> VẪN CHỈ TRẢ PUBLISHED.
 *    - GET type=videocauhoi & baitaptracnghiem của bài draft/archived: Dù có query gì -> VẪN CHỈ TRẢ { data: [] }.
 * 3. Admin POST (doPost):
 *    - getbaihocadmin, getvideocauhoiadmin, getbaitaptracnghiemadmin:
 *      + Thiếu hoặc sai adminKey -> Bị từ chối { ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' }.
 *      + Đúng adminKey -> Trả về { ok: true, data: [...] } đầy đủ published, draft, archived.
 * 4. Pipeline Safety & Fail-Closed Leak Detection:
 *    - Đối soát sâu 11/11 trường bài pilot.
 *    - Phát hiện rò rỉ trên public endpoint -> Ném PUBLIC_LEAK_DETECTED.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import vm from 'node:vm';
import {
  comparePilotLessonFields,
  verifyBackendReadBack
} from './youtube-lesson-pipeline.mjs';

console.log(`\n======================================================`);
console.log(`🧪 KIỂM THỬ BẢO MẬT: DRAFT/HIDDEN LESSON CONTRACT (VM REAL GAS)`);
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

// ── SETUP VM MOCK MÔI TRƯỜNG GOOGLE APPS SCRIPT CHO src/Mã.js ──
const srcCode = fs.readFileSync('src/Mã.js', 'utf8');

class MockSheet {
  constructor(name, headers) {
    this.name = name;
    this.headers = headers ? [...headers] : [];
    this.data = []; // rows array
  }
  getLastRow() {
    return this.data.length;
  }
  getLastColumn() {
    let max = this.headers.length;
    for (const r of this.data) {
      if (r && r.length > max) max = r.length;
    }
    return max;
  }
  appendRow(row) {
    this.data.push([...row]);
  }
  deleteRow(rowIdx) {
    this.data.splice(rowIdx - 1, 1);
  }
  deleteRows(startRow, numRows) {
    this.data.splice(startRow - 1, numRows);
  }
  getDataRange() {
    const self = this;
    return {
      getValues() {
        return self.data.map(r => [...r]);
      }
    };
  }
  getRange(row, col, numRows = 1, numCols = 1) {
    const self = this;
    return {
      getValues() {
        const res = [];
        for (let r = 0; r < numRows; r++) {
          const rowArr = [];
          for (let c = 0; c < numCols; c++) {
            const rowIndex = row - 1 + r;
            const colIndex = col - 1 + c;
            const val = (self.data[rowIndex] && self.data[rowIndex][colIndex] !== undefined)
              ? self.data[rowIndex][colIndex]
              : '';
            rowArr.push(val);
          }
          res.push(rowArr);
        }
        return res;
      },
      setValue(val) {
        const rowIndex = row - 1;
        const colIndex = col - 1;
        while (self.data.length <= rowIndex) self.data.push([]);
        while (self.data[rowIndex].length <= colIndex) self.data[rowIndex].push('');
        self.data[rowIndex][colIndex] = val;
      },
      setValues(vals) {
        for (let r = 0; r < vals.length; r++) {
          const rowIndex = row - 1 + r;
          while (self.data.length <= rowIndex) self.data.push([]);
          for (let c = 0; c < vals[r].length; c++) {
            const colIndex = col - 1 + c;
            while (self.data[rowIndex].length <= colIndex) self.data[rowIndex].push('');
            self.data[rowIndex][colIndex] = vals[r][c];
          }
        }
      }
    };
  }
}

class MockSpreadsheet {
  constructor() {
    this.sheets = new Map();
  }
  getSheetByName(name) {
    return this.sheets.get(name) || null;
  }
  insertSheet(name) {
    const s = new MockSheet(name);
    this.sheets.set(name, s);
    return s;
  }
}

function createGasVm(adminKey = 'secret_test_admin_key') {
  const activeSpreadsheet = new MockSpreadsheet();
  const sandbox = {
    PropertiesService: {
      getScriptProperties() {
        return {
          getProperty(k) {
            if (k === 'ADMIN_KEY') return adminKey;
            return null;
          }
        };
      }
    },
    SpreadsheetApp: {
      getActiveSpreadsheet() {
        return activeSpreadsheet;
      }
    },
    ContentService: {
      createTextOutput(text) {
        return {
          setMimeType() {
            return JSON.parse(text);
          }
        };
      },
      MimeType: { JSON: 'JSON' }
    },
    Session: {
      getScriptTimeZone() { return 'Asia/Ho_Chi_Minh'; }
    },
    Logger: { log() {} },
    console: console,
    Date: Date,
    Math: Math,
    Number: Number,
    String: String,
    JSON: JSON,
    parseInt: parseInt,
    parseFloat: parseFloat,
    Infinity: Infinity,
    Utilities: {
      getUuid() { return 'mock-uuid-' + Math.random().toString(36).slice(2); }
    },
    UrlFetchApp: {
      fetch() { return { getContentText() { return ''; } }; }
    }
  };

  vm.createContext(sandbox);
  vm.runInContext(srcCode, sandbox);
  return { sandbox, activeSpreadsheet };
}

// =========================================================================
// SUITE 1: TƯƠNG THÍCH NGƯỢC & NORMALIZE STATUS TRONG VM THẬT
// =========================================================================
console.log(`--- [SUITE 1] Tương Thích Ngược & Chuẩn Hóa Trạng Thái Trong VM Thật ---`);

const { sandbox: vm1 } = createGasVm();

it('normalizeLessonStatus: Mặc định không truyền hoặc rỗng -> published (Tương thích ngược)', () => {
  assert.strictEqual(vm1.normalizeLessonStatus(undefined), 'published');
  assert.strictEqual(vm1.normalizeLessonStatus(null), 'published');
  assert.strictEqual(vm1.normalizeLessonStatus(''), 'published');
  assert.strictEqual(vm1.normalizeLessonStatus('   '), 'published');
});

it('normalizeLessonStatus: Nhận diện chuẩn xác draft và archived (không phân biệt hoa thường)', () => {
  assert.strictEqual(vm1.normalizeLessonStatus('draft'), 'draft');
  assert.strictEqual(vm1.normalizeLessonStatus('Draft'), 'draft');
  assert.strictEqual(vm1.normalizeLessonStatus('DRAFT'), 'draft');
  assert.strictEqual(vm1.normalizeLessonStatus('  draft  '), 'draft');
  assert.strictEqual(vm1.normalizeLessonStatus('archived'), 'archived');
  assert.strictEqual(vm1.normalizeLessonStatus('Archived'), 'archived');
});

it('normalizeLessonStatus: Giá trị lạ/không hợp lệ -> fallback về published', () => {
  assert.strictEqual(vm1.normalizeLessonStatus('active'), 'published');
  assert.strictEqual(vm1.normalizeLessonStatus('unknown_status'), 'published');
});

// =========================================================================
// SUITE 2: PUBLIC GET BẢO MẬT TUYỆT ĐỐI (KHÔNG CÓ CƠ CHẾ NÂNG QUYỀN QUA QUERY)
// =========================================================================
console.log(`\n--- [SUITE 2] Public GET: Chặn Đứng Vượt Quyền Qua Query String ---`);

const sampleManifest = {
  course: 'Lớp 12',
  chapter: 'Chương 2: Khí lí tưởng',
  lessonName: '[BẢN NHÁP THỬ NGHIỆM] Bài Pilot Draft',
  order: 999,
  description: 'Mô tả bài học pilot'
};

function seedTestData(activeSpreadsheet) {
  const baiHocCols = ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap','ThoiGianLamBai','ThuTuBai','MaBai','TrangThai'];
  const sheetBaiHoc = activeSpreadsheet.insertSheet('BaiHoc');
  sheetBaiHoc.appendRow(baiHocCols);
  sheetBaiHoc.appendRow(['Lớp 12','Chương 1: Vật lí nhiệt','Bài 1: Published Thật','v1','vg1','desc1','2026-09-01','','p1','plt1','pluyentap1','45','1','B01','published']);
  sheetBaiHoc.appendRow([sampleManifest.course, sampleManifest.chapter, sampleManifest.lessonName,'v2','vg2',sampleManifest.description,'2026-09-08','','p2','plt2','pluyentap2','45','999','B02_PILOT','draft']);
  sheetBaiHoc.appendRow(['Lớp 12','Chương 1: Vật lí nhiệt','Bài 3: Đã lưu trữ','v3','vg3','desc3','2026-08-01','','p3','plt3','pluyentap3','45','3','B03_ARCH','archived']);
  sheetBaiHoc.appendRow(['Lớp 12','Chương 1: Vật lí nhiệt','Bài 4: Bài cũ chưa có cột TrangThai','v4','vg4','desc4','2026-07-01','','p4','plt4','pluyentap4','45','4','B04_LEGACY','']);

  const vchCols = ['baiKey','thuTu','thoiGian','nhId','type','question','optA','optB','optC','optD','correct'];
  const sheetVCH = activeSpreadsheet.insertSheet('VideoCauHoi');
  sheetVCH.appendRow(vchCols);
  sheetVCH.appendRow(['B01','1','60','NH01','mc','Câu hỏi Bài 1 Published','A','B','C','D','A']);
  sheetVCH.appendRow(['B02_PILOT','1','120','NH02','mc','Câu hỏi mật Bài Pilot Draft','A','B','C','D','B']);
  for (let i = 1; i <= 20; i++) {
    sheetVCH.appendRow([sampleManifest.lessonName, String(i), String(60 * i), `NH${i}`, 'mc', `Câu hỏi ${i} Bài Pilot Draft`, 'A', 'B', 'C', 'D', 'B']);
  }

  const btCols = ['baiKey','thuTu','type','question','optA','optB','optC','optD','correct'];
  const sheetBT = activeSpreadsheet.insertSheet('BaiTapTracNghiem');
  sheetBT.appendRow(btCols);
  sheetBT.appendRow(['B01','1','mc','Bài tập Bài 1 Published','A','B','C','D','C']);
  sheetBT.appendRow(['B02_PILOT','1','mc','Bài tập mật Bài Pilot Draft','A','B','C','D','D']);
  for (let i = 1; i <= 20; i++) {
    sheetBT.appendRow([sampleManifest.lessonName, String(i), 'mc', `Bài tập ${i} Bài Pilot Draft`, 'A', 'B', 'C', 'D', 'D']);
  }
}

const { sandbox: vm2, activeSpreadsheet: ss2 } = createGasVm('secret_admin_key_123');
seedTestData(ss2);

it('doGet type=baihoc: Public bình thường CHỈ nhận bài published (kể cả legacy rỗng)', () => {
  const res = vm2.doGet({ parameter: { type: 'baihoc' } });
  assert.ok(Array.isArray(res));
  assert.strictEqual(res.length, 2, 'Chỉ nhận 2 bài: B01 (published) và B04_LEGACY (chuẩn hóa published)');
  const keys = res.map(r => r.MaBai);
  assert.ok(keys.includes('B01'));
  assert.ok(keys.includes('B04_LEGACY'));
  assert.ok(!keys.includes('B02_PILOT'), 'Draft tuyệt đối không được xuất hiện');
  assert.ok(!keys.includes('B03_ARCH'), 'Archived tuyệt đối không được xuất hiện');
});

it('doGet type=baihoc: Kèm scope=admin giả mạo -> VẪN CHỈ NHẬN PUBLISHED (Không nâng quyền)', () => {
  const res = vm2.doGet({ parameter: { type: 'baihoc', scope: 'admin' } });
  assert.ok(Array.isArray(res));
  assert.strictEqual(res.length, 2);
  const keys = res.map(r => r.MaBai);
  assert.ok(!keys.includes('B02_PILOT'), 'Kẻ tấn công không thể đọc draft bằng scope=admin');
});

it('doGet type=baihoc: Kèm includeDraft=true giả mạo -> VẪN CHỈ NHẬN PUBLISHED', () => {
  const res = vm2.doGet({ parameter: { type: 'baihoc', includeDraft: 'true' } });
  assert.ok(Array.isArray(res));
  assert.strictEqual(res.length, 2);
  const keys = res.map(r => r.MaBai);
  assert.ok(!keys.includes('B02_PILOT'));
});

it('doGet type=baihoc: Truyền adminKey trên query string -> VẪN CHỈ NHẬN PUBLISHED (Cấm auth qua GET query)', () => {
  const res = vm2.doGet({ parameter: { type: 'baihoc', adminKey: 'secret_admin_key_123' } });
  assert.ok(Array.isArray(res));
  assert.strictEqual(res.length, 2);
  const keys = res.map(r => r.MaBai);
  assert.ok(!keys.includes('B02_PILOT'), 'Không chấp nhận xác thực adminKey trên URL');
});

it('doGet type=videocauhoi: Public hỏi bài published -> Trả về câu hỏi', () => {
  const res = vm2.doGet({ parameter: { type: 'videocauhoi', bai: 'B01' } });
  assert.ok(res && Array.isArray(res.data));
  assert.strictEqual(res.data.length, 1);
  assert.strictEqual(res.data[0].question, 'Câu hỏi Bài 1 Published');
});

it('doGet type=videocauhoi: Public hỏi bài draft -> Trả về rỗng { data: [] }', () => {
  const res = vm2.doGet({ parameter: { type: 'videocauhoi', bai: 'B02_PILOT' } });
  assert.deepStrictEqual(res, { data: [] }, 'Phải trả về rỗng, không lộ câu hỏi bài draft');
});

it('doGet type=videocauhoi: Hỏi bài draft kèm scope=admin + includeDraft -> VẪN TRẢ VỀ RỖNG { data: [] }', () => {
  const res = vm2.doGet({ parameter: { type: 'videocauhoi', bai: 'B02_PILOT', scope: 'admin', includeDraft: 'true' } });
  assert.deepStrictEqual(res, { data: [] }, 'Cấm nâng quyền đọc câu hỏi video qua GET');
});

it('doGet type=baitaptracnghiem: Public hỏi bài draft -> Trả về rỗng { data: [] }', () => {
  const res = vm2.doGet({ parameter: { type: 'baitaptracnghiem', bai: 'B02_PILOT' } });
  assert.deepStrictEqual(res, { data: [] }, 'Phải trả về rỗng, không lộ bài tập bài draft');
});

it('doGet type=baitaptracnghiem: Hỏi bài draft kèm scope=admin + includeDraft -> VẪN TRẢ VỀ RỖNG { data: [] }', () => {
  const res = vm2.doGet({ parameter: { type: 'baitaptracnghiem', bai: 'B02_PILOT', scope: 'admin', includeDraft: 'true' } });
  assert.deepStrictEqual(res, { data: [] }, 'Cấm nâng quyền đọc bài tập qua GET');
});

// =========================================================================
// SUITE 3: ADMIN POST BẢO MẬT (XÁC THỰC adminKey TRONG BODY)
// =========================================================================
console.log(`\n--- [SUITE 3] Admin POST: Xác Thực Nghiêm Ngặt Qua Request Body ---`);

it('doPost action=getbaihocadmin: Thiếu adminKey -> Bị từ chối { ok: false, msg: Unauthorized }', () => {
  const res = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'getbaihocadmin' }) }
  });
  assert.strictEqual(res.ok, false);
  assert.ok(res.msg.includes('Unauthorized'));
});

it('doPost action=getbaihocadmin: Sai adminKey -> Bị từ chối { ok: false, msg: Unauthorized }', () => {
  const res = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'getbaihocadmin', adminKey: 'sai_mat_khau' }) }
  });
  assert.strictEqual(res.ok, false);
  assert.ok(res.msg.includes('Unauthorized'));
});

it('doPost action=getbaihocadmin: Đúng adminKey -> Nhận đủ 4 bài (published, draft, archived, legacy)', () => {
  const res = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'getbaihocadmin', adminKey: 'secret_admin_key_123' }) }
  });
  assert.strictEqual(res.ok, true);
  assert.ok(Array.isArray(res.data));
  assert.strictEqual(res.data.length, 4, 'Admin phải đọc đủ mọi trạng thái');
  const keys = res.data.map(r => r.MaBai);
  assert.ok(keys.includes('B01'));
  assert.ok(keys.includes('B02_PILOT'));
  assert.ok(keys.includes('B03_ARCH'));
  assert.ok(keys.includes('B04_LEGACY'));
});

it('doPost action=getvideocauhoiadmin: Sai adminKey -> Bị từ chối', () => {
  const res = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'getvideocauhoiadmin', adminKey: 'wrong' }) }
  });
  assert.strictEqual(res.ok, false);
});

it('doPost action=getvideocauhoiadmin: Đúng adminKey -> Admin đọc được câu hỏi bài draft', () => {
  const res = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'getvideocauhoiadmin', adminKey: 'secret_admin_key_123', bai: 'B02_PILOT' }) }
  });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.data.length, 1);
  assert.strictEqual(res.data[0].question, 'Câu hỏi mật Bài Pilot Draft');
});

it('doPost action=getbaitaptracnghiemadmin: Đúng adminKey -> Admin đọc được bài tập bài draft', () => {
  const res = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'getbaitaptracnghiemadmin', adminKey: 'secret_admin_key_123', bai: 'B02_PILOT' }) }
  });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.data.length, 1);
  assert.strictEqual(res.data[0].question, 'Bài tập mật Bài Pilot Draft');
});

// =========================================================================
// SUITE 3B: CHẶN ĐỨNG P0 INTEGRITY BYPASS TRÊN TOÀN BỘ CÁC ACTION GHI
// =========================================================================
console.log(`\n--- [SUITE 3B] Integrity Bypass Defense: Chặn Đứng Thao Tác Ghi Khi Thiếu/Sai adminKey ---`);

it('doPost action=savebaihoc: Thiếu hoặc sai adminKey -> Từ chối Unauthorized, sheet BaiHoc giữ nguyên 100%', () => {
  const sheet = ss2.getSheetByName('BaiHoc');
  const rowCountBefore = sheet.getLastRow();
  const snapshotBefore = JSON.stringify(sheet.getDataRange().getValues());

  // 1. Thử ghi bài mới khi thiếu adminKey
  const res1 = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'savebaihoc', TenBai: 'Hacker Injected Lesson' }) }
  });
  assert.strictEqual(res1.ok, false);
  assert.ok(res1.msg && res1.msg.includes('Unauthorized'));
  assert.strictEqual(sheet.getLastRow(), rowCountBefore);
  assert.strictEqual(JSON.stringify(sheet.getDataRange().getValues()), snapshotBefore);

  // 2. Thử ghi bài mới khi sai adminKey
  const res2 = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'savebaihoc', adminKey: 'wrong_key', TenBai: 'Hacker Lesson 2' }) }
  });
  assert.strictEqual(res2.ok, false);
  assert.ok(res2.msg && res2.msg.includes('Unauthorized'));
  assert.strictEqual(sheet.getLastRow(), rowCountBefore);
  assert.strictEqual(JSON.stringify(sheet.getDataRange().getValues()), snapshotBefore);
});

it('doPost action=savebaihoc: Kẻ xấu cố ý biến bài Draft thành Published khi thiếu/sai key -> Thất bại & bài giữ nguyên draft', () => {
  const sheet = ss2.getSheetByName('BaiHoc');
  const valuesBefore = sheet.getDataRange().getValues();
  const pilotRowIdx = valuesBefore.findIndex(r => r.includes('B02_PILOT'));
  assert.ok(pilotRowIdx >= 0, 'Phải tìm thấy B02_PILOT');
  assert.strictEqual(valuesBefore[pilotRowIdx][14], 'draft');

  // Hacker cố gắng cập nhật bài draft này thành published mà không có adminKey
  const resTamper = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'savebaihoc', maBai: 'B02_PILOT', TrangThai: 'published' }) }
  });
  assert.strictEqual(resTamper.ok, false);
  assert.ok(resTamper.msg && resTamper.msg.includes('Unauthorized'));

  // Kiểm tra trực tiếp trong sheet: trạng thái VẪN PHẢI LÀ 'draft'
  const valuesAfter = sheet.getDataRange().getValues();
  assert.strictEqual(valuesAfter[pilotRowIdx][14], 'draft', 'Trạng thái bài nháp tuyệt đối không bị đổi thành published');
});

it('doPost action=savebaihoc: Đúng adminKey -> Ghi bài học thành công', () => {
  const sheet = ss2.getSheetByName('BaiHoc');
  const rowCountBefore = sheet.getLastRow();

  const resOk = vm2.doPost({
    postData: {
      contents: JSON.stringify({
        action: 'savebaihoc',
        adminKey: 'secret_admin_key_123',
        KhoaHoc: 'Lớp 12',
        Chuong: 'Chương 2: Khí lí tưởng',
        TenBai: 'Bài Test Admin Authorized',
        TrangThai: 'draft'
      })
    }
  });
  assert.strictEqual(resOk.ok, true);
  assert.strictEqual(resOk.TrangThai, 'draft');
  assert.strictEqual(sheet.getLastRow(), rowCountBefore + 1);
});

it('doPost action=deletebaihoc: Thiếu/sai adminKey -> Từ chối Unauthorized, không xóa bất kỳ dòng nào', () => {
  const sheet = ss2.getSheetByName('BaiHoc');
  const rowCountBefore = sheet.getLastRow();
  const snapshotBefore = JSON.stringify(sheet.getDataRange().getValues());

  const resFail = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'deletebaihoc', key: 'B01' }) }
  });
  assert.strictEqual(resFail.ok, false);
  assert.ok(resFail.msg && resFail.msg.includes('Unauthorized'));
  assert.strictEqual(sheet.getLastRow(), rowCountBefore);
  assert.strictEqual(JSON.stringify(sheet.getDataRange().getValues()), snapshotBefore);
});

it('doPost action=deletebaihoc: Đúng adminKey -> Xóa bài học thành công', () => {
  const sheet = ss2.getSheetByName('BaiHoc');
  const rowCountBefore = sheet.getLastRow();

  const resOk = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'deletebaihoc', adminKey: 'secret_admin_key_123', maBai: 'B04_LEGACY' }) }
  });
  assert.strictEqual(resOk.ok, true);
  assert.strictEqual(sheet.getLastRow(), rowCountBefore - 1);
});

it('doPost action=savevideocauhoi: Thiếu/sai adminKey -> Từ chối Unauthorized, sheet VideoCauHoi giữ nguyên 100%', () => {
  const sheet = ss2.getSheetByName('VideoCauHoi');
  const rowCountBefore = sheet.getLastRow();
  const snapshotBefore = JSON.stringify(sheet.getDataRange().getValues());

  const resFail = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'savevideocauhoi', baiKey: 'B01', items: [{ q: 'Tampered Q' }] }) }
  });
  assert.strictEqual(resFail.ok, false);
  assert.ok(resFail.msg && resFail.msg.includes('Unauthorized'));
  assert.strictEqual(sheet.getLastRow(), rowCountBefore);
  assert.strictEqual(JSON.stringify(sheet.getDataRange().getValues()), snapshotBefore);
});

it('doPost action=savevideocauhoi: Đúng adminKey -> Ghi câu hỏi video thành công', () => {
  const resOk = vm2.doPost({
    postData: {
      contents: JSON.stringify({
        action: 'savevideocauhoi',
        adminKey: 'secret_admin_key_123',
        baiKey: 'B01',
        items: [{ t: 30, q: 'Authorized Q1', A: '1', B: '2', C: '3', D: '4', ans: 'A' }]
      })
    }
  });
  assert.strictEqual(resOk.ok, true);
  assert.strictEqual(resOk.count, 1);
});

it('doPost action=savebaitaptracnghiem: Thiếu/sai adminKey -> Từ chối Unauthorized, sheet BaiTapTracNghiem giữ nguyên 100%', () => {
  const sheet = ss2.getSheetByName('BaiTapTracNghiem');
  const rowCountBefore = sheet.getLastRow();
  const snapshotBefore = JSON.stringify(sheet.getDataRange().getValues());

  const resFail = vm2.doPost({
    postData: { contents: JSON.stringify({ action: 'savebaitaptracnghiem', baiKey: 'B01', items: [{ q: 'Tampered Quiz' }] }) }
  });
  assert.strictEqual(resFail.ok, false);
  assert.ok(resFail.msg && resFail.msg.includes('Unauthorized'));
  assert.strictEqual(sheet.getLastRow(), rowCountBefore);
  assert.strictEqual(JSON.stringify(sheet.getDataRange().getValues()), snapshotBefore);
});

it('doPost action=savebaitaptracnghiem: Đúng adminKey -> Ghi bài tập trắc nghiệm thành công', () => {
  const resOk = vm2.doPost({
    postData: {
      contents: JSON.stringify({
        action: 'savebaitaptracnghiem',
        adminKey: 'secret_admin_key_123',
        baiKey: 'B01',
        items: [{ q: 'Authorized Quiz 1', A: '1', B: '2', C: '3', D: '4', correct: 'B' }]
      })
    }
  });
  assert.strictEqual(resOk.ok, true);
  assert.strictEqual(resOk.count, 1);
});

// =========================================================================
// SUITE 4: PIPELINE READ-BACK & FAIL-CLOSED PUBLIC LEAK TEST
// =========================================================================
console.log(`\n--- [SUITE 4] Pipeline Pilot Fail-Closed Public Leak Detection ---`);

it('comparePilotLessonFields: Đối soát sâu 11/11 trường (kể cả TrangThai=draft)', () => {
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

  // Mutation test: nếu actual mang TrangThai='published' -> Phải fail
  const actualPublished = { ...actualMatch, TrangThai: 'published' };
  const resFail = comparePilotLessonFields(expected, actualPublished);
  assert.strictEqual(resFail.ok, false);
  assert.ok(resFail.diffs.some(d => d.field === 'TrangThai'));
});

await itAsync('verifyBackendReadBack: Ném lỗi PUBLIC_LEAK_DETECTED nếu bài pilot rò rỉ trên public endpoint học sinh', async () => {
  const leakingFetch = async (url, opts) => {
    if (opts && opts.method === 'POST') {
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
    // Giả lập lỗi: Public GET vô tình để lọt bài pilot!
    if (url.includes('type=baihoc')) {
      return {
        ok: true,
        json: async () => [
          {
            TenBai: sampleManifest.lessonName,
            KhoaHoc: sampleManifest.course,
            Chuong: sampleManifest.chapter,
            ThuTuBai: 999,
            TrangThai: 'draft'
          }
        ]
      };
    }
    return { ok: true, json: async () => ({ data: [] }) };
  };

  let caughtErr = null;
  try {
    await verifyBackendReadBack(sampleManifest, {
      fetchImpl: leakingFetch,
      adminKey: 'secret_test_admin_key',
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
});

await itAsync('verifyBackendReadBack: Thành công khi bài draft chỉ trả qua admin POST và public GET ẩn hoàn toàn', async () => {
  // Tạo mock fetch ủy quyền trực tiếp cho sandbox GAS thật
  const gasVmFetch = async (url, opts) => {
    if (opts && opts.method === 'POST') {
      const data = JSON.parse(opts.body || '{}');
      const res = vm2.doPost({ postData: { contents: opts.body } });
      return { ok: true, json: async () => res };
    }
    const urlObj = new URL(url);
    const param = Object.fromEntries(urlObj.searchParams.entries());
    const res = vm2.doGet({ parameter: param });
    return { ok: true, json: async () => res };
  };

  const result = await verifyBackendReadBack(sampleManifest, {
    fetchImpl: gasVmFetch,
    adminKey: 'secret_admin_key_123',
    dbUrl: 'https://script.google.com/macros/s/AKfycbytest/exec',
    snapshotPath: 'non_existent_snapshot.json',
    theoryUrl: 'v2',
    practiceUrl: 'vg2',
    theoryPdfUrl: 'plt2',
    appliedPdfUrl: 'p2',
    practicePdfUrl: 'pluyentap2'
  });

  assert.strictEqual(result.verified, true);
  assert.strictEqual(result.pilotLesson.TrangThai, 'draft');
});

// =========================================================================
// SUITE 5: ADMIN FORM SAFETY & NON-DESTRUCTIVE READ FAILURE PREVENT
// =========================================================================
console.log(`\n--- [SUITE 5] Admin Form Safety & Non-Destructive Read Failure Prevention ---`);

await itAsync('test-admin-form-safety.mjs: 8/8 kịch bản an toàn form (lock on error, alias ordering fail-closed, touch tracking, zero destructive writes)', async () => {
  const { execSync } = await import('node:child_process');
  const output = execSync('node scripts/test-admin-form-safety.mjs', { encoding: 'utf8' });
  assert.ok(output.includes('8/8 PASS'), 'Toàn bộ 8 test form safety phải pass');
});

console.log(`\n======================================================`);
console.log(`🎉 HOÀN THÀNH TẤT CẢ KIỂM THỬ DRAFT CONTRACT: ${passedCount}/${passedCount} PASS (0 FAIL)`);
console.log(`======================================================\n`);