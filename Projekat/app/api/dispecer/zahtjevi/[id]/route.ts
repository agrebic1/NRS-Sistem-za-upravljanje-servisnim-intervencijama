import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

function getUlogaNaziv(uloga: unknown): string {
  if (!uloga) return '';
  if (Array.isArray(uloga)) return (uloga[0] as { naziv?: string })?.naziv ?? '';
  return (uloga as { naziv?: string })?.naziv ?? '';
}

const potvrdiSchema = z.object({
  action:         z.literal('potvrdi'),
  final_priority: z.enum(['NISKO', 'SREDNJE', 'VISOKO', 'KRITIČNO']),
});

const odbijSchema = z.object({
  action:           z.literal('odbij'),
  rejection_reason: z.string().min(5, 'Objasnite razlog odbijanja (min. 5 karaktera)').max(500),
});

const actionSchema = z.discriminatedUnion('action', [potvrdiSchema, odbijSchema]);

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

    // Provjeri dispečer/admin rolu
    const { data: uposlenik } = await supabase
      .from('uposlenici')
      .select('uloga(naziv)')
      .eq('id_uposlenika', user.id)
      .maybeSingle();

    const naziv = getUlogaNaziv(uposlenik?.uloga).toLowerCase();
    const imaPriv = ['dispečer', 'dispecer', 'administrator', 'admin'].includes(naziv);
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
      .select('status')
      .eq('id', params.id)
      .single();

    if (!zahtjev) {
      return NextResponse.json({ error: 'Zahtjev nije pronađen.' }, { status: 404 });
    }

    if (zahtjev.status !== 'na_cekanju') {
      return NextResponse.json(
        { error: 'Akcija je moguća samo za zahtjeve sa statusom "Na čekanju".' },
        { status: 400 }
      );
    }

    const podaci = rezultat.data;

    if (podaci.action === 'potvrdi') {
      const { error } = await supabase
        .from('service_requests')
        .update({
          status:         'potvrdeno',
          final_priority: podaci.final_priority,
        })
        .eq('id', params.id);

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
        .eq('id', params.id);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, novi_status: 'odbijeno' });
    }

    return NextResponse.json({ error: 'Nepoznata akcija.' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
