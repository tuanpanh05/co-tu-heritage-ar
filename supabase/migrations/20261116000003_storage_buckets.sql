-- =============================================================================
-- CO-TU HERITAGE AR: STORAGE BUCKETS & STORAGE SECURITY POLICIES
-- Migration: 20261116000003_storage_buckets.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CREATE STORAGE BUCKETS
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'artifact-images',
    'artifact-images',
    true,
    15728640, -- 15 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'artifact-models',
    'artifact-models',
    true,
    104857600, -- 100 MB
    ARRAY['model/gltf-binary', 'application/octet-stream', 'model/gltf+json']
  ),
  (
    'website-assets',
    'website-assets',
    true,
    15728640, -- 15 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- -----------------------------------------------------------------------------
-- 2. STORAGE ROW LEVEL SECURITY (storage.objects)
-- Note: RLS is already enabled by default on storage.objects in Supabase.
-- -----------------------------------------------------------------------------

-- 2.1 Public Read Access
DROP POLICY IF EXISTS "Public can view artifact images" ON storage.objects;
CREATE POLICY "Public can view artifact images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'artifact-images');

DROP POLICY IF EXISTS "Public can view artifact models" ON storage.objects;
CREATE POLICY "Public can view artifact models"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'artifact-models');

DROP POLICY IF EXISTS "Public can view website assets" ON storage.objects;
CREATE POLICY "Public can view website assets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'website-assets');

-- 2.2 Admin Upload / Modification / Deletion Access
DROP POLICY IF EXISTS "Admins can upload artifact images" ON storage.objects;
CREATE POLICY "Admins can upload artifact images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artifact-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update artifact images" ON storage.objects;
CREATE POLICY "Admins can update artifact images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'artifact-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete artifact images" ON storage.objects;
CREATE POLICY "Admins can delete artifact images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'artifact-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can upload artifact models" ON storage.objects;
CREATE POLICY "Admins can upload artifact models"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'artifact-models' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update artifact models" ON storage.objects;
CREATE POLICY "Admins can update artifact models"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'artifact-models' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete artifact models" ON storage.objects;
CREATE POLICY "Admins can delete artifact models"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'artifact-models' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can upload website assets" ON storage.objects;
CREATE POLICY "Admins can upload website assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update website assets" ON storage.objects;
CREATE POLICY "Admins can update website assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete website assets" ON storage.objects;
CREATE POLICY "Admins can delete website assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'website-assets' AND public.is_admin());
