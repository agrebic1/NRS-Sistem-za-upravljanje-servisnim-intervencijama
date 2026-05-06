import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { premiumStartCheckout } from '@/lib/premium/lifecycle';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const supabaseSesija = createServerClient();
    const {
      data: { user },
    } = await supabaseSesija.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const supabase = createAdminClient();
    const rez = await premiumStartCheckout(supabase, user.id, user.id);
    if (!rez.ok) {
      return NextResponse.json({ error: rez.message }, { status: rez.status });
    }

    return NextResponse.json({ success: true, premium_status: 'pending_payment' as const });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
