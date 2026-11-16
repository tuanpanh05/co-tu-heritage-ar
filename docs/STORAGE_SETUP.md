# SUPABASE STORAGE CONFIGURATION & POLICIES
**Document Version:** 1.0.0  
**Phase:** Phase C (Storage Setup)  
**Target Platform:** Supabase Storage & CDN  

---

## 1. Storage Buckets Overview

The **CO-TU HERITAGE AR** application requires three specialized storage buckets to optimize caching, transmission latency, and WebAR compatibility.

```
Supabase Storage
├── 🪣 artifact-images (Public, 15MB limit)
│   ├── guol-communal-house/
│   │   ├── thumbnail.jpg
│   │   └── gallery/
│   ├── ktu-traditional-drum/
│   └── ...
│
├── 🪣 artifact-models (Public, 100MB limit)
│   ├── guol-communal-house/model.glb
│   ├── ktu-traditional-drum/model.glb
│   └── ...
│
└── 🪣 website-assets (Public, 15MB limit)
    ├── homepage/hero-highlands-bg.jpg
    └── branding/logo-emblem.png
```

---

## 2. Bucket Configuration Parameters

| Bucket Identifier | Public Access | Max File Size | Allowed MIME Types | Cache-Control Header |
|---|---|---|---|---|
| `artifact-images` | `true` | 15,728,640 bytes (15 MB) | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` | `public, max-age=31536000, immutable` |
| `artifact-models` | `true` | 104,857,600 bytes (100 MB) | `model/gltf-binary`, `application/octet-stream`, `model/gltf+json` | `public, max-age=31536000, immutable` |
| `website-assets` | `true` | 15,728,640 bytes (15 MB) | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` | `public, max-age=86400, stale-while-revalidate=604800` |

---

## 3. Storage Security & Row Level Security

All buckets enforce Row Level Security on the `storage.objects` table.

### Access Control Matrix

| Bucket | Public Anonymous | Authenticated Admin (`public.is_admin()`) |
|---|---|---|
| `artifact-images` | `SELECT` (Read) | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `artifact-models` | `SELECT` (Read) | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| `website-assets` | `SELECT` (Read) | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |

Any attempt by anonymous or non-admin users to upload, overwrite, or delete assets is rejected with HTTP 403 / PostgreSQL RLS denial.

---

## 4. WebAR Optimization & Range-Request Support

1. **GLB Streaming & Range Requests:** Supabase Storage natively supports HTTP `Range` headers, allowing the `<model-viewer>` component to buffer and render 3D meshes without waiting for the full 25MB file download.
2. **CDN Delivery:** Public assets in Supabase Storage are cached globally across Supabase's edge CDN nodes, reducing model load times for mobile devices on cellular networks.
3. **MIME Validation:** Files uploaded to `artifact-models` must strictly carry `model/gltf-binary` to ensure iOS QuickLook and Android Scene Viewer launch into augmented reality without file extension mismatch errors.
