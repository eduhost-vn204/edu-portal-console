import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log('=== TEST ADMIN FORM SAFETY & NON-DESTRUCTIVE READ FAILURE ===\n');

// Đọc mã nguồn thực tế từ quan-ly-bai-hoc.html
const htmlPath = path.resolve('quan-ly-bai-hoc.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Trích xuất các hàm và khối script liên quan
function createMockEnvironment(backendResponses = {}) {
  const domElements = {
    'btn-save-lesson': { disabled: false, innerHTML: '' },
    'fp-empty': { style: { display: 'block' } },
    'fp-form': { style: { display: 'none' } },
    'fp-title': { textContent: '' },
    'f-original-key': { value: '' },
    'f-original-ttb': { value: '' },
    'f-mabai': { value: '' },
    'f-lop': { value: 'Vật Lý 12' },
    'f-chuong': { value: 'Chương 1' },
    'f-tenbai': { value: 'Bài 1' },
    'f-video': { value: 'https://youtu.be/vid1' },
    'f-videogiai': { value: '' },
    'f-motabai': { value: '' },
    'f-pdf': { value: '' },
    'f-pdflt': { value: '' },
    'f-pdfluyentap': { value: '' },
    'f-thoigian': { value: '' },
    'f-trangthai': { value: 'published' },
    'f-ngaydang': { value: '2026-09-08' },
    'quiz-builder': { innerHTML: '' },
    'prev-video': { style: { display: 'none' } },
    'prev-giai': { style: { display: 'none' } },
    'form-panel': { scrollIntoView: () => {} },
    'vq-list': { innerHTML: '' }
  };

  const toasts = [];
  const writes = [];

  const sandbox = {
    console: {
      log: () => {},
      warn: () => {},
      error: () => {}
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    AbortController,
    URL,
    URLSearchParams,
    addEventListener: () => {},
    removeEventListener: () => {},
    requestAnimationFrame: (cb) => cb(),
    document: {
      addEventListener: () => {},
      removeEventListener: () => {},
      getElementById: (id) => {
        if (!domElements[id]) {
          domElements[id] = {
            id,
            style: {},
            value: '',
            textContent: '',
            innerHTML: '',
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            appendChild: () => {},
            removeChild: () => {},
            insertAdjacentHTML: () => {},
            addEventListener: () => {},
            removeEventListener: () => {}
          };
        }
        if (!domElements[id].addEventListener) domElements[id].addEventListener = () => {};
        if (!domElements[id].appendChild) domElements[id].appendChild = () => {};
        if (!domElements[id].removeChild) domElements[id].removeChild = () => {};
        if (!domElements[id].insertAdjacentHTML) domElements[id].insertAdjacentHTML = () => {};
        if (!domElements[id].classList) domElements[id].classList = { add: () => {}, remove: () => {}, contains: () => false };
        return domElements[id];
      },
      querySelector: (sel) => {
        if (sel === '.fp-body') {
          return {
            firstChild: null,
            insertBefore: (elem) => {
              domElements['fp-error-banner'] = elem;
            }
          };
        }
        return null;
      },
      querySelectorAll: (sel) => {
        if (sel === '#quiz-builder .qb-card') {
          return [];
        }
        return [];
      },
      createElement: (tag) => ({
        tagName: tag,
        style: {},
        innerHTML: '',
        id: '',
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        appendChild: () => {},
        removeChild: () => {},
        addEventListener: () => {}
      })
    },
    fetch: async (url, opts) => {
      if (opts && opts.body) {
        const payload = JSON.parse(opts.body);
        if (payload.action && (payload.action.startsWith('save') || payload.action.startsWith('delete'))) {
          writes.push(payload);
        }
        if (backendResponses[payload.action]) {
          const res = await backendResponses[payload.action](payload);
          return { ok: true, status: 200, json: async () => res };
        }
        if (payload.action && payload.action.startsWith('save')) {
          return { ok: true, status: 200, json: async () => ({ ok: true, count: 1 }) };
        }
      }
      return { ok: true, status: 200, json: async () => ({ ok: true, data: [] }) };
    },
    localStorage: {
      _store: { adminLoggedIn: '1', vlxt_backend_admin_key: 'secret_admin_key_123' },
      getItem: function(k) { return this._store[k] || null; },
      setItem: function(k, v) { this._store[k] = String(v); },
      removeItem: function(k) { delete this._store[k]; }
    },
    sessionStorage: {
      _store: { vlxt_backend_admin_key: 'secret_admin_key_123' },
      getItem: function(k) { return this._store[k] || null; },
      setItem: function(k, v) { this._store[k] = String(v); },
      removeItem: function(k) { delete this._store[k]; }
    },
    allLessons: [
      {
        KhoaHoc: 'Vật Lý 12 - Khóa VIP',
        Chuong: 'Chương 1',
        TenBai: 'Bài 1: Dao động',
        MaBai: 'B01',
        TrangThai: 'published',
        BaiTap: JSON.stringify([{ q: 'Legacy Q1', ans: 'A' }])
      }
    ],
    khoaOf: (r) => r.KhoaHoc || '',
    extractSC: (c) => ({ subject: 'Vật Lý 12', courseName: 'Khóa VIP' }),
    fillKhoaSelect: () => {},
    fillChuongSelect: () => {},
    currentTenKhoaValue: () => 'Khóa VIP',
    currentChuongValue: () => 'Chương 1',
    buildKhoaHoc: (l, k) => `${l} - ${k}`,
    todayStr: () => '2026-09-08',
    nhEsc: (s) => String(s),
    nhKatex: () => {},
    toast: (msg, type) => {
      toasts.push({ msg, type });
    },
    invalidateCache: () => {},
    showSyncBadge: () => {},
    addQuestion: (q) => {
      sandbox.qCount = (sandbox.qCount || 0) + 1;
    },
    vqItems: [],
    _vqSourceKey: '',
    _qbSourceKey: '',
    _qbCounts: {}
  };

  sandbox.window = sandbox;

  // Trích xuất các hàm quan trọng từ HTML
  const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
  let allScripts = '';
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    allScripts += '\n' + match[1];
  }

  // Compile trong VM context
  const context = vm.createContext(sandbox);
  vm.runInContext(allScripts, context);

  sandbox.toasts = toasts;
  sandbox.window.toasts = toasts;
  vm.runInContext(`
    addQuestion = (q) => {
      qCount++;
    };
    allLessons = [
      {
        KhoaHoc: 'Vật Lý 12 - Khóa VIP',
        Chuong: 'Chương 1',
        TenBai: 'Bài 1: Dao động',
        MaBai: 'B01',
        TrangThai: 'published',
        BaiTap: JSON.stringify([{ q: 'Legacy Q1', ans: 'A' }])
      }
    ];
    toast = (msg, type) => {
      window.toasts.push({ msg, type });
    };
    try {
      addQuestion({ q: 'Init Test', ans: 'A' });
    } catch(e) {
      console.log('INIT ADDQUESTION ERROR:', e);
    }
  `, context);

  sandbox.evalInVM = (code) => vm.runInContext(code, context);
  sandbox.getVQItems = () => vm.runInContext('vqItems', context);
  sandbox.getQCount = () => vm.runInContext('qCount', context);
  sandbox.getVQLoadStatus = () => vm.runInContext('window._vqLoadStatus', context);
  sandbox.getQBLoadStatus = () => vm.runInContext('window._qbLoadStatus', context);
  sandbox.getVQTouched = () => vm.runInContext('window._vqTouched', context);

  return { sandbox, domElements, writes, toasts };
}

let passed = 0;
let total = 0;
function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(e);
  }
}
async function testAsync(name, fn) {
  total++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(e);
  }
}

