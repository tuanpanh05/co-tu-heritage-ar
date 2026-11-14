import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Layers,
  GraduationCap,
  MessageSquare,
  MoreHorizontal,
  QrCode,
  BarChart3,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { feedbackService } from '../../services/feedbackService';
import { forestSoundService, BG_MUSIC_TRACKS } from '../../services/forestSoundService';
import { openSpotlightTour } from '../common/SpotlightTour';

interface MobileBottomNavProps {
  onOpenFeedbackDrawer?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenFeedbackDrawer
}) => {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const [commentCount, setCommentCount] = useState<number>(() => feedbackService.getAll().length);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [forestSoundOn, setForestSoundOn] = useState(true);
  const [trackIdx, setTrackIdx] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setCommentCount(feedbackService.getAll().length);
    };
    window.addEventListener('cotu_feedback_updated', handleUpdate);
    return () => window.removeEventListener('cotu_feedback_updated', handleUpdate);
  }, []);

  useEffect(() => {
    const unsub = forestSoundService.subscribe((enabled, _playing, idx) => {
      setForestSoundOn(enabled);
      setTrackIdx(idx);
    });
    return () => unsub();
  }, []);

  // Close more menu when changing route
  useEffect(() => {
    setShowMoreMenu(false);
  }, [location.pathname]);

  const isHomeActive = location.pathname === '/';
  const isArtifactsActive = location.pathname.startsWith('/artifacts');
  const isLearnActive = location.pathname.startsWith('/learn');
  const isDashboardActive = location.pathname.startsWith('/dashboard');
  const isQrActive = location.pathname.startsWith('/qr-codes');

  const handleOpenFeedback = () => {
    setShowMoreMenu(false);
    if (onOpenFeedbackDrawer) {
      onOpenFeedbackDrawer();
    } else {
      const el = document.getElementById('community-guestbook');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#community-guestbook';
      }
    }
  };

  return (
    <>
      {/* MORE QUICK ACTIONS BOTTOM SHEET (MODAL FOR MOBILE) */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowMoreMenu(false)}
          />

          <div className="relative w-full rounded-t-3xl bg-[#0B1510] border-t border-heritage-ochre/40 p-5 pb-8 shadow-[0_-15px_40px_rgba(0,0,0,0.85)] z-10 animate-slide-up space-y-4 text-heritage-wood">
            {/* Grab handle */}
            <div className="w-12 h-1.5 rounded-full bg-heritage-woodMuted/40 mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#23352C] pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-heritage-ochre" />
                <h3 className="font-serif font-bold text-base text-heritage-wood">
                  {t('Tiện ích & Cài đặt', 'Tools & Settings')}
                </h3>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1.5 rounded-lg text-heritage-woodMuted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of extra tools */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/dashboard"
                onClick={() => setShowMoreMenu(false)}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  isDashboardActive
                    ? 'bg-heritage-forest text-heritage-ochre border-heritage-ochre/50 font-bold'
                    : 'bg-[#101C15] text-heritage-woodLight border-[#23352C] hover:bg-[#16271E]'
                }`}
              >
                <BarChart3 className="w-5 h-5 text-heritage-ochre" />
                <div>
                  <div className="text-xs font-semibold">{t('Thống kê Bảo tàng', 'Analytics')}</div>
                  <div className="text-[10px] text-heritage-woodMuted">
                    {t('Lượt xem & tương tác', 'Views & AR metrics')}
                  </div>
                </div>
              </Link>

              <Link
                to="/qr-codes"
                onClick={() => setShowMoreMenu(false)}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  isQrActive
                    ? 'bg-heritage-forest text-heritage-ochre border-heritage-ochre/50 font-bold'
                    : 'bg-[#101C15] text-heritage-woodLight border-[#23352C] hover:bg-[#16271E]'
                }`}
              >
                <QrCode className="w-5 h-5 text-heritage-ochre" />
                <div>
                  <div className="text-xs font-semibold">{t('Nhãn QR Trưng bày', 'QR Labels')}</div>
                  <div className="text-[10px] text-heritage-woodMuted">
                    {t('In mã quét di động', 'Print exhibit codes')}
                  </div>
                </div>
              </Link>
            </div>

            {/* Tour Guide Button Row */}
            <button
              onClick={() => {
                setShowMoreMenu(false);
                openSpotlightTour();
              }}
              className="w-full p-3.5 rounded-2xl bg-[#122018] border border-heritage-ochre/30 hover:border-heritage-ochre text-heritage-wood flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-heritage-ochre/15 border border-heritage-ochre/30 flex items-center justify-center text-heritage-ochre">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-heritage-wood">
                    {t('Hướng dẫn tham quan & WebAR', 'Tour Guide & WebAR')}
                  </div>
                  <div className="text-[10px] text-heritage-woodMuted">
                    {t('Cách xoay 3D, mở AR và nghe thuyết minh', 'How to rotate 3D, use AR & audio')}
                  </div>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-heritage-ochre" />
            </button>

            {/* Ambient Sound & Language Controls Row */}
            <div className="p-3.5 rounded-2xl bg-[#0D1812] border border-[#23352C] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-heritage-ochre" />
                  <div>
                    <span className="text-xs font-semibold block text-heritage-wood">
                      {t('Âm thanh rừng núi', 'Forest Ambient')}
                    </span>
                    <span className="text-[10px] text-heritage-woodMuted truncate max-w-[180px] block">
                      {BG_MUSIC_TRACKS[trackIdx]?.titleVi}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => forestSoundService.toggle()}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    forestSoundOn
                      ? 'bg-heritage-ochre text-slate-950 shadow'
                      : 'bg-[#16251D] text-heritage-woodMuted border border-[#263C30]'
                  }`}
                >
                  {forestSoundOn ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('Đang phát', 'Playing')}</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>{t('Đã tắt', 'Muted')}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1C2C23]">
                <span className="text-xs font-semibold text-heritage-wood">
                  {t('Ngôn ngữ hiển thị', 'Language')}
                </span>
                <div className="inline-flex items-center bg-[#14231B] p-1 rounded-xl border border-[#23352C]">
                  <button
                    onClick={() => setLang('vi')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      lang === 'vi'
                        ? 'bg-heritage-ochre text-slate-950 shadow-sm'
                        : 'text-heritage-woodMuted'
                    }`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      lang === 'en'
                        ? 'bg-heritage-ochre text-slate-950 shadow-sm'
                        : 'text-heritage-woodMuted'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIXED MOBILE BOTTOM DOCK (IOS APP-LIKE TAB BAR) */}
      <nav
        data-tour="main-nav-mobile"
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#070E0B]/95 backdrop-blur-2xl border-t border-heritage-ochre/30 shadow-[0_-8px_30px_rgba(0,0,0,0.7)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5"
      >
        <div className="grid grid-cols-5 items-center justify-around px-1 max-w-lg mx-auto">
          {/* TAB 1: KHÁM PHÁ (HOME) */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isHomeActive
                ? 'text-heritage-ochre font-bold'
                : 'text-heritage-woodMuted hover:text-heritage-woodLight'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${isHomeActive ? 'bg-heritage-ochre/15' : ''}`}>
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">
              {t('Khám phá', 'Explore')}
            </span>
          </Link>

          {/* TAB 2: HIỆN VẬT 3D (COLLECTION) */}
          <Link
            to="/artifacts"
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isArtifactsActive
                ? 'text-heritage-ochre font-bold'
                : 'text-heritage-woodMuted hover:text-heritage-woodLight'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${isArtifactsActive ? 'bg-heritage-ochre/15' : ''}`}>
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">
              {t('Hiện vật', '3D Museum')}
            </span>
          </Link>

          {/* TAB 3: HỌC TẬP & QUIZ */}
          <Link
            to="/learn"
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              isLearnActive
                ? 'text-heritage-ochre font-bold'
                : 'text-heritage-woodMuted hover:text-heritage-woodLight'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${isLearnActive ? 'bg-heritage-ochre/15' : ''}`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">
              {t('Học tập', 'Learning')}
            </span>
          </Link>

          {/* TAB 4: GÓP Ý & SỔ LƯU BÚT (COMMUNITY FEEDBACK) */}
          <button
            data-tour="mobile-feedback-btn"
            onClick={handleOpenFeedback}
            className="flex flex-col items-center justify-center py-1 text-heritage-woodMuted hover:text-heritage-ochre transition-all relative group"
          >
            <div className="relative p-1 rounded-xl group-hover:bg-heritage-ochre/15">
              <MessageSquare className="w-5 h-5 text-heritage-ochre" />
              {/* Green live dot + count */}
              <span className="absolute -top-0.5 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] font-mono shadow-xs">
                {commentCount}
              </span>
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 text-heritage-ochre font-semibold">
              {t('Góp ý', 'Feedback')}
            </span>
          </button>

          {/* TAB 5: THÊM (MORE QUICK MENU) */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              showMoreMenu || isDashboardActive || isQrActive
                ? 'text-heritage-ochre font-bold'
                : 'text-heritage-woodMuted hover:text-heritage-woodLight'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${showMoreMenu ? 'bg-heritage-ochre/15' : ''}`}>
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">
              {t('Thêm', 'More')}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
