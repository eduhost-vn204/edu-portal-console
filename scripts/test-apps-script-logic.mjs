import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// ── 1. Đọc trực tiếp mã nguồn từ src/Mã.js (Source of Truth duy nhất) ──
const srcCode = fs.readFileSync('src/Mã.js', 'utf8');

// ── Mock môi trường Google Apps Script / Google Sheets ──
class MockSheet {
  constructor(name, headers) {
    this.name = name;
    this.headers = headers ? [...headers] : [];
    this.data = []; // Row 0 is index 0 (Sheet Row 1).
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
    // rowIdx is 1-based (Sheet row number)
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
      },
      setNumberFormat() {}
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

// ── Tạo VM Sandbox nạp trực tiếp toàn bộ src/Mã.js ──
const sandboxProperties = {
  ADMIN_KEY: 'secret_test_admin_key'
};

const activeSpreadsheet = new MockSpreadsheet();

const sandbox = {
  PropertiesService: {
    getScriptProperties() {
      return {
        getProperty(k) {
          return sandboxProperties[k] || null;
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
  Logger: {
    log() {}
  },
  console: console,
  Date: Date,
  Math: Math,
  Number: Number,
  String: String,
  JSON: JSON,
  parseInt: parseInt,
  parseFloat: parseFloat,
  Infinity: Infinity
};

vm.createContext(sandbox);
vm.runInContext(srcCode, sandbox);

// ── Verify rằng tất cả các hàm cần test đều chạy trực tiếp từ VM ──
assert.equal(typeof sandbox.setVipStatus, 'function', 'setVipStatus phải có trong VM');
assert.equal(typeof sandbox.deleteAccount, 'function', 'deleteAccount phải có trong VM');
assert.equal(typeof sandbox.pingAdmin, 'function', 'pingAdmin phải có trong VM');
assert.equal(typeof sandbox.doPost, 'function', 'doPost phải có trong VM');
assert.equal(typeof sandbox.requireAdmin, 'function', 'requireAdmin phải có trong VM');

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log(`PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

function resetDatabase() {
  activeSpreadsheet.sheets.clear();
  
  // 1. TaiKhoan (Header ở dòng 1)
  const tk = sandbox.getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  tk.appendRow(['0999999999', 'Hoc Sinh Test', '12', 'pass123', '2026-08-27', 100, 50, 'free', 0, false, true, false]);
  tk.appendRow(['0988888888', 'Hoc Sinh That', '12', 'pass456', '2026-08-27', 200, 80, 'vip', 12345678, false, true, false]);

  // 2. TienDo
  const td = sandbox.getOrCreate('TienDo', ['sdt','lesson','khoa','ten','lop','ngay']);
  td.appendRow(['0999999999', 'L1', 'K12', 'Bai 1', '12', '2026-08-27']);
  td.appendRow(['0988888888', 'L1', 'K12', 'Bai 1', '12', '2026-08-27']);

  // 3. BangVang
  const bv = sandbox.getOrCreate('BangVang', ['name','studentClass','phone','score','timestamp']);
  bv.appendRow(['Hoc Sinh Test', '12', '0999999999', 10, '2026-08-27']);
  bv.appendRow(['Hoc Sinh That', '12', '0988888888', 9, '2026-08-27']);

  // 4. NhiemVu
  const nv = sandbox.getOrCreate('NhiemVu', ['sdt','nhipHoc','conTro','lastMissionDate','startDate','chuoiDung','tongDiemDuaTop']);
  nv.appendRow(['0999999999', 1, 1, '2026-08-27', '2026-08-27', 5, 50]);
  nv.appendRow(['0988888888', 2, 2, '2026-08-27', '2026-08-27', 10, 100]);

  // 5. HoatDong
  const hd = sandbox.getOrCreate('HoatDong', ['sdt','thoigian','hanhdong','chitiet']);
  hd.appendRow(['0999999999', '2026-08-27', 'login', 'dang nhap']);
  hd.appendRow(['0988888888', '2026-08-27', 'login', 'dang nhap']);
}

// ── 1. Kiểm thử xác thực ADMIN_KEY (thiếu / sai / đúng) ──
await test('1. setVipStatus từ chối khi thiếu adminKey', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ sdt: '0999999999', loaiTK: 'premium' });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unauthorized');
});

await test('2. setVipStatus từ chối khi sai adminKey', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ adminKey: 'wrong_key', sdt: '0999999999', loaiTK: 'premium' });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unauthorized');
});

await test('3. setVipStatus chấp nhận khi đúng adminKey', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'premium' });
  assert.equal(res.ok, true);
});

await test('4. deleteAccount từ chối khi thiếu adminKey', () => {
  resetDatabase();
  const res = sandbox.deleteAccount({ sdt: '0999999999' });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unauthorized');
});

await test('5. deleteAccount từ chối khi sai adminKey', () => {
  resetDatabase();
  const res = sandbox.deleteAccount({ adminKey: 'wrong_key', sdt: '0999999999' });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unauthorized');
});

// ── 2. Kiểm thử 3 trạng thái setVipStatus & kiểm tra chặt chẽ tham số days ──
await test('6. setVipStatus premium -> trialExpiry = 0 (không phụ thuộc days)', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'premium', days: -99 });
  assert.equal(res.ok, true);
  const tk = activeSpreadsheet.getSheetByName('TaiKhoan');
  const targetRow = tk.getRange(2, 1, 1, 12).getValues()[0];
  assert.equal(targetRow[7], 'premium');
  assert.equal(targetRow[8], 0, 'trialExpiry của premium phải là 0');
});

await test('7. setVipStatus free -> trialExpiry = 0 (không phụ thuộc days)', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'free', days: -50 });
  assert.equal(res.ok, true);
  const tk = activeSpreadsheet.getSheetByName('TaiKhoan');
  const targetRow = tk.getRange(2, 1, 1, 12).getValues()[0];
  assert.equal(targetRow[7], 'free');
  assert.equal(targetRow[8], 0, 'trialExpiry của free phải là 0');
});

await test('8. setVipStatus vip -> trialExpiry > 0 theo số ngày hợp lệ', () => {
  resetDatabase();
  const before = Date.now();
  const res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'vip', days: 30 });
  assert.equal(res.ok, true);
  const tk = activeSpreadsheet.getSheetByName('TaiKhoan');
  const targetRow = tk.getRange(2, 1, 1, 12).getValues()[0];
  assert.equal(targetRow[7], 'vip');
  assert.ok(targetRow[8] >= before + 30 * 24 * 60 * 60 * 1000 - 1000, 'trialExpiry phải khớp 30 ngày');
});

await test('9. setVipStatus vip từ chối days <= 0, không phải số hoặc vượt 3650', () => {
  resetDatabase();
  // days = 0
  let res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'vip', days: 0 });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Số ngày VIP không hợp lệ (phải từ 1 đến 3650).');

  // days âm
  res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'vip', days: -5 });
  assert.equal(res.ok, false);

  // days không phải số
  res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'vip', days: 'abc' });
  assert.equal(res.ok, false);

  // days vượt 3650 (10 năm)
  res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'vip', days: 9999 });
  assert.equal(res.ok, false);
});

// ── 3. Kiểm thử dọn đủ 5 sheet khi deleteAccount và KHÔNG xóa tài khoản khác ──
await test('10. deleteAccount dọn sạch cả 5 sheet liên quan của tài khoản đích và giữ nguyên tài khoản khác', () => {
  resetDatabase();
  const res = sandbox.deleteAccount({ adminKey: 'secret_test_admin_key', sdt: '0999999999' });
  assert.equal(res.ok, true);

  const tk = activeSpreadsheet.getSheetByName('TaiKhoan');
  const td = activeSpreadsheet.getSheetByName('TienDo');
  const bv = activeSpreadsheet.getSheetByName('BangVang');
  const nv = activeSpreadsheet.getSheetByName('NhiemVu');
  const hd = activeSpreadsheet.getSheetByName('HoatDong');

  // Sheet TaiKhoan chỉ còn 1 header + 1 user còn lại (tổng 2 dòng)
  assert.equal(tk.getLastRow(), 2);
  assert.equal(tk.getRange(2, 1, 1, 1).getValues()[0][0], '0988888888');

  // Sheet TienDo chỉ còn user còn lại (tổng 2 dòng)
  assert.equal(td.getLastRow(), 2);
  assert.equal(td.getRange(2, 1, 1, 1).getValues()[0][0], '0988888888');

  // Sheet BangVang chỉ còn user còn lại (phone cột 3, tổng 2 dòng)
  assert.equal(bv.getLastRow(), 2);
  assert.equal(bv.getRange(2, 3, 1, 1).getValues()[0][0], '0988888888');

  // Sheet NhiemVu chỉ còn user còn lại (tổng 2 dòng)
  assert.equal(nv.getLastRow(), 2);
  assert.equal(nv.getRange(2, 1, 1, 1).getValues()[0][0], '0988888888');

  // Sheet HoatDong chỉ còn user còn lại (tổng 2 dòng)
  assert.equal(hd.getLastRow(), 2);
  assert.equal(hd.getRange(2, 1, 1, 1).getValues()[0][0], '0988888888');
});

// ── 4. Kiểm thử Unknown action và thiếu action không ghi dữ liệu ──
await test('11. doPost từ chối unknown action, không gọi saveScore và không ghi dữ liệu', () => {
  resetDatabase();
  const res = sandbox.doPost({ postData: { contents: JSON.stringify({ action: 'some_bad_action', score: 10 }) } });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unknown action');

  // Kiểm tra không có dòng mới nào trong BangVang
  const bv = activeSpreadsheet.getSheetByName('BangVang');
  assert.equal(bv.getLastRow(), 3); // 1 header + 2 dòng ban đầu
});

await test('12. doPost từ chối payload thiếu action', () => {
  resetDatabase();
  const res = sandbox.doPost({ postData: { contents: JSON.stringify({ score: 10 }) } });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unknown action');
});

console.log(`\n${passed} test đặc trưng trực tiếp từ src/Mã.js đã hoàn thành 100%!`);
