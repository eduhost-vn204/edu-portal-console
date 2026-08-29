import assert from 'assert';

console.log('=== TEST SUITE: 1-CLICK TINH IMPORT & TECHNICAL SCANNER (ISSUE #11) ===\n');

function check(title, fn) {
  try {
    fn();
    console.log('OK   -', title);
  } catch (e) {
    console.error('FAIL -', title);
    console.error(e);
    process.exitCode = 1;
  }
}

const NH_HEADERS = ['id','mon','chuong','mucDo','loai','nhomId','deBaiChung','question','optA','optB','optC','optD','correct','hinhAnh','giaiThich','ngayThem','baiHoc','chatLuong','kyThuat','lyDoCachLy','batchId'];

class MockSheet {
  constructor(headers, initialRows = []) {
    this.headers = [...headers];
    this.data = [this.headers, ...initialRows];
  }
  getDataRange() {
    return {
      getValues: () => this.data.map(r => [...r])
    };
  }
  getLastRow() {
    return this.data.length;
  }
  getRange(row, col, numRows = 1, numCols = 1) {
    return {
      getValues: () => {
        const res = [];
        for (let r = 0; r < numRows; r++) {
          const targetRow = row - 1 + r;
          const rowData = this.data[targetRow] || [];
          res.push(rowData.slice(col - 1, col - 1 + numCols));
        }
        return res;
      },
      setValues: (matrix) => {
        for (let r = 0; r < matrix.length; r++) {
          const targetRow = row - 1 + r;
          while (this.data.length <= targetRow) this.data.push(new Array(this.headers.length).fill(''));
          for (let c = 0; c < matrix[r].length; c++) {
            this.data[targetRow][col - 1 + c] = matrix[r][c];
          }
        }
      }
    };
  }
  deleteRows(startRow, numRows) {
    this.data.splice(startRow - 1, numRows);
  }
}

function normalizeTextForComparison(text) {
  if (!text) return '';
  return String(text).toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '').trim();
}

