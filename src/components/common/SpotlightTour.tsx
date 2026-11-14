import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Volume2,
  Globe,
  MessageSquare,
  ChevronRight,
  Check,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const TOUR_STORAGE_KEY = 'cotu_heritage_spotlight_tour_done_v1';

interface TourStep {
  id: string;
  selector: string;
  titleVi: string;
  titleEn: string;
  contentVi: string;
  contentEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'main-nav',
    selector: '[data-tour="main-nav-desktop"], [data-tour="main-nav-mobile"]',
    titleVi: 'Thanh điều hướng chính',
    titleEn: 'Main navigation',
    contentVi: 'Chuyển đổi nhanh giữa Khám phá trang chủ, Bộ sưu tập Hiện vật 3D, Học tập & Quiz di sản.',
    contentEn: 'Quickly navigate between Explore, 3D Collection, and the Learning & Quiz hub.',
    icon: Compass
  },
  {
    id: 'lang-switch',
    selector: '[data-tour="lang-toggle-desktop"], [data-tour="lang-toggle-mobile"]',
    titleVi: 'Chuyển đổi ngôn ngữ',
    titleEn: 'Language switch',
    contentVi: 'Bấm vào đây để chuyển đổi tức thì giữa Tiếng Việt và English.',
    contentEn: 'Tap here to switch between Vietnamese and English anytime.',
    icon: Globe
  },
  {
    id: 'forest-sound',
    selector: '[data-tour="sound-toggle-desktop"], [data-tour="sound-toggle-mobile"]',
    titleVi: 'Âm thanh đại ngàn',
    titleEn: 'Forest sound',
    contentVi: 'Bật/tắt tiếng suối reo và giai điệu sáo Cơ Tu khi tham quan.',
    contentEn: 'Toggle ambient forest flute and flowing stream sounds.',
    icon: Volume2
  },
  {
    id: 'feedback-entry',
    selector: '[data-tour="feedback-pill"], [data-tour="mobile-feedback-btn"]',
    titleVi: 'Sổ lưu bút & Góp ý',
    titleEn: 'Community feedback',
    contentVi: 'Xem cảm nhận của mọi người và gửi góp ý trực tiếp của bạn lên web!',
    contentEn: 'Read visitor reviews and share your own feedback publicly!',
    icon: MessageSquare
  }
];

