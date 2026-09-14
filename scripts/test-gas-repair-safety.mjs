// scripts/test-gas-repair-safety.mjs
// Automated test suite verifying all failure gates and safety contracts in GAS Mã.js
// Completely self-contained with relative paths.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock SpreadsheetApp environment
function createMockSheet({ headers, rows, sheetName = 'NganHang', failOnRow = null, failOnRollbackRow = null, corruptReadBackRow = null }) {
  let setValuesCalls = [];
  let isRollingBack = false;
  const allRows = [headers, ...rows.map(r => [...r])];

  return {
    getName: () => sheetName,
    getLastColumn: () => headers.length,
    getLastRow: () => allRows.length,
    _setRollingBack: (flag) => { isRollingBack = flag; },
    getRange: (startRow, startCol, numRows, numCols) => {
      return {
        getValues: () => {
          if (corruptReadBackRow && startRow === corruptReadBackRow && isRollingBack) {
            return [['__CORRUPTED_VALUE_DURING_ROLLBACK__']];
          }
          const result = [];
          for (let r = 0; r < numRows; r++) {
            const rowIndex = (startRow - 1) + r;
            const rowData = allRows[rowIndex] || [];
            const sliced = [];
            for (let c = 0; c < numCols; c++) {
              const colIndex = (startCol - 1) + c;
              sliced.push(rowData[colIndex] !== undefined ? rowData[colIndex] : '');
            }
            result.push(sliced);
          }
          return result;
        },
        setValues: (values) => {
          if (failOnRow && startRow === failOnRow && !isRollingBack) {
            isRollingBack = true;
            throw new Error('Simulated QuotaExceeded on write row ' + startRow);
          }
          if (failOnRollbackRow && startRow === failOnRollbackRow && isRollingBack) {
            throw new Error('Simulated NetworkDisconnect on rollback row ' + startRow);
          }
          setValuesCalls.push({ startRow, startCol, numRows, numCols, values, isRollingBack });
          for (let r = 0; r < numRows; r++) {
            const rowIndex = (startRow - 1) + r;
            if (!allRows[rowIndex]) allRows[rowIndex] = [];
            for (let c = 0; c < numCols; c++) {
              const colIndex = (startCol - 1) + c;
              allRows[rowIndex][colIndex] = values[r][c];
            }
          }
        }
      };
    },
    _getSetValuesCalls: () => setValuesCalls,
    _getRows: () => allRows
  };
}

function createMockSpreadsheetApp(sheetsMap) {
  return {
    getActiveSpreadsheet: () => ({
      getSheetByName: (name) => sheetsMap[name] || null
    }),
    flush: () => {}
  };
}

// 1. Resolve relative path to Mã.js
const maPath = path.resolve(__dirname, '../src/Mã.js');
if (!fs.existsSync(maPath)) {
  throw new Error('Mã.js not found at relative path: ' + maPath);
}
const maContent = fs.readFileSync(maPath, 'utf-8');

