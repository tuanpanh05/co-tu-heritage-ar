import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, ChevronRight, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';
import { FeedbackComment } from '../../types/feedback';
import { useLanguage } from '../../contexts/LanguageContext';

export const LiveFeedbackFloatingTicker: React.FC = () => {
  const { lang, t } = useLanguage();
  const [comments, setComments] = useState<FeedbackComment[]>(() => feedbackService.getAll());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setComments(feedbackService.getAll());
    };
    window.addEventListener('cotu_feedback_updated', handleUpdate);
    return () => window.removeEventListener('cotu_feedback_updated', handleUpdate);
  }, []);

  // Cycle through comments every 7 seconds
  useEffect(() => {
    if (comments.length === 0 || isMinimized) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % comments.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [comments.length, isMinimized]);

  if (comments.length === 0) return null;

  const currentComment = comments[currentIndex] || comments[0];

  const scrollToGuestbook = () => {
    const el = document.getElementById('community-guestbook');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trạng thái Thu gọn / Ẩn đi: Biến thành thanh pill tinh tế, bấm vào là mở lại ngay
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-4 sm:right-6 z-40 animate-fade-in">
        <button
          onClick={() => setIsMinimized(false)}
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
    );
  }

  // Trạng thái Mở rộng: Có nút "Ẩn đi" để thu gọn xuống thanh pill
  return (
    <aside
      aria-label={t('Bảng tin phản hồi thời gian thực', 'Live community feedback feed')}
      className="fixed bottom-5 right-4 sm:right-6 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] transition-all duration-300"
    >
      <div className="relative rounded-2xl bg-[#0D1813]/95 border border-heritage-ochre/35 p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
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

          {/* Nút Ẩn / Thu gọn (Không cho tắt hẳn để người dùng luôn mở lại được) */}
          <button
            onClick={() => setIsMinimized(true)}
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
              onClick={scrollToGuestbook}
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
  );
};
