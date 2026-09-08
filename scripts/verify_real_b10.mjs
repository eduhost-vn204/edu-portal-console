import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_DB_URL } from './youtube-lesson-pipeline.mjs';

export const REAL_B10_REQUIRED_FIELDS = [
  'MaBai',
  'KhoaHoc',
  'Chuong',
  'TenBai',
  'Video',
  'VideoGiai',
  'MoTaBai',
  'NgayDang',
  'PDF',
  'PDFLyThuyet',
  'PDFLuyenTap',
  'BaiTap',
  'ThoiGianLamBai',
  'ThuTuBai'
];

/**
 * So sánh toàn diện snapshot Bài 10 thật với dữ liệu hiện tại
 */
export function compareRealB10Snapshot(before, current, fields = REAL_B10_REQUIRED_FIELDS) {
  if (!before || typeof before !== 'object') {
    throw new Error('Snapshot before không hợp lệ.');
  }
  if (!current || typeof current !== 'object') {
    throw new Error('Dữ liệu current không hợp lệ.');
  }

  const diffs = [];
  for (const field of fields) {
    const valBefore = String(before[field] !== undefined && before[field] !== null ? before[field] : '').trim();
    const valCurrent = String(current[field] !== undefined && current[field] !== null ? current[field] : '').trim();
    if (valBefore !== valCurrent) {
      diffs.push({
        field,
        expected: valBefore,
        actual: valCurrent
      });
    }
  }

  const ok = diffs.length === 0;
  return {
    ok,
    totalFields: fields.length,
    matchedCount: fields.length - diffs.length,
    diffCount: diffs.length,
    diffs
  };
}

export async function verifyRealB10Live(options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const dbUrl = options.dbUrl || DEFAULT_DB_URL;
  const snapshotPath = options.snapshotPath || path.join(process.cwd(), 'inbox', 'b10-pilot', 'real_b10_snapshot_before.json');

  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Không tìm thấy file snapshot trước chạy tại: ${snapshotPath}`);
  }

  const before = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  const res = await fetchImpl(`${dbUrl}?type=baihoc&t=${Date.now()}`);
  const data = await res.json();
  const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
  const current = list.find(b => String(b.TenBai).trim() === before.TenBai);

  if (!current) {
    throw new Error(`LỖI AN TOÀN: Không tìm thấy Bài 10 thật ("${before.TenBai}") trên backend live!`);
  }

  const result = compareRealB10Snapshot(before, current);
  if (!result.ok) {
    console.error(`\n❌ VI PHẠM AN TOÀN: Bài 10 thật đã bị sai lệch ${result.diffCount}/${result.totalFields} trường:`);
    for (const d of result.diffs) {
      console.error(`   - [${d.field}]: Kỳ vọng="${d.expected}", Thực tế="${d.actual}"`);
    }
    throw new Error(`Bài 10 thật bị thay đổi dữ liệu trên backend!`);
  }

  console.log(`\n======================================================`);
  console.log(`✅ CHỨNG MINH THÀNH CÔNG: Bài 10 thật trên live backend NGUYÊN VẸN 100%!`);
  console.log(`   - Số trường đã đối soát đầy đủ: ${result.totalFields}/${result.totalFields} trường`);
  console.log(`   - Danh sách trường: ${REAL_B10_REQUIRED_FIELDS.join(', ')}`);
  console.log(`   - Mã bài:   ${current.MaBai}`);
  console.log(`   - Tiêu đề:  ${current.TenBai}`);
  console.log(`   - Video:    ${current.Video}`);
  console.log(`   - VideoGiải: ${current.VideoGiai}`);
  console.log(`======================================================\n`);

  return { ok: true, result, current };
}

const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (executedFilePath === currentFilePath) {
  verifyRealB10Live().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}
