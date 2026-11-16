# HƯỚNG DẪN QUẢN TRỊ NỘI DUNG (CMS ADMIN GUIDE)
## HỆ THỐNG QUẢN TRỊ BẢO TÀNG SỐ DI SẢN VĂN HÓA CƠ TU TÂY GIANG
**Tài liệu dành cho Ban Quản trị Di sản, Cán bộ Văn hóa và Học sinh - Sinh viên Nghiên cứu**

---

## 1. TỔNG QUAN HỆ THỐNG VÀ PHÂN QUYỀN (RBAC)

Hệ thống quản trị (CMS) **CO-TU HERITAGE AR** cho phép quản lý toàn bộ nội dung website, hiện vật 3D, từ vựng học tập, bài viết trang chủ và đánh giá của khách tham quan mà không cần chỉnh sửa mã nguồn.

Hệ thống hỗ trợ 2 vai trò với cấp độ phân quyền rõ ràng:

| Quyền Hạn | 👑 Super Admin (Quản trị viên tối cao) | 🎓 Student / Editor (Học sinh - Biên tập viên) |
| :--- | :---: | :---: |
| **Đăng nhập vào CMS** | ✅ Có | ✅ Có |
| **Thêm / Chỉnh sửa nội dung hiện vật** | ✅ Toàn quyền | ✅ Có quyền biên tập |
| **Tải ảnh và file 3D GLB** | ✅ Toàn quyền | ✅ Có quyền |
| **Thêm / Sửa từ vựng song ngữ CLIL** | ✅ Toàn quyền | ✅ Có quyền |
| **Chỉnh sửa nội dung Trang chủ & Dự án** | ✅ Toàn quyền | ✅ Có quyền |
| **Duyệt / Từ chối / Xóa đánh giá (Reviews)** | ✅ **Toàn quyền** | ❌ **Bị chặn & Ẩn nút** (tránh duyệt nhầm) |
| **Xóa hiện vật & Danh mục cốt lõi** | ✅ **Toàn quyền** | ❌ **Bị khóa nút Xóa** (bảo vệ dữ liệu) |
| **Đổi mật khẩu tài khoản cá nhân** | ✅ Có | ✅ Có |

---

## 2. HƯỚNG DẪN ĐĂNG NHẬP VÀO HỆ THỐNG

### 2.1. Cách truy cập
- **Cách 1 (Nhập trực tiếp)**: Trên thanh địa chỉ trình duyệt, gõ thêm `/admin` vào sau địa chỉ web (Ví dụ: `https://cotuheritage.vercel.app/admin` hoặc `http://localhost:5173/admin`).
- **Cách 2 (Ở chân trang Footer)**: Cuộn xuống tận cùng đáy website của du khách, bấm vào dòng chữ nhỏ **"Cổng Quản Trị"**.

### 2.2. Tài khoản thử nghiệm nhanh (1-Click Fill)
Tại trang đăng nhập `/admin/login`, hệ thống có sẵn 2 nút chọn nhanh:
1. **👑 Nút "Super Admin"**: Tự điền `admin@cotuheritage.vn` / `Admin@123456` (Toàn quyền quản trị).
2. **🎓 Nút "Học Sinh (Editor)"**: Tự điền `hocsinh@cotuheritage.vn` / `Student@123456` (Quyền biên tập nội dung).

Nhấn nút **"Đăng Nhập Vào Quản Trị"** để vào hệ thống.

---

## 3. HƯỚNG DẪN QUẢN LÝ HIỆN VẬT 3D (/admin/artifacts)

### 3.1. Thêm hiện vật mới
1. Bấm vào mục **"Quản Lý Hiện Vật 3D"** trên thanh Menu bên trái (hoặc bấm nút **"+ Thêm Hiện Vật Mới"** tại trang Tổng quan).
2. Điền thông tin qua 5 thẻ tab:
   - **Tab 1: Thông Tin Cơ Bản**:
     - *Tên Tiếng Việt* (bắt buộc): ví dụ "Nhà Gươl Truyền Thống".
     - *Tên Tiếng Anh*: ví dụ "Traditional Gươl Communal House".
     - *Mã định danh (Slug)*: tạo tự động theo tên viết thường không dấu nối bằng dấu gạch ngang (ví dụ: `nha-guol-truyen-thong`).
     - *Danh mục*: chọn danh mục phù hợp (Kiến trúc, Nhạc cụ, Đan lát...).
     - *Mô tả ngắn*: tóm tắt 2-3 câu cho thẻ hiển thị.
   - **Tab 2: Lịch Sử & Văn Hóa**:
     - Điền bài viết chi tiết, xuất xứ địa bàn, câu chuyện lịch sử, ý nghĩa văn hóa tâm linh, chất liệu chế tác và kích thước.
   - **Tab 3: Hình Ảnh & Bộ Sưu Tập**:
     - Bấm **"Tải Ảnh Mới Lên Storage"** để chọn ảnh đại diện (thumbnail).
     - Bấm **"Thêm Ảnh Bộ Sưu Tập"** để chọn nhiều ảnh chi tiết góc chụp, hoa văn.
   - **Tab 4: Mô Hình 3D GLB**:
     - Bấm **"Tải File GLB Mới Lên"** để tải file 3D tối ưu (dung lượng lên đến 100MB).
     - Khung xem trước 3D bên phải sẽ lập tức cho phép bạn xoay 360° kiểm tra ánh sáng và kết cấu.
   - **Tab 5: Từ Vựng Song Ngữ CLIL**:
     - Bấm **"Thêm Thuật Ngữ Mới"** để nhập từ tiếng Việt, từ tiếng Anh, phiên âm IPA, định nghĩa và câu ví dụ song ngữ.
