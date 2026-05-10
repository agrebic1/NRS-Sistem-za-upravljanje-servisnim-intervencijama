-- Faze čarobnjaka: dogovoreni termin (dispečer) i dodijeljeni serviser, prije završne potvrde (status potvrdeno).

BEGIN;

ALTER TABLE public.service_requests
  ADD COLUMN IF NOT EXISTS dispecer_agreed_schedule JSONB,
  ADD COLUMN IF NOT EXISTS serviser_dodijeljen_id UUID REFERENCES public.osoba(id_osobe) ON DELETE SET NULL;

COMMENT ON COLUMN public.service_requests.dispecer_agreed_schedule IS
  'Dogovoreni termin u čarobnjaku (npr. { "termini": [ { "date","from","to" } ] }); NULL dok dispečer ne potvrdi termin.';
COMMENT ON COLUMN public.service_requests.serviser_dodijeljen_id IS
  'Serviser dodijeljen u čarobnjaku; NULL dok nije odabran.';

CREATE INDEX IF NOT EXISTS idx_service_requests_serviser_dodijeljen_id
  ON public.service_requests(serviser_dodijeljen_id)
  WHERE serviser_dodijeljen_id IS NOT NULL;

COMMIT;
