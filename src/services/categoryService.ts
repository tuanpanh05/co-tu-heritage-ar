import { getSupabase } from '../lib/supabase';

export interface CategoryRecord {
  id: string;
  slug: string;
  name_vi: string;
  name_en: string;
  description_vi?: string | null;
  description_en?: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

const STATIC_FALLBACK_CATEGORIES: CategoryRecord[] = [
  {
    id: 'cat-01',
    slug: 'architecture',
    name_vi: 'Kiến trúc truyền thống',
    name_en: 'Traditional Architecture',
    description_vi: 'Nhà Gươl và không gian kiến trúc bản địa của người Cơ Tu',
    description_en: 'Gươl communal house and vernacular architecture of Cơ Tu people',
    display_order: 1
  },
  {
    id: 'cat-02',
    slug: 'musical_instrument',
    name_vi: 'Nhạc cụ cổ truyền',
    name_en: 'Traditional Musical Instruments',
    description_vi: 'Trống K’tu, chiêng đồng và âm nhạc tâm linh đại ngàn',
    description_en: 'K’tu drums, bronze gongs, and highland ceremonial soundscapes',
    display_order: 2
  },
  {
    id: 'cat-03',
    slug: 'weaving_craft',
    name_vi: 'Đan lát & Dệt thổ cẩm',
    name_en: 'Basketry & Brocade Weaving',
    description_vi: 'Nghề dệt thổ cẩm đính cườm và đan gùi Ba-hieng tinh xảo',
    description_en: 'Beaded brocade weaving and master Ba-hieng rattan basketry',
    display_order: 3
  },
  {
    id: 'cat-04',
    slug: 'spiritual_sculpture',
    name_vi: 'Điêu khắc & Tâm linh',
    name_en: 'Spiritual Sculpture',
    description_vi: 'Nghệ thuật đẽo khắc gỗ cột tế T’kơơr và linh vật rừng già',
    description_en: 'Master woodcarvings of ceremonial poles and sacred wildlife',
    display_order: 4
  },
  {
    id: 'cat-05',
    slug: 'daily_tool',
    name_vi: 'Công cụ đời sống',
    name_en: 'Daily Living & Hunting Tools',
    description_vi: 'Vật dụng sinh hoạt, săn bắt và sản xuất nương rẫy truyền thống',
    description_en: 'Traditional tools for domestic living, foraging, and hunting',
    display_order: 5
  }
];

export const categoryService = {
  async getAll(): Promise<CategoryRecord[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return STATIC_FALLBACK_CATEGORIES;
    }

    try {
      const { data, error } = await supabase
        .from('artifact_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        if (error) console.warn('[categoryService] Using fallback categories:', error.message);
        return STATIC_FALLBACK_CATEGORIES;
      }

      return data as CategoryRecord[];
    } catch (err) {
      console.warn('[categoryService] Network error, using fallback categories:', err);
      return STATIC_FALLBACK_CATEGORIES;
    }
  },

  async getBySlug(slug: string): Promise<CategoryRecord | null> {
    const categories = await this.getAll();
    return categories.find((c) => c.slug === slug) || null;
  },

  async create(category: Omit<CategoryRecord, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryRecord | null> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('artifact_categories')
      .insert([category])
      .select()
      .single();

    if (error) {
      console.error('[categoryService] Error creating category:', error);
      throw error;
    }
    return data as CategoryRecord;
  },

  async update(id: string, updates: Partial<CategoryRecord>): Promise<CategoryRecord | null> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('artifact_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[categoryService] Error updating category:', error);
      throw error;
    }
    return data as CategoryRecord;
  },

  async getCategoryWithCounts(): Promise<Array<CategoryRecord & { artifactCount: number }>> {
    const categories = await this.getAll();
    const supabase = getSupabase();
    if (!supabase) {
      return categories.map((c) => ({ ...c, artifactCount: 0 }));
    }

    try {
      const { data: artifacts } = await supabase.from('artifacts').select('category_id');
      const countMap: Record<string, number> = {};
      (artifacts || []).forEach((a: any) => {
        if (a.category_id) {
          countMap[a.category_id] = (countMap[a.category_id] || 0) + 1;
        }
      });

      return categories.map((c) => ({
        ...c,
        artifactCount: countMap[c.id] || 0
      }));
    } catch {
      return categories.map((c) => ({ ...c, artifactCount: 0 }));
    }
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { error } = await supabase
      .from('artifact_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[categoryService] Error deleting category:', error);
      throw error;
    }
    return true;
  }
};
