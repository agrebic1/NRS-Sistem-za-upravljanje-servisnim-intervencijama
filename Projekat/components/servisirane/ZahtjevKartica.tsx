'use client';

import type { ComponentType, CSSProperties } from 'react';
import Link from 'next/link';
import {
  Calendar,
  CalendarClock,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Pencil,
  Ban,
  ImageIcon,
  Crosshair,
  ChevronRight,
} from 'lucide-react';
import type { ServisniZahtjev, StatusZahtjeva } from '@/domain/types/servisirane';
import { formatirajDatumPrikaz } from '@/lib/format/datumi';
import { brojZahtjevaZaPrikaz } from '@/lib/servisirane/korisnickiBrojZahtjeva';
import { oznakaHitnostiZaKorisnika } from '@/lib/servisirane/urgency';

// ─── Životni ciklus statusa — Triple Coding ───────────────────────────────────

export const STATUS_LIFECYCLE: Record<
  StatusZahtjeva,
  {
    oznaka: string;
    boja: string;
    pozadina: string;
    border: string;
    Ikona: ComponentType<{ className?: string; style?: CSSProperties }>;
  }
> = {
  pending_review: {
    oznaka: 'Čeka obradu',
    boja: '#D97706',
    pozadina: 'rgba(217,119,6,0.12)',
    border: 'rgba(217,119,6,0.3)',
    Ikona: Clock,
  },
  na_cekanju: {
    oznaka: 'Na čekanju',
    boja: '#D97706',
    pozadina: 'rgba(217,119,6,0.12)',
    border: 'rgba(217,119,6,0.3)',
    Ikona: Clock,
  },
  potvrdeno: {
    oznaka: 'Potvrđeno',
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
  u_radu: {
    oznaka: 'U radu',
    boja: '#059669',
    pozadina: 'rgba(5,150,105,0.1)',
    border: 'rgba(5,150,105,0.25)',
    Ikona: Truck,
  },
  u_izvrsenju: {
    oznaka: 'U izvršenju',
    boja: '#059669',
    pozadina: 'rgba(5,150,105,0.1)',
    border: 'rgba(5,150,105,0.25)',
    Ikona: Truck,
  },
  zavrseno: {
    oznaka: 'Završeno',
    boja: 'var(--first-secondary)',
    pozadina: 'rgb(var(--first-secondary-rgb) / 0.1)',
    border: 'rgb(var(--first-secondary-rgb) / 0.25)',
    Ikona: CheckCircle2,
  },
  otkazano: {
    oznaka: 'Otkazano',
    boja: 'var(--first-nonary)',
    pozadina: 'rgb(var(--first-quinary-rgb) / 0.25)',
    border: 'rgb(var(--first-quaternary-rgb) / 0.4)',
    Ikona: Ban,
  },
  odbijeno: {
    oznaka: 'Odbijeno',
    boja: '#DC2626',
    pozadina: 'rgba(220,38,38,0.1)',
    border: 'rgba(220,38,38,0.25)',
    Ikona: XCircle,
  },
};

const FALLBACK_STATUS = {
  oznaka: 'Nepoznat status',
  boja: 'var(--first-nonary)',
  pozadina: 'rgb(var(--first-quinary-rgb) / 0.2)',
  border: 'rgb(var(--first-quaternary-rgb) / 0.35)',
  Ikona: Clock,
} as const;

// ─── Status badge ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: StatusZahtjeva | string }) {
  const cfg =
    status in STATUS_LIFECYCLE
      ? STATUS_LIFECYCLE[status as StatusZahtjeva]
      : FALLBACK_STATUS;
  const Ikona = cfg.Ikona;
  return (
    <span
      className="inline-flex max-w-[min(100%,14rem)] shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold sm:max-w-none"
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

// ─── Pomoćne funkcije za sadržaj kartice ───────────────────────────────────────

const OSTALO_PREFIX = /^Ostalo\s*[—–-]\s*/i;

function parsirajKategoriju(category: string): { glavna: string; podkategorija: string | null } {
  const trimmed = (category ?? '').trim();
  if (!trimmed) return { glavna: 'Zahtjev', podkategorija: null };
  const match = trimmed.match(/^(.+?)\s*[—–-]\s*(.+)$/);
  if (match && OSTALO_PREFIX.test(trimmed)) {
    return { glavna: 'Ostalo', podkategorija: match[2].trim() || null };
  }
  if (match) {
    return { glavna: match[1].trim(), podkategorija: match[2].trim() || null };
  }
  return { glavna: trimmed, podkategorija: null };
}

function terminZaKarticu(zahtjev: ServisniZahtjev): { label: string; vrijednost: string } {
  const schedule = zahtjev.preferred_schedule;
  const nemaTermina =
    !schedule ||
    schedule.no_preferred_time === true ||
    (schedule.termini?.length ?? 0) === 0;
  if (nemaTermina) {
    return { label: 'Termin', vrijednost: 'Dogovor naknadno' };
  }
  const prvi = schedule.termini[0];
  if (!prvi?.date) {
    return { label: 'Termin', vrijednost: 'Dogovor naknadno' };
  }
  const datum = formatirajDatumPrikaz(prvi.date);
  if (prvi.from && prvi.to) {
    return { label: 'Preferirani termin', vrijednost: `${datum}, ${prvi.from}–${prvi.to}` };
  }
  return { label: 'Preferirani termin', vrijednost: datum };
}

function skracenOpis(tekst: string, maxLen = 140): string {
  const t = (tekst ?? '').trim();
  if (!t) return '';
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen).trim()}…`;
}

// ─── Kartica zahtjeva ─────────────────────────────────────────────────────────

interface ZahtjevKarticaProps {
  zahtjev: ServisniZahtjev;
  onUredi?: (zahtjev: ServisniZahtjev) => void;
  onOtkazi?: (zahtjev: ServisniZahtjev) => void;
}

export function ZahtjevKartica({ zahtjev, onUredi, onOtkazi }: ZahtjevKarticaProps) {
  const { glavna, podkategorija } = parsirajKategoriju(zahtjev.category);
  const datumPrijave = formatirajDatumPrikaz(zahtjev.created_at);
  const { label: terminLabel, vrijednost: terminVrijednost } = terminZaKarticu(zahtjev);
  const hitnost = oznakaHitnostiZaKorisnika(zahtjev.urgency_score);
  const imaKoordinate = zahtjev.latitude != null && zahtjev.longitude != null;
  const imaFotografiju = Boolean(zahtjev.photo_url?.trim());
  const opisSažetak = skracenOpis(zahtjev.description);

  const jeNaCekanju = zahtjev.status === 'na_cekanju' || zahtjev.status === 'pending_review';
  const jeOtkazano = zahtjev.status === 'otkazano';

  return (
    <article
      className="flex h-full flex-col rounded-2xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5"
      style={{
        opacity: jeOtkazano ? 0.72 : 1,
        backgroundColor: 'rgb(255 255 255 / 0.72)',
        borderColor: 'rgb(var(--first-quaternary-rgb) / 0.35)',
      }}
    >
      {/* Header: broj lijevo, status desno */}
      <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <p
          className="text-sm font-semibold tabular-nums"
          style={{ color: 'var(--first-octonary)' }}
        >
          Zahtjev #{brojZahtjevaZaPrikaz(zahtjev)}
        </p>
        <div className="sm:ml-auto sm:text-right">
          <StatusBadge status={zahtjev.status} />
        </div>
      </header>

      {/* Naslov + podkategorija */}
      <div className="mb-3 min-w-0">
        <h3
          className="text-base font-bold leading-snug sm:text-lg"
          style={{ color: 'var(--first-octonary)' }}
        >
          {glavna}
        </h3>
        {podkategorija && (
          <p className="mt-1 text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>
            <span
              className="mr-1.5 inline-block rounded-md px-2 py-0.5"
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

      {/* Osnovne informacije — 2 kolone na širem ekranu */}
      <dl className="mb-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex gap-2 sm:col-span-2">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div className="min-w-0">
            <dt className="sr-only">Adresa</dt>
            <dd style={{ color: 'var(--first-octonary)' }}>
              <span className="font-medium" style={{ color: 'var(--first-nonary)' }}>
                Adresa:{' '}
              </span>
              <span className="break-words">{zahtjev.address || '—'}</span>
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div>
            <dt className="sr-only">Datum prijave</dt>
            <dd style={{ color: 'var(--first-octonary)' }}>
              <span className="font-medium" style={{ color: 'var(--first-nonary)' }}>
                Prijavljeno:{' '}
              </span>
              {datumPrijave}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div className="min-w-0">
            <dt className="sr-only">Hitnost</dt>
            <dd style={{ color: 'var(--first-octonary)' }}>
              <span className="font-medium" style={{ color: 'var(--first-nonary)' }}>
                Hitnost:{' '}
              </span>
              {hitnost}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2 sm:col-span-2">
          <CalendarClock className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" style={{ color: 'var(--first-nonary)' }} />
          <div className="min-w-0">
            <dt className="sr-only">{terminLabel}</dt>
            <dd style={{ color: 'var(--first-octonary)' }}>
              <span className="font-medium" style={{ color: 'var(--first-nonary)' }}>
                {terminLabel}:{' '}
              </span>
              {terminVrijednost}
            </dd>
          </div>
        </div>
      </dl>

      {/* Indikatori */}
      {(imaFotografiju || imaKoordinate) && (
        <div className="mb-3 flex flex-wrap gap-2">
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
              Precizna lokacija
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

      {/* Mini pregled fotografije */}
      {imaFotografiju && zahtjev.photo_url && (
        <div className="mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={zahtjev.photo_url}
            alt=""
            className="h-20 w-full max-w-xs rounded-lg border object-cover"
            style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.3)' }}
          />
        </div>
      )}

      {/* Kratak opis */}
      {opisSažetak && (
        <p
          className="mb-4 line-clamp-2 text-sm leading-relaxed"
          style={{ color: 'var(--first-nonary)' }}
        >
          {opisSažetak}
        </p>
      )}

      {/* Akcije */}
      <div
        className="mt-auto flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.25)' }}
      >
        <Link
          href={`/korisnik/zahtjevi/${zahtjev.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-deep-teal px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-celestial-teal focus:outline-none focus:ring-2 focus:ring-celestial-teal/40 focus:ring-offset-2 sm:w-auto sm:min-w-[8.5rem]"
        >
          Detalji
          <ChevronRight className="h-4 w-4" />
        </Link>
        {jeNaCekanju && (onUredi || onOtkazi) && (
          <div className="flex justify-end gap-1 sm:justify-end">
            {onUredi && (
              <button
                type="button"
                onClick={() => onUredi(zahtjev)}
                title="Izmijeni zahtjev"
                className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150 hover:scale-[1.02]"
                style={{
                  borderColor: 'rgb(var(--first-primary-rgb) / 0.25)',
                  backgroundColor: 'rgb(var(--first-primary-rgb) / 0.06)',
                  color: 'var(--first-primary)',
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onOtkazi && (
              <button
                type="button"
                onClick={() => onOtkazi(zahtjev)}
                title="Otkaži zahtjev"
                className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150 hover:scale-[1.02]"
                style={{
                  borderColor: 'rgba(220,38,38,0.25)',
                  backgroundColor: 'rgba(220,38,38,0.06)',
                  color: '#DC2626',
                }}
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
