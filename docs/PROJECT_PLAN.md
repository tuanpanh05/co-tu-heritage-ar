# KẾ HOẠCH TRIỂN KHAI DỰ ÁN (PROJECT PLAN)
## CO TU HERITAGE AR — HỆ THỐNG WEBAR & HỌC LIỆU SONG NGỮ

**Ngày lập:** 11/11/2026  
**Phiên bản:** MVP V2.0  
**Đối tượng:** Vòng thi thứ nhất — Demo thực tế trên Web / Mobile / Tablet

---

### 1. Mục tiêu và Nguyên tắc cốt lõi
- **Kiến trúc:** 100% Client-side Static WebApp (Vite + React + TypeScript + Tailwind CSS).
- **Không backend, không database, không auth:** Không phụ thuộc bất kỳ API trả phí hay database nào; lưu trữ cục bộ qua LocalStorage.
- **Trọng tâm P0:**
  1. Trang chủ giới thiệu văn hóa và phương pháp CLIL.
  2. Danh mục hiện vật với bộ lọc và tìm kiếm nhanh.
  3. Trang chi tiết hiện vật với 3D Viewer (`@google/model-viewer`), nút kích hoạt AR thực tế, hỗ trợ fallback khi thiết bị không tương thích.
  4. Chế độ hiển thị song ngữ VI / EN / Bilingual.
  5. Popup từ vựng chuyên ngành (Vocabulary in Context) + Audio phát âm / Thuyết minh (HTML5 Audio + Web Speech API fallback).
  6. Sổ tay từ vựng lưu trữ LocalStorage (thêm, xóa, đánh dấu đã học, tìm kiếm, chống trùng, xóa toàn bộ có cảnh báo).
  7. Trình tạo và in nhãn QR Code chuyên dụng cho từng hiện vật (URL tuyệt đối, có cảnh báo localhost, stylesheet in ấn chuẩn nhãn trưng bày).
  8. Responsive mượt mà trên Mobile (360px - 430px), Tablet và Desktop.
  9. SPA rewrite hỗ trợ deep link direct URL.
- **Bổ sung P1:**
  1. Learning Center: Trung tâm ôn tập từ vựng di sản.
  2. Flashcard lật thẻ tương tác 2 mặt.
  3. Trắc nghiệm từ vựng (Vocabulary Quiz) tính điểm trực tiếp.

---

### 2. Lộ trình thực hiện từng Phase

| Phase | Nhiệm vụ chính | Trạng thái |
|---|---|---|
| **Phase 0** | Khảo sát workspace, tài nguyên, lập Project Plan, Architecture, Data Model | Đang tiến hành |
| **Phase 1** | Khởi tạo cấu hình Vite + React + TS + Tailwind + Router + Font & Theme Tokens | Kế tiếp |
| **Phase 2** | Xây dựng Data Store (Artifacts, Vocabulary, Quiz), Services (artifact, notebook, qr) | Kế tiếp |
| **Phase 3** | Phát triển UI P0: Layout, Header, Footer, Homepage, Collection, Detail Page, 3D/AR Viewer, Bilingual Switcher, Vocab Popup, Notebook, QR Generator | Kế tiếp |
| **Phase 4** | Phát triển UI P1: Flashcards, Quiz, Learning Hub, Web Speech API Thuyết minh | Kế tiếp |
| **Phase 5** | Responsive Tuning, Fallback states, Deep linking config (`vercel.json`), Build check & Handover docs | Kế tiếp |

---

### 3. Danh sách hiện vật mẫu khởi tạo (Illustrative Data)
Các hiện vật tiêu biểu của văn hóa Cơ Tu Tây Giang được mô hình hóa dữ liệu mẫu (có ghi chú minh họa / chờ chuyên gia xác minh):
1. **Nhà Gươl (Gươl Communal House)** - Biểu tượng tâm linh, cộng đồng Cơ Tu.
2. **Trống K'tu (K'tu Traditional Drum)** - Nhạc cụ lễ hội linh thiêng.
3. **Gùi Cơ Tu (Ba-hieng Carrying Basket)** - Vật dụng đan lát tinh xảo bằng mây, tre.
4. **Khèn Bè / Đàn T'rút (Traditional String Instrument)** - Nhạc khí dân gian.
5. **Điêu khắc Cột Tế (T'kơơr / Buffalo Sacrifice Pillar)** - Nghệ thuật điêu khắc gỗ đặc trưng.

Tất cả các hiện vật có placeholder 3D nếu chưa nạp file GLB thực tế, kèm chỉ dẫn rõ ràng cho người dùng cách bổ sung file vào thư mục `public/models/`.

