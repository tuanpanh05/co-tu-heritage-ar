import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { categoryService, CategoryRecord } from '../../services/categoryService';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Box,
  ShieldAlert
} from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [categories, setCategories] = useState<Array<CategoryRecord & { artifactCount: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [modalForm, setModalForm] = useState({
    name_vi: '',
    name_en: '',
    slug: '',
    description_vi: '',
    description_en: '',
    display_order: 1
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Safe Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<(CategoryRecord & { artifactCount: number }) | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoryService.getCategoryWithCounts();
      setCategories(data);
    } catch (err: any) {
      console.error('[AdminCategoriesPage] Load error:', err);
      setError(err.message || 'Không thể tải danh mục từ Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalForm({
      name_vi: '',
      name_en: '',
      slug: '',
      description_vi: '',
      description_en: '',
      display_order: categories.length + 1
    });
    setShowModal(true);
  };

  const openEditModal = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setModalForm({
      name_vi: cat.name_vi,
      name_en: cat.name_en,
      slug: cat.slug,
      description_vi: cat.description_vi || '',
      description_en: cat.description_en || '',
      display_order: cat.display_order ?? 1
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.name_vi.trim() || !modalForm.name_en.trim() || !modalForm.slug.trim()) {
      alert('Vui lòng nhập đầy đủ Tên tiếng Việt, Tên tiếng Anh và Mã định danh (slug).');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await categoryService.update(editingCategory.id, {
          name_vi: modalForm.name_vi.trim(),
          name_en: modalForm.name_en.trim(),
          slug: modalForm.slug.trim().toLowerCase(),
          description_vi: modalForm.description_vi.trim() || null,
          description_en: modalForm.description_en.trim() || null,
          display_order: Number(modalForm.display_order) || 0
        });
        showToast(`Đã cập nhật danh mục "${modalForm.name_vi}".`);
      } else {
        await categoryService.create({
          name_vi: modalForm.name_vi.trim(),
          name_en: modalForm.name_en.trim(),
          slug: modalForm.slug.trim().toLowerCase(),
          description_vi: modalForm.description_vi.trim() || null,
          description_en: modalForm.description_en.trim() || null,
          display_order: Number(modalForm.display_order) || 0
        });
        showToast(`Đã thêm danh mục mới "${modalForm.name_vi}".`);
      }
      setShowModal(false);
      await loadCategories();
    } catch (err: any) {
      alert(`Lỗi lưu danh mục: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSafe = async () => {
    if (!deleteTarget) return;

    // Safety check: Cannot delete category if artifacts reference it!
    if (deleteTarget.artifactCount > 0) {
      setDeleteError(
        `Không thể xóa danh mục này vì đang có ${deleteTarget.artifactCount} hiện vật liên kết. Vui lòng chuyển các hiện vật sang danh mục khác trước khi xóa.`
      );
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);
      await categoryService.delete(deleteTarget.id);
      showToast(`Đã xóa danh mục "${deleteTarget.name_vi}".`);
      setDeleteTarget(null);
      await loadCategories();
    } catch (err: any) {
      setDeleteError(err.message || 'Lỗi khi xóa danh mục.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Alert */}
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
            <FolderTree className="w-6 h-6 text-amber-400" />
            Danh Mục Di Sản Văn Hóa
          </h1>
          <p className="text-xs text-emerald-300/70 mt-1">
            Phân loại học các lĩnh vực di sản Cơ Tu: Kiến trúc, Nhạc cụ, Đan lát dệt vải, Điêu khắc và Đời sống.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadCategories}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-[#121c17] border border-emerald-800/40 hover:border-amber-500/40 text-emerald-200 text-xs transition-all"
            title="Tải lại"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 text-emerald-950 font-semibold text-xs tracking-wide shadow-lg shadow-amber-600/20 active:scale-95 transition-all font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Danh Mục Mới</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-[#121c17] border border-emerald-900/30 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="py-20 text-center text-emerald-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <span>Đang nạp danh mục từ Supabase...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-emerald-400/60 font-mono text-xs">
            Chưa có danh mục nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0e1612] border-b border-emerald-900/40 text-emerald-400/80 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 w-16 text-center">Thứ tự</th>
                  <th className="py-3.5 px-4">Tên danh mục (Song ngữ)</th>
                  <th className="py-3.5 px-4">Mã định danh (Slug)</th>
                  <th className="py-3.5 px-4">Mô tả tóm tắt</th>
                  <th className="py-3.5 px-4 text-center">Số hiện vật</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/20">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#15231c]/60 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-amber-400 font-bold">
                      {cat.display_order}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-serif font-bold text-amber-100 text-sm">
                        {cat.name_vi}
                      </div>
                      <div className="text-emerald-300/70 text-xs italic mt-0.5">
                        {cat.name_en}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400/90 text-xs">
                      {cat.slug}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-300/70 text-xs max-w-xs truncate">
                      {cat.description_vi || '--'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#17251e] text-emerald-300 border border-emerald-700/40 text-[11px]">
                        <Box className="w-3 h-3 text-amber-400" />
                        <span>{cat.artifactCount} hiện vật</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg bg-[#0e1713] text-amber-400 hover:text-amber-200 border border-emerald-800/40"
                          title="Sửa danh mục"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(null);
                              setDeleteTarget(cat);
                            }}
                            className="p-1.5 rounded-lg bg-[#0e1713] text-red-400 hover:text-red-200 border border-emerald-800/40"
                            title="Xóa danh mục"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121c17] border border-emerald-800/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-4">
              <h3 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-amber-400" />
                <span>{editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400/80 mb-1">Tên Tiếng Việt *</label>
                  <input
                    type="text"
                    value={modalForm.name_vi}
                    onChange={(e) => setModalForm({ ...modalForm, name_vi: e.target.value })}
                    required
                    placeholder="Kiến trúc truyền thống"
                    className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white font-sans text-xs"
                  />
                </div>
                <div>
                  <label className="block text-emerald-400/80 mb-1">Tên Tiếng Anh *</label>
                  <input
                    type="text"
                    value={modalForm.name_en}
                    onChange={(e) => setModalForm({ ...modalForm, name_en: e.target.value })}
                    required
                    placeholder="Traditional Architecture"
                    className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white font-sans text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400/80 mb-1">Mã Định Danh (Slug) *</label>
                  <input
                    type="text"
                    value={modalForm.slug}
                    onChange={(e) => setModalForm({ ...modalForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                    required
                    placeholder="architecture"
                    className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-emerald-400/80 mb-1">Thứ Tự Hiển Thị</label>
                  <input
                    type="number"
                    value={modalForm.display_order}
                    onChange={(e) => setModalForm({ ...modalForm, display_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-400/80 mb-1">Mô Tả Tiếng Việt</label>
                <textarea
                  rows={2}
                  value={modalForm.description_vi}
                  onChange={(e) => setModalForm({ ...modalForm, description_vi: e.target.value })}
                  placeholder="Mô tả tóm lược phạm vi danh mục..."
                  className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-emerald-400/80 mb-1">Mô Tả Tiếng Anh</label>
                <textarea
                  rows={2}
                  value={modalForm.description_en}
                  onChange={(e) => setModalForm({ ...modalForm, description_en: e.target.value })}
                  placeholder="Brief summary in English..."
                  className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white font-sans text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-900/40">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17251e] text-emerald-300 hover:bg-[#20342a]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu Danh Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121c17] border border-red-700/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-700/40 flex items-center justify-center mx-auto mb-4 text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-amber-100 text-center">
              Kiểm Tra An Toàn Xóa Danh Mục
            </h3>
            <p className="text-xs text-emerald-200/70 mt-2 text-center leading-relaxed">
              Bạn đang yêu cầu xóa danh mục{' '}
              <span className="font-bold text-amber-300">"{deleteTarget.name_vi}"</span>.
            </p>

            {deleteTarget.artifactCount > 0 ? (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Ràng buộc toàn vẹn dữ liệu:</span>
                </div>
                Hiện có <strong>{deleteTarget.artifactCount} hiện vật</strong> đang trực thuộc danh mục này. Để bảo vệ dữ liệu, hệ thống không cho phép xóa danh mục khi còn hiện vật liên kết.
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-mono text-center mt-3">
                Danh mục này hiện không có hiện vật nào liên kết. Xóa an toàn.
              </p>
            )}

            {deleteError && (
              <div className="mt-3 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#17251e] border border-emerald-800/40 text-emerald-200 text-xs font-mono"
              >
                Đóng
              </button>
              {deleteTarget.artifactCount === 0 && (
                <button
                  type="button"
                  onClick={handleDeleteSafe}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs font-mono font-medium disabled:opacity-50"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xác Nhận Xóa'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
