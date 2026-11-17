import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Clock
} from 'lucide-react';
import { artifactService } from '../services/artifactService';
import { contentService, WebsiteContentRecord } from '../services/contentService';
import { Artifact } from '../types';
import { ArtifactCard } from '../components/artifact/ArtifactCard';
import { InteractiveVillageMap } from '../components/home/InteractiveVillageMap';
import { CommunityFeedbackSection } from '../components/feedback/CommunityFeedbackSection';
import { useLanguage } from '../contexts/LanguageContext';
import { speechService } from '../services/speechService';
import { heritageSoundService } from '../services/heritageSoundService';
import { openContemplationModal } from '../components/common/ContemplationModal';
import { ElderVoiceVignette } from '../components/artifact/ElderVoiceVignette';

export const HomePage: React.FC = () => {
  const [allArtifacts, setAllArtifacts] = useState<Artifact[]>(artifactService.getAll());
  const [contentMap, setContentMap] = useState<Record<string, WebsiteContentRecord>>({});
  const [, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const showcaseModels = allArtifacts.filter((a) => a.modelStatus === 'available');
  const [activeHeroSlug, setActiveHeroSlug] = useState<string>(
    showcaseModels[0]?.slug || 'guol-communal-house'
  );
  const { t } = useLanguage();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedArtifacts, fetchedContents] = await Promise.all([
        artifactService.fetchAll(),
        contentService.getAll()
      ]);
      setAllArtifacts(fetchedArtifacts);
      setContentMap(fetchedContents);
      if (fetchedArtifacts.length > 0 && !fetchedArtifacts.some((a) => a.slug === activeHeroSlug)) {
        setActiveHeroSlug(fetchedArtifacts[0].slug);
      }
    } catch (err: any) {
      console.warn('[HomePage] Failed to fetch live data:', err);
      setError('Không thể đồng bộ dữ liệu trực tuyến. Đang dùng dữ liệu lưu tạm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeHeroArtifact =
    showcaseModels.find((a) => a.slug === activeHeroSlug) || showcaseModels[0] || allArtifacts[0];

  const handleModelSwitch = (slug: string) => {
    heritageSoundService.playWoodClick();
    setActiveHeroSlug(slug);
  };

  const handleEnterVillage = () => {
    heritageSoundService.playWoodClick();
    const el = document.getElementById('artifacts-collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroContent = contentMap.home_hero;
  const collectionContent = contentMap.home_collection_intro;
  const lexiconContent = contentMap.home_lexicon_intro;

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* ═══════════════════════════════════════════════════
          1. BƯỚC VÀO (ENTER): Tò Mò + Choáng Nhẹ
          Sương rừng Trường Sơn, nhà Gươi hiện ra từ từ
      ═══════════════════════════════════════════════════ */}
      <section className="relative pt-6 sm:pt-14 pb-12 overflow-hidden">
        {/* Dynamic Authentic Highland Ambient Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            key={activeHeroArtifact.slug}
            src={activeHeroArtifact.thumbnail || heroContent?.image_path || '/images/hero-highlands-bg.jpg'}
            alt={t(activeHeroArtifact.name.vi, activeHeroArtifact.name.en)}
            className="w-full h-full object-cover object-center filter blur-md scale-105 opacity-20 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E1712]/70 via-[#0E1712]/90 to-[#0E1712]" />
          <div className="absolute inset-0 thin-forest-mist opacity-60" />
          <div className="absolute inset-0 dappled-forest-light opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-amber-950/40 border border-amber-600/30 text-amber-300 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={loadData}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-amber-600/20 hover:bg-amber-600/30 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Thử lại</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Poetic & Dignified Narrative (Ít chữ, nhiều dư âm) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Prestigious Mountain Kicker */}
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-lg bg-[#14231B] border border-heritage-ochre/30 shadow-xs text-heritage-ochre text-xs font-serif tracking-wide">
                <Mountain className="w-3.5 h-3.5 text-heritage-ochre" />
                <span>
                  {t(
                    'Không gian Di sản Sống · Sớm mai trên đỉnh Trường Sơn',
                    'Living Heritage Space · Morning Mists of Trường Sơn'
                  )}
                </span>
              </div>

              {/* Main Headline: Deep, Soulful, Human */}
              <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-serif font-bold text-heritage-wood leading-[1.2] tracking-tight">
                {t('Gửi Lại Mai Sau Nếp Nhà Gươl ', 'Carving Memory into Sacred Timber: ')}{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-heritage-ochre via-[#DEAA5C] to-heritage-terracotta">
                  {t('Giữa Khói Sương Trường Sơn', 'Cơ Tu Highland Heritage')}
                </span>
              </h1>

              {/* Evocative Narrative Text (Không giải thích máy móc, gợi mở cảm xúc) */}
              <p className="text-base sm:text-lg text-heritage-woodLight/90 font-serif leading-relaxed max-w-xl">
                {heroContent
                  ? t(heroContent.content_vi || '', heroContent.content_en || '')
                  : t(
                      'Sớm mai ở Tây Giang, sương chưa kịp tan trên những thớ gỗ kiền kiền. Nơi người Cơ Tu gửi gắm hồn thiêng vào từng nhát rìu đẽo mộc, từng nhịp trống da trâu, trước khi thời gian kịp làm phai mờ.',
                      'At dawn in Tây Giang, morning mists linger over weathered kiền-kiền timber. Here, the Cơ Tu carve ancestral reverence into every hewn beam and drumbeat, before time quietly sweeps memories away.'
                    )}
              </p>

              {/* Call-to-Actions: Restrained & Respectful */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <button
                  onClick={handleEnterVillage}
                  className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-lg bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-sm sm:text-base font-serif font-bold shadow-heritage hover:shadow-hearth transition-all duration-300 min-h-[50px]"
                >
                  <Compass className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>{t('Bước vào buôn làng', 'Enter the Village')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    heritageSoundService.playGongShimmer();
                    openContemplationModal(activeHeroArtifact.slug);
                  }}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-[#14231B] hover:bg-[#1A2C22] text-heritage-ochre border border-heritage-ochre/40 shadow-xs text-sm sm:text-base font-serif font-semibold transition-all duration-300 min-h-[50px]"
                >
                  <Sparkles className="w-4 h-4 text-heritage-ochre shrink-0" />
                  <span>{t('Chế độ Lắng nghe · Nhìn & Cảm', 'Sanctuary Mode')}</span>
                </button>
              </div>

              {/* 3 Core Experience Pillars (Emotional & Cultural) */}
              <div className="pt-5 grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-[#25382E]">
                <div className="space-y-1">
                  <div className="text-xs font-serif font-semibold text-heritage-ochre flex items-center space-x-1.5">
                    <Rotate3d className="w-3.5 h-3.5 text-heritage-clayLight" />
                    <span>{t('Thớ gỗ & Nhát đẽo', 'Timber & Chisel')}</span>
                  </div>
                  <p className="text-[11px] text-heritage-woodMuted leading-snug">
                    {t('Mô hình 3D scan thực tế từng thớ gỗ', 'Real photogrammetry 3D models')}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-serif font-semibold text-heritage-ochre flex items-center space-x-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-heritage-clayLight" />
                    <span>{t('Tiếng người bản làng', 'Elder Voices')}</span>
                  </div>
                  <p className="text-[11px] text-heritage-woodMuted leading-snug">
                    {t('Giọng người thật kể chuyện đời thường', 'Real spoken memories of elders')}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-serif font-semibold text-heritage-ochre flex items-center space-x-1.5">
                    <QrCode className="w-3.5 h-3.5 text-heritage-clayLight" />
                    <span>{t('Chứng tích sống động', 'Living Relics')}</span>
                  </div>
                  <p className="text-[11px] text-heritage-woodMuted leading-snug">
                    {t('Đặt hiện vật vào không gian thực WebAR', 'Project into your physical room')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Sân Khấu 3D Trực Tiếp (Central Stage) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative mx-auto max-w-xl lg:max-w-none">
                
                {/* Ambient Warm Hearth Glow */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-heritage-ochre/10 via-[#1E3B2E]/15 to-heritage-terracotta/10 blur-2xl pointer-events-none" />

                <div className="relative forest-stage-dark rounded-xl p-4 sm:p-5 text-heritage-wood overflow-hidden border border-[#25382E]">
                  
                  {/* Top Bar inside 3D Stage */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#0E1712]/90 border border-heritage-ochre/30 text-xs font-serif text-heritage-ochre">
                      <span className="w-2 h-2 rounded-full bg-heritage-ochre animate-pulse" />
                      <span>
                        {t(
                          'Sân khấu 3D trực tiếp · Chạm xoay để ngắm thớ gỗ',
                          'Live 3D Stage · Rotate to inspect timber'
                        )}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        heritageSoundService.playGongShimmer();
                        openContemplationModal(activeHeroArtifact.slug);
                      }}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-heritage-ochre/15 hover:bg-heritage-ochre/25 border border-heritage-ochre/40 text-heritage-ochre text-xs font-serif transition-colors"
                      title={t('Mở chế độ lắng nghe toàn màn hình', 'Enter Sanctuary Mode')}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('Lắng nghe', 'Listen')}</span>
                    </button>
                  </div>

                  {/* Live 3D Model Viewer */}
                  <div className="relative w-full aspect-[16/11] rounded-lg overflow-hidden bg-gradient-to-b from-[#162D22]/90 to-[#0A120E] border border-[#25382E]">
                    <model-viewer
                      className="hero-viewer"
                      src={activeHeroArtifact.model3D}
                      poster={activeHeroArtifact.thumbnail}
                      alt={t(activeHeroArtifact.name.vi, activeHeroArtifact.name.en)}
                      camera-controls
                      auto-rotate
                      auto-rotate-delay="1000"
                      rotation-per-second="10deg"
                      shadow-intensity="1.2"
                      exposure="1.0"
                      touch-action="pan-y"
                      min-camera-orbit="auto auto 15%"
                      max-camera-orbit="auto auto 350%"
                      min-field-of-view="12deg"
                      max-field-of-view="80deg"
                    />

                    {/* Gradient Overlay at Bottom of 3D Stage */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#09100C] to-transparent pointer-events-none" />

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
                        className="pointer-events-auto px-4 py-2 rounded-lg bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs font-serif font-bold transition-all flex items-center space-x-1.5 shadow-md"
                      >
                        <span>{t('Chi tiết & AR', 'Detail & AR')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Model Switcher: Tactile Wood Buttons */}
                  <div className="mt-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-1">
                    <span className="text-[11px] font-serif text-heritage-woodMuted shrink-0">
                      {t('Mô hình 3D thực tế:', 'Authentic 3D Models:')}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {showcaseModels.map((item) => {
                        const isSelected = item.slug === activeHeroArtifact.slug;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleModelSwitch(item.slug)}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-serif transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                              isSelected
                                ? 'bg-heritage-forest text-heritage-ochre border border-heritage-ochre/50 shadow-xs font-semibold'
                                : 'bg-[#0E1712] text-heritage-woodMuted hover:text-heritage-wood hover:bg-[#14231B] border border-[#25382E]'
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

              {/* Giọng người thật ngắn (15-25s) kể chuyện đời thường của hiện vật đang ngắm */}
              <ElderVoiceVignette artifactSlug={activeHeroArtifact.slug} />
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          KHOẢNG LẶNG CÓ CHỦ ĐÍCH #1: Hơi Thở Của Đại Ngàn
          (Deliberate Pause - Nơi cảm xúc bắt đầu lắng đọng)
      ═══════════════════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-6 py-4 text-center space-y-3">
        <div className="w-12 h-0.5 bg-heritage-ochre/40 mx-auto" />
        <blockquote className="font-serif italic text-base sm:text-xl text-heritage-woodLight/90 leading-relaxed">
          {t(
            '“Rừng còn, người Cơ Tu còn. Nước suối còn chảy, ngọn lửa nhà Gươl chưa bao giờ tắt.”',
            '“As long as the forest stands, the Cơ Tu endure. As long as mountain streams flow, the Gươl hearth never goes cold.”'
          )}
        </blockquote>
        <cite className="block text-xs font-serif text-heritage-ochre/80 not-italic">
          {t(
            '— Lời truyền dạy của các già làng Tây Giang qua bao thế hệ',
            '— Ancestral wisdom passed down by Tây Giang elders'
          )}
        </cite>
      </section>

      {/* Traditional Cơ Tu Brocade Pattern Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="cotu-pattern-divider" />
      </div>

      {/* ═══════════════════════════════════════════════════
          2. Ở LẠI (STAY): Ấm Áp + Tôn Trọng
          Bản đồ vũ trụ đồng tâm & triết lý không gian làng
      ═══════════════════════════════════════════════════ */}
      <InteractiveVillageMap />

      {/* Traditional Cơ Tu Brocade Pattern Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="cotu-pattern-divider" />
      </div>

      {/* ═══════════════════════════════════════════════════
          3. HIỂU SÂU (DEEP UNDERSTANDING): Tiếc Nuối Nhẹ + Trân Trọng
          5 Hiện vật tiêu biểu & Vẻ đẹp mong manh của ký ức
      ═══════════════════════════════════════════════════ */}
      <section id="artifacts-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#25382E] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#14231B] border border-heritage-ochre/30 text-xs font-serif text-heritage-ochre">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('Chứng tích ngàn năm giữa đại ngàn', 'Master Tangible Heritage')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-heritage-wood">
              {collectionContent
                ? t(collectionContent.title_vi || '', collectionContent.title_en || '')
                : t('Năm Hiện Vật Văn Hóa Tiêu Biểu', 'Tangible Heritage of Tây Giang')}
            </h2>
            <p className="text-xs sm:text-sm text-heritage-woodLight/80 max-w-2xl leading-relaxed font-serif">
              {collectionContent
                ? t(collectionContent.content_vi || '', collectionContent.content_en || '')
                : t(
                    'Mỗi vết nứt trên thân gỗ, mỗi sợi mây rừng sẫm màu khói bếp đều kể một câu chuyện về sự bền bỉ của con người trước thời gian.',
                    'Every weathered grain on timber, every rattan fiber smoked by hearth fires tells a quiet story of human endurance through time.'
                  )}
            </p>
          </div>

          <Link
            to="/artifacts"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#14231B] hover:bg-[#1A2C22] border border-[#25382E] text-xs sm:text-sm font-serif font-semibold text-heritage-ochre transition-all self-start sm:self-auto shadow-xs"
          >
            <Layers className="w-4 h-4" />
            <span>{t('Xem toàn bộ danh mục', 'Browse Full Catalog')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Varied Editorial Grid: 1 Featured Card + Companion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {allArtifacts[0] && (
            <ArtifactCard artifact={allArtifacts[0]} featured={true} />
          )}
          {allArtifacts.slice(1).map((item) => (
            <ArtifactCard key={item.id} artifact={item} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ĐỐI LẬP NHẸ: Đẹp Nhưng Mong Manh · Ấm Nhưng Xa
          Những thứ đang mất dần nhưng không bi lụy
      ═══════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="forest-stage-dark rounded-xl p-6 sm:p-10 border border-[#25382E] relative overflow-hidden">
          <div className="max-w-3xl space-y-4 mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#0E1712] border border-heritage-ochre/30 text-xs font-serif text-heritage-ochre">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('Ký ức & Thời gian', 'Memory & Time')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heritage-wood">
              {t(
                'Những Gì Đang Còn, Và Những Gì Sắp Thành Ký Ức...',
                'What Endures, and What Slowly Becomes Memory...'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-heritage-woodLight/85 font-serif leading-relaxed">
              {t(
                'Di sản không mất đi trong một ngày. Nó lặng lẽ phai mờ khi một người già nhắm mắt, khi một sợi mây đứt không còn ai nối lại, khi tiếng trống thưa dần sau những mùa trăng.',
                'Heritage does not vanish overnight. It quietly fades when an elder passes, when a broken rattan strand finds no weaver, when the drumbeat thins across mountain moons.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Memory Card 1: Gùi Ba-hieng */}
            <div className="p-5 rounded-lg bg-[#0E1712]/90 border border-[#25382E] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-heritage-ochre uppercase tracking-wider block">
                  {t('Nghề đan lát mây tre', 'Rattan Weaving')}
                </span>
                <h3 className="font-serif font-bold text-base text-heritage-wood">
                  {t('Chiếc Gùi Ba Ngăn (Ba-hieng)', 'The Ba-hieng Basket')}
                </h3>
                <p className="text-xs text-heritage-woodLight/80 font-serif italic leading-relaxed">
                  {t(
                    '“Cả bản giờ chỉ còn hai người già biết đan. Mây rừng phải đi ba ngày đường mới tìm được sợi dẻo. Khi đôi mắt người già mờ dần, kỹ thuật đan ba ngăn độc bản này có nguy cơ chỉ còn trong ảnh chụp.”',
                    '“In our village, only two elders still know the three-compartment weave. Forest rattan takes three days to gather. As old eyes dim, this rare art risks existing only in photos.”'
                  )}
                </p>
              </div>
              <div className="pt-2 border-t border-[#1C2C23] text-[11px] font-serif text-heritage-woodMuted">
                {t('Thôn Pơr’ning · Tây Giang', 'Pơr’ning Village · Tây Giang')}
              </div>
            </div>

            {/* Memory Card 2: Trống K'tu */}
            <div className="p-5 rounded-lg bg-[#0E1712]/90 border border-[#25382E] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-heritage-ochre uppercase tracking-wider block">
                  {t('Nhạc khí trầm hùng', 'Highland Percussion')}
                </span>
                <h3 className="font-serif font-bold text-base text-heritage-wood">
                  {t('Nhịp Trống Da Trâu K’tu', 'The K’tu Buffalo Drum')}
                </h3>
                <p className="text-xs text-heritage-woodLight/80 font-serif italic leading-relaxed">
                  {t(
                    '“Để có chiếc trống tốt, cần thân gỗ rỗng trăm tuổi và da trâu phơi sương. Tiếng trống từng làm rung chuyển cả cánh rừng, nay chỉ thưa thớt ngân lên trong những ngày hội lớn.”',
                    '“A good drum requires a century-old hollowed log and sun-cured buffalo hide. Its deep pulse once shook the valleys, now echoes rarely between long festival cycles.”'
                  )}
                </p>
              </div>
              <div className="pt-2 border-t border-[#1C2C23] text-[11px] font-serif text-heritage-woodMuted">
                {t('Xã A Tiêng · Tây Giang', 'A Tiêng Commune · Tây Giang')}
              </div>
            </div>

            {/* Memory Card 3: Thổ cẩm zút cườm */}
            <div className="p-5 rounded-lg bg-[#0E1712]/90 border border-[#25382E] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-heritage-ochre uppercase tracking-wider block">
                  {t('Nghệ thuật dệt vải', 'Brocade Weaving')}
                </span>
                <h3 className="font-serif font-bold text-base text-heritage-wood">
                  {t('Tấm Váy Dệt Zút Cườm Trắng', 'Beaded Brocade Skirt')}
                </h3>
                <p className="text-xs text-heritage-woodLight/80 font-serif italic leading-relaxed">
                  {t(
                    '“Mỗi tấm váy cần đến 6 tháng cặm cụi xỏ từng hạt cườm chì bên bếp lửa bập bùng. Những người phụ nữ Cơ Tu dệt cả tình yêu và lòng kiên nhẫn, trước khi trang phục hiện đại dần thay thế.”',
                    '“Each skirt takes six patient months threading lead beads beside smoky fires. Cơ Tu women weave love and devotion into every strand, before modern fabrics replace them.”'
                  )}
                </p>
              </div>
              <div className="pt-2 border-t border-[#1C2C23] text-[11px] font-serif text-heritage-woodMuted">
                {t('Thôn Bh’rôồng · Tây Giang', 'Bh’rôồng Village · Tây Giang')}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Traditional Cơ Tu Brocade Pattern Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="cotu-pattern-divider" />
      </div>

      {/* 4. NGỮ LIỆU DÂN TỘC HỌC (LIVING ETHNOGRAPHIC LEXICON) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="forest-stage-dark rounded-xl p-6 sm:p-10 text-heritage-wood relative overflow-hidden border border-[#25382E]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Context Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#0E1712] border border-heritage-ochre/30 text-heritage-ochre text-xs font-serif uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-heritage-ochre" />
                <span>{t('Ngữ liệu Dân tộc học Sống động', 'Living Ethnographic Lexicon')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heritage-wood leading-snug">
                {lexiconContent
                  ? t(lexiconContent.title_vi || '', lexiconContent.title_en || '')
                  : t(
                      'Kể Chuyện Bản Làng Cơ Tu Với Bạn Bè Quốc Tế',
                      'Share Cơ Tu Village Stories with the World'
                    )}
              </h2>

              <p className="text-xs sm:text-sm text-heritage-woodLight/85 font-serif leading-relaxed">
                {lexiconContent
                  ? t(lexiconContent.content_vi || '', lexiconContent.content_en || '')
                  : t(
                      'Chạm vào từng thuật ngữ để nghe phát âm tiếng Anh chuẩn mực và khám phá cách chuyển tải những nét đẹp nguyên bản của Tây Giang sang ngôn ngữ học thuật quốc tế.',
                      'Tap any cultural term to listen to authentic pronunciation and learn how highland indigenous heritage is described in international academic contexts.'
                    )}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/learn"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-serif font-bold transition-all shadow-md"
                >
                  <span>{t('Mở Thẻ Lật 3D & Trò Chơi Quiz', 'Open 3D Flashcards & Quiz')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/qr-codes"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-[#14231B] hover:bg-[#1A2C22] text-heritage-wood border border-[#25382E] text-xs sm:text-sm font-serif font-medium transition-all"
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
                  onClick={() => {
                    heritageSoundService.playWoodClick();
                    speechService.speak(voc.term, 'en');
                  }}
                  className="group cursor-pointer rounded-lg p-4 bg-[#0E1712]/90 hover:bg-[#14231B] border border-[#25382E] hover:border-heritage-ochre/50 transition-all space-y-2 shadow-xs"
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
                    <span className="w-7 h-7 rounded-md bg-[#16291F] group-hover:bg-heritage-ochre text-heritage-ochre group-hover:text-slate-950 flex items-center justify-center transition-colors">
                      <Volume2 className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="text-xs font-serif font-semibold text-heritage-ochre">
                    {voc.vi}
                  </div>

                  <p className="text-[11px] text-heritage-woodLight/75 italic leading-relaxed font-serif">
                    "{voc.note}"
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. KẾT THÚC (CONCLUDE): Bình Yên + Dư Âm
          Khoảng lặng cuối trang, không CTA lớn, chỉ âm thanh tiếp tục
      ═══════════════════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-6 py-8 text-center space-y-4">
        <div className="w-10 h-0.5 bg-heritage-ochre/40 mx-auto" />
        <p className="font-serif italic text-sm sm:text-base text-heritage-woodLight/80 leading-relaxed max-w-xl mx-auto">
          {t(
            'Khi màn sương buông xuống trên đỉnh Đỗ Quyên, tiếng trống K’tu vẫn âm vang trong lòng đất mẹ. Dù bạn ở đâu, mảnh đất Tây Giang vẫn luôn đợi ngày bạn ghé thăm.',
            'As twilight descends upon Mount Đỗ Quyên, the rhythm of the K’tu drum echoes deep within mother earth. Wherever you wander, Tây Giang awaits your visit.'
          )}
        </p>
        <span className="inline-block text-[11px] font-serif text-heritage-ochre/70 tracking-widest uppercase">
          Tây Giang · Quảng Nam
        </span>
      </section>

      {/* 5. SỔ LƯU BÚT BUÔN LÀNG & CẢM NHẬN CỘNG ĐỒNG */}
      <CommunityFeedbackSection />

    </div>
  );
};