export const SpotlightTour: React.FC = () => {
  const { lang, t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Check if first-time visitor
  useEffect(() => {
    try {
      const isDone = localStorage.getItem(TOUR_STORAGE_KEY);
      if (!isDone) {
        const timer = setTimeout(() => {
          setIsActive(true);
          setCurrentStepIdx(0);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen for custom trigger to re-run tour anytime
  useEffect(() => {
    const handleReopen = () => {
      setCurrentStepIdx(0);
      setIsActive(true);
    };
    window.addEventListener('cotu_open_spotlight_tour', handleReopen);
    return () => window.removeEventListener('cotu_open_spotlight_tour', handleReopen);
  }, []);

  // Update target rect
  const updateTargetRect = useCallback(() => {
    if (!isActive) return;
    const step = TOUR_STEPS[currentStepIdx];
    if (!step) return;

    const elements = document.querySelectorAll(step.selector);
    let visibleEl: HTMLElement | null = null;
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLElement;
      if (el.offsetParent !== null || el.getBoundingClientRect().width > 0) {
        visibleEl = el;
        break;
      }
    }

    if (visibleEl) {
      setTargetRect(visibleEl.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [isActive, currentStepIdx]);

  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStepIdx];
    if (step) {
      const elements = document.querySelectorAll(step.selector);
      let visibleEl: HTMLElement | null = null;
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
        if (el.offsetParent !== null || el.getBoundingClientRect().width > 0) {
          visibleEl = el;
          break;
        }
      }

      if (visibleEl) {
        visibleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // Continuously update during smooth scroll
    const onTick = () => {
      updateTargetRect();
      animFrameRef.current = requestAnimationFrame(onTick);
    };
    animFrameRef.current = requestAnimationFrame(onTick);

    const timer = setTimeout(() => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }, 800);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearTimeout(timer);
    };
  }, [isActive, currentStepIdx, updateTargetRect]);

  // Recalculate on scroll / resize
  useEffect(() => {
    if (!isActive) return;
    const handleRecalc = () => updateTargetRect();
    window.addEventListener('resize', handleRecalc);
    window.addEventListener('scroll', handleRecalc, { passive: true });
    return () => {
      window.removeEventListener('resize', handleRecalc);
      window.removeEventListener('scroll', handleRecalc);
    };
  }, [isActive, updateTargetRect]);

  const handleNext = () => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setIsActive(false);

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#D49B45', '#38A17E', '#C25336', '#F5EFE6']
      });
    } catch {
      // ignore
    }
  };

  const handleSkip = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setIsActive(false);
  };

  if (!isActive) return null;

  const currentStep = TOUR_STEPS[currentStepIdx];
  const StepIcon = currentStep?.icon || Globe;
  const isLast = currentStepIdx === TOUR_STEPS.length - 1;

  // ═══════════════════════════════════════════════════════
  // TOÁN HỌC ĐỊNH VỊ CHÍNH XÁC 100% KHÔNG BAO GIỜ BỊ LỆCH
  // ═══════════════════════════════════════════════════════
  const tooltipWidth = Math.min(290, window.innerWidth - 32);
  let cardLeft = 16;
  let cardTop: number | undefined = undefined;
  let cardBottom: number | undefined = undefined;
  let arrowLeft = tooltipWidth / 2;
  let arrowPosition: 'top' | 'bottom' = 'top';

  if (targetRect) {
    const targetCenterX = targetRect.left + targetRect.width / 2;

    // Centered horizontally around target element, but clamped within screen
    const rawCardLeft = targetCenterX - tooltipWidth / 2;
    cardLeft = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, rawCardLeft));

    // Arrow X relative to card: points DEAD CENTER to targetCenterX
    const rawArrowX = targetCenterX - cardLeft;
    arrowLeft = Math.max(16, Math.min(tooltipWidth - 16, rawArrowX));

    // Vertical placement
    const spaceBelow = window.innerHeight - targetRect.bottom;
    if (spaceBelow >= 180 || targetRect.top < 140) {
      // Place BELOW target
      cardTop = targetRect.bottom + 12;
      arrowPosition = 'top';
    } else {
      // Place ABOVE target
      cardBottom = window.innerHeight - targetRect.top + 12;
      arrowPosition = 'bottom';
    }
  } else {
    // Fallback centered
    cardLeft = (window.innerWidth - tooltipWidth) / 2;
    cardTop = 80;
  }

  return (
    <div className="fixed inset-0 z-[9990] select-none pointer-events-auto">
      
      {/* 1. MÀN MỜ VỪA PHẢI (50% Black) - Vẫn thấy được giao diện website */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[1px] transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* 2. KHUNG CHIẾU ĐÈN SPOTLIGHT CHÍNH XÁC VÀO NÚT BẤM */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: `${Math.max(0, targetRect.top - 4)}px`,
            left: `${Math.max(0, targetRect.left - 4)}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            borderRadius: '14px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55), 0 0 20px rgba(212, 155, 69, 0.85), inset 0 0 8px rgba(212, 155, 69, 0.4)',
            border: '2px solid #D49B45',
            pointerEvents: 'none',
            zIndex: 9995,
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          <span className="absolute -inset-1 rounded-xl border border-heritage-ochre animate-ping opacity-40 pointer-events-none" />
        </div>
      )}

      {/* 3. TOOLTIP CARD NHỎ GỌN VỚI MŨI TÊN CHỈ ĐÚNG TÂM NÚT */}
      <div
        style={{
          position: 'fixed',
          left: `${cardLeft}px`,
          top: cardTop !== undefined ? `${cardTop}px` : undefined,
          bottom: cardBottom !== undefined ? `${cardBottom}px` : undefined,
          width: `${tooltipWidth}px`,
          zIndex: 9999
        }}
        className="animate-slide-up"
      >
        <div className="relative rounded-2xl bg-[#0B1510] border border-heritage-ochre/60 p-3.5 sm:p-4 text-heritage-wood shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl space-y-2.5">
          
          {/* Mũi tên chỉ đúng tâm nút (chính xác đến từng pixel) */}
          {arrowPosition === 'top' && (
            <div
              style={{ left: `${arrowLeft}px` }}
              className="absolute -top-1.5 -translate-x-1/2 w-3.5 h-3.5 bg-[#0B1510] border-t border-l border-heritage-ochre/60 rotate-45"
            />
          )}
          {arrowPosition === 'bottom' && (
            <div
              style={{ left: `${arrowLeft}px` }}
              className="absolute -bottom-1.5 -translate-x-1/2 w-3.5 h-3.5 bg-[#0B1510] border-b border-r border-heritage-ochre/60 rotate-45"
            />
          )}

          {/* Header nhỏ */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1E3025]">
            <div className="flex items-center space-x-1.5">
              <div className="w-5 h-5 rounded-md bg-heritage-ochre/20 text-heritage-ochre flex items-center justify-center">
                <StepIcon className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-heritage-ochre">
                {currentStepIdx + 1} / {TOUR_STEPS.length}
              </span>
            </div>

            <button
              onClick={handleSkip}
              className="text-heritage-woodMuted hover:text-white p-0.5 text-[11px] font-mono flex items-center gap-0.5 transition-colors"
              title={t('Bỏ qua', 'Skip')}
            >
              <span>{t('Bỏ qua', 'Skip')}</span>
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Nội dung ngắn gọn, súc tích */}
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-heritage-wood">
              {lang === 'en' ? currentStep.titleEn : currentStep.titleVi}
            </h4>
            <p className="text-[11px] sm:text-xs text-heritage-woodLight/85 leading-relaxed">
              {lang === 'en' ? currentStep.contentEn : currentStep.contentVi}
            </p>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-1">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === currentStepIdx ? 'w-3.5 bg-heritage-ochre' : 'w-1 bg-[#25392F]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-lg bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs font-bold transition-all flex items-center space-x-1 shadow-sm active:scale-95"
            >
              {isLast ? (
                <>
                  <span>{t('Đã hiểu · Xong!', 'Got it · Done!')}</span>
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </>
              ) : (
                <>
                  <span>{t('Đã hiểu 👉', 'Got it 👉')}</span>
                  <ChevronRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export const openSpotlightTour = () => {
  window.dispatchEvent(new CustomEvent('cotu_open_spotlight_tour'));
};
