import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { profilUpdateSchema } from '@/lib/validations/servisirane';

export const dynamic = 'force-dynamic';

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

    // Dohvati podatke iz osoba tabele
    const { data: osoba, error: greskaOsoba } = await supabase
      .from('osoba')
      .select('ime, prezime, broj_telefona, adresa, email')
      .eq('id_osobe', user.id)
      .maybeSingle();

    if (greskaOsoba) {
      return NextResponse.json({ error: greskaOsoba.message }, { status: 500 });
    }

    // Provjeri uloge
    const uloge: string[] = [];
    let isVerified = false;

    const { data: korisnikUsluge } = await supabase
      .from('korisnik_usluge')
      .select('id_korisnika_usluge')
      .eq('id_korisnika_usluge', user.id)
      .maybeSingle();

    if (korisnikUsluge) uloge.push('korisnik');

    const { data: uposlenik } = await supabase
      .from('uposlenici')
      .select('id_uloge, is_verified, uloga:uloga(naziv)')
      .eq('id_uposlenika', user.id)
      .maybeSingle();

    if (uposlenik) {
      isVerified = uposlenik.is_verified ?? false;
      const nazivi = Array.isArray(uposlenik.uloga)
        ? (uposlenik.uloga as { naziv: string }[]).map((u) => u.naziv)
        : uposlenik.uloga
        ? [(uposlenik.uloga as { naziv: string }).naziv]
        : [];

      for (const naziv of nazivi) {
        const n = naziv?.toLowerCase();
        if (n === 'serviser') uloge.push('serviser');
        else if (n === 'dispečer' || n === 'dispecer') uloge.push('dispecer');
        else if (n === 'administrator' || n === 'admin') uloge.push('admin');
      }
    }

    return NextResponse.json({
      profil: {
        id:            user.id,
        ime:           osoba?.ime ?? '',
        prezime:       osoba?.prezime ?? '',
        email:         osoba?.email ?? user.email ?? '',
        broj_telefona: osoba?.broj_telefona ?? null,
        adresa:        osoba?.adresa ?? null,
        uloge,
        is_verified:   isVerified,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabaseSesija = createServerClient();
    const {
      data: { user },
    } = await supabaseSesija.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = await request.json();
    const rezultat = profilUpdateSchema.safeParse(body);

    if (!rezultat.success) {
      return NextResponse.json(
        { error: rezultat.error.errors[0].message },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('osoba')
      .update(rezultat.data)
      .eq('id_osobe', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
