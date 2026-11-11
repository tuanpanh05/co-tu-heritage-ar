# ANTIGRAVITY MASTER PROMPT V2 — CO TU HERITAGE AR

> **Mục đích:** Giao toàn bộ tài liệu này cho Antigravity Agent để xây dựng trực tiếp bản MVP CO TU HERITAGE AR phục vụ vòng thi đầu tiên.
>
> **Phạm vi đã chốt:** Website public, không đăng nhập, không backend riêng, không database, không Supabase/Firebase. Website phải tương thích tốt trên điện thoại, máy tính bảng và máy tính.
>
> **Nguyên tắc:** Ưu tiên một sản phẩm chạy thật, có luồng QR → trang hiện vật → 3D/AR → học liệu Việt–Anh. Không chỉ tạo mockup hoặc tài liệu kế hoạch.

---

# 1. Vai trò và nhiệm vụ của Agent

Bạn là một đội phát triển sản phẩm gồm:

- Senior Frontend Engineer (React / TypeScript).
- Frontend Architect.
- 3D Web / WebAR Engineer.
- UI/UX Designer cho sản phẩm giáo dục và bảo tàng số.
- QA Engineer chuyên kiểm thử responsive và trải nghiệm trên thiết bị thật.

Nhiệm vụ: kiểm tra workspace, đọc toàn bộ yêu cầu, đưa ra kế hoạch ngắn, sau đó **trực tiếp xây dựng, chạy, kiểm tra và sửa lỗi** để bàn giao một MVP có thể demo.

Không dừng lại sau khi lập kế hoạch. Không chỉ tạo HTML tĩnh. Không tạo nút giả hoặc chức năng chỉ có hình thức.

# 2. Bối cảnh và mục tiêu nghiên cứu

## 2.1. Tên dự án

**CO TU HERITAGE AR — Hệ thống WebAR tích hợp học liệu song ngữ Việt – Anh nhằm số hóa hiện vật, hỗ trợ học tiếng Anh và quảng bá văn hóa Cơ Tu tại Tây Giang.**

## 2.2. Mục tiêu tổng quát

Xây dựng, thử nghiệm kỹ thuật và thực nghiệm sư phạm hệ thống CO TU HERITAGE AR nhằm số hóa 3 chiều các hiện vật văn hóa Cơ Tu tiêu biểu, cung cấp học liệu song ngữ Việt – Anh theo định hướng CLIL (Content and Language Integrated Learning — Học tích hợp Nội dung và Ngôn ngữ), hỗ trợ học sinh THPT vùng khó khăn từng bước cải thiện vốn từ vựng, khả năng nghe hiểu và sự tự tin khi thuyết minh di sản bằng tiếng Anh; đồng thời hỗ trợ du khách tiếp cận thông tin văn hóa thuận tiện.

## 2.3. Ý tưởng sản phẩm — phải hiểu đúng

Sản phẩm kết hợp **hiện vật vật lý được trưng bày ngoài đời** với **website public cung cấp trải nghiệm số cho từng hiện vật**.

Luồng trải nghiệm chính:

1. Một hiện vật thật được đặt tại trường học, khu trưng bày hoặc không gian giới thiệu văn hóa Cơ Tu.
2. Bên cạnh hiện vật có một nhãn QR Code riêng.
3. Khách tham quan/học sinh dùng camera điện thoại quét QR.
4. Trình duyệt mở đúng URL trang chi tiết hiện vật, ví dụ `/artifacts/guol-communal-house`.
5. Người dùng xem thông tin, hình ảnh và mô hình GLB; có thể xoay, zoom và quan sát từ nhiều góc.
6. Người dùng chọn **View in AR** để đưa mô hình 3D vào không gian thực nếu thiết bị/trình duyệt tương thích.
7. Người dùng chuyển đổi Tiếng Việt / English / Song ngữ; đọc nội dung; nghe thuyết minh; tra từ vựng chuyên ngành; lưu từ và làm bài tập.

**Phân biệt công nghệ bắt buộc:** QR Code chỉ mở đúng trang hiện vật. QR không tự nhận diện hiện vật và không tự tạo AR. Trải nghiệm AR được kích hoạt sau đó từ trang hiện vật. Image Tracking bằng camera (nếu phát triển thêm) là một module khác, không phải hoạt động quét QR.

## 2.4. Người dùng mục tiêu

- Học sinh THPT: khám phá di sản và học tiếng Anh theo ngữ cảnh văn hóa.
- Giáo viên: sử dụng trang hiện vật và học liệu trong hoạt động học tập.
- Khách tham quan: tra cứu thông tin văn hóa nhanh qua QR bằng tiếng Việt hoặc tiếng Anh.

# 3. Quyết định phạm vi cho vòng thi đầu tiên

## 3.1. Kiến trúc public — không backend

Đây là yêu cầu bắt buộc trong MVP:

- Không có trang đăng nhập/đăng ký.
- Không tạo user account, role hoặc phân quyền người dùng.
- Không sử dụng Spring Boot, Express, NestJS, Supabase, Firebase hoặc database server.
- Không tạo REST API/backend server riêng.
- Dữ liệu hiện vật và học liệu được đóng gói trong JSON/TypeScript data.
- Ảnh, GLB, audio và marker được phục vụ dưới dạng static assets.
- Sổ tay từ vựng và trạng thái học demo lưu trên trình duyệt bằng LocalStorage.
- Deploy dưới dạng website tĩnh trên Vercel hoặc static hosting tương đương.

