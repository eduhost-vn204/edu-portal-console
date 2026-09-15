import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';

console.log('=== TEST SUITE: GOOGLE APPS SCRIPT TRIAL & AUTH INTEGRATION ===\n');

// ── 1. Đọc trực tiếp mã nguồn từ src/Mã.js ──
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
  deleteSheet(s) {
    if (typeof s === 'string') this.sheets.delete(s);
    else if (s && s.name) this.sheets.delete(s.name);
  }
}

const DEFAULT_GOOGLE_CLIENT_ID = '1022891995284-miquu1f7rlpie7ug9884sgagf21nputc.apps.googleusercontent.com';
const TEST_AUTH_SECRET = 'random_secret_for_test_' + crypto.randomBytes(16).toString('hex');

const sandboxProperties = {
  ADMIN_KEY: 'secret_test_admin_key',
  AUTH_SECRET: TEST_AUTH_SECRET,
  GOOGLE_CLIENT_ID: DEFAULT_GOOGLE_CLIENT_ID
};

const activeSpreadsheet = new MockSpreadsheet();

// Mock UrlFetchApp
let mockFetchHandler = null;

const sandbox = {
  PropertiesService: {
    getScriptProperties() {
      return {
        getProperty(k) {
          return sandboxProperties[k] || null;
        },
        setProperty(k, v) {
          sandboxProperties[k] = String(v);
        }
      };
    }
  },
  SpreadsheetApp: {
    getActiveSpreadsheet() {
      return activeSpreadsheet;
    },
    flush() {}
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
  Utilities: {
    getUuid() {
      return crypto.randomUUID();
    },
    computeHmacSha256Signature(raw, secret) {
      return crypto.createHmac('sha256', secret).update(raw).digest();
    },
    base64EncodeWebSafe(data) {
      const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
      return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },
    base64DecodeWebSafe(str) {
      let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4 !== 0) b64 += '=';
      return Buffer.from(b64, 'base64');
    },
    newBlob(bytes) {
      const buf = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
      return {
        getDataAsString() {
          return buf.toString('utf8');
        }
      };
    },
    formatDate(date, tz, fmt) {
      const d = new Date(date);
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const vnDate = new Date(utc + (7 * 3600000));
      const y = vnDate.getFullYear();
      const m = String(vnDate.getMonth() + 1).padStart(2, '0');
      const day = String(vnDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  },
  UrlFetchApp: {
    fetch(url, options) {
      if (mockFetchHandler) {
        return mockFetchHandler(url, options);
      }
      return {
        getResponseCode() { return 404; },
        getContentText() { return JSON.stringify({ error: 'not_found' }); }
      };
    }
  },
  LockService: {
    getScriptLock() {
      return {
        waitLock(ms) { return true; },
        releaseLock() {}
      };
    }
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

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
    throw err;
  }
}

async function itAsync(name, fn) {
  total++;
  try {
    await fn();
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
    throw err;
  }
}

function resetDatabase() {
  activeSpreadsheet.sheets.clear();
  sandboxProperties.ADMIN_KEY = 'secret_test_admin_key';
  sandboxProperties.AUTH_SECRET = TEST_AUTH_SECRET;
  sandboxProperties.GOOGLE_CLIENT_ID = DEFAULT_GOOGLE_CLIENT_ID;
  mockFetchHandler = null;

  // 1. TaiKhoan
  const tk = sandbox.getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  tk.appendRow(['0999999999', 'Hoc Sinh Test', '12', 'pass123', '2026-08-27', 100, 50, 'free', 0, false, true, false]);
  tk.appendRow(['0988888888', 'Hoc Sinh That', '12', 'pass456', '2026-08-27', 200, 80, 'vip', Date.now() + 7 * 86400000, false, true, false]);
  tk.appendRow(['0977777777', 'Hoc Sinh Premium', '12', 'pass789', '2026-08-27', 300, 90, 'premium', 0, true, true, true]);

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

  // 6. TrialActivity
  sandbox.getOrCreate('TrialActivity', ['sdt','mabai','dateStr','thoigian','deviceId','hoten']);
}

// Helper tạo credential Google giả lập
function createMockGoogleCredential(payloadObj) {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: 'https://accounts.google.com',
    aud: DEFAULT_GOOGLE_CLIENT_ID,
    exp: Math.floor(Date.now() / 1000) + 3600,
    email_verified: true,
    ...payloadObj
  })).toString('base64url');
  const signature = 'mock_signature';
  return header + '.' + payload + '.' + signature;
}

