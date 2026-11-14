import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  MessageSquare,
  Star,
  Heart,
  Send,
  Plus,
  Sparkles,
  CheckCircle2,
  Filter,
  Layers,
  Share2,
  X
} from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';
import { FeedbackComment } from '../../types/feedback';
import { useLanguage } from '../../contexts/LanguageContext';

interface CommunityFeedbackSectionProps {
  initialArtifactSlug?: string;
  titleOverride?: string;
  subtitleOverride?: string;
}

export const CommunityFeedbackSection: React.FC<CommunityFeedbackSectionProps> = ({
  initialArtifactSlug,
  titleOverride,
  subtitleOverride
}) => {
  const { lang, t } = useLanguage();
  const [comments, setComments] = useState<FeedbackComment[]>(() => feedbackService.getAll());
  const [activeFilter, setActiveFilter] = useState<string>(initialArtifactSlug || 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Frontend / WebGL Developer');
  const [targetSlug, setTargetSlug] = useState(initialArtifactSlug || 'all');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [badgeType, setBadgeType] = useState('Cộng đồng Developer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setComments(feedbackService.getAll());
    };
    window.addEventListener('cotu_feedback_updated', handleUpdate);
    return () => window.removeEventListener('cotu_feedback_updated', handleUpdate);
  }, []);

  const filterOptions = [
    { id: 'all', labelVi: 'Tất cả phản hồi', labelEn: 'All Feedback' },
    { id: 'feedback-critique', labelVi: '💡 Góp ý cải thiện (3–4★)', labelEn: '💡 Suggestions (3–4★)' },
    { id: 'guol-communal-house', labelVi: 'Nhà Gươl', labelEn: 'Gươl House' },
    { id: 'ktu-traditional-drum', labelVi: 'Trống K’tu', labelEn: 'K’tu Drum' },
    { id: 'tkoor-sacred-pillar', labelVi: 'Cây Nêu T’koor', labelEn: 'T’koor Pillar' },
    { id: 'bahieng-woven-basket', labelVi: 'Gùi Ba-hieng', labelEn: 'Ba-hieng Basket' },
    { id: 'top-rated', labelVi: 'Yêu thích nhất', labelEn: 'Most Liked' }
  ];

  const artifactTargetOptions = [
    { slug: 'all', nameVi: 'Toàn bộ Không gian Di sản WebAR', nameEn: 'Entire WebAR Heritage Space' },
    { slug: 'guol-communal-house', nameVi: 'Nhà Gươl Truyền Thống', nameEn: 'Gươl Communal House' },
    { slug: 'ktu-traditional-drum', nameVi: 'Trống K’tu Truyền Thống', nameEn: 'K’tu Traditional Drum' },
    { slug: 'tkoor-sacred-pillar', nameVi: 'Cây Nêu Thần T’koor', nameEn: 'T’koor Sacred Pillar' },
    { slug: 'bahieng-woven-basket', nameVi: 'Gùi Ba-hieng Đan Lát', nameEn: 'Ba-hieng Woven Basket' }
  ];

  const roleSuggestions = [
    'Frontend / WebGL Dev',
    'Người dùng Hà Nội',
    '3D Technical Artist',
    'UI/UX Designer',
    'Khách quốc tế (Expat)',
    'Nghiên cứu sinh / Học viện'
  ];

  const quickBadges = [
    'Cộng đồng Developer',
    'Người dùng Hà Nội',
    '3D & UI/UX Specialist',
    'Khách quốc tế (Expat)',
    'Đã trải nghiệm AR',
    'Góp ý xây dựng'
  ];

  const quickSnippets = [
    'Mô hình 3D xoay 360 độ cực mượt, texture PBR bắt sáng rất chuẩn!',
    'Quét WebAR trực tiếp trên trình duyệt điện thoại rất tiện, không cần tải app.',
    'Giao diện dark-forest với bảng màu sang trọng, render font tiếng Việt đẹp.',
    'Học liệu song ngữ giải thích rất rõ ràng, chuẩn thuật ngữ nhân học.',
    'Âm thanh ambient suối rừng chim hót nghe thư giãn và cuốn hút.'
  ];

  const filteredComments = useMemo(() => {
    let result = [...comments];
    if (activeFilter === 'top-rated') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (activeFilter === 'feedback-critique') {
      result = result.filter((c) => c.rating <= 4);
    } else if (activeFilter !== 'all') {
      result = result.filter(
        (c) => c.targetArtifactSlug === activeFilter || c.targetArtifactSlug === 'all'
      );
    }
    return result;
  }, [comments, activeFilter]);

  const handleLike = (id: string) => {
    feedbackService.toggleLike(id);
  };

  const handleShare = (comment: FeedbackComment) => {
    const text = `"${comment.contentVi}" — ${comment.authorName} (${comment.authorRole}) trên Bảo tàng Số Cơ Tu Heritage AR`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(comment.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const selectedTarget = artifactTargetOptions.find((a) => a.slug === targetSlug);

    feedbackService.addComment({
      authorName,
      authorRole,
      targetArtifactSlug: targetSlug,
      targetArtifactNameVi: selectedTarget?.nameVi,
      targetArtifactNameEn: selectedTarget?.nameEn,
      rating,
      badge: badgeType,
      content
    });

    // Fire Confetti celebratory effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D49B45', '#38A17E', '#C25336', '#F5EFE6']
      });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    setContent('');
    setToastMessage(
      lang === 'en'
        ? 'Thank you! Your feedback has been published to the public guestbook.'
        : 'Cảm ơn bạn! Cảm nghĩ của bạn đã được xuất bản công khai trên Sổ lưu bút di sản.'
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Duplicate comments for seamless marquee loop
  const marqueeComments = useMemo(() => {
    return [...comments, ...comments];
  }, [comments]);

  return (
    <section
      id="community-guestbook"
      className="relative z-10 scroll-mt-24 pt-6 pb-12"
      aria-label="Sổ lưu bút & Phản hồi cộng đồng"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Decorative divider */}
        <div className="cotu-pattern-divider" />

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#14221A] border border-heritage-ochre/30 text-heritage-ochre text-xs font-mono uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-heritage-ochre" />
              <span>
                {t('Sổ Lưu Bút Di Sản & Tiếng Vọng Đại Ngàn', 'Heritage Guestbook & Community Voice')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-heritage-wood leading-tight">
              {titleOverride ||
                t(
                  'Cảm Nhận Thực Tế & Góp Ý Từ Cộng Đồng',
                  'Authentic Visitor Reflections & Public Guestbook'
                )}
            </h2>

            <p className="text-sm sm:text-base text-heritage-woodLight/85 leading-relaxed">
              {subtitleOverride ||
                t(
                  'Những chia sẻ chân thật từ người dùng Hà Nội, cộng đồng lập trình viên, chuyên gia đồ họa 3D và bạn bè quốc tế. Mọi phản hồi đều được công khai trực tiếp và lan tỏa giá trị di sản.',
                  'Authentic reflections from Hanoi visitors, tech & WebAR developers, 3D artists, and international explorers. Every thought is publicly celebrated.'
                )}
            </p>
          </div>

          {/* Call to action: Write comment */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-heritage-ochre to-[#B67E2D] hover:from-heritage-ochreLight hover:to-heritage-ochre text-slate-950 text-sm font-bold shadow-heritage hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('Gửi cảm nghĩ của bạn', 'Leave Your Public Review')}</span>
              <Sparkles className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="rounded-xl bg-[#14261D] border border-emerald-500/50 p-4 flex items-center justify-between text-sm text-emerald-300 shadow-xl animate-fade-in">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats highlight bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-[#0F1B15]/80 border border-[#23352C] backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-heritage-ochre text-xs font-mono font-bold">
              <Star className="w-4 h-4 fill-heritage-ochre" />
              <span>{t('Đánh giá trải nghiệm', 'Rating')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-heritage-wood">
              4.7 <span className="text-xs text-heritage-woodMuted font-sans font-normal">/ 5.0</span>
            </div>
            <div className="text-[11px] text-heritage-woodLight/70">
              {t('Dựa trên 180+ cảm nhận thực tế', 'Based on 180+ visitor reviews')}
            </div>
          </div>

          <div className="space-y-1 border-l border-[#23352C] pl-3 sm:pl-4">
            <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-mono font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('Tính công khai', 'Transparency')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-heritage-wood">
              100% <span className="text-xs text-heritage-clayLight font-sans font-normal">{t('Công khai', 'Public')}</span>
            </div>
            <div className="text-[11px] text-heritage-woodLight/70">
              {t('Hiển thị tức thì không chờ duyệt', 'Instant community visibility')}
            </div>
          </div>

          <div className="space-y-1 border-l border-[#23352C] pl-3 sm:pl-4">
            <div className="flex items-center space-x-1.5 text-heritage-clayLight text-xs font-mono font-bold">
              <Layers className="w-4 h-4" />
              <span>{t('Chủ đề hiện vật', 'Covered Heritage')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-heritage-wood">
              5 <span className="text-xs text-heritage-woodMuted font-sans font-normal">{t('Báu vật số', 'Digital Artifacts')}</span>
            </div>
            <div className="text-[11px] text-heritage-woodLight/70">
              {t('Nhà Gươl, Trống, Cây Nêu, Gùi...', 'Guol, Drum, Pillar, Basket...')}
            </div>
          </div>

          <div className="space-y-1 border-l border-[#23352C] pl-3 sm:pl-4">
            <div className="flex items-center space-x-1.5 text-heritage-terracotta text-xs font-mono font-bold">
              <Heart className="w-4 h-4 fill-heritage-terracotta" />
              <span>{t('Đồng thuận cộng đồng', 'Positive Votes')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-serif font-bold text-heritage-wood">
              380+ <span className="text-xs text-heritage-woodMuted font-sans font-normal">{t('Lượt yêu thích', 'Likes')}</span>
            </div>
            <div className="text-[11px] text-heritage-woodLight/70">
              {t('Lan tỏa bản sắc Trường Sơn', 'Spreading Trường Sơn culture')}
            </div>
          </div>
        </div>

        {/* RUNNING MARQUEE TICKER (Dải phản hồi chạy chuyển động liên tục cho sinh động) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-heritage-woodMuted px-1">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-mono uppercase tracking-wider text-heritage-ochre text-[11px] font-semibold">
                {t('Dải phản hồi trực tiếp (Rê chuột để tạm dừng)', 'Live Feedback Reel (Hover to Pause)')}
              </span>
            </div>
            <span className="text-[11px] italic hidden sm:inline">
              {t('Cập nhật liên tục từ khách tham quan', 'Real-time updates from museum visitors')}
            </span>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-[#09120E] border border-[#23352C] py-4 shadow-inner">
            {/* Soft Edge Fade Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#09120E] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#09120E] to-transparent z-10 pointer-events-none" />

            {/* Marquee Track */}
            <div className="animate-feedback-marquee flex gap-4 pl-4">
              {marqueeComments.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-80 sm:w-96 shrink-0 rounded-xl bg-[#111D17]/90 hover:bg-[#16271F] border border-[#23352C] hover:border-heritage-ochre/40 p-4 transition-all duration-300 shadow-sm flex flex-col justify-between space-y-3 cursor-default"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-br ${item.avatarBg} flex items-center justify-center text-[10px] font-bold text-white shadow shrink-0`}
                        >
                          {item.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-heritage-wood truncate flex items-center gap-1">
                            {item.authorName}
                            {item.isVerified && (
                              <CheckCircle2 className="w-3 h-3 text-heritage-clayLight shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-heritage-woodMuted truncate">
                            {lang === 'en' && item.authorRoleEn ? item.authorRoleEn : item.authorRole}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-0.5 shrink-0">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 text-heritage-ochre fill-heritage-ochre" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-heritage-woodLight/90 italic leading-relaxed line-clamp-3">
                      "{lang === 'en' && item.contentEn ? item.contentEn : item.contentVi}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1C2C24] text-[10px] text-heritage-woodMuted">
                    <span className="font-mono text-heritage-ochre/90 truncate max-w-[170px]">
                      {lang === 'en' && item.targetArtifactNameEn
                        ? item.targetArtifactNameEn
                        : item.targetArtifactNameVi}
                    </span>
                    <span className="shrink-0 flex items-center space-x-1">
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                      <span>{item.likes}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-heritage-woodMuted flex items-center space-x-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Lọc theo:', 'Filter:')}</span>
            </span>
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setActiveFilter(opt.id);
                  setDisplayCount(6);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === opt.id
                    ? 'bg-heritage-forest text-heritage-ochre border border-heritage-ochre/40 font-semibold shadow-sm'
                    : 'bg-[#101A15] text-heritage-woodLight hover:text-heritage-wood border border-[#23352C]'
                }`}
              >
                {t(opt.labelVi, opt.labelEn)}
              </button>
            ))}
          </div>

          <div className="text-xs text-heritage-woodMuted font-mono">
            {t(`Hiển thị ${Math.min(displayCount, filteredComments.length)} / ${filteredComments.length} phản hồi`, `Showing ${Math.min(displayCount, filteredComments.length)} of ${filteredComments.length} reviews`)}
          </div>
        </div>

        {/* Main Comments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComments.slice(0, displayCount).map((comment) => (
            <article
              key={comment.id}
              className={`rounded-2xl p-5 bg-[#0F1B15]/90 hover:bg-[#14231B] border transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm group ${
                comment.isUserCreated
                  ? 'border-emerald-500/40 bg-gradient-to-b from-[#10241A] to-[#0F1B15]'
                  : 'border-[#23352C] hover:border-heritage-ochre/40'
              }`}
            >
              {/* Top Row: User info & rating */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${comment.avatarBg} flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0`}
                    >
                      {comment.avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="font-serif font-bold text-sm text-heritage-wood group-hover:text-heritage-ochre transition-colors truncate">
                          {comment.authorName}
                        </h4>
                        {comment.isVerified && (
                          <span title={t('Tài khoản đã xác thực', 'Verified user')} className="inline-flex shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-heritage-woodMuted truncate">
                        {lang === 'en' && comment.authorRoleEn
                          ? comment.authorRoleEn
                          : comment.authorRole}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center space-x-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < comment.rating
                            ? 'text-heritage-ochre fill-heritage-ochre'
                            : 'text-stone-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Badges / Meta row */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  {comment.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-[#182C22] text-heritage-clayLight border border-heritage-clay/20 font-medium">
                      {lang === 'en' && comment.badgeEn ? comment.badgeEn : comment.badge}
                    </span>
                  )}
                  {comment.isUserCreated && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-medium">
                      {t('Bình luận mới của bạn', 'Your fresh post')}
                    </span>
                  )}
                  <span className="text-heritage-ochre/80 font-mono text-[10px] ml-auto">
                    {lang === 'en' ? comment.timeAgoEn : comment.timeAgoVi}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-heritage-woodLight leading-relaxed pt-1">
                  "{lang === 'en' && comment.contentEn ? comment.contentEn : comment.contentVi}"
                </p>
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-3 border-t border-[#1E2E25] flex items-center justify-between text-xs">
                <span className="text-[11px] text-heritage-woodMuted font-mono truncate max-w-[180px]">
                  📍{' '}
                  {lang === 'en' && comment.targetArtifactNameEn
                    ? comment.targetArtifactNameEn
                    : comment.targetArtifactNameVi}
                </span>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
                      comment.isLikedByUser
                        ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                        : 'bg-[#15241C] text-heritage-woodLight hover:text-rose-400 hover:bg-[#1E3327]'
                    }`}
                    title={t('Hữu ích / Thả tim', 'Helpful / Like')}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        comment.isLikedByUser ? 'fill-rose-400 text-rose-400' : ''
                      }`}
                    />
                    <span className="font-mono text-[11px]">{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => handleShare(comment)}
                    className="p-1 rounded-lg text-heritage-woodMuted hover:text-heritage-wood hover:bg-[#15241C] transition-colors relative"
                    title={t('Sao chép lời nhắn', 'Copy quote')}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copiedId === comment.id && (
                      <span className="absolute -top-7 right-0 bg-[#0A1611] text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/40 shadow whitespace-nowrap">
                        {t('Đã chép!', 'Copied!')}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {filteredComments.length > displayCount && (
          <div className="text-center pt-2">
            <button
              onClick={() => setDisplayCount((prev) => prev + 6)}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#101A15] hover:bg-[#182820] text-heritage-woodLight hover:text-heritage-wood text-xs font-semibold border border-[#23352C] transition-colors"
            >
              <span>
                {t(
                  `Xem thêm phản hồi khác (${filteredComments.length - displayCount})`,
                  `Load more comments (${filteredComments.length - displayCount})`
                )}
              </span>
            </button>
          </div>
        )}

      </div>

      {/* POPUP MODAL: Gửi cảm nghĩ & góp ý trực tiếp */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B1510] border border-heritage-ochre/40 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-heritage-wood">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-heritage-woodMuted hover:text-heritage-wood hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center space-x-1.5 text-heritage-ochre text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('Góp ý & Lưu bút Cộng đồng', 'Community Voice')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-heritage-wood">
                {t('Chia Sẻ Cảm Nghĩ Của Bạn', 'Share Your Living Impression')}
              </h3>
              <p className="text-xs sm:text-sm text-heritage-woodLight/80">
                {t(
                  'Ý kiến của bạn sẽ được hiển thị công khai ngay trên trang để mọi người cùng thưởng thức và đóng góp xây dựng dự án di sản.',
                  'Your review will be immediately public on this platform to celebrate and preserve Cơ Tu highland heritage together.'
                )}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Author Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold text-heritage-ochre">
                    {t('Họ tên / Tên hiển thị *', 'Your Name / Nickname *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={t('vd: Nguyễn Hoàng Anh', 'e.g. Alex Le')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122018] border border-[#23352C] focus:border-heritage-ochre text-sm text-heritage-wood placeholder-heritage-woodMuted/50 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold text-heritage-ochre">
                    {t('Bạn là ai? (Vai trò / Đơn vị)', 'Your Role / Identity')}
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder={t(
                      'vd: Frontend Dev, Người dùng Hà Nội, 3D Artist, Expat...',
                      'e.g. Frontend Dev, Hanoi User, 3D Artist, Expat...'
                    )}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122018] border border-[#23352C] focus:border-heritage-ochre text-sm text-heritage-wood placeholder-heritage-woodMuted/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick role suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {roleSuggestions.map((r, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setAuthorRole(r)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#14231B] hover:bg-[#1B3025] text-heritage-woodLight border border-[#253A2F] transition-colors"
                  >
                    + {r}
                  </button>
                ))}
              </div>

              {/* Row 2: Target Artifact & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold text-heritage-ochre">
                    {t('Hiện vật liên quan', 'Target Artifact')}
                  </label>
                  <select
                    value={targetSlug}
                    onChange={(e) => setTargetSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#122018] border border-[#23352C] focus:border-heritage-ochre text-sm text-heritage-wood focus:outline-none"
                  >
                    {artifactTargetOptions.map((opt) => (
                      <option key={opt.slug} value={opt.slug} className="bg-[#0B1510]">
                        {lang === 'en' ? opt.nameEn : opt.nameVi}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-semibold text-heritage-ochre">
                    {t('Đánh giá trải nghiệm', 'Rating')}
                  </label>
                  <div className="flex items-center space-x-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 text-heritage-woodMuted hover:text-heritage-ochre focus:outline-none transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-heritage-ochre fill-heritage-ochre'
                              : 'text-stone-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-heritage-ochre font-bold ml-2">
                      {rating}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Badge Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-heritage-ochre">
                  {t('Huy hiệu hiển thị', 'Display Badge')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickBadges.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBadgeType(b)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                        badgeType === b
                          ? 'bg-heritage-ochre text-slate-950 font-bold shadow'
                          : 'bg-[#14231B] text-heritage-woodLight hover:text-heritage-wood border border-[#23352C]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold text-heritage-ochre">
                  {t('Nội dung cảm nghĩ / Lời nhắn / Góp ý *', 'Your Message / Feedback *')}
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t(
                    'Chia sẻ cảm nhận chân thực của bạn khi trải nghiệm mô hình 3D, quét WebAR hoặc học tập văn hóa Cơ Tu...',
                    'Share your genuine thoughts on the 3D models, WebAR, or learning experience...'
                  )}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#122018] border border-[#23352C] focus:border-heritage-ochre text-sm text-heritage-wood placeholder-heritage-woodMuted/50 focus:outline-none"
                />
              </div>

              {/* Quick suggestions to fill */}
              <div className="space-y-1">
                <span className="text-[11px] text-heritage-woodMuted">
                  {t('Gợi ý ý kiến nhanh:', 'Quick suggestions:')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickSnippets.map((snippet, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setContent(snippet)}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-[#13221A] hover:bg-[#1A2E23] text-heritage-clayLight hover:text-white border border-[#23352C] text-left transition-colors truncate max-w-full"
                    >
                      "{snippet}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#23352C]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-heritage-woodMuted hover:text-heritage-wood transition-colors"
                >
                  {t('Hủy', 'Cancel')}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !authorName.trim() || !content.trim()}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-heritage-ochre to-[#B67E2D] hover:from-heritage-ochreLight hover:to-heritage-ochre text-slate-950 text-xs font-bold shadow-heritage hover:shadow-glow transition-all duration-200 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('Xuất bản công khai', 'Publish Publicly')}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
};
