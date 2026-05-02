import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { partnerApplicationSchema } from '@/lib/validations/servisirane';

export const dynamic = 'force-dynamic';

function getUlogaNaziv(uloga: unknown): string {
  if (!uloga) return '';
  if (Array.isArray(uloga)) return (uloga[0] as { naziv?: string })?.naziv ?? '';
  return (uloga as { naziv?: string })?.naziv ?? '';
}

async function provjeriAdminPristup(
  supabase: ReturnType<typeof createAdminClient>,
  idKorisnika: string
) {
  const { data } = await supabase
    .from('uposlenici')
    .select('uloga(naziv)')
    .eq('id_uposlenika', idKorisnika)
    .maybeSingle();

  const naziv = getUlogaNaziv(data?.uloga);
  return naziv === 'Administrator' || naziv === 'admin';
}

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
    const jeAdmin  = await provjeriAdminPristup(supabase, user.id);

    if (!jeAdmin) {
      return NextResponse.json({ error: 'Nemate dozvolu za pregled aplikacija.' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('partner_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ aplikacije: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body     = await request.json();
    const rezultat = partnerApplicationSchema.safeParse(body);

    if (!rezultat.success) {
      return NextResponse.json(
        { error: rezultat.error.errors[0].message },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('partner_applications')
      .insert({ ...rezultat.data, status: 'na_cekanju' })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ aplikacija: data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Greška servera.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
