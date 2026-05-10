'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import type { ZahtjevZaDispecerskuKarticu } from '@/components/dispecer/DispecerskaZahtjevKartica';
import { DispecerskaZahtjevPregledGridKartica } from '@/components/dispecer/DispecerskaZahtjevPregledGridKartica';
import { kreirajKlijenta } from '@/lib/supabase/klijent';
import { rangOperativnogPrioriteta } from '@/lib/servisirane/operativniPrioritet';
import {
  normalizujDispecerFilterIzParametra,
  zahtjevJeNoviUPregleduDispecera,
  zahtjevJePotvrdenPrijeIntervencije,
  zahtjevJeUObradiUPregleduDispecera,
  zahtjevUFaziDodjeleServiseraPregled,
  zahtjevUFaziDogovoraTerminaPregled,
  zahtjevUFaziKorakaPotvrdePregled,
} from '@/lib/servisirane/dispecerskeFaze';
import { sastaviDispecerskiInboxRedoslijed } from '@/lib/servisirane/urgency';

const ZAHTJEVA_PO_STRANICI = 12;

const OPCIJE_FILTRA: { value: string; label: string; title?: string }[] = [
  {
    value: 'svi',
    label: 'Sve',
    title:
      'Svi aktivni zahtjevi (isto kao na kontrolnoj tabli): inbox, potvrđeno, dodijeljeno, u toku… Bez završenih, otkazanih i odbijenih.',
  },
  {
    value: 'novi',
    label: 'Novi',
    title: 'Dispečer još nije potvrdio operativni prioritet (`final_priority` nije postavljen). Bez pod-faze.',
  },
  {
    value: 'u_obradi',
    label: 'U obradi',
    title:
      'Prioritet je postavljen; u inboxu ste do službenog „potvrđeno“. Sporedni bedž: dogovor termina, izbor servisera ili potvrda u čarobnjaku.',
  },
  {
    value: 'zakazivanje_termina',
    label: 'Dogovor termina',
    title: 'U obradi — još treba dogovoriti i zabilježiti termin (`dispecer_agreed_schedule`).',
  },
  {
    value: 'dodjela_servisera',
    label: 'Izbor servisera',
    title: 'U obradi — termin je unesen; treba odabrati servisera (`serviser_dodijeljen_id`).',
  },
  {
    value: 'korak_potvrde',
    label: 'Potvrda',
    title: 'U obradi — zadnji korak čarobnjaka prije nego status postane službeno „potvrđeno“.',
  },
  {
    value: 'potvrdeno',
    label: 'Potvrđeno',
    title: 'Samo redovi sa statusom `potvrdeno` u bazi (čarobnjak završen; sljedeće je teren).',
  },
];

const DOZVOLJENI_FILTRI = OPCIJE_FILTRA.map((o) => o.value);

const FILTRI_S_INBOX_PORETKOM = new Set([
  'svi',
  'novi',
  'u_obradi',
  'zakazivanje_termina',
  'dodjela_servisera',
  'korak_potvrde',
]);

/** Isto kao `GET /api/dispecer/zahtjevi` bez `?status=` — svi aktivni zahtjevi. */
const URL_PREGLED_ZAHTJEVA = '/api/dispecer/zahtjevi';

function filtrirajZahtjev(zahtjevi: ZahtjevZaDispecerskuKarticu[], filter: string) {
  if (!filter || filter === 'svi') return zahtjevi;
  if (filter === 'novi') return zahtjevi.filter((z) => zahtjevJeNoviUPregleduDispecera(z));
  if (filter === 'u_obradi') return zahtjevi.filter((z) => zahtjevJeUObradiUPregleduDispecera(z));
  if (filter === 'zakazivanje_termina') return zahtjevi.filter((z) => zahtjevUFaziDogovoraTerminaPregled(z));
  if (filter === 'dodjela_servisera') return zahtjevi.filter((z) => zahtjevUFaziDodjeleServiseraPregled(z));
  if (filter === 'korak_potvrde') return zahtjevi.filter((z) => zahtjevUFaziKorakaPotvrdePregled(z));
  if (filter === 'potvrdeno') return zahtjevi.filter((z) => zahtjevJePotvrdenPrijeIntervencije(z));
  return zahtjevi;
}