Không được tự ý thêm backend hay dịch vụ trả phí. Nếu có đề xuất mở rộng backend, chỉ ghi vào tài liệu Future Roadmap, không triển khai trong MVP.

## 3.2. Ưu tiên theo mức độ

### P0 — Bắt buộc hoàn thành

1. Homepage giới thiệu dự án.
2. Danh mục hiện vật.
3. Trang chi tiết cho từng hiện vật, có URL/slug riêng.
4. 3D Viewer hiển thị GLB, hỗ trợ xoay và zoom.
5. Nút AR thật, có xử lý thiết bị không hỗ trợ.
6. Chuyển đổi ngôn ngữ VI / EN / Bilingual.
7. Nội dung hiện vật song ngữ và phần học thuật.
8. Vocabulary Popup/Detail cho thuật ngữ chuyên ngành.
9. Vocabulary Notebook dùng LocalStorage.
10. QR Generator tạo mã theo URL trang hiện vật; xem, tải và in được.
11. Responsive hoàn chỉnh cho mobile, tablet và desktop.
12. Direct URL/deep link hoạt động khi mở trực tiếp và refresh trên hosting.

### P1 — Hoàn thiện nếu không làm chậm P0

1. Audio thuyết minh tiếng Việt và tiếng Anh.
2. Web Speech API làm phương án đọc dự phòng khi chưa có file audio.
3. Flashcards ôn từ vựng.
4. Quiz từ vựng.
5. Listening quiz nếu có audio mẫu phù hợp.
6. Learning Center tổng hợp các hoạt động học.

### P2 — Chỉ ghi nhận để phát triển sau vòng thi

1. MindAR Image Tracking để camera nhận diện ảnh mục tiêu và gắn mô hình vào ảnh.
2. Backend/database và đồng bộ dữ liệu.
3. Tài khoản học sinh/giáo viên.
4. Admin CMS quản lý hiện vật và học liệu.
5. Dashboard, thống kê lớp học, pre-test/post-test.
6. AI hỗ trợ biên tập nội dung có quy trình chuyên gia kiểm duyệt.

Không để P1/P2 làm chậm, phức tạp hóa hoặc phá vỡ P0.

# 4. Công nghệ triển khai

Sử dụng stack gọn, dễ bảo trì và phù hợp website public:

| Nhóm | Công nghệ | Vai trò |
|---|---|---|
| Frontend | React + TypeScript | Xây dựng giao diện và logic |
| Build tool | Vite | Dev server và production build |
| Styling | Tailwind CSS | Responsive UI và design system |
| Routing | React Router | Homepage, collection, artifact detail, learning |
| Icons | Lucide React | Icon nhất quán |
| 3D / AR | `@google/model-viewer` | Render GLB, tương tác 3D, khởi chạy AR trên thiết bị hỗ trợ |
| QR | `qrcode.react` hoặc thư viện QR React đang được duy trì | Tạo QR theo URL hiện vật |
| Data | JSON + TypeScript types | Nội dung hiện vật, từ vựng, quiz |
| Local persistence | Browser LocalStorage | Sổ tay từ vựng và trạng thái học cục bộ |
| Audio | MP3 + HTML Audio; Web Speech API fallback | Thuyết minh/phát âm |
| Hosting | Vercel hoặc static hosting HTTPS tương đương | Public website |

**Không khóa cứng version package cũ.** Trước khi cài, kiểm tra phiên bản stable và hướng dẫn chính thức hiện hành, chọn các phiên bản tương thích với nhau. Không nâng version tùy tiện giữa chừng nếu đang có project ổn định.

Tài liệu tham khảo chính thức:

- Vite: https://vite.dev/guide/
- Vite static deploy: https://vite.dev/guide/static-deploy.html
- model-viewer: https://modelviewer.dev/docs/
- Google AR với model-viewer: https://developers.google.com/ar/develop/webxr/model-viewer
- QRCode React: https://github.com/zpao/qrcode.react
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/docs

# 5. Kiến trúc ứng dụng

## 5.1. Luồng tải dữ liệu

`QR Code → Public URL → React Router → Artifact Data (JSON) → GLB / Images / Audio → Learning UI`

Không có API/backend ở giữa.

## 5.2. Tách lớp dữ liệu

Không hardcode nội dung hiện vật trong nhiều component. Tạo repository/service đơn giản để UI chỉ gọi một nơi lấy dữ liệu.

Gợi ý:

- `artifactService`: lấy danh sách, tìm theo slug, lọc và tìm kiếm hiện vật.
- `vocabularyService`: lấy thuật ngữ theo hiện vật.
- `notebookService`: đọc/ghi LocalStorage.
- `qrService`: tạo URL chuẩn và dữ liệu hiển thị/in QR.

Thiết kế độc lập giữa UI và data để về sau có thể chuyển nguồn JSON sang backend mà không phải viết lại toàn bộ giao diện. Tuy nhiên, **không triển khai abstraction quá phức tạp** cho một MVP nhỏ.

