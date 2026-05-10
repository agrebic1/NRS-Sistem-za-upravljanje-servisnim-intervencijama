'use client';

import type { ReactNode } from 'react';
import { Calendar, CalendarClock, User } from 'lucide-react';

const TIMELINE_IKONA_BOJA = { color: 'var(--first-senary)' } as const;
const TIMELINE_IKONA_KLASA = 'h-4 w-4 shrink-0';
const TIMELINE_DATUM_KLASA = 'm-0 text-[14px] font-bold tabular-nums leading-tight';
const TIMELINE_OZNAKA_KLASA = 'm-0 text-[11px] font-normal leading-tight';
const TIMELINE_OZNAKA_BOJA = { color: 'var(--text-secondary)' } as const;
const TIMELINE_OZNAKA_UVLAČENJE_KLASA = 'pl-6';

export function ZahtjevMiniTimeline({
  prijavljenoTekst,
  terminTekst,
  napomenaIspod,
  className = '',
  kompakt = false,
}: {
  prijavljenoTekst: string;
  terminTekst: string;
  napomenaIspod?: ReactNode;
  className?: string;
  /** Uži vertikalni padding (npr. dispečerski detalj uz boxove). */
  kompakt?: boolean;
}) {
  return (
    <div className={className}>
      <div
        className={[
          'grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(3rem,auto)_minmax(0,1fr)] md:gap-x-3 md:gap-y-1',
          kompakt ? 'gap-y-2 py-2' : 'gap-y-3 py-4',
        ].join(' ')}
        style={{
          borderTop: '1px solid var(--border-soft)',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        <div className="flex flex-col gap-1 md:contents">
          <div className="flex min-w-0 gap-2 md:col-start-1 md:row-start-1">
            <Calendar className={TIMELINE_IKONA_KLASA} style={TIMELINE_IKONA_BOJA} aria-hidden />
            <p className={`${TIMELINE_DATUM_KLASA} min-w-0`} style={{ color: 'var(--text-primary)' }}>
              {prijavljenoTekst}
            </p>
          </div>
          <p
            className={`${TIMELINE_OZNAKA_KLASA} ${TIMELINE_OZNAKA_UVLAČENJE_KLASA} md:col-start-1 md:row-start-2`}
            style={TIMELINE_OZNAKA_BOJA}
          >
            Prijavljeno
          </p>
        </div>

        <div
          className="flex min-w-[2.5rem] items-center gap-0 md:col-start-2 md:row-start-1 md:self-center"
          aria-hidden
        >
          <div
            className="min-w-[1rem] flex-1 rounded-full"
            style={{
              height: '1.5px',
              backgroundColor: 'var(--color-border-secondary)',
            }}
          />
          <svg
            className="h-2.5 w-2.5 shrink-0 -translate-x-px"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M2.5 2L6.5 5L2.5 8"
              stroke="var(--color-border-secondary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-1 md:contents">
          <div className="flex min-w-0 gap-2 md:col-start-3 md:row-start-1">
            <CalendarClock className={TIMELINE_IKONA_KLASA} style={TIMELINE_IKONA_BOJA} aria-hidden />
            <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <span className={TIMELINE_DATUM_KLASA} style={{ color: 'var(--text-primary)' }}>
                {terminTekst}
              </span>
            </div>
          </div>
          <p
            className={`${TIMELINE_OZNAKA_KLASA} ${TIMELINE_OZNAKA_UVLAČENJE_KLASA} md:col-start-3 md:row-start-2`}
            style={TIMELINE_OZNAKA_BOJA}
          >
            Preferirani termin
          </p>
        </div>
      </div>
      {napomenaIspod ? (
        <div className="mt-2 text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
          {napomenaIspod}
        </div>
      ) : null}
    </div>
  );
}

export function ZahtjevKorisnickaPorukaBubble({
  tekst,
  className = '',
  lineClamp = false,
}: {
  tekst: string;
  className?: string;
  /** Sažetak u listi kartica (2 reda) */
  lineClamp?: boolean;
}) {
  const t = (tekst ?? '').trim();
  if (!t) return null;

  return (
    <div className={['flex w-full flex-nowrap items-start gap-2', className].filter(Boolean).join(' ')}>
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.12)',
          border: '1px solid rgb(var(--first-secondary-rgb) / 0.32)',
        }}
      >
        <User className="h-3.5 w-3.5" style={{ color: 'var(--text-secondary)' }} aria-hidden />
      </div>
      <div
        className="box-border min-w-0 shrink break-words py-2.5 px-[14px]"
        style={{
          width: 'calc(100% - 36px - 8px)',
          borderRadius: '0 12px 12px 12px',
          backgroundColor: 'var(--color-background-secondary)',
          border: '1px solid var(--color-border-tertiary)',
        }}
      >
        <p
          className="m-0 mb-1 text-[11px] font-medium leading-tight"
          style={{ color: 'var(--text-secondary)' }}
        >
          Poruka korisnika
        </p>
        <p
          className={['m-0 text-[14px] font-normal leading-[1.6]', lineClamp ? 'line-clamp-2' : '']
            .filter(Boolean)
            .join(' ')}
          style={{ color: 'var(--text-secondary)' }}
        >
          {t}
        </p>
      </div>
    </div>
  );
}
