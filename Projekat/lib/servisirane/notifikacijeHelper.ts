// ─── Helper za kreiranje in-app notifikacija ──────────────────────────────────
//
// Sve insert operacije u tabelu `notifikacije` idu kroz ove funkcije.
// Koristiti createAdminClient() da se zaobiđu RLS politike pri insertu.

type AnyDB = any;

export interface NotifikacijaParams {
  korisnik_id: string;
  tip:         string;
  naslov:      string;
  poruka:      string;
  zahtjev_id?: number | null;
}

export async function kreirajNotifikaciju(
  db:     AnyDB,
  params: NotifikacijaParams
): Promise<void> {
  await db.from('notifikacije').insert({
    korisnik_id: params.korisnik_id,
    tip:         params.tip,
    naslov:      params.naslov,
    poruka:      params.poruka,
    zahtjev_id:  params.zahtjev_id ?? null,
  });
}

export async function kreirajViseNotifikacija(
  db:     AnyDB,
  params: NotifikacijaParams[]
): Promise<void> {
  if (!params.length) return;
  await db.from('notifikacije').insert(
    params.map((p) => ({
      korisnik_id: p.korisnik_id,
      tip:         p.tip,
      naslov:      p.naslov,
      poruka:      p.poruka,
      zahtjev_id:  p.zahtjev_id ?? null,
    }))
  );
}

// ─── Predefinisane poruke po tipu ────────────────────────────────────────────

export function notifDodjelaIntervencije(
  db:          AnyDB,
  serviser_id: string,
  zahtjev_id:  number
) {
  return kreirajNotifikaciju(db, {
    korisnik_id: serviser_id,
    tip:         'dodjela_intervencije',
    naslov:      'Nova intervencija dodijeljena',
    poruka:      `Intervencija #${zahtjev_id} je dodijeljena vama. Provjerite detalje i prihvatite zadatak.`,
    zahtjev_id,
  });
}

export function notifPrihvatanjeZadatka(
  db:          AnyDB,
  dispecer_id: string,
  zahtjev_id:  number,
  ime_servisera: string
) {
  return kreirajNotifikaciju(db, {
    korisnik_id: dispecer_id,
    tip:         'prihvatanje_zadatka',
    naslov:      'Serviser prihvatio zadatak',
    poruka:      `${ime_servisera} je prihvatio intervenciju #${zahtjev_id} i na je putu.`,
    zahtjev_id,
  });
}

export function notifOdbijanjeZadatka(
  db:           AnyDB,
  dispecer_id:  string,
  zahtjev_id:   number,
  ime_servisera: string,
  razlog:       string
) {
  return kreirajNotifikaciju(db, {
    korisnik_id: dispecer_id,
    tip:         'odbijanje_zadatka',
    naslov:      'Serviser odbio zadatak',
    poruka:      `${ime_servisera} je odbio intervenciju #${zahtjev_id}. Razlog: ${razlog}`,
    zahtjev_id,
  });
}

export function notifEvidencijaRada(
  db:          AnyDB,
  dispecer_id: string,
  zahtjev_id:  number,
  ime_servisera: string
) {
  return kreirajNotifikaciju(db, {
    korisnik_id: dispecer_id,
    tip:         'evidencija_rada',
    naslov:      'Evidentiran rad na intervenciji',
    poruka:      `${ime_servisera} je evidentirao rad na intervenciji #${zahtjev_id}.`,
    zahtjev_id,
  });
}

export function notifZatvaranjeIntervencije(
  db:          AnyDB,
  serviser_id: string,
  zahtjev_id:  number
) {
  return kreirajNotifikaciju(db, {
    korisnik_id: serviser_id,
    tip:         'zatvaranje_intervencije',
    naslov:      'Intervencija formalno zatvorena',
    poruka:      `Dispečer je formalno zatvorio intervenciju #${zahtjev_id}. Slučaj je arhiviran.`,
    zahtjev_id,
  });
}

export function notifTimDodjela(
  db:           AnyDB,
  serviser_id:  string,
  zahtjev_id:   number,
  tip_uloge:    string
) {
  return kreirajNotifikaciju(db, {
    korisnik_id: serviser_id,
    tip:         'tim_dodjela',
    naslov:      'Dodani ste u tim intervencije',
    poruka:      `Dodani ste kao ${tip_uloge} serviser na intervenciji #${zahtjev_id}.`,
    zahtjev_id,
  });
}
