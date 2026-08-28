import fs from 'node:fs';
import assert from 'node:assert/strict';

// Load the baseline remote code pulled from Google Apps Script
const baseline = fs.readFileSync('C:/Users/Xuan Truong/.gemini/antigravity/brain/3e3b1cf8-0576-48f3-a9cb-0d33ebf7f0bd/scratch/apps_script_backup/Mã.js', 'utf8');

let code = baseline;

// ── 1. Thêm helper chuẩn getAdminKey() và requireAdmin() ──
const adminHelpers = `
// ── Quản lý Khóa Quản trị Bảo mật ───────────────────────────
function getAdminKey() {
  return PropertiesService.getScriptProperties().getProperty('ADMIN_KEY') || '';
}

function requireAdmin(key) {
  const ADMIN_KEY = getAdminKey();
  const provided = String(key || '').trim();
  if (!ADMIN_KEY || !provided || provided !== ADMIN_KEY) {
    return false;
  }
  return true;
}
`;

code = code.replace('function getOrCreate(', adminHelpers + '\nfunction getOrCreate(');

// ── 2. doPost: Thêm pingadmin route và thay fallback saveScore bằng từ chối Unknown action ──
code = code.replace(
  "if (action === 'incrementlam')       return incrementLam(data);",
  "if (action === 'incrementlam')       return incrementLam(data);\n    if (action === 'pingadmin')          return pingAdmin(data);"
);

code = code.replace(
  "return saveScore(data);\n  } catch(err) {",
  "return jsonOut({ ok: false, msg: 'Unknown action' });\n  } catch(err) {"
);

// ── 3. Thêm hàm pingAdmin(data) ──
const pingAdminFunction = `
// ── POST Admin: Ping kiểm tra kết nối, CORS và quyền Admin (không đụng Sheets) ──
function pingAdmin(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  return jsonOut({ ok: true, ping: 'pong', ts: Date.now() });
}
`;

// ── 4. Sửa setVipStatus(data) chuẩn xác theo yêu cầu hotfix ──
const setVipStatusFunction = `
// ── POST admin: Đặt VIP cho học sinh ─────────────────────────
function setVipStatus(data) {
  // Dùng qua admin: { action:'setvipstatus', adminKey:..., sdt:..., loaiTK:'vip'|'free'|'premium', days:30 }
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows  = sheet.getDataRange().getValues();
  const target = String(data.sdt || '').trim();
  for (let i = 1; i < rows.length; i++) {
    if (sameTaiKhoan(rows[i][0], target)) {
      const loaiTK = ['free','vip','premium'].indexOf(String(data.loaiTK || '').toLowerCase()) !== -1
        ? String(data.loaiTK).toLowerCase() : 'vip';
      let days = 0;
      let expiry = 0;
      if (loaiTK === 'vip') {
        days = Number(data.days);
        if (!Number.isFinite(days) || days <= 0 || days > 3650) {
          return jsonOut({ ok: false, msg: 'Số ngày VIP không hợp lệ (phải từ 1 đến 3650).' });
        }
        expiry = Date.now() + days * 24 * 60 * 60 * 1000;
      }
      sheet.getRange(i + 1, 8).setValue(loaiTK);
      sheet.getRange(i + 1, 9).setValue(expiry);
      const han = loaiTK === 'premium' ? 'vĩnh viễn' : (loaiTK === 'free' ? 'miễn phí' : days + ' ngày');
      return jsonOut({ ok: true, msg: 'Đã cập nhật ' + target + ' → ' + loaiTK + ' (' + han + ')' });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy học sinh.' });
}
`;

// ── 5. Sửa getDanhSachTaiKhoan(e) ──
const getDanhSachTaiKhoanFunction = `
// ── GET Admin: Danh sách tài khoản học sinh ──────────────────
function getDanhSachTaiKhoan(e) {
  if (!requireAdmin(e.parameter.adminKey)) return jsonOut({ error: 'Unauthorized' });

  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows  = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    result.push({
      sdt:          rows[i][0],
      hoten:        rows[i][1],
      lop:          rows[i][2],
      ngayDK:       rows[i][4],
      lpTotal:      rows[i][5] || 0,
      loaiTK:       rows[i][7] || 'vip',
      trialExpiry:  rows[i][8] || 0,
      mienVideo:    !!(rows[i][9]),
      tracNghiemVideo: (rows[i][10] === false ? false : true),
      mienLuyenTap: !!(rows[i][11]),
    });
  }
  return jsonOut({ ok: true, data: result });
}
`;

