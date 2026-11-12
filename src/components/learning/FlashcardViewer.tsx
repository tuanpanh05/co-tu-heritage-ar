import React, { useState, useEffect } from 'react';
import { VocabularyItem } from '../../types';
import {
  RotateCw,
  Volume2,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { useLanguage } from '../../contexts/LanguageContext';

interface FlashcardViewerProps {
  items: VocabularyItem[];
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [items.length]);

  if (!items || items.length === 0) {
    return (
      <div className="text-center p-8 bg-heritage-cream/50 rounded-2xl border border-heritage-sand">
        <BookOpen className="w-12 h-12 text-heritage-clay mx-auto mb-2" />
        <h4 className="font-serif font-semibold text-base text-heritage-wood">
          {t('Chưa có thẻ từ vựng nào', 'No Flashcards Available')}
        </h4>
        <p className="text-xs text-heritage-woodMuted mt-1">
          {t(
            'Hãy thử chọn chủ đề khác hoặc xóa từ khóa tìm kiếm để xem toàn bộ kho từ vựng.',
            'Try selecting another category or clearing your search query to view all vocabulary.'
          )}
        </p>
      </div>
    );
  }

  const safeIndex = currentIndex < items.length ? currentIndex : 0;
  const currentItem = items[safeIndex];

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
    const cleanEnglish = currentItem.term.replace(/\s*\(.*?\)\s*/g, '').trim();
    speechService.speak(cleanEnglish || currentItem.term, 'en');
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Progress Counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-heritage-woodMuted">
        <span>
          {t('Thẻ', 'Card')} {safeIndex + 1} / {items.length}
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
          className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-heritage-lg border border-[#23352C] ${
            isFlipped ? 'rotate-y-180 bg-[#121E18]' : 'bg-[#0E1813]'
          }`}
        >
          {/* FRONT OF CARD */}
          <div
            className={`absolute inset-0 p-6 flex flex-col justify-between backface-hidden ${
              isFlipped ? 'hidden' : 'flex'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-heritage-ochre">
                {t('Mặt trước · Thuật ngữ', 'Front · English Term')}
              </span>
              {currentItem.isCulturalSpecific && (
                <span className="px-2 py-0.5 rounded-lg bg-heritage-ochre/20 text-heritage-ochre border border-heritage-ochre/30 text-[10px] font-mono">
                  {t('Bản sắc Cơ Tu', 'Cơ Tu Specific')}
                </span>
              )}
            </div>

            <div className="text-center space-y-2 my-auto">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-heritage-wood">
                {currentItem.term}
              </h3>
              {currentItem.ipa && (
                <p className="text-sm font-mono text-heritage-clayLight font-medium">
                  {currentItem.ipa}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#23352C]">
              <button
                onClick={handleSpeak}
                className="p-2 rounded-lg bg-[#14221A] hover:bg-[#1A2C22] text-heritage-wood transition-colors flex items-center space-x-1 text-xs border border-[#23352C]"
                title={t('Nghe phát âm', 'Listen to pronunciation')}
              >
                <Volume2 className="w-4 h-4 text-heritage-ochre" />
                <span>{t('Phát âm', 'Listen')}</span>
              </button>

              <span className="text-[11px] text-heritage-woodMuted flex items-center space-x-1 font-mono">
                <RotateCw className="w-3 h-3 text-heritage-ochre" />
                <span>{t('Chạm để xem nghĩa', 'Tap to see meaning')}</span>
              </span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div
            className={`absolute inset-0 p-6 flex flex-col justify-between bg-[#101B15] rounded-2xl ${
              isFlipped ? 'flex' : 'hidden'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-heritage-ochre">
                {t('Mặt sau · Ý nghĩa & Ví dụ', 'Back · Meaning & Example')}
              </span>
              <span className="text-xs font-serif font-semibold text-heritage-wood truncate max-w-[160px]">
                {currentItem.term}
              </span>
            </div>

            <div className="space-y-3 my-auto">
              <div className="p-3 bg-[#15231B] rounded-xl border border-[#23352C] text-center">
                <span className="text-[10px] text-heritage-woodMuted block uppercase font-mono tracking-wider">
                  {t('Nghĩa tiếng Việt', 'Vietnamese Meaning')}
                </span>
                <span className="text-base sm:text-lg font-serif font-bold text-heritage-wood mt-0.5 block">
                  {currentItem.vietnameseMeaning}
                </span>
              </div>

              {currentItem.englishDefinition && (
                <div className="text-xs text-heritage-woodLight/90 italic text-center line-clamp-2">
                  "{currentItem.englishDefinition}"
                </div>
              )}

              {currentItem.exampleSentence && (
                <div className="p-2.5 rounded-lg bg-[#0A120E] border border-[#23352C] text-xs space-y-1">
                  <p className="font-medium text-heritage-wood line-clamp-2">
                    {currentItem.exampleSentence.en}
                  </p>
                  <p className="text-heritage-woodMuted line-clamp-2 italic">
                    {currentItem.exampleSentence.vi}
                  </p>
                </div>
              )}
            </div>

            <div className="text-center text-[11px] font-mono text-heritage-woodMuted pt-2 border-t border-[#23352C]">
              {t('Chạm để lật lại mặt trước', 'Tap to flip back')}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="px-4 py-2 rounded-lg bg-[#14221A] hover:bg-[#1A2C22] text-heritage-wood text-xs font-semibold transition-colors flex items-center space-x-1 min-h-[44px] border border-[#23352C]"
        >
          <ChevronLeft className="w-4 h-4 text-heritage-ochre" />
          <span>{t('Thẻ trước', 'Previous')}</span>
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs font-bold transition-colors flex items-center space-x-1 shadow-md min-h-[44px]"
        >
          <span>{t('Thẻ tiếp theo', 'Next Card')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
