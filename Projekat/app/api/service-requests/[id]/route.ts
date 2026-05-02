import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { cancelRequestSchema, updateRequestSchema } from '@/lib/validations/servisirane';
import { korisnickiBrojZahtjevaZaId } from '@/lib/servisirane/korisnickiBrojZahtjeva';

export const dynamic = 'force-dynamic';

type RouteParams = { id: string } | Promise<{ id: string }>;
const EDITABLE_STATUSES = new Set(['na_cekanju', 'pending_review']);

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
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', requestId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });
    }

    const { data: redoviAsc } = await supabase
      .from('service_requests')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });

    const korisnicki_broj_zahtjeva = redoviAsc
      ? korisnickiBrojZahtjevaZaId(redoviAsc, requestId)
      : null;

    return NextResponse.json({
      zahtjev: {
        ...data,
        korisnicki_broj_zahtjeva: korisnicki_broj_zahtjeva ?? undefined,
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

    // Provjeri vlasništvo i status
    const { data: zahtjev } = await supabase
      .from('service_requests')
      .select('status, user_id')
      .eq('id', requestId)
      .single();

    if (!zahtjev) {
      return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });
    }
    if (zahtjev.user_id !== user.id) {
      return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });
    }
    if (!EDITABLE_STATUSES.has(zahtjev.status)) {
      return NextResponse.json(
        { error: 'Zahtjev se može mijenjati samo dok je "Čeka obradu".' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, ...rest } = body as { action?: string } & Record<string, unknown>;

    if (action === 'cancel') {
      const rezultat = cancelRequestSchema.safeParse(rest);
      if (!rezultat.success) {
        return NextResponse.json(
          { error: rezultat.error.errors[0].message },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from('service_requests')
        .update({ status: 'otkazano', cancel_reason: rezultat.data.cancel_reason })
        .eq('id', requestId);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    const rezultat = updateRequestSchema.safeParse(rest);
    if (!rezultat.success) {
      return NextResponse.json(
        { error: rezultat.error.errors[0].message },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('service_requests')
      .update(rezultat.data)
      .eq('id', requestId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
