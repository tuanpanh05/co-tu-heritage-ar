import { getSupabase } from '../lib/supabase';

export interface WebsiteContentRecord {
  id: string;
  content_key: string;
  title_vi?: string | null;
  title_en?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  image_path?: string | null;
  updated_at?: string;
}

const STATIC_FALLBACK_CONTENTS: Record<string, WebsiteContentRecord> = {
  home_hero: {
    id: 'static-hero',
    content_key: 'home_hero',
    title_vi: 'Chạm Vào Hồn Gỗ & Nhịp Rừng Văn Hóa Cơ Tu Trong Không Gian 3D & WebAR',
    title_en: 'Touch the Forest Spirit of Cơ Tu Heritage in Interactive 3D & WebAR',
    content_vi:
      'Bước vào buôn làng giữa sương mây Trường Sơn: xoay ngắm từng thớ gỗ chạm khắc trên mái Nhà Gươl, cảm nhận nhịp trống da trâu K’tu trầm hùng và khám phá câu chuyện bản sắc bằng học liệu song ngữ Việt – Anh.',
    content_en:
      'Step into an ancient mountain village amid Trường Sơn mists: examine hand-chiseled timber carvings of the sacred Gươl roof, feel the resonance of the K’tu drum, and explore highland ethnography in English and Vietnamese.',
    image_path: '/images/hero-highlands-bg.jpg'
  },
  home_collection_intro: {
    id: 'static-collection',
    content_key: 'home_collection_intro',
    title_vi: 'Bộ Sưu Tập Di Sản Văn Hóa Cơ Tu Tây Giang',
    title_en: 'Cơ Tu Cultural Heritage 3D Collection',
    content_vi:
      'Từ mái Nhà Gươl sừng sững, nhịp Trống K’tu, Gùi Ba-hieng, Chiêng đồng đến Trang phục thổ cẩm nam nữ và Tượng điêu khắc Tê tê — mỗi hiện vật là một chứng tích sống động với mô hình 3D thực tế.',
    content_en:
      'From the soaring Gươl roof, resonant K’tu drum, Ba-hieng basket, and bronze gongs to traditional male & female brocade attire and chiseled pangolin sculptures—each artifact is digitized with authentic 3D photogrammetry models.'
  },
  home_lexicon_intro: {
    id: 'static-lexicon',
    content_key: 'home_lexicon_intro',
    title_vi: 'Kể Chuyện Bản Làng Cơ Tu Với Bạn Bè Quốc Tế',
    title_en: 'Share Cơ Tu Village Stories with the World',
    content_vi:
      'Chạm vào từng thuật ngữ để nghe phát âm tiếng Anh chuẩn mực và khám phá cách chuyển tải những nét đẹp nguyên bản của Tây Giang sang ngôn ngữ học thuật quốc tế.',
    content_en:
      'Tap any cultural term to listen to authentic pronunciation and learn how highland indigenous heritage is described in international academic contexts.'
  },
  about_project: {
    id: 'static-about',
    content_key: 'about_project',
    title_vi: 'Dự Án Số Hóa Di Sản Văn Hóa Cơ Tu Tây Giang',
    title_en: 'Tây Giang Cơ Tu Digital Heritage Preservation Project',
    content_vi:
      'Không gian Bảo tàng Số 3D/AR lưu giữ và lan tỏa vẻ đẹp kiến trúc, nhạc cụ và nghề thủ công truyền thống của đồng bào Cơ Tu giữa đại ngàn Trường Sơn – Tây Giang, Quảng Nam.',
    content_en:
      'An interactive 3D/AR Digital Museum preserving and celebrating the architecture, musical instruments, and traditional crafts of the Cơ Tu people in the Trường Sơn – Tây Giang highlands.',
    image_path: '/images/logo-emblem.png'
  },
  village_map_intro: {
    id: 'static-map',
    content_key: 'village_map_intro',
    title_vi: 'Bản Đồ Không Gian Bản Làng Cơ Tu Đồng Tâm',
    title_en: 'Concentric Village Spatial & Cosmological Map',
    content_vi:
      'Quy hoạch không gian làng truyền thống của người Cơ Tu tuân theo trật tự vũ trụ đồng tâm: Cột tế T’kơơr ở trung tâm, Nhà Gươl uy nghiêm, vòng sân hội và đại ngàn bao bọc.',
    content_en:
      'Traditional Cơ Tu village spatial planning adheres to a concentric cosmic order: the central T’kơơr pole, the monumental Gươl communal house, the festival dance ring, and the protective virgin forest.'
  }
};

export const contentService = {
  async getByKey(key: string): Promise<WebsiteContentRecord | null> {
    const supabase = getSupabase();
    if (!supabase) {
      return STATIC_FALLBACK_CONTENTS[key] || null;
    }

    try {
      const { data, error } = await supabase
        .from('website_contents')
        .select('*')
        .eq('content_key', key)
        .single();

      if (error || !data) {
        return STATIC_FALLBACK_CONTENTS[key] || null;
      }

      return data as WebsiteContentRecord;
    } catch {
      return STATIC_FALLBACK_CONTENTS[key] || null;
    }
  },

  async getAll(): Promise<Record<string, WebsiteContentRecord>> {
    const supabase = getSupabase();
    if (!supabase) {
      return STATIC_FALLBACK_CONTENTS;
    }

    try {
      const { data, error } = await supabase
        .from('website_contents')
        .select('*');

      if (error || !data || data.length === 0) {
        return STATIC_FALLBACK_CONTENTS;
      }

      const map: Record<string, WebsiteContentRecord> = { ...STATIC_FALLBACK_CONTENTS };
      data.forEach((item: WebsiteContentRecord) => {
        map[item.content_key] = item;
      });
      return map;
    } catch {
      return STATIC_FALLBACK_CONTENTS;
    }
  },

  async updateByKey(
    key: string,
    updates: Partial<WebsiteContentRecord>
  ): Promise<WebsiteContentRecord | null> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { data, error } = await supabase
      .from('website_contents')
      .upsert({
        content_key: key,
        ...updates,
        updated_at: new Date().toISOString()
      }, { onConflict: 'content_key' })
      .select()
      .single();

    if (error) {
      console.error('[contentService] Error updating content:', error);
      throw error;
    }
    return data as WebsiteContentRecord;
  }
};
