import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notebookService } from '../services/notebookService';
import { SavedVocabularyItem } from '../types';
import { 
  BookMarked, 
  Trash2, 
  Volume2, 
  CheckCircle2, 
  Circle, 
  Search, 
  AlertCircle, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { useLanguage } from '../contexts/LanguageContext';

export const NotebookPage: React.FC = () => {
  const [words, setWords] = useState<SavedVocabularyItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unlearned' | 'learned'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const { t } = useLanguage();

  const loadWords = () => {
    setWords(notebookService.getAll());
  };

  useEffect(() => {
    loadWords();
    window.addEventListener('cotu_notebook_updated', loadWords);
    return () => window.removeEventListener('cotu_notebook_updated', loadWords);
  }, []);

  const handleToggleLearned = (id: string) => {
    notebookService.toggleLearned(id);
    loadWords();
  };

  const handleRemove = (id: string) => {
    notebookService.remove(id);
    loadWords();
  };

  const handleClearAll = () => {
    notebookService.clearAll();
    setShowClearConfirm(false);
    loadWords();
  };

  const handleSpeak = (term: string) => {
    speechService.speak(term, 'en');
  };

  const filteredWords = words.filter((w) => {
    if (filter === 'unlearned' && w.learned) return false;
    if (filter === 'learned' && !w.learned) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTerm = w.term.toLowerCase().includes(q);
      const matchMeaning = w.vietnameseMeaning.toLowerCase().includes(q);
      return matchTerm || matchMeaning;
    }

    return true;
  });

  const learnedCount = words.filter((w) => w.learned).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-heritage-sand/80 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-heritage-clay/10 text-heritage-clay text-xs font-semibold">
            <BookMarked className="w-3.5 h-3.5" />
            <span>{t('Sổ tay cá nhân', 'Personal Notebook')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {t('Sổ Tay Từ Vựng Di Sản', 'Heritage Vocabulary Notebook')}
          </h1>
          <p className="text-xs sm:text-sm text-heritage-woodMuted max-w-xl">
            {t(
              'Lưu giữ và rèn luyện các thuật ngữ văn hóa Cơ Tu từ các trang hiện vật. Dữ liệu được lưu trữ trực tiếp trên trình duyệt của bạn.',
              'Save and review Cơ Tu cultural terminology collected from artifact pages. Your vocabulary list is stored directly in your browser.'
            )}
          </p>
        </div>

        {words.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors flex items-center space-x-1.5 min-h-[40px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('Xóa toàn bộ sổ tay', 'Clear All Words')}</span>
          </button>
        )}
      </div>

      {/* LocalStorage Notice Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <p className="leading-relaxed">
          <strong>{t('Lưu ý về bộ nhớ:', 'Storage Note:')}</strong>{' '}
          {t(
            'Sổ tay từ vựng được lưu cục bộ trên trình duyệt máy/điện thoại này (LocalStorage). Dữ liệu không đồng bộ sang thiết bị khác và có thể bị mất nếu bạn xóa lịch sử duyệt web hoặc đổi trình duyệt.',
            'Your vocabulary notebook is saved locally in this browser (LocalStorage). Data does not sync across devices and may be cleared if you wipe browser site data.'
          )}
        </p>
      </div>

      {/* Stats Summary & Filters */}
      {words.length > 0 && (
        <div className="bg-heritage-cream/60 rounded-2xl border border-heritage-sand p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-4 text-xs sm:text-sm">
              <span className="text-heritage-wood">
                {t('Tổng số từ:', 'Total:')}{' '}
                <strong className="text-heritage-clay font-bold">{words.length}</strong>
              </span>
              <span className="text-heritage-wood">
                {t('Đã ghi nhớ:', 'Mastered:')}{' '}
                <strong className="text-emerald-700 font-bold">{learnedCount}</strong>
              </span>
              <span className="text-heritage-wood">
                {t('Cần ôn lại:', 'To review:')}{' '}
                <strong className="text-amber-700 font-bold">{words.length - learnedCount}</strong>
              </span>
            </div>

            {/* Link to Flashcards & Quiz */}
            <div className="flex items-center space-x-2">
              <Link
                to="/learn"
                className="px-3 py-1.5 rounded-lg bg-heritage-clay text-white text-xs font-semibold hover:bg-heritage-clayDark transition-colors flex items-center space-x-1 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('Ôn tập Flashcard', 'Practice Flashcards')}</span>
              </Link>
            </div>
          </div>

          {/* Search & Filter pills */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-heritage-sand/60">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-heritage-woodMuted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(
                  'Tìm từ tiếng Anh hoặc nghĩa tiếng Việt trong sổ tay...',
                  'Search English terms or Vietnamese meanings in your notebook...'
                )}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-heritage-sand text-heritage-wood placeholder-heritage-woodMuted focus:outline-none focus:ring-2 focus:ring-heritage-clay"
              />
            </div>

            {/* Filter buttons */}
            <div className="inline-flex p-1 bg-white rounded-xl border border-heritage-sand self-start sm:self-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-heritage-clay text-white'
                    : 'text-heritage-wood hover:bg-heritage-cream'
                }`}
              >
                {t('Tất cả', 'All')} ({words.length})
              </button>
              <button
                onClick={() => setFilter('unlearned')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'unlearned'
                    ? 'bg-heritage-clay text-white'
                    : 'text-heritage-wood hover:bg-heritage-cream'
                }`}
              >
                {t('Chưa thuộc', 'Learning')} ({words.length - learnedCount})
              </button>
              <button
                onClick={() => setFilter('learned')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'learned'
                    ? 'bg-heritage-clay text-white'
                    : 'text-heritage-wood hover:bg-heritage-cream'
                }`}
              >
                {t('Đã thuộc', 'Mastered')} ({learnedCount})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Words List */}
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 bg-white shadow-xs ${
                item.learned
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-heritage-sand hover:border-heritage-sandDark'
              }`}
            >
              {/* Top: Term, Pronounce, and Learned Check */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-serif font-semibold text-heritage-wood">
                      {item.term}
                    </h3>
                    <button
                      onClick={() => handleSpeak(item.term)}
                      className="p-1 rounded-md text-heritage-clay hover:bg-heritage-cream transition-colors"
                      title={t('Nghe phát âm', 'Listen to pronunciation')}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.ipa && (
                    <span className="text-xs font-mono text-heritage-clay">
                      {item.ipa}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleLearned(item.id)}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors min-h-[36px] ${
                    item.learned
                      ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                      : 'text-heritage-woodMuted bg-heritage-cream hover:text-heritage-wood'
                  }`}
                  title={
                    item.learned
                      ? t('Đánh dấu chưa thuộc', 'Mark as unlearned')
                      : t('Đánh dấu đã thuộc', 'Mark as mastered')
                  }
                >
                  {item.learned ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t('Đã thuộc', 'Mastered')}</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>{t('Chưa thuộc', 'Learning')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Meaning */}
              <div className="p-3 rounded-xl bg-heritage-cream/60 border border-heritage-sand/60 text-xs sm:text-sm">
                <span className="font-semibold text-heritage-wood">
                  {item.vietnameseMeaning}
                </span>
                {item.englishDefinition && (
                  <p className="text-xs text-heritage-woodLight italic mt-1">
                    "{item.englishDefinition}"
                  </p>
                )}
              </div>

              {/* Example sentence */}
              {item.exampleSentence && (
                <div className="text-xs space-y-0.5 text-heritage-woodMuted border-l-2 border-heritage-sand pl-2.5">
                  <p className="font-medium text-heritage-wood">{item.exampleSentence.en}</p>
                  <p className="italic">{item.exampleSentence.vi}</p>
                </div>
              )}

              {/* Source artifact link & Delete */}
              <div className="pt-2 border-t border-heritage-sand/40 flex items-center justify-between text-xs text-heritage-woodMuted">
                <Link
                  to={`/artifacts/${item.sourceArtifactSlug}`}
                  className="hover:text-heritage-clay flex items-center space-x-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">
                    {t('Từ:', 'From:')} {t(item.sourceArtifactName.vi, item.sourceArtifactName.en)}
                  </span>
                </Link>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-1 text-heritage-woodMuted hover:text-rose-600 transition-colors"
                  title={t('Xóa khỏi sổ tay', 'Remove from notebook')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-heritage-cream/40 rounded-2xl border border-heritage-sand p-10 text-center max-w-md mx-auto space-y-4">
          <BookMarked className="w-12 h-12 mx-auto text-heritage-woodMuted opacity-60" />
          <h3 className="font-serif font-semibold text-lg text-heritage-wood">
            {words.length === 0
              ? t('Sổ tay từ vựng đang trống', 'Your Vocabulary Notebook is Empty')
              : t('Không có từ nào khớp với bộ lọc', 'No words match your filter')}
          </h3>
          <p className="text-xs text-heritage-woodMuted leading-relaxed">
            {words.length === 0
              ? t(
                  'Khi khám phá trang chi tiết hiện vật, bấm vào các thuật ngữ tiếng Anh để lưu vào Sổ tay của bạn.',
                  'While exploring artifact detail pages, click on English vocabulary terms to save them to your Notebook.'
                )
              : t(
                  'Hãy thử đổi bộ lọc hoặc xóa từ khóa tìm kiếm.',
                  'Try changing the filter or clearing your search query.'
                )}
          </p>
          {words.length === 0 ? (
            <Link
              to="/artifacts"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-heritage-clay text-white text-xs font-semibold hover:bg-heritage-clayDark transition-colors shadow"
            >
              <span>{t('Khám phá hiện vật để lưu từ', 'Explore Artifacts to Save Words')}</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-heritage-sand text-heritage-wood text-xs font-semibold"
            >
              {t('Xem lại tất cả từ vựng', 'Show All Saved Words')}
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal to Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-heritage-sand animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif font-semibold text-lg text-heritage-wood">
                {t('Xóa toàn bộ sổ tay?', 'Clear Entire Notebook?')}
              </h3>
              <p className="text-xs text-heritage-woodMuted">
                {t(
                  `Thao tác này sẽ xóa vĩnh viễn ${words.length} thuật ngữ đã lưu trên thiết bị của bạn. Bạn không thể hoàn tác.`,
                  `This will permanently delete all ${words.length} saved terms from this device. This action cannot be undone.`
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-heritage-sand/40 hover:bg-heritage-sand text-heritage-wood text-xs font-semibold min-h-[44px]"
              >
                {t('Hủy bỏ', 'Cancel')}
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold min-h-[44px]"
              >
                {t('Xác nhận xóa', 'Confirm Delete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
