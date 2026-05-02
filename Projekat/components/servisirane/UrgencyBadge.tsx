'use client';

import type { NivoHitnosti } from '@/domain/types/servisirane';
import { kategorizirajHitnost, oznakaHitnostiZaKorisnika } from '@/lib/servisirane/urgency';

const KONFIGURACIJA: Record<
  NivoHitnosti,
  { pozadina: string; boja: string; border: string }
> = {
  'KRITIČNO': {
    pozadina: 'rgb(var(--first-senary-rgb) / 0.12)',
    boja:     'var(--first-senary)',
    border:   'rgb(var(--first-senary-rgb) / 0.3)',
  },
  'VISOKO': {
    pozadina: 'rgba(217, 119, 6, 0.12)',
    boja:     'rgb(180, 83, 9)',
    border:   'rgba(217, 119, 6, 0.3)',
  },
  'SREDNJE': {
    pozadina: 'rgb(var(--first-septenary-rgb) / 0.18)',
    boja:     'var(--first-senary)',
    border:   'rgb(var(--first-septenary-rgb) / 0.35)',
  },
  'NISKO': {
    pozadina: 'rgb(var(--first-secondary-rgb) / 0.1)',
    boja:     'var(--first-secondary)',
    border:   'rgb(var(--first-secondary-rgb) / 0.25)',
  },
};

interface UrgencyBadgeProps {
  score:      number;
  showScore?: boolean;
  /** Korisnički prikaz: hrvatski naziv, bez broja bodova. */
  korisnickiPrikaz?: boolean;
  size?:      'sm' | 'md';
}

export function UrgencyBadge({
  score,
  showScore = false,
  korisnickiPrikaz = false,
  size = 'sm',
}: UrgencyBadgeProps) {
  const nivo   = kategorizirajHitnost(score);
  const config = KONFIGURACIJA[nivo];
  const cls    = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const label  = korisnickiPrikaz ? oznakaHitnostiZaKorisnika(score) : nivo;
  const prikaziBroj = showScore && !korisnickiPrikaz;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${cls}`}
      style={{
        backgroundColor: config.pozadina,
        color:           config.boja,
        border:          `1px solid ${config.border}`,
      }}
    >
      <span
        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: config.boja }}
      />
      {label}
      {prikaziBroj && <span className="opacity-60">({score})</span>}
    </span>
  );
}