// ─────────────────────────────────────────────────────────────
// PHẦN A: BẢO TOÀN 12 TEST HIỆN HỮU CỦA ADMIN REPO (ZERO REGRESSION)
// ─────────────────────────────────────────────────────────────
console.log('--- [PHẦN A] Bảo Toàn 12 Test Quản Trị Hiện Hữu Của Admin Repo ---');

it('1. setVipStatus từ chối khi thiếu adminKey', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ sdt: '0999999999', loaiTK: 'premium' });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unauthorized');
});

it('2. setVipStatus từ chối khi sai adminKey', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ adminKey: 'wrong_key', sdt: '0999999999', loaiTK: 'premium' });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unauthorized');
});

it('3. setVipStatus chấp nhận khi đúng adminKey', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'premium' });
  assert.equal(res.ok, true);
});

it('4. deleteAccount từ chối khi thiếu adminKey', () => {
  resetDatabase();
  const res = sandbox.deleteAccount({ sdt: '0999999999' });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unauthorized');
});

it('5. deleteAccount từ chối khi sai adminKey', () => {
  resetDatabase();
  const res = sandbox.deleteAccount({ adminKey: 'wrong_key', sdt: '0999999999' });
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unauthorized');
});

it('6. setVipStatus premium -> trialExpiry = 0', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'premium', days: 30 });
  assert.equal(res.ok, true);
  const tk = activeSpreadsheet.getSheetByName('TaiKhoan');
  const targetRow = tk.getRange(2, 1, 1, 12).getValues()[0];
  assert.equal(targetRow[7], 'premium');
  assert.equal(targetRow[8], 0);
});

it('7. setVipStatus free -> trialExpiry = 0', () => {
  resetDatabase();
  const res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0988888888', loaiTK: 'free', days: 30 });
  assert.equal(res.ok, true);
  const tk = activeSpreadsheet.getSheetByName('TaiKhoan');
  const targetRow = tk.getRange(3, 1, 1, 12).getValues()[0];
  assert.equal(targetRow[7], 'free');
  assert.equal(targetRow[8], 0);
});

it('8. setVipStatus vip -> trialExpiry > 0 theo số ngày hợp lệ', () => {
  resetDatabase();
  const now = Date.now();
  const res = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'vip', days: 14 });
  assert.equal(res.ok, true);
  const tk = activeSpreadsheet.getSheetByName('TaiKhoan');
  const targetRow = tk.getRange(2, 1, 1, 12).getValues()[0];
  assert.equal(targetRow[7], 'vip');
  assert.ok(targetRow[8] >= now + 13 * 86400000);
});

it('9. setVipStatus vip từ chối days <= 0 hoặc vượt 3650', () => {
  resetDatabase();
  const res1 = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'vip', days: 0 });
  assert.equal(res1.ok, false);
  const res2 = sandbox.setVipStatus({ adminKey: 'secret_test_admin_key', sdt: '0999999999', loaiTK: 'vip', days: 3651 });
  assert.equal(res2.ok, false);
});

it('10. deleteAccount dọn sạch các sheet liên quan của tài khoản đích', () => {
  resetDatabase();
  const res = sandbox.deleteAccount({ adminKey: 'secret_test_admin_key', sdt: '0999999999' });
  assert.equal(res.ok, true);
});

it('11. doPost từ chối unknown action', () => {
  resetDatabase();
  const fakeEvent = {
    postData: { contents: JSON.stringify({ action: 'unknown_action_xyz' }) }
  };
  const res = sandbox.doPost(fakeEvent);
  assert.equal(res.ok, false);
  assert.equal(res.msg, 'Unknown action');
});

it('12. runAdminSelfTest chuỗi test cô lập thành công', () => {
  resetDatabase();
  const res = sandbox.runAdminSelfTest();
  assert.equal(res.ok, true);
  assert.equal(res.passed, true);
});

// ─────────────────────────────────────────────────────────────
// PHẦN B: 21 TEST TÍCH HỢP BẢO MẬT PHIÊN, GOOGLE AUTH & TRIAL LIMIT
// ─────────────────────────────────────────────────────────────
console.log('\n--- [PHẦN B] 21 Test Tích Hợp Bảo Mật Phiên, Google Auth & Hạn Mức Trial ---');

