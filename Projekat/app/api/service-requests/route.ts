import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import {
  preferredScheduleBaseSchema,
  preferredScheduleSchema,
  serviceRequestSchema,
} from '@/lib/validations/servisirane';
import { izracunajUrgency } from '@/lib/servisirane/urgency';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

function danasIsoLokalno(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Preferirani termin (Sprint 7): jedan slot ili bez preferencije. */
const scheduleSchema = z
  .object(preferredScheduleBaseSchema.shape)
  .superRefine((data, ctx) => {
    const base = preferredScheduleSchema.safeParse(data);
    if (!base.success) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        message: base.error.errors[0].message,
        path:    base.error.errors[0].path,
      });
      return;
    }

    const bezPreference = data.no_preferred_time === true;
    if (bezPreference) {
      return;
    }

    const t = data.termini[0];
    if (t.date < danasIsoLokalno()) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        message: 'Datum ne smije biti u prošlosti.',
        path:    ['termini', 0, 'date'],
      });
    }
  })
  .optional()
  .nullable();

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
      .from('service_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ zahtjevi: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabaseSesija = createServerClient();
    const {
      data: { user },
    } = await supabaseSesija.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = await request.json();

    // Validate
    const rezultat = serviceRequestSchema.safeParse(body);
    if (!rezultat.success) {
      return NextResponse.json(
        { error: rezultat.error.errors[0].message },
        { status: 400 }
      );
    }

    const scheduleResult = scheduleSchema.safeParse(body.preferred_schedule);
    if (!scheduleResult.success) {
      return NextResponse.json(
        { error: scheduleResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { triage, ...ostalo } = rezultat.data;
    const urgency_score = izracunajUrgency(triage);

    const supabase = createAdminClient();
    const insertPayload = {
      user_id:            user.id,
      ...ostalo,
      triage_json:        triage,
      urgency_score,
      system_score:       urgency_score,   // identical to urgency_score initially
      status:             'na_cekanju' as const,
      preferred_schedule: scheduleResult.data,
    };

    let { data, error } = await supabase
      .from('service_requests')
      .insert(insertPayload)
      .select()
      .single();

    // Fallback: ako DB još nema latitude/longitude kolone, pokušaj bez njih.
    if (error?.message?.includes("'latitude' column") || error?.message?.includes("'longitude' column")) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { latitude, longitude, ...bezKoordinata } = insertPayload;
      const retry = await supabase
        .from('service_requests')
        .insert(bezKoordinata)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ zahtjev: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
