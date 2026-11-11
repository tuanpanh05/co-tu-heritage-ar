# KIẾN TRÚC HỆ THỐNG (ARCHITECTURE)
## CO TU HERITAGE AR

### 1. Tổng quan kiến trúc

Ứng dụng được thiết kế theo mô hình **Client-Side SPA (Single Page Application)** tĩnh, độc lập hoàn toàn, không phụ thuộc máy chủ backend hay hệ quản trị cơ sở dữ liệu.

```
[Khách tham quan / Học sinh]
       │
       ├── Quét QR vật lý trên nhãn trưng bày
       │         │
       │         ▼
       └── Mở trình duyệt Web (Deep Link URL: /artifacts/:slug)
                 │
                 ▼
       ┌────────────────────────────────────────────────────────┐
       │                   Vercel / Static CDN                  │
       │           (index.html fallback cho mọi route)           │
       └────────────────────────────────────────────────────────┘
                 │
                 ▼
       ┌────────────────────────────────────────────────────────┐
       │               Frontend Application (React + Vite)       │
       │                                                        │
       │  ┌──────────────────────────────────────────────────┐  │
       │  │               React Router (v6/v7)               │  │
       │  │  - / : Homepage                                  │  │
       │  │  - /artifacts : Collection List                  │  │
       │  │  - /artifacts/:slug : Detail + 3D/AR Viewer      │  │
       │  │  - /learn : Learning Center                      │  │
       │  │  - /learn/notebook : Vocabulary Notebook          │  │
       │  │  - /qr-codes : QR Generator & Printable Labels   │  │
       │  └──────────────────────────────────────────────────┘  │
       │                           │                            │
       │         ┌─────────────────┴─────────────────┐          │
       │         ▼                                   ▼          │
       │  ┌───────────────┐                 ┌─────────────────┐ │
       │  │ Services Layer│                 │ Presentation UI │ │
       │  │ - artifact    │                 │ - 3D Viewer     │ │
       │  │ - notebook    │                 │ - Bilingual Box │ │
       │  │ - audioTTS    │                 │ - Vocab Sheet   │ │
       │  │ - qrService   │                 │ - Flashcard/Quiz│ │
       │  └───────────────┘                 └─────────────────┘ │
       │         │                                   │          │
       │         ▼                                   ▼          │
       │  ┌───────────────┐                 ┌─────────────────┐ │
       │  │ Data (JSON)   │                 │ Browser Storage │ │
       │  │ & Static      │                 │ (LocalStorage)  │ │
       │  │ GLB / Audio   │                 └─────────────────┘ │
       │  └───────────────┘                                     │
       └────────────────────────────────────────────────────────┘
```

### 2. Thành phần kỹ thuật chính
1. **Frontend Core:**
   - React 18+ với TypeScript nghiêm ngặt (Strict Mode).
   - Vite làm công cụ build tối ưu tốc độ và kích thước bundle.
2. **Styling & Design System:**
   - Tailwind CSS: Tone màu di sản (Warm Ivory `#FAF8F5`, Sand `#E8DEC8`, Terracotta Clay `#C2593F`, Dark Wood `#2C221E`, Charcoal `#1A1615`).
   - Font: Inter / sans-serif tối ưu hiển thị ký tự tiếng Việt đầy đủ.
3. **3D & WebAR Rendering:**
   - `@google/model-viewer` Custom Element tích hợp WebGL và WebXR.
   - Hỗ trợ tương tác: Xoay 360 độ, phóng to thu nhỏ (zoom), poster loading khi chưa tải xong model, camera controls.
   - AR Pipeline: WebXR trên Android Chrome, Scene Viewer intent fallback, iOS Quick Look qua `usdz` nếu có.
   - Desktop Fallback: Hiển thị thông báo hướng dẫn quét QR trên điện thoại để trải nghiệm đặt mô hình vào không gian thực.
4. **Học liệu & Audio:**
   - Chế độ hiển thị 3 trạng thái: Tiếng Việt, English, và Song ngữ song song (CLIL).
   - Audio Thuyết minh: Hỗ trợ tệp âm thanh MP3 thực tế; dự phòng bằng Web Speech API (`SpeechSynthesisUtterance`) với ngôn ngữ `vi-VN` và `en-US`.
5. **Persistence (Lưu trữ sổ tay):**
   - Lưu trữ toàn bộ sổ tay từ vựng vào `localStorage` của trình duyệt dưới key `co_tu_vocabulary_notebook_v1`.
   - Có cơ chế kiểm tra `try/catch` an toàn khi người dùng duyệt web ở chế độ ẩn danh hoặc quota đầy.
6. **QR Generator & Print Engine:**
   - Tự động lấy hostname hiện tại hoặc biến môi trường `VITE_PUBLIC_BASE_URL`.
   - Cảnh báo trực quan nếu đang chạy trên `localhost` (không quét được từ máy khác).
   - Print CSS `@media print` ẩn hoàn toàn UI điều hướng để in trực tiếp nhãn trưng bày chuẩn bảo tàng.

