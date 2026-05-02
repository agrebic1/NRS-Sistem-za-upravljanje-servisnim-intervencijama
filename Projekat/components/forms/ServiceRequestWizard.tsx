'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { KorakKategorija, WIZARD_KATEGORIJA_OSTALO } from '@/components/wizard/KorakKategorija';
import { KorakLokacija }    from '@/components/wizard/KorakLokacija';
import { KorakTermin }      from '@/components/wizard/KorakTermin';
import { KorakOpis }        from '@/components/wizard/KorakOpis';
import { KorakTrijaza, type TriageFormState, INITIAL_TRIAGE } from '@/components/wizard/KorakTrijaza';
import { wizardKorak2Schema, wizardKorak3Schema } from '@/lib/validations/servisirane';
import type { TriageOdgovori } from '@/domain/types/servisirane';
import { kreirajKlijenta } from '@/lib/supabase/klijent';

// ─── Konstante ────────────────────────────────────────────────────────────────

const PHONE_REGEX = /^[+]?[0-9\s\-()]{8,20}$/;
const SERVICE_REQUEST_PHOTOS_BUCKET = 'service-request-photos';

// ─── Wizard state ─────────────────────────────────────────────────────────────

interface WizardState {
  // Step 1 — Kategorija
  selectedCategory:    string | null;
  selectedSubcategory: string | null;
  isOtherModalOpen:    boolean;
  // Step 2 — Lokacija
  address:                  string;
  latitude:                 number | null;
  longitude:                number | null;
  isLocating:               boolean;
  locationError:            string | null;
  hasSelectedMapLocation:   boolean;
  isMapVisible:             boolean;
  locationSuccessMessage:   string | null;
  // Step 3 — Preferirani termin (Sprint 7)
  preferredDate: string | null;
  preferredTimeFrom: string;
  preferredTimeTo: string;
  noPreferredTime: boolean;
  preferredTimeLabel: string | null;
  timeValidationError: string | null;
  // Step 4 — Opis
  description:      string;
  contactPhone:     string;
  accountPhone:     string;
  useAccountPhone:  boolean;
  photoFile:        File | null;
  // Step 5 — Trijaža
  triage:           TriageFormState;
}

const INITIAL: WizardState = {
  selectedCategory:    null,
  selectedSubcategory: null,
  isOtherModalOpen:    false,
  address:                  '',
  latitude:                 null,
  longitude:                null,
  isLocating:               false,
  locationError:            null,
  hasSelectedMapLocation:   false,
  isMapVisible:             false,
  locationSuccessMessage:   null,
  preferredDate:         null,
  preferredTimeFrom:     '',
  preferredTimeTo:       '',
  noPreferredTime:       false,
  preferredTimeLabel:    null,
  timeValidationError:   null,
  description:         '',
  contactPhone:        '',
  accountPhone:        '',
  useAccountPhone:     false,
  photoFile:           null,
  triage:              INITIAL_TRIAGE,
};

/** Validnost prvog koraka: glavna kategorija ili Ostalo + podkategorija. */
export function isStepOneValid(s: WizardState): boolean {
  const c = s.selectedCategory;
  if (c == null || c === '') return false;
  if (c === WIZARD_KATEGORIJA_OSTALO) {
    return !!(s.selectedSubcategory && s.selectedSubcategory.trim().length > 0);
  }
  return true;
}

/** Korak 2: adresa je obavezna (≥5 znakova). Mapa/GPS su dodatno preciziranje. */
export function isStepTwoValid(s: WizardState): boolean {
  return s.address.trim().length >= 5;
}

