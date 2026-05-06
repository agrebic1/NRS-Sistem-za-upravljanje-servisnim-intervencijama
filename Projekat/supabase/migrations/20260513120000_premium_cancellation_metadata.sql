BEGIN;

ALTER TABLE public.korisnik_usluge
  ADD COLUMN IF NOT EXISTS premium_cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS premium_cancel_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_korisnik_usluge_premium_cancelled_at
  ON public.korisnik_usluge(premium_cancelled_at)
  WHERE premium_cancelled_at IS NOT NULL;

COMMIT;
