import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@google/model-viewer';
import {
  ArrowRight,
  QrCode,
  Rotate3d,
  Volume2,
  Compass,
  Mountain,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { artifactService } from '../services/artifactService';
import { ArtifactCard } from '../components/artifact/ArtifactCard';
import { InteractiveVillageMap } from '../components/home/InteractiveVillageMap';
import { CommunityFeedbackSection } from '../components/feedback/CommunityFeedbackSection';
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
    <div className="space-y-20 sm:space-y-32 pb-20">
      
      {/* 1. HERO SECTION: Trầm Hùng Đại Ngàn Tây Giang & Sân Khấu 3D Trực Tiếp */}
      <section className="relative pt-6 sm:pt-12 pb-10 overflow-hidden">
        {/* Dynamic Authentic Highland Ambient Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            key={activeHeroArtifact.slug}
            src={activeHeroArtifact.thumbnail || '/images/hero-highlands-bg.jpg'}
            alt={t(activeHeroArtifact.name.vi, activeHeroArtifact.name.en)}
            className="w-full h-full object-cover object-center filter blur-sm scale-105 opacity-25 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A120E]/60 via-[#0A120E]/85 to-[#0A120E]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Poetic & Dignified Mountain-Forest Narrative */}
            <div className="lg:col-span-6 space-y-7">
              
              {/* Prestigious Heritage Kicker */}
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-lg bg-[#14221A] border border-heritage-ochre/30 shadow-sm text-heritage-ochre text-xs font-mono uppercase tracking-wider">
                <Mountain className="w-3.5 h-3.5 text-heritage-ochre" />
                <span>
                  {t(
                    'Không gian Bảo tàng Số · Tây Giang, Quảng Nam',
                    'Digital Living Museum · Tây Giang Highlands'
                  )}
                </span>
              </div>

              {/* Main Headline with Gravitas & Cultural Presence */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-serif font-bold text-heritage-wood leading-[1.18] tracking-tight">
                {t('Chạm Vào Hồn Gỗ & Nhịp Rừng ', 'Touch the Forest Spirit of ')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-ochre via-[#F0C070] to-heritage-terracotta">
                  {t('Văn Hóa Cơ Tu', 'Cơ Tu Heritage')}
                </span>{' '}
                <span className="block sm:inline text-2xl sm:text-4xl lg:text-[42px] font-normal text-heritage-woodLight font-serif">
                  {t('Trong Không Gian 3D & WebAR', 'in Interactive 3D & WebAR')}
                </span>
              </h1>

              {/* Poetic & Academic Context */}
              <p className="text-base sm:text-lg text-heritage-woodLight/90 font-normal leading-relaxed max-w-xl">
                {t(
                  'Bước vào buôn làng giữa sương mây Trường Sơn: xoay ngắm từng thớ gỗ chạm khắc trên mái Nhà Gươl, cảm nhận nhịp trống da trâu K’tu trầm hùng và khám phá câu chuyện bản sắc bằng học liệu song ngữ Việt – Anh.',
                  'Step into an ancient mountain village amid Trường Sơn mists: examine hand-chiseled timber carvings of the sacred Gươl roof, feel the resonance of the K’tu drum, and explore highland ethnography in English and Vietnamese.'
                )}
              </p>

              {/* Primary Call-to-Actions */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <Link
                  to="/artifacts"
                  className="inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-heritage-ochre to-[#B67E2D] hover:from-heritage-ochreLight hover:to-heritage-ochre text-slate-950 text-sm sm:text-base font-bold shadow-heritage-lg hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 min-h-[52px]"
                >
                  <Compass className="w-5 h-5 text-slate-950 shrink-0" />
                  <span>{t('Bước vào bộ sưu tập hiện vật', 'Enter 3D Collection')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                </Link>

                <Link
                  to="/learn"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#121E18] hover:bg-[#182820] text-heritage-wood hover:text-heritage-ochre border border-[#263A2F] shadow-sm text-sm sm:text-base font-semibold transition-all duration-300 min-h-[52px]"
                >
                  <GraduationCap className="w-4 h-4 text-heritage-ochre shrink-0" />
                  <span>{t('Học tập & Flashcard 3D', 'Learning & 3D Cards')}</span>
                </Link>
              </div>

              {/* 3 Core Experience Pillars (Refined, Cultural, Crisp) */}
              <div className="pt-5 grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-[#23352C]">
                <div className="space-y-1">
                  <div className="text-xs font-serif font-semibold text-heritage-ochre flex items-center space-x-1.5">
                    <Rotate3d className="w-3.5 h-3.5 text-heritage-clayLight" />
                    <span>{t('Tương tác 3D / AR', '3D & WebAR')}</span>
                  </div>
                  <p className="text-[11px] text-heritage-woodMuted leading-snug">
                    {t('Đặt hiện vật vào không gian thực tế', 'Inspect details & place in space')}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-serif font-semibold text-heritage-ochre flex items-center space-x-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-heritage-clayLight" />
                    <span>{t('Thuyết minh bản ngữ', 'Bilingual Audio')}</span>
                  </div>
                  <p className="text-[11px] text-heritage-woodMuted leading-snug">
                    {t('Kể chuyện văn hóa làng Cơ Tu', 'Audio stories in VI & EN')}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-serif font-semibold text-heritage-ochre flex items-center space-x-1.5">
                    <QrCode className="w-3.5 h-3.5 text-heritage-clayLight" />
                    <span>{t('Nhãn QR hiện trường', 'Exhibit QR Scan')}</span>
                  </div>
                  <p className="text-[11px] text-heritage-woodMuted leading-snug">
                    {t('Quét nhãn mở ngay trên trình duyệt', 'Scan at physical exhibitions')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Sân Khấu 3D Trực Tiếp (Central Stage) */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                
                {/* Ambient Warm Hearth Glow */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-heritage-ochre/15 via-[#1E3B2E]/20 to-heritage-terracotta/10 blur-2xl pointer-events-none" />

                <div className="relative forest-stage-dark rounded-2xl p-4 sm:p-5 text-heritage-wood overflow-hidden">
                  
                  {/* Top Bar inside 3D Stage */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#0A120E]/80 backdrop-blur-md border border-heritage-ochre/30 text-xs font-mono text-heritage-ochre">
                      <span className="w-2 h-2 rounded-full bg-heritage-ochre animate-pulse" />
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
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-heritage-ochre/15 hover:bg-heritage-ochre/25 border border-heritage-ochre/40 text-heritage-ochre text-xs font-semibold transition-colors"
                      title={t('Nghe giới thiệu nhanh', 'Listen to quick intro')}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('Nghe kể', 'Listen')}</span>
                    </button>
                  </div>

                  {/* Live 3D Model Viewer */}
                  <div className="relative w-full aspect-[16/11] rounded-xl overflow-hidden bg-gradient-to-b from-[#142B20]/90 to-[#08120D] border border-[#25392F]">
                    <model-viewer
                      className="hero-viewer"
                      src={activeHeroArtifact.model3D}
                      poster={activeHeroArtifact.thumbnail}
                      alt={t(activeHeroArtifact.name.vi, activeHeroArtifact.name.en)}
                      camera-controls
                      auto-rotate
                      shadow-intensity="1.2"
                      exposure="1.0"
                      touch-action="pan-y"
                      min-camera-orbit="auto auto 15%"
                      max-camera-orbit="auto auto 350%"
                      min-field-of-view="12deg"
                      max-field-of-view="80deg"
                    />

                    {/* Gradient Overlay at Bottom of 3D Stage */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#060B08] to-transparent pointer-events-none" />

                    {/* Artifact Info Overlay */}
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between pointer-events-none">
                      <div>
                        <span className="text-[11px] uppercase tracking-widest text-heritage-ochre font-mono font-semibold block">
                          {t(
                            activeHeroArtifact.categoryName.vi,
                            activeHeroArtifact.categoryName.en
                          )}
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-heritage-wood leading-tight drop-shadow-md">
                          {t(activeHeroArtifact.name.vi, activeHeroArtifact.name.en)}
                        </h3>
                        <p className="text-xs text-heritage-woodLight/80 italic font-serif">
                          {t(activeHeroArtifact.name.en, activeHeroArtifact.name.vi)}
                        </p>
                      </div>

                      <Link
                        to={`/artifacts/${activeHeroArtifact.slug}`}
                        className="pointer-events-auto px-4 py-2 rounded-lg bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-lg"
                      >
                        <span>{t('Mở chi tiết & AR', 'Open Detail & AR')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Model Switcher: Elegant Archeological Selector */}
                  <div className="mt-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
                    <span className="text-[11px] font-mono text-heritage-woodMuted shrink-0">
                      {t('Mô hình 3D thực tế:', 'Authentic 3D Models:')}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {showcaseModels.map((item) => {
                        const isSelected = item.slug === activeHeroArtifact.slug;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveHeroSlug(item.slug)}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                              isSelected
                                ? 'bg-heritage-forest text-heritage-ochre border border-heritage-ochre/50 shadow-sm font-semibold'
                                : 'bg-[#0E1813] text-heritage-woodMuted hover:text-heritage-wood hover:bg-[#14221A] border border-[#23352C]'
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

      {/* Traditional Cơ Tu Brocade Pattern Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="cotu-pattern-divider" />
      </div>

      {/* 2. INTERACTIVE CIRCULAR VILLAGE SPATIAL & COSMOLOGICAL MAP */}
      <InteractiveVillageMap />

      {/* Traditional Cơ Tu Brocade Pattern Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="cotu-pattern-divider" />
      </div>

      {/* 3. 5 CULTURAL ARTIFACTS SHOWCASE (Rhythm, Authentic Photography, Editorial Cadence) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#23352C] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#14221A] border border-heritage-ochre/30 text-xs font-mono text-heritage-ochre">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('Di sản vật thể tiêu biểu', 'Master Tangible Heritage')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-heritage-wood">
              {t('Bộ Sưu Tập Di Sản Văn Hóa Cơ Tu Tây Giang', 'Cơ Tu Cultural Heritage 3D Collection')}
            </h2>
            <p className="text-xs sm:text-sm text-heritage-woodLight/80 max-w-2xl leading-relaxed">
              {t(
                'Từ mái Nhà Gươl sừng sững, nhịp Trống K’tu, Gùi Ba-hieng, Chiêng đồng đến Trang phục thổ cẩm nam nữ và Tượng điêu khắc Tê tê — mỗi hiện vật là một chứng tích sống động với mô hình 3D thực tế.',
                'From the soaring Gươl roof, resonant K’tu drum, Ba-hieng basket, and bronze gongs to traditional male & female brocade attire and chiseled pangolin sculptures—each artifact is digitized with authentic 3D photogrammetry models.'
              )}
            </p>
          </div>

          <Link
            to="/artifacts"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#121E18] hover:bg-[#182820] border border-[#263A2F] text-xs sm:text-sm font-semibold text-heritage-ochre transition-all self-start sm:self-auto shadow-sm"
          >
            <Layers className="w-4 h-4" />
            <span>{t('Xem toàn bộ danh mục', 'Browse Full Catalog')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Varied Editorial Grid: 1 Featured Card + 4 Companion Cards to break visual monotony */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {/* Card 1 (Nhà Gươl) takes Featured prominence */}
          {allArtifacts[0] && (
            <ArtifactCard artifact={allArtifacts[0]} featured={true} />
          )}
          {allArtifacts.slice(1).map((item) => (
            <ArtifactCard key={item.id} artifact={item} />
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE LIVING HERITAGE LEXICON & ETHNOGRAPHIC SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="forest-stage-dark rounded-2xl p-6 sm:p-10 lg:p-12 text-heritage-wood relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Context Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#0A120E]/80 border border-heritage-ochre/30 text-heritage-ochre text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-heritage-ochre" />
                <span>{t('Ngữ liệu Dân tộc học Sống động', 'Living Ethnographic Lexicon')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heritage-wood leading-snug">
                {t(
                  'Kể Chuyện Bản Làng Cơ Tu Với Bạn Bè Quốc Tế',
                  'Share Cơ Tu Village Stories with the World'
                )}
              </h2>

              <p className="text-xs sm:text-sm text-heritage-woodLight/85 leading-relaxed">
                {t(
                  'Chạm vào từng thuật ngữ để nghe phát âm tiếng Anh chuẩn mực và khám phá cách chuyển tải những nét đẹp nguyên bản của Tây Giang sang ngôn ngữ học thuật quốc tế.',
                  'Tap any cultural term to listen to authentic pronunciation and learn how highland indigenous heritage is described in international academic contexts.'
                )}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/learn"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md"
                >
                  <span>{t('Mở Thẻ Lật 3D & Trò Chơi Quiz', 'Open 3D Flashcards & Quiz')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/qr-codes"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#14221A] hover:bg-[#1A2C22] text-heritage-wood border border-[#25392F] text-xs sm:text-sm font-medium transition-all"
                >
                  <QrCode className="w-4 h-4 text-heritage-ochre" />
                  <span>{t('In nhãn QR trưng bày', 'Print Exhibit QR Labels')}</span>
                </Link>
              </div>
            </div>

            {/* Right: Interactive Vocabulary Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="group cursor-pointer rounded-xl p-4 bg-[#0D1813]/90 hover:bg-[#13221B] border border-[#23352C] hover:border-heritage-ochre/50 transition-all space-y-2 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif font-semibold text-base text-heritage-wood group-hover:text-heritage-ochre transition-colors">
                        {voc.term}
                      </h3>
                      <span className="text-[11px] font-mono text-heritage-clayLight">
                        {voc.ipa}
                      </span>
                    </div>
                    <span className="w-7 h-7 rounded-lg bg-[#182B21] group-hover:bg-heritage-ochre text-heritage-ochre group-hover:text-slate-950 flex items-center justify-center transition-colors">
                      <Volume2 className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="text-xs font-serif font-semibold text-heritage-ochre">
                    {voc.vi}
                  </div>

                  <p className="text-[11px] text-heritage-woodLight/75 italic leading-relaxed">
                    "{voc.note}"
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. COMMUNITY GUESTBOOK & PUBLIC FEEDBACK */}
      <CommunityFeedbackSection />

    </div>
  );
};
