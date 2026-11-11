# Phụ lục 7
**Mẫu phiếu khai báo sử dụng công nghệ số, trí tuệ nhân tạo**  
*(Kèm theo Công văn số /SGDĐT-GDTrH&HSSV ngày /11/2026 của Sở GDĐT)*

---

# PHIẾU KHAI BÁO SỬ DỤNG CÔNG NGHỆ SỐ, TRÍ TUỆ NHÂN TẠO
*(Kê khai đối với các trường hợp sử dụng công nghệ số, trí tuệ nhân tạo thuộc diện phải khai báo theo Quy chế Cuộc thi)*

---

## I. THÔNG TIN CHUNG

* **Tên dự án dự thi:**  
  **CO TU HERITAGE AR — KHÔNG GIAN BẢO TÀNG SỐ VÀ HỌC LIỆU DI SẢN CƠ TU TÂY GIANG ỨNG DỤNG THỰC TẾ TĂNG CƯỜNG (WEBAR) VÀ PHƯƠNG PHÁP TÍCH HỢP NGÔN NGỮ - NỘI DUNG (CLIL)**

* **Lĩnh vực dự thi:**  
  Hệ thống nhúng / Phần mềm hệ thống / Khoa học xã hội và hành vi *(chọn lĩnh vực phù hợp theo hồ sơ đăng ký)*

* **Họ và tên học sinh/nhóm trưởng:**  
  *Nguyễn Văn A* *(Học sinh điền chính xác họ tên)*

* **Họ và tên thành viên (nếu có):**  
  *Trần Thị B* *(Học sinh điền chính xác họ tên)*

* **Họ và tên người hướng dẫn nghiên cứu:**  
  *Thầy/Cô Nguyễn Văn C* *(Điền họ tên giáo viên hướng dẫn)*

* **Cơ sở giáo dục:**  
  *Trường THPT ...*

* **Đơn vị dự thi:**  
  *Sở Giáo dục và Đào tạo ...*

---

## II. KÊ KHAI SỬ DỤNG CÔNG NGHỆ SỐ, TRÍ TUỆ NHÂN TẠO

### 1. Công cụ sử dụng

| TT | Tên công cụ công nghệ số, trí tuệ nhân tạo (AI) | Mục đích sử dụng; công việc/nội dung sử dụng công cụ công nghệ số, AI | Mức độ sử dụng công cụ công nghệ số, AI | Ghi chú |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **Antigravity (Google DeepMind / Gemini Pro)** | **Hỗ trợ lập trình và tối ưu mã nguồn:**<br>• Gợi ý cấu trúc component React/TypeScript theo chuẩn module hóa.<br>• Hỗ trợ viết hàm tính toán tọa độ điểm chạm 3D (Anatomy Hotspots) và thuật toán âm học Web Audio API.<br>• Rà soát và sửa lỗi kiểu dữ liệu TypeScript (Type safety check). | **Khoảng 25%**<br>*(AI hỗ trợ gợi ý cú pháp và giải thuật; học sinh tự xây dựng kiến trúc, viết logic nghiệp vụ, tích hợp WebAR và kiểm thử thực tế 100%)* | Đã lưu trữ toàn bộ Prompt Log đối chiếu. Học sinh làm chủ hoàn toàn mã nguồn. |
| **2** | **Claude 3.5 Sonnet / ChatGPT** | **Hỗ trợ chuẩn hóa thuật ngữ học thuật (CLIL):**<br>• Gợi ý chuẩn hóa phiên âm quốc tế IPA cho 78 thuật ngữ văn hóa Cơ Tu.<br>• Kiểm tra tính đối chiếu ngữ nghĩa giữa tiếng Việt và tiếng Anh chuyên ngành nhân học / bảo tàng học (ICOM standards). | **Khoảng 20%**<br>*(AI đề xuất phương án dịch học thuật; học sinh và giáo viên hướng dẫn trực tiếp thẩm định dựa trên tài liệu điền dã thực tế Tây Giang)* | Nội dung văn hóa bản địa được đối chiếu với tư liệu từ già làng và bảo tàng địa phương. |
| **3** | **Blender & WebXR Toolchain (Khối công nghệ số 3D)** | **Tối ưu hóa dữ liệu mô hình 3D:**<br>• Nén lưới đa giác (polygon decimation) và tạo texture atlas cho các file `.glb` (Nhà Gươl, Trống K'tu, Cột tế T'kơơr).<br>• Chuyển đổi định dạng mô hình phục vụ chạy mượt trên thiết bị di động không cần cài app. | **Khoảng 30%**<br>*(Sử dụng các thuật toán nén tự động của phần mềm; học sinh tự đo đạc tỉ lệ thực tế, căn chỉnh chất liệu và ánh sáng)* | Không sử dụng AI sinh hình giả mạo; toàn bộ mô hình bám sát hiện vật thực địa. |

