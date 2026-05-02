BEGIN;

-- Align Sprint 7 initial status to pending_review (keep legacy compatibility).

DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.service_requests'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.service_requests DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.service_requests
  ADD CONSTRAINT service_requests_status_check
  CHECK (
    status IN (
      'pending_review',
      'na_cekanju',
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
SET status = 'pending_review'
WHERE status = 'na_cekanju';

DROP POLICY IF EXISTS service_requests_user_update ON public.service_requests;
CREATE POLICY service_requests_user_update
ON public.service_requests
FOR UPDATE
TO authenticated
USING (user_id = (select auth.uid()) AND status IN ('pending_review', 'na_cekanju'))
WITH CHECK (
  user_id = (select auth.uid())
  AND status IN ('pending_review', 'na_cekanju')
);

COMMIT;
