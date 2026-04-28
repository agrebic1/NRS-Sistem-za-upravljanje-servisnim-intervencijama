-- Centralized authorization helpers
create or replace function public.is_admin(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.uposlenici u
    join public.uloga ul on ul.id_uloge = u.id_uloge
    where u.id_uposlenika = p_user_id
      and lower(ul.naziv) in ('administrator', 'admin')
  );
$$;

create or replace function public.is_dispecer(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.uposlenici u
    join public.uloga ul on ul.id_uloge = u.id_uloge
    where u.id_uposlenika = p_user_id
      and lower(ul.naziv) in ('dispecer', 'dispečer')
  );
$$;

create or replace function public.is_serviser(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.uposlenici u
    join public.uloga ul on ul.id_uloge = u.id_uloge
    where u.id_uposlenika = p_user_id
      and lower(ul.naziv) = 'serviser'
  );
$$;

create or replace function public.is_uposlenik(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.uposlenici u
    where u.id_uposlenika = p_user_id
  );
$$;

grant execute on function public.is_admin(uuid) to authenticated;
grant execute on function public.is_dispecer(uuid) to authenticated;
grant execute on function public.is_serviser(uuid) to authenticated;
grant execute on function public.is_uposlenik(uuid) to authenticated;

-- Enable RLS
alter table public.uposlenici enable row level security;
alter table public.korisnik_usluge enable row level security;
alter table public.zahtjev enable row level security;
alter table public.intervencija enable row level security;
alter table public.dodjela enable row level security;
alter table public.evidencija_rada enable row level security;
alter table public.historija_aktivnosti enable row level security;
alter table public.napomene enable row level security;
alter table public.status enable row level security;
alter table public.prioritet enable row level security;
alter table public.uloga enable row level security;
alter table public.kategorija_kvara enable row level security;
alter table public.lokacija enable row level security;

-- uposlenici: klijenti ne smiju citati tabelu uposlenici
drop policy if exists uposlenici_select_self_or_admin on public.uposlenici;
create policy uposlenici_select_self_or_admin
on public.uposlenici
for select
to authenticated
using (
  id_uposlenika = auth.uid() or public.is_admin(auth.uid())
);

drop policy if exists uposlenici_update_self_or_admin on public.uposlenici;
create policy uposlenici_update_self_or_admin
on public.uposlenici
for update
to authenticated
using (
  id_uposlenika = auth.uid() or public.is_admin(auth.uid())
)
with check (
  id_uposlenika = auth.uid() or public.is_admin(auth.uid())
);

-- korisnik_usluge: klijent vidi samo svoj profil
drop policy if exists korisnik_usluge_select_self_or_admin on public.korisnik_usluge;
create policy korisnik_usluge_select_self_or_admin
on public.korisnik_usluge
for select
to authenticated
using (
  id_korisnika_usluge = auth.uid() or public.is_admin(auth.uid())
);

drop policy if exists korisnik_usluge_update_self_or_admin on public.korisnik_usluge;
create policy korisnik_usluge_update_self_or_admin
on public.korisnik_usluge
for update
to authenticated
using (
  id_korisnika_usluge = auth.uid() or public.is_admin(auth.uid())
)
with check (
  id_korisnika_usluge = auth.uid() or public.is_admin(auth.uid())
);

-- zahtjev: klijent vidi samo svoje; serviser tek kad je dodijeljen kroz intervenciju/dodjelu
drop policy if exists zahtjev_select_client_or_assigned_serviser_or_admin on public.zahtjev;
create policy zahtjev_select_client_or_assigned_serviser_or_admin
on public.zahtjev
for select
to authenticated
using (
  id_korisnika_usluge = auth.uid()
  or public.is_admin(auth.uid())
  or exists (
    select 1
    from public.intervencija i
    join public.dodjela d on d.id_intervencije = i.id_intervencije
    where i.id_zahtjeva = zahtjev.id_zahtjeva
      and (d.id_servisera = auth.uid() or d.id_pomocnog_servisera = auth.uid())
  )
);

