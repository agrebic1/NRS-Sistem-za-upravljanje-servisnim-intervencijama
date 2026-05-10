-- Status in_review: dispečerska obrada (u obradi) kad je operativni prioritet postavljen.

BEGIN;

ALTER TABLE public.service_requests
  DROP CONSTRAINT IF EXISTS service_requests_status_check;

ALTER TABLE public.service_requests
  ADD CONSTRAINT service_requests_status_check
  CHECK (
    status IN (
      'pending_review',
      'na_cekanju',
      'in_review',
      'potvrdeno',
      'dodijeljeno',
      'u_radu',
      'u_izvrsenju',
      'zavrseno',
      'otkazano',
      'odbijeno'
    )
  );

UPDATE public.service_requests
SET status = 'in_review'
WHERE status IN ('pending_review', 'na_cekanju')
  AND final_priority IS NOT NULL
  AND TRIM(final_priority) <> '';

COMMIT;
