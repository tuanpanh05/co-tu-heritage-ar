// Dịch vụ Nhạc Nền Đại Ngàn Trường Sơn & Không gian Âm thanh Tây Giang
// Mặc định phát nhẹ nhàng (volume 0.26) mang cảm giác sớm mai trong rừng có sương

type Listener = (isEnabled: boolean, isActuallyPlaying: boolean, trackIndex: number) => void;

export interface BgTrack {
  id: string;
  titleVi: string;
  titleEn: string;
  src: string;
}

export const BG_MUSIC_TRACKS: BgTrack[] = [
  {
    id: 'forest-trees',
    titleVi: 'Đại Ngàn Trường Sơn (Sương sớm & Tiếng chim rừng)',
    titleEn: 'Trường Sơn Forest Mist & Morning Birds',
    src: '/audio/bg-forest.mp3'
  },
  {
    id: 'windswept-flute',
    titleVi: 'Tiếng Sáo Đại Ngàn (Windswept Highland Flute)',
    titleEn: 'Windswept Highland Flute',
    src: '/audio/bg-flute.mp3'
  },
  {
    id: 'vet-mua-piano',
    titleVi: 'Giai Điệu Trầm Tĩnh (Acoustic Reverie)',
    titleEn: 'Acoustic Reverie',
    src: '/audio/vet-mua-piano.mp3'
  }
];

class ForestSoundService {
  private audio: HTMLAudioElement | null = null;
  private isEnabled: boolean = true;
  private isActuallyPlaying: boolean = false;
  private currentTrackIndex: number = 0;
  private baseVolume: number = 0.28;
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
    this.audio.volume = this.baseVolume;
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
          this.isActuallyPlaying = false;
          this.notify();
        });
    }
  }

  private initAutoPlay(): void {
    this.tryPlay();
    setTimeout(() => this.tryPlay(), 250);
    setTimeout(() => this.tryPlay(), 800);

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

  /**
   * Giảm âm lượng tạm thời (audio ducking) khi có lời kể của già làng
   */
  public duckVolume(targetVolume: number = 0.08): void {
    if (this.audio) {
      this.audio.volume = Math.max(0.04, targetVolume);
    }
  }

  /**
   * Khôi phục âm lượng nhẹ nhàng ban đầu
   */
  public restoreVolume(): void {
    if (this.audio) {
      this.audio.volume = this.baseVolume;
    }
  }
}

export const forestSoundService = new ForestSoundService();
