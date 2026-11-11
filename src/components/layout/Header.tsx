import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Compass,
  QrCode,
  GraduationCap,
  Layers,
  Sparkles,
  Globe,
  BarChart3,
  Music,
  Volume2,
  VolumeX,
  SkipForward
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { forestSoundService, BG_MUSIC_TRACKS } from '../../services/forestSoundService';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [forestSoundOn, setForestSoundOn] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const unsub = forestSoundService.subscribe((playing, idx) => {
      setForestSoundOn(playing);
      setTrackIdx(idx);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Trang chủ', en: 'Home', icon: Compass },
    { to: '/artifacts', label: 'Hiện vật', en: 'Artifacts', icon: Layers },
    { to: '/learn', label: 'Học tập', en: 'Learning Hub', icon: GraduationCap },
    { to: '/qr-codes', label: 'Mã QR', en: 'QR Labels', icon: QrCode },
    { to: '/dashboard', label: 'Thống kê', en: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-heritage-sand/70 transition-all shadow-[0_4px_24px_-6px_rgba(35,122,99,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3.5 group py-2 focus:outline-none rounded-2xl shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-heritage-clay to-heritage-forest flex items-center justify-center text-white shadow-md group-hover:shadow-glow group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-heritage-ivory" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-semibold tracking-tight text-heritage-wood group-hover:text-heritage-clay transition-colors font-serif">
                Cơ Tu Heritage AR
              </span>
              <span className="text-[11px] sm:text-xs text-heritage-woodMuted font-medium">
                {t('Không gian Di sản Tây Giang · Song ngữ', 'Tây Giang Heritage · Bilingual WebAR')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation + Language Toggle */}
          <div className="hidden md:flex items-center space-x-2.5">
            <nav className="flex items-center space-x-1 bg-heritage-cream/70 p-1.5 rounded-full border border-heritage-sand/80">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center space-x-1.5 px-3.5 lg:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-heritage-clay to-heritage-forest text-white shadow-sm'
                        : 'text-heritage-woodLight hover:bg-white/80 hover:text-heritage-clay'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-heritage-clay'}`} />
                    <span>{t(link.label, link.en)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Soothing Studio Background Music Toggle + Track Switcher */}
            <div className="inline-flex items-center bg-heritage-cream/80 p-1 rounded-full border border-heritage-sand/90 shadow-xs">
              <button
                onClick={() => forestSoundService.toggle()}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  forestSoundOn
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-heritage-woodLight hover:text-heritage-clay'
                }`}
                title={t(
                  `Đang chọn: ${BG_MUSIC_TRACKS[trackIdx]?.titleVi} (Bấm để Bật/Tắt)`,
                  `Current: ${BG_MUSIC_TRACKS[trackIdx]?.titleEn} (Click to Toggle)`
                )}
              >
                <Music
                  className={`w-3.5 h-3.5 ${
                    forestSoundOn ? 'text-amber-300 animate-pulse' : 'text-heritage-clay'
                  }`}
                />
                <span className="hidden xl:inline">
                  {forestSoundOn
                    ? t('Nhạc nền: Bật', 'Music: ON')
                    : t('Nhạc nền: Tắt', 'Music: OFF')}
                </span>
                {forestSoundOn ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-200" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 opacity-60" />
                )}
              </button>

              <button
                onClick={() => forestSoundService.nextTrack()}
                className="p-1.5 rounded-full text-heritage-woodLight hover:text-heritage-clay hover:bg-white/70 transition-colors ml-0.5"
                title={t('Đổi bản nhạc nền khác', 'Switch background track')}
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Global Language Switcher Pill */}
            <div
              className="inline-flex items-center bg-heritage-cream/80 p-1 rounded-full border border-heritage-sand/90 shadow-xs"
              role="group"
              aria-label={t('Chuyển đổi ngôn ngữ', 'Switch language')}
            >
              <Globe className="w-3.5 h-3.5 text-heritage-clay ml-2 mr-1 hidden lg:block" />
              <button
                onClick={() => setLang('vi')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === 'vi'
                    ? 'bg-heritage-clay text-white shadow-xs'
                    : 'text-heritage-woodLight hover:text-heritage-clay'
                }`}
                title="Tiếng Việt"
              >
                VI
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === 'en'
                    ? 'bg-heritage-clay text-white shadow-xs'
                    : 'text-heritage-woodLight hover:text-heritage-clay'
                }`}
                title="English"
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile controls: Music Toggle + Language Switcher + Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => forestSoundService.toggle()}
              className={`p-2 rounded-full border transition-all ${
                forestSoundOn
                  ? 'bg-emerald-700 text-white border-emerald-600'
                  : 'bg-heritage-cream/80 text-heritage-clay border-heritage-sand'
              }`}
              title={t('Bật/tắt nhạc nền', 'Toggle background music')}
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Compact Mobile Language Toggle */}
            <div className="inline-flex items-center bg-heritage-cream/80 p-0.5 rounded-full border border-heritage-sand">
              <button
                onClick={() => setLang('vi')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === 'vi' ? 'bg-heritage-clay text-white' : 'text-heritage-woodLight'
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === 'en' ? 'bg-heritage-clay text-white' : 'text-heritage-woodLight'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-heritage-wood bg-heritage-cream/70 hover:bg-heritage-cream border border-heritage-sand/80 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
              aria-label={mobileMenuOpen ? t('Đóng menu', 'Close menu') : t('Mở menu', 'Open menu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-heritage-sand/60 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1.5 shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium min-h-[48px] transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-heritage-clay/15 to-heritage-cream text-heritage-clay font-semibold border border-heritage-clay/25'
                    : 'text-heritage-woodLight hover:bg-heritage-cream/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-heritage-clay text-white' : 'bg-heritage-cream text-heritage-clay'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t(link.label, link.en)}</div>
                    <div className="text-xs text-heritage-woodMuted font-normal">
                      {t(link.en, link.label)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
