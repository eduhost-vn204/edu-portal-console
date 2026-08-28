# Hướng dẫn Thư mục Inbox (Video → YouTube Private → Bài học Nháp)

Thư mục này dùng để chứa các bài giảng mới cần đăng tự động lên hệ thống.

## Cấu trúc mỗi bài học
Mỗi bài học là một thư mục con bên trong `inbox/`, ví dụ `inbox/bai-04-khi-ly-tuong/`:
```
inbox/bai-04-khi-ly-tuong/
├── manifest.json      # Thông tin bài học, khóa học, chương, tài liệu
├── video.mp4          # File video bài giảng cần tải lên YouTube Private
└── tailieu.pdf        # (Tùy chọn) File tài liệu đính kèm
```

## Cấu trúc file `manifest.json` chuẩn
```json
{
  "title": "B4. Khí Lý Tưởng - Phương Trình Trạng Thái",
  "course": "CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12",
  "chapter": "CHƯƠNG 1 – VẬT LÝ NHIỆT",
  "lessonName": "[DRAFT] B4. KHÍ LÝ TƯỞNG – PHƯƠNG TRÌNH TRẠNG THÁI",
  "description": "Mô tả nội dung bài học, tóm tắt lý thuyết và hướng dẫn phương pháp giải.",
  "videoFile": "video.mp4",
  "privacyStatus": "private",
  "pdfUrl": "https://drive.google.com/...",
  "pdfTheoryUrl": "https://drive.google.com/...",
  "pdfPracticeUrl": "https://drive.google.com/...",
  "order": 4,
  "tags": ["vatly12", "nhiethoc"]
}
```

## Cách chạy tự động
- **Chạy bằng PowerShell Launcher**:
  ```powershell
  .\scripts\publish-video-lesson.ps1 -InboxDir .\inbox\sample-lesson
  ```
- **Chạy chế độ kiểm thử nhanh (Mock Mode)**:
  ```powershell
  .\scripts\publish-video-lesson.ps1 -InboxDir .\inbox\sample-lesson -Mock
  ```
- **Chế độ an toàn & Idempotent**:
  Script tự động lưu `.checkpoint.json`. Nếu chạy lại hoặc gặp sự cố mạng giữa chừng, script sẽ tiếp tục từ bước dở dang mà **không bao giờ tải lên video trùng lặp**.
