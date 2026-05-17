// ─── Centralizovane boje i oznake statusnih / prioritetnih vrijednosti ────────
//
// Koristiti umjesto lokalnih duplikata u stranicama servisera i dispečera.

/** Mapira operativni prioritet u hex boju. */
export function prioritetBoja(p: string | null): string {
  switch ((p ?? '').toUpperCase()) {
    case 'HITNO':    return '#DC2626';
    case 'KRITIČNO': return '#991B1B';
    case 'VISOKO':   return '#EA580C';
    case 'SREDNJE':  return '#D97706';
    default:         return 'var(--first-secondary)';
  }
}

/** Mapira status intervencije u CSS boju (CSS varijabla ili hex). */
export function statusBoja(s: string): string {
  switch (s) {
    case 'dodijeljeno':  return 'var(--first-senary)';
    case 'u_radu':
    case 'u_izvrsenju':  return 'var(--first-secondary)';
    default:             return 'var(--first-nonary)';
  }
}

/** Mapira status intervencije u čitljivi naziv na bosanskom. */
export function statusOznaka(s: string): string {
  switch (s) {
    case 'dodijeljeno':  return 'Dodijeljeno';
    case 'u_radu':       return 'Na putu';
    case 'u_izvrsenju':  return 'Na terenu';
    case 'zavrseno':     return 'Završeno';
    case 'zatvoreno':    return 'Arhivirano';
    case 'otkazano':     return 'Otkazano';
    case 'odbijeno':     return 'Odbijeno';
    default:             return s;
  }
}
