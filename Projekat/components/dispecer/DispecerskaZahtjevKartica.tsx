'use client';

import type { ComponentType, CSSProperties } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CalendarClock,
  Clock,
  MapPin,
  User,
  Phone,
  ChevronRight,
  ImageIcon,
  Crosshair,
  CheckCircle2,
  Truck,
  XCircle,
  Ban,
} from 'lucide-react';
import type { ServisniZahtjev, StatusZahtjeva } from '@/domain/types/servisirane';
import { formatirajDatumPrikaz } from '@/lib/format/datumi';
import { oznakaHitnostiZaKorisnika } from '@/lib/servisirane/urgency';
import { labelKategorije } from '@/lib/servisirane/kategorije';

function skracenOpis(tekst: string, maxLen = 150): string {
  const t = (tekst ?? '').trim();
  if (!t) return '';
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen).trim()}…`;
}

/** Datum u kartici: 15.05.2026 (bez završne tačke). */
function formatKratkiDatum(datumStr: string): string {
  const d = formatirajDatumPrikaz(datumStr, '');
  if (!d) return '';
  return d.replace(/\s+/g, '').replace(/\.$/, '');
}

function preferiraniTerminZaDispecera(zahtjev: ServisniZahtjev): {
  tekstCijeli: string;
  imaPreferirani: boolean;
} {
  const schedule = zahtjev.preferred_schedule;
  const nema =
    !schedule ||
    schedule.no_preferred_time === true ||
    (schedule.termini?.length ?? 0) === 0;
  if (nema) {
    return { tekstCijeli: 'Termin: Dogovor naknadno', imaPreferirani: false };
  }
  const prvi = schedule.termini[0];
  if (!prvi?.date) {
    return { tekstCijeli: 'Termin: Dogovor naknadno', imaPreferirani: false };
  }
  const datum = formatKratkiDatum(prvi.date);
  if (prvi.from && prvi.to) {
    return {
      tekstCijeli: `Preferirani termin: ${datum}, ${prvi.from}–${prvi.to}`,
      imaPreferirani: true,
    };
  }
  return {
    tekstCijeli: `Preferirani termin: ${datum}`,
    imaPreferirani: true,
  };
}

function formatPrijavljeno(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy}, ${hh}:${min}`;
}

type StatusCfg = {
  oznaka: string;
  boja: string;
  pozadina: string;
  border: string;
  Ikona: ComponentType<{ className?: string; style?: CSSProperties }>;
};

/** Mapiranje statusa za dispečerski pregled (Sprint 7 + kompatibilnost). */
const DISPECER_STATUS_BADGE: Record<string, StatusCfg> = {
  pending_review: {
    oznaka: 'Novi zahtjev',
    boja: '#D97706',
    pozadina: 'rgba(217,119,6,0.12)',
    border: 'rgba(217,119,6,0.3)',
    Ikona: Clock,
  },
  na_cekanju: {
    oznaka: 'Čeka obradu',
    boja: '#D97706',
    pozadina: 'rgba(217,119,6,0.12)',
    border: 'rgba(217,119,6,0.3)',
    Ikona: Clock,
  },
  in_review: {
    oznaka: 'U obradi',
    boja: '#CA8A04',
    pozadina: 'rgba(202,138,4,0.12)',
    border: 'rgba(202,138,4,0.3)',
    Ikona: Clock,
  },
  assigned: {
    oznaka: 'Dodijeljeno',
    boja: '#2563EB',
    pozadina: 'rgba(37,99,235,0.1)',
    border: 'rgba(37,99,235,0.25)',
    Ikona: CheckCircle2,
  },
  dodijeljeno: {
    oznaka: 'Dodijeljeno',
    boja: '#2563EB',
    pozadina: 'rgba(37,99,235,0.1)',
    border: 'rgba(37,99,235,0.25)',
    Ikona: CheckCircle2,
  },
  scheduled: {
    oznaka: 'Termin potvrđen',
    boja: '#2563EB',
    pozadina: 'rgba(37,99,235,0.1)',
    border: 'rgba(37,99,235,0.25)',
    Ikona: CheckCircle2,
  },
  potvrdeno: {
    oznaka: 'Termin potvrđen',
    boja: '#2563EB',
    pozadina: 'rgba(37,99,235,0.1)',
    border: 'rgba(37,99,235,0.25)',
    Ikona: CheckCircle2,
  },
  in_progress: {
    oznaka: 'U toku',
    boja: '#059669',
    pozadina: 'rgba(5,150,105,0.1)',
    border: 'rgba(5,150,105,0.25)',
    Ikona: Truck,
  },
  u_radu: {
    oznaka: 'U toku',
    boja: '#059669',
    pozadina: 'rgba(5,150,105,0.1)',
    border: 'rgba(5,150,105,0.25)',
    Ikona: Truck,
  },
  u_izvrsenju: {
    oznaka: 'U toku',
    boja: '#059669',
    pozadina: 'rgba(5,150,105,0.1)',
    border: 'rgba(5,150,105,0.25)',
    Ikona: Truck,
  },
  completed: {
    oznaka: 'Završeno',
    boja: 'var(--first-secondary)',
    pozadina: 'rgb(var(--first-secondary-rgb) / 0.1)',
    border: 'rgb(var(--first-secondary-rgb) / 0.25)',
    Ikona: CheckCircle2,
  },
  zavrseno: {
    oznaka: 'Završeno',
    boja: 'var(--first-secondary)',
    pozadina: 'rgb(var(--first-secondary-rgb) / 0.1)',
    border: 'rgb(var(--first-secondary-rgb) / 0.25)',
    Ikona: CheckCircle2,
  },
  cancelled: {
    oznaka: 'Otkazano',
    boja: 'var(--first-nonary)',
    pozadina: 'rgb(var(--first-quinary-rgb) / 0.25)',
    border: 'rgb(var(--first-quaternary-rgb) / 0.4)',
    Ikona: Ban,
  },
  otkazano: {
    oznaka: 'Otkazano',
    boja: 'var(--first-nonary)',
    pozadina: 'rgb(var(--first-quinary-rgb) / 0.25)',
    border: 'rgb(var(--first-quaternary-rgb) / 0.4)',
    Ikona: Ban,
  },
  closed: {
    oznaka: 'Zatvoreno',
    boja: 'var(--first-nonary)',
    pozadina: 'rgb(var(--first-quinary-rgb) / 0.22)',
    border: 'rgb(var(--first-quaternary-rgb) / 0.35)',
    Ikona: CheckCircle2,
  },
  odbijeno: {
    oznaka: 'Odbijeno',
    boja: '#DC2626',
    pozadina: 'rgba(220,38,38,0.1)',
    border: 'rgba(220,38,38,0.25)',
    Ikona: XCircle,
  },
};

