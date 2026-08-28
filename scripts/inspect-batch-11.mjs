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
console.log('Total remaining:', remaining11.length);

remaining11.forEach((q, i) => {
  console.log(`\n--- [${i+1}] ${q.id} ---`);
  console.log('Keys:', Object.keys(q));
  console.log('Format / Type:', { type: q.type, loai: q.loai, question_type: q.question_type });
  console.log('Question:', q.question ? q.question.slice(0, 100) : '');
  if (q.sub_items || q.subItems || q.statements) {
    console.log('Sub-items:', q.sub_items || q.subItems || q.statements);
  }
  if (q.options) {
    console.log('Options:', q.options);
  }
  console.log('Correct:', q.correct || q.correct_answer || q.answer);
  console.log('Images:', q.images || q.image || q.hinhAnh);
});
