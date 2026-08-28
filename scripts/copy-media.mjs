import fs from 'fs';
import path from 'path';

const srcDir = 'C:/Users/Xuan Truong/.gemini/antigravity/brain/e36e7db9-4957-452f-9e82-1608c27a5ece/scratch/vatly-content-studio-private/content-pipeline/chuong-1/05-approved-output/chapter-1-batch-001/media';
const dstLms = 'C:/Users/Xuan Truong/.gemini/antigravity/worktrees/_codex_friend_profile/implement_production_teaching_scope/images/nganhang';
const dstConsole = 'C:/Users/Xuan Truong/.gemini/antigravity/worktrees/_codex_admin_speedfix/implement_production_teaching_scope/images/nganhang';

fs.mkdirSync(dstLms, { recursive: true });
fs.mkdirSync(dstConsole, { recursive: true });

const files = ['VLXT-G12-C1-P16-RL1_21_diagram.png', 'VLXT-G12-C1-P17-RL2_01_diagram.png'];

files.forEach(f => {
  const src = path.join(srcDir, f);
  fs.copyFileSync(src, path.join(dstLms, f));
  fs.copyFileSync(src, path.join(dstConsole, f));
  console.log(`Copied ${f} to both repos.`);
});
