'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, MapPin, User, Wrench } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { formatirajDatumVrijemeZaPrikaz } from '@/lib/format/datumi';
import { DISPECER_PALETA_STATUS } from '@/lib/servisirane/dispecerPaleta';
import {
  type IntervencijaKosturRed,
  type IntervencijaKosturStatus,
  NAZIV_STATUSA_INTERVENCIJE_KOSTUR,
} from '@/lib/servisirane/intervencijaKostur';
import { kreirajKlijenta } from '@/lib/supabase/klijent';
import type { UserRole } from '@/domain/types';

function paletaZaStatus(status: IntervencijaKosturStatus) {
  switch (status) {
    case 'planirana':
      return DISPECER_PALETA_STATUS.terminPotvrden;
    case 'ceka_dodjelu':
      return DISPECER_PALETA_STATUS.uObradi;
    case 'dodijeljena':
      return DISPECER_PALETA_STATUS.dodijeljeno;
    case 'u_toku':
      return DISPECER_PALETA_STATUS.uToku;
    case 'zavrsena':
      return DISPECER_PALETA_STATUS.zavrseno;
    default:
      return DISPECER_PALETA_STATUS.neutral;
  }
}

const SVI_STATUSI_INTERVENCIJE: IntervencijaKosturStatus[] = [
  'planirana',
  'ceka_dodjelu',
  'dodijeljena',
  'u_toku',
  'zavrsena',
];

function filtriraj(
  redovi: IntervencijaKosturRed[],
  filter: 'svi' | IntervencijaKosturStatus,
) {
  if (filter === 'svi') return redovi;
  return redovi.filter((r) => r.status === filter);
}

