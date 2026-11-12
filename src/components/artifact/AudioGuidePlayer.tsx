import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Headphones, Gamepad2, HelpCircle } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsService } from '../../services/analyticsService';

interface AudioGuidePlayerProps {
  audioFiles?: {
    vi?: string;
    en?: string;
  };
  textToRead: {
    vi: string;
    en: string;
  };
  artifactName?: string;
  onAudioTriggered?: () => void;
  onOpenChallenge?: (mode: 'quiz' | 'minigame') => void;
}

export const AudioGuidePlayer: React.FC<AudioGuidePlayerProps> = ({
  audioFiles,
  textToRead,
  artifactName = 'Hiện vật Cơ Tu',
  onAudioTriggered,
  onOpenChallenge
}) => {
  const { lang, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<'vi' | 'en'>(lang);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasListened, setHasListened] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSelectedLang(lang);
  }, [lang]);

  const activeAudioFile = audioFiles?.[selectedLang];
  const activeText = textToRead[selectedLang];

  useEffect(() => {
    handleStop();
  }, [selectedLang]);

  useEffect(() => {
    const unsub = speechService.subscribe((speaking) => {
      if (!activeAudioFile) {
        setIsPlaying(speaking);
      }
    });
    return () => {
      unsub();
      speechService.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeAudioFile]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      handleStop();
    } else {
      analyticsService.trackAudioPlay(artifactName, artifactName, selectedLang);
      setHasListened(true);
      if (onAudioTriggered) {
        onAudioTriggered();
      }
      if (activeAudioFile) {
        if (audioRef.current) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.warn('Lỗi audio file, chuyển sang Web Speech:', err);
              fallbackTTS();
            });
        }
      } else {
        fallbackTTS();
      }
    }
  };

  const fallbackTTS = () => {
    speechService.speak(activeText, selectedLang);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    speechService.stop();
    setIsPlaying(false);
  };

  return (
    <div className="bg-[#0D1813]/90 border border-[#1E3029] rounded-2xl p-4 sm:p-5 space-y-3.5">
      {activeAudioFile && (
        <audio
          ref={audioRef}
          src={activeAudioFile}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#14221A] border border-heritage-ochre/25 text-heritage-ochre flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-semibold text-heritage-wood">
              {t('Thuyết minh âm thanh (Audio Guide)', 'Bilingual Audio Guide')}
            </h4>
            <span className="text-[11px] text-heritage-woodMuted">
              {activeAudioFile
                ? t('Bản thu âm chất lượng cao', 'High-quality studio recording')
                : t('Trình đọc tự động thông minh (TTS)', 'Smart Web Speech API synthesis (TTS)')}
            </span>
          </div>
        </div>

        <div className="inline-flex p-1 bg-[#0A120E] rounded-lg border border-[#1E3029] self-start sm:self-auto">
          <button
            onClick={() => setSelectedLang('vi')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedLang === 'vi'
                ? 'bg-heritage-ochre text-slate-950 font-bold'
                : 'text-heritage-wood/70 hover:text-heritage-wood'
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            onClick={() => setSelectedLang('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedLang === 'en'
                ? 'bg-heritage-ochre text-slate-950 font-bold'
                : 'text-heritage-wood/70 hover:text-heritage-wood'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-1">
        <button
          onClick={handlePlayToggle}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm min-h-[42px] ${
            isPlaying
              ? 'bg-heritage-ochreLight text-slate-950'
              : 'bg-heritage-ochre text-slate-950 hover:bg-heritage-ochreLight'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>{t('Tạm dừng thuyết minh', 'Pause Audio Guide')}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>
                {t('Nghe thuyết minh', 'Listen to Guide')} (
                {selectedLang === 'vi' ? 'Tiếng Việt' : 'English'})
              </span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-2.5 rounded-xl bg-[#14221A] hover:bg-[#1E3029] text-heritage-wood border border-[#1E3029] text-xs font-medium transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center"
            title={t('Dừng hẳn', 'Stop')}
          >
            <Square className="w-4 h-4" />
          </button>
        )}

        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-heritage-woodMuted ml-auto">
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-heritage-ochre animate-pulse' : ''}`} />
          <span>
            {isPlaying
              ? t('Đang phát âm thanh...', 'Playing audio...')
              : t('Sẵn sàng phát', 'Ready to play')}
          </span>
        </div>
      </div>

      {/* Post-Audio Interactive Prompt */}
      {hasListened && onOpenChallenge && (
        <div className="pt-3 border-t border-[#1E3029] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in">
          <span className="text-xs font-medium text-heritage-wood">
            {t(
              '✨ Nghe xong thuyết minh? Thử tài về hiện vật này ngay:',
              '✨ Listened to the guide? Try an interactive challenge:'
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChallenge('quiz')}
              className="px-3 py-1.5 rounded-xl bg-[#14221A] hover:bg-[#1E3029] text-heritage-wood border border-[#1E3029] text-xs font-semibold flex items-center gap-1 shadow-xs transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-heritage-ochre" />
              <span>{t('Làm Quiz (4 câu)', 'Quick Quiz')}</span>
            </button>
            <button
              onClick={() => onOpenChallenge('minigame')}
              className="px-3 py-1.5 rounded-xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{t('Chơi Mini-Game', 'Mini-Game')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
