// Dịch vụ Âm thanh Bản địa & Vi tương tác Xúc giác (Indigenous Acoustic & Tactile Soundscape)
// Sử dụng Web Audio API để tạo âm thanh hữu cơ (gỗ, da trâu, cồng chiêng) không độ trễ
// và quản lý giọng kể chân thật của già làng Tây Giang

import { forestSoundService } from './forestSoundService';

type SoundListener = (isPlayingStory: boolean, activeStorySlug?: string) => void;

class HeritageSoundService {
  private audioCtx: AudioContext | null = null;
  private currentStoryAudio: HTMLAudioElement | null = null;
  private isStoryPlaying: boolean = false;
  private activeStorySlug: string | null = null;
  private listeners: Set<SoundListener> = new Set();

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public subscribe(listener: SoundListener): () => void {
    this.listeners.add(listener);
    listener(this.isStoryPlaying, this.activeStorySlug || undefined);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) =>
      fn(this.isStoryPlaying, this.activeStorySlug || undefined)
    );
  }

  /**
   * Âm thanh gõ gỗ mộc (Tactile Wood Click)
   * Nhẹ, tự nhiên, mô phỏng tiếng chạm vào thanh gỗ rừng khô
   */
  public playWoodClick(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Cao độ mộc mạc ấm áp
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.045);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.055);
    } catch {
      // Bỏ qua lỗi audio policy
    }
  }

  /**
   * Nhịp trống da trâu K'tu (Resonant Buffalo-skin Drum Heartbeat)
   * Âm thanh trầm, ấm, lan tỏa như nhịp thở của đại ngàn
   */
  public playDrumPulse(intensity: number = 0.22): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(86, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(42, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(intensity, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.58);
    } catch {
      // ignore
    }
  }

  /**
   * Ngân vang chiêng đồng (Sacred Bronze Gong Shimmer)
   * Họa âm đồng Tây Giang ngân dài, tĩnh lặng và thanh thoát
   */
  public playGongShimmer(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const freqs = [294, 587, 880, 1174];
      const gains = [0.12, 0.08, 0.04, 0.02];

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        // Dao động vi mô mô phỏng bề mặt đồng đúc thủ công
        osc.frequency.linearRampToValueAtTime(f * 0.998, ctx.currentTime + 2.8);

        gain.gain.setValueAtTime(gains[i], ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 3.3);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Lời kể đời thường của Già làng Tây Giang (15–25s)
   * Tự động giảm âm lượng nhạc nền (audio ducking) để tôn giọng nói thật
   */
  public playElderStory(slug: string): void {
    this.stopElderStory();

    let audioSrc = '/audio/elder-story-guol.mp3';
    if (slug === 'bahieng-carrying-basket' || slug === 'basket') {
      audioSrc = '/audio/elder-story-basket.mp3';
    } else if (slug === 'ktu-traditional-drum' || slug === 'drum') {
      audioSrc = '/audio/elder-story-drum.mp3';
    }

    const audio = new Audio(audioSrc);
    audio.volume = 0.85;
    this.currentStoryAudio = audio;
    this.activeStorySlug = slug;
    this.isStoryPlaying = true;
    this.notify();

    // Giảm âm lượng nhạc nền xuống 10% để nghe rõ lời già làng
    forestSoundService.duckVolume(0.1);

    audio.addEventListener('ended', () => {
      this.isStoryPlaying = false;
      this.activeStorySlug = null;
      this.notify();
      forestSoundService.restoreVolume();
    });

    audio.addEventListener('error', () => {
      this.isStoryPlaying = false;
      this.activeStorySlug = null;
      this.notify();
      forestSoundService.restoreVolume();
    });

    audio.play().catch(() => {
      this.isStoryPlaying = false;
      this.activeStorySlug = null;
      this.notify();
      forestSoundService.restoreVolume();
    });
  }

  public stopElderStory(): void {
    if (this.currentStoryAudio) {
      this.currentStoryAudio.pause();
      this.currentStoryAudio = null;
    }
    if (this.isStoryPlaying) {
      this.isStoryPlaying = false;
      this.activeStorySlug = null;
      this.notify();
      forestSoundService.restoreVolume();
    }
  }

  public getIsStoryPlaying(): boolean {
    return this.isStoryPlaying;
  }

  public getActiveStorySlug(): string | null {
    return this.activeStorySlug;
  }
}

export const heritageSoundService = new HeritageSoundService();
