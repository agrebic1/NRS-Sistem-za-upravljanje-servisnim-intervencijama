import { NextResponse } from 'next/server';
import { createAdminClient }                  from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { assertDispatcherAccess }             from '@/lib/servisirane/dispecerPristup';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseSesija = createServerClient();
    const { data: { user } } = await supabaseSesija.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });

    const supabase = createAdminClient();
    const imaPriv  = await assertDispatcherAccess(supabase, user.id);
    if (!imaPriv)  return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });

    // Dohvati sve verificirane servisere
    const { data: uposlenici, error } = await supabase
      .from('uposlenici')
      .select(`
        id_uposlenika,
        is_verified,
        uloga!inner(naziv),
        osoba!id_uposlenika(ime, prezime)
      `)
      .eq('uloga.naziv', 'Serviser')
      .eq('is_verified', true);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const serviseriIds = (uposlenici ?? []).map((u) => u.id_uposlenika);

    // Broj aktivnih zadataka po serviseru
    let aktivniMap: Record<string, number> = {};
    if (serviseriIds.length > 0) {
      const { data: zadaci } = await supabase
        .from('service_requests')
        .select('serviser_dodijeljen_id')
        .in('serviser_dodijeljen_id', serviseriIds)
        .not('status', 'in', '("zavrseno","otkazano","odbijeno")');

      if (zadaci) {
        aktivniMap = zadaci.reduce<Record<string, number>>((acc, z) => {
          if (z.serviser_dodijeljen_id) {
            acc[z.serviser_dodijeljen_id] = (acc[z.serviser_dodijeljen_id] ?? 0) + 1;
          }
          return acc;
        }, {});
      }
    }

    // Specialnosti iz partner_applications (odobreni)
    let specialnostiMap: Record<string, string[]> = {};
    if (serviseriIds.length > 0) {
      const { data: apps } = await supabase
        .from('partner_applications')
        .select('specialnosti')
        .in('email', []) // placeholder — serviseri nemaju direktnu vezu s email-om, preskačemo
        .eq('status', 'odobreno');
      void apps; // Opcionalno — može se proširiti later
    }

    const serviseri = (uposlenici ?? []).map((u) => {
      const osoba = Array.isArray(u.osoba) ? u.osoba[0] : u.osoba;
      return {
        id:                u.id_uposlenika,
        ime:               (osoba as { ime?: string })?.ime ?? '',
        prezime:           (osoba as { prezime?: string })?.prezime ?? '',
        is_verified:       u.is_verified,
        aktivnih_zadataka: aktivniMap[u.id_uposlenika] ?? 0,
        specialnosti:      specialnostiMap[u.id_uposlenika] ?? [],
      };
    });

    // Sortiraj: manje aktivnih zadataka = dostupniji
    serviseri.sort((a, b) => a.aktivnih_zadataka - b.aktivnih_zadataka);

    return NextResponse.json({ serviseri });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
