'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { KorakKategorija }  from '@/components/wizard/KorakKategorija';
import { KorakLokacija }    from '@/components/wizard/KorakLokacija';
import { KorakTermin }      from '@/components/wizard/KorakTermin';
import { KorakOpis }        from '@/components/wizard/KorakOpis';
import { KorakTrijaza, type TriageFormState, INITIAL_TRIAGE } from '@/components/wizard/KorakTrijaza';
import { wizardKorak2Schema, wizardKorak3Schema } from '@/lib/validations/servisirane';
import type { TriageOdgovori, TerminSlot } from '@/domain/types/servisirane';

// ─── Konstante ────────────────────────────────────────────────────────────────

const PHONE_REGEX = /^[0-9+\-\/ ]*$/;

// ─── Wizard state ─────────────────────────────────────────────────────────────

interface WizardState {
  // Step 1 — Kategorija
  category:         string;
  customCategory:   string;
  // Step 2 — Lokacija
  address:          string;
  // Step 3 — Termin (V5.0: range-based)
  termini:          TerminSlot[];
  istaVrijemaSvima: boolean;
  // Step 4 — Opis
  description:      string;
  contactPhone:     string;
  photoFile:        File | null;
  // Step 5 — Trijaža
  triage:           TriageFormState;
}

const INITIAL: WizardState = {
  category:         '',
  customCategory:   '',
  address:          '',
  termini:          [],
  istaVrijemaSvima: true,
  description:      '',
  contactPhone:     '',
  photoFile:        null,
  triage:           INITIAL_TRIAGE,
};

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
    if (!s.category) return 'Odaberite kategoriju kvara.';
    if (s.category === 'Ostalo' && s.customCategory.trim().length < 3)
      return 'Opišite vrstu kvara (min. 3 karaktera).';
    return null;
  }
  if (k === 2) {
    if (s.address.trim().length < 5) return 'Unesite ispravnu adresu (min. 5 karaktera).';
    if (s.address.trim().length > 500) return 'Adresa ne smije biti duža od 500 karaktera.';
    return null;
  }
  if (k === 3) {
    if (s.termini.length === 0) return 'Odaberite najmanje jedan datum.';
    for (const t of s.termini) {
      if (!t.from || !t.to) return 'Unesite vrijeme za sve odabrane datume.';
      if (t.from >= t.to) return '"Vrijeme do" mora biti nakon "Vrijeme od".';
    }
    return null;
  }
  if (k === 4) {
    const r = wizardKorak2Schema.safeParse({
      description:  s.description,
      contactPhone: s.contactPhone,
    });
    if (!r.success) return r.error.errors[0].message;
    if (!PHONE_REGEX.test(s.contactPhone))
      return 'Dozvoljeni su samo brojevi i znakovi +, -, /.';
    return null;
  }
  if (k === 5) {
    const r = wizardKorak3Schema.safeParse(s.triage);
    return r.success ? null : r.error.errors[0].message;
  }
  return null;
}

/** Real-time blokiranje "Dalje" dugmeta bez klika */
function jeKorakBlokiran(k: number, s: WizardState): boolean {
  if (k === 3) {
    // Blokira ako je bilo koji termin nevalidan (to <= from)
    return s.termini.some((t) => t.from && t.to && t.from >= t.to);
  }
  if (k === 4) {
    return s.contactPhone.length > 0 && !PHONE_REGEX.test(s.contactPhone);
  }
  return false;
}

function porukaBlokiranja(k: number): string {
  if (k === 3) return '"Dalje" je onemogućen — "Vrijeme do" mora biti veće od "Vrijeme od".';
  return '"Dalje" je onemogućen — telefon sadrži nevaljane znakove.';
}

// ─── Glavni wizard ────────────────────────────────────────────────────────────

export function ServiceRequestWizard() {
  const [korak,       setKorak]      = useState(1);
  const [state,       setState]      = useState<WizardState>(INITIAL);
  const [greska,      setGreska]     = useState<string | null>(null);
  const [triageError, setTriageError] = useState<string | null>(null);
  const [jeSlanje,    setJeSlanje]   = useState(false);
  const [jeUspjelo,   setJeUspjelo]  = useState(false);

  // Prefill adrese i telefona iz profila
  useEffect(() => {
    fetch('/api/profil', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.profil) {
          setState((prev) => ({
            ...prev,
            address:      prev.address      || d.profil.adresa        || '',
            contactPhone: prev.contactPhone || d.profil.broj_telefona || '',
          }));
        }
      })
      .catch(() => {});
  }, []);

  function azuriraj(updates: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...updates }));
    setGreska(null);
    setTriageError(null);
  }

  function sljedeciKorak() {
    if (jeKorakBlokiran(korak, state)) return;
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

  async function posaljiZahtjev() {
    const err = validirajKorak(5, state);
    if (err) { setTriageError(err); return; }

    setJeSlanje(true);
    setGreska(null);
    setTriageError(null);

    try {
      const finalCategory =
        state.category === 'Ostalo' ? state.customCategory.trim() : state.category;

      const odgovor = await fetch('/api/service-requests', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category:      finalCategory,
          address:       state.address,
          description:   state.description,
          contact_phone: state.contactPhone,
          photo_url:     null,
          preferred_schedule: {
            termini: state.termini,
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

      {/* Greška — za korake 1-4 (korak 5 ima vlastitu) */}
      {korak !== 5 && greska && <AlertMessage variant="error" message={greska} />}

      {/* Upozorenje za blokirane korake */}
      {blokiran && (
        <AlertMessage variant="warning" message={porukaBlokiranja(korak)} />
      )}

      {/* ── Koraci ────────────────────────────────────────────────────────── */}
      {korak === 1 && (
        <KorakKategorija
          category={state.category}
          customCategory={state.customCategory}
          onUpdate={azuriraj}
          error={greska ?? undefined}
        />
      )}
      {korak === 2 && (
        <KorakLokacija
          address={state.address}
          onUpdate={azuriraj}
          error={greska ?? undefined}
        />
      )}
      {korak === 3 && (
        <KorakTermin
          termini={state.termini}
          istaVrijemaSvima={state.istaVrijemaSvima}
          onUpdate={azuriraj}
          errors={{ termini: greska ?? undefined }}
        />
      )}
      {korak === 4 && (
        <KorakOpis
          description={state.description}
          contactPhone={state.contactPhone}
          photoFile={state.photoFile}
          onUpdate={azuriraj}
          errors={{
            description: greska && state.description.trim().length < 10 ? greska : undefined,
          }}
        />
      )}
      {korak === 5 && (
        <KorakTrijaza
          triage={state.triage}
          onUpdate={(u) => azuriraj({ triage: { ...state.triage, ...u } })}
          triageError={triageError ?? greska}
        />
      )}

      {/* ── Navigacija ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {korak > 1 ? (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={prethodniKorak}
            disabled={jeSlanje}
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
            disabled={blokiran}
            title={blokiran ? porukaBlokiranja(korak) : undefined}
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
          >
            Pošalji zahtjev
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