3. Bấm **"Lưu Thay Đổi"** ở góc phải trên cùng.

### 3.2. Xuất bản / Thu hồi bản nháp (Publish / Draft)
- Trong bảng danh sách hiện vật, bấm trực tiếp vào nút trạng thái:
  - Màu xanh **"Đã xuất bản"**: Hiện vật đang hiển thị công khai cho tất cả du khách trên website.
  - Màu vàng **"Bản nháp"**: Hiện vật tạm ẩn khỏi website du khách để tiếp tục bổ sung tư liệu.

---

## 4. HƯỚNG DẪN KIỂM DUYỆT ĐÁNH GIÁ CỦA DU KHÁCH (/admin/reviews)

1. Bấm vào mục **"Kiểm Duyệt Đánh Giá"** trên Menu.
2. Bạn sẽ thấy các tab phân loại: **Tất cả**, **Chờ duyệt**, **Đã duyệt**, **Từ chối**.
3. Đối với mỗi đánh giá đang ở trạng thái *Chờ kiểm duyệt*:
   - Bấm **"Duyệt"** (nút màu xanh có dấu tích): Đánh giá sẽ xuất hiện ngay lập tức trên Sổ lưu bút cộng đồng của website du khách.
   - Bấm **"Từ Chối"** (nút màu vàng gạch chéo): Đánh giá bị từ chối và ẩn khỏi trang du khách.
   - Bấm **"Xóa"** (nút màu đỏ thùng rác): Xóa vĩnh viễn khỏi cơ sở dữ liệu.
*(Lưu ý: Chỉ tài khoản Super Admin mới có nút thao tác Duyệt/Từ chối/Xóa; tài khoản Học sinh chỉ có quyền xem).*

---

## 5. HƯỚNG DẪN BIÊN TẬP NỘI DUNG TRANG CHỦ & DỰ ÁN (/admin/website-content)

1. Bấm vào mục **"Nội Dung Website"**.
2. Chọn khu vực bạn muốn sửa:
   - **Trang Chủ & Hero Banner**: Sửa câu khẩu hiệu lớn chào mừng, lời dẫn bộ sưu tập, lời dẫn góc học liệu. Bấm "Thay Ảnh Nền Hero" để đổi ảnh bìa.
   - **Giới Thiệu Dự Án & Sứ Mệnh**: Sửa bài viết giới thiệu về bảo tàng số di sản Cơ Tu Tây Giang.
   - **Bản Đồ Bản Làng & Văn Hóa**: Sửa lời thuyết minh cấu trúc không gian bản làng đồng tâm.
   - **Thông Tin Liên Hệ & Chân Trang**: Cập nhật email liên hệ, địa chỉ nghiên cứu và bản quyền.
3. Sau khi chỉnh sửa, bấm **"Lưu Mục Này"**. Nội dung sẽ cập nhật ngay lập tức lên website mà **không cần triển khai hay cài đặt lại máy chủ**.

---

## 6. HƯỚNG DẪN SỬ DỤNG THƯ VIỆN MEDIA & STORAGE (/admin/media)

1. Bấm vào mục **"Thư Viện Media & Storage"**.
2. Tại đây lưu trữ toàn bộ file trên 3 kho Supabase:
   - `artifact-images`: Ảnh hiện vật và bộ sưu tập.
   - `artifact-models`: Các file mô hình 3D photogrammetry định dạng `.glb`.
   - `website-assets`: Ảnh bìa banner trang chủ và logo.
3. Bấm vào bất kỳ file nào để xem trước (ảnh lớn hoặc mô hình 3D xoay 360° trực tiếp).
4. Bấm **"Copy URL"** để lấy đường link công khai dán vào bài viết.
5. **Cơ chế an toàn dữ liệu**: Hệ thống tự động đánh dấu huy hiệu **"Đang dùng"** cho các file đang gắn với hiện vật hoặc bài viết. Nếu bạn bấm xóa file đang dùng, hệ thống sẽ cảnh báo rõ hiện vật nào đang sử dụng để ngăn ngừa việc làm hỏng hiển thị trang web.

---

## 7. ĐỔI MẬT KHẨU VÀ THÔNG TIN CÁ NHÂN (/admin/settings)

1. Bấm vào mục **"Cài Đặt & Tài Khoản"**.
2. Để đổi tên hiển thị: Nhập tên mới vào ô "Tên Hiển Thị" rồi bấm "Cập Nhật Tên Hiển Thị".
3. Để đổi mật khẩu: Nhập mật khẩu mới (tối thiểu 6 ký tự), nhập lại vào ô xác nhận và bấm "Xác Nhận Đổi Mật Khẩu".
4. Để đăng xuất: Bấm nút **"Đăng Xuất"** ở góc dưới cùng thanh Menu.
