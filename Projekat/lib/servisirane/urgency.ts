import type { TriageOdgovori, NivoHitnosti } from '@/domain/types/servisirane';

export function izracunajUrgency(triage: TriageOdgovori): number {
  let score = 0;

  // Sigurnost — max 50
  if (triage.opasnost) score += 50;

  // Zastoj / funkcionalnost — max 25
  if (triage.funkcionalnost === 'potpuni_prekid') score += 25;
  else if (triage.funkcionalnost === 'otezana') score += 10;

  // Rizik od sekundarne štete — max 15
  if (triage.steta) score += 15;

  // Ranjivost — max 10
  if (triage.ranjivost) score += 10;

  // Obuhvat — max 10
  if (triage.obuhvat) score += 10;

  return score; // max 110
}

export function kategorizirajHitnost(score: number): NivoHitnosti {
  if (score >= 80) return 'KRITIČNO';
  if (score >= 50) return 'VISOKO';
  if (score >= 20) return 'SREDNJE';
  return 'NISKO';
}

const OZNAKA_HITNOSTI_ZA_KORISNIKA: Record<NivoHitnosti, string> = {
  NISKO: 'Niska',
  SREDNJE: 'Srednja',
  VISOKO: 'Visoka',
  KRITIČNO: 'Hitno',
};

/** Korisnički čitljiva hitnost (bez enum vrijednosti i broja bodova). */
export function oznakaHitnostiZaKorisnika(score: number): string {
  const nivo = kategorizirajHitnost(score);
  return OZNAKA_HITNOSTI_ZA_KORISNIKA[nivo] ?? nivo;
}