const FALLBACK_DISPECER_STATUS: StatusCfg = {
  oznaka: 'Nepoznat status',
  boja: 'var(--first-nonary)',
  pozadina: 'rgb(var(--first-quinary-rgb) / 0.2)',
  border: 'rgb(var(--first-quaternary-rgb) / 0.35)',
  Ikona: Clock,
};

export function DispecerStatusBadge({ status }: { status: StatusZahtjeva | string }) {
  const cfg = DISPECER_STATUS_BADGE[status] ?? FALLBACK_DISPECER_STATUS;
  const Ikona = cfg.Ikona;
  return (
    <span
      className="inline-flex max-w-[min(100%,16rem)] shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold sm:max-w-none"
      style={{
        backgroundColor: cfg.pozadina,
        color: cfg.boja,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <Ikona className="h-3 w-3 flex-shrink-0" />
      <span className="truncate">{cfg.oznaka}</span>
    </span>
  );
}

/** Zahtjevi vidljivi u Sprint 7 inboxu dispečera. */
export function zahtjevCekaObraduSprint7(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'pending_review' || s === 'na_cekanju' || s === 'in_review';
}

export type ZahtjevZaDispecerskuKarticu = ServisniZahtjev & {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
};

export interface DispecerskaZahtjevKarticaProps {
  zahtjev: ZahtjevZaDispecerskuKarticu;
}

export function DispecerskaZahtjevKartica({ zahtjev }: DispecerskaZahtjevKarticaProps) {
  const podnosilac = zahtjev.podnosilac;

  const { glavna, podkategorija } = labelKategorije(zahtjev);
  const { tekstCijeli: terminTekst, imaPreferirani } = preferiraniTerminZaDispecera(zahtjev);
  const hitnostKorisnika = oznakaHitnostiZaKorisnika(zahtjev.urgency_score);
  const imaKoordinate = zahtjev.latitude != null && zahtjev.longitude != null;
  const imaFotografiju = Boolean(zahtjev.photo_url?.trim());
  const opis = skracenOpis(zahtjev.description);
  const telefon = podnosilac?.broj_telefona?.trim() || zahtjev.contact_phone?.trim() || '—';
  const imePrezime = podnosilac
    ? `${podnosilac.ime} ${podnosilac.prezime}`.trim()
    : 'Nepoznato';

  return (
    <article
      className="flex h-full flex-col rounded-2xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5"
      style={{
        backgroundColor: 'rgb(255 255 255 / 0.72)',
        borderColor: zahtjev.is_premium ? 'rgba(220,38,38,0.45)' : 'rgb(var(--first-quaternary-rgb) / 0.35)',
      }}
    >
      <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p
          className="text-sm font-semibold tabular-nums"
          style={{ color: 'var(--first-octonary)' }}
        >
          Zahtjev #{zahtjev.id}
        </p>
        <div className="sm:ml-auto sm:text-right">
          <DispecerStatusBadge status={zahtjev.status} />
        </div>
      </header>
      {zahtjev.is_premium && (
        <div className="mb-3 flex flex-col gap-1.5">
          <span
            className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              backgroundColor: 'rgba(220,38,38,0.12)',
              color: '#B91C1C',
              border: '1px solid rgba(220,38,38,0.25)',
            }}
          >
            Hitna intervencija (premium)
          </span>
          {zahtjev.premium_priority_override_reason?.trim() && (
            <span
              className="inline-flex w-fit max-w-full items-start rounded-lg px-2 py-1 text-[11px] font-semibold leading-snug"
              style={{
                backgroundColor: 'rgba(37,99,235,0.08)',
                color: '#1D4ED8',
                border: '1px solid rgba(37,99,235,0.22)',
              }}
              title={zahtjev.premium_priority_override_reason}
            >
              Prioritet smanjen (dispečer): {skracenOpis(zahtjev.premium_priority_override_reason, 120)}
            </span>
          )}
        </div>
      )}

      <div className="mb-3 min-w-0">
        <h3
          className="text-base font-bold leading-snug sm:text-lg"
          style={{ color: 'var(--first-octonary)' }}
        >
          {glavna}
        </h3>
        {podkategorija && (
          <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>
            <span
              className="inline-block rounded-md px-2 py-0.5"
              style={{
                backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.35)',
                color: 'var(--first-octonary)',
              }}
            >
              Podkategorija: {podkategorija}
            </span>
          </p>
        )}
      </div>

      <dl className="mb-3 grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm lg:grid-cols-2">
        <div className="flex items-start gap-2 lg:col-span-2">
          <User className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div className="min-w-0">
            <dt className="sr-only">Korisnik</dt>
            <dd style={{ color: 'var(--first-octonary)' }}>
              <span className="font-medium" style={{ color: 'var(--first-nonary)' }}>
                Korisnik:{' '}
              </span>
              {imePrezime}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2 lg:col-span-2">
          <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div className="min-w-0">
            <dt className="sr-only">Kontakt</dt>
            <dd style={{ color: 'var(--first-octonary)' }}>
              <span className="font-medium" style={{ color: 'var(--first-nonary)' }}>
                Kontakt:{' '}
              </span>
              {telefon}
            </dd>
          </div>
        </div>
        <div className="flex gap-2 lg:col-span-2">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div className="min-w-0">
            <dt className="sr-only">Adresa</dt>
            <dd style={{ color: 'var(--first-octonary)' }}>
              <span className="font-medium" style={{ color: 'var(--first-nonary)' }}>
                Adresa:{' '}
              </span>
              <span className="break-words">{zahtjev.address?.trim() || '—'}</span>
            </dd>
            {imaKoordinate && (
              <p className="mt-1 text-xs font-medium" style={{ color: 'var(--first-quinary)' }}>
                Precizna lokacija dodana
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div>
            <dt className="sr-only">Prijavljeno</dt>
            <dd style={{ color: 'var(--first-octonary)' }}>
              <span className="font-medium" style={{ color: 'var(--first-nonary)' }}>
                Prijavljeno:{' '}
              </span>
              {formatPrijavljeno(zahtjev.created_at)}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div className="min-w-0">
            <dt className="sr-only">Korisnička hitnost</dt>
            <dd style={{ color: 'var(--first-octonary)' }}>
              <span className="font-medium" style={{ color: 'var(--first-nonary)' }}>
                Korisnička hitnost:{' '}
              </span>
              {hitnostKorisnika}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2 lg:col-span-2">
          <CalendarClock className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div className="min-w-0">
            <dt className="sr-only">Termin</dt>
            <dd className="break-words" style={{ color: 'var(--first-octonary)' }}>
              {terminTekst}
            </dd>
          </div>
        </div>
      </dl>

      {opis && (
        <p
          className="mb-3 line-clamp-2 text-sm leading-relaxed"
          style={{ color: 'var(--first-nonary)' }}
        >
          {opis}
        </p>
      )}

      {(imaFotografiju || imaKoordinate || imaPreferirani) && (
        <div className="mb-3 flex flex-wrap gap-2">
          {imaPreferirani && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{
                backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.35)',
                color: 'var(--first-octonary)',
                border: '1px solid rgb(var(--first-quaternary-rgb) / 0.3)',
              }}
            >
              Termin naveden
            </span>
          )}
          {imaKoordinate && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{
                backgroundColor: 'rgb(var(--first-primary-rgb) / 0.08)',
                color: 'var(--first-primary)',
                border: '1px solid rgb(var(--first-primary-rgb) / 0.2)',
              }}
            >
              <Crosshair className="h-3 w-3" />
              Precizna lokacija dodana
            </span>
          )}
          {imaFotografiju && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{
                backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.1)',
                color: 'var(--first-secondary)',
                border: '1px solid rgb(var(--first-secondary-rgb) / 0.25)',
              }}
            >
              <ImageIcon className="h-3 w-3" />
              Fotografija dodana
            </span>
          )}
        </div>
      )}

      <footer
        className="mt-auto border-t pt-3"
        style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.25)' }}
      >
        <Link
          href={`/dispecer/zahtjevi/${zahtjev.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-soft-beige bg-transparent px-5 py-2.5 text-sm font-semibold text-deep-teal transition-colors hover:border-celestial-teal hover:bg-celestial-teal/5 focus:outline-none focus:ring-2 focus:ring-celestial-teal/40 focus:ring-offset-2 sm:w-auto sm:min-w-[8.5rem]"
        >
          Detalji
          <ChevronRight className="h-4 w-4" />
        </Link>
      </footer>
    </article>
  );
}
