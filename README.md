# CO TU HERITAGE AR — VĂN HÓA CƠ TU TÂY GIANG

> **Hệ thống WebAR tích hợp học liệu song ngữ Việt – Anh nhằm số hóa hiện vật, hỗ trợ học tiếng Anh theo phương pháp CLIL và quảng bá văn hóa Cơ Tu tại Tây Giang (Quảng Nam).**

---

## 1. Điểm nổi bật của phiên bản MVP

- **100% Public WebApp:** Không cần tài khoản, không đăng nhập, không cơ sở dữ liệu hay server backend phức tạp.
- **Tương thích toàn diện:** Tối ưu mượt mà cho Điện thoại di động (Mobile 360px - 430px), Máy tính bảng (Tablet) và Máy tính (Desktop).
- **Luồng trải nghiệm thực tế:** Quét mã QR tại hiện vật trưng bày $\rightarrow$ Mở trang hiện vật trực tiếp $\rightarrow$ Tương tác 3D WebGL $\rightarrow$ Kích hoạt AR trong không gian thực $\rightarrow$ Học tiếng Anh song ngữ CLIL.
- **3D & WebAR tiên tiến:** Tích hợp `@google/model-viewer` hỗ trợ WebXR (Android) và Quick Look (iOS), có poster loading, camera controls và fallback hướng dẫn thông minh trên Desktop.
- **Học liệu song ngữ chuyên sâu:** Chuyển đổi linh hoạt Tiếng Việt / English / Song ngữ; tra cứu thuật ngữ chuyên ngành (Vocabulary Popup); phát âm & thuyết minh (Audio Player + Web Speech API fallback).
- **Sổ tay từ vựng (Notebook):** Lưu trữ cục bộ trên trình duyệt qua LocalStorage; lọc, tìm kiếm, đánh dấu đã thuộc, chống lưu trùng.
- **Trung tâm học tập (Learning Hub):** Ôn tập Flashcard 3D lật thẻ tương tác và bài kiểm tra trắc nghiệm chấm điểm tức thời.
- **Trình in nhãn QR chuyên dụng:** Tạo mã QR theo URL tuyệt đối, có cảnh báo khi chạy localhost, stylesheet in ấn chuẩn nhãn bảo tàng khổ A4.

---

## 2. Yêu cầu môi trường & Cài đặt

- **Node.js:** Phiên bản 18.x, 20.x hoặc 22.x (Khuyến nghị `v22.14.0` trở lên).
- **Package Manager:** `npm` (hoặc `pnpm` / `yarn`).

### Lệnh cài đặt dependencies:
```bash
npm install
```

### Lệnh chạy môi trường phát triển (Dev Server):
```bash
npm run dev
```
Trình duyệt sẽ mở tại: `http://localhost:3000` (hoặc truy cập qua IP mạng LAN từ điện thoại: `http://192.168.x.x:3000`).

### Lệnh biên dịch kiểm tra (Production Build):
```bash
npm run build
```
Kết quả biên dịch sẽ nằm trong thư mục `dist/`.

### Lệnh chạy thử bản build:
```bash
npm run preview
```

---

## 3. Cấu hình biến môi trường (`.env`)

Tạo tệp `.env` ở thư mục gốc nếu muốn cấu hình tên miền sản phẩm (xem mẫu tại `.env.example`):

```env
# URL website đã deploy (dùng để in mã QR chuẩn cho khách tham quan quét bằng điện thoại)
VITE_PUBLIC_BASE_URL=https://cotuheritage.vercel.app
```

> **Lưu ý quan trọng về QR:** Nếu không cấu hình `VITE_PUBLIC_BASE_URL`, hệ thống sẽ lấy `window.location.origin`. Nếu bạn đang chạy trên `localhost`, trang `/qr-codes` sẽ hiển thị cảnh báo nổi bật để nhắc bạn không in nhãn có chứa địa chỉ localhost.

---

## 4. Hướng dẫn quản trị & Cập nhật nội dung