# 6. Chức năng và yêu cầu chi tiết

## 6.1. Homepage — `/`

Các khu vực:

- Header/logo CO TU HERITAGE AR và navigation.
- Hero giới thiệu dự án với thông điệp khám phá di sản qua 3D, AR và học song ngữ.
- CTA chính: “Khám phá hiện vật / Explore Heritage”.
- Một số hiện vật nổi bật.
- Khối giới thiệu cách sử dụng: Scan QR → Explore 3D → Experience AR → Learn.
- Khối giới thiệu mục tiêu học tập CLIL.
- Footer: tên dự án, thông tin đơn vị/nhóm nếu có dữ liệu thật.

Không tạo nội dung khẳng định văn hóa thiếu nguồn. Có thể dùng ảnh/visual trang trí trung tính, nhưng không gán nhầm ảnh stock thành hiện vật Cơ Tu.

## 6.2. Collection — `/artifacts`

- Grid hiện vật responsive.
- Mỗi card có ảnh, tên VI/EN, loại hiện vật, trạng thái có mô hình 3D hay chưa.
- Tìm kiếm theo tên tiếng Việt và tiếng Anh.
- Filter theo category nếu có dữ liệu.
- Click card để mở đúng trang hiện vật.
- Có empty state khi không có kết quả.

## 6.3. Artifact Detail — `/artifacts/:slug`

Đây là trang quan trọng nhất và là đích đến của QR.

Nội dung tối thiểu:

1. Breadcrumb.
2. Tên hiện vật tiếng Việt và tiếng Anh.
3. Hình ảnh gốc/tư liệu nếu đã được cung cấp.
4. Khu vực 3D Viewer lớn, nổi bật.
5. Nút View in AR.
6. Bộ chọn VI / EN / Bilingual.
7. Phần giới thiệu/about.
8. Bối cảnh, công dụng, chất liệu, cấu tạo hoặc chi tiết đặc trưng chỉ khi có tư liệu xác minh.
9. Vocabulary in Context: click thuật ngữ để mở popup/sheet giải thích.
10. Audio Guide nếu có file.
11. Nguồn tham khảo và trạng thái xác minh nội dung.
12. Related artifacts nếu có.

Yêu cầu:

- Mỗi slug mở đúng dữ liệu.
- Slug không tồn tại hiển thị trang 404 thân thiện, có đường quay lại danh mục.
- Thiếu ảnh/GLB/audio không làm trang crash.
- Nếu thiếu GLB, hiển thị placeholder rõ “Mô hình 3D đang được cập nhật / 3D model coming soon”, không tạo viewer giả.
- Có chỉ dẫn ngắn giúp khách dùng viewer: kéo để xoay, pinch/scroll để zoom.

## 6.4. 3D Viewer và AR

Dùng `@google/model-viewer` làm giải pháp chính cho MVP.

3D Viewer phải:

- Hiển thị file `.glb` từ `public/models/`.
- Có `camera-controls` và thao tác xoay/zoom.
- Có loading progress/poster.
- Có trạng thái lỗi khi file thiếu, sai định dạng hoặc không tải được.
- Có alt text mô tả mô hình.
- Không tải tất cả model nặng ngay từ homepage nếu không cần; chỉ tải model khi vào trang chi tiết tương ứng.

AR phải:

- Dùng AR modes phù hợp theo tài liệu model-viewer hiện hành, ví dụ `webxr scene-viewer quick-look` khi tương thích.
- Kích hoạt bằng hành động rõ ràng của người dùng.
- Android: có thể mở WebXR hoặc Google Scene Viewer tùy thiết bị/trình duyệt/dịch vụ AR hỗ trợ.
- iOS: có thể chuyển sang Quick Look; kiểm tra tương thích định dạng và hành vi trên thiết bị thực.
- Desktop: mặc định vẫn phải xem 3D bình thường; hiển thị thông báo lịch sự rằng AR placement cần thiết bị di động tương thích (trừ khi có thiết bị AR phù hợp được phát hiện).
- Không tuyên bố AR hỗ trợ mọi điện thoại.
- Nếu AR không khả dụng, giữ nguyên 3D Viewer và giải thích cách thử trên thiết bị tương thích.
- Không tạo một nút “AR” chỉ để trang trí. Nút phải kích hoạt đúng hành vi hoặc hiển thị lý do không khả dụng.

**Kiểm thử quan trọng:** AR có thể phụ thuộc hệ điều hành, trình duyệt, phần cứng và dịch vụ AR hệ thống. Không đánh dấu AR đã kiểm thử thành công nếu Agent chưa thử trên điện thoại tương thích thực tế. Nếu chưa có thiết bị, ghi rõ “Build đã tích hợp; chưa xác minh trên thiết bị vật lý”.

MindAR Image Tracking không bắt buộc cho MVP. Không cài và tích hợp MindAR nếu điều đó làm trễ luồng QR/3D/AR chính. Chỉ ghi hướng phát triển P2 trong tài liệu.

## 6.5. Language Switcher — VI / EN / Bilingual

Có ba chế độ:

