# Quy tắc AI — Vật Lý Xuân Trường Admin

## Nguồn chuẩn

- Repo này phải có remote `https://github.com/eduhost-vn204/edu-portal-console.git`.
- Repo Student là `https://github.com/eduhost-vn204/edu-portal-lms.git`.
- `PROJECT_STATE.md` tại repo Student là sổ kiến trúc và bàn giao chung.
- Dự án hiện dùng GitHub Pages/GitHub Actions; không dùng Netlify hoặc repository legacy.

## Bắt buộc trước khi sửa

1. Đọc toàn bộ `AI_RUNBOOK.md` và `PROJECT_STATE.md` bên repo Student nếu project đã cấp cả hai folder.
2. Kiểm tra remote, HEAD, branch, status và 10 commit gần nhất.
3. Fetch `origin/main` nếu credentials cho phép; nếu không, báo giới hạn này.
4. Bảo toàn file/thư mục chưa track và thay đổi của người khác.

## Ràng buộc Admin

- Không hardcode token, mật khẩu hoặc adminKey.
- Mọi thao tác ghi Admin phải xác nhận JSON thành công thật; không dùng `mode:'no-cors'` để che kết quả.
- Không tự retry thao tác append có thể tạo dữ liệu trùng.
- Không thử ghi/xóa trên Google Sheets, Firebase hoặc tài khoản production.
- Không deploy Apps Script hoặc merge `main` nếu chưa được thầy chỉ thị rõ ràng.
- Agent được tự sửa, chạy test, commit và push nhánh tính năng.
