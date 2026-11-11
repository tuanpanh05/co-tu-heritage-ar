// Dịch vụ Nhạc Nền Chủ Đạo (Vết Mưa Piano Cover & Hòa Tấu Rừng Xanh)
// Mặc định BẬT (Auto-ON) ngay khi vào trang web

type Listener = (isEnabled: boolean, isActuallyPlaying: boolean, trackIndex: number) => void;

export interface BgTrack {
  id: string;
  titleVi: string;
  titleEn: string;
  src: string;
}

export const BG_MUSIC_TRACKS: BgTrack[] = [
  {
    id: 'vet-mua-piano',
    titleVi: 'Vết Mưa — Piano Cover (Nhạc nền chủ đạo)',
    titleEn: 'Vết Mưa — Soothing Piano Cover (Main Theme)',
    src: '/audio/vet-mua-piano.mp3'
  },
  {
    id: 'forest-trees',
    titleVi: 'Giai điệu Rừng Xanh (Sáo & Guitar Mộc)',
    titleEn: 'Woodland Flute & Acoustic Guitar',
    src: '/audio/bg-forest.mp3'
  },
  {
    id: 'windswept-flute',
    titleVi: 'Tiếng Sáo Đại Ngàn (Windswept Flute)',
    titleEn: 'Windswept Highland Flute',
    src: '/audio/bg-flute.mp3'
  }
];

class ForestSoundService {
  private audio: HTMLAudioElement | null = null;
  // Mặc định luôn là BẬT (true) khi mở web
  private isEnabled: boolean = true;
  private isActuallyPlaying: boolean = false;
  private currentTrackIndex: number = 0;
  private listeners: Set<Listener> = new Set();
  private unlockBound: ((e: Event) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupAudio();
      this.initAutoPlay();
    }
  }

  private setupAudio(): void {
    if (this.audio) return;
    const track = BG_MUSIC_TRACKS[this.currentTrackIndex];
    this.audio = new Audio(track.src);
    this.audio.loop = true;
    this.audio.volume = 0.48;
    this.audio.preload = 'auto';
    this.audio.autoplay = true;

    this.audio.addEventListener('play', () => {
      this.isActuallyPlaying = true;
      this.notify();
    });

    this.audio.addEventListener('playing', () => {
      this.isActuallyPlaying = true;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.isActuallyPlaying = false;
      this.notify();
    });

    // Ngay khi file tải đủ dữ liệu đầu tiên, nếu đang ở chế độ Bật thì phát luôn
    this.audio.addEventListener('canplay', () => {
      if (this.isEnabled && this.audio && this.audio.paused) {
        this.tryPlay();
      }
    });
  }

  private tryPlay(): void {
    if (!this.audio || !this.isEnabled) return;
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isActuallyPlaying = true;
          this.notify();
          this.removeUnlockListeners();
        })
        .catch(() => {
          // Trình duyệt yêu cầu tương tác đầu tiên sau khi F5
          this.isActuallyPlaying = false;
          this.notify();
        });
    }
  }

  private initAutoPlay(): void {
    // 1. Thử phát ngay lập tức khi khởi tạo
    this.tryPlay();
    setTimeout(() => this.tryPlay(), 250);
    setTimeout(() => this.tryPlay(), 800);

    // 2. Bắt mọi thao tác đầu tiên trên trang để mở khóa âm thanh tức thì
    // (Bỏ qua nếu người dùng đang bấm trực tiếp vào nút Tắt nhạc để tránh xung đột)
    this.unlockBound = (e: Event) => {
      if (!this.isEnabled) {
        this.removeUnlockListeners();
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && target.closest && target.closest('[data-music-control="true"]')) {
        return;
      }
      if (this.audio && this.audio.paused) {
        this.tryPlay();
      } else if (this.audio && !this.audio.paused) {
        this.removeUnlockListeners();
      }
    };

    const events = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'wheel', 'scroll', 'mousemove'];
    events.forEach((ev) => {
      window.addEventListener(ev, this.unlockBound!, { passive: true });
    });
  }

  private removeUnlockListeners(): void {
    if (!this.unlockBound) return;
    const events = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'wheel', 'scroll', 'mousemove'];
    events.forEach((ev) => {
      window.removeEventListener(ev, this.unlockBound!);
    });
    this.unlockBound = null;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.isEnabled, this.isActuallyPlaying, this.currentTrackIndex);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) =>
      fn(this.isEnabled, this.isActuallyPlaying, this.currentTrackIndex)
    );
  }

  public toggle(): boolean {
    this.setupAudio();
    // Nếu đang ở trạng thái Bật nhưng trình duyệt chưa kịp phát (audio.paused),
    // bấm vào nút sẽ phát nhạc ngay thay vì tắt!
    if (this.isEnabled && this.audio && this.audio.paused) {
      this.tryPlay();
      return true;
    }

    if (this.isEnabled) {
      this.isEnabled = false;
      this.stop();
    } else {
      this.isEnabled = true;
      this.tryPlay();
      this.notify();
    }
    return this.isEnabled;
  }

  public nextTrack(): void {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % BG_MUSIC_TRACKS.length;
    this.isEnabled = true;
    this.setupAudio();
    if (this.audio) {
      this.audio.src = BG_MUSIC_TRACKS[this.currentTrackIndex].src;
      this.audio.load();
      this.tryPlay();
    }
    this.notify();
  }

  public stop(): void {
    if (this.audio) {
      this.audio.pause();
    }
    this.isActuallyPlaying = false;
    this.notify();
  }
}

export const forestSoundService = new ForestSoundService();