---

### 2. Minh chứng sử dụng trí tuệ nhân tạo

#### BẢN TÓM TẮT NHẬT KÝ CÂU LỆNH (PROMPT LOG) VÀ PHẢN HỒI LIÊN QUAN ĐẾN DỰ ÁN

*(Ghi chú: Toàn bộ thông tin định danh cá nhân - PII đã được loại bỏ theo đúng quy định).*

---

#### 📌 MINH CHỨNG 1: HỖ TRỢ LẬP TRÌNH VÀ TỐI ƯU HÓA MÃ NGUỒN REACT / TYPESCRIPT
* **Tên công cụ:** Antigravity AI Coding Assistant (mô hình Gemini Pro)
* **Thời gian thực hiện:** Tháng 10/2026 – Tháng 11/2026
* **Tóm tắt chuỗi câu lệnh (Prompt) và Phản hồi (Response):**

```text
[HỌC SINH - PROMPT]:
"Tôi đang xây dựng ứng dụng web bảo tàng số Cơ Tu bằng React + TypeScript + Tailwind CSS. 
Hiện tại trang chi tiết hiện vật cần thêm tính năng 'Interactive 3D Anatomy Inspector'. 
Hãy gợi ý cấu trúc interface TypeScript để quản lý các điểm chạm giải phẫu (camera orbit, thuật ngữ tiếng Anh, phiên âm IPA, phân tích kỹ thuật và biểu tượng văn hóa) và cách binding thuộc tính camera-orbit vào thẻ <model-viewer> khi người dùng bấm chọn."

[AI - PHẢN HỒI]:
Gợi ý interface AnatomyHotspot gồm các trường: id, code, title (bilingual), cameraOrbit (string dạng '45deg 60deg 85%'), technicalTermEn, ipa, engineeringAnalysis và culturalSymbolism.
Cung cấp mẫu hook useEffect lắng nghe prop cameraOrbit để cập nhật trực tiếp vào modelViewerRef.current.cameraOrbit mà không cần tải lại toàn bộ file 3D.

[ĐÓNG GÓP THỰC TẾ CỦA HỌC SINH]:
Học sinh tiếp thu cấu trúc interface, tự tay điền dã xác định 15 tọa độ góc xoay thực tế của 5 hiện vật (Nhà Gươl, Trống, Cột tế, Đàn T'rứt, Gùi), viết toàn bộ nội dung phân tích văn hóa và kiểm thử trên điện thoại Android/iOS.
```

---

#### 📌 MINH CHỨNG 2: THUẬT TOÁN TỔNG HỢP ÂM THANH NGŨ CUNG (WEB AUDIO API)
* **Tên công cụ:** Antigravity / Gemini Pro
* **Thời gian thực hiện:** Tháng 11/2026
* **Tóm tắt chuỗi câu lệnh (Prompt) và Phản hồi (Response):**

```text
[HỌC SINH - PROMPT]:
"Làm thế nào để tạo ra tiếng gảy đàn nhẹ nhàng, trong trẻo như đàn Kalimba hoặc đàn tre bằng Web Audio API thuần của trình duyệt, không dùng file nhạc bên ngoài, với thang âm ngũ cung F Major Pentatonic (F, G, A, C, D)?"

[AI - PHẢN HỒI]:
Đưa ra mã nguồn mẫu sử dụng OscillatorNode loại 'triangle' kết hợp với một sub-oscillator sóng 'sine' ở tần số gấp đôi, đưa qua Lowpass BiquadFilter (1800Hz) và GainNode với đường bao suy giảm tự nhiên (exponential ramp decay). Cung cấp bảng tần số các nốt F3, C4, D4, F4, G4, A4, C5, D5.

[ĐÓNG GÓP THỰC TẾ CỦA HỌC SINH]:
Học sinh tự chạy thử trên trình duyệt, nhận thấy âm thanh ban đầu còn đơn điệu, đã tự tay lập trình thêm nút chuyển bài sang file MP3 thu âm nhạc cụ thật từ studio, kết hợp xử lý cơ chế Auto-Play tuân thủ chính sách bảo mật trình duyệt Chrome/Edge.
```

