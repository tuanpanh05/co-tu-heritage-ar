// Dịch vụ Nhạc Nền Chủ Đạo (Vết Mưa Piano Cover & Hòa Tấu Rừng Xanh)
// Sử dụng file MP3 chất lượng cao tại /audio/vet-mua-piano.mp3
// Mặc định tự động phát ngay khi mở trang web

type Listener = (isPlaying: boolean, trackIndex: number) => void;

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
  private isPlaying: boolean = false;
  private userMuted: boolean = false;
  private currentTrackIndex: number = 0;
  private listeners: Set<Listener> = new Set();
  private unlockBound: (() => void) | null = null;

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
    this.audio.volume = 0.45;
    this.audio.preload = 'auto';

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener('error', () => {
      // Nếu bài hiện tại gặp lỗi đường dẫn, chuyển sang bài tiếp theo
      this.currentTrackIndex = (this.currentTrackIndex + 1) % BG_MUSIC_TRACKS.length;
      if (this.audio) {
        this.audio.src = BG_MUSIC_TRACKS[this.currentTrackIndex].src;
      }
    });
  }

  private initAutoPlay(): void {
    // 1. Thử phát ngay lập tức khi mở web
    setTimeout(() => {
      if (!this.userMuted) {
        this.start();
      }
    }, 100);

    // 2. Nếu trình duyệt tạm giữ Autoplay cho đến thao tác đầu tiên,
    // tự động phát ngay khi người dùng chạm/nhấp/cuộn trang
    this.unlockBound = () => {
      if (this.userMuted) {
        this.removeUnlockListeners();
        return;
      }
      if (!this.isPlaying && this.audio) {
        this.audio
          .play()
          .then(() => {
            this.isPlaying = true;
            this.notify();
            this.removeUnlockListeners();
          })
          .catch(() => {
            // Tiếp tục chờ thao tác click/touch/keydown
          });
      } else if (this.isPlaying) {
        this.removeUnlockListeners();
      }
    };

    window.addEventListener('pointerdown', this.unlockBound, { passive: true });
    window.addEventListener('keydown', this.unlockBound, { passive: true });
    window.addEventListener('touchstart', this.unlockBound, { passive: true });
    window.addEventListener('click', this.unlockBound, { passive: true });
  }

  private removeUnlockListeners(): void {
    if (!this.unlockBound) return;
    window.removeEventListener('pointerdown', this.unlockBound);
    window.removeEventListener('keydown', this.unlockBound);
    window.removeEventListener('touchstart', this.unlockBound);
    window.removeEventListener('click', this.unlockBound);
    this.unlockBound = null;
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): BgTrack {
    return BG_MUSIC_TRACKS[this.currentTrackIndex];
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying, this.currentTrackIndex);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.isPlaying, this.currentTrackIndex));
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.userMuted = true;
      this.stop();
    } else {
      this.userMuted = false;
      this.start();
    }
    return this.isPlaying;
  }

  public nextTrack(): void {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % BG_MUSIC_TRACKS.length;
    this.userMuted = false;
    if (!this.audio) {
      this.setupAudio();
    }
    if (this.audio) {
      this.audio.src = BG_MUSIC_TRACKS[this.currentTrackIndex].src;
      this.audio.load();
      this.start();
    }
    this.notify();
  }

  public start(): void {
    this.setupAudio();
    if (!this.audio) return;

    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.notify();
      })
      .catch(() => {
        // Chờ tương tác đầu tiên để phát
      });
  }

  public stop(): void {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }
}

export const forestSoundService = new ForestSoundService();
