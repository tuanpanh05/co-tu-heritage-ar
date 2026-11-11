import React, { useState, useMemo } from 'react';
import { artifactService } from '../services/artifactService';
import { ArtifactCard } from '../components/artifact/ArtifactCard';
import { Search, Filter, Layers, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const ArtifactsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t } = useLanguage();

  const categories = useMemo(() => artifactService.getCategories(), []);

  const filteredArtifacts = useMemo(() => {
    return artifactService.search(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-heritage-clay/10 text-heritage-clay text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>{t('Danh mục di sản Tây Giang', 'Tây Giang Heritage Catalog')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
          {t('Bộ Sưu Tập Hiện Vật Cơ Tu', 'Cơ Tu Cultural Artifact Collection')}
        </h1>
        <p className="text-xs sm:text-sm text-heritage-woodMuted max-w-2xl leading-relaxed">
          {t(
            'Khám phá không gian 3 chiều và học liệu song ngữ của từng hiện vật tiêu biểu. Quét nhãn QR trên hiện vật thực tế để mở trực tiếp trang chi tiết.',
            'Explore 3D models and bilingual CLIL learning materials for each iconic artifact. Scan QR labels at physical exhibits to open detail pages directly.'
          )}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-heritage-cream/60 border border-heritage-sand rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-heritage-woodMuted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              'Tìm theo tên hiện vật (Gươl, Trống...), từ vựng tiếng Anh (pillar, basket...)',
              'Search by artifact name (Gươl, Drum...), or English vocabulary (pillar, basket...)'
            )}
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-heritage-sand text-heritage-wood placeholder-heritage-woodMuted/70 text-sm focus:outline-none focus:ring-2 focus:ring-heritage-clay"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-heritage-woodMuted hover:text-heritage-wood"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <div className="flex items-center text-xs font-semibold text-heritage-woodMuted shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 mr-1 text-heritage-clay" />
            <span>{t('Phân loại:', 'Category:')}</span>
          </div>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all min-h-[36px] flex items-center shrink-0 ${
                  isActive
                    ? 'bg-heritage-clay text-white shadow-sm'
                    : 'bg-white/80 hover:bg-white text-heritage-wood border border-heritage-sand'
                }`}
              >
                <span>{t(cat.labelVi, cat.labelEn)}</span>
                <span className="text-[10px] opacity-70 ml-1.5 font-serif italic">
                  ({t(cat.labelEn, cat.labelVi)})
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of Results */}
      {filteredArtifacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArtifacts.map((artifact) => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
      ) : (
        <div className="bg-heritage-cream/40 rounded-2xl border border-heritage-sand p-12 text-center max-w-md mx-auto space-y-4">
          <Search className="w-12 h-12 mx-auto text-heritage-woodMuted opacity-60" />
          <h3 className="font-serif font-semibold text-lg text-heritage-wood">
            {t('Không tìm thấy hiện vật phù hợp', 'No matching artifacts found')}
          </h3>
          <p className="text-xs text-heritage-woodMuted">
            {t(
              'Hãy thử tìm với từ khóa khác hoặc xóa bộ lọc để hiển thị toàn bộ hiện vật.',
              'Try searching with a different keyword or clear filters to view all artifacts.'
            )}
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-heritage-clay text-white text-xs font-semibold hover:bg-heritage-clayDark transition-colors shadow"
          >
            {t('Hiển thị tất cả hiện vật', 'Show All Artifacts')}
          </button>
        </div>
      )}

    </div>
  );
};
