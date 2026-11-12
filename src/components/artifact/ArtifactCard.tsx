import React from 'react';
import { Link } from 'react-router-dom';
import { Artifact } from '../../types';
import { Rotate3d, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ArtifactCardProps {
  artifact: Artifact;
  featured?: boolean;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, featured = false }) => {
  const is3DAvailable = artifact.modelStatus === 'available';
  const { t } = useLanguage();

  return (
    <Link
      to={`/artifacts/${artifact.slug}`}
      className={`group soft-glass-card rounded-2xl overflow-hidden shadow-heritage flex flex-col hover:-translate-y-1.5 transition-all duration-300 ${
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
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient Vignette for dramatic museum illumination */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A120E] via-transparent to-black/25 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top-Right 3D / AR Museum Indicator */}
        {is3DAvailable && (
          <div className="absolute top-3.5 right-3.5">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono tracking-wide font-semibold bg-[#0A120E]/85 backdrop-blur-md text-heritage-ochre border border-heritage-ochre/30 shadow-md">
              <Rotate3d className="w-3.5 h-3.5 animate-pulse-soft" />
              <span>3D · WebAR</span>
            </span>
          </div>
        )}

        {/* Bottom overlay inside image: Category Kicker */}
        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-heritage-ochre font-semibold drop-shadow-sm">
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

          <p className="text-xs sm:text-sm text-heritage-woodLight/90 line-clamp-2 leading-relaxed">
            {t(artifact.brief.vi, artifact.brief.en)}
          </p>
        </div>

        {/* Bottom Bar: Clean single interactive cue */}
        <div className="pt-3 border-t border-[#23352C] flex items-center justify-between text-xs font-semibold text-heritage-ochre group-hover:text-heritage-ochreLight transition-colors">
          <span className="text-[11px] text-heritage-woodMuted font-mono">
            Tây Giang · Quảng Nam
          </span>

          <span className="inline-flex items-center space-x-1.5">
            <span>{t('Chiêm ngưỡng 3D', 'View in 3D')}</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};
