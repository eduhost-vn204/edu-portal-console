import fs from 'fs';
import { DEFAULT_DB_URL } from './youtube-lesson-pipeline.mjs';

async function main() {
  const before = JSON.parse(fs.readFileSync('inbox/b10-pilot/real_b10_snapshot_before.json', 'utf8'));
  const res = await fetch(DEFAULT_DB_URL + '?type=baihoc&t=' + Date.now());
  const data = await res.json();
  const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
  const current = list.find(b => String(b.TenBai).trim() === before.TenBai);
  if (!current) {
    console.error('LỖI: Không tìm thấy Bài 10 thật trên live backend!');
    process.exit(1);
  }
  const keys = ['KhoaHoc', 'Chuong', 'TenBai', 'Video', 'VideoGiai', 'PDF', 'ThuTuBai'];
  let diff = false;
  for (const k of keys) {
    const valBefore = String(before[k] || '').trim();
    const valCurrent = String(current[k] || '').trim();
    if (valBefore !== valCurrent) {
      console.error(`Khác biệt tại trường [${k}]: Trước="${valBefore}", Hiện tại="${valCurrent}"`);
      diff = true;
    }
  }
  if (!diff) {
    console.log('CHỨNG MINH THÀNH CÔNG: Bài 10 thật trên live backend hoàn toàn NGUYÊN VẸN 100%!');
    console.log('Snapshot trước chạy:', JSON.stringify(before, null, 2));
    console.log('Dữ liệu live hiện tại:', JSON.stringify(current, null, 2));
    process.exit(0);
  } else {
    console.error('VI PHẠM AN TOÀN: Bài 10 thật đã bị thay đổi!');
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
