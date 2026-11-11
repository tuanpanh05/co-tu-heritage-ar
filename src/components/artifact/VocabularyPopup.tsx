import React, { useState, useEffect } from 'react';
import { 
  VocabularyItem, 
  Artifact 
} from '../../types';
import { 
  Volume2, 
  BookMarked, 
  BookmarkCheck, 
  X, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { notebookService } from '../../services/notebookService';
import { useLanguage } from '../../contexts/LanguageContext';

interface VocabularyPopupProps {
  item: VocabularyItem | null;
  artifact: Artifact;
  onClose: () => void;
}

export const VocabularyPopup: React.FC<VocabularyPopupProps> = ({
  item,
  artifact,
  onClose
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (item) {
      setIsSaved(notebookService.isSaved(item.id));
    }
  }, [item]);

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

  const handleToggleSave = () => {
    if (isSaved) {
      notebookService.remove(item.id);
      setIsSaved(false);
    } else {
      const success = notebookService.save(item, artifact);
      if (success) {
        setIsSaved(true);
        setSaveSuccessMsg(true);
        setTimeout(() => setSaveSuccessMsg(false), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet on mobile, centered modal on desktop */}
      <div 
        className="relative z-10 w-full sm:max-w-lg bg-heritage-ivory rounded-t-3xl sm:rounded-2xl shadow-2xl border border-heritage-sand overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-heritage-sand bg-heritage-cream/60">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-heritage-clay/10 text-heritage-clay border border-heritage-clay/20 uppercase tracking-wider">
              {t('Thuật ngữ di sản', 'Heritage Term')}
            </span>
            {item.isCulturalSpecific && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-300">
                {t('Đặc thù Cơ Tu', 'Cơ Tu Cultural Specific')}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-heritage-woodMuted hover:text-heritage-wood hover:bg-heritage-sand/40 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
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
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-heritage-wood tracking-tight">
                {item.term}
              </h3>
              {item.ipa && (
                <span className="inline-block text-xs sm:text-sm font-mono text-heritage-clay font-medium mt-0.5">
                  {item.ipa}
                </span>
              )}
            </div>

            <button
              onClick={handlePronounce}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center min-w-[44px] min-h-[44px] ${
                isSpeaking
                  ? 'bg-heritage-clay text-white border-heritage-clay animate-pulse'
                  : 'bg-heritage-sand/40 hover:bg-heritage-sand text-heritage-wood border-heritage-sand'
              }`}
              title={t('Phát âm từ vựng', 'Pronounce term')}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Vietnamese meaning */}
          <div className="p-3.5 rounded-xl bg-heritage-cream border border-heritage-sand">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-heritage-woodMuted mb-1">
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
                English Definition (CLIL)
              </div>
              <p className="text-xs sm:text-sm text-heritage-woodLight leading-relaxed italic bg-white/70 p-3 rounded-lg border border-heritage-sand/40">
                "{item.englishDefinition}"
              </p>
            </div>
          )}

          {/* Cultural specific note if available */}
          {item.culturalNote && (
            <div className="flex items-start space-x-2 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900">
              <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <span className="font-semibold">{t('Ý nghĩa văn hóa:', 'Cultural Note:')}</span> {item.culturalNote}
              </div>
            </div>
          )}

          {/* Example in Context */}
          {item.exampleSentence && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-heritage-woodMuted">
                {t('Ví dụ trong ngữ cảnh hiện vật', 'Example in Artifact Context')}
              </div>
              <div className="p-3 rounded-xl bg-heritage-sand/20 border border-heritage-sand space-y-1 text-xs sm:text-sm">
                <p className="font-medium text-heritage-wood">
                  {item.exampleSentence.en}
                </p>
                <p className="text-heritage-woodMuted">
                  {item.exampleSentence.vi}
                </p>
              </div>
            </div>
          )}

          {/* Success toast when saved */}
          {saveSuccessMsg && (
            <div className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {t(
                  'Đã lưu vào Sổ tay từ vựng của bạn trên thiết bị này!',
                  'Saved to your Vocabulary Notebook on this device!'
                )}
              </span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-heritage-sand bg-heritage-cream/40 flex items-center justify-between">
          <div className="text-[11px] text-heritage-woodMuted">
            <span>{t('Lưu cục bộ trên trình duyệt', 'Saved locally in browser')}</span>
          </div>

          <button
            onClick={handleToggleSave}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${
              isSaved
                ? 'bg-heritage-sand text-heritage-wood border border-heritage-sandDark'
                : 'bg-heritage-clay hover:bg-heritage-clayDark text-white shadow-md'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-heritage-clay" />
                <span>{t('Đã lưu trong sổ tay', 'Saved in Notebook')}</span>
              </>
            ) : (
              <>
                <BookMarked className="w-4 h-4" />
                <span>{t('Lưu vào sổ tay từ vựng', 'Save to Notebook')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
