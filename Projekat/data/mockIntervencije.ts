/**
 * Mock intervencije za razvoj i testiranje.
 * Zamijeni pozivima Supabase/PostgreSQL kada backend bude spreman.
 *
 * Struktura odgovara IntervencijaRed tipu koji proširuje ServisniZahtjev.
 */

export interface MockIntervencija {
  id:                        number;
  user_id:                   string;
  status:                    string;
  category:                  string;
  category_main:             string;
  category_sub:              string;
  description:               string;
  address:                   string;
  latitude?:                 number | null;
  longitude?:                number | null;
  contact_phone:             string;
  is_premium:                boolean;
  urgency_score:             number;
  final_priority:            string;
  dispecer_napomene?:        string | null;
  termin_planirani_pocetak?: string | null;
  termin_planirani_kraj?:    string | null;
  procijenjeno_trajanje?:    number | null;
  serviser_dodijeljen_id?:   string | null;
  rad_evidentiran_at?:       string | null;
  created_at:                string;
  updated_at:                string;
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
  serviser?:  { id: string; ime: string; prezime: string; broj_telefona?: string | null } | null;
  /** Evidencija rada (za detail prikaz). */
  evidencije?: {
    id: number; zahtjev_id: number; serviser_id: string;
    opis_rada: string; trajanje_minuta: number | null;
    materijal: string | null; napomene: string | null; created_at: string;
  }[];
  /** Aktivnosti intervencije (za detail prikaz). */
  aktivnosti?: {
    id: number; zahtjev_id: number; autor_id: string | null;
    tip: string; sadrzaj: string; metadata: Record<string, unknown> | null; created_at: string;
    autor?: { ime: string; prezime: string } | null;
  }[];
}

// ─── Testne intervencije ──────────────────────────────────────────────────────

