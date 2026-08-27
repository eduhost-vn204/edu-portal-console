// Test không gọi mạng thật - kiểm tra logic diễn giải phản hồi ghi
// (postAdminWrite.mjs) đúng theo yêu cầu bắt buộc từ review của Codex:
// CHỈ thành công khi HTTP hợp lệ VÀ json.ok === true; mọi JSON khác, HTML,
// null, timeout, Unauthorized đều phải trả về false.
// Chạy: node scripts/test-postAdminWrite.mjs
import assert from 'node:assert/strict';
import { postAdminWriteCore } from './postAdminWrite.mjs';

let passed = 0;
async function check(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`OK   - ${name}`);
  } catch (e) {
    console.error(`FAIL - ${name}`);
    console.error('     ', e.message);
    process.exitCode = 1;
  }
}

function jsonRes(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (typeof body === 'function') return body();
      return body;
    }
  };
}

function htmlRes(status) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => { throw new SyntaxError('Unexpected token < in JSON'); }
  };
}

await check('{ok:true} + HTTP 200 -> true', async () => {
  const fetchMock = async () => jsonRes(200, { ok: true });
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' });
  assert.equal(result, true);
});

await check('{ok:false} + HTTP 200 -> false', async () => {
  const fetchMock = async () => jsonRes(200, { ok: false });
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' });
  assert.equal(result, false);
});

await check("{error:'Unauthorized'} (không có ok) -> false, KHÔNG được coi là thành công", async () => {
  const fetchMock = async () => jsonRes(200, { error: 'Unauthorized' });
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' });
  assert.equal(result, false);
});

await check('{} (object rỗng, thiếu field ok) -> false', async () => {
  const fetchMock = async () => jsonRes(200, {});
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' });
  assert.equal(result, false);
});

await check('JSON null -> false', async () => {
  const fetchMock = async () => jsonRes(200, null);
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' });
  assert.equal(result, false);
});

await check('Trang HTML lỗi thay vì JSON (res.ok=true nhưng res.json() ném lỗi) -> false', async () => {
  const fetchMock = async () => htmlRes(200);
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' });
  assert.equal(result, false);
});

await check('HTTP 401 dù body claim {ok:true} -> vẫn false (phải có res.ok thật)', async () => {
  const fetchMock = async () => jsonRes(401, { ok: true });
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' });
  assert.equal(result, false);
});

await check('HTTP 500 -> false', async () => {
  const fetchMock = async () => jsonRes(500, { ok: false, msg: 'Internal error' });
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' });
  assert.equal(result, false);
});

await check('Lỗi mạng (fetch reject) -> false', async () => {
  const fetchMock = async () => { throw new TypeError('Failed to fetch'); };
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' });
  assert.equal(result, false);
});

await check('Timeout/abort (fetch không bao giờ tự resolve) -> false, không treo test', async () => {
  const fetchMock = (url, opts) => new Promise((resolve, reject) => {
    opts.signal.addEventListener('abort', () => {
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      reject(err);
    });
  });
  const result = await postAdminWriteCore(fetchMock, 'https://x', { action: 'test' }, { timeoutMs: 30 });
  assert.equal(result, false);
});

// ── Kiểm tra tự động đính kèm adminKey qua ADMIN_WRITE_ACTIONS ──
import { ADMIN_WRITE_ACTIONS, attachAdminKeyCore } from './postAdminWrite.mjs';

await check("ADMIN_WRITE_ACTIONS chứa đầy đủ 'savebaitaptracnghiem' và 'savesetting'", async () => {
  assert.equal(ADMIN_WRITE_ACTIONS.includes('savebaitaptracnghiem'), true);
  assert.equal(ADMIN_WRITE_ACTIONS.includes('savesetting'), true);
  assert.equal(ADMIN_WRITE_ACTIONS.includes('deleteaccount'), true);
  assert.equal(ADMIN_WRITE_ACTIONS.includes('setvipstatus'), true);
  assert.equal(ADMIN_WRITE_ACTIONS.includes('pingadmin'), true);
  assert.equal(ADMIN_WRITE_ACTIONS.includes('updateaccount'), true);
  assert.equal(ADMIN_WRITE_ACTIONS.includes('resetdevice'), true);
  assert.equal(ADMIN_WRITE_ACTIONS.includes('savevideocauhoi'), true);
});

await check("attachAdminKeyCore tự động đính kèm adminKey cho 'savebaitaptracnghiem'", async () => {
  const payload = { action: 'savebaitaptracnghiem', baiKey: 'B1', items: [{ q: '1+1=?' }] };
  const enriched = attachAdminKeyCore(payload, 'test_key_123');
  assert.equal(enriched.adminKey, 'test_key_123');
  assert.equal(enriched.action, 'savebaitaptracnghiem');
  assert.equal(enriched.baiKey, 'B1');
});

await check("attachAdminKeyCore tự động đính kèm adminKey cho 'savesetting'", async () => {
  const payload = { action: 'savesetting', key: 'currentTeachingLesson', value: 'B1' };
  const enriched = attachAdminKeyCore(payload, 'test_key_123');
  assert.equal(enriched.adminKey, 'test_key_123');
  assert.equal(enriched.action, 'savesetting');
  assert.equal(enriched.key, 'currentTeachingLesson');
  assert.equal(enriched.value, 'B1');
});

await check("attachAdminKeyCore tự động đính kèm adminKey cho TẤT CẢ các action trong ADMIN_WRITE_ACTIONS", async () => {
  for (const act of ADMIN_WRITE_ACTIONS) {
    const payload = { action: act, data: 123 };
    const enriched = attachAdminKeyCore(payload, 'secret_adm_key');
    assert.equal(enriched.adminKey, 'secret_adm_key', `Action ${act} phải được gắn adminKey`);
  }
});

await check("attachAdminKeyCore KHÔNG đính kèm adminKey cho action đọc (không nằm trong whitelist)", async () => {
  const payload = { action: 'getbaihoc', type: 'baihoc' };
  const enriched = attachAdminKeyCore(payload, 'secret_adm_key');
  assert.equal(enriched.adminKey, undefined, 'Action đọc không được tự động gắn adminKey');
});

console.log(`\n${passed} test đã qua.`);
if (process.exitCode) {
  console.error('CÓ TEST THẤT BẠI.');
} else {
  console.log('TẤT CẢ TEST ĐÃ QUA.');
}
