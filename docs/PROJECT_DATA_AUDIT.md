# PROJECT DATA AUDIT: CO-TU HERITAGE AR
**Document Version:** 1.0.0  
**Audit Date:** November 2026  
**Author:** Senior Full-Stack Developer & Database Architect  
**Platform Target:** Supabase PostgreSQL, Supabase Storage & Vercel WebAR  

---

## 1. Executive Summary

This comprehensive audit inspects the complete codebase of the **CO-TU HERITAGE AR** application to establish the baseline for migrating from hardcoded static datasets and client-side storage (`localStorage`) to a real, enterprise-grade, data-driven architecture powered by **Supabase PostgreSQL**, **Supabase Storage**, and **Supabase Auth**.

### Audit Scope
- **Pages & Routes:** 8 pages (`HomePage`, `ArtifactsPage`, `ArtifactDetailPage`, `LearningPage`, `NotebookPage`, `QRCodesPage`, `DashboardPage`, `NotFoundPage`).
- **Core Components:** 17 components spanning WebAR 3D viewer, anatomy inspectors, feedback systems, and layout.
- **Static Data Repositories:** 4 primary TypeScript data banks (`artifactsData.ts`, `academicAnatomyData.ts`, `vocabularyBankData.ts`, `quizData.ts`).
- **Services:** 7 client-side services (`artifactService`, `feedbackService`, `notebookService`, `qrService`, `analyticsService`, `forestSoundService`, `speechService`).
- **Media Assets:** 8 GLB 3D models (~165MB total), 18 photos/renders/SVGs, and 3 ambient audio tracks.

---

## 2. Hardcoded Data Inventory & Destination Mapping

The table below catalogs every static and client-persisted data element in the project, detailing its current location, structure, recommended migration strategy, target Supabase table/bucket, and operational risk assessment.

