import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log('=== TEST ADMIN INIT DRAFT REVALIDATION (quan-ly-bai-hoc.html & index.html) ===\n');

const targetFiles = ['quan-ly-bai-hoc.html', 'index.html'];

// Build sample mock data: 40 public lessons (published), 1 draft lesson (B11)
const mockPublic40 = [];
for (let i = 1; i <= 40; i++) {
  mockPublic40.push({
    MaBai: `B_PUB_${i}`,
    KhoaHoc: i <= 35 ? 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12' : '5 NGÀY LẤY GỐC VẬT LÍ ( NÊN HỌC ⭐) - Vật Lý 12',
    Chuong: i <= 35 ? (i <= 10 ? 'Chương 2 – Khí lí tưởng' : 'Chương 1 – Vật lý Nhiệt') : 'Chương Gốc',
    TenBai: `Bài học công khai ${i}`,
    ThuTuBai: i,
    TrangThai: 'published',
    Video: 'https://youtube.com/watch?v=pub',
    VideoGiai: '',
    PDFLyThuyet: '',
    PDF: '',
    PDFLuyenTap: ''
  });
}

const mockB11Draft = {
  MaBai: 'B4ca24b64572f',
  KhoaHoc: 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12',
  Chuong: 'Chương 2 – Khí lí tưởng',
  TenBai: 'B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT',
  ThuTuBai: 4,
  TrangThai: 'draft',
  Video: 'https://www.youtube.com/watch?v=ebNk9fol3ak',
  VideoGiai: 'https://www.youtube.com/watch?v=vZSHLTs3eEM',
  PDFLyThuyet: 'https://drive.google.com/file/d/th',
  PDF: 'https://drive.google.com/file/d/ap',
  PDFLuyenTap: 'https://drive.google.com/file/d/pr'
};

const mockAdmin41 = [...mockPublic40, mockB11Draft];

function createTestSandbox(options = {}) {
  function createMockElement(id = '') {
    return {
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
      removeEventListener: () => {},
      setAttribute: () => {},
      removeAttribute: () => {},
      getAttribute: () => null,
      querySelectorAll: () => [],
      querySelector: () => null
    };
  }

  const domElements = {
    'lesson-list-wrap': createMockElement('lesson-list-wrap'),
    'bulk-action-bar': createMockElement('bulk-action-bar'),
    'f-lop': { ...createMockElement('f-lop'), value: 'Vật Lý 12' },
    'f-ten-khoa': createMockElement('f-ten-khoa'),
    'f-chuong': createMockElement('f-chuong'),
    'filter-bar': createMockElement('filter-bar')
  };

  const fetchCalls = [];

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
    document: {
      addEventListener: () => {},
      removeEventListener: () => {},
      getElementById: (id) => {
        if (!domElements[id]) {
          domElements[id] = createMockElement(id);
        }
        return domElements[id];
      },
      querySelectorAll: (sel) => {
        return [];
      },
      querySelector: (sel) => null
    },
    fetch: async (url, opts) => {
      fetchCalls.push({ url, opts });
      const urlStr = String(url);

      if (urlStr.includes('type=khoaconfig')) {
        return { ok: true, status: 200, json: async () => [] };
      }
      if (urlStr.includes('type=settings')) {
        return { ok: true, status: 200, json: async () => ({}) };
      }
      if (urlStr.includes('type=teachingscope')) {
        return { ok: true, status: 200, json: async () => ({}) };
      }
      if (urlStr.includes('type=baihoc') || urlStr.includes('PUBLIC_LESSONS_URL')) {
        // Public endpoint returns 40 published lessons ONLY
        return { ok: true, status: 200, json: async () => mockPublic40 };
      }

      // POST admin
      if (opts && opts.body) {
        const payload = JSON.parse(opts.body);
        if (payload.action === 'getbaihocadmin') {
          // Admin endpoint returns 41 lessons INCLUDING B11 DRAFT
          return { ok: true, status: 200, json: async () => ({ ok: true, data: mockAdmin41 }) };
        }
        if (payload.action === 'getbaitaptracnghiemadmin') {
          return { ok: true, status: 200, json: async () => ({ ok: true, data: [] }) };
        }
      }

      return { ok: true, status: 200, json: async () => ({ ok: true, data: [] }) };
    },
    localStorage: {
      _store: options.initialLocalStorage || {},
      getItem: function(k) { return this._store[k] || null; },
      setItem: function(k, v) { this._store[k] = String(v); },
      removeItem: function(k) { delete this._store[k]; }
    },
    sessionStorage: {
      _store: {},
      getItem: function(k) { return this._store[k] || null; },
      setItem: function(k, v) { this._store[k] = String(v); },
      removeItem: function(k) { delete this._store[k]; }
    },
    toast: () => {},
    sleep: (ms) => new Promise(res => setTimeout(res, ms))
  };

  sandbox.window = sandbox;
  return { sandbox, domElements, fetchCalls };
}

