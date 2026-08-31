# TÀI LIỆU CONTRACT CHUẨN XÁC: API NGÂN HÀNG CÂU HỎI & XUẤT TINH (PRODUCTION)

Tài liệu này xác định chuẩn hợp đồng API chính thức (URL, action, authentication, payload schema, response contract, idempotency, dry-run) giữa **Máy 1 (Content Pipeline)** và **Máy 2 (Apps Script Production Backend / Review App)** theo yêu cầu **Issue #19**.

---

## 1. Thông Tin Endpoint & Xác Thực

- **Production URL**:
  ```
  https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec
  ```
- **Phương thức**:
  - `GET`: Tra cứu thống kê công khai (`?type=questionstats` hoặc `?type=nganhang`).
  - `POST`: Thực hiện các thao tác quản trị, thống kê và nạp câu hỏi (`Content-Type: application/json`).
- **Cơ chế xác thực**:
  - Truyền trường `adminKey` trong JSON POST body.
  - Backend kiểm tra đối chiếu qua `ScriptProperties (ADMIN_KEY)`.
  - **Bảo mật**: Tuyệt đối không commit `adminKey` vào git hoặc issue public/private.

---

## 2. API 1: Thống Kê Ngân Hàng Câu Hỏi (`getQuestionStats`)

### Cách 1: Qua HTTP GET
- **URL**: `GET https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec?type=questionstats`
- **Response**:
  ```json
  {
    "ok": true,
    "success": true,
    "total": 5652,
    "tinh": 29,
    "tho": 5623,
    "quarantined": 0,
    "batches": {
      "NO_BATCH": 5623,
      "VLXT_BATCH_PT_P11_15_20260829_091954": 29
    },
    "byMucDo": {
      "NB": 5637,
      "TH": 6,
      "VD": 5,
      "VDC": 0
    },
    "byLoai": {
      "TN": 5450,
      "DS": 4,
      "TLN": 0
    }
  }
  ```

### Cách 2: Qua HTTP POST
- **Action**: `getQuestionStats` hoặc `get_question_stats`
- **Payload**:
  ```json
  {
    "action": "getQuestionStats",
    "adminKey": "<optional_admin_key>"
  }
  ```

---

## 3. API 2: Nạp Gói Câu Hỏi Tinh Theo Batch (`importQuestionsBatch`)

- **Action hỗ trợ**: `importQuestionsBatch`, `importquestionsbatch`, `import_tinh_batch`, `importnganhang`.
- **Phương thức**: `POST`
- **Headers**: `Content-Type: application/json`

### Request Payload Schema
```json
{
  "action": "importQuestionsBatch",
  "adminKey": "<ADMIN_KEY_BẮT_BUỘC>",
  "dryRun": false,
  "batchId": "phongtoa-p107-251",
  "questions": [
    {
      "id": "VLXT-PT-P139-DE02-Q01",
      "reviewStatus": "APPROVED",
      "mon": "Vật lý",
      "chuong": "Vật lí nhiệt",
      "baiHoc": "Bài 1. Cấu trúc của chất & Mô hình động học phân tử",
      "mucDo": "NB",
      "loai": "TN",
      "question": "Chất rắn kết tinh có đặc điểm nào sau đây?",
      "optA": "Có nhiệt độ nóng chảy xác định.",
      "optB": "Không có cấu trúc tinh thể.",
      "optC": "Không có dạng hình học xác định.",
      "optD": "Có tính đẳng hướng hoàn toàn.",
      "correct": "A",
      "hinhAnh": "",
      "giaiThich": "Chất rắn kết tinh có cấu trúc tinh thể và nhiệt độ nóng chảy xác định.",
      "identityHash": "8a3f5b7c1e9d2a4b"
    }
  ]
}
```

