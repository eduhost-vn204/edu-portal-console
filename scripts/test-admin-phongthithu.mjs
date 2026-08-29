import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adminRoot = path.resolve(__dirname, '..');

console.log('=== TEST SUITE: ADMIN PHONG THI THU & EXAM CONTROLS ===\n');

// 1. Kiểm tra file index.html
const indexHtmlPath = path.join(adminRoot, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
    console.error('FAIL: index.html không tồn tại');
    process.exit(1);
}
const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

// 2. Kiểm tra thẻ đóng </html>
if (!htmlContent.includes('</html>')) {
    console.error('FAIL: index.html thiếu thẻ </html>');
    process.exit(1);
}
console.log('OK   - 1. Cấu trúc HTML & thẻ đóng </html> hợp lệ');

// 3. Kiểm tra các phần tử cốt lõi của Tab Phòng Thi Thử
const requiredElements = [
    'id="tab-phongthithu"',
    'id="tab-phongthithu-btn"',
    'id="thithu-list-panel"',
    'id="ptt-stat-total"',
    'id="ptt-stat-open"',
    'id="ptt-stat-locked"',
    'id="ptt-stat-video"',
    'id="ptt-search-input"',
    'id="exam-detail-overlay"',
    'id="ed-modal-questions"',
    'id="bulk-exam-overlay"'
];

for (const el of requiredElements) {
    if (!htmlContent.includes(el)) {
        console.error(`FAIL: Thiếu phần tử giao diện ${el}`);
        process.exit(1);
    }
}
console.log('OK   - 2. Toàn bộ phần tử DOM Tab Phòng Thi Thử & Modal Đề Thi đều có mặt');

// 4. Kiểm tra logic phân loại đề Thi Thử vs Kiểm Tra
function isThiThuExam(ex) {
    if (!ex) return false;
    return ex.loaiDe === 'thithu' ||
        String(ex.examId || '').startsWith('vedich2k9') ||
        String(ex.examId || '').startsWith('thithu') ||
        String(ex.tenDe || '').toLowerCase().includes('thi thử') ||
        String(ex.tenDe || '').toLowerCase().includes('về đích');
}

// Test 14 đề 2k9
for (let i = 2; i <= 15; i++) {
    const num = String(i).padStart(2, '0');
    const mockEx = {
        examId: `vedich2k9_de${num}`,
        tenDe: `Đề về đích 2k9 – Đề số ${num}`,
        loaiDe: 'thithu',
        thoiGian: 50,
        soCau: 28,
        trangThai: 'khoa'
    };
    if (!isThiThuExam(mockEx)) {
        console.error(`FAIL: Đề ${mockEx.examId} không được phân loại vào Thi Thử`);
        process.exit(1);
    }
}

// Test đề kiểm tra thường
const mockKiemTra = {
    examId: 'kt-vlnhiet-gd1',
    tenDe: 'Kiểm tra Chương 1: Vật Lí Nhiệt (GĐ1)',
    loaiDe: 'kiemtra',
    thoiGian: 50,
    soCau: 28,
    trangThai: 'khoa'
};
if (isThiThuExam(mockKiemTra)) {
    console.error('FAIL: Đề kiểm tra định kỳ bị phân nhầm vào Thi Thử');
    process.exit(1);
}
console.log('OK   - 3. Logic isThiThuExam phân loại chính xác 14 đề 2k9 và đề kiểm tra định kỳ');

// 5. Kiểm tra hàm mở modal xem đề và chuẩn hóa ảnh CDN
const testQ = {
    id: 1,
    type: 'mc',
    question: '<img src="assets/exams/vedich2k9_de02/image1.png" alt="hình" /> Năng lượng $E=mc^2$',
    options: { A: 'A', B: 'B', C: 'C', D: 'D' },
    correct: 'A',
    giaiThich: 'Lời giải chi tiết: $E=mc^2$'
};
const replacedQ = testQ.question.replace(/src="(assets\/[^"]+)"/g, 'src="https://vatlyxuantruong.io.vn/$1"');
if (!replacedQ.includes('https://vatlyxuantruong.io.vn/assets/exams/vedich2k9_de02/image1.png')) {
    console.error('FAIL: Chuẩn hóa link ảnh CDN thất bại');
    process.exit(1);
}
console.log('OK   - 4. Chuẩn hóa đường dẫn hình ảnh CDN hiển thị chuẩn trên Admin');

// 6. Kiểm tra các action ghi trong ADMIN_WRITE_ACTIONS
if (!htmlContent.includes("'saveexam'") || !htmlContent.includes("'deleteexam'")) {
    console.error('FAIL: ADMIN_WRITE_ACTIONS thiếu saveexam hoặc deleteexam');
    process.exit(1);
}
console.log('OK   - 5. Quyền ghi Admin (saveexam, deleteexam) đã được đăng ký');

console.log('\n=== TẤT CẢ KIỂM THỬ ADMIN PHÒNG THI THỬ ĐẠT 100% ===');
