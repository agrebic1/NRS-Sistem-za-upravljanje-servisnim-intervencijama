-- ============================================================
-- MIGRACIJA: Supertype/subtype refaktor korisničkog modela
-- ============================================================
-- Iz:  uposlenici (osobni podaci + uloga)
--      korisnik_usluge (osobni podaci)
-- U:   osoba (supertype — svi osobni podaci)
--      uposlenici (subtype — samo id_uloge + jmbg)
--      korisnik_usluge (subtype — samo referenca na osobu)
--
-- Pravila:
--   • Uposlenik MOŽE biti i korisnik_usluge (isti UUID u oba subtypea)
--   • Osobni podaci postoje SAMO u osoba — bez dupliranja
--   • id_uloge postoji samo u uposlenici
--   • Sve FK na child tablama (zahtjev, dodjela, itd.) ostaju nepromijenjene
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 0. PRE-FLIGHT: provjera stanja podataka
-- ────────────────────────────────────────────────────────────

DO $$
DECLARE
  v_up_count   INTEGER;
  v_ku_count   INTEGER;
  v_overlap    INTEGER;
  v_up_no_role INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_up_count FROM public.uposlenici;
  SELECT COUNT(*) INTO v_ku_count FROM public.korisnik_usluge;

  SELECT COUNT(*) INTO v_overlap
  FROM public.uposlenici u
  JOIN public.korisnik_usluge k ON k.id_korisnika_usluge = u.id_uposlenika;

  SELECT COUNT(*) INTO v_up_no_role
  FROM public.uposlenici WHERE id_uloge IS NULL;

  RAISE NOTICE '=== Pre-flight provjera ===';
  RAISE NOTICE 'Uposlenici:         %', v_up_count;
  RAISE NOTICE 'Korisnici usluge:   %', v_ku_count;
  RAISE NOTICE 'Preklapanja (UUID): % (isti čovjek u oba)', v_overlap;
  RAISE NOTICE 'Uposlenici bez uloge: %', v_up_no_role;

  IF v_up_no_role > 0 THEN
    RAISE WARNING
      'Postoje % uposlenika bez id_uloge. NOT NULL constraint neće biti postavljen '
      'dok se to ne ispravi.',
      v_up_no_role;
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- 1. KREIRANJE SUPERTYPE TABELE osoba
-- ────────────────────────────────────────────────────────────

BEGIN;

CREATE TABLE public.osoba (
  id_osobe      UUID         NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  ime           VARCHAR(255) NOT NULL,
  prezime       VARCHAR(255) NOT NULL,
  broj_telefona VARCHAR(50),
  email         VARCHAR(255),
  adresa        VARCHAR(255),
  lozinka_hash  VARCHAR(255)
);

COMMENT ON TABLE  public.osoba             IS 'Supertype: lični podaci svih osoba u sistemu';
COMMENT ON COLUMN public.osoba.id_osobe    IS 'UUID iz auth.users — jedinstven identitet osobe';
COMMENT ON COLUMN public.osoba.lozinka_hash IS 'Hash se čuva samo ako nije korišten Supabase Auth';

-- ────────────────────────────────────────────────────────────
-- 2. MIGRACIJA PODATAKA U osoba
-- ────────────────────────────────────────────────────────────

-- 2a. Najprije uposlenici (imaju prioritet pri preklapanjima)
INSERT INTO public.osoba (id_osobe, ime, prezime, broj_telefona, email, adresa, lozinka_hash)
SELECT
  id_uposlenika,
  COALESCE(ime, 'Nepoznato'),
  COALESCE(prezime, 'Nepoznato'),
  broj_telefona,
  email,
  adresa,
  lozinka_hash
FROM public.uposlenici;

