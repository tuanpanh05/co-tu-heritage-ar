import React, { useState, useEffect } from 'react';
import { VocabularyItem, Artifact } from '../../types';
import { Volume2, X, Info } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { useLanguage } from '../../contexts/LanguageContext';

interface VocabularyPopupProps {
  item: VocabularyItem | null;
  artifact: Artifact;
  onClose: () => void;
}

export const VocabularyPopup: React.FC<VocabularyPopupProps> = ({
  item,
  onClose
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    const unsub = speechService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  if (!item) return null;

  const handlePronounce = () => {
    if (item.audioFile) {
      const audio = new Audio(item.audioFile);
      audio.play().catch(() => {
        speechService.speak(item.term, 'en');
      });
    } else {
      speechService.speak(item.term, 'en');
    }
  };

  const handlePronounceExample = () => {
    if (item.exampleSentence?.en) {
      speechService.speak(item.exampleSentence.en, 'en');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet on mobile, centered modal on desktop */}
      <div className="relative z-10 w-full sm:max-w-lg bg-[#0D1813] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#1E3029] overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1E3029] bg-[#0A120E]">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-heritage-ochre/15 text-heritage-ochre border border-heritage-ochre/30 uppercase tracking-wider">
              {t('Thuật ngữ di sản', 'Heritage Term')}
            </span>
            {item.isCulturalSpecific && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40">
                {t('Đặc thù Cơ Tu', 'Cơ Tu Cultural Specific')}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-heritage-woodMuted hover:text-heritage-wood hover:bg-[#14221A] transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label={t('Đóng popup', 'Close popup')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Main Term & Pronunciation */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-heritage-wood tracking-tight">
                {item.term}
              </h3>
              {item.ipa && (
                <span className="inline-block text-xs sm:text-sm font-mono text-heritage-ochre font-medium mt-0.5">
                  {item.ipa}
                </span>
              )}
            </div>

            <button
              onClick={handlePronounce}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-w-[44px] min-h-[44px] ${
                isSpeaking
                  ? 'bg-heritage-ochre text-slate-950 border-heritage-ochre animate-pulse'
                  : 'bg-[#14221A] hover:bg-[#1E3029] text-heritage-ochre border-heritage-ochre/30'
              }`}
              title={t('Phát âm từ vựng', 'Pronounce term')}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Vietnamese meaning */}
          <div className="p-3.5 rounded-xl bg-[#15231B] border border-[#1E3029]">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-heritage-ochre/80 mb-1">
              {t('Nghĩa tiếng Việt', 'Vietnamese Meaning')}
            </div>
            <div className="text-base font-semibold text-heritage-wood">
              {item.vietnameseMeaning}
            </div>
          </div>

          {/* Simple English definition if available */}
          {item.englishDefinition && (
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-heritage-woodMuted mb-1">
                {t('Giải nghĩa tiếng Anh', 'English Definition')}
              </div>
              <p className="text-xs sm:text-sm text-heritage-woodLight leading-relaxed italic bg-[#0A120E] p-3 rounded-lg border border-[#1E3029]">
                "{item.englishDefinition}"
              </p>
            </div>
          )}

          {/* Cultural specific note if available */}
          {item.culturalNote && (
            <div className="flex items-start space-x-2 p-3 rounded-lg bg-[#18120A] border border-amber-800/40 text-xs text-amber-200">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">
                  {t('Ý nghĩa văn hóa:', 'Cultural Note:')}
                </span>{' '}
                {item.culturalNote}
              </div>
            </div>
          )}

          {/* Example in Context */}
          {item.exampleSentence && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-heritage-ochre/80">
                {t('Ví dụ trong ngữ cảnh hiện vật', 'Example in Artifact Context')}
              </div>
              <div className="p-3 rounded-xl bg-[#0A120E] border border-[#1E3029] space-y-1 text-xs sm:text-sm">
                <p className="font-medium text-heritage-wood">{item.exampleSentence.en}</p>
                <p className="text-heritage-woodMuted">{item.exampleSentence.vi}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#1E3029] bg-[#0A120E] flex items-center justify-between gap-2">
          {item.exampleSentence?.en ? (
            <button
              onClick={handlePronounceExample}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md min-h-[42px]"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t('Nghe đọc câu ví dụ', 'Listen to Example Sentence')}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#14221A] hover:bg-[#1E3029] text-heritage-wood border border-[#1E3029] text-xs sm:text-sm font-semibold transition-colors min-h-[42px]"
          >
            {t('Đóng', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
