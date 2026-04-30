import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import {
  KorisnikPregledDashboard,
  type KorisnikDashboardZahtjev,
} from '@/components/korisnik/KorisnikPregledDashboard';
import { createClient } from '@/lib/supabase/server';

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

  const [{ data: profil, error: profilGreska }, { data: zahtjeviRaw, error: zahtjeviGreska }] = await Promise.all([
    supabase
      .from('osoba')
      .select('ime, prezime')
      .eq('id_osobe', user.id)
      .maybeSingle(),
    supabase
      .from('zahtjev')
      .select('id_zahtjeva, opis_kvara, adresa, datum, id_statusa')
      .eq('id_korisnika_usluge', user.id)
      .order('id_zahtjeva', { ascending: false }),
  ]);

  const statusNazivPoId = new Map<number, string>();
  if (zahtjeviRaw?.length) {
    const statusIdSet = new Set<number>();
    for (const zahtjev of zahtjeviRaw) {
      if (typeof zahtjev.id_statusa === 'number') {
        statusIdSet.add(zahtjev.id_statusa);
      }
    }

    if (statusIdSet.size > 0) {
      const { data: statusi, error: statusiGreska } = await supabase
        .from('status')
        .select('id_statusa, naziv')
        .in('id_statusa', Array.from(statusIdSet));

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

  const imeKorisnika =
    [profil?.ime, profil?.prezime].filter(Boolean).join(' ').trim() ||
    user.user_metadata?.ime ||
    user.email ||
    'Korisnik';

  const zahtjevi: KorisnikDashboardZahtjev[] = (zahtjeviRaw ?? []).map((zahtjev) => {
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
