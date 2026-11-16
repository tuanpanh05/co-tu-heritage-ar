# SUPABASE SETUP & PROVISIONING GUIDE
**Document Version:** 1.0.0  
**Project:** CO-TU HERITAGE AR  
**Environment:** Development, Preview & Production  

---

## 1. Quick Setup Overview

This guide walks through creating and initializing the Supabase backend for **CO-TU HERITAGE AR**.

### Prerequisites:
- A Supabase account at [https://supabase.com](https://supabase.com).
- Node.js 18+ installed on your local machine.

---

## 2. Step-by-Step Backend Provisioning

### Step 2.1: Create a Supabase Project
1. Log in to your [Supabase Dashboard](https://app.supabase.com).
2. Click **New project**.
3. Select your organization and choose:
   - **Name:** `co-tu-heritage-ar`
   - **Database Password:** Enter a strong password (save this securely).
   - **Region:** Southeast Asia (Singapore `ap-southeast-1`) for lowest latency to Vietnam.
4. Click **Create new project** and wait ~2 minutes for provisioning.

---

### Step 2.2: Execute SQL Migrations
In the Supabase Dashboard, navigate to the **SQL Editor** (`/project/_/sql`).

Execute the migration files in `supabase/migrations/` in numerical order:

1. **Schema & Tables:** Open and run `supabase/migrations/20261116000001_create_schema.sql`.
   - Creates `artifact_categories`, `artifacts`, `artifact_images`, `artifact_vocabulary`, `artifact_reviews`, `website_contents`, and `admin_profiles`.
   - Adds indexes, foreign key cascades, and timestamp triggers.
2. **Security & RLS Policies:** Open and run `supabase/migrations/20261116000002_security_rls_policies.sql`.
   - Defines `public.is_admin()` security function.
   - Enables RLS on all 7 tables and applies public/admin policies.
3. **Storage Buckets & Storage RLS:** Open and run `supabase/migrations/20261116000003_storage_buckets.sql`.
   - Creates `artifact-images`, `artifact-models`, and `website-assets` buckets.
   - Configures storage RLS policies.
4. **Seed Cultural Data:** Open and run `supabase/migrations/20261116000004_seed_data.sql`.
   - Seeds all 5 categories, 7 master artifacts, vocabulary, approved guestbook reviews, and homepage contents.

---

### Step 2.3: Retrieve API Credentials
1. Navigate to **Project Settings** > **API** (`/project/_/settings/api`).
2. Copy the following values:
   - **Project URL:** `https://<project-ref>.supabase.co`
   - **Project API Keys** > `anon` / `public` key: `eyJhbGciOi...`
   *(Never use or expose the `service_role` key in frontend client code).*

---

### Step 2.4: Configure Local Environment
Create `.env.local` in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key

# Public Base URL for QR Generation
VITE_PUBLIC_BASE_URL=http://localhost:5173
```

---

## 3. Storage Asset Upload (3D Models & Images)

To upload the authentic 3D models and field photographs to Supabase Storage:

1. In Supabase Dashboard, go to **Storage** > **Buckets**.
2. Upload files according to the folder structure:
   - **`artifact-models`**:
     - `guol-communal-house/model.glb` (from `public/models/guol.glb`)
     - `ktu-traditional-drum/model.glb` (from `public/models/ktu-drum.glb`)
     - `bahieng-carrying-basket/model.glb` (from `public/models/bahieng-basket.glb`)
     - `chieng-gong-instrument/model.glb` (from `public/models/chieng.glb`)
     - `ao-nam-cotu/model.glb` (from `public/models/ao-nam.glb`)
     - `ao-nu-cotu/model.glb` (from `public/models/ao-nu.glb`)
     - `tuong-te-te-cotu/model.glb` (from `public/models/te-te.glb`)
   - **`artifact-images`**:
     - Upload thumbnails and authentic field photos to `{slug}/thumbnail.jpg`
   - **`website-assets`**:
     - Upload `hero-highlands-bg.jpg` and `logo-emblem.png`

Alternatively, run the automated migration script `scripts/migrate-existing-data.mjs` using your Supabase credentials.