drop policy if exists zahtjev_insert_client_or_admin on public.zahtjev;
create policy zahtjev_insert_client_or_admin
on public.zahtjev
for insert
to authenticated
with check (
  id_korisnika_usluge = auth.uid() or public.is_admin(auth.uid())
);

drop policy if exists zahtjev_update_owner_dispecer_admin on public.zahtjev;
create policy zahtjev_update_owner_dispecer_admin
on public.zahtjev
for update
to authenticated
using (
  id_korisnika_usluge = auth.uid()
  or public.is_dispecer(auth.uid())
  or public.is_admin(auth.uid())
)
with check (
  id_korisnika_usluge = auth.uid()
  or public.is_dispecer(auth.uid())
  or public.is_admin(auth.uid())
);

-- intervencija: dispecer/admin puna kontrola; serviser vidi samo dodijeljene
drop policy if exists intervencija_select_visible_roles on public.intervencija;
create policy intervencija_select_visible_roles
on public.intervencija
for select
to authenticated
using (
  public.is_admin(auth.uid())
  or id_dispecera = auth.uid()
  or exists (
    select 1
    from public.dodjela d
    where d.id_intervencije = intervencija.id_intervencije
      and (d.id_servisera = auth.uid() or d.id_pomocnog_servisera = auth.uid())
  )
  or exists (
    select 1
    from public.zahtjev z
    where z.id_zahtjeva = intervencija.id_zahtjeva
      and z.id_korisnika_usluge = auth.uid()
  )
);

drop policy if exists intervencija_write_dispecer_or_admin on public.intervencija;
create policy intervencija_write_dispecer_or_admin
on public.intervencija
for all
to authenticated
using (
  public.is_dispecer(auth.uid()) or public.is_admin(auth.uid())
)
with check (
  public.is_dispecer(auth.uid()) or public.is_admin(auth.uid())
);

-- dodjela: serviser vidi svoje dodjele; dispecer vidi dodjele koje je napravio; admin vidi sve
drop policy if exists dodjela_select_assigned_or_author_or_admin on public.dodjela;
create policy dodjela_select_assigned_or_author_or_admin
on public.dodjela
for select
to authenticated
using (
  id_servisera = auth.uid()
  or id_pomocnog_servisera = auth.uid()
  or id_dispecera = auth.uid()
  or public.is_admin(auth.uid())
);

drop policy if exists dodjela_write_dispecer_or_admin on public.dodjela;
create policy dodjela_write_dispecer_or_admin
on public.dodjela
for all
to authenticated
using (
  id_dispecera = auth.uid() or public.is_admin(auth.uid())
)
with check (
  id_dispecera = auth.uid() or public.is_admin(auth.uid())
);

-- evidencija_rada: samo dodijeljeni serviser (ili admin) moze unositi i mijenjati
drop policy if exists evidencija_select_visible_roles on public.evidencija_rada;
create policy evidencija_select_visible_roles
on public.evidencija_rada
for select
to authenticated
using (
  public.is_admin(auth.uid())
  or id_servisera = auth.uid()
  or exists (
    select 1
    from public.dodjela d
    where d.id_intervencije = evidencija_rada.id_intervencije
      and (d.id_servisera = auth.uid() or d.id_pomocnog_servisera = auth.uid())
  )
);

drop policy if exists evidencija_insert_assigned_serviser_or_admin on public.evidencija_rada;
create policy evidencija_insert_assigned_serviser_or_admin
on public.evidencija_rada
for insert
to authenticated
with check (
  public.is_admin(auth.uid())
  or (
    id_servisera = auth.uid()
    and exists (
      select 1
      from public.dodjela d
      where d.id_intervencije = evidencija_rada.id_intervencije
        and (d.id_servisera = auth.uid() or d.id_pomocnog_servisera = auth.uid())
    )
  )
);

drop policy if exists evidencija_update_assigned_serviser_or_admin on public.evidencija_rada;
create policy evidencija_update_assigned_serviser_or_admin
on public.evidencija_rada
for update
to authenticated
using (
  public.is_admin(auth.uid())
  or (
    id_servisera = auth.uid()
    and exists (
      select 1
      from public.dodjela d
      where d.id_intervencije = evidencija_rada.id_intervencije
        and (d.id_servisera = auth.uid() or d.id_pomocnog_servisera = auth.uid())
    )
  )
)
with check (
  public.is_admin(auth.uid())
  or (
    id_servisera = auth.uid()
    and exists (
      select 1
      from public.dodjela d
      where d.id_intervencije = evidencija_rada.id_intervencije
        and (d.id_servisera = auth.uid() or d.id_pomocnog_servisera = auth.uid())
    )
  )
);

