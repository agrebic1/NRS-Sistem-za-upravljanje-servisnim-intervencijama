/**
 * Redni broj zahtjeva po korisniku: najstariji prijavljeni = 1 (created_at ASC, zatim id).
 * Isto kao zbroj zahtjeva nakon novog unosa (POST count).
 */

export function dodijeliKorisnickeBrojeveZahtjeva<T extends { id: number; created_at: string }>(
  rows: T[]
): (T & { korisnicki_broj_zahtjeva: number })[] {
  if (rows.length === 0) return [];
  const sortedAsc = [...rows].sort((a, b) => {
    const t = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (t !== 0) return t;
    return a.id - b.id;
  });
  const idToBroj = new Map<number, number>(sortedAsc.map((r, i) => [r.id, i + 1]));
  return rows.map((r) => ({
    ...r,
    korisnicki_broj_zahtjeva: idToBroj.get(r.id)!,
  }));
}

/** Niz mora biti sortiran kao kod dodjele (created_at ASC, id ASC). */
export function korisnickiBrojZahtjevaZaId(
  redoviAsc: { id: number }[],
  requestId: number
): number | null {
  const idx = redoviAsc.findIndex((r) => r.id === requestId);
  return idx >= 0 ? idx + 1 : null;
}

export function brojZahtjevaZaPrikaz(zahtjev: {
  korisnicki_broj_zahtjeva?: number | null;
  id: number;
}): number {
  const b = zahtjev.korisnicki_broj_zahtjeva;
  return typeof b === 'number' && b > 0 ? b : zahtjev.id;
}