export function danasIsoLokalno(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Polja koraka „Preferirani termin” (dijeli wizard i forma izmjene). */
export type StanjePreferiranogTermina = Pick<
  WizardState,
  'preferredDate' | 'preferredTimeFrom' | 'preferredTimeTo' | 'noPreferredTime'
>;

/**
 * Korak 3: „Dalje” ako nema preferencije, ili ako postoji budući datum i ispravan raspon vremena.
 */
export function isPreferiraniTerminKorakValid(s: StanjePreferiranogTermina): boolean {
  if (s.noPreferredTime) return true;
  if (!s.preferredDate) return false;
  if (s.preferredDate < danasIsoLokalno()) return false;
  if (!s.preferredTimeFrom || !s.preferredTimeTo) return false;
  return s.preferredTimeFrom < s.preferredTimeTo;
}

export function isStepThreeValid(s: WizardState): boolean {
  return isPreferiraniTerminKorakValid(s);
}

export function isStepFourValid(s: Pick<WizardState, 'description' | 'contactPhone'>): boolean {
  return s.description.trim().length >= 20 && PHONE_REGEX.test(s.contactPhone.trim());
}

export function izracunajGreskuPreferiranogVremena(
  s: StanjePreferiranogTermina
): string | null {
  if (s.noPreferredTime) return null;
  if (!s.preferredTimeFrom || !s.preferredTimeTo) return null;
  if (s.preferredTimeFrom >= s.preferredTimeTo) {
    return '"Vrijeme do" mora biti nakon "Vrijeme od".';
  }
  return null;
}

export function porukaValidacijePreferiranogTermina(s: StanjePreferiranogTermina): string | null {
  if (s.noPreferredTime) return null;
  if (!s.preferredDate) {
    return 'Odaberite datum ili označite da nemate preferirani termin.';
  }
  if (s.preferredDate < danasIsoLokalno()) return 'Datum ne smije biti u prošlosti.';
  if (!s.preferredTimeFrom || !s.preferredTimeTo) {
    return 'Odaberite vremenski raspon (od — do).';
  }
  if (s.preferredTimeFrom >= s.preferredTimeTo) {
    return '"Vrijeme do" mora biti nakon "Vrijeme od".';
  }
  return null;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEP_OZNAKE = ['Vrsta kvara', 'Lokacija', 'Termin', 'Opis', 'Hitnost'];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-1">
      {STEP_OZNAKE.map((oznaka, i) => {
        const step     = i + 1;
        const isActive = step === currentStep;
        const isDone   = step < currentStep;
        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold
                  transition-all duration-300"
                style={{
                  backgroundColor: isDone
                    ? 'var(--first-secondary)'
                    : isActive
                    ? 'var(--first-primary)'
                    : 'rgb(var(--first-quinary-rgb) / 0.4)',
                  color: isDone || isActive ? 'white' : 'var(--first-nonary)',
                }}
              >
                {isDone ? '✓' : step}
              </div>
              <span
                className="hidden text-xs font-medium sm:block"
                style={{ color: isActive ? 'var(--first-primary)' : 'var(--first-nonary)' }}
              >
                {oznaka}
              </span>
            </div>
            {step < STEP_OZNAKE.length && (
              <div
                className="mb-4 h-0.5 w-4 sm:w-8"
                style={{
                  backgroundColor: isDone
                    ? 'var(--first-secondary)'
                    : 'rgb(var(--first-quinary-rgb) / 0.4)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Validacija po koraku ─────────────────────────────────────────────────────

function validirajKorak(k: number, s: WizardState): string | null {
  if (k === 1) {
    if (!s.selectedCategory) return 'Odaberite vrstu kvara prije nastavka.';
    if (s.selectedCategory === WIZARD_KATEGORIJA_OSTALO && !s.selectedSubcategory?.trim()) {
      return "Odaberite podkategoriju za opciju 'Ostalo'.";
    }
    return null;
  }
  if (k === 2) {
    if (isStepTwoValid(s)) {
      if (s.address.trim().length > 500) return 'Adresa ne smije biti duža od 500 karaktera.';
      return null;
    }
    if (s.address.trim().length > 0 && s.address.trim().length < 5) {
      return 'Adresa mora sadržavati dovoljno informacija za pronalazak lokacije.';
    }
    return 'Unesite adresu kvara prije nastavka.';
  }
  if (k === 3) {
    return porukaValidacijePreferiranogTermina(s);
  }
  if (k === 4) {
    if (s.description.trim().length === 0) return 'Unesite opis kvara prije nastavka.';
    if (s.description.trim().length < 20) {
      return 'Opis mora sadržavati dovoljno informacija za obradu zahtjeva.';
    }
    const r = wizardKorak2Schema.safeParse({
      description:  s.description,
      contactPhone: s.contactPhone.trim(),
    });
    if (!r.success) return r.error.errors[0].message;
    if (!s.contactPhone.trim()) return 'Unesite kontakt telefon.';
    if (!PHONE_REGEX.test(s.contactPhone.trim())) return 'Unesite ispravan kontakt telefon.';
    return null;
  }
  if (k === 5) {
    const r = wizardKorak3Schema.safeParse(s.triage);
    return r.success ? null : r.error.errors[0].message;
  }
  return null;
}

/** Blokira „Dalje” dok korak nije ispunjen (uključujući korak 1 — kategorija). */
function jeKorakBlokiran(k: number, s: WizardState): boolean {
  if (k === 1) return !isStepOneValid(s);
  if (k === 2) return !isStepTwoValid(s);
  if (k === 3) {
    return !isStepThreeValid(s);
  }
  if (k === 4) {
    return !isStepFourValid(s);
  }
  return false;
}

function porukaBlokiranja(k: number): string {
  if (k === 1) return 'Odaberite vrstu kvara prije nastavka.';
  if (k === 2) return 'Unesite adresu kvara prije nastavka.';
  if (k === 3) {
    return '"Dalje" je onemogućen — odaberite preferirani termin (datum i raspon) ili opciju bez preferencije.';
  }
  return '"Dalje" je onemogućen — unesite opis (min. 20) i ispravan kontakt telefon.';
}

function naslovDaljeDugmeta(k: number, s: WizardState): string | undefined {
  if (!jeKorakBlokiran(k, s)) return undefined;
  if (k === 1) {
    if (s.selectedCategory === WIZARD_KATEGORIJA_OSTALO && !s.selectedSubcategory?.trim()) {
      return "Odaberite podkategoriju za opciju 'Ostalo'.";
    }
    return 'Odaberite vrstu kvara prije nastavka.';
  }
  if (k === 2) {
    if (s.address.trim().length > 0 && s.address.trim().length < 5) {
      return 'Adresa mora sadržavati dovoljno informacija za pronalazak lokacije.';
    }
    return 'Unesite adresu kvara prije nastavka.';
  }
  return porukaBlokiranja(k);
}

function kategorijaZaApi(s: WizardState): string {
  if (s.selectedCategory === WIZARD_KATEGORIJA_OSTALO && s.selectedSubcategory?.trim()) {
    return `Ostalo — ${s.selectedSubcategory.trim()}`;
  }
  return s.selectedCategory?.trim() ?? '';
}

// ─── Glavni wizard ────────────────────────────────────────────────────────────

export function ServiceRequestWizard() {
  const [korak,       setKorak]      = useState(1);
  const [state,       setState]      = useState<WizardState>(INITIAL);
  const [greska,      setGreska]     = useState<string | null>(null);
  const [triageError, setTriageError] = useState<string | null>(null);
  const [jeSlanje,    setJeSlanje]   = useState(false);
  const [jeUspjelo,   setJeUspjelo]  = useState(false);

  useEffect(() => {
    fetch('/api/profil', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.profil) {
          setState((prev) => ({
            ...prev,
            address:      prev.address      || d.profil.adresa        || '',
            contactPhone: prev.contactPhone || d.profil.broj_telefona || '',
            accountPhone: d.profil.broj_telefona || '',
          }));
        }
      })
      .catch(() => {});
  }, []);

  function azuriraj(updates: Partial<WizardState>) {
    setState((prev) => {
      const next = { ...prev, ...updates };
      if ('locationError' in updates) {
        next.locationError = updates.locationError ?? null;
        if (updates.locationError) next.locationSuccessMessage = null;
      } else if (
        'address' in updates &&
        !('locationSuccessMessage' in updates)
      ) {
        next.locationError = null;
        next.locationSuccessMessage = null;
        next.isLocating = false;
      } else if (
        'latitude' in updates ||
        'longitude' in updates ||
        'isLocating' in updates ||
        'hasSelectedMapLocation' in updates
      ) {
        next.locationError = null;
      }
      const korak3Polja =
        'preferredDate' in updates ||
        'preferredTimeFrom' in updates ||
        'preferredTimeTo' in updates ||
        'noPreferredTime' in updates;
      if (korak3Polja) {
        next.timeValidationError = izracunajGreskuPreferiranogVremena(next);
      }
      return next;
    });
    setGreska(null);
    setTriageError(null);
  }

  function sljedeciKorak() {
    if (jeKorakBlokiran(korak, state)) {
      const err = validirajKorak(korak, state);
      if (err) setGreska(err);
      return;
    }
    const err = validirajKorak(korak, state);
    if (err) { setGreska(err); return; }
    setGreska(null);
    setKorak((k) => Math.min(k + 1, 5));
  }

  function prethodniKorak() {
    setGreska(null);
    setTriageError(null);
    setKorak((k) => Math.max(k - 1, 1));
  }

  async function uploadFotografijuKvara(file: File): Promise<string> {
    const supabase = kreirajKlijenta();
    const sigurnoIme = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${sigurnoIme}`;

    const { error } = await supabase.storage
      .from(SERVICE_REQUEST_PHOTOS_BUCKET)
      .upload(fileName, file, { upsert: false });

    if (error) {
      throw new Error(`Upload fotografije nije uspio: ${error.message}`);
    }

    const { data } = supabase.storage
      .from(SERVICE_REQUEST_PHOTOS_BUCKET)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function posaljiZahtjev() {
    const err = validirajKorak(5, state);
    if (err) { setTriageError(err); return; }

    setJeSlanje(true);
    setGreska(null);
    setTriageError(null);

    try {
      const photoUrl = state.photoFile ? await uploadFotografijuKvara(state.photoFile) : null;

      const odgovor = await fetch('/api/service-requests', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category:      kategorijaZaApi(state),
          address:       state.address.trim(),
          description:   state.description,
          contact_phone: state.contactPhone,
          photo_url:     photoUrl,
          latitude:      state.latitude,
          longitude:     state.longitude,
          preferred_schedule: state.noPreferredTime
            ? { termini: [], no_preferred_time: true }
            : {
                termini: [
                  {
                    date: state.preferredDate!,
                    from: state.preferredTimeFrom,
                    to:   state.preferredTimeTo,
                  },
                ],
                no_preferred_time: false,
                ...(state.preferredTimeLabel
                  ? { preferred_time_label: state.preferredTimeLabel }
                  : {}),
              },
          triage: state.triage as TriageOdgovori,
        }),
      });

      const podaci = await odgovor.json();
      if (!odgovor.ok) throw new Error(podaci.error ?? 'Greška pri slanju zahtjeva.');
      setJeUspjelo(true);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri slanju zahtjeva.');
    } finally {
      setJeSlanje(false);
    }
  }

  if (jeUspjelo) {
    return (
      <SuccessModal
        onZatvori={() => {
          setState(INITIAL);
          setKorak(1);
          setJeUspjelo(false);
        }}
      />
    );
  }

  const blokiran     = jeKorakBlokiran(korak, state);
  const jePosljednji = korak === 5;

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator currentStep={korak} />

      {korak !== 5 && korak !== 3 && greska && <AlertMessage variant="error" message={greska} />}

      {blokiran && korak !== 1 && korak !== 2 && korak !== 3 && korak !== 4 && (
        <AlertMessage variant="warning" message={porukaBlokiranja(korak)} />
      )}

      {korak === 1 && (
        <KorakKategorija
          selectedCategory={state.selectedCategory}
          selectedSubcategory={state.selectedSubcategory}
          isOtherModalOpen={state.isOtherModalOpen}
          onUpdate={azuriraj}
        />
      )}
      {korak === 2 && (
        <KorakLokacija
          address={state.address}
          latitude={state.latitude}
          longitude={state.longitude}
          isLocating={state.isLocating}
          locationError={state.locationError}
          locationSuccessMessage={state.locationSuccessMessage}
          isMapVisible={state.isMapVisible}
          onUpdate={azuriraj}
          error={greska ?? undefined}
        />
      )}
      {korak === 3 && (
        <KorakTermin
          preferredDate={state.preferredDate}
          preferredTimeFrom={state.preferredTimeFrom}
          preferredTimeTo={state.preferredTimeTo}
          noPreferredTime={state.noPreferredTime}
          preferredTimeLabel={state.preferredTimeLabel}
          validationError={state.timeValidationError ?? greska}
          onUpdate={azuriraj}
        />
      )}
      {korak === 4 && (
        <KorakOpis
          description={state.description}
          contactPhone={state.contactPhone}
          accountPhone={state.accountPhone}
          useAccountPhone={state.useAccountPhone}
          photoFile={state.photoFile}
          onUpdate={azuriraj}
          validationError={greska}
        />
      )}
      {korak === 5 && (
        <KorakTrijaza
          triage={state.triage}
          onUpdate={(u) => azuriraj({ triage: { ...state.triage, ...u } })}
          triageError={triageError ?? greska}
        />
      )}

      <div
        className="mt-2 flex min-h-[52px] items-center justify-between gap-4 border-t border-slate-200/60 pt-5"
      >
        {korak > 1 ? (
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={prethodniKorak}
            disabled={jeSlanje}
            className="min-h-[44px] rounded-[12px] border border-slate-300/80 bg-white px-5 font-semibold !text-[var(--first-octonary)]
              shadow-none hover:bg-slate-50 hover:!text-[var(--first-octonary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            Nazad
          </Button>
        ) : (
          <div />
        )}

        {!jePosljednji ? (
          <Button
            type="button"
            size="md"
            onClick={sljedeciKorak}
            disabled={blokiran && korak !== 4}
            title={naslovDaljeDugmeta(korak, state)}
            className="min-h-[44px] max-h-[48px] rounded-[12px] px-6"
          >
            Dalje
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            onClick={posaljiZahtjev}
            isLoading={jeSlanje}
            loadingText="Slanje zahtjeva..."
            className="rounded-[12px]"
          >
            Pošalji zahtjev
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
