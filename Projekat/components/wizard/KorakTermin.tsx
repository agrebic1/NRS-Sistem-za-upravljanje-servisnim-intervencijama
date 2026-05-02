'use client';

import { Sunrise, Sun, Sunset, SlidersHorizontal, CalendarDays, Calendar, Check } from 'lucide-react';
import { KalendarOdabir } from '@/components/ui/KalendarOdabir';
import type { TerminSlot } from '@/domain/types/servisirane';

// ─── Period helpers ───────────────────────────────────────────────────────────

interface PeriodInfo {
  boja:   string;
  oznaka: string;
  Ikona:  React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

function getPeriodInfo(from: string, to: string): PeriodInfo {
  // Cijeli dan: from=00:00 i to=23:59
  if (from === '00:00' && to >= '23:00') {
    return { boja: '#22C55E', oznaka: 'Cijeli dan', Ikona: CalendarDays };
  }
  if (!from) return { boja: '#A855F7', oznaka: 'Prilagođeno', Ikona: SlidersHorizontal };
  const h = parseInt(from.split(':')[0], 10);
  if (h >= 8  && h < 12) return { boja: '#F59E0B', oznaka: 'Jutro', Ikona: Sunrise };
  if (h >= 12 && h < 16) return { boja: '#CA8A04', oznaka: 'Dan',   Ikona: Sun };
  if (h >= 16 && h < 20) return { boja: '#3B82F6', oznaka: 'Veče',  Ikona: Sunset };
  return { boja: '#A855F7', oznaka: 'Prilagođeno', Ikona: SlidersHorizontal };
}

// Brzi periodi za quick-select
const BRZI_PERIODI: { oznaka: string; from: string; to: string; boja: string }[] = [
  { oznaka: 'Jutro',      from: '08:00', to: '12:00', boja: '#F59E0B' },
  { oznaka: 'Dan',        from: '12:00', to: '16:00', boja: '#CA8A04' },
  { oznaka: 'Veče',       from: '16:00', to: '20:00', boja: '#3B82F6' },
  { oznaka: 'Cijeli dan', from: '00:00', to: '23:59', boja: '#22C55E' },
];

// ─── Format datuma ────────────────────────────────────────────────────────────

const D_KRATKI = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'];
const M_GEN    = ['jan', 'feb', 'mar', 'apr', 'maja', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

function formatDatum(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return `${D_KRATKI[d.getDay()]}, ${d.getDate()}. ${M_GEN[d.getMonth()]}`;
}

// ─── TimeRange sub-component ──────────────────────────────────────────────────

interface TimeRangeProps {
  from:   string;
  to:     string;
  onFrom: (v: string) => void;
  onTo:   (v: string) => void;
  onBrzi: (from: string, to: string) => void;
}

function TimeRange({ from, to, onFrom, onTo, onBrzi }: TimeRangeProps) {
  const invalid              = Boolean(from && to && from >= to);
  const { boja, oznaka, Ikona } = getPeriodInfo(from, to);

  return (
    <div className="flex flex-col gap-2.5">
      {/* Od — Do row: flex na sm+, stacked na xs */}
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1" style={{ minWidth: '90px' }}>
          <label
            className="text-xs font-medium"
            style={{ color: 'var(--first-nonary)' }}
          >
            Od
          </label>
          <input
            type="time"
            value={from}
            onChange={(e) => onFrom(e.target.value)}
            className="min-w-0 w-full rounded-lg border px-3 py-2 text-sm transition-colors
              focus:outline-none focus:ring-2"
            style={{
              borderColor:     invalid ? '#DC2626' : 'rgb(var(--first-quaternary-rgb) / 0.45)',
              backgroundColor: 'rgb(255 255 255 / 0.85)',
              color:           'var(--first-octonary)',
            }}
          />
        </div>

        <span
          className="mb-2 flex-shrink-0 text-sm"
          style={{ color: 'var(--first-quinary)' }}
        >
          —
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1" style={{ minWidth: '90px' }}>
          <label
            className="text-xs font-medium"
            style={{ color: 'var(--first-nonary)' }}
          >
            Do
          </label>
          <input
            type="time"
            value={to}
            onChange={(e) => onTo(e.target.value)}
            className="min-w-0 w-full rounded-lg border px-3 py-2 text-sm transition-colors
              focus:outline-none focus:ring-2"
            style={{
              borderColor:     invalid ? '#DC2626' : 'rgb(var(--first-quaternary-rgb) / 0.45)',
              backgroundColor: 'rgb(255 255 255 / 0.85)',
              color:           'var(--first-octonary)',
            }}
          />
        </div>

        {/* Period badge */}
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

      {/* Greška invalid range */}
      {invalid && (
        <p className="text-xs font-medium" style={{ color: '#DC2626' }}>
          &quot;Vrijeme do&quot; mora biti nakon &quot;Vrijeme od&quot;.
        </p>
      )}

      {/* Brzi periodi */}
      <div className="flex flex-wrap gap-1.5">
        {BRZI_PERIODI.map((p) => {
          const aktivan = from === p.from && to === p.to;
          return (
            <button
              key={p.oznaka}
              type="button"
              onClick={() => onBrzi(p.from, p.to)}
              className="rounded-md border px-2.5 py-1 text-xs font-medium transition-all duration-150"
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

// ─── Korak 3: Termin ──────────────────────────────────────────────────────────

interface KorakTerminProps {
  termini:          TerminSlot[];
  istaVrijemaSvima: boolean;
  onUpdate: (p: { termini?: TerminSlot[]; istaVrijemaSvima?: boolean }) => void;
  errors?:  { termini?: string };
}

export function KorakTermin({
  termini,
  istaVrijemaSvima,
  onUpdate,
  errors,
}: KorakTerminProps) {
  // Derived
  const selectedDates = termini.map((t) => t.date);

  const dateColors: Record<string, string> = {};
  termini.forEach((t) => {
    dateColors[t.date] = getPeriodInfo(t.from, t.to).boja;
  });

  // Sinhronizacija kalendara i termini liste
  function handleCalendarChange(newDates: string[]) {
    const existingMap = new Map(termini.map((t) => [t.date, t]));
    const sharedFrom  = termini.length > 0 ? termini[0].from : '08:00';
    const sharedTo    = termini.length > 0 ? termini[0].to   : '10:00';
    const sorted      = [...newDates].sort();

    const newTermini: TerminSlot[] = sorted.map((date) => {
      const ex = existingMap.get(date);
      if (ex) return ex;
      return { date, from: sharedFrom, to: sharedTo };
    });

    // Kad je toggle ON — primijeni zajednički termin i na novododane
    const final =
      istaVrijemaSvima && newTermini.length > 0
        ? newTermini.map((t) => ({ ...t, from: sharedFrom, to: sharedTo }))
        : newTermini;

    onUpdate({ termini: final });
  }

  // Toggle "Isto za sve"
  function handleToggle() {
    if (istaVrijemaSvima) {
      onUpdate({ istaVrijemaSvima: false });
    } else {
      const from = termini[0]?.from ?? '08:00';
      const to   = termini[0]?.to   ?? '10:00';
      onUpdate({
        istaVrijemaSvima: true,
        termini: termini.map((t) => ({ ...t, from, to })),
      });
    }
  }

  // Promjena dijeljenog termina (toggle ON)
  function handleSharedTime(from: string, to: string) {
    onUpdate({ termini: termini.map((t) => ({ ...t, from, to })) });
  }

  // Promjena individualnog termina (toggle OFF)
  function handleSingleTime(date: string, field: 'from' | 'to', val: string) {
    onUpdate({
      termini: termini.map((t) => (t.date === date ? { ...t, [field]: val } : t)),
    });
  }

  const sharedFrom = termini[0]?.from ?? '';
  const sharedTo   = termini[0]?.to   ?? '';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-1 text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
          Termin intervencije
        </h2>
        <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
          Odaberite datume i podesite vremenski raspon — sistem pronalazi slobodan termin u vašem prozoru.
        </p>
      </div>

      {errors?.termini && (
        <p
          className="rounded-xl border px-4 py-2.5 text-sm font-medium"
          style={{
            borderColor:     'rgba(220,38,38,0.3)',
            backgroundColor: 'rgba(220,38,38,0.05)',
            color:           '#DC2626',
          }}
        >
          {errors.termini}
        </p>
      )}

      {/* Dual-column layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* ── Lijevo: Kalendar ──────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-4"
          style={{
            backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.15)',
            border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.3)',
          }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--first-nonary)' }}
          >
            Odaberite datume
          </p>
          <KalendarOdabir
            odabraniDatumi={selectedDates}
            onPromjena={handleCalendarChange}
            dateColors={dateColors}
          />
        </div>

        {/* ── Desno: Schedule editor ────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {termini.length === 0 ? (
            /* Prazno stanje */
            <div
              className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl
                border-2 border-dashed py-14 text-center"
              style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.35)' }}
            >
              <Calendar className="h-10 w-10" style={{ color: 'var(--first-quinary)' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--first-nonary)' }}>
                  Nema odabranih datuma
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--first-quinary)' }}>
                  Kliknite na kalendar za dodavanje termina
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Toggle: Isto za sve */}
              <button
                type="button"
                onClick={handleToggle}
                className="flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm
                  font-medium text-left transition-all duration-150"
                style={{
                  borderColor:     istaVrijemaSvima
                    ? 'var(--first-primary)'
                    : 'rgb(var(--first-quaternary-rgb) / 0.4)',
                  backgroundColor: istaVrijemaSvima
                    ? 'rgb(var(--first-primary-rgb) / 0.06)'
                    : 'rgb(255 255 255 / 0.7)',
                  color: 'var(--first-octonary)',
                }}
              >
                {/* Checkbox vizual */}
                <div
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded"
                  style={{
                    backgroundColor: istaVrijemaSvima ? 'var(--first-primary)' : 'transparent',
                    border: istaVrijemaSvima
                      ? 'none'
                      : '1.5px solid rgb(var(--first-quaternary-rgb) / 0.6)',
                  }}
                >
                  {istaVrijemaSvima && (
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  )}
                </div>

                <span>Primijeni isto vrijeme na sve dane</span>

                {/* Broj datuma */}
                <span
                  className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: istaVrijemaSvima
                      ? 'var(--first-primary)'
                      : 'rgb(var(--first-quaternary-rgb) / 0.35)',
                    color: istaVrijemaSvima ? '#fff' : 'var(--first-nonary)',
                  }}
                >
                  {termini.length}
                </span>
              </button>

              {/* ── SHARED mode ──────────────────────────────────────────── */}
              {istaVrijemaSvima && (
                <div
                  className="rounded-xl border p-4"
                  style={{
                    borderColor:     'rgb(var(--first-primary-rgb) / 0.25)',
                    backgroundColor: 'rgb(var(--first-primary-rgb) / 0.03)',
                  }}
                >
                  <p
                    className="mb-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--first-nonary)' }}
                  >
                    Zajednički vremenski raspon
                  </p>

                  <TimeRange
                    from={sharedFrom}
                    to={sharedTo}
                    onFrom={(v) => handleSharedTime(v, sharedTo)}
                    onTo={(v)   => handleSharedTime(sharedFrom, v)}
                    onBrzi={handleSharedTime}
                  />

                  {/* Primjenjuje se na: */}
                  {termini.length > 0 && (
                    <div className="mt-4">
                      <p
                        className="mb-1.5 text-xs font-medium"
                        style={{ color: 'var(--first-nonary)' }}
                      >
                        Primjenjuje se na:
                      </p>
                      <div className="flex flex-col gap-1">
                        {termini.map((t) => (
                          <div key={t.date} className="flex items-center gap-2">
                            <div
                              className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                              style={{ backgroundColor: getPeriodInfo(t.from, t.to).boja }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: 'var(--first-octonary)' }}
                            >
                              {formatDatum(t.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── INDIVIDUAL mode ──────────────────────────────────────── */}
              {!istaVrijemaSvima && (
                <div
                  className="flex flex-col gap-3 overflow-y-auto pr-0.5"
                  style={{ maxHeight: '400px' }}
                >
                  {termini.map((t) => (
                    <div
                      key={t.date}
                      className="rounded-xl border p-4"
                      style={{
                        borderColor:     'rgb(var(--first-quaternary-rgb) / 0.35)',
                        backgroundColor: 'rgb(255 255 255 / 0.75)',
                      }}
                    >
                      {/* Datum + period badge */}
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: 'var(--first-octonary)' }}
                        >
                          {formatDatum(t.date)}
                        </p>
                        {t.from && t.to && (
                          <div
                            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
                            style={{
                              backgroundColor: `${getPeriodInfo(t.from, t.to).boja}18`,
                              color:           getPeriodInfo(t.from, t.to).boja,
                            }}
                          >
                            {(() => {
                              const { Ikona, oznaka } = getPeriodInfo(t.from, t.to);
                              return (
                                <>
                                  <Ikona className="h-3 w-3" />
                                  {oznaka}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      <TimeRange
                        from={t.from}
                        to={t.to}
                        onFrom={(v) => handleSingleTime(t.date, 'from', v)}
                        onTo={(v)   => handleSingleTime(t.date, 'to',   v)}
                        onBrzi={(from, to) =>
                          onUpdate({
                            termini: termini.map((x) =>
                              x.date === t.date ? { ...x, from, to } : x
                            ),
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
