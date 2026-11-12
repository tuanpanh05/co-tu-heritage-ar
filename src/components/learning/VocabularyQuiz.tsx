import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Trophy, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../contexts/LanguageContext';
import { analyticsService } from '../../services/analyticsService';

interface VocabularyQuizProps {
  questions: QuizQuestion[];
}

export const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const { t } = useLanguage();

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-heritage-woodMuted">
        {t('Chưa có bộ câu hỏi trắc nghiệm.', 'No quiz questions available.')}
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      analyticsService.trackQuizComplete(score, questions.length);
      if (score + (selectedOption === currentQ.correctIndex ? 1 : 0) >= questions.length / 2) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto bg-[#0D1813] border border-[#1E3029] rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-heritage">
        <div className="w-16 h-16 mx-auto rounded-full bg-heritage-ochre/15 border border-heritage-ochre/30 text-heritage-ochre flex items-center justify-center">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-heritage-wood">
            {t('Hoàn thành bài trắc nghiệm!', 'Quiz Completed!')}
          </h3>
          <p className="text-xs sm:text-sm text-heritage-woodMuted">
            {t(
              'Bạn đã hoàn thành phần ôn tập thuật ngữ di sản Cơ Tu Tây Giang.',
              'You have completed the Tây Giang Cơ Tu heritage terminology quiz.'
            )}
          </p>
        </div>

        <div className="p-4 bg-[#0A120E] rounded-xl border border-[#1E3029] inline-block min-w-[200px] shadow-inner">
          <div className="text-3xl sm:text-4xl font-extrabold text-heritage-ochre">
            {score} / {questions.length}
          </div>
          <div className="text-xs font-semibold text-heritage-woodMuted mt-1">
            {t(`Đạt tỉ lệ ${percentage}%`, `Accuracy: ${percentage}%`)}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleRestart}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-sm font-bold transition-colors shadow-md min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('Làm lại bài kiểm tra', 'Retake Quiz')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-[#0D1813] rounded-2xl border border-[#1E3029] p-5 sm:p-7 shadow-heritage space-y-5">
      
      {/* Quiz Header & Progress */}
      <div className="flex items-center justify-between border-b border-[#1E3029] pb-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-heritage-ochre uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>
            {t('Câu hỏi', 'Question')} {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="text-xs font-semibold text-heritage-woodMuted">
          {t('Điểm hiện tại:', 'Score:')}{' '}
          <span className="text-heritage-ochre font-bold">{score}</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-1.5">
        <h4 className="text-base sm:text-lg font-serif font-semibold text-heritage-wood leading-snug">
          {t(currentQ.question.vi, currentQ.question.en)}
        </h4>
        <p className="text-xs sm:text-sm text-heritage-woodMuted italic">
          {t(currentQ.question.en, currentQ.question.vi)}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {currentQ.options.map((option, idx) => {
          let optionStyle = 'bg-[#0A120E] hover:bg-[#14221A] border-[#1E3029] text-heritage-wood';

          if (isAnswered) {
            if (idx === currentQ.correctIndex) {
              optionStyle = 'bg-[#0E1A14] border-emerald-500/70 text-emerald-200 font-semibold';
            } else if (idx === selectedOption) {
              optionStyle = 'bg-[#1A0E10] border-rose-500/70 text-rose-200';
            } else {
              optionStyle = 'bg-[#0A120E]/40 border-[#1E3029]/50 text-heritage-woodMuted opacity-50';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between min-h-[48px] ${optionStyle}`}
            >
              <span>{option}</span>
              {isAnswered && idx === currentQ.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
              )}
              {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isAnswered && (
        <div className="p-4 rounded-xl bg-[#0A120E] border border-[#1E3029] space-y-1 animate-in fade-in text-xs sm:text-sm">
          <div className="font-semibold text-heritage-ochre flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('Giải thích đáp án:', 'Explanation:')}</span>
          </div>
          <p className="text-heritage-wood">
            {t(currentQ.explanation.vi, currentQ.explanation.en)}
          </p>
          <p className="text-heritage-woodMuted italic">
            {t(currentQ.explanation.en, currentQ.explanation.vi)}
          </p>
        </div>
      )}

      {/* Bottom Action */}
      {isAnswered && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleNextQuestion}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-ochre hover:bg-heritage-ochreLight text-slate-950 text-xs sm:text-sm font-bold transition-colors shadow-md min-h-[44px]"
          >
            <span>
              {currentIndex + 1 < questions.length
                ? t('Câu tiếp theo', 'Next Question')
                : t('Xem kết quả', 'View Results')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
