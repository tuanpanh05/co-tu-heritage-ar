import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Headphones } from 'lucide-react';
import { speechService } from '../../services/speechService';

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
}

export const AudioGuidePlayer: React.FC<AudioGuidePlayerProps> = ({
  audioFiles,
  textToRead
}) => {
  const [selectedLang, setSelectedLang] = useState<'vi' | 'en'>('vi');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      if (activeAudioFile) {
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch((err) => {
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
    <div className="bg-heritage-cream/60 border border-heritage-sand rounded-2xl p-4 sm:p-5 space-y-3.5">
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
          <div className="w-8 h-8 rounded-lg bg-heritage-clay text-white flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-semibold text-heritage-wood">
              Thuyết minh âm thanh (Audio Guide)
            </h4>
            <span className="text-[11px] text-heritage-woodMuted">
              {activeAudioFile ? 'Bản thu âm chất lượng cao' : 'Trình đọc tự động thông minh (TTS)'}
            </span>
          </div>
        </div>

        <div className="inline-flex p-1 bg-white rounded-lg border border-heritage-sand self-start sm:self-auto">
          <button
            onClick={() => setSelectedLang('vi')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedLang === 'vi'
                ? 'bg-heritage-clay text-white'
                : 'text-heritage-woodLight hover:text-heritage-wood'
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            onClick={() => setSelectedLang('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              selectedLang === 'en'
                ? 'bg-heritage-clay text-white'
                : 'text-heritage-woodLight hover:text-heritage-wood'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-1">
        <button
          onClick={handlePlayToggle}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm min-h-[42px] ${
            isPlaying
              ? 'bg-heritage-ochre text-white hover:bg-heritage-ochreLight'
              : 'bg-heritage-clay text-white hover:bg-heritage-clayDark'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Tạm dừng thuyết minh</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Nghe thuyết minh ({selectedLang === 'vi' ? 'Tiếng Việt' : 'English'})</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-2.5 rounded-xl bg-white hover:bg-heritage-sand text-heritage-wood border border-heritage-sand text-xs font-medium transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center"
            title="Dừng hẳn"
          >
            <Square className="w-4 h-4" />
          </button>
        )}

        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-heritage-woodMuted ml-auto">
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-heritage-clay animate-pulse' : ''}`} />
          <span>{isPlaying ? 'Đang phát âm thanh...' : 'Sẵn sàng phát'}</span>
        </div>
      </div>
    </div>
  );
};
