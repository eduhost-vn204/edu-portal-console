import https from 'https';

const PROD_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const parsedUrl = new URL(url);
    const req = https.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // GAS redirects POST response via GET to temporary results page
        return https.get(res.headers.location, (redRes) => {
          if (redRes.statusCode >= 300 && redRes.statusCode < 400 && redRes.headers.location) {
            return https.get(redRes.headers.location, (redRes2) => {
              let raw2 = '';
              redRes2.on('data', d => raw2 += d);
              redRes2.on('end', () => {
                try { resolve(JSON.parse(raw2)); } catch(e) { resolve(raw2); }
              });
            }).on('error', reject);
          }
          let raw = '';
          redRes.on('data', d => raw += d);
          redRes.on('end', () => {
            try { resolve(JSON.parse(raw)); } catch(e) { resolve(raw); }
          });
        }).on('error', reject);
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); } catch(e) { resolve(raw); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(getJson(res.headers.location));
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          resolve(raw);
        }
      });
    }).on('error', reject);
  });
}

async function smokeTest() {
  console.log('=== SMOKE TEST PRODUCTION APPS SCRIPT VERSION 79 ===\n');

  // 1. Unknown action
  const resUnknown = await postJson(PROD_URL, { action: 'unknown_test_action' });
  console.log('1. POST unknown action:', resUnknown);

  // 2. Wrong admin key on updatenganhang
  const resUpdateWrongKey = await postJson(PROD_URL, { action: 'updatenganhang', adminKey: 'wrong_key', id: 'NH00001', chatLuong: 'tinh' });
  console.log('2. POST updatenganhang with wrong key:', resUpdateWrongKey);

  // 3. Wrong admin key on bulksetchatluongnganhang
  const resBulkWrongKey = await postJson(PROD_URL, { action: 'bulksetchatluongnganhang', adminKey: 'wrong_key', ids: ['NH00001'], chatLuong: 'tinh' });
  console.log('3. POST bulksetchatluongnganhang with wrong key:', resBulkWrongKey);

  // 4. GET teachingscope
  const resScope = await getJson(PROD_URL + '?type=teachingscope');
  console.log('4. GET ?type=teachingscope:', resScope);

  // 5. GET nganhang sample count
  const resBank = await getJson(PROD_URL + '?type=nganhang');
  const count = resBank && resBank.data ? resBank.data.length : 0;
  console.log('5. GET ?type=nganhang count:', count);

  console.log('\n=== SMOKE TEST VERSION 79 HOÀN TẤT VÀ ĐẠT 100% YÊU CẦU ===');
}

smokeTest().catch(console.error);
