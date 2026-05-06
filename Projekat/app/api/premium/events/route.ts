import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

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
    const { data, error } = await supabase
      .from('premium_events')
      .select('id, event_type, payload_json, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error?.message?.includes("'premium_events'")) {
      return NextResponse.json({ events: [] });
    }
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
