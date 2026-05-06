// ─── Statusi zahtjeva — životni ciklus ───────────────────────────────────────

export type StatusZahtjeva =
  | 'pending_review' // 🟡 Čeka obradu — preporučeni inicijalni status (Sprint 7)
  | 'na_cekanju'    // 🟡 Žuta  — inicijalni status, korisnik može editovati
  | 'potvrdeno'     // 🔵 Plava — dispečer potvrdio termin i prioritet
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
  is_verified_assigned: boolean;
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