export function DispecerZahtjeviLista() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterIzUrl = searchParams.get('filter') ?? 'svi';

  const [zahtjevi, setZahtjevi] = useState<ZahtjevZaDispecerskuKarticu[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);
  const [imeKorisnika, setImeKorisnika] = useState('Dispečer');

  const aktivniFilter = normalizujDispecerFilterIzParametra(filterIzUrl, DOZVOLJENI_FILTRI);

  const prikazLista = useMemo(
    () => filtrirajZahtjev(zahtjevi, aktivniFilter),
    [zahtjevi, aktivniFilter]
  );

  const sortirano = useMemo(() => {
    if (FILTRI_S_INBOX_PORETKOM.has(aktivniFilter)) {
      return sastaviDispecerskiInboxRedoslijed(prikazLista).uredjeni;
    }
    return [...prikazLista].sort((a, b) => {
      const r = rangOperativnogPrioriteta(a.final_priority) - rangOperativnogPrioriteta(b.final_priority);
      if (r !== 0) return r;
      const t = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (t !== 0) return t;
      return a.id - b.id;
    });
  }, [prikazLista, aktivniFilter]);

  const ukupnoZahtjeva = sortirano.length;
  const ukupnoStranica = Math.max(1, Math.ceil(ukupnoZahtjeva / ZAHTJEVA_PO_STRANICI));

  const stranicaParam = searchParams.get('page');
  const stranicaBrojNeobraden =
    stranicaParam == null || stranicaParam === '' ? 1 : Number.parseInt(stranicaParam, 10);
  const stranicaValidna = Number.isFinite(stranicaBrojNeobraden) && stranicaBrojNeobraden >= 1;
  const aktivnaStranica = stranicaValidna
    ? Math.min(stranicaBrojNeobraden, ukupnoStranica)
    : 1;

  const prikazZaOvuStranicu = useMemo(() => {
    const pocetak = (aktivnaStranica - 1) * ZAHTJEVA_PO_STRANICI;
    return sortirano.slice(pocetak, pocetak + ZAHTJEVA_PO_STRANICI);
  }, [sortirano, aktivnaStranica]);

  const qsZaStranicu = useCallback(
    (stranica: number) => {
      const p = new URLSearchParams(searchParams.toString());
      if (stranica <= 1) p.delete('page');
      else p.set('page', String(stranica));
      const qs = p.toString();
      return qs ? `/dispecer/zahtjevi?${qs}` : '/dispecer/zahtjevi';
    },
    [searchParams]
  );

  useEffect(() => {
    if (ucitava || ukupnoZahtjeva === 0) return;
    if (!stranicaValidna || stranicaBrojNeobraden > ukupnoStranica) {
      router.replace(qsZaStranicu(aktivnaStranica), { scroll: false });
    }
  }, [
    ucitava,
    ukupnoZahtjeva,
    ukupnoStranica,
    stranicaValidna,
    stranicaBrojNeobraden,
    aktivnaStranica,
    qsZaStranicu,
    router,
  ]);

  const ucitajZahtjeve = useCallback(async (tiho = false) => {
    if (!tiho) {
      setUcitava(true);
      setGreska(null);
    }
    try {
      const r = await fetch(URL_PREGLED_ZAHTJEVA, { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri učitavanju podataka.');
      setZahtjevi(d.zahtjevi ?? []);
    } catch (err) {
      if (!tiho) {
        setGreska(err instanceof Error ? err.message : 'Došlo je do greške.');
      }
    } finally {
      if (!tiho) {
        setUcitava(false);
      }
    }
  }, []);

  useEffect(() => {
    void ucitajZahtjeve(false);
  }, [ucitajZahtjeve]);

  useEffect(() => {
    const t = setInterval(() => {
      void ucitajZahtjeve(true);
    }, 25_000);
    return () => clearInterval(t);
  }, [ucitajZahtjeve]);

  useEffect(() => {
    const supabase = kreirajKlijenta();
    let mounted = true;

    const ucitajIme = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!mounted || !user) return;

      const { data: profil } = await supabase
        .from('osoba')
        .select('ime, prezime')
        .eq('id_osobe', user.id)
        .maybeSingle();

      const imeIzProfila = [profil?.ime, profil?.prezime].filter(Boolean).join(' ').trim();
      const imeIzMeta = [user.user_metadata?.ime, user.user_metadata?.prezime]
        .filter(Boolean)
        .join(' ')
        .trim();

      setImeKorisnika(imeIzProfila || imeIzMeta || user.email || 'Dispečer');
    };

    void ucitajIme();
    return () => {
      mounted = false;
    };
  }, []);

  function promijeniFilter(novaVrijednost: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (!novaVrijednost || novaVrijednost === 'svi') p.delete('filter');
    else p.set('filter', novaVrijednost);
    p.delete('page');
    const qs = p.toString();
    router.push(qs ? `/dispecer/zahtjevi?${qs}` : '/dispecer/zahtjevi');
  }

  return (
    <AppShell uloga="dispecer" imeKorisnika={imeKorisnika}>
      <div className="mx-auto w-full max-w-6xl sm:px-0">
      <div className="mb-6">
        <Link
          href="/dispecer"
          className="mb-4 inline-flex items-center gap-1 text-sm"
          style={{ color: 'var(--first-nonary)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Nazad na kontrolnu ploču
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
              Pregled zahtjeva
            </h1>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => void ucitajZahtjeve(false)}
            isLoading={ucitava}
            loadingText="Osvježavanje..."
          >
            <RefreshCw className="h-4 w-4" />
            Osvježi
          </Button>
        </div>
      </div>

      {greska && (
        <div className="mb-6">
          <AlertMessage variant="error" message={greska} />
        </div>
      )}

      {ucitava && (
        <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
          Učitavanje zahtjeva...
        </p>
      )}

      {!ucitava && (
        <div className="mb-4 overflow-x-auto">
          <div
            className="inline-flex min-w-full gap-2 rounded-xl p-1 sm:min-w-0"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.24)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
            }}
            role="tablist"
            aria-label="Filter prikaza zahtjeva"
          >
            {OPCIJE_FILTRA.map((opcija) => {
              const aktivan = opcija.value === aktivniFilter;
              return (
                <button
                  key={opcija.value}
                  type="button"
                  role="tab"
                  aria-selected={aktivan}
                  title={opcija.title ?? opcija.label}
                  onClick={() => promijeniFilter(opcija.value)}
                  className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm"
                  style={{
                    backgroundColor: aktivan ? 'rgb(var(--first-secondary-rgb) / 0.12)' : 'transparent',
                    color: aktivan ? 'var(--first-secondary)' : 'var(--first-nonary)',
                    border: aktivan ? '1px solid rgb(var(--first-secondary-rgb) / 0.35)' : '1px solid transparent',
                  }}
                >
                  {opcija.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!ucitava && sortirano.length === 0 && (
        <div
          className="rounded-2xl p-8 text-center shadow-card"
          style={{
            backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
            border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
          }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
            Nema zahtjeva za odabrani filter
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
            Promijenite filter ili osvježite pregled.
          </p>
        </div>
      )}

      {!ucitava && sortirano.length > 0 && (
        <>
          <ul
            className="grid min-w-0 gap-5
              [grid-template-columns:repeat(auto-fill,minmax(min(100%,17.5rem),22rem))]"
            aria-label={`Zahtjevi, stranica ${aktivnaStranica} od ${ukupnoStranica}`}
          >
            {prikazZaOvuStranicu.map((z) => (
              <li key={z.id} className="min-w-0 w-full">
                <DispecerskaZahtjevPregledGridKartica zahtjev={z} />
              </li>
            ))}
          </ul>

          {ukupnoStranica > 1 && (
            <nav
              className="mt-8 flex min-w-0 flex-col items-stretch justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center"
              style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.25)' }}
              aria-label="Paginacija liste zahtjeva"
            >
              <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
                Prikazano{' '}
                <span className="font-semibold tabular-nums" style={{ color: 'var(--first-octonary)' }}>
                  {(aktivnaStranica - 1) * ZAHTJEVA_PO_STRANICI + 1}
                  –
                  {Math.min(aktivnaStranica * ZAHTJEVA_PO_STRANICI, ukupnoZahtjeva)}
                </span>{' '}
                od{' '}
                <span className="font-semibold tabular-nums" style={{ color: 'var(--first-octonary)' }}>
                  {ukupnoZahtjeva}
                </span>
                <span className="hidden sm:inline">
                  {' '}
                  · stranica{' '}
                  <span className="tabular-nums">{aktivnaStranica}</span> /{' '}
                  <span className="tabular-nums">{ukupnoStranica}</span>
                </span>
              </p>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Link
                  href={qsZaStranicu(aktivnaStranica - 1)}
                  scroll
                  aria-disabled={aktivnaStranica <= 1}
                  className={[
                    'inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
                    aktivnaStranica <= 1 ? 'pointer-events-none opacity-45' : 'hover:bg-black/[0.03]',
                  ].join(' ')}
                  style={{
                    borderColor: 'rgb(var(--first-quaternary-rgb) / 0.4)',
                    color: 'var(--first-octonary)',
                  }}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Prethodna
                </Link>
                <Link
                  href={qsZaStranicu(aktivnaStranica + 1)}
                  scroll
                  aria-disabled={aktivnaStranica >= ukupnoStranica}
                  className={[
                    'inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
                    aktivnaStranica >= ukupnoStranica ? 'pointer-events-none opacity-45' : 'hover:bg-black/[0.03]',
                  ].join(' ')}
                  style={{
                    borderColor: 'rgb(var(--first-quaternary-rgb) / 0.4)',
                    color: 'var(--first-octonary)',
                  }}
                >
                  Naredna
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </nav>
          )}
        </>
      )}
      </div>
    </AppShell>
  );
}
