'use client';

import Link from 'next/link';
import {
  PlusCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  FileText,
  CalendarClock,
  MapPin,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
type StatusZahtjeva = 'novi' | 'u_toku' | 'zavrsen' | 'hitno';

export interface KorisnikDashboardZahtjev {
  id: string;
  /** Redni broj zahtjeva korisnika (1 = najstariji). */
  korisnickiBroj: number;
  naslov: string;
  status: StatusZahtjeva;
  datum: string;
  lokacija: string;
}

interface KorisnikPregledDashboardProps {
  imeKorisnika: string;
  zahtjevi: KorisnikDashboardZahtjev[];
}

const BADGE_STATUSA: Record<StatusZahtjeva, { oznaka: string; pozadina: string; boja: string }> = {
  novi: { oznaka: 'Novi', pozadina: 'rgb(var(--first-quaternary-rgb) / 0.22)', boja: 'var(--first-nonary)' },
  u_toku: { oznaka: 'U toku', pozadina: 'rgb(var(--first-secondary-rgb) / 0.14)', boja: 'var(--first-secondary)' },
  zavrsen: { oznaka: 'Završen', pozadina: 'rgb(var(--first-septenary-rgb) / 0.18)', boja: 'var(--first-septenary)' },
  hitno: { oznaka: 'Hitno', pozadina: 'rgb(var(--first-senary-rgb) / 0.12)', boja: 'var(--first-senary)' },
};

function brojAktivnih(zahtjevi: KorisnikDashboardZahtjev[]) {
  return zahtjevi.filter((z) => z.status !== 'zavrsen').length;
}

function brojHitnih(zahtjevi: KorisnikDashboardZahtjev[]) {
  return zahtjevi.filter((z) => z.status === 'hitno').length;
}

function brojNovih(zahtjevi: KorisnikDashboardZahtjev[]) {
  return zahtjevi.filter((z) => z.status === 'novi').length;
}

function sljedeciZahtjev(zahtjevi: KorisnikDashboardZahtjev[]): KorisnikDashboardZahtjev | null {
  const hitni = zahtjevi.find((z) => z.status === 'hitno');
  if (hitni) return hitni;
  return zahtjevi.find((z) => z.status === 'u_toku' || z.status === 'novi') ?? null;
}

function sortirajZahtjeve(zahtjevi: KorisnikDashboardZahtjev[]) {
  const prioritet: Record<StatusZahtjeva, number> = { hitno: 0, u_toku: 1, novi: 2, zavrsen: 3 };
  return [...zahtjevi].sort((a, b) => prioritet[a.status] - prioritet[b.status]);
}

const cardShell = {
  backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.5)',
  border: '1px solid rgb(var(--first-quaternary-rgb) / 0.45)',
  boxShadow: '0 10px 28px rgb(var(--first-primary-rgb) / 0.06)',
} as const;

