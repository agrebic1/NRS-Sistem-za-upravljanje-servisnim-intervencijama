import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { cancelRequestSchema, updateRequestSchema } from '@/lib/validations/servisirane';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseSesija = createServerClient();
    const {
      data: { user },
    } = await supabaseSesija.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });
    }

    return NextResponse.json({ zahtjev: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseSesija = createServerClient();
    const {
      data: { user },
    } = await supabaseSesija.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Provjeri vlasništvo i status
    const { data: zahtjev } = await supabase
      .from('service_requests')
      .select('status, user_id')
      .eq('id', params.id)
      .single();

    if (!zahtjev) {
      return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });
    }
    if (zahtjev.user_id !== user.id) {
      return NextResponse.json({ error: 'Pristup odbijen.' }, { status: 403 });
    }
    if (zahtjev.status !== 'na_cekanju') {
      return NextResponse.json(
        { error: 'Zahtjev se može mijenjati samo dok je "Na čekanju".' },
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
        .eq('id', params.id);

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
      .eq('id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
