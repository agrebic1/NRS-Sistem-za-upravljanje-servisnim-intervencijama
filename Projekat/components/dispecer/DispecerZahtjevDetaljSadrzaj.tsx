'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { DispecerDetaljiZahtjevaKartica } from '@/components/dispecer/DispecerDetaljiZahtjevaKartica';
import {
  DispecerPremiumKruna,
  DispecerStatusBadge,
  KorisnickaHitnostOutlinedChip,
  PremiumHitnaBadge,
} from '@/components/servisirane/zahtjevBadgeovi';
import { ZahtjevKorisnickaPorukaBubble } from '@/components/servisirane/ZahtjevTimelineIPoruka';
import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';
import { uRecenicu } from '@/lib/servisirane/zahtjevPrikaz';
import {
  DISPECER_HITNOST_KORISNIK_NASLOV,
  DISPECER_OPERATIVNI_NASLOV,
  DISPECER_OPERATIVNI_SELECT_NASLOV,
  DISPECER_OPERATIVNI_SELECT_OPIS,
} from '@/lib/servisirane/dispecerPojmovi';
import { dispecerSmijeMijenjatiOperativniPrioritet } from '@/lib/servisirane/statusZahtjeva';
import { efektivniKorisnickiUrgencyScore } from '@/lib/servisirane/urgency';

type ZahtjevDetalj = ServisniZahtjev & {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
};

const NIVOI_OPERATIVNOG_PRIORITETA = ['NISKO', 'SREDNJE', 'VISOKO', 'KRITIČNO', 'HITNO'] as const;
type NivoOperativnogPrioriteta = (typeof NIVOI_OPERATIVNOG_PRIORITETA)[number];

const KORACI_WIZARDA = [
  { kljuc: 'pregled', naslov: 'Pregled' },
  { kljuc: 'prioritet', naslov: 'Prioritet' },
  { kljuc: 'termin', naslov: 'Termin i serviser' },
  { kljuc: 'nalog', naslov: 'Pregled naloga' },
  { kljuc: 'potvrda', naslov: 'Potvrda' },
] as const;

const ZADNJI_KORAK_INDEKS = KORACI_WIZARDA.length - 1;

const PORUKA_SACUVAJ_PRIORITET_PRIJE_NASTAVKA = 'Prije nastavka sačuvajte operativni prioritet.';

function normalizujFinalPriority(v: string | null | undefined): string | null {
  const t = v?.trim();
  return t ? t : null;
}

function inicijalniPrioritet(zahtjev: ServisniZahtjev): NivoOperativnogPrioriteta {
  const fp = zahtjev.final_priority?.trim();
  if (fp && (NIVOI_OPERATIVNOG_PRIORITETA as readonly string[]).includes(fp)) {
    return fp as NivoOperativnogPrioriteta;
  }
  if (zahtjev.is_premium) return 'HITNO';
  return 'SREDNJE';
}

/** Viši broj = viši operativni prioritet (za usporedbu smanjenja). */
const RANG_OPERATIVNOG_PRIORITETA: Record<NivoOperativnogPrioriteta, number> = {
  NISKO: 1,
  SREDNJE: 2,
  VISOKO: 3,
  KRITIČNO: 4,
  HITNO: 5,
};

function referencniPrioritetZaSmanjenje(
  zahtjev: ServisniZahtjev,
  fpNaServeru: string | null,
): NivoOperativnogPrioriteta {
  if (
    fpNaServeru &&
    (NIVOI_OPERATIVNOG_PRIORITETA as readonly string[]).includes(fpNaServeru)
  ) {
    return fpNaServeru as NivoOperativnogPrioriteta;
  }
  return inicijalniPrioritet(zahtjev);
}

function jeOperativniPrioritetSmanjen(
  odabrano: NivoOperativnogPrioriteta,
  referenca: NivoOperativnogPrioriteta,
): boolean {
  return RANG_OPERATIVNOG_PRIORITETA[odabrano] < RANG_OPERATIVNOG_PRIORITETA[referenca];
}

