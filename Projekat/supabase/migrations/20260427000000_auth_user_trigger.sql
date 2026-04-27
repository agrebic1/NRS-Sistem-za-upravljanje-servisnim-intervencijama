-- Unique index enables ON CONFLICT (naziv) in seed below; idx_ prefix per project convention
CREATE UNIQUE INDEX IF NOT EXISTS idx_uloga_naziv ON public.uloga (naziv);

-- Seed initial roles (idempotent)
INSERT INTO public.uloga (naziv, opis) VALUES
  ('Klijent',       'Korisnik usluge koji podnosi zahtjeve'),
  ('Dispečer',      'Uposlenik koji koordinira intervencije'),
  ('Serviser',      'Uposlenik koji izvršava intervencije'),
  ('Administrator', 'Sistemski administrator sa punim pristupom')
ON CONFLICT (naziv) DO NOTHING;

-- Routes every new auth.users row to the correct profile table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uloga    TEXT;
  v_id_uloge INTEGER;
BEGIN
  v_uloga := COALESCE(NEW.raw_user_meta_data->>'uloga', 'Klijent');

  SELECT id_uloge INTO v_id_uloge
  FROM public.uloga
  WHERE naziv = v_uloga;

  -- Unknown role → fallback to Klijent
  IF v_id_uloge IS NULL THEN
    v_uloga := 'Klijent';
    SELECT id_uloge INTO v_id_uloge FROM public.uloga WHERE naziv = 'Klijent';
  END IF;

  IF v_uloga IN ('Dispečer', 'Serviser', 'Administrator') THEN
    INSERT INTO public.uposlenici (id_uposlenika, ime, prezime, email, id_uloge)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'ime',     'Nepoznato'),
      COALESCE(NEW.raw_user_meta_data->>'prezime', 'Nepoznato'),
      NEW.email,
      v_id_uloge
    );
  ELSE
    INSERT INTO public.korisnik_usluge (id_korisnika_usluge, ime, prezime, email, id_uloge)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'ime',     'Nepoznato'),
      COALESCE(NEW.raw_user_meta_data->>'prezime', 'Nepoznato'),
      NEW.email,
      v_id_uloge
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