// =========================================================================
// TEST SUITE: AN TOÀN DỮ LIỆU BÀI HỌC KHI ĐỌC THẤT BẠI
// =========================================================================

await testAsync('1. Read Failure: Lỗi getvideocauhoiadmin -> Form khóa, nút Lưu disabled, không ghi đè rỗng', async () => {
  const { sandbox, domElements, writes, toasts } = createMockEnvironment({
    getvideocauhoiadmin: () => ({ ok: false, msg: 'Unauthorized: adminKey không hợp lệ' }),
    getbaitaptracnghiemadmin: () => ({ ok: true, data: [{ baiKey: 'B01', question: 'Q1' }] })
  });

  const lessonKey = 'Vật Lý 12 - Khóa VIP|||Chương 1|||Bài 1: Dao động';
  await sandbox.openEditForm(lessonKey);

  // 1. Kiểm tra trạng thái
  assert.strictEqual(sandbox.getVQLoadStatus(), 'failed', '_vqLoadStatus phải là failed');
  assert.strictEqual(domElements['btn-save-lesson'].disabled, true, 'Nút Lưu phải bị disabled');
  assert.ok(domElements['btn-save-lesson'].innerHTML.includes('Đã khóa lưu'), 'Nút lưu phải hiển thị Đã khóa lưu');
  assert.ok(domElements['fp-error-banner'], 'Banner lỗi phải được tạo');
  assert.strictEqual(domElements['fp-error-banner'].style.display, 'block');

  // 2. Thử gọi saveLessonForm() khi form đang lỗi
  await sandbox.saveLessonForm();

  // 3. Phải không có bất kỳ write POST nào được gửi đi
  assert.strictEqual(writes.length, 0, 'Tuyệt đối không được gửi write POST khi load status bị failed');
  // In toasts nếu không khớp
  const hasLockToast = toasts.some(t => t.type === 'err' && (t.msg.includes('Không thể lưu') || t.msg.includes('Đã khóa nút Lưu')));
  if (!hasLockToast) console.log('DEBUG TOASTS:', toasts);
  assert.ok(hasLockToast, 'Phải có toast cảnh báo lỗi tải hoặc khóa nút Lưu');
});

