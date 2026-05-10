-- Eksplicitno vrijeme otkazivanja (pored generičkog updated_at).
ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

COMMENT ON COLUMN public.service_requests.cancelled_at IS 'Trenutak kada je korisnik otkazao zahtjev (status otkazano).';
