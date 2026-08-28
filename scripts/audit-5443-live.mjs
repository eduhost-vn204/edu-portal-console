import https from 'https';

const PILOT_IDS = [
  'VLXT-G12-C1-P07-VD03',
  'VLXT-G12-C1-P07-VD04',
  'VLXT-G12-C1-P07-VD05',
  'VLXT-G12-C1-P08-VD07',
  'VLXT-G12-C1-P09-VD08'
];

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

async function auditLive() {
  const url = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec?type=nganhang';
  const res = await getJson(url);
  const data = res.data || [];

  console.log('=== AUDIT PRODUCTION GET ?type=nganhang ===');
  console.log('1. Tổng số câu production:', data.length);

  const tinhItems = data.filter(q => String(q.chatLuong || '').trim().toLowerCase() === 'tinh');
  const thoItems = data.filter(q => String(q.chatLuong || '').trim().toLowerCase() === 'tho');
  const chuaDuyetItems = data.filter(q => !String(q.chatLuong || '').trim());

  console.log('2. Phân bố chatLuong toàn ngân hàng:');
  console.log('   - chatLuong=tinh:      ', tinhItems.length);
  console.log('   - chatLuong=tho:       ', thoItems.length);
  console.log('   - chatLuong="" (trống): ', chuaDuyetItems.length);

  console.log('\n3. Chi tiết 5 Pilot IDs:');
  PILOT_IDS.forEach(pid => {
    const list = data.filter(q => q.id === pid);
    console.log(`   * ${pid}: Xuất hiện ${list.length} lần`);
    if (list.length > 0) {
      const q = list[0];
      console.log(`     - mon: "${q.mon}", chuong: "${q.chuong}", baiHoc: "${q.baiHoc}"`);
      console.log(`     - mucDo: "${q.mucDo}", loai: "${q.loai}", correct: "${q.correct}"`);
      console.log(`     - chatLuong: "${q.chatLuong}" (length: ${String(q.chatLuong || '').length})`);
      console.log(`     - question length: ${String(q.question || '').length}`);
      console.log(`     - optA-D present: ${Boolean(q.optA && q.optB && q.optC && q.optD)}`);
      console.log(`     - giaiThich length: ${String(q.giaiThich || '').length}`);
      console.log(`     - hinhAnh: "${q.hinhAnh || ''}"`);
    }
  });
}

auditLive().catch(console.error);
