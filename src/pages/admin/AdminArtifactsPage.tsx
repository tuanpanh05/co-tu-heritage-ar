import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { artifactService } from '../../services/artifactService';
import { categoryService, CategoryRecord } from '../../services/categoryService';
import { storageService } from '../../services/storageService';
import {
  Box,
  Plus,
  Search,
  CheckCircle2,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  BoxSelect,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminArtifactsPage: React.FC = () => {
  const { isSuperAdmin, isEditor } = useAdminAuth();
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all'); // all, published, draft
  const [sortBy, setSortBy] = useState<'order' | 'newest'>('order');

  // Deletion modal state
  const [deleteModalItem, setDeleteModalItem] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [artList, catList] = await Promise.all([
        artifactService.fetchAdminArtifacts(),
        categoryService.getAll()
      ]);
      setArtifacts(artList);
      setCategories(catList);
    } catch (err: any) {
      console.error('[AdminArtifactsPage] Load error:', err);
      setError(err.message || 'Không thể tải danh sách hiện vật từ Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Publish / Unpublish Toggle
  const handleTogglePublish = async (item: any) => {
    const nextStatus = !item.is_published;
    try {
      await artifactService.togglePublishStatus(item.id, nextStatus);
      setArtifacts((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, is_published: nextStatus } : a))
      );
      showToast(
        nextStatus
          ? `Đã xuất bản "${item.name_vi}" lên website du khách.`
          : `Đã chuyển "${item.name_vi}" về trạng thái Bản nháp.`
      );
    } catch (err: any) {
      alert(`Lỗi thay đổi trạng thái xuất bản: ${err.message}`);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteModalItem) return;
    try {
      setIsDeleting(true);
      setDeleteError(null);
      await artifactService.deleteArtifact(deleteModalItem.id);
      setArtifacts((prev) => prev.filter((a) => a.id !== deleteModalItem.id));
      showToast(`Đã xóa vĩnh viễn hiện vật "${deleteModalItem.name_vi}".`);
      setDeleteModalItem(null);
    } catch (err: any) {
      setDeleteError(err.message || 'Lỗi khi xóa hiện vật.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered and Sorted list
  const filteredArtifacts = artifacts
    .filter((item) => {
      // Search text
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        item.name_vi.toLowerCase().includes(term) ||
        (item.name_en && item.name_en.toLowerCase().includes(term)) ||
        item.slug.toLowerCase().includes(term);

      // Category
      const matchCat =
        selectedCategory === 'all' ||
        item.category_id === selectedCategory ||
        item.artifact_categories?.slug === selectedCategory;

      // Status
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'published' && item.is_published) ||
        (selectedStatus === 'draft' && !item.is_published);

      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'order') {
        return (a.display_order ?? 0) - (b.display_order ?? 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-emerald-900 border border-amber-500/50 text-amber-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-amber-100 flex items-center gap-2.5">
            <Box className="w-6 h-6 text-amber-400" />
            Quản Lý Hiện Vật 3D & Di Sản
          </h1>
          <p className="text-xs text-emerald-300/70 mt-1">
            Quản lý thông tin song ngữ, mô hình 3D photogrammetry, bộ sưu tập ảnh và từ vựng học tập.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-[#121c17] border border-emerald-800/40 hover:border-amber-500/40 text-emerald-200 hover:text-amber-200 text-xs transition-all shadow-sm"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <Link
            to="/admin/artifacts/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-emerald-950 font-semibold text-xs tracking-wide shadow-lg shadow-amber-600/20 active:scale-95 transition-all font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Hiện Vật Mới</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-[#121c17] border border-emerald-900/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hiện vật (Việt hoặc Anh), định danh slug..."
            className="w-full pl-10 pr-4 py-2 bg-[#0c1410] border border-emerald-800/40 rounded-xl text-white placeholder-emerald-700/60 focus:outline-none focus:border-amber-500/70 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-[#0c1410] border border-emerald-800/40 rounded-xl text-emerald-200 focus:outline-none focus:border-amber-500/70 font-mono"
          >
            <option value="all">Tất cả danh mục ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_vi}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#0c1410] border border-emerald-800/40 rounded-xl text-emerald-200 focus:outline-none focus:border-amber-500/70 font-mono"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-[#0c1410] border border-emerald-800/40 rounded-xl text-emerald-200 focus:outline-none focus:border-amber-500/70 font-mono"
          >
            <option value="order">Thứ tự hiển thị</option>
            <option value="newest">Mới tạo nhất</option>
          </select>
        </div>
      </div>

      {/* Role permission notice if Editor */}
      {isEditor && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2.5 font-mono">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Vai trò Học sinh: Bạn có quyền tạo mới, chỉnh sửa thông tin hiện vật, tải ảnh/mô hình 3D và từ vựng. Quyền xóa vĩnh viễn chỉ dành cho Super Admin.
          </span>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-[#121c17] border border-emerald-900/30 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 text-center text-emerald-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <span>Đang tải danh sách hiện vật từ Supabase PostgreSQL...</span>
          </div>
        ) : filteredArtifacts.length === 0 ? (
          <div className="py-16 text-center text-emerald-400/60 font-mono text-xs">
            <Box className="w-10 h-10 mx-auto text-emerald-800 mb-3" />
            Không tìm thấy hiện vật nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0e1612] border-b border-emerald-900/40 text-emerald-400/80 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-12 text-center">STT</th>
                  <th className="py-3.5 px-4 w-20">Ảnh</th>
                  <th className="py-3.5 px-4">Hiện vật & Danh mục</th>
                  <th className="py-3.5 px-4">Mô hình 3D</th>
                  <th className="py-3.5 px-4">Học liệu</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/20">
                {filteredArtifacts.map((item, index) => {
                  const resolvedThumbnail = storageService.resolveAssetUrl(item.thumbnail_path, 'artifact-images');
                  const hasModel = Boolean(item.model_3d_path);
                  const vocabCount = item.artifact_vocabulary?.length ?? 0;
                  const galleryCount = item.artifact_images?.length ?? 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#15231c]/60 transition-colors group"
                    >
                      {/* Order */}
                      <td className="py-3.5 px-4 text-center font-mono text-emerald-500/70">
                        {item.display_order ?? index + 1}
                      </td>

                      {/* Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="w-14 h-14 rounded-xl bg-[#0a120e] border border-emerald-800/40 overflow-hidden flex items-center justify-center shrink-0">
                          {resolvedThumbnail ? (
                            <img
                              src={resolvedThumbnail}
                              alt={item.name_vi}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                (e.currentTarget as any).src = '/images/guol-authentic.jpg';
                              }}
                            />
                          ) : (
                            <Box className="w-6 h-6 text-emerald-700" />
                          )}
                        </div>
                      </td>

                      {/* Names & Category */}
                      <td className="py-3.5 px-4">
                        <div className="font-serif font-bold text-amber-100 text-sm">
                          {item.name_vi}
                        </div>
                        <div className="text-emerald-300/70 text-xs italic mt-0.5">
                          {item.name_en || 'Chưa có tên tiếng Anh'}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-[#17251e] text-amber-400/90 border border-amber-600/30">
                            {item.artifact_categories?.name_vi || 'Kiến trúc'}
                          </span>
                          <span className="text-emerald-600 font-mono">
                            slug: {item.slug}
                          </span>
                        </div>
                      </td>

                      {/* 3D Model Status */}
                      <td className="py-3.5 px-4 font-mono">
                        {hasModel ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700/50">
                            <BoxSelect className="w-3.5 h-3.5 text-amber-400" />
                            <span>GLB Sẵn Sàng</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-400/80 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/40">
                            <Layers className="w-3.5 h-3.5 text-amber-500" />
                            <span>Đang tái tạo 3D</span>
                          </span>
                        )}
                      </td>

                      {/* Educational Assets (Vocabulary & Gallery) */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-300/80">
                        <div>{vocabCount} từ vựng CLIL</div>
                        <div className="text-emerald-500/60 mt-0.5">{galleryCount} ảnh bộ sưu tập</div>
                      </td>

                      {/* Publication Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                            item.is_published
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60 hover:bg-emerald-900'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-700/60 hover:bg-amber-900/60'
                          }`}
                          title="Bấm để bật/tắt xuất bản"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.is_published ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                            }`}
                          />
                          <span>{item.is_published ? 'Đã xuất bản' : 'Bản nháp'}</span>
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview Link */}
                          <Link
                            to={`/artifacts/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#0e1713] text-emerald-400 hover:text-amber-300 hover:bg-emerald-950 border border-emerald-800/40 transition-colors"
                            title="Xem trang du khách"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit button */}
                          <Link
                            to={`/admin/artifacts/${item.id}/edit`}
                            className="p-1.5 rounded-lg bg-[#0e1713] text-amber-400 hover:text-amber-200 hover:bg-amber-950/60 border border-emerald-800/40 transition-colors"
                            title="Chỉnh sửa hiện vật"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete button (Super Admin only) */}
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => setDeleteModalItem(item)}
                              className="p-1.5 rounded-lg bg-[#0e1713] text-red-400 hover:text-red-200 hover:bg-red-950/50 border border-emerald-800/40 transition-colors"
                              title="Xóa hiện vật"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121c17] border border-red-700/50 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-700/40 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-amber-100 text-center">
              Xác Nhận Xóa Vĩnh Viễn Hiện Vật
            </h3>
            <p className="text-xs text-emerald-200/70 mt-2 text-center leading-relaxed">
              Bạn có chắc chắn muốn xóa hiện vật{' '}
              <span className="font-bold text-amber-300">
                "{deleteModalItem.name_vi}"
              </span>{' '}
              khỏi cơ sở dữ liệu Supabase không? Thao tác này sẽ xóa toàn bộ từ vựng và ảnh liên kết.
            </p>

            {deleteError && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#17251e] border border-emerald-800/40 text-emerald-200 text-xs font-mono hover:bg-[#1f3329]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-medium disabled:opacity-50 transition-all shadow-lg"
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