await testAsync('2. Read Failure: Lỗi getbaitaptracnghiemadmin -> Form khóa, cấm fallback đọc cột BaiTap cũ', async () => {
  const { sandbox, domElements, writes } = createMockEnvironment({
    getvideocauhoiadmin: () => ({ ok: true, data: [] }),
    getbaitaptracnghiemadmin: () => ({ ok: false, msg: '500 Internal Server Error' })
  });

  const lessonKey = 'Vật Lý 12 - Khóa VIP|||Chương 1|||Bài 1: Dao động';
  await sandbox.openEditForm(lessonKey);

  // Phải khóa form và không load câu hỏi vào quiz-builder từ fallback
  assert.strictEqual(sandbox.getQBLoadStatus(), 'failed', '_qbLoadStatus phải là failed');
  assert.strictEqual(domElements['btn-save-lesson'].disabled, true, 'Nút Lưu phải bị disabled');
  assert.strictEqual(sandbox.getQCount(), 0, 'Cấm fallback nạp BaiTap cũ khi request bị failed');

  // Gọi thử save
  await sandbox.saveLessonForm();
  assert.strictEqual(writes.length, 0, 'Không được ghi dữ liệu khi qbLoadStatus=failed');
});

await testAsync('3. Read Success Empty: Dữ liệu rỗng thật sự -> Cho phép lưu dữ liệu mới và fallback hợp lệ', async () => {
  const { sandbox, domElements, writes } = createMockEnvironment({
    getvideocauhoiadmin: () => ({ ok: true, data: [] }),
    getbaitaptracnghiemadmin: () => ({ ok: true, data: [] })
  });

  const lessonKey = 'Vật Lý 12 - Khóa VIP|||Chương 1|||Bài 1: Dao động';
  await sandbox.openEditForm(lessonKey);

  // Cả hai đều thành công nhưng rỗng
  assert.strictEqual(sandbox.getVQLoadStatus(), 'success-empty');
  assert.strictEqual(sandbox.getQBLoadStatus(), 'success-empty');
  assert.strictEqual(domElements['btn-save-lesson'].disabled, false, 'Nút Lưu phải được bật');
  // Khi success-empty, fallback vào row.BaiTap cũ được phép chạy
  assert.strictEqual(sandbox.getQCount(), 1, 'Fallback cột BaiTap cũ được phép khi sheet mới thực sự empty');
  assert.strictEqual(sandbox.getVQTouched(), false, '_vqTouched phải là false sau khi mở form');

  // Cho phép lưu
  await sandbox.saveLessonForm();
  assert.ok(writes.length > 0, 'Phải cho phép lưu khi read thành công');
});

