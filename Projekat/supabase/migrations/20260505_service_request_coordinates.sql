-- Opcionalne geografske koordinate uz adresu (GPS / mapa), AC15
BEGIN;

ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

COMMIT;
