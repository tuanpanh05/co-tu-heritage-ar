import React from 'react';
import { Link } from 'react-router-dom';
import { Artifact } from '../../types';
import { Rotate3d, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { heritageSoundService } from '../../services/heritageSoundService';

interface ArtifactCardProps {
  artifact: Artifact;
  featured?: boolean;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, featured = false }) => {
  const is3DAvailable = artifact.modelStatus === 'available';
  const { t } = useLanguage();

  const handleClick = () => {
    heritageSoundService.playWoodClick();
  };

  return (
    <Link
      to={`/artifacts/${artifact.slug}`}
      onClick={handleClick}
      className={`group soft-glass-card rounded-xl overflow-hidden shadow-heritage flex flex-col hover:-translate-y-1 transition-all duration-400 border border-[#25382E] hover:border-heritage-ochre/40 ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
    >
      {/* Authentic High-Resolution Photography Frame */}
      <div className={`relative overflow-hidden bg-[#0A120E] ${
        featured ? 'aspect-[16/9] sm:aspect-[21/10]' : 'aspect-[16/10]'
      }`}>
        <img
          src={artifact.thumbnail}
          alt={t(artifact.name.vi, artifact.name.en)}
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-1000 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient Vignette for dramatic museum illumination */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1712] via-transparent to-black/30 opacity-85 group-hover:opacity-65 transition-opacity" />

        {/* Top-Right 3D / AR Museum Indicator: Dignified Seal */}
        {is3DAvailable && (
          <div className="absolute top-3.5 right-3.5">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-serif tracking-wide text-heritage-ochre bg-[#0E1712]/90 border border-heritage-ochre/30 shadow-xs backdrop-blur-md">
              <Rotate3d className="w-3.5 h-3.5 text-heritage-ochre" />
              <span>{t('Chứng tích 3D · WebAR', '3D Relic · AR')}</span>
            </span>
          </div>
        )}

        {/* Bottom overlay inside image: Category Kicker */}
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-[11px] font-serif tracking-wider text-heritage-ochre/90 drop-shadow-sm">
            {t(artifact.categoryName.vi, artifact.categoryName.en)}
          </span>
        </div>
      </div>

      {/* Editorial Content Block */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-semibold text-heritage-wood group-hover:text-heritage-ochre transition-colors leading-snug">
              {t(artifact.name.vi, artifact.name.en)}
            </h3>
            <p className="text-xs text-heritage-woodMuted italic font-serif mt-0.5">
              {t(artifact.name.en, artifact.name.vi)}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-heritage-woodLight/85 line-clamp-2 leading-relaxed font-serif">
            {t(artifact.brief.vi, artifact.brief.en)}
          </p>
        </div>

        {/* Bottom Bar: Clean single interactive cue */}
        <div className="pt-3 border-t border-[#25382E] flex items-center justify-between text-xs font-serif text-heritage-ochre group-hover:text-heritage-ochreLight transition-colors">
          <span className="text-[11px] text-heritage-woodMuted">
            {t('Tây Giang · Quảng Nam', 'Tây Giang Highlands')}
          </span>

          <span className="inline-flex items-center space-x-1.5 font-medium">
            <span>{t('Chiêm ngưỡng 3D', 'Explore 3D')}</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};
