export const qrService = {
  getBaseUrl(): string {
    const envUrl = import.meta.env.VITE_PUBLIC_BASE_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
      return envUrl.trim().replace(/\/+$/, '');
    }
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://cotuheritage.vercel.app';
  },

  getArtifactUrl(slug: string): string {
    const base = this.getBaseUrl();
    return `${base}/artifacts/${slug}`;
  },

  isLocalhost(): boolean {
    const base = this.getBaseUrl().toLowerCase();
    return (
      base.includes('localhost') ||
      base.includes('127.0.0.1') ||
      base.includes('0.0.0.0') ||
      base.includes('::1')
    );
  }
};

