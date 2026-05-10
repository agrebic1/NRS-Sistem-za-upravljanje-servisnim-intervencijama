import type { CSSProperties } from 'react';
import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { DISPECER_PALETA_HITNOST } from '@/lib/servisirane/dispecerPaleta';
import {
  korisnickiDashboardStatus,
  type KorisnickiDashboardStatus,
} from '@/lib/servisirane/statusZahtjeva';
import {
  efektivniKorisnickiUrgencyScore,
  oznakaInboxHitnostiCekaObradu,
  oznakaKorisnickeHitnostiTriRazine,
} from '@/lib/servisirane/urgency';

/**
 * Isti smisao kao bedž na početnoj / listi zahtjeva — jedna oznaka životnog ciklusa.
 */
export function korisnickiTokBedzTekst(zahtjev: ServisniZahtjev): string {
  const d = korisnickiDashboardStatus(zahtjev.status, zahtjev.urgency_score, zahtjev.final_priority);
  if (d === 'novi') return oznakaInboxHitnostiCekaObradu(zahtjev);
  const MAP: Record<KorisnickiDashboardStatus, string> = {
    novi: '',
    hitno: 'Visoka hitnost (čeka obradu)',
    u_obradi: 'Dispečer obrađuje',
    u_toku: 'Na terenu',
    zavrseno: 'Završeno',
    otkazano: 'Otkazano',
    odbijeno: 'Odbijeno',
  };
  return MAP[d] ?? d;
}

function stilHitnostiZaNovuIHitnu(zahtjev: ServisniZahtjev): CSSProperties {
  const tri = oznakaKorisnickeHitnostiTriRazine(efektivniKorisnickiUrgencyScore(zahtjev));
  const kljuc = tri === 'Niska' ? 'Niska' : tri === 'Srednja' ? 'Srednja' : 'Hitno';
  const cfg = DISPECER_PALETA_HITNOST[kljuc];
  return {
    backgroundColor: cfg.pozadina,
    color: cfg.tekst,
    border: `1px solid ${cfg.border}`,
  };
}

/** Stil bedža — usklađeno s `stilStatusBedzaZaDashboard` na početnoj korisnika. */
export function korisnickiTokBedzStil(zahtjev: ServisniZahtjev): CSSProperties {
  const d = korisnickiDashboardStatus(zahtjev.status, zahtjev.urgency_score, zahtjev.final_priority);
  if (d === 'novi' || d === 'hitno') return stilHitnostiZaNovuIHitnu(zahtjev);

  const B: Record<
    Exclude<KorisnickiDashboardStatus, 'novi' | 'hitno'>,
    CSSProperties
  > = {
    u_obradi: { backgroundColor: 'rgba(202,138,4,0.12)', color: '#A16207' },
    u_toku: {
      backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.14)',
      color:             'var(--first-secondary)',
    },
    zavrseno: {
      backgroundColor: 'rgb(var(--first-septenary-rgb) / 0.18)',
      color:             'var(--first-septenary)',
    },
    otkazano: {
      backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.3)',
      color:             'var(--first-nonary)',
    },
    odbijeno: {
      backgroundColor: 'rgb(var(--first-senary-rgb) / 0.2)',
      color:             'var(--first-senary)',
    },
  };
  return B[d as keyof typeof B] ?? {
    backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
    color:           'var(--first-nonary)',
  };
}
