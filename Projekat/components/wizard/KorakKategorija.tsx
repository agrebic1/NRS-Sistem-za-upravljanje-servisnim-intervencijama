'use client';

import {
  Droplets, Zap, Wind, Key, Monitor, Plus, X,
  Layers, Paintbrush, Refrigerator, Scissors,
  Hammer, Sparkles, Trees, Armchair, HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

/** Vrijednost za `selectedCategory` kada je odabrano „Ostalo” (nakon podkategorije). */
export const WIZARD_KATEGORIJA_OSTALO = 'other' as const;

// ─── Primarne kategorije (5+1) ────────────────────────────────────────────────

const PRIMARNE = [
  { id: 'Vodoinstalaterski',  Ikona: Droplets,   boja: 'var(--first-secondary)' },
  { id: 'Električni kvar',    Ikona: Zap,        boja: 'var(--first-septenary)' },
  { id: 'Klimatizacija',      Ikona: Wind,       boja: 'var(--first-primary)' },
  { id: 'Bravarija',          Ikona: Key,        boja: 'var(--first-senary)' },
  { id: 'IT / Mreže',         Ikona: Monitor,    boja: 'var(--first-secondary)' },
] as const;

// ─── Subkategorije modala (3×3) ───────────────────────────────────────────────

const SUBKATEGORIJE = [
  { id: 'Keramika',       Ikona: Layers },
  { id: 'Moleraj',        Ikona: Paintbrush },
  { id: 'Bijela tehnika', Ikona: Refrigerator },
  { id: 'Staklorez',      Ikona: Scissors },
  { id: 'Gips',           Ikona: Hammer },
  { id: 'Čišćenje',       Ikona: Sparkles },
  { id: 'Eksterijer',     Ikona: Trees },
  { id: 'Namještaj',      Ikona: Armchair },
  { id: 'Drugo',          Ikona: HelpCircle },
] as const;

// ─── Modal za subkategorije ───────────────────────────────────────────────────

function SubkategorijeModal({
  onOdabir,
  onZatvori,
  onNazadNaKategorije,
}: {
  onOdabir:             (id: string) => void;
  onZatvori:            () => void;
  onNazadNaKategorije:  () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        backdropFilter:    'blur(2px)',
      }}
      onClick={onZatvori}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 shadow-card-lg"
        style={{
          backgroundColor: 'var(--first-tertiary)',
          border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.45)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-ostalo-naslov"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 pr-2">
            <h3
              id="modal-ostalo-naslov"
              className="font-bold leading-snug"
              style={{ color: 'var(--first-octonary)' }}
            >
              Odaberite podkategoriju za &apos;Ostalo&apos;
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--first-nonary)' }}>
              Ako kvar ne pripada glavnim kategorijama, odaberite najbližu podkategoriju.
            </p>
          </div>
          <button
            type="button"
            onClick={onZatvori}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-soft-beige/40"
            style={{ color: 'var(--first-nonary)' }}
            aria-label="Zatvori"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mb-4 w-full"
          onClick={onNazadNaKategorije}
        >
          Nazad na kategorije
        </Button>

        <div className="grid grid-cols-3 gap-3">
          {SUBKATEGORIJE.map(({ id, Ikona }) => (
            <button
              key={id}
              type="button"
              onClick={() => onOdabir(id)}
              className="flex flex-col items-center gap-2 rounded-2xl border p-3 text-center
                transition-all duration-150 hover:border-celestial-teal hover:bg-deep-teal/5
                focus:outline-none focus:ring-2 focus:ring-celestial-teal/40"
              style={{
                borderColor:     'rgb(var(--first-quaternary-rgb) / 0.35)',
                backgroundColor: 'rgb(255 255 255 / 0.45)',
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.4)' }}
              >
                <Ikona className="h-5 w-5" style={{ color: 'var(--first-primary)' }} />
              </div>
              <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--first-octonary)' }}>
                {id}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Korak 1: Kategorija ──────────────────────────────────────────────────────

export interface KorakKategorijaProps {
  selectedCategory:    string | null;
  selectedSubcategory: string | null;
  isOtherModalOpen:    boolean;
  onUpdate:            (p: {
    selectedCategory?:    string | null;
    selectedSubcategory?: string | null;
    isOtherModalOpen?:    boolean;
  }) => void;
}

export function KorakKategorija({
  selectedCategory,
  selectedSubcategory,
  isOtherModalOpen,
  onUpdate,
}: KorakKategorijaProps) {
  function odaberiGlavnu(id: string) {
    onUpdate({
      selectedCategory:    id,
      selectedSubcategory: null,
      isOtherModalOpen:    false,
    });
  }

  function otvoriOstaloModal() {
    onUpdate({ isOtherModalOpen: true });
  }

  function zatvoriModal() {
    onUpdate({ isOtherModalOpen: false });
  }

  function nazadNaKategorijeIzModala() {
    const nepotpunoOstalo =
      selectedCategory === WIZARD_KATEGORIJA_OSTALO && !selectedSubcategory?.trim();
    onUpdate(
      nepotpunoOstalo
        ? { isOtherModalOpen: false, selectedCategory: null, selectedSubcategory: null }
        : { isOtherModalOpen: false }
    );
  }

  function handleSubkategorijaOdabir(id: string) {
    onUpdate({
      selectedCategory:    WIZARD_KATEGORIJA_OSTALO,
      selectedSubcategory: id,
      isOtherModalOpen:    false,
    });
  }

  const jeOstaloKompletno =
    selectedCategory === WIZARD_KATEGORIJA_OSTALO && !!selectedSubcategory?.trim();

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="mb-1 text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
            Vrsta kvara
          </h2>
          <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
            Odaberite kategoriju kvara. Ako niste sigurni, odaberite &apos;Ostalo&apos;.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRIMARNE.map(({ id, Ikona, boja }) => {
            const odabrana = selectedCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => odaberiGlavnu(id)}
                className="flex flex-col items-center gap-2.5 rounded-2xl border p-5 text-center
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-celestial-teal/40"
                style={{
                  borderColor:     odabrana ? boja : 'rgb(var(--first-quaternary-rgb) / 0.4)',
                  backgroundColor: odabrana
                    ? `color-mix(in srgb, ${boja} 8%, rgb(255 255 255 / 0.5))`
                    : 'rgb(255 255 255 / 0.45)',
                  boxShadow: odabrana ? `0 0 0 2px ${boja}33` : 'none',
                }}
                aria-pressed={odabrana}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200"
                  style={{
                    backgroundColor: odabrana
                      ? `color-mix(in srgb, ${boja} 18%, transparent)`
                      : 'rgb(var(--first-quinary-rgb) / 0.4)',
                  }}
                >
                  <Ikona className="h-7 w-7" style={{ color: odabrana ? boja : 'var(--first-nonary)' }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                  {id}
                </span>
                {odabrana && (
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: boja }} />
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={otvoriOstaloModal}
            className="flex flex-col items-center gap-2.5 rounded-2xl border p-5 text-center
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-celestial-teal/40"
            style={{
              borderColor: jeOstaloKompletno
                ? 'var(--first-primary)'
                : 'rgb(var(--first-quaternary-rgb) / 0.4)',
              backgroundColor: jeOstaloKompletno
                ? 'rgb(var(--first-primary-rgb) / 0.06)'
                : 'rgb(255 255 255 / 0.45)',
              borderStyle: 'dashed',
              boxShadow: jeOstaloKompletno ? '0 0 0 2px rgb(var(--first-primary-rgb) / 0.2)' : 'none',
            }}
            aria-pressed={jeOstaloKompletno}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.4)' }}
            >
              <Plus className="h-7 w-7" style={{ color: 'var(--first-nonary)' }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
              Ostalo
            </span>
            <span className="text-xs" style={{ color: 'var(--first-nonary)' }}>
              {jeOstaloKompletno ? selectedSubcategory : '9 podkategorija'}
            </span>
          </button>
        </div>
      </div>

      {isOtherModalOpen && (
        <SubkategorijeModal
          onOdabir={handleSubkategorijaOdabir}
          onZatvori={zatvoriModal}
          onNazadNaKategorije={nazadNaKategorijeIzModala}
        />
      )}
    </>
  );
}
