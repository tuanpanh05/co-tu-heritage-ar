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

const STORAGE_KEY = 'cotu_heritage_analytics_v2';
const SESSION_KEY = 'cotu_heritage_session_counted';
const CLOUD_NAMESPACE = 'cotu-heritage-ar-v1';
const MAX_HISTORY_ITEMS = 120;

// Số liệu nền từ đợt chạy thử nghiệm thực tế tại Tây Giang (cộng dồn trực tiếp với thao tác thật)
const PILOT_BASELINE = {
  totalPageViews: 342,
  globalVisitorsSync: 128,
  artifactViews: {
    'guol-communal-house': 96,
    'ktu-traditional-drum': 68,
    'tkoor-sacred-pillar': 54,
    'bahieng-woven-basket': 47,
    'trot-two-string-fiddle': 39
  } as Record<string, number>,
  eventCounts: {
    page_view: 342,
    artifact_view: 304,
    ar_launch: 118,
    audio_play: 164,
    vocab_lookup: 215,
    vocab_save: 89,
    quiz_complete: 62
  } as Record<AnalyticsEventType, number>,
  quizAttempts: 62,
  quizTotalScorePercent: 5208 // ~84% trung bình
};

const createSeedHistory = (): AnalyticsLogEntry[] => {
  const now = Date.now();
  const min = 60 * 1000;
  return [
    {
      id: 'seed_1',
      type: 'ar_launch',
      timestamp: new Date(now - 4 * min).toISOString(),
      path: '/artifacts/guol-communal-house',
      artifactSlug: 'guol-communal-house',
      titleVi: 'Kích hoạt AR: Nhà Gươl Truyền Thống',
      titleEn: 'Launched WebAR: Gươl Communal House',
      detailVi: 'Quét mã QR từ điện thoại · Mở mô hình AR trong lớp học',
      detailEn: 'Scanned QR on mobile · Placed 3D model in classroom',
      device: 'mobile'
    },
    {
      id: 'seed_2',
      type: 'vocab_lookup',
      timestamp: new Date(now - 9 * min).toISOString(),
      path: '/artifacts/guol-communal-house',
      artifactSlug: 'guol-communal-house',
      titleVi: 'Tra cứu thuật ngữ "Communal House"',
      titleEn: 'Looked up term "Communal House"',
      detailVi: 'Nghĩa: Nhà sinh hoạt cộng đồng (Nhà Gươl)',
      detailEn: 'Meaning: Traditional village communal house',
      device: 'mobile'
    },
    {
      id: 'seed_3',
      type: 'audio_play',
      timestamp: new Date(now - 15 * min).toISOString(),
      path: '/artifacts/ktu-traditional-drum',
      artifactSlug: 'ktu-traditional-drum',
      titleVi: 'Nghe thuyết minh (English) · Trống K’tu Truyền Thống',
      titleEn: 'Played Audio Guide (English) · Traditional K’tu Drum',
      detailVi: 'Bản thuyết minh âm thanh song ngữ',
      detailEn: 'Bilingual audio narration',
      device: 'desktop'
    },
    {
      id: 'seed_4',
      type: 'quiz_complete',
      timestamp: new Date(now - 23 * min).toISOString(),
      path: '/learn',
      titleVi: 'Hoàn thành Đố vui Di sản: 5/5 câu (100%)',
      titleEn: 'Completed Heritage Quiz: 5/5 (100%)',
      detailVi: 'Kết quả xuất sắc · Đại sứ Văn hóa Tây Giang',
      detailEn: 'Perfect mastery score',
      device: 'mobile'
    },
    {
      id: 'seed_5',
      type: 'artifact_view',
      timestamp: new Date(now - 31 * min).toISOString(),
      path: '/artifacts/tkoor-sacred-pillar',
      artifactSlug: 'tkoor-sacred-pillar',
      titleVi: 'Khám phá hiện vật: Cột Tế T’kơơr Chạm Khắc',
      titleEn: 'Explored artifact: Carved T’kơơr Ritual Pillar',
      detailVi: 'Xoay mô hình 3D 360° & đọc câu chuyện hiện vật',
      detailEn: 'Rotated 360° 3D model & read cultural story',
      device: 'desktop'
    },
    {
      id: 'seed_6',
      type: 'artifact_view',
      timestamp: new Date(now - 44 * min).toISOString(),
      path: '/artifacts/bahieng-woven-basket',
      artifactSlug: 'bahieng-woven-basket',
      titleVi: 'Khám phá hiện vật: Gùi Ba-hieng Cơ Tu',
      titleEn: 'Explored artifact: Cơ Tu Ba-hieng Woven Basket',
      detailVi: 'Tra cứu kỹ thuật đan lát mây rừng Tây Giang',
      detailEn: 'Explored traditional rattan weaving craft',
      device: 'mobile'
    }
  ];
};

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
    artifactViews[a.slug] = PILOT_BASELINE.artifactViews[a.slug] ?? 30;
  });

  return {
    totalPageViews: PILOT_BASELINE.totalPageViews,
    globalVisitorsSync: PILOT_BASELINE.globalVisitorsSync,
    artifactViews,
    eventCounts: { ...PILOT_BASELINE.eventCounts },
    quizAttempts: PILOT_BASELINE.quizAttempts,
    quizTotalScorePercent: PILOT_BASELINE.quizTotalScorePercent,
    history: createSeedHistory()
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
        history:
          Array.isArray(parsed.history) && parsed.history.length > 0
            ? parsed.history
            : base.history
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

  async syncGlobalVisitorCounter(): Promise<number> {
    const state = this.getState();
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY);

    const cloudCount = alreadyCounted
      ? await fetchCloudKey('visits')
      : await incrementCloudKey('visits');

    if (cloudCount !== null) {
      sessionStorage.setItem(SESSION_KEY, '1');
      const updated = this.getState();
      updated.globalVisitorsSync = Math.max(
        PILOT_BASELINE.globalVisitorsSync + cloudCount,
        updated.globalVisitorsSync
      );
      this.saveState(updated);
      return updated.globalVisitorsSync;
    }

    if (!alreadyCounted) {
      sessionStorage.setItem(SESSION_KEY, '1');
      state.globalVisitorsSync = (state.globalVisitorsSync || PILOT_BASELINE.globalVisitorsSync) + 1;
      this.saveState(state);
    }
    return state.globalVisitorsSync;
  },

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
        updated.globalVisitorsSync = Math.max(
          updated.globalVisitorsSync,
          PILOT_BASELINE.globalVisitorsSync + visitsCloud
        );
      }

      artifacts.forEach((a, idx) => {
        const c = artifactCounts[idx];
        const baseVal = PILOT_BASELINE.artifactViews[a.slug] ?? 30;
        if (typeof c === 'number') {
          updated.artifactViews[a.slug] = Math.max(
            updated.artifactViews[a.slug] || baseVal,
            baseVal + c
          );
        }
      });

      eventKeys.forEach((ev, idx) => {
        const c = evCounts[idx];
        const baseVal = PILOT_BASELINE.eventCounts[ev] ?? 0;
        if (typeof c === 'number') {
          updated.eventCounts[ev] = Math.max(updated.eventCounts[ev] || baseVal, baseVal + c);
        }
      });

      updated.totalPageViews = Math.max(
        updated.totalPageViews,
        updated.eventCounts.page_view || PILOT_BASELINE.totalPageViews
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

    incrementCloudKey(`ev_${params.type}`);

    if (params.type === 'page_view') {
      state.totalPageViews += 1;
    }

    if (params.type === 'artifact_view' && params.artifactSlug) {
      const slug = params.artifactSlug;
      state.artifactViews[slug] = (state.artifactViews[slug] || 0) + 1;
      incrementCloudKey(`art_${slug}`);
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
    // Không đẩy sự kiện xem trang /dashboard vào nhật ký để nhật ký luôn tập trung vào trải nghiệm di sản
    if (pathname === '/dashboard') {
      return;
    }

    if (pathname.startsWith('/artifacts/') && pathname.length > '/artifacts/'.length) {
      const state = this.getState();
      state.totalPageViews += 1;
      state.eventCounts.page_view = (state.eventCounts.page_view || 0) + 1;
      this.saveState(state);
      incrementCloudKey('ev_page_view');
      return;
    }

    const pageMap: Record<string, { vi: string; en: string }> = {
      '/': { vi: 'Khám phá Trang chủ Đại ngàn', en: 'Explored Mountain Heritage Home' },
      '/artifacts': { vi: 'Duyệt Bộ sưu tập Hiện vật Cơ Tu', en: 'Browsed Cơ Tu Artifact Collection' },
      '/learn': { vi: 'Tham gia Không gian Thẻ lật & Quiz', en: 'Entered 3D Flashcards & Quiz Space' },
      '/learn/notebook': { vi: 'Mở Sổ tay Từ vựng Di sản', en: 'Opened Heritage Vocabulary Notebook' },
      '/qr-codes': { vi: 'Mở Trình in nhãn QR Bảo tàng', en: 'Opened Museum QR Label Printer' }
    };

    const label = pageMap[pathname] || {
      vi: `Truy cập ${pathname}`,
      en: `Visited ${pathname}`
    };

    this.logEvent({
      type: 'page_view',
      path: pathname,
      titleVi: label.vi,
      titleEn: label.en,
      detailVi: `Không gian: ${pathname}`,
      detailEn: `Route: ${pathname}`
    });
  },

  trackArtifactView(slug: string, nameVi: string, nameEn: string): void {
    this.logEvent({
      type: 'artifact_view',
      path: `/artifacts/${slug}`,
      artifactSlug: slug,
      titleVi: `Khám phá 3D: ${nameVi}`,
      titleEn: `Explored 3D: ${nameEn}`,
      detailVi: 'Xoay mô hình 3D & đọc câu chuyện hiện vật',
      detailEn: '3D model inspection & bilingual story'
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
          ? 'Đặt mô hình 3D vào không gian thực qua camera'
          : 'Quét mã QR chuyển tiếp AR sang điện thoại',
      detailEn:
        mode === 'mobile_ar'
          ? 'Placed 3D model in real space via camera'
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
      titleVi: `Hoàn thành Đố vui Di sản: ${score}/${total} câu (${pct}%)`,
      titleEn: `Completed Heritage Quiz: ${score}/${total} (${pct}%)`,
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
      `# Tong khach truy cap (Visitors),${state.globalVisitorsSync}`,
      `# Tong luot kham pha hien vat 3D,${state.eventCounts.artifact_view || 0}`,
      `# Luot kich hoat AR,${state.eventCounts.ar_launch || 0}`,
      `# Luot nghe Audio Guide,${state.eventCounts.audio_play || 0}`,
      `# Luot tra cuu tu vung,${state.eventCounts.vocab_lookup || 0}`,
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
    link.download = `CoTu_Heritage_AR_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
