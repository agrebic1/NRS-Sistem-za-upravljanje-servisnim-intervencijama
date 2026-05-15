-- Fix: dodaje kolone iz sprint8 koje nisu bile u bazi
-- Uzrok: migracija je bila registrovana pod starim timestampom
-- prije nego što je SQL sadržaj bio kompletan.
-- Svi ADD COLUMN koriste IF NOT EXISTS — sigurno za ponovni pokret.

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS serviser_dodijeljen_id  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS procijenjeno_trajanje   INTEGER,
  ADD COLUMN IF NOT EXISTS termin_planirani_pocetak TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS termin_planirani_kraj   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dispecer_napomene       TEXT,
  ADD COLUMN IF NOT EXISTS serviser_odbio_razlog   TEXT,
  ADD COLUMN IF NOT EXISTS rad_evidentiran_at      TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS work_evidence (
  id              BIGSERIAL   PRIMARY KEY,
  zahtjev_id      BIGINT      NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  serviser_id     UUID        NOT NULL REFERENCES auth.users(id),
  opis_rada       TEXT        NOT NULL CHECK (LENGTH(TRIM(opis_rada)) >= 5),
  trajanje_minuta INTEGER     CHECK (trajanje_minuta IS NULL OR (trajanje_minuta > 0 AND trajanje_minuta <= 1440)),
  materijal       TEXT,
  napomene        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS intervention_activities (
  id         BIGSERIAL   PRIMARY KEY,
  zahtjev_id BIGINT      NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  autor_id   UUID        NOT NULL REFERENCES auth.users(id),
  tip        TEXT        NOT NULL CHECK (tip IN (
               'status_promjena', 'napomena', 'dodjela',
               'evidencija', 'odbijanje', 'sistem'
             )),
  sadrzaj    TEXT        NOT NULL,
  metadata   JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sr_serviser_dodijeljen
  ON service_requests(serviser_dodijeljen_id)
  WHERE serviser_dodijeljen_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_work_evidence_zahtjev
  ON work_evidence(zahtjev_id);

CREATE INDEX IF NOT EXISTS idx_activities_zahtjev_created
  ON intervention_activities(zahtjev_id, created_at DESC);

ALTER TABLE work_evidence          ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS we_own_select ON work_evidence;
CREATE POLICY we_own_select ON work_evidence
  FOR SELECT TO authenticated USING (serviser_id = auth.uid());

DROP POLICY IF EXISTS we_own_insert ON work_evidence;
CREATE POLICY we_own_insert ON work_evidence
  FOR INSERT TO authenticated WITH CHECK (serviser_id = auth.uid());

DROP POLICY IF EXISTS ia_select ON intervention_activities;
CREATE POLICY ia_select ON intervention_activities
  FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS ia_insert ON intervention_activities;
CREATE POLICY ia_insert ON intervention_activities
  FOR INSERT TO authenticated WITH CHECK (autor_id = auth.uid());
