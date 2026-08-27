import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

const matchActions = html.match(/const\s+ADMIN_WRITE_ACTIONS\s*=\s*(\[[^\]]+\]);/);
if (!matchActions) {
  console.error('ERROR: Could not find ADMIN_WRITE_ACTIONS in index.html');
  process.exit(1);
}

// Parse ADMIN_WRITE_ACTIONS array
const adminActions = JSON.parse(matchActions[1].replace(/'/g, '"')).map(a => a.toLowerCase());
console.log('=== 1. DANH SÁCH ADMIN_WRITE_ACTIONS (' + adminActions.length + ' actions) ===');
console.log(adminActions.join(', '));

// Find all calls to postAdminWrite and postAdminWriteWithRetry
const regex = /postAdminWrite(?:WithRetry)?\s*\(\s*\{([^}]+)\}/gs;
let m;
const postWriteCalls = [];
while ((m = regex.exec(html)) !== null) {
  const content = m[1];
  const actMatch = content.match(/action\s*:\s*['"]([^'"]+)['"]/);
  if (actMatch) {
    postWriteCalls.push(actMatch[1].toLowerCase());
  }
}

console.log('\n=== 2. TỔNG SỐ LỜI GỌI postAdminWrite/WithRetry TRONG INDEX.HTML ===');
console.log('Tổng số lời gọi:', postWriteCalls.length);

const uniquePostActions = Array.from(new Set(postWriteCalls));
console.log('Các action duy nhất được gọi:', uniquePostActions);

console.log('\n=== 3. ĐỐI SOÁT TỪNG ACTION VỚI ADMIN_WRITE_ACTIONS ===');
let missing = 0;
for (const act of uniquePostActions) {
  if (!adminActions.includes(act)) {
    console.error('FAIL: Action "' + act + '" được gọi nhưng THIẾU trong ADMIN_WRITE_ACTIONS!');
    missing++;
  } else {
    console.log('PASS: "' + act + '" -> có trong ADMIN_WRITE_ACTIONS');
  }
}

console.log('\n=== 4. KẾT LUẬN ===');
if (missing === 0) {
  console.log('TẤT CẢ ' + uniquePostActions.length + ' ACTION GHI ĐỀU NẰM TRONG ADMIN_WRITE_ACTIONS.');
} else {
  console.error('CÓ ' + missing + ' ACTION CHƯA ĐƯỢC ĐĂNG KÝ!');
  process.exit(1);
}
