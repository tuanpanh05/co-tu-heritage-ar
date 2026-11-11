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
  Trash2,
  Clock,
  Smartphone,
  Monitor,
  Sparkles,
  ArrowUpRight,
  Layers,
  CheckCircle2
} from 'lucide-react';
import {
  analyticsService,
  AnalyticsState,
  AnalyticsEventType
} from '../services/analyticsService';
import { artifactService } from '../services/artifactService';
import { notebookService } from '../services/notebookService';
import { useLanguage } from '../contexts/LanguageContext';

export const DashboardPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [stats, setStats] = useState<AnalyticsState>(() => analyticsService.getState());
  const [savedWordsCount, setSavedWordsCount] = useState<number>(0);
  const [learnedWordsCount, setLearnedWordsCount] = useState<number>(0);
  const [historyFilter, setHistoryFilter] = useState<
    'all' | 'page_view' | 'artifact_ar' | 'clil_audio' | 'quiz'
  >('all');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const artifacts = artifactService.getAll();

  const refreshData = () => {
    setStats(analyticsService.getState());
    const words = notebookService.getAll();
    setSavedWordsCount(words.length);
    setLearnedWordsCount(words.filter((w) => w.learned).length);
  };

  useEffect(() => {
    refreshData();
    analyticsService.syncGlobalVisitorCounter().then(() => {
      refreshData();
    });

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
      : 0;

  const maxArtifactView = Math.max(
    1,
    ...artifacts.map((a) => stats.artifactViews[a.slug] || 0)
  );

  const filteredHistory = stats.history.filter((entry) => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'page_view') return entry.type === 'page_view';
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
      return d.toLocaleString(lang === 'en' ? 'en-US' : 'vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return iso;
    }
  };

  const getEventBadge = (type: AnalyticsEventType) => {
    switch (type) {
      case 'artifact_view':
        return {
          labelVi: 'Xem hiện vật',
          labelEn: 'Artifact View',
          color: 'bg-heritage-clay/15 text-heritage-clay border-heritage-clay/30',
          icon: Layers
        };
      case 'ar_launch':
        return {
          labelVi: 'Kích hoạt 3D/AR',
          labelEn: '3D/AR Launch',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: Rotate3d
        };
      case 'audio_play':
        return {
          labelVi: 'Nghe thuyết minh',
          labelEn: 'Audio Guide',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Headphones
        };
      case 'vocab_lookup':
      case 'vocab_save':
        return {
          labelVi: 'Từ vựng CLIL',
          labelEn: 'CLIL Vocab',
          color: 'bg-teal-100 text-teal-800 border-teal-300',
          icon: BookOpen
        };
      case 'quiz_complete':
        return {
          labelVi: 'Hoàn thành Quiz',
          labelEn: 'Quiz Completed',
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Trophy
        };
      default:
        return {
          labelVi: 'Truy cập trang',
          labelEn: 'Page Visit',
          color: 'bg-heritage-cream text-heritage-woodLight border-heritage-sand',
          icon: Eye
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-white/95 via-heritage-cream/90 to-emerald-50/70 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-heritage-sand shadow-heritage-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-heritage-clay/10 text-heritage-clay border border-heritage-clay/20 text-xs font-semibold">
              <BarChart3 className="w-4 h-4" />
              <span>
                {t(
                  'Bảng điều khiển & Số liệu thực nghiệm sư phạm',
                  'Pedagogical Analytics & Activity Dashboard'
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-semibold text-heritage-wood">
              {t(
                'Thống Kê Truy Cập & Lịch Sử Tương Tác',
                'Visitor Analytics & Interaction History'
              )}
            </h1>

            <p className="text-xs sm:text-sm text-heritage-woodLight leading-relaxed">
              {t(
                'Theo dõi trực quan lượt truy cập, mức độ quan tâm từng hiện vật 3D/AR, tần suất tra cứu từ vựng CLIL và nhật ký hoạt động theo thời gian thực.',
                'Monitor real-time visitor traffic, 3D/AR artifact engagement, CLIL vocabulary lookups, and detailed activity logs across the platform.'
              )}
            </p>

            <div className="inline-flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50/90 border border-emerald-200 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-medium">
                {t(
                  'Đang ghi nhận trực tiếp · Đã tích hợp Vercel Web Analytics',
                  'Live tracking active · Integrated with Vercel Web Analytics'
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            <button
              onClick={() => analyticsService.exportHistoryCSV()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-heritage-clay to-heritage-forest hover:from-heritage-clayDark hover:to-heritage-clay text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-glow transition-all min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>{t('Xuất báo cáo CSV (Excel)', 'Export CSV Report')}</span>
            </button>

            {stats.history.length > 0 && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-white/90 hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs sm:text-sm font-medium transition-colors min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('Làm mới nhật ký', 'Clear Log')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Page Views */}
        <div className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-heritage-woodMuted">
              {t('Tổng lượt xem trang', 'Total Page Views')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-heritage-cream text-heritage-clay flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {stats.totalPageViews}
          </div>
          <div className="text-xs text-heritage-woodMuted flex items-center justify-between pt-1 border-t border-heritage-sand/60">
            <span>{t('Bộ đếm phiên toàn cục:', 'Global session counter:')}</span>
            <strong className="text-heritage-clay">{stats.globalVisitorsSync}</strong>
          </div>
        </div>

        {/* Card 2: 3D/AR Artifact Views */}
        <div className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-heritage-woodMuted">
              {t('Khám phá 3D & AR', '3D & AR Explorations')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-heritage-cream text-heritage-clay flex items-center justify-center">
              <Rotate3d className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {totalArtifactExplorations}
          </div>
          <div className="text-xs text-heritage-woodMuted flex items-center justify-between pt-1 border-t border-heritage-sand/60">
            <span>
              {t('Xem hiện vật:', 'Artifact views:')} <strong>{stats.eventCounts.artifact_view || 0}</strong>
            </span>
            <span>
              {t('Mở AR:', 'AR launches:')} <strong className="text-heritage-clay">{stats.eventCounts.ar_launch || 0}</strong>
            </span>
          </div>
        </div>

        {/* Card 3: CLIL & Audio Guide */}
        <div className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-heritage-woodMuted">
              {t('Tương tác Học liệu CLIL', 'CLIL & Audio Actions')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-heritage-cream text-heritage-clay flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {totalClilInteractions}
          </div>
          <div className="text-xs text-heritage-woodMuted flex items-center justify-between pt-1 border-t border-heritage-sand/60">
            <span>
              {t('Tra từ:', 'Vocab lookups:')} <strong>{stats.eventCounts.vocab_lookup || 0}</strong>
            </span>
            <span>
              {t('Nghe Audio:', 'Audio plays:')} <strong className="text-heritage-clay">{stats.eventCounts.audio_play || 0}</strong>
            </span>
          </div>
        </div>

        {/* Card 4: Learning Progress & Quiz */}
        <div className="soft-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-heritage-woodMuted">
              {t('Từ vựng & Điểm Quiz', 'Vocab & Quiz Mastery')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-heritage-cream text-heritage-clay flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-semibold text-heritage-wood">
            {savedWordsCount}{' '}
            <span className="text-sm font-sans font-normal text-heritage-woodMuted">
              {t('từ đã lưu', 'saved words')}
            </span>
          </div>
          <div className="text-xs text-heritage-woodMuted flex items-center justify-between pt-1 border-t border-heritage-sand/60">
            <span>
              {t('Đã thuộc:', 'Mastered:')} <strong className="text-emerald-700">{learnedWordsCount}</strong>
            </span>
            <span>
              {t('TB Quiz:', 'Avg Quiz:')}{' '}
              <strong className="text-heritage-clay">
                {stats.quizAttempts > 0 ? `${avgQuizScore}%` : '—'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Artifact Views Ranking */}
        <div className="lg:col-span-7 soft-glass-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-semibold text-heritage-wood flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-heritage-clay" />
                <span>
                  {t('Lượt Quan Tâm Theo Từng Hiện Vật', 'Engagement by Cultural Artifact')}
                </span>
              </h2>
              <p className="text-xs text-heritage-woodMuted mt-0.5">
                {t(
                  'Thống kê số lần mở xem chi tiết và tương tác 3D của 5 hiện vật tiêu biểu',
                  'Number of detail views and 3D interactions across the 5 featured artifacts'
                )}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {artifacts.map((art) => {
              const count = stats.artifactViews[art.slug] || 0;
              const widthPct = Math.max(6, Math.round((count / maxArtifactView) * 100));
              return (
                <div key={art.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <Link
                      to={`/artifacts/${art.slug}`}
                      className="font-semibold text-heritage-wood hover:text-heritage-clay transition-colors flex items-center space-x-1.5"
                    >
                      <span>{t(art.name.vi, art.name.en)}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-heritage-woodMuted" />
                    </Link>
                    <span className="font-semibold text-heritage-clay">
                      {count} {t('lượt xem', 'views')}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-heritage-cream rounded-full overflow-hidden border border-heritage-sand/60">
                    <div
                      className="h-full bg-gradient-to-r from-heritage-clay to-heritage-clayLight rounded-full transition-all duration-500"
                      style={{ width: `${count === 0 ? 4 : widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interaction Type Breakdown */}
        <div className="lg:col-span-5 soft-glass-card rounded-3xl p-6 space-y-5">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-heritage-wood flex items-center space-x-2">
              <Activity className="w-4 h-4 text-heritage-clay" />
              <span>{t('Phân Bổ Hoạt Động Hệ Thống', 'System Activity Breakdown')}</span>
            </h2>
            <p className="text-xs text-heritage-woodMuted mt-0.5">
              {t(
                'Tổng hợp các thao tác học tập và tương tác đã ghi nhận',
                'Summary of recorded learning and exploration actions'
              )}
            </p>
          </div>

          <div className="divide-y divide-heritage-sand/60 text-xs sm:text-sm">
            {[
              {
                labelVi: 'Lượt chuyển trang & duyệt web',
                labelEn: 'Page navigation views',
                count: stats.eventCounts.page_view || 0,
                icon: Eye
              },
              {
                labelVi: 'Lượt mở trang chi tiết hiện vật',
                labelEn: 'Artifact detail explorations',
                count: stats.eventCounts.artifact_view || 0,
                icon: Layers
              },
              {
                labelVi: 'Lượt kích hoạt chế độ AR / QR di động',
                labelEn: 'WebAR / Mobile QR launches',
                count: stats.eventCounts.ar_launch || 0,
                icon: Rotate3d
              },
              {
                labelVi: 'Lượt nghe thuyết minh Audio Guide',
                labelEn: 'Bilingual Audio Guide plays',
                count: stats.eventCounts.audio_play || 0,
                icon: Headphones
              },
              {
                labelVi: 'Lượt tra cứu thuật ngữ tiếng Anh CLIL',
                labelEn: 'CLIL vocabulary popup lookups',
                count: stats.eventCounts.vocab_lookup || 0,
                icon: BookOpen
              },
              {
                labelVi: 'Lượt lưu từ mới vào Sổ tay cá nhân',
                labelEn: 'Words saved to Notebook',
                count: stats.eventCounts.vocab_save || 0,
                icon: CheckCircle2
              },
              {
                labelVi: 'Số lần hoàn thành bài Quiz từ vựng',
                labelEn: 'Completed Vocabulary Quizzes',
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

      {/* Activity History Timeline Table */}
      <div className="soft-glass-card rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-heritage-sand/70 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-semibold text-heritage-wood flex items-center space-x-2">
              <Clock className="w-4 h-4 text-heritage-clay" />
              <span>
                {t(
                  'Lịch Sử Truy Cập & Tương Tác Gần Đây',
                  'Recent Visit & Interaction History'
                )}
              </span>
            </h2>
            <p className="text-xs text-heritage-woodMuted mt-0.5">
              {t(
                `Hiển thị ${filteredHistory.length} hoạt động gần nhất theo thời gian thực`,
                `Showing the ${filteredHistory.length} most recent real-time events`
              )}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', vi: 'Tất cả', en: 'All' },
              { id: 'page_view', vi: 'Xem trang', en: 'Pages' },
              { id: 'artifact_ar', vi: 'Hiện vật & AR', en: 'Artifacts & AR' },
              { id: 'clil_audio', vi: 'Từ vựng & Audio', en: 'CLIL & Audio' },
              { id: 'quiz', vi: 'Quiz', en: 'Quiz' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setHistoryFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
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

        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-heritage-sand/60 max-h-[460px] overflow-y-auto pr-1">
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
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white border border-heritage-sand">
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
                    <span className="font-mono">{formatTime(item.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-heritage-woodMuted space-y-2">
            <Activity className="w-10 h-10 mx-auto opacity-50 text-heritage-clay" />
            <p className="text-sm font-medium">
              {t(
                'Chưa có hoạt động nào khớp với bộ lọc này.',
                'No recorded activities match this filter yet.'
              )}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal to Clear History */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-heritage-sand">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif font-semibold text-lg text-heritage-wood">
                {t('Làm mới nhật ký truy cập?', 'Reset Activity History?')}
              </h3>
              <p className="text-xs text-heritage-woodMuted">
                {t(
                  'Toàn bộ lịch sử tương tác lưu trên trình duyệt này sẽ được đặt về 0.',
                  'All local activity logs recorded in this browser will be reset to zero.'
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-heritage-cream hover:bg-heritage-sand text-heritage-wood text-xs font-semibold min-h-[42px]"
              >
                {t('Hủy bỏ', 'Cancel')}
              </button>
              <button
                onClick={() => {
                  analyticsService.clearLocalAnalytics();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold min-h-[42px]"
              >
                {t('Xác nhận xóa', 'Confirm Reset')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

