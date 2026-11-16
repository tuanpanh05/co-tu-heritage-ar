-- =============================================================================
-- CO-TU HERITAGE AR: POSTGRESQL DATABASE SCHEMA
-- Migration: 20261116000001_create_schema.sql
-- =============================================================================

-- Enable pgcrypto / uuid-ossp for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Automated updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 1. TABLE: artifact_categories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artifact_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_vi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_vi TEXT,
  description_en TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artifact_categories_slug ON public.artifact_categories(slug);
CREATE INDEX IF NOT EXISTS idx_artifact_categories_display_order ON public.artifact_categories(display_order);

DROP TRIGGER IF EXISTS trg_artifact_categories_updated_at ON public.artifact_categories;
CREATE TRIGGER trg_artifact_categories_updated_at
BEFORE UPDATE ON public.artifact_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 2. TABLE: artifacts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.artifact_categories(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name_vi TEXT NOT NULL,
  name_en TEXT,
  short_description_vi TEXT,
  short_description_en TEXT,
  description_vi TEXT,
  description_en TEXT,
  origin_vi TEXT,
  origin_en TEXT,
  historical_story_vi TEXT,
  historical_story_en TEXT,
  cultural_meaning_vi TEXT,
  cultural_meaning_en TEXT,
  materials_vi TEXT,
  materials_en TEXT,
  dimensions TEXT,
  thumbnail_path TEXT,
  model_3d_path TEXT,
  model_status TEXT NOT NULL DEFAULT 'available' CHECK (model_status IN ('available', 'coming_soon', 'missing')),
  content_status TEXT NOT NULL DEFAULT 'verified' CHECK (content_status IN ('verified', 'pending_verification', 'illustrative')),
  verification_note TEXT,
  sources TEXT[] DEFAULT '{}',
  audio_vi_path TEXT,
  audio_en_path TEXT,
  qr_code TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artifacts_slug ON public.artifacts(slug);
CREATE INDEX IF NOT EXISTS idx_artifacts_category_id ON public.artifacts(category_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_is_published ON public.artifacts(is_published);
CREATE INDEX IF NOT EXISTS idx_artifacts_display_order ON public.artifacts(display_order);

DROP TRIGGER IF EXISTS trg_artifacts_updated_at ON public.artifacts;
CREATE TRIGGER trg_artifacts_updated_at
BEFORE UPDATE ON public.artifacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 3. TABLE: artifact_images
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artifact_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID NOT NULL REFERENCES public.artifacts(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text_vi TEXT,
  alt_text_en TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artifact_images_artifact_id ON public.artifact_images(artifact_id);
CREATE INDEX IF NOT EXISTS idx_artifact_images_display_order ON public.artifact_images(display_order);

-- -----------------------------------------------------------------------------
-- 4. TABLE: artifact_vocabulary
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artifact_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE CASCADE,
  word_vi TEXT NOT NULL,
  word_en TEXT NOT NULL,
  pronunciation TEXT,
  definition_vi TEXT,
  definition_en TEXT,
  example_vi TEXT,
  example_en TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artifact_vocabulary_artifact_id ON public.artifact_vocabulary(artifact_id);
CREATE INDEX IF NOT EXISTS idx_artifact_vocabulary_display_order ON public.artifact_vocabulary(display_order);

DROP TRIGGER IF EXISTS trg_artifact_vocabulary_updated_at ON public.artifact_vocabulary;
CREATE TRIGGER trg_artifact_vocabulary_updated_at
BEFORE UPDATE ON public.artifact_vocabulary
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 5. TABLE: artifact_reviews
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artifact_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID REFERENCES public.artifacts(id) ON DELETE SET NULL,
  reviewer_name TEXT,
  reviewer_role_vi TEXT,
  reviewer_role_en TEXT,
  avatar_bg TEXT,
  avatar_initials TEXT,
  badge_vi TEXT,
  badge_en TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  likes INTEGER NOT NULL DEFAULT 0,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artifact_reviews_artifact_id ON public.artifact_reviews(artifact_id);
CREATE INDEX IF NOT EXISTS idx_artifact_reviews_status ON public.artifact_reviews(status);
CREATE INDEX IF NOT EXISTS idx_artifact_reviews_created_at ON public.artifact_reviews(created_at DESC);

DROP TRIGGER IF EXISTS trg_artifact_reviews_updated_at ON public.artifact_reviews;
CREATE TRIGGER trg_artifact_reviews_updated_at
BEFORE UPDATE ON public.artifact_reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 6. TABLE: website_contents
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key TEXT UNIQUE NOT NULL,
  title_vi TEXT,
  title_en TEXT,
  content_vi TEXT,
  content_en TEXT,
  image_path TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_website_contents_key ON public.website_contents(content_key);

DROP TRIGGER IF EXISTS trg_website_contents_updated_at ON public.website_contents;
CREATE TRIGGER trg_website_contents_updated_at
BEFORE UPDATE ON public.website_contents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 7. TABLE: admin_profiles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);