function extractCombinedScript(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const scriptMatches = [...html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
  return scriptMatches.map(m => m[1]).join('\n;\n');
}

async function runTests() {
  let passed = 0;
  let total = 0;

  function it(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(e);
      throw e;
    }
  }

  async function itAsync(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(e);
      throw e;
    }
  }

  // -------------------------------------------------------------------------
  // TEST 1: Xác nhận Mock Data Baseline
  // -------------------------------------------------------------------------
  it('1. Mock Data Baseline: Public có 40 bài (không có B11), Admin có 41 bài (gồm B11 Draft)', () => {
    assert.strictEqual(mockPublic40.length, 40, 'Public phải đúng 40 bài');
    const pubHasB11 = mockPublic40.some(b => b.MaBai === 'B4ca24b64572f' || b.TenBai.includes('B11'));
    assert.strictEqual(pubHasB11, false, 'Public tuyệt đối không được có B11 Draft');

    assert.strictEqual(mockAdmin41.length, 41, 'Admin phải có 41 bài');
    const adminHasB11 = mockAdmin41.some(b => b.MaBai === 'B4ca24b64572f' && b.TrangThai === 'draft');
    assert.strictEqual(adminHasB11, true, 'Admin phải chứa B11 với TrangThai=draft');
  });

  for (const fileName of targetFiles) {
    const filePath = path.resolve(fileName);
    assert.strictEqual(fs.existsSync(filePath), true, `File ${fileName} phải tồn tại`);
    const combinedScript = extractCombinedScript(filePath);

    console.log(`\n--- Kiểm thử file: ${fileName} ---`);

    // -------------------------------------------------------------------------
    // TEST 2: initAdmin() phải revalidate qua getbaihocadmin và render B11 Draft
    // -------------------------------------------------------------------------
    await itAsync(`2. [${fileName}] initAdmin() gọi loadLessonsPreview() rồi luôn revalidate bằng loadLessons() -> Render B11 Draft`, async () => {
      const { sandbox, domElements, fetchCalls } = createTestSandbox();
      const ctx = vm.createContext(sandbox);

      // Chạy toàn bộ script của trang Admin trong context
      vm.runInContext(combinedScript, ctx);

      // Kích hoạt initAdmin()
      assert.strictEqual(typeof ctx.initAdmin, 'function', 'initAdmin phải được định nghĩa');
      ctx.initAdmin();

      // Chờ các promise giải quyết
      await new Promise(r => setTimeout(r, 200));

      // Kiểm tra các lệnh gọi fetch
      const getbaihocadminCalls = fetchCalls.filter(c => {
        try {
          const body = JSON.parse(c.opts?.body || '{}');
          return body.action === 'getbaihocadmin';
        } catch {
          return false;
        }
      });

      assert.strictEqual(
        getbaihocadminCalls.length >= 1,
        true,
        `[${fileName}] initAdmin bắt buộc phải kích hoạt gọi POST getbaihocadmin để revalidate`
      );

      // Kiểm tra allLessons trong context
      const currentLessons = vm.runInContext('allLessons', ctx);
      assert.strictEqual(currentLessons.length, 41, `[${fileName}] allLessons cuối cùng phải có 41 bài học từ admin`);
      const b11InAll = currentLessons.find(b => b.MaBai === 'B4ca24b64572f');
      assert.ok(b11InAll, `[${fileName}] B11 phải có mặt trong allLessons`);
      assert.strictEqual(b11InAll.TrangThai, 'draft', `[${fileName}] B11 trong allLessons phải là draft`);

      // Kiểm tra DOM render trong #lesson-list-wrap
      const renderedHtml = domElements['lesson-list-wrap'].innerHTML;
      assert.strictEqual(
        renderedHtml.includes('B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT'),
        true,
        `[${fileName}] HTML render phải chứa tiêu đề bài B11`
      );
      assert.strictEqual(
        renderedHtml.includes('li-draft') || renderedHtml.includes('Draft'),
        true,
        `[${fileName}] HTML render phải hiển thị huy hiệu Draft cho bài B11`
      );
    });

    // -------------------------------------------------------------------------
    // TEST 3: localStorage cache cũ của preview không được chặn revalidation
    // -------------------------------------------------------------------------
    await itAsync(`3. [${fileName}] Preview cache cũ trong localStorage không được chặn getbaihocadmin revalidation`, async () => {
      // Khởi tạo localStorage đã có sẵn cache 40 bài public
      const initialStore = {
        vlxt_admin_public_preview_baihoc: JSON.stringify({
          t: Date.now(),
          d: mockPublic40
        })
      };

      const { sandbox, domElements, fetchCalls } = createTestSandbox({ initialLocalStorage: initialStore });
      const ctx = vm.createContext(sandbox);

      vm.runInContext(combinedScript, ctx);

      ctx.initAdmin();

      await new Promise(r => setTimeout(r, 200));

      const getbaihocadminCalls = fetchCalls.filter(c => {
        try {
          const body = JSON.parse(c.opts?.body || '{}');
          return body.action === 'getbaihocadmin';
        } catch {
          return false;
        }
      });

      assert.strictEqual(
        getbaihocadminCalls.length >= 1,
        true,
        `[${fileName}] Dù có cache preview trong localStorage, initAdmin vẫn phải gọi getbaihocadmin`
      );

      const revalidatedLessons = vm.runInContext('allLessons', ctx);
      assert.strictEqual(revalidatedLessons.length, 41, `[${fileName}] allLessons phải được cập nhật đủ 41 bài từ admin`);
      const renderedHtml = domElements['lesson-list-wrap'].innerHTML;
      assert.strictEqual(
        renderedHtml.includes('B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT'),
        true,
        `[${fileName}] B11 phải được render vào DOM ngay cả khi khởi đầu bằng preview cache cũ`
      );
    });
  }

  console.log(`\n======================================================`);
  console.log(`KẾT QUẢ KIỂM THỬ: ${passed}/${total} PASS (100%)`);
  console.log(`======================================================\n`);
}

runTests().catch(err => {
  console.error('\n❌ TEST RUN FAILED:', err);
  process.exit(1);
});
