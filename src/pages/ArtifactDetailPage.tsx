import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artifactService } from '../services/artifactService';
import { 
  Artifact, 
  LanguageMode, 
  VocabularyItem 
} from '../types';
import { ModelViewer3D } from '../components/ar/ModelViewer3D';
import { LanguageSwitcher } from '../components/artifact/LanguageSwitcher';
import { VocabularyPopup } from '../components/artifact/VocabularyPopup';
import { AudioGuidePlayer } from '../components/artifact/AudioGuidePlayer';
import { ArtifactCard } from '../components/artifact/ArtifactCard';
import { 
  ChevronRight, 
  MapPin, 
  Hammer, 
  Ruler, 
  ShieldAlert, 
  Sparkles, 
  ArrowLeft,
  BookOpen
} from 'lucide-react';

export const ArtifactDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [langMode, setLangMode] = useState<LanguageMode>('vi');
  const [activeVocab, setActiveVocab] = useState<VocabularyItem | null>(null);

  useEffect(() => {
    if (slug) {
      const found = artifactService.getBySlug(slug);
      setArtifact(found || null);
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (!artifact) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-semibold text-heritage-wood">
            Không tìm thấy hiện vật
          </h2>
          <p className="text-sm text-heritage-woodMuted">
            Mã định danh <code className="bg-heritage-cream px-2 py-1 rounded font-mono text-heritage-clay">{slug}</code> không tồn tại trong hệ thống.
          </p>
        </div>
        <div>
          <Link
            to="/artifacts"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-clay text-white text-sm font-semibold hover:bg-heritage-clayDark transition-colors shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh mục hiện vật</span>
          </Link>
        </div>
      </div>
    );
  }

  const relatedArtifacts = artifactService.getRelated(artifact.slug, 3);

  const renderBilingual = (textVi: string, textEn: string) => {
    if (langMode === 'vi') {
      return <p className="leading-relaxed text-heritage-wood">{textVi}</p>;
    }
    if (langMode === 'en') {
      return <p className="leading-relaxed text-heritage-wood">{textEn}</p>;
    }
    return (
      <div className="space-y-2 border-l-2 border-heritage-clay/40 pl-3">
        <p className="leading-relaxed text-heritage-wood font-medium">{textVi}</p>
        <p className="leading-relaxed text-heritage-woodMuted italic text-sm">{textEn}</p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* 1. BREADCRUMB */}
      <nav className="flex items-center space-x-1.5 text-xs text-heritage-woodMuted overflow-x-auto whitespace-nowrap pb-1">
        <Link to="/" className="hover:text-heritage-wood transition-colors">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/artifacts" className="hover:text-heritage-wood transition-colors">Hiện vật</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-heritage-clay font-medium truncate max-w-[200px] sm:max-w-none">
          {artifact.name.vi}
        </span>
      </nav>

      {/* 2. HEADER TITLE & LANGUAGE TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-heritage-sand/80 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-heritage-clay/10 text-heritage-clay border border-heritage-clay/20">
              {artifact.categoryName.vi}
            </span>
            <span className="text-xs text-heritage-woodMuted italic font-serif">
              ({artifact.categoryName.en})
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {artifact.name.vi}
          </h1>
          <p className="text-base sm:text-lg text-heritage-woodMuted italic font-serif">
            {artifact.name.en}
          </p>
        </div>

        <LanguageSwitcher
          currentMode={langMode}
          onChange={setLangMode}
          className="self-start md:self-auto shrink-0"
        />
      </div>

      {/* 3. MAIN SECTION: 3D VIEWER + CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 3D / AR VIEWER */}
        <div className="lg:col-span-7 space-y-6">
          <div className="sticky top-24 space-y-4">
            <ModelViewer3D
              modelUrl={artifact.model3D}
              posterUrl={artifact.thumbnail}
              altText={artifact.name.vi}
              artifactSlug={artifact.slug}
              artifactName={artifact.name.vi}
              modelStatus={artifact.modelStatus}
            />

            <AudioGuidePlayer
              audioFiles={artifact.audio}
              textToRead={{
                vi: `${artifact.name.vi}. ${artifact.description.vi}`,
                en: `${artifact.name.en}. ${artifact.description.en}`
              }}
              artifactName={artifact.name.vi}
            />

            <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Trạng thái kiểm chứng nội dung</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                {artifact.verificationNote}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EDUCATIONAL CONTENT & VOCABULARY */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-heritage-cream/60 rounded-2xl border border-heritage-sand p-5 sm:p-6 space-y-3">
            <h3 className="font-serif font-semibold text-base text-heritage-wood flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-heritage-clay" />
              <span>Tổng quan hiện vật</span>
            </h3>
            <div className="text-xs sm:text-sm leading-relaxed">
              {renderBilingual(artifact.description.vi, artifact.description.en)}
            </div>
          </div>

          <div className="bg-heritage-ivory rounded-2xl border border-heritage-sand p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-heritage-woodMuted font-serif">
              Đặc điểm quy chuẩn
            </h4>
            <div className="divide-y divide-heritage-sand/60 text-xs sm:text-sm">
              {artifact.dimensions && (
                <div className="py-2.5 flex items-start justify-between">
                  <span className="text-heritage-woodMuted flex items-center space-x-1.5">
                    <Ruler className="w-3.5 h-3.5 text-heritage-clay" />
                    <span>Kích thước:</span>
                  </span>
                  <span className="font-medium text-heritage-wood text-right max-w-[60%]">
                    {artifact.dimensions}
                  </span>
                </div>
              )}
              {artifact.materials && (
                <div className="py-2.5 flex items-start justify-between">
                  <span className="text-heritage-woodMuted flex items-center space-x-1.5">
                    <Hammer className="w-3.5 h-3.5 text-heritage-clay" />
                    <span>Chất liệu:</span>
                  </span>
                  <span className="font-medium text-heritage-wood text-right max-w-[60%]">
                    {langMode === 'en' ? artifact.materials.en : artifact.materials.vi}
                  </span>
                </div>
              )}
              {artifact.origin && (
                <div className="py-2.5 flex items-start justify-between">
                  <span className="text-heritage-woodMuted flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-heritage-clay" />
                    <span>Xuất xứ địa bàn:</span>
                  </span>
                  <span className="font-medium text-heritage-wood text-right max-w-[60%]">
                    {langMode === 'en' ? artifact.origin.en : artifact.origin.vi}
                  </span>
                </div>
              )}
            </div>
          </div>

          {artifact.vocabulary && artifact.vocabulary.length > 0 && (
            <div className="bg-heritage-cream/80 rounded-2xl border-2 border-heritage-clay/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-heritage-clay" />
                  <h3 className="font-serif font-semibold text-sm sm:text-base text-heritage-wood">
                    Thuật Ngữ Trong Ngữ Cảnh (CLIL)
                  </h3>
                </div>
                <span className="text-[11px] text-heritage-woodMuted font-medium">
                  Chạm để tra nghĩa & nghe
                </span>
              </div>

              <p className="text-xs text-heritage-woodMuted">
                Nhấp vào thuật ngữ tiếng Anh dưới đây để xem giải thích chi tiết, phiên âm và lưu vào Sổ tay:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {artifact.vocabulary.map((vocab) => (
                  <button
                    key={vocab.id}
                    onClick={() => setActiveVocab(vocab)}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-heritage-clay hover:text-white border border-heritage-sand text-heritage-wood text-xs font-semibold shadow-xs transition-all transform active:scale-95 min-h-[40px]"
                  >
                    <span>{vocab.term}</span>
                    {vocab.ipa && (
                      <span className="text-[10px] opacity-75 font-mono">
                        {vocab.ipa}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {artifact.sections.map((sec) => (
              <div 
                key={sec.id}
                className="bg-white rounded-2xl border border-heritage-sand p-5 space-y-2 shadow-xs"
              >
                <h4 className="font-serif font-semibold text-sm sm:text-base text-heritage-wood">
                  {langMode === 'en' ? sec.title.en : sec.title.vi}
                </h4>
                {langMode === 'bilingual' && (
                  <div className="text-xs text-heritage-clay font-medium italic -mt-1 mb-2">
                    {sec.title.en}
                  </div>
                )}
                <div className="text-xs sm:text-sm text-heritage-woodLight">
                  {renderBilingual(sec.content.vi, sec.content.en)}
                </div>
              </div>
            ))}
          </div>

          {artifact.sources && artifact.sources.length > 0 && (
            <div className="p-4 rounded-xl bg-heritage-cream/40 border border-heritage-sand/60 text-xs text-heritage-woodMuted space-y-1.5">
              <div className="font-semibold text-heritage-wood">Tài liệu tham khảo:</div>
              <ul className="list-disc list-inside space-y-1">
                {artifact.sources.map((src, idx) => (
                  <li key={idx} className="italic">{src}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

      {relatedArtifacts.length > 0 && (
        <div className="pt-12 border-t border-heritage-sand/80 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-semibold text-xl text-heritage-wood">
              Hiện Vật Cùng Chuyên Đề
            </h3>
            <Link
              to="/artifacts"
              className="text-xs font-semibold text-heritage-clay hover:text-heritage-clayDark"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArtifacts.map((rel) => (
              <ArtifactCard key={rel.id} artifact={rel} />
            ))}
          </div>
        </div>
      )}

      <VocabularyPopup
        item={activeVocab}
        artifact={artifact}
        onClose={() => setActiveVocab(null)}
      />

    </div>
  );
};