- **VI:** hiển thị tiếng Việt.
- **EN:** hiển thị tiếng Anh.
- **Bilingual:** hiển thị hai ngôn ngữ để đối chiếu.

Yêu cầu:

- Chuyển ngôn ngữ không reload trang và không làm mất trạng thái viewer.
- Nội dung phải lấy từ JSON/data layer.
- Trên mobile, bộ chọn ngôn ngữ phải dễ chạm, không chiếm quá nhiều chiều cao.
- Khi một trường chưa có bản dịch, thông báo rõ “Bản dịch đang được cập nhật”, không tự bịa bản dịch.

## 6.6. Vocabulary Popup / Glossary

Khi người dùng bấm một thuật ngữ:

- Hiển thị từ tiếng Anh.
- IPA nếu đã được kiểm tra.
- Nghĩa tiếng Việt.
- Định nghĩa tiếng Anh đơn giản nếu có.
- Câu ví dụ liên quan đến nội dung hiện vật.
- Bản dịch câu ví dụ.
- Nút nghe phát âm nếu có audio/TTS phù hợp.
- Nút lưu vào sổ tay.

Trên desktop có thể dùng popover/side panel. Trên điện thoại nên dùng bottom sheet hoặc modal vừa màn hình, có nút đóng dễ thao tác.

Không tự tạo IPA hoặc nghĩa chuyên ngành thiếu căn cứ. Thuật ngữ văn hóa đặc thù cần ghi chú nếu không có bản dịch tương đương chính xác.

## 6.7. Vocabulary Notebook — `/learn/notebook`

Không cần tài khoản. Lưu trên thiết bị hiện tại bằng LocalStorage.

Chức năng:

- Thêm từ.
- Xóa từ.
- Đánh dấu đã học/chưa học.
- Chống lưu trùng theo vocabulary ID.
- Lọc tất cả / chưa học / đã học.
- Tìm kiếm từ.
- Có empty state và hướng dẫn cách lưu từ từ trang hiện vật.
- Có chức năng xóa toàn bộ sổ tay với bước xác nhận.
- Nếu LocalStorage không dùng được hoặc dữ liệu lỗi, hiển thị thông báo rõ và không làm crash ứng dụng.

Phải thông báo ngắn rằng sổ tay được lưu trên trình duyệt/thiết bị hiện tại, không tự đồng bộ sang điện thoại khác và có thể mất khi người dùng xóa dữ liệu trình duyệt.

## 6.8. Audio Learning

Ưu tiên file MP3 thu âm/biên tập sẵn:

- Audio thuyết minh tiếng Việt.
- Audio thuyết minh tiếng Anh.
- Có play/pause, progress và trạng thái lỗi.

Nếu chưa có file, có thể dùng Web Speech API làm phương án đọc dự phòng:

- Kiểm tra browser support.
- Chọn ngôn ngữ phù hợp `vi-VN` hoặc `en-US`/locale phù hợp nếu có.
- Có nút dừng đọc.
- Không tự động phát âm thanh khi mở trang.
- Ghi chú đây là giọng tổng hợp của trình duyệt, chất lượng/giọng đọc tùy thiết bị.

Không để nút audio chết khi thiếu file. Ẩn nút hoặc hiển thị trạng thái chưa có audio.

## 6.9. Learning Center — `/learn`

P1 nhưng nên có nếu đủ thời gian:

- Tóm tắt số từ đã lưu.
- Flashcards: từ → lật thẻ xem nghĩa, ví dụ.
- Quiz từ vựng trắc nghiệm.
- Listening quiz chỉ khi có audio phù hợp.
- Tính điểm tức thời ở phía client; không gửi dữ liệu đi đâu.
- Làm mới/retake được.

Không tuyên bố đây là hệ thống đánh giá thực nghiệm sư phạm hoàn chỉnh. Đây chỉ là chức năng luyện tập của MVP.

## 6.10. QR Generator — `/qr-codes`

Mục đích: tạo nhãn QR in ra và đặt bên cạnh hiện vật thật.

Chức năng:

- Liệt kê các hiện vật trong data.
- Tạo QR riêng từ URL chi tiết của từng hiện vật.
- Hiển thị tên VI/EN và URL đích dưới QR.
- Cho phép tải QR PNG hoặc SVG nếu thư viện hỗ trợ ổn định.
- Có nút in nhãn.
- Có thể chọn in một nhãn hoặc toàn bộ danh sách.
- Print stylesheet phải ẩn navigation, footer, nút điều khiển và chỉ in phần nhãn.

Mẫu nhãn:

- CO TU HERITAGE AR.
- Tên hiện vật tiếng Việt và tiếng Anh.
- QR Code đủ lớn, có khoảng trắng quiet zone.
- Hướng dẫn: “Quét mã để khám phá mô hình 3D và học liệu song ngữ” / “Scan to explore the 3D model and bilingual learning materials”.

Quy tắc URL:

- QR phải chứa URL tuyệt đối, ví dụ `https://your-demo.vercel.app/artifacts/guol-communal-house`.
- Ưu tiên biến môi trường `VITE_PUBLIC_BASE_URL` nếu có cấu hình.
- Nếu biến môi trường trống, dùng origin hiện tại.
- Nếu origin hiện tại là localhost, hiển thị cảnh báo nổi bật: QR này chưa dùng được từ điện thoại khác; cần deploy HTTPS hoặc cấu hình IP LAN truy cập được.
- Không bao giờ âm thầm tạo QR bằng URL localhost trong trang hướng dẫn in QR.

