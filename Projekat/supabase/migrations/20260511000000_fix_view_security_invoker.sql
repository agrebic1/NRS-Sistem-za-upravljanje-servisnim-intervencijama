BEGIN;

-- Fix Supabase lint: security_definer_view
-- Views should enforce RLS and permissions of querying user.
ALTER VIEW public.v_dispecer_zahtjevi SET (security_invoker = true);
ALTER VIEW public.v_uposlenici SET (security_invoker = true);
ALTER VIEW public.v_korisnik_usluge SET (security_invoker = true);

COMMIT;
