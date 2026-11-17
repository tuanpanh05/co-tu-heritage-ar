import React, { useState, useEffect } from 'react';
import { Volume2, Pause, Feather } from 'lucide-react';
import { heritageSoundService } from '../../services/heritageSoundService';
import { useLanguage } from '../../contexts/LanguageContext';

interface ElderVoiceVignetteProps {
  artifactSlug: string;
  className?: string;
}

export const ElderVoiceVignette: React.FC<ElderVoiceVignetteProps> = ({
  artifactSlug,
  className = ''
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsub = heritageSoundService.subscribe((playing, currentSlug) => {
      setIsPlaying(playing && currentSlug === artifactSlug);
    });
    return () => unsub();
  }, [artifactSlug]);

  // Nội dung lời kể chân thật, đời thường theo hiện vật
  const getStoryData = () => {
    switch (artifactSlug) {
      case 'guol-communal-house':
        return {
          speakerVi: 'Già làng A-lăng Bảy (82 tuổi · Tây Giang)',
          speakerEn: 'Elder A-lăng Bảy (82 years old · Tây Giang)',
          quoteVi:
            '“Gỗ kiền kiền đốn trên đỉnh núi, phải khiêng bộ ròng rã nửa tháng mới về tới làng. Từng nhát rìu đẽo trên cột cái, không phải để khoe khéo, mà để con cháu sau này nhìn vào, còn nhớ ngọn lửa của cha ông.”',
          quoteEn:
            '“The timber was felled upon high ridges, carried on shoulders for half a moon back to the village. Every chisel stroke upon the sacred pillar was not to show pride, but so that our children, looking upon it, would still remember the hearth fire of our elders.”'
        };
      case 'bahieng-carrying-basket':
        return {
          speakerVi: 'Nghệ nhân Bh’ling Hạnh (74 tuổi · Thôn Pơr’ning)',
          speakerEn: 'Artisan Bh’ling Hạnh (74 years old · Pơr’ning Village)',
          quoteVi:
            '“Đan chiếc gùi ba ngăn này, người trẻ trong bản giờ ít ai chịu ngồi chuốt từng sợi mây nữa rồi. Mây rừng thì xa, mà mắt già thì mờ dần...”',
          quoteEn:
            '“Weaving this three-compartment basket... few youngsters today have the patience to shave each rattan strip anymore. Forest rattan is far up the hills, and an old man’s sight grows dim...”'
        };
      case 'ktu-traditional-drum':
        return {
          speakerVi: 'Nghệ nhân trống Zơ-râm Plơng (Tây Giang)',
          speakerEn: 'Drum Maker Zơ-râm Plơng (Tây Giang)',
          quoteVi:
            '“Tiếng trống K-tu vang xa qua thung lũng. Đó là tiếng lòng của người vùng cao Tây Giang.”',
          quoteEn:
            '“The deep resonance of the K-tu drum echoes across the highland valley. It is the living heartbeat of our mountain people.”'
        };
      default:
        return {
          speakerVi: 'Ký ức người già bản làng Tây Giang',
          speakerEn: 'Living Memory of Highland Elders',
          quoteVi:
            '“Rừng còn thì người Cơ Tu còn. Mỗi vật dụng đẽo gọt từ cây rừng đều mang theo linh hồn của đất mẹ Trường Sơn.”',
          quoteEn:
            '“As long as the forest stands, the Cơ Tu endure. Every object shaped from timber carries the soul of the sacred Trường Sơn range.”'
        };
    }
  };

  const story = getStoryData();

  const handleToggle = () => {
    if (isPlaying) {
      heritageSoundService.stopElderStory();
    } else {
      heritageSoundService.playWoodClick();
      heritageSoundService.playElderStory(artifactSlug);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-heritage-ochre/25 bg-gradient-to-r from-[#17251E] via-[#121E18] to-[#17251E] p-4 sm:p-5 shadow-heritage ${className}`}
    >
      {/* Vệt sáng ấm nhẹ góc card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-heritage-ochre/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-xs font-serif text-heritage-ochre">
            <Feather className="w-3.5 h-3.5 text-heritage-ochre/90 shrink-0" />
            <span className="font-semibold">{t(story.speakerVi, story.speakerEn)}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-heritage-ochre/15 border border-heritage-ochre/30 text-heritage-ochre">
              {t('Giọng người thật · 20s', 'Authentic Voice · 20s')}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-heritage-wood/90 font-serif italic leading-relaxed pl-1 border-l-2 border-heritage-ochre/40">
            {t(story.quoteVi, story.quoteEn)}
          </p>
        </div>

        {/* Nút bấm nghe giọng người thật */}
        <button
          onClick={handleToggle}
          className={`shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-serif font-semibold transition-all ${
            isPlaying
              ? 'bg-heritage-ochre text-slate-950 shadow-md animate-pulse'
              : 'bg-[#1D3227] hover:bg-[#253E31] text-heritage-ochre border border-heritage-ochre/40 hover:border-heritage-ochre'
          }`}
          title={t('Nghe lời kể của già làng', 'Listen to elder narration')}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 text-slate-950" />
              <span>{t('Đang nghe...', 'Listening...')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-heritage-ochre" />
              <span>{t('Lắng nghe lời kể', 'Listen to Story')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
