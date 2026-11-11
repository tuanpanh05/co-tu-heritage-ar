import { artifactService } from './artifactService';
import { notebookService } from './notebookService';

export type AnalyticsEventType =
  | 'page_view'
  | 'artifact_view'
  | 'ar_launch'
  | 'audio_play'
  | 'vocab_lookup'
  | 'vocab_save'
  | 'quiz_complete';

export interface AnalyticsLogEntry {
  id: string;
  type: AnalyticsEventType;
  timestamp: string; // ISO string
  path: string;
  titleVi: string;
  titleEn: string;
  detailVi?: string;
  detailEn?: string;
  artifactSlug?: string;
  device: 'mobile' | 'desktop';
}

export interface AnalyticsState {
  totalPageViews: number;
  globalVisitorsSync: number;
  artifactViews: Record<string, number>;
  eventCounts: Record<AnalyticsEventType, number>;
  quizAttempts: number;
  quizTotalScorePercent: number;
  history: AnalyticsLogEntry[];
}

const STORAGE_KEY = 'cotu_heritage_analytics_v1';
const SESSION_KEY = 'cotu_heritage_session_counted';
const CLOUD_NAMESPACE = 'cotu-heritage-ar-v1';
const MAX_HISTORY_ITEMS = 120;

const detectDevice = (): 'mobile' | 'desktop' => {
  if (typeof navigator === 'undefined') return 'desktop';
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'mobile'
    : 'desktop';
};

const createInitialState = (): AnalyticsState => {
  const artifacts = artifactService.getAll();
  const artifactViews: Record<string, number> = {};
  artifacts.forEach((a) => {
    artifactViews[a.slug] = 0;
  });

  return {
    totalPageViews: 0,
    globalVisitorsSync: 1,
    artifactViews,
    eventCounts: {
      page_view: 0,
      artifact_view: 0,
      ar_launch: 0,
      audio_play: 0,
      vocab_lookup: 0,
      vocab_save: 0,
      quiz_complete: 0
    },
    quizAttempts: 0,
    quizTotalScorePercent: 0,
    history: []
  };
};

async function incrementCloudKey(key: string): Promise<number | null> {
  try {
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    const res = await fetch(`https://api.counterapi.dev/v1/${CLOUD_NAMESPACE}/${safeKey}/up`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.count === 'number') {
        return data.count;
      }
    }
  } catch {
    // Ignore network/adblock errors seamlessly
  }
  return null;
}

async function fetchCloudKey(key: string): Promise<number | null> {
  try {
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    const res = await fetch(`https://api.counterapi.dev/v1/${CLOUD_NAMESPACE}/${safeKey}/`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.count === 'number') {
        return data.count;
      }
    }
  } catch {
    // Ignore network/adblock errors seamlessly
  }
  return null;
}

