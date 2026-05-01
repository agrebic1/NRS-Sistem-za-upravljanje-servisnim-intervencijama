import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function getUlogaNaziv(uloga: unknown): string {
  if (!uloga) return '';
  if (Array.isArray(uloga)) return (uloga[0] as { naziv?: string })?.naziv ?? '';
  return (uloga as { naziv?: string })?.naziv ?? '';
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

    // Provjeri ulogu (dispečer, serviser ili admin)
    const { data: uposlenik } = await supabase
      .from('uposlenici')
      .select('uloga(naziv)')
      .eq('id_uposlenika', user.id)
      .maybeSingle();

    const naziv = getUlogaNaziv(uposlenik?.uloga).toLowerCase();
    const imaPrivilegirani = ['dispečer', 'dispecer', 'serviser', 'administrator', 'admin'].includes(naziv);

    if (!imaPrivilegirani) {
      return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });
    }

    // Dohvati sve zahtjeve sa podacima podnosioca
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('urgency_score', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Dohvati profile korisnika koji su podnijeli zahtjeve
    const userIds = [...new Set((data ?? []).map((z) => z.user_id))];
    let profili: Record<string, { ime: string; prezime: string; broj_telefona: string | null }> = {};

    if (userIds.length > 0) {
      const { data: osobeData } = await supabase
        .from('osoba')
        .select('id_osobe, ime, prezime, broj_telefona')
        .in('id_osobe', userIds);

      for (const o of osobeData ?? []) {
        profili[o.id_osobe] = {
          ime:           o.ime,
          prezime:       o.prezime,
          broj_telefona: o.broj_telefona,
        };
      }
    }

    const zahtjeviSaPodnosiocima = (data ?? []).map((z) => ({
      ...z,
      podnosilac: profili[z.user_id] ?? null,
    }));

    return NextResponse.json({ zahtjevi: zahtjeviSaPodnosiocima });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
