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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E3029] pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-heritage-ochre/15 border border-heritage-ochre/30 text-heritage-ochre text-xs font-semibold">
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
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-rose-800/40 text-rose-400 hover:bg-rose-950/40 text-xs font-medium transition-colors flex items-center space-x-1.5 min-h-[40px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('Xóa toàn bộ sổ tay', 'Clear All Words')}</span>
          </button>
        )}
      </div>

      {/* LocalStorage Notice Banner */}
      <div className="p-4 rounded-xl bg-[#0D1813] border border-amber-600/30 text-heritage-wood/90 text-xs flex items-start space-x-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-400">{t('Lưu ý về bộ nhớ:', 'Storage Note:')}</strong>{' '}
          {t(
            'Sổ tay từ vựng được lưu cục bộ trên trình duyệt máy/điện thoại này (LocalStorage). Dữ liệu không đồng bộ sang thiết bị khác và có thể bị mất nếu bạn xóa lịch sử duyệt web hoặc đổi trình duyệt.',
            'Your vocabulary notebook is saved locally in this browser (LocalStorage). Data does not sync across devices and may be cleared if you wipe browser site data.'
          )}
        </p>
      </div>

      {/* Stats Summary & Filters */}
      {words.length > 0 && (
        <div className="bg-[#0D1813]/90 rounded-2xl border border-[#1E3029] p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-4 text-xs sm:text-sm">
              <span className="text-heritage-wood">
                {t('Tổng số từ:', 'Total:')}{' '}
                <strong className="text-heritage-ochre font-bold">{words.length}</strong>
              </span>
              <span className="text-heritage-wood">
                {t('Đã ghi nhớ:', 'Mastered:')}{' '}
                <strong className="text-emerald-400 font-bold">{learnedCount}</strong>
              </span>
              <span className="text-heritage-wood">
                {t('Cần ôn lại:', 'To review:')}{' '}
                <strong className="text-amber-400 font-bold">{words.length - learnedCount}</strong>
              </span>
            </div>

            {/* Link to Flashcards & Quiz */}
            <div className="flex items-center space-x-2">
              <Link
                to="/learn"
                className="px-3.5 py-1.5 rounded-xl bg-heritage-ochre text-slate-950 text-xs font-bold hover:bg-heritage-ochreLight transition-colors flex items-center space-x-1 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('Ôn tập Flashcard', 'Practice Flashcards')}</span>
              </Link>
            </div>
          </div>

          {/* Search & Filter pills */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#1E3029]">
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
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-[#0A120E] border border-[#1E3029] text-heritage-wood placeholder-heritage-woodMuted focus:outline-none focus:ring-1 focus:ring-heritage-ochre"
              />
            </div>

            {/* Filter buttons */}
            <div className="inline-flex p-1 bg-[#0A120E] rounded-xl border border-[#1E3029] self-start sm:self-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-heritage-ochre text-slate-950 font-bold'
                    : 'text-heritage-wood/70 hover:bg-[#14221A] hover:text-heritage-wood'
                }`}
              >
                {t('Tất cả', 'All')} ({words.length})
              </button>
              <button
                onClick={() => setFilter('unlearned')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filter === 'unlearned'
                    ? 'bg-heritage-ochre text-slate-950 font-bold'
                    : 'text-heritage-wood/70 hover:bg-[#14221A] hover:text-heritage-wood'
                }`}
              >
                {t('Chưa thuộc', 'Learning')} ({words.length - learnedCount})
              </button>
              <button
                onClick={() => setFilter('learned')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filter === 'learned'
                    ? 'bg-heritage-ochre text-slate-950 font-bold'
                    : 'text-heritage-wood/70 hover:bg-[#14221A] hover:text-heritage-wood'
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
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 bg-[#0D1813]/90 shadow-xs ${
                item.learned
                  ? 'border-emerald-600/40 bg-[#0E1A14]/90'
                  : 'border-[#1E3029] hover:border-heritage-ochre/40'
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
                      className="p-1 rounded-md text-heritage-ochre hover:bg-[#14221A] transition-colors"
                      title={t('Nghe phát âm', 'Listen to pronunciation')}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.ipa && (
                    <span className="text-xs font-mono text-heritage-ochre">
                      {item.ipa}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggleLearned(item.id)}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors min-h-[36px] ${
                    item.learned
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-600/40 hover:bg-emerald-900/60'
                      : 'text-heritage-woodMuted bg-[#0A120E] border border-[#1E3029] hover:text-heritage-wood'
                  }`}
                  title={
                    item.learned
                      ? t('Đánh dấu chưa thuộc', 'Mark as unlearned')
                      : t('Đánh dấu đã thuộc', 'Mark as mastered')
                  }
                >
                  {item.learned ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
              <div className="p-3 rounded-xl bg-[#15231B] border border-[#1E3029] text-xs sm:text-sm">
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
                <div className="text-xs space-y-0.5 text-heritage-woodMuted border-l-2 border-heritage-ochre/40 pl-2.5">
                  <p className="font-medium text-heritage-wood">{item.exampleSentence.en}</p>
                  <p className="italic text-heritage-woodMuted">{item.exampleSentence.vi}</p>
                </div>
              )}

              {/* Source artifact link & Delete */}
              <div className="pt-2 border-t border-[#1E3029] flex items-center justify-between text-xs text-heritage-woodMuted">
                <Link
                  to={`/artifacts/${item.sourceArtifactSlug}`}
                  className="hover:text-heritage-ochre flex items-center space-x-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">
                    {t('Từ:', 'From:')} {t(item.sourceArtifactName.vi, item.sourceArtifactName.en)}
                  </span>
                </Link>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-1 text-heritage-woodMuted hover:text-rose-400 transition-colors"
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
        <div className="bg-[#0D1813]/60 rounded-2xl border border-[#1E3029] p-10 text-center max-w-md mx-auto space-y-4">
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
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-heritage-ochre text-slate-950 text-xs font-bold hover:bg-heritage-ochreLight transition-colors shadow"
            >
              <span>{t('Khám phá hiện vật để lưu từ', 'Explore Artifacts to Save Words')}</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#14221A] text-heritage-wood text-xs font-semibold hover:bg-heritage-ochre hover:text-slate-950 transition-colors"
            >
              {t('Xem lại tất cả từ vựng', 'Show All Saved Words')}
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal to Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1813] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-[#1E3029] animate-in fade-in zoom-in-95 text-heritage-wood">
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto">
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
                className="flex-1 py-2.5 rounded-xl bg-[#14221A] hover:bg-[#1C2F24] border border-[#1E3029] text-heritage-wood text-xs font-semibold min-h-[44px]"
              >
                {t('Hủy bỏ', 'Cancel')}
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold min-h-[44px]"
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