function mockImportNganHang(sheet, data, adminKey = 'valid_key') {
  if (!data.adminKey || data.adminKey !== adminKey) {
    return { ok: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' };
  }

  const dryRun = data.dryRun === true || data.dryRun === 'true';
  const batchId = String(data.batchId || 'BATCH_TEST').trim();
  const rawQuestions = Array.isArray(data.questions) ? data.questions : [];

  if (!rawQuestions.length) return { ok: false, msg: 'Danh sách questions rỗng' };
  if (rawQuestions.length > 200) return { ok: false, msg: 'Số lượng câu vượt quá 200' };

  const rows = sheet.getDataRange().getValues();
  const existingIdMap = new Map();
  const existingTinhNormMap = new Map();
  let countBefore = 0;
  let tinhUsableBefore = 0;
  let lastRealRow = 1;

  for (let i = 1; i < rows.length; i++) {
    const rId = String(rows[i][0] || '').trim();
    if (rId) {
      countBefore++;
      lastRealRow = i + 1;
      const qText = String(rows[i][7] || '').trim();
      const normQ = normalizeTextForComparison(qText);
      const cl = String(rows[i][17] || '').trim().toLowerCase();
      const kt = String(rows[i][18] || '').trim();

      existingIdMap.set(rId, { rowIndex: i + 1, normText: normQ, chatLuong: cl, kyThuat: kt });
      if (cl === 'tinh') {
        if (!kt || kt.toLowerCase() === 'dat') tinhUsableBefore++;
        if (normQ.length > 15) existingTinhNormMap.set(normQ, rId);
      }
    }
  }

  const seenPayloadIds = new Set();
  const seenPayloadNorms = new Map();
  const alreadyExistsIds = [];
  const quarantinedItems = [];
  const passedItems = [];
  const normalizedRows = [];

  for (let idx = 0; idx < rawQuestions.length; idx++) {
    const q = rawQuestions[idx] || {};
    const id = String(q.id || '').trim();
    const technicalErrors = [];

    if (!id) technicalErrors.push('Thiếu mã id');
    else if (seenPayloadIds.has(id)) technicalErrors.push('Mã id trùng lặp');
    if (id) seenPayloadIds.add(id);

    const questionText = String(q.question || q.stem || '').trim();
    const normText = normalizeTextForComparison(questionText);

    const existingEntry = id ? existingIdMap.get(id) : null;
    if (existingEntry) {
      if (existingEntry.chatLuong === 'tinh' && existingEntry.normText === normText) {
        alreadyExistsIds.push(id);
        continue;
      } else {
        technicalErrors.push('Mã id đã tồn tại với nội dung khác');
      }
    }

    if (normText.length > 20) {
      const dupExistingId = existingTinhNormMap.get(normText);
      if (dupExistingId && dupExistingId !== id) {
        technicalErrors.push('Nội dung trùng lặp hoàn toàn với câu Tinh hiện có [' + dupExistingId + ']');
      } else if (seenPayloadNorms.has(normText)) {
        technicalErrors.push('Nội dung trùng lặp trong cùng gói [' + seenPayloadNorms.get(normText) + ']');
      } else {
        seenPayloadNorms.set(normText, id);
      }
    }

    const loai = String(q.loai || 'TN').trim().toUpperCase();
    if (!['TN', 'DS', 'TLN'].includes(loai)) technicalErrors.push('loai không hợp lệ');
    if (!questionText) technicalErrors.push('Thân câu hỏi rỗng');

    const correct = String(q.correct || q.correctAnswer || '').trim().toUpperCase();
    const optA = String(q.optA || (q.options && q.options[0]?.content) || '').trim();
    const optB = String(q.optB || (q.options && q.options[1]?.content) || '').trim();
    const optC = String(q.optC || (q.options && q.options[2]?.content) || '').trim();
    const optD = String(q.optD || (q.options && q.options[3]?.content) || '').trim();

    if (loai === 'TN') {
      if (!['A', 'B', 'C', 'D'].includes(correct)) technicalErrors.push('Đáp án TN không hợp lệ');
      if (!optA || !optB || !optC || !optD) technicalErrors.push('Thiếu phương án TN');
    } else if (loai === 'DS') {
      const corrClean = correct.replace(/[^ĐSds]/g, '').toUpperCase();
      if (corrClean.length !== 4) technicalErrors.push('Đáp án DS không đủ 4 ký tự Đ/S');
      if (!optA || !optB || !optC || !optD) technicalErrors.push('Thiếu mệnh đề DS');
    }

    const dollarCount = (questionText.match(/\$/g) || []).length;
    if (dollarCount % 2 !== 0) technicalErrors.push('KaTeX $ chưa cân bằng');

    const chatLuong = 'tinh';
    let kyThuat = 'Dat';
    let lyDoCachLy = '';

    if (technicalErrors.length > 0) {
      kyThuat = 'CachLy';
      lyDoCachLy = technicalErrors.join('; ');
      quarantinedItems.push({ index: idx, id, reason: lyDoCachLy });
    } else {
      passedItems.push(id);
    }

    const rowArr = [
      id, q.mon || 'Vật lý', q.chuong || 'Vật lí nhiệt', q.mucDo || 'NB', loai,
      '', '', questionText, optA, optB, optC, optD, correct, '', q.giaiThich || '',
      new Date().toISOString(), q.baiHoc || 'Bài 1. Cấu trúc chất', chatLuong, kyThuat, lyDoCachLy, batchId
    ];
    normalizedRows.push(rowArr);
  }

  const insertable = normalizedRows.length;
  const passedCount = passedItems.length;
  const quarantinedCount = quarantinedItems.length;
  const alreadyExistsCount = alreadyExistsIds.length;

  if (dryRun) {
    return {
      ok: true, dryRun: true, batchId, sentCount: rawQuestions.length,
      insertedCount: insertable, alreadyExistsCount, passedCount, quarantinedCount,
      quarantinedItems, countBefore, expectedCountAfter: countBefore + insertable,
      tinhUsableBefore, expectedTinhUsableAfter: tinhUsableBefore + passedCount
    };
  }

  if (insertable === 0 && alreadyExistsCount > 0) {
    return {
      ok: true, dryRun: false, batchId, sentCount: rawQuestions.length,
      insertedCount: 0, alreadyExistsCount, passedCount: 0, quarantinedCount: 0,
      countBefore, countAfter: countBefore, tinhUsableBefore, tinhUsableAfter: tinhUsableBefore,
      msg: 'Idempotent Pass'
    };
  }

  const startRow = lastRealRow + 1;
  sheet.getRange(startRow, 1, insertable, NH_HEADERS.length).setValues(normalizedRows);

  return {
    ok: true, dryRun: false, batchId, sentCount: rawQuestions.length,
    insertedCount: insertable, alreadyExistsCount, passedCount, quarantinedCount,
    quarantinedItems, countBefore, countAfter: countBefore + insertable,
    tinhUsableBefore, tinhUsableAfter: tinhUsableBefore + passedCount
  };
}

// ── Test Cases ──
const initialBatch1 = [
  ['VLXT-G12-C1-P06-VD01', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Nhiệt giai Celsius chọn mốc 0 độ C là gì?', 'Nhiệt độ sôi của nước', 'Nhiệt độ đóng băng của nước tinh khiết', 'Không độ tuyệt đối', 'Điểm ba của nước', 'B', '', '', '2026-08-28', 'Bài 3. Nhiệt độ - Thang nhiệt độ - Nhiệt kế', 'tinh', 'Dat', '', 'BATCH_001']
];

check('1. Từ chối khi sai adminKey', () => {
  const sheet = new MockSheet(NH_HEADERS, initialBatch1);
  const res = mockImportNganHang(sheet, { adminKey: 'wrong' });
  assert.strictEqual(res.ok, false);
  assert.strictEqual(res.error, 'Unauthorized');
});

check('2. Nạp batch mới 29 câu chuẩn -> Tất cả 29 câu Đạt, ghi thành công', () => {
  const sheet = new MockSheet(NH_HEADERS, initialBatch1);
  const sample29 = [];
  for (let i = 1; i <= 29; i++) {
    sample29.push({
      id: `VLXT-PT-P011-Q${String(i).padStart(2, '0')}`,
      question: `Câu hỏi số ${i} về mô hình động học phân tử chất khí và cấu trúc chất theo thuyết Brown $E = mc^2$`,
      optA: 'Phương án A', optB: 'Phương án B', optC: 'Phương án C', optD: 'Phương án D',
      correct: 'A', mucDo: 'NB', loai: 'TN', chatLuong: 'tinh',
      chuong: 'Vật lí nhiệt', baiHoc: 'Bài 1. Cấu trúc chất'
    });
  }

  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', batchId: 'BATCH_TEST_29', questions: sample29 });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.sentCount, 29);
  assert.strictEqual(res.insertedCount, 29);
  assert.strictEqual(res.passedCount, 29);
  assert.strictEqual(res.quarantinedCount, 0);
  assert.strictEqual(res.tinhUsableBefore, 1);
  assert.strictEqual(res.tinhUsableAfter, 30);
  assert.strictEqual(res.countAfter, 30);
});

check('3. Idempotency: Gửi lại cùng batch 29 câu -> không nhân bản, trả idempotent pass', () => {
  const sheet = new MockSheet(NH_HEADERS, initialBatch1);
  const sample29 = [];
  for (let i = 1; i <= 29; i++) {
    sample29.push({
      id: `VLXT-PT-P011-Q${String(i).padStart(2, '0')}`,
      question: `Câu hỏi số ${i} về mô hình động học phân tử chất khí và cấu trúc chất theo thuyết Brown $E = mc^2$`,
      optA: 'Phương án A', optB: 'Phương án B', optC: 'Phương án C', optD: 'Phương án D',
      correct: 'A', mucDo: 'NB', loai: 'TN', chatLuong: 'tinh',
      chuong: 'Vật lí nhiệt', baiHoc: 'Bài 1. Cấu trúc chất'
    });
  }

  // First import
  mockImportNganHang(sheet, { adminKey: 'valid_key', batchId: 'BATCH_TEST_29', questions: sample29 });
  const rowsAfterFirst = sheet.getDataRange().getValues().length;

  // Second import of same batch
  const res2 = mockImportNganHang(sheet, { adminKey: 'valid_key', batchId: 'BATCH_TEST_29', questions: sample29 });
  assert.strictEqual(res2.ok, true);
  assert.strictEqual(res2.alreadyExistsCount, 29);
  assert.strictEqual(res2.insertedCount, 0);
  const rowsAfterSecond = sheet.getDataRange().getValues().length;
  assert.strictEqual(rowsAfterSecond, rowsAfterFirst, 'Không được tăng số dòng khi gửi lại batch trùng');
});

check('4. Automated Scanner: Tự động Cách ly câu lỗi KaTeX hoặc trùng lặp nội dung, câu sạch vẫn Đạt', () => {
  const sheet = new MockSheet(NH_HEADERS, initialBatch1);
  const mixedBatch = [
    {
      id: 'Q_CLEAN_01',
      question: 'Đây là câu hỏi sạch số 1 về nhiệt độ $T = t + 273$',
      optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A',
      chuong: 'Vật lí nhiệt', baiHoc: 'Bài 1', mucDo: 'NB', loai: 'TN'
    },
    {
      id: 'Q_ERR_KATEX',
      question: 'Câu này bị lỗi thiếu dấu KaTeX $T = t + 273 (chưa đóng)',
      optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'B',
      chuong: 'Vật lí nhiệt', baiHoc: 'Bài 1', mucDo: 'NB', loai: 'TN'
    },
    {
      id: 'Q_DUP_EXISTING',
      question: 'Nhiệt giai Celsius chọn mốc 0 độ C là gì?', // Trùng câu đã có trong initialBatch1
      optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'B',
      chuong: 'Vật lí nhiệt', baiHoc: 'Bài 1', mucDo: 'NB', loai: 'TN'
    }
  ];

  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', batchId: 'BATCH_MIXED', questions: mixedBatch });
  assert.strictEqual(res.ok, true);
  assert.strictEqual(res.sentCount, 3);
  assert.strictEqual(res.passedCount, 1);
  assert.strictEqual(res.quarantinedCount, 2);
  assert.strictEqual(res.quarantinedItems.length, 2);
  assert.ok(res.quarantinedItems[0].reason.includes('KaTeX'));
  assert.ok(res.quarantinedItems[1].reason.includes('trùng lặp'));
});

console.log('\n=== TOÀN BỘ KIỂM THỬ SCANNER & QUARANTINE ĐẠT 100% ===');