// ── 6. Sửa getDanhSachThietBi(e) ──
const getDanhSachThietBiFunction = `
function getDanhSachThietBi(e) {
  if (!requireAdmin(e.parameter.adminKey)) return jsonOut({ error: 'Unauthorized' });
  const sheet = getOrCreate('ThietBiHocThu', ['deviceId','sdt','hoten','trialStart','trialExpiry','soLanChan']);
  const rows = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    result.push({
      deviceId:    rows[i][0],
      sdt:         dispSdt(rows[i][1]),
      hoten:       rows[i][2],
      trialStart:  rows[i][3],
      trialExpiry: rows[i][4],
      soLanChan:   rows[i][5] || 0
    });
  }
  return jsonOut({ ok: true, data: result });
}
`;

// ── 7. Sửa resetDevice(data) ──
const resetDeviceFunction = `
// ── POST Admin: Mở khoá thiết bị (cho học thử lại) ───────────
function resetDevice(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  const deviceId = String(data.deviceId || '').trim();
  if (!deviceId) return jsonOut({ ok: false, msg: 'Thiếu deviceId' });
  const sheet = getOrCreate('ThietBiHocThu', ['deviceId','sdt','hoten','trialStart','trialExpiry','soLanChan']);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === deviceId) {
      sheet.deleteRow(i + 1);
      return jsonOut({ ok: true, msg: 'Đã mở khoá thiết bị — học sinh có thể đăng ký học thử lại.' });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy thiết bị.' });
}
`;

// ── 8. Sửa deleteAccount(data) dọn dẹp liên hoàn cả 5 sheet ──
const deleteAccountFunction = `
// ── POST: Xóa tài khoản học sinh ─────────────────────────────
function deleteAccount(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  const sdt = String(data.sdt || '').trim();
  if (!sdt) return jsonOut({ ok: false, msg: 'Thiếu sdt' });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (sameTaiKhoan(rows[i][0], sdt)) {
      ['TienDo','BangVang','NhiemVu','HoatDong'].forEach(function(name){
        const related = ss.getSheetByName(name);
        if (!related || related.getLastRow() < 2) return;
        const values = related.getRange(2, 1, related.getLastRow() - 1, related.getLastColumn()).getValues();
        for (let row = values.length - 1; row >= 0; row--) {
          const accountCol = name === 'BangVang' ? 2 : 0;
          if (sameTaiKhoan(values[row][accountCol], sdt)) related.deleteRow(row + 2);
        }
      });
      sheet.deleteRow(i + 1);
      return jsonOut({ ok: true, msg: 'Đã xóa tài khoản và dữ liệu liên quan: ' + sdt });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy học sinh.' });
}
`;

// ── 9. Sửa getHoatDong(e) ──
const getHoatDongFunction = `
// ── GET Admin: lịch sử hoạt động của 1 học sinh (mới nhất trước) ──
function getHoatDong(e) {
  if (!requireAdmin(e.parameter.adminKey)) return jsonOut({ error: 'Unauthorized' });
  const hs = String(e.parameter.hs || '').trim();
  if (!hs) return jsonOut({ ok: false, msg: 'Thiếu hs' });
  const sheet = getOrCreate('HoatDong', ['sdt','thoigian','hanhdong','chitiet']);
  const rows  = sheet.getDataRange().getValues();
  const out = [];
  for (let i = rows.length - 1; i >= 1 && out.length < 200; i--) {
    if (sameTaiKhoan(rows[i][0], hs)) {
      out.push({ thoigian: rows[i][1], hanhdong: rows[i][2], chitiet: rows[i][3] });
    }
  }
  return jsonOut({ ok: true, data: out });
}
`;