await testAsync('4. Sửa tiêu đề bài giảng (không đụng câu hỏi video) -> Tuyệt đối không gọi savevideocauhoi', async () => {
  const { sandbox, domElements, writes } = createMockEnvironment({
    getvideocauhoiadmin: () => ({
      ok: true,
      data: [
        { baiKey: 'B01', thoiGian: 15, question: 'Câu hỏi video 1', optA: 'A1', optB: 'B1', optC: 'C1', optD: 'D1', correct: 'A' },
        { baiKey: 'B01', thoiGian: 45, question: 'Câu hỏi video 2', optA: 'A2', optB: 'B2', optC: 'C2', optD: 'D2', correct: 'B' }
      ]
    }),
    getbaitaptracnghiemadmin: () => ({
      ok: true,
      data: [{ baiKey: 'B01', thuTu: 1, question: 'Quiz 1', optA: 'A1', optB: 'B1', optC: 'C1', optD: 'D1', correct: 'C' }]
    })
  });

  const lessonKey = 'Vật Lý 12 - Khóa VIP|||Chương 1|||Bài 1: Dao động';
  await sandbox.openEditForm(lessonKey);

  assert.strictEqual(sandbox.getVQLoadStatus(), 'success-with-data');
  assert.strictEqual(sandbox.getVQItems().length, 2);
  // Quan trọng: nạp dữ liệu xong _vqTouched PHẢI là false!
  assert.strictEqual(sandbox.getVQTouched(), false, '_vqTouched phải là false sau khi load');

  // Thầy chỉ sửa tiêu đề bài học
  domElements['f-tenbai'].value = 'Bài 1: Dao động điều hòa (Mới)';

  // Thầy bấm Lưu bài giảng
  await sandbox.saveLessonForm();

  // Kiểm tra các lệnh ghi gửi lên backend
  const writeActions = writes.map(w => w.action);
  assert.ok(writeActions.includes('saveBaiHoc'), 'Phải gọi saveBaiHoc để cập nhật thông tin bài');
  assert.ok(writeActions.includes('savebaitaptracnghiem'), 'Gọi savebaitaptracnghiem');
  assert.strictEqual(writeActions.includes('savevideocauhoi'), false, 'KHÔNG ĐƯỢC gọi savevideocauhoi khi _vqTouched=false!');
});

await testAsync('5. Thầy sửa câu hỏi video thật sự -> _vqTouched=true và savevideocauhoi ĐƯỢC gọi', async () => {
  const { sandbox, domElements, writes } = createMockEnvironment({
    getvideocauhoiadmin: () => ({
      ok: true,
      data: [{ baiKey: 'B01', thoiGian: 10, question: 'Câu cũ', optA: 'A0', optB: 'B0', optC: 'C0', optD: 'D0', correct: 'A' }]
    }),
    getbaitaptracnghiemadmin: () => ({ ok: true, data: [] })
  });

  const lessonKey = 'Vật Lý 12 - Khóa VIP|||Chương 1|||Bài 1: Dao động';
  await sandbox.openEditForm(lessonKey);

  assert.strictEqual(sandbox.getVQTouched(), false);

  // Thầy thêm 1 câu hỏi video mới
  sandbox.vqAddManual('mc');
  assert.strictEqual(sandbox.getVQTouched(), true, '_vqTouched phải chuyển sang true khi thầy thêm câu');
  const items = sandbox.getVQItems();
  items[1].q = 'Câu mới nhập';
  items[1].ans = 'B';
  items[1].A = 'Đáp án A';
  items[1].B = 'Đáp án B';
  items[1].C = 'Đáp án C';
  items[1].D = 'Đáp án D';

  // Lưu form
  await sandbox.saveLessonForm();

  const writeActions = writes.map(w => w.action);
  assert.ok(writeActions.includes('savevideocauhoi'), 'savevideocauhoi PHẢI được gọi khi _vqTouched=true');
});

console.log(`\n======================================================`);
console.log(`KẾT QUẢ KIỂM THỬ AN TOÀN FORM: ${passed}/${total} PASS`);
console.log(`======================================================\n`);

if (passed < total) process.exit(1);
