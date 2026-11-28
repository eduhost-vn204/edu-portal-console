import fs from 'fs';

const EXPECTED_HREFS = [
  'index.html',
  'phan-tich-hanh-vi.html',
  'tai-khoan-hoc-sinh.html',
  'ket-qua-thi.html',
  'ho-tro-hoc-tap.html',
  'quan-ly-bai-hoc.html',
  'pham-vi-giang-day.html',
  'phong-thi-thu.html',
  'phong-kiem-tra.html',
  'ngan-hang-de.html',
  'quan-ly-live.html',
  'lich-live.html',
  'dieu-khien-live.html',
  'huong-dan-he-thong.html'
];

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log(`Checking ${htmlFiles.length} HTML files for unified 14-item sidebar order...`);
const errors = [];
let checked = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('drawer-nav')) continue;
  const asideM = content.match(/<aside\b[^>]*>[\s\S]*?<\/aside>/i);
  const scope = asideM ? asideM[0] : content;
  const navStart = scope.indexOf('class="drawer-nav"');
  let navSlice = navStart !== -1 ? scope.slice(navStart) : scope;
  const footIdx = navSlice.indexOf('class="drawer-foot"');
  if (footIdx !== -1) navSlice = navSlice.slice(0, footIdx);
  const navEndIdx = navSlice.indexOf('</nav>');
  if (navEndIdx !== -1) navSlice = navSlice.slice(0, navEndIdx);
  checked++;
  const hrefs = [...navSlice.matchAll(/href="([^"]+)"/g)].map(x => x[1].split('?')[0].split('#')[0]);
  if (JSON.stringify(hrefs) !== JSON.stringify(EXPECTED_HREFS)) {
    errors.push(`${file}: expected ${EXPECTED_HREFS.length} ordered links, got ${hrefs.length} (${hrefs.join(', ')})`);
  }
  if (!content.includes('assets/admin-lucian-uxui.css')) {
    errors.push(`${file}: missing assets/admin-lucian-uxui.css`);
  }
}

if (checked !== EXPECTED_HREFS.length) {
  errors.push(`Expected ${EXPECTED_HREFS.length} pages with drawer-nav, found ${checked}`);
}

if (errors.length > 0) {
  console.error('❌ FAIL:\n' + errors.join('\n'));
  process.exit(1);
}
console.log(`✅ PASS: All ${checked}/${EXPECTED_HREFS.length} Admin pages share the exact 14-item sidebar order & Lucian UX/UI CSS!`);