export function KorisnikPregledDashboard({
  imeKorisnika = 'Korisnik',
  zahtjevi = [],
}: Partial<KorisnikPregledDashboardProps>) {
  const aktivnih = brojAktivnih(zahtjevi);
  const hitnih = brojHitnih(zahtjevi);
  const novih = brojNovih(zahtjevi);
  const sljedeci = sljedeciZahtjev(zahtjevi);
  const lista = sortirajZahtjeve(zahtjevi);
  const hitniLista = zahtjevi.filter((z) => z.status === 'hitno');
  const zavrsenih = zahtjevi.filter((z) => z.status === 'zavrsen').length;

  const KPI = [
    { oznaka: 'Aktivnih zahtjeva', vrijednost: aktivnih, boja: 'var(--first-secondary)', Ikona: ClipboardList },
    { oznaka: 'Hitnih slučajeva', vrijednost: hitnih, boja: 'var(--first-senary)', Ikona: AlertTriangle },
    { oznaka: 'Novih (na čekanju)', vrijednost: novih, boja: 'var(--first-nonary)', Ikona: Clock },
    { oznaka: 'Završenih intervencija', vrijednost: zavrsenih, boja: 'var(--first-septenary)', Ikona: CheckCircle },
  ];

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full opacity-40 blur-3xl md:block"
        style={{ background: 'rgb(var(--first-septenary-rgb) / 0.12)' }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full opacity-35 blur-3xl md:block"
        style={{ background: 'rgb(var(--first-secondary-rgb) / 0.1)' }}
        aria-hidden
      />

      <div className="relative z-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: 'var(--first-octonary)' }}>
              Dobrodošli, {imeKorisnika}!
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--first-nonary)' }}>
              Ovdje pratite svoje zahtjeve, hitne slučajeve i zakazane dolazake servisera — bez poziva i ručnih tablica.
            </p>
          </div>
          <Link href="/korisnik/zahtjevi/novi" className="shrink-0">
            <Button size="md" className="w-full sm:w-auto">
              <PlusCircle className="h-4 w-4" />
              Prijavi novi kvar
            </Button>
          </Link>
        </div>

        {/* KPI — desktop 4 u redu, tablet 2, mobile 1 */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPI.map(({ oznaka, vrijednost, boja, Ikona }) => (
            <div
              key={oznaka}
              className="flex items-center gap-4 rounded-3xl p-5 transition-shadow duration-200 hover:shadow-md"
              style={cardShell}
            >
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `color-mix(in srgb, ${boja} 12%, transparent)` }}
              >
                <Ikona className="h-5 w-5" style={{ color: boja }} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold tabular-nums" style={{ color: boja }}>
                  {vrijednost}
                </p>
                <p className="text-xs leading-snug" style={{ color: 'var(--first-nonary)' }}>
                  {oznaka}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Glavna kolona ~66% */}
          <div className="min-w-0 lg:col-span-8">
            {hitniLista.length > 0 && (
              <div
                className="mb-4 rounded-3xl border px-4 py-3 sm:px-5"
                style={{
                  backgroundColor: 'rgb(var(--first-senary-rgb) / 0.06)',
                  borderColor: 'rgb(var(--first-senary-rgb) / 0.22)',
                }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" style={{ color: 'var(--first-senary)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                    Hitni slučajevi
                  </p>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: 'rgb(var(--first-senary-rgb) / 0.12)',
                      color: 'var(--first-senary)',
                    }}
                  >
                    {hitniLista.length}
                  </span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {hitniLista.map((z) => (
                    <li key={z.id}>
                      <Link
                        href={`/korisnik/zahtjevi/${z.id}`}
                        className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm transition-colors hover:bg-soft-beige/20"
                        style={{ color: 'var(--first-octonary)' }}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="shrink-0 tabular-nums text-xs font-bold opacity-70">#{z.korisnickiBroj}</span>
                          <span className="min-w-0 truncate font-medium">{z.naslov}</span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div id="moji-zahtjevi-lista" className="rounded-3xl scroll-mt-24" style={cardShell}>
              <div
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderBottom: '1px solid rgb(var(--first-quaternary-rgb) / 0.3)' }}
              >
                <div>
                  <h2 className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                    Moji zahtjevi
                  </h2>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--first-nonary)' }}>
                    Sortirano: prvo hitno, zatim u toku i novi.
                  </p>
                </div>
                <Link
                  href="/korisnik/zahtjevi"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: 'var(--first-secondary)' }}
                >
                  Svi zahtjevi <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {zahtjevi.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                  <FileText className="h-10 w-10" style={{ color: 'var(--first-quinary)' }} />
                  <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
                    Nemate još nijednog zahtjeva.
                  </p>
                  <Link href="/korisnik/zahtjevi/novi">
                    <Button size="sm" variant="secondary">
                      Prijavi prvi kvar
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="divide-y" style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.22)' }}>
                  {lista.map((zahtjev) => {
                    const badge = BADGE_STATUSA[zahtjev.status];
                    const accentHitno = zahtjev.status === 'hitno';
                    return (
                      <li key={zahtjev.id}>
                        <Link
                          href={`/korisnik/zahtjevi/${zahtjev.id}`}
                          className="flex items-start gap-4 px-5 py-4 transition-colors duration-150 hover:bg-soft-beige/10 sm:items-center"
                          style={
                            accentHitno
                              ? { borderLeft: '3px solid var(--first-senary)' }
                              : undefined
                          }
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span
                                className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums"
                                style={{
                                  backgroundColor: 'rgb(var(--first-quaternary-rgb) / 0.2)',
                                  color: 'var(--first-nonary)',
                                }}
                              >
                                #{zahtjev.korisnickiBroj}
                              </span>
                              <p
                                className="min-w-0 break-words font-medium sm:truncate"
                                style={{ color: 'var(--first-octonary)' }}
                              >
                                {zahtjev.naslov}
                              </p>
                              <span
                                className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                style={{ backgroundColor: badge.pozadina, color: badge.boja }}
                              >
                                {badge.oznaka}
                              </span>
                            </div>
                            <div className="mt-1.5 flex flex-col gap-1 text-xs sm:flex-row sm:flex-wrap sm:gap-x-4" style={{ color: 'var(--first-nonary)' }}>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                Prijavljeno {zahtjev.datum}
                              </span>
                              <span className="inline-flex items-center gap-1 break-words">
                                <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                {zahtjev.lokacija}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 sm:mt-0" style={{ color: 'var(--first-quinary)' }} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Sidebar ~33% */}
          <aside className="flex w-full flex-col gap-4 lg:col-span-4">
            <div className="rounded-3xl p-5" style={cardShell}>
              <div className="mb-3 flex items-center gap-2">
                <CalendarClock className="h-5 w-5" style={{ color: 'var(--first-septenary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                  Sljedeći dolazak
                </h3>
              </div>
              {sljedeci ? (
                <>
                  <p className="text-xs font-semibold tabular-nums" style={{ color: 'var(--first-nonary)' }}>
                    Zahtjev #{sljedeci.korisnickiBroj}
                  </p>
                  <p className="text-sm font-medium leading-snug" style={{ color: 'var(--first-octonary)' }}>{sljedeci.datum}</p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--first-nonary)' }}>
                    {sljedeci.naslov}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                    {sljedeci.lokacija}
                  </p>
                  <Link
                    href={`/korisnik/zahtjevi/${sljedeci.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{ color: 'var(--first-secondary)' }}
                  >
                    Detalji zahtjeva <ChevronRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
                  Nemate aktivnih zahtjeva s dolaskom.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
