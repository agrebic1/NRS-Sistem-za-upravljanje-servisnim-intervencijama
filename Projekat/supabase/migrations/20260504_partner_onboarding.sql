-- V11.0: Partner onboarding — bosanski statusi + specialnosti kolona

-- 1. Dodaj specialnosti kolonu (lista specijalnosti serviserskih oblasti)
ALTER TABLE partner_applications
  ADD COLUMN IF NOT EXISTS specialnosti TEXT[] DEFAULT '{}';

-- 2. Ukloni stari CHECK constraint (pending/approved/rejected)
ALTER TABLE partner_applications
  DROP CONSTRAINT IF EXISTS partner_applications_status_check;

-- 3. Migracija postojećih English statusa → bosanski
UPDATE partner_applications SET status = 'na_cekanju' WHERE status = 'pending';
UPDATE partner_applications SET status = 'odobreno'   WHERE status = 'approved';
UPDATE partner_applications SET status = 'odbijeno'   WHERE status = 'rejected';

-- 4. Novi default i CHECK constraint sa bosanskim statusima
ALTER TABLE partner_applications
  ALTER COLUMN status SET DEFAULT 'na_cekanju';

ALTER TABLE partner_applications
  ADD CONSTRAINT partner_applications_status_check
  CHECK (status IN ('na_cekanju', 'odobreno', 'odbijeno'));
