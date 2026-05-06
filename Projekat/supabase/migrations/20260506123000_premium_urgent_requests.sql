-- Premium korisnici mogu oznaciti zahtjev kao hitnu intervenciju.
ALTER TABLE public.korisnik_usluge
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS urgent_requested BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS urgent_requested_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_service_requests_urgent_requested
  ON public.service_requests(urgent_requested DESC, created_at ASC);