export function IntervencijeKosturEkran({
  uloga,
  mockRedovi,
}: {
  uloga: Extract<UserRole, 'dispecer' | 'serviser'>;
  mockRedovi: IntervencijaKosturRed[];
}) {
  type FilterVrijednost = 'svi' | IntervencijaKosturStatus;

  const [filter, setFilter] = useState<FilterVrijednost>('svi');
  const [imeKorisnika, setImeKorisnika] = useState(uloga === 'dispecer' ? 'Dispečer' : 'Serviser');

  const opcijeFiltra = useMemo(() => {
    const statusi =
      uloga === 'serviser'
        ? SVI_STATUSI_INTERVENCIJE.filter((s) => s !== 'ceka_dodjelu')
        : SVI_STATUSI_INTERVENCIJE;
    return [
      { value: 'svi' as const, label: 'Sve' },
      ...statusi.map((s) => ({ value: s, label: NAZIV_STATUSA_INTERVENCIJE_KOSTUR[s] })),
    ];
  }, [uloga]);

  const prikaz = useMemo(() => filtriraj(mockRedovi, filter), [mockRedovi, filter]);

  const kpi = useMemo(() => {
    const ukupno = mockRedovi.length;
    const zavrseno = mockRedovi.filter((r) => r.status === 'zavrsena').length;
    if (uloga === 'serviser') {
      const zakazano = mockRedovi.filter((r) => r.status === 'planirana').length;
      const uTijeku = mockRedovi.filter((r) => r.status === 'dodijeljena' || r.status === 'u_toku').length;
      return {
        kartice: [
          { oznaka: 'Ukupno', vrijednost: ukupno, Ikona: Wrench },
          { oznaka: 'Zakazano', vrijednost: zakazano, Ikona: CalendarClock },
          { oznaka: 'U putu / na terenu', vrijednost: uTijeku, Ikona: MapPin },
          { oznaka: 'Završeno', vrijednost: zavrseno, Ikona: Wrench },
        ],
      };
    }
    const cekaDodjelu = mockRedovi.filter((r) => r.status === 'ceka_dodjelu').length;
    const aktivno = mockRedovi.filter(
      (r) => r.status === 'planirana' || r.status === 'dodijeljena' || r.status === 'u_toku',
    ).length;
    return {
      kartice: [
        { oznaka: 'Ukupno', vrijednost: ukupno, Ikona: Wrench },
        { oznaka: 'Čeka dodjelu', vrijednost: cekaDodjelu, Ikona: User },
        { oznaka: 'Aktivno', vrijednost: aktivno, Ikona: MapPin },
        { oznaka: 'Završeno', vrijednost: zavrseno, Ikona: Wrench },
      ],
    };
  }, [mockRedovi, uloga]);

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

      const fallback = uloga === 'dispecer' ? 'Dispečer' : 'Serviser';
      setImeKorisnika(imeIzProfila || imeIzMeta || user.email || fallback);
    };

    void ucitajIme();
    return () => {
      mounted = false;
    };
  }, [uloga]);

  const pocetna = uloga === 'dispecer' ? '/dispecer' : '/serviser';
  const naslov = uloga === 'dispecer' ? 'Intervencije' : 'Moje intervencije';
  const podnaslov =
    uloga === 'dispecer'
      ? 'Uključuje i zahtjeve bez servisera; ostalo prati dogovoreni termin, polazak i teren.'
      : 'Nakon dodjele i dogovora: zakazani termin, polazak i rad na lokaciji.';

  return (
    <AppShell uloga={uloga} imeKorisnika={imeKorisnika}>
      <div className="mx-auto w-full max-w-6xl sm:px-0">
        <div className="mb-6">
          <Link
            href={pocetna}
            className="mb-4 inline-flex items-center gap-1 text-sm"
            style={{ color: 'var(--first-nonary)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazad
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
              {naslov}
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
              {podnaslov}
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kpi.kartice.map(({ oznaka, vrijednost, Ikona }) => (
            <div
              key={oznaka}
              className="rounded-xl p-4 shadow-card"
              style={{
                backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.2)',
                border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
              }}
            >
              <div className="flex items-center gap-2">
                <Ikona className="h-4 w-4 shrink-0" style={{ color: 'var(--first-secondary)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>
                  {oznaka}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums" style={{ color: 'var(--first-octonary)' }}>
                {vrijednost}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-4 overflow-x-auto">
          <div
            className="inline-flex min-w-full gap-2 rounded-xl p-1 sm:min-w-0"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.24)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
            }}
            role="tablist"
            aria-label="Filtar prikaza"
          >
            {opcijeFiltra.map((opcija) => {
              const aktivan = opcija.value === filter;
              return (
                <button
                  key={opcija.value}
                  type="button"
                  role="tab"
                  aria-selected={aktivan}
                  onClick={() => setFilter(opcija.value as FilterVrijednost)}
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

        <div className="hidden overflow-x-auto rounded-2xl shadow-card md:block">
          <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
            <thead>
              <tr
                style={{
                  backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.35)',
                  borderBottom: '1px solid rgb(var(--first-quaternary-rgb) / 0.4)',
                  color: 'var(--first-octonary)',
                }}
              >
                <th className="px-4 py-3 font-semibold">Intervencija</th>
                <th className="px-4 py-3 font-semibold">Zahtjev</th>
                <th className="px-4 py-3 font-semibold">Serviser</th>
                <th className="px-4 py-3 font-semibold">Termin</th>
                <th className="px-4 py-3 font-semibold">Operativni prioritet</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {prikaz.map((red) => {
                const pal = paletaZaStatus(red.status);
                return (
                  <tr
                    key={`${red.javniBroj}-${red.zahtjevId}`}
                    style={{ borderBottom: '1px solid rgb(var(--first-quaternary-rgb) / 0.25)' }}
                  >
                    <td className="px-4 py-3 align-top">
                      <span className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                        {red.javniBroj}
                      </span>
                      <p className="mt-0.5 max-w-xs text-xs" style={{ color: 'var(--first-nonary)' }}>
                        {red.kratkiOpis}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-top font-mono text-xs" style={{ color: 'var(--first-secondary)' }}>
                      #{red.zahtjevId}
                    </td>
                    <td className="px-4 py-3 align-top" style={{ color: 'var(--first-octonary)' }}>
                      {red.serviserIme ?? (
                        <span style={{ color: 'var(--first-nonary)' }}>— nije dodijeljeno</span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top whitespace-nowrap" style={{ color: 'var(--first-octonary)' }}>
                      {formatirajDatumVrijemeZaPrikaz(red.terminPocetak)}
                    </td>
                    <td className="px-4 py-3 align-top font-medium tabular-nums text-xs" style={{ color: 'var(--first-octonary)' }}>
                      {red.operativniPrioritet}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className="inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold"
                        style={{
                          color: pal.tekst,
                          backgroundColor: pal.pozadina,
                          border: `1px solid ${pal.border}`,
                        }}
                      >
                        {NAZIV_STATUSA_INTERVENCIJE_KOSTUR[red.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ul className="grid gap-4 md:hidden">
          {prikaz.map((red) => {
            const pal = paletaZaStatus(red.status);
            return (
              <li
                key={`${red.javniBroj}-${red.zahtjevId}-m`}
                className="rounded-2xl p-4 shadow-card"
                style={{
                  backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
                  border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      {red.javniBroj}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                      Zahtjev #{red.zahtjevId}
                    </p>
                  </div>
                  <span
                    className="inline-flex shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold"
                    style={{
                      color: pal.tekst,
                      backgroundColor: pal.pozadina,
                      border: `1px solid ${pal.border}`,
                    }}
                  >
                    {NAZIV_STATUSA_INTERVENCIJE_KOSTUR[red.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm" style={{ color: 'var(--first-octonary)' }}>
                  {red.kratkiOpis}
                </p>
                <dl className="mt-3 grid gap-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                  <div className="flex justify-between gap-2">
                    <dt className="font-medium">Serviser</dt>
                    <dd style={{ color: 'var(--first-octonary)' }}>
                      {red.serviserIme ?? '— nije dodijeljeno'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="font-medium">Termin</dt>
                    <dd style={{ color: 'var(--first-octonary)' }}>
                      {formatirajDatumVrijemeZaPrikaz(red.terminPocetak)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="font-medium">Operativni prioritet</dt>
                    <dd className="tabular-nums" style={{ color: 'var(--first-octonary)' }}>
                      {red.operativniPrioritet}
                    </dd>
                  </div>
                </dl>
              </li>
            );
          })}
        </ul>

        {prikaz.length === 0 && (
          <p className="mt-6 text-center text-sm" style={{ color: 'var(--first-nonary)' }}>
            Nema redova za odabrani filter.
          </p>
        )}
      </div>
    </AppShell>
  );
}
