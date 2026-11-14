import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  MessageSquare,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Heart,
  Plus,
  Send,
  X
} from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';
import { FeedbackComment } from '../../types/feedback';
import { useLanguage } from '../../contexts/LanguageContext';

interface LiveFeedbackFloatingTickerProps {
  externalDrawerOpen?: boolean;
  onCloseExternalDrawer?: () => void;
}

export const LiveFeedbackFloatingTicker: React.FC<LiveFeedbackFloatingTickerProps> = ({
  externalDrawerOpen = false,
  onCloseExternalDrawer
}) => {
  const { lang, t } = useLanguage();
  const [comments, setComments] = useState<FeedbackComment[]>(() => feedbackService.getAll());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Desktop minimize state
  const [isDesktopMinimized, setIsDesktopMinimized] = useState(false);

  // Mobile ticker hide state (user can temporarily dismiss the pill)
  const [isMobilePillDismissed, setIsMobilePillDismissed] = useState(false);

  // Mobile Bottom Sheet Drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Drawer inside tab / view: 'list' | 'create'
  const [drawerMode, setDrawerMode] = useState<'list' | 'create'>('list');
  const [drawerFilter, setDrawerFilter] = useState<'all' | 'critique' | 'five_star'>('all');

  // Form State inside drawer
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Frontend / WebGL Dev');
  const [targetSlug, setTargetSlug] = useState('all');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [badgeType, setBadgeType] = useState('Cộng đồng Developer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (externalDrawerOpen) {
      setIsMobileDrawerOpen(true);
    }
  }, [externalDrawerOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      setComments(feedbackService.getAll());
    };
    window.addEventListener('cotu_feedback_updated', handleUpdate);
    return () => window.removeEventListener('cotu_feedback_updated', handleUpdate);
  }, []);

  // Auto-cycle through comments every 6 seconds
  useEffect(() => {
    if (comments.length === 0 || isDesktopMinimized) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % comments.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [comments.length, isDesktopMinimized]);

  if (comments.length === 0) return null;

  const currentComment = comments[currentIndex] || comments[0];

  const handleCloseDrawer = () => {
    setIsMobileDrawerOpen(false);
    setDrawerMode('list');
    if (onCloseExternalDrawer) {
      onCloseExternalDrawer();
    }
  };

  const handleOpenDrawerFromPill = () => {
    setIsMobileDrawerOpen(true);
    setDrawerMode('list');
  };

  const handleLike = (id: string) => {
    feedbackService.toggleLike(id);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    setIsSubmitting(true);
    feedbackService.addComment({
      authorName,
      authorRole,
      targetArtifactSlug: targetSlug,
      rating,
      badge: badgeType,
      content
    });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D49B45', '#38A17E', '#C25336', '#F5EFE6']
      });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setContent('');
    setDrawerMode('list');
    setToastMessage(t('Cảm ơn bạn! Ý kiến đã xuất bản công khai.', 'Thank you! Published publicly.'));
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredComments = useMemo(() => {
    if (drawerFilter === 'critique') {
      return comments.filter((c) => c.rating <= 4);
    }
    if (drawerFilter === 'five_star') {
      return comments.filter((c) => c.rating === 5);
    }
    return comments;
  }, [comments, drawerFilter]);

  const roleSuggestions = [
    'Frontend / WebGL Dev',
    'Người dùng Hà Nội',
    'Khách quốc tế (Expat)',
    '3D Artist',
    'Nghiên cứu sinh'
  ];

  const quickSnippets = [
    'Mô hình 3D xoay 360 độ mượt, texture PBR bắt sáng chuẩn!',
    'Quét WebAR ngay trên Safari/Chrome điện thoại rất tiện.',
    'Học liệu song ngữ giải thích chuẩn thuật ngữ văn hóa.',
    'Nên thêm hướng dẫn ánh sáng khi bật AR phòng tối.'
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          1. MOBILE DYNAMIC ISLAND PILL (Hiển thị trên Mobile)
          Nằm thanh thoát ngay trên thanh Bottom Dock
      ═══════════════════════════════════════════════════ */}
      {!isMobilePillDismissed && !isMobileDrawerOpen && (
        <div className="fixed bottom-[64px] inset-x-3 z-30 md:hidden animate-fade-in pointer-events-auto">
          <div
            data-tour="feedback-pill"
            onClick={handleOpenDrawerFromPill}
            role="button"
            tabIndex={0}
            className="w-full h-11 px-3 rounded-full bg-[#0C1712]/95 border border-heritage-ochre/40 shadow-[0_10px_25px_rgba(0,0,0,0.7)] backdrop-blur-xl flex items-center justify-between gap-2.5 active:scale-98 transition-all cursor-pointer"
          >
            {/* Left: Live Dot + Rating */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex items-center space-x-0.5 text-heritage-ochre text-xs font-bold font-mono">
                <Star className="w-3 h-3 fill-heritage-ochre text-heritage-ochre" />
                <span>4.7</span>
              </div>
            </div>

            {/* Middle: Scrolling single-line snippet */}
            <div className="flex items-center space-x-1.5 min-w-0 flex-1 overflow-hidden">
              <span className="text-[11px] font-semibold text-heritage-wood truncate max-w-[90px]">
                {currentComment.authorName}:
              </span>
              <span className="text-[11px] text-heritage-woodLight/85 italic truncate">
                "{lang === 'en' && currentComment.contentEn ? currentComment.contentEn : currentComment.contentVi}"
              </span>
            </div>

            {/* Right: Pill badge & quick open */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-heritage-ochre/20 text-heritage-ochre text-[10px] font-bold font-mono">
                {comments.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobilePillDismissed(true);
                }}
                className="p-1 text-heritage-woodMuted hover:text-white"
                title={t('Tạm ẩn thanh tin', 'Hide ticker')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          2. MOBILE NATIVE-GRADE BOTTOM SHEET DRAWER
          Vuốt xem toàn bộ góp ý hoặc viết cảm nghĩ ngay
      ═══════════════════════════════════════════════════ */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseDrawer}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-h-[88dvh] flex flex-col rounded-t-3xl bg-[#09130E] border-t border-heritage-ochre/40 shadow-[0_-20px_50px_rgba(0,0,0,0.9)] text-heritage-wood z-10 animate-slide-up">
            
            {/* Top Bar: Drag indicator & Header */}
            <div className="p-4 pb-2 border-b border-[#203228] shrink-0 space-y-2">
              <div className="w-12 h-1.5 rounded-full bg-heritage-woodMuted/40 mx-auto" />
              
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-heritage-ochre/15 border border-heritage-ochre/30 flex items-center justify-center text-heritage-ochre">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-heritage-wood">
                      {t('Sổ Lưu Bút Di Sản', 'Heritage Community Guestbook')}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-[10px] text-heritage-ochre font-mono">
                      <span>★ 4.7 / 5.0</span>
                      <span>·</span>
                      <span className="text-emerald-400">{t('100% Công khai trực tiếp', 'Instant Public')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCloseDrawer}
                  className="p-2 rounded-xl text-heritage-woodMuted hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toast Message */}
              {toastMessage && (
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* Tab Selector: Xem danh sách vs Viết góp ý */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setDrawerMode('list')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    drawerMode === 'list'
                      ? 'bg-heritage-forest text-heritage-ochre border border-heritage-ochre/40 shadow-xs'
                      : 'bg-[#0E1A14] text-heritage-woodMuted border border-[#23352C]'
                  }`}
                >
                  {t('Xem phản hồi', 'Read Reviews')} ({comments.length})
                </button>
                <button
                  onClick={() => setDrawerMode('create')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    drawerMode === 'create'
                      ? 'bg-heritage-ochre text-slate-950 shadow-sm'
                      : 'bg-heritage-ochre/15 text-heritage-ochre border border-heritage-ochre/40'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{t('Viết góp ý mới', 'Post Review')}</span>
                </button>
              </div>

              {/* Sub-filter chips (only in list mode) */}
              {drawerMode === 'list' && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  <button
                    onClick={() => setDrawerFilter('all')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-all ${
                      drawerFilter === 'all'
                        ? 'bg-heritage-ochre text-slate-950 font-bold'
                        : 'bg-[#14231B] text-heritage-woodMuted'
                    }`}
                  >
                    {t('Tất cả', 'All')} ({comments.length})
                  </button>
                  <button
                    onClick={() => setDrawerFilter('critique')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-all ${
                      drawerFilter === 'critique'
                        ? 'bg-heritage-ochre text-slate-950 font-bold'
                        : 'bg-[#14231B] text-heritage-woodMuted'
                    }`}
                  >
                    💡 {t('Góp ý cải thiện (3–4★)', 'Suggestions (3–4★)')}
                  </button>
                  <button
                    onClick={() => setDrawerFilter('five_star')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 transition-all ${
                      drawerFilter === 'five_star'
                        ? 'bg-heritage-ochre text-slate-950 font-bold'
                        : 'bg-[#14231B] text-heritage-woodMuted'
                    }`}
                  >
                    ★ {t('Khen ngợi 5★', '5★ Praise')}
                  </button>
                </div>
              )}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
              {drawerMode === 'list' ? (
                <>
                  {filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3.5 rounded-2xl bg-[#0F1B15] border border-[#23352C] space-y-2 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${comment.avatarBg} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                          >
                            {comment.avatarInitials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-bold text-heritage-wood truncate">
                                {comment.authorName}
                              </span>
                              {comment.isVerified && (
                                <CheckCircle2 className="w-3 h-3 text-heritage-clayLight shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-heritage-woodMuted truncate block">
                              {lang === 'en' && comment.authorRoleEn ? comment.authorRoleEn : comment.authorRole}
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center space-x-0.5 shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < comment.rating
                                  ? 'text-heritage-ochre fill-heritage-ochre'
                                  : 'text-stone-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-heritage-woodLight leading-relaxed italic">
                        "{lang === 'en' && comment.contentEn ? comment.contentEn : comment.contentVi}"
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-[#1C2C23] text-[10px] text-heritage-woodMuted">
                        <span>{lang === 'en' ? comment.timeAgoEn : comment.timeAgoVi}</span>
                        <button
                          onClick={() => handleLike(comment.id)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                            comment.isLikedByUser
                              ? 'text-rose-400 bg-rose-950/40'
                              : 'text-heritage-woodMuted hover:text-rose-400'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${comment.isLikedByUser ? 'fill-rose-400' : ''}`} />
                          <span className="font-mono">{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                /* IN-DRAWER CREATE FORM */
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-heritage-ochre block">
                      {t('Tên / Nickname của bạn *', 'Your Name / Nickname *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={t('vd: Hoàng Long, Emma...', 'e.g. Alex Le...')}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#14231B] border border-[#23352C] focus:border-heritage-ochre text-heritage-wood placeholder-heritage-woodMuted/50 focus:outline-none"
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-heritage-ochre block">
                      {t('Bạn là ai? (Chọn nhanh vai trò)', 'Select Role')}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {roleSuggestions.map((r, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setAuthorRole(r)}
                          className={`text-[11px] px-2.5 py-1.5 rounded-lg transition-all ${
                            authorRole === r
                              ? 'bg-heritage-ochre text-slate-950 font-bold'
                              : 'bg-[#14231B] text-heritage-woodLight border border-[#23352C]'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-heritage-ochre block">
                      {t('Chủ đề hiện vật', 'Target Artifact')}
                    </label>
                    <select
                      value={targetSlug}
                      onChange={(e) => setTargetSlug(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#14231B] border border-[#23352C] focus:border-heritage-ochre text-heritage-wood text-xs focus:outline-none"
                    >
                      <option value="all">{t('Toàn bộ bảo tàng WebAR', 'Entire WebAR Museum')}</option>
                      <option value="guol-communal-house">{t('Nhà Gươl', 'Gươl House')}</option>
                      <option value="ktu-traditional-drum">{t('Trống K’tu', 'K’tu Drum')}</option>
                      <option value="tkoor-sacred-pillar">{t('Cây Nêu T’koor', 'T’koor Pillar')}</option>
                      <option value="bahieng-woven-basket">{t('Gùi Ba-hieng', 'Ba-hieng Basket')}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-heritage-ochre block">
                      {t('Huy hiệu', 'Display Badge')}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Cộng đồng Developer', 'Người dùng Hà Nội', 'Khách quốc tế', 'Góp ý xây dựng'].map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBadgeType(b)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg transition-all ${
                            badgeType === b
                              ? 'bg-heritage-ochre text-slate-950 font-bold'
                              : 'bg-[#14231B] text-heritage-woodMuted border border-[#23352C]'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-heritage-ochre block">
                      {t('Đánh giá trải nghiệm', 'Rating')}
                    </label>
                    <div className="flex items-center space-x-2 py-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRating(s)}
                          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-heritage-woodMuted hover:text-heritage-ochre"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              s <= rating ? 'text-heritage-ochre fill-heritage-ochre' : 'text-stone-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm font-mono text-heritage-ochre font-bold ml-2">
                        {rating}/5
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-semibold text-heritage-ochre block">
                      {t('Nội dung cảm nghĩ / Lời nhắn / Góp ý *', 'Feedback message *')}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={t(
                        'Chia sẻ cảm nhận chân thật của bạn về mô hình 3D, WebAR hay âm thanh...',
                        'Share your genuine thoughts...'
                      )}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#14231B] border border-[#23352C] focus:border-heritage-ochre text-heritage-wood placeholder-heritage-woodMuted/50 focus:outline-none resize-none"
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  {/* Quick snippets */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-heritage-woodMuted">
                      {t('Chạm để chèn nhanh:', 'Tap to insert:')}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {quickSnippets.map((sn, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setContent(sn)}
                          className="text-[10px] px-2 py-1 rounded bg-[#101C15] text-heritage-clayLight hover:text-white border border-[#23352C] text-left truncate max-w-full"
                        >
                          "{sn}"
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !authorName.trim() || !content.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-heritage-ochre to-[#B67E2D] text-slate-950 font-bold text-sm shadow-heritage flex items-center justify-center space-x-2 disabled:opacity-50 min-h-[48px]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('Xuất bản công khai ngay', 'Publish Publicly')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          3. DESKTOP FLOATING TICKER (Giữ nguyên trải nghiệm PC)
          Nằm ở góc phải màn hình máy tính
      ═══════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        {isDesktopMinimized ? (
          <div className="fixed bottom-5 right-6 z-40 animate-fade-in">
            <button
              data-tour="feedback-pill"
              onClick={() => setIsDesktopMinimized(false)}
              className="group flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#0D1813]/95 border border-heritage-ochre/40 hover:border-heritage-ochre text-heritage-wood shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
              title={t('Mở lại bảng tin phản hồi', 'Expand community feedback')}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <MessageSquare className="w-4 h-4 text-heritage-ochre" />
              <span className="text-xs font-semibold text-heritage-wood group-hover:text-heritage-ochre transition-colors">
                {t('Phản hồi cộng đồng', 'Community Feedback')} ({comments.length})
              </span>
              <ChevronUp className="w-3.5 h-3.5 text-heritage-ochre group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        ) : (
          <aside
            data-tour="feedback-pill"
            aria-label={t('Bảng tin phản hồi thời gian thực', 'Live community feedback feed')}
            className="fixed bottom-5 right-6 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] transition-all duration-300"
          >
            <div className="relative rounded-2xl bg-[#0D1813]/95 border border-heritage-ochre/35 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              {/* Top Header */}
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#23352C]">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-heritage-ochre font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-heritage-ochre" />
                    {t('Phản hồi thực tế từ cộng đồng', 'Live Visitor Voice')}
                  </span>
                </div>

                <button
                  onClick={() => setIsDesktopMinimized(true)}
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-heritage-woodMuted hover:text-heritage-ochre hover:bg-white/5 transition-colors text-xs font-mono"
                  title={t('Ẩn xuống góc màn hình', 'Minimize to floating pill')}
                >
                  <span>{t('Ẩn đi', 'Minimize')}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Comment Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${currentComment.avatarBg} flex items-center justify-center text-[10px] font-bold text-white shadow shrink-0`}
                    >
                      {currentComment.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-semibold text-heritage-wood truncate">
                          {currentComment.authorName}
                        </span>
                        {currentComment.isVerified && (
                          <CheckCircle2 className="w-3 h-3 text-heritage-clayLight shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-heritage-woodMuted truncate">
                        {lang === 'en' && currentComment.authorRoleEn
                          ? currentComment.authorRoleEn
                          : currentComment.authorRole}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < currentComment.rating
                            ? 'text-heritage-ochre fill-heritage-ochre'
                            : 'text-stone-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-heritage-woodLight/90 italic leading-relaxed line-clamp-2 pl-9">
                  "{lang === 'en' && currentComment.contentEn ? currentComment.contentEn : currentComment.contentVi}"
                </p>

                {/* Action Row */}
                <div className="pt-1 pl-9 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-heritage-woodMuted font-mono">
                    {lang === 'en' ? currentComment.timeAgoEn : currentComment.timeAgoVi}
                  </span>

                  <button
                    onClick={() => {
                      const el = document.getElementById('community-guestbook');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center space-x-1 text-heritage-ochre hover:text-heritage-ochreLight font-semibold transition-colors group"
                  >
                    <span>{t('Xem tất cả & gửi góp ý', 'View all & post comment')}</span>
                    <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Indicator dots */}
              <div className="flex items-center justify-center space-x-1 pt-2">
                {comments.slice(0, 6).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'w-4 bg-heritage-ochre' : 'w-1 bg-[#23352C] hover:bg-[#385043]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
};
