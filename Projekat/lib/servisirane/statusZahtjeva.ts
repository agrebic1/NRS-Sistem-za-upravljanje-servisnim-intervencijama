import type { StatusZahtjeva } from '@/domain/types/servisirane';

/**
 * Sažetak za korisnički dashboard — usklađen sa životnim ciklusom u bazi i detalj stranicom.
 * `hitno` = korisnička procjena (urgency_score), ne operativni prioritet dispečera.
 */
export type KorisnickiDashboardStatus =
  | 'novi'
  | 'u_obradi'
  | 'u_toku'
  | 'hitno'
  | 'zavrseno'
  | 'otkazano'
  | 'odbijeno';

/** Prag za „hitno” na dashboardu — ista skala kao trijaža / UrgencyBadge. */
const PRAG_KORISNICKE_HITNOSTI_HITNO = 80;

/**
 * Mapira DB status (+ opcioni urgency) na kategoriju kartice na početnoj korisnika.
 */
export function korisnickiDashboardStatus(
  status: string | null | undefined,
  urgencyScore: number | null | undefined,
  /** Kad je postavljen operativni prioritet, zahtjev je u dispečerskoj obradi čak i ako red još nije migriran na `in_review`. */
  finalPriority?: string | null | undefined,
): KorisnickiDashboardStatus {
  const s = (status ?? '').toLowerCase();
  const score = Number(urgencyScore ?? 0);
  const imaOperativniPrioritet = Boolean((finalPriority ?? '').trim());

  if (s === 'zavrseno') return 'zavrseno';
  if (s === 'otkazano') return 'otkazano';
  if (s === 'odbijeno') return 'odbijeno';

  if (s === 'in_review') return 'u_obradi';

  if ((s === 'pending_review' || s === 'na_cekanju') && imaOperativniPrioritet) return 'u_obradi';

  if (score >= PRAG_KORISNICKE_HITNOSTI_HITNO) return 'hitno';

  if (s === 'pending_review' || s === 'na_cekanju') return 'novi';
  if (s === 'potvrdeno' || s === 'dodijeljeno' || s === 'u_radu' || s === 'u_izvrsenju') {
    return 'u_toku';
  }

  return 'novi';
}

/** Statusi u kojima korisnik smije mijenjati ili otkazati zahtjev (service-requests PATCH). */
export const STATUSI_ZA_KORISNICKU_IZMJENU: ReadonlySet<StatusZahtjeva> = new Set([
  'na_cekanju',
  'pending_review',
]);

/** Završni statusi — ne ulaze u operativni pregled aktivnih. */
export const TERMINALNI_STATUSI_ZAHTJEVA = new Set<string>([
  'zavrseno',
  'otkazano',
  'odbijeno',
]);

/**
 * Zahtjevi u dispečerovom inboxu (čekaju prvu obradu / pregled).
 * `in_review`: dispečer je u čarobnjaku obrade — korisnik više ne smije mijenjati (usklađeno sa API).
 */
export function zahtjevCekaObraduUInboxuDispecera(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'pending_review' || s === 'na_cekanju' || s === 'in_review';
}

/** Još nije otvoren dispečerski čarobnjak (prije koraka Prioritet / Termin…). */
export function zahtjevJeNoviPrijeCarobnjakaDispecera(status: string): boolean {
  const s = status.toLowerCase();
  return s === 'pending_review' || s === 'na_cekanju';
}

/** Dispečer radi čarobnjak (Pregled → Prioritet → Termin i serviser → …). */
export function zahtjevJeUCarobnjakuDispecera(status: string): boolean {
  return status.toLowerCase() === 'in_review';
}

export function jeZahtjevAktivan(status: string): boolean {
  return !TERMINALNI_STATUSI_ZAHTJEVA.has(status);
}

export function korisnikSmijeMijenjatiIliOtkazatiZahtjev(status: string): boolean {
  return STATUSI_ZA_KORISNICKU_IZMJENU.has(status as StatusZahtjeva);
}

/** Zahtjev dodijeljen serviseru ili aktivno u izvršenju (sažetak kontrolne table). */
export function zahtjevJeUToku(status: string): boolean {
  return ['dodijeljeno', 'u_radu', 'u_izvrsenju'].includes(status);
}

/** Aktivni zahtjevi u kojima dispečer smije mijenjati `final_priority` bez promjene statusa. */
export const STATUSI_ZA_DISPECERSKU_IZMJENU_PRIORITETA: ReadonlySet<StatusZahtjeva> = new Set([
  'pending_review',
  'na_cekanju',
  'in_review',
  'potvrdeno',
  'dodijeljeno',
  'u_radu',
  'u_izvrsenju',
]);

export function dispecerSmijeMijenjatiOperativniPrioritet(status: string): boolean {
  return STATUSI_ZA_DISPECERSKU_IZMJENU_PRIORITETA.has(status as StatusZahtjeva);
}
