import { getSupabase } from '../lib/supabase';
import { FeedbackComment } from '../types/feedback';
import { SEED_FEEDBACK_COMMENTS } from './feedbackService';

export interface NewReviewInput {
  targetArtifactSlug?: string;
  reviewerName: string;
  reviewerRole?: string;
  reviewerRoleEn?: string;
  rating: number;
  comment: string;
}

export interface ReviewDbRecord {
  id: string;
  artifact_id?: string | null;
  reviewer_name?: string | null;
  reviewer_role_vi?: string | null;
  reviewer_role_en?: string | null;
  avatar_bg?: string | null;
  avatar_initials?: string | null;
  badge_vi?: string | null;
  badge_en?: string | null;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  likes: number;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  artifacts?: {
    slug: string;
    name_vi: string;
    name_en: string;
  } | null;
}

export const reviewService = {
  mapDbRecordToFeedbackComment(rec: ReviewDbRecord): FeedbackComment {
    const createdDate = new Date(rec.created_at);
    const diffMinutes = Math.floor((Date.now() - createdDate.getTime()) / 60000);
    let timeAgoVi = 'Vừa xong';
    let timeAgoEn = 'Just now';

    if (diffMinutes >= 1440) {
      const days = Math.floor(diffMinutes / 1440);
      timeAgoVi = `${days} ngày trước`;
      timeAgoEn = `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffMinutes >= 60) {
      const hours = Math.floor(diffMinutes / 60);
      timeAgoVi = `${hours} giờ trước`;
      timeAgoEn = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      timeAgoVi = `${diffMinutes} phút trước`;
      timeAgoEn = `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
    }

    const artifactSlug = rec.artifacts?.slug || (rec.artifact_id ? undefined : 'all');

    return {
      id: rec.id,
      authorName: rec.reviewer_name || 'Khách tham quan',
      authorRole: rec.reviewer_role_vi || 'Khách tham quan WebAR',
      authorRoleEn: rec.reviewer_role_en || 'WebAR Visitor',
      avatarBg: rec.avatar_bg || 'from-amber-600 to-rose-700',
      avatarInitials: rec.avatar_initials || 'CT',
      badge: rec.badge_vi || undefined,
      badgeEn: rec.badge_en || undefined,
      rating: rec.rating,
      targetArtifactSlug: artifactSlug,
      targetArtifactNameVi: rec.artifacts?.name_vi || (artifactSlug === 'all' ? 'Toàn bộ Không gian Di sản WebAR' : undefined),
      targetArtifactNameEn: rec.artifacts?.name_en || (artifactSlug === 'all' ? 'WebAR Heritage Space' : undefined),
      contentVi: rec.comment,
      contentEn: rec.comment,
      timeAgoVi,
      timeAgoEn,
      timestamp: createdDate.getTime(),
      likes: rec.likes || 0,
      isVerified: rec.is_verified,
      isUserCreated: false
    };
  },

  async getApprovedReviews(artifactSlug?: string): Promise<FeedbackComment[]> {
    const supabase = getSupabase();
    if (!supabase) {
      if (!artifactSlug || artifactSlug === 'all') {
        return SEED_FEEDBACK_COMMENTS;
      }
      return SEED_FEEDBACK_COMMENTS.filter(
        (c) => c.targetArtifactSlug === 'all' || c.targetArtifactSlug === artifactSlug
      );
    }

    try {
      let query = supabase
        .from('artifact_reviews')
        .select(`
          id,
          artifact_id,
          reviewer_name,
          reviewer_role_vi,
          reviewer_role_en,
          avatar_bg,
          avatar_initials,
          badge_vi,
          badge_en,
          rating,
          comment,
          status,
          likes,
          is_verified,
          created_at,
          artifacts (
            slug,
            name_vi,
            name_en
          )
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        if (error) console.warn('[reviewService] Falling back to seed comments:', error.message);
        if (!artifactSlug || artifactSlug === 'all') return SEED_FEEDBACK_COMMENTS;
        return SEED_FEEDBACK_COMMENTS.filter(
          (c) => c.targetArtifactSlug === 'all' || c.targetArtifactSlug === artifactSlug
        );
      }

      const comments = (data as unknown as ReviewDbRecord[]).map(this.mapDbRecordToFeedbackComment);

      if (artifactSlug && artifactSlug !== 'all') {
        return comments.filter(
          (c) => c.targetArtifactSlug === 'all' || c.targetArtifactSlug === artifactSlug
        );
      }
      return comments;
    } catch (err) {
      console.warn('[reviewService] Network error, using fallback:', err);
      return SEED_FEEDBACK_COMMENTS;
    }
  },

  async fetchAdminReviews(): Promise<ReviewDbRecord[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('artifact_reviews')
      .select(`
        id,
        artifact_id,
        reviewer_name,
        reviewer_role_vi,
        reviewer_role_en,
        avatar_bg,
        avatar_initials,
        badge_vi,
        badge_en,
        rating,
        comment,
        status,
        likes,
        is_verified,
        created_at,
        updated_at,
        artifacts (
          slug,
          name_vi,
          name_en
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[reviewService] Error fetching admin reviews:', error);
      throw error;
    }
    return (data || []) as unknown as ReviewDbRecord[];
  },

  async submitReview(input: NewReviewInput): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return {
        success: true,
        message: 'Đánh giá của bạn đã được ghi nhận cục bộ (chế độ demo).'
      };
    }

    try {
      let artifactId: string | null = null;
      if (input.targetArtifactSlug && input.targetArtifactSlug !== 'all') {
        const { data: art } = await supabase
          .from('artifacts')
          .select('id')
          .eq('slug', input.targetArtifactSlug)
          .single();
        if (art) {
          artifactId = art.id;
        }
      }

      const initials = (input.reviewerName || 'CT')
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const { error } = await supabase.from('artifact_reviews').insert([
        {
          artifact_id: artifactId,
          reviewer_name: input.reviewerName.trim(),
          reviewer_role_vi: input.reviewerRole?.trim() || 'Khách tham quan WebAR',
          reviewer_role_en: input.reviewerRoleEn?.trim() || 'WebAR Visitor',
          rating: Math.min(5, Math.max(1, input.rating)),
          comment: input.comment.trim(),
          status: 'pending', // Enforced both in client and by database RLS & trigger
          avatar_bg: 'from-amber-600 to-rose-700',
          avatar_initials: initials || 'CT',
          likes: 0,
          is_verified: false
        }
      ]);

      if (error) {
        console.error('[reviewService] Error inserting review:', error);
        throw error;
      }

      return {
        success: true,
        message: 'Cảm ơn bạn! Đánh giá đã được gửi và sẽ hiển thị sau khi kiểm duyệt.'
      };
    } catch (err: any) {
      console.error('[reviewService] Failed to submit review:', err);
      throw new Error(err.message || 'Không thể gửi đánh giá');
    }
  },

  async moderateReview(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { error } = await supabase
      .from('artifact_reviews')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async deleteReview(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase client not configured');

    const { error } = await supabase
      .from('artifact_reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
