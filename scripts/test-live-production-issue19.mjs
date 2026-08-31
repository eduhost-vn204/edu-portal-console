import https from 'https';

const PROD_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.headers.location) {
        return resolve(getJson(res.headers.location));
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); } catch (e) { resolve(raw); }
      });
    }).on('error', reject);
  });
}

function postJson(url, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.headers.location) {
        return https.get(res.headers.location, (redRes) => {
          if (redRes.statusCode >= 300 && redRes.headers.location) {
            return https.get(redRes.headers.location, (redRes2) => {
              let raw2 = '';
              redRes2.on('data', d => raw2 += d);
              redRes2.on('end', () => {
                try { resolve(JSON.parse(raw2)); } catch (e) { resolve(raw2); }
              });
            }).on('error', reject);
          }
          let raw = '';
          redRes.on('data', d => raw += d);
          redRes.on('end', () => {
            try { resolve(JSON.parse(raw)); } catch (e) { resolve(raw); }
          });
        }).on('error', reject);
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); } catch (e) { resolve(raw); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== TEST 1: GET ?type=questionstats ===');
  const statsGet = await getJson(PROD_URL + '?type=questionstats&_t=' + Date.now());
  console.log('GET questionstats result:', statsGet);

  console.log('\n=== TEST 2: POST action=getQuestionStats ===');
  const statsPost = await postJson(PROD_URL, { action: 'getQuestionStats' });
  console.log('POST getQuestionStats result:', statsPost);

  console.log('\n=== TEST 3: POST action=importQuestionsBatch WITH WRONG ADMIN KEY ===');
  const wrongAuthRes = await postJson(PROD_URL, {
    action: 'importQuestionsBatch',
    adminKey: 'invalid_key_12345',
    questions: [{ id: 'TEST-Q1', question: 'Test?', optA: '1', optB: '2', optC: '3', optD: '4', correct: 'A' }]
  });
  console.log('Wrong key response:', wrongAuthRes);

  console.log('\n=== TEST 4: POST action=import_tinh_batch WITH UNKNOWN ACTION ===');
  const unknownRes = await postJson(PROD_URL, {
    action: 'non_existent_action_xyz',
    adminKey: 'test'
  });
  console.log('Unknown action response:', unknownRes);
}

runTests().catch(console.error);
