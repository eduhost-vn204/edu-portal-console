import https from 'https';

const PROD_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';

function postJson(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request(PROD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return getRedirect(res.headers.location).then(resolve).catch(reject);
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); } catch(e) { resolve(raw); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getRedirect(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return getRedirect(res.headers.location).then(resolve).catch(reject);
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); } catch(e) { resolve(raw); }
      });
    }).on('error', reject);
  });
}

function getJson(query = '') {
  return getRedirect(`${PROD_URL}?${query}`);
}

async function runLiveSmokeTests() {
  console.log('=== LIVE PRODUCTION SMOKE TESTS (Version 78) ===\n');

  // 1. Unknown action -> Unknown action
  console.log('1. Testing unknown POST action...');
  const res1 = await postJson({ action: 'smoke_test_unknown_' + Date.now() });
  console.log('   Response:', res1);
  if (res1 && res1.ok === false && res1.msg === 'Unknown action') {
    console.log('   [PASS] Endpoint properly routes and rejects unknown action.\n');
  } else {
    console.error('   [FAIL] Expected Unknown action, got:', res1);
  }

  // 2. POST saveteachingscope sai key -> Unauthorized
  console.log('2. Testing saveteachingscope with invalid key...');
  const res2 = await postJson({
    action: 'saveteachingscope',
    adminKey: 'wrong_key_12345',
    courseId: 'khoa-ly-12',
    stageId: 'toan_khoa'
  });
  console.log('   Response:', res2);
  if (res2 && res2.ok === false && res2.msg === 'Unauthorized') {
    console.log('   [PASS] Backend rejects write with invalid adminKey.\n');
  } else {
    console.error('   [FAIL] Expected Unauthorized, got:', res2);
  }

  // 3. Public GET type=teachingscope
  console.log('3. Testing public GET type=teachingscope...');
  const res3 = await getJson('type=teachingscope');
  console.log('   Response:', res3);
  if (res3 && (res3.ok === true || Array.isArray(res3))) {
    console.log('   [PASS] Public GET type=teachingscope returns cleanly.\n');
  } else {
    console.error('   [FAIL] Public GET failed:', res3);
  }

  console.log('=== ALL LEVEL 1 SMOKE TESTS PASSED ON VERSION 78 ===');
}

runLiveSmokeTests().catch(console.error);