# 7. Responsive Design — yêu cầu bắt buộc cho điện thoại và máy tính

Sản phẩm sẽ được dùng theo hai tình huống chính:

1. **Điện thoại:** khách quét QR tại hiện vật và mở trang chi tiết.
2. **Máy tính/laptop:** ban giám khảo xem website, danh mục, nội dung học thuật và mô hình 3D trong buổi demo.

Phải thiết kế trải nghiệm riêng phù hợp từng kích thước, không chỉ thu nhỏ giao diện desktop.

## 7.1. Breakpoints kiểm thử

Ít nhất phải kiểm tra các kích thước viewport sau:

- 360 × 800: điện thoại nhỏ.
- 390 × 844: điện thoại phổ biến.
- 430 × 932: điện thoại lớn.
- 768 × 1024: tablet.
- 1024 × 768: laptop/tablet ngang.
- 1440 × 900: desktop.

Có thể dùng breakpoints Tailwind mặc định hoặc cấu hình tương đương. Không hardcode layout theo một thiết bị duy nhất.

## 7.2. Mobile UX

- Header gọn, navigation có mobile menu rõ ràng.
- Không có horizontal overflow.
- CTA và nút tương tác đủ lớn, vùng chạm mục tiêu khoảng 44 × 44 CSS px khi có thể.
- Trang chi tiết ưu tiên theo thứ tự: tên hiện vật → 3D viewer → AR button → language switcher → thông tin → vocabulary/audio.
- 3D viewer chiếm chiều rộng phù hợp, có chiều cao đủ quan sát nhưng không đẩy toàn bộ nội dung xuống quá sâu.
- Bộ chọn ngôn ngữ, audio và vocabulary thao tác tốt bằng ngón tay.
- Popup từ vựng dùng bottom sheet/modal vừa viewport, không bị bàn phím che khi có input.
- Không dùng hover làm cách tương tác duy nhất.
- QR labels có thể xem và tải/in từ điện thoại nhưng giao diện in chính vẫn tối ưu cho desktop/A4.

## 7.3. Desktop UX

- Header navigation đầy đủ.
- Homepage có bố cục editorial rõ ràng, tận dụng không gian ngang.
- Collection grid nhiều cột hợp lý.
- Trang detail có thể dùng bố cục hai cột: 3D viewer và thông tin/học liệu; không làm chữ quá hẹp.
- Vocabulary có thể hiển thị side panel hoặc popover.
- Learning Center và QR Generator trình bày rõ trên màn hình rộng.
- Hỗ trợ thao tác bàn phím, focus state và hover state phù hợp.

## 7.4. Accessibility và readability

- Tương phản màu đủ đọc.
- Font hỗ trợ tiếng Việt đầy đủ, ví dụ Inter hoặc font sans-serif có Vietnamese glyph.
- Cỡ chữ body trên mobile nên dễ đọc, tránh dưới 14px cho nội dung chính.
- Ảnh/model có alt text.
- Nút có label rõ ràng.
- Focus state nhìn thấy được.
- Không truyền đạt trạng thái chỉ bằng màu sắc.
- Tôn trọng `prefers-reduced-motion`.

# 8. Art Direction — giao diện và nhận diện

Thiết kế theo phong cách **Digital Heritage Museum / Editorial Cultural Experience**.

Định hướng:

- Trang nhã, có tính học thuật nhưng không khô cứng.
- Tông màu lấy cảm hứng từ vật liệu tự nhiên: warm ivory, sand, clay, dark wood, charcoal; một màu nhấn trầm.
- Dùng họa tiết/đường nét trang trí lấy cảm hứng từ hình học thổ cẩm ở mức tiết chế. Không tự nhận một họa tiết do AI tạo là hoa văn Cơ Tu chính thống.
- Typography nhất quán, rõ ràng và có hỗ trợ tiếng Việt.
- Ảnh hiện vật và mô hình 3D là trọng tâm.
- Animation nhẹ; ưu tiên hiệu năng và khả năng đọc.

Tránh:

- Giao diện SaaS admin dashboard ở trang public.
- Màu neon, gradient rực rỡ, glassmorphism lạm dụng.
- Font trang trí khó đọc.
- Quá nhiều card và hiệu ứng.
- Ảnh stock không liên quan bị gắn nhãn là hiện vật thật.
- Nội dung lorem ipsum hoặc văn bản giả xuất hiện như thông tin đã xác minh.

Agent cần tự đề xuất một hệ thống UI nhất quán và áp dụng xuyên suốt các trang.

# 9. Data Model và dữ liệu mẫu

Tạo TypeScript interfaces tối thiểu:

- `Artifact`
- `BilingualText`
- `ArtifactSection`
- `VocabularyItem`
- `AudioGuide`
- `QuizQuestion`
- `ArtifactCategory`
- `ContentVerificationStatus`

Gợi ý dữ liệu:

