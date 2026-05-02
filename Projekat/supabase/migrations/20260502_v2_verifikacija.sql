-- ============================================================
-- MIGRACIJA V2.0: Verifikacija partnera i proširenje modula
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────────────────
-- 1. partner_applications: education_level + document_url
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.partner_applications
  ADD COLUMN IF NOT EXISTS education_level VARCHAR(50)
    CHECK (education_level IN ('SSS', 'VŠS', 'VSS', 'Certifikovani majstor')),
  ADD COLUMN IF NOT EXISTS document_url TEXT;

-- ────────────────────────────────────────────────────────────
-- 2. uposlenici: is_verified flag
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.uposlenici
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- ────────────────────────────────────────────────────────────
-- 3. service_requests: is_verified_assigned flag
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS is_verified_assigned BOOLEAN NOT NULL DEFAULT FALSE;

-- ────────────────────────────────────────────────────────────
-- 4. Supabase Storage: partner-documents bucket
-- NAPOMENA: Bucket kreirati ručno u Supabase dashboardu:
--   Storage → New bucket → "partner-documents" → Public: YES
--   Ili pokrenuti:
--   INSERT INTO storage.buckets (id, name, public)
--   VALUES ('partner-documents', 'partner-documents', true)
--   ON CONFLICT DO NOTHING;
-- ────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-documents', 'partner-documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "partner_docs_insert_anon" ON storage.objects;
-- RLS za Storage bucket
CREATE POLICY "partner_docs_insert_anon"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'partner-documents');

DROP POLICY IF EXISTS "partner_docs_select_all" ON storage.objects;

CREATE POLICY "partner_docs_select_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partner-documents');

COMMIT;
