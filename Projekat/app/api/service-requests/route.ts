import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import {
  preferredScheduleBaseSchema,
  preferredScheduleSchema,
  serviceRequestSchema,
} from '@/lib/validations/servisirane';
import { izracunajUrgency } from '@/lib/servisirane/urgency';
import { dodijeliKorisnickeBrojeveZahtjeva } from '@/lib/servisirane/korisnickiBrojZahtjeva';
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
    const zahtjevi = dodijeliKorisnickeBrojeveZahtjeva(data ?? []);
    return NextResponse.json({ zahtjevi });
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

    if (!user.email_confirmed_at) {
      return NextResponse.json(
        { error: 'Potvrdite email adresu prije slanja zahtjeva.' },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();
    const { data: korisnikUsluge, error: korisnikUslugeError } = await supabase
      .from('korisnik_usluge')
      .select('id_korisnika_usluge')
      .eq('id_korisnika_usluge', user.id)
      .maybeSingle();

    if (korisnikUslugeError) {
      return NextResponse.json({ error: korisnikUslugeError.message }, { status: 500 });
    }
    if (!korisnikUsluge) {
      return NextResponse.json(
        { error: 'Samo korisnik usluge može kreirati zahtjev.' },
        { status: 403 }
      );
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

    const insertPayload = {
      user_id:            user.id,
      ...ostalo,
      triage_json:        triage,
      urgency_score,
      system_score:       urgency_score,   // identical to urgency_score initially
      status:             'pending_review',
      preferred_schedule: scheduleResult.data,
    };

    let { data, error } = await supabase
      .from('service_requests')
      .insert(insertPayload)
      .select()
      .single();

    // Fallback: ako DB još nema latitude/longitude kolone, pokušaj bez njih.
    if (error?.message?.includes("'latitude' column") || error?.message?.includes("'longitude' column")) {
      const bezKoordinata: Record<string, unknown> = { ...insertPayload };
      delete bezKoordinata.latitude;
      delete bezKoordinata.longitude;
      const retry = await supabase
        .from('service_requests')
        .insert(bezKoordinata)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    // Backward-compat fallback: postojeće šeme koriste status 'na_cekanju'.
    if (error?.message?.toLowerCase().includes('status')) {
      const legacyPayload = {
        ...insertPayload,
        status: 'na_cekanju',
      };
      const legacyRetry = await supabase
        .from('service_requests')
        .insert(legacyPayload)
        .select()
        .single();
      data = legacyRetry.data;
      error = legacyRetry.error;
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: sviRedovi } = await supabase
      .from('service_requests')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true });
    const sBrojevima = dodijeliKorisnickeBrojeveZahtjeva(sviRedovi ?? []);
    const ovaj = sBrojevima.find((r) => r.id === data.id);
    const korisnickiBrojZahtjeva = ovaj?.korisnicki_broj_zahtjeva ?? sBrojevima.length;

    return NextResponse.json(
      {
        zahtjev: { ...data, korisnicki_broj_zahtjeva: korisnickiBrojZahtjeva },
        korisnicki_broj_zahtjeva: korisnickiBrojZahtjeva,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
