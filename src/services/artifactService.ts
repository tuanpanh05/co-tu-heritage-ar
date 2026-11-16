import { ARTIFACTS_DATA } from '../data/artifactsData';
import { Artifact, ArtifactCategory } from '../types';
import { getSupabase } from '../lib/supabase';
import { storageService } from './storageService';

let memoryCache: Artifact[] = [...ARTIFACTS_DATA];
let isLoadedFromSupabase = false;

function mapDbRowToArtifact(row: any): Artifact {
  const categorySlug = (row.artifact_categories?.slug || row.category || 'architecture') as ArtifactCategory;
  const categoryName = {
    vi: row.artifact_categories?.name_vi || 'Kiến trúc truyền thống',
    en: row.artifact_categories?.name_en || 'Traditional Architecture'
  };

  const thumbnail = storageService.resolveAssetUrl(row.thumbnail_path, 'artifact-images') || row.thumbnail_path;
  const model3D = row.model_3d_path
    ? storageService.resolveAssetUrl(row.model_3d_path, 'artifact-models')
    : undefined;

  let originalImages: string[] = [];
  if (Array.isArray(row.artifact_images) && row.artifact_images.length > 0) {
    originalImages = row.artifact_images.map((img: any) =>
      storageService.resolveAssetUrl(img.storage_path, 'artifact-images')
    );
  } else if (thumbnail) {
    originalImages = [thumbnail];
  }

  let vocabulary = [];
  if (Array.isArray(row.artifact_vocabulary) && row.artifact_vocabulary.length > 0) {
    vocabulary = row.artifact_vocabulary.map((v: any) => ({
      id: v.id,
      term: v.word_en,
      ipa: v.pronunciation || undefined,
      vietnameseMeaning: v.word_vi,
      englishDefinition: v.definition_en || undefined,
      exampleSentence:
        v.example_en || v.example_vi
          ? {
              en: v.example_en || '',
              vi: v.example_vi || ''
            }
          : undefined
    }));
  }

  return {
    id: row.id,
    slug: row.slug,
    name: {
      vi: row.name_vi,
      en: row.name_en || row.name_vi
    },
    category: categorySlug,
    categoryName,
    thumbnail,
    originalImages,
    model3D,
    modelStatus: row.model_status || 'available',
    contentStatus: row.content_status || 'verified',
    brief: {
      vi: row.short_description_vi || '',
      en: row.short_description_en || ''
    },
    description: {
      vi: row.description_vi || '',
      en: row.description_en || ''
    },
    sections: Array.isArray(row.sections) && row.sections.length > 0 ? row.sections : [],
    vocabulary,
    audio: {
      vi: row.audio_vi_path || undefined,
      en: row.audio_en_path || undefined
    },
    sources: row.sources || [],
    verificationNote: row.verification_note || '',
    dimensions: row.dimensions || undefined,
    materials: row.materials_vi
      ? {
          vi: row.materials_vi,
          en: row.materials_en || row.materials_vi
        }
      : undefined,
    origin: row.origin_vi
      ? {
          vi: row.origin_vi,
          en: row.origin_en || row.origin_vi
        }
      : undefined
  };
}

