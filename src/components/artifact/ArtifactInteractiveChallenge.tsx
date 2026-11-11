import React, { useState, useEffect, useMemo } from 'react';
import { Artifact } from '../../types';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { VOCABULARY_BANK } from '../../data/vocabularyBankData';
import { VocabularyQuiz } from '../learning/VocabularyQuiz';
import { speechService } from '../../services/speechService';
import { analyticsService } from '../../services/analyticsService';
import { useLanguage } from '../../contexts/LanguageContext';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  HelpCircle,
  Sparkles,
  Trophy,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Flame,
  Headphones,
  X,
  Puzzle
} from 'lucide-react';

interface ArtifactInteractiveChallengeProps {
  artifact: Artifact;
  hasListenedAudio?: boolean;
  externalModeRequest?: 'none' | 'quiz' | 'minigame';
  onModeChange?: (mode: 'none' | 'quiz' | 'minigame') => void;
}

interface MatchCardItem {
  cardId: string;
  pairId: string;
  type: 'en' | 'vi';
  text: string;
  subText?: string;
  termToSpeak: string;
}

export const ArtifactInteractiveChallenge: React.FC<ArtifactInteractiveChallengeProps> = ({
  artifact,
  hasListenedAudio = false,
  externalModeRequest,
  onModeChange
}) => {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<'none' | 'quiz' | 'minigame'>('none');

  // Đồng bộ nếu người dùng bấm nút mở nhanh từ AudioGuidePlayer
  useEffect(() => {
    if (externalModeRequest && externalModeRequest !== 'none') {
      setActiveMode(externalModeRequest);
    }
  }, [externalModeRequest]);

  // Reset khi đổi sang hiện vật khác
  useEffect(() => {
    setActiveMode('none');
  }, [artifact.slug]);

  const handleSelectMode = (mode: 'none' | 'quiz' | 'minigame') => {
    setActiveMode(mode);
    if (onModeChange) {
      onModeChange(mode);
    }
  };

  // Lấy bộ câu hỏi Quiz của riêng hiện vật này
  const artifactQuizQuestions = useMemo(() => {
    const matched = QUIZ_QUESTIONS.filter((q) => q.relatedArtifactSlug === artifact.slug);
    return matched.length > 0 ? matched : QUIZ_QUESTIONS.slice(0, 4);
  }, [artifact.slug]);

  // Lấy 5-6 cặp từ vựng của riêng hiện vật này cho Mini-Game Ghép Cặp
  const gamePairsSource = useMemo(() => {
    const list = [...artifact.vocabulary];
    const extraFromBank = VOCABULARY_BANK.filter(
      (item) => item.relatedArtifactSlug === artifact.slug
    );
    extraFromBank.forEach((eb) => {
      if (
        list.length < 6 &&
        !list.some((existing) => existing.term.toLowerCase() === eb.term.toLowerCase())
      ) {
        list.push(eb);
      }
    });
    return list.slice(0, 5);
  }, [artifact]);

  // Trạng thái của Mini-Game Ghép Cặp Mật Mã Rừng Già
  const [cards, setCards] = useState<MatchCardItem[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const initMiniGame = () => {
    const generated: MatchCardItem[] = [];
    gamePairsSource.forEach((item, idx) => {
      const pairId = `pair_${idx}_${item.id}`;
      const cleanTerm = item.term.replace(/\s*\(.*?\)\s*/g, '').trim() || item.term;
      generated.push({
        cardId: `${pairId}_en`,
        pairId,
        type: 'en',
        text: item.term,
        subText: item.ipa || 'English Term',
        termToSpeak: cleanTerm
      });
      generated.push({
        cardId: `${pairId}_vi`,
        pairId,
        type: 'vi',
        text: item.vietnameseMeaning,
        subText: 'Nghĩa tiếng Việt',
        termToSpeak: cleanTerm
      });
    });

    // Xáo trộn ngẫu nhiên
    const shuffled = [...generated].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCardId(null);
    setMatchedPairIds(new Set());
    setWrongPairIds([]);
    setCombo(0);
    setMaxCombo(0);
    setScore(0);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    if (activeMode === 'minigame') {
      initMiniGame();
    }
  }, [activeMode, gamePairsSource]);

  const handleCardClick = (card: MatchCardItem) => {
    if (matchedPairIds.has(card.pairId) || wrongPairIds.length > 0) return;

    // Nếu bấm vào thẻ tiếng Anh thì phát âm luôn cho sinh động
    if (card.type === 'en') {
      speechService.speak(card.termToSpeak, 'en');
    }

    if (!selectedCardId) {
      setSelectedCardId(card.cardId);
      return;
    }

    if (selectedCardId === card.cardId) {
      setSelectedCardId(null);
      return;
    }

    const firstCard = cards.find((c) => c.cardId === selectedCardId);
    if (!firstCard) {
      setSelectedCardId(card.cardId);
      return;
    }

    setMoves((prev) => prev + 1);

    // Kiểm tra ghép đúng cặp (cùng pairId nhưng khác cardId)
    if (firstCard.pairId === card.pairId && firstCard.cardId !== card.cardId) {
      const nextMatched = new Set(matchedPairIds);
      nextMatched.add(card.pairId);
      setMatchedPairIds(nextMatched);
      setSelectedCardId(null);

      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setScore((prev) => prev + 100 * newCombo);

      speechService.speak(card.termToSpeak, 'en');

      // Kiểm tra thắng cuộc
      if (nextMatched.size === gamePairsSource.length) {
        setGameWon(true);
        analyticsService.trackQuizComplete(gamePairsSource.length, gamePairsSource.length);
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
    } else {
      // Ghép sai
      setCombo(0);
      setWrongPairIds([firstCard.cardId, card.cardId]);
      setTimeout(() => {
        setWrongPairIds([]);
        setSelectedCardId(null);
      }, 650);
    }
  };

  return (
    <div
      id="artifact-challenge-section"
      className="forest-stage-dark rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-xl scroll-mt-24"
    >
      {/* Top Choice Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-amber-300">
            {hasListenedAudio ? (
              <>
                <Headphones className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
                <span>
                  {t(
                    'Bạn vừa nghe thuyết minh hiện vật! Thử tài ngay nhé',
                    'You just listened to the Audio Guide! Test your knowledge'
                  )}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {t(
                    'Hoạt động Tương tác sau khi Xem & Nghe Thuyết minh',
                    'Post-Exploration Interactive Quiz & Mini-Game'
                  )}
                </span>
              </>
            )}
          </div>

          <h3 className="text-xl sm:text-3xl font-serif font-semibold text-white leading-snug">
            {t(
              `Khám Phá Xong "${artifact.name.vi}" — Bạn Muốn Thử Sức Hoạt Động Nào?`,
              `Finished Exploring "${artifact.name.en}" — Choose Your Fun Activity!`
            )}
          </h3>

          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            {t(
              'Tự chọn làm 4 câu Quiz nhanh về bí mật chế tác của hiện vật này, hoặc chơi Mini-Game ghép cặp thuật ngữ tốc độ để ghi nhớ ngay lập tức!',
              'Choose between a quick 4-question Quiz tailored to this artifact, or play the Speed Pair-Matching Mini-Game!'
            )}
          </p>
        </div>

        {/* 2 Choice Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => handleSelectMode(activeMode === 'quiz' ? 'none' : 'quiz')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all min-h-[46px] ${
              activeMode === 'quiz'
                ? 'bg-emerald-400 text-slate-950 shadow-lg scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>
              {t(
                `Quiz Nhanh (${artifactQuizQuestions.length} câu)`,
                `Quick Quiz (${artifactQuizQuestions.length} Qs)`
              )}
            </span>
          </button>

          <button
            onClick={() => handleSelectMode(activeMode === 'minigame' ? 'none' : 'minigame')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all min-h-[46px] ${
              activeMode === 'minigame'
                ? 'bg-amber-400 text-slate-950 shadow-lg scale-[1.02]'
                : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-300/40'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{t('Mini-Game: Ghép Cặp Di Sản', 'Mini-Game: Heritage Match')}</span>
          </button>

          {activeMode !== 'none' && (
            <button
              onClick={() => handleSelectMode('none')}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white transition-colors"
              title={t('Đóng hoạt động', 'Close activity')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: ARTIFACT-SPECIFIC QUIZ */}
      {activeMode === 'quiz' && (
        <div className="mt-8 pt-6 border-t border-white/15 animate-in fade-in">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              {t(
                `Đố vui chuyên đề: ${artifact.name.vi}`,
                `Topic Quiz: ${artifact.name.en}`
              )}
            </span>
            <button
              onClick={() => handleSelectMode('minigame')}
              className="text-xs font-semibold text-amber-300 hover:underline flex items-center gap-1"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>{t('Đổi sang chơi Mini-Game →', 'Switch to Mini-Game →')}</span>
            </button>
          </div>
          <VocabularyQuiz questions={artifactQuizQuestions} />
        </div>
      )}

      {/* MODE 2: MINI-GAME GHÉP CẶP MẬT MÃ RỪNG GIÀ */}
      {activeMode === 'minigame' && (
        <div className="mt-8 pt-6 border-t border-white/15 space-y-5 animate-in fade-in">
          {/* Game Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/10 rounded-2xl p-4 border border-white/15">
            <div className="flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-amber-300" />
              <div>
                <h4 className="text-sm font-serif font-semibold text-white">
                  {t(
                    'Mini-Game: Ghép Cặp Thuật Ngữ & Ý Nghĩa',
                    'Mini-Game: Match Heritage Terms & Meanings'
                  )}
                </h4>
                <p className="text-[11px] text-emerald-200/80">
                  {t(
                    'Chạm chọn 1 thẻ Tiếng Anh và 1 thẻ Nghĩa Tiếng Việt tương ứng để mở khóa cổ vật!',
                    'Tap 1 English term card and its matching Vietnamese meaning card!'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-black/25 border border-white/10 flex items-center gap-1.5">
                <Flame
                  className={`w-4 h-4 ${
                    combo > 1 ? 'text-amber-400 animate-bounce' : 'text-emerald-300'
                  }`}
                />
                <span>Combo:</span>
                <strong className="text-amber-300">x{combo}</strong>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-black/25 border border-white/10">
                <span>{t('Điểm:', 'Score:')}</span>{' '}
                <strong className="text-emerald-300">{score}</strong>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-black/25 border border-white/10">
                <span>{t('Đã ghép:', 'Matched:')}</span>{' '}
                <strong className="text-white">
                  {matchedPairIds.size}/{gamePairsSource.length}
                </strong>
              </div>

              <button
                onClick={initMiniGame}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('Chơi lại', 'Reset')}</span>
              </button>
            </div>
          </div>

          {gameWon ? (
            <div className="bg-white/10 backdrop-blur-md border border-emerald-400/40 rounded-3xl p-8 text-center space-y-5 max-w-xl mx-auto">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 border border-amber-300 text-amber-300 flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  {t('Giải mã thành công!', 'All Pairs Unlocked!')}
                </span>
                <h4 className="text-2xl font-serif font-semibold text-white">
                  {t(
                    `Chúc mừng Đại Sứ Di Sản "${artifact.name.vi}"!`,
                    `Congratulations, Heritage Master of "${artifact.name.en}"!`
                  )}
                </h4>
                <p className="text-xs sm:text-sm text-emerald-100/80">
                  {t(
                    `Bạn đã ghép đúng toàn bộ ${gamePairsSource.length} cặp thuật ngữ trong ${moves} lượt với chuỗi Combo tối đa x${maxCombo}.`,
                    `You matched all ${gamePairsSource.length} heritage pairs in ${moves} moves with a max Combo of x${maxCombo}.`
                  )}
                </p>
              </div>

              <div className="text-3xl font-extrabold text-amber-300">
                {score} {t('Điểm', 'Points')}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={initMiniGame}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('Chơi ván mới (Xáo thẻ)', 'Play Again (Shuffle)')}</span>
                </button>
                <button
                  onClick={() => handleSelectMode('quiz')}
                  className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{t('Thử sức thêm Quiz 4 câu', 'Try the 4-Question Quiz')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {cards.map((card) => {
                const isMatched = matchedPairIds.has(card.pairId);
                const isSelected = selectedCardId === card.cardId;
                const isWrong = wrongPairIds.includes(card.cardId);

                let cardStyle =
                  'bg-white/10 hover:bg-white/20 border-white/20 text-white cursor-pointer';
                if (isMatched) {
                  cardStyle =
                    'bg-emerald-500/25 border-emerald-400/60 text-emerald-100 opacity-75 cursor-default';
                } else if (isWrong) {
                  cardStyle = 'bg-rose-500/35 border-rose-400 text-white animate-pulse';
                } else if (isSelected) {
                  cardStyle =
                    'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-[1.03] font-bold';
                }

                return (
                  <button
                    key={card.cardId}
                    onClick={() => handleCardClick(card)}
                    disabled={isMatched}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[116px] ${cardStyle}`}
                  >
                    <div className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-wider opacity-80">
                      <span>
                        {card.type === 'en'
                          ? t('Thuật ngữ EN', 'English')
                          : t('Nghĩa VI', 'Meaning')}
                      </span>
                      {isMatched ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                      ) : card.type === 'en' ? (
                        <Volume2 className="w-3.5 h-3.5 shrink-0" />
                      ) : null}
                    </div>

                    <div className="my-2 text-xs sm:text-sm font-serif font-semibold leading-snug">
                      {card.text}
                    </div>

                    <div className="text-[10px] opacity-70 truncate">{card.subText}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