// ── 10. Sửa updateAccount(data) ──
const updateAccountFunction = `
// ── POST Admin: sửa thông tin tài khoản (Lớp, Họ tên) ──
function updateAccount(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  const sdt = String(data.sdt || '').trim();
  if (!sdt) return jsonOut({ ok: false, msg: 'Thiếu sdt' });
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (sameTaiKhoan(rows[i][0], sdt)) {
      if (data.lop)   sheet.getRange(i + 1, 3).setValue(String(data.lop));
      if (data.mienVideo !== undefined) sheet.getRange(i + 1, 10).setValue(!!data.mienVideo);
      if (data.tracNghiemVideo !== undefined) sheet.getRange(i + 1, 11).setValue(!!data.tracNghiemVideo);
      if (data.mienLuyenTap !== undefined) sheet.getRange(i + 1, 12).setValue(!!data.mienLuyenTap);
      if (data.hoten) sheet.getRange(i + 1, 2).setValue(String(data.hoten));
      return jsonOut({ ok: true, msg: 'Đã cập nhật thông tin.' });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy học sinh.' });
}

// ── SERVER-SIDE SELF-TEST: Chạy nội bộ qua OAuth/clasp run (không in/trả secret) ──
function runAdminSelfTest() {
  const adminKey = getAdminKey();
  if (!adminKey) {
    return { ok: false, step: 'check_key', msg: 'ADMIN_KEY is not configured in Script Properties' };
  }

  const testSdt = '0999999999_selftest_' + Date.now();
  try {
    // 1. Tạo tài khoản test cô lập
    const tkSheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
    tkSheet.appendRow([testSdt, 'SelfTest User', '12', 'selftest_pass', new Date().toISOString(), 0, 0, 'free', 0, false, true, false]);

    // 2. Kiểm thử pingAdmin
    const pingRes = pingAdmin({ adminKey: adminKey });
    if (!pingRes || pingRes.ok !== true) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'ping_admin', msg: 'pingAdmin failed' };
    }

    // 3. Kiểm thử Premium (trialExpiry = 0)
    const premRes = setVipStatus({ adminKey: adminKey, sdt: testSdt, loaiTK: 'premium' });
    if (!premRes || premRes.ok !== true) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'set_premium', msg: 'setVipStatus premium failed' };
    }

    // 4. Kiểm thử VIP với số ngày (trialExpiry > 0)
    const vipRes = setVipStatus({ adminKey: adminKey, sdt: testSdt, loaiTK: 'vip', days: 30 });
    if (!vipRes || vipRes.ok !== true) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'set_vip', msg: 'setVipStatus vip failed' };
    }

    // 5. Kiểm thử Free (trialExpiry = 0)
    const freeRes = setVipStatus({ adminKey: adminKey, sdt: testSdt, loaiTK: 'free' });
    if (!freeRes || freeRes.ok !== true) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'set_free', msg: 'setVipStatus free failed' };
    }

    // 6. Ghi dữ liệu mẫu vào 4 sheet liên quan để test dọn dẹp
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    getOrCreate('TienDo', ['sdt','lesson','khoa','ten','lop','ngay']).appendRow([testSdt, 'L1', 'K12', 'Bai 1', '12', new Date().toISOString()]);
    getOrCreate('BangVang', ['name','studentClass','phone','score','timestamp']).appendRow(['SelfTest User', '12', testSdt, 10, new Date().toISOString()]);
    getOrCreate('NhiemVu', ['sdt','nhipHoc','conTro','lastMissionDate','startDate','chuoiDung','tongDiemDuaTop']).appendRow([testSdt, 1, 1, '2026-08-27', '2026-08-27', 1, 10]);
    getOrCreate('HoatDong', ['sdt','thoigian','hanhdong','chitiet']).appendRow([testSdt, new Date().toISOString(), 'selftest', 'running selftest']);

    // 7. Kiểm thử deleteAccount và dọn dẹp liên hoàn
    const delRes = deleteAccount({ adminKey: adminKey, sdt: testSdt });
    if (!delRes || delRes.ok !== true) {
      return { ok: false, step: 'delete_account', msg: 'deleteAccount failed' };
    }

    return { ok: true, passed: true };
  } catch (err) {
    try { deleteAccount({ adminKey: adminKey, sdt: testSdt }); } catch(e) {}
    return { ok: false, error: err.message };
  }
}
`;

