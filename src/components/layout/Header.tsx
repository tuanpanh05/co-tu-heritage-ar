import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Compass, 
  BookMarked, 
  QrCode, 
  GraduationCap, 
  Layers,
  Sparkles
} from 'lucide-react';
import { notebookService } from '../../services/notebookService';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    const updateCount = () => {
      setSavedCount(notebookService.getAll().length);
    };
    updateCount();
    window.addEventListener('cotu_notebook_updated', updateCount);
    return () => window.removeEventListener('cotu_notebook_updated', updateCount);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Trang chủ', en: 'Home', icon: Compass },
    { to: '/artifacts', label: 'Hiện vật', en: 'Artifacts', icon: Layers },
    { to: '/learn', label: 'Học tập', en: 'Learning Hub', icon: GraduationCap },
    { 
      to: '/learn/notebook', 
      label: 'Sổ tay từ vựng', 
      en: 'Vocabulary', 
      icon: BookMarked,
      badge: savedCount > 0 ? savedCount : null
    },
    { to: '/qr-codes', label: 'In mã QR', en: 'QR Labels', icon: QrCode }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-xl border-b border-heritage-sand/70 transition-all shadow-[0_4px_24px_-6px_rgba(35,122,99,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-3.5 group py-2 focus:outline-none rounded-2xl"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-heritage-clay to-heritage-forest flex items-center justify-center text-white shadow-md group-hover:shadow-glow group-hover:scale-105 transition-all duration-300">
              <Sparkles className="w-5 h-5 text-heritage-ivory" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-semibold tracking-tight text-heritage-wood group-hover:text-heritage-clay transition-colors font-serif">
                Cơ Tu Heritage AR
              </span>
              <span className="text-[11px] sm:text-xs text-heritage-woodMuted font-medium">
                Không gian Di sản Tây Giang · Song ngữ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Soft Pill Bar */}
          <nav className="hidden md:flex items-center space-x-1 bg-heritage-cream/70 p-1.5 rounded-full border border-heritage-sand/80">
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
                  className={`relative flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-heritage-clay to-heritage-forest text-white shadow-sm'
                      : 'text-heritage-woodLight hover:bg-white/80 hover:text-heritage-clay'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-heritage-clay'}`} />
                  <span>{link.label}</span>
                  {link.badge !== null && link.badge !== undefined && (
                    <span className={`ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full leading-none ${
                      isActive ? 'bg-white text-heritage-clay' : 'bg-heritage-clay text-white'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {savedCount > 0 && (
              <Link
                to="/learn/notebook"
                className="relative p-2.5 text-heritage-wood bg-heritage-cream/80 rounded-full border border-heritage-sand"
                title="Sổ tay từ vựng"
              >
                <BookMarked className="w-5 h-5 text-heritage-clay" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-heritage-clay text-white rounded-full">
                  {savedCount}
                </span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-heritage-wood bg-heritage-cream/70 hover:bg-heritage-cream border border-heritage-sand/80 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
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
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-heritage-clay text-white' : 'bg-heritage-cream text-heritage-clay'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{link.label}</div>
                    <div className="text-xs text-heritage-woodMuted font-normal">{link.en}</div>
                  </div>
                </div>
                {link.badge !== null && link.badge !== undefined && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-heritage-clay text-white rounded-full">
                    {link.badge} từ
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
