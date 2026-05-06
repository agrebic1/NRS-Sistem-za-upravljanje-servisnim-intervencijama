import type { SupabaseClient } from '@supabase/supabase-js';

export const PREMIUM_TRAJANJE_DANA = 30;

export type PremiumStatus = 'inactive' | 'pending_payment' | 'active' | 'expired' | 'cancelled';

export function izracunajIstek(datumPocetka: Date): string {
  const d = new Date(datumPocetka);
  d.setDate(d.getDate() + PREMIUM_TRAJANJE_DANA);
  return d.toISOString();
}

export type KorisnikUslugePremiumRow = {
  id_korisnika_usluge: string;
  is_premium: boolean | null;
  premium_status: PremiumStatus | string | null;
  premium_started_at: string | null;
  premium_expires_at: string | null;
  premium_plan: string | null;
  premium_cancelled_at?: string | null;
  premium_cancel_reason?: string | null;
};

export async function safeInsertPremiumEvent(
  supabase: SupabaseClient,
  row: {
    user_id: string;
    actor_user_id: string | null;
    event_type: string;
    payload_json: Record<string, unknown>;
  }
): Promise<{ ok: true } | { ok: false; message: string }> {
  const { error } = await supabase.from('premium_events').insert(row);
  if (error?.message?.includes("'premium_events'")) return { ok: true };
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

function statusFromRow(row: KorisnikUslugePremiumRow): PremiumStatus {
  return (row.premium_status as PremiumStatus) ?? 'inactive';
}

/** inactive → pending_payment */
export async function premiumStartCheckout(
  supabase: SupabaseClient,
  userId: string,
  actorUserId: string
): Promise<{ ok: true } | { ok: false; message: string; status: number }> {
  const { data: row, error: selErr } = await supabase
    .from('korisnik_usluge')
    .select(
      'id_korisnika_usluge, is_premium, premium_status, premium_started_at, premium_expires_at, premium_plan, premium_cancelled_at, premium_cancel_reason'
    )
    .eq('id_korisnika_usluge', userId)
    .maybeSingle();

  if (selErr?.message?.includes("'premium_status' column")) {
    return { ok: false, message: 'Premium lifecycle kolone ne postoje. Primijenite premium lifecycle migraciju.', status: 400 };
  }
  if (selErr) return { ok: false, message: selErr.message, status: 500 };
  if (!row) return { ok: false, message: 'Premium je dostupan samo korisnicima usluge.', status: 403 };

  const st = statusFromRow(row as KorisnikUslugePremiumRow);
  if (st !== 'inactive') {
    return { ok: false, message: 'Simulacija uplate može započeti samo iz statusa „Neaktivan”.', status: 400 };
  }

  const { error: updErr } = await supabase
    .from('korisnik_usluge')
    .update({
      is_premium: false,
      premium_status: 'pending_payment',
      premium_started_at: null,
      premium_expires_at: null,
      premium_plan: null,
      premium_cancelled_at: null,
      premium_cancel_reason: null,
    })
    .eq('id_korisnika_usluge', userId);

  if (updErr?.message?.includes('premium_cancelled_at')) {
    const { error: fallbackErr } = await supabase
      .from('korisnik_usluge')
      .update({
        is_premium: false,
        premium_status: 'pending_payment',
        premium_started_at: null,
        premium_expires_at: null,
        premium_plan: null,
      })
      .eq('id_korisnika_usluge', userId);
    if (fallbackErr) return { ok: false, message: fallbackErr.message, status: 500 };
  } else if (updErr) {
    return { ok: false, message: updErr.message, status: 500 };
  }

  const ev = await safeInsertPremiumEvent(supabase, {
    user_id: userId,
    actor_user_id: actorUserId,
    event_type: 'premium_checkout_started',
    payload_json: {
      premium_status: 'pending_payment',
      source: 'mvp_simulated_checkout',
    },
  });
  if (!ev.ok) return { ok: false, message: ev.message, status: 500 };

  return { ok: true };
}

/** pending_payment → active */
export async function premiumConfirmSimulatedPayment(
  supabase: SupabaseClient,
  userId: string,
  actorUserId: string
): Promise<
  | { ok: true; premium_started_at: string; premium_expires_at: string; premium_plan: string }
  | { ok: false; message: string; status: number }
> {
  const { data: row, error: selErr } = await supabase
    .from('korisnik_usluge')
    .select(
      'id_korisnika_usluge, is_premium, premium_status, premium_started_at, premium_expires_at, premium_plan, premium_cancelled_at, premium_cancel_reason'
    )
    .eq('id_korisnika_usluge', userId)
    .maybeSingle();

  if (selErr?.message?.includes("'premium_status' column")) {
    return { ok: false, message: 'Premium lifecycle kolone ne postoje. Primijenite premium lifecycle migraciju.', status: 400 };
  }
  if (selErr) return { ok: false, message: selErr.message, status: 500 };
  if (!row) return { ok: false, message: 'Premium je dostupan samo korisnicima usluge.', status: 403 };

  const st = statusFromRow(row as KorisnikUslugePremiumRow);
  if (st !== 'pending_payment') {
    return { ok: false, message: 'Potvrda uplate je moguća samo kada status je „Čeka uplatu”.', status: 400 };
  }

  const sada = new Date();
  const premium_started_at = sada.toISOString();
  const premium_expires_at = izracunajIstek(sada);
  const premium_plan = 'monthly';

  const { error: updErr } = await supabase
    .from('korisnik_usluge')
    .update({
      is_premium: true,
      premium_status: 'active',
      premium_started_at,
      premium_expires_at,
      premium_plan,
      premium_cancelled_at: null,
      premium_cancel_reason: null,
    })
    .eq('id_korisnika_usluge', userId);

  if (updErr?.message?.includes('premium_cancelled_at')) {
    const { error: fb } = await supabase
      .from('korisnik_usluge')
      .update({
        is_premium: true,
        premium_status: 'active',
        premium_started_at,
        premium_expires_at,
        premium_plan,
      })
      .eq('id_korisnika_usluge', userId);
    if (fb) return { ok: false, message: fb.message, status: 500 };
  } else if (updErr) {
    return { ok: false, message: updErr.message, status: 500 };
  }

  const ev = await safeInsertPremiumEvent(supabase, {
    user_id: userId,
    actor_user_id: actorUserId,
    event_type: 'premium_activated',
    payload_json: {
      premium_status: 'active',
      premium_started_at,
      premium_expires_at,
      premium_plan,
      source: 'mvp_simulated_payment_confirm',
    },
  });
  if (!ev.ok) return { ok: false, message: ev.message, status: 500 };

  return { ok: true, premium_started_at, premium_expires_at, premium_plan };
}

/** pending_payment | active → cancelled */
export async function premiumCancelSelfService(
  supabase: SupabaseClient,
  userId: string,
  actorUserId: string,
  reason: string | null | undefined
): Promise<{ ok: true } | { ok: false; message: string; status: number }> {
  const { data: row, error: selErr } = await supabase
    .from('korisnik_usluge')
    .select(
      'id_korisnika_usluge, is_premium, premium_status, premium_started_at, premium_expires_at, premium_plan, premium_cancelled_at, premium_cancel_reason'
    )
    .eq('id_korisnika_usluge', userId)
    .maybeSingle();

  if (selErr?.message?.includes("'premium_status' column")) {
    return { ok: false, message: 'Premium lifecycle kolone ne postoje. Primijenite premium lifecycle migraciju.', status: 400 };
  }
  if (selErr) return { ok: false, message: selErr.message, status: 500 };
  if (!row) return { ok: false, message: 'Premium je dostupan samo korisnicima usluge.', status: 403 };

  const st = statusFromRow(row as KorisnikUslugePremiumRow);
  if (st !== 'pending_payment' && st !== 'active') {
    return { ok: false, message: 'Otkazivanje je moguće samo za status „Čeka uplatu” ili „Aktivan”.', status: 400 };
  }

  const sada = new Date().toISOString();
  const trimmed = reason?.trim() || null;

  const patch = {
    is_premium: false,
    premium_status: 'cancelled' as const,
    premium_started_at: null as string | null,
    premium_expires_at: null as string | null,
    premium_plan: null as string | null,
    premium_cancelled_at: sada,
    premium_cancel_reason: trimmed,
  };

  const { error: updErr } = await supabase.from('korisnik_usluge').update(patch).eq('id_korisnika_usluge', userId);

  if (updErr?.message?.includes('premium_cancelled_at')) {
    const { error: fb } = await supabase
      .from('korisnik_usluge')
      .update({
        is_premium: false,
        premium_status: 'cancelled',
        premium_started_at: null,
        premium_expires_at: null,
        premium_plan: null,
      })
      .eq('id_korisnika_usluge', userId);
    if (fb) return { ok: false, message: fb.message, status: 500 };
  } else if (updErr) {
    return { ok: false, message: updErr.message, status: 500 };
  }

  const ev = await safeInsertPremiumEvent(supabase, {
    user_id: userId,
    actor_user_id: actorUserId,
    event_type: 'premium_cancelled',
    payload_json: {
      premium_status: 'cancelled',
      premium_cancel_reason: trimmed,
      source: 'self_service_cancel',
    },
  });
  if (!ev.ok) return { ok: false, message: ev.message, status: 500 };

  return { ok: true };
}

/** expired | cancelled → active (novi period) */
export async function premiumRenewSimulated(
  supabase: SupabaseClient,
  userId: string,
  actorUserId: string
): Promise<
  | { ok: true; premium_started_at: string; premium_expires_at: string; premium_plan: string }
  | { ok: false; message: string; status: number }
> {
  const { data: row, error: selErr } = await supabase
    .from('korisnik_usluge')
    .select(
      'id_korisnika_usluge, is_premium, premium_status, premium_started_at, premium_expires_at, premium_plan, premium_cancelled_at, premium_cancel_reason'
    )
    .eq('id_korisnika_usluge', userId)
    .maybeSingle();

  if (selErr?.message?.includes("'premium_status' column")) {
    return { ok: false, message: 'Premium lifecycle kolone ne postoje. Primijenite premium lifecycle migraciju.', status: 400 };
  }
  if (selErr) return { ok: false, message: selErr.message, status: 500 };
  if (!row) return { ok: false, message: 'Premium je dostupan samo korisnicima usluge.', status: 403 };

  const st = statusFromRow(row as KorisnikUslugePremiumRow);
  if (st !== 'expired' && st !== 'cancelled') {
    return { ok: false, message: 'Obnova je moguća samo iz statusa „Istekao” ili „Otkazan”.', status: 400 };
  }

  const sada = new Date();
  const premium_started_at = sada.toISOString();
  const premium_expires_at = izracunajIstek(sada);
  const premium_plan = 'monthly';

  const { error: updErr } = await supabase
    .from('korisnik_usluge')
    .update({
      is_premium: true,
      premium_status: 'active',
      premium_started_at,
      premium_expires_at,
      premium_plan,
      premium_cancelled_at: null,
      premium_cancel_reason: null,
    })
    .eq('id_korisnika_usluge', userId);

  if (updErr?.message?.includes('premium_cancelled_at')) {
    const { error: fb } = await supabase
      .from('korisnik_usluge')
      .update({
        is_premium: true,
        premium_status: 'active',
        premium_started_at,
        premium_expires_at,
        premium_plan,
      })
      .eq('id_korisnika_usluge', userId);
    if (fb) return { ok: false, message: fb.message, status: 500 };
  } else if (updErr) {
    return { ok: false, message: updErr.message, status: 500 };
  }

  const ev = await safeInsertPremiumEvent(supabase, {
    user_id: userId,
    actor_user_id: actorUserId,
    event_type: 'premium_renewed',
    payload_json: {
      premium_status: 'active',
      premium_started_at,
      premium_expires_at,
      premium_plan,
      previous_status: st,
      source: 'mvp_simulated_renew',
    },
  });
  if (!ev.ok) return { ok: false, message: ev.message, status: 500 };

  return { ok: true, premium_started_at, premium_expires_at, premium_plan };
}