### Các Trường Dữ Liệu Được Hỗ Trợ Đầy Đủ
| Trường | Kiểu dữ liệu | Mô tả & Quy tắc chuyển đổi |
| :--- | :--- | :--- |
| `id` / `questionId` | `string` | Bắt buộc. Định danh duy nhất của câu hỏi (vd: `VLXT-PT-P139-DE02-Q01`). |
| `reviewStatus` / `status` | `string` | **Bắt buộc phải là `APPROVED` hoặc `TINH`**. Nếu chưa duyệt, backend sẽ từ chối/cách ly. |
| `loai` / `type` | `string` | `TN` (`MULTIPLE_CHOICE`), `DS` (`TRUE_FALSE`), hoặc `TLN` (`SHORT_ANSWER`). |
| `question` / `stem` | `string` | Thân câu hỏi. Bảo toàn 100% KaTeX (`$math$`) và ngắt dòng. |
| `optA, optB, optC, optD` hoặc `options` | `string` / `object` | 4 phương án. Nhận dạng cả dạng phẳng (`optA`) lẫn dạng mảng/object (`options.A` hoặc `options[0].content`). |
| `correct` / `correctAnswer` | `string` | Đáp án đúng: `A`/`B`/`C`/`D` (với TN), 4 ký tự `Đ`/`S` (với DS, vd `ĐSĐS`), hoặc chuỗi/số (với TLN). |
| `mucDo` / `difficulty` | `string` | `NB` (Nhận biết), `TH` (Thông hiểu), `VD` (Vận dụng), `VDC` (Vận dụng cao). |
| `baiHoc` / `taxonomy` | `string` | Bài học chuẩn trong chương trình Vật lí 12. Tự động chuẩn hóa B1–B6. |
| `chuong` | `string` | Chương (mặc định: `Vật lí nhiệt`). |
| `giaiThich` / `explanation` | `string` | Lời giải chi tiết bảo toàn công thức KaTeX. |
| `hinhAnh` / `mediaAssets` | `string` / `array` | URL / Đường dẫn ảnh diagram (nếu có). |
| `dryRun` | `boolean` | `true` = Chỉ giả lập quét & trả về đối soát (không ghi vào Sheets); `false` = Ghi thật. |
| `identityHash` | `string` | Mã băm 16 ký tự của `type||stem||correctAnswer` để chống trùng lặp tuyệt đối. |

---

## 4. Response Contract (Phản Hồi Chuẩn Hóa)

### Khi Thành Công (Ghi thật hoặc Dry-run)
```json
{
  "ok": true,
  "success": true,
  "dryRun": false,
  "batchId": "phongtoa-p107-251",
  "sent": 3,
  "sentCount": 3,
  "inserted": 3,
  "insertedCount": 3,
  "updated": 0,
  "updatedCount": 0,
  "existing": 0,
  "alreadyExistsCount": 0,
  "blocked": 0,
  "quarantinedCount": 0,
  "passedCount": 3,
  "quarantinedItems": [],
  "errors": [],
  "before": 5652,
  "countBefore": 5652,
  "after": 5655,
  "countAfter": 5655,
  "tinhUsableBefore": 29,
  "tinhUsableAfter": 32,
  "items": [
    {
      "id": "VLXT-PT-P139-DE02-Q01",
      "mon": "Vật lý",
      "chuong": "Vật lí nhiệt",
      "baiHoc": "Bài 1. Cấu trúc của chất & Mô hình động học phân tử",
      "mucDo": "NB",
      "loai": "TN",
      "question": "Chất rắn kết tinh có đặc điểm nào sau đây?...",
      "optA": "Có nhiệt độ nóng chảy xác định.",
      "optB": "Không có cấu trúc tinh thể.",
      "optC": "Không có dạng hình học xác định.",
      "optD": "Có tính đẳng hướng hoàn toàn.",
      "correct": "A",
      "chatLuong": "tinh",
      "kyThuat": "Dat",
      "lyDoCachLy": ""
    }
  ],
  "msg": "Đã nạp thành công: 3 câu mới, 0 câu cập nhật, 0 câu đã tồn tại (3 Đạt, 0 Bị chặn)."
}
```

### Khi Thất Bại Xác Thực (Sai hoặc Thiếu `adminKey`)
```json
{
  "ok": false,
  "success": false,
  "error": "Unauthorized",
  "msg": "Khóa quản trị không hợp lệ"
}
```

---

## 5. Cơ Chế Chống Trùng Lặp (Idempotency)

1. Khi nạp lại một câu hỏi đã tồn tại (`id` hoặc `identityHash` hoặc `stem` trùng khớp hoàn toàn):
   - Backend ghi nhận là `existing` (`alreadyExistsCount++`).
   - Không chèn thêm dòng mới vào Google Sheets.
   - Trả về `inserted: 0`, `existing: N`, tổng số câu `after === before`.
2. Nếu câu hỏi đã tồn tại nhưng có sửa đổi nội dung/đáp án:
   - Backend cập nhật đè (`update in-place`) dòng tương ứng.
   - Ghi nhận `updated: 1`, tổng số câu không tăng.