-- 2b. Korisnici usluge — ON CONFLICT DO NOTHING jer uposlenik ima prioritet
INSERT INTO public.osoba (id_osobe, ime, prezime, broj_telefona, email, adresa, lozinka_hash)
SELECT
  id_korisnika_usluge,
  COALESCE(ime, 'Nepoznato'),
  COALESCE(prezime, 'Nepoznato'),
  broj_telefona,
  email,
  adresa,
  lozinka_hash
FROM public.korisnik_usluge
ON CONFLICT (id_osobe) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 3. REFAKTORISANJE: uposlenici → subtype
-- ────────────────────────────────────────────────────────────

-- 3a. Ukloni FK koji pokazuje na auth.users
--     PostgreSQL automatski imenuje: {tabela}_{kolona}_fkey
--     Koristimo dinamičko traženje da ne ovisimo o imenu
DO $$
DECLARE
  v_fk_name TEXT;
BEGIN
  SELECT conname INTO v_fk_name
  FROM pg_constraint
  WHERE conrelid  = 'public.uposlenici'::regclass
    AND contype   = 'f'
    AND conkey    = ARRAY[
      (SELECT attnum FROM pg_attribute
       WHERE attrelid = 'public.uposlenici'::regclass
         AND attname  = 'id_uposlenika')
    ]::smallint[];

  IF v_fk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.uposlenici DROP CONSTRAINT %I', v_fk_name);
    RAISE NOTICE 'Uklonjen FK: %', v_fk_name;
  ELSE
    RAISE NOTICE 'FK na auth.users nije pronađen — možda je već uklonjen.';
  END IF;
END $$;

-- 3b. Dodaj novi FK na osoba
ALTER TABLE public.uposlenici
  ADD CONSTRAINT uposlenici_id_uposlenika_fkey
  FOREIGN KEY (id_uposlenika)
  REFERENCES public.osoba(id_osobe)
  ON DELETE CASCADE;

-- 3c. Ukloni kolone s osobnim podacima iz uposlenici
ALTER TABLE public.uposlenici
  DROP COLUMN IF EXISTS ime,
  DROP COLUMN IF EXISTS prezime,
  DROP COLUMN IF EXISTS broj_telefona,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS adresa,
  DROP COLUMN IF EXISTS lozinka_hash;

-- 3d. Postavi NOT NULL na id_uloge (samo ako nema NULL-ova)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.uposlenici WHERE id_uloge IS NULL) THEN
    ALTER TABLE public.uposlenici ALTER COLUMN id_uloge SET NOT NULL;
    RAISE NOTICE 'NOT NULL postavljen na uposlenici.id_uloge';
  ELSE
    RAISE WARNING
      'Uposlenici bez id_uloge postoje — NOT NULL nije postavljen. '
      'Ispravite podatke i pokrenite: '
      'ALTER TABLE public.uposlenici ALTER COLUMN id_uloge SET NOT NULL;';
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- 4. REFAKTORISANJE: korisnik_usluge → subtype
-- ────────────────────────────────────────────────────────────

-- 4a. Ukloni FK koji pokazuje na auth.users (dinamički)
DO $$
DECLARE
  v_fk_name TEXT;
BEGIN
  SELECT conname INTO v_fk_name
  FROM pg_constraint
  WHERE conrelid  = 'public.korisnik_usluge'::regclass
    AND contype   = 'f'
    AND conkey    = ARRAY[
      (SELECT attnum FROM pg_attribute
       WHERE attrelid = 'public.korisnik_usluge'::regclass
         AND attname  = 'id_korisnika_usluge')
    ]::smallint[];

  IF v_fk_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.korisnik_usluge DROP CONSTRAINT %I', v_fk_name);
    RAISE NOTICE 'Uklonjen FK: %', v_fk_name;
  ELSE
    RAISE NOTICE 'FK na auth.users nije pronađen.';
  END IF;
END $$;

-- 4b. Dodaj novi FK na osoba
ALTER TABLE public.korisnik_usluge
  ADD CONSTRAINT korisnik_usluge_id_korisnika_usluge_fkey
  FOREIGN KEY (id_korisnika_usluge)
  REFERENCES public.osoba(id_osobe)
  ON DELETE CASCADE;

