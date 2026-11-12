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
  BarChart3,
  Volume2,
  VolumeX,
  SkipForward
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { forestSoundService, BG_MUSIC_TRACKS } from '../../services/forestSoundService';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [forestSoundOn, setForestSoundOn] = useState(true);
  const [trackIdx, setTrackIdx] = useState(0);
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const unsub = forestSoundService.subscribe((enabled, _actuallyPlaying, idx) => {
      setForestSoundOn(enabled);
      setTrackIdx(idx);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const primaryNavLinks = [
    { to: '/', label: 'Khám phá', en: 'Explore', icon: Compass },
    { to: '/artifacts', label: 'Hiện vật 3D', en: '3D Collection', icon: Layers },
    { to: '/learn', label: 'Học tập & Quiz', en: 'Learning Hub', icon: GraduationCap }
  ];

  const secondaryNavLinks = [
    { to: '/qr-codes', label: 'Nhãn QR', en: 'QR Labels', icon: QrCode },
    { to: '/dashboard', label: 'Thống kê', en: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B130F]/90 backdrop-blur-xl border-b border-[#25362E] transition-all shadow-[0_8px_30px_rgba(0,0,0,0.55)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand: Dignified, Museum-Grade Heritage Mark */}
          <Link
            to="/"
            className="flex items-center space-x-3 group py-2 focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3B2E] via-[#142920] to-[#0A1611] border border-heritage-ochre/30 flex items-center justify-center text-heritage-ochre shadow-lg group-hover:border-heritage-ochre/60 group-hover:shadow-glow transition-all duration-300">
              <Sparkles className="w-5 h-5 text-heritage-ochre animate-pulse-soft" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-serif font-semibold tracking-tight text-heritage-wood group-hover:text-heritage-ochre transition-colors">
                  Cơ Tu Heritage
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-heritage-ochre/15 border border-heritage-ochre/30 text-heritage-ochre hidden sm:inline-block">
                  AR
                </span>
              </div>
              <span className="text-[11px] text-heritage-woodMuted font-medium tracking-wide">
                {t('Bảo tàng số Tây Giang · WebAR', 'Tây Giang Digital Museum · WebAR')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <nav className="flex items-center space-x-1 bg-[#101A15]/80 p-1 rounded-xl border border-[#23352C]">
              {primaryNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-heritage-forest text-heritage-wood shadow-sm border border-heritage-ochre/30 text-heritage-ochre'
                        : 'text-heritage-woodLight hover:text-heritage-wood hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-heritage-ochre' : 'text-heritage-clayLight'}`} />
                    <span className={isActive ? 'font-semibold text-heritage-wood' : ''}>
                      {t(link.label, link.en)}
                    </span>
                  </Link>
                );
              })}

              {/* Secondary links dropdown/compact */}
              {secondaryNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-heritage-forest text-heritage-ochre border border-heritage-ochre/30'
                        : 'text-heritage-woodMuted hover:text-heritage-woodLight hover:bg-white/5'
                    }`}
                    title={t(link.label, link.en)}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t(link.label, link.en)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Group: Discreet Ambient Sound Bar & Minimalist Language Switcher */}
            <div className="flex items-center space-x-3">
              
              {/* Discreet Ambient Forest & Flute Audio Controller */}
              <div
                data-music-control="true"
                className="inline-flex items-center bg-[#101A15]/90 px-2 py-1.5 rounded-xl border border-[#23352C] shadow-sm"
              >
                <button
                  onClick={() => forestSoundService.toggle()}
                  className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    forestSoundOn
                      ? 'text-heritage-ochre hover:text-heritage-ochreLight'
                      : 'text-heritage-woodMuted hover:text-heritage-woodLight opacity-70'
                  }`}
                  title={t(
                    `Âm thanh đại ngàn: ${BG_MUSIC_TRACKS[trackIdx]?.titleVi} (Bấm để Bật/Tắt)`,
                    `Highland Ambient: ${BG_MUSIC_TRACKS[trackIdx]?.titleEn} (Click to Toggle)`
                  )}
                >
                  {forestSoundOn ? (
                    <div className="flex items-end space-x-0.5 h-3.5">
                      <span className="w-0.5 h-2 bg-heritage-ochre rounded-full animate-pulse" />
                      <span className="w-0.5 h-3.5 bg-heritage-ochre rounded-full animate-pulse delay-75" />
                      <span className="w-0.5 h-1.5 bg-heritage-ochre rounded-full animate-pulse delay-150" />
                    </div>
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[11px] font-mono tracking-tight hidden lg:inline">
                    {forestSoundOn ? t('Âm thanh', 'Ambient') : t('Tắt âm', 'Mute')}
                  </span>
                </button>

                {forestSoundOn && (
                  <button
                    onClick={() => forestSoundService.nextTrack()}
                    className="p-1 rounded text-heritage-woodMuted hover:text-heritage-ochre transition-colors ml-0.5"
                    title={t('Đổi giai điệu khác', 'Next ambient track')}
                  >
                    <SkipForward className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Minimalist Language Switcher VI | EN */}
              <div
                className="inline-flex items-center bg-[#101A15]/90 p-1 rounded-xl border border-[#23352C]"
                role="group"
                aria-label={t('Chuyển đổi ngôn ngữ', 'Switch language')}
              >
                <button
                  onClick={() => setLang('vi')}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                    lang === 'vi'
                      ? 'bg-heritage-ochre text-slate-950 font-bold shadow-xs'
                      : 'text-heritage-woodMuted hover:text-heritage-wood'
                  }`}
                  title="Tiếng Việt"
                >
                  VI
                </button>
                <span className="text-heritage-sandDark text-xs px-0.5">/</span>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                    lang === 'en'
                      ? 'bg-heritage-ochre text-slate-950 font-bold shadow-xs'
                      : 'text-heritage-woodMuted hover:text-heritage-wood'
                  }`}
                  title="English"
                >
                  EN
                </button>
              </div>

            </div>
          </div>

          {/* Mobile controls: Compact Audio + Language Switcher + Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              data-music-control="true"
              onClick={() => forestSoundService.toggle()}
              className={`p-2 rounded-xl border transition-all ${
                forestSoundOn
                  ? 'bg-heritage-forest text-heritage-ochre border-heritage-ochre/40'
                  : 'bg-[#101A15] text-heritage-woodMuted border-[#23352C]'
              }`}
              title={t('Bật/tắt âm thanh đại ngàn', 'Toggle ambient audio')}
            >
              {forestSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Mobile Language Toggle */}
            <div className="inline-flex items-center bg-[#101A15] p-1 rounded-xl border border-[#23352C]">
              <button
                onClick={() => setLang('vi')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'vi' ? 'bg-heritage-ochre text-slate-950' : 'text-heritage-woodMuted'
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  lang === 'en' ? 'bg-heritage-ochre text-slate-950' : 'text-heritage-woodMuted'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-heritage-wood bg-[#101A15] hover:bg-[#16241D] border border-[#23352C] min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
              aria-label={mobileMenuOpen ? t('Đóng menu', 'Close menu') : t('Mở menu', 'Open menu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-heritage-ochre" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#23352C] bg-[#0A120E]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {[...primaryNavLinks, ...secondaryNavLinks].map((link) => {
            const Icon = link.icon;
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-heritage-forest text-heritage-wood border border-heritage-ochre/30 shadow-md'
                    : 'text-heritage-woodLight hover:bg-[#142019]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-heritage-ochre text-slate-950' : 'bg-[#142019] text-heritage-clayLight'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-sm ${isActive ? 'font-semibold text-heritage-wood' : 'font-medium'}`}>
                      {t(link.label, link.en)}
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