// Thay thế chính xác từng khối hàm cũ trong remote code
// 1. setVipStatus
const oldSetVip = code.slice(
  code.indexOf('// ── POST admin: Đặt VIP cho học sinh ─────────────────────────'),
  code.indexOf('// ── GET Admin: Danh sách tài khoản học sinh ──────────────────')
);
code = code.replace(oldSetVip, pingAdminFunction.trim() + '\n\n' + setVipStatusFunction.trim() + '\n\n');

// 2. getDanhSachTaiKhoan
const oldGetDanhSachTaiKhoan = code.slice(
  code.indexOf('// ── GET Admin: Danh sách tài khoản học sinh ──────────────────'),
  code.indexOf('// ── GET Admin: Danh sách thiết bị đã dùng học thử ────────────')
);
code = code.replace(oldGetDanhSachTaiKhoan, getDanhSachTaiKhoanFunction.trim() + '\n\n');

// 3. getDanhSachThietBi
const oldGetDanhSachThietBi = code.slice(
  code.indexOf('function getDanhSachThietBi(e) {'),
  code.indexOf('// ── POST Admin: Mở khoá thiết bị (cho học thử lại) ───────────')
);
code = code.replace(oldGetDanhSachThietBi, getDanhSachThietBiFunction.trim() + '\n\n');

// 4. resetDevice
const oldResetDevice = code.slice(
  code.indexOf('// ── POST Admin: Mở khoá thiết bị (cho học thử lại) ───────────'),
  code.indexOf('// ── POST: Xóa tài khoản học sinh ─────────────────────────────')
);
code = code.replace(oldResetDevice, resetDeviceFunction.trim() + '\n\n');

// 5. deleteAccount
const oldDeleteAccount = code.slice(
  code.indexOf('// ── POST: Xóa tài khoản học sinh ─────────────────────────────'),
  code.indexOf('// ══════════════════════════════════════════════════════════════\n// NHIỆM VỤ HỌC MỖI NGÀY + ĐUA TOP  (v21)')
);
code = code.replace(oldDeleteAccount, deleteAccountFunction.trim() + '\n\n');

// 6. getHoatDong
const oldGetHoatDong = code.slice(
  code.indexOf('// ── GET Admin: lịch sử hoạt động của 1 học sinh (mới nhất trước) ──'),
  code.indexOf('// ── POST Admin: sửa thông tin tài khoản (Lớp, Họ tên) ──')
);
code = code.replace(oldGetHoatDong, getHoatDongFunction.trim() + '\n\n');

// 7. updateAccount
const oldUpdateAccount = code.slice(
  code.indexOf('// ── POST Admin: sửa thông tin tài khoản (Lớp, Họ tên) ──'),
  code.indexOf('// ─── MIGRATION MOT LAN')
);
code = code.replace(oldUpdateAccount, updateAccountFunction.trim() + '\n\n');

// Syntax check on the final code
new Function(code);
console.log('Final integrated code syntax: PASS');

fs.mkdirSync('src', { recursive: true });
fs.writeFileSync('src/Mã.js', code, 'utf8');
fs.copyFileSync('C:/Users/Xuan Truong/.gemini/antigravity/brain/3e3b1cf8-0576-48f3-a9cb-0d33ebf7f0bd/scratch/apps_script_backup/appsscript.json', 'src/appsscript.json');

fs.writeFileSync('apps-script-CAPNHAT.txt', code, 'utf8');
fs.copyFileSync('apps-script-CAPNHAT.txt', 'C:/Users/Xuan Truong/.gemini/antigravity/worktrees/_codex_friend_profile/admin_hotfix_cors_ping/apps-script-CAPNHAT.txt');

console.log('src/Mã.js and apps-script-CAPNHAT.txt integrated cleanly with verified patches!');
