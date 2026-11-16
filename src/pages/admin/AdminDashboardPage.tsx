import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { adminStatsService, AdminDashboardStats } from '../../services/adminStatsService';
import {
  Box,
  FolderTree,
  MessageSquare,
  ImageIcon,
  BoxSelect,
  Plus,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Crown,
  GraduationCap,
  Star,
  FileEdit
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { profile, isSuperAdmin, isEditor } = useAdminAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminStatsService.getDashboardOverview();
      setStats(data);
    } catch (err: any) {
      console.error('[AdminDashboardPage] Fetch error:', err);
      setError(err.message || 'Không thể tải thống kê thời gian thực từ Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '--';
    const d = new Date(isoString);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14231b] via-[#1a3325] to-[#122018] border border-emerald-800/40 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-amber-400">
              {isSuperAdmin ? (
                <>
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="uppercase tracking-wider font-semibold">Tài Khoản Quản Trị Viên Tối Cao (Super Admin)</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span className="uppercase tracking-wider font-semibold text-emerald-300">Tài Khoản Biên Tập Viên Học Sinh (Editor)</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              Xin chào, {profile?.display_name || 'Quản trị viên'}!
            </h1>
            <p className="text-sm text-emerald-200/70 mt-1.5 max-w-2xl leading-relaxed">
              Chào mừng bạn đến với Trung tâm Quản trị Số hóa Di sản Văn hóa Cơ Tu Tây Giang.
              {isEditor
                ? ' Bạn có quyền đóng góp tư liệu, biên tập nội dung hiện vật và từ vựng song ngữ.'
                : ' Bạn có toàn quyền quản trị, duyệt đánh giá cộng đồng và xuất bản hiện vật.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={fetchStats}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e1713] border border-emerald-800/40 hover:border-amber-500/50 text-emerald-200 hover:text-amber-200 text-xs font-mono transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Làm Mới</span>
            </button>
            <Link
              to="/admin/artifacts/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-emerald-950 font-semibold text-xs tracking-wide shadow-lg shadow-amber-600/20 transition-all font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Hiện Vật Mới</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/40 text-red-200 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span>{error}</span>
          </div>
          <button onClick={fetchStats} className="text-xs text-amber-300 underline font-mono">
            Thử lại
          </button>
        </div>
      )}

      {/* Real Statistics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Artifacts */}
        <div className="p-5 rounded-2xl bg-[#121c17] border border-emerald-800/30 shadow-lg relative overflow-hidden group hover:border-emerald-700/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
              Hiện Vật 3D
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-300">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-amber-100">
            {isLoading ? '...' : stats?.totalArtifacts ?? 0}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {stats?.publishedArtifacts ?? 0} Đã công bố
            </span>
            <span className="text-emerald-600/60">•</span>
            <span className="text-amber-400/80">
              {stats?.draftArtifacts ?? 0} Bản nháp
            </span>
          </div>
        </div>

        {/* Metric 2: Categories */}
        <div className="p-5 rounded-2xl bg-[#121c17] border border-emerald-800/30 shadow-lg relative overflow-hidden group hover:border-emerald-700/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
              Danh Mục Di Sản
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-900/30 border border-amber-700/40 flex items-center justify-center text-amber-300">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-amber-100">
            {isLoading ? '...' : stats?.totalCategories ?? 0}
          </div>
          <p className="mt-2 text-xs font-mono text-emerald-300/60">
            Phân loại học văn hóa bản địa
          </p>
        </div>

        {/* Metric 3: Reviews */}
        <div className="p-5 rounded-2xl bg-[#121c17] border border-emerald-800/30 shadow-lg relative overflow-hidden group hover:border-emerald-700/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
              Đánh Giá Cộng Đồng
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-300">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-amber-100">
            {isLoading ? '...' : stats?.totalReviews ?? 0}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-mono">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {stats?.pendingReviews ?? 0} Chờ duyệt
            </span>
            <span className="text-emerald-600/60">•</span>
            <span className="text-emerald-400">
              {stats?.approvedReviews ?? 0} Đã duyệt
            </span>
          </div>
        </div>

        {/* Metric 4: Media Assets */}
        <div className="p-5 rounded-2xl bg-[#121c17] border border-emerald-800/30 shadow-lg relative overflow-hidden group hover:border-emerald-700/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase text-emerald-400/80 tracking-wider">
              Tài Nguyên Lưu Trữ
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-300">
              <BoxSelect className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-amber-100">
            {isLoading ? '...' : `${stats?.totalModels ?? 0} GLB`}
          </div>
          <div className="mt-2 text-xs font-mono text-emerald-300/60">
            {stats?.totalImages ?? 0} Hình ảnh lưu trên Storage
          </div>
        </div>

      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-[#101914] rounded-2xl border border-emerald-900/30 p-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400/70 mb-4 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Lối tắt tác vụ nhanh
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/artifacts/create"
            className="p-3.5 rounded-xl bg-[#15231c] hover:bg-[#1c3026] border border-emerald-800/30 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
          >
            <Box className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-emerald-100">Thêm Hiện Vật Mới</div>
            <div className="text-[11px] text-emerald-400/60 font-mono mt-0.5">Tải mô hình 3D & học liệu</div>
          </Link>

          <Link
            to="/admin/reviews"
            className="p-3.5 rounded-xl bg-[#15231c] hover:bg-[#1c3026] border border-emerald-800/30 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-emerald-100">
              {isSuperAdmin ? 'Kiểm Duyệt Đánh Giá' : 'Xem Đánh Giá'}
            </div>
            <div className="text-[11px] text-amber-400/80 font-mono mt-0.5">
              {stats?.pendingReviews ? `${stats.pendingReviews} đánh giá chờ duyệt` : 'Tất cả đã xử lý'}
            </div>
          </Link>

          <Link
            to="/admin/website-content"
            className="p-3.5 rounded-xl bg-[#15231c] hover:bg-[#1c3026] border border-emerald-800/30 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
          >
            <FileEdit className="w-5 h-5 text-amber-300 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-emerald-100">Biên Tập Trang Chủ</div>
            <div className="text-[11px] text-emerald-400/60 font-mono mt-0.5">Sửa tiêu đề & giới thiệu</div>
          </Link>

          <Link
            to="/admin/media"
            className="p-3.5 rounded-xl bg-[#15231c] hover:bg-[#1c3026] border border-emerald-800/30 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
          >
            <ImageIcon className="w-5 h-5 text-emerald-300 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-emerald-100">Thư Viện Media</div>
            <div className="text-[11px] text-emerald-400/60 font-mono mt-0.5">Quản lý file Storage</div>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Recent Artifacts & Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Artifacts */}
        <div className="bg-[#101914] rounded-2xl border border-emerald-900/30 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-400" />
                Hiện Vật Cập Nhật Gần Đây
              </h3>
              <Link
                to="/admin/artifacts"
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.recentArtifacts || []).map((art) => (
                <div
                  key={art.id}
                  className="p-3 rounded-xl bg-[#14231b] border border-emerald-900/40 flex items-center justify-between hover:border-emerald-700/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0e1713] border border-emerald-800/40 overflow-hidden flex items-center justify-center shrink-0">
                      {art.thumbnail_path ? (
                        <img
                          src={art.thumbnail_path}
                          alt={art.name_vi}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as any).src = '/images/guol-authentic.jpg';
                          }}
                        />
                      ) : (
                        <Box className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-100">
                        {art.name_vi}
                      </h4>
                      <p className="text-[11px] text-emerald-400/50 font-mono">
                        Cập nhật: {formatDate(art.updated_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        art.is_published
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/40'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-700/40'
                      }`}
                    >
                      {art.is_published ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                    <Link
                      to={`/admin/artifacts/${art.id}/edit`}
                      className="text-xs text-amber-400/80 hover:text-amber-300 font-mono"
                    >
                      Sửa
                    </Link>
                  </div>
                </div>
              ))}

              {(!stats?.recentArtifacts || stats.recentArtifacts.length === 0) && (
                <p className="text-xs text-emerald-400/50 font-mono py-4 text-center">
                  Chưa có hiện vật nào.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Community Reviews */}
        <div className="bg-[#101914] rounded-2xl border border-emerald-900/30 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Đánh Giá Gửi Mới Nhất
              </h3>
              <Link
                to="/admin/reviews"
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Quản lý</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.recentReviews || []).map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 rounded-xl bg-[#14231b] border border-emerald-900/40 hover:border-emerald-700/50 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-100">
                        {rev.reviewer_name}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-emerald-900'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        rev.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/40'
                          : rev.status === 'pending'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-600/40'
                          : 'bg-red-950/60 text-red-300 border border-red-800/40'
                      }`}
                    >
                      {rev.status === 'approved'
                        ? 'Đã duyệt'
                        : rev.status === 'pending'
                        ? 'Chờ duyệt'
                        : 'Từ chối'}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-200/80 line-clamp-1 italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400/50 pt-0.5">
                    <span>Mục: {rev.artifact_name}</span>
                    <span>{formatDate(rev.created_at)}</span>
                  </div>
                </div>
              ))}

              {(!stats?.recentReviews || stats.recentReviews.length === 0) && (
                <p className="text-xs text-emerald-400/50 font-mono py-4 text-center">
                  Chưa có đánh giá nào.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Recent Website Contents Section */}
      <div className="bg-[#101914] rounded-2xl border border-emerald-900/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-amber-400" />
            Nội Dung Trang Chủ & Dự Án Vừa Cập Nhật
          </h3>
          <Link
            to="/admin/website-content"
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Tất cả nội dung</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(stats?.recentContents || []).map((cnt) => (
            <div
              key={cnt.content_key}
              className="p-3.5 rounded-xl bg-[#14231b] border border-emerald-900/40 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-wider">
                  {cnt.content_key}
                </span>
                <h4 className="text-xs font-semibold text-emerald-100 mt-1 line-clamp-2">
                  {cnt.title_vi}
                </h4>
              </div>
              <div className="text-[10px] font-mono text-emerald-400/50 mt-3 pt-2 border-t border-emerald-900/30 flex items-center justify-between">
                <span>Cập nhật:</span>
                <span>{formatDate(cnt.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