```json
{
  "id": "artifact-001",
  "slug": "guol-communal-house",
  "name": {
    "vi": "Nhà Gươl",
    "en": "Gươl Communal House"
  },
  "category": "Architecture",
  "thumbnail": "/images/guol-cover.webp",
  "originalImages": [],
  "model3D": "/models/guol.glb",
  "modelStatus": "missing",
  "contentStatus": "illustrative",
  "description": {
    "vi": "Nội dung đang được biên tập và xác minh.",
    "en": "Content is being prepared and verified."
  },
  "sections": [],
  "vocabulary": [],
  "audio": {
    "vi": null,
    "en": null
  },
  "sources": [],
  "verificationNote": "Dữ liệu minh họa; cần xác minh trước khi sử dụng chính thức."
}
```

Schema trên chỉ là ví dụ kỹ thuật. Không được suy diễn rằng mọi thông tin mô tả mẫu là dữ liệu văn hóa đã được xác minh.

## 9.1. Quy tắc nội dung

- Kiểm tra workspace để tìm tài liệu, ảnh, GLB và nội dung do người dùng cung cấp; ưu tiên nguồn này.
- Tài liệu nghiên cứu hiện có chỉ cung cấp tên đề tài, mục tiêu và mục lục; không tự suy diễn thành danh mục hiện vật chính thức.
- Không tự bịa lịch sử, nghi lễ, chất liệu, công dụng, ý nghĩa hoa văn, tên gọi hoặc tập quán Cơ Tu.
- Nếu chưa có dữ liệu được kiểm chứng, dùng nội dung ngắn có nhãn `Nội dung đang được xác minh / Content under verification`.
- Không trình bày bản dịch AI như bản dịch đã được chuyên gia xác nhận.
- Không tự tạo IPA thiếu căn cứ.
- Nếu mô hình được tạo từ ảnh 2D bằng Tripo/Meshy hoặc công cụ AI khác, ghi chú đây là mô hình tái tạo trực quan bằng AI; không tuyên bố là bản sao đo đạc chính xác hoặc phục dựng khảo cổ hoàn toàn.
- Tách thông tin đã kiểm chứng khỏi mô tả kỹ thuật của model 3D.

## 9.2. Dữ liệu demo

- Nếu workspace có 2–3 ảnh/GLB thật, ưu tiên dùng chúng.
- Nếu chưa có GLB, tạo placeholder giao diện rõ ràng; không tải một mô hình không liên quan rồi gắn nhãn là hiện vật Cơ Tu.
- Có thể tạo 2–3 record demo để kiểm thử layout, nhưng phải đánh dấu dữ liệu minh họa/chờ xác minh.
- Ghi rõ file cần người dùng bổ sung trong README và `docs/DEMO_CHECKLIST.md`.

# 10. Quy trình chuẩn bị mô hình 3D (ngoài website)

Đây là pipeline tạo tài sản, không phải backend và không nhất thiết cần tích hợp API vào website:

1. Chọn ảnh hiện vật 2D có nguồn gốc và quyền sử dụng phù hợp.
2. Dùng Tripo AI hoặc Meshy AI để tạo bản 3D từ ảnh.
3. Kiểm tra và hậu xử lý bằng Blender nếu cần: hướng mô hình, scale, pivot, mesh, texture, polygon, dung lượng.
4. Export GLB/glTF.
5. Kiểm tra GLB trong một viewer độc lập trước khi đưa lên website.
6. Đặt file vào `public/models/` và cập nhật đúng đường dẫn trong dữ liệu Artifact.
7. Kiểm tra trên điện thoại và máy tính.

Không cần gọi API Tripo/Meshy từ website. Không lưu API key trong frontend. Việc tạo model được thực hiện bên ngoài ứng dụng.

Khuyến nghị tối ưu:

- Dùng tên file dễ hiểu, chữ thường, không dấu, không khoảng trắng.
- Tối ưu texture và polygon phù hợp mobile.
- Tránh file GLB quá lớn gây tải lâu qua mạng di động.
- Duy trì bản gốc riêng, không ghi đè file nguồn.
- Có loading indicator và thông báo nếu tải model lâu/lỗi.

# 11. Cấu trúc source code gợi ý

Điều chỉnh theo workspace thực tế, không tạo project lồng nhau nếu đã có app:

```text
co-tu-heritage-ar/
├── public/
│   ├── models/
│   ├── images/
│   ├── markers/
│   └── audio/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── artifact/
│   │   ├── ar/
│   │   ├── learning/
│   │   └── qr/
│   ├── pages/
│   ├── data/
│   ├── hooks/
│   ├── services/
│   ├── repositories/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   ├── PROJECT_PLAN.md
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── TEST_REPORT.md
│   └── DEMO_CHECKLIST.md
├── .env.example
├── package.json
└── README.md
```

# 12. Cấu hình QR và public hosting

## 12.1. Biến môi trường

Tạo `.env.example`:

```env
VITE_PUBLIC_BASE_URL=
```

Không có secret trong frontend. `VITE_PUBLIC_BASE_URL` chỉ là public site URL, không phải khóa bí mật.

## 12.2. Deep linking / SPA fallback

