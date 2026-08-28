import https from 'https';
import fs from 'fs';
import path from 'path';

const PROD_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';
const PILOT_FILE = 'C:/Users/Xuan Truong/.gemini/antigravity/brain/e36e7db9-4957-452f-9e82-1608c27a5ece/scratch/vatly-content-studio-private/content-pipeline/chuong-1/05-approved-output/chapter-1-batch-001/pilot-5-website-candidate.json';

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

async function runLiveVerification() {
  console.log('=== SMOKE TEST & PRODUCTION DRY-RUN ON VERSION 80 ===\n');

  // 1. Unknown action
  const resUnknown = await postJson(PROD_URL, { action: 'unknown_test_action' });
  console.log('1. POST unknown action:', resUnknown);

  // 2. Wrong key on importnganhang
  const resWrongKey = await postJson(PROD_URL, { action: 'importnganhang', adminKey: 'wrong_key', questions: [{ id: 'TEST' }] });
  console.log('2. POST importnganhang with wrong key:', resWrongKey);

  // 3. GET count before
  const resBankBefore = await getJson(PROD_URL + '?type=nganhang');
  const countBefore = resBankBefore && resBankBefore.data ? resBankBefore.data.length : 0;
  console.log('3. GET ?type=nganhang count BEFORE:', countBefore);

  // 4. Load and transform 5 pilot questions
  const rawPilot = JSON.parse(fs.readFileSync(PILOT_FILE, 'utf8'));
  const transformedPilot = rawPilot.map(q => ({
    id: q.id,
    mon: 'Vật lý',
    chuong: 'Vật lí nhiệt',
    baiHoc: 'Bài 3. Nhiệt độ - Thang nhiệt độ - Nhiệt kế',
    mucDo: q.mucDo || 'VD',
    loai: 'TN',
    question: q.question,
    optA: q.optA,
    optB: q.optB,
    optC: q.optC,
    optD: q.optD,
    correct: q.correct,
    giaiThich: q.explanation || q.giaiThich || '',
    hinhAnh: '',
    nhomId: '',
    deBaiChung: '',
    chatLuong: 'tinh'
  }));

  console.log('\n4. Running PRODUCTION DRY-RUN with 5 pilot questions...');
  // Chạy dryRun=true (lưu ý: không truyền key hardcode, Apps Script getAdminKey() sẽ kiểm tra key nếu được cấu hình trong ScriptProperties, hoặc nếu adminKey rỗng khi ScriptProperties chưa set key)
  const resDryRun = await postJson(PROD_URL, {
    action: 'importnganhang',
    dryRun: true,
    batchId: 'PILOT_5_CHUONG_1_BATCH_001',
    questions: transformedPilot
  });

  console.log('\nRAW PRODUCTION DRY-RUN RESPONSE:');
  console.log(JSON.stringify(resDryRun, null, 2));

  // 5. GET count after dryRun
  const resBankAfter = await getJson(PROD_URL + '?type=nganhang');
  const countAfter = resBankAfter && resBankAfter.data ? resBankAfter.data.length : 0;
  console.log('\n5. GET ?type=nganhang count AFTER DRY-RUN:', countAfter);

  console.log('\n=== HOÀN TẤT KIỂM THỬ DRY-RUN PRODUCTION TRÊN VERSION 80 ===');
}

runLiveVerification().catch(console.error);
