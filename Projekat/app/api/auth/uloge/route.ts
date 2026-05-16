import { NextResponse } from 'next/server';
import type { UserRole } from '@/domain/types';
import { createClient } from '@/lib/supabase/server';

function mapirajNazivUloge(naziv: string | null | undefined): UserRole | null {
  const normalizovanNaziv = naziv?.toLowerCase();

  switch (normalizovanNaziv) {
    case 'klijent':
    case 'korisnik':
    case 'korisnik usluge':
      return 'korisnik';
    case 'serviser':
      return 'serviser';
    case 'dispecer':
    case 'dispečer':
      return 'dispecer';
    case 'administrator':
    case 'admin':
      return 'admin';
    default:
      return null;
  }
}

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: greskaKorisnika,
    } = await supabase.auth.getUser();

    if (greskaKorisnika || !user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const db = supabase as any;
    const uloge: UserRole[] = [];

    const { data: korisnikUsluge, error: greskaKorisnikaUsluge } = await db
      .from('korisnik_usluge')
      .select('id_korisnika_usluge')
      .eq('id_korisnika_usluge', user.id)
      .maybeSingle();

    if (greskaKorisnikaUsluge) {
      return NextResponse.json({ error: greskaKorisnikaUsluge.message }, { status: 500 });
    }

    if (korisnikUsluge) {
      uloge.push('korisnik');
    }

    const { data: uposlenik, error: greskaUposlenika } = await db
      .from('uposlenici')
      .select('id_uloge')
      .eq('id_uposlenika', user.id)
      .maybeSingle();

    if (greskaUposlenika) {
      return NextResponse.json({ error: greskaUposlenika.message }, { status: 500 });
    }

    if (uposlenik?.id_uloge) {
      const { data: ulogaPodaci, error: greskaUloge } = await db
        .from('uloga')
        .select('naziv')
        .eq('id_uloge', uposlenik.id_uloge)
        .maybeSingle();

      if (greskaUloge) {
        return NextResponse.json({ error: greskaUloge.message }, { status: 500 });
      }

      const uloga = mapirajNazivUloge(ulogaPodaci?.naziv);

      if (uloga && !uloge.includes(uloga)) {
        uloge.push(uloga);
      }
    }

    return NextResponse.json({ uloge });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nije moguce ucitati uloge.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