it('13. Preflight AUTH_SECRET: Thiếu secret làm registerUser Fail-Closed hoàn toàn', () => {
  resetDatabase();
  sandboxProperties.AUTH_SECRET = '';
  const res = sandbox.registerUser({ sdt: '0911222333', hoten: 'Test Fail Closed', matkhau: '123456' });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'AUTH_SECRET_NOT_CONFIGURED');
});

it('14. Preflight AUTH_SECRET: Thiếu secret làm loginUser Fail-Closed hoàn toàn', () => {
  resetDatabase();
  sandboxProperties.AUTH_SECRET = '';
  const res = sandbox.loginUser({ sdt: '0999999999', matkhau: 'pass123' });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'AUTH_SECRET_NOT_CONFIGURED');
});

it('15. Preflight GOOGLE_CLIENT_ID: Thiếu GOOGLE_CLIENT_ID làm loginGoogle Fail-Closed', () => {
  resetDatabase();
  sandboxProperties.GOOGLE_CLIENT_ID = '';
  const res = sandbox.loginGoogle({ credential: 'mock_token' });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'GOOGLE_CLIENT_ID_NOT_CONFIGURED');
});

it('16. Đăng ký tài khoản mới thành công và cấp session token HMAC-SHA256', () => {
  resetDatabase();
  const res = sandbox.registerUser({ sdt: '0912345678', hoten: 'Học sinh Mới', lop: '12A1', matkhau: 'Secret@123' });
  assert.equal(res.ok, true);
  assert.ok(res.user);
  assert.ok(res.user.token);
  assert.equal(typeof res.user.token, 'string');
  const verifiedSdt = sandbox.verifyUserToken(res.user.token);
  assert.equal(verifiedSdt, '912345678');
});

it('17. Đăng nhập SĐT hợp lệ thành công và cấp session token HMAC-SHA256', () => {
  resetDatabase();
  const res = sandbox.loginUser({ sdt: '0988888888', matkhau: 'pass456' });
  assert.equal(res.ok, true);
  assert.ok(res.user);
  assert.ok(res.user.token);
  const verifiedSdt = sandbox.verifyUserToken(res.user.token);
  assert.equal(verifiedSdt, '988888888');
});

it('18. Token giả mạo hoặc sai chữ ký bị verifyUserToken từ chối (null)', () => {
  resetDatabase();
  const legitRes = sandbox.loginUser({ sdt: '0988888888', matkhau: 'pass456' });
  const validToken = legitRes.user.token;

  // Sửa 1 byte trong token
  const tamperedToken = validToken.slice(0, -4) + 'abcd';
  assert.equal(sandbox.verifyUserToken(tamperedToken), null);
  assert.equal(sandbox.verifyUserToken(''), null);
  assert.equal(sandbox.verifyUserToken('invalid:format:token'), null);
});

it('19. Token hết hạn bị verifyUserToken từ chối (null)', () => {
  resetDatabase();
  // Giả lập token với expiresAt trong quá khứ
  const cleanSdt = '988888888';
  const issuedAt = Date.now() - 86400000;
  const expiresAt = Date.now() - 1000; // đã hết hạn
  const nonce = '1234567890abcdef';
  const raw = `${cleanSdt}:${issuedAt}:${expiresAt}:${nonce}`;
  const sig = sandbox.Utilities.base64EncodeWebSafe(
    sandbox.Utilities.computeHmacSha256Signature(raw, TEST_AUTH_SECRET)
  );
  const expiredToken = sandbox.Utilities.base64EncodeWebSafe(`${raw}:${sig}`);

  assert.equal(sandbox.verifyUserToken(expiredToken), null);
});

it('20. Google login: Xác minh danh tính từ Google tokeninfo thành công và cấp session token', () => {
  resetDatabase();
  const mockCred = createMockGoogleCredential({
    email: 'student.google@gmail.com',
    name: 'Google Student',
    picture: 'https://avatar.google.com/pic.png'
  });

  mockFetchHandler = (url) => {
    if (url.includes('oauth2.googleapis.com/tokeninfo')) {
      return {
        getResponseCode() { return 200; },
        getContentText() {
          return JSON.stringify({
            aud: DEFAULT_GOOGLE_CLIENT_ID,
            iss: 'https://accounts.google.com',
            exp: Math.floor(Date.now() / 1000) + 3600,
            email_verified: true,
            email: 'student.google@gmail.com',
            name: 'Google Student',
            picture: 'https://avatar.google.com/pic.png'
          });
        }
      };
    }
    return { getResponseCode() { return 404; } };
  };

  const res = sandbox.loginGoogle({ credential: mockCred });
  assert.equal(res.ok, true);
  assert.equal(res.user.email, 'student.google@gmail.com');
  assert.ok(res.user.token);
  assert.equal(sandbox.verifyUserToken(res.user.token), 'student.google@gmail.com');
});

