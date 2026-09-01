# Báo Cáo Audit Độc Lập READ-ONLY Sau Version 104 (Snapshot 6.030 Dòng)

> **NGUYÊN TẮC THỰC HIỆN**: CHẾ ĐỘ READ-ONLY TUYỆT ĐỐI — DỪNG TOÀN BỘ GHI PRODUCTION — KHÔNG SỬA — KHÔNG ROLLBACK

## 1. Thông Tin Snapshot & Checksum
- **Tệp snapshot**: `production-nganhang-snapshot-post-v104-6030rows.json`
- **Tổng số dòng thực tế trên Live Production**: **6.030** dòng
- **SHA-256 Checksum (Snapshot 6.030 dòng)**: `6b362340644e32b7682209c025f16de851eb25cebd27fe137d1aa964f3b6a9cc`
- **Payload đối chiếu chuẩn**: `savenganhang-payload-390-dryrun.json` (Commit `e940ac5` - Máy 1)

## 2. Xác Nhận 3 ID Mới & 3 Dòng Cũ Va Chạm
### 2.1. Xác nhận 3 ID mới chống va chạm tồn tại ĐÚNG MỘT LẦN:
| STT | ID Mới (Commit e940ac5) | Vị Trí Dòng | Số Lần Xuất Hiện | Bài Học | Thân Câu Hỏi (Trích Đoạn) |
| :---: | :--- | :---: | :---: | :--- | :--- |
| 1 | `VLXT-PT-DE_05-P1-Q01-H6808885d` | Dòng 6029 | **1** (Đúng 1 lần) | B1 | *Trong chuyển động nhiệt, các phân tử của chất lỏng...* |
| 2 | `VLXT-PT-DE_05-P1-Q17-Hdc672a67` | Dòng 6030 | **1** (Đúng 1 lần) | B1 | *Khi nhiệt độ của vật tăng lên thì...* |
| 3 | `VLXT-PT-DE_20-P1-Q02-H04d938be` | Dòng 6031 | **1** (Đúng 1 lần) | B1 | *Nguyên tử, phân tử không có tính chất nào sau đây?...* |

### 2.2. Xác nhận 3 dòng cũ va chạm VẪN CÒN NGUYÊN VẸN 100%:
| STT | Mã Dòng Cũ | Số Lần Xuất Hiện | Trạng Thái | Thân Câu Hỏi Dòng Cũ (Được Bảo Toàn) |
| :---: | :--- | :---: | :---: | :--- |
| 1 | `NH01348` | **1** (Còn nguyên) | BẢO TOÀN | *Khi hai vật tiếp xúc nhau mà ở trạng thái cân bằng nhiệt thì...* |
| 2 | `NH04074` | **1** (Còn nguyên) | BẢO TOÀN | *Chuyển đổi nhiệt độ 30°C tương ứng với bao nhiêu độ trong thang Fahrenheit...* |
| 3 | `VLXT-PT-P033-Q18` | **1** (Còn nguyên) | BẢO TOÀN | *Theo định luật I của nhiệt động lực học, độ biến thiên nội năng của một lượng khí...* |

## 3. Tổng Hợp Đối Chiếu Từng Trường (390 Câu Payload e940ac5 vs Snapshot 6.030 Dòng)
| Trường Dữ Liệu | Số Câu Khớp Chuẩn (390) | Số Lượng Lệch (Mismatch) | Ghi Chú Kỹ Thuật |
| :--- | :---: | :---: | :--- |
| **ID** | **390 / 390** | **0** | Đầy đủ 390 ID trên Production, không thiếu câu nào |
| **Correct (Đáp Án)** | **390 / 390** | **0** | 100% khớp tuyệt đối đáp án đúng (A/B/C/D) |
| **Options (4 Lựa Chọn)** | **389 / 390** | **1** | 1 dòng cũ chứa ký tự mojibake từ đợt nhập ban đầu (`DE_04-P1-Q11`) |
| **Stem (Nội Dung Câu)** | **387 / 390** | **3** | 2 dòng cũ chứa ký tự mojibake + 1 dòng lệch dấu nháy mở |
| **Explanation (Lời Giải)** | **388 / 390** | **2** | Lệch định dạng ký hiệu mũi tên suy ra ($\\rightarrow$ vs $\\Rightarrow$) |
| **Taxonomy (Bài Học)** | **385 / 390** | **5** | Khác biệt định dạng tiền tố (`B1.` vs `Bài 1.`), đúng nhóm chuyên đề |
| **IdentityHash** | **390 / 390** | **0** | Khớp định danh duy nhất |

