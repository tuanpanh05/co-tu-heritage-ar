import React from 'react';
import { Link } from 'react-router-dom';
import { Artifact } from '../../types';
import { Box, ArrowRight, Sparkles } from 'lucide-react';

interface ArtifactCardProps {
  artifact: Artifact;
}

export const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact }) => {
  const is3DAvailable = artifact.modelStatus === 'available';

  return (
    <Link
      to={`/artifacts/${artifact.slug}`}
      className="group soft-glass-card rounded-3xl overflow-hidden shadow-heritage flex flex-col hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Image Thumbnail & Soft Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-heritage-cream m-2.5 rounded-2xl">
        <img
          src={artifact.thumbnail}
          alt={artifact.name.vi}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-heritage-wood shadow-xs border border-heritage-sand/60">
            {artifact.categoryName.vi}
          </span>
        </div>

        {/* 3D / AR Status Badge */}
        <div className="absolute bottom-3 right-3">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs ${
            is3DAvailable
              ? 'bg-heritage-clay/90 text-white'
              : 'bg-white/90 text-heritage-woodLight border border-heritage-sand'
          }`}>
            <Box className="w-3.5 h-3.5" />
            <span>{is3DAvailable ? '3D / AR Sẵn sàng' : '3D Đang cập nhật'}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-serif font-semibold text-heritage-wood group-hover:text-heritage-clay transition-colors leading-snug">
              {artifact.name.vi}
            </h3>
            <p className="text-xs text-heritage-woodMuted italic font-serif">
              {artifact.name.en}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-heritage-woodLight line-clamp-2 leading-relaxed">
            {artifact.brief.vi}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-3 border-t border-heritage-sand/60 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] text-heritage-woodMuted">
            <Sparkles className="w-3.5 h-3.5 text-heritage-ochre" />
            <span>Học liệu CLIL</span>
          </div>

          <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-heritage-clay group-hover:text-heritage-clayDark transition-colors bg-heritage-cream px-3.5 py-1.5 rounded-full">
            <span>Khám phá</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};
