# VERCEL DEPLOYMENT & ENVIRONMENT CONFIGURATION GUIDE
**Document Version:** 1.0.0  
**Phase:** Phase 9 / 11 (Vercel Configuration)  
**Project:** CO-TU HERITAGE AR  
**Hosting Provider:** Vercel  
**Framework:** Vite + React + TypeScript  

---

## 1. Overview & Architecture

**CO-TU HERITAGE AR** is optimized for high-performance static hosting on Vercel's Edge Network, interfacing directly with Supabase PostgreSQL and Storage via `@supabase/supabase-js`.

```
[ Visitor Browser (Mobile / Desktop) ]
                │
                ├─── (HTTPS HTML/JS/CSS) ───► [ Vercel Edge Network / CDN ]
                │
                ├─── (PostgreSQL REST / WSS) ─► [ Supabase PostgreSQL (ap-southeast-1) ]
                │
                └─── (GLB / PBR Range Requests) ► [ Supabase Storage CDN ]
```

---

## 2. Environment Variables Configuration

To connect the Vercel deployment to your Supabase project, configure the following variables in the **Vercel Dashboard**:

### Required Environment Variables

| Variable Name | Description | Example Value | Environments |
|---|---|---|---|
| `VITE_SUPABASE_URL` | The REST API endpoint of your Supabase project | `https://your-project-id.supabase.co` | **Production**, **Preview**, **Development** |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public anonymous JWT key (`anon` key) | `eyJhbGciOiJIUzI1NiIsInR5...` | **Production**, **Preview**, **Development** |
| `VITE_PUBLIC_BASE_URL` | Public production domain for accurate QR code generation | `https://cotuheritage.vercel.app` | **Production**, **Preview** |

> [!IMPORTANT]
> **Security Requirement:** Never add `SUPABASE_SERVICE_ROLE_KEY` or database master passwords to Vercel's client-facing environment variables. `VITE_*` variables are embedded into client JavaScript bundles. The `anon` key is strictly protected by Row Level Security (RLS) policies.

---

## 3. Step-by-Step Vercel Setup

### Step 3.1: Navigate to Project Settings
1. Open your [Vercel Dashboard](https://vercel.com/dashboard).
2. Select the **`co-tu-heritage-ar`** project.
3. Click on **Settings** in the top navigation tab.
4. From the left sidebar, select **Environment Variables**.

### Step 3.2: Add Environment Variables
1. Under **Key**, enter:
   ```
   VITE_SUPABASE_URL
   ```
2. Under **Value**, paste your Supabase URL (e.g., `https://xyzcompany.supabase.co`).
3. Under **Environment**, check:
   - [x] **Production**
   - [x] **Preview**
   - [x] **Development**
4. Click **Save**.
5. Repeat for:
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_PUBLIC_BASE_URL`

### Step 3.3: Trigger a Redeployment
Because Vite bakes `import.meta.env` values into static JavaScript assets during `npm run build`:
1. Go to the **Deployments** tab in Vercel.
2. Click the three dots (`...`) on your latest deployment and select **Redeploy**.
3. Uncheck *"Use existing Build Cache"* to ensure fresh variables are compiled.
4. Click **Redeploy**.

---

## 4. `vercel.json` Routing & Headers Configuration

The project includes a `vercel.json` file configuring SPA fallback routing and caching:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/models/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 5. Security & Verification Checklist

- [x] `.env.local` and `.env` are listed in `.gitignore` and never committed to GitHub.
- [x] Client bundles contain only `VITE_SUPABASE_PUBLISHABLE_KEY` (no secret keys).
- [x] Direct URL navigation to `/artifacts/guol-communal-house` succeeds without 404 (handled by `vercel.json` rewrites).
- [x] WebAR `<model-viewer>` correctly loads 3D `.glb` assets over HTTPS with valid range headers.
- [x] Vercel Analytics package `@vercel/analytics` is active and tracking engagement pulse.
