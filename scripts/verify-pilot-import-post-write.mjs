import https from 'https';
import assert from 'assert';

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
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          resolve(raw);
        }
      });
    }).on('error', reject);
  });
}

const EXPECTED_PILOT_IDS = [
  'VLXT-G12-C1-P07-VD03',
  'VLXT-G12-C1-P07-VD04',
  'VLXT-G12-C1-P07-VD05',
  'VLXT-G12-C1-P08-VD07',
  'VLXT-G12-C1-P09-VD08'
];

async function verifyProduction() {
  console.log('=== ĐỐI SOÁT PRODUCTION SAU KHI NẠP 5 CÂU TINH ===\n');

  const res = await getJson(PROD_URL + '?type=nganhang');
  if (!res || !res.data) {
    console.error('FAIL: Không đọc được dữ liệu ngân hàng từ Apps Script');
    process.exit(1);
  }

  const allItems = res.data;
  const totalCount = allItems.length;
  console.log(`1. Tổng số câu hỏi hiện tại: ${totalCount} (Kỳ vọng: 5443)`);

  if (totalCount !== 5443) {
    console.log(`[CHỜ THAO TÁC] Tổng câu hiện tại là ${totalCount}. Nếu Thầy chưa bấm "Nạp thật", hãy bấm trên Admin và chạy lại script này.`);
    return { pending: true, count: totalCount };
  }

  // 1. Kiểm tra 5 ID pilot
  console.log('\n2. Kiểm tra chi tiết 5 câu pilot:');
  const foundMap = new Map();
  allItems.forEach(q => {
    if (EXPECTED_PILOT_IDS.includes(q.id)) {
      const existing = foundMap.get(q.id) || [];
      existing.push(q);
      foundMap.set(q.id, existing);
    }
  });

  let allValid = true;
  for (const expectedId of EXPECTED_PILOT_IDS) {
    const list = foundMap.get(expectedId) || [];
    if (list.length === 0) {
      console.error(`FAIL: Không tìm thấy ID ${expectedId}`);
      allValid = false;
      continue;
    }
    if (list.length > 1) {
      console.error(`FAIL: ID ${expectedId} bị trùng lặp (${list.length} lần)`);
      allValid = false;
      continue;
    }

    const q = list[0];
    const checks = [
      q.mon === 'Vật lý',
      q.chuong === 'Vật lí nhiệt',
      q.baiHoc === 'Bài 3. Nhiệt độ - Thang nhiệt độ - Nhiệt kế',
      q.mucDo === 'VD',
      q.loai === 'TN',
      q.correct === 'A',
      q.chatLuong === 'tinh',
      String(q.question || '').trim().length > 0,
      String(q.optA || '').trim().length > 0,
      String(q.optB || '').trim().length > 0,
      String(q.optC || '').trim().length > 0,
      String(q.optD || '').trim().length > 0,
      String(q.giaiThich || '').trim().length > 0
    ];

    if (checks.every(Boolean)) {
      console.log(`OK   - ${expectedId}: mon="${q.mon}", chuong="${q.chuong}", baiHoc="${q.baiHoc}", correct="${q.correct}", chatLuong="${q.chatLuong}"`);
    } else {
      console.error(`FAIL - ${expectedId}: Dữ liệu trường không đúng chuẩn`, q);
      allValid = false;
    }
  }

  // 2. Thống kê chất lượng toàn ngân hàng
  let countTinh = 0;
  let countTho = 0;
  let countChuaDuyet = 0;
  allItems.forEach(q => {
    const cl = String(q.chatLuong || '').trim().toLowerCase();
    if (cl === 'tinh') countTinh++;
    else if (cl === 'tho') countTho++;
    else countChuaDuyet++;
  });

  console.log('\n3. Phân bố chất lượng toàn ngân hàng:');
  console.log(`- Câu TINH (đã duyệt):    ${countTinh} (Kỳ vọng: đúng 5 câu pilot)`);
  console.log(`- Câu THÔ:                ${countTho}`);
  console.log(`- Câu CHƯA DUYỆT:         ${countChuaDuyet}`);

  // 3. Kiểm tra trùng lặp ID toàn bộ 5443 câu
  const idCounts = new Map();
  allItems.forEach(q => {
    const id = String(q.id || '').trim();
    if (id) idCounts.set(id, (idCounts.get(id) || 0) + 1);
  });
  const dups = [...idCounts.entries()].filter(([_, count]) => count > 1);
  console.log(`\n4. Trùng lặp ID toàn ngân hàng: ${dups.length} câu`);

  if (allValid && countTinh === 5 && dups.length === 0 && totalCount === 5443) {
    console.log('\n=== KẾT QUẢ: PILOT IMPORT PASS (100% HOÀN HẢO) ===');
    return { success: true };
  } else {
    console.error('\n=== KẾT QUẢ: PILOT IMPORT FAILED ===');
    return { success: false };
  }
}

verifyProduction().catch(console.error);