### 4.1. Thêm mô hình 3D (.glb)
1. Xuất file 3D định dạng `.glb` (từ Tripo AI, Meshy AI hoặc Blender). Tối ưu dung lượng dưới 10MB - 15MB để mobile tải nhanh qua 4G.
2. Đặt file vào thư mục `public/models/` (ví dụ: `public/models/guol.glb`).
3. Mở tệp `src/data/artifactsData.ts`, tìm hiện vật tương ứng và cập nhật:
   ```typescript
   model3D: '/models/guol.glb',
   modelStatus: 'available', // Đổi từ 'coming_soon' sang 'available'
   ```

### 4.2. Thêm file âm thanh thuyết minh (.mp3)
1. Đặt tệp thu âm MP3 vào thư mục `public/audio/` (ví dụ: `public/audio/guol-vi.mp3` và `public/audio/guol-en.mp3`).
2. Trong `src/data/artifactsData.ts`, khai báo đường dẫn:
   ```typescript
   audio: {
     vi: '/audio/guol-vi.mp3',
     en: '/audio/guol-en.mp3',
   }
   ```
   *(Nếu không khai báo audio, hệ thống sẽ tự động sử dụng Web Speech API của trình duyệt làm phương án đọc thay thế).*

### 4.3. Thêm hoặc chỉnh sửa hiện vật mới
Toàn bộ dữ liệu được quản lý tập trung tại `src/data/artifactsData.ts`. Mỗi hiện vật là một đối tượng `Artifact` tuân thủ TypeScript interface tại `src/types/index.ts`:
- `slug`: Đường dẫn URL (ví dụ: `guol-communal-house`).
- `name`: Tên song ngữ `{ vi: "...", en: "..." }`.
- `category`: Phân loại (`architecture`, `musical_instrument`, `weaving_craft`, `spiritual_sculpture`).
- `description`, `sections`: Nội dung thuyết minh và bối cảnh.
- `vocabulary`: Danh sách thuật ngữ tiếng Anh trong ngữ cảnh hiện vật.

---

## 5. Triển khai lên Vercel (Deploy)

Hệ thống được thiết kế dạng Single Page Application (SPA) tĩnh, triển khai lên Vercel hoàn toàn miễn phí và tự động:

1. Đưa toàn bộ mã nguồn lên kho lưu trữ GitHub.
2. Đăng nhập [Vercel](https://vercel.com/) và bấm **Add New Project**, chọn repo này.
3. Trong phần **Environment Variables**, thêm:
   - Key: `VITE_PUBLIC_BASE_URL`
   - Value: URL Vercel của bạn (ví dụ: `https://cotuheritage.vercel.app`)
4. Bấm **Deploy**.
5. Tệp `vercel.json` đã được tạo sẵn trong project để tự động xử lý chuyển hướng URL (SPA fallback rewrite), đảm bảo khi người dùng quét mã QR mở trực tiếp đường dẫn con như `/artifacts/guol-communal-house` hoặc bấm F5 sẽ không bao giờ bị lỗi 404.

---

## 6. Lưu ý kỹ thuật & Tính tương thích AR

1. **Yêu cầu kết nối HTTPS cho AR:**
   - Trình duyệt di động chỉ cho phép truy cập camera và WebXR qua kết nối bảo mật `https://` (hoặc `localhost` trên chính máy đó). Vì vậy, khi demo quét QR từ điện thoại khác, bắt buộc phải sử dụng URL đã deploy HTTPS.
2. **Khả năng hỗ trợ thiết bị AR:**
   - **Android:** Cần cài đặt dịch vụ *Google Play Services for AR (ARCore)*.
   - **iOS:** Tự động hỗ trợ AR Quick Look trên iPhone 6s trở lên chạy iOS 12+.
   - **Desktop:** Mặc định xem mô hình 3D xoay/zoom; khi bấm nút AR hệ thống sẽ hiển thị mã QR kèm hướng dẫn để quét và mở trên điện thoại.
3. **Bộ nhớ cục bộ (LocalStorage):**
   - Sổ tay từ vựng được lưu trữ trên trình duyệt của máy hiện tại, không thu thập thông tin cá nhân và không gửi dữ liệu ra bên ngoài.