-- 4c. Ukloni sve kolone osim PK (u novom modelu nema dodatnih atributa)
ALTER TABLE public.korisnik_usluge
  DROP COLUMN IF EXISTS ime,
  DROP COLUMN IF EXISTS prezime,
  DROP COLUMN IF EXISTS broj_telefona,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS adresa,
  DROP COLUMN IF EXISTS lozinka_hash,
  DROP COLUMN IF EXISTS id_uloge;    -- id_uloge je samo u uposlenici

-- ────────────────────────────────────────────────────────────
-- 5. AŽURIRANJE TRIGGERA handle_new_user
-- ────────────────────────────────────────────────────────────

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

  -- 1. Uvijek kreirati zapis u supertype tabeli osoba
  INSERT INTO public.osoba (id_osobe, ime, prezime, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'ime', 'Nepoznato'),
    COALESCE(NEW.raw_user_meta_data->>'prezime', 'Nepoznato'),
    NEW.email
  )
  ON CONFLICT (id_osobe) DO NOTHING;

  -- 2. Upisati u odgovarajući subtype
  IF v_uloga IN ('Dispečer', 'Serviser', 'Administrator') THEN
    SELECT id_uloge INTO v_id_uloge
    FROM public.uloga
    WHERE naziv = v_uloga;

    -- Fallback: uloga nije pronađena → log i preskoči
    IF v_id_uloge IS NULL THEN
      RAISE WARNING 'Uloga "%" nije pronađena u tabeli uloga.', v_uloga;
      RETURN NEW;
    END IF;

    INSERT INTO public.uposlenici (id_uposlenika, id_uloge)
    VALUES (NEW.id, v_id_uloge)
    ON CONFLICT (id_uposlenika) DO NOTHING;

  ELSE
    -- Default: Klijent → korisnik_usluge
    INSERT INTO public.korisnik_usluge (id_korisnika_usluge)
    VALUES (NEW.id)
    ON CONFLICT (id_korisnika_usluge) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger ostaje isti (kreiran u prethodnoj migraciji), samo je funkcija ažurirana.
-- Ako iz nekog razloga trigger ne postoji, rekreiraj ga:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
      AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
    RAISE NOTICE 'Trigger on_auth_user_created kreiran.';
  ELSE
    RAISE NOTICE 'Trigger on_auth_user_created već postoji.';
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────
-- 6. BACKWARD COMPATIBILITY VIEW-OVI
--    Aplikacijski kod može koristiti ove view-ove umjesto
--    da odmah mijenja sve SQL upite.
-- ────────────────────────────────────────────────────────────

-- View koji simulira staru strukturu uposlenici tabele
CREATE OR REPLACE VIEW public.v_uposlenici AS
SELECT
  u.id_uposlenika,
  u.id_uloge,
  u.jmbg,
  o.ime,
  o.prezime,
  o.broj_telefona,
  o.email,
  o.adresa,
  o.lozinka_hash
FROM public.uposlenici u
JOIN public.osoba o ON o.id_osobe = u.id_uposlenika;

COMMENT ON VIEW public.v_uposlenici IS
  'Backward compat view — simulira staru uposlenici strukturu. '
  'Koristiti za čitanje; za upis koristiti direktno tabele osoba i uposlenici.';

-- View koji simulira staru strukturu korisnik_usluge tabele
CREATE OR REPLACE VIEW public.v_korisnik_usluge AS
SELECT
  k.id_korisnika_usluge,
  o.ime,
  o.prezime,
  o.broj_telefona,
  o.email,
  o.adresa,
  o.lozinka_hash
FROM public.korisnik_usluge k
JOIN public.osoba o ON o.id_osobe = k.id_korisnika_usluge;

COMMENT ON VIEW public.v_korisnik_usluge IS
  'Backward compat view — simulira staru korisnik_usluge strukturu.';