export const MOCK_INTERVENCIJE: MockIntervencija[] = [
  {
    id:                       9001,
    user_id:                  'mock-user-001',
    status:                   'u_radu',
    category:                 'vodoinstalacije/curenje',
    category_main:            'vodoinstalacije',
    category_sub:             'curenje',
    description:              'Korisnik prijavljuje curenje vode ispod kuhinjskog sudopera. Potrebna provjera spojeva i eventualna zamjena sifona.',
    address:                  'Grbavička 12, Sarajevo 71000',
    latitude:                 43.8558,
    longitude:                18.4244,
    contact_phone:            '+387 61 123 456',
    is_premium:               true,
    urgency_score:            85,
    final_priority:           'HITNO',
    dispecer_napomene:        'Stan je na 3. spratu, stanari su kod kuće. Donijeti novi sifon i Teflon traku.',
    termin_planirani_pocetak: new Date('2026-05-16T09:00:00').toISOString(),
    termin_planirani_kraj:    new Date('2026-05-16T10:30:00').toISOString(),
    procijenjeno_trajanje:    90,
    serviser_dodijeljen_id:   'mock-serviser-001',
    created_at:               new Date('2026-05-16T07:30:00').toISOString(),
    updated_at:               new Date('2026-05-16T08:45:00').toISOString(),
    podnosilac: { ime: 'Amra', prezime: 'Kovačević', broj_telefona: '+387 61 123 456' },
    serviser:   { id: 'mock-serviser-001', ime: 'Amar', prezime: 'Hadžić', broj_telefona: '+387 62 900 111' },
    aktivnosti: [
      {
        id: 1, zahtjev_id: 9001, autor_id: 'mock-disp-001',
        tip: 'dodjela', sadrzaj: 'Dispečer dodijelio intervenciju serviseru Amar Hadžić.',
        metadata: { serviser_id: 'mock-serviser-001', iz: 'potvrdeno', u: 'dodijeljeno' },
        created_at: new Date('2026-05-16T08:30:00').toISOString(),
        autor: { ime: 'Admin', prezime: 'Dispečer' },
      },
      {
        id: 2, zahtjev_id: 9001, autor_id: 'mock-serviser-001',
        tip: 'status_promjena', sadrzaj: 'Serviser prihvatio intervenciju i krenuo na lokaciju.',
        metadata: { iz: 'dodijeljeno', u: 'u_radu' },
        created_at: new Date('2026-05-16T08:45:00').toISOString(),
        autor: { ime: 'Amar', prezime: 'Hadžić' },
      },
    ],
  },

  {
    id:                       9002,
    user_id:                  'mock-user-002',
    status:                   'u_izvrsenju',
    category:                 'grijanje/klima',
    category_main:            'grijanje_i_klima',
    category_sub:             'klima_uredaj',
    description:              'Klima radi ali ne postiže zadatu temperaturu. Potrebna provjera filtera, plina i vanjske jedinice.',
    address:                  'Aleja Lipa 5, Otoka, Sarajevo',
    latitude:                 43.8489,
    longitude:                18.3892,
    contact_phone:            '+387 62 789 012',
    is_premium:               false,
    urgency_score:            45,
    final_priority:           'SREDNJE',
    dispecer_napomene:        'Korisnik radi od kuće, može primiti servisera u bilo koje doba.',
    termin_planirani_pocetak: new Date('2026-05-16T13:00:00').toISOString(),
    termin_planirani_kraj:    new Date('2026-05-16T14:30:00').toISOString(),
    procijenjeno_trajanje:    90,
    serviser_dodijeljen_id:   'mock-serviser-002',
    rad_evidentiran_at:       new Date('2026-05-16T13:30:00').toISOString(),
    created_at:               new Date('2026-05-16T10:00:00').toISOString(),
    updated_at:               new Date('2026-05-16T13:05:00').toISOString(),
    podnosilac: { ime: 'Tarik', prezime: 'Muslić', broj_telefona: '+387 62 789 012' },
    serviser:   { id: 'mock-serviser-002', ime: 'Emir', prezime: 'Delić', broj_telefona: '+387 62 900 222' },
    evidencije: [
      {
        id: 1, zahtjev_id: 9002, serviser_id: 'mock-serviser-002',
        opis_rada: 'Očišćeni filteri unutarnje jedinice. Provjera pritiska rashladnog plina — u granicama normale. Vanjska jedinica funkcionalna.',
        trajanje_minuta: 30, materijal: 'Sredstvo za čišćenje filtera', napomene: 'Preporučujem servis klime jednom godišnje.',
        created_at: new Date('2026-05-16T13:30:00').toISOString(),
      },
    ],
    aktivnosti: [
      {
        id: 3, zahtjev_id: 9002, autor_id: 'mock-disp-001',
        tip: 'dodjela', sadrzaj: 'Dispečer dodijelio intervenciju serviseru Emir Delić.',
        metadata: { serviser_id: 'mock-serviser-002', iz: 'potvrdeno', u: 'dodijeljeno' },
        created_at: new Date('2026-05-16T11:00:00').toISOString(),
        autor: { ime: 'Admin', prezime: 'Dispečer' },
      },
      {
        id: 4, zahtjev_id: 9002, autor_id: 'mock-serviser-002',
        tip: 'status_promjena', sadrzaj: 'Serviser stigao na lokaciju. Radovi u toku.',
        metadata: { iz: 'u_radu', u: 'u_izvrsenju' },
        created_at: new Date('2026-05-16T13:05:00').toISOString(),
        autor: { ime: 'Emir', prezime: 'Delić' },
      },
      {
        id: 5, zahtjev_id: 9002, autor_id: 'mock-serviser-002',
        tip: 'evidencija', sadrzaj: 'Evidentirani radovi: Čišćenje filtera, provjera plina. (30 min)',
        metadata: { evidencija_id: 1 },
        created_at: new Date('2026-05-16T13:30:00').toISOString(),
        autor: { ime: 'Emir', prezime: 'Delić' },
      },
    ],
  },

  {
    id:                       9003,
    user_id:                  'mock-user-003',
    status:                   'zavrseno',
    category:                 'bravarija/zamjena_brave',
    category_main:            'bravarija',
    category_sub:             'zamjena_brave',
    description:              'Korisnik je tražio zamjenu cilindra brave zbog otežanog zaključavanja. Stari cilindar istrošen.',
    address:                  'Pejton b.b., Ilidža, Sarajevo',
    latitude:                 43.8296,
    longitude:                18.3031,
    contact_phone:            '+387 63 456 789',
    is_premium:               false,
    urgency_score:            15,
    final_priority:           'NISKO',
    dispecer_napomene:        null,
    termin_planirani_pocetak: new Date('2026-05-15T17:00:00').toISOString(),
    termin_planirani_kraj:    new Date('2026-05-15T18:00:00').toISOString(),
    procijenjeno_trajanje:    60,
    serviser_dodijeljen_id:   'mock-serviser-003',
    rad_evidentiran_at:       new Date('2026-05-15T17:45:00').toISOString(),
    created_at:               new Date('2026-05-15T14:00:00').toISOString(),
    updated_at:               new Date('2026-05-15T18:10:00').toISOString(),
    podnosilac: { ime: 'Lejla', prezime: 'Selimović', broj_telefona: '+387 63 456 789' },
    serviser:   { id: 'mock-serviser-003', ime: 'Kenan', prezime: 'Softić', broj_telefona: '+387 62 900 333' },
    evidencije: [
      {
        id: 2, zahtjev_id: 9003, serviser_id: 'mock-serviser-003',
        opis_rada: 'Zamijenjen cilindar brave na ulaznim vratima. Korisnik potvrdio ispravnost. Predati 3 ključa.',
        trajanje_minuta: 45, materijal: 'Cilindar brave Mul-T-Lock 3 ključa', napomene: null,
        created_at: new Date('2026-05-15T17:45:00').toISOString(),
      },
    ],
    aktivnosti: [
      {
        id: 6, zahtjev_id: 9003, autor_id: 'mock-disp-001',
        tip: 'dodjela', sadrzaj: 'Dispečer dodijelio intervenciju serviseru Kenan Softić.',
        metadata: { serviser_id: 'mock-serviser-003', iz: 'potvrdeno', u: 'dodijeljeno' },
        created_at: new Date('2026-05-15T15:00:00').toISOString(),
        autor: { ime: 'Admin', prezime: 'Dispečer' },
      },
      {
        id: 7, zahtjev_id: 9003, autor_id: 'mock-serviser-003',
        tip: 'evidencija', sadrzaj: 'Zamijenjen cilindar brave. Korisnik potvrdio ispravnost. (45 min)',
        metadata: { evidencija_id: 2 },
        created_at: new Date('2026-05-15T17:45:00').toISOString(),
        autor: { ime: 'Kenan', prezime: 'Softić' },
      },
      {
        id: 8, zahtjev_id: 9003, autor_id: 'mock-disp-001',
        tip: 'status_promjena', sadrzaj: 'Dispečer zatvorio intervenciju.',
        metadata: { iz: 'u_izvrsenju', u: 'zavrseno' },
        created_at: new Date('2026-05-15T18:10:00').toISOString(),
        autor: { ime: 'Admin', prezime: 'Dispečer' },
      },
    ],
  },
];

/** Vraća mock intervenciju po ID-u, ili null. */
export function nadjiMockIntervenciju(id: number): MockIntervencija | null {
  return MOCK_INTERVENCIJE.find((m) => m.id === id) ?? null;
}
