import http from 'http';
import { spawn } from 'child_process';
import assert from 'assert';

console.log('=== TEST SUITE: ISSUE #19 QUESTION BANK PRODUCTION API & REVIEW APP ===\n');

const SERVER_PORT = 8769;
const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}`;

function requestJson(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postBody = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port || SERVER_PORT,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(postBody ? { 'Content-Length': Buffer.byteLength(postBody) } : {}),
        ...(options.headers || {})
      }
    }, (res) => {
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
        catch (e) { resolve({ status: res.statusCode, raw }); }
      });
    });
    req.on('error', reject);
    if (postBody) req.write(postBody);
    req.end();
  });
}

async function main() {
  console.log('1. Khởi động Review Server cục bộ (python review-server.py)...');
  try {
    const { execSync } = await import('child_process');
    execSync('for /f "tokens=5" %a in (\'netstat -aon ^| findstr ":8769" ^| findstr "LISTENING"\') do taskkill /f /pid %a >nul 2>&1', { shell: 'cmd.exe' });
  } catch (e) {}

  const pyProcess = spawn('python', ['-X', 'utf8', 'review-server.py'], {
    cwd: 'd:/Antigravity-Work/VatLyXuanTruong/content-pipeline/chuong-1/04-review/phongtoa-p107-251/review-app',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  pyProcess.stdout.on('data', d => console.log(`[SERVER STDOUT] ${d.toString().trim()}`));
  pyProcess.stderr.on('data', d => console.error(`[SERVER STDERR] ${d.toString().trim()}`));

  // Wait for server to start
  await new Promise(r => setTimeout(r, 2000));

  try {
    console.log('\n2. Kiểm tra GET /api/cloud-stats từ Review Server...');
    const statsRes = await requestJson(`${SERVER_URL}/api/cloud-stats`);
    console.log('Status code:', statsRes.status);
    console.log('Stats response:', statsRes.data);
    assert.strictEqual(statsRes.status, 200, 'Endpoint /api/cloud-stats phải trả về 200');
    assert.strictEqual(statsRes.data.success, true, 'Lấy cloud stats phải thành công');
    assert(statsRes.data.stats.total >= 5000, 'Tổng số câu hỏi trên production phải >= 5000');

    console.log('\n3. Kiểm tra POST /api/export (Dry-Run = True, Limit = 3, Không Key)...');
    const dryRunNoKey = await requestJson(`${SERVER_URL}/api/export`, { method: 'POST' }, {
      dryRun: true,
      limit: 3
    });
    console.log('Export (No Key) status:', dryRunNoKey.status);
    console.log('Export (No Key) payload count:', dryRunNoKey.data.payloadCount);
    console.log('Cloud sync response:', dryRunNoKey.data.manifest.cloudSync);
    assert.strictEqual(dryRunNoKey.data.success, true);
    assert.strictEqual(dryRunNoKey.data.payloadCount, 3);
    assert.strictEqual(dryRunNoKey.data.manifest.cloudSync.ok, false);

    console.log('\n4. Kiểm tra POST /api/export với Admin Key Sai (Fail-Closed Security)...');
    const dryRunWrongKey = await requestJson(`${SERVER_URL}/api/export`, { method: 'POST' }, {
      adminKey: 'sai_khoa_admin_123',
      dryRun: true,
      limit: 3
    });
    console.log('Wrong key cloud response:', dryRunWrongKey.data.cloudResponse);
    assert.strictEqual(dryRunWrongKey.data.cloudResponse.ok, false);
    assert.strictEqual(dryRunWrongKey.data.cloudResponse.error, 'Unauthorized');

    console.log('\n=== TOÀN BỘ 4/4 KIỂM THỬ INTEGRATION REVIEW SERVER & CLOUD API THÀNH CÔNG 100% ===');
  } finally {
    console.log('\n5. Dọn dẹp: Tắt Review Server test...');
    pyProcess.kill();
  }
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
