/**
 * Kostur liste „intervencija“ (bez API-ja) — probni redovi usklađeni s:
 * - životnim ciklusom `service_requests` / `StatusZahtjeva` (termin, dodjela, teren, završetak),
 * - operativnim prioritetima NISKO … HITNO (kad proširimo stupce),
 * - kategorijama iz `KATEGORIJE_KVARA` (kratki opis = glavna — podkategorija).
 *
 * Statusi za **servisera** opisuju tijek nakon dodjele i dogovorenog termina: zakazano → polazak (u putu) → rad na terenu → završeno.
 * `ceka_dodjelu` ostaje samo za **dispečerski** pregled (još nema servisera na zahtjevu).
 *
 * Kasnije zamijeniti odgovorom iz baze (`intervencija`, `dodjela`, …).
 */

export type IntervencijaKosturStatus =
  | 'planirana'
  | 'ceka_dodjelu'
  | 'dodijeljena'
  | 'u_toku'
  | 'zavrsena';

export interface IntervencijaKosturRed {
  /** Prikazni ključ (vezan uz ID zahtjeva u aplikaciji). */
  javniBroj: string;
  /** Odgovara `service_requests.id`. */
  zahtjevId: number;
  kratkiOpis: string;
  /** `null` dok dispečer ne dodijeli servisera (kao u čarobnjaku „Termin i serviser“). */
  serviserIme: string | null;
  /** Planirani početak terena (ISO 8601). */
  terminPocetak: string;
  status: IntervencijaKosturStatus;
  /** Usklađeno s `final_priority` u zahtjevu. */
  operativniPrioritet: 'NISKO' | 'SREDNJE' | 'VISOKO' | 'KRITIČNO' | 'HITNO';
}

/** Ilustrativni podaci za dispečera. */
export const MOCK_INTERVENCIJE_DISPECER: IntervencijaKosturRed[] = [
  {
    javniBroj: 'Z-12',
    zahtjevId: 12,
    kratkiOpis: 'Klima i ventilacija — Ne hladi / ne grije',
    serviserIme: 'Marko Horvat',
    terminPocetak: '2026-05-12T08:30:00',
    status: 'u_toku',
    operativniPrioritet: 'SREDNJE',
  },
  {
    javniBroj: 'Z-15',
    zahtjevId: 15,
    kratkiOpis: 'Vodovod i kanalizacija — Curenje cijevi',
    serviserIme: 'Ana Jurić',
    terminPocetak: '2026-05-14T09:00:00',
    status: 'dodijeljena',
    operativniPrioritet: 'KRITIČNO',
  },
  {
    javniBroj: 'Z-7',
    zahtjevId: 7,
    kratkiOpis: 'Grijanje i topla voda — Nema tople vode',
    serviserIme: 'Petar Novak',
    terminPocetak: '2026-05-10T16:45:00',
    status: 'planirana',
    operativniPrioritet: 'HITNO',
  },
  {
    javniBroj: 'Z-4',
    zahtjevId: 4,
    kratkiOpis: 'Klima i ventilacija — Filter / redovni servis',
    serviserIme: 'Marko Horvat',
    terminPocetak: '2026-05-08T11:00:00',
    status: 'zavrsena',
    operativniPrioritet: 'NISKO',
  },
];

/** Probni podaci za servisera — samo faze nakon dodjele (bez „čeka dodjelu“). */
export const MOCK_INTERVENCIJE_SERVISER: IntervencijaKosturRed[] = [
  {
    javniBroj: 'Z-7',
    zahtjevId: 7,
    kratkiOpis: 'Grijanje i topla voda — Nema tople vode',
    serviserIme: 'Petar Novak',
    terminPocetak: '2026-05-10T16:45:00',
    status: 'planirana',
    operativniPrioritet: 'HITNO',
  },
  {
    javniBroj: 'Z-15',
    zahtjevId: 15,
    kratkiOpis: 'Vodovod i kanalizacija — Curenje cijevi',
    serviserIme: 'Ana Jurić',
    terminPocetak: '2026-05-14T09:00:00',
    status: 'dodijeljena',
    operativniPrioritet: 'KRITIČNO',
  },
  {
    javniBroj: 'Z-12',
    zahtjevId: 12,
    kratkiOpis: 'Klima i ventilacija — Ne hladi / ne grije',
    serviserIme: 'Marko Horvat',
    terminPocetak: '2026-05-12T08:30:00',
    status: 'u_toku',
    operativniPrioritet: 'SREDNJE',
  },
  {
    javniBroj: 'Z-4',
    zahtjevId: 4,
    kratkiOpis: 'Klima i ventilacija — Filter / redovni servis',
    serviserIme: 'Marko Horvat',
    terminPocetak: '2026-05-08T11:00:00',
    status: 'zavrsena',
    operativniPrioritet: 'NISKO',
  },
];

export const NAZIV_STATUSA_INTERVENCIJE_KOSTUR: Record<IntervencijaKosturStatus, string> = {
  planirana: 'Zakazano',
  ceka_dodjelu: 'Čeka dodjelu',
  dodijeljena: 'U putu',
  u_toku: 'Na terenu',
  zavrsena: 'Završeno',
};
