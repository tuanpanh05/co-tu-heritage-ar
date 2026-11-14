import { FeedbackComment } from '../types/feedback';

const STORAGE_KEY = 'cotu_heritage_public_comments_v4';
const LIKES_STORAGE_KEY = 'cotu_heritage_comment_likes_v4';

export const SEED_FEEDBACK_COMMENTS: FeedbackComment[] = [
  {
    id: 'seed-critique-01',
    authorName: 'Lê Tuấn Hùng',
    authorRole: 'Frontend Dev - Duy Tân, Cầu Giấy, Hà Nội',
    authorRoleEn: 'Frontend Developer - Cau Giay, Hanoi',
    avatarBg: 'from-amber-600 to-rose-700',
    avatarInitials: 'TH',
    badge: 'Góp ý kỹ thuật',
    badgeEn: 'Tech Feedback',
    rating: 3,
    targetArtifactSlug: 'guol-communal-house',
    targetArtifactNameVi: 'Nhà Gươl Truyền Thống',
    targetArtifactNameEn: 'Gươl Communal House',
    contentVi:
      'Giao diện và ý tưởng rất hay nhưng trên con iPhone 11 của mình lúc vừa load vào model 3D Nhà Gươl bị khựng tầm 1-2s do texture map khá nặng. Nhóm dev nên xem xét tạo mipmaps hoặc nén texture định dạng KTX2 / Basis Universal để máy tầm trung load mượt hơn nhé. Tạm cho 3 sao để team có động lực optimize thêm!',
    contentEn:
      'Great UI concept, but on my iPhone 11 the Gươl 3D model stutters for 1-2 seconds initially due to heavy textures. The dev team should consider mipmaps or KTX2/Basis Universal texture compression for smoother mid-range mobile loading. Giving 3 stars as constructive motivation to optimize!',
    timeAgoVi: '40 phút trước',
    timeAgoEn: '40 mins ago',
    timestamp: Date.now() - 40 * 60 * 1000,
    likes: 31,
    isVerified: true
  },
  {
    id: 'seed-01',
    authorName: 'Đặng Minh Tuấn',
    authorRole: 'Senior Frontend Engineer - FPT Software (Hà Nội)',
    authorRoleEn: 'Senior Frontend Engineer - Hanoi Tech Community',
    avatarBg: 'from-blue-600 to-indigo-800',
    avatarInitials: 'MT',
    badge: 'Cộng đồng Developer',
    badgeEn: 'Web Developer',
    rating: 5,
    targetArtifactSlug: 'all',
    targetArtifactNameVi: 'Toàn bộ Không gian Di sản WebAR',
    targetArtifactNameEn: 'WebAR Heritage Space',
    contentVi:
      'Thấy anh em share trong group JS Vietnam là vào test ngay! WebAR chạy trực tiếp trên trình duyệt bằng model-viewer cực kỳ mượt mà, không bắt user tải app rườm rà. Bundle tối ưu tốt, texture load trơn tru trên cả iPhone lẫn Android. 10 điểm cho team dev!',
    contentEn:
      'Saw this shared in the JS Vietnam developer community and jumped right in to test! WebAR running directly inside the mobile browser via model-viewer is super smooth without demanding native app installs. Bundle size is well-optimized and textures stream seamlessly. 10/10 for the dev team!',
    timeAgoVi: '1 giờ trước',
    timeAgoEn: '1 hour ago',
    timestamp: Date.now() - 1 * 60 * 60 * 1000,
    likes: 56,
    isVerified: true
  },
  {
    id: 'seed-critique-02',
    authorName: 'Nguyễn Minh Đức',
    authorRole: 'Dân mê du lịch - Ba Đình, Hà Nội',
    authorRoleEn: 'Travel Enthusiast - Ba Dinh, Hanoi',
    avatarBg: 'from-stone-600 to-amber-700',
    avatarInitials: 'MĐ',
    badge: 'Góp ý trải nghiệm',
    badgeEn: 'UX Feedback',
    rating: 3,
    targetArtifactSlug: 'all',
    targetArtifactNameVi: 'Toàn bộ Không gian Di sản WebAR',
    targetArtifactNameEn: 'WebAR Heritage Space',
    contentVi:
      'Nhạc nền rừng cây tiếng suối chảy lúc vừa vào web hơi to, mình đang đeo tai nghe bị giật mình luôn. Nhóm nên để volume mặc định tầm 20-30% thôi hoặc có nút hỏi trước khi phát. Với lại bảo tàng mới có 5 hiện vật, lướt một lúc là hết rồi. Mong nhóm bổ sung thêm trang phục dệt cườm và các lễ hội nữa!',
    contentEn:
      'The ambient forest stream sound is quite loud on initial page load, which startled me while wearing headphones. Please set the default volume around 20-30% or prompt before unmuting. Also, 5 artifacts feel a bit sparse—hoping to see more beaded tunics and festival items soon!',
    timeAgoVi: '2 giờ trước',
    timeAgoEn: '2 hours ago',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    likes: 24,
    isVerified: true
  },
  {
    id: 'seed-02',
    authorName: 'Hoàng Yến',
    authorRole: 'K54 Dân tộc học - ĐH KHXH&NV Hà Nội',
    authorRoleEn: 'Ethnology Researcher - USSH Hanoi',
    avatarBg: 'from-rose-600 to-amber-700',
    avatarInitials: 'HY',
    badge: 'Người dùng Hà Nội',
    badgeEn: 'Hanoi Researcher',
    rating: 5,
    targetArtifactSlug: 'ktu-traditional-drum',
    targetArtifactNameVi: 'Trống K’tu Truyền Thống',
    targetArtifactNameEn: 'K’tu Traditional Drum',
    contentVi:
      'Mình ở Hà Nội đang làm khóa luận tốt nghiệp về nhạc cụ các tộc người Trường Sơn. Tìm khắp các trang bảo tàng mới thấy trang này dựng 3D trống K’tu chuẩn đến từng đinh tre nêm mặt da trâu. Phần chú giải song ngữ Anh - Việt rất chuẩn thuật ngữ nhân học. Cực kỳ hữu ích!',
    contentEn:
      'I am based in Hanoi writing my graduation thesis on Trường Sơn indigenous instruments. This is the only digital platform where I found a 3D K’tu drum accurate down to every bamboo peg fastening the buffalo hide. The bilingual anthropological notes are spot on!',
    timeAgoVi: '3 giờ trước',
    timeAgoEn: '3 hours ago',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    likes: 41,
    isVerified: true
  },
  {
    id: 'seed-critique-03',
    authorName: 'Lucas Meyer',
    authorRole: 'Digital Nomad & Dev - Berlin / Working in Hanoi',
    authorRoleEn: 'Digital Nomad & Dev - Berlin / In Hanoi',
    avatarBg: 'from-teal-600 to-cyan-800',
    avatarInitials: 'LM',
    badge: 'Góp ý kỹ thuật',
    badgeEn: 'Tech Feedback',
    rating: 4,
    targetArtifactSlug: 'guol-communal-house',
    targetArtifactNameVi: 'Nhà Gươl Truyền Thống',
    targetArtifactNameEn: 'Gươl Communal House',
    contentVi:
      'The 3D viewer is responsive on desktop, but on mobile Safari when rotating with two fingers, the pinch-to-zoom gesture sometimes accidentally triggers the outer page scroll. Adding touch-action: pan-y or constraining orbit touches on <model-viewer> will fix this mobile annoyance.',
    contentEn:
      'The 3D viewer is responsive on desktop, but on mobile Safari when rotating with two fingers, the pinch-to-zoom gesture sometimes accidentally triggers the outer page scroll. Adding touch-action: pan-y or constraining orbit touches on <model-viewer> will fix this mobile annoyance.',
    timeAgoVi: '4 giờ trước',
    timeAgoEn: '4 hours ago',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    likes: 38,
    isVerified: true
  },
  {
    id: 'seed-03',
    authorName: 'Alexandre Dubois',
    authorRole: 'Creative Technologist - Paris / Living in Tay Ho, Hanoi',
    authorRoleEn: 'Creative Technologist - Expat in Hanoi',
    avatarBg: 'from-violet-600 to-purple-800',
    avatarInitials: 'AD',
    badge: 'Khách quốc tế (Expat)',
    badgeEn: 'International Expat',
    rating: 5,
    targetArtifactSlug: 'guol-communal-house',
    targetArtifactNameVi: 'Nhà Gươl Truyền Thống',
    targetArtifactNameEn: 'Gươl Communal House',
    contentVi:
      'As a WebGL developer currently living in Hanoi, I am genuinely impressed! Preserving traditional indigenous architecture through interactive 3D and in-browser WebXR is inspiring. The lighting simulation and wood PBR materials feel organic and grounded. Bravo!',
    contentEn:
      'As a WebGL developer currently living in Hanoi, I am genuinely impressed! Preserving traditional indigenous architecture through interactive 3D and in-browser WebXR is inspiring. The lighting simulation and wood PBR materials feel organic and grounded. Bravo!',
    timeAgoVi: '5 giờ trước',
    timeAgoEn: '5 hours ago',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    likes: 62,
    isVerified: true
  },
  {
    id: 'seed-critique-04',
    authorName: 'Phạm Quỳnh Chi',
    authorRole: 'Sinh viên năm 3 ĐH Kinh tế Quốc dân, Hà Nội',
    authorRoleEn: 'Undergraduate - NEU, Hanoi',
    avatarBg: 'from-pink-600 to-amber-700',
    avatarInitials: 'QC',
    badge: 'Người dùng Hà Nội',
    badgeEn: 'Hanoi Student',
    rating: 4,
    targetArtifactSlug: 'ktu-traditional-drum',
    targetArtifactNameVi: 'Trống K’tu Truyền Thống',
    targetArtifactNameEn: 'K’tu Traditional Drum',
    contentVi:
      'Tính năng AR quét hiện vật đặt lên sàn rất xịn, nhưng phòng trọ mình ở Cầu Giấy buổi tối hơi thiếu sáng nên camera quét một hồi lâu mới bắt được mặt phẳng. Web nên có thêm dòng tip lưu ý người dùng là “Hãy đứng ở nơi đủ ánh sáng” để những bạn mù công nghệ như mình đỡ tưởng bị lỗi camera nhé!',
    contentEn:
      'The AR floor placement is amazing, but my dorm room in Cau Giay is slightly dim in the evening so the surface scanner took a while. The site should include a small tip like "Ensure adequate lighting" so non-tech users don’t assume their camera is frozen!',
    timeAgoVi: 'Hôm qua',
    timeAgoEn: 'Yesterday',
    timestamp: Date.now() - 22 * 60 * 60 * 1000,
    likes: 27,
    isVerified: true
  },
  {
    id: 'seed-04',
    authorName: 'KS. Nguyễn Tiến Đạt',
    authorRole: '3D Technical Artist - Gameloft Vietnam',
    authorRoleEn: '3D Technical Artist - Gameloft Vietnam',
    avatarBg: 'from-emerald-600 to-cyan-800',
    avatarInitials: 'TĐ',
    badge: '3D Specialist',
    badgeEn: '3D Specialist',
    rating: 5,
    targetArtifactSlug: 'guol-communal-house',
    targetArtifactNameVi: 'Nhà Gươl Truyền Thống',
    targetArtifactNameEn: 'Gươl Communal House',
    contentVi:
      'Dưới góc nhìn 3D artist, mình đánh giá rất cao việc nhóm đã nén Draco/Meshoptimizer để giảm thiểu dung lượng file GLB mà không làm vỡ topology của mái mai rùa. Normal map thớ gỗ và chi tiết đục đẽo chim Tr’drao lên hình bắt sáng rất có chiều sâu.',
    contentEn:
      'From a 3D artist perspective, I highly appreciate the Draco/Meshoptimizer compression keeping GLB payload lean without compromising the turtle-shell roof topology. The normal maps of timber grain and chiseled bird motifs catch environment lighting with authentic depth.',
    timeAgoVi: 'Hôm qua',
    timeAgoEn: 'Yesterday',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    likes: 48,
    isVerified: true
  },
  {
    id: 'seed-critique-05',
    authorName: 'Trần Văn Toàn',
    authorRole: 'Senior QA / Tester - Hà Nội Tech Club',
    authorRoleEn: 'Senior QA Tester - Hanoi',
    avatarBg: 'from-indigo-600 to-stone-700',
    avatarInitials: 'VT',
    badge: 'Góp ý kỹ thuật',
    badgeEn: 'QA Bug Report',
    rating: 3,
    targetArtifactSlug: 'all',
    targetArtifactNameVi: 'Trải nghiệm WebAR & Học tập',
    targetArtifactNameEn: 'WebAR & Learning Hub',
    contentVi:
      'Test thử tính năng Voice Shadowing luyện phát âm ở trang Học tập thấy trên trình duyệt Edge thỉnh thoảng micro bị delay 2-3s mới nhận diện được giọng nói nếu đường truyền mạng chập chờn. Nên có thêm nút phát audio mẫu dự phòng khi Web Speech API timeout. Web tiềm năng, chúc team fix sớm!',
    contentEn:
      'Tested the Voice Shadowing module on Microsoft Edge: the mic occasionally experiences 2-3s delay before speech recognition kicks in under unstable network. Please add a fallback audio playback button if the Web Speech API times out. Great potential project, keep polishing!',
    timeAgoVi: '2 ngày trước',
    timeAgoEn: '2 days ago',
    timestamp: Date.now() - 44 * 60 * 60 * 1000,
    likes: 33,
    isVerified: true
  },
  {
    id: 'seed-05',
    authorName: 'Thầy Trần Quang Huy',
    authorRole: 'Giáo viên THPT Chu Văn An, Hà Nội',
    authorRoleEn: 'Educator - Chu Van An High School, Hanoi',
    avatarBg: 'from-amber-600 to-emerald-700',
    avatarInitials: 'QH',
    badge: 'Người dùng Hà Nội',
    badgeEn: 'Hanoi Educator',
    rating: 5,
    targetArtifactSlug: 'guol-communal-house',
    targetArtifactNameVi: 'Nhà Gươl Truyền Thống',
    targetArtifactNameEn: 'Gươl Communal House',
    contentVi:
      'Sáng nay tôi vừa chiếu thử trang web này lên màn chiếu lớn cho học sinh lớp 10 xem chuyên đề Văn hóa các dân tộc Việt Nam. Cả lớp ồ lên thích thú khi được dùng chuột xoay 360 độ và zoom sát từng thớ gỗ. Một phương pháp giáo dục số hóa trực quan tuyệt vời!',
    contentEn:
      'This morning I projected this website onto the classroom screen for our 10th-grade class studying Vietnamese ethnic cultures. The entire class gasped in excitement as they rotated the model 360 degrees and examined every timber detail. A brilliant digital educational tool!',
    timeAgoVi: '2 ngày trước',
    timeAgoEn: '2 days ago',
    timestamp: Date.now() - 48 * 60 * 60 * 1000,
    likes: 39,
    isVerified: true
  },
  {
    id: 'seed-06',
    authorName: 'Sarah Jenkins',
    authorRole: 'Digital Heritage Fellow - Oxford University / Visiting Hanoi',
    authorRoleEn: 'Digital Heritage Fellow - Oxford University',
    avatarBg: 'from-teal-600 to-blue-800',
    avatarInitials: 'SJ',
    badge: 'Khách quốc tế (Expat)',
    badgeEn: 'International Researcher',
    rating: 5,
    targetArtifactSlug: 'bahieng-woven-basket',
    targetArtifactNameVi: 'Gùi Ba-hieng Đan Lát',
    targetArtifactNameEn: 'Ba-hieng Woven Basket',
    contentVi:
      'Stumbled upon this repository via a digital humanities network. The polygon fidelity on the rattan weaves of the Ba-hieng basket, paired with the bilingual ethnographic dossier, sets a stellar benchmark for open-access museum digitization. Top tier work!',
    contentEn:
      'Stumbled upon this repository via a digital humanities network. The polygon fidelity on the rattan weaves of the Ba-hieng basket, paired with the bilingual ethnographic dossier, sets a stellar benchmark for open-access museum digitization. Top tier work!',
    timeAgoVi: '3 ngày trước',
    timeAgoEn: '3 days ago',
    timestamp: Date.now() - 72 * 60 * 60 * 1000,
    likes: 52,
    isVerified: true
  },
  {
    id: 'seed-07',
    authorName: 'Vũ Hoàng Long',
    authorRole: 'Tech Lead & WebGL Enthusiast - Hà Nội Dev Club',
    authorRoleEn: 'Tech Lead & WebGL Enthusiast - Hanoi',
    avatarBg: 'from-cyan-600 to-blue-700',
    avatarInitials: 'HL',
    badge: 'Cộng đồng Developer',
    badgeEn: 'Tech Lead',
    rating: 5,
    targetArtifactSlug: 'all',
    targetArtifactNameVi: 'Toàn bộ Không gian Di sản WebAR',
    targetArtifactNameEn: 'WebAR Heritage Space',
    contentVi:
      'Lướt code thấy kiến trúc component bằng React + TypeScript rất sạch. Việc xử lý camera-orbit với environment lighting của ModelViewer tùy biến chuẩn chỉnh. Thích nhất quả soundscape tiếng suối reo chim hót kết hợp giao diện dark-forest cực chill!',
    contentEn:
      'Inspecting the codebase, the React + TypeScript component architecture is super clean. The camera-orbit handling and environment lighting on ModelViewer are expertly customized. Especially love the ambient forest soundscape paired with the dark-forest UI theme!',
    timeAgoVi: '4 ngày trước',
    timeAgoEn: '4 days ago',
    timestamp: Date.now() - 96 * 60 * 60 * 1000,
    likes: 44,
    isVerified: true
  },
  {
    id: 'seed-08',
    authorName: 'Chị Mai Lan & Bé Tôm',
    authorRole: 'Phụ huynh học sinh - Q. Ba Đình, Hà Nội',
    authorRoleEn: 'Parent & Child - Ba Dinh, Hanoi',
    avatarBg: 'from-pink-600 to-rose-700',
    avatarInitials: 'ML',
    badge: 'Người dùng Hà Nội',
    badgeEn: 'Hanoi Family',
    rating: 5,
    targetArtifactSlug: 'ktu-traditional-drum',
    targetArtifactNameVi: 'Trống K’tu Truyền Thống',
    targetArtifactNameEn: 'K’tu Traditional Drum',
    contentVi:
      'Bé 7 tuổi nhà mình ở Hà Nội mê tít phần quét QR hiện vật! Đưa điện thoại chiếu lên sàn phòng khách là chiếc trống hiện ra to đùng ngay trước mắt, bé bấm nghe tiếng gõ trống rền vang rồi cười tít mắt. Dự án vừa công nghệ cao vừa mang ý nghĩa giáo dục sâu sắc.',
    contentEn:
      'My 7-year-old in Hanoi was thrilled by the QR AR feature! Pointing the phone at our living room floor summoned a full-scale drum right before his eyes. He tapped repeatedly to hear the acoustic beats. High-tech yet profoundly educational.',
    timeAgoVi: '5 ngày trước',
    timeAgoEn: '5 days ago',
    timestamp: Date.now() - 120 * 60 * 60 * 1000,
    likes: 35,
    isVerified: true
  },
  {
    id: 'seed-09',
    authorName: 'Trịnh Mai Linh',
    authorRole: 'Senior UI/UX Designer - Cầu Giấy, Hà Nội',
    authorRoleEn: 'Senior UI/UX Designer - Hanoi',
    avatarBg: 'from-orange-600 to-amber-700',
    avatarInitials: 'ML',
    badge: 'UI/UX Designer',
    badgeEn: 'UI/UX Designer',
    rating: 5,
    targetArtifactSlug: 'all',
    targetArtifactNameVi: 'Toàn bộ Không gian Di sản WebAR',
    targetArtifactNameEn: 'WebAR Heritage Space',
    contentVi:
      'Bảng màu kết hợp giữa tông gỗ trầm (heritage-wood), vàng hổ phách và xanh ngọc bích đại ngàn (Luminous Jade) rất sang trọng. Font chữ Lora và Be Vietnam Pro render dấu tiếng Việt rất mượt, spacing thoáng. Một trong những web văn hóa có UI đẹp nhất mình từng thấy!',
    contentEn:
      'The color palette blending deep aged timber, warm amber ochre, and deep jade is exceptionally prestigious. The typography pairing of Lora and Be Vietnam Pro renders Vietnamese diacritics smoothly with generous breathing room. One of the best cultural web UIs in Vietnam!',
    timeAgoVi: '6 ngày trước',
    timeAgoEn: '6 days ago',
    timestamp: Date.now() - 144 * 60 * 60 * 1000,
    likes: 51,
    isVerified: true
  },
  {
    id: 'seed-10',
    authorName: 'Kenji Takahashi',
    authorRole: 'Software Engineer & Digital Nomad - Tokyo, Japan',
    authorRoleEn: 'Software Engineer - Expat Nomad',
    avatarBg: 'from-indigo-600 to-blue-800',
    avatarInitials: 'KT',
    badge: 'Khách quốc tế (Expat)',
    badgeEn: 'International Developer',
    rating: 5,
    targetArtifactSlug: 'tkoor-sacred-pillar',
    targetArtifactNameVi: 'Cây Nêu Thần T’koor',
    targetArtifactNameEn: 'T’koor Sacred Pillar',
    contentVi:
      'Impressive responsive performance on mobile Safari. The AR quick-look projection of the sacred T’koor pillar rendered immediately with zero stutter. Beautiful craftsmanship both in ethnic heritage and modern frontend engineering.',
    contentEn:
      'Impressive responsive performance on mobile Safari. The AR quick-look projection of the sacred T’koor pillar rendered immediately with zero stutter. Beautiful craftsmanship both in ethnic heritage and modern frontend engineering.',
    timeAgoVi: '1 tuần trước',
    timeAgoEn: '1 week ago',
    timestamp: Date.now() - 168 * 60 * 60 * 1000,
    likes: 38,
    isVerified: true
  },
  {
    id: 'seed-11',
    authorName: 'Lê Thu Trang',
    authorRole: 'Content Creator & Travel Enthusiast - Hà Nội',
    authorRoleEn: 'Content Creator - Hanoi',
    avatarBg: 'from-pink-600 to-purple-700',
    avatarInitials: 'TT',
    badge: 'Người dùng Hà Nội',
    badgeEn: 'Hanoi Creator',
    rating: 5,
    targetArtifactSlug: 'all',
    targetArtifactNameVi: 'Toàn bộ Không gian Di sản WebAR',
    targetArtifactNameEn: 'WebAR Heritage Space',
    contentVi:
      'Là một người sống ở Hà Nội nhưng cực kỳ mê du lịch khám phá văn hóa miền Trung, mình cảm thấy web này chạm đúng trái tim. Ngồi tại phòng làm việc ở thủ đô mà đeo tai nghe vào là như được đắm mình vào giữa núi rừng đại ngàn. Đã share lên Threads và Facebook!',
    contentEn:
      'Living in Hanoi but deeply in love with central highland exploration, this website truly touched my heart. Sitting in a Hanoi office with headphones on, it feels like stepping straight into misty highland valleys. Shared with my community on Threads & Facebook!',
    timeAgoVi: '1 tuần trước',
    timeAgoEn: '1 week ago',
    timestamp: Date.now() - 180 * 60 * 60 * 1000,
    likes: 47,
    isVerified: true
  },
  {
    id: 'seed-12',
    authorName: 'Phạm Đức Anh',
    authorRole: 'Fullstack Dev - Cựu sinh viên ĐH Bách Khoa Hà Nội',
    authorRoleEn: 'Fullstack Dev - HUST Alum, Hanoi',
    avatarBg: 'from-emerald-700 to-amber-800',
    avatarInitials: 'ĐA',
    badge: 'Cộng đồng Developer',
    badgeEn: 'Fullstack Engineer',
    rating: 5,
    targetArtifactSlug: 'all',
    targetArtifactNameVi: 'Trải nghiệm WebAR & Học tập',
    targetArtifactNameEn: 'WebAR & Learning Hub',
    contentVi:
      'Trang Dashboard thống kê lượt xem với phần Quiz mini-game làm rất chỉn chu. Quả confetti nổ tung khi submit feedback này nhìn vui mắt phết anh em ơi! Web này mang đi demo sản phẩm chuyển đổi số di sản đảm bảo gây ấn tượng mạnh.',
    contentEn:
      'The visitor analytics dashboard and vocabulary challenge modules are very well put together. And the celebratory confetti blast upon submitting feedback is a delightful touch! This is an exemplary product demo for digital heritage transformation.',
    timeAgoVi: '2 tuần trước',
    timeAgoEn: '2 weeks ago',
    timestamp: Date.now() - 320 * 60 * 60 * 1000,
    likes: 43,
    isVerified: true
  }
];

