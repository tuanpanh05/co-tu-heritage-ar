import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notebookService } from '../services/notebookService';
import { artifactService } from '../services/artifactService';
import { SavedVocabularyItem, VocabularyItem } from '../types';
import { FlashcardViewer } from '../components/learning/FlashcardViewer';
import { VocabularyQuiz } from '../components/learning/VocabularyQuiz';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { 
  GraduationCap, 
  Sparkles, 
  HelpCircle, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const LearningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'quiz' | 'clil'>('flashcards');
  const [savedWords, setSavedWords] = useState<SavedVocabularyItem[]>([]);
  const [allDefaultWords, setAllDefaultWords] = useState<VocabularyItem[]>([]);

  useEffect(() => {
    setSavedWords(notebookService.getAll());

    const artifacts = artifactService.getAll();
    const collected: VocabularyItem[] = [];
    artifacts.forEach((a) => {
      a.vocabulary.forEach((v) => {
        if (!collected.some((c) => c.id === v.id)) {
          collected.push(v);
        }
      });
    });
    setAllDefaultWords(collected);
  }, []);

  const flashcardWords = savedWords.length > 0 ? savedWords : allDefaultWords;
  const learnedCount = savedWords.filter((w) => w.learned).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner - Soft Glassmorphic Gradient */}
      <div className="bg-gradient-to-br from-white/95 via-heritage-cream/90 to-emerald-50/70 backdrop-blur-xl text-heritage-wood rounded-3xl p-6 sm:p-10 border border-heritage-sand shadow-heritage-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-heritage-clay/10 text-heritage-clay border border-heritage-clay/20 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            <span>Trung tâm học tập CLIL</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            Không Gian Rèn Luyện Tiếng Anh Di Sản
          </h1>
          <p className="text-xs sm:text-sm text-heritage-woodLight leading-relaxed">
            Nâng cao năng lực từ vựng, khả năng phát âm và sự tự tin thuyết minh hiện vật văn hóa Cơ Tu Tây Giang qua hệ thống Flashcard thông minh và bài trắc nghiệm tương tác.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs">
            <div className="px-4 py-2 rounded-full bg-white/90 border border-heritage-sand text-heritage-wood shadow-xs">
              Từ đã lưu: <strong className="text-heritage-clay text-sm ml-1">{savedWords.length}</strong>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/90 border border-heritage-sand text-heritage-wood shadow-xs">
              Đã ghi nhớ: <strong className="text-emerald-600 text-sm ml-1">{learnedCount}</strong>
            </div>
            <Link
              to="/learn/notebook"
              className="px-4 py-2 rounded-full bg-heritage-clay text-white hover:bg-heritage-clayDark flex items-center space-x-1 font-semibold shadow-xs transition-colors"
            >
              <span>Mở sổ tay từ vựng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-heritage-sand/80 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap min-h-[44px] ${
            activeTab === 'flashcards'
              ? 'border-heritage-clay text-heritage-clay'
              : 'border-transparent text-heritage-woodMuted hover:text-heritage-wood'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Thẻ từ vựng (Flashcards)</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap min-h-[44px] ${
            activeTab === 'quiz'
              ? 'border-heritage-clay text-heritage-clay'
              : 'border-transparent text-heritage-woodMuted hover:text-heritage-wood'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Trắc nghiệm từ vựng (Quiz)</span>
        </button>

        <button
          onClick={() => setActiveTab('clil')}
          className={`pb-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap min-h-[44px] ${
            activeTab === 'clil'
              ? 'border-heritage-clay text-heritage-clay'
              : 'border-transparent text-heritage-woodMuted hover:text-heritage-wood'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Phương pháp CLIL là gì?</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'flashcards' && (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-1">
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-heritage-wood">
                Ôn Tập Bằng Flashcard 3D
              </h2>
              <p className="text-xs text-heritage-woodMuted">
                {savedWords.length > 0
                  ? `Đang hiển thị ${savedWords.length} thuật ngữ bạn đã lưu từ các hiện vật.`
                  : 'Đang hiển thị toàn bộ kho từ vựng văn hóa tiêu biểu.'}
              </p>
            </div>
            <FlashcardViewer items={flashcardWords} />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-1">
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-heritage-wood">
                Kiểm Tra Nhanh Từ Vựng Di Sản
              </h2>
              <p className="text-xs text-heritage-woodMuted">
                Thực hành trắc nghiệm để củng cố thuật ngữ tiếng Anh về hiện vật văn hóa Cơ Tu Tây Giang.
              </p>
            </div>
            <VocabularyQuiz questions={QUIZ_QUESTIONS} />
          </div>
        )}

        {activeTab === 'clil' && (
          <div className="bg-white rounded-2xl border border-heritage-sand p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-sm">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif font-semibold text-heritage-wood">
                Định Hướng CLIL Trong Dự Án Di Sản Cơ Tu
              </h3>
              <p className="text-xs sm:text-sm text-heritage-woodMuted leading-relaxed">
                <strong>CLIL (Content and Language Integrated Learning)</strong> là phương pháp sư phạm tiếp cận ngôn ngữ tích hợp với nội dung chuyên đề. Thay vì học các cấu trúc ngữ pháp và từ vựng rời rạc, học sinh học tiếng Anh thông qua việc khám phá chính chiều sâu văn hóa của dân tộc mình.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-heritage-cream/60 border border-heritage-sand space-y-1.5">
                <span className="font-serif font-semibold text-heritage-clay text-base">
                  1. Nội dung (Content)
                </span>
                <p className="text-heritage-woodLight leading-relaxed">
                  Hiểu biết sâu sắc về kiến trúc Nhà Gươl, kỹ thuật đan gùi Ba-hieng, nhạc khí và điêu khắc gỗ cổ truyền Cơ Tu Tây Giang.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-heritage-cream/60 border border-heritage-sand space-y-1.5">
                <span className="font-serif font-semibold text-heritage-clay text-base">
                  2. Ngôn ngữ (Language)
                </span>
                <p className="text-heritage-woodLight leading-relaxed">
                  Trang bị vốn từ vựng học thuật, thuật ngữ bảo tàng (communal house, bas-relief, resonance, gourd resonator...).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-heritage-cream/60 border border-heritage-sand space-y-1.5">
                <span className="font-serif font-semibold text-heritage-clay text-base">
                  3. Nhận thức (Cognition)
                </span>
                <p className="text-heritage-woodLight leading-relaxed">
                  Phát triển tư duy phân tích, so sánh cấu trúc hiện vật qua mô hình 3D và không gian tương tác WebAR.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-heritage-cream/60 border border-heritage-sand space-y-1.5">
                <span className="font-serif font-semibold text-heritage-clay text-base">
                  4. Văn hóa (Culture)
                </span>
                <p className="text-heritage-woodLight leading-relaxed">
                  Xây dựng niềm tự hào dân tộc, bồi dưỡng sự tự tin để học sinh THPT trở thành người thuyết minh di sản quê hương.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong>Tuyên bố sư phạm:</strong> Hệ thống hiện đang được thử nghiệm trong khuôn khổ vòng thi đầu tiên. Các bài kiểm tra và học liệu được thiết kế nhằm mục đích củng cố từ vựng và tạo hứng thú khám phá di sản.
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
