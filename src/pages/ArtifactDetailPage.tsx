import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artifactService } from '../services/artifactService';
import { Artifact, LanguageMode, VocabularyItem } from '../types';
import { ModelViewer3D } from '../components/ar/ModelViewer3D';
import { LanguageSwitcher } from '../components/artifact/LanguageSwitcher';
import { VocabularyPopup } from '../components/artifact/VocabularyPopup';
import { AudioGuidePlayer } from '../components/artifact/AudioGuidePlayer';
import { ArtifactInteractiveChallenge } from '../components/artifact/ArtifactInteractiveChallenge';
import { ArtifactCard } from '../components/artifact/ArtifactCard';
import { useLanguage } from '../contexts/LanguageContext';
import { analyticsService } from '../services/analyticsService';
import {
  ChevronRight,
  MapPin,
  Hammer,
  Ruler,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  BookOpen,
  Volume2
} from 'lucide-react';

export const ArtifactDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, setLang, t } = useLanguage();
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [langMode, setLangMode] = useState<LanguageMode>(lang);
  const [activeVocab, setActiveVocab] = useState<VocabularyItem | null>(null);
  const [hasListenedAudio, setHasListenedAudio] = useState<boolean>(false);
  const [challengeModeRequest, setChallengeModeRequest] = useState<
    'none' | 'quiz' | 'minigame'
  >('none');

  useEffect(() => {
    setLangMode(lang);
  }, [lang]);

  useEffect(() => {
    if (slug) {
      const found = artifactService.getBySlug(slug);
      setArtifact(found || null);
      setHasListenedAudio(false);
      setChallengeModeRequest('none');
      if (found) {
        analyticsService.trackArtifactView(found.slug, found.name.vi, found.name.en);
      }
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const handleLangModeChange = (mode: LanguageMode) => {
    setLangMode(mode);
    if (mode === 'vi' || mode === 'en') {
      setLang(mode);
    }
  };

  const handleOpenChallengeFromAudio = (mode: 'quiz' | 'minigame') => {
    setChallengeModeRequest(mode);
    const el = document.getElementById('artifact-challenge-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!artifact) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-semibold text-heritage-wood">
            {t('Không tìm thấy hiện vật', 'Artifact Not Found')}
          </h2>
          <p className="text-sm text-heritage-woodMuted">
            {t('Mã định danh', 'Artifact slug')}{' '}
            <code className="bg-heritage-cream px-2 py-1 rounded font-mono text-heritage-clay">
              {slug}
            </code>{' '}
            {t('không tồn tại trong hệ thống.', 'does not exist in the system.')}
          </p>
        </div>
        <div>
          <Link
            to="/artifacts"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-clay text-white text-sm font-semibold hover:bg-heritage-clayDark transition-colors shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Quay lại danh mục hiện vật', 'Back to Artifacts')}</span>
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
      <div className="space-y-2 border-l-2 border-heritage-clay/40 pl-3.5">
        <p className="leading-relaxed text-heritage-wood font-medium">{textVi}</p>
        <p className="leading-relaxed text-heritage-woodMuted italic text-sm">{textEn}</p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 1. BREADCRUMB */}
      <nav className="flex items-center space-x-1.5 text-xs text-heritage-woodMuted overflow-x-auto whitespace-nowrap pb-1">
        <Link to="/" className="hover:text-heritage-wood transition-colors">
          {t('Trang chủ', 'Home')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/artifacts" className="hover:text-heritage-wood transition-colors">
          {t('Hiện vật', 'Artifacts')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-heritage-clay font-medium truncate max-w-[200px] sm:max-w-none">
          {t(artifact.name.vi, artifact.name.en)}
        </span>
      </nav>

      {/* 2. HEADER TITLE & LANGUAGE TOGGLE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-heritage-sand/80 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-heritage-clay/10 text-heritage-clay border border-heritage-clay/20">
              {t(artifact.categoryName.vi, artifact.categoryName.en)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {t(artifact.name.vi, artifact.name.en)}
          </h1>
          <p className="text-base sm:text-lg text-heritage-woodMuted italic font-serif">
            {t(artifact.name.en, artifact.name.vi)}
          </p>
        </div>

        <LanguageSwitcher
          currentMode={langMode}
          onChange={handleLangModeChange}
          className="self-start md:self-auto shrink-0"
        />
      </div>

      {/* 3. MAIN SECTION: 3D VIEWER + CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 3D / AR VIEWER + AUDIO GUIDE + SPECS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="lg:sticky lg:top-24 space-y-5">
            <ModelViewer3D
              modelUrl={artifact.model3D}
              posterUrl={artifact.thumbnail}
              altText={t(artifact.name.vi, artifact.name.en)}
              artifactSlug={artifact.slug}
              artifactName={t(artifact.name.vi, artifact.name.en)}
              modelStatus={artifact.modelStatus}
            />

            <AudioGuidePlayer
              audioFiles={artifact.audio}
              textToRead={{
                vi: `${artifact.name.vi}. ${artifact.description.vi}`,
                en: `${artifact.name.en}. ${artifact.description.en}`
              }}
              artifactName={t(artifact.name.vi, artifact.name.en)}
              onAudioTriggered={() => setHasListenedAudio(true)}
              onOpenChallenge={handleOpenChallengeFromAudio}
            />

            {/* Compact Heritage Specs Strip */}
            <div className="soft-glass-card rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {artifact.dimensions && (
                <div className="space-y-1">
                  <span className="text-heritage-woodMuted flex items-center space-x-1.5 font-medium">
                    <Ruler className="w-3.5 h-3.5 text-heritage-clay" />
                    <span>{t('Quy mô / Kích thước', 'Dimensions')}</span>
                  </span>
                  <div className="font-semibold text-heritage-wood">{artifact.dimensions}</div>
                </div>
              )}
              {artifact.materials && (
                <div className="space-y-1">
                  <span className="text-heritage-woodMuted flex items-center space-x-1.5 font-medium">
                    <Hammer className="w-3.5 h-3.5 text-heritage-clay" />
                    <span>{t('Chất liệu rừng già', 'Natural Materials')}</span>
                  </span>
                  <div className="font-semibold text-heritage-wood">
                    {langMode === 'en' ? artifact.materials.en : artifact.materials.vi}
                  </div>
                </div>
              )}
              {artifact.origin && (
                <div className="space-y-1">
                  <span className="text-heritage-woodMuted flex items-center space-x-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-heritage-clay" />
                    <span>{t('Không gian văn hóa', 'Cultural Origin')}</span>
                  </span>
                  <div className="font-semibold text-heritage-wood">
                    {langMode === 'en' ? artifact.origin.en : artifact.origin.vi}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STORYTELLING & VOCABULARY */}
        <div className="lg:col-span-5 space-y-6">
          {/* Story Overview */}
          <div className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
            <h3 className="font-serif font-semibold text-base sm:text-lg text-heritage-wood flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-heritage-ochre" />
              <span>{t('Câu Chuyện Hiện Vật', 'The Artifact’s Story')}</span>
            </h3>
            <div className="text-xs sm:text-sm leading-relaxed">
              {renderBilingual(artifact.description.vi, artifact.description.en)}
            </div>
          </div>

          {/* Interactive Vocabulary Chips in Dark Forest Theme */}
          {artifact.vocabulary && artifact.vocabulary.length > 0 && (
            <div className="forest-stage-dark rounded-3xl p-5 sm:p-6 space-y-3.5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <h3 className="font-serif font-semibold text-sm sm:text-base text-white">
                    {t('Từ Vựng Di Sản Trong Ngữ Cảnh', 'Heritage Vocabulary in Context')}
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-200/80 font-medium">
                  {t('Chạm để nghe & xem nghĩa', 'Tap to listen & inspect')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {artifact.vocabulary.map((vocab) => (
                  <button
                    key={vocab.id}
                    onClick={() => {
                      setActiveVocab(vocab);
                      analyticsService.trackVocabLookup(
                        vocab.term,
                        vocab.vietnameseMeaning,
                        artifact.name.vi,
                        artifact.name.en
                      );
                    }}
                    className="group text-left p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-emerald-300/60 transition-all flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-200 truncate">
                        {vocab.term}
                      </div>
                      <div className="text-[11px] text-amber-200/90 truncate">
                        {vocab.vietnameseMeaning}
                      </div>
                    </div>
                    <Volume2 className="w-4 h-4 text-emerald-300 shrink-0 opacity-80 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deep-Dive Cultural Sections */}
          <div className="space-y-4">
            {artifact.sections.map((sec) => (
              <div key={sec.id} className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-2">
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
        </div>
      </div>

      {/* 4. POST-EXPLORATION & AUDIO INTERACTIVE QUIZ / MINI-GAME SECTION */}
      <div className="pt-4">
        <ArtifactInteractiveChallenge
          artifact={artifact}
          hasListenedAudio={hasListenedAudio}
          externalModeRequest={challengeModeRequest}
          onModeChange={setChallengeModeRequest}
        />
      </div>

      {/* 5. RELATED ARTIFACTS */}
      {relatedArtifacts.length > 0 && (
        <div className="pt-10 border-t border-heritage-sand/80 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-semibold text-xl text-heritage-wood">
              {t('Khám Phá Tiếp Hiện Vật Khác', 'Continue Exploring Other Artifacts')}
            </h3>
            <Link
              to="/artifacts"
              className="text-xs font-semibold text-heritage-clay hover:text-heritage-clayDark"
            >
              {t('Xem tất cả', 'View All')}
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
