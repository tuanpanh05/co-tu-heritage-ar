import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@google/model-viewer';
import {
  Sparkles,
  ArrowRight,
  QrCode,
  Rotate3d,
  Volume2,
  Compass,
  Mountain,
  Trees,
  Headphones,
  Layers
} from 'lucide-react';
import { artifactService } from '../services/artifactService';
import { ArtifactCard } from '../components/artifact/ArtifactCard';
import { useLanguage } from '../contexts/LanguageContext';
import { speechService } from '../services/speechService';

export const HomePage: React.FC = () => {
  const allArtifacts = artifactService.getAll();
  const showcaseModels = allArtifacts.filter((a) => a.modelStatus === 'available');
  const [activeHeroSlug, setActiveHeroSlug] = useState<string>(
    showcaseModels[0]?.slug || 'guol-communal-house'
  );
  const { lang, t } = useLanguage();

  const activeHeroArtifact =
    showcaseModels.find((a) => a.slug === activeHeroSlug) || showcaseModels[0] || allArtifacts[0];

  const handlePlayBriefAudio = (textVi: string, textEn: string) => {
    speechService.speak(lang === 'en' ? textEn : textVi, lang);
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO SECTION: Đại Ngàn Tây Giang & Sân Khấu 3D Trực Tiếp */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Poetic Mountain-Forest Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-heritage-sand shadow-xs text-heritage-clay text-xs sm:text-sm font-semibold">
                <Mountain className="w-4 h-4 text-heritage-ochre" />
                <span>
                  {t(
                    'Không gian Bảo tàng Số giữa Đại ngàn Tây Giang',
                    'Digital Living Museum of Tây Giang Highlands'
                  )}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-serif font-semibold text-heritage-wood leading-[1.22]">
                {t('Chạm Vào Hồn Gỗ & Nhịp Rừng ', 'Touch the Forest Spirit of ')}{' '}
                <span className="bg-gradient-to-r from-heritage-clay via-heritage-forest to-heritage-clayLight bg-clip-text text-transparent">
                  {t('Văn Hóa Cơ Tu', 'Cơ Tu Heritage')}
                </span>{' '}
                {t('Trong Không Gian 3D/AR', 'in Interactive 3D & AR')}
              </h1>

              <p className="text-base sm:text-lg text-heritage-woodLight/90 font-normal leading-relaxed">
                {t(
                  'Bước vào buôn làng giữa sương mù Trường Sơn: xoay ngắm từng đường chạm khắc trên mái Nhà Gươl, lắng nghe tiếng trống K’tu trầm hùng và khám phá câu chuyện di sản bằng song ngữ Việt – Anh tự nhiên.',
                  'Step into a misty Trường Sơn mountain village: rotate intricate wood carvings on the Gươl communal roof, listen to the deep K’tu drumbeat, and explore heritage stories in Vietnamese & English.'
                )}
              </p>

              {/* Primary CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/artifacts"
                  className="inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-heritage-clay to-heritage-forest hover:from-heritage-clayDark hover:to-heritage-clay text-white text-sm sm:text-base font-semibold shadow-heritage-lg hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 min-h-[48px]"
                >
                  <Compass className="w-5 h-5" />
                  <span>{t('Bước vào không gian di sản', 'Enter Heritage Collection')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/learn"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-heritage-wood hover:text-heritage-clay border border-heritage-sand shadow-xs text-sm sm:text-base font-semibold transition-all duration-300 min-h-[48px]"
                >
                  <Sparkles className="w-4 h-4 text-heritage-ochre" />
                  <span>{t('Trải nghiệm Từ vựng & Quiz', 'Vocabulary & Quiz')}</span>
                </Link>
              </div>

              {/* 3 Cultural Pillars Mini-Strip */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-heritage-sand/70">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-heritage-clay flex items-center space-x-1">
                    <Rotate3d className="w-3.5 h-3.5" />
                    <span>{t('Xoay 360° & AR', '360° 3D & WebAR')}</span>
                  </div>
                  <p className="text-[11px] text-heritage-woodMuted">
                    {t('Đặt hiện vật vào không gian thật', 'Place artifacts in real space')}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-heritage-clay flex items-center space-x-1">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>{t('Thuyết minh 2 thứ tiếng', 'Bilingual Audio')}</span>
                  </div>
                  <p className="text-[11px] text-heritage-woodMuted">
                    {t('Nghe kể chuyện văn hóa bản làng', 'Listen to village stories')}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-heritage-clay flex items-center space-x-1">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{t('Quét QR mở ngay', 'Instant QR Scan')}</span>
                  </div>
                  <p className="text-[11px] text-heritage-woodMuted">
                    {t('Không cần tải ứng dụng', 'No app installation needed')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live 3D Forest Stage (Điểm nhấn trung tâm) */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                {/* Ambient Forest Glow */}
                <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-heritage-clay/25 via-emerald-500/15 to-amber-300/20 blur-2xl pointer-events-none" />

                <div className="relative forest-stage-dark rounded-3xl p-4 sm:p-5 text-white overflow-hidden">
                  {/* Top Bar inside 3D Stage */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-emerald-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>
                        {t(
                          'Sân khấu 3D trực tiếp · Kéo chuột để xoay hiện vật',
                          'Live 3D Stage · Drag to rotate artifact'
                        )}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handlePlayBriefAudio(
                          `${activeHeroArtifact.name.vi}. ${activeHeroArtifact.brief.vi}`,
                          `${activeHeroArtifact.name.en}. ${activeHeroArtifact.brief.en}`
                        )
                      }
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/30 text-amber-200 text-xs font-semibold transition-colors"
                      title={t('Nghe giới thiệu nhanh', 'Listen to quick intro')}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('Nghe kể', 'Listen')}</span>
                    </button>
                  </div>

                  {/* Live 3D Model Viewer */}
                  <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1F4437]/80 to-[#0E221B]/90 border border-white/10">
                    <model-viewer
                      className="hero-viewer"
                      src={activeHeroArtifact.model3D}
                      poster={activeHeroArtifact.thumbnail}
                      alt={t(activeHeroArtifact.name.vi, activeHeroArtifact.name.en)}
                      camera-controls
                      auto-rotate
                      shadow-intensity="1.1"
                      exposure="1.1"
                      touch-action="pan-y"
                    />

                    {/* Subtle Mountain Silhouette Overlay at Bottom of 3D Stage */}
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0D2019] to-transparent pointer-events-none" />

                    {/* Artifact Info Overlay */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between pointer-events-none">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold block">
                          {t(
                            activeHeroArtifact.categoryName.vi,
                            activeHeroArtifact.categoryName.en
                          )}
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif font-semibold text-white leading-tight">
                          {t(activeHeroArtifact.name.vi, activeHeroArtifact.name.en)}
                        </h3>
                        <p className="text-xs text-emerald-100/80 italic font-serif">
                          {t(activeHeroArtifact.name.en, activeHeroArtifact.name.vi)}
                        </p>
                      </div>

                      <Link
                        to={`/artifacts/${activeHeroArtifact.slug}`}
                        className="pointer-events-auto px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-lg"
                      >
                        <span>{t('Mở chi tiết & AR', 'Open Detail & AR')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Model Switcher Pills */}
                  <div className="mt-3.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-1">
                    <span className="text-[11px] text-emerald-200/75 shrink-0 hidden sm:inline">
                      {t('Chọn hiện vật 3D:', 'Switch 3D model:')}
                    </span>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {showcaseModels.map((item) => {
                        const isSelected = item.slug === activeHeroArtifact.slug;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveHeroSlug(item.slug)}
                            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center space-x-1.5 ${isSelected
                              ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow-xs'
                              : 'bg-white/5 text-emerald-100/70 hover:bg-white/10 border border-white/10'
                              }`}
                          >
                            <Rotate3d className="w-3.5 h-3.5 shrink-0" />
                            <span>{t(item.name.vi, item.name.en)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle Cơ Tu Brocade Pattern Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="cotu-pattern-divider rounded-full" />
      </div>

      {/* 2. ALL 5 CULTURAL ARTIFACTS SHOWCASE (Không gian Trưng bày Bản làng) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-heritage-cream border border-heritage-sand text-xs font-semibold text-heritage-clay">
              <Trees className="w-3.5 h-3.5" />
              <span>{t('Di sản giữa rừng già', 'Heritage of the Great Forest')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
              {t('5 Biểu Trưng Văn Hóa Cơ Tu Tây Giang', '5 Iconic Cơ Tu Cultural Artifacts')}
            </h2>
            <p className="text-xs sm:text-sm text-heritage-woodMuted max-w-2xl">
              {t(
                'Từ mái Nhà Gươl sừng sững giữa trung tâm làng đến chiếc gùi Ba-hieng theo chân người lên rẫy — mỗi hiện vật là một lát cắt sống động của núi rừng.',
                'From the towering Gươl communal roof at the heart of the village to the woven Ba-hieng basket carried along mountain trails—each artifact tells a living story.'
              )}
            </p>
          </div>

          <Link
            to="/artifacts"
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-heritage-cream border border-heritage-sand text-xs sm:text-sm font-semibold text-heritage-clay transition-all self-start sm:self-auto shadow-xs"
          >
            <Layers className="w-4 h-4" />
            <span>{t('Tìm kiếm & Lọc theo chủ đề', 'Search & Filter Catalog')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {allArtifacts.map((item) => (
            <ArtifactCard key={item.id} artifact={item} />
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE CULTURAL SOUND & VOCABULARY SPOTLIGHT (Điểm nhấn tương tác nhanh) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="forest-stage-dark rounded-3xl p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('Từ điển Di sản Sống động', 'Living Heritage Lexicon')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-white leading-snug">
                {t(
                  'Kể Chuyện Bản Làng Cơ Tu Với Bạn Bè Quốc Tế',
                  'Share Cơ Tu Village Stories with the World'
                )}
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                {t(
                  'Chạm vào từng thuật ngữ dưới đây để nghe phát âm tiếng Anh chuẩn và khám phá cách giới thiệu nét đẹp quê hương Tây Giang thật tự nhiên, cuốn hút.',
                  'Tap any cultural term on the right to hear its pronunciation and see how highland heritage is expressed naturally in English.'
                )}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/learn"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md"
                >
                  <span>{t('Mở Thẻ Lật 3D & Trò Chơi Quiz', 'Open 3D Flashcards & Quiz')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/qr-codes"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs sm:text-sm font-medium transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{t('In nhãn QR trưng bày', 'Print Exhibit QR Labels')}</span>
                </Link>
              </div>
            </div>

            {/* Interactive Vocabulary Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  term: 'Communal House',
                  ipa: '/kəˈmjuː.nəl haʊs/',
                  vi: 'Nhà Gươl sinh hoạt cộng đồng',
                  note: 'The Gươl communal house is the sacred heart of every Cơ Tu village.',
                  slug: 'guol-communal-house'
                },
                {
                  term: 'Bas-relief Carving',
                  ipa: '/ˈbæ.rɪˌliːf ˈkɑː.vɪŋ/',
                  vi: 'Chạm khắc phù điêu gỗ',
                  note: 'Intricate bas-relief carvings depict forest birds and traditional dances.',
                  slug: 'guol-communal-house'
                },
                {
                  term: 'Hollowed Log Drum',
                  ipa: '/ˈhɒl.əʊd lɒɡ drʌm/',
                  vi: 'Trống K’tu đục từ thân gỗ nguyên khối',
                  note: 'Resonant drumbeats echo across the mountain valley during festivals.',
                  slug: 'ktu-traditional-drum'
                },
                {
                  term: 'Rattan Weaving',
                  ipa: '/ræˈtæn ˈwiː.vɪŋ/',
                  vi: 'Nghệ thuật đan lát mây tre',
                  note: 'Master artisans weave durable Ba-hieng baskets from wild forest rattan.',
                  slug: 'bahieng-woven-basket'
                }
              ].map((voc, idx) => (
                <div
                  key={idx}
                  onClick={() => speechService.speak(voc.term, 'en')}
                  className="group cursor-pointer rounded-2xl p-4 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-emerald-400/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif font-semibold text-base text-white group-hover:text-emerald-300 transition-colors">
                        {voc.term}
                      </h3>
                      <span className="text-[11px] font-mono text-emerald-300/90">
                        {voc.ipa}
                      </span>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 text-emerald-200 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                      <Volume2 className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-amber-200">
                    {voc.vi}
                  </div>

                  <p className="text-[11px] text-emerald-100/75 italic leading-relaxed">
                    "{voc.note}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
