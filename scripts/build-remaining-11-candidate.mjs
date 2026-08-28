import fs from 'fs';
import path from 'path';

const approvedPath = 'C:/Users/Xuan Truong/.gemini/antigravity/brain/e36e7db9-4957-452f-9e82-1608c27a5ece/scratch/vatly-content-studio-private/content-pipeline/chuong-1/05-approved-output/chapter-1-batch-001/teacher-approved-questions.json';
const outputPath = 'C:/Users/Xuan Truong/.gemini/antigravity/brain/e36e7db9-4957-452f-9e82-1608c27a5ece/scratch/vatly-content-studio-private/content-pipeline/chuong-1/05-approved-output/chapter-1-batch-001/batch-001-remaining-11-candidate.json';

const approved = JSON.parse(fs.readFileSync(approvedPath, 'utf8'));

const pilot5Ids = [
  'VLXT-G12-C1-P07-VD03',
  'VLXT-G12-C1-P07-VD04',
  'VLXT-G12-C1-P07-VD05',
  'VLXT-G12-C1-P08-VD07',
  'VLXT-G12-C1-P09-VD08'
];

const remaining11Raw = approved.filter(q => !pilot5Ids.includes(q.id));

const transformed11 = remaining11Raw.map(q => {
  const isDs = q.type === 'TRUE_FALSE_4PART';
  const loai = isDs ? 'DS' : 'TN';

  // Map lesson title
  let baiHoc = 'Bài 3. Nhiệt độ - Thang nhiệt độ - Nhiệt kế';
  if (q.taxonomy && q.taxonomy.lessonCode === 'G12_C1_B05') {
    baiHoc = 'Bài 5. Định luật I của nhiệt động lực học';
  } else if (/định luật I|nội năng|B5/i.test(q.taxonomy?.lessonTitle || '')) {
    baiHoc = 'Bài 5. Định luật I của nhiệt động lực học';
  }

  let optA = '';
  let optB = '';
  let optC = '';
  let optD = '';
  let correct = '';

  if (isDs) {
    // Sub-items statements
    const subMap = {};
    (q.subItems || []).forEach(s => {
      subMap[s.key.toLowerCase()] = s;
    });

    optA = subMap['a'] ? subMap['a'].statement : '';
    optB = subMap['b'] ? subMap['b'].statement : '';
    optC = subMap['c'] ? subMap['c'].statement : '';
    optD = subMap['d'] ? subMap['d'].statement : '';

    // DS correct format: 4 characters of 'Đ' / 'S', e.g. "ĐĐĐS"
    const corrA = subMap['a'] && subMap['a'].isCorrect ? 'Đ' : 'S';
    const corrB = subMap['b'] && subMap['b'].isCorrect ? 'Đ' : 'S';
    const corrC = subMap['c'] && subMap['c'].isCorrect ? 'Đ' : 'S';
    const corrD = subMap['d'] && subMap['d'].isCorrect ? 'Đ' : 'S';
    correct = `${corrA}${corrB}${corrC}${corrD}`;
  } else {
    // TN options
    const optMap = {};
    (q.options || []).forEach(o => {
      optMap[o.key.toUpperCase()] = o.content;
    });

    optA = optMap['A'] || '';
    optB = optMap['B'] || '';
    optC = optMap['C'] || '';
    optD = optMap['D'] || '';
    correct = String(q.correctAnswer || 'A').toUpperCase();
  }

  // Media
  let hinhAnh = '';
  if (q.id === 'VLXT-G12-C1-P16-RL1_21') {
    hinhAnh = 'images/nganhang/VLXT-G12-C1-P16-RL1_21_diagram.png';
  } else if (q.id === 'VLXT-G12-C1-P17-RL2_01') {
    hinhAnh = 'images/nganhang/VLXT-G12-C1-P17-RL2_01_diagram.png';
  }

  return {
    id: q.id,
    mon: 'Vật lý',
    chuong: 'Vật lí nhiệt',
    baiHoc: baiHoc,
    mucDo: q.difficultyLevel || 'VD',
    loai: loai,
    question: q.stem || q.question || '',
    optA: optA,
    optB: optB,
    optC: optC,
    optD: optD,
    correct: correct,
    giaiThich: q.explanation || '',
    hinhAnh: hinhAnh,
    nhomId: '',
    deBaiChung: '',
    chatLuong: 'tinh'
  };
});

fs.writeFileSync(outputPath, JSON.stringify(transformed11, null, 2), 'utf8');
console.log(`Successfully built ${transformed11.length} questions into ${outputPath}`);

// Also copy to scripts for local access
fs.writeFileSync('scripts/batch-001-remaining-11-candidate.json', JSON.stringify(transformed11, null, 2), 'utf8');
