import React, { useState, useEffect, useRef } from 'react';
import '@google/model-viewer';
import { Volume2, VolumeX, X } from 'lucide-react';
import { Artifact } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { forestSoundService } from '../../services/forestSoundService';
import { heritageSoundService } from '../../services/heritageSoundService';

interface ContemplationModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifacts: Artifact[];
  initialSlug?: string;
}

export const openContemplationModal = (slug?: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cotu_open_contemplation', { detail: { slug } }));
  }
};

export const ContemplationModal: React.FC<ContemplationModalProps> = ({
  isOpen,
  onClose,
  artifacts,
  initialSlug = 'guol-communal-house'
}) => {
  const { t } = useLanguage();
  const [activeSlug, setActiveSlug] = useState<string>(initialSlug);
  const [ambientAudioOn, setAmbientAudioOn] = useState<boolean>(true);
  const [showPoem, setShowPoem] = useState<boolean>(true);
  const pulseIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (initialSlug) {
      setActiveSlug(initialSlug);
    }
  }, [initialSlug]);

  useEffect(() => {
    if (!isOpen) {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
      return;
    }

    // Khi mở Chế độ Lắng nghe: Ngân một hồi chuông cồng chiêng nhẹ ban đầu
    heritageSoundService.playGongShimmer();

    // Cứ mỗi 18 giây, phát nhịp thở đại ngàn rất khẽ (deep drum pulse)
    pulseIntervalRef.current = setInterval(() => {
      heritageSoundService.playDrumPulse(0.12);
    }, 18000);

    // Dòng chữ thơ mộng tự động ẩn đi sau 9 giây để nhường trọn không gian cho sự tĩnh lặng
    const poemTimer = setTimeout(() => {
      setShowPoem(false);
    }, 9000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(pulseIntervalRef.current);
      clearTimeout(poemTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentArtifact =
    artifacts.find((a) => a.slug === activeSlug) || artifacts[0];

  return (
    <div
      className="fixed inset-0 z-[100000] bg-[#0A130E] text-heritage-wood flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden animate-fade-in"
      style={{
        background: 'radial-gradient(circle at 50% 35%, #183025 0%, #101E17 48%, #09110D 100%)'
      }}
    >
      {/* 1. Lớp khói sương và ánh nắng mờ ảo */}
      <div className="absolute inset-0 pointer-events-none thin-forest-mist opacity-80" />
      <div className="absolute inset-0 pointer-events-none dappled-forest-light opacity-70" />

      {/* 2. Thanh điều hướng tối giản trên cùng */}
      <header className="relative z-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-heritage-ochre/80 animate-pulse" />
          <span className="text-xs sm:text-sm font-serif tracking-widest uppercase text-heritage-ochre/90">
            {t('Chế độ Lắng nghe · Đại ngàn Tây Giang', 'Sanctuary Mode · Tây Giang Highlands')}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Nút bật/tắt âm thanh */}
          <button
            onClick={() => {
              const state = forestSoundService.toggle();
              setAmbientAudioOn(state);
            }}
            className="p-2.5 rounded-lg bg-[#14231B]/70 border border-[#25392F] text-heritage-woodLight hover:text-heritage-ochre transition-colors"
            title={t('Âm thanh rừng', 'Forest ambient')}
          >
            {ambientAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Nút trở lại */}
          <button
            onClick={() => {
              heritageSoundService.playWoodClick();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#14231B]/80 hover:bg-[#1A2C22] border border-heritage-ochre/30 text-heritage-wood hover:text-heritage-ochre text-xs font-serif transition-all"
          >
            <span>{t('Trở lại', 'Return')}</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Trung tâm: Mô hình 3D xoay chậm trong làn sương mỏng */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center my-4">
        <div className="relative w-full max-w-3xl aspect-[16/11] sm:aspect-[16/10]">
          <model-viewer
            src={currentArtifact.model3D}
            poster={currentArtifact.thumbnail}
            alt={t(currentArtifact.name.vi, currentArtifact.name.en)}
            camera-controls
            auto-rotate
            auto-rotate-delay="0"
            rotation-per-second="12deg"
            shadow-intensity="1.3"
            shadow-softness="0.9"
            exposure="1.0"
            touch-action="pan-y"
            camera-orbit="auto 72deg auto"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />

          {/* Vầng sương mờ dưới chân hiện vật */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0A130E] via-[#0A130E]/60 to-transparent pointer-events-none" />
        </div>
      </main>

      {/* 4. Chân trang: Dòng suy tưởng & Bộ chuyển hiện vật mộc mạc */}
      <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Câu gợi cảm xúc sâu lắng */}
        <div className="max-w-xl transition-opacity duration-1000">
          <h3 className="text-lg sm:text-2xl font-serif text-heritage-wood font-normal tracking-wide">
            {t(currentArtifact.name.vi, currentArtifact.name.en)}
          </h3>
          <p
            className={`text-xs sm:text-sm text-heritage-woodLight/75 font-serif italic mt-1 leading-relaxed transition-opacity duration-1000 ${
              showPoem ? 'opacity-100' : 'opacity-40 hover:opacity-100 cursor-pointer'
            }`}
            onClick={() => setShowPoem(true)}
          >
            {currentArtifact.slug === 'guol-communal-house' &&
              t(
                '“Gỗ kiền kiền đứng giữa khói sương, chở che buôn làng qua bao mùa trăng...”',
                '“Aged timber standing amid mountain mist, sheltering generations through countless moons...”'
              )}
            {currentArtifact.slug === 'ktu-traditional-drum' &&
              t(
                '“Mỗi nhịp da trâu gõ xuống, là một nhịp tim của đất mẹ Trường Sơn âm vang.”',
                '“With each stroke upon the buffalo skin, echoes the ancient heartbeat of Mother Earth.”'
              )}
            {currentArtifact.slug === 'bahieng-carrying-basket' &&
              t(
                '“Từng sợi mây rừng đan qua tay người già, bền bỉ qua năm tháng nhọc nhằn.”',
                '“Each forest rattan strand, gently woven by weathered hands, endures through time.”'
              )}
            {currentArtifact.slug !== 'guol-communal-house' &&
              currentArtifact.slug !== 'ktu-traditional-drum' &&
              currentArtifact.slug !== 'bahieng-carrying-basket' &&
              t(
                '“Trong sự im lặng của đại ngàn, thời gian như ngưng đọng lại...”',
                '“In the deep stillness of the high forest, time gently pauses...”'
              )}
          </p>
        </div>

        {/* Bộ chọn hiện vật mộc */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {artifacts
            .filter((a) => a.modelStatus === 'available')
            .map((art) => {
              const isSelected = art.slug === activeSlug;
              return (
                <button
                  key={art.id}
                  onClick={() => {
                    heritageSoundService.playWoodClick();
                    setActiveSlug(art.slug);
                    setShowPoem(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-heritage-ochre text-slate-950 font-bold shadow-md'
                      : 'bg-[#14231B]/70 text-heritage-woodMuted hover:text-heritage-wood hover:bg-[#1A2C22] border border-[#25392F]'
                  }`}
                >
                  {t(art.name.vi, art.name.en)}
                </button>
              );
            })}
        </div>
      </footer>
    </div>
  );
};
