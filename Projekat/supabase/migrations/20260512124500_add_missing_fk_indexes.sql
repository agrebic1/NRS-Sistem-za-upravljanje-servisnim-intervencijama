BEGIN;

-- Covering indexes for foreign keys flagged by Supabase linter.

-- dodjela
CREATE INDEX IF NOT EXISTS idx_dodjela_id_dispecera ON public.dodjela (id_dispecera);
CREATE INDEX IF NOT EXISTS idx_dodjela_id_intervencije ON public.dodjela (id_intervencije);
CREATE INDEX IF NOT EXISTS idx_dodjela_id_pomocnog_servisera ON public.dodjela (id_pomocnog_servisera);
CREATE INDEX IF NOT EXISTS idx_dodjela_id_servisera ON public.dodjela (id_servisera);
CREATE INDEX IF NOT EXISTS idx_dodjela_id_statusa ON public.dodjela (id_statusa);

-- evidencija_rada
CREATE INDEX IF NOT EXISTS idx_evidencija_rada_id_intervencije ON public.evidencija_rada (id_intervencije);
CREATE INDEX IF NOT EXISTS idx_evidencija_rada_id_servisera ON public.evidencija_rada (id_servisera);

-- historija_aktivnosti
CREATE INDEX IF NOT EXISTS idx_historija_aktivnosti_id_intervencije ON public.historija_aktivnosti (id_intervencije);

-- intervencija
CREATE INDEX IF NOT EXISTS idx_intervencija_id_dispecera ON public.intervencija (id_dispecera);
CREATE INDEX IF NOT EXISTS idx_intervencija_id_prioriteta ON public.intervencija (id_prioriteta);
CREATE INDEX IF NOT EXISTS idx_intervencija_id_statusa ON public.intervencija (id_statusa);
CREATE INDEX IF NOT EXISTS idx_intervencija_id_zahtjeva ON public.intervencija (id_zahtjeva);

-- napomene
CREATE INDEX IF NOT EXISTS idx_napomene_id_autora ON public.napomene (id_autora);
CREATE INDEX IF NOT EXISTS idx_napomene_id_intervencije ON public.napomene (id_intervencije);

-- uposlenici
CREATE INDEX IF NOT EXISTS idx_uposlenici_id_uloge ON public.uposlenici (id_uloge);

-- zahtjev
CREATE INDEX IF NOT EXISTS idx_zahtjev_id_kategorije_kvara ON public.zahtjev (id_kategorije_kvara);
CREATE INDEX IF NOT EXISTS idx_zahtjev_id_korisnika_usluge ON public.zahtjev (id_korisnika_usluge);
CREATE INDEX IF NOT EXISTS idx_zahtjev_id_lokacije ON public.zahtjev (id_lokacije);
CREATE INDEX IF NOT EXISTS idx_zahtjev_id_statusa ON public.zahtjev (id_statusa);

COMMIT;
