import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

const BUCKET           = 'intervencije-slike';
const MAX_SIZE_BYTES   = 5 * 1024 * 1024; // 5 MB
const DOZVOLJENI_TIPOVI = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/** GET /api/slike?zahtjev_id=X — lista slika za intervenciju */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });

    const zahtjev_id = Number(request.nextUrl.searchParams.get('zahtjev_id'));
    if (!Number.isFinite(zahtjev_id) || zahtjev_id <= 0) {
      return NextResponse.json({ error: 'Neispravan zahtjev_id.' }, { status: 400 });
    }

    const db = supabase as any;
    const { data, error } = await db
      .from('slike_intervencija')
      .select('*')
      .eq('zahtjev_id', zahtjev_id)
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ slike: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Greška servera.' },
      { status: 500 }
    );
  }
}

/** POST /api/slike — upload slike za intervenciju (multipart/form-data) */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });

    const formData    = await request.formData();
    const file        = formData.get('file') as File | null;
    const zahtjev_id  = Number(formData.get('zahtjev_id'));
    const evidencija_id = formData.get('evidencija_id')
      ? Number(formData.get('evidencija_id'))
      : null;
    const naziv = (formData.get('naziv') as string | null)?.trim() || null;
    const opis  = (formData.get('opis')  as string | null)?.trim() || null;

    if (!file) return NextResponse.json({ error: 'Fajl nije priložen.' }, { status: 400 });
    if (!Number.isFinite(zahtjev_id) || zahtjev_id <= 0) {
      return NextResponse.json({ error: 'Neispravan zahtjev_id.' }, { status: 400 });
    }
    if (!DOZVOLJENI_TIPOVI.includes(file.type)) {
      return NextResponse.json({ error: 'Tip fajla nije podržan. Dozvoljeno: JPEG, PNG, WebP, GIF.' }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Fajl je prevelik. Maksimalna veličina je 5 MB.' }, { status: 400 });
    }

    // Ekstenzija iz MIME tipa
    const ext = file.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
    const storagePath = `${zahtjev_id}/${uuidv4()}.${ext}`;

    // Upload putem admin klijenta (zaobilazi storage RLS)
    const adminClient  = createAdminClient();
    const arrayBuffer  = await file.arrayBuffer();
    const buffer       = Buffer.from(arrayBuffer);

    const { error: uploadError } = await adminClient.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ error: `Storage greška: ${uploadError.message}` }, { status: 500 });
    }

    const { data: urlData } = adminClient.storage.from(BUCKET).getPublicUrl(storagePath);
    const image_url = urlData.publicUrl;

    // Sačuvaj u bazu
    const db = supabase as any;
    const { data: slika, error: dbError } = await db
      .from('slike_intervencija')
      .insert({
        zahtjev_id,
        evidencija_id: evidencija_id || null,
        uploaded_by:   user.id,
        image_url,
        naziv,
        opis,
      })
      .select()
      .single();

    if (dbError) {
      // Pokušaj obrisati uploadovanu sliku ako DB insert ne uspije
      await adminClient.storage.from(BUCKET).remove([storagePath]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Aktivnost u audit logu
    await db.from('intervention_activities').insert({
      zahtjev_id,
      autor_id:   user.id,
      tip:        'slika',
      sadrzaj:    `Uploadovana slika: ${naziv ?? storagePath}`,
      metadata:   { slika_id: slika.id, image_url },
    });

    return NextResponse.json({ success: true, slika });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Greška servera.' },
      { status: 500 }
    );
  }
}

/** DELETE /api/slike?id=X — brisanje slike */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });

    const id = Number(request.nextUrl.searchParams.get('id'));
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'Neispravan ID.' }, { status: 400 });
    }

    const db = supabase as any;
    const { data: slika } = await db
      .from('slike_intervencija')
      .select('image_url, uploaded_by')
      .eq('id', id)
      .single();

    if (!slika) return NextResponse.json({ error: 'Slika nije pronađena.' }, { status: 404 });
    if (slika.uploaded_by !== user.id) {
      return NextResponse.json({ error: 'Nemate ovlaštenje za brisanje ove slike.' }, { status: 403 });
    }

    // Brisanje iz Storage-a
    const adminClient = createAdminClient();
    const url         = new URL(slika.image_url);
    const pathParts   = url.pathname.split(`/${BUCKET}/`);
    const storagePath = pathParts[1] ?? '';
    if (storagePath) {
      await adminClient.storage.from(BUCKET).remove([storagePath]);
    }

    // Brisanje iz baze
    await db.from('slike_intervencija').delete().eq('id', id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Greška servera.' },
      { status: 500 }
    );
  }
}