export const artifactService = {
  isLoaded(): boolean {
    return isLoadedFromSupabase;
  },

  getAll(): Artifact[] {
    return memoryCache;
  },

  async fetchAll(): Promise<Artifact[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return memoryCache;
    }

    try {
      const { data, error } = await supabase
        .from('artifacts')
        .select(`
          *,
          artifact_categories (*),
          artifact_images (*),
          artifact_vocabulary (*)
        `)
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        if (error) console.warn('[artifactService] Supabase query notice:', error.message);
        return memoryCache;
      }

      const mapped = data.map(mapDbRowToArtifact);
      memoryCache = mapped;
      isLoadedFromSupabase = true;
      return mapped;
    } catch (err) {
      console.warn('[artifactService] Network fallback triggered:', err);
      return memoryCache;
    }
  },

  getBySlug(slug: string): Artifact | undefined {
    return memoryCache.find((item) => item.slug === slug);
  },

  async fetchBySlug(slug: string): Promise<Artifact | undefined> {
    const supabase = getSupabase();
    if (!supabase) {
      return this.getBySlug(slug);
    }

    try {
      const { data, error } = await supabase
        .from('artifacts')
        .select(`
          *,
          artifact_categories (*),
          artifact_images (*),
          artifact_vocabulary (*)
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return this.getBySlug(slug);
      }

      const item = mapDbRowToArtifact(data);
      const existingIdx = memoryCache.findIndex((a) => a.slug === slug);
      if (existingIdx >= 0) {
        memoryCache[existingIdx] = item;
      } else {
        memoryCache.push(item);
      }
      return item;
    } catch {
      return this.getBySlug(slug);
    }
  },

  search(query: string, category?: string): Artifact[] {
    const q = query.trim().toLowerCase();
    return memoryCache.filter((item) => {
      const matchCategory = !category || category === 'all' || item.category === category;
      if (!matchCategory) return false;

      if (!q) return true;

      const matchViName = item.name.vi.toLowerCase().includes(q);
      const matchEnName = item.name.en.toLowerCase().includes(q);
      const matchViBrief = item.brief.vi.toLowerCase().includes(q);
      const matchEnBrief = item.brief.en.toLowerCase().includes(q);
      const matchVocab = item.vocabulary?.some(
        (v) => v.term.toLowerCase().includes(q) || v.vietnameseMeaning.toLowerCase().includes(q)
      );

      return matchViName || matchEnName || matchViBrief || matchEnBrief || matchVocab;
    });
  },

  getCategories(): { id: string; labelVi: string; labelEn: string }[] {
    return [
      { id: 'all', labelVi: 'Tất cả hiện vật', labelEn: 'All Artifacts' },
      { id: 'architecture', labelVi: 'Kiến trúc', labelEn: 'Architecture' },
      { id: 'musical_instrument', labelVi: 'Nhạc cụ', labelEn: 'Musical Instruments' },
      { id: 'weaving_craft', labelVi: 'Đan lát thủ công', labelEn: 'Basketry & Weaving' },
      { id: 'spiritual_sculpture', labelVi: 'Điêu khắc & Tâm linh', labelEn: 'Spiritual Sculptures' }
    ];
  },

  getRelated(currentSlug: string, limit: number = 3): Artifact[] {
    const current = this.getBySlug(currentSlug);
    if (!current) return [];

    return memoryCache
      .filter((item) => item.slug !== currentSlug)
      .sort((a, b) => {
        if (a.category === current.category && b.category !== current.category) return -1;
        if (b.category === current.category && a.category !== current.category) return 1;
        return 0;
      })
      .slice(0, limit);
  },

  async fetchAdminArtifacts(): Promise<any[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('artifacts')
      .select(`
        *,
        artifact_categories (*),
        artifact_images (*),
        artifact_vocabulary (*)
      `)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[artifactService] Error fetching admin artifacts:', error);
      throw error;
    }
    return data || [];
  },

  async fetchAdminArtifactById(id: string): Promise<any | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('artifacts')
      .select(`
        *,
        artifact_categories (*),
        artifact_images (*),
        artifact_vocabulary (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('[artifactService] Error fetching artifact by id:', error);
      throw error;
    }
    return data;
  },

  async togglePublishStatus(id: string, isPublished: boolean): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { error } = await supabase
      .from('artifacts')
      .update({
        is_published: isPublished,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    await this.fetchAll();
    return true;
  },

  async addArtifactImage(
    artifactId: string,
    storagePath: string,
    altVi: string = '',
    altEn: string = '',
    displayOrder: number = 0
  ): Promise<any> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('artifact_images')
      .insert([
        {
          artifact_id: artifactId,
          storage_path: storagePath,
          alt_text_vi: altVi,
          alt_text_en: altEn,
          display_order: displayOrder
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteArtifactImage(imageId: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { error } = await supabase
      .from('artifact_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
    return true;
  },

  async createArtifact(artifact: any): Promise<Artifact | null> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('artifacts')
      .insert([artifact])
      .select()
      .single();

    if (error) throw error;
    await this.fetchAll();
    return mapDbRowToArtifact(data);
  },

  async updateArtifact(id: string, updates: any): Promise<Artifact | null> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('artifacts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await this.fetchAll();
    return mapDbRowToArtifact(data);
  },

  async deleteArtifact(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { error } = await supabase
      .from('artifacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await this.fetchAll();
    return true;
  }
};

// Initiate non-blocking fetch from Supabase if configured
if (typeof window !== 'undefined') {
  artifactService.fetchAll().catch(() => {});
}
