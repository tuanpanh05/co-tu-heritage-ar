import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { reviewService, ReviewDbRecord } from '../../services/reviewService';
import {
  MessageSquare,
  Check,
  X,
  Trash2,
  RefreshCw,
  Search,
  Star,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const { isSuperAdmin, isEditor } = useAdminAuth();
  const [reviews, setReviews] = useState<ReviewDbRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ReviewDbRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await reviewService.fetchAdminReviews();
      setReviews(data);
    } catch (err: any) {
      console.error('[AdminReviewsPage] Load error:', err);
      setError(err.message || 'Không thể tải danh sách đánh giá từ Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (reviewId: string, status: 'approved' | 'rejected') => {
    if (!isSuperAdmin) {
      alert('Chỉ tài khoản Super Admin mới có quyền duyệt hoặc từ chối đánh giá.');
      return;
    }

    try {
      await reviewService.moderateReview(reviewId, status);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
      );
      showToast(
        status === 'approved'
          ? 'Đã duyệt đánh giá thành công! Đánh giá sẽ hiển thị công khai cho du khách.'
          : 'Đã từ chối đánh giá.'
      );
    } catch (err: any) {
      alert(`Lỗi kiểm duyệt: ${err.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !isSuperAdmin) return;
    try {
      setIsDeleting(true);
      await reviewService.deleteReview(deleteTarget.id);
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast('Đã xóa đánh giá khỏi cơ sở dữ liệu.');
      setDeleteTarget(null);
    } catch (err: any) {
      alert(`Lỗi khi xóa đánh giá: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Counts
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = reviews.filter((r) => r.status === 'rejected').length;

  // Filtered
  const filteredReviews = reviews.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term ||
      (r.reviewer_name && r.reviewer_name.toLowerCase().includes(term)) ||
      r.comment.toLowerCase().includes(term) ||
      (r.artifacts?.name_vi && r.artifacts.name_vi.toLowerCase().includes(term));
    return matchStatus && matchSearch;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-emerald-900 border border-amber-500/50 text-amber-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-amber-100 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            Kiểm Duyệt Cảm Nhận & Đánh Giá
          </h1>
          <p className="text-xs text-emerald-300/70 mt-1">
            Quản trị các cảm nhận văn hóa của du khách WebAR trước khi hiển thị công khai trên website.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReviews}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121c17] border border-emerald-800/40 text-emerald-200 hover:text-amber-200 text-xs font-mono transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadReviews} className="text-amber-300 underline font-mono">
            Thử lại
          </button>
        </div>
      )}

      {/* Role notice if Editor */}
      {isEditor && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs flex items-center gap-2.5 font-mono">
          <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Bạn đang đăng nhập với vai trò <strong>Học Sinh (Editor)</strong>: Bạn có quyền xem danh sách và góp ý nội dung. Thao tác Duyệt, Từ chối và Xóa đánh giá chỉ dành cho tài khoản <strong>Super Admin</strong>.
          </span>
        </div>
      )}

      {/* Metric Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-[#182820] border-amber-500/70 shadow-md'
              : 'bg-[#121c17] border-emerald-900/30 hover:border-emerald-700/40'
          }`}
        >
          <div className="text-[11px] font-mono text-emerald-400/80 uppercase">Tất Cả</div>
          <div className="text-2xl font-serif font-bold text-amber-100 mt-0.5">
            {reviews.length}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'pending'
              ? 'bg-[#182820] border-amber-500/70 shadow-md'
              : 'bg-[#121c17] border-emerald-900/30 hover:border-emerald-700/40'
          }`}
        >
          <div className="text-[11px] font-mono text-amber-400 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Chờ Duyệt
          </div>
          <div className="text-2xl font-serif font-bold text-amber-300 mt-0.5">
            {pendingCount}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('approved')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'approved'
              ? 'bg-[#182820] border-amber-500/70 shadow-md'
              : 'bg-[#121c17] border-emerald-900/30 hover:border-emerald-700/40'
          }`}
        >
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Đã Duyệt</div>
          <div className="text-2xl font-serif font-bold text-emerald-300 mt-0.5">
            {approvedCount}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'rejected'
              ? 'bg-[#182820] border-amber-500/70 shadow-md'
              : 'bg-[#121c17] border-emerald-900/30 hover:border-emerald-700/40'
          }`}
        >
          <div className="text-[11px] font-mono text-red-400/80 uppercase">Từ Chối</div>
          <div className="text-2xl font-serif font-bold text-red-300 mt-0.5">
            {rejectedCount}
          </div>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl bg-[#121c17] border border-emerald-900/30">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên người đánh giá, nội dung cảm nhận, tên hiện vật..."
            className="w-full pl-10 pr-4 py-2 bg-[#0c1410] border border-emerald-800/40 rounded-xl text-white placeholder-emerald-700/60 focus:outline-none focus:border-amber-500/70 text-xs transition-all"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-20 text-center text-emerald-400 font-mono text-xs flex flex-col items-center justify-center gap-3 bg-[#121c17] rounded-2xl border border-emerald-900/30">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <span>Đang tải đánh giá từ Supabase...</span>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center text-emerald-400/60 font-mono text-xs bg-[#121c17] rounded-2xl border border-emerald-900/30">
            Không có đánh giá nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isPending = rev.status === 'pending';
            const isApproved = rev.status === 'approved';
            const isRejected = rev.status === 'rejected';

            return (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl bg-[#121c17] border transition-all ${
                  isPending
                    ? 'border-amber-600/50 shadow-lg shadow-amber-950/20'
                    : 'border-emerald-900/30 hover:border-emerald-700/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left: Author & Review info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-rose-700 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {rev.avatar_initials || 'CT'}
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-100 text-sm flex items-center gap-2">
                          <span>{rev.reviewer_name || 'Khách tham quan'}</span>
                          <span className="text-[11px] font-normal text-emerald-400/60 font-mono">
                            ({rev.reviewer_role_vi || 'Khách WebAR'})
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-500/60">
                          Gửi lúc: {formatDate(rev.created_at)}
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center text-amber-400 ml-auto md:ml-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-emerald-900'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Status Pill */}
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${
                          isApproved
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                            : isPending
                            ? 'bg-amber-950 text-amber-300 border border-amber-600/60 animate-pulse'
                            : 'bg-red-950 text-red-300 border border-red-800/60'
                        }`}
                      >
                        {isApproved ? 'Đã duyệt công khai' : isPending ? 'Chờ kiểm duyệt' : 'Đã từ chối'}
                      </span>
                    </div>

                    {/* Target artifact */}
                    <div className="text-xs font-mono text-amber-400/80 pt-1">
                      Mục đánh giá:{' '}
                      <span className="text-white font-bold">
                        {rev.artifacts?.name_vi || 'Toàn bộ Không gian Di sản WebAR'}
                      </span>
                    </div>

                    {/* Comment content */}
                    <p className="text-xs text-emerald-100/90 leading-relaxed pt-1 whitespace-pre-line bg-[#0c1410] p-3 rounded-xl border border-emerald-900/30">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Right: Moderation Actions (Super Admin only) */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-900/20">
                    {isSuperAdmin ? (
                      <>
                        {/* Status: Pending -> Show Approve & Reject */}
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleModerate(rev.id, 'approved')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-mono border border-emerald-600/50 transition-all shadow-sm"
                              title="Duyệt cho phép hiển thị lên web"
                            >
                              <Check className="w-3.5 h-3.5 text-amber-400" />
                              <span>Duyệt</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleModerate(rev.id, 'rejected')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-mono border border-red-800/40 transition-all"
                              title="Từ chối đánh giá này"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Từ Chối</span>
                            </button>
                          </>
                        )}

                        {/* Status: Approved -> Only show "Tạm ẩn" if need to revoke */}
                        {isApproved && (
                          <button
                            type="button"
                            onClick={() => handleModerate(rev.id, 'rejected')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14231b] hover:bg-amber-950/50 text-amber-300/80 hover:text-amber-200 text-xs font-mono border border-emerald-800/40 hover:border-amber-600/50 transition-all"
                            title="Gỡ đánh giá này khỏi website công khai"
                          >
                            <X className="w-3.5 h-3.5 text-amber-400" />
                            <span>Tạm Ẩn Khỏi Web</span>
                          </button>
                        )}

                        {/* Status: Rejected -> Show "Duyệt lại" */}
                        {isRejected && (
                          <button
                            type="button"
                            onClick={() => handleModerate(rev.id, 'approved')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-mono border border-emerald-700/50 transition-all"
                            title="Duyệt lại đánh giá này"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Duyệt Lại</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(rev)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-xs font-mono border border-red-900/40 transition-all"
                          title="Xóa vĩnh viễn khỏi database"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-mono text-emerald-500/50 italic">
                        Chỉ Super Admin duyệt
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121c17] border border-red-700/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-700/40 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-amber-100 text-center">
              Xóa Đánh Giá Này?
            </h3>
            <p className="text-xs text-emerald-200/70 mt-2 text-center leading-relaxed">
              Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá của "
              <span className="font-bold text-amber-300">{deleteTarget.reviewer_name}</span>"? Thao tác này không thể hoàn tác.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#17251e] border border-emerald-800/40 text-emerald-200 text-xs font-mono"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-medium disabled:opacity-50"
              >
                {isDeleting ? 'Đang xóa...' : 'Xác Nhận Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
