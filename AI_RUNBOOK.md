# Vận hành Admin bằng AI

## Quy trình chuẩn

1. Xác nhận remote là `eduhost-vn204/edu-portal-console` và repo Student đi kèm là `eduhost-vn204/edu-portal-lms`.
2. Đọc `AGENTS.md`, file này và `PROJECT_STATE.md` trong repo Student.
3. Làm trong New Worktree, nhánh `antigravity/YYYYMMDD-mo-ta-ngan` từ baseline hoặc `origin/main` mới nhất đã xác minh.
4. Khảo sát/tái hiện trước, sửa tối thiểu, kiểm thử, xem lại diff và quét secret.
5. Chạy `git diff --check`; kiểm tra cú pháp JavaScript và các script nội tuyến trong HTML đã sửa.
6. Cập nhật bàn giao chung trong Student `PROJECT_STATE.md` khi thay đổi đáng kể ở cả hai repo.
7. Commit và push nhánh nếu GitHub credentials hợp lệ; báo rõ commit, test và bước production còn lại.

## Điểm phải dừng

- Không merge/push thẳng `main`, deploy Apps Script hoặc thay đổi GitHub/Firebase settings nếu chưa có chỉ thị rõ ràng.
- Không dùng credential thật trong prompt/test/log.
- Không ghi, sửa hoặc xóa dữ liệu production để “thử”.
- Không xóa thư mục QA/untracked hoặc thay đổi chưa rõ chủ sở hữu.

## Mẫu báo cáo

```text
Repo / branch / commit:
File đã sửa:
Hành vi mới:
Test đã chạy:
Rủi ro và giới hạn:
Việc cần thầy xác nhận:
Cách hoàn tác:
```
