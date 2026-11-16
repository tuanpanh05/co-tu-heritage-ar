import { getSupabase } from '../lib/supabase';

export interface AdminDashboardStats {
  totalArtifacts: number;
  publishedArtifacts: number;
  draftArtifacts: number;
  totalCategories: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  totalImages: number;
  totalModels: number;
  recentArtifacts: Array<{
    id: string;
    slug: string;
    name_vi: string;
    name_en?: string;
    is_published: boolean;
    thumbnail_path?: string;
    updated_at: string;
  }>;
  recentReviews: Array<{
    id: string;
    reviewer_name: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    artifact_name?: string;
  }>;
  recentContents: Array<{
    content_key: string;
    title_vi: string;
    updated_at: string;
  }>;
}

export const adminStatsService = {
  async getDashboardOverview(): Promise<AdminDashboardStats> {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error('Supabase client chưa được khởi tạo.');
    }

    // 1. Artifacts counts
    const [
      { count: totalArtifacts },
      { count: publishedArtifacts },
      { count: draftArtifacts },
      { count: totalCategories },
      { count: totalReviews },
      { count: pendingReviews },
      { count: approvedReviews },
      { count: rejectedReviews },
      { count: totalImages },
      { data: recentArtifactsRaw },
      { data: recentReviewsRaw },
      { data: recentContentsRaw }
    ] = await Promise.all([
      supabase.from('artifacts').select('*', { count: 'exact', head: true }),
      supabase.from('artifacts').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('artifacts').select('*', { count: 'exact', head: true }).eq('is_published', false),
      supabase.from('artifact_categories').select('*', { count: 'exact', head: true }),
      supabase.from('artifact_reviews').select('*', { count: 'exact', head: true }),
      supabase.from('artifact_reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('artifact_reviews').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('artifact_reviews').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
      supabase.from('artifact_images').select('*', { count: 'exact', head: true }),
      supabase.from('artifacts').select('id, slug, name_vi, name_en, is_published, thumbnail_path, updated_at').order('updated_at', { ascending: false }).limit(4),
      supabase.from('artifact_reviews').select('id, reviewer_name, rating, comment, status, created_at, artifacts(name_vi)').order('created_at', { ascending: false }).limit(4),
      supabase.from('website_contents').select('content_key, title_vi, updated_at').order('updated_at', { ascending: false }).limit(4)
    ]);

    // Model count: artifacts with non-null model_3d_path
    const { count: totalModels } = await supabase
      .from('artifacts')
      .select('*', { count: 'exact', head: true })
      .not('model_3d_path', 'is', null);

    return {
      totalArtifacts: totalArtifacts || 0,
      publishedArtifacts: publishedArtifacts || 0,
      draftArtifacts: draftArtifacts || 0,
      totalCategories: totalCategories || 0,
      totalReviews: totalReviews || 0,
      pendingReviews: pendingReviews || 0,
      approvedReviews: approvedReviews || 0,
      rejectedReviews: rejectedReviews || 0,
      totalImages: totalImages || 0,
      totalModels: totalModels || 0,
      recentArtifacts: (recentArtifactsRaw || []).map((a: any) => ({
        id: a.id,
        slug: a.slug,
        name_vi: a.name_vi,
        name_en: a.name_en,
        is_published: a.is_published,
        thumbnail_path: a.thumbnail_path,
        updated_at: a.updated_at
      })),
      recentReviews: (recentReviewsRaw || []).map((r: any) => ({
        id: r.id,
        reviewer_name: r.reviewer_name || 'Khách vãng lai',
        rating: r.rating,
        comment: r.comment,
        status: r.status,
        created_at: r.created_at,
        artifact_name: r.artifacts?.name_vi || 'Toàn bộ bảo tàng'
      })),
      recentContents: (recentContentsRaw || []).map((c: any) => ({
        content_key: c.content_key,
        title_vi: c.title_vi || c.content_key,
        updated_at: c.updated_at
      }))
    };
  }
};