-- historija_aktivnosti: admin vidi sve; uposlenici read-only prema intervencijama gdje ucestvuju
drop policy if exists historija_select_admin_or_related_uposlenik on public.historija_aktivnosti;
create policy historija_select_admin_or_related_uposlenik
on public.historija_aktivnosti
for select
to authenticated
using (
  public.is_admin(auth.uid())
  or (
    public.is_uposlenik(auth.uid())
    and (
      id_autora = auth.uid()
      or exists (
        select 1
        from public.intervencija i
        left join public.dodjela d on d.id_intervencije = i.id_intervencije
        where i.id_intervencije = historija_aktivnosti.id_intervencije
          and (i.id_dispecera = auth.uid() or d.id_servisera = auth.uid() or d.id_pomocnog_servisera = auth.uid())
      )
    )
  )
);

drop policy if exists historija_insert_uposlenik_or_admin on public.historija_aktivnosti;
create policy historija_insert_uposlenik_or_admin
on public.historija_aktivnosti
for insert
to authenticated
with check (
  public.is_uposlenik(auth.uid()) and id_autora = auth.uid()
);

drop policy if exists historija_update_admin_only on public.historija_aktivnosti;
create policy historija_update_admin_only
on public.historija_aktivnosti
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists historija_delete_admin_only on public.historija_aktivnosti;
create policy historija_delete_admin_only
on public.historija_aktivnosti
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- napomene: svi ulogovani citaju; autor ili admin mijenja/brise
drop policy if exists napomene_select_authenticated on public.napomene;
create policy napomene_select_authenticated
on public.napomene
for select
to authenticated
using (true);

drop policy if exists napomene_insert_author_or_admin on public.napomene;
create policy napomene_insert_author_or_admin
on public.napomene
for insert
to authenticated
with check (
  id_autora = auth.uid() or public.is_admin(auth.uid())
);

drop policy if exists napomene_update_author_or_admin on public.napomene;
create policy napomene_update_author_or_admin
on public.napomene
for update
to authenticated
using (
  id_autora = auth.uid() or public.is_admin(auth.uid())
)
with check (
  id_autora = auth.uid() or public.is_admin(auth.uid())
);

drop policy if exists napomene_delete_author_or_admin on public.napomene;
create policy napomene_delete_author_or_admin
on public.napomene
for delete
to authenticated
using (
  id_autora = auth.uid() or public.is_admin(auth.uid())
);

-- sifrarnici: authenticated read, admin write
drop policy if exists status_select_authenticated on public.status;
create policy status_select_authenticated on public.status for select to authenticated using (true);
drop policy if exists status_write_admin on public.status;
create policy status_write_admin
on public.status
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists prioritet_select_authenticated on public.prioritet;
create policy prioritet_select_authenticated on public.prioritet for select to authenticated using (true);
drop policy if exists prioritet_write_admin on public.prioritet;
create policy prioritet_write_admin
on public.prioritet
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists kategorija_kvara_select_authenticated on public.kategorija_kvara;
create policy kategorija_kvara_select_authenticated on public.kategorija_kvara for select to authenticated using (true);
drop policy if exists kategorija_kvara_write_admin on public.kategorija_kvara;
create policy kategorija_kvara_write_admin
on public.kategorija_kvara
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists uloga_select_authenticated on public.uloga;
create policy uloga_select_authenticated on public.uloga for select to authenticated using (true);
drop policy if exists uloga_write_admin on public.uloga;
create policy uloga_write_admin
on public.uloga
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists lokacija_select_authenticated on public.lokacija;
create policy lokacija_select_authenticated on public.lokacija for select to authenticated using (true);
drop policy if exists lokacija_write_admin on public.lokacija;
create policy lokacija_write_admin
on public.lokacija
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
