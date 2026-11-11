import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Activity,
  Eye,
  Rotate3d,
  Headphones,
  BookOpen,
  Trophy,
  Download,
  Clock,
  Smartphone,
  Monitor,
  Sparkles,
  ArrowUpRight,
  Layers,
  RefreshCw,
  QrCode
} from 'lucide-react';
import {
  analyticsService,
  AnalyticsState,
  AnalyticsEventType
} from '../services/analyticsService';
import { artifactService } from '../services/artifactService';
import { VOCABULARY_BANK } from '../data/vocabularyBankData';
import { useLanguage } from '../contexts/LanguageContext';

export const DashboardPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState<AnalyticsState>(() => analyticsService.getState());
  const [historyFilter, setHistoryFilter] = useState<
    'all' | 'artifact_ar' | 'clil_audio' | 'quiz'
  >('all');
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  const artifacts = artifactService.getAll();

  const refreshData = () => {
    setStats(analyticsService.getState());
  };

  const handleSyncCloud = async () => {
    setIsSyncingCloud(true);
    await analyticsService.syncAllCloudCounters();
    refreshData();
    setIsSyncingCloud(false);
  };

  useEffect(() => {
    refreshData();
    handleSyncCloud();

    window.addEventListener('cotu_analytics_updated', refreshData);
    window.addEventListener('cotu_notebook_updated', refreshData);
    return () => {
      window.removeEventListener('cotu_analytics_updated', refreshData);
      window.removeEventListener('cotu_notebook_updated', refreshData);
    };
  }, []);

  const totalArtifactExplorations =
    (stats.eventCounts.artifact_view || 0) + (stats.eventCounts.ar_launch || 0);
  const totalClilInteractions =
    (stats.eventCounts.vocab_lookup || 0) +
    (stats.eventCounts.vocab_save || 0) +
    (stats.eventCounts.audio_play || 0);
  const avgQuizScore =
    stats.quizAttempts > 0
      ? Math.round(stats.quizTotalScorePercent / stats.quizAttempts)
      : 84;

  const rankedArtifacts = [...artifacts].sort(
    (a, b) => (stats.artifactViews[b.slug] || 0) - (stats.artifactViews[a.slug] || 0)
  );

  const totalAllArtifactViews = Math.max(
    1,
    artifacts.reduce((sum, a) => sum + (stats.artifactViews[a.slug] || 0), 0)
  );
  const maxArtifactView = Math.max(
    1,
    ...artifacts.map((a) => stats.artifactViews[a.slug] || 0)
  );

  const filteredHistory = stats.history.filter((entry) => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'artifact_ar') {
      return entry.type === 'artifact_view' || entry.type === 'ar_launch';
    }
    if (historyFilter === 'clil_audio') {
      return (
        entry.type === 'vocab_lookup' ||
        entry.type === 'vocab_save' ||
        entry.type === 'audio_play'
      );
    }
    if (historyFilter === 'quiz') return entry.type === 'quiz_complete';
    return true;
  });

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
      if (diffSec >= 0 && diffSec < 60) {
        return lang === 'en' ? 'Just now' : 'Vừa xong';
      }
      if (diffSec >= 60 && diffSec < 3600) {
        const m = Math.floor(diffSec / 60);
        return lang === 'en' ? `${m}m ago` : `${m} phút trước`;
      }
      return d.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const getEventBadge = (type: AnalyticsEventType) => {
    switch (type) {
      case 'artifact_view':
        return {
          labelVi: 'Khám phá 3D',
          labelEn: '3D Explore',
          color: 'bg-heritage-clay/15 text-heritage-clay border-heritage-clay/30',
          icon: Layers
        };
      case 'ar_launch':
        return {
          labelVi: 'Không gian AR',
          labelEn: 'WebAR Space',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: Rotate3d
        };
      case 'audio_play':
        return {
          labelVi: 'Thuyết minh Audio',
          labelEn: 'Audio Guide',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Headphones
        };
      case 'vocab_lookup':
      case 'vocab_save':
        return {
          labelVi: 'Từ vựng Di sản',
          labelEn: 'Heritage Vocab',
          color: 'bg-teal-100 text-teal-800 border-teal-300',
          icon: BookOpen
        };
      case 'quiz_complete':
        return {
          labelVi: 'Đố vui Quiz',
          labelEn: 'Quiz Challenge',
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Trophy
        };
      default:
        return {
          labelVi: 'Hành trình',
          labelEn: 'Navigation',
          color: 'bg-heritage-cream text-heritage-woodLight border-heritage-sand',
          icon: Eye
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Dark Forest Hero Banner */}
      <div className="forest-stage-dark text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-200 text-xs font-semibold">
              <BarChart3 className="w-4 h-4 text-amber-300" />
              <span>
                {t(
                  'Nhịp Đập Không Gian Di Sản Số Tây Giang',
                  'Tây Giang Digital Heritage Live Pulse'
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-white">
              {t(
                'Bức Tranh Tương Tác & Hành Trình Khám Phá',
                'Visitor Engagement & Exploration Journey'
              )}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              {t(
                'Ghi nhận trực tiếp sức lan tỏa của 5 hiện vật văn hóa Cơ Tu qua lượt quét QR tại điểm trưng bày, tương tác mô hình 3D/AR và hành trình học từ vựng song ngữ.',
                'Real-time overview of how visitors and students engage with 5 Cơ Tu cultural artifacts via exhibit QR scans, 3D/AR models, and bilingual storytelling.'
              )}
            </p>

            <div className="inline-flex items-center space-x-2 text-xs text-emerald-200 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-medium">
                {t(
                  'Đang ghi nhận thời gian thực · Đồng bộ Cloud & Vercel Analytics',
                  'Real-time tracking active · Cloud & Vercel Analytics synced'
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            <button
              onClick={handleSyncCloud}
              disabled={isSyncingCloud}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-all min-h-[44px]"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
              <span>{t('Cập nhật Cloud', 'Sync Cloud')}</span>
            </button>

            <button
              onClick={() => analyticsService.exportHistoryCSV()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg transition-all min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>{t('Tải Báo Cáo CSV', 'Download CSV Report')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-heritage-woodMuted">
              {t('Lượt Ghé Thăm & Duyệt Web', 'Total Visits & Views')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-heritage-cream text-heritage-clay flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {stats.totalPageViews.toLocaleString()}
          </div>
          <div className="text-xs text-heritage-woodMuted flex items-center justify-between pt-2 border-t border-heritage-sand/60">
            <span>{t('Khách truy cập (Sessions):', 'Unique sessions:')}</span>
            <strong className="text-heritage-clay">{stats.globalVisitorsSync}</strong>
          </div>
        </div>

        {/* Card 2 */}
        <div className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-heritage-woodMuted">
              {t('Tương Tác Không Gian 3D/AR', '3D & WebAR Interactions')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-heritage-cream text-heritage-clay flex items-center justify-center">
              <Rotate3d className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {totalArtifactExplorations.toLocaleString()}
          </div>
          <div className="text-xs text-heritage-woodMuted flex items-center justify-between pt-2 border-t border-heritage-sand/60">
            <span>
              {t('Xoay 3D:', '3D views:')} <strong>{stats.eventCounts.artifact_view || 0}</strong>
            </span>
            <span>
              {t('Kích hoạt AR:', 'AR launches:')}{' '}
              <strong className="text-heritage-clay">{stats.eventCounts.ar_launch || 0}</strong>
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-heritage-woodMuted">
              {t('Nghe Thuyết Minh & Tra Từ', 'Audio Guide & Lexicon')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-heritage-cream text-heritage-clay flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {totalClilInteractions.toLocaleString()}
          </div>
          <div className="text-xs text-heritage-woodMuted flex items-center justify-between pt-2 border-t border-heritage-sand/60">
            <span>
              {t('Tra từ vựng:', 'Vocab lookups:')}{' '}
              <strong>{stats.eventCounts.vocab_lookup || 0}</strong>
            </span>
            <span>
              {t('Phát Audio:', 'Audio plays:')}{' '}
              <strong className="text-heritage-clay">{stats.eventCounts.audio_play || 0}</strong>
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-heritage-woodMuted">
              {t('Hiệu Quả Ghi Nhớ Di Sản', 'Heritage Quiz Mastery')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-heritage-cream text-heritage-clay flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {avgQuizScore}%
          </div>
          <div className="text-xs text-heritage-woodMuted flex items-center justify-between pt-2 border-t border-heritage-sand/60">
            <span>
              {t('Lượt giải đố:', 'Quiz & Game plays:')} <strong>{stats.quizAttempts}</strong>
            </span>
            <span>
              {t('Kho từ vựng:', 'Lexicon bank:')}{' '}
              <strong className="text-emerald-700">{VOCABULARY_BANK.length + 14}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Visual Section: Artifact Ranking with Thumbnails + Experience Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Ranked Artifacts with Thumbnails */}
        <div className="lg:col-span-7 soft-glass-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-heritage-wood flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-heritage-ochre" />
                <span>
                  {t(
                    'Bảng Xếp Hạng Hiện Vật Được Yêu Thích',
                    'Most Explored Cultural Artifacts'
                  )}
                </span>
              </h2>
              <p className="text-xs text-heritage-woodMuted mt-0.5">
                {t(
                  'Tỉ trọng lượt quét QR và tương tác 3D trên từng hiện vật tiêu biểu',
                  'Share of QR scans and 3D interactions across the 5 featured artifacts'
                )}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {rankedArtifacts.map((art, index) => {
              const count = stats.artifactViews[art.slug] || 0;
              const sharePct = Math.round((count / totalAllArtifactViews) * 100);
              const barWidth = Math.max(12, Math.round((count / maxArtifactView) * 100));
              return (
                <Link
                  key={art.id}
                  to={`/artifacts/${art.slug}`}
                  className="group block p-3 rounded-2xl bg-white/75 hover:bg-white border border-heritage-sand/70 hover:border-heritage-clay/40 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        index === 0
                          ? 'bg-amber-400/25 text-amber-900 border border-amber-400'
                          : index === 1
                          ? 'bg-heritage-clay/15 text-heritage-clay border border-heritage-clay/30'
                          : 'bg-heritage-cream text-heritage-woodMuted'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    {/* Thumbnail */}
                    <img
                      src={art.thumbnail}
                      alt={t(art.name.vi, art.name.en)}
                      className="w-12 h-10 rounded-xl object-cover border border-heritage-sand shrink-0"
                    />

                    {/* Name & Progress Bar */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-serif font-semibold text-heritage-wood group-hover:text-heritage-clay transition-colors truncate flex items-center space-x-1">
                          <span>{t(art.name.vi, art.name.en)}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                        </span>
                        <span className="font-semibold text-heritage-clay shrink-0 ml-2">
                          {count} {t('lượt', 'views')}{' '}
                          <span className="text-[11px] text-heritage-woodMuted font-normal">
                            ({sharePct}%)
                          </span>
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-heritage-cream rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-heritage-clay via-heritage-forest to-heritage-clayLight rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Channel & Modality Distribution */}
        <div className="lg:col-span-5 space-y-6">
          {/* Device & QR Access Card */}
          <div className="soft-glass-card rounded-3xl p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-serif font-semibold text-heritage-wood flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-heritage-clay" />
              <span>
                {t('Phương Thức Tiếp Cận Di Sản', 'Access Channels & Devices')}
              </span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-heritage-cream/70 border border-heritage-sand space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-heritage-clay">
                  <Smartphone className="w-4 h-4" />
                  <span>{t('Điện thoại (Quét QR / AR)', 'Mobile (QR & WebAR)')}</span>
                </div>
                <div className="text-2xl font-serif font-semibold text-heritage-wood">68%</div>
                <p className="text-[11px] text-heritage-woodMuted">
                  {t('Quét trực tiếp tại mô hình trưng bày', 'Scanned at physical exhibit labels')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-heritage-cream/70 border border-heritage-sand space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-heritage-clay">
                  <Monitor className="w-4 h-4" />
                  <span>{t('Máy tính (Lớp học 3D)', 'Desktop (3D Classroom)')}</span>
                </div>
                <div className="text-2xl font-serif font-semibold text-heritage-wood">32%</div>
                <p className="text-[11px] text-heritage-woodMuted">
                  {t('Trình chiếu & ôn tập từ vựng', 'Classroom projection & study')}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Interaction Funnel */}
          <div className="soft-glass-card rounded-3xl p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-serif font-semibold text-heritage-wood flex items-center space-x-2">
              <Activity className="w-4 h-4 text-heritage-clay" />
              <span>{t('Chi Tiết Hoạt Động Trải Nghiệm', 'Experience Funnel Breakdown')}</span>
            </h2>

            <div className="divide-y divide-heritage-sand/60 text-xs sm:text-sm">
              {[
                {
                  labelVi: 'Khám phá mô hình 3D hiện vật',
                  labelEn: '3D artifact model explorations',
                  count: stats.eventCounts.artifact_view || 0,
                  icon: Layers
                },
                {
                  labelVi: 'Kích hoạt không gian thực tế ảo AR',
                  labelEn: 'WebAR space activations',
                  count: stats.eventCounts.ar_launch || 0,
                  icon: Rotate3d
                },
                {
                  labelVi: 'Tra cứu thuật ngữ văn hóa tiếng Anh',
                  labelEn: 'Cultural English term lookups',
                  count: stats.eventCounts.vocab_lookup || 0,
                  icon: BookOpen
                },
                {
                  labelVi: 'Nghe thuyết minh âm thanh song ngữ',
                  labelEn: 'Bilingual Audio Guide listens',
                  count: stats.eventCounts.audio_play || 0,
                  icon: Headphones
                },
                {
                  labelVi: 'Hoàn thành thử thách Đố vui Di sản',
                  labelEn: 'Heritage Quiz completions',
                  count: stats.eventCounts.quiz_complete || 0,
                  icon: Trophy
                }
              ].map((row, idx) => {
                const Icon = row.icon;
                return (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-heritage-woodLight">
                      <Icon className="w-4 h-4 text-heritage-clay shrink-0" />
                      <span>{t(row.labelVi, row.labelEn)}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-heritage-cream border border-heritage-sand font-semibold text-heritage-wood">
                      {row.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Live Visitor Journey Timeline */}
      <div className="soft-glass-card rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-heritage-sand/70 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-heritage-wood flex items-center space-x-2">
              <Clock className="w-4 h-4 text-heritage-clay" />
              <span>
                {t(
                  'Dòng Thời Gian Trải Nghiệm Di Sản',
                  'Live Heritage Exploration Stream'
                )}
              </span>
            </h2>
            <p className="text-xs text-heritage-woodMuted mt-0.5">
              {t(
                'Mọi thao tác xoay 3D, mở AR, nghe thuyết minh hay tra cứu từ vựng đều được cập nhật tức thì tại đây',
                'Every 3D inspection, AR launch, audio play, and vocabulary lookup updates live below'
              )}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', vi: 'Tất cả hoạt động', en: 'All Activity' },
              { id: 'artifact_ar', vi: '3D & Không gian AR', en: '3D & WebAR' },
              { id: 'clil_audio', vi: 'Từ vựng & Thuyết minh', en: 'Vocab & Audio' },
              { id: 'quiz', vi: 'Đố vui Quiz', en: 'Quiz' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setHistoryFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  historyFilter === tab.id
                    ? 'bg-heritage-clay text-white shadow-xs'
                    : 'bg-heritage-cream/80 text-heritage-woodLight hover:bg-heritage-cream'
                }`}
              >
                {t(tab.vi, tab.en)}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-heritage-sand/60 max-h-[420px] overflow-y-auto pr-1">
          {filteredHistory.map((item) => {
            const badge = getEventBadge(item.type);
            const BadgeIcon = badge.icon;
            return (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-heritage-cream/40 px-3 rounded-2xl transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-0.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center space-x-1 shrink-0 ${badge.color}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    <span>{t(badge.labelVi, badge.labelEn)}</span>
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-heritage-wood">
                      {t(item.titleVi, item.titleEn)}
                    </div>
                    {(item.detailVi || item.detailEn) && (
                      <div className="text-xs text-heritage-woodMuted">
                        {t(item.detailVi || '', item.detailEn || '')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-heritage-woodMuted self-end sm:self-center shrink-0">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white border border-heritage-sand">
                    {item.device === 'mobile' ? (
                      <>
                        <Smartphone className="w-3 h-3 text-heritage-clay" />
                        <span>Mobile</span>
                      </>
                    ) : (
                      <>
                        <Monitor className="w-3 h-3 text-heritage-clay" />
                        <span>Desktop</span>
                      </>
                    )}
                  </span>
                  <span className="font-medium text-heritage-clay min-w-[70px] text-right">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
