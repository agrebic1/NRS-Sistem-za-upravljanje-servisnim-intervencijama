'use client';

import { Sunrise, Sun, Sunset, SlidersHorizontal, CalendarDays, Calendar, Check } from 'lucide-react';
import { KalendarOdabir } from '@/components/ui/KalendarOdabir';
import { formatirajDatumPrikaz } from '@/lib/format/datumi';

// ─── Period helpers ───────────────────────────────────────────────────────────

interface PeriodInfo {
  boja:   string;
  oznaka: string;
  Ikona:  React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

function getPeriodInfo(from: string, to: string): PeriodInfo {
  if (from === '08:00' && to === '12:00') {
    return { boja: '#F59E0B', oznaka: 'Jutro', Ikona: Sunrise };
  }
  if (from === '12:00' && to === '17:00') {
    return { boja: '#CA8A04', oznaka: 'Dan', Ikona: Sun };
  }
  if (from === '17:00' && to === '20:00') {
    return { boja: '#3B82F6', oznaka: 'Veče', Ikona: Sunset };
  }
  if (from === '08:00' && to === '20:00') {
    return { boja: '#22C55E', oznaka: 'Cijeli dan', Ikona: CalendarDays };
  }
  if (!from) return { boja: '#A855F7', oznaka: 'Prilagođeno', Ikona: SlidersHorizontal };
  return { boja: '#A855F7', oznaka: 'Prilagođeno', Ikona: SlidersHorizontal };
}

const BRZI_PERIODI: { oznaka: string; from: string; to: string; boja: string }[] = [
  { oznaka: 'Jutro',      from: '08:00', to: '12:00', boja: '#F59E0B' },
  { oznaka: 'Dan',        from: '12:00', to: '17:00', boja: '#CA8A04' },
  { oznaka: 'Veče',       from: '17:00', to: '20:00', boja: '#3B82F6' },
  { oznaka: 'Cijeli dan', from: '08:00', to: '20:00', boja: '#22C55E' },
];

// ─── TimeRange sub-component ──────────────────────────────────────────────────

interface TimeRangeProps {
  from:   string;
  to:     string;
  onFrom: (v: string) => void;
  onTo:   (v: string) => void;
  onBrzi: (from: string, to: string) => void;
  disabled?: boolean;
}

function TimeRange({ from, to, onFrom, onTo, onBrzi, disabled }: TimeRangeProps) {
  const invalid = Boolean(from && to && from >= to);
  const { boja, oznaka, Ikona } = getPeriodInfo(from, to);

  return (
    <div className="flex flex-col gap-2.5 opacity-100">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1" style={{ minWidth: '90px' }}>
          <label className="text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>
            Od
          </label>
          <input
            type="time"
            value={from}
            disabled={disabled}
            onChange={(e) => onFrom(e.target.value)}
            className="min-w-0 w-full rounded-lg border px-3 py-2 text-sm transition-colors
              focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor:     invalid ? '#DC2626' : 'rgb(var(--first-quaternary-rgb) / 0.45)',
              backgroundColor: 'rgb(255 255 255 / 0.85)',
              color:           'var(--first-octonary)',
            }}
          />
        </div>

