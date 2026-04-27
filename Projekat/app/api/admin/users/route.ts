import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type StatusKorisnika = 'aktivan' | 'neaktivan' | 'suspendovan';

interface ProfilKorisnika {
  id: string;
  ime: string | null;
  prezime: string | null;
  email: string | null;
  uloga: string | null;
  tip: 'korisnik' | 'uposlenik';
}

function procitajNazivUloge(
  uloga: { naziv?: string | null } | { naziv?: string | null }[] | null | undefined,
  fallback: string
) {
  const zapis = Array.isArray(uloga) ? uloga[0] : uloga;
  return zapis?.naziv ?? fallback;
}

function formatirajDatum(vrijednost: string | null | undefined) {
  if (!vrijednost) return '-';

  return new Intl.DateTimeFormat('bs-BA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(vrijednost));
}

function odrediStatus(user: { banned_until?: string | null; email_confirmed_at?: string | null; confirmed_at?: string | null }): StatusKorisnika {
  if (user.banned_until && new Date(user.banned_until) > new Date()) {
    return 'suspendovan';
  }

  if (user.email_confirmed_at || user.confirmed_at) {
    return 'aktivan';
  }

  return 'neaktivan';
}

async function provjeriAdminPristup(supabase: ReturnType<typeof createAdminClient>, idKorisnika: string) {
  const { data, error } = await supabase
    .from('uposlenici')
    .select('uloga(naziv)')
    .eq('id_uposlenika', idKorisnika)
    .maybeSingle();

  if (error) return false;

  const nazivUloge = procitajNazivUloge(data?.uloga, '');
  return nazivUloge === 'Administrator' || nazivUloge === 'admin';
}

export async function GET() {
  try {
    const supabaseSesija = createServerClient();
    const {
      data: { user },
    } = await supabaseSesija.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const jeAdmin = await provjeriAdminPristup(supabase, user.id);

    if (!jeAdmin) {
      return NextResponse.json({ error: 'Nemate dozvolu za pregled korisnika.' }, { status: 403 });
    }

    const [{ data: authPodaci, error: authGreska }, { data: korisnici, error: korisniciGreska }, { data: uposlenici, error: uposleniciGreska }] =
      await Promise.all([
        supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        supabase
          .from('korisnik_usluge')
          .select('id_korisnika_usluge, ime, prezime, email, uloga(naziv)'),
        supabase
          .from('uposlenici')
          .select('id_uposlenika, ime, prezime, email, uloga(naziv)'),
      ]);

    if (authGreska) {
      return NextResponse.json({ error: authGreska.message }, { status: 500 });
    }

    if (korisniciGreska) {
      return NextResponse.json({ error: korisniciGreska.message }, { status: 500 });
    }

    if (uposleniciGreska) {
      return NextResponse.json({ error: uposleniciGreska.message }, { status: 500 });
    }

    const profili = new Map<string, ProfilKorisnika>();

    for (const korisnik of korisnici ?? []) {
      profili.set(korisnik.id_korisnika_usluge, {
        id: korisnik.id_korisnika_usluge,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        uloga: procitajNazivUloge(korisnik.uloga, 'Korisnik usluge'),
        tip: 'korisnik',
      });
    }

    for (const uposlenik of uposlenici ?? []) {
      profili.set(uposlenik.id_uposlenika, {
        id: uposlenik.id_uposlenika,
        ime: uposlenik.ime,
        prezime: uposlenik.prezime,
        email: uposlenik.email,
        uloga: procitajNazivUloge(uposlenik.uloga, 'Uposlenik'),
        tip: 'uposlenik',
      });
    }

    const users = authPodaci.users.map((user) => {
      const profil = profili.get(user.id);
      const ime = profil?.ime ?? user.user_metadata?.ime ?? '';
      const prezime = profil?.prezime ?? user.user_metadata?.prezime ?? '';
      const imeIPrezime = `${ime} ${prezime}`.trim() || user.email || 'Nepoznat korisnik';

      return {
        id: user.id,
        imeIPrezime,
        email: profil?.email ?? user.email ?? '-',
        uloga: profil?.uloga ?? 'Bez uloge',
        status: odrediStatus(user),
        datumRegistracije: formatirajDatum(user.created_at),
        tip: profil?.tip ?? 'korisnik',
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nije moguce ucitati korisnike.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