function DispecerObradaWizardStepper({
  aktivniKorak,
  najdaljiDostupniKorak,
  onOdabirKoraka,
  onPokusajZakljucanKorak,
}: {
  aktivniKorak: number;
  najdaljiDostupniKorak: number;
  onOdabirKoraka: (i: number) => void;
  /** Kad korisnik klikne korak koji još nije dostupan (npr. prije spremljenog prioriteta). */
  onPokusajZakljucanKorak?: (indeks: number) => void;
}) {
  return (
    <nav aria-label="Koraci obrade zahtjeva" className="mt-4 min-w-0">
      <ol className="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-5">
        {KORACI_WIZARDA.map((korak, indeks) => {
          const jeAktivan = indeks === aktivniKorak;
          const jeZavrsen = indeks < aktivniKorak;
          const mozeKlik = indeks <= najdaljiDostupniKorak;
          const jeOnemogucen = !mozeKlik;

          return (
            <li key={korak.kljuc} className="min-w-0">
              <button
                type="button"
                aria-disabled={jeOnemogucen}
                tabIndex={jeOnemogucen ? -1 : 0}
                onClick={() => {
                  if (mozeKlik) {
                    onOdabirKoraka(indeks);
                  } else {
                    onPokusajZakljucanKorak?.(indeks);
                  }
                }}
                aria-current={jeAktivan ? 'step' : undefined}
                className={[
                  'flex w-full min-w-0 flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-center transition-colors sm:flex-row sm:justify-center sm:gap-2 sm:px-3',
                  jeOnemogucen ? 'cursor-not-allowed opacity-45' : 'hover:bg-black/[0.03]',
                  jeAktivan ? 'ring-2 ring-celestial-teal/50' : '',
                ].join(' ')}
                style={{
                  backgroundColor: jeAktivan ? 'rgb(var(--first-quaternary-rgb) / 0.12)' : 'transparent',
                  border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
                }}
              >
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums"
                  style={{
                    backgroundColor: jeZavrsen
                      ? 'rgb(13 148 136 / 0.2)'
                      : jeAktivan
                        ? 'rgb(13 148 136 / 0.35)'
                        : 'rgb(var(--first-quaternary-rgb) / 0.2)',
                    color: 'var(--first-octonary)',
                  }}
                  aria-hidden
                >
                  {jeZavrsen ? <Check className="h-4 w-4" strokeWidth={2.5} /> : indeks + 1}
                </span>
                <span
                  className={[
                    'text-[11px] font-semibold leading-tight sm:text-xs',
                    jeAktivan ? '' : 'font-medium',
                  ].join(' ')}
                  style={{ color: jeOnemogucen ? 'var(--first-nonary)' : 'var(--first-octonary)' }}
                >
                  {korak.naslov}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const NAPOMENA_PLACEHOLDER_DEFAULT =
  'Ova faza još nije povezana s podacima — omogućava dispečeru pregled cjelokupnog plana obrade.';

function PlaceholderKoraka({
  naslov,
  uvod,
  stavke,
  oznaka,
  napomenaDno,
}: {
  naslov: string;
  uvod: string;
  stavke: string[];
  /** Npr. „Korak … — placeholder“ iznad naslova. */
  oznaka?: string;
  napomenaDno?: string;
}) {
  const tekstDno = napomenaDno ?? NAPOMENA_PLACEHOLDER_DEFAULT;
  return (
    <div className="min-w-0 space-y-4">
      {oznaka ? (
        <p
          className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: 'rgb(var(--first-nonary-rgb) / 0.78)' }}
        >
          {oznaka}
        </p>
      ) : null}
      <h2 className="text-base font-semibold" style={{ color: 'var(--first-octonary)' }}>
        {naslov}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--first-nonary)' }}>
        {uvod}
      </p>
      <ul className="m-0 list-disc space-y-2 pl-5 text-sm leading-relaxed" style={{ color: 'var(--first-octonary)' }}>
        {stavke.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p className="rounded-xl border px-3 py-2 text-xs font-medium leading-snug" style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.35)', color: 'rgb(var(--first-nonary-rgb) / 0.92)' }}>
        {tekstDno}
      </p>
    </div>
  );
}

export function DispecerZahtjevDetaljSadrzaj({
  zahtjev,
  requestId,
  onRequestUpdated,
  prikaziDugmeNazad = false,
  hrefNazad = '/dispecer',
}: {
  zahtjev: ZahtjevDetalj;
  requestId: string;
  onRequestUpdated?: (zahtjev: ZahtjevDetalj) => void;
  prikaziDugmeNazad?: boolean;
  /** Npr. `/dispecer?z=123` da se na kontrolnoj tabli zadrži isti zahtjev. */
  hrefNazad?: string;
}) {
  const [akcijaGreska, setAkcijaGreska] = useState<string | null>(null);
  const [jeSlanje, setJeSlanje] = useState(false);
  const [prioritet, setPrioritet] = useState<NivoOperativnogPrioriteta>('SREDNJE');
  const [downgradeRazlog, setDowngradeRazlog] = useState('');
  const [aktivniKorak, setAktivniKorak] = useState(0);
  const [greskaOperativnogPrioriteta, setGreskaOperativnogPrioriteta] = useState<string | null>(null);
  const refObrazlozenjeSmanjenja = useRef<HTMLTextAreaElement>(null);
  const bioObrazlozenjeSmanjenjaPrikazano = useRef(false);

  const kategorija = labelKategorije(zahtjev);
  const { glavna: naslovKategorija, podkategorija: naslovPodkategorija } = kategorija;
  const porukaKorisnikaTekst = uRecenicu((zahtjev.description ?? '').trim());

  const mozeMijenjatiPrioritet = dispecerSmijeMijenjatiOperativniPrioritet(zahtjev.status);

  const fpNaServeru = normalizujFinalPriority(zahtjev.final_priority);

  const prioritetIzmijenjen = prioritet !== (fpNaServeru ?? '');

  const razlogNaServeru = (zahtjev.premium_priority_override_reason ?? '').trim();
  const razlogDowngradeIzmijenjen =
    zahtjev.is_premium &&
    prioritet !== 'HITNO' &&
    downgradeRazlog.trim() !== razlogNaServeru;

  const formaNijeSinhronizirana =
    mozeMijenjatiPrioritet && (prioritetIzmijenjen || razlogDowngradeIzmijenjen);

  const mozeNapredovatiNaPlaceholdere =
    !mozeMijenjatiPrioritet || (fpNaServeru !== null && !formaNijeSinhronizirana);

  const najdaljiDostupniKorak = mozeNapredovatiNaPlaceholdere ? ZADNJI_KORAK_INDEKS : 1;

  const referencaZaSmanjenje = referencniPrioritetZaSmanjenje(zahtjev, fpNaServeru);
  const prikaziPoljeObrazlozenjaSmanjenja =
    (zahtjev.is_premium && prioritet !== 'HITNO') ||
    jeOperativniPrioritetSmanjen(prioritet, referencaZaSmanjenje);

  const labelObrazlozenjaSmanjenja =
    zahtjev.is_premium && prioritet !== 'HITNO'
      ? 'Obrazloženje za operativni prioritet ispod HITNO (obavezno za premium zahtjeve)'
      : 'Obrazloženje za smanjenje operativnog prioriteta';

  useEffect(() => {
    setPrioritet(inicijalniPrioritet(zahtjev));
    setDowngradeRazlog('');
    setAkcijaGreska(null);
    setGreskaOperativnogPrioriteta(null);
    bioObrazlozenjeSmanjenjaPrikazano.current = false;
  }, [zahtjev]);

  useEffect(() => {
    if (aktivniKorak > najdaljiDostupniKorak) {
      setAktivniKorak(najdaljiDostupniKorak);
    }
  }, [aktivniKorak, najdaljiDostupniKorak]);

  useEffect(() => {
    const sada =
      prikaziPoljeObrazlozenjaSmanjenja && mozeMijenjatiPrioritet && aktivniKorak === 1;
    if (!sada) {
      bioObrazlozenjeSmanjenjaPrikazano.current = false;
      return;
    }
    if (bioObrazlozenjeSmanjenjaPrikazano.current) return;

    const id = requestAnimationFrame(() => {
      const el = refObrazlozenjeSmanjenja.current;
      el?.focus({ preventScroll: false });
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      bioObrazlozenjeSmanjenjaPrikazano.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, [
    aktivniKorak,
    mozeMijenjatiPrioritet,
    prioritet,
    prikaziPoljeObrazlozenjaSmanjenja,
  ]);

  async function osvjeziZahtjevNakonAkcije() {
    const rr = await fetch(`/api/dispecer/zahtjevi/${requestId}`, { cache: 'no-store' });
    const dd = await rr.json();
    if (!rr.ok) throw new Error(dd.error ?? 'Greška pri učitavanju zahtjeva sa servera.');
    onRequestUpdated?.(dd.zahtjev as ZahtjevDetalj);
  }

  async function sacuvajOperativniPrioritet(): Promise<boolean> {
    if (!mozeMijenjatiPrioritet) return false;
    setJeSlanje(true);
    setAkcijaGreska(null);
    setGreskaOperativnogPrioriteta(null);
    try {
      const r = await fetch(`/api/dispecer/zahtjevi/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'promijeni_prioritet',
          final_priority: prioritet,
          premium_downgrade_reason: downgradeRazlog,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri snimanju prioriteta.');
      await osvjeziZahtjevNakonAkcije();
      return true;
    } catch (e) {
      setAkcijaGreska(e instanceof Error ? e.message : 'Greška pri snimanju prioriteta.');
      return false;
    } finally {
      setJeSlanje(false);
    }
  }

  return (
    <>
      <header className="mb-6 min-w-0">
        <h1
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xl font-bold leading-snug"
          style={{ color: 'var(--first-octonary)' }}
        >
          <span className="inline-flex items-center gap-2">
            #{zahtjev.id}
            {zahtjev.is_premium ? <DispecerPremiumKruna /> : null}
          </span>
          <span className="min-w-0">{naslovPodkategorija || naslovKategorija}</span>
        </h1>
        {naslovPodkategorija && (
          <p className="mt-0.5 text-sm font-medium leading-snug" style={{ color: 'var(--first-nonary)' }}>
            {naslovKategorija}
          </p>
        )}
        {zahtjev.is_premium && (
          <div className="mt-2">
            <PremiumHitnaBadge />
          </div>
        )}
      </header>

      <DispecerObradaWizardStepper
        aktivniKorak={aktivniKorak}
        najdaljiDostupniKorak={najdaljiDostupniKorak}
        onOdabirKoraka={setAktivniKorak}
        onPokusajZakljucanKorak={(indeks) => {
          if (!mozeMijenjatiPrioritet) return;
          if (indeks >= 2 && !mozeNapredovatiNaPlaceholdere) {
            setGreskaOperativnogPrioriteta(PORUKA_SACUVAJ_PRIORITET_PRIJE_NASTAVKA);
            setAktivniKorak(1);
          }
        }}
      />

      <div
        className="mt-5 rounded-2xl bg-white p-6 shadow-card"
        style={{ border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}
      >
        {aktivniKorak === 0 && (
          <>
            <h2 className="mb-5 text-base font-semibold" style={{ color: 'var(--first-octonary)' }}>
              Pregled zahtjeva
            </h2>
            <DispecerDetaljiZahtjevaKartica zahtjev={zahtjev} />
          </>
        )}

        {aktivniKorak === 1 && (
          <>
            <h2 className="mb-5 text-base font-semibold" style={{ color: 'var(--first-octonary)' }}>
              Operativni prioritet
            </h2>
            <div
              className="mb-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 sm:gap-6"
              style={{ color: 'var(--first-octonary)' }}
            >
              <div>
                <p
                  className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: 'rgb(var(--first-nonary-rgb) / 0.72)' }}
                >
                  Status
                </p>
                <DispecerStatusBadge status={zahtjev.status} />
              </div>
              <div>
                <p
                  className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: 'rgb(var(--first-nonary-rgb) / 0.72)' }}
                >
                  {DISPECER_HITNOST_KORISNIK_NASLOV}
                </p>
                <KorisnickaHitnostOutlinedChip score={efektivniKorisnickiUrgencyScore(zahtjev)} />
              </div>
              <div className="min-w-0 sm:col-span-2">
                <p
                  className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: 'rgb(var(--first-nonary-rgb) / 0.72)' }}
                >
                  Poruka korisnika
                </p>
                {porukaKorisnikaTekst ? (
                  <ZahtjevKorisnickaPorukaBubble tekst={porukaKorisnikaTekst} className="mb-0 mt-0" />
                ) : (
                  <p className="text-sm font-medium" style={{ color: 'var(--first-nonary)' }}>
                    —
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <p
                  className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: 'rgb(var(--first-nonary-rgb) / 0.72)' }}
                >
                  {DISPECER_OPERATIVNI_NASLOV} (u sistemu)
                </p>
                <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--first-octonary)' }}>
                  {fpNaServeru ?? '—'}
                </p>
              </div>
            </div>

            {zahtjev.is_premium && zahtjev.premium_priority_override_reason?.trim() && (
              <div
                className="mb-5 rounded-xl border px-3 py-2 text-sm"
                style={{
                  borderColor: 'rgba(37, 99, 235, 0.25)',
                  color: '#1D4ED8',
                  backgroundColor: 'rgba(37, 99, 235, 0.06)',
                }}
              >
                <span className="font-semibold">Obrazloženje smanjenja operativnog prioriteta: </span>
                {zahtjev.premium_priority_override_reason}
              </div>
            )}

            {akcijaGreska && (
              <div className="mb-5">
                <AlertMessage variant="error" message={akcijaGreska} />
              </div>
            )}

            {mozeMijenjatiPrioritet ? (
              <div className="space-y-3">
                <div>
                  <Select
                    label={DISPECER_OPERATIVNI_SELECT_NASLOV}
                    id="dispecer-op-prioritet"
                    value={prioritet}
                    error={greskaOperativnogPrioriteta ?? undefined}
                    options={[
                      { value: 'NISKO', label: 'NISKO' },
                      { value: 'SREDNJE', label: 'SREDNJE' },
                      { value: 'VISOKO', label: 'VISOKO' },
                      { value: 'KRITIČNO', label: 'KRITIČNO' },
                      { value: 'HITNO', label: 'HITNO' },
                    ]}
                    onChange={(e) => {
                      setGreskaOperativnogPrioriteta(null);
                      setPrioritet(e.target.value as NivoOperativnogPrioriteta);
                    }}
                  />
                  <p className="mt-1.5 text-[11px] leading-snug" style={{ color: 'rgb(var(--first-nonary-rgb) / 0.72)' }}>
                    {DISPECER_OPERATIVNI_SELECT_OPIS}
                  </p>
                </div>
                {prikaziPoljeObrazlozenjaSmanjenja && (
                  <Textarea
                    ref={refObrazlozenjeSmanjenja}
                    label={labelObrazlozenjaSmanjenja}
                    id="dispecer-premium-downgrade"
                    rows={3}
                    value={downgradeRazlog}
                    onChange={(e) => setDowngradeRazlog(e.target.value)}
                  />
                )}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
                Za ovaj status operativni prioritet se više ne mijenja putem ovog obrasca.
              </p>
            )}
          </>
        )}

        {aktivniKorak === 2 && (
          <PlaceholderKoraka
            oznaka="Korak „Termin i serviser“ — u pripremi"
            naslov="Termin i serviser"
            uvod="U narednoj fazi ovaj korak će omogućiti:"
            stavke={[
              'potvrdu termina intervencije',
              'odabir dostupnog servisera',
              'provjeru dostupnosti servisera',
              'dodjelu servisera zahtjevu',
            ]}
            napomenaDno="Funkcionalnost još nije povezana s podacima."
          />
        )}

        {aktivniKorak === 3 && (
          <PlaceholderKoraka
            oznaka="Korak „Pregled naloga“ — u pripremi"
            naslov="Pregled naloga"
            uvod="Ovdje će biti prikazan konačni pregled naloga prije potvrde:"
            stavke={[
              'podaci o zahtjevu',
              'korisnik',
              'lokacija',
              'operativni prioritet',
              'potvrđeni termin',
              'dodijeljeni serviser',
              'napomena dispečera',
            ]}
            napomenaDno="Funkcionalnost još nije povezana s podacima."
          />
        )}

        {aktivniKorak === 4 && (
          <PlaceholderKoraka
            naslov="Potvrda"
            uvod="Završni korak će potvrditi usklađenost termina, servisera i naloga te obavijestiti korisnika."
            stavke={[
              'Zapis konačnog stanja zahtjeva u životnom ciklusu (npr. potvrda uz validne podatke).',
              'Slanje obavijesti korisniku i serviseru kad kanali budu spremni.',
              'Zatvaranje čarobnjaka uz zapis ko je potvrdio i kada.',
            ]}
          />
        )}

        <div
          className="mt-8 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
          style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.22)' }}
        >
          {aktivniKorak === 0 && (
            <Button type="button" variant="primary" size="md" className="w-full sm:ml-auto sm:w-auto" onClick={() => setAktivniKorak(1)}>
              Nastavi
            </Button>
          )}

          {aktivniKorak === 1 && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
                onClick={() => setAktivniKorak(0)}
              >
                Nazad
              </Button>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                {mozeMijenjatiPrioritet && formaNijeSinhronizirana && (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      className="w-full sm:w-auto"
                      isLoading={jeSlanje}
                      onClick={() => void sacuvajOperativniPrioritet()}
                    >
                      Sačuvaj operativni prioritet
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      className="w-full sm:w-auto"
                      isLoading={jeSlanje}
                      onClick={async () => {
                        const ok = await sacuvajOperativniPrioritet();
                        if (ok) setAktivniKorak(2);
                      }}
                    >
                      Sačuvaj i nastavi
                    </Button>
                  </>
                )}
                {(!mozeMijenjatiPrioritet || !formaNijeSinhronizirana) && (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto"
                    disabled={jeSlanje}
                    onClick={() => {
                      if (!mozeMijenjatiPrioritet) {
                        setGreskaOperativnogPrioriteta(null);
                        setAktivniKorak(2);
                        return;
                      }
                      if (mozeNapredovatiNaPlaceholdere) {
                        setGreskaOperativnogPrioriteta(null);
                        setAktivniKorak(2);
                      } else {
                        setGreskaOperativnogPrioriteta(PORUKA_SACUVAJ_PRIORITET_PRIJE_NASTAVKA);
                      }
                    }}
                  >
                    Nastavi
                  </Button>
                )}
              </div>
            </>
          )}

          {aktivniKorak >= 2 && aktivniKorak < ZADNJI_KORAK_INDEKS && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
                onClick={() => setAktivniKorak((k) => k - 1)}
              >
                Nazad
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full sm:ml-auto sm:w-auto"
                onClick={() => setAktivniKorak((k) => k + 1)}
              >
                Nastavi
              </Button>
            </>
          )}

          {aktivniKorak === ZADNJI_KORAK_INDEKS && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => setAktivniKorak((k) => k - 1)}
            >
              Nazad
            </Button>
          )}
        </div>
      </div>

      {prikaziDugmeNazad && (
        <div className="mt-6">
          <Link
            href={hrefNazad}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-soft-beige bg-transparent px-5 py-2 text-sm font-semibold text-deep-teal transition-colors hover:border-celestial-teal hover:bg-celestial-teal/5 focus:outline-none focus:ring-2 focus:ring-celestial-teal/40 focus:ring-offset-2"
          >
            Nazad na obradu zahtjeva
          </Link>
        </div>
      )}
    </>
  );
}