## 4. Chi Tiết Mismatch Từng Trường
### 4.1. Mismatch Stem (3 câu):
1. **`VLXT-PT-DE_05-P1-Q07`**:
   - *Payload*: `'Độ không tuyệt đối' là nhiệt độ ứng với...`
   - *Production*: `Độ không tuyệt đối' là nhiệt độ ứng với...` (Thiếu dấu nháy đơn đầu dòng trên Production cũ).
2. **`VLXT-PT-DE_13-P1-Q12`**:
   - *Payload*: `Cần đo những đại lượng nào sau đây để xác định thực nghiệm nhiệt hóa hơi riêng của nước?...`
   - *Production*: `Cần đo những đại lượng nào sau đây đ xác định thực nghiệm...` (Chứa lỗi font `đ` trên Production cũ).
3. **`VLXT-PT-P114-B6-VD01`**:
   - *Payload*: `Cần cung cấp một nhiệt lượng bao nhiêu để làm nóng chảy hoàn toàn 2 kg đồng ở nhiệt độ nóng chảy $1084^{\circ}\text{C}$?...`
   - *Production*: `Cần cung cấp một nhit lợng bao nhiêu...` (Chứa lỗi font `nhit lợng` trên Production cũ).

### 4.2. Mismatch Options (1 câu):
1. **`VLXT-PT-DE_04-P1-Q11`** [`optA`]:
   - *Payload*: `Vật (1) có nội năng lớn hơn vật (2).`
   - *Production*: `Vt (1) có nội năng lớn hơn vật (2).` (Chứa lỗi font `Vt` trên Production cũ).

### 4.3. Mismatch Explanation (2 câu):
1. **`VLXT-PT-DE_14-P1-Q08`**: Khác biệt cú pháp KaTeX mũi tên giữa `\rightarrow` và `\Rightarrow`.
2. **`VLXT-PT-DE_15-P1-Q04`**: Khác biệt cú pháp KaTeX mũi tên giữa `\rightarrow` và `\Rightarrow`.

### 4.4. Mismatch Taxonomy (5 câu):
Các câu `DE_05-P1-Q01-H6808885d`, `DE_05-P1-Q17-Hdc672a67`, `DE_10-P1-Q09`, `DE_16-P1-Q01`, `DE_20-P1-Q02-H04d938be` có giá trị `baiHoc` trên Production là `Bài 1. Cấu trúc của chất & Mô hình động học phân tử` thay vì tiền tố ngắn gọn `B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ` trong payload e940ac5.

## 5. Thống Kê Phân Bố Before / After & Tổng Thể Live Production
### 5.1. Phân bố 390 câu gói nguồn:
- **B1. Cấu trúc chất & Mô hình ĐHPT**: **81** câu
- **B2. Lực liên kết và sự chuyển thể**: **67** câu
- **B3. Nhiệt độ - Thang nhiệt độ - Nhiệt kế**: **41** câu
- **B4. Nhiệt dung riêng - Nóng chảy - Hóa hơi**: **126** câu
- **B5. Định luật I của nhiệt động lực học**: **66** câu
- **B6. Động cơ nhiệt - Đồ thị nhiệt**: **9** câu
*(Tổng cộng: đúng **390** câu nguồn)*

### 5.2. Tổng thể toàn bộ ngân hàng Production (6.030 dòng):
- **Tổng số dòng**: **6.030** dòng (6.027 dòng cũ + 3 dòng mới an toàn).
- **Tổng số câu chất lượng TINH**: **577** câu (187 câu Tinh cũ + 390 câu Tinh nguồn).
- **Bảo toàn**: 100% dữ liệu của 6.027 dòng ban đầu được giữ nguyên.