import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { assertDispatcherAccess } from '@/lib/servisirane/dispecerPristup';

export const dynamic = 'force-dynamic';

function parsirajStatuseIzUpita(request: Request): string[] | null {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('status');
  if (raw == null || raw.trim() === '') return null;
  const lista = raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return lista.length > 0 ? lista : null;
}

export async function GET(request: Request) {
  try {
    const supabaseSesija = createServerClient();
    const {
      data: { user },
    } = await supabaseSesija.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const imaPriv = await assertDispatcherAccess(supabase, user.id);
    if (!imaPriv) {
      return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });
    }

    const statusFiltar = parsirajStatuseIzUpita(request);

    // Dohvati zahtjeve sa podacima podnosioca (opciono: ?status=a,b,c)
    let upit = supabase
      .from('service_requests')
      .select('*')
      .not('status', 'in', '("zavrseno","otkazano","odbijeno")');

    if (statusFiltar) {
      upit = upit.in('status', statusFiltar);
    }

    let { data, error } = await upit
      .order('is_premium', { ascending: false })
      .order('created_at', { ascending: true });
    if (error?.message?.includes("'is_premium' column")) {
      let fb = supabase
        .from('service_requests')
        .select('*')
        .not('status', 'in', '("zavrseno","otkazano","odbijeno")');
      if (statusFiltar) {
        fb = fb.in('status', statusFiltar);
      }
      const fallback = await fb.order('created_at', { ascending: true });
      data = fallback.data;
      error = fallback.error;
    }

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
