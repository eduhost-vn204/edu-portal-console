import fs from 'fs';
import path from 'path';

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log(`Checking ${htmlFiles.length} HTML files for sidebar Live & Xem lại item...`);
let missing = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // Nếu file có drawer-nav thì phải có quan-ly-live.html
  if (content.includes('drawer-nav') && !content.includes('quan-ly-live.html')) {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error(`❌ FAIL: Missing quan-ly-live.html in drawer-nav of: ${missing.join(', ')}`);
  process.exit(1);
} else {
  console.log(`✅ PASS: All ${htmlFiles.length} HTML files with drawer-nav include quan-ly-live.html consistently!`);
}
