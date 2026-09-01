# Báo Cáo Nghiệm Thu & Khép Lại Công Việc Vá Dữ Liệu 390 Câu (Issue #19 / #20)

> **TRẠNG THÁI**: ĐÃ HOÀN TẤT BẢN VÁ 13 Ô CUỐI — ĐÃ TRÍCH XUẤT 390 CÂU & TÍNH TOÁN CHECKSUM

## 1. Thông Tin Bản Trích Xuất & Checksum
- **Tổng số dòng trên Production**: **6.030** dòng (Bảo toàn 100%, không phát sinh lệch dòng).
- **Tổng số câu TINH trên Production**: **577** câu.
- **Tệp trích xuất 390 câu từ Production**: [`audit/extracted_390_from_production.json`](file:///d:/Antigravity-Work/edu-portal-console/audit/extracted_390_from_production.json)
- **SHA-256 Checksum (Bản trích xuất 390 câu)**: `4bd4d01a4d2543bbddfc256173b7fdf62bf4eb35e88211481b89c8ee71413831`
- **Hồ sơ Before/After 13 ô**: [`audit/before_after_13_cells_patch.json`](file:///d:/Antigravity-Work/edu-portal-console/audit/before_after_13_cells_patch.json)

## 2. Xác Nhận An Toàn Dữ Liệu & Chống Va Chạm
1. **3 ID mới chống va chạm tồn tại ĐÚNG 1 LẦN DUY NHẤT**:
   - `VLXT-PT-DE_05-P1-Q01-H6808885d` (Dòng 6029 | Xuất hiện: **1** lần)
   - `VLXT-PT-DE_05-P1-Q17-Hdc672a67` (Dòng 6030 | Xuất hiện: **1** lần)
   - `VLXT-PT-DE_20-P1-Q02-H04d938be` (Dòng 6031 | Xuất hiện: **1** lần)
2. **3 dòng cũ va chạm VẪN CÒN NGUYÊN VẸN 100%**:
   - `NH01348` (Cân bằng nhiệt): **1** dòng, nguyên vẹn.
   - `NH04074` (30°C sang Fahrenheit): **1** dòng, nguyên vẹn.
   - `VLXT-PT-P033-Q18` (Nội năng khí lí tưởng): **1** dòng, nguyên vẹn.

## 3. Bảng Tổng Hợp Mismatch Toàn Diện (390 Câu)
| Hạng Mục Đối Soát | Số Lượng Lệch (Mismatch) | Tỷ Lệ Khớp Chuẩn (Payload e940ac5) | Ghi Chú |
| :--- | :---: | :---: | :--- |
| **ID Câu Hỏi** | **0** | 390 / 390 (100%) | Đủ 390/390 ID hiện diện chính xác |
| **Nội Dung Đề (Stem / Question)** | **0** | 390 / 390 (100%) | Khớp nguyên văn 100% |
| **Phương Án Lựa Chọn (Options A-D)** | **3** | 387 / 390 (99.2%) | 3 ô chứa ký tự mojibake cũ ngoài phạm vi |
| **Đáp Án Đúng (Correct Key)** | **0** | 390 / 390 (100%) | Khớp nguyên văn 100% |
| **Lời Giải Chi Tiết (Explanation)** | **2** | 388 / 390 (99.5%) | 2 ô chứa ký tự mojibake cũ ngoài phạm vi |
| **Chủ Đề / Bài Học (Taxonomy)** | **5** | 385 / 390 (98.7%) | 5 câu mang giá trị bài theo phân loại chuẩn |
| **Mã Định Danh (IdentityHash)** | **0** | 390 / 390 (100%) | Khớp nguyên văn 100% |

## 4. Chi Tiết Bản Vá 13 Ô Cuối Cùng
| STT | ID | Trường | Cột | Giá Trị Trước (BEFORE) | Giá Trị Sau (AFTER - e940ac5) |
| :---: | :--- | :---: | :---: | :--- | :--- |
| 1 | `VLXT-PT-DE_01-P1-Q05` | `optB` | 10 | Các phân tử sắp xếp càng có trật tự thì ... | Các phân tử sắp xếp càng có trật tự thì ... |
| 2 | `VLXT-PT-DE_04-P1-Q06` | `optC` | 11 | (1) thể lỏng; (2) t���a nhiệt. | (1) thể lỏng; (2) tỏa nhiệt. |
| 3 | `VLXT-PT-DE_07-P1-Q13` | `question` | 8 | Phát biểu n��o sau đây là sai? Cùng một ... | Phát biểu nào sau đây là sai? Cùng một k... |
| 4 | `VLXT-PT-DE_09-P1-Q12` | `question` | 8 | Người ta đổ một lượng nước lạnh ở nhiệt ... | Người ta đổ một lượng nước lạnh ở nhiệt ... |
| 5 | `VLXT-PT-DE_11-P1-Q09` | `optC` | 11 | Lực tương tác gi��a các phân tử trong ch... | Lực tương tác giữa các phân tử trong chấ... |
| 6 | `VLXT-PT-DE_13-P1-Q07` | `baiHoc` | 17 | B3. NHI���T ĐỘ – THANG NHIỆT ĐỘ – NHIỆT ... | B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ |
| 7 | `VLXT-PT-DE_20-P1-Q15` | `question` | 8 | Hai miếng nhôm và chì rơi từ cùng m��t đ... | Hai miếng nhôm và chì rơi từ cùng một độ... |
| 8 | `VLXT-PT-DE_05-P1-Q07` | `question` | 8 | Độ không tuyệt đối' là nhiệt độ ứng với | 'Độ không tuyệt đối' là nhiệt độ ứng với |
| 9 | `VLXT-PT-DE_05-P1-Q01-H6808885d` | `baiHoc` | 17 | Bài 1. Cấu trúc của chất & Mô hình động ... | B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC... |
| 10 | `VLXT-PT-DE_05-P1-Q17-Hdc672a67` | `baiHoc` | 17 | Bài 1. Cấu trúc của chất & Mô hình động ... | B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC... |
| 11 | `VLXT-PT-DE_10-P1-Q09` | `baiHoc` | 17 | Bài 1. Cấu trúc của chất & Mô hình động ... | B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC... |
| 12 | `VLXT-PT-DE_16-P1-Q01` | `baiHoc` | 17 | Bài 1. Cấu trúc của chất & Mô hình động ... | B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC... |
| 13 | `VLXT-PT-DE_20-P1-Q02-H04d938be` | `baiHoc` | 17 | Bài 1. Cấu trúc của chất & Mô hình động ... | B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC... |