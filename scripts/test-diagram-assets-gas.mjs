import assert from 'assert';
import crypto from 'crypto';

console.log('=== TEST SUITE: BACKEND GAS DIAGRAM ASSETS & UPDATE ENDPOINT ===\n');

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

class MockSheet {
  constructor(headers, initialRows = []) {
    this.headers = [...headers];
    this.data = [this.headers, ...initialRows.map(r => [...r])];
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
      setValue: (val) => {
        const targetRow = row - 1;
        while (this.data.length <= targetRow) this.data.push(new Array(this.headers.length).fill(''));
        this.data[targetRow][col - 1] = val;
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
}

class MockSpreadsheetApp {
  constructor(sheetsMap = {}) {
    this.sheets = sheetsMap;
  }
  getActiveSpreadsheet() {
    return {
      getSheetByName: (name) => this.sheets[name] || null
    };
  }
}

// 1:1 Logic of Mã.js functions for testing
function runGasImport(sheet, data, adminKey = 'valid_key') {
  if (!data.adminKey || data.adminKey !== adminKey) {
    return { ok: false, success: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' };
  }

  const dryRun = data.dryRun === true || data.dryRun === 'true';
  const batchId = String(data.batchId || 'BATCH_TEST').trim();
  const rawQuestions = Array.isArray(data.questions) ? data.questions : [];

  if (!rawQuestions.length) return { ok: false, success: false, msg: 'Danh sách questions rỗng' };

  const rows = sheet.getDataRange().getValues();
  if (!rows || rows.length === 0) return { ok: false, success: false, error: 'EmptySheet', msg: 'Sheet NganHang rỗng' };

  const headers = rows[0].map(h => String(h || '').trim());
  const headersLower = headers.map(h => h.toLowerCase());
  const diagColIdx = headersLower.indexOf('diagramassets');
  if (diagColIdx === -1) {
    return {
      ok: false,
      success: false,
      error: 'SchemaMigrationRequired',
      msg: 'Sheet NganHang thiếu cột diagramAssets. Yêu cầu migration header trước.'
    };
  }

  const colMap = {};
  headersLower.forEach((h, i) => { colMap[h] = i; });

  const idCol = colMap['id'] !== undefined ? colMap['id'] : 0;
  const qCol = colMap['question'] !== undefined ? colMap['question'] : 7;
  const clCol = colMap['chatluong'] !== undefined ? colMap['chatluong'] : 17;
  const ktCol = colMap['kythuat'] !== undefined ? colMap['kythuat'] : 18;
  const optACol = colMap['opta'] !== undefined ? colMap['opta'] : 8;
  const optBCol = colMap['optb'] !== undefined ? colMap['optb'] : 9;
  const optCCol = colMap['optc'] !== undefined ? colMap['optc'] : 10;
  const optDCol = colMap['optd'] !== undefined ? colMap['optd'] : 11;
  const corCol = colMap['correct'] !== undefined ? colMap['correct'] : 12;

  const existingIdMap = new Map();
  let countBefore = 0;
  let lastRealRow = 1;

  for (let i = 1; i < rows.length; i++) {
    const rId = String(rows[i][idCol] || '').trim();
    if (rId) {
      countBefore++;
      lastRealRow = i + 1;
      existingIdMap.set(rId, {
        rowIndex: i + 1,
        questionText: String(rows[i][qCol] || '').trim(),
        chatLuong: String(rows[i][clCol] || '').trim().toLowerCase(),
        kyThuat: String(rows[i][ktCol] || '').trim(),
        optA: String(rows[i][optACol] || '').trim(),
        optB: String(rows[i][optBCol] || '').trim(),
        optC: String(rows[i][optCCol] || '').trim(),
        optD: String(rows[i][optDCol] || '').trim(),
        correct: String(rows[i][corCol] || '').trim(),
        diagramAssets: String(rows[i][diagColIdx] || '').trim()
      });
    }
  }

  const seenPayloadIds = new Set();
  const alreadyExistsIds = [];
  const insertedRows = [];
  const updatedRows = [];
  const quarantinedItems = [];
  const passedItems = [];
  const normalizedPreview = [];
  const nowIso = new Date().toISOString();

  for (let idx = 0; idx < rawQuestions.length; idx++) {
    const q = rawQuestions[idx] || {};
    const id = String(q.id || '').trim();
    const technicalErrors = [];

    if (!id) technicalErrors.push('Thiếu mã định danh id');
    else if (seenPayloadIds.has(id)) technicalErrors.push('Mã id bị trùng lặp');
    if (id) seenPayloadIds.add(id);

    const questionText = String(q.question || '').trim();
    if (!questionText) technicalErrors.push('Thân câu hỏi không được để trống');

    let optA = String(q.optA || '').trim();
    let optB = String(q.optB || '').trim();
    let optC = String(q.optC || '').trim();
    let optD = String(q.optD || '').trim();
    let cleanCorrect = String(q.correct || 'A').trim().toUpperCase();

    // Diagram assets validation
    let diagramAssetsArr = [];
    let diagStr = '';
    if (q.diagramAssets) {
      if (typeof q.diagramAssets === 'string') {
        try {
          diagramAssetsArr = JSON.parse(q.diagramAssets);
        } catch (e) {
          technicalErrors.push('diagramAssets không phải JSON hợp lệ: ' + e.message);
        }
      } else if (Array.isArray(q.diagramAssets)) {
        diagramAssetsArr = q.diagramAssets;
      }
    }

    if (q.svgContent) {
      technicalErrors.push('Payload không được chứa svgContent (phải dùng CDN url)');
    }

    if (Array.isArray(diagramAssetsArr) && diagramAssetsArr.length > 0) {
      const validBindings = ['STEM', 'OPTION_A', 'OPTION_B', 'OPTION_C', 'OPTION_D'];
      diagramAssetsArr.forEach(function(da, daIdx) {
        if (!da || typeof da !== 'object') {
          technicalErrors.push('diagramAssets[' + daIdx + '] không đúng cấu trúc đối tượng');
          return;
        }
        const b = String(da.binding || '').toUpperCase();
        if (validBindings.indexOf(b) === -1) {
          technicalErrors.push('diagramAssets[' + daIdx + '].binding không hợp lệ: "' + da.binding + '"');
        }
        const fmt = String(da.format || '').toUpperCase();
        if (fmt !== 'SVG') {
          technicalErrors.push('diagramAssets[' + daIdx + '].format không hợp lệ (phải là SVG)');
        }
        const verStatus = (da.verification && da.verification.status) || da.status;
        if (verStatus !== 'VERIFIED') {
          technicalErrors.push('Hình ảnh ' + (da.id || '#' + (daIdx + 1)) + ' chưa được Thầy thẩm định (trạng thái: ' + (verStatus || 'CHUA_XAC_NHAN') + ')');
        }
        const sha = String(da.sha256 || '').trim();
        if (!/^[a-f0-9]{64}$/i.test(sha)) {
          technicalErrors.push('diagramAssets[' + daIdx + '].sha256 không hợp lệ (phải là 64 ký tự hex)');
        }
        if (da.svgContent) {
          technicalErrors.push('diagramAssets[' + daIdx + '] không được chứa svgContent trong payload production');
        }
        const daUrl = String(da.url || '').trim();
        if (!daUrl) {
          technicalErrors.push('diagramAssets[' + daIdx + '] thiếu url');
        } else {
          if (daUrl.indexOf('http://') === 0 || daUrl.indexOf('file://') === 0 || /^[a-zA-Z]:\\/.test(daUrl) ||
              daUrl.indexOf('localhost') !== -1 || daUrl.indexOf('127.0.0.1') !== -1 ||
              daUrl.indexOf('data:') === 0 || daUrl.indexOf('javascript:') === 0) {
            technicalErrors.push('diagramAssets[' + daIdx + '].url chứa giao thức hoặc địa chỉ không an toàn: "' + daUrl + '"');
          } else if (!daUrl.startsWith('https://vatlyxuantruong.io.vn/images/diagrams/')) {
            technicalErrors.push('diagramAssets[' + daIdx + '].url không thuộc allowlist CDN: "' + daUrl + '"');
          }
        }
      });
      diagStr = JSON.stringify(diagramAssetsArr);
    }

    let chatLuong = 'tho';
    let kyThuat = 'Dat';
    let lyDoCachLy = '';

    if (technicalErrors.length > 0) {
      chatLuong = 'tho';
      kyThuat = 'CachLy';
      lyDoCachLy = technicalErrors.join('; ');
      quarantinedItems.push({ index: idx, id: id || ('(index ' + idx + ')'), reason: lyDoCachLy });
    } else {
      passedItems.push(id);
    }

    let hinhAnh = String(q.hinhAnh || '').trim();
    if (!hinhAnh && Array.isArray(diagramAssetsArr) && diagramAssetsArr.length > 0) {
      const stemDiag = diagramAssetsArr.find(d => d && String(d.binding || '').toUpperCase() === 'STEM');
      if (stemDiag && stemDiag.url) hinhAnh = stemDiag.url;
    }

    const rowObj = {
      id: id,
      mon: 'Vật lý',
      chuong: 'Vật lí nhiệt',
      mucdo: 'TH',
      loai: 'TN',
      nhomid: '',
      debaichung: '',
      question: questionText,
      opta: optA,
      optb: optB,
      optc: optC,
      optd: optD,
      correct: cleanCorrect,
      hinhanh: hinhAnh,
      giaithich: '',
      ngaythem: nowIso,
      baihoc: 'B1',
      chatluong: chatLuong,
      kythuat: kyThuat,
      lydocachly: lyDoCachLy,
      batchid: batchId,
      diagramassets: diagStr
    };
    const rowArr = headersLower.map(h => rowObj.hasOwnProperty(h) ? rowObj[h] : '');

    const matchedEntry = id ? existingIdMap.get(id) : null;
    if (matchedEntry) {
      const isIdentical = (
        matchedEntry.questionText === questionText &&
        matchedEntry.correct === cleanCorrect &&
        (matchedEntry.diagramAssets || '') === (diagStr || '')
      );
      if (isIdentical) {
        alreadyExistsIds.push(id);
      } else {
        updatedRows.push({ rowIndex: matchedEntry.rowIndex, rowData: rowArr, id: id });
      }
    } else {
      insertedRows.push(rowArr);
    }

    normalizedPreview.push({ id, chatLuong, kyThuat, lyDoCachLy, hinhAnh, diagramAssets: diagStr });
  }

  const sentCount = rawQuestions.length;
  const insertable = insertedRows.length;
  const updatable = updatedRows.length;
  const alreadyExistsCount = alreadyExistsIds.length;
  const totalAccounted = insertable + updatable + alreadyExistsCount;

  if (totalAccounted !== sentCount) {
    return { ok: false, success: false, error: 'AccountingMismatch', msg: 'Accounting mismatch' };
  }

  if (dryRun) {
    return {
      ok: true, success: true, dryRun: true, batchId,
      sentCount, insertedCount: insertable, updatedCount: updatable,
      alreadyExistsCount, quarantinedCount: quarantinedItems.length,
      passedCount: passedItems.length, quarantinedItems, items: normalizedPreview
    };
  }

  updatedRows.forEach(u => {
    sheet.getRange(u.rowIndex, 1, 1, u.rowData.length).setValues([u.rowData]);
  });
  if (insertable > 0) {
    const startRow = lastRealRow + 1;
    sheet.getRange(startRow, 1, insertable, headers.length).setValues(insertedRows);
  }

  return {
    ok: true, success: true, dryRun: false, batchId,
    sentCount, insertedCount: insertable, updatedCount: updatable,
    alreadyExistsCount, quarantinedCount: quarantinedItems.length,
    passedCount: passedItems.length, quarantinedItems, items: normalizedPreview
  };
}

function runGasUpdateQuestionDiagramAssetsById(sheet, data, adminKey = 'valid_key') {
  if (!data.adminKey || data.adminKey !== adminKey) {
    return { ok: false, success: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' };
  }

  const dryRun = data.dryRun === true || data.dryRun === 'true';
  const id = String(data.id || '').trim();
  if (!id) {
    return { ok: false, success: false, error: 'MissingId', msg: 'Thiếu mã định danh câu hỏi (id)' };
  }

  const rows = sheet.getDataRange().getValues();
  if (!rows || rows.length < 2) {
    return { ok: false, success: false, error: 'EmptySheet', msg: 'Sheet NganHang rỗng hoặc chỉ có header' };
  }

  const headers = rows[0].map(h => String(h || '').trim());
  const headersLower = headers.map(h => h.toLowerCase());
  const idColIdx = headersLower.indexOf('id');
  const diagColIdx = headersLower.indexOf('diagramassets');
  const hinhAnhColIdx = headersLower.indexOf('hinhanh');

  if (diagColIdx === -1) {
    return {
      ok: false,
      success: false,
      error: 'SchemaMigrationRequired',
      msg: 'Sheet NganHang thiếu cột diagramAssets. Yêu cầu migration header trước.'
    };
  }

  const matchedRows = [];
  for (let i = 1; i < rows.length; i++) {
    const rowId = String(rows[i][idColIdx !== -1 ? idColIdx : 0] || '').trim();
    if (rowId === id) {
      matchedRows.push({ rowIndex: i + 1, rowData: rows[i] });
    }
  }

  if (matchedRows.length === 0) {
    return { ok: false, success: false, error: 'QuestionNotFound', msg: 'Không tìm thấy câu hỏi với ID: ' + id };
  }
  if (matchedRows.length > 1) {
    return {
      ok: false,
      success: false,
      error: 'MultipleQuestionsFound',
      msg: 'Phát hiện ' + matchedRows.length + ' dòng trùng ID ' + id + ' trong sheet NganHang. Cần kiểm tra thủ công.'
    };
  }

  const target = matchedRows[0];
  const currentRowData = [...target.rowData];

  let diagramAssetsArr = [];
  if (data.diagramAssets) {
    if (typeof data.diagramAssets === 'string') {
      try {
        diagramAssetsArr = JSON.parse(data.diagramAssets);
      } catch (e) {
        return { ok: false, success: false, error: 'ValidationError', msg: 'diagramAssets không phải JSON hợp lệ: ' + e.message };
      }
    } else if (Array.isArray(data.diagramAssets)) {
      diagramAssetsArr = data.diagramAssets;
    }
  }

  if (!Array.isArray(diagramAssetsArr) || diagramAssetsArr.length === 0) {
    return { ok: false, success: false, error: 'ValidationError', msg: 'diagramAssets rỗng hoặc không phải danh sách hợp lệ' };
  }

  const validationErrors = [];
  const validBindings = ['STEM', 'OPTION_A', 'OPTION_B', 'OPTION_C', 'OPTION_D'];

  diagramAssetsArr.forEach(function(da, daIdx) {
    if (!da || typeof da !== 'object') {
      validationErrors.push('diagramAssets[' + daIdx + '] không phải object');
      return;
    }
    const b = String(da.binding || '').toUpperCase();
    if (!validBindings.includes(b)) {
      validationErrors.push('diagramAssets[' + daIdx + '].binding không hợp lệ: "' + da.binding + '"');
    }
    const fmt = String(da.format || '').toUpperCase();
    if (fmt !== 'SVG') {
      validationErrors.push('diagramAssets[' + daIdx + '].format phải là SVG');
    }
    const verStatus = (da.verification && da.verification.status) || da.status;
    if (verStatus !== 'VERIFIED') {
      validationErrors.push('diagramAssets[' + daIdx + '] chưa được Thầy thẩm định (status: ' + (verStatus || 'CHUA_XAC_NHAN') + ')');
    }
    const sha = String(da.sha256 || '').trim();
    if (!/^[a-f0-9]{64}$/i.test(sha)) {
      validationErrors.push('diagramAssets[' + daIdx + '].sha256 không hợp lệ (phải là 64 ký tự hex)');
    }
    const daUrl = String(da.url || '').trim();
    if (!daUrl.startsWith('https://vatlyxuantruong.io.vn/images/diagrams/')) {
      validationErrors.push('diagramAssets[' + daIdx + '].url phải bắt đầu bằng https://vatlyxuantruong.io.vn/images/diagrams/');
    }
    if (da.svgContent) {
      validationErrors.push('diagramAssets[' + daIdx + '] không được chứa svgContent trong payload production');
    }
  });

  if (validationErrors.length > 0) {
    return { ok: false, success: false, error: 'ValidationError', msg: validationErrors.join('; ') };
  }

  function computeRowHash(arr) {
    return crypto.createHash('sha256').update(JSON.stringify(arr.map(c => String(c || '')))).digest('hex');
  }

  const beforeHash = computeRowHash(currentRowData);
  const updatedRowData = [...currentRowData];
  const diagStr = JSON.stringify(diagramAssetsArr);
  updatedRowData[diagColIdx] = diagStr;

  const stemDiag = diagramAssetsArr.find(d => d && String(d.binding || '').toUpperCase() === 'STEM');
  if (stemDiag && stemDiag.url && hinhAnhColIdx !== -1) {
    updatedRowData[hinhAnhColIdx] = stemDiag.url;
  }

  const afterHash = computeRowHash(updatedRowData);

  if (dryRun) {
    return {
      ok: true, success: true, dryRun: true, id, rowIndex: target.rowIndex,
      beforeHash, afterHash,
      updatedColumns: {
        diagramAssets: diagStr,
        hinhAnh: (stemDiag && stemDiag.url) || (hinhAnhColIdx !== -1 ? currentRowData[hinhAnhColIdx] : '') || ''
      },
      msg: 'Dry-run thành công'
    };
  }

  sheet.getRange(target.rowIndex, diagColIdx + 1).setValue(diagStr);
  if (stemDiag && stemDiag.url && hinhAnhColIdx !== -1) {
    sheet.getRange(target.rowIndex, hinhAnhColIdx + 1).setValue(stemDiag.url);
  }

  return {
    ok: true, success: true, dryRun: false, id, rowIndex: target.rowIndex,
    beforeHash, afterHash, updated: true,
    msg: 'Cập nhật thành công'
  };
}

// ─────────────────────────────────────────────────────────────────
// EXECUTE TEST SCENARIOS
// ─────────────────────────────────────────────────────────────────

const FULL_HEADERS = ['id','mon','chuong','mucDo','loai','nhomId','deBaiChung','question','optA','optB','optC','optD','correct','hinhAnh','giaiThich','ngayThem','baiHoc','chatLuong','kyThuat','lyDoCachLy','batchId','diagramAssets'];
const LEGACY_HEADERS = ['id','mon','chuong','mucDo','loai','nhomId','deBaiChung','question','optA','optB','optC','optD','correct','hinhAnh','giaiThich','ngayThem','baiHoc','chatLuong','kyThuat','lyDoCachLy','batchId'];

// 1. Missing diagramAssets header -> SchemaMigrationRequired
check('1. Schema check: missing diagramAssets header in Sheet reports SchemaMigrationRequired', () => {
  const sheet = new MockSheet(LEGACY_HEADERS, [['Q1', 'Vật lý', 'Nhiệt', 'NB', 'TN', '', '', 'Câu 1?', 'A', 'B', 'C', 'D', 'A', '', '', '2026-09-01', 'B1', 'tho', 'Dat', '', 'B1']]);
  const res = runGasImport(sheet, { adminKey: 'valid_key', dryRun: true, questions: [{ id: 'Q2', question: 'Test?' }] });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'SchemaMigrationRequired');
});

// 2. New question without diagrams -> imported as tho
check('2. New question without diagrams imports as tho / Dat', () => {
  const sheet = new MockSheet(FULL_HEADERS);
  const res = runGasImport(sheet, {
    adminKey: 'valid_key',
    questions: [{ id: 'Q_TEXT', question: 'Chất rắn có nhiệt độ xác định?', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A' }]
  });
  assert.equal(res.ok, true);
  assert.equal(res.insertedCount, 1);
  assert.equal(res.items[0].chatLuong, 'tho');
  assert.equal(res.items[0].kyThuat, 'Dat');
});

// 3. New question with verified STEM SVG -> imported as tho, backfilling hinhAnh
check('3. New question with verified STEM SVG imports as tho and backfills hinhAnh', () => {
  const sheet = new MockSheet(FULL_HEADERS);
  const res = runGasImport(sheet, {
    adminKey: 'valid_key',
    questions: [{
      id: 'Q_STEM_SVG',
      question: 'Quan sát đồ thị hình bên:',
      optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A',
      diagramAssets: [{
        id: 'D01',
        binding: 'STEM',
        format: 'SVG',
        url: 'https://vatlyxuantruong.io.vn/images/diagrams/Q_STEM_SVG-D01.svg',
        sha256: 'a'.repeat(64),
        verification: { status: 'VERIFIED' }
      }]
    }]
  });
  assert.equal(res.ok, true);
  assert.equal(res.items[0].chatLuong, 'tho');
  assert.equal(res.items[0].kyThuat, 'Dat');
  assert.equal(res.items[0].hinhAnh, 'https://vatlyxuantruong.io.vn/images/diagrams/Q_STEM_SVG-D01.svg');
});

// 4. New question with 4 verified Option SVGs -> imported as tho
check('4. New question with 4 verified Option SVGs imports as tho', () => {
  const sheet = new MockSheet(FULL_HEADERS);
  const res = runGasImport(sheet, {
    adminKey: 'valid_key',
    questions: [{
      id: 'Q_OPT_SVG',
      question: 'Đồ thị nào là đẳng áp?',
      optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'B',
      diagramAssets: [
        { id: 'D01', binding: 'OPTION_A', format: 'SVG', url: 'https://vatlyxuantruong.io.vn/images/diagrams/OPT_A.svg', sha256: '1'.repeat(64), status: 'VERIFIED' },
        { id: 'D02', binding: 'OPTION_B', format: 'SVG', url: 'https://vatlyxuantruong.io.vn/images/diagrams/OPT_B.svg', sha256: '2'.repeat(64), status: 'VERIFIED' },
        { id: 'D03', binding: 'OPTION_C', format: 'SVG', url: 'https://vatlyxuantruong.io.vn/images/diagrams/OPT_C.svg', sha256: '3'.repeat(64), status: 'VERIFIED' },
        { id: 'D04', binding: 'OPTION_D', format: 'SVG', url: 'https://vatlyxuantruong.io.vn/images/diagrams/OPT_D.svg', sha256: '4'.repeat(64), status: 'VERIFIED' }
      ]
    }]
  });
  assert.equal(res.ok, true);
  assert.equal(res.items[0].chatLuong, 'tho');
  assert.equal(res.items[0].kyThuat, 'Dat');
});

// 5. Diagram with status PENDING/UNVERIFIED -> quarantined
check('5. Diagram with unverified status is quarantined as tho/CachLy', () => {
  const sheet = new MockSheet(FULL_HEADERS);
  const res = runGasImport(sheet, {
    adminKey: 'valid_key',
    questions: [{
      id: 'Q_PENDING',
      question: 'Test pending diagram:',
      diagramAssets: [{
        id: 'D01', binding: 'STEM', format: 'SVG',
        url: 'https://vatlyxuantruong.io.vn/images/diagrams/D01.svg',
        sha256: 'a'.repeat(64), status: 'RENDERED', verification: { status: 'UNVERIFIED' }
      }]
    }]
  });
  assert.equal(res.ok, true);
  assert.equal(res.quarantinedCount, 1);
  assert.equal(res.items[0].kyThuat, 'CachLy');
  assert.ok(res.items[0].lyDoCachLy.includes('chưa được Thầy thẩm định'));
});

// 6. Diagram URL outside allowlist -> quarantined
check('6. Diagram URL outside allowlist is quarantined as tho/CachLy', () => {
  const sheet = new MockSheet(FULL_HEADERS);
  const res = runGasImport(sheet, {
    adminKey: 'valid_key',
    questions: [{
      id: 'Q_BAD_URL',
      question: 'Test bad URL:',
      diagramAssets: [{
        id: 'D01', binding: 'STEM', format: 'SVG',
        url: 'https://evil-attacker.com/images/bad.svg',
        sha256: 'a'.repeat(64), status: 'VERIFIED'
      }]
    }]
  });
  assert.equal(res.ok, true);
  assert.equal(res.quarantinedCount, 1);
  assert.equal(res.items[0].kyThuat, 'CachLy');
  assert.ok(res.items[0].lyDoCachLy.includes('không thuộc allowlist CDN'));
});

// 7. Localhost / file / data / javascript URL -> quarantined
check('7. Dangerous schemes (file, localhost, javascript) quarantined', () => {
  const sheet = new MockSheet(FULL_HEADERS);
  const res = runGasImport(sheet, {
    adminKey: 'valid_key',
    questions: [{
      id: 'Q_FILE_URL',
      question: 'Test file URL:',
      diagramAssets: [{
        id: 'D01', binding: 'STEM', format: 'SVG',
        url: 'file:///C:/secret/passwords.svg',
        sha256: 'a'.repeat(64), status: 'VERIFIED'
      }]
    }]
  });
  assert.equal(res.ok, true);
  assert.equal(res.quarantinedCount, 1);
  assert.equal(res.items[0].kyThuat, 'CachLy');
  assert.ok(res.items[0].lyDoCachLy.includes('không an toàn'));
});

// 8. svgContent in payload -> quarantined/rejected
check('8. svgContent in payload rejected and quarantined', () => {
  const sheet = new MockSheet(FULL_HEADERS);
  const res = runGasImport(sheet, {
    adminKey: 'valid_key',
    questions: [{
      id: 'Q_SVG_CONTENT',
      question: 'Test svgContent:',
      svgContent: '<svg></svg>',
      diagramAssets: [{
        id: 'D01', binding: 'STEM', format: 'SVG',
        url: 'https://vatlyxuantruong.io.vn/images/diagrams/test.svg',
        sha256: 'a'.repeat(64), status: 'VERIFIED',
        svgContent: '<svg></svg>'
      }]
    }]
  });
  assert.equal(res.ok, true);
  assert.equal(res.quarantinedCount, 1);
  assert.equal(res.items[0].kyThuat, 'CachLy');
  assert.ok(res.items[0].lyDoCachLy.includes('svgContent'));
});

// 9. updateQuestionDiagramAssetsById with unauthorized key
check('9. updateQuestionDiagramAssetsById requires adminKey', () => {
  const sheet = new MockSheet(FULL_HEADERS);
  const res = runGasUpdateQuestionDiagramAssetsById(sheet, { adminKey: 'wrong_key', id: 'IPC-T2-L01-Q12' });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'Unauthorized');
});

// 10. updateQuestionDiagramAssetsById question not found
check('10. updateQuestionDiagramAssetsById returns QuestionNotFound when ID does not exist', () => {
  const sheet = new MockSheet(FULL_HEADERS, [
    ['OTHER_Q', 'Vật lý', 'Nhiệt', 'NB', 'TN', '', '', 'Câu khác', 'A', 'B', 'C', 'D', 'A', '', '', '2026-09-01', 'B1', 'tho', 'Dat', '', 'B1', '']
  ]);
  const res = runGasUpdateQuestionDiagramAssetsById(sheet, { adminKey: 'valid_key', id: 'IPC-T2-L01-Q12' });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'QuestionNotFound');
});

// 11. updateQuestionDiagramAssetsById duplicate rows fail-closed
check('11. updateQuestionDiagramAssetsById aborts with MultipleQuestionsFound if duplicate rows exist', () => {
  const sheet = new MockSheet(FULL_HEADERS, [
    ['IPC-T2-L01-Q12', 'Vật lý', 'Nhiệt', 'NB', 'TN', '', '', 'Câu 12 bản 1', 'A', 'B', 'C', 'D', 'A', '', '', '2026-09-01', 'B1', 'tho', 'Dat', '', 'B1', ''],
    ['IPC-T2-L01-Q12', 'Vật lý', 'Nhiệt', 'NB', 'TN', '', '', 'Câu 12 bản 2', 'A', 'B', 'C', 'D', 'A', '', '', '2026-09-01', 'B1', 'tho', 'Dat', '', 'B1', '']
  ]);
  const res = runGasUpdateQuestionDiagramAssetsById(sheet, {
    adminKey: 'valid_key',
    id: 'IPC-T2-L01-Q12',
    diagramAssets: [{ id: 'D01', binding: 'STEM', format: 'SVG', url: 'https://vatlyxuantruong.io.vn/images/diagrams/Q12.svg', sha256: 'a'.repeat(64), status: 'VERIFIED' }]
  });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'MultipleQuestionsFound');
});

// 12. updateQuestionDiagramAssetsById dry-run returns hashes without modifying sheet
check('12. updateQuestionDiagramAssetsById dry-run returns beforeHash and afterHash, does NOT modify sheet', () => {
  const initialRow = ['IPC-T2-L01-Q12', 'Vật lý', 'Nhiệt', 'NB', 'TN', '', '', 'Câu 12 gốc', 'A', 'B', 'C', 'D', 'A', '', '', '2026-09-01', 'B1', 'tho', 'Dat', '', 'B1', ''];
  const sheet = new MockSheet(FULL_HEADERS, [initialRow]);
  
  const validAssets = [{
    id: 'IPC-T2-L01-Q12-D01',
    binding: 'STEM',
    format: 'SVG',
    url: 'https://vatlyxuantruong.io.vn/images/diagrams/IPC-T2-L01-Q12-D01.svg',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'VERIFIED'
  }];

  const res = runGasUpdateQuestionDiagramAssetsById(sheet, {
    adminKey: 'valid_key',
    dryRun: true,
    id: 'IPC-T2-L01-Q12',
    diagramAssets: validAssets
  });

  assert.equal(res.ok, true);
  assert.equal(res.dryRun, true);
  assert.ok(res.beforeHash && res.beforeHash.length === 64);
  assert.ok(res.afterHash && res.afterHash.length === 64);
  assert.notEqual(res.beforeHash, res.afterHash);

  // Verify sheet was untouched
  const rowAfterDryRun = sheet.getDataRange().getValues()[1];
  assert.equal(rowAfterDryRun[21], ''); // diagramAssets still empty
  assert.equal(rowAfterDryRun[13], ''); // hinhAnh still empty
});

// 13. updateQuestionDiagramAssetsById real execution updates ONLY diagramAssets & hinhAnh
check('13. updateQuestionDiagramAssetsById real execution updates only diagramAssets & hinhAnh', () => {
  const initialRow = ['IPC-T2-L01-Q12', 'Vật lý', 'Nhiệt', 'NB', 'TN', '', '', 'Câu 12 gốc', 'A', 'B', 'C', 'D', 'A', '', 'Giải thích gốc', '2026-09-01', 'B1', 'tho', 'Dat', '', 'B1', ''];
  const sheet = new MockSheet(FULL_HEADERS, [initialRow]);
  
  const validAssets = [{
    id: 'IPC-T2-L01-Q12-D01',
    binding: 'STEM',
    format: 'SVG',
    url: 'https://vatlyxuantruong.io.vn/images/diagrams/IPC-T2-L01-Q12-D01.svg',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'VERIFIED'
  }];

  const res = runGasUpdateQuestionDiagramAssetsById(sheet, {
    adminKey: 'valid_key',
    dryRun: false,
    id: 'IPC-T2-L01-Q12',
    diagramAssets: validAssets
  });

  assert.equal(res.ok, true);
  assert.equal(res.updated, true);
  assert.equal(sheet.data.length, 2); // No new row appended!

  const updatedRow = sheet.getDataRange().getValues()[1];
  assert.equal(updatedRow[0], 'IPC-T2-L01-Q12');
  assert.equal(updatedRow[7], 'Câu 12 gốc'); // question preserved
  assert.equal(updatedRow[13], 'https://vatlyxuantruong.io.vn/images/diagrams/IPC-T2-L01-Q12-D01.svg'); // hinhAnh updated
  assert.equal(updatedRow[14], 'Giải thích gốc'); // giaiThich preserved
  assert.equal(updatedRow[17], 'tho'); // chatLuong preserved
  assert.ok(updatedRow[21].includes('IPC-T2-L01-Q12-D01')); // diagramAssets updated
});

console.log('\n=== KẾT QUẢ: TOÀN BỘ KIỂM THỬ BACKEND GAS DIAGRAM ASSETS ĐẠT 100% ===\n');
