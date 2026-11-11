import React, { useState } from 'react';
import { SavedVocabularyItem, VocabularyItem } from '../../types';
import { 
  RotateCw, 
  Volume2, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { notebookService } from '../../services/notebookService';
import { useLanguage } from '../../contexts/LanguageContext';

interface FlashcardViewerProps {
  items: (VocabularyItem | SavedVocabularyItem)[];
  onToggleLearned?: (id: string) => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  items,
  onToggleLearned
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const { t } = useLanguage();

  if (!items || items.length === 0) {
    return (
      <div className="text-center p-8 bg-heritage-cream/50 rounded-2xl border border-heritage-sand">
        <BookOpen className="w-12 h-12 text-heritage-clay mx-auto mb-2" />
        <h4 className="font-serif font-semibold text-base text-heritage-wood">
          {t('Chưa có thẻ từ vựng nào', 'No Flashcards Available')}
        </h4>
        <p className="text-xs text-heritage-woodMuted mt-1">
          {t(
            'Hãy khám phá các trang hiện vật và lưu từ mới vào sổ tay để ôn tập Flashcard.',
            'Explore artifact pages and save new vocabulary terms to your notebook to practice with Flashcards.'
          )}
        </p>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const isLearned = 'learned' in currentItem ? currentItem.learned : false;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.speak(currentItem.term, 'en');
  };

  const handleLearnedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleLearned) {
      onToggleLearned(currentItem.id);
    } else {
      notebookService.toggleLearned(currentItem.id);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Progress Counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-heritage-woodMuted">
        <span>
          {t('Thẻ', 'Card')} {currentIndex + 1} / {items.length}
        </span>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center space-x-1 text-heritage-clay hover:text-heritage-clayDark"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{t('Nhấn thẻ để lật', 'Tap card to flip')}</span>
        </button>
      </div>

      {/* Card Element */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full aspect-[4/3] sm:aspect-[16/11] cursor-pointer perspective-1000 select-none"
      >
        <div
          className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-heritage-lg border-2 border-heritage-sand ${
            isFlipped ? 'rotate-y-180 bg-heritage-cream' : 'bg-white'
          }`}
        >
          {/* FRONT OF CARD */}
          <div
            className={`absolute inset-0 p-6 flex flex-col justify-between backface-hidden ${
              isFlipped ? 'hidden' : 'flex'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-clay">
                {t('Mặt trước · Thuật ngữ', 'Front · English Term')}
              </span>
              <button
                onClick={handleLearnedClick}
                className="flex items-center space-x-1 text-xs text-heritage-woodMuted hover:text-emerald-700"
                title={t('Đánh dấu đã học', 'Mark as learned')}
              >
                {isLearned ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">{t('Đã thuộc', 'Mastered')}</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>{t('Chưa thuộc', 'Learning')}</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center space-y-2 my-auto">
              <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-heritage-wood">
                {currentItem.term}
              </h3>
              {currentItem.ipa && (
                <p className="text-sm font-mono text-heritage-clay font-medium">
                  {currentItem.ipa}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-heritage-sand/60">
              <button
                onClick={handleSpeak}
                className="p-2 rounded-lg bg-heritage-sand/40 hover:bg-heritage-sand text-heritage-wood transition-colors flex items-center space-x-1 text-xs"
                title={t('Nghe phát âm', 'Listen to pronunciation')}
              >
                <Volume2 className="w-4 h-4 text-heritage-clay" />
                <span>{t('Phát âm', 'Listen')}</span>
              </button>

              <span className="text-[11px] text-heritage-woodMuted flex items-center space-x-1">
                <RotateCw className="w-3 h-3" />
                <span>{t('Chạm để xem nghĩa', 'Tap to see meaning')}</span>
              </span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div
            className={`absolute inset-0 p-6 flex flex-col justify-between bg-heritage-ivory rounded-2xl ${
              isFlipped ? 'flex' : 'hidden'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-clay">
                {t('Mặt sau · Ý nghĩa & Ví dụ', 'Back · Meaning & Example')}
              </span>
              <span className="text-xs font-semibold text-heritage-wood">
                {currentItem.term}
              </span>
            </div>

            <div className="space-y-3 my-auto">
              <div className="p-3 bg-heritage-cream rounded-xl border border-heritage-sand text-center">
                <span className="text-[11px] text-heritage-woodMuted block uppercase">
                  {t('Nghĩa tiếng Việt', 'Vietnamese Meaning')}
                </span>
                <span className="text-base sm:text-lg font-bold text-heritage-wood">
                  {currentItem.vietnameseMeaning}
                </span>
              </div>

              {currentItem.englishDefinition && (
                <div className="text-xs text-heritage-woodLight italic text-center">
                  "{currentItem.englishDefinition}"
                </div>
              )}

              {currentItem.exampleSentence && (
                <div className="p-2.5 rounded-lg bg-heritage-sand/30 text-xs space-y-1">
                  <p className="font-medium text-heritage-wood">
                    {currentItem.exampleSentence.en}
                  </p>
                  <p className="text-heritage-woodMuted">
                    {currentItem.exampleSentence.vi}
                  </p>
                </div>
              )}
            </div>

            <div className="text-center text-[11px] text-heritage-woodMuted pt-2 border-t border-heritage-sand/60">
              {t('Chạm để lật lại mặt trước', 'Tap to flip back')}
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="px-4 py-2 rounded-xl bg-heritage-sand/50 hover:bg-heritage-sand text-heritage-wood text-xs font-semibold transition-colors flex items-center space-x-1 min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('Thẻ trước', 'Previous')}</span>
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-xl bg-heritage-clay hover:bg-heritage-clayDark text-white text-xs font-semibold transition-colors flex items-center space-x-1 shadow-md min-h-[44px]"
        >
          <span>{t('Thẻ tiếp theo', 'Next Card')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
