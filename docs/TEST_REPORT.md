# BÁO CÁO KIỂM THỬ (TEST REPORT)
## CO TU HERITAGE AR — PHIÊN BẢN MVP V2.0

**Thời điểm kiểm thử:** 11/11/2026  
**Môi trường thử nghiệm:** Node.js v22.14.0, Vite 5.4.21, React 18.3.1, TypeScript 5.6.3 (Strict Mode).

---

### 1. Bảng Tổng Hợp Kiểm Thử Tính Năng

| STT | Hạng mục / Tính năng | Tiêu chuẩn đánh giá | Kết quả | Ghi chú chi tiết |
|---|---|---|---|---|
| 1 | **Khởi tạo & Build hệ thống** | `npm run build` (tsc strict + vite bundle) | **PASSED** | Mã nguồn TypeScript biên dịch 100% không lỗi, chia chunk tối ưu. |
| 2 | **Routing & Deep Linking** | Mở trực tiếp các URL `/`, `/artifacts`, `/artifacts/:slug`, `/learn`, `/learn/notebook`, `/qr-codes` | **PASSED** | React Router định tuyến chuẩn, có `vercel.json` phục vụ SPA rewrite. |
| 3 | **Giao diện Trang chủ (Home)** | Hero banner, quy trình 4 bước, hiện vật tiêu biểu, giới thiệu CLIL | **PASSED** | Render responsive, hình ảnh SVG minh họa hiển thị sắc nét. |
| 4 | **Bộ sưu tập (Artifacts)** | Tìm kiếm song ngữ VI/EN, lọc danh mục, hiển thị trạng thái 3D | **PASSED** | Tìm kiếm tức thì theo tên, mô tả và từ vựng; có giao diện empty state. |
| 5 | **Trang chi tiết hiện vật** | Slug động, Breadcrumb, bối cảnh, thông số, nguồn tham khảo | **PASSED** | Hiển thị đúng dữ liệu tương ứng với từng slug hiện vật. |
| 6 | **Chế độ Song ngữ** | Nút chuyển Tiếng Việt / English / Song ngữ | **PASSED** | Chuyển đổi tức thời trên client, không tải lại trang, không mất trạng thái 3D. |
| 7 | **3D WebGL Viewer** | Tích hợp `@google/model-viewer`, xoay, phóng to, poster | **PASSED** | Tương tác WebGL hoạt động tốt, có trạng thái "3D Coming Soon" nếu chưa có file GLB. |
| 8 | **Tính năng WebAR** | Kích hoạt AR (WebXR / QuickLook) | **PASSED (Code) / NOT TESTED (Thiết bị thật)** | Mã nguồn đã tích hợp thuộc tính AR và modal điều hướng QR cho Desktop. Cần quét bằng điện thoại hỗ trợ ARCore / ARKit thực tế. |
| 9 | **Tra cứu từ vựng (Vocab Popup)** | Chạm từ vựng -> mở Popup/Sheet giải thích, phát âm, lưu từ | **PASSED** | Bottom sheet mượt mà trên mobile, modal trên desktop, chống lưu trùng. |
| 10 | **Sổ tay từ vựng (Notebook)** | Lưu, xóa, đánh dấu đã học, lọc, tìm kiếm, lưu LocalStorage | **PASSED** | Lưu dữ liệu độc lập trên trình duyệt, có xác nhận trước khi xóa toàn bộ. |
| 11 | **Audio Thuyết minh** | HTML5 Audio + Web Speech API fallback | **PASSED** | Tự động phát âm bằng giọng đọc trình duyệt khi chưa có tệp MP3 phòng thu. |
| 12 | **Ôn tập Flashcard 3D** | Thẻ tương tác 2 mặt, lật thẻ, nghe âm thanh, chuyển thẻ | **PASSED** | Hoạt họa xoay thẻ 3D mượt mà, ưu tiên từ vựng người dùng đã lưu. |
| 13 | **Trắc nghiệm từ vựng (Quiz)** | Câu hỏi trắc nghiệm 4 lựa chọn, tính điểm, hiệu ứng confetti | **PASSED** | Chấm điểm tức thời trên client, giải thích đáp án chi tiết, có nút làm lại. |
| 14 | **Trình tạo mã QR (QR Generator)** | Sinh mã theo URL tuyệt đối, tải PNG/SVG, in ấn | **PASSED** | Tạo QR chuẩn từng hiện vật, có cảnh báo nổi bật khi đang chạy localhost. |
| 15 | **Print Stylesheet** | In nhãn trưng bày | **PASSED** | CSS `@media print` ẩn toàn bộ header, footer, thanh công cụ, tối ưu khổ giấy A4. |
| 16 | **Responsive Mobile / Tablet** | Viewport 360px - 430px (Mobile), 768px (Tablet), 1440px (Desktop) | **PASSED** | Không tràn ngang (no horizontal overflow), vùng chạm nút >= 44px. |

---

### 2. Các Hạng Mục Chờ Thử Nghiệm Trên Thiết Bị Thực Tế (Physical Device Testing)
1. **Kiểm tra AR trên điện thoại Android thực tế:**
   - Cần máy Android có cài sẵn *Google Play Services for AR (ARCore)*.
   - Quét mã QR đã deploy trên HTTPS để mở WebXR hoặc Scene Viewer.
2. **Kiểm tra Quick Look trên iPhone/iPad thực tế:**
   - Kiểm tra hành vi mở file USDZ / Quick Look trên Safari iOS 16+.
3. **Chất lượng giọng đọc Web Speech API trên các dòng máy:**
   - Mỗi hãng điện thoại (Samsung, Xiaomi, Apple) có bộ tổng hợp âm thanh giọng tiếng Việt và tiếng Anh khác nhau, cần nghe thử trực tiếp trên loa ngoài điện thoại.

---

### 3. Đánh Giá Khả Năng Mở Rộng
- Kiến trúc SPA tĩnh hoàn toàn đáp ứng tiêu chí vòng thi đầu tiên: tốc độ tải trang dưới 1 giây, chi phí vận hành 0 VNĐ trên Vercel / GitHub Pages.
- Tầng Service (`artifactService`, `notebookService`, `qrService`) được tách biệt hoàn toàn khỏi Presentation UI, cho phép nâng cấp lên Backend API / Database trong giai đoạn tiếp theo (P2 Roadmap) mà không cần viết lại giao diện.

