BEGIN;

-- 1) Function Search Path Mutable: public.set_updated_at()
DO $$
BEGIN
  IF to_regprocedure('public.set_updated_at()') IS NOT NULL THEN
    ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;
  END IF;
END
$$;

-- 2) RLS policy too permissive: partner_apps_insert_anon
DROP POLICY IF EXISTS "partner_apps_insert_anon" ON public.partner_applications;
CREATE POLICY "partner_apps_insert_anon"
  ON public.partner_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'na_cekanju');

-- 3) Public buckets do not need broad listing policies
DROP POLICY IF EXISTS "partner_docs_select_all" ON storage.objects;
DROP POLICY IF EXISTS "service_request_photos_select_all" ON storage.objects;

-- 4) Role-check RPC helpers should not run as SECURITY DEFINER
DO $$
DECLARE
  v_fn RECORD;
BEGIN
  FOR v_fn IN
    SELECT
      n.nspname AS schema_name,
      p.proname AS function_name,
      pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('is_admin', 'is_dispecer', 'is_serviser', 'is_uposlenik')
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %I.%I(%s) SECURITY INVOKER',
      v_fn.schema_name,
      v_fn.function_name,
      v_fn.args
    );
    EXECUTE format(
      'ALTER FUNCTION %I.%I(%s) SET search_path = public, pg_temp',
      v_fn.schema_name,
      v_fn.function_name,
      v_fn.args
    );
  END LOOP;
END
$$;

-- 5) Keep required SECURITY DEFINER internals non-executable via REST/RPC
DO $$
DECLARE
  v_fn RECORD;
BEGIN
  FOR v_fn IN
    SELECT
      n.nspname AS schema_name,
      p.proname AS function_name,
      pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('handle_new_user', 'registruj_uposlenika_kao_korisnika', 'rls_auto_enable')
  LOOP
    EXECUTE format(
      'REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM PUBLIC, anon, authenticated',
      v_fn.schema_name,
      v_fn.function_name,
      v_fn.args
    );
  END LOOP;
END
$$;

COMMIT;
