import { ARTIFACTS_DATA } from '../data/artifactsData';
import { Artifact } from '../types';

export const artifactService = {
  getAll(): Artifact[] {
    return ARTIFACTS_DATA;
  },

  getBySlug(slug: string): Artifact | undefined {
    return ARTIFACTS_DATA.find((item) => item.slug === slug);
  },

  search(query: string, category?: string): Artifact[] {
    const q = query.trim().toLowerCase();
    return ARTIFACTS_DATA.filter((item) => {
      const matchCategory = !category || category === 'all' || item.category === category;
      if (!matchCategory) return false;

      if (!q) return true;

      const matchViName = item.name.vi.toLowerCase().includes(q);
      const matchEnName = item.name.en.toLowerCase().includes(q);
      const matchViBrief = item.brief.vi.toLowerCase().includes(q);
      const matchEnBrief = item.brief.en.toLowerCase().includes(q);
      const matchVocab = item.vocabulary.some(
        (v) => v.term.toLowerCase().includes(q) || v.vietnameseMeaning.toLowerCase().includes(q)
      );

      return matchViName || matchEnName || matchViBrief || matchEnBrief || matchVocab;
    });
  },

  getCategories(): { id: string; labelVi: string; labelEn: string }[] {
    const categories: { id: string; labelVi: string; labelEn: string }[] = [
      { id: 'all', labelVi: 'Tất cả hiện vật', labelEn: 'All Artifacts' },
      { id: 'architecture', labelVi: 'Kiến trúc', labelEn: 'Architecture' },
      { id: 'musical_instrument', labelVi: 'Nhạc cụ', labelEn: 'Musical Instruments' },
      { id: 'weaving_craft', labelVi: 'Đan lát thủ công', labelEn: 'Basketry & Weaving' },
      { id: 'spiritual_sculpture', labelVi: 'Điêu khắc & Tâm linh', labelEn: 'Spiritual Sculptures' }
    ];
    return categories;
  },

  getRelated(currentSlug: string, limit: number = 3): Artifact[] {
    const current = this.getBySlug(currentSlug);
    if (!current) return [];

    // Ưu tiên cùng category, sau đó các hiện vật khác
    return ARTIFACTS_DATA
      .filter((item) => item.slug !== currentSlug)
      .sort((a, b) => {
        if (a.category === current.category && b.category !== current.category) return -1;
        if (b.category === current.category && a.category !== current.category) return 1;
        return 0;
      })
      .slice(0, limit);
  }
};
