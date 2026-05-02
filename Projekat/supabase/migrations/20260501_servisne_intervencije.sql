-- ============================================================
-- MIGRACIJA: Modul Servisnih Intervencija
-- US-05, US-06, US-18, US-26, US-27
-- ============================================================

BEGIN;

-- ────────────────────────────────────────────────────────────
-- 1. PARTNER APLIKACIJE (US-18)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.partner_applications (
  id           SERIAL       PRIMARY KEY,
  first_name   VARCHAR(100) NOT NULL,
  last_name    VARCHAR(100) NOT NULL,
  email        VARCHAR(255) NOT NULL,
  phone        VARCHAR(50)  NOT NULL,
  service_type VARCHAR(50)  NOT NULL
               CHECK (service_type IN ('serviser', 'dispecer')),
  experience   TEXT         NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- 2. SERVISNI ZAHTJEVI S TRIAGE (US-05)
-- ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.service_requests (
  id            SERIAL       PRIMARY KEY,
  user_id       UUID         NOT NULL
                REFERENCES public.osoba(id_osobe) ON DELETE CASCADE,
  category      VARCHAR(255) NOT NULL,
  address       VARCHAR(500) NOT NULL,
  description   TEXT         NOT NULL,
  contact_phone VARCHAR(50)  NOT NULL,
  photo_url     TEXT,
  status        VARCHAR(30)  NOT NULL DEFAULT 'na_cekanju'
                CHECK (status IN ('na_cekanju','dodijeljeno','u_radu','zavrseno','otkazano')),
  urgency_score INTEGER      NOT NULL DEFAULT 0
                CHECK (urgency_score >= 0 AND urgency_score <= 110),
  triage_json   JSONB,
  cancel_reason TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_service_requests_updated_at ON public.service_requests;

CREATE TRIGGER trg_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_service_requests_user_id
  ON public.service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status
  ON public.service_requests(status);

-- ────────────────────────────────────────────────────────────
-- 3. RLS POLITIKE
-- ────────────────────────────────────────────────────────────

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests     ENABLE ROW LEVEL SECURITY;

-- partner_applications: javni INSERT (anonimni korisnici mogu aplicirati)
CREATE POLICY "partner_apps_insert_anon"
  ON public.partner_applications FOR INSERT
  WITH CHECK (true);

-- partner_applications: admin može čitati i ažurirati
CREATE POLICY "partner_apps_admin_all"
  ON public.partner_applications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.uposlenici u
      JOIN public.uloga ul ON ul.id_uloge = u.id_uloge
      WHERE u.id_uposlenika = auth.uid()
        AND ul.naziv IN ('Administrator', 'admin')
    )
  );

-- service_requests: korisnik čita samo svoje
CREATE POLICY "service_requests_user_select"
  ON public.service_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- service_requests: korisnik inserira samo za sebe
CREATE POLICY "service_requests_user_insert"
  ON public.service_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- service_requests: korisnik može mijenjati SAMO dok je status 'na_cekanju'
CREATE POLICY "service_requests_user_update"
  ON public.service_requests FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'na_cekanju')
  WITH CHECK (user_id = auth.uid());

-- service_requests: dispečer i admin vide sve
CREATE POLICY "service_requests_staff_select"
  ON public.service_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.uposlenici u
      JOIN public.uloga ul ON ul.id_uloge = u.id_uloge
      WHERE u.id_uposlenika = auth.uid()
        AND ul.naziv IN ('Administrator', 'admin', 'Dispečer', 'Serviser')
    )
  );

COMMIT;