Vì QR mở route trực tiếp như `/artifacts/guol-communal-house`, cấu hình hosting để khi người dùng mở hoặc refresh route con, hosting vẫn trả về `index.html` để React Router xử lý.

Với Vercel, kiểm tra cấu hình rewrite/fallback cần thiết cho Vite SPA. Tạo file config chỉ khi cần, không thêm rewrite dư thừa.

## 12.3. Deploy và QR thật

- QR dùng URL HTTPS đã deploy khi demo công khai.
- Không dùng `localhost` trong QR đưa cho người khác quét.
- Nếu cần test LAN, dùng IP LAN của máy dev và bảo đảm điện thoại truy cập được cùng mạng; HTTPS/AR có thể có yêu cầu riêng, vì vậy ưu tiên deployment HTTPS để test AR.
- Sau khi deploy, quét thử QR bằng ít nhất một điện thoại thật và mở trực tiếp một URL artifact bằng cách dán URL vào trình duyệt.
- Nếu asset path hoặc router lỗi trên hosting, sửa trước khi bàn giao.

# 13. Quy trình thực hiện theo phase

## Phase 0 — Inspect workspace

1. Kiểm tra cấu trúc thư mục và project hiện tại.
2. Kiểm tra package manager, scripts và dependencies.
3. Tìm ảnh, GLB, audio, marker, dữ liệu và tài liệu có sẵn.
4. Xác định code/assets có thể tái sử dụng.
5. Không xóa/ghi đè tài sản gốc.
6. Tạo `docs/PROJECT_PLAN.md` ngắn gọn và tiếp tục triển khai ngay.

## Phase 1 — Foundation & design system

1. Thiết lập React + TypeScript + Vite nếu chưa có project.
2. Cấu hình Tailwind CSS theo phiên bản tương thích.
3. Cấu hình React Router và fallback cho deep link.
4. Tạo font, color tokens, spacing, typography và shared layout.
5. Tạo data types và JSON records.
6. Tạo Header/Footer và responsive navigation.

## Phase 2 — Core public experience

1. Homepage.
2. Collection page.
3. Artifact detail theo slug.
4. 3D model viewer.
5. AR action + device fallback.
6. Language switcher VI/EN/Bilingual.
7. Vocabulary Popup.
8. LocalStorage Notebook.

## Phase 3 — QR and learning tools

1. QR Generator.
2. QR download/print stylesheet.
3. Audio player + fallback.
4. Flashcards.
5. Quiz.
6. Learning Center.

## Phase 4 — Responsive QA

1. Kiểm tra điện thoại, tablet, desktop theo viewport trong mục 7.
2. Kiểm tra keyboard, tap target, popup, navigation và horizontal overflow.
3. Kiểm tra GLB và AR behavior.
4. Kiểm tra trực tiếp bằng thiết bị nếu có.
5. Ghi rõ phần nào chỉ test mô phỏng viewport và phần nào đã test trên thiết bị thật.

## Phase 5 — Build and handover

1. Chạy lint/typecheck nếu scripts có hỗ trợ.
2. Chạy production build.
3. Sửa lỗi TypeScript, import, routing, asset path và console.
4. Kiểm tra direct route/refresh.
5. Tạo README hướng dẫn chạy, thêm hiện vật, thêm GLB và deploy.
6. Tạo TEST_REPORT và DEMO_CHECKLIST trung thực.

# 14. Tiêu chí nghiệm thu

## 14.1. Public và routing

- [ ] Không có login/register.
- [ ] Không có backend/server/database/Supabase/Firebase.
- [ ] Homepage mở được.
- [ ] Collection mở được.
- [ ] Artifact detail mở đúng slug.
- [ ] Dán trực tiếp URL artifact vào browser vẫn hoạt động.
- [ ] Refresh ở route artifact không bị 404 sau khi deploy.
- [ ] QR chứa public URL chính xác.

## 14.2. 3D và AR

- [ ] GLB hợp lệ hiển thị được.
- [ ] Xoay/zoom hoạt động trên desktop và mobile.
- [ ] Có loading, missing asset và error state.
- [ ] AR action có hành vi thực hoặc thông báo không hỗ trợ.
- [ ] Desktop vẫn có 3D viewer tốt khi AR không hỗ trợ.
- [ ] Không tuyên bố AR đã kiểm thử trên thiết bị thật nếu chưa test.

## 14.3. Học liệu

- [ ] VI/EN/Bilingual chuyển đổi chính xác theo data.
- [ ] Nội dung chưa có bản dịch được đánh dấu.
- [ ] Vocabulary popup hiển thị đúng.
- [ ] Lưu/xóa/đánh dấu từ hoạt động.
- [ ] Notebook tồn tại sau refresh trên cùng trình duyệt.
- [ ] Có thông báo dữ liệu lưu cục bộ.
- [ ] Audio không có nút chết khi thiếu file.
- [ ] Quiz chấm điểm đúng theo dữ liệu.

## 14.4. QR

- [ ] Từng hiện vật có QR riêng.
- [ ] QR dẫn tới đúng trang.
- [ ] URL dưới QR trùng với URL được mã hóa.
- [ ] Download/print hoạt động.
- [ ] Print layout chỉ in nhãn cần thiết.
- [ ] Có cảnh báo nếu QR đang chứa localhost.