function extractFunction(code, funcName) {
  const targetStr = 'function ' + funcName + '(';
  const startIdx = code.indexOf(targetStr);
  if (startIdx === -1) throw new Error('Function ' + funcName + ' not found in Mã.js');
  let braceCount = 0;
  let foundFirstBrace = false;
  let endIdx = startIdx;
  for (let i = startIdx; i < code.length; i++) {
    if (code[i] === '{') {
      braceCount++;
      foundFirstBrace = true;
    } else if (code[i] === '}') {
      braceCount--;
      if (foundFirstBrace && braceCount === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }
  return code.slice(startIdx, endIdx);
}

const normalizeLessonCode = extractFunction(maContent, 'normalizeLesson');
const buildSheetHeaderMapCode = extractFunction(maContent, 'buildSheetHeaderMap');
const repairIpclassBatchCode = extractFunction(maContent, 'repairIpclassBatch');
const inspectFullSheetDuplicateColumnsCode = extractFunction(maContent, 'inspectFullSheetDuplicateColumns');

let currentSpreadsheetApp = null;
const jsonOut = (obj) => obj;

let lockAcquiredCount = 0;
let lockReleasedCount = 0;
let lockWaitTimeouts = 0;
let simulateLockTimeout = false;

const mockLock = {
  waitLock: (ms) => {
    if (simulateLockTimeout) {
      lockWaitTimeouts++;
      throw new Error('Lock timeout waiting for script lock');
    }
    lockAcquiredCount++;
  },
  releaseLock: () => {
    lockReleasedCount++;
  }
};

const mockLockService = {
  getScriptLock: () => mockLock
};

const evalFactory = new Function('getSpreadsheetApp', 'getLockService', 'jsonOut', 'crypto', `
  var SpreadsheetApp;
  var LockService;
  ${normalizeLessonCode}
  ${buildSheetHeaderMapCode}
  ${repairIpclassBatchCode}
  ${inspectFullSheetDuplicateColumnsCode}
  function repairIpclassBatchWrapper(data) {
    SpreadsheetApp = getSpreadsheetApp();
    LockService = getLockService();
    return repairIpclassBatch(data);
  }
  function inspectFullSheetDuplicateColumnsWrapper(data) {
    SpreadsheetApp = getSpreadsheetApp();
    return inspectFullSheetDuplicateColumns(data);
  }
  return {
    normalizeLesson,
    buildSheetHeaderMap,
    repairIpclassBatch: repairIpclassBatchWrapper,
    inspectFullSheetDuplicateColumns: inspectFullSheetDuplicateColumnsWrapper
  };
`);

const { normalizeLesson, buildSheetHeaderMap, repairIpclassBatch, inspectFullSheetDuplicateColumns } = evalFactory(
  () => currentSpreadsheetApp,
  () => mockLockService,
  jsonOut,
  crypto
);

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('================================================================');
console.log('BẮT ĐẦU CHẠY BỘ KIỂM THỬ AN TOÀN TOÀN DIỆN (7+ FAILURE GATES)');
console.log('================================================================\n');

// ── TEST 1: Duplicate Header Detection in Sheet (FailClosedDuplicateHeaders)
console.log('TEST 1: Duplicate Header Detection in Sheet');
{
  const duplicateHeaders = [
    'id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question',
    'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem',
    'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId',
    'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct'
  ];
  const mockSheet = createMockSheet({ headers: duplicateHeaders, rows: [] });
  const res = buildSheetHeaderMap(mockSheet, ['id', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'baiHoc']);
  assert(!res.ok, 'Phải trả về ok === false khi có header trùng');
  assert(res.error === 'FailClosedDuplicateHeaders', `Lỗi trả về phải là FailClosedDuplicateHeaders (nhận: ${res.error})`);
  assert(res.duplicates.length > 0, `Phải liệt kê danh sách duplicate (tìm thấy ${res.duplicates.length} headers trùng)`);
}

// ── TEST 1b: Missing Required Header Detection (FailClosedMissingHeaders)
console.log('\nTEST 1b: Missing Required Header Detection');
{
  const missingHeaderList = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'optA', 'optB', 'optC', 'optD', 'correct'];
  const mockSheet = createMockSheet({ headers: missingHeaderList, rows: [] });
  const res = buildSheetHeaderMap(mockSheet, ['id', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'baiHoc']);
  assert(!res.ok, 'Phải trả về ok === false khi thiếu header bắt buộc');
  assert(res.error === 'FailClosedMissingHeaders', `Lỗi trả về phải là FailClosedMissingHeaders (nhận: ${res.error})`);
  assert(res.missing.includes('question') && res.missing.includes('baiHoc'), 'Phải báo thiếu question và baiHoc');
}

// ── TEST 1c (Yêu cầu 7): Trực tiếp Fixture 37 Header thật của Production
console.log('\nTEST 1c (Yêu cầu 7): Fixture 37 Header Production thật');
{
  const real37Headers = [
    'id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question',
    'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem',
    'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId',
    'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct',
    'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'
  ];
  assert(real37Headers.length === 37, 'Fixture phải có đúng 37 cột');
  const mockSheet37 = createMockSheet({ headers: real37Headers, rows: [] });
  const res = buildSheetHeaderMap(mockSheet37, ['id', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'baiHoc', 'chatLuong']);
  assert(!res.ok, 'Phải chặn Fail-Closed đối với Sheet 37 cột');
  assert(res.error === 'FailClosedDuplicateHeaders', 'Lỗi phải là FailClosedDuplicateHeaders');
  const dupHeaderNames = res.duplicates.map(d => d.header);
  assert(dupHeaderNames.includes('question') && dupHeaderNames.includes('optA') && dupHeaderNames.includes('correct') && dupHeaderNames.includes('baiHoc'),
    'Phải phát hiện chính xác tất cả các header bắt buộc bị trùng lặp ở cột 22-37');
}

// ── TEST 2: Duplicate ID in Payload Detection (FailClosedDuplicatePayloadIds)
console.log('\nTEST 2: Duplicate ID in Payload Detection');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({ headers: standardHeaders, rows: [['IPC-L01-Q01', '', '', '', '', '', '', 'Q1', 'A', 'B', 'C', 'D', 'A', '', 'GT', '', 'B1', 'tinh', 'Dat', '', 'B1']] });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const payload = {
    updates: [
      { id: 'IPC-L01-Q01', question: 'Q1', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' },
      { id: 'IPC-L01-Q01', question: 'Q1 dup', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' }
    ]
  };
  const res = repairIpclassBatch(payload);
  assert(!res.ok, 'Phải từ chối khi payload có ID trùng');
  assert(res.error === 'FailClosedDuplicatePayloadIds', `Lỗi phải là FailClosedDuplicatePayloadIds (nhận: ${res.error})`);
  assert(res.duplicates.includes('IPC-L01-Q01'), 'Phải chỉ đích danh IPC-L01-Q01');
}

// ── TEST 3: Duplicate ID in Sheet Detection (FailClosedDuplicateSheetIds)
console.log('\nTEST 3: Duplicate ID in Sheet Detection');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [
      ['IPC-L01-Q01', '', '', '', '', '', '', 'Q1-row1', 'A', 'B', 'C', 'D', 'A', '', 'GT', '', 'B1', 'tinh', 'Dat', '', 'B1'],
      ['IPC-L01-Q01', '', '', '', '', '', '', 'Q1-row2', 'A', 'B', 'C', 'D', 'A', '', 'GT', '', 'B1', 'tinh', 'Dat', '', 'B1']
    ]
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const payload = {
    updates: [
      { id: 'IPC-L01-Q01', question: 'Q1', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' }
    ]
  };
  const res = repairIpclassBatch(payload);
  assert(!res.ok, 'Phải từ chối khi Sheet có ID mục tiêu bị trùng dòng');
  assert(res.error === 'FailClosedDuplicateSheetIds', `Lỗi phải là FailClosedDuplicateSheetIds (nhận: ${res.error})`);
}

// ── TEST 4: Missing Target ID in Sheet Detection (FailClosedMissingSheetIds)
console.log('\nTEST 4: Missing Target ID in Sheet Detection');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [
      ['IPC-L01-Q01', '', '', '', '', '', '', 'Q1', 'A', 'B', 'C', 'D', 'A', '', 'GT', '', 'B1', 'tinh', 'Dat', '', 'B1']
    ]
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const payload = {
    updates: [
      { id: 'IPC-L99-Q99', question: 'Q99', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' }
    ]
  };
  const res = repairIpclassBatch(payload);
  assert(!res.ok, 'Phải từ chối khi ID mục tiêu không có trong Sheet');
  assert(res.error === 'FailClosedMissingSheetIds', `Lỗi phải là FailClosedMissingSheetIds (nhận: ${res.error})`);
  assert(res.missing.includes('IPC-L99-Q99'), 'Phải báo thiếu IPC-L99-Q99');
}

// ── TEST 5: Pre-Write Field Validation (Stem, Options, Correct, Explanation)
console.log('\nTEST 5: Pre-Write Field Validation');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [
      ['IPC-L01-Q01', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'B1', 'tho', 'ChuaDat', '', 'B1']
    ]
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  // 5a. Missing stem
  let res = repairIpclassBatch({
    updates: [{ id: 'IPC-L01-Q01', question: '', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' }]
  });
  assert(!res.ok && res.error === 'FailClosedValidationError', 'Phải chặn khi thân câu rỗng');
  assert(res.errors.some(e => e.error === 'FailClosedEmptyQuestion'), 'Phải báo lỗi FailClosedEmptyQuestion');

  // 5b. Missing option
  res = repairIpclassBatch({
    updates: [{ id: 'IPC-L01-Q01', question: 'Valid Q', optA: 'A', optB: '', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' }]
  });
  assert(!res.ok && res.errors.some(e => e.error === 'FailClosedEmptyOptions'), 'Phải chặn khi phương án bị rỗng');

  // 5c. Invalid correct answer (not A/B/C/D)
  res = repairIpclassBatch({
    updates: [{ id: 'IPC-L01-Q01', question: 'Valid Q', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'E', giaiThich: 'GT', baiHoc: 'B1' }]
  });
  assert(!res.ok && res.errors.some(e => e.error === 'FailClosedInvalidCorrectAnswer'), 'Phải chặn khi đáp án không thuộc A/B/C/D');

  // 5d. Missing explanation
  res = repairIpclassBatch({
    updates: [{ id: 'IPC-L01-Q01', question: 'Valid Q', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: '', baiHoc: 'B1' }]
  });
  assert(!res.ok && res.errors.some(e => e.error === 'FailClosedEmptyExplanation'), 'Phải chặn khi lời giải rỗng');
}

// ── TEST 6: Strict Lesson Validation & Rejection of B3 Fallback
console.log('\nTEST 6: Strict Lesson Validation & Rejection of B3 Fallback');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [['IPC-L01-Q01', '', '', '', '', '', '', 'Q', 'A', 'B', 'C', 'D', 'A', '', 'GT', '', 'B1', 'tho', 'ChuaDat', '', 'B1']]
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  // 6a. Empty baiHoc must NOT default to B3, must FAIL CLOSED
  let res = repairIpclassBatch({
    updates: [{ id: 'IPC-L01-Q01', question: 'Valid Q', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: '' }]
  });
  assert(!res.ok && res.errors.some(e => e.error === 'FailClosedEmptyBaiHoc'), 'Bắt buộc phải chặn khi baiHoc bị rỗng (tuyệt đối không default sang B3)');

  // 6b. Garbage baiHoc must FAIL CLOSED
  res = repairIpclassBatch({
    updates: [{ id: 'IPC-L01-Q01', question: 'Valid Q', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'BAI_HOC_KHONG_TON_TAI' }]
  });
  assert(!res.ok && res.errors.some(e => e.error === 'FailClosedInvalidBaiHoc'), 'Bắt buộc phải chặn khi baiHoc không nằm trong danh mục chuẩn');
}

// ── TEST 7: Dry-Run Non-Mutation Assertion
console.log('\nTEST 7: Dry-Run Non-Mutation Assertion');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [
      ['IPC-L01-Q01', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'tho', 'ChuaDat', '', 'B1']
    ]
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const payload = {
    dryRun: true,
    updates: [
      { id: 'IPC-L01-Q01', question: 'Valid Q1', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'Detailed Explanation', baiHoc: 'B1' }
    ]
  };
  const res = repairIpclassBatch(payload);
  assert(res.ok === true, 'Dry-run phải trả về ok === true khi dữ liệu chuẩn');
  assert(res.dryRun === true, 'Kết quả phải ghi nhận dryRun === true');
  assert(res.foundCount === 1, 'Phải tìm thấy 1 dòng cần sửa');
  assert(mockSheet._getSetValuesCalls().length === 0, 'Tuyệt đối KHÔNG ĐƯỢC gọi setValues() khi dryRun === true');
}

// ── TEST 8 (Yêu cầu 7): Bảo toàn toàn bộ các cột ngoài phạm vi cập nhật
console.log('\nTEST 8 (Yêu cầu 7): Bảo toàn cột ngoài phạm vi cập nhật');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const originalRow = [
    'IPC-L01-Q01', 'Vật lý 12', 'CHƯƠNG 1', 'NB', 'TN', '', '', '',
    '', '', '', '', '', 'https://img.host/diagram1.png', '', '2026-09-01T12:00:00.000Z',
    '', 'tho', 'ChuaDat', 'CACH_LY_DOC_QUYEN_XPS', 'BATCH_01'
  ];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [originalRow]
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const res = repairIpclassBatch({
    dryRun: false,
    updates: [
      { id: 'IPC-L01-Q01', question: 'New Question', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'New Explanation', baiHoc: 'B1' }
    ]
  });
  assert(res.ok === true, 'Cập nhật phải thành công');
  const updatedRow = mockSheet._getRows()[1];
  assert(updatedRow[13] === 'https://img.host/diagram1.png', 'Cột hinhAnh phải được bảo toàn nguyên vẹn');
  assert(updatedRow[15] === '2026-09-01T12:00:00.000Z', 'Cột ngayThem phải được bảo toàn nguyên vẹn');
  assert(updatedRow[19] === 'CACH_LY_DOC_QUYEN_XPS', 'Cột lyDoCachLy phải được bảo toàn nguyên vẹn');
}

// ── TEST 9 (Yêu cầu 7): Không để trạng thái nửa thành công (Atomic Transaction)
console.log('\nTEST 9 (Yêu cầu 7): Tính nguyên tử - Không để trạng thái nửa thành công');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [
      ['IPC-L01-Q01', '', '', '', '', '', '', 'Old 1', 'A', 'B', 'C', 'D', 'A', '', 'GT', '', 'B1', 'tho', 'Dat', '', ''],
      ['IPC-L01-Q02', '', '', '', '', '', '', 'Old 2', 'A', 'B', 'C', 'D', 'B', '', 'GT', '', 'B1', 'tho', 'Dat', '', '']
    ]
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  // Payload: câu 1 hợp lệ, câu 2 LỖI (đáp án 'Z' không hợp lệ)
  const res = repairIpclassBatch({
    dryRun: false,
    updates: [
      { id: 'IPC-L01-Q01', question: 'Valid New 1', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' },
      { id: 'IPC-L01-Q02', question: 'Invalid New 2', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'Z', giaiThich: 'GT', baiHoc: 'B1' }
    ]
  });
  assert(!res.ok, 'Toàn bộ giao dịch phải bị từ chối khi có 1 câu lỗi');
  assert(mockSheet._getSetValuesCalls().length === 0, 'Tuyệt đối 0 dòng nào được ghi khi có lỗi biên');
  assert(mockSheet._getRows()[1][7] === 'Old 1', 'Dòng 1 phải giữ nguyên giá trị cũ (không bị ghi đè nửa vời)');
}

// ── TEST 9b (Yêu cầu 5): Tự động Rollback từ Before-Image khi ghi lỗi giữa chừng
console.log('\nTEST 9b (Yêu cầu 5): Phục hồi tự động (Rollback) từ Before-Image khi lỗi giữa chừng');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [
      ['IPC-L01-Q01', '', '', '', '', '', '', 'Old 1', 'A', 'B', 'C', 'D', 'A', '', 'GT', '', 'B1', 'tho', 'Dat', '', ''],
      ['IPC-L01-Q02', '', '', '', '', '', '', 'Old 2', 'A', 'B', 'C', 'D', 'B', '', 'GT', '', 'B1', 'tho', 'Dat', '', ''],
      ['IPC-L01-Q03', '', '', '', '', '', '', 'Old 3', 'A', 'B', 'C', 'D', 'C', '', 'GT', '', 'B1', 'tho', 'Dat', '', '']
    ],
    failOnRow: 3
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const res = repairIpclassBatch({
    dryRun: false,
    updates: [
      { id: 'IPC-L01-Q01', question: 'New 1', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' },
      { id: 'IPC-L01-Q02', question: 'New 2', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'B', giaiThich: 'GT', baiHoc: 'B1' },
      { id: 'IPC-L01-Q03', question: 'New 3', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'C', giaiThich: 'GT', baiHoc: 'B1' }
    ]
  });

  assert(!res.ok, 'Giao dịch phải trả về thất bại khi có lỗi xảy ra');
  assert(res.error === 'TransactionWriteFailedAndRolledBack', 'Lỗi phải là TransactionWriteFailedAndRolledBack');
  assert(res.restoredCount === 1, 'Phải ghi nhận đã rollback phục hồi 1 dòng đã ghi trước đó');
  assert(mockSheet._getRows()[1][7] === 'Old 1', 'Dòng 1 đã được phục hồi nguyên vẹn về giá trị Old 1 (không bị sửa nửa vời)');
  assert(mockSheet._getRows()[2][7] === 'Old 2', 'Dòng 2 giữ nguyên giá trị Old 2');
  assert(mockSheet._getRows()[3][7] === 'Old 3', 'Dòng 3 giữ nguyên giá trị Old 3');
}

// ── TEST 9c (Yêu cầu 4): Lỗi thứ cấp khi đang Rollback -> Báo TransactionWriteFailedRollbackIncomplete
console.log('\nTEST 9c (Yêu cầu 4): Lỗi thứ cấp khi Rollback dòng k -> TransactionWriteFailedRollbackIncomplete');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [
      ['IPC-L01-Q01', '', '', '', '', '', '', 'Old 1', 'A', 'B', 'C', 'D', 'A', '', 'GT', '', 'B1', 'tho', 'Dat', '', ''],
      ['IPC-L01-Q02', '', '', '', '', '', '', 'Old 2', 'A', 'B', 'C', 'D', 'B', '', 'GT', '', 'B1', 'tho', 'Dat', '', ''],
      ['IPC-L01-Q03', '', '', '', '', '', '', 'Old 3', 'A', 'B', 'C', 'D', 'C', '', 'GT', '', 'B1', 'tho', 'Dat', '', '']
    ],
    failOnRow: 4,          // Ghi dòng 2 và 3 thành công, lỗi ở dòng 4 (IPC-L01-Q03)
    failOnRollbackRow: 2   // Khi rollback dòng 2 (IPC-L01-Q01) thì gặp lỗi mạng/quota
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const res = repairIpclassBatch({
    dryRun: false,
    updates: [
      { id: 'IPC-L01-Q01', question: 'New 1', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' },
      { id: 'IPC-L01-Q02', question: 'New 2', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'B', giaiThich: 'GT', baiHoc: 'B1' },
      { id: 'IPC-L01-Q03', question: 'New 3', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'C', giaiThich: 'GT', baiHoc: 'B1' }
    ]
  });

  assert(!res.ok, 'Giao dịch phải trả về thất bại');
  assert(res.error === 'TransactionWriteFailedRollbackIncomplete',
    `Lỗi phải là TransactionWriteFailedRollbackIncomplete khi rollback thất bại (nhận: ${res.error})`);
  assert(res.rollbackFailedRows.length === 1, 'Phải ghi nhận đúng 1 dòng rollback thất bại');
  assert(res.rollbackFailedRows[0].rowIndex === 2, 'Dòng rollback thất bại phải là dòng 2');
  assert(res.rollbackFailedRows[0].reason === 'RollbackWriteFailed', 'Lý do phải là RollbackWriteFailed');
  assert(res.rollbackVerifiedCount === 1, 'Dòng 3 phải rollback thành công (verifiedCount === 1)');
}

// ── TEST 9d (Yêu cầu 4): Đọc lại không khớp sau Rollback (ReadBackMismatch)
console.log('\nTEST 9d (Yêu cầu 4): Đọc lại sau Rollback không khớp Before-Image -> TransactionWriteFailedRollbackIncomplete');
{
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({
    headers: standardHeaders,
    rows: [
      ['IPC-L01-Q01', '', '', '', '', '', '', 'Old 1', 'A', 'B', 'C', 'D', 'A', '', 'GT', '', 'B1', 'tho', 'Dat', '', ''],
      ['IPC-L01-Q02', '', '', '', '', '', '', 'Old 2', 'A', 'B', 'C', 'D', 'B', '', 'GT', '', 'B1', 'tho', 'Dat', '', '']
    ],
    failOnRow: 3,             // Ghi dòng 2 thành công, lỗi ở dòng 3
    corruptReadBackRow: 2     // Khi đọc lại dòng 2 để verify rollback, dữ liệu trả về bị sai lệch
  });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const res = repairIpclassBatch({
    dryRun: false,
    updates: [
      { id: 'IPC-L01-Q01', question: 'New 1', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' },
      { id: 'IPC-L01-Q02', question: 'New 2', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'B', giaiThich: 'GT', baiHoc: 'B1' }
    ]
  });

  assert(!res.ok, 'Giao dịch phải trả về thất bại');
  assert(res.error === 'TransactionWriteFailedRollbackIncomplete', 'Lỗi phải là TransactionWriteFailedRollbackIncomplete khi read-back mismatch');
  assert(res.rollbackFailedRows.length === 1 && res.rollbackFailedRows[0].reason === 'ReadBackMismatch',
    'Phải ghi nhận lỗi ReadBackMismatch');
  assert(res.rollbackVerifiedCount === 0, 'rollbackVerifiedCount phải là 0 vì không có dòng nào qua được kiểm tra đọc lại');
}

// ── TEST 9e (Yêu cầu 4): LockService được lấy và giải phóng an toàn qua try/finally
console.log('\nTEST 9e (Yêu cầu 4): LockService được lấy và giải phóng an toàn');
{
  assert(lockAcquiredCount > 0, `Script lock phải được lấy ít nhất 1 lần (đã lấy ${lockAcquiredCount} lần)`);
  assert(lockAcquiredCount === lockReleasedCount,
    `Tất cả các lần lấy lock đều phải được giải phóng qua finally (acquired: ${lockAcquiredCount}, released: ${lockReleasedCount})`);

  // Test Lock Timeout
  simulateLockTimeout = true;
  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockSheet = createMockSheet({ headers: standardHeaders, rows: [] });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const res = repairIpclassBatch({
    dryRun: true,
    updates: [{ id: 'IPC-L01-Q01', question: 'Q', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', giaiThich: 'GT', baiHoc: 'B1' }]
  });
  assert(!res.ok && res.error === 'LockTimeout', 'Khi không lấy được lock phải trả về LockTimeout fail-closed');
  simulateLockTimeout = false;
}

// ── TEST 10 (Yêu cầu 7): Payload có đúng 217 ID khớp chính xác Snapshot (SHA-256)
console.log('\nTEST 10 (Yêu cầu 7): Kiểm tra danh sách 217 ID khớp chính xác Snapshot');
{
  const fixturePath = path.resolve(__dirname, 'fixtures/verified_217_ready_for_production.json');
  assert(fs.existsSync(fixturePath), `Fixture verified_217_ready_for_production.json phải tồn tại tại ${fixturePath}`);
  const rawFixture = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
  const questions = Array.isArray(rawFixture) ? rawFixture : (rawFixture.questions || []);

  assert(questions.length === 217, `Payload phải có đúng 217 câu (có ${questions.length})`);
  
  const payloadIds = questions.map(q => q.id).sort();
  const payloadIdString = payloadIds.join(',');
  const computedHash = crypto.createHash('sha256').update(payloadIdString, 'utf-8').digest('hex');
  const EXPECTED_SNAPSHOT_ID_HASH = '47076d88603deb3bcd693b4daa77b70219ff568cf3422a0c603f183fd2ff8cc5';

  assert(computedHash === EXPECTED_SNAPSHOT_ID_HASH,
    `Mã băm SHA-256 của danh mục 217 ID phải khớp tuyệt đối snapshot trước khi sửa (${computedHash})`);
}

// ── TEST 11 (Yêu cầu 7 & 8): Full Payload Verification with Verified 217 Dataset
console.log('\nTEST 11 (Yêu cầu 7 & 8): Kiểm tra toàn bộ 217 câu với tập dữ liệu kiểm định');
{
  const fixturePath = path.resolve(__dirname, 'fixtures/verified_217_ready_for_production.json');
  const rawFixture = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
  const verifiedQuestions = Array.isArray(rawFixture) ? rawFixture : (rawFixture.questions || []);

  const standardHeaders = ['id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'];
  const mockRows = verifiedQuestions.map(q => [q.id, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'tho', 'ChuaDat', '', '']);
  const mockSheet = createMockSheet({ headers: standardHeaders, rows: mockRows });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet });

  const res = repairIpclassBatch({
    dryRun: true,
    updates: verifiedQuestions
  });

  assert(res.ok === true, 'Bộ dữ liệu 217 câu chuẩn phải vượt qua 100% các cổng');
  assert(res.foundCount === 217, `Phải khớp đúng 217 dòng trong Sheet (khớp: ${res.foundCount})`);
  assert(res.willRepairQuestion === 217, `Phải sửa đủ 217 câu hỏi (sẽ sửa: ${res.willRepairQuestion})`);
  assert(res.willRepairAnswer === 217, `Phải sửa đủ 217 đáp án (sẽ sửa: ${res.willRepairAnswer})`);
  assert(mockSheet._getSetValuesCalls().length === 0, 'Zero mutations khi dryRun === true');

  // Kiểm tra câu IPC-L07-Q32 phải là B4
  const q32 = verifiedQuestions.find(q => q.id === 'IPC-L07-Q32');
  assert(q32.baiHoc === 'B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG', `IPC-L07-Q32 phải là B4 (nhận: ${q32.baiHoc})`);

  // Kiểm tra không có câu nào thiếu đáp án hoặc lời giải
  const emptyAns = verifiedQuestions.filter(q => !q.correct);
  const emptyExp = verifiedQuestions.filter(q => !q.giaiThich);
  assert(emptyAns.length === 0, `Không được có câu nào trống đáp án (có ${emptyAns.length})`);
  assert(emptyExp.length === 0, `Không được có câu nào trống lời giải (có ${emptyExp.length})`);
}

// ── TEST 12 (Yêu cầu 2): Kiểm kê toàn bộ Sheet theo cách chỉ đọc (inspectFullSheetDuplicateColumns)
console.log('\nTEST 12 (Yêu cầu 2): Kiểm kê toàn bộ Sheet theo cách chỉ đọc');
{
  const real37Headers = [
    'id', 'mon', 'chuong', 'mucDo', 'loai', 'nhomId', 'deBaiChung', 'question',
    'optA', 'optB', 'optC', 'optD', 'correct', 'hinhAnh', 'giaiThich', 'ngayThem',
    'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId',
    'nhomId', 'deBaiChung', 'question', 'optA', 'optB', 'optC', 'optD', 'correct',
    'hinhAnh', 'giaiThich', 'ngayThem', 'baiHoc', 'chatLuong', 'kyThuat', 'lyDoCachLy', 'batchId'
  ];

  // 12a: Sheet 37 cột với dữ liệu phân tán ở cột 22-37
  // Giả lập 9 dòng dữ liệu (tổng 10 dòng)
  // Dòng 6 (rowIndex 6): cột 24 ('Q6_dup') khớp canonical cột 8 ('Q6_dup')
  // Dòng 7 (rowIndex 7): cột 29 ('B') khác canonical cột 13 ('A')
  const rows10 = [];
  for (let r = 2; r <= 10; r++) {
    const row = new Array(37).fill('');
    row[0] = 'ID_' + r;
    row[7] = (r === 6 ? 'Q6_dup' : 'Q_' + r); // col 8
    row[12] = 'A'; // col 13
    if (r === 6) {
      row[23] = 'Q6_dup'; // col 24 (khớp col 8)
    }
    if (r === 7) {
      row[28] = 'B'; // col 29 (khác col 13)
    }
    rows10.push(row);
  }

  const mockSheet37 = createMockSheet({ headers: real37Headers, rows: rows10 });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheet37 });

  const res12a = inspectFullSheetDuplicateColumns({ sheetName: 'NganHang' });
  assert(res12a.ok === true, 'Inspector phải trả về ok === true');
  assert(res12a.readOnly === true, 'Inspector phải xác nhận readOnly === true');
  assert(res12a.totalRows === 10, `totalRows phải là 10 (nhận: ${res12a.totalRows})`);
  assert(res12a.totalCols === 37, `totalCols phải là 37 (nhận: ${res12a.totalCols})`);
  assert(res12a.dataRowsCount === 9, `dataRowsCount phải là 9 (nhận: ${res12a.dataRowsCount})`);
  assert(res12a.duplicateColumnsRange.startCol === 22 && res12a.duplicateColumnsRange.endCol === 37,
    'Phạm vi cột trùng phải từ 22 đến 37');
  assert(res12a.duplicateColumnsRange.totalColsInRange === 16, 'Tổng số cột trong phạm vi trùng phải là 16');

  // Kiểm tra nonEmptyCount
  const col24Stats = res12a.columnStats.find(c => c.colNumber === 24);
  const col29Stats = res12a.columnStats.find(c => c.colNumber === 29);
  const col22Stats = res12a.columnStats.find(c => c.colNumber === 22);
  assert(col24Stats && col24Stats.nonEmptyCount === 1, 'Cột 24 phải có đúng 1 ô có dữ liệu');
  assert(col29Stats && col29Stats.nonEmptyCount === 1, 'Cột 29 phải có đúng 1 ô có dữ liệu');
  assert(col22Stats && col22Stats.nonEmptyCount === 0, 'Cột 22 phải có 0 ô dữ liệu');

  // Kiểm tra danh sách dòng có dữ liệu
  assert(res12a.rowsWithDataCount === 2, `rowsWithDataCount phải là 2 (nhận: ${res12a.rowsWithDataCount})`);
  assert(res12a.rowsWithData[0].rowNumber === 6 && res12a.rowsWithData[0].id === 'ID_6', 'Phải ghi nhận dòng 6 có ID_6');
  assert(res12a.rowsWithData[1].rowNumber === 7 && res12a.rowsWithData[1].id === 'ID_7', 'Phải ghi nhận dòng 7 có ID_7');

  // So sánh với canonical cột 6-21
  assert(res12a.comparisonWithCanonical.identicalCount === 1, 'Số giá trị trùng hoàn toàn phải là 1 (ô cột 24 khớp cột 8)');
  assert(res12a.comparisonWithCanonical.differentCount === 1, 'Số giá trị khác phải là 1 (ô cột 29 khác cột 13)');
  assert(res12a.sha256HashOfColumns22To37 && res12a.sha256HashOfColumns22To37.length === 64,
    'Mã băm SHA-256 phải là chuỗi hex 64 ký tự hợp lệ');

  // 12b: Sheet 37 cột với 0 dữ liệu ở cột 22-37 (tất cả rỗng)
  const emptyRows = [];
  for (let r = 2; r <= 10; r++) {
    const row = new Array(37).fill('');
    row[0] = 'ID_' + r;
    row[7] = 'Q_' + r;
    emptyRows.push(row);
  }
  const mockSheetEmpty = createMockSheet({ headers: real37Headers, rows: emptyRows });
  currentSpreadsheetApp = createMockSpreadsheetApp({ 'NganHang': mockSheetEmpty });

  const res12b = inspectFullSheetDuplicateColumns({ sheetName: 'NganHang' });
  assert(res12b.ok === true, 'Inspector phải thành công trên sheet có cột 22-37 rỗng');
  assert(res12b.rowsWithDataCount === 0, 'rowsWithDataCount phải là 0 khi tất cả cột 22-37 đều rỗng');
  assert(res12b.comparisonWithCanonical.totalNonEmptyCells === 0, 'Tổng số ô có dữ liệu phải là 0');
  assert(res12b.sha256HashOfColumns22To37 === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'Mã băm SHA-256 khi rỗng phải đúng chuẩn sha256("")');
}

console.log('\n================================================================');
console.log(`KẾT QUẢ: TẤT CẢ ${passedTests}/${totalTests} TESTS ĐỀU ĐẠT CHUẨN 100%!`);
console.log('================================================================');
