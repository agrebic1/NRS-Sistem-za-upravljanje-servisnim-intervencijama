import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assertDispatcherAccess } from '@/lib/servisirane/dispecerPristup';
import { izracunajPreporuke } from '@/lib/servisirane/preporukaServisera';

export const dynamic = 'force-dynamic';

export async function GET(
  req:    NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });

    const imaPriv = await assertDispatcherAccess(supabase, user.id);
    if (!imaPriv) return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });

    const db = supabase as any;

    // Fetch category info from zahtjev
    const { data: zahtjev } = await db
      .from('service_requests')
      .select('category_main, category_sub')
      .eq('id', params.id)
      .single();

    // Parse excluded IDs: ?izuzeti=uuid1,uuid2
    const url = new URL(req.url);
    const izuzetiParam = url.searchParams.get('izuzeti') ?? '';
    const izuzeti = izuzetiParam.split(',').filter(Boolean);

    // Fetch all verified servicers
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

    // Count active (non-terminal) assignments per servicer
    let aktivniMap: Record<string, number> = {};
    if (serviseriIds.length > 0) {
      const { data: zadaci } = await db
        .from('service_requests')
        .select('serviser_dodijeljen_id')
        .in('serviser_dodijeljen_id', serviseriIds)
        .not('status', 'in', '("zavrseno","otkazano","odbijeno","zatvoreno")');

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
        id:                u.id_uposlenika as string,
        ime:               (osoba as any)?.ime  ?? '',
        prezime:           (osoba as any)?.prezime ?? '',
        is_verified:       Boolean(u.is_verified),
        aktivnih_zadataka: aktivniMap[u.id_uposlenika] ?? 0,
        specialnosti:      [] as string[],
      };
    });

    const preporuke = izracunajPreporuke(serviseri, {
      kategorija: zahtjev?.category_main ?? null,
      izuzeti,
    });

    return NextResponse.json({ preporuke });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
