-- PREREQUISITE: Kreirati nalog za aicic1@etf.unsa.ba putem Supabase Auth
-- (Dashboard → Authentication → Users → "Add user")
-- Zatim pokrenuti: supabase db push  ili  supabase migration up

DO $$
DECLARE
  v_user_id UUID;
  v_role_id INTEGER;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'aicic1@etf.unsa.ba';

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Korisnik aicic1@etf.unsa.ba nije pronađen u auth.users. Pokrenite migraciju ponovo nakon kreiranja naloga.';
    RETURN;
  END IF;

  SELECT id_uloge INTO v_role_id
  FROM public.uloga
  WHERE naziv = 'Administrator';

  -- Cleanup: ukloni iz korisnik_usluge ako je ranije registriran kao klijent
  DELETE FROM public.korisnik_usluge
  WHERE id_korisnika_usluge = v_user_id;

  INSERT INTO public.uposlenici (id_uposlenika, ime, prezime, email, id_uloge)
  VALUES (v_user_id, 'Admin', 'Sistema', 'aicic1@etf.unsa.ba', v_role_id)
  ON CONFLICT (id_uposlenika) DO UPDATE
    SET id_uloge = EXCLUDED.id_uloge,
        email    = EXCLUDED.email;

  RAISE NOTICE 'Administrator nalog uspješno postavljen: %', v_user_id;
END $$;
