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

interface VocabularyQuizProps {
  questions: QuizQuestion[];
}

export const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-heritage-woodMuted">
        Chưa có bộ câu hỏi trắc nghiệm.
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
      // Bắn pháo hoa ăn mừng nếu điểm > 60%
      if (score + (selectedOption === currentQ.correctIndex ? 1 : 0) >= questions.length / 2) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
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
      <div className="max-w-lg mx-auto bg-heritage-cream/80 border border-heritage-sand rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-heritage">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-serif font-semibold text-heritage-wood">
            Hoàn thành bài trắc nghiệm!
          </h3>
          <p className="text-xs sm:text-sm text-heritage-woodMuted">
            Bạn đã hoàn thành phần ôn tập thuật ngữ di sản Cơ Tu Tây Giang.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-heritage-sand inline-block min-w-[200px] shadow-inner">
          <div className="text-3xl sm:text-4xl font-extrabold text-heritage-clay">
            {score} / {questions.length}
          </div>
          <div className="text-xs font-semibold text-heritage-woodMuted mt-1">
            Đạt tỉ lệ {percentage}%
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleRestart}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-clay hover:bg-heritage-clayDark text-white text-sm font-semibold transition-colors shadow-md min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm lại bài kiểm tra</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-heritage-ivory rounded-2xl border border-heritage-sand p-5 sm:p-7 shadow-heritage space-y-5">
      
      {/* Quiz Header & Progress */}
      <div className="flex items-center justify-between border-b border-heritage-sand/60 pb-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-heritage-clay uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Câu hỏi {currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="text-xs font-semibold text-heritage-woodMuted">
          Điểm hiện tại: <span className="text-heritage-clay font-bold">{score}</span>
        </div>
      </div>

      {/* Question Content */}
      <div className="space-y-1.5">
        <h4 className="text-base sm:text-lg font-serif font-semibold text-heritage-wood leading-snug">
          {currentQ.question.vi}
        </h4>
        <p className="text-xs sm:text-sm text-heritage-woodMuted italic">
          {currentQ.question.en}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {currentQ.options.map((option, idx) => {
          let optionStyle = 'bg-white hover:bg-heritage-cream/60 border-heritage-sand text-heritage-wood';

          if (isAnswered) {
            if (idx === currentQ.correctIndex) {
              optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
            } else if (idx === selectedOption) {
              optionStyle = 'bg-rose-50 border-rose-300 text-rose-900';
            } else {
              optionStyle = 'bg-white/50 border-heritage-sand/50 text-heritage-woodMuted opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full p-3.5 sm:p-4 rounded-xl border-2 text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between min-h-[48px] ${optionStyle}`}
            >
              <span>{option}</span>
              {isAnswered && idx === currentQ.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
              )}
              {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {isAnswered && (
        <div className="p-4 rounded-xl bg-heritage-sand/20 border border-heritage-sand space-y-1 animate-in fade-in text-xs sm:text-sm">
          <div className="font-semibold text-heritage-clay flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Giải thích đáp án:</span>
          </div>
          <p className="text-heritage-wood">{currentQ.explanation.vi}</p>
          <p className="text-heritage-woodMuted italic">{currentQ.explanation.en}</p>
        </div>
      )}

      {/* Bottom Action */}
      {isAnswered && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleNextQuestion}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-heritage-clay hover:bg-heritage-clayDark text-white text-xs sm:text-sm font-semibold transition-colors shadow-md min-h-[44px]"
          >
            <span>{currentIndex + 1 < questions.length ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