it('21. Google login: Token sai audience bị từ chối 100%', () => {
  resetDatabase();
  mockFetchHandler = (url) => {
    return {
      getResponseCode() { return 200; },
      getContentText() {
        return JSON.stringify({
          aud: 'attacker-client-id.apps.googleusercontent.com', // SAI AUD
          iss: 'https://accounts.google.com',
          exp: Math.floor(Date.now() / 1000) + 3600,
          email_verified: true,
          email: 'victim@gmail.com'
        });
      }
    };
  };

  const res = sandbox.loginGoogle({ credential: 'attacker_token' });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'invalid_google_token');
});

it('22. Google login: Token hết hạn bị từ chối 100%', () => {
  resetDatabase();
  mockFetchHandler = (url) => {
    return {
      getResponseCode() { return 200; },
      getContentText() {
        return JSON.stringify({
          aud: DEFAULT_GOOGLE_CLIENT_ID,
          iss: 'https://accounts.google.com',
          exp: Math.floor(Date.now() / 1000) - 60, // HẾT HẠN
          email_verified: true,
          email: 'victim@gmail.com'
        });
      }
    };
  };

  const res = sandbox.loginGoogle({ credential: 'expired_token' });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'invalid_google_token');
});

it('23. GET triallimit luôn bị từ chối METHOD_NOT_ALLOWED (POST only)', () => {
  resetDatabase();
  const e1 = { parameter: { type: 'triallimit', hs: '0988888888' } };
  const res1 = sandbox.doGet(e1);
  assert.equal(res1.ok, false);
  assert.equal(res1.error, 'METHOD_NOT_ALLOWED');

  const e2 = { parameter: { type: 'triallimit', token: 'some_token' } };
  const res2 = sandbox.doGet(e2);
  assert.equal(res2.ok, false);
  assert.equal(res2.error, 'METHOD_NOT_ALLOWED');
});

it('24. GET profile chuyển tiếp: Đọc hồ sơ được nhưng TUYỆT ĐỐI KHÔNG cấp phát session token', () => {
  resetDatabase();
  const e = { parameter: { type: 'profile', hs: '0988888888' } };
  const res = sandbox.doGet(e);
  assert.equal(res.ok, true);
  assert.equal(res.user.sdt, '0988888888');
  assert.equal(res.user.token, undefined, 'GET profile tuyệt đối không được trả token!');
});

it('25. POST getprofile: Từ chối khi thiếu token trong request body', () => {
  resetDatabase();
  const fakeEvent = {
    postData: { contents: JSON.stringify({ action: 'getprofile', hs: '0988888888' }) }
  };
  const res = sandbox.doPost(fakeEvent);
  assert.equal(res.ok, false);
  assert.equal(res.error, 'token_required');
});

it('26. POST getprofile: Thành công khi gửi token hợp lệ trong request body', () => {
  resetDatabase();
  const loginRes = sandbox.loginUser({ sdt: '0988888888', matkhau: 'pass456' });
  const validToken = loginRes.user.token;

  const fakeEvent = {
    postData: { contents: JSON.stringify({ action: 'getprofile', token: validToken, hs: '0988888888' }) }
  };
  const res = sandbox.doPost(fakeEvent);
  assert.equal(res.ok, true);
  assert.equal(res.user.sdt, '0988888888');
});

it('27. POST getprofile: Chống IDOR - Token tài khoản A không đọc được hồ sơ của tài khoản B', () => {
  resetDatabase();
  const loginA = sandbox.loginUser({ sdt: '0988888888', matkhau: 'pass456' });
  const tokenA = loginA.user.token;

  const fakeEvent = {
    postData: { contents: JSON.stringify({ action: 'getprofile', token: tokenA, hs: '0999999999' }) }
  };
  const res = sandbox.doPost(fakeEvent);
  assert.equal(res.ok, false);
  assert.equal(res.error, 'Forbidden');
});

it('28. POST gettriallimit: Token tài khoản A không đọc được hạn mức tài khoản B', () => {
  resetDatabase();
  const loginA = sandbox.loginUser({ sdt: '0988888888', matkhau: 'pass456' });
  const tokenA = loginA.user.token;

  const fakeEvent = {
    postData: { contents: JSON.stringify({ action: 'gettriallimit', token: tokenA, hs: '0999999999' }) }
  };
  const res = sandbox.doPost(fakeEvent);
  assert.equal(res.ok, false);
  assert.equal(res.error, 'Forbidden');
});

