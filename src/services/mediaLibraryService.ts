import { getSupabase } from '../lib/supabase';
import { storageService, StorageBucket } from './storageService';

export interface MediaFileItem {
  name: string;
  id?: string | null;
  bucket: StorageBucket;
  storagePath: string;
  publicUrl: string;
  sizeBytes?: number;
  mimeType?: string | null;
  createdAt?: string | null;
  isReferenced: boolean;
  referencedBy?: string;
}

export const mediaLibraryService = {
  async getAllMediaFiles(): Promise<MediaFileItem[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    // 1. Fetch referenced paths from database
    const [
      { data: artifacts },
      { data: galleryImages },
      { data: websiteContents }
    ] = await Promise.all([
      supabase.from('artifacts').select('name_vi, thumbnail_path, model_3d_path'),
      supabase.from('artifact_images').select('storage_path, artifact_id, artifacts(name_vi)'),
      supabase.from('website_contents').select('content_key, image_path')
    ]);

    const refMap = new Map<string, string>();

    (artifacts || []).forEach((a: any) => {
      if (a.thumbnail_path) refMap.set(a.thumbnail_path, `Ảnh đại diện: ${a.name_vi}`);
      if (a.model_3d_path) refMap.set(a.model_3d_path, `Mô hình 3D: ${a.name_vi}`);
    });

    (galleryImages || []).forEach((img: any) => {
      if (img.storage_path) {
        refMap.set(img.storage_path, `Bộ sưu tập: ${img.artifacts?.name_vi || 'Hiện vật'}`);
      }
    });

    (websiteContents || []).forEach((c: any) => {
      if (c.image_path) refMap.set(c.image_path, `Nội dung: ${c.content_key}`);
    });

    // 2. Scan Storage buckets
    const results: MediaFileItem[] = [];
    const buckets: StorageBucket[] = ['artifact-images', 'artifact-models', 'website-assets'];

    for (const b of buckets) {
      try {
        const { data: topList, error } = await supabase.storage.from(b).list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

        if (error || !topList) continue;

        for (const item of topList) {
          // If it's a folder (like guol-communal-house/), list its inner files
          if (!item.id && item.name) {
            const { data: innerList } = await supabase.storage.from(b).list(item.name, { limit: 50 });
            if (innerList) {
              innerList.forEach((inner) => {
                const fullPath = `${item.name}/${inner.name}`;
                const publicUrl = storageService.getPublicUrl(b, fullPath);
                const isRef = refMap.has(fullPath) || refMap.has(`/${fullPath}`);
                results.push({
                  name: inner.name,
                  id: inner.id,
                  bucket: b,
                  storagePath: fullPath,
                  publicUrl,
                  sizeBytes: inner.metadata?.size || inner.metadata?.contentLength,
                  mimeType: inner.metadata?.mimetype,
                  createdAt: inner.created_at,
                  isReferenced: isRef,
                  referencedBy: refMap.get(fullPath) || refMap.get(`/${fullPath}`)
                });
              });
            }
          } else {
            const fullPath = item.name;
            const publicUrl = storageService.getPublicUrl(b, fullPath);
            const isRef = refMap.has(fullPath) || refMap.has(`/${fullPath}`);
            results.push({
              name: item.name,
              id: item.id,
              bucket: b,
              storagePath: fullPath,
              publicUrl,
              sizeBytes: item.metadata?.size || item.metadata?.contentLength,
              mimeType: item.metadata?.mimetype,
              createdAt: item.created_at,
              isReferenced: isRef,
              referencedBy: refMap.get(fullPath) || refMap.get(`/${fullPath}`)
            });
          }
        }
      } catch (err) {
        console.warn(`[mediaLibraryService] Error scanning bucket ${b}:`, err);
      }
    }

    return results;
  },

  async deleteMediaFile(bucket: StorageBucket, path: string): Promise<boolean> {
    const { error } = await storageService.deleteFile(bucket, path);
    if (error) throw error;
    return true;
  }
};
