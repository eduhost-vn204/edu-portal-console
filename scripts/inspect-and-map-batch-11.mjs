import fs from 'fs';

const approvedPath = 'C:/Users/Xuan Truong/.gemini/antigravity/brain/e36e7db9-4957-452f-9e82-1608c27a5ece/scratch/vatly-content-studio-private/content-pipeline/chuong-1/05-approved-output/chapter-1-batch-001/teacher-approved-questions.json';
const approved = JSON.parse(fs.readFileSync(approvedPath, 'utf8'));

const pilot5Ids = [
  'VLXT-G12-C1-P07-VD03',
  'VLXT-G12-C1-P07-VD04',
  'VLXT-G12-C1-P07-VD05',
  'VLXT-G12-C1-P08-VD07',
  'VLXT-G12-C1-P09-VD08'
];

const remaining11 = approved.filter(q => !pilot5Ids.includes(q.id));

console.log('=== REMAINING 11 QUESTIONS BREAKDOWN ===');
remaining11.forEach((q, idx) => {
  console.log(`\n[${idx + 1}] ID: ${q.id}`);
  console.log(`    Type: ${q.type}`);
  console.log(`    Stem: ${q.stem ? q.stem.slice(0, 80) : '(empty)'}...`);
  console.log(`    Taxonomy:`, q.taxonomy);
  console.log(`    CorrectAnswer: ${q.correctAnswer}`);
  if (q.type === 'TRUE_FALSE_4PART') {
    const dsAnswer = (q.subItems || []).map(s => s.isCorrect ? 'Đ' : 'S').join('');
    console.log(`    DS Statements (${q.subItems.length}):`);
    q.subItems.forEach(s => console.log(`      ${s.key}) [${s.isCorrect ? 'Đ' : 'S'}] ${s.statement.slice(0, 60)}...`));
    console.log(`    Computed Correct: "${dsAnswer}"`);
  } else {
    console.log(`    Options (${q.options.length}):`, q.options.map(o => `${o.key}: ${o.content.slice(0, 30)}`));
  }
  console.log(`    Media:`, q.mediaAssets);
});