| # | Data Domain / Item | Current Source File | Current Structure | Move to Supabase? | Destination Table / Bucket | Migration & Runtime Risk |
|---|---|---|---|---|---|---|
| **1** | **Artifact Categories** | `src/services/artifactService.ts`<br>`src/types/index.ts` | Hardcoded array of 5 categories (`id`, `labelVi`, `labelEn`) | **YES** | Table: `artifact_categories` | **Low**. Easy to seed with stable slugs (`architecture`, `musical_instrument`, `weaving_craft`, `spiritual_sculpture`, `daily_tool`). |
| **2** | **7 Master Artifacts** (Gươl, Trống K'tu, Gùi Ba-hieng, Chiêng đồng, Áo Nam, Váy Nữ, Tượng Tê tê) | `src/data/artifactsData.ts` (733 lines) | Array of `Artifact` objects (`id`, `slug`, `name`, `brief`, `description`, `sections`, `origin`, `materials`, `dimensions`, `sources`, etc.) | **YES** | Table: `artifacts` (with 1:N relations for sections and images) | **Medium**. High fidelity required for cultural text, diacritics, and stable slug integrity used in URL routes and QR codes. |
| **3** | **Artifact Detail Sections** (Spatial Hierarchy, Carving, Joinery, Story) | `src/data/artifactsData.ts` (inside `sections[]`) | Sub-array of `{ id, title: { vi, en }, content: { vi, en } }` | **YES** | Table: `artifact_sections` or `artifacts.historical_story_*` / `artifacts.cultural_meaning_*` | **Low**. Maps cleanly to database columns and structured child records. |
| **4** | **Artifact Image Gallery & Thumbnails** | `src/data/artifactsData.ts`<br>`public/images/` | String paths (`/images/guol-authentic.jpg`, etc.) | **YES** | Storage: `artifact-images`<br>Table: `artifact_images` & `artifacts.thumbnail_path` | **Medium**. High-resolution images (up to 8.4MB) must be served with optimized cache headers and fast CDN delivery. |
| **5** | **Artifact 3D GLB Models** | `src/data/artifactsData.ts`<br>`public/models/` | String paths (`/models/guol.glb`, etc.) | **YES** | Storage: `artifact-models`<br>Table: `artifacts.model_3d_path` | **High**. Large files (20MB - 26MB each). Must support HTTP range requests, correct MIME (`model/gltf-binary`), and preserve WebAR / iOS QuickLook compatibility. |
| **6** | **Contextual Educational Vocabulary** | `src/data/artifactsData.ts` (inside `vocabulary[]`) | Array of `VocabularyItem` (`term`, `ipa`, `vietnameseMeaning`, `englishDefinition`, `exampleSentence`) | **YES** | Table: `artifact_vocabulary` | **Low**. Clean relational mapping to `artifact_id`. |
| **7** | **Extended Vocabulary Bank & Themes** | `src/data/vocabularyBankData.ts` (1,106 lines) | `VOCABULARY_THEMES` (6 themes) and `VOCABULARY_BANK` (36+ items) | **YES** (Phase 2/6 extension) | Table: `vocabulary_themes` & `artifact_vocabulary` (or standalone table) | **Low**. Can link to artifacts via `artifact_id`. |
| **8** | **Ethnographic Dossiers & 3D Anatomy Hotspots** | `src/data/academicAnatomyData.ts` (908 lines) | `ARTIFACT_ACADEMIC_PROFILES` with `dossier`, `anatomyHotspots` (camera orbit, engineering analysis, cultural symbolism) | **YES** (Linked to artifacts) | Table: `artifact_anatomy_hotspots` & `artifact_dossiers` (or JSONB extension on `artifacts`) | **Low**. Keep JSONB or child table for hotspots to prevent losing interactive camera orbits in WebAR. |
| **9** | **Bilingual Cultural Quiz** | `src/data/quizData.ts` (567 lines) | Array of `QuizQuestion` with 4 options, `correctIndex`, `explanation` | **OPTIONAL / YES** | Table: `educational_quizzes` | **Low**. Can remain static fallback or move to table. |
| **10** | **Community Reviews & Guestbook** | `src/services/feedbackService.ts`<br>`cotu_heritage_public_comments_v4` in `localStorage` | 17 seed reviews + `localStorage` client writes | **YES** | Table: `artifact_reviews` | **High**. Security critical: Public users must insert with status `pending`, only admin can approve. Must prevent spam and XSS. |
| **11** | **Homepage Narrative, Banners & Editorial Copy** | `src/pages/HomePage.tsx`<br>`src/components/home/InteractiveVillageMap.tsx` | Hardcoded JSX strings, headlines, intro paragraphs, concentric village zones | **YES** | Table: `website_contents` | **Low**. Editable key-value store for content managers (`home_hero`, `home_intro`, `village_map_intro`, `about_project`). |
| **12** | **Static Website Assets (Emblems, Hero BG)** | `public/images/logo-emblem.png`<br>`public/images/hero-highlands-bg.jpg` | Local file paths | **YES** | Storage: `website-assets` | **Low**. Storage paths saved in `website_contents.image_path`. |
| **13** | **Interactive Voice Shadowing Scripts** | `src/data/academicAnatomyData.ts` | Array of scripts per artifact | **YES** | Table: `artifact_shadowing_scripts` (or JSONB) | **Low**. Textual bilingual content. |
| **14** | **Saved Notebook Items** | `src/services/notebookService.ts` | `localStorage` (`cotu_heritage_saved_vocab_v3`) | **KEEP CLIENT** | Browser `localStorage` | **None**. Personal learning notebook belongs to anonymous browser session. |
| **15** | **Local Web Engagement Analytics** | `src/services/analyticsService.ts` | `localStorage` (`cotu_heritage_analytics_v1`) | **KEEP CLIENT + VERCEL** | Vercel Analytics + LocalStorage | **None**. Already connected to `@vercel/analytics`. |

---

## 3. Detailed Component & Page Audit

### 3.1. HomePage (`src/pages/HomePage.tsx`)
- **Current Data Fetching:** Directly calls synchronous `artifactService.getAll()`.
- **Hardcoded Content:**
  - Hero Badge: *"Không gian Bảo tàng Số · Tây Giang, Quảng Nam" / "Digital Living Museum · Tây Giang Highlands"*
  - Hero Headline: *"Chạm Vào Hồn Gỗ & Nhịp Rừng Văn Hóa Cơ Tu Trong Không Gian 3D & WebAR"*
  - Poetic Narrative: *"Bước vào buôn làng giữa sương mây Trường Sơn..."*
  - 3 Core Experience Pillars (3D/AR, Bilingual Audio, QR Exhibit Scan).
  - 4 Hardcoded Vocabulary Spotlight items (Communal House, Bas-relief Carving, Hollowed Log Drum, Rattan Weaving).
- **Migration Plan:**
  - Replace hardcoded hero/editorial copy with records from `website_contents` using `content_key` (`home_hero_headline`, `home_hero_narrative`, etc.).
  - Pull showcase 3D models and artifact cards dynamically from `artifacts` table where `is_published = true`.
  - Maintain instant fallback to existing static constants if the Supabase request fails or network drops.

### 3.2. ArtifactDetailPage (`src/pages/ArtifactDetailPage.tsx`)
- **Current Data Fetching:** Synchronous `artifactService.getBySlug(slug)`.
- **Hardcoded Content & Dependencies:**
  - Reads `ARTIFACTS_DATA` for basic info and sections.
  - Reads `ARTIFACT_ACADEMIC_PROFILES` for hotspots and ethnographic dossier.
  - Renders `<ModelViewer3D>` using `artifact.model3D`.
  - Renders `<CommunityFeedbackSection>` filtered by `targetArtifactSlug={artifact.slug}`.
- **Migration Plan:**
  - Asynchronous `artifactService.getBySlug(slug)` fetching from Supabase `artifacts` joined with `artifact_categories`, `artifact_images`, and `artifact_vocabulary`.
  - Support loading state (skeleton shimmer), error state with retry button, and fallback to static cache.
  - Ensure 3D GLB URL is resolved to public Supabase Storage URL or CDN URL.

### 3.3. ArtifactsPage (`src/pages/ArtifactsPage.tsx`)
- **Current Data Fetching:** Synchronous `artifactService.search(query, category)`.
- **Migration Plan:**
  - Fetch categories dynamically from `artifact_categories` table (ordered by `display_order`).
  - Fetch published artifacts from `artifacts` table with search filtering and category filtering.
  - Implement pagination / limit query to prevent over-fetching when the collection grows.

### 3.4. Community Feedback & Review System (`src/components/feedback/CommunityFeedbackSection.tsx`)
- **Current Data Flow:**
  - Reads from `feedbackService.getComments()` which blends `SEED_FEEDBACK_COMMENTS` with browser `localStorage`.
  - Submitting a review immediately writes to `localStorage` and marks it approved/visible.
- **Security & Architecture Risks:**
  - Reviews are only visible to the local user who submitted them!
  - No server-side moderation or validation.
  - Potential XSS if unsanitized user comments are injected into HTML.
- **Migration Plan:**
  - Migrate the 17 seed reviews into the PostgreSQL table `artifact_reviews` with `status = 'approved'`.
  - Public visitors can submit reviews via `reviewService.submitReview()`. The insert goes directly to Supabase with enforced `status = 'pending'`.
  - Row Level Security (RLS) strictly blocks public queries from seeing unapproved reviews (`status = 'approved'` only).
  - Admins can authenticate and approve, reject, or delete reviews.

### 3.5. QR Code Identification Logic (`src/services/qrService.ts`, `src/pages/QRCodesPage.tsx`)
- **Current Logic:** Generates target URLs using `qrService.getArtifactUrl(slug)` = `${baseUrl}/artifacts/${slug}`.
- **Migration Plan:**
  - The `slug` column in the `artifacts` table remains the canonical identifier.
  - Preserve 100% compatibility with existing printed and generated QR codes.
  - Optional `qr_code` field in `artifacts` can store custom identifier strings or tracking parameters.

---

## 4. Media Asset Inventory & Storage Strategy

### 4.1. 3D GLB Models (`public/models/`)
| Model File | Size | Target Bucket | Storage Path | MIME Type |
|---|---|---|---|---|
| `guol.glb` | 22.8 MB | `artifact-models` | `guol-communal-house/model.glb` | `model/gltf-binary` |
| `ktu-drum.glb` | 26.3 MB | `artifact-models` | `ktu-traditional-drum/model.glb` | `model/gltf-binary` |
| `bahieng-basket.glb` | 23.9 MB | `artifact-models` | `bahieng-carrying-basket/model.glb` | `model/gltf-binary` |
| `chieng.glb` | 23.0 MB | `artifact-models` | `chieng-gong-instrument/model.glb` | `model/gltf-binary` |
| `ao-nam.glb` | 20.7 MB | `artifact-models` | `ao-nam-cotu/model.glb` | `model/gltf-binary` |
| `ao-nu.glb` | 25.6 MB | `artifact-models` | `ao-nu-cotu/model.glb` | `model/gltf-binary` |
| `te-te.glb` | 23.4 MB | `artifact-models` | `tuong-te-te-cotu/model.glb` | `model/gltf-binary` |
| `tkoor.glb` | 29.8 KB | `artifact-models` | `tkoor-ceremonial-pole/model.glb` | `model/gltf-binary` |

### 4.2. Image Assets (`public/images/`)
| Image File | Type | Target Bucket | Storage Path |
|---|---|---|---|
| `guol-authentic.jpg` | Field Photo | `artifact-images` | `guol-communal-house/thumbnail.jpg` |
| `drum-authentic.jpg` | Field Photo | `artifact-images` | `ktu-traditional-drum/thumbnail.jpg` |
| `basket-authentic.jpg` | Field Photo | `artifact-images` | `bahieng-carrying-basket/thumbnail.jpg` |
| `chieng-authentic.jpg` | Field Photo | `artifact-images` | `chieng-gong-instrument/thumbnail.jpg` |
| `aonam_v2.png` | Hi-res Render | `artifact-images` | `ao-nam-cotu/thumbnail.png` |
| `aonu_v2.png` | Hi-res Render | `artifact-images` | `ao-nu-cotu/thumbnail.png` |
| `tete_v2.png` | Hi-res Render | `artifact-images` | `tuong-te-te-cotu/thumbnail.png` |
| `hero-highlands-bg.jpg` | Background | `website-assets` | `homepage/hero-highlands-bg.jpg` |
| `logo-emblem.png` | Brand Emblem | `website-assets` | `branding/logo-emblem.png` |

---

## 5. Potential Migration Risks & Mitigation Plan

| Risk Description | Severity | Mitigation Strategy |
|---|---|---|
| **Large GLB download latencies causing WebAR timeout** | High | Keep GLB files publicly cached with long `Cache-Control` max-age in Supabase Storage. Implement progressive poster preview (`thumbnail`) and loading progress bar in `<ModelViewer3D>`. |
| **Supabase network interruption / Cold Start** | High | Implement dual-mode client services: Primary fetch from Supabase PostgreSQL; on network failure, seamlessly fall back to embedded static cache with silent error telemetry. |
| **Public user posting inappropriate reviews** | High | Enforce database-level constraint `CHECK (status IN ('pending', 'approved', 'rejected'))` and RLS policy: Public can only insert with `status = 'pending'`. Only admin can set `status = 'approved'`. |
| **Bilingual content desynchronization** | Medium | All translation fields are paired (`name_vi` & `name_en`, `description_vi` & `description_en`) in the same record row, guaranteeing atomic updates. |
| **Breaking existing QR codes printed for physical exhibitions** | Critical | Maintain immutable `slug` values identical to current hardcoded values (`guol-communal-house`, `ktu-traditional-drum`, etc.). |

---

## 6. Audit Conclusion & Next Steps
The project structure is clean, modular, and exceptionally well documented in TypeScript. The transition to Supabase can be executed smoothly with zero breaking changes to existing UI/UX and 100% preservation of WebAR functionality.

Proceed immediately to **Phase B: Database Architecture & SQL Migrations**.
