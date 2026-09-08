
import json, sys
sys.stdout.reconfigure(encoding=" utf-8\)
m = {
 \title\: \[BẢN NHÁP THỬ NGHIỆM] B10 - QUY TRÌNH ĐĂNG BÀI TỰ ĐỘNG\,
 \lessonName\: \[BẢN NHÁP THỬ NGHIỆM] B10 - QUY TRÌNH ĐĂNG BÀI TỰ ĐỘNG\,
 \course\: \CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12\,
 \chapter\: \CHƯƠNG 2 – KHÍ LÍ TƯỞNG\,
 \order\: 999,
 \description\: \Bài học thử nghiệm quy trình xuất bản tự động - Không mở cho học sinh\,
 \videoTheoryFile\: \Bài 10 lý thuyết.mp4\,
 \videoPracticeFile\: \Luyện tập.mp4\,
 \pdfTheoryFile\: \Bai 10 - Phương trình trạng thái khí lý tưởng - Ban Lí thuyết.pdf\,
 \pdfAppliedFile\: \Bai 10 - Phương trình trạng thái khí lý tưởng - Bài tập áp dụng.pdf\,
 \pdfPracticeFile\: \Bai 10 - Phương trình trạng thái khí lý tưởng - Bài tập luyện tập.pdf\,
 \docxAppliedWedFile\: \Bai 10 - Phương trình trạng thái khí lý tưởng - Bài tập áp dụng - wed.docx\,
 \docxPracticeWedFile\: \Bai 10 - Phương trình trạng thái khí lý tưởng - Bài tập luyện tập - wed.docx\,
 \sourceDir\: r\D:\\Work\\Dạy học\\Xây Dựng Lộ Trình XPS 2k9\\Triển khai\\GĐ1 - Chuyên đề Lý thuyết\\Chương 2\\Bài 10 - Phương trình trạng thái khí lý tưởng\,
 \privacyStatus\: \private\,
 \tags\: [\pilot\, \b10\, \khi-ly-tuong\]
}
with open(\inbox/b10-pilot/manifest.json\, \w\, encoding=\utf-8\) as f:
 json.dump(m, f, ensure_ascii=False, indent=2)
print(\manifest.json created successfully!\)