-- ────────────────────────────────────────────────────────────
-- 7. OPCIONALNI TRIGGER: auto-registracija uposlenika
--    kao korisnika_usluge kada podnese zahtjev
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.registruj_uposlenika_kao_korisnika()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ako podnosilac zahtjeva postoji u uposlenici ali ne u korisnik_usluge,
  -- automatski ga dodaj u korisnik_usluge
  IF NEW.id_korisnika_usluge IS NOT NULL AND
     EXISTS (SELECT 1 FROM public.uposlenici WHERE id_uposlenika = NEW.id_korisnika_usluge) AND
     NOT EXISTS (SELECT 1 FROM public.korisnik_usluge WHERE id_korisnika_usluge = NEW.id_korisnika_usluge)
  THEN
    INSERT INTO public.korisnik_usluge (id_korisnika_usluge)
    VALUES (NEW.id_korisnika_usluge)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_registruj_uposlenika ON public.zahtjev;

CREATE TRIGGER trg_auto_registruj_uposlenika
  BEFORE INSERT ON public.zahtjev
  FOR EACH ROW
  EXECUTE FUNCTION public.registruj_uposlenika_kao_korisnika();

-- ────────────────────────────────────────────────────────────
-- 8. POST-MIGRATION VALIDACIJA
-- ────────────────────────────────────────────────────────────

DO $$
DECLARE
  v_osoba_count       INTEGER;
  v_up_count          INTEGER;
  v_ku_count          INTEGER;
  v_orphan_up         INTEGER;
  v_orphan_ku         INTEGER;
  v_up_no_osoba       INTEGER;
  v_zahtjev_fk_broken INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_osoba_count     FROM public.osoba;
  SELECT COUNT(*) INTO v_up_count        FROM public.uposlenici;
  SELECT COUNT(*) INTO v_ku_count        FROM public.korisnik_usluge;

  -- Uposlenici koji nemaju zapis u osoba
  SELECT COUNT(*) INTO v_orphan_up
  FROM public.uposlenici u
  LEFT JOIN public.osoba o ON o.id_osobe = u.id_uposlenika
  WHERE o.id_osobe IS NULL;

  -- Korisnici usluge koji nemaju zapis u osoba
  SELECT COUNT(*) INTO v_orphan_ku
  FROM public.korisnik_usluge k
  LEFT JOIN public.osoba o ON o.id_osobe = k.id_korisnika_usluge
  WHERE o.id_osobe IS NULL;

  -- Zahtjevi čiji korisnik_usluge ne postoji
  SELECT COUNT(*) INTO v_zahtjev_fk_broken
  FROM public.zahtjev z
  LEFT JOIN public.korisnik_usluge k ON k.id_korisnika_usluge = z.id_korisnika_usluge
  WHERE z.id_korisnika_usluge IS NOT NULL AND k.id_korisnika_usluge IS NULL;

  RAISE NOTICE '=== Rezultati validacije ===';
  RAISE NOTICE 'Osoba:            %', v_osoba_count;
  RAISE NOTICE 'Uposlenici:       %', v_up_count;
  RAISE NOTICE 'Korisnici usluge: %', v_ku_count;
  RAISE NOTICE 'Uposlenici bez osoba:        %', v_orphan_up;
  RAISE NOTICE 'Korisnici bez osoba:         %', v_orphan_ku;
  RAISE NOTICE 'Zahtjevi s broken FK:        %', v_zahtjev_fk_broken;

  IF v_orphan_up > 0 OR v_orphan_ku > 0 OR v_zahtjev_fk_broken > 0 THEN
    RAISE EXCEPTION
      'VALIDACIJA NIJE PROŠLA — postoje nekonzistentni podaci. '
      'Transakcija će biti rollback-ovana.';
  END IF;

  RAISE NOTICE '=== MIGRACIJA USPJEŠNA ===';
  RAISE NOTICE 'Sljedeći korak: regeneriši TypeScript tipove:';
  RAISE NOTICE '  supabase gen types typescript --project-id YOUR_ID > domain/types/supabase.ts';
