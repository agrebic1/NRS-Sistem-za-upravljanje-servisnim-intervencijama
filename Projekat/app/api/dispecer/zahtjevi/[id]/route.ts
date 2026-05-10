import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { assertDispatcherAccess } from '@/lib/servisirane/dispecerPristup';
import { premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta } from '@/lib/servisirane/operativniPrioritet';
import { dispecerSmijeMijenjatiOperativniPrioritet } from '@/lib/servisirane/statusZahtjeva';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const potvrdiSchema = z.object({
  action:         z.literal('potvrdi'),
  final_priority: z.enum(['NISKO', 'SREDNJE', 'VISOKO', 'KRITIČNO', 'HITNO']),
  premium_downgrade_reason: z.string().max(500).optional(),
});

const odbijSchema = z.object({
  action:           z.literal('odbij'),
  rejection_reason: z.string().min(5, 'Objasnite razlog odbijanja (min. 5 karaktera)').max(500),
});

const promijeniPrioritetSchema = z.object({
  action:                   z.literal('promijeni_prioritet'),
  final_priority:           potvrdiSchema.shape.final_priority,
  premium_downgrade_reason: z.string().max(500).optional(),
});

const actionSchema = z.discriminatedUnion('action', [
  potvrdiSchema,
  odbijSchema,
  promijeniPrioritetSchema,
]);
/** Statusi u kojima dispečer može potvrditi/odbiti (MVP: uključuje in_review ako je u inboxu). */
const PENDING_STATUSES = new Set(['na_cekanju', 'pending_review', 'in_review']);

/** Kad dispečer prvi put snimi operativni prioritet, zahtjev prelazi u čarobnjak — korisnik više ne smije uređivati. */
const STATUS_PRE_CAROBNJAKA = new Set(['na_cekanju', 'pending_review']);
type RouteParams = { id: string } | Promise<{ id: string }>;

async function resolveRequestId(params: RouteParams): Promise<number | null> {
  const resolved = await params;
  const parsed = Number.parseInt(resolved.id, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export async function GET(
  _request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const supabaseSesija = createServerClient();
    const {
      data: { user },
    } = await supabaseSesija.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const requestId = await resolveRequestId(params);
    if (!requestId) {
      return NextResponse.json({ error: 'Neispravan ID zahtjeva.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const imaPriv = await assertDispatcherAccess(supabase, user.id);
    if (!imaPriv) {
      return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });
    }

    const { data: zahtjev, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error || !zahtjev) {
      return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });
    }

    const { data: osoba } = await supabase
      .from('osoba')
      .select('ime, prezime, broj_telefona')
      .eq('id_osobe', zahtjev.user_id)
      .maybeSingle();

    return NextResponse.json({
      zahtjev: {
        ...zahtjev,
        podnosilac: osoba ?? null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const supabaseSesija = createServerClient();
    const {
      data: { user },
    } = await supabaseSesija.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const requestId = await resolveRequestId(params);
    if (!requestId) {
      return NextResponse.json({ error: 'Neispravan ID zahtjeva.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const imaPriv = await assertDispatcherAccess(supabase, user.id);
    if (!imaPriv) {
      return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });
    }

    const body     = await request.json();
    const rezultat = actionSchema.safeParse(body);

    if (!rezultat.success) {
      return NextResponse.json({ error: rezultat.error.errors[0].message }, { status: 400 });
    }

    const { data: zahtjev } = await supabase
      .from('service_requests')
      .select('status, is_premium')
      .eq('id', requestId)
      .single();

    if (!zahtjev) {
      return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });
    }

    const podaci = rezultat.data;

    if (podaci.action === 'promijeni_prioritet') {
      if (!dispecerSmijeMijenjatiOperativniPrioritet(zahtjev.status)) {
        return NextResponse.json(
          { error: 'Operativni prioritet se ne može mijenjati u ovom statusu.' },
          { status: 400 },
        );
      }
      if (
        zahtjev.is_premium === true &&
        premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta(podaci.final_priority) &&
        (!podaci.premium_downgrade_reason || podaci.premium_downgrade_reason.trim().length < 10)
      ) {
        return NextResponse.json(
          {
            error:
              'Premium zahtjev mora ostati u hitnoj operativnoj grupi (HITNO, KRITIČNO ili VISOKO) ili unesite obrazloženje (min. 10 karaktera).',
          },
          { status: 400 },
        );
      }
      const izmjena: {
        final_priority: string;
        premium_priority_override_reason: string | null;
        status?: 'in_review';
      } = {
        final_priority: podaci.final_priority,
        premium_priority_override_reason:
          zahtjev.is_premium === true &&
          premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta(podaci.final_priority)
            ? podaci.premium_downgrade_reason?.trim() ?? null
            : null,
      };
      if (STATUS_PRE_CAROBNJAKA.has(zahtjev.status)) {
        izmjena.status = 'in_review';
      }

      const { error } = await supabase.from('service_requests').update(izmjena).eq('id', requestId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (!PENDING_STATUSES.has(zahtjev.status)) {
      return NextResponse.json(
        { error: 'Akcija je moguća samo za zahtjeve koji još nisu potvrđeni ili odbijeni.' },
        { status: 400 }
      );
    }

    // US-12: operativni prioritet uz potvrdu (status → potvrdeno).
    if (podaci.action === 'potvrdi') {
      if (
        zahtjev.is_premium === true &&
        premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta(podaci.final_priority) &&
        (!podaci.premium_downgrade_reason || podaci.premium_downgrade_reason.trim().length < 10)
      ) {
        return NextResponse.json(
          {
            error:
              'Premium zahtjev mora ostati u hitnoj operativnoj grupi (HITNO, KRITIČNO ili VISOKO) ili unesite obrazloženje (min. 10 karaktera).',
          },
          { status: 400 }
        );
      }
      const { error } = await supabase
        .from('service_requests')
        .update({
          status:         'potvrdeno',
          final_priority: podaci.final_priority,
          premium_priority_override_reason:
            zahtjev.is_premium === true &&
            premiumZahtijevaObrazlozenjeSmanjenjaPrioriteta(podaci.final_priority)
              ? podaci.premium_downgrade_reason?.trim() ?? null
              : null,
        })
        .eq('id', requestId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, novi_status: 'potvrdeno' });
    }

    if (podaci.action === 'odbij') {
      const { error } = await supabase
        .from('service_requests')
        .update({
          status:           'odbijeno',
          rejection_reason: podaci.rejection_reason,
        })
        .eq('id', requestId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, novi_status: 'odbijeno' });
    }

    return NextResponse.json({ error: 'Nepoznata akcija.' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
