import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { artifactService } from '../../services/artifactService';
import { categoryService, CategoryRecord } from '../../services/categoryService';
import { storageService } from '../../services/storageService';
import { vocabularyService } from '../../services/vocabularyService';
import '@google/model-viewer';
import {
  ArrowLeft,
  Save,
  Box,
  Image as ImageIcon,
  BookOpen,
  Rotate3d,
  Upload,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Eye,
  X,
  RefreshCw
} from 'lucide-react';

export const AdminArtifactEditorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Active Tab: 'basic' | 'cultural' | 'images' | 'model' | 'vocab' | 'publish'
  const [activeTab, setActiveTab] = useState<'basic' | 'cultural' | 'images' | 'model' | 'vocab'>(
    'basic'
  );

  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Form State: Basic & Cultural
  const [formData, setFormData] = useState({
    name_vi: '',
    name_en: '',
    slug: '',
    category_id: '',
    short_description_vi: '',
    short_description_en: '',
    description_vi: '',
    description_en: '',
    origin_vi: '',
    origin_en: '',
    historical_story_vi: '',
    historical_story_en: '',
    cultural_meaning_vi: '',
    cultural_meaning_en: '',
    materials_vi: '',
    materials_en: '',
    dimensions: '',
    thumbnail_path: '',
    model_3d_path: '',
    model_status: 'available',
    is_published: false,
    display_order: 1
  });

  // Gallery Images State
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // 3D Model State
  const [uploadingModel, setUploadingModel] = useState<boolean>(false);
  const [modelFileSize, setModelFileSize] = useState<string | null>(null);

  // Vocabulary List State
  const [vocabularyList, setVocabularyList] = useState<any[]>([]);
  const [showVocabModal, setShowVocabModal] = useState<boolean>(false);
  const [vocabForm, setVocabForm] = useState({
    id: '',
    word_vi: '',
    word_en: '',
    pronunciation: '',
    definition_vi: '',
    definition_en: '',
    example_vi: '',
    example_en: '',
    display_order: 0
  });

  // Load Categories & Artifact Data if editing
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const catList = await categoryService.getAll();
        setCategories(catList);

        if (isEditing && id) {
          const art = await artifactService.fetchAdminArtifactById(id);
          if (art) {
            setFormData({
              name_vi: art.name_vi || '',
              name_en: art.name_en || '',
              slug: art.slug || '',
              category_id: art.category_id || (catList[0]?.id || ''),
              short_description_vi: art.short_description_vi || '',
              short_description_en: art.short_description_en || '',
              description_vi: art.description_vi || '',
              description_en: art.description_en || '',
              origin_vi: art.origin_vi || '',
              origin_en: art.origin_en || '',
              historical_story_vi: art.historical_story_vi || '',
              historical_story_en: art.historical_story_en || '',
              cultural_meaning_vi: art.cultural_meaning_vi || '',
              cultural_meaning_en: art.cultural_meaning_en || '',
              materials_vi: art.materials_vi || '',
              materials_en: art.materials_en || '',
              dimensions: art.dimensions || '',
              thumbnail_path: art.thumbnail_path || '',
              model_3d_path: art.model_3d_path || '',
              model_status: art.model_status || 'available',
              is_published: art.is_published ?? false,
              display_order: art.display_order ?? 1
            });
            setGalleryImages(art.artifact_images || []);
            setVocabularyList(art.artifact_vocabulary || []);
          }
        } else if (catList.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: catList[0].id }));
        }
      } catch (err: any) {
        console.error('[AdminArtifactEditorPage] Init error:', err);
        setFeedback({ type: 'error', message: err.message || 'Không thể nạp dữ liệu hiện vật.' });
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [id, isEditing]);

  // Auto generate slug from Vietnamese name if empty
  const handleNameViChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => {
      if (!isEditing && !prev.slug) {
        const generatedSlug = name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return { ...prev, name_vi: name, slug: generatedSlug };
      }
      return { ...prev, name_vi: name };
    });
  };

  // Thumbnail Upload directly to Supabase Storage: artifact-images
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (.jpg, .png, .webp).');
      return;
    }

    try {
      setUploadingImage(true);
      const ext = file.name.split('.').pop() || 'jpg';
      const storagePath = `thumbnails/${formData.slug || 'artifact'}-${Date.now()}.${ext}`;

      const { data, error } = await storageService.uploadFile('artifact-images', storagePath, file);
      if (error || !data) throw error || new Error('Upload ảnh thất bại.');

      setFormData((prev) => ({ ...prev, thumbnail_path: storagePath }));
      setFeedback({ type: 'success', message: 'Tải ảnh đại diện lên Supabase Storage thành công!' });
    } catch (err: any) {
      alert(`Lỗi khi tải ảnh: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Gallery Image Upload to Supabase Storage & Database
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split('.').pop() || 'jpg';
        const storagePath = `gallery/${formData.slug || 'art'}-${Date.now()}-${i}.${ext}`;

        const { data, error } = await storageService.uploadFile('artifact-images', storagePath, file);
        if (error || !data) continue;

        if (isEditing && id) {
          const newImg = await artifactService.addArtifactImage(
            id,
            storagePath,
            formData.name_vi,
            formData.name_en,
            galleryImages.length + i + 1
          );
          setGalleryImages((prev) => [...prev, newImg]);
        } else {
          // If creating new, store in local gallery array
          setGalleryImages((prev) => [
            ...prev,
            { storage_path: storagePath, alt_text_vi: formData.name_vi, display_order: prev.length + 1 }
          ]);
        }
      }
      setFeedback({ type: 'success', message: 'Tải ảnh bộ sưu tập thành công!' });
    } catch (err: any) {
      alert(`Lỗi upload bộ sưu tập: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Delete Gallery Image
  const handleDeleteGalleryImage = async (img: any) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi bộ sưu tập?')) return;
    try {
      if (img.id) {
        await artifactService.deleteArtifactImage(img.id);
      }
      setGalleryImages((prev) => prev.filter((i) => i !== img));
    } catch (err: any) {
      alert(`Lỗi xóa ảnh: ${err.message}`);
    }
  };

  // 3D Model Upload directly to Supabase Storage: artifact-models
  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('Vui lòng chọn file mô hình 3D định dạng chuẩn .glb');
      return;
    }

    try {
      setUploadingModel(true);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setModelFileSize(`${sizeMb} MB`);

      const storagePath = `${formData.slug || 'model'}/${file.name}`;
      const { data, error } = await storageService.uploadFile('artifact-models', storagePath, file, {
        contentType: 'model/gltf-binary'
      });

      if (error || !data) throw error || new Error('Upload mô hình 3D thất bại.');

      setFormData((prev) => ({
        ...prev,
        model_3d_path: storagePath,
        model_status: 'available'
      }));
      setFeedback({ type: 'success', message: `Tải mô hình 3D GLB (${sizeMb} MB) lên Supabase thành công!` });
    } catch (err: any) {
      alert(`Lỗi khi tải mô hình 3D: ${err.message}`);
    } finally {
      setUploadingModel(false);
    }
  };

  // Vocabulary Save
  const handleSaveVocab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vocabForm.word_vi.trim() || !vocabForm.word_en.trim()) {
      alert('Vui lòng nhập cả từ tiếng Việt và bản dịch tiếng Anh.');
      return;
    }

    try {
      if (isEditing && id) {
        if (vocabForm.id) {
          // Update
          const updated = await vocabularyService.update(vocabForm.id, {
            word_vi: vocabForm.word_vi.trim(),
            word_en: vocabForm.word_en.trim(),
            pronunciation: vocabForm.pronunciation.trim() || null,
            definition_vi: vocabForm.definition_vi.trim() || null,
            definition_en: vocabForm.definition_en.trim() || null,
            example_vi: vocabForm.example_vi.trim() || null,
            example_en: vocabForm.example_en.trim() || null
          });
          setVocabularyList((prev) => prev.map((v) => (v.id === vocabForm.id ? updated : v)));
        } else {
          // Create new
          const created = await vocabularyService.create({
            artifact_id: id,
            word_vi: vocabForm.word_vi.trim(),
            word_en: vocabForm.word_en.trim(),
            pronunciation: vocabForm.pronunciation.trim() || null,
            definition_vi: vocabForm.definition_vi.trim() || null,
            definition_en: vocabForm.definition_en.trim() || null,
            example_vi: vocabForm.example_vi.trim() || null,
            example_en: vocabForm.example_en.trim() || null,
            display_order: vocabularyList.length + 1
          });
          setVocabularyList((prev) => [...prev, created]);
        }
      } else {
        // Local mode for new artifact
        if (vocabForm.id) {
          setVocabularyList((prev) => prev.map((v) => (v.id === vocabForm.id ? { ...vocabForm } : v)));
        } else {
          setVocabularyList((prev) => [
            ...prev,
            { ...vocabForm, id: `temp-${Date.now()}`, display_order: prev.length + 1 }
          ]);
        }
      }
      setShowVocabModal(false);
    } catch (err: any) {
      alert(`Lỗi lưu từ vựng: ${err.message}`);
    }
  };

  // Delete Vocabulary
  const handleDeleteVocab = async (item: any) => {
    if (!window.confirm(`Xóa từ vựng "${item.word_vi}"?`)) return;
    try {
      if (item.id && !item.id.startsWith('temp-')) {
        await vocabularyService.delete(item.id);
      }
      setVocabularyList((prev) => prev.filter((v) => v !== item));
    } catch (err: any) {
      alert(`Lỗi xóa từ vựng: ${err.message}`);
    }
  };

  // Save the Entire Artifact
  const handleSaveArtifact = async () => {
    if (!formData.name_vi.trim()) {
      alert('Vui lòng nhập Tên tiếng Việt của hiện vật.');
      setActiveTab('basic');
      return;
    }
    if (!formData.slug.trim()) {
      alert('Vui lòng nhập Định danh slug cho hiện vật.');
      setActiveTab('basic');
      return;
    }
    if (!formData.category_id) {
      alert('Vui lòng chọn Danh mục di sản.');
      setActiveTab('basic');
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);

      const payload = {
        name_vi: formData.name_vi.trim(),
        name_en: formData.name_en.trim() || null,
        slug: formData.slug.trim().toLowerCase(),
        category_id: formData.category_id,
        short_description_vi: formData.short_description_vi.trim() || null,
        short_description_en: formData.short_description_en.trim() || null,
        description_vi: formData.description_vi.trim() || null,
        description_en: formData.description_en.trim() || null,
        origin_vi: formData.origin_vi.trim() || null,
        origin_en: formData.origin_en.trim() || null,
        historical_story_vi: formData.historical_story_vi.trim() || null,
        historical_story_en: formData.historical_story_en.trim() || null,
        cultural_meaning_vi: formData.cultural_meaning_vi.trim() || null,
        cultural_meaning_en: formData.cultural_meaning_en.trim() || null,
        materials_vi: formData.materials_vi.trim() || null,
        materials_en: formData.materials_en.trim() || null,
        dimensions: formData.dimensions.trim() || null,
        thumbnail_path: formData.thumbnail_path.trim() || null,
        model_3d_path: formData.model_3d_path.trim() || null,
        model_status: formData.model_status,
        is_published: formData.is_published,
        display_order: Number(formData.display_order) || 0
      };

      if (isEditing && id) {
        await artifactService.updateArtifact(id, payload);
        setFeedback({
          type: 'success',
          message: `Đã cập nhật hiện vật "${formData.name_vi}" thành công!`
        });
      } else {
        const created = await artifactService.createArtifact(payload);
        if (created?.id) {
          // If there were local gallery images or vocabulary added, link them
          for (const img of galleryImages) {
            await artifactService.addArtifactImage(created.id, img.storage_path, img.alt_text_vi);
          }
          for (const v of vocabularyList) {
            await vocabularyService.create({
              artifact_id: created.id,
              word_vi: v.word_vi,
              word_en: v.word_en,
              pronunciation: v.pronunciation || null,
              definition_vi: v.definition_vi || null,
              definition_en: v.definition_en || null,
              example_vi: v.example_vi || null,
              example_en: v.example_en || null,
              display_order: v.display_order || 0
            });
          }
          navigate(`/admin/artifacts/${created.id}/edit`, { replace: true });
        }
        setFeedback({
          type: 'success',
          message: `Đã tạo mới hiện vật "${formData.name_vi}" thành công!`
        });
      }
    } catch (err: any) {
      console.error('[AdminArtifactEditorPage] Save error:', err);
      setFeedback({ type: 'error', message: err.message || 'Lỗi khi lưu hiện vật vào cơ sở dữ liệu.' });
    } finally {
      setIsSaving(false);
    }
  };

  const resolvedThumbnailUrl = storageService.resolveAssetUrl(formData.thumbnail_path, 'artifact-images');
  const resolvedModelUrl = storageService.resolveAssetUrl(formData.model_3d_path, 'artifact-models');

  if (isLoading) {
    return (
      <div className="py-24 text-center text-emerald-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
        <span>Đang nạp hồ sơ hiện vật từ Supabase...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/artifacts"
            className="p-2 rounded-xl bg-[#121c17] hover:bg-[#1a2b22] border border-emerald-800/40 text-emerald-300 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
              <Box className="w-5 h-5 text-amber-400" />
              <span>{isEditing ? `Biên Tập: ${formData.name_vi || 'Hiện Vật'}` : 'Thêm Hiện Vật Mới'}</span>
            </h1>
            <p className="text-xs text-emerald-300/60 font-mono mt-0.5">
              {isEditing ? `ID: ${id} • slug: ${formData.slug}` : 'Tạo mới hồ sơ hiện vật số hóa'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && formData.slug && (
            <Link
              to={`/artifacts/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121c17] border border-emerald-800/40 hover:border-amber-500/40 text-emerald-200 text-xs font-mono transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Xem Thử Du Khách</span>
              <ExternalLink className="w-3 h-3 text-emerald-500" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleSaveArtifact}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-emerald-950 font-semibold text-xs tracking-wide shadow-lg shadow-amber-600/20 active:scale-95 transition-all font-mono disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                <span>Đang Lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
              : 'bg-red-950/80 border-red-700 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-emerald-900/40 overflow-x-auto pb-1 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'basic'
              ? 'bg-[#121c17] text-amber-300 border-t-2 border-amber-500 font-semibold'
              : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-[#121c17]/50'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>1. Thông Tin Cơ Bản</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cultural')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'cultural'
              ? 'bg-[#121c17] text-amber-300 border-t-2 border-amber-500 font-semibold'
              : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-[#121c17]/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2. Lịch Sử & Văn Hóa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('images')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'images'
              ? 'bg-[#121c17] text-amber-300 border-t-2 border-amber-500 font-semibold'
              : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-[#121c17]/50'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>3. Hình Ảnh & Bộ Sưu Tập ({galleryImages.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('model')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'model'
              ? 'bg-[#121c17] text-amber-300 border-t-2 border-amber-500 font-semibold'
              : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-[#121c17]/50'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span>4. Mô Hình 3D GLB</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vocab')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'vocab'
              ? 'bg-[#121c17] text-amber-300 border-t-2 border-amber-500 font-semibold'
              : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-[#121c17]/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>5. Từ Vựng Song Ngữ CLIL ({vocabularyList.length})</span>
        </button>
      </div>

      {/* TAB 1: BASIC INFORMATION */}
      {activeTab === 'basic' && (
        <div className="bg-[#121c17] border border-emerald-900/40 rounded-2xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vietnamese Name */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Tên Hiện Vật (Tiếng Việt) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name_vi}
                onChange={handleNameViChange}
                required
                placeholder="Ví dụ: Nhà Gươl Truyền Thống"
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-sm focus:outline-none"
              />
            </div>

            {/* English Name */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Tên Hiện Vật (Tiếng Anh)
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="Ví dụ: Traditional Gươl Communal House"
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-sm focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Định Danh URL (Slug) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                required
                placeholder="guol-communal-house"
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-amber-300 font-mono text-sm focus:outline-none"
              />
              <p className="text-[11px] text-emerald-500/60 font-mono mt-1">
                Đường dẫn du khách: /artifacts/{formData.slug || 'slug'}
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Danh Mục Văn Hóa <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-emerald-100 text-sm focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_vi} ({cat.name_en})
                  </option>
                ))}
              </select>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Thứ Tự Hiển Thị
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-sm focus:outline-none font-mono"
              />
            </div>

            {/* Publication Status Toggle */}
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Trạng Thái Xuất Bản
              </label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded border-emerald-800 text-amber-500 focus:ring-amber-500 bg-[#0a120e]"
                  />
                  <span className="text-xs text-emerald-200">
                    {formData.is_published ? 'Công khai cho du khách' : 'Lưu ở trạng thái Bản nháp'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Short Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-emerald-900/30">
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Mô Tả Ngắn (Tiếng Việt)
              </label>
              <textarea
                rows={3}
                value={formData.short_description_vi}
                onChange={(e) => setFormData({ ...formData, short_description_vi: e.target.value })}
                placeholder="Tóm tắt ngắn gọn hiện vật cho thẻ hiển thị..."
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Mô Tả Ngắn (Tiếng Anh)
              </label>
              <textarea
                rows={3}
                value={formData.short_description_en}
                onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })}
                placeholder="Brief summary in English for cards..."
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CULTURAL INFORMATION */}
      {activeTab === 'cultural' && (
        <div className="bg-[#121c17] border border-emerald-900/40 rounded-2xl p-6 space-y-6">
          {/* Full Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Mô Tả Chi Tiết (Tiếng Việt)
              </label>
              <textarea
                rows={6}
                value={formData.description_vi}
                onChange={(e) => setFormData({ ...formData, description_vi: e.target.value })}
                placeholder="Nội dung chuyên khảo đầy đủ bằng tiếng Việt..."
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Mô Tả Chi Tiết (Tiếng Anh)
              </label>
              <textarea
                rows={6}
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                placeholder="Comprehensive ethnographic description in English..."
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Origin & Historical Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-emerald-900/30">
            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Xuất Xứ & Địa Bàn (Tiếng Việt)
              </label>
              <input
                type="text"
                value={formData.origin_vi}
                onChange={(e) => setFormData({ ...formData, origin_vi: e.target.value })}
                placeholder="Ví dụ: Làng truyền thống Bhơ Hôồng, Tây Giang, Quảng Nam"
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Xuất Xứ & Địa Bàn (Tiếng Anh)
              </label>
              <input
                type="text"
                value={formData.origin_en}
                onChange={(e) => setFormData({ ...formData, origin_en: e.target.value })}
                placeholder="e.g. Traditional Bhơ Hôồng village, Tây Giang, Quảng Nam"
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Ý Nghĩa Văn Hóa & Tâm Linh (Tiếng Việt)
              </label>
              <textarea
                rows={4}
                value={formData.cultural_meaning_vi}
                onChange={(e) => setFormData({ ...formData, cultural_meaning_vi: e.target.value })}
                placeholder="Ý nghĩa biểu tượng, vai trò trong lễ hội..."
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Ý Nghĩa Văn Hóa & Tâm Linh (Tiếng Anh)
              </label>
              <textarea
                rows={4}
                value={formData.cultural_meaning_en}
                onChange={(e) => setFormData({ ...formData, cultural_meaning_en: e.target.value })}
                placeholder="Cultural symbolism and ritual role in English..."
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Chất Liệu Chế Tác (Tiếng Việt)
              </label>
              <input
                type="text"
                value={formData.materials_vi}
                onChange={(e) => setFormData({ ...formData, materials_vi: e.target.value })}
                placeholder="Ví dụ: Gỗ lim, mây rừng, vỏ cây đập dập"
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                Kích Thước Hiện Vật
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="Ví dụ: Cao 11.5m, Dài 14m, Rộng 8m"
                className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 focus:border-amber-500 rounded-xl text-white text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IMAGE MANAGEMENT */}
      {activeTab === 'images' && (
        <div className="bg-[#121c17] border border-emerald-900/40 rounded-2xl p-6 space-y-8">
          {/* Main Thumbnail Upload */}
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-100 mb-2">
              Ảnh Đại Diện Hiện Vật (Thumbnail)
            </h3>
            <p className="text-xs text-emerald-300/60 mb-4">
              Ảnh sẽ được lưu tự động lên Supabase Storage bucket <code>artifact-images</code>.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-2xl bg-[#0a120e] border border-emerald-800/50 overflow-hidden flex items-center justify-center shrink-0">
                {resolvedThumbnailUrl ? (
                  <img
                    src={resolvedThumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-emerald-700" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={formData.thumbnail_path}
                  onChange={(e) => setFormData({ ...formData, thumbnail_path: e.target.value })}
                  placeholder="Đường dẫn hoặc storage path (/images/...) "
                  className="w-full px-4 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-xs text-emerald-200 font-mono"
                />

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17251e] hover:bg-[#20352a] border border-emerald-700/50 text-emerald-200 text-xs font-mono transition-all">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{uploadingImage ? 'Đang Tải Lên...' : 'Tải Ảnh Mới Lên Storage'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {formData.thumbnail_path && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnail_path: '' })}
                      className="text-xs text-red-400 hover:text-red-300 font-mono"
                    >
                      Gỡ ảnh
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="pt-6 border-t border-emerald-900/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-serif font-bold text-amber-100">
                  Bộ Sưu Tập Ảnh Chi Tiết
                </h3>
                <p className="text-xs text-emerald-300/60 mt-0.5">
                  Thêm nhiều góc chụp, chi tiết hoa văn điêu khắc (lưu vào bảng <code>artifact_images</code>).
                </p>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/50 border border-emerald-600/50 text-emerald-200 text-xs font-mono transition-all">
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Thêm Ảnh Bộ Sưu Tập</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            {galleryImages.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#0a120e] border border-emerald-900/30 text-center text-xs text-emerald-400/60 font-mono">
                Chưa có ảnh nào trong bộ sưu tập chi tiết.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {galleryImages.map((img, idx) => {
                  const url = storageService.resolveAssetUrl(img.storage_path, 'artifact-images');
                  return (
                    <div
                      key={idx}
                      className="relative rounded-xl bg-[#0a120e] border border-emerald-800/40 overflow-hidden group aspect-square flex items-center justify-center"
                    >
                      <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryImage(img)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-red-400 hover:text-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: 3D MODEL MANAGEMENT */}
      {activeTab === 'model' && (
        <div className="bg-[#121c17] border border-emerald-900/40 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Upload & Model Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-serif font-bold text-amber-100">
                  Mô Hình 3D Định Dạng GLB (WebAR Ready)
                </h3>
                <p className="text-xs text-emerald-300/60 mt-1">
                  File GLB tối ưu photogrammetry được lưu trữ an toàn trên Supabase Storage bucket{' '}
                  <code>artifact-models</code> (giới hạn tối đa 100 MB).
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                  Đường Dẫn Mô Hình (Storage Path)
                </label>
                <input
                  type="text"
                  value={formData.model_3d_path}
                  onChange={(e) => setFormData({ ...formData, model_3d_path: e.target.value })}
                  placeholder="/models/guol.glb hoặc guol-communal-house/model.glb"
                  className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-amber-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-2">
                  Trạng Thái Mô Hình
                </label>
                <select
                  value={formData.model_status}
                  onChange={(e) => setFormData({ ...formData, model_status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-emerald-200 text-xs font-mono"
                >
                  <option value="available">Mô hình sẵn sàng tương tác (Available)</option>
                  <option value="coming_soon">Đang trong tiến trình tái tạo 3D (Coming Soon)</option>
                  <option value="missing">Chưa có mô hình (Missing)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#17251e] to-[#22392c] hover:bg-[#284234] border border-amber-600/40 text-amber-300 text-xs font-mono font-semibold transition-all shadow-md">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>{uploadingModel ? 'Đang Upload Lên Supabase Storage...' : 'Tải File GLB Mới Lên'}</span>
                  <input
                    type="file"
                    accept=".glb"
                    onChange={handleModelUpload}
                    disabled={uploadingModel}
                    className="hidden"
                  />
                </label>

                {formData.model_3d_path && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, model_3d_path: '', model_status: 'coming_soon' })}
                    className="text-xs text-red-400 hover:text-red-300 font-mono px-3 py-2"
                  >
                    Gỡ mô hình
                  </button>
                )}
              </div>

              {modelFileSize && (
                <div className="text-[11px] font-mono text-emerald-400/70">
                  Dung lượng vừa tải: {modelFileSize}
                </div>
              )}
            </div>

            {/* Live 3D Model Interactive Preview */}
            <div className="w-full lg:w-96 rounded-2xl bg-[#0a120e] border border-emerald-800/50 p-4 flex flex-col items-center justify-center min-h-[300px]">
              {resolvedModelUrl ? (
                <div className="w-full h-72 relative">
                  {/* @ts-ignore */}
                  <model-viewer
                    src={resolvedModelUrl}
                    alt={formData.name_vi}
                    auto-rotate
                    camera-controls
                    ar
                    shadow-intensity="1"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-emerald-400/60 bg-black/60 px-2 py-0.5 rounded">
                    Xoay 360° kiểm tra
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-emerald-500/50 font-mono space-y-2">
                  <Rotate3d className="w-10 h-10 mx-auto text-emerald-800" />
                  <p>Chưa có file GLB để hiển thị 3D.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EDUCATIONAL VOCABULARY */}
      {activeTab === 'vocab' && (
        <div className="bg-[#121c17] border border-emerald-900/40 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-bold text-amber-100">
                Bộ Thuật Ngữ Học Liệu Song Ngữ CLIL
              </h3>
              <p className="text-xs text-emerald-300/60 mt-0.5">
                Các thuật ngữ giúp học sinh, sinh viên và du khách quốc tế học từ vựng văn hóa bản địa.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setVocabForm({
                  id: '',
                  word_vi: '',
                  word_en: '',
                  pronunciation: '',
                  definition_vi: '',
                  definition_en: '',
                  example_vi: '',
                  example_en: '',
                  display_order: vocabularyList.length + 1
                });
                setShowVocabModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/50 border border-emerald-600/50 text-emerald-200 text-xs font-mono transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Thêm Thuật Ngữ Mới</span>
            </button>
          </div>

          {vocabularyList.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#0a120e] border border-emerald-900/30 text-center text-xs text-emerald-400/60 font-mono">
              Chưa có thuật ngữ từ vựng nào gắn với hiện vật này.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vocabularyList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#14231b] border border-emerald-900/50 hover:border-emerald-700/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-amber-300">
                        {item.word_vi}{' '}
                        <span className="font-normal text-emerald-300/80">({item.word_en})</span>
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setVocabForm(item);
                            setShowVocabModal(true);
                          }}
                          className="text-xs text-amber-400 hover:text-amber-200 font-mono"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVocab(item)}
                          className="text-xs text-red-400 hover:text-red-200 font-mono"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    {item.pronunciation && (
                      <div className="text-xs font-mono text-emerald-400/60 mt-0.5">
                        Phiên âm: /{item.pronunciation}/
                      </div>
                    )}

                    {item.definition_vi && (
                      <p className="text-xs text-emerald-200/80 mt-2">
                        {item.definition_vi}
                      </p>
                    )}
                  </div>

                  {item.example_vi && (
                    <div className="mt-3 pt-2 border-t border-emerald-900/30 text-[11px] italic text-emerald-400/70">
                      Ví dụ: "{item.example_vi}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vocabulary Modal Form */}
      {showVocabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121c17] border border-emerald-800/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-4">
              <h3 className="text-sm font-serif font-bold text-amber-100">
                {vocabForm.id ? 'Chỉnh Sửa Thuật Ngữ' : 'Thêm Thuật Ngữ Song Ngữ Mới'}
              </h3>
              <button
                type="button"
                onClick={() => setShowVocabModal(false)}
                className="text-emerald-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVocab} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400/80 mb-1">Từ Tiếng Việt *</label>
                  <input
                    type="text"
                    value={vocabForm.word_vi}
                    onChange={(e) => setVocabForm({ ...vocabForm, word_vi: e.target.value })}
                    required
                    placeholder="Nhà Gươl"
                    className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-emerald-400/80 mb-1">Từ Tiếng Anh *</label>
                  <input
                    type="text"
                    value={vocabForm.word_en}
                    onChange={(e) => setVocabForm({ ...vocabForm, word_en: e.target.value })}
                    required
                    placeholder="Gươl communal house"
                    className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-400/80 mb-1">Phiên âm IPA quốc tế</label>
                <input
                  type="text"
                  value={vocabForm.pronunciation || ''}
                  onChange={(e) => setVocabForm({ ...vocabForm, pronunciation: e.target.value })}
                  placeholder="/ɡwəl kəˈmjuːnl haʊs/"
                  className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-amber-300"
                />
              </div>

              <div>
                <label className="block text-emerald-400/80 mb-1">Định nghĩa Tiếng Việt</label>
                <textarea
                  rows={2}
                  value={vocabForm.definition_vi || ''}
                  onChange={(e) => setVocabForm({ ...vocabForm, definition_vi: e.target.value })}
                  placeholder="Ngôi nhà chung linh thiêng của cộng đồng buôn làng Cơ Tu..."
                  className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-emerald-400/80 mb-1">Định nghĩa Tiếng Anh</label>
                <textarea
                  rows={2}
                  value={vocabForm.definition_en || ''}
                  onChange={(e) => setVocabForm({ ...vocabForm, definition_en: e.target.value })}
                  placeholder="Sacred communal gathering house in highland Cơ Tu villages..."
                  className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-emerald-400/80 mb-1">Câu ví dụ Tiếng Việt & Anh</label>
                <input
                  type="text"
                  value={vocabForm.example_vi || ''}
                  onChange={(e) => setVocabForm({ ...vocabForm, example_vi: e.target.value })}
                  placeholder="Ví dụ tiếng Việt..."
                  className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white mb-2"
                />
                <input
                  type="text"
                  value={vocabForm.example_en || ''}
                  onChange={(e) => setVocabForm({ ...vocabForm, example_en: e.target.value })}
                  placeholder="Example in English..."
                  className="w-full px-3 py-2 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-emerald-900/40">
                <button
                  type="button"
                  onClick={() => setShowVocabModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#17251e] text-emerald-300 hover:bg-[#20342a]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold"
                >
                  Lưu Thuật Ngữ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
