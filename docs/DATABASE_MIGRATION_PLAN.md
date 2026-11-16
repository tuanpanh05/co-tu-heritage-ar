# DATABASE MIGRATION PLAN: CO-TU HERITAGE AR
**Document Version:** 1.0.0  
**Phase:** Phase A (Audit & Migration Planning)  
**Target Platform:** Supabase (PostgreSQL 15+, Supabase Storage, Supabase Auth)  

---

## 1. Objectives & Migration Strategy

The goal of this migration is to transition the **CO-TU HERITAGE AR** application from static TypeScript arrays and local browser storage to a live, secure, scalable Supabase PostgreSQL database and Storage backend.

### Core Principles
1. **Zero Disruption to WebAR / 3D Experience:** Existing model viewer interactions, QR code scanning, and 3D camera controls must continue working seamlessly without latency spikes.
2. **Lossless Bilingual Preservation:** Every piece of Vietnamese and English cultural metadata, including diacritics, anthropological terminology, and IPA pronunciation, must be preserved.
3. **Defense-in-Depth Security:** Database-level Row Level Security (RLS) and storage policies must protect against unauthorized modifications and privilege escalation.
4. **Offline / Network Resilience:** The frontend service layer will support graceful fallback if the database or Supabase connection is unreachable.

---

## 2. Target PostgreSQL Schema Architecture

The target database architecture encompasses 7 core tables, foreign key constraints, indexes for query performance, and triggers for automated timestamp updates.

```
+---------------------------+       1:N       +---------------------------+
|    artifact_categories    | <-------------+ |         artifacts         |
+---------------------------+                 +---------------------------+
| id (UUID, PK)             |                 | id (UUID, PK)             |
| slug (TEXT, UNIQUE)       |                 | category_id (UUID, FK)    |
| name_vi / name_en         |                 | slug (TEXT, UNIQUE)       |
| description_vi / en       |                 | name_vi / name_en         |
| display_order (INT)       |                 | brief_vi / brief_en       |
+---------------------------+                 | description_vi / en       |
                                              | origin_vi / en            |
                                              | historical_story_vi / en  |
                                              | cultural_meaning_vi / en  |
                                              | thumbnail_path (TEXT)     |
                                              | model_3d_path (TEXT)      |
                                              | qr_code (TEXT)            |
                                              | is_published (BOOLEAN)    |
                                              | display_order (INT)       |
                                              +---------------------------+
                                                            |
                     +--------------------------------------+--------------------------------------+
                     | 1:N                                  | 1:N                                  | 1:N
                     v                                      v                                      v
       +---------------------------+          +---------------------------+          +---------------------------+
       |      artifact_images      |          |    artifact_vocabulary    |          |     artifact_reviews      |
       +---------------------------+          +---------------------------+          +---------------------------+
       | id (UUID, PK)             |          | id (UUID, PK)             |          | id (UUID, PK)             |
       | artifact_id (UUID, FK)    |          | artifact_id (UUID, FK)    |          | artifact_id (UUID, FK, N) |
       | storage_path (TEXT)       |          | word_vi / word_en         |          | reviewer_name (TEXT)      |
       | alt_text_vi / alt_text_en |          | pronunciation (TEXT)      |          | rating (INT 1-5)          |
       | display_order (INT)       |          | definition_vi / en        |          | comment (TEXT)            |
       +---------------------------+          | example_vi / en           |          | status (pending/appr/rej) |
                                              | display_order (INT)       |          | created_at (TIMESTAMPTZ)  |
                                              +---------------------------+          +---------------------------+

+---------------------------+                 +---------------------------+
|     website_contents      |                 |      admin_profiles       |
+---------------------------+                 +---------------------------+
| id (UUID, PK)             |                 | id (UUID, PK, FK -> auth) |
| content_key (TEXT, UNIQUE)|                 | display_name (TEXT)       |
| title_vi / title_en       |                 | role (TEXT, DEFAULT admin)|
| content_vi / content_en   |                 | created_at (TIMESTAMPTZ)  |
| image_path (TEXT)         |                 +---------------------------+
| updated_at (TIMESTAMPTZ)  |
+---------------------------+
```

---

## 3. Storage Bucket Configuration Plan

| Bucket ID | Access Tier | Allowed MIME Types | File Size Limit | Target Directory Structure |
|---|---|---|---|---|
| `artifact-images` | Public Read | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` | 15 MB | `{artifact-slug}/thumbnail/`<br>`{artifact-slug}/gallery/` |
| `artifact-models` | Public Read | `model/gltf-binary`, `application/octet-stream` | 100 MB | `{artifact-slug}/model.glb` |
| `website-assets` | Public Read | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` | 15 MB | `homepage/`<br>`branding/`<br>`banners/` |

---

## 4. Sequential Migration Workflow

Migration will execute in 6 well-ordered phases to avoid referential integrity conflicts:

```
[Step 1: Categories]
  - Create category records with stable slugs ('architecture', 'musical_instrument', etc.)
       │
       ▼
[Step 2: Artifacts]
  - Lookup category_id by category slug
  - Insert 7 core artifacts with initial metadata & local path placeholders
       │
       ▼
[Step 3: Storage Assets]
  - Upload 8 GLB 3D models to 'artifact-models' bucket
  - Upload photos & renders to 'artifact-images' and 'website-assets'
  - Update artifacts table with live Supabase Storage URLs
       │
       ▼
[Step 4: Relational Child Data]
  - Insert 7 artifact thumbnail/gallery records into `artifact_images`
  - Insert 35+ contextual vocabulary items into `artifact_vocabulary`
       │
       ▼
[Step 5: Reviews & Editorial Content]
  - Insert 17 seed reviews with status = 'approved' into `artifact_reviews`
  - Insert homepage hero copy, intro, and project info into `website_contents`
       │
       ▼
[Step 6: Admin Provisioning]
  - Provision initial admin user via Supabase Auth & link to `admin_profiles`
```

---

## 5. Verification Metrics & Success Criteria

| Stage | Expected Minimum Record Count | Success Criteria |
|---|---|---|
| `artifact_categories` | 5 categories | All slugs match frontend types (`architecture`, `musical_instrument`, etc.). |
| `artifacts` | 7 records | All 7 slugs present (`guol-communal-house`, `ktu-traditional-drum`, etc.), `is_published = true`. |
| `artifact_images` | >= 7 records | Linked to existing artifact IDs with valid storage paths. |
| `artifact_vocabulary` | >= 25 records | Vietnamese meanings and English definitions populated. |
| `artifact_reviews` | 17 records | All seeded with `status = 'approved'`, matching current UI display. |
| `website_contents` | >= 5 sections | Keys: `home_hero`, `home_intro`, `village_map_intro`, `about_project`, `footer_brand`. |
| Storage Models | 8 GLB files | All GLB files accessible via public URL with HTTP 200 and range-request support. |

---

## 6. Contingency & Fallback Strategy

To ensure zero downtime during migration:
1. **Read-Through Fallback in Frontend:** The new Supabase services (`artifactService`, `reviewService`, `contentService`) will automatically fall back to static local constants if Supabase is offline, unconfigured, or returns an error.
2. **Safe Migration Script:** The migration script (`scripts/migrate-existing-data.mjs`) will be idempotent, using `upsert` on conflict (`slug` or `content_key`) so it can be re-run safely at any time.
