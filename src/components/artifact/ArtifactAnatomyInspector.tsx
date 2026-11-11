import React, { useState, useEffect } from 'react';
import { AnatomyHotspot } from '../../data/academicAnatomyData';
import { speechService } from '../../services/speechService';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Crosshair,
  Volume2,
  Cpu,
  Sparkles,
  Rotate3d
} from 'lucide-react';

interface ArtifactAnatomyInspectorProps {
  hotspots: AnatomyHotspot[];
  onSelectCameraOrbit: (orbit: string) => void;
}

export const ArtifactAnatomyInspector: React.FC<ArtifactAnatomyInspectorProps> = ({
  hotspots,
  onSelectCameraOrbit
}) => {
  const { t } = useLanguage();
  const [activeHotspotId, setActiveHotspotId] = useState<string>(hotspots[0]?.id || '');

  useEffect(() => {
    if (hotspots.length > 0) {
      setActiveHotspotId(hotspots[0].id);
    }
  }, [hotspots]);

  if (!hotspots || hotspots.length === 0) return null;

  const activeSpot = hotspots.find((h) => h.id === activeHotspotId) || hotspots[0];

  const handleSpotClick = (spot: AnatomyHotspot) => {
    setActiveHotspotId(spot.id);
    onSelectCameraOrbit(spot.cameraOrbit);
  };

  return (
    <div className="forest-stage-dark rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3.5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-serif font-semibold text-white">
              {t(
                'Giải Phẫu Cấu Trúc & Kỹ Thuật Chế Tác 3D',
                'Interactive 3D Structural Anatomy Inspector'
              )}
            </h4>
            <span className="text-[11px] text-emerald-200/80">
              {t(
                'Bấm chọn từng bộ phận để xoay góc nhìn 3D và xem phân tích kỹ thuật',
                'Click any structural component to rotate the 3D camera & inspect engineering details'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Hotspot Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {hotspots.map((spot) => {
          const isSelected = spot.id === activeSpot.id;
          return (
            <button
              key={spot.id}
              onClick={() => handleSpotClick(spot)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-md scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/15'
              }`}
            >
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-black/20">
                {spot.code}
              </span>
              <span>{t(spot.title.vi, spot.title.en)}</span>
              <Rotate3d className="w-3.5 h-3.5 opacity-75" />
            </button>
          );
        })}
      </div>

      {/* Active Hotspot Academic Breakdown */}
      <div className="p-4 rounded-2xl bg-black/25 border border-white/15 space-y-3 animate-in fade-in">
        {/* Technical English Term + Audio */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
              {t('Thuật ngữ Kỹ thuật & Kiến trúc', 'Technical Engineering Term')}
            </span>
            <div className="text-sm sm:text-base font-serif font-semibold text-white">
              {activeSpot.technicalTermEn}{' '}
              <span className="text-xs font-mono text-emerald-300 ml-1">{activeSpot.ipa}</span>
            </div>
          </div>

          <button
            onClick={() => speechService.speak(activeSpot.technicalTermEn, 'en')}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-200 hover:text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('Phát âm', 'Listen')}</span>
          </button>
        </div>

        {/* Engineering Analysis & Cultural Symbolism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              {t('Phân tích Kỹ thuật & Vật liệu', 'Structural & Material Analysis')}
            </span>
            <p className="text-emerald-50/90 leading-relaxed">
              {t(activeSpot.engineeringAnalysis.vi, activeSpot.engineeringAnalysis.en)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t('Biểu tượng Văn hóa & Triết lý', 'Cultural Symbolism')}
            </span>
            <p className="text-emerald-50/90 leading-relaxed">
              {t(activeSpot.culturalSymbolism.vi, activeSpot.culturalSymbolism.en)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