        <span className="mb-2 flex-shrink-0 text-sm" style={{ color: 'var(--first-quinary)' }}>
          —
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1" style={{ minWidth: '90px' }}>
          <label className="text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>
            Do
          </label>
          <input
            type="time"
            value={to}
            disabled={disabled}
            onChange={(e) => onTo(e.target.value)}
            className="min-w-0 w-full rounded-lg border px-3 py-2 text-sm transition-colors
              focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor:     invalid ? '#DC2626' : 'rgb(var(--first-quaternary-rgb) / 0.45)',
              backgroundColor: 'rgb(255 255 255 / 0.85)',
              color:           'var(--first-octonary)',
            }}
          />
        </div>

        {from && to && !invalid && (
          <div
            className="mb-0.5 flex flex-shrink-0 items-center gap-1 rounded-lg px-2.5 py-2
              text-xs font-semibold"
            style={{
              backgroundColor: `${boja}18`,
              color:           boja,
              border:          `1px solid ${boja}35`,
            }}
          >
            <Ikona className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{oznaka}</span>
          </div>
        )}
      </div>

      {invalid && (
        <p className="text-xs font-medium" style={{ color: '#DC2626' }}>
          &quot;Vrijeme do&quot; mora biti nakon &quot;Vrijeme od&quot;.
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {BRZI_PERIODI.map((p) => {
          const aktivan = from === p.from && to === p.to;
          return (
            <button
              key={p.oznaka}
              type="button"
              disabled={disabled}
              onClick={() => onBrzi(p.from, p.to)}
              className="rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150
                disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                borderColor:     aktivan ? p.boja : 'rgb(var(--first-quaternary-rgb) / 0.4)',
                backgroundColor: aktivan ? `${p.boja}15` : 'transparent',
                color:           aktivan ? p.boja : 'var(--first-nonary)',
              }}
            >
              {p.oznaka}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Korak 3: Preferirani termin (Sprint 7) ─────────────────────────────────

export type KorakTerminAžuriranje = {
  preferredDate?: string | null;
  preferredTimeFrom?: string;
  preferredTimeTo?: string;
  noPreferredTime?: boolean;
  preferredTimeLabel?: string | null;
};

interface KorakTerminProps {
  preferredDate: string | null;
  preferredTimeFrom: string;
  preferredTimeTo: string;
  noPreferredTime: boolean;
  preferredTimeLabel: string | null;
  validationError?: string | null;
  onUpdate: (p: KorakTerminAžuriranje) => void;
}

export function KorakTermin({
  preferredDate,
  preferredTimeFrom,
  preferredTimeTo,
  noPreferredTime,
  preferredTimeLabel: _preferredTimeLabel,
  validationError,
  onUpdate,
}: KorakTerminProps) {
  void _preferredTimeLabel;

  const selectedDates = preferredDate ? [preferredDate] : [];
  const dateColors: Record<string, string> = {};
  if (preferredDate) {
    dateColors[preferredDate] = getPeriodInfo(preferredTimeFrom, preferredTimeTo).boja;
  }

  function postaviNemaPreferencije(ukljuceno: boolean) {
    if (ukljuceno) {
      onUpdate({
        noPreferredTime: true,
        preferredDate: null,
        preferredTimeFrom: '',
        preferredTimeTo: '',
        preferredTimeLabel: null,
      });
    } else {
      onUpdate({ noPreferredTime: false });
    }
  }

  function handleCalendarChange(datumi: string[]) {
    const jedan = datumi[0] ?? null;
    if (jedan && noPreferredTime) {
      onUpdate({
        noPreferredTime: false,
        preferredDate: jedan,
      });
      return;
    }
    onUpdate({
      preferredDate: jedan,
    });
  }

  function postaviVrijeme(from: string, to: string) {
    const oznaka = from && to ? getPeriodInfo(from, to).oznaka : null;
    onUpdate({
      preferredTimeFrom: from,
      preferredTimeTo: to,
      preferredTimeLabel: oznaka,
    });
  }

  function ocistiOdabirTermina() {
    onUpdate({
      preferredDate: null,
      preferredTimeFrom: '',
      preferredTimeTo: '',
      preferredTimeLabel: null,
      noPreferredTime: false,
    });
  }

  const prikaziOdabir = !noPreferredTime;
  const helperPoruka = !preferredDate
    ? 'Prvo odaberite datum, a zatim vremenski period.'
    : 'Odaberite vrijeme od-do ili koristite brzi izbor perioda.';

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="mb-1 text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
          Preferirani termin
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--first-nonary)' }}>
          Odaberite datum i vremenski period koji vam najviše odgovara. Konačan termin potvrđuje
          dispečer nakon obrade zahtjeva.
        </p>
        <p className="mt-2 text-xs" style={{ color: 'var(--first-quinary)' }}>
          Odabrani termin je informativan i ne predstavlja potvrđeno zakazivanje.
        </p>
      </div>

      <button
        type="button"
        onClick={() => postaviNemaPreferencije(!noPreferredTime)}
        className="flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium text-left
          transition-all duration-150"
        style={{
          borderColor: noPreferredTime
            ? 'var(--first-primary)'
            : 'rgb(var(--first-quaternary-rgb) / 0.4)',
          backgroundColor: noPreferredTime
            ? 'rgb(var(--first-primary-rgb) / 0.06)'
            : 'rgb(255 255 255 / 0.7)',
          color: 'var(--first-octonary)',
        }}
      >
        <div
          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded"
          style={{
            backgroundColor: noPreferredTime ? 'var(--first-primary)' : 'transparent',
            border: noPreferredTime
              ? 'none'
              : '1.5px solid rgb(var(--first-quaternary-rgb) / 0.6)',
          }}
        >
          {noPreferredTime && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </div>
        <div className="flex flex-col gap-1">
          <span>Nemam preferirani termin — kontaktirajte me radi dogovora</span>
          {noPreferredTime && (
            <span className="text-xs font-normal" style={{ color: 'var(--first-nonary)' }}>
              Zahtjev će biti poslan bez preferiranog termina. Dispečer će vas kontaktirati radi dogovora.
            </span>
          )}
        </div>
      </button>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.15)',
            border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.3)',
            opacity:         prikaziOdabir ? 1 : 0.6,
          }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--first-nonary)' }}
          >
            Odaberite datum
          </p>
          <KalendarOdabir
            jedanDatum
            odabraniDatumi={selectedDates}
            onPromjena={handleCalendarChange}
            dateColors={dateColors}
          />
        </div>

        <p
          className="rounded-xl border px-4 py-2.5 text-sm"
          style={{
            borderColor:     'rgb(var(--first-quaternary-rgb) / 0.35)',
            backgroundColor: 'rgb(255 255 255 / 0.75)',
            color:           'var(--first-octonary)',
            opacity:         prikaziOdabir ? 1 : 0.6,
          }}
        >
          <span
            className="mb-3 block text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--first-nonary)' }}
          >
            Vremenski period
          </span>

          <TimeRange
            from={preferredTimeFrom}
            to={preferredTimeTo}
            onFrom={(v) => postaviVrijeme(v, preferredTimeTo)}
            onTo={(v) => postaviVrijeme(preferredTimeFrom, v)}
            onBrzi={(from, to) => postaviVrijeme(from, to)}
            disabled={!prikaziOdabir || !preferredDate}
          />

          <p className="mt-3 text-xs" style={{ color: 'var(--first-quinary)' }}>
            {helperPoruka}
          </p>

          {(preferredDate || (preferredTimeFrom && preferredTimeTo)) && (
            <div
              className="mt-3 rounded-lg border px-3 py-2 text-xs"
              style={{
                borderColor:     'rgb(var(--first-quaternary-rgb) / 0.35)',
                backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.12)',
                color:           'var(--first-nonary)',
              }}
            >
              {preferredDate && (
                <p>
                  <span className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                    Odabrani datum:
                  </span>{' '}
                  {formatirajDatumPrikaz(preferredDate)}
                </p>
              )}
              {preferredTimeFrom && preferredTimeTo && (
                <p className={preferredDate ? 'mt-1' : ''}>
                  <span className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                    Odabrani period:
                  </span>{' '}
                  {preferredTimeFrom} - {preferredTimeTo}
                </p>
              )}
            </div>
          )}
        </p>
      </div>

      {(preferredDate || preferredTimeFrom || preferredTimeTo || noPreferredTime) && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={ocistiOdabirTermina}
            className="px-1 py-1 text-sm font-medium transition-opacity
              hover:opacity-75"
            style={{
              color: 'var(--first-primary)',
            }}
          >
            Očisti odabir i unesi novi termin
          </button>
        </div>
      )}

      {validationError && (
        <p className="text-xs font-medium" style={{ color: '#DC2626' }}>
          {validationError}
        </p>
      )}
    </div>
  );
}