## 14.5. Responsive và chất lượng

- [ ] Không có horizontal overflow trên viewport mobile.
- [ ] Không có text bị cắt hoặc overlay che nội dung.
- [ ] Nút bấm đủ lớn và dùng được bằng touch.
- [ ] Menu mobile hoạt động.
- [ ] Desktop layout tận dụng không gian tốt.
- [ ] Tablet layout không vỡ.
- [ ] Không có lỗi console nghiêm trọng trong luồng chính.
- [ ] Production build thành công.

# 15. Báo cáo và hướng dẫn bàn giao

Trong README ghi:

- Phiên bản Node.js/package manager tương thích được chọn.
- Lệnh cài dependency.
- Lệnh chạy dev server.
- Lệnh build/preview.
- Cách thêm hiện vật mới vào JSON.
- Cách thêm GLB/ảnh/audio vào public folders.
- Cách cập nhật slug và tạo QR.
- Cách cấu hình `VITE_PUBLIC_BASE_URL`.
- Cách deploy Vercel/static hosting.
- Lưu ý deep link và HTTPS.
- Giới hạn AR theo thiết bị.
- Lưu ý LocalStorage chỉ lưu trên thiết bị/trình duyệt hiện tại.

Trong `docs/TEST_REPORT.md`, phân biệt rõ:

- Passed: đã thực sự chạy/kiểm tra.
- Not tested: chưa kiểm tra được.
- Blocked: cần file/thiết bị/quyền truy cập còn thiếu.

Không đánh dấu pass dựa trên suy đoán.

Trong `docs/DEMO_CHECKLIST.md`, tạo checklist trước buổi thi: kiểm tra QR, URL public, điện thoại thật, GLB, AR, song ngữ, audio, notebook, quiz và phương án dự phòng video AR.

# 16. Quy tắc làm việc bắt buộc

1. Bắt đầu bằng kiểm tra workspace, không đoán cấu trúc.
2. Bảo toàn code/tài sản đang có; không xóa file nguồn.
3. Không hỏi lại thông tin đã có trong prompt. Với điểm còn thiếu, chọn mặc định hợp lý và ghi chú.
4. Không chỉ viết plan — phải trực tiếp code.
5. Ưu tiên P0, sau đó mới P1.
6. Không thêm backend, database, đăng nhập hoặc dịch vụ trả phí.
7. Không tạo nút giả hoặc nội dung giả như thể đã hoạt động.
8. Không bịa nội dung văn hóa Cơ Tu.
9. Không tải ảnh/mô hình stock không liên quan rồi gắn nhãn là hiện vật thật.
10. Không tự động phát âm thanh hoặc bật camera khi người dùng chưa chủ động thao tác.
11. Kiểm tra hiệu năng tải GLB trên mobile; tránh model quá nặng.
12. Sau mỗi phase lớn, chạy build hoặc kiểm tra phù hợp.
13. Nếu thiếu ảnh/GLB/audio/thiết bị AR, tạo fallback rõ ràng và ghi lại điều còn thiếu.
14. Khi kết thúc, báo cáo ngắn gọn: trang/chức năng hoàn thành, cách chạy, URL local, file cần người dùng bổ sung, các mục chưa test, cách deploy và cách demo bằng QR.

# 17. Lệnh bắt đầu cho Agent

**Bắt đầu ngay bây giờ.**

Thực hiện theo thứ tự:

1. Inspect workspace và assets có sẵn.
2. Tạo `docs/PROJECT_PLAN.md`, `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`.
3. Xây dựng ứng dụng MVP với ưu tiên P0.
4. Bổ sung P1 nếu không ảnh hưởng tính ổn định và tiến độ.
5. Chạy build, sửa lỗi và kiểm thử các luồng chính.
6. Tạo `docs/TEST_REPORT.md`, `docs/DEMO_CHECKLIST.md` và README.
7. Bàn giao một ứng dụng chạy được trong workspace.

**Không kết thúc chỉ bằng bản kế hoạch hoặc bản thiết kế. Phải triển khai source code thực tế.**

---

# Hướng dẫn sử dụng file này trong Antigravity

1. Mở đúng thư mục project muốn Antigravity chỉnh sửa.
2. Đưa file `ANTIGRAVITY_MASTER_PROMPT_CO_TU_HERITAGE_AR_V2.md` vào cuộc trò chuyện với Agent.
3. Gửi lệnh:

   > Đọc toàn bộ file `ANTIGRAVITY_MASTER_PROMPT_CO_TU_HERITAGE_AR_V2.md`. Hãy inspect workspace trước, sau đó trực tiếp triển khai MVP theo đúng phạm vi trong file. Website phải responsive cho điện thoại, tablet và desktop. Không tạo backend, database hoặc chức năng đăng nhập. Không chỉ trả lời bằng kế hoạch.

4. Sau khi có mô hình, đặt GLB vào `public/models/` và cập nhật đường dẫn trong dữ liệu hiện vật.
5. Khi deploy, cấu hình URL public HTTPS rồi tạo/in QR từ URL đó.
6. Trước ngày demo, quét QR bằng điện thoại thật và kiểm tra ít nhất một luồng AR trên thiết bị tương thích.
