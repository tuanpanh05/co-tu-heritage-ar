import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { artifactService } from '../services/artifactService';
import { speechService } from '../services/speechService';
import { analyticsService } from '../services/analyticsService';
import { FlashcardViewer } from '../components/learning/FlashcardViewer';
import { VocabularyQuiz } from '../components/learning/VocabularyQuiz';
import { QUIZ_QUESTIONS } from '../data/quizData';
import {
  VOCABULARY_BANK,
  VOCABULARY_THEMES,
  ExtendedVocabularyItem,
  VocabularyThemeId
} from '../data/vocabularyBankData';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Search,
  Volume2,
  Layers,
  BookOpen,
  Gamepad2,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

export const LearningPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedTheme, setSelectedTheme] = useState<'all' | VocabularyThemeId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFlashcardDeck, setShowFlashcardDeck] = useState<boolean>(true);
  const [showFunQuiz, setShowFunQuiz] = useState<boolean>(false);

  const artifacts = useMemo(() => artifactService.getAll(), []);

  // Gộp kho từ vựng mở rộng (64 từ) + từ vựng gốc từ 5 hiện vật (14 từ)
  const fullVocabularyList = useMemo<ExtendedVocabularyItem[]>(() => {
    const merged: ExtendedVocabularyItem[] = [...VOCABULARY_BANK];
    const seenTerms = new Set(merged.map((item) => item.term.toLowerCase().trim()));

    artifacts.forEach((artifact) => {
      let themeId: VocabularyThemeId = 'architecture';
      if (artifact.category === 'musical_instrument') themeId = 'music_dance';
      else if (artifact.category === 'weaving_craft') themeId = 'weaving_brocade';
      else if (artifact.category === 'spiritual_sculpture') themeId = 'ritual_spirit';

      const themeMeta = VOCABULARY_THEMES.find((th) => th.id === themeId) || VOCABULARY_THEMES[0];

      artifact.vocabulary.forEach((v) => {
        const normalized = v.term.toLowerCase().trim();
        if (!seenTerms.has(normalized)) {
          seenTerms.add(normalized);
          merged.push({
            ...v,
            themeId,
            themeName: themeMeta.name,
            relatedArtifactSlug: artifact.slug,
            relatedArtifactName: artifact.name
          });
        }
      });
    });

    return merged;
  }, [artifacts]);

  // Lọc từ vựng theo chủ đề & ô tìm kiếm
  const filteredWords = useMemo(() => {
    let baseList = fullVocabularyList;

    if (selectedTheme !== 'all') {
      baseList = fullVocabularyList.filter((w) => w.themeId === selectedTheme);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      baseList = baseList.filter(
        (w) =>
          w.term.toLowerCase().includes(q) ||
          w.vietnameseMeaning.toLowerCase().includes(q) ||
          (w.englishDefinition && w.englishDefinition.toLowerCase().includes(q)) ||
          (w.exampleSentence &&
            (w.exampleSentence.en.toLowerCase().includes(q) ||
              w.exampleSentence.vi.toLowerCase().includes(q)))
      );
    }

    return baseList;
  }, [fullVocabularyList, selectedTheme, searchQuery]);

  const handleSpeakTerm = (word: ExtendedVocabularyItem) => {
    const cleanEnglish = word.term.replace(/\s*\(.*?\)\s*/g, '').trim();
    speechService.speak(cleanEnglish || word.term, 'en');
    analyticsService.trackVocabLookup(
      word.term,
      word.vietnameseMeaning,
      word.relatedArtifactName.vi,
      word.relatedArtifactName.en
    );
  };

  const handleSpeakSentence = (sentenceEn: string) => {
    speechService.speak(sentenceEn, 'en');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header Banner - Deep Forest Atmosphere */}
      <div className="forest-stage-dark text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-heritage-ochre/15 border border-heritage-ochre/30 text-heritage-ochre text-xs font-semibold">
              <Compass className="w-4 h-4 text-heritage-ochre" />
              <span>
                {t('Hành trang Đại sứ Văn hóa Tây Giang', 'Cultural Ambassador Vocabulary Hub')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-white leading-tight">
              {t(
                'Kho Từ Vựng & Thuật Ngữ Di Sản Cơ Tu',
                'Cơ Tu Heritage Vocabulary & Lexicon Library'
              )}
            </h1>
            <p className="text-xs sm:text-sm text-heritage-wood/85 leading-relaxed">
              {t(
                `Khám phá trọn bộ ${fullVocabularyList.length} thuật ngữ tiếng Anh chuyên sâu về kiến trúc Nhà Gươl, nhạc cụ núi rừng, nghề đan lát, thổ cẩm, ẩm thực đại ngàn và mẫu câu thuyết minh du lịch.`,
                `Explore all ${fullVocabularyList.length} curated English terms covering Gươl architecture, mountain instruments, rattan basketry, brocade weaving, forest cuisine, and tour guiding.`
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="px-3.5 py-2.5 rounded-2xl bg-[#0D1813]/80 border border-heritage-ochre/20 text-heritage-wood text-center">
                <span className="block text-[10px] uppercase tracking-wider text-heritage-ochre/70">
                  {t('Thuật ngữ', 'Total Terms')}
                </span>
                <strong className="text-heritage-wood text-base sm:text-lg font-bold">
                  {fullVocabularyList.length}
                </strong>
              </div>
              <div className="px-3.5 py-2.5 rounded-2xl bg-[#0D1813]/80 border border-heritage-ochre/20 text-heritage-wood text-center">
                <span className="block text-[10px] uppercase tracking-wider text-heritage-ochre/70">
                  {t('Chủ đề', 'Themes')}
                </span>
                <strong className="text-heritage-ochre text-base sm:text-lg font-bold">
                  {VOCABULARY_THEMES.length}
                </strong>
              </div>
              <div className="px-3.5 py-2.5 rounded-2xl bg-[#0D1813]/80 border border-heritage-ochre/20 text-heritage-wood text-center">
                <span className="block text-[10px] uppercase tracking-wider text-heritage-ochre/70">
                  {t('Câu hỏi Quiz', 'Quiz Qs')}
                </span>
                <strong className="text-heritage-ochre text-base sm:text-lg font-bold">
                  {QUIZ_QUESTIONS.length}
                </strong>
              </div>
            </div>

            <Link
              to="/artifacts"
              className="px-4 py-2.5 rounded-2xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>
                {t(
                  'Xem Hiện vật 3D & Chơi Mini-Game từng phần',
                  'Explore 3D Artifacts & Mini-Games'
                )}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Optional Fun Exercise / Quiz Opt-in Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0A150E]/95 via-[#0E1E16]/95 to-[#0A150E]/95 border border-heritage-ochre/25 p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0 text-amber-300">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-semibold text-white">
                {t(
                  'Bạn có muốn làm bài tập / Quiz tổng hợp vui vẻ không?',
                  'Would you like to take the optional Fun Practice Quiz?'
                )}
              </h2>
              <p className="text-xs text-heritage-wood/80 mt-0.5">
                {t(
                  'Hoàn toàn tự chọn! Ngoài ra, khi vào xem và nghe thuyết minh từng Hiện vật 3D, bạn còn có Mini-Game Ghép Cặp riêng của hiện vật đó.',
                  'Completely optional! Also, whenever you view or listen to any 3D Artifact, you can play its dedicated Matching Mini-Game.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFunQuiz(!showFunQuiz)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                showFunQuiz
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  : 'bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 shadow-sm'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>
                {showFunQuiz
                  ? t('Đóng bài tập vui', 'Hide Fun Quiz')
                  : t('Có, mở Quiz vui vẻ (20 câu)!', 'Yes, open Fun Quiz (20 Qs)!')}
              </span>
            </button>
          </div>
        </div>

        {/* Collapsible Fun Quiz Area */}
        {showFunQuiz && (
          <div className="mt-5 pt-5 border-t border-white/15 animate-in fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t('Góc Bài Tập & Quiz Vui Vẻ (Tự chọn)', 'Optional Fun Practice Quiz')}
              </span>
              <button
                onClick={() => setShowFunQuiz(false)}
                className="text-xs text-heritage-ochre hover:text-heritage-wood flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('Thu gọn', 'Close')}</span>
              </button>
            </div>
            <VocabularyQuiz questions={QUIZ_QUESTIONS} />
          </div>
        )}
      </div>

      {/* Search & Theme Filter Controls */}
      <div className="bg-[#0A120E]/90 backdrop-blur-md rounded-3xl border border-[#23352C] p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-heritage-woodMuted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                `Tìm kiếm trong ${fullVocabularyList.length} từ vựng (tiếng Anh, nghĩa tiếng Việt, câu ví dụ)...`,
                `Search across ${fullVocabularyList.length} terms (English term, Vietnamese meaning, or example)...`
              )}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#0D1813]/80 border border-[#23352C] text-heritage-wood placeholder:text-heritage-woodMuted focus:outline-none focus:border-heritage-ochre transition-colors"
              style={{ fontSize: '16px' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-heritage-woodMuted hover:text-heritage-wood"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toggle 3D Flashcard Deck */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFlashcardDeck(!showFlashcardDeck)}
              className="px-4 py-2.5 rounded-2xl border border-[#23352C] bg-[#0D1813]/80 hover:bg-[#14221A] text-heritage-wood text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Layers className="w-4 h-4 text-heritage-ochre" />
              <span>
                {showFlashcardDeck
                  ? t('Thu gọn Thẻ lật 3D', 'Hide 3D Flashcard Deck')
                  : t('Mở Thẻ lật 3D', 'Show 3D Flashcard Deck')}
              </span>
              {showFlashcardDeck ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:flex-wrap sm:pb-0">
          <button
            onClick={() => setSelectedTheme('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedTheme === 'all'
                ? 'bg-heritage-ochre text-slate-950 shadow-xs'
                : 'bg-[#0A120E] text-heritage-woodMuted border border-[#1E3029] hover:bg-[#14221A] hover:text-heritage-wood'
            }`}
          >
            <span>{t('Tất cả chủ đề', 'All Themes')}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/15 text-[10px]">
              {fullVocabularyList.length}
            </span>
          </button>

          {VOCABULARY_THEMES.map((theme) => {
            const count = fullVocabularyList.filter((w) => w.themeId === theme.id).length;
            const isActive = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-heritage-ochre text-slate-950 shadow-xs'
                    : 'bg-[#0A120E] text-heritage-woodMuted border border-[#1E3029] hover:bg-[#14221A] hover:text-heritage-wood'
                }`}
              >
                <span>{t(theme.name.vi, theme.name.en)}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-black/10 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapsible 3D Flashcard Deck Section */}
      {showFlashcardDeck && (
        <div className="bg-[#0D1813]/90 backdrop-blur-md rounded-3xl border border-[#23352C] p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#23352C] pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-ochre flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t('Luyện Tập Phản Xạ Thẻ Lật 3D', 'Interactive 3D Flashcard Deck')}
              </span>
              <p className="text-xs text-heritage-woodMuted mt-0.5">
                {t(
                  `Đang nạp ${filteredWords.length} thẻ từ vựng theo bộ lọc hiện tại. Nhấn vào thẻ để lật xem nghĩa và câu ví dụ.`,
                  `Loaded ${filteredWords.length} flashcards matching your current filter. Tap the card to flip.`
                )}
              </p>
            </div>
          </div>

          <FlashcardViewer items={filteredWords} />
        </div>
      )}

      {/* Full Vocabulary Library Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-2xl font-serif font-semibold text-heritage-wood flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-heritage-ochre" />
              <span>
                {t(
                  `Danh mục Chi tiết (${filteredWords.length} thuật ngữ)`,
                  `Detailed Vocabulary Directory (${filteredWords.length} terms)`
                )}
              </span>
            </h2>
            <p className="text-xs text-heritage-woodMuted">
              {t(
                'Bấm vào nút Phát âm trên từng thẻ để nghe cách đọc thuật ngữ và câu mẫu thuyết minh bằng tiếng Anh.',
                'Click the Listen button on any card to hear both the English term and its example sentence.'
              )}
            </p>
          </div>
        </div>

        {filteredWords.length === 0 ? (
          <div className="bg-[#0D1813]/80 rounded-3xl border border-[#23352C] p-10 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-heritage-ochre mx-auto" />
            <h3 className="text-base font-serif font-semibold text-heritage-wood">
              {t('Không tìm thấy từ vựng phù hợp', 'No matching vocabulary found')}
            </h3>
            <p className="text-xs text-heritage-woodMuted max-w-md mx-auto">
              {t(
                'Hãy thử xóa từ khóa tìm kiếm hoặc chuyển sang chủ đề "Tất cả chủ đề" để xem toàn bộ kho từ vựng.',
                'Try clearing your search query or switching to "All Themes" to browse the entire lexicon.'
              )}
            </p>
            <button
              onClick={() => {
                setSelectedTheme('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-heritage-ochre text-slate-950 text-xs font-semibold"
            >
              {t('Xem tất cả từ vựng', 'Show all vocabulary')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredWords.map((word, index) => (
              <div
                key={word.id}
                className="bg-[#0D1813]/90 rounded-2xl border border-[#23352C] hover:border-heritage-ochre/50 p-5 shadow-xs hover:shadow-heritage transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top row: Index + Theme Badge + Audio */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#14221A] border border-heritage-ochre/25 text-[10px] font-semibold text-heritage-ochre truncate">
                      #{index + 1} · {t(word.themeName.vi, word.themeName.en)}
                    </span>

                    <button
                      onClick={() => handleSpeakTerm(word)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#14221A] hover:bg-heritage-ochre hover:text-slate-950 text-heritage-ochre text-[11px] font-semibold transition-colors flex items-center gap-1 shrink-0"
                      title={t('Nghe phát âm tiếng Anh', 'Listen to pronunciation')}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{t('Phát âm', 'Listen')}</span>
                    </button>
                  </div>

                  {/* Term & IPA */}
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-heritage-wood leading-snug">
                      {word.term}
                    </h3>
                    {word.ipa && (
                      <p className="text-xs font-mono text-heritage-clay mt-0.5">{word.ipa}</p>
                    )}
                  </div>

                  {/* Vietnamese Meaning */}
                  <div className="p-3 rounded-xl bg-[#15231B] border border-[#23352C]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-woodMuted block">
                      {t('Nghĩa tiếng Việt', 'Vietnamese Meaning')}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-heritage-wood mt-0.5">
                      {word.vietnameseMeaning}
                    </p>
                  </div>

                  {/* English Definition */}
                  {word.englishDefinition && (
                    <p className="text-xs text-heritage-woodLight italic leading-relaxed">
                      "{word.englishDefinition}"
                    </p>
                  )}

                  {/* Example Sentence */}
                  {word.exampleSentence && (
                    <div className="p-3 rounded-xl bg-[#0A120E] border border-[#23352C] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-ochre">
                          {t('Câu ví dụ thuyết minh', 'Example in Context')}
                        </span>
                        <button
                          onClick={() => handleSpeakSentence(word.exampleSentence!.en)}
                          className="text-[10px] font-semibold text-heritage-ochre hover:underline flex items-center gap-0.5"
                          title={t('Nghe đọc cả câu', 'Listen to full sentence')}
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{t('Đọc câu', 'Read')}</span>
                        </button>
                      </div>
                      <p className="font-medium text-heritage-wood leading-relaxed">
                        {word.exampleSentence.en}
                      </p>
                      <p className="text-heritage-woodMuted leading-relaxed">
                        {word.exampleSentence.vi}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Link to Related 3D Artifact & Mini-Game */}
                <div className="pt-3 border-t border-heritage-sand/50 flex items-center justify-between text-[11px] text-heritage-woodMuted">
                  <span className="truncate">
                    {t('Hiện vật:', 'Artifact:')}{' '}
                    <strong className="text-heritage-wood">
                      {t(word.relatedArtifactName.vi, word.relatedArtifactName.en)}
                    </strong>
                  </span>
                  <Link
                    to={`/artifacts/${word.relatedArtifactSlug}`}
                    className="text-heritage-ochre hover:underline font-semibold shrink-0 ml-2 flex items-center gap-0.5"
                  >
                    <span>{t('Xem 3D & Mini-Game', '3D & Mini-Game')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
