type SpeechCallback = (speaking: boolean) => void;

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<SpeechCallback> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return !!this.synth;
  }

  public subscribe(callback: SpeechCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify(speaking: boolean) {
    this.listeners.forEach((cb) => cb(speaking));
  }

  public speak(text: string, lang: 'vi' | 'en' = 'en'): boolean {
    if (!this.synth) return false;

    // Hủy các câu đọc trước đó
    this.stop();

    if (!text.trim()) return false;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = 0.95; // Tốc độ dễ nghe cho học sinh
    utterance.pitch = 1.0;

    // Tìm voice phù hợp nếu trình duyệt có
    const voices = this.synth.getVoices();
    const targetLang = lang === 'vi' ? 'vi' : 'en';
    const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLang));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      this.currentUtterance = null;
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.notify(false);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const speechService = new SpeechService();
