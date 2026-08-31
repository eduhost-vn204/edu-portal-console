import https from 'https';
import fs from 'fs';

const PROD_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const postBody = JSON.stringify(data);
    const parsed = new URL(url);

    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postBody)
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.headers.location) {
        return resolve(getJson(res.headers.location));
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); } catch (e) { resolve(raw); }
      });
    });
    req.on('error', reject);
    req.write(postBody);
    req.end();
  });
}

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

async function main() {
  console.log('=== THỰC THI SỬA BÀI HỌC CHO 387 BẢN GHI TRÊN PRODUCTION (VERSION 96) ===\n');

  const dryRunRecords = JSON.parse(fs.readFileSync('d:/Antigravity-Work/dry_run_repair_records.json', 'utf-8'));
  console.log(`Đã nạp ${dryRunRecords.length} bản ghi cần sửa từ dry_run_repair_records.json`);

  const updates = dryRunRecords.map(r => ({
    id: r.id,
    rowIndex: r.row,
    intendedLesson: r.intendedLesson
  }));

  console.log('\n--- BƯỚC 1: KIỂM THỬ DRY-RUN TRÊN PRODUCTION ---');
  const dryRes = await postJson(PROD_URL, {
    action: 'repairLessonBatch',
    adminKey: 'admin123',
    dryRun: true,
    updates: updates
  });

  console.log('Kết quả Dry-Run từ Cloud Apps Script:', JSON.stringify(dryRes, null, 2));

  if (!dryRes.ok || dryRes.errors?.length > 0 || dryRes.totalMatched !== updates.length) {
    throw new Error('Dry-run không đạt 100% khớp, dừng lại ngay!');
  }

  console.log('\n--- BƯỚC 2: THỰC THI CẬP NHẬT THẬT TRÊN PRODUCTION ---');
  const realRes = await postJson(PROD_URL, {
    action: 'repairLessonBatch',
    adminKey: 'admin123',
    dryRun: false,
    updates: updates
  });

  console.log('Kết quả Ghi thật từ Cloud Apps Script:', JSON.stringify(realRes, null, 2));

  console.log('\n--- BƯỚC 3: ĐỐI SOÁT THỐNG KÊ TOÀN DIỆN SAU KHI SỬA ---');
  const statsRes = await getJson(PROD_URL + '?type=questionstats&_t=' + Date.now());
  console.log('Thống kê QuestionStats mới:', JSON.stringify(statsRes, null, 2));

  const bankRes = await getJson(PROD_URL + '?type=nganhang&_t=' + Date.now());
  const allRows = bankRes.data || [];
  console.log(`Tổng số dòng trong NganHang: ${allRows.length}`);

  const tinhLessonCounts = {};
  allRows.forEach(q => {
    if ((q.chatLuong || '').toLowerCase() === 'tinh') {
      const l = q.baiHoc || 'CHƯA_GÁN';
      tinhLessonCounts[l] = (tinhLessonCounts[l] || 0) + 1;
    }
  });

  console.log('\nPhân bố câu TINH theo Bài học trên Production sau khi sửa:');
  for (const [k, v] of Object.entries(tinhLessonCounts)) {
    console.log(`  * ${k}: ${v}`);
  }
}

main().catch(err => {
  console.error('Lỗi thực thi:', err);
  process.exit(1);
});
