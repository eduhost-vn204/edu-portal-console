import fs from 'fs';

const srcCode = fs.readFileSync('C:/Users/Xuan Truong/.gemini/antigravity/worktrees/_codex_admin_speedfix/implement_production_teaching_scope/src/Mã.js', 'utf8');

const target1 = 'C:/Users/Xuan Truong/.gemini/antigravity/worktrees/_codex_admin_speedfix/implement_production_teaching_scope/apps-script-CAPNHAT.txt';
const target2 = 'C:/Users/Xuan Truong/.gemini/antigravity/worktrees/_codex_friend_profile/implement_production_teaching_scope/apps-script-CAPNHAT.txt';

fs.writeFileSync(target1, srcCode, 'utf8');
fs.writeFileSync(target2, srcCode, 'utf8');
console.log('Successfully synchronized apps-script-CAPNHAT.txt to both repos.');
