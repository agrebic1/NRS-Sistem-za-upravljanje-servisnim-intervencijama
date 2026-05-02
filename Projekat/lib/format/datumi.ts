/**
 * Jedinstveni prikaz datuma: `02. 05. 2026.`
 * Za niz samo u obliku `YYYY-MM-DD` koristi se podne lokalnog vremena da se izbjegne pomak kalendarskog dana.
 */

function uDatumZaPrikaz(vrijednost: string | Date): Date | null {
  if (vrijednost instanceof Date) {
    return Number.isNaN(vrijednost.getTime()) ? null : vrijednost;
  }
  const s = vrijednost.trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatirajDatumPrikaz(
  vrijednost: string | Date | null | undefined,
  prazno = '—'
): string {
  if (vrijednost == null || vrijednost === '') return prazno;
  const d = uDatumZaPrikaz(vrijednost);
  if (!d) return prazno;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return `${dd}. ${mm}. ${yyyy}.`;
}

/** Primjer: `02. 05. 2026. 14:30` */
export function formatirajDatumVrijemeZaPrikaz(
  vrijednost: string | Date | null | undefined,
  prazno = '—'
): string {
  if (vrijednost == null || vrijednost === '') return prazno;
  const d = vrijednost instanceof Date ? vrijednost : new Date(vrijednost);
  if (Number.isNaN(d.getTime())) return prazno;
  const datum = formatirajDatumPrikaz(d, prazno);
  if (datum === prazno) return prazno;
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${datum} ${hh}:${min}`;
}
