import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { mediaLibraryService, MediaFileItem } from '../../services/mediaLibraryService';
import { storageService, StorageBucket } from '../../services/storageService';
import '@google/model-viewer';
import {
  Image as ImageIcon,
  Rotate3d,
  Upload,
  Search,
  Copy,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Eye,
  X
} from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const { isSuperAdmin } = useAdminAuth();
  const [mediaFiles, setMediaFiles] = useState<MediaFileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [filterRefStatus, setFilterRefStatus] = useState<'all' | 'used' | 'unused'>('all');

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [targetBucket, setTargetBucket] = useState<StorageBucket>('artifact-images');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Preview modal state
  const [previewItem, setPreviewItem] = useState<MediaFileItem | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<MediaFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const list = await mediaLibraryService.getAllMediaFiles();
      setMediaFiles(list);
    } catch (err: any) {
      console.error('[AdminMediaPage] Load error:', err);
      setError(err.message || 'Không thể tải danh sách tài nguyên Storage.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Đã sao chép liên kết URL vào bộ nhớ đệm!');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Vui lòng chọn file để tải lên.');
      return;
    }

    try {
      setIsUploading(true);
      const safeName = uploadFile.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
      const storagePath = `uploads/${Date.now()}-${safeName}`;

      const { data, error: uploadErr } = await storageService.uploadFile(
        targetBucket,
        storagePath,
        uploadFile
      );
      if (uploadErr || !data) throw uploadErr || new Error('Upload thất bại');

      showToast(`Đã tải file "${uploadFile.name}" lên bucket ${targetBucket}!`);
      setShowUploadModal(false);
      setUploadFile(null);
      await loadMedia();
    } catch (err: any) {
      alert(`Lỗi upload: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await mediaLibraryService.deleteMediaFile(deleteTarget.bucket, deleteTarget.storagePath);
      showToast(`Đã xóa file "${deleteTarget.name}" khỏi Storage.`);
      setDeleteTarget(null);
      await loadMedia();
    } catch (err: any) {
      alert(`Lỗi xóa file: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '--';
    if (bytes >= 1048576) {
      return `${(bytes / 1048576).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatDate = (iso?: string | null) => {
    if (!iso) return '--';
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filtered
  const filteredFiles = mediaFiles.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      !term || item.name.toLowerCase().includes(term) || item.storagePath.toLowerCase().includes(term);

    const matchBucket = selectedBucket === 'all' || item.bucket === selectedBucket;

    const matchRef =
      filterRefStatus === 'all' ||
      (filterRefStatus === 'used' && item.isReferenced) ||
      (filterRefStatus === 'unused' && !item.isReferenced);

    return matchSearch && matchBucket && matchRef;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
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
            <ImageIcon className="w-6 h-6 text-amber-400" />
            Thư Viện Media & Supabase Storage
          </h1>
          <p className="text-xs text-emerald-300/70 mt-1">
            Quản lý tập trung toàn bộ hình ảnh di sản, mô hình 3D GLB và tài nguyên số hóa trên các Storage Buckets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadMedia}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-[#121c17] border border-emerald-800/40 text-emerald-200 text-xs transition-all"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 text-emerald-950 font-semibold text-xs tracking-wide shadow-lg shadow-amber-600/20 active:scale-95 transition-all font-mono"
          >
            <Upload className="w-4 h-4" />
            <span>Tải File Lên Storage</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121c17] border border-emerald-900/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên file, định dạng, đường dẫn lưu trữ..."
            className="w-full pl-10 pr-4 py-2 bg-[#0c1410] border border-emerald-800/40 rounded-xl text-white placeholder-emerald-700/60 focus:outline-none focus:border-amber-500/70 transition-all font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap font-mono">
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value)}
            className="px-3 py-2 bg-[#0c1410] border border-emerald-800/40 rounded-xl text-emerald-200 focus:outline-none focus:border-amber-500/70"
          >
            <option value="all">Tất cả Buckets ({mediaFiles.length} files)</option>
            <option value="artifact-images">artifact-images</option>
            <option value="artifact-models">artifact-models (3D GLB)</option>
            <option value="website-assets">website-assets</option>
          </select>

          <select
            value={filterRefStatus}
            onChange={(e) => setFilterRefStatus(e.target.value as any)}
            className="px-3 py-2 bg-[#0c1410] border border-emerald-800/40 rounded-xl text-emerald-200 focus:outline-none focus:border-amber-500/70"
          >
            <option value="all">Tất cả trạng thái liên kết</option>
            <option value="used">Đang được sử dụng (Referenced)</option>
            <option value="unused">Chưa liên kết (Unused)</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="py-24 text-center text-emerald-400 font-mono text-xs flex flex-col items-center justify-center gap-3 bg-[#121c17] rounded-2xl border border-emerald-900/30">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
          <span>Đang quét các storage bucket trên Supabase...</span>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="py-20 text-center text-emerald-400/60 font-mono text-xs bg-[#121c17] rounded-2xl border border-emerald-900/30">
          <ImageIcon className="w-10 h-10 mx-auto text-emerald-800 mb-3" />
          Không tìm thấy file nào trong kho lưu trữ phù hợp với bộ lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file, idx) => {
            const isGlb = file.name.toLowerCase().endsWith('.glb') || file.bucket === 'artifact-models';

            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#121c17] border border-emerald-900/40 overflow-hidden flex flex-col justify-between hover:border-emerald-700/60 transition-all group"
              >
                {/* Thumbnail / 3D Icon Area */}
                <div
                  className="h-44 bg-[#0a120e] relative flex items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => setPreviewItem(file)}
                >
                  {isGlb ? (
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-600/40 flex items-center justify-center mx-auto text-amber-400 group-hover:scale-110 transition-transform">
                        <Rotate3d className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono text-amber-300/80 block">
                        File 3D GLB
                      </span>
                    </div>
                  ) : (
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.currentTarget as any).src = '/images/guol-authentic.jpg';
                      }}
                    />
                  )}

                  {/* Bucket Badge */}
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 text-emerald-300 border border-emerald-800/40 backdrop-blur-sm">
                    {file.bucket}
                  </span>

                  {/* Referenced Indicator Badge */}
                  {file.isReferenced ? (
                    <span
                      className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 backdrop-blur-sm"
                      title={file.referencedBy}
                    >
                      Đang dùng
                    </span>
                  ) : (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-600/60 backdrop-blur-sm">
                      Chưa gắn
                    </span>
                  )}
                </div>

                {/* Details Footer */}
                <div className="p-3.5 space-y-2">
                  <div className="text-xs font-mono font-medium text-emerald-100 truncate" title={file.name}>
                    {file.name}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-500/70">
                    <span>{formatFileSize(file.sizeBytes)}</span>
                    <span>{formatDate(file.createdAt)}</span>
                  </div>

                  {file.referencedBy && (
                    <div className="text-[10px] font-mono text-amber-400/80 truncate">
                      {file.referencedBy}
                    </div>
                  )}

                  <div className="pt-2 border-t border-emerald-900/30 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(file.publicUrl)}
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-mono"
                      title="Sao chép URL công khai"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(file)}
                        className="p-1 rounded-lg bg-[#0e1713] text-emerald-300 hover:text-white border border-emerald-800/40"
                        title="Xem trước"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(file)}
                          className="p-1 rounded-lg bg-[#0e1713] text-red-400 hover:text-red-200 border border-emerald-800/40"
                          title="Xóa file khỏi Storage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121c17] border border-emerald-800/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-4">
              <h3 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Tải File Mới Lên Supabase Storage</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-emerald-400/80 mb-1">Chọn Bucket Lưu Trữ</label>
                <select
                  value={targetBucket}
                  onChange={(e) => setTargetBucket(e.target.value as StorageBucket)}
                  className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-emerald-100"
                >
                  <option value="artifact-images">artifact-images (Ảnh hiện vật, tối đa 15MB)</option>
                  <option value="artifact-models">artifact-models (Mô hình 3D GLB, tối đa 100MB)</option>
                  <option value="website-assets">website-assets (Ảnh banner, trang chủ, tối đa 15MB)</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-400/80 mb-1">Chọn Tệp Tin</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-emerald-300 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-[#17251e] file:text-amber-300 hover:file:bg-[#20352a]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-900/40">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17251e] text-emerald-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold"
                >
                  {isUploading ? 'Đang Upload...' : 'Bắt Đầu Tải Lên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121c17] border border-emerald-800/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 text-emerald-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-serif font-bold text-amber-100 mb-3 truncate pr-8">
              Xem trước: {previewItem.name}
            </h3>

            <div className="rounded-xl bg-[#0a120e] border border-emerald-900/50 p-2 min-h-[300px] max-h-[500px] flex items-center justify-center overflow-hidden">
              {previewItem.name.toLowerCase().endsWith('.glb') || previewItem.bucket === 'artifact-models' ? (
                <div className="w-full h-80">
                  {/* @ts-ignore */}
                  <model-viewer
                    src={previewItem.publicUrl}
                    alt={previewItem.name}
                    auto-rotate
                    camera-controls
                    ar
                    shadow-intensity="1"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <img
                  src={previewItem.publicUrl}
                  alt={previewItem.name}
                  className="max-h-[450px] object-contain rounded-lg"
                />
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-mono text-emerald-400/80">
              <span className="truncate max-w-md">{previewItem.publicUrl}</span>
              <button
                type="button"
                onClick={() => handleCopyUrl(previewItem.publicUrl)}
                className="text-amber-400 hover:text-amber-300 font-bold underline"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Safety Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121c17] border border-red-700/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-700/40 flex items-center justify-center mx-auto mb-4 text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-amber-100 text-center">
              Kiểm Tra An Toàn Xóa File Media
            </h3>
            <p className="text-xs text-emerald-200/70 mt-2 text-center leading-relaxed">
              Bạn đang yêu cầu xóa vĩnh viễn file{' '}
              <span className="font-bold text-amber-300">"{deleteTarget.name}"</span> khỏi Supabase Storage bucket <code>{deleteTarget.bucket}</code>.
            </p>

            {deleteTarget.isReferenced ? (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Cảnh báo an toàn dữ liệu:</span>
                </div>
                File này hiện đang được sử dụng bởi: <strong className="text-white">{deleteTarget.referencedBy}</strong>. Nếu xóa, trang web du khách có thể bị lỗi hình ảnh hoặc mô hình 3D tương ứng.
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-mono text-center mt-3">
                File này chưa được liên kết với bất kỳ bản ghi nào trong database. Xóa an toàn.
              </p>
            )}

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
                onClick={handleDeleteFile}
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
