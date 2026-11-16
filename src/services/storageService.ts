import { getSupabase } from '../lib/supabase';

export type StorageBucket = 'artifact-images' | 'artifact-models' | 'website-assets';

export const storageService = {
  getPublicUrl(bucket: StorageBucket, path: string): string {
    const supabase = getSupabase();
    if (!supabase || !path) {
      return path || '';
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || path;
  },

  resolveAssetUrl(
    pathOrUrl?: string | null,
    defaultBucket: StorageBucket = 'artifact-images'
  ): string {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
    if (pathOrUrl.startsWith('/')) {
      return pathOrUrl;
    }
    return this.getPublicUrl(defaultBucket, pathOrUrl);
  },

  async uploadFile(
    bucket: StorageBucket,
    path: string,
    file: File | Blob,
    options?: { contentType?: string; upsert?: boolean }
  ): Promise<{ data: { path: string } | null; error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { data: null, error: new Error('Supabase client is not configured.') };
    }

    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: options?.contentType,
      upsert: options?.upsert ?? true
    });

    if (error) {
      console.error(`[storageService] Error uploading to ${bucket}/${path}:`, error);
      return { data: null, error };
    }

    return { data, error: null };
  },

  async deleteFile(
    bucket: StorageBucket,
    path: string
  ): Promise<{ error: Error | null }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error('Supabase client is not configured.') };
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.error(`[storageService] Error deleting from ${bucket}/${path}:`, error);
      return { error };
    }

    return { error: null };
  }
};
