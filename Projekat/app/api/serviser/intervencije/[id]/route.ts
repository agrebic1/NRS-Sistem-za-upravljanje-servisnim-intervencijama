import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  assertServiserAccess,
  assertServiserVlasnistvo,
  serviserSmijeMijenjatiStatus,
} from '@/lib/servisirane/serviserPristup';
import { odbijZadatakSchema } from '@/lib/validations/servisirane';
import {
  notifPrihvatanjeZadatka,
  notifOdbijanjeZadatka,
  notifKorisnikusServiserNaPutu,
  notifKorisnikusServiserNaTerenu,
  notifNovaNapomenaDispecer,
  notifServiserNaTerenu,
} from '@/lib/servisirane/notifikacijeHelper';

export const dynamic = 'force-dynamic';

type RouteParams = { id: string } | Promise<{ id: string }>;

async function resolveId(params: RouteParams): Promise<number | null> {
  const resolved = await params;
  const n = parseInt(resolved.id, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function GET(
  _req: Request,
  { params }: { params: RouteParams }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });

    const zahtjevId = await resolveId(params);
    if (!zahtjevId) return NextResponse.json({ error: 'Neispravan ID.' }, { status: 400 });

    const imaPriv = await assertServiserAccess(supabase, user.id);
    if (!imaPriv) return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });

    const provjera = await assertServiserVlasnistvo(supabase, zahtjevId, user.id);
    if (!provjera.ok) return NextResponse.json({ error: provjera.greska }, { status: 403 });

    const db = supabase as any;

    const { data: zahtjev, error } = await db
      .from('service_requests')
      .select('*')
      .eq('id', zahtjevId)
      .single();

    if (error || !zahtjev) return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });

    const { data: osoba } = await db
      .from('osoba')
      .select('ime, prezime, broj_telefona')
      .eq('id_osobe', zahtjev.user_id)
      .maybeSingle();

    const { data: evidencije } = await db
      .from('work_evidence')
      .select('*')
      .eq('zahtjev_id', zahtjevId)
      .order('created_at', { ascending: false });

    const { data: aktivnosti } = await db
      .from('intervention_activities')
      .select('*, autor:osoba!autor_id(ime, prezime, uloga)')
      .eq('zahtjev_id', zahtjevId)
      .order('created_at', { ascending: true });

    return NextResponse.json({
      zahtjev:    { ...zahtjev, podnosilac: osoba ?? null },
      evidencije: evidencije ?? [],
      aktivnosti: (aktivnosti ?? []).map((a: Record<string, unknown>) => ({
        ...a,
        autor: Array.isArray(a.autor) ? a.autor[0] : a.autor,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const akcijaPatchSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('prihvati') }),
  z.object({ action: z.literal('pocni') }),
  z.object({ action: z.literal('odbij'), razlog: odbijZadatakSchema.shape.razlog }),
  z.object({ action: z.literal('napomena'), sadrzaj: z.string().min(1).max(2000) }),
]);

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });

    const zahtjevId = await resolveId(params);
    if (!zahtjevId) return NextResponse.json({ error: 'Neispravan ID.' }, { status: 400 });

    const imaPriv = await assertServiserAccess(supabase, user.id);
    if (!imaPriv) return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });

    const provjera = await assertServiserVlasnistvo(supabase, zahtjevId, user.id);
    if (!provjera.ok) return NextResponse.json({ error: provjera.greska }, { status: 403 });

    const body     = await request.json();
    const rezultat = akcijaPatchSchema.safeParse(body);
    if (!rezultat.success) {
      return NextResponse.json({ error: rezultat.error.errors[0].message }, { status: 400 });
    }

    const podaci         = rezultat.data;
    const trenutniStatus = provjera.status;
    const db             = supabase as any;

    if (podaci.action === 'prihvati') {
      if (!serviserSmijeMijenjatiStatus(trenutniStatus, 'u_radu')) {
        return NextResponse.json(
          { error: `Nije moguće prihvatiti zadatak u statusu "${trenutniStatus}".` },
          { status: 400 }
        );
      }
      const { error } = await db.from('service_requests').update({ status: 'u_radu' }).eq('id', zahtjevId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      await db.from('intervention_activities').insert({
        zahtjev_id: zahtjevId, autor_id: user.id, tip: 'status_promjena',
        sadrzaj: 'Serviser prihvatio zadatak.', metadata: { iz: trenutniStatus, u: 'u_radu' },
      });

      // Notifikacija dispečeru
      const { data: zah } = await db
        .from('service_requests')
        .select('osoba!user_id(id_osobe)')
        .eq('id', zahtjevId)
        .single();
      const { data: osoba } = await db
        .from('osoba')
        .select('ime, prezime')
        .eq('id_osobe', user.id)
        .maybeSingle();
      const imeServisera = osoba ? `${osoba.ime} ${osoba.prezime}` : 'Serviser';

      // Nađi dispečere koji prate ovu intervenciju (author of dodjela activity)
      const { data: dodjelaActivity } = await db
        .from('intervention_activities')
        .select('autor_id')
        .eq('zahtjev_id', zahtjevId)
        .eq('tip', 'dodjela')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dodjelaActivity?.autor_id) {
        await notifPrihvatanjeZadatka(db, dodjelaActivity.autor_id, zahtjevId, imeServisera);
      }

      // Notify korisnik that serviser is on the way
      const { data: zahtjevRow } = await db
        .from('service_requests')
        .select('user_id')
        .eq('id', zahtjevId)
        .maybeSingle();
      if (zahtjevRow?.user_id) {
        await notifKorisnikusServiserNaPutu(db, zahtjevRow.user_id, zahtjevId, imeServisera);
      }

      void zah; // suppress unused variable
      return NextResponse.json({ success: true, novi_status: 'u_radu' });
    }

    if (podaci.action === 'pocni') {
      if (!serviserSmijeMijenjatiStatus(trenutniStatus, 'u_izvrsenju')) {
        return NextResponse.json(
          { error: `Nije moguće pokrenuti intervenciju u statusu "${trenutniStatus}".` },
          { status: 400 }
        );
      }
      const { error } = await db.from('service_requests').update({ status: 'u_izvrsenju' }).eq('id', zahtjevId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      await db.from('intervention_activities').insert({
        zahtjev_id: zahtjevId, autor_id: user.id, tip: 'status_promjena',
        sadrzaj: 'Serviser je na lokaciji — intervencija u toku.', metadata: { iz: trenutniStatus, u: 'u_izvrsenju' },
      });

      // Notify korisnik + dispecer that serviser is on-site
      const { data: osoba2 } = await db
        .from('osoba')
        .select('ime, prezime')
        .eq('id_osobe', user.id)
        .maybeSingle();
      const imeServ2 = osoba2 ? `${osoba2.ime} ${osoba2.prezime}` : 'Serviser';

      const { data: zahtjevRow2 } = await db
        .from('service_requests')
        .select('user_id')
        .eq('id', zahtjevId)
        .maybeSingle();
      if (zahtjevRow2?.user_id) {
        await notifKorisnikusServiserNaTerenu(db, zahtjevRow2.user_id, zahtjevId, imeServ2);
      }
      const { data: dodjelaAkt2 } = await db
        .from('intervention_activities')
        .select('autor_id')
        .eq('zahtjev_id', zahtjevId)
        .eq('tip', 'dodjela')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (dodjelaAkt2?.autor_id) {
        await notifServiserNaTerenu(db, dodjelaAkt2.autor_id, zahtjevId, imeServ2);
      }

      return NextResponse.json({ success: true, novi_status: 'u_izvrsenju' });
    }

    // ── US-30: Napomena servisera ─────────────────────────────────────────────
    if (podaci.action === 'napomena') {
      const { error: insErr } = await db.from('intervention_activities').insert({
        zahtjev_id: zahtjevId,
        autor_id:   user.id,
        tip:        'napomena',
        sadrzaj:    podaci.sadrzaj.trim(),
        metadata:   null,
      });
      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

      // Notify dispecer about serviser note
      const { data: osobaN } = await db
        .from('osoba').select('ime, prezime').eq('id_osobe', user.id).maybeSingle();
      const imeNap = osobaN ? `${osobaN.ime} ${osobaN.prezime}` : 'Serviser';
      const { data: dodjelaAktN } = await db
        .from('intervention_activities')
        .select('autor_id').eq('zahtjev_id', zahtjevId).eq('tip', 'dodjela')
        .order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (dodjelaAktN?.autor_id) {
        await notifNovaNapomenaDispecer(db, dodjelaAktN.autor_id, zahtjevId, imeNap);
      }

      return NextResponse.json({ success: true });
    }

    if (podaci.action === 'odbij') {
      if (trenutniStatus !== 'dodijeljeno') {
        return NextResponse.json(
          { error: 'Zadatak se može odbiti samo u statusu "Dodijeljeno".' },
          { status: 400 }
        );
      }
      const { error } = await db.from('service_requests').update({
        status: 'potvrdeno', serviser_dodijeljen_id: null, serviser_odbio_razlog: podaci.razlog,
      }).eq('id', zahtjevId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      await db.from('intervention_activities').insert({
        zahtjev_id: zahtjevId, autor_id: user.id, tip: 'odbijanje',
        sadrzaj: `Serviser odbio zadatak: ${podaci.razlog}`, metadata: { iz: 'dodijeljeno', u: 'potvrdeno' },
      });

      // Notifikacija dispečeru
      const { data: osobaOdb } = await db
        .from('osoba')
        .select('ime, prezime')
        .eq('id_osobe', user.id)
        .maybeSingle();
      const imeOdb = osobaOdb ? `${osobaOdb.ime} ${osobaOdb.prezime}` : 'Serviser';

      const { data: dodjelaAkt } = await db
        .from('intervention_activities')
        .select('autor_id')
        .eq('zahtjev_id', zahtjevId)
        .eq('tip', 'dodjela')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dodjelaAkt?.autor_id) {
        await notifOdbijanjeZadatka(db, dodjelaAkt.autor_id, zahtjevId, imeOdb, podaci.razlog);
      }

      return NextResponse.json({ success: true, novi_status: 'potvrdeno' });
    }

    return NextResponse.json({ error: 'Nepoznata akcija.' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
