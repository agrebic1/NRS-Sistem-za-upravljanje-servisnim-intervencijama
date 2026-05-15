-- ============================================================
-- MIGRACIJA V3.0: End-to-End Service Ecosystem
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────────────────
-- 1. Proširenje service_requests tabele
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS system_score        INTEGER       NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_priority      VARCHAR(20),
  ADD COLUMN IF NOT EXISTS rejection_reason    TEXT,
  ADD COLUMN IF NOT EXISTS preferred_schedule  JSONB;

-- Ažuriranje status constraint — novi životni ciklus
ALTER TABLE public.service_requests
  DROP CONSTRAINT IF EXISTS service_requests_status_check;

ALTER TABLE public.service_requests
  ADD CONSTRAINT service_requests_status_check
  CHECK (status IN (
    'na_cekanju',   -- 🟡 Žuta  — inicijalni status
    'potvrdeno',    -- 🔵 Plava — dispečer potvrdio termin
    'dodijeljeno',  -- backward compat
    'u_radu',       -- backward compat
    'u_izvrsenju',  -- 🟢 Zelena — serviser na terenu
    'zavrseno',     -- sivo — završeno
    'otkazano',     -- sivo — korisnik otkazao
    'odbijeno'      -- 🔴 Crvena — dispečer odbio (rejection_reason obavezno)
  ));

-- Indeks na system_score za sortiranje u dispečerskom panelu
CREATE INDEX IF NOT EXISTS idx_service_requests_system_score
  ON public.service_requests(system_score DESC);

-- ────────────────────────────────────────────────────────────
-- 2. RLS update — korisnik edituje samo dok je na_cekanju
-- ────────────────────────────────────────────────────────────

-- Politika je već kreirana (user_update) — provjerava status = 'na_cekanju'
-- Ništa se ne mijenja u RLS.

-- ────────────────────────────────────────────────────────────
-- 3. Dispečerske akcije — view za sortirani pregled
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.v_dispecer_zahtjevi AS
SELECT
  sr.*,
  o.ime,
  o.prezime,
  o.broj_telefona,
  o.email
FROM public.service_requests sr
JOIN public.osoba o ON o.id_osobe = sr.user_id
ORDER BY
  CASE sr.status
    WHEN 'na_cekanju'  THEN 1
    WHEN 'potvrdeno'   THEN 2
    WHEN 'u_izvrsenju' THEN 3
    ELSE 4
  END,
  sr.system_score DESC,
  sr.created_at ASC;

COMMIT;
