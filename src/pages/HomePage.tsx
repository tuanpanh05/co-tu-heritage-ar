import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  QrCode,
  Rotate3d,
  Smartphone,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Compass,
  MousePointerClick
} from 'lucide-react';
import { artifactService } from '../services/artifactService';
import { ArtifactCard } from '../components/artifact/ArtifactCard';
import { useLanguage } from '../contexts/LanguageContext';

export const HomePage: React.FC = () => {
  const featuredArtifacts = artifactService.getAll().slice(0, 3);
  const { t } = useLanguage();

  const steps = [
    {
      step: '01',
      titleVi: 'Quét mã QR tại hiện vật',
      titleEn: 'Scan QR Code at Exhibit',
      descVi: 'Mỗi hiện vật trưng bày thực tế có một nhãn QR riêng giúp mở ngay trang thông tin trực tuyến mà không cần cài đặt ứng dụng.',
      descEn: 'Each physical exhibit features a dedicated QR label that opens its interactive web page instantly without installing any app.',
      icon: QrCode
    },
    {
      step: '02',
      titleVi: 'Khám phá mô hình 3D',
      titleEn: 'Explore 3D Digital Twin',
      descVi: 'Xoay 360 độ, phóng to và quan sát từng chi tiết chạm khắc, thớ gỗ và kết cấu đan lát từ mọi góc nhìn.',
      descEn: 'Rotate 360°, zoom in, and inspect intricate wood carvings, timber grains, and woven rattan patterns from every angle.',
      icon: Rotate3d
    },
    {
      step: '03',
      titleVi: 'Trải nghiệm không gian AR',
      titleEn: 'Immersive WebAR Experience',
      descVi: 'Đặt mô hình 3D trực tiếp vào không gian lớp học hoặc phòng khách bằng công nghệ thực tế ảo tăng cường WebXR.',
      descEn: 'Place life-like 3D artifacts directly into your classroom or living space using WebXR augmented reality.',
      icon: Smartphone
    },
    {
      step: '04',
      titleVi: 'Học tiếng Anh CLIL',
      titleEn: 'Bilingual CLIL Learning',
      descVi: 'Học từ vựng văn hóa chuyên ngành, nghe thuyết minh song ngữ, lưu vào sổ tay cá nhân và thực hành ôn tập.',
      descEn: 'Master cultural terminology in context, listen to bilingual audio guides, save words to your notebook, and practice with quizzes.',
      icon: BookOpen
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">

      {/* HERO SECTION - Mềm mại, thoáng đãng, kết hợp cùng nền hạt sương bay tương tác */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6">

              {/* Soft Pill Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-heritage-sand shadow-sm text-heritage-clay text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-heritage-ochre" />
                <span>
                  {t(
                    'Không gian Di sản Số & Học liệu CLIL Tây Giang',
                    'Tây Giang Digital Heritage & CLIL Learning Space'
                  )}
                </span>
              </div>

              {/* Poetic Main Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-serif font-semibold text-heritage-wood leading-[1.24]">
                {t('Khám Phá Vẻ Đẹp Văn Hóa Cơ Tu Qua ', 'Discover the Beauty of Cơ Tu Heritage via ')}{' '}
                <span className="bg-gradient-to-r from-heritage-clay to-heritage-clayLight bg-clip-text text-transparent">
                  {t('Không Gian 3D/AR', 'Interactive 3D/AR')}
                </span>{' '}
                {t('& Học Liệu Song Ngữ', '& Bilingual CLIL')}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-heritage-woodMuted font-normal leading-relaxed max-w-2xl">
                {t(
                  'Hành trình số hóa trực quan các hiện vật tiêu biểu vùng núi rừng Xã Tây Giang, Thành phố Đà Nẵng, đồng hành cùng học sinh THPT trau dồi tiếng Anh chuyên đề văn hóa và tự tin thuyết minh di sản quê hương.',
                  'An interactive journey digitizing iconic cultural artifacts from the mountains of Tây Giang, empowering high school students to master cultural English and confidently present their homeland heritage to the world.'
                )}
              </p>

              {/* Soft Pill CTA Group */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/artifacts"
                  className="inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-heritage-clay to-heritage-forest hover:from-heritage-clayDark hover:to-heritage-clay text-white text-sm sm:text-base font-semibold shadow-heritage-lg hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 min-h-[48px]"
                >
                  <Compass className="w-5 h-5" />
                  <span>{t('Khám phá hiện vật', 'Explore Artifacts')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/learn"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-white/85 hover:bg-white text-heritage-wood hover:text-heritage-clay border border-heritage-sand shadow-sm text-sm sm:text-base font-semibold transition-all duration-300 min-h-[48px]"
                >
                  <GraduationCap className="w-5 h-5 text-heritage-clay" />
                  <span>{t('Trung tâm học tập CLIL', 'CLIL Learning Hub')}</span>
                </Link>

                <Link
                  to="/qr-codes"
                  className="inline-flex items-center justify-center space-x-1.5 px-5 py-3.5 rounded-full text-heritage-woodLight hover:text-heritage-clay hover:bg-white/60 text-sm font-medium transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{t('In nhãn QR', 'Print QR Labels')}</span>
                </Link>
              </div>

              {/* Interactive Hint & Privacy Notice */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-heritage-woodMuted">
                <div className="inline-flex items-center space-x-1.5 bg-white/70 px-3 py-1.5 rounded-full border border-heritage-sand/70">
                  <ShieldCheck className="w-4 h-4 text-heritage-clay shrink-0" />
                  <span>
                    {t('Truy cập mở từ QR · Không cần tài khoản', 'Instant QR Access · No Account Required')}
                  </span>
                </div>
                <div className="inline-flex items-center space-x-1.5 bg-white/70 px-3 py-1.5 rounded-full border border-heritage-sand/70">
                  <MousePointerClick className="w-4 h-4 text-heritage-ochre shrink-0" />
                  <span>
                    {t(
                      'Di chuyển chuột hoặc chạm màn hình để tương tác với hạt sương rừng',
                      'Move your cursor or touch the screen to interact with forest mist particles'
                    )}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Soft Floating Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none animate-float-slow">
                <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-heritage-clay/20 via-heritage-clayLight/15 to-amber-200/25 blur-2xl pointer-events-none" />

                <div className="relative soft-glass-card rounded-3xl p-5 sm:p-6 shadow-heritage-lg space-y-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-heritage-cream border border-heritage-sand/60">
                    <img
                      src="/images/guol-thumb.svg"
                      alt={t('Nhà Gươl Truyền Thống', 'Traditional Gươl Communal House')}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-heritage-clay text-xs font-semibold shadow-sm flex items-center space-x-1.5">
                      <Rotate3d className="w-3.5 h-3.5" />
                      <span>{t('Mô hình 3D tương tác', 'Interactive 3D Model')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-heritage-clay">
                        {t('Biểu tượng kiến trúc', 'Architectural Icon')}
                      </span>
                      <h3 className="text-lg font-serif font-semibold text-heritage-wood">
                        {t('Nhà Gươl Truyền Thống', 'Gươl Communal House')}
                      </h3>
                      <p className="text-xs text-heritage-woodMuted italic font-serif">
                        {t('Gươl Communal House · Tây Giang', 'Nhà Gươl Truyền Thống · Tây Giang')}
                      </p>
                    </div>
                    <Link
                      to="/artifacts/guol-communal-house"
                      className="px-4 py-2.5 rounded-full bg-heritage-cream hover:bg-heritage-clay text-heritage-clay hover:text-white text-xs font-semibold transition-all duration-300 flex items-center space-x-1 shadow-xs"
                    >
                      <span>{t('Xem 3D', 'View 3D')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-heritage-cream text-xs font-bold uppercase tracking-widest text-heritage-clay">
            {t('Quy trình trải nghiệm', 'How It Works')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {t('Khám Phá Di Sản Nhẹ Nhàng Trong 4 Bước', 'Explore Heritage Effortlessly in 4 Steps')}
          </h2>
          <p className="text-xs sm:text-sm text-heritage-woodMuted">
            {t(
              'Kết hợp hiện vật trưng bày thực tế cùng không gian số hóa 3D/AR trực quan trên trình duyệt.',
              'Bridging physical museum exhibits with interactive 3D/AR visualization right in your web browser.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="soft-glass-card rounded-3xl p-6 space-y-4 relative group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-heritage-cream text-heritage-clay flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-heritage-clay group-hover:to-heritage-forest group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-serif font-semibold text-2xl text-heritage-sandDark/80 group-hover:text-heritage-clay/40 transition-colors">
                    {st.step}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-semibold text-base text-heritage-wood">
                    {t(st.titleVi, st.titleEn)}
                  </h3>
                  <div className="text-[11px] text-heritage-clay font-medium italic">
                    {t(st.titleEn, st.titleVi)}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-heritage-woodMuted leading-relaxed">
                  {t(st.descVi, st.descEn)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED ARTIFACTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full bg-heritage-cream text-xs font-bold uppercase tracking-widest text-heritage-clay">
              {t('Bộ sưu tập tiêu biểu', 'Featured Collection')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-heritage-wood">
              {t('Hiện Vật Văn Hóa Cơ Tu Nổi Bật', 'Featured Cơ Tu Cultural Artifacts')}
            </h2>
            <p className="text-xs sm:text-sm text-heritage-woodMuted max-w-xl">
              {t(
                'Các biểu trưng kiến trúc, nhạc khí và nghề thủ công truyền thống mang đậm hơi thở núi rừng Tây Giang.',
                'Iconic architecture, traditional musical instruments, and woven crafts embodying the spirit of Tây Giang mountains.'
              )}
            </p>
          </div>

          <Link
            to="/artifacts"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-heritage-sand text-sm font-semibold text-heritage-clay hover:text-heritage-clayDark transition-all self-start sm:self-auto shadow-xs"
          >
            <span>{t('Xem toàn bộ danh mục', 'View All Artifacts')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredArtifacts.map((item) => (
            <ArtifactCard key={item.id} artifact={item} />
          ))}
        </div>
      </section>

      {/* CLIL EDUCATIONAL VALUE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-6 sm:p-12 bg-gradient-to-br from-white/95 via-heritage-cream/90 to-amber-50/60 backdrop-blur-xl border border-heritage-sand shadow-heritage-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-heritage-clay/10 text-heritage-clay text-xs font-semibold border border-heritage-clay/20">
              <GraduationCap className="w-4 h-4" />
              <span>{t('Định Hướng Sư Phạm CLIL', 'CLIL Pedagogical Approach')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-heritage-wood">
              {t(
                'Học Tiếng Anh Tích Hợp Nội Dung Di Sản (CLIL)',
                'Content and Language Integrated Learning (CLIL) for Heritage'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-heritage-woodLight leading-relaxed">
              {t(
                'Mô hình CLIL (Content and Language Integrated Learning) giúp học sinh vùng cao tiếp cận tiếng Anh tự nhiên qua chính những câu chuyện văn hóa và hiện vật gắn liền với buôn làng. Từ đó, các em tự tin trở thành những "Đại sứ văn hóa trẻ" giới thiệu bản sắc Cơ Tu với bạn bè quốc tế.',
                'The CLIL (Content and Language Integrated Learning) model enables highland students to acquire English naturally through authentic stories and cultural artifacts from their own villages—empowering them to become "Young Cultural Ambassadors" sharing Cơ Tu identity with the world.'
              )}
            </p>
            <div className="pt-2">
              <Link
                to="/learn"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-heritage-clay to-heritage-forest hover:from-heritage-clayDark hover:to-heritage-clay text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-glow min-h-[44px]"
              >
                <span>{t('Khám phá trung tâm học tập', 'Explore Learning Hub')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
