import React, { useState, useEffect } from 'react';
import { contentService, WebsiteContentRecord } from '../../services/contentService';
import { storageService } from '../../services/storageService';
import {
  FileText,
  Save,
  RefreshCw,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Compass,
  Info,
  Phone,
  Globe
} from 'lucide-react';

export const AdminWebsiteContentPage: React.FC = () => {
  const [contents, setContents] = useState<Record<string, WebsiteContentRecord>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'culture' | 'contact'>('home');

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadContents = async () => {
    try {
      setIsLoading(true);
      const data = await contentService.getAll();
      setContents(data);
    } catch (err: any) {
      console.error('[AdminWebsiteContentPage] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, []);

  const handleFieldChange = (
    key: string,
    field: 'title_vi' | 'title_en' | 'content_vi' | 'content_en' | 'image_path',
    val: string
  ) => {
    setContents((prev) => {
      const existing = prev[key] || {
        id: `content-${key}`,
        content_key: key,
        title_vi: '',
        title_en: '',
        content_vi: '',
        content_en: '',
        image_path: null
      };
      return {
        ...prev,
        [key]: {
          ...existing,
          [field]: val
        }
      };
    });
  };

  const handleSaveSection = async (key: string) => {
    const item = contents[key];
    if (!item) return;

    try {
      setIsSaving(true);
      await contentService.updateByKey(key, {
        title_vi: item.title_vi || null,
        title_en: item.title_en || null,
        content_vi: item.content_vi || null,
        content_en: item.content_en || null,
        image_path: item.image_path || null
      });
      showToast(`Đã lưu nội dung "${key}" lên cơ sở dữ liệu Supabase!`);
    } catch (err: any) {
      alert(`Lỗi lưu nội dung: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    try {
      setUploadingKey(key);
      const ext = file.name.split('.').pop() || 'jpg';
      const storagePath = `contents/${key}-${Date.now()}.${ext}`;

      const { data, error } = await storageService.uploadFile('website-assets', storagePath, file);
      if (error || !data) throw error || new Error('Upload ảnh thất bại');

      handleFieldChange(key, 'image_path', storagePath);
      showToast(`Đã tải ảnh lên Supabase Storage bucket website-assets!`);
    } catch (err: any) {
      alert(`Lỗi upload ảnh: ${err.message}`);
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
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
            <FileText className="w-6 h-6 text-amber-400" />
            Biên Tập Nội Dung Website
          </h1>
          <p className="text-xs text-emerald-300/70 mt-1">
            Chỉnh sửa tiêu đề, lời giới thiệu, hình ảnh banner và thông tin dự án không cần can thiệp mã nguồn.
          </p>
        </div>

        <button
          type="button"
          onClick={loadContents}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121c17] border border-emerald-800/40 text-emerald-200 text-xs font-mono transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Tải Lại Nội Dung</span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex items-center gap-2 border-b border-emerald-900/40 overflow-x-auto pb-1 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveSection('home')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'home'
              ? 'bg-[#121c17] text-amber-300 border-t-2 border-amber-500 font-semibold'
              : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-[#121c17]/50'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Trang Chủ & Hero Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('about')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'about'
              ? 'bg-[#121c17] text-amber-300 border-t-2 border-amber-500 font-semibold'
              : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-[#121c17]/50'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Giới Thiệu Dự Án & Sứ Mệnh</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('culture')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'culture'
              ? 'bg-[#121c17] text-amber-300 border-t-2 border-amber-500 font-semibold'
              : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-[#121c17]/50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Bản Đồ Bản Làng & Văn Hóa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('contact')}
          className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'contact'
              ? 'bg-[#121c17] text-amber-300 border-t-2 border-amber-500 font-semibold'
              : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-[#121c17]/50'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Thông Tin Liên Hệ & Chân Trang</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-emerald-400 font-mono text-xs flex flex-col items-center justify-center gap-3 bg-[#121c17] rounded-2xl border border-emerald-900/30">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
          <span>Đang nạp các bản ghi nội dung từ Supabase...</span>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* SECTION 1: HOMEPAGE */}
          {activeSection === 'home' && (
            <div className="space-y-6">
              
              {/* Home Hero */}
              <div className="p-6 rounded-2xl bg-[#121c17] border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      Khóa: home_hero
                    </span>
                    <h3 className="text-base font-serif font-bold text-amber-100">
                      Tiêu Đề Lớn & Thông Điệp Trang Chủ (Hero Banner)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('home_hero')}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold text-xs font-mono shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Mục Này</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tiêu đề Tiếng Việt
                    </label>
                    <input
                      type="text"
                      value={contents['home_hero']?.title_vi || ''}
                      onChange={(e) => handleFieldChange('home_hero', 'title_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tiêu đề Tiếng Anh
                    </label>
                    <input
                      type="text"
                      value={contents['home_hero']?.title_en || ''}
                      onChange={(e) => handleFieldChange('home_hero', 'title_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Đoạn văn giới thiệu (Tiếng Việt)
                    </label>
                    <textarea
                      rows={4}
                      value={contents['home_hero']?.content_vi || ''}
                      onChange={(e) => handleFieldChange('home_hero', 'content_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Đoạn văn giới thiệu (Tiếng Anh)
                    </label>
                    <textarea
                      rows={4}
                      value={contents['home_hero']?.content_en || ''}
                      onChange={(e) => handleFieldChange('home_hero', 'content_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                </div>

                {/* Banner Image */}
                <div className="pt-3 border-t border-emerald-900/30 flex items-center gap-4">
                  <div className="w-20 h-14 rounded-lg bg-[#0a120e] border border-emerald-800/50 overflow-hidden flex items-center justify-center shrink-0">
                    {contents['home_hero']?.image_path ? (
                      <img
                        src={storageService.resolveAssetUrl(contents['home_hero']?.image_path, 'website-assets')}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-emerald-700" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#17251e] hover:bg-[#20352a] border border-emerald-700/50 text-emerald-200 text-xs font-mono">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{uploadingKey === 'home_hero' ? 'Đang Upload...' : 'Thay Ảnh Nền Hero'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleImageUpload('home_hero', e.target.files[0]);
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-emerald-500/60 font-mono mt-1">
                      Đường dẫn: {contents['home_hero']?.image_path || 'Mặc định'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Collection Intro */}
              <div className="p-6 rounded-2xl bg-[#121c17] border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      Khóa: home_collection_intro
                    </span>
                    <h3 className="text-base font-serif font-bold text-amber-100">
                      Lời Dẫn Bộ Sưu Tập 3D Hiện Vật
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('home_collection_intro')}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold text-xs font-mono shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Mục Này</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tiêu đề Tiếng Việt
                    </label>
                    <input
                      type="text"
                      value={contents['home_collection_intro']?.title_vi || ''}
                      onChange={(e) => handleFieldChange('home_collection_intro', 'title_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tiêu đề Tiếng Anh
                    </label>
                    <input
                      type="text"
                      value={contents['home_collection_intro']?.title_en || ''}
                      onChange={(e) => handleFieldChange('home_collection_intro', 'title_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Nội dung Tiếng Việt
                    </label>
                    <textarea
                      rows={3}
                      value={contents['home_collection_intro']?.content_vi || ''}
                      onChange={(e) => handleFieldChange('home_collection_intro', 'content_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Nội dung Tiếng Anh
                    </label>
                    <textarea
                      rows={3}
                      value={contents['home_collection_intro']?.content_en || ''}
                      onChange={(e) => handleFieldChange('home_collection_intro', 'content_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Lexicon Intro */}
              <div className="p-6 rounded-2xl bg-[#121c17] border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      Khóa: home_lexicon_intro
                    </span>
                    <h3 className="text-base font-serif font-bold text-amber-100">
                      Lời Dẫn Khu Vực Học Liệu Song Ngữ CLIL
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('home_lexicon_intro')}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold text-xs font-mono shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Mục Này</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tiêu đề Tiếng Việt
                    </label>
                    <input
                      type="text"
                      value={contents['home_lexicon_intro']?.title_vi || ''}
                      onChange={(e) => handleFieldChange('home_lexicon_intro', 'title_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tiêu đề Tiếng Anh
                    </label>
                    <input
                      type="text"
                      value={contents['home_lexicon_intro']?.title_en || ''}
                      onChange={(e) => handleFieldChange('home_lexicon_intro', 'title_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Nội dung Tiếng Việt
                    </label>
                    <textarea
                      rows={3}
                      value={contents['home_lexicon_intro']?.content_vi || ''}
                      onChange={(e) => handleFieldChange('home_lexicon_intro', 'content_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Nội dung Tiếng Anh
                    </label>
                    <textarea
                      rows={3}
                      value={contents['home_lexicon_intro']?.content_en || ''}
                      onChange={(e) => handleFieldChange('home_lexicon_intro', 'content_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 2: ABOUT PROJECT */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#121c17] border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      Khóa: about_project
                    </span>
                    <h3 className="text-base font-serif font-bold text-amber-100">
                      Giới Thiệu Dự Án Số Hóa Di Sản Văn Hóa Cơ Tu Tây Giang
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('about_project')}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold text-xs font-mono shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Mục Này</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tên Dự Án (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={contents['about_project']?.title_vi || ''}
                      onChange={(e) => handleFieldChange('about_project', 'title_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tên Dự Án (Tiếng Anh)
                    </label>
                    <input
                      type="text"
                      value={contents['about_project']?.title_en || ''}
                      onChange={(e) => handleFieldChange('about_project', 'title_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Mục Tiêu & Tầm Nhìn Dự Án (Tiếng Việt)
                    </label>
                    <textarea
                      rows={5}
                      value={contents['about_project']?.content_vi || ''}
                      onChange={(e) => handleFieldChange('about_project', 'content_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Mục Tiêu & Tầm Nhìn Dự Án (Tiếng Anh)
                    </label>
                    <textarea
                      rows={5}
                      value={contents['about_project']?.content_en || ''}
                      onChange={(e) => handleFieldChange('about_project', 'content_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: CULTURAL CONTENT & MAP */}
          {activeSection === 'culture' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#121c17] border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      Khóa: village_map_intro
                    </span>
                    <h3 className="text-base font-serif font-bold text-amber-100">
                      Bản Đồ Không Gian Bản Làng Cơ Tu Đồng Tâm
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('village_map_intro')}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold text-xs font-mono shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Mục Này</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tiêu đề Bản đồ (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={contents['village_map_intro']?.title_vi || ''}
                      onChange={(e) => handleFieldChange('village_map_intro', 'title_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Tiêu đề Bản đồ (Tiếng Anh)
                    </label>
                    <input
                      type="text"
                      value={contents['village_map_intro']?.title_en || ''}
                      onChange={(e) => handleFieldChange('village_map_intro', 'title_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Mô tả Không gian Đồng tâm (Tiếng Việt)
                    </label>
                    <textarea
                      rows={4}
                      value={contents['village_map_intro']?.content_vi || ''}
                      onChange={(e) => handleFieldChange('village_map_intro', 'content_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Mô tả Không gian Đồng tâm (Tiếng Anh)
                    </label>
                    <textarea
                      rows={4}
                      value={contents['village_map_intro']?.content_en || ''}
                      onChange={(e) => handleFieldChange('village_map_intro', 'content_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: CONTACT INFORMATION */}
          {activeSection === 'contact' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#121c17] border border-emerald-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      Khóa: contact_info
                    </span>
                    <h3 className="text-base font-serif font-bold text-amber-100">
                      Thông Tin Liên Hệ & Chân Trang Web
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('contact_info')}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-emerald-950 font-bold text-xs font-mono shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Mục Này</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Email Liên Hệ Dự Án
                    </label>
                    <input
                      type="text"
                      value={contents['contact_info']?.title_vi || 'contact@cotuheritage.vn'}
                      onChange={(e) => handleFieldChange('contact_info', 'title_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Địa Bàn Nghiên Cứu
                    </label>
                    <input
                      type="text"
                      value={contents['contact_info']?.title_en || 'Huyện Tây Giang, Tỉnh Quảng Nam'}
                      onChange={(e) => handleFieldChange('contact_info', 'title_en', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase text-emerald-400/80 mb-1">
                      Ghi Chú Bản Quyền & Giấy Phép Nghiên Cứu
                    </label>
                    <textarea
                      rows={3}
                      value={contents['contact_info']?.content_vi || 'Dự án nghiên cứu bảo tồn và số hóa di sản văn hóa Cơ Tu phục vụ giáo dục cộng đồng và du lịch trải nghiệm số WebAR.'}
                      onChange={(e) => handleFieldChange('contact_info', 'content_vi', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0a120e] border border-emerald-800/40 rounded-xl text-white text-xs font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