export const analyticsService = {
  getState(): AnalyticsState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const init = createInitialState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
        return init;
      }
      const parsed = JSON.parse(raw) as Partial<AnalyticsState>;
      const base = createInitialState();
      return {
        ...base,
        ...parsed,
        artifactViews: { ...base.artifactViews, ...(parsed.artifactViews || {}) },
        eventCounts: { ...base.eventCounts, ...(parsed.eventCounts || {}) },
        history: Array.isArray(parsed.history) ? parsed.history : []
      };
    } catch {
      return createInitialState();
    }
  },

  saveState(state: AnalyticsState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('cotu_analytics_updated'));
    } catch {
      // ignore storage quota errors
    }
  },

  /**
   * Đồng bộ bộ đếm phiên truy cập toàn cục qua CounterAPI
   */
  async syncGlobalVisitorCounter(): Promise<number> {
    const state = this.getState();
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

    const cloudCount = alreadyCounted
      ? await fetchCloudKey('visits')
      : await incrementCloudKey('visits');

    if (cloudCount !== null) {
      sessionStorage.setItem(SESSION_KEY, '1');
      const updated = this.getState();
      updated.globalVisitorsSync = Math.max(cloudCount, updated.globalVisitorsSync, 1);
      this.saveState(updated);
      return updated.globalVisitorsSync;
    }

    if (!alreadyCounted) {
      sessionStorage.setItem(SESSION_KEY, '1');
      state.globalVisitorsSync = Math.max((state.globalVisitorsSync || 0) + 1, state.totalPageViews);
      this.saveState(state);
    }
    return state.globalVisitorsSync;
  },

  /**
   * Đồng bộ toàn bộ số liệu Cloud (lượt xem từng hiện vật & các sự kiện chính) từ mọi thiết bị
   */
  async syncAllCloudCounters(): Promise<void> {
    const artifacts = artifactService.getAll();
    const eventKeys: AnalyticsEventType[] = [
      'page_view',
      'artifact_view',
      'ar_launch',
      'audio_play',
      'vocab_lookup',
      'vocab_save',
      'quiz_complete'
    ];

    try {
      const [visitsCloud, ...rest] = await Promise.all([
        fetchCloudKey('visits'),
        ...artifacts.map((a) => fetchCloudKey(`art_${a.slug}`)),
        ...eventKeys.map((ev) => fetchCloudKey(`ev_${ev}`))
      ]);

      const artifactCounts = rest.slice(0, artifacts.length);
      const evCounts = rest.slice(artifacts.length);

      const updated = this.getState();

      if (typeof visitsCloud === 'number') {
        updated.globalVisitorsSync = Math.max(updated.globalVisitorsSync, visitsCloud);
      }

      artifacts.forEach((a, idx) => {
        const c = artifactCounts[idx];
        if (typeof c === 'number') {
          updated.artifactViews[a.slug] = Math.max(updated.artifactViews[a.slug] || 0, c);
        }
      });

      eventKeys.forEach((ev, idx) => {
        const c = evCounts[idx];
        if (typeof c === 'number') {
          updated.eventCounts[ev] = Math.max(updated.eventCounts[ev] || 0, c);
        }
      });

      updated.totalPageViews = Math.max(
        updated.totalPageViews,
        updated.eventCounts.page_view || 0
      );

      this.saveState(updated);
    } catch {
      // Ignore offline errors
    }
  },

  logEvent(params: {
    type: AnalyticsEventType;
    path?: string;
    titleVi: string;
    titleEn: string;
    detailVi?: string;
    detailEn?: string;
    artifactSlug?: string;
    quizScorePercent?: number;
  }): void {
    const state = this.getState();
    const currentPath =
      params.path || (typeof window !== 'undefined' ? window.location.pathname : '/');

    // Chống ghi trùng liên tiếp cùng 1 sự kiện trong vòng 1.5 giây (do React StrictMode dev)
    const latest = state.history[0];
    if (
      latest &&
      latest.type === params.type &&
      latest.path === currentPath &&
      latest.titleVi === params.titleVi &&
      Date.now() - new Date(latest.timestamp).getTime() < 1500
    ) {
      return;
    }

    state.eventCounts[params.type] = (state.eventCounts[params.type] || 0) + 1;

    // Tăng bộ đếm Cloud bất đồng bộ cho loại sự kiện này
    incrementCloudKey(`ev_${params.type}`).then((cloudVal) => {
      if (typeof cloudVal === 'number') {
        const current = this.getState();
        current.eventCounts[params.type] = Math.max(current.eventCounts[params.type] || 0, cloudVal);
        if (params.type === 'page_view') {
          current.totalPageViews = Math.max(current.totalPageViews, cloudVal);
        }
        this.saveState(current);
      }
    });

    if (params.type === 'page_view') {
      state.totalPageViews += 1;
      if (state.globalVisitorsSync < state.totalPageViews) {
        state.globalVisitorsSync = state.totalPageViews;
      }
    }

    if (params.type === 'artifact_view' && params.artifactSlug) {
      const slug = params.artifactSlug;
      state.artifactViews[slug] = (state.artifactViews[slug] || 0) + 1;

      // Tăng bộ đếm Cloud cho hiện vật cụ thể này
      incrementCloudKey(`art_${slug}`).then((cloudVal) => {
        if (typeof cloudVal === 'number') {
          const current = this.getState();
          current.artifactViews[slug] = Math.max(current.artifactViews[slug] || 0, cloudVal);
          this.saveState(current);
        }
      });
    }

    if (params.type === 'quiz_complete' && typeof params.quizScorePercent === 'number') {
      state.quizAttempts += 1;
      state.quizTotalScorePercent += params.quizScorePercent;
    }

    const entry: AnalyticsLogEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: params.type,
      timestamp: new Date().toISOString(),
      path: currentPath,
      titleVi: params.titleVi,
      titleEn: params.titleEn,
      detailVi: params.detailVi,
      detailEn: params.detailEn,
      artifactSlug: params.artifactSlug,
      device: detectDevice()
    };

    state.history = [entry, ...state.history].slice(0, MAX_HISTORY_ITEMS);
    this.saveState(state);
  },

  trackPageView(pathname: string): void {
    // Bỏ qua /artifacts/:slug vì đã có trackArtifactView riêng chi tiết hơn
    if (pathname.startsWith('/artifacts/') && pathname.length > '/artifacts/'.length) {
      const state = this.getState();
      state.totalPageViews += 1;
      state.eventCounts.page_view = (state.eventCounts.page_view || 0) + 1;
      this.saveState(state);
      incrementCloudKey('ev_page_view');
      return;
    }

    const pageMap: Record<string, { vi: string; en: string }> = {
      '/': { vi: 'Truy cập Trang chủ', en: 'Visited Home Page' },
      '/artifacts': { vi: 'Xem Danh mục Hiện vật', en: 'Viewed Artifact Catalog' },
      '/learn': { vi: 'Mở Trung tâm Học tập CLIL', en: 'Opened CLIL Learning Hub' },
      '/learn/notebook': { vi: 'Mở Sổ tay Từ vựng', en: 'Opened Vocabulary Notebook' },
      '/qr-codes': { vi: 'Mở Trình tạo & In nhãn QR', en: 'Opened QR Label Generator' },
      '/dashboard': { vi: 'Xem Dashboard Thống kê', en: 'Viewed Analytics Dashboard' }
    };

    const label = pageMap[pathname] || {
      vi: `Truy cập trang ${pathname}`,
      en: `Visited ${pathname}`
    };

    this.logEvent({
      type: 'page_view',
      path: pathname,
      titleVi: label.vi,
      titleEn: label.en,
      detailVi: `Đường dẫn: ${pathname}`,
      detailEn: `Path: ${pathname}`
    });
  },

  trackArtifactView(slug: string, nameVi: string, nameEn: string): void {
    this.logEvent({
      type: 'artifact_view',
      path: `/artifacts/${slug}`,
      artifactSlug: slug,
      titleVi: `Khám phá hiện vật: ${nameVi}`,
      titleEn: `Explored artifact: ${nameEn}`,
      detailVi: 'Mở không gian 3D & học liệu song ngữ',
      detailEn: 'Opened 3D space & bilingual CLIL material'
    });
  },

  trackArLaunch(slug: string, nameVi: string, nameEn: string, mode: 'mobile_ar' | 'qr_modal'): void {
    this.logEvent({
      type: 'ar_launch',
      path: `/artifacts/${slug}`,
      artifactSlug: slug,
      titleVi: `Kích hoạt AR: ${nameVi}`,
      titleEn: `Launched WebAR: ${nameEn}`,
      detailVi:
        mode === 'mobile_ar'
          ? 'Mở camera AR trực tiếp trên di động'
          : 'Mở mã QR chuyển tiếp AR sang điện thoại',
      detailEn:
        mode === 'mobile_ar'
          ? 'Activated mobile AR camera'
          : 'Opened QR code for mobile AR handoff'
    });
  },

  trackAudioPlay(nameVi: string, nameEn: string, audioLang: 'vi' | 'en'): void {
    this.logEvent({
      type: 'audio_play',
      titleVi: `Nghe thuyết minh (${audioLang === 'vi' ? 'Tiếng Việt' : 'English'})`,
      titleEn: `Played Audio Guide (${audioLang === 'vi' ? 'Vietnamese' : 'English'})`,
      detailVi: `Hiện vật: ${nameVi}`,
      detailEn: `Artifact: ${nameEn}`
    });
  },

  trackVocabLookup(
    term: string,
    meaningVi: string,
    artifactNameVi: string,
    artifactNameEn: string
  ): void {
    this.logEvent({
      type: 'vocab_lookup',
      titleVi: `Tra cứu thuật ngữ "${term}"`,
      titleEn: `Looked up term "${term}"`,
      detailVi: `Nghĩa: ${meaningVi} · Hiện vật: ${artifactNameVi}`,
      detailEn: `Meaning: ${meaningVi} · From: ${artifactNameEn}`
    });
  },

  trackVocabSave(term: string, artifactNameVi: string, artifactNameEn: string): void {
    this.logEvent({
      type: 'vocab_save',
      titleVi: `Lưu từ vựng "${term}" vào Sổ tay`,
      titleEn: `Saved "${term}" to Vocabulary Notebook`,
      detailVi: `Nguồn: ${artifactNameVi}`,
      detailEn: `Source: ${artifactNameEn}`
    });
  },

  trackQuizComplete(score: number, total: number): void {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    this.logEvent({
      type: 'quiz_complete',
      path: '/learn',
      titleVi: `Hoàn thành Quiz từ vựng: ${score}/${total} câu (${pct}%)`,
      titleEn: `Completed Vocabulary Quiz: ${score}/${total} (${pct}%)`,
      detailVi: pct >= 70 ? 'Kết quả xuất sắc' : 'Đã hoàn thành lượt ôn tập',
      detailEn: pct >= 70 ? 'Great mastery score' : 'Completed practice attempt',
      quizScorePercent: pct
    });
  },

  exportHistoryCSV(): void {
    const state = this.getState();
    const savedWords = notebookService.getAll();
    const headers = [
      'STT',
      'Thoi_Gian_ISO',
      'Loai_Su_Kien',
      'Mo_Ta_Tieng_Viet',
      'Mo_Ta_Tieng_Anh',
      'Chi_Tiet',
      'Duong_Dan',
      'Thiet_Bi'
    ];

    const rows = state.history.map((item, idx) => [
      idx + 1,
      item.timestamp,
      item.type,
      `"${(item.titleVi || '').replace(/"/g, '""')}"`,
      `"${(item.titleEn || '').replace(/"/g, '""')}"`,
      `"${(item.detailVi || '').replace(/"/g, '""')}"`,
      item.path,
      item.device
    ]);

    const summaryLines = [
      `# BAO CAO THONG KE TRUY CAP & TUONG TAC - CO TU HERITAGE AR`,
      `# Tong luot xem trang (Page Views),${state.totalPageViews}`,
      `# Tong phien truy cap toan cuc (Global Sessions),${state.globalVisitorsSync}`,
      `# Tong luot xem hien vat (Artifact Views),${state.eventCounts.artifact_view || 0}`,
      `# Luot kich hoat 3D/AR,${state.eventCounts.ar_launch || 0}`,
      `# Luot nghe Audio Guide,${state.eventCounts.audio_play || 0}`,
      `# Luot tra cuu tu vung CLIL,${state.eventCounts.vocab_lookup || 0}`,
      `# So tu vung da luu trong So tay,${savedWords.length}`,
      `# So luot hoan thanh Quiz,${state.quizAttempts}`,
      ``
    ];

    const csvContent =
      '\uFEFF' +
      summaryLines.join('\n') +
      headers.join(',') +
      '\n' +
      rows.map((r) => r.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CoTu_Heritage_AR_Analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
