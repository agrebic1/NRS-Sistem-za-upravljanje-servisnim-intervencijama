import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import {
  KorisnikPregledDashboard,
  type KorisnikDashboardZahtjev,
} from '@/components/korisnik/KorisnikPregledDashboard';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/domain/types/supabase';

type KorisnikZahtjev = Pick<Tables<'zahtjev'>, 'id_zahtjeva' | 'opis_kvara' | 'adresa' | 'datum' | 'id_statusa'>;
type StatusOpcija = Pick<Tables<'status'>, 'id_statusa' | 'naziv'>;

function izvuciPunoImeIzProfila(profil: unknown): string {
  if (!profil || typeof profil !== 'object') return '';

  const zapis = profil as Record<string, unknown>;
  const ime = typeof zapis.ime === 'string' ? zapis.ime.trim() : '';
  const prezime = typeof zapis.prezime === 'string' ? zapis.prezime.trim() : '';

  return [ime, prezime].filter(Boolean).join(' ').trim();
}

function mapirajStatus(vrijednost: string | null | undefined): KorisnikDashboardZahtjev['status'] {
  const normalizovano = (vrijednost ?? '').toLowerCase();

  if (normalizovano.includes('hit')) return 'hitno';
  if (normalizovano.includes('zavr')) return 'zavrsen';
  if (normalizovano.includes('tok') || normalizovano.includes('obradi')) return 'u_toku';
  return 'novi';
}

function formatirajDatum(vrijednost: string | null) {
  if (!vrijednost) return '-';
  const datum = new Date(vrijednost);
  if (Number.isNaN(datum.getTime())) return vrijednost;
  return new Intl.DateTimeFormat('bs-BA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(datum);
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
    .from('zahtjev')
    .select('id_zahtjeva, opis_kvara, adresa, datum, id_statusa')
    .eq('id_korisnika_usluge', user.id)
    .order('id_zahtjeva', { ascending: false })
    .returns<KorisnikZahtjev[]>();

  const zahtjeviPodaci = zahtjeviRaw ?? [];

  const statusNazivPoId = new Map<number, string>();
  if (zahtjeviPodaci.length) {
    const statusIdSet = new Set<number>();
    for (const zahtjev of zahtjeviPodaci) {
      if (typeof zahtjev.id_statusa === 'number') {
        statusIdSet.add(zahtjev.id_statusa);
      }
    }

    if (statusIdSet.size > 0) {
      const { data: statusi, error: statusiGreska } = await supabase
        .from('status')
        .select('id_statusa, naziv')
        .in('id_statusa', Array.from(statusIdSet))
        .returns<StatusOpcija[]>();

      if (!statusiGreska) {
        for (const status of statusi ?? []) {
          statusNazivPoId.set(status.id_statusa, status.naziv);
        }
      } else {
        console.error('Neuspjelo učitavanje statusa zahtjeva:', statusiGreska.message);
      }
    }
  }

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

  const zahtjevi: KorisnikDashboardZahtjev[] = zahtjeviPodaci.map((zahtjev) => {
    return {
      id: String(zahtjev.id_zahtjeva),
      naslov: izvuciNaslov(zahtjev.opis_kvara),
      status: mapirajStatus(statusNazivPoId.get(zahtjev.id_statusa ?? -1)),
      datum: formatirajDatum(zahtjev.datum),
      lokacija: zahtjev.adresa ?? 'Lokacija nije unesena',
    };
  });

  return (
    <AppShell uloga="korisnik" imeKorisnika={imeKorisnika}>
      <KorisnikPregledDashboard imeKorisnika={imeKorisnika} zahtjevi={zahtjevi} />
    </AppShell>
  );
}
