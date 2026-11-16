# SECURITY POLICIES & ROW LEVEL SECURITY (RLS): CO-TU HERITAGE AR
**Document Version:** 1.0.0  
**Phase:** Phase C (RLS & Storage Policies)  
**Security Framework:** PostgreSQL Row Level Security (RLS) & Supabase Auth  

---

## 1. Security Architecture & Threat Model

The **CO-TU HERITAGE AR** platform serves two distinct user classes:
1. **Public Visitors (Anonymous / Authenticated):** General public exploring 3D models and WebAR without creating an account. They must have read-only access to published artifacts, images, vocabulary, and approved reviews, and restricted ability to submit new reviews with forced `'pending'` status.
2. **Platform Administrators (Authenticated):** Cultural researchers and curators who manage artifacts, moderate reviews, edit website content, and upload 3D models and images.

### Threat Model & Countermeasures

| Threat Vector | Attack Scenario | Defensive Countermeasure |
|---|---|---|
| **Malicious Review Defacement** | Attacker calls Supabase client directly sending `{ status: 'approved', comment: 'spam' }` | **RLS WITH CHECK** restricts public inserts to `status = 'pending'`. A **SECURITY DEFINER trigger** (`enforce_review_pending_status`) overrides and forces `status = 'pending'`, `is_verified = false`, and `likes = 0` whenever `public.is_admin()` is false. |
| **Unpublished Data Leakage** | Attacker queries draft or unverified artifacts | RLS policy on `artifacts` strictly enforces `WHERE is_published = true OR public.is_admin()`. Child tables (`artifact_images`, `artifact_vocabulary`) mirror this check. |
| **Privilege Escalation** | Attacker inserts their own user ID into `admin_profiles` or edits `user_metadata` | Public access to `admin_profiles` is completely blocked. Role verification relies exclusively on `admin_profiles.role` validated via `public.is_admin()`, ignoring spoofable `user_metadata`. |
| **Recursive RLS Policy Lock** | Checking admin status within RLS triggers an infinite subquery loop on `admin_profiles` | `public.is_admin()` is marked `SECURITY DEFINER` and executes outside the caller's RLS context, terminating recursion. |
| **Asset Deletion / Overwrite** | Attacker issues HTTP DELETE to storage buckets | Storage policies on `storage.objects` allow `INSERT`, `UPDATE`, and `DELETE` solely when `public.is_admin()` evaluates to `true`. |

---

## 2. Row Level Security Policies per Table

### 2.1. Authorization Helper: `public.is_admin()`
```sql
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
```

---

### 2.2. Table: `artifact_categories`
- **SELECT (Public):**
  ```sql
  CREATE POLICY "Public can view artifact categories"
  ON public.artifact_categories FOR SELECT
  TO anon, authenticated
  USING (true);
  ```
- **CRUD (Admin):**
  ```sql
  CREATE POLICY "Admins have full CRUD on artifact categories"
  ON public.artifact_categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
  ```

---

### 2.3. Table: `artifacts`
- **SELECT (Public):**
  ```sql
  CREATE POLICY "Public can view published artifacts"
  ON public.artifacts FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());
  ```
- **CRUD (Admin):**
  ```sql
  CREATE POLICY "Admins have full CRUD on artifacts"
  ON public.artifacts FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
  ```

---

### 2.4. Table: `artifact_images`
- **SELECT (Public):**
  ```sql
  CREATE POLICY "Public can view published artifact images"
  ON public.artifact_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.artifacts
      WHERE artifacts.id = artifact_images.artifact_id
        AND (artifacts.is_published = true OR public.is_admin())
    )
  );
  ```
- **CRUD (Admin):** Full CRUD granted when `public.is_admin()`.

---

### 2.5. Table: `artifact_vocabulary`
- **SELECT (Public):**
  ```sql
  CREATE POLICY "Public can view published artifact vocabulary"
  ON public.artifact_vocabulary FOR SELECT
  TO anon, authenticated
  USING (
    artifact_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.artifacts
      WHERE artifacts.id = artifact_vocabulary.artifact_id
        AND (artifacts.is_published = true OR public.is_admin())
    )
  );
  ```
- **CRUD (Admin):** Full CRUD granted when `public.is_admin()`.

---

### 2.6. Table: `artifact_reviews`
- **SELECT (Public):** Only approved reviews are visible:
  ```sql
  CREATE POLICY "Public can view approved reviews"
  ON public.artifact_reviews FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' OR public.is_admin());
  ```
- **INSERT (Public):** Restricted to pending status:
  ```sql
  CREATE POLICY "Public can submit pending reviews only"
  ON public.artifact_reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending' AND rating >= 1 AND rating <= 5);
  ```
- **DATABASE TRIGGER GUARANTEE:**
  ```sql
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
  ```
- **UPDATE & DELETE (Admin):** Only administrators can moderate, update status, or delete reviews.

---

### 2.7. Table: `website_contents`
- **SELECT (Public):** Public read access granted (`USING (true)`).
- **CRUD (Admin):** Full CRUD granted when `public.is_admin()`.

---

### 2.8. Table: `admin_profiles`
- **SELECT:** Restricted to `auth.uid() = id OR public.is_admin()`. Anonymous users receive empty sets.
- **INSERT / UPDATE / DELETE:** Strictly restricted to existing administrators or database service role.

---

## 3. First Administrator Provisioning Procedure

To prevent unauthorized account creation, self-registration as an administrator is prohibited at the database level.

### Provisioning Step-by-Step:
1. Open the **Supabase Dashboard** > **Authentication** > **Users**.
2. Click **Add User** > **Create User**.
3. Enter the administrator's email and a secure passphrase (e.g., `admin@cotuheritage.vn`).
4. Copy the generated User UID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).
5. In the **SQL Editor**, execute the trusted provisioning command:
   ```sql
   INSERT INTO public.admin_profiles (id, display_name, role)
   VALUES (
     'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
     'Ban Quản Trị Di Sản Cơ Tu Tây Giang',
     'super_admin'
   )
   ON CONFLICT (id) DO UPDATE SET
     role = 'super_admin';
   ```
6. The user is now authenticated and recognized by `public.is_admin()`.