export const feedbackService = {
  getAll(): FeedbackComment[] {
    try {
      const userCommentsJson = localStorage.getItem(STORAGE_KEY);
      const userComments: FeedbackComment[] = userCommentsJson ? JSON.parse(userCommentsJson) : [];
      const userLikesJson = localStorage.getItem(LIKES_STORAGE_KEY);
      const userLikes: Record<string, boolean> = userLikesJson ? JSON.parse(userLikesJson) : {};

      // Combine user comments (on top) with seed comments
      const all = [...userComments, ...SEED_FEEDBACK_COMMENTS];

      // Attach user liked status
      return all.map((c) => ({
        ...c,
        isLikedByUser: !!userLikes[c.id],
        likes: c.likes + (userLikes[c.id] && !c.isUserCreated ? 1 : 0)
      }));
    } catch (e) {
      console.warn('Lỗi khi đọc bình luận từ localStorage:', e);
      return SEED_FEEDBACK_COMMENTS;
    }
  },

  addComment(params: {
    authorName: string;
    authorRole: string;
    targetArtifactSlug?: string;
    targetArtifactNameVi?: string;
    targetArtifactNameEn?: string;
    rating: number;
    badge?: string;
    content: string;
  }): FeedbackComment {
    const initials = params.authorName
      .trim()
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(-2)
      .join('')
      .toUpperCase() || 'KH';

    const bgVariants = [
      'from-blue-600 to-indigo-800',
      'from-emerald-600 to-cyan-800',
      'from-orange-600 to-amber-700',
      'from-violet-600 to-purple-800',
      'from-rose-600 to-amber-700'
    ];
    const chosenBg = bgVariants[Math.floor(Math.random() * bgVariants.length)];

    const newComment: FeedbackComment = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      authorName: params.authorName.trim(),
      authorRole: params.authorRole.trim() || 'Người dùng Hà Nội / Tech Explorer',
      authorRoleEn: params.authorRole.trim() || 'Hanoi Tech Explorer',
      avatarBg: chosenBg,
      avatarInitials: initials,
      badge: params.badge || 'Đã đóng góp ý kiến',
      badgeEn: 'Contributor',
      rating: Math.max(1, Math.min(5, params.rating || 5)),
      targetArtifactSlug: params.targetArtifactSlug || 'all',
      targetArtifactNameVi: params.targetArtifactNameVi || 'Toàn bộ Không gian Di sản',
      targetArtifactNameEn: params.targetArtifactNameEn || 'Heritage Platform',
      contentVi: params.content.trim(),
      contentEn: params.content.trim(),
      timeAgoVi: 'Vừa xong',
      timeAgoEn: 'Just now',
      timestamp: Date.now(),
      likes: 1,
      isLikedByUser: true,
      isVerified: true,
      isUserCreated: true
    };

    try {
      const userCommentsJson = localStorage.getItem(STORAGE_KEY);
      const userComments: FeedbackComment[] = userCommentsJson ? JSON.parse(userCommentsJson) : [];
      const updated = [newComment, ...userComments];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Auto like the user's own comment
      const userLikesJson = localStorage.getItem(LIKES_STORAGE_KEY);
      const userLikes: Record<string, boolean> = userLikesJson ? JSON.parse(userLikesJson) : {};
      userLikes[newComment.id] = true;
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(userLikes));

      window.dispatchEvent(new Event('cotu_feedback_updated'));
    } catch (e) {
      console.error('Lỗi khi lưu bình luận:', e);
    }

    return newComment;
  },

  toggleLike(commentId: string): boolean {
    try {
      const userLikesJson = localStorage.getItem(LIKES_STORAGE_KEY);
      const userLikes: Record<string, boolean> = userLikesJson ? JSON.parse(userLikesJson) : {};
      const currentStatus = !!userLikes[commentId];
      const newStatus = !currentStatus;

      if (newStatus) {
        userLikes[commentId] = true;
      } else {
        delete userLikes[commentId];
      }
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(userLikes));

      // If it's a user created comment in localStorage, update its base likes
      const userCommentsJson = localStorage.getItem(STORAGE_KEY);
      if (userCommentsJson) {
        const userComments: FeedbackComment[] = JSON.parse(userCommentsJson);
        const idx = userComments.findIndex((c) => c.id === commentId);
        if (idx !== -1) {
          userComments[idx].likes = Math.max(0, userComments[idx].likes + (newStatus ? 1 : -1));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userComments));
        }
      }

      window.dispatchEvent(new Event('cotu_feedback_updated'));
      return newStatus;
    } catch (e) {
      console.error('Lỗi khi thả tim bình luận:', e);
      return false;
    }
  },

  getByArtifact(artifactSlug?: string): FeedbackComment[] {
    const all = this.getAll();
    if (!artifactSlug || artifactSlug === 'all') return all;
    return all.filter(
      (c) => c.targetArtifactSlug === artifactSlug || c.targetArtifactSlug === 'all'
    );
  }
};
