import React, { useState, useRef } from 'react';
import { VoiceShadowingScript } from '../../data/academicAnatomyData';
import { speechService } from '../../services/speechService';
import { analyticsService } from '../../services/analyticsService';
import { useLanguage } from '../../contexts/LanguageContext';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  Award,
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface VoiceShadowingSimulatorProps {
  scripts: VoiceShadowingScript[];
  artifactName?: string;
}

export const VoiceShadowingSimulator: React.FC<VoiceShadowingSimulatorProps> = ({
  scripts,
  artifactName = 'Di sản Cơ Tu'
}) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [matchedWordsSet, setMatchedWordsSet] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  if (!scripts || scripts.length === 0) return null;

  const currentScript = scripts[currentIndex < scripts.length ? currentIndex : 0];
  const targetWords = currentScript.englishSentence.split(/\s+/);

  const normalizeWord = (w: string) =>
    w
      .toLowerCase()
      .replace(/[.,!?;:'"’()-]/g, '')
      .trim();

  const evaluateTranscript = (transcript: string) => {
    const spokenList = transcript
      .split(/\s+/)
      .map(normalizeWord)
      .filter(Boolean);
    const spokenSet = new Set(spokenList);

    const matched = new Set<string>();
    let hitCount = 0;

    targetWords.forEach((tw) => {
      const cleanTw = normalizeWord(tw);
      if (!cleanTw) return;
      // Đối chiếu khớp từ hoặc từ đồng âm gần gũi (như Guol / Gươl / K'tu)
      if (
        spokenSet.has(cleanTw) ||
        spokenList.some((sw) => sw.includes(cleanTw) || cleanTw.includes(sw)) ||
        ['gươl', 'ktu', 'k’tu', 'tkơơr', 't’kơơr', 'trứt', 't’rứt', 'bahiêng', 'ba-hiêng', 'tây'].includes(
          cleanTw
        )
      ) {
        matched.add(cleanTw);
        hitCount += 1;
      }
    });

    const pct = Math.min(100, Math.round((hitCount / Math.max(1, targetWords.length)) * 100));
    setMatchedWordsSet(matched);
    setAccuracyScore(pct);

    if (pct >= 75) {
      analyticsService.trackQuizComplete(pct, 100);
      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.65 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleStartRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);
      return;
    }

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      // Nếu trình duyệt không hỗ trợ SpeechRecognition (ví dụ Firefox desktop), chạy chế độ mô phỏng đọc mẫu
      setStatusMessage(
        t(
          'Trình duyệt hiện tại chưa bật quyền Micro Web Speech — Đang chấm điểm thử nghiệm mẫu!',
          'Browser SpeechRecognition unavailable — Running interactive demo evaluation!'
        )
      );
      setSpokenTranscript(currentScript.englishSentence);
      evaluateTranscript(currentScript.englishSentence);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setSpokenTranscript('');
        setAccuracyScore(null);
        setMatchedWordsSet(new Set());
        setStatusMessage(
          t(
            '🎙️ Đang lắng nghe giọng thuyết minh tiếng Anh của bạn... Hãy đọc to câu mẫu!',
            '🎙️ Listening to your English tour guide voice... Read the script aloud!'
          )
        );
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        const trimmed = transcript.trim();
        setSpokenTranscript(trimmed);
        evaluateTranscript(trimmed);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setStatusMessage(
          t(
            'Không nhận diện được Micro hoặc bạn chưa cấp quyền. Bạn có thể bấm "Chấm thử giọng mẫu" bên cạnh!',
            'Microphone access blocked or silent. Try the "Instant Demo Check" button!'
          )
        );
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleSimulatedCheck = () => {
    speechService.speak(currentScript.englishSentence, 'en');
    setSpokenTranscript(currentScript.englishSentence);
    evaluateTranscript(currentScript.englishSentence);
    setStatusMessage(
      t(
        '✨ Đã phát giọng đọc mẫu chuẩn và đối chiếu từng từ khóa thuyết minh!',
        '✨ Played native guide voice and highlighted all key presentation terms!'
      )
    );
  };

  const handleSelectScript = (idx: number) => {
    setCurrentIndex(idx);
    setSpokenTranscript('');
    setAccuracyScore(null);
    setMatchedWordsSet(new Set());
    setStatusMessage('');
  };

  return (
    <div className="bg-[#0D1813]/90 backdrop-blur-md border border-[#1E3029] rounded-3xl p-5 sm:p-7 text-white space-y-5">
      {/* Header & Script Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E3029] pb-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-heritage-ochre flex items-center gap-1.5">
            <Mic className="w-4 h-4" />
            {t(
              `Phòng Thử Giọng Hướng Dẫn Viên Di Sản · ${artifactName}`,
              `AI Tour Guide Voice Shadowing · ${artifactName}`
            )}
          </span>
          <p className="text-xs text-heritage-wood/80">
            {t(
              'Nghe câu mẫu, sau đó bấm Thu âm để luyện thuyết minh tiếng Anh như một Đại sứ Văn hóa Tây Giang thực thụ!',
              'Listen to the model sentence, then record your voice to practice guiding international visitors in English!'
            )}
          </p>
        </div>

        {scripts.length > 1 && (
          <div className="flex items-center gap-1.5 shrink-0">
            {scripts.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScript(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  idx === currentIndex
                    ? 'bg-heritage-ochre text-slate-950 font-bold'
                    : 'bg-[#14221A] hover:bg-[#1E3029] text-heritage-wood/80 border border-[#1E3029]'
                }`}
              >
                {t(`Mẫu #${idx + 1}`, `Script #${idx + 1}`)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Target Sentence with Word-by-Word Highlight */}
      <div className="p-5 rounded-2xl bg-[#0A120E] border border-[#1E3029] space-y-3">
        <div className="flex items-center justify-between text-xs text-heritage-ochre font-semibold">
          <span>{t(currentScript.roleTitle.vi, currentScript.roleTitle.en)}</span>
          <button
            onClick={() => speechService.speak(currentScript.englishSentence, 'en')}
            className="px-3 py-1 rounded-lg bg-heritage-ochre/15 hover:bg-heritage-ochre text-heritage-ochre hover:text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('Nghe giọng mẫu chuẩn', 'Listen to Native Guide')}</span>
          </button>
        </div>

        {/* Word-by-word interactive display */}
        <div className="text-base sm:text-xl font-serif leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
          {targetWords.map((word, idx) => {
            const clean = normalizeWord(word);
            const isMatched = matchedWordsSet.has(clean);
            const isKey = currentScript.keyTerms.some(
              (k) => normalizeWord(k) === clean
            );
            return (
              <span
                key={idx}
                onClick={() => speechService.speak(clean, 'en')}
                title={t('Chạm để nghe phát âm từ này', 'Click to pronounce this word')}
                className={`cursor-pointer px-1.5 py-0.5 rounded-lg transition-all ${
                  isMatched
                    ? 'bg-heritage-ochre/25 text-heritage-ochre border border-heritage-ochre/50 font-bold'
                    : isKey
                    ? 'underline decoration-heritage-ochre/70 decoration-2 underline-offset-4 text-heritage-ochre font-semibold hover:bg-white/10'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>

        <p className="text-xs sm:text-sm text-heritage-wood/80 italic border-t border-[#1E3029] pt-2.5">
          "{currentScript.vietnameseTranslation}"
        </p>
      </div>

      {/* Action Controls: Record Mic + Instant Demo Check */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleStartRecording}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all shadow-lg min-h-[46px] ${
              isRecording
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>{t('Dừng thu âm & Chấm điểm', 'Stop Recording')}</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>{t('🎙️ Bấm Thu Âm Thử Giọng (Micro)', '🎙️ Record Your Guide Voice')}</span>
              </>
            )}
          </button>

          <button
            onClick={handleSimulatedCheck}
            className="px-4 py-3 rounded-2xl bg-[#14221A] hover:bg-[#1E3029] border border-[#1E3029] text-heritage-wood text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-all min-h-[46px]"
          >
            <Sparkles className="w-4 h-4 text-heritage-ochre" />
            <span>{t('Nghe & Chấm mẫu tự động', 'Listen & Auto-Shadow')}</span>
          </button>

          {accuracyScore !== null && (
            <button
              onClick={() => handleSelectScript(currentIndex)}
              className="p-3 rounded-2xl bg-[#14221A] hover:bg-[#1E3029] text-heritage-wood/80 transition-colors"
              title={t('Làm lại', 'Reset')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Score Badge */}
        {accuracyScore !== null && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-heritage-ochre/15 border border-heritage-ochre/30">
            <Award className="w-6 h-6 text-heritage-ochre shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-heritage-ochre font-bold">
                {t('Độ chuẩn xác Thuyết minh', 'Pronunciation Match')}
              </div>
              <div className="text-lg font-extrabold text-white flex items-center gap-1.5">
                <span>{accuracyScore}%</span>
                {accuracyScore >= 75 && (
                  <span className="text-xs font-semibold text-heritage-ochre flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('Đạt chuẩn Đại sứ!', 'Ambassador Ready!')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spoken Transcript Feedback */}
      {(spokenTranscript || statusMessage) && (
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
          {statusMessage && <div className="text-amber-300 font-medium">{statusMessage}</div>}
          {spokenTranscript && (
            <div className="text-emerald-100">
              <span className="opacity-70">{t('Giọng thu nhận được:', 'Recognized speech:')}</span>{' '}
              <strong className="text-white">"{spokenTranscript}"</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

