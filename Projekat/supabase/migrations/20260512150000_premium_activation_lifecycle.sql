BEGIN;

ALTER TABLE public.korisnik_usluge
  ADD COLUMN IF NOT EXISTS premium_status VARCHAR(20) NOT NULL DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS premium_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS premium_plan VARCHAR(30);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'korisnik_usluge_premium_status_check'
  ) THEN
    ALTER TABLE public.korisnik_usluge
      ADD CONSTRAINT korisnik_usluge_premium_status_check
      CHECK (premium_status IN ('inactive', 'pending_payment', 'active', 'expired', 'cancelled'));
  END IF;
END $$;

-- Backfill postojećih premium korisnika na novi lifecycle model.
UPDATE public.korisnik_usluge
SET premium_status = 'active'
WHERE is_premium = true
  AND premium_status = 'inactive';

CREATE INDEX IF NOT EXISTS idx_korisnik_usluge_premium_status
  ON public.korisnik_usluge(premium_status);

CREATE INDEX IF NOT EXISTS idx_korisnik_usluge_premium_expires_at
  ON public.korisnik_usluge(premium_expires_at);

COMMIT;
