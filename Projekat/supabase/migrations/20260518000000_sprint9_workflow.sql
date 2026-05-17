-- ============================================================
-- Sprint 9: Formal closure · Team management · Notifications
--           Image uploads · Richer audit trail
-- ============================================================

-- 1. Closure columns on service_requests
ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS closed_at    timestamptz,
  ADD COLUMN IF NOT EXISTS closed_by    uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS closure_note text;

-- 2. Auxiliary servicer team
CREATE TABLE IF NOT EXISTS tim_intervencije (
  id             bigserial   PRIMARY KEY,
  zahtjev_id     bigint      NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  serviser_id    uuid        NOT NULL REFERENCES auth.users(id),
  uloga          text        NOT NULL DEFAULT 'pomocni' CHECK (uloga = 'pomocni'),
  dodijelio_id   uuid        NOT NULL REFERENCES auth.users(id),
  dodijeljeno_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (zahtjev_id, serviser_id)
);
CREATE INDEX IF NOT EXISTS idx_tim_zahtjev  ON tim_intervencije (zahtjev_id);
CREATE INDEX IF NOT EXISTS idx_tim_serviser ON tim_intervencije (serviser_id);

-- 3. In-app notifications
CREATE TABLE IF NOT EXISTS notifikacije (
  id          bigserial   PRIMARY KEY,
  korisnik_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tip         text        NOT NULL,
  naslov      text        NOT NULL,
  poruka      text        NOT NULL,
  procitano   boolean     NOT NULL DEFAULT false,
  zahtjev_id  bigint      REFERENCES service_requests(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notif_korisnik ON notifikacije (korisnik_id);
CREATE INDEX IF NOT EXISTS idx_notif_unread   ON notifikacije (korisnik_id) WHERE NOT procitano;

-- 4. Intervention images
CREATE TABLE IF NOT EXISTS slike_intervencija (
  id            bigserial   PRIMARY KEY,
  zahtjev_id    bigint      NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  evidencija_id bigint      REFERENCES work_evidence(id) ON DELETE SET NULL,
  uploaded_by   uuid        NOT NULL REFERENCES auth.users(id),
  image_url     text        NOT NULL,
  naziv         text,
  opis          text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_slike_zahtjev    ON slike_intervencija (zahtjev_id);
CREATE INDEX IF NOT EXISTS idx_slike_evidencija ON slike_intervencija (evidencija_id);

-- 5. Richer audit trail on intervention_activities
ALTER TABLE intervention_activities
  ADD COLUMN IF NOT EXISTS actor_role text,
  ADD COLUMN IF NOT EXISTS old_value  text,
  ADD COLUMN IF NOT EXISTS new_value  text,
  ADD COLUMN IF NOT EXISTS razlog     text;

-- 6. Supabase Storage bucket for intervention images
-- (run via dashboard or Supabase CLI if not using migrations for storage)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('intervencije-slike', 'intervencije-slike', true)
-- ON CONFLICT (id) DO NOTHING;