END $$;

COMMIT;

-- ============================================================
-- ROLLBACK SKRIPTA (pokrenuti MANUELNO ako je potrebno)
-- ============================================================
-- UPOZORENJE: rollback zahtijeva backup osobnih podataka jer
-- su kolone iz uposlenici i korisnik_usluge već droppane.
-- Pokrenuti SAMO ako je transakcija gore FAILOVALA (što ne bi
-- trebalo biti slučaj jer je sve u jednoj transakciji).
--
-- BEGIN;
--
-- DROP TRIGGER IF EXISTS trg_auto_registruj_uposlenika ON public.zahtjev;
-- DROP FUNCTION IF EXISTS public.registruj_uposlenika_kao_korisnika();
-- DROP VIEW  IF EXISTS public.v_uposlenici;
-- DROP VIEW  IF EXISTS public.v_korisnik_usluge;
--
-- -- Vrati FK na uposlenici → auth.users
-- ALTER TABLE public.uposlenici DROP CONSTRAINT IF EXISTS uposlenici_id_uposlenika_fkey;
-- ALTER TABLE public.uposlenici ADD CONSTRAINT uposlenici_id_uposlenika_fkey
--   FOREIGN KEY (id_uposlenika) REFERENCES auth.users(id);
--
-- -- Vrati FK na korisnik_usluge → auth.users
-- ALTER TABLE public.korisnik_usluge DROP CONSTRAINT IF EXISTS korisnik_usluge_id_korisnika_usluge_fkey;
-- ALTER TABLE public.korisnik_usluge ADD CONSTRAINT korisnik_usluge_id_korisnika_usluge_fkey
--   FOREIGN KEY (id_korisnika_usluge) REFERENCES auth.users(id);
--
-- -- Vrati osobne kolone (podaci su izgubljeni ako nema backupa osoba tabele!)
-- ALTER TABLE public.uposlenici
--   ADD COLUMN ime           VARCHAR(255),
--   ADD COLUMN prezime       VARCHAR(255),
--   ADD COLUMN broj_telefona VARCHAR(50),
--   ADD COLUMN email         VARCHAR(255),
--   ADD COLUMN adresa        VARCHAR(255),
--   ADD COLUMN lozinka_hash  VARCHAR(255);
--
-- -- Popuni iz osoba
-- UPDATE public.uposlenici u
-- SET ime           = o.ime,
--     prezime       = o.prezime,
--     broj_telefona = o.broj_telefona,
--     email         = o.email,
--     adresa        = o.adresa,
--     lozinka_hash  = o.lozinka_hash
-- FROM public.osoba o
-- WHERE o.id_osobe = u.id_uposlenika;
--
-- -- Isti postupak za korisnik_usluge (dodaj natrag sve kolone)
-- ALTER TABLE public.korisnik_usluge
--   ADD COLUMN ime           VARCHAR(255),
--   ADD COLUMN prezime       VARCHAR(255),
--   ADD COLUMN broj_telefona VARCHAR(50),
--   ADD COLUMN email         VARCHAR(255),
--   ADD COLUMN adresa        VARCHAR(255),
--   ADD COLUMN lozinka_hash  VARCHAR(255),
--   ADD COLUMN id_uloge      INTEGER REFERENCES public.uloga(id_uloge);
--
-- UPDATE public.korisnik_usluge k
-- SET ime           = o.ime,
--     prezime       = o.prezime,
--     broj_telefona = o.broj_telefona,
--     email         = o.email,
--     adresa        = o.adresa,
--     lozinka_hash  = o.lozinka_hash
-- FROM public.osoba o
-- WHERE o.id_osobe = k.id_korisnika_usluge;
--
-- DROP TABLE IF EXISTS public.osoba CASCADE;
--
-- COMMIT;
-- ============================================================
