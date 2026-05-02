import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import {
  KorisnikPregledDashboard,
  type KorisnikDashboardZahtjev,
} from '@/components/korisnik/KorisnikPregledDashboard';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/domain/types/supabase';
import { formatirajDatumPrikaz } from '@/lib/format/datumi';
import { dodijeliKorisnickeBrojeveZahtjeva } from '@/lib/servisirane/korisnickiBrojZahtjeva';

type KorisnikZahtjev = Pick<
  Tables<'service_requests'>,
  'id' | 'category' | 'description' | 'address' | 'created_at' | 'status' | 'urgency_score'
>;

function izvuciPunoImeIzProfila(profil: unknown): string {
  if (!profil || typeof profil !== 'object') return '';

  const zapis = profil as Record<string, unknown>;
  const ime = typeof zapis.ime === 'string' ? zapis.ime.trim() : '';
  const prezime = typeof zapis.prezime === 'string' ? zapis.prezime.trim() : '';

  return [ime, prezime].filter(Boolean).join(' ').trim();
}

function mapirajStatus(
  status: string | null | undefined,
  urgencyScore: number | null | undefined
): KorisnikDashboardZahtjev['status'] {
  const normalizovano = (status ?? '').toLowerCase();
  const score = Number(urgencyScore ?? 0);

  if (normalizovano === 'zavrseno' || normalizovano === 'otkazano' || normalizovano === 'odbijeno') {
    return 'zavrsen';
  }
  if (score >= 80) return 'hitno';
  if (
    normalizovano === 'pending_review' ||
    normalizovano === 'potvrdeno' ||
    normalizovano === 'dodijeljeno' ||
    normalizovano === 'u_radu' ||
    normalizovano === 'u_izvrsenju'
  ) {
    if (normalizovano === 'pending_review') return 'novi';
    return 'u_toku';
  }
  return 'novi';
}

function izvuciNaslov(opisKvara: string | null) {
  const tekst = (opisKvara ?? '').trim();
  if (!tekst) return 'Zahtjev bez naslova';
  return tekst.split('\n')[0].trim();
}

export default async function KorisnikPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profilRaw, error: profilGreska } = await supabase
    .from('osoba')
    .select('ime, prezime')
    .eq('id_osobe', user.id)
    .maybeSingle();

  const { data: zahtjeviRaw, error: zahtjeviGreska } = await supabase
    .from('service_requests')
    .select('id, category, description, address, created_at, status, urgency_score')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<KorisnikZahtjev[]>();

  const zahtjeviPodaci = zahtjeviRaw ?? [];

  if (zahtjeviGreska) {
    console.error('Neuspjelo učitavanje korisničkih zahtjeva:', zahtjeviGreska.message);
  }
  if (profilGreska) {
    console.error('Neuspjelo učitavanje korisničkog profila:', profilGreska.message);
  }

  const imeKorisnika =
    izvuciPunoImeIzProfila(profilRaw) ||
    user.user_metadata?.ime ||
    user.email ||
    'Korisnik';

  const saBrojevima = dodijeliKorisnickeBrojeveZahtjeva(zahtjeviPodaci);
  const zahtjevi: KorisnikDashboardZahtjev[] = saBrojevima.map((zahtjev) => {
    return {
      id: String(zahtjev.id),
      korisnickiBroj: zahtjev.korisnicki_broj_zahtjeva,
      naslov: (zahtjev.category ?? '').trim() || izvuciNaslov(zahtjev.description),
      status: mapirajStatus(zahtjev.status, zahtjev.urgency_score),
      datum: formatirajDatumPrikaz(zahtjev.created_at, '-'),
      lokacija: zahtjev.address ?? 'Lokacija nije unesena',
    };
  });

  return (
    <AppShell uloga="korisnik" imeKorisnika={imeKorisnika}>
      <KorisnikPregledDashboard imeKorisnika={imeKorisnika} zahtjevi={zahtjevi} />
    </AppShell>
  );
}
