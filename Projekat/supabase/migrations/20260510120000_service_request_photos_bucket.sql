-- Storage bucket i RLS politike za fotografije servisnih zahtjeva
BEGIN;

INSERT INTO storage.buckets (id, name, public)
VALUES ('service-request-photos', 'service-request-photos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "service_request_photos_insert_auth" ON storage.objects;
CREATE POLICY "service_request_photos_insert_auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'service-request-photos');

DROP POLICY IF EXISTS "service_request_photos_select_all" ON storage.objects;
CREATE POLICY "service_request_photos_select_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-request-photos');

COMMIT;
