-- =============================================================================
-- CO-TU HERITAGE AR: ROW LEVEL SECURITY & AUTHORIZATION POLICIES
-- Migration: 20261116000002_security_rls_policies.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SECURE AUTHORIZATION HELPER FUNCTION (Non-recursive)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

-- -----------------------------------------------------------------------------
-- 2. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- -----------------------------------------------------------------------------
ALTER TABLE public.artifact_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifact_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifact_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifact_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 3. POLICIES: artifact_categories
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view artifact categories" ON public.artifact_categories;
CREATE POLICY "Public can view artifact categories"
ON public.artifact_categories
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins have full CRUD on artifact categories" ON public.artifact_categories;
CREATE POLICY "Admins have full CRUD on artifact categories"
ON public.artifact_categories
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. POLICIES: artifacts
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published artifacts" ON public.artifacts;
CREATE POLICY "Public can view published artifacts"
ON public.artifacts
FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full CRUD on artifacts" ON public.artifacts;
CREATE POLICY "Admins have full CRUD on artifacts"
ON public.artifacts
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. POLICIES: artifact_images
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published artifact images" ON public.artifact_images;
CREATE POLICY "Public can view published artifact images"
ON public.artifact_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.artifacts
    WHERE artifacts.id = artifact_images.artifact_id
      AND (artifacts.is_published = true OR public.is_admin())
  )
);

DROP POLICY IF EXISTS "Admins have full CRUD on artifact images" ON public.artifact_images;
CREATE POLICY "Admins have full CRUD on artifact images"
ON public.artifact_images
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. POLICIES: artifact_vocabulary
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published artifact vocabulary" ON public.artifact_vocabulary;
CREATE POLICY "Public can view published artifact vocabulary"
ON public.artifact_vocabulary
FOR SELECT
TO anon, authenticated
USING (
  artifact_id IS NULL OR
  EXISTS (
    SELECT 1 FROM public.artifacts
    WHERE artifacts.id = artifact_vocabulary.artifact_id
      AND (artifacts.is_published = true OR public.is_admin())
  )
);

DROP POLICY IF EXISTS "Admins have full CRUD on artifact vocabulary" ON public.artifact_vocabulary;
CREATE POLICY "Admins have full CRUD on artifact vocabulary"
ON public.artifact_vocabulary
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. POLICIES: artifact_reviews
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.artifact_reviews;
CREATE POLICY "Public can view approved reviews"
ON public.artifact_reviews
FOR SELECT
TO anon, authenticated
USING (status = 'approved' OR public.is_admin());

DROP POLICY IF EXISTS "Public can submit pending reviews only" ON public.artifact_reviews;
CREATE POLICY "Public can submit pending reviews only"
ON public.artifact_reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending' AND rating >= 1 AND rating <= 5
);

-- Hardened Trigger: Force pending status for non-admin inserts
CREATE OR REPLACE FUNCTION public.enforce_review_pending_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.status := 'pending';
    NEW.is_verified := FALSE;
    NEW.likes := 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_review_pending_status ON public.artifact_reviews;
CREATE TRIGGER trg_enforce_review_pending_status
BEFORE INSERT ON public.artifact_reviews
FOR EACH ROW
EXECUTE FUNCTION public.enforce_review_pending_status();

DROP POLICY IF EXISTS "Admins can update reviews" ON public.artifact_reviews;
CREATE POLICY "Admins can update reviews"
ON public.artifact_reviews
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete reviews" ON public.artifact_reviews;
CREATE POLICY "Admins can delete reviews"
ON public.artifact_reviews
FOR DELETE
TO authenticated
USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 8. POLICIES: website_contents
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view website content" ON public.website_contents;
CREATE POLICY "Public can view website content"
ON public.website_contents
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins have full CRUD on website content" ON public.website_contents;
CREATE POLICY "Admins have full CRUD on website content"
ON public.website_contents
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 9. POLICIES: admin_profiles
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view admin profiles" ON public.admin_profiles;
CREATE POLICY "Admins can view admin profiles"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Only existing admins can modify admin profiles" ON public.admin_profiles;
CREATE POLICY "Only existing admins can modify admin profiles"
ON public.admin_profiles
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