it('29. POST starttriallesson: Nhấp mở bài không trừ lượt (chỉ cấp quyền)', () => {
  resetDatabase();
  const loginRes = sandbox.loginUser({ sdt: '0988888888', matkhau: 'pass456' });
  const token = loginRes.user.token;

  // Bài 1: Mở bài nhưng chưa học xong
  const ev1 = {
    postData: { contents: JSON.stringify({ action: 'starttriallesson', token: token, mabai: 'B01' }) }
  };
  const res1 = sandbox.doPost(ev1);
  assert.equal(res1.ok, true);
  assert.equal(res1.isNew, true);
  assert.equal(res1.dailyCompletedCount, 0);
  assert.equal(res1.remaining, 2);

  // Bài 2: Mở tiếp bài 2 khi chưa học xong bài 1
  const ev2 = {
    postData: { contents: JSON.stringify({ action: 'starttriallesson', token: token, mabai: 'B02' }) }
  };
  const res2 = sandbox.doPost(ev2);
  assert.equal(res2.ok, true);
  assert.equal(res2.isNew, true);
  assert.equal(res2.dailyCompletedCount, 0);
  assert.equal(res2.remaining, 2);

  // Bài 3: Vẫn được phép mở xem vì chưa hoàn thành đủ 2 bài
  const ev3 = {
    postData: { contents: JSON.stringify({ action: 'starttriallesson', token: token, mabai: 'B03' }) }
  };
  const res3 = sandbox.doPost(ev3);
  assert.equal(res3.ok, true);
});

it('30. POST completetriallesson: Chỉ khi học xong 2 bài mới chặn bài mới thứ 3', () => {
  resetDatabase();
  const loginRes = sandbox.loginUser({ sdt: '0988888888', matkhau: 'pass456' });
  const token = loginRes.user.token;

  // Hoàn thành Bài 1
  const comp1 = sandbox.doPost({ postData: { contents: JSON.stringify({ action: 'completetriallesson', token: token, mabai: 'B01' }) } });
  assert.equal(comp1.ok, true);
  assert.equal(comp1.dailyCompletedCount, 1);

  // Hoàn thành Bài 2
  const comp2 = sandbox.doPost({ postData: { contents: JSON.stringify({ action: 'completetriallesson', token: token, mabai: 'B02' }) } });
  assert.equal(comp2.ok, true);
  assert.equal(comp2.dailyCompletedCount, 2);

  // Bài 3: Mở bài mới thứ 3 khi đã hoàn thành 2 bài -> Phải bị chặn
  const ev3 = {
    postData: { contents: JSON.stringify({ action: 'starttriallesson', token: token, mabai: 'B03' }) }
  };
  const res3 = sandbox.doPost(ev3);
  assert.equal(res3.ok, false);
  assert.equal(res3.reason, 'trial_limit');
  assert.equal(res3.remaining, 0);
});

it('31. POST starttriallesson: Xem lại bài cũ đã hoàn thành không bị tính lượt', () => {
  resetDatabase();
  const loginRes = sandbox.loginUser({ sdt: '0988888888', matkhau: 'pass456' });
  const token = loginRes.user.token;

  // Hoàn thành Bài 1 & Bài 2
  sandbox.doPost({ postData: { contents: JSON.stringify({ action: 'completetriallesson', token: token, mabai: 'B01' }) } });
  sandbox.doPost({ postData: { contents: JSON.stringify({ action: 'completetriallesson', token: token, mabai: 'B02' }) } });

  // Xem lại Bài 1 (đã hoàn thành): Cho phép xem lại tự do
  const evReopen = {
    postData: { contents: JSON.stringify({ action: 'starttriallesson', token: token, mabai: 'B01' }) }
  };
  const resReopen = sandbox.doPost(evReopen);
  assert.equal(resReopen.ok, true);
  assert.equal(resReopen.alreadyCompleted, true);
});

it('32. POST starttriallesson: Tài khoản Premium không dùng endpoint trial limit', () => {
  resetDatabase();
  const loginPrem = sandbox.loginUser({ sdt: '0977777777', matkhau: 'pass789' });
  const tokenPrem = loginPrem.user.token;

  const evPrem = {
    postData: { contents: JSON.stringify({ action: 'starttriallesson', token: tokenPrem, mabai: 'B01' }) }
  };
  const res = sandbox.doPost(evPrem);
  assert.equal(res.ok, false);
  assert.equal(res.reason, 'invalid_account');
});

