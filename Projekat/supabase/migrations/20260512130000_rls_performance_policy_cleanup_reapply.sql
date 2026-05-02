BEGIN;

-- Reapply RLS performance cleanup in a new migration version.
-- Needed when previous migration file was edited after being applied.

-- ------------------------------------------------------------
-- 1) auth_rls_initplan: wrap auth.uid() calls with SELECT
-- ------------------------------------------------------------

DROP POLICY IF EXISTS uposlenici_select_self_or_admin ON public.uposlenici;
CREATE POLICY uposlenici_select_self_or_admin
ON public.uposlenici
FOR SELECT
TO authenticated
USING (
  id_uposlenika = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS uposlenici_update_self_or_admin ON public.uposlenici;
CREATE POLICY uposlenici_update_self_or_admin
ON public.uposlenici
FOR UPDATE
TO authenticated
USING (
  id_uposlenika = (select auth.uid()) OR public.is_admin((select auth.uid()))
)
WITH CHECK (
  id_uposlenika = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS korisnik_usluge_select_self_or_admin ON public.korisnik_usluge;
CREATE POLICY korisnik_usluge_select_self_or_admin
ON public.korisnik_usluge
FOR SELECT
TO authenticated
USING (
  id_korisnika_usluge = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS korisnik_usluge_update_self_or_admin ON public.korisnik_usluge;
CREATE POLICY korisnik_usluge_update_self_or_admin
ON public.korisnik_usluge
FOR UPDATE
TO authenticated
USING (
  id_korisnika_usluge = (select auth.uid()) OR public.is_admin((select auth.uid()))
)
WITH CHECK (
  id_korisnika_usluge = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS zahtjev_select_client_or_assigned_serviser_or_admin ON public.zahtjev;
CREATE POLICY zahtjev_select_client_or_assigned_serviser_or_admin
ON public.zahtjev
FOR SELECT
TO authenticated
USING (
  id_korisnika_usluge = (select auth.uid())
  OR public.is_admin((select auth.uid()))
  OR EXISTS (
    SELECT 1
    FROM public.intervencija i
    JOIN public.dodjela d ON d.id_intervencije = i.id_intervencije
    WHERE i.id_zahtjeva = zahtjev.id_zahtjeva
      AND (d.id_servisera = (select auth.uid()) OR d.id_pomocnog_servisera = (select auth.uid()))
  )
);

DROP POLICY IF EXISTS zahtjev_insert_client_or_admin ON public.zahtjev;
CREATE POLICY zahtjev_insert_client_or_admin
ON public.zahtjev
FOR INSERT
TO authenticated
WITH CHECK (
  id_korisnika_usluge = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS zahtjev_update_owner_dispecer_admin ON public.zahtjev;
CREATE POLICY zahtjev_update_owner_dispecer_admin
ON public.zahtjev
FOR UPDATE
TO authenticated
USING (
  id_korisnika_usluge = (select auth.uid())
  OR public.is_dispecer((select auth.uid()))
  OR public.is_admin((select auth.uid()))
)
WITH CHECK (
  id_korisnika_usluge = (select auth.uid())
  OR public.is_dispecer((select auth.uid()))
  OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS dodjela_select_assigned_or_author_or_admin ON public.dodjela;
CREATE POLICY dodjela_select_assigned_or_author_or_admin
ON public.dodjela
FOR SELECT
TO authenticated
USING (
  id_servisera = (select auth.uid())
  OR id_pomocnog_servisera = (select auth.uid())
  OR id_dispecera = (select auth.uid())
  OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS intervencija_select_visible_roles ON public.intervencija;
CREATE POLICY intervencija_select_visible_roles
ON public.intervencija
FOR SELECT
TO authenticated
USING (
  public.is_admin((select auth.uid()))
  OR id_dispecera = (select auth.uid())
  OR EXISTS (
    SELECT 1
    FROM public.dodjela d
    WHERE d.id_intervencije = intervencija.id_intervencije
      AND (d.id_servisera = (select auth.uid()) OR d.id_pomocnog_servisera = (select auth.uid()))
  )
  OR EXISTS (
    SELECT 1
    FROM public.zahtjev z
    WHERE z.id_zahtjeva = intervencija.id_zahtjeva
      AND z.id_korisnika_usluge = (select auth.uid())
  )
);

DROP POLICY IF EXISTS evidencija_select_visible_roles ON public.evidencija_rada;
CREATE POLICY evidencija_select_visible_roles
ON public.evidencija_rada
FOR SELECT
TO authenticated
USING (
  public.is_admin((select auth.uid()))
  OR id_servisera = (select auth.uid())
  OR EXISTS (
    SELECT 1
    FROM public.dodjela d
    WHERE d.id_intervencije = evidencija_rada.id_intervencije
      AND (d.id_servisera = (select auth.uid()) OR d.id_pomocnog_servisera = (select auth.uid()))
  )
);

DROP POLICY IF EXISTS evidencija_insert_assigned_serviser_or_admin ON public.evidencija_rada;
CREATE POLICY evidencija_insert_assigned_serviser_or_admin
ON public.evidencija_rada
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin((select auth.uid()))
  OR (
    id_servisera = (select auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.dodjela d
      WHERE d.id_intervencije = evidencija_rada.id_intervencije
        AND (d.id_servisera = (select auth.uid()) OR d.id_pomocnog_servisera = (select auth.uid()))
    )
  )
);

DROP POLICY IF EXISTS evidencija_update_assigned_serviser_or_admin ON public.evidencija_rada;
CREATE POLICY evidencija_update_assigned_serviser_or_admin
ON public.evidencija_rada
FOR UPDATE
TO authenticated
USING (
  public.is_admin((select auth.uid()))
  OR (
    id_servisera = (select auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.dodjela d
      WHERE d.id_intervencije = evidencija_rada.id_intervencije
        AND (d.id_servisera = (select auth.uid()) OR d.id_pomocnog_servisera = (select auth.uid()))
    )
  )
)
WITH CHECK (
  public.is_admin((select auth.uid()))
  OR (
    id_servisera = (select auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.dodjela d
      WHERE d.id_intervencije = evidencija_rada.id_intervencije
        AND (d.id_servisera = (select auth.uid()) OR d.id_pomocnog_servisera = (select auth.uid()))
    )
  )
);

DROP POLICY IF EXISTS historija_select_admin_or_related_uposlenik ON public.historija_aktivnosti;
CREATE POLICY historija_select_admin_or_related_uposlenik
ON public.historija_aktivnosti
FOR SELECT
TO authenticated
USING (
  public.is_admin((select auth.uid()))
  OR (
    public.is_uposlenik((select auth.uid()))
    AND (
      id_autora = (select auth.uid())
      OR EXISTS (
        SELECT 1
        FROM public.intervencija i
        LEFT JOIN public.dodjela d ON d.id_intervencije = i.id_intervencije
        WHERE i.id_intervencije = historija_aktivnosti.id_intervencije
          AND (
            i.id_dispecera = (select auth.uid())
            OR d.id_servisera = (select auth.uid())
            OR d.id_pomocnog_servisera = (select auth.uid())
          )
      )
    )
  )
);

DROP POLICY IF EXISTS historija_insert_uposlenik_or_admin ON public.historija_aktivnosti;
CREATE POLICY historija_insert_uposlenik_or_admin
ON public.historija_aktivnosti
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_uposlenik((select auth.uid())) AND id_autora = (select auth.uid())
);

DROP POLICY IF EXISTS historija_update_admin_only ON public.historija_aktivnosti;
CREATE POLICY historija_update_admin_only
ON public.historija_aktivnosti
FOR UPDATE
TO authenticated
USING (public.is_admin((select auth.uid())))
WITH CHECK (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS historija_delete_admin_only ON public.historija_aktivnosti;
CREATE POLICY historija_delete_admin_only
ON public.historija_aktivnosti
FOR DELETE
TO authenticated
USING (public.is_admin((select auth.uid())));

DROP POLICY IF EXISTS napomene_insert_author_or_admin ON public.napomene;
CREATE POLICY napomene_insert_author_or_admin
ON public.napomene
FOR INSERT
TO authenticated
WITH CHECK (
  id_autora = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS napomene_update_author_or_admin ON public.napomene;
CREATE POLICY napomene_update_author_or_admin
ON public.napomene
FOR UPDATE
TO authenticated
USING (
  id_autora = (select auth.uid()) OR public.is_admin((select auth.uid()))
)
WITH CHECK (
  id_autora = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS napomene_delete_author_or_admin ON public.napomene;
CREATE POLICY napomene_delete_author_or_admin
ON public.napomene
FOR DELETE
TO authenticated
USING (
  id_autora = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS osoba_select_self_or_admin ON public.osoba;
CREATE POLICY osoba_select_self_or_admin
ON public.osoba
FOR SELECT
TO authenticated
USING (
  id_osobe = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

DROP POLICY IF EXISTS osoba_update_self_or_admin ON public.osoba;
CREATE POLICY osoba_update_self_or_admin
ON public.osoba
FOR UPDATE
TO authenticated
USING (
  id_osobe = (select auth.uid()) OR public.is_admin((select auth.uid()))
)
WITH CHECK (
  id_osobe = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

-- service_requests: merge two SELECT policies into one (same behavior, better performance)
DROP POLICY IF EXISTS service_requests_user_select ON public.service_requests;
DROP POLICY IF EXISTS service_requests_staff_select ON public.service_requests;
CREATE POLICY service_requests_select_visible_roles
ON public.service_requests
FOR SELECT
TO authenticated
USING (
  user_id = (select auth.uid())
  OR EXISTS (
    SELECT 1
    FROM public.uposlenici u
    JOIN public.uloga ul ON ul.id_uloge = u.id_uloge
    WHERE u.id_uposlenika = (select auth.uid())
      AND ul.naziv IN ('Administrator', 'admin', 'Dispečer', 'Serviser')
  )
);

DROP POLICY IF EXISTS service_requests_user_insert ON public.service_requests;
CREATE POLICY service_requests_user_insert
ON public.service_requests
FOR INSERT
TO authenticated
WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS service_requests_user_update ON public.service_requests;
CREATE POLICY service_requests_user_update
ON public.service_requests
FOR UPDATE
TO authenticated
USING (user_id = (select auth.uid()) AND status = 'na_cekanju')
WITH CHECK (user_id = (select auth.uid()));

-- partner_applications: keep anonymous insert only for anon role,
-- avoid duplicate permissive INSERT policies for authenticated.
DROP POLICY IF EXISTS partner_apps_insert_anon ON public.partner_applications;
CREATE POLICY partner_apps_insert_anon
  ON public.partner_applications FOR INSERT
  TO anon
  WITH CHECK (status = 'na_cekanju');

DROP POLICY IF EXISTS partner_apps_admin_all ON public.partner_applications;
CREATE POLICY partner_apps_admin_all
ON public.partner_applications
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.uposlenici u
    JOIN public.uloga ul ON ul.id_uloge = u.id_uloge
    WHERE u.id_uposlenika = (select auth.uid())
      AND ul.naziv IN ('Administrator', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.uposlenici u
    JOIN public.uloga ul ON ul.id_uloge = u.id_uloge
    WHERE u.id_uposlenika = (select auth.uid())
      AND ul.naziv IN ('Administrator', 'admin')
  )
);

-- ------------------------------------------------------------
-- 2) multiple_permissive_policies: replace FOR ALL write policies
-- with dedicated INSERT/UPDATE/DELETE policies (no duplicate SELECT)
-- ------------------------------------------------------------

-- dodjela
DROP POLICY IF EXISTS dodjela_write_dispecer_or_admin ON public.dodjela;
CREATE POLICY dodjela_insert_dispecer_or_admin
ON public.dodjela
FOR INSERT
TO authenticated
WITH CHECK (
  id_dispecera = (select auth.uid()) OR public.is_admin((select auth.uid()))
);
CREATE POLICY dodjela_update_dispecer_or_admin
ON public.dodjela
FOR UPDATE
TO authenticated
USING (
  id_dispecera = (select auth.uid()) OR public.is_admin((select auth.uid()))
)
WITH CHECK (
  id_dispecera = (select auth.uid()) OR public.is_admin((select auth.uid()))
);
CREATE POLICY dodjela_delete_dispecer_or_admin
ON public.dodjela
FOR DELETE
TO authenticated
USING (
  id_dispecera = (select auth.uid()) OR public.is_admin((select auth.uid()))
);

-- intervencija
DROP POLICY IF EXISTS intervencija_write_dispecer_or_admin ON public.intervencija;
CREATE POLICY intervencija_insert_dispecer_or_admin
ON public.intervencija
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_dispecer((select auth.uid())) OR public.is_admin((select auth.uid()))
);
CREATE POLICY intervencija_update_dispecer_or_admin
ON public.intervencija
FOR UPDATE
TO authenticated
USING (
  public.is_dispecer((select auth.uid())) OR public.is_admin((select auth.uid()))
)
WITH CHECK (
  public.is_dispecer((select auth.uid())) OR public.is_admin((select auth.uid()))
);
CREATE POLICY intervencija_delete_dispecer_or_admin
ON public.intervencija
FOR DELETE
TO authenticated
USING (
  public.is_dispecer((select auth.uid())) OR public.is_admin((select auth.uid()))
);

-- status
DROP POLICY IF EXISTS status_write_admin ON public.status;
CREATE POLICY status_insert_admin
ON public.status
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY status_update_admin
ON public.status
FOR UPDATE
TO authenticated
USING (public.is_admin((select auth.uid())))
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY status_delete_admin
ON public.status
FOR DELETE
TO authenticated
USING (public.is_admin((select auth.uid())));

-- prioritet
DROP POLICY IF EXISTS prioritet_write_admin ON public.prioritet;
CREATE POLICY prioritet_insert_admin
ON public.prioritet
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY prioritet_update_admin
ON public.prioritet
FOR UPDATE
TO authenticated
USING (public.is_admin((select auth.uid())))
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY prioritet_delete_admin
ON public.prioritet
FOR DELETE
TO authenticated
USING (public.is_admin((select auth.uid())));

-- kategorija_kvara
DROP POLICY IF EXISTS kategorija_kvara_write_admin ON public.kategorija_kvara;
CREATE POLICY kategorija_kvara_insert_admin
ON public.kategorija_kvara
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY kategorija_kvara_update_admin
ON public.kategorija_kvara
FOR UPDATE
TO authenticated
USING (public.is_admin((select auth.uid())))
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY kategorija_kvara_delete_admin
ON public.kategorija_kvara
FOR DELETE
TO authenticated
USING (public.is_admin((select auth.uid())));

-- uloga
DROP POLICY IF EXISTS uloga_write_admin ON public.uloga;
CREATE POLICY uloga_insert_admin
ON public.uloga
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY uloga_update_admin
ON public.uloga
FOR UPDATE
TO authenticated
USING (public.is_admin((select auth.uid())))
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY uloga_delete_admin
ON public.uloga
FOR DELETE
TO authenticated
USING (public.is_admin((select auth.uid())));

-- lokacija
DROP POLICY IF EXISTS lokacija_write_admin ON public.lokacija;
CREATE POLICY lokacija_insert_admin
ON public.lokacija
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY lokacija_update_admin
ON public.lokacija
FOR UPDATE
TO authenticated
USING (public.is_admin((select auth.uid())))
WITH CHECK (public.is_admin((select auth.uid())));
CREATE POLICY lokacija_delete_admin
ON public.lokacija
FOR DELETE
TO authenticated
USING (public.is_admin((select auth.uid())));

COMMIT;
