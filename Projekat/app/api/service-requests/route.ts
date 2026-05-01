import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { serviceRequestSchema } from '@/lib/validations/servisirane';
import { izracunajUrgency } from '@/lib/servisirane/urgency';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// preferred_schedule shape
const scheduleSchema = z
  .object({
    dates:      z.array(z.string()).min(1),
    timeSlot:   z.enum(['jutro', 'popodne', 'vece', 'cijeli_dan', 'custom']),
    customTime: z.string().optional().nullable(),
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

    const { triage, ...ostalo } = rezultat.data;
    const urgency_score = izracunajUrgency(triage);

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        user_id:            user.id,
        ...ostalo,
        triage_json:        triage,
        urgency_score,
        system_score:       urgency_score,   // identical to urgency_score initially
        status:             'na_cekanju',
        preferred_schedule: scheduleResult.success ? scheduleResult.data : null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ zahtjev: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