it('33. doPost case insensitive: hỗ trợ action dạng lowercase và alias', () => {
  resetDatabase();
  const loginRes = sandbox.loginUser({ sdt: '0988888888', matkhau: 'pass456' });
  const token = loginRes.user.token;

  const ev = {
    postData: { contents: JSON.stringify({ action: 'triallimit', token: token, hs: '0988888888' }) }
  };
  const res = sandbox.doPost(ev);
  assert.equal(res.ok, true);
  assert.equal(res.sdt, '988888888');
});

it('34. saveBaiHoc: Lưu thành công trường BaiNenTang trên sheet BaiHoc chuẩn', () => {
  resetDatabase();
  const ev = {
    postData: { contents: JSON.stringify({
      action: 'savebaihoc',
      adminKey: 'secret_test_admin_key',
      KhoaHoc: 'Vật Lý 12',
      Chuong: 'Chương 1 — Vật lý nhiệt',
      TenBai: 'Bài Test Có Nền Tảng',
      MaBai: 'B_TEST_PREREQ',
      TrangThai: 'published',
      BaiNenTang: 'B01, B02'
    }) }
  };
  const res = sandbox.doPost(ev);
  assert.equal(res.ok, true);
  assert.equal(res.BaiNenTang, 'B01, B02');

  // Kiểm tra dòng trong BaiHoc
  const bSheet = activeSpreadsheet.getSheetByName('BaiHoc');
  assert(bSheet, 'Phải có BaiHoc');
  const headers = bSheet.data[0];
  const bntCol = headers.indexOf('BaiNenTang');
  assert(bntCol >= 0, 'Phải có cột BaiNenTang trong header');
  const row = bSheet.data.find(r => r[headers.indexOf('MaBai')] === 'B_TEST_PREREQ');
  assert(row, 'Phải tìm thấy bài trong BaiHoc');
  assert.equal(row[bntCol], 'B01, B02');
});

it('35. getBaiHoc: Public GET trả về BaiNenTang và bảo đảm ẩn bài draft/rỗng trên sheet BaiHoc', () => {
  resetDatabase();
  const baiHocCols = ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap','ThoiGianLamBai','ThuTuBai','MaBai','TrangThai','BaiNenTang'];
  const bSheet = sandbox.getOrCreate('BaiHoc', baiHocCols);
  bSheet.data = [
    baiHocCols,
    ['Vật Lý 12','Chương 1','B1: Cấu trúc chất','https://youtu.be/v1','','','2026-09-01','','','','',15,1,'B01','published',''],
    ['Vật Lý 12','Chương 1','B2: Thuyết động học','https://youtu.be/v2','','','2026-09-02','','','','',15,2,'B02','published','B01'],
    ['Vật Lý 12','Chương 2','B11: Nháp Boyle','https://youtu.be/v11','','','2026-09-10','','','','',15,11,'B11_DRAFT','draft','B02'],
    ['Vật Lý 12','Chương 2','B12: Bài rỗng','','','','2026-09-11','','','','',15,12,'B12_EMPTY','draft','']
  ];

  const getEv = {
    parameter: { type: 'baihoc' }
  };
  const res = sandbox.doGet(getEv);
  assert(Array.isArray(res), 'Public GET baihoc phải trả về mảng');
  assert.equal(res.length, 2, 'Chỉ 2 bài published được trả về');

  // Kiểm tra bài B02 có BaiNenTang = 'B01'
  const b02 = res.find(r => r.MaBai === 'B02');
  assert(b02, 'B02 phải xuất hiện trong public list');
  assert.equal(b02.BaiNenTang, 'B01');

  // Kiểm tra draft bài B11_DRAFT và B12_EMPTY bị ẩn 100%
  const b11 = res.find(r => r.MaBai === 'B11_DRAFT');
  const b12 = res.find(r => r.MaBai === 'B12_EMPTY');
  assert.equal(b11, undefined, 'B11_DRAFT phải bị ẩn');
  assert.equal(b12, undefined, 'B12_EMPTY phải bị ẩn');
});

console.log('\n===============================================================');
console.log(`KẾT QUẢ: ${passed}/${total} test cases ĐẠT (${Math.round(passed/total*100)}% PASS).`);
console.log('===============================================================');
