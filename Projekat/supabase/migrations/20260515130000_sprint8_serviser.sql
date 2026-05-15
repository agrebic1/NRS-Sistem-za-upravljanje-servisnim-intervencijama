-- ═══════════════════════════════════════════════════════════════════════════════
-- Sprint 8: Serviserski modul — planiranje, dodjela, evidencija, historija
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── 1. Proširenje service_requests za planiranje i dodjelu ──────────────────

ALTER TABLE service_requests
  ADD COLUMN IF NOT EXISTS serviser_dodijeljen_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS procijenjeno_trajanje        INTEGER,    -- minuta
  ADD COLUMN IF NOT EXISTS termin_planirani_pocetak     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS termin_planirani_kraj        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dispecer_napomene            TEXT,
  ADD COLUMN IF NOT EXISTS serviser_odbio_razlog        TEXT,
  ADD COLUMN IF NOT EXISTS rad_evidentiran_at           TIMESTAMPTZ;

-- ─── 2. Tabela: evidencija izvršenog rada ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS work_evidence (
  id                BIGSERIAL     PRIMARY KEY,
  zahtjev_id        BIGINT        NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  serviser_id       UUID          NOT NULL REFERENCES auth.users(id),
  opis_rada         TEXT          NOT NULL CHECK (LENGTH(TRIM(opis_rada)) >= 5),
  trajanje_minuta   INTEGER       CHECK (trajanje_minuta IS NULL OR (trajanje_minuta > 0 AND trajanje_minuta <= 1440)),
  materijal         TEXT,
  napomene          TEXT,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── 3. Tabela: historija aktivnosti intervencije ─────────────────────────────

CREATE TABLE IF NOT EXISTS intervention_activities (
  id          BIGSERIAL     PRIMARY KEY,
  zahtjev_id  BIGINT        NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  autor_id    UUID          NOT NULL REFERENCES auth.users(id),
  tip         TEXT          NOT NULL CHECK (tip IN (
                'status_promjena', 'napomena', 'dodjela',
                'evidencija', 'odbijanje', 'sistem'
              )),
  sadrzaj     TEXT          NOT NULL,
  metadata    JSONB,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── 4. Indeksi ───────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_sr_serviser_dodijeljen
  ON service_requests(serviser_dodijeljen_id)
  WHERE serviser_dodijeljen_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_work_evidence_zahtjev
  ON work_evidence(zahtjev_id);

CREATE INDEX IF NOT EXISTS idx_activities_zahtjev_created
  ON intervention_activities(zahtjev_id, created_at DESC);

-- ─── 5. RLS ───────────────────────────────────────────────────────────────────

ALTER TABLE work_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_activities ENABLE ROW LEVEL SECURITY;

-- Work evidence: serviser čita/upisuje samo vlastito
DROP POLICY IF EXISTS we_own_select ON work_evidence;
CREATE POLICY we_own_select ON work_evidence
  FOR SELECT TO authenticated
  USING (serviser_id = auth.uid());

DROP POLICY IF EXISTS we_own_insert ON work_evidence;
CREATE POLICY we_own_insert ON work_evidence
  FOR INSERT TO authenticated
  WITH CHECK (serviser_id = auth.uid());

-- Activities: svi autentificirani mogu čitati (prava na zahtjev provjerava API)
DROP POLICY IF EXISTS ia_select ON intervention_activities;
CREATE POLICY ia_select ON intervention_activities
  FOR SELECT TO authenticated
  USING (TRUE);

DROP POLICY IF EXISTS ia_insert ON intervention_activities;
CREATE POLICY ia_insert ON intervention_activities
  FOR INSERT TO authenticated
  WITH CHECK (autor_id = auth.uid());

-- ─── 6. Status constraint: dodaj 'dodijeljeno' ako nedostaje ─────────────────
-- (backward-compat — kolona postoji ali constraint može biti stariji)
-- Nema izmjene CHECK-a jer 'dodijeljeno' već postoji u starijoj šemi.