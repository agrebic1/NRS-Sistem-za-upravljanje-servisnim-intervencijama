BEGIN;

CREATE TABLE IF NOT EXISTS public.admin_user_create_audit (
  id BIGSERIAL PRIMARY KEY,
  created_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_email TEXT NOT NULL,
  target_role TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  error_message TEXT,
  email_sent BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_user_create_audit_created_by
  ON public.admin_user_create_audit(created_by_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_user_create_audit_target_email
  ON public.admin_user_create_audit(target_email);

ALTER TABLE public.admin_user_create_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_user_create_audit_admin_all ON public.admin_user_create_audit;
CREATE POLICY admin_user_create_audit_admin_all
ON public.admin_user_create_audit
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.uposlenici u
    JOIN public.uloga ul ON ul.id_uloge = u.id_uloge
    WHERE u.id_uposlenika = auth.uid()
      AND lower(ul.naziv) IN ('administrator', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.uposlenici u
    JOIN public.uloga ul ON ul.id_uloge = u.id_uloge
    WHERE u.id_uposlenika = auth.uid()
      AND lower(ul.naziv) IN ('administrator', 'admin')
  )
);

COMMIT;
