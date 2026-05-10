// ─── Statusi zahtjeva — životni ciklus ───────────────────────────────────────

export type StatusZahtjeva =
  | 'pending_review' // 🟡 Novi — prije dispečerskog čarobnjaka (Sprint 7)
  | 'na_cekanju'    // 🟡 Novi — korisnik može uređivati do ulaska u čarobnjak
  | 'in_review'     // 🟡 U čarobnjaku — dispečer u koracima Pregled … Potvrda; korisnik ne smije mijenjati
  | 'potvrdeno'     // 🟢 Potvrđeno u čarobnjaku — prioritet i termin; sljedeće dodjela / teren
  | 'dodijeljeno'   // backward compat
  | 'u_radu'        // backward compat
  | 'u_izvrsenju'   // 🟢 Zelena — serviser krenuo na teren
  | 'zavrseno'      // ⚫ Završeno
  | 'otkazano'      // ⚫ Korisnik otkazao
  | 'odbijeno';     // 🔴 Crvena — dispečer odbio (rejection_reason obavezan)

export type NivoHitnosti    = 'NISKO' | 'SREDNJE' | 'VISOKO' | 'KRITIČNO';
export type StatusAplikacije = 'na_cekanju' | 'odobreno' | 'odbijeno';
export type TipUsluge        = 'serviser' | 'dispecer';
export type StepenObrazovanja = 'SSS' | 'VŠS' | 'VSS' | 'Certifikovani majstor';

export type VremenslotTip =
  | 'jutro'       // 08:00 – 12:00  🟠 Narandžasta
  | 'dan'         // 12:00 – 16:00  🟡 Žuta
  | 'vece'        // 16:00 – 20:00  🔵 Plava
  | 'cijeli_dan'  // Po dogovoru    🟢 Zelena
  | 'custom';     // Prilagođeno    🟣 Ljubičasta

// ─── Triage ───────────────────────────────────────────────────────────────────

export interface TriageOdgovori {
  opasnost:       boolean;
  funkcionalnost: 'potpuni_prekid' | 'otezana' | 'manja_smetnja';
  steta:          boolean;
  ranjivost:      boolean;
  obuhvat:        boolean;
}

// ─── Termin slot — V5.0 range-based scheduling ───────────────────────────────

export interface TerminSlot {
  date: string;  // 'YYYY-MM-DD'
  from: string;  // 'HH:mm'
  to:   string;  // 'HH:mm'
}

// ─── Preferred schedule (JSONB) ──────────────────────────────────────────────

export interface PreferredSchedule {
  termini: TerminSlot[];
  /** Korisnik nema preferenciju — dispečer dogovara termin. */
  no_preferred_time?: boolean;
  /** Oznaka brzog izbora (npr. Jutro, Cijeli dan) ili prilagođeno. */
  preferred_time_label?: string | null;
}

// ─── Servisni zahtjev ─────────────────────────────────────────────────────────

export interface ServisniZahtjev {
  id:                   number;
  /** Redni broj zahtjeva tog korisnika (1 = najstariji); računa se na API-ju, nije kolona u DB. */
  korisnicki_broj_zahtjeva?: number | null;
  user_id:              string;
  category:             string;
  category_main:        string | null;
  category_sub:         string | null;
  address:              string;
  /** Sačuvano uz zahtjev ako je korisnik koristio GPS ili mapu (opcionalno). */
  latitude:             number | null;
  longitude:            number | null;
  description:          string;
  contact_phone:        string;
  photo_url:            string | null;
  /** Dodatne slike uz zahtjev (opcionalno; API/DB mogu još ne vraćati). */
  attachment_image_urls?: string[] | null;
  /** Alternativna polja ako backend koristi drugačije nazive (npr. JSON kolona). */
  images?: string[] | null;
  photos?: string[] | null;
  attachment_urls?: string[] | null;
  is_premium:           boolean;
  premium_terms_accepted: boolean;
  premium_requested_at: string | null;
  premium_priority_override_reason: string | null;
  status:               StatusZahtjeva;
  urgency_score:        number;
  system_score:         number;
  final_priority:       string | null;
  rejection_reason:     string | null;
  triage_json:          TriageOdgovori | null;
  preferred_schedule:   PreferredSchedule | null;
  cancel_reason:        string | null;
  /** Postavljeno pri otkazivanju od strane korisnika. */
  cancelled_at:         string | null;
  /** `true` kad je serviser potvrdio dogovoreni termin — u pregledu zahtjeva prelazi iz „Novi“ u „U obradi“. */
  is_verified_assigned: boolean;
  /**
   * Dogovoreni termin u čarobnjaku (dispečer); NULL dok termin nije potvrđen u koraku „Termin i serviser“.
   * Isti oblik kao `preferred_schedule` gdje je primjereno.
   */
  dispecer_agreed_schedule?: PreferredSchedule | null;
  /** Serviser dodijeljen u čarobnjaku (`osoba.id_osobe`); NULL dok nije odabran. */
  serviser_dodijeljen_id?: string | null;
  created_at:           string;
  updated_at:           string;
}

// ─── Partner aplikacija ───────────────────────────────────────────────────────

export interface PartnerAplikacija {
  id:              number;
  first_name:      string;
  last_name:       string;
  email:           string;
  phone:           string;
  service_type:    TipUsluge;
  education_level: StepenObrazovanja | null;
  experience:      string;
  document_url:    string | null;
  specialnosti:    string[];
  status:          StatusAplikacije;
  created_at:      string;
}

// ─── Profil korisnika ─────────────────────────────────────────────────────────

export interface ProfilKorisnika {
  id:           string;
  ime:          string;
  prezime:      string;
  email:        string | null;
  broj_telefona: string | null;
  adresa:       string | null;
  uloge:        string[];
  is_verified:  boolean;
  is_premium:   boolean;
  premium_status?: 'inactive' | 'pending_payment' | 'active' | 'expired' | 'cancelled';
  premium_started_at?: string | null;
  premium_expires_at?: string | null;
  premium_plan?: string | null;
  premium_cancelled_at?: string | null;
  premium_cancel_reason?: string | null;
}