---

#### 📌 MINH CHỨNG 3: CHUẨN HÓA THUẬT NGỮ CLIL & HỒ SƠ ĐỊNH DANH BẢO TÀNG (ICOM DOSSIER)
* **Tên công cụ:** Claude 3.5 Sonnet
* **Thời gian thực hiện:** Tháng 10/2026
* **Tóm tắt chuỗi câu lệnh (Prompt) và Phản hồi (Response):**

```text
[HỌC SINH - PROMPT]:
"Tôi cần xây dựng kho từ vựng tiếng Anh học thuật cho 5 hiện vật Cơ Tu phục vụ học tập theo phương pháp CLIL. Hãy kiểm tra các thuật ngữ sau xem đã đúng chuẩn nhân học quốc tế chưa: 'Communal house' cho Nhà Gươl, 'Mortise and tenon joint' cho liên kết mộng gỗ, 'Double-headed drum' cho trống K'tu, 'Herringbone twill weave' cho đan xương cá gùi Ba-hiêng. Hãy cung cấp định nghĩa tiếng Anh ngắn gọn và phiên âm IPA tương ứng."

[AI - PHẢN HỒI]:
Xác nhận tính chuẩn xác của các thuật ngữ theo từ điển nhân học và bảo tàng học ICOM. Cung cấp phiên âm IPA chuẩn Anh - Mỹ (/kəˈmjuː.nəl haʊs/, /ˈmɔː.tɪs ænd ˈten.ən dʒɔɪnt/...) và định nghĩa ngắn gọn, dễ hiểu cho học sinh THPT.

[ĐÓNG GÓP THỰC TẾ CỦA HỌC SINH]:
Học sinh dịch nghĩa tiếng Việt đối chiếu, tự tay viết thêm 78 câu ví dụ song ngữ gắn liền với bối cảnh thực tế tại huyện Tây Giang, thu âm mẫu giọng đọc và đối chiếu với giáo viên dạy môn Tiếng Anh và môn Lịch sử của trường.
```

---

## III. CAM KẾT VỀ TÍNH MINH BẠCH VÀ LIÊM CHÍNH HỌC THUẬT

1. Nhóm nghiên cứu cam kết toàn bộ thông tin kê khai trên là hoàn toàn trung thực, phản ánh đúng thực tế quá trình nghiên cứu và phát triển dự án.
2. Trí tuệ nhân tạo và công nghệ số chỉ đóng vai trò là công cụ hỗ trợ kỹ thuật, tham khảo và tối ưu năng suất. Toàn bộ ý tưởng khoa học, cấu trúc đề tài, dữ liệu điền dã văn hóa, mã nguồn chính và kết quả thử nghiệm sư phạm đều là sản phẩm trí tuệ và sự đóng góp thực chất của nhóm học sinh dưới sự hướng dẫn của giáo viên.
3. Nhóm học sinh hiểu rõ bản chất của từng tính năng, làm chủ 100% mã nguồn và sẵn sàng trình bày, thao tác thực chứng trực tiếp trước Hội đồng Giám khảo cuộc thi.

---

*......., ngày ..... tháng 11 năm 202...*

| NGƯỜI HƯỚNG DẪN NGHIÊN CỨU | HỌC SINH / TRƯỞNG NHÓM | THÀNH VIÊN |
| :---: | :---: | :---: |
| *(Ký, ghi rõ họ tên)* | *(Ký, ghi rõ họ tên)* | *(Ký, ghi rõ họ tên)* |
| <br><br><br><br> | <br><br><br><br> | <br><br><br><br> |
| **................................................** | **................................................** | **................................................** |

