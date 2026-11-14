import React, { useState, useMemo } from 'react';
import { artifactService } from '../services/artifactService';
import { ArtifactCard } from '../components/artifact/ArtifactCard';
import { Search, Filter, Layers, X, Sparkles } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-[#14221A] border border-heritage-ochre/30 text-heritage-ochre text-xs font-mono uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>{t('Bộ sưu tập Bảo tàng Số Tây Giang', 'Tây Giang Museum Collection')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-heritage-wood">
          {t('Di Sản Văn Hóa Cơ Tu Trong Không Gian 3D/AR', 'Cơ Tu Tangible Cultural Heritage Collection')}
        </h1>
        <p className="text-xs sm:text-sm text-heritage-woodLight/85 max-w-2xl leading-relaxed">
          {t(
            'Khám phá chiều sâu lịch sử, kỹ thuật đẽo khắc và âm thanh linh thiêng của từng hiện vật tiêu biểu. Trải nghiệm mô hình 3D tương tác 360° và đặt hiện vật vào không gian thực tế qua WebAR.',
            'Explore the historical depth, craftsmanship, and spiritual significance of iconic artifacts. Inspect 360° interactive 3D models and project them into physical space via WebAR.'
          )}
        </p>
      </div>

      {/* Search & Filter Controls: Refined Dark Gallery Aesthetic */}
      <div className="bg-[#111D17]/90 border border-[#23352C] rounded-2xl p-4 sm:p-5 space-y-4 shadow-heritage">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-heritage-woodMuted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              'Tìm theo tên hiện vật (Gươl, Trống, Gùi...), từ vựng tiếng Anh (pillar, basket...)',
              'Search by artifact name (Gươl, Drum, Basket...), or English terms (pillar, basket...)'
            )}
            className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-[#0A120E] border border-[#25392F] text-heritage-wood placeholder-heritage-woodMuted focus:outline-none focus:ring-1 focus:ring-heritage-ochre focus:border-heritage-ochre transition-all"
            style={{ fontSize: '16px' }}
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
          <div className="flex items-center text-xs font-mono uppercase tracking-wider text-heritage-woodMuted shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 mr-1 text-heritage-ochre" />
            <span>{t('Phân loại:', 'Category:')}</span>
          </div>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all min-h-[36px] flex items-center shrink-0 ${
                  isActive
                    ? 'bg-heritage-forest text-heritage-ochre border border-heritage-ochre/40 shadow-sm font-semibold'
                    : 'bg-[#0A120E] hover:bg-[#14221A] text-heritage-woodLight border border-[#23352C]'
                }`}
              >
                <span>{t(cat.labelVi, cat.labelEn)}</span>
                <span className="text-[10px] opacity-75 ml-1.5 font-serif italic text-heritage-ochre">
                  ({t(cat.labelEn, cat.labelVi)})
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of Results: Dynamic Editorial Rhythm */}
      {filteredArtifacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArtifacts.map((artifact, idx) => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              featured={idx === 0 && selectedCategory === 'all' && !searchQuery}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#111D17]/80 rounded-2xl border border-[#23352C] p-12 text-center max-w-md mx-auto space-y-4">
          <Search className="w-12 h-12 mx-auto text-heritage-woodMuted opacity-50" />
          <h3 className="font-serif font-semibold text-lg text-heritage-wood">
            {t('Không tìm thấy hiện vật phù hợp', 'No matching artifacts found')}
          </h3>
          <p className="text-xs text-heritage-woodMuted leading-relaxed">
            {t(
              'Thử tìm với từ khóa khác như "Gươl", "Trống", "Gùi", hoặc bấm nút bên dưới để xem toàn bộ.',
              'Try different search terms such as "Guol", "Drum", "Basket", or click below to reset.'
            )}
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-lg bg-heritage-ochre text-slate-950 text-xs font-bold transition-all shadow-sm"
          >
            {t('Xem tất cả hiện vật', 'Reset Filters')}
          </button>
        </div>
      )}

      {/* Bottom Heritage Academic Strip */}
      <div className="border-t border-[#23352C] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-heritage-woodMuted gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-heritage-ochre" />
          <span>
            {t(
              'Hiện vật được số hóa 3D và biên soạn theo phương pháp giáo dục liên môn CLIL.',
              'Artifacts 3D-digitized and curated under the CLIL bilingual pedagogical framework.'
            )}
          </span>
        </div>
        <span className="font-mono text-heritage-ochre">
          {filteredArtifacts.length} / 5 {t('hiện vật hiển thị', 'artifacts showing')}
        </span>
      </div>

    </div>
  );
};
