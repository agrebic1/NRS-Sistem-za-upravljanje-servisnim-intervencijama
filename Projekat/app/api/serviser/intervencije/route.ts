import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { assertServiserAccess } from '@/lib/servisirane/serviserPristup';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });

    const imaPriv = await assertServiserAccess(supabase, user.id);
    if (!imaPriv) return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });

    const db = supabase as any;

    const { data, error } = await db
      .from('service_requests')
      .select('*')
      .eq('serviser_dodijeljen_id', user.id)
      .order('termin_planirani_pocetak', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const zahtjevi: Record<string, unknown>[] = data ?? [];
    const userIds = [...new Set(zahtjevi.map((z) => z.user_id as string))];

    let osobeMap: Record<string, { ime: string; prezime: string; broj_telefona: string | null }> = {};
    if (userIds.length > 0) {
      const { data: osobe } = await db
        .from('osoba')
        .select('id_osobe, ime, prezime, broj_telefona')
        .in('id_osobe', userIds);
      osobeMap = Object.fromEntries(
        ((osobe ?? []) as { id_osobe: string; ime: string; prezime: string; broj_telefona: string | null }[])
          .map((o) => [o.id_osobe, o])
      );
    }

    const rezultat = zahtjevi.map((z) => ({
      ...z,
      podnosilac: osobeMap[z.user_id as string] ?? null,
    }));

    return NextResponse.json({ intervencije: rezultat });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
