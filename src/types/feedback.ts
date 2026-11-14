export interface FeedbackComment {
  id: string;
  authorName: string;
  authorRole: string; // e.g. 'GV Lịch sử - THPT Tây Giang'
  authorRoleEn?: string;
  avatarBg: string; // Tailwind gradient or color hex
  avatarInitials: string;
  badge?: string; // e.g. 'Đã trải nghiệm AR', 'Nghệ nhân bản địa', 'Giáo viên'
  badgeEn?: string;
  rating: number; // 1-5
  targetArtifactSlug?: string; // 'all' | 'guol-communal-house' | etc.
  targetArtifactNameVi?: string;
  targetArtifactNameEn?: string;
  contentVi: string;
  contentEn: string;
  timeAgoVi: string;
  timeAgoEn: string;
  timestamp: number;
  likes: number;
  isLikedByUser?: boolean;
  isVerified?: boolean;
  isUserCreated?: boolean;
}

export type FeedbackFilterCategory =
  | 'all'
  | 'guol-communal-house'
  | 'ktu-traditional-drum'
  | 'tkoor-sacred-pillar'
  | 'bahieng-woven-basket'
  | 'ar-experience'
  | 'top-rated';
