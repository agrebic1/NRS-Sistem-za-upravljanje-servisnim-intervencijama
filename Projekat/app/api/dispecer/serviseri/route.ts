import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assertDispatcherAccess } from '@/lib/servisirane/dispecerPristup';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });

    const imaPriv = await assertDispatcherAccess(supabase, user.id);
    if (!imaPriv) return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });

    const db = supabase as any;

    const { data: uposlenici, error } = await db
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

    const serviseriIds = (uposlenici ?? []).map((u: any) => u.id_uposlenika);

    let aktivniMap: Record<string, number> = {};
    if (serviseriIds.length > 0) {
      const { data: zadaci } = await db
        .from('service_requests')
        .select('serviser_dodijeljen_id')
        .in('serviser_dodijeljen_id', serviseriIds)
        .not('status', 'in', '("zavrseno","otkazano","odbijeno")');

      if (zadaci) {
        aktivniMap = (zadaci as any[]).reduce<Record<string, number>>((acc, z) => {
          if (z.serviser_dodijeljen_id) {
            acc[z.serviser_dodijeljen_id] = (acc[z.serviser_dodijeljen_id] ?? 0) + 1;
          }
          return acc;
        }, {});
      }
    }

    const serviseri = (uposlenici ?? []).map((u: any) => {
      const osoba = Array.isArray(u.osoba) ? u.osoba[0] : u.osoba;
      return {
        id:                u.id_uposlenika,
        ime:               (osoba as { ime?: string })?.ime ?? '',
        prezime:           (osoba as { prezime?: string })?.prezime ?? '',
        is_verified:       u.is_verified,
        aktivnih_zadataka: aktivniMap[u.id_uposlenika] ?? 0,
        specialnosti:      [] as string[],
      };
    });

    serviseri.sort((a: any, b: any) => a.aktivnih_zadataka - b.aktivnih_zadataka);

    return NextResponse.json({ serviseri });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
