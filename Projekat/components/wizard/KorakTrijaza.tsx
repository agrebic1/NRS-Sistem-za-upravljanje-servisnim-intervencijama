'use client';

import { ShieldAlert, PauseCircle, AlertTriangle, Users, UsersRound, Check } from 'lucide-react';
import { AlertMessage } from '@/components/ui/AlertMessage';

// ─── Triage state ─────────────────────────────────────────────────────────────

export interface TriageFormState {
  opasnost:       boolean | null;
  funkcionalnost: 'potpuni_prekid' | 'otezana' | 'manja_smetnja' | null;
  steta:          boolean | null;
  ranjivost:      boolean | null;
  obuhvat:        boolean | null;
}

export const INITIAL_TRIAGE: TriageFormState = {
  opasnost:       null,
  funkcionalnost: null,
  steta:          null,
  ranjivost:      null,
  obuhvat:        null,
};

// ─── Pitanja ──────────────────────────────────────────────────────────────────
// Ikone ShieldAlert i AlertTriangle su amber — standardni UI znak upozorenja.
// Sve ostale ikone su neutralno sive. Boja interakcije je plava (var(--first-primary)).

const PITANJA = [
  {
    id:        'opasnost' as const,
    naslov:    'Sigurnost',
    pitanje:   'Da li postoji direktna opasnost po ljude ili imovinu?',
    Ikona:     ShieldAlert,
    ikonaStil: { color: '#F59E0B' } as React.CSSProperties,
    opcije:    [
      { v: 'true',  o: 'Da, postoji opasnost' },
      { v: 'false', o: 'Ne, nema opasnosti'   },
    ],
  },
  {
    id:        'funkcionalnost' as const,
    naslov:    'Zastoj',
    pitanje:   'Kakav je uticaj na svakodnevno funkcioniranje?',
    Ikona:     PauseCircle,
    ikonaStil: {} as React.CSSProperties,
    opcije:    [
      { v: 'potpuni_prekid', o: 'Potpuni prekid rada' },
      { v: 'otezana',        o: 'Otežan rad'          },
      { v: 'manja_smetnja',  o: 'Manja smetnja'       },
    ],
  },
  {
    id:        'steta' as const,
    naslov:    'Materijalna šteta',
    pitanje:   'Postoji li rizik od sekundarne štete (poplava, kvar hrane...)?',
    Ikona:     AlertTriangle,
    ikonaStil: { color: '#F59E0B' } as React.CSSProperties,
    opcije:    [
      { v: 'true',  o: 'Da, postoji rizik' },
      { v: 'false', o: 'Ne, nema rizika'   },
    ],
  },
  {
    id:        'ranjivost' as const,
    naslov:    'Ranjive grupe',
    pitanje:   'Da li su prisutna djeca, starije ili bolesne osobe?',
    Ikona:     Users,
    ikonaStil: {} as React.CSSProperties,
    opcije:    [
      { v: 'true',  o: 'Da' },
      { v: 'false', o: 'Ne' },
    ],
  },
  {
    id:        'obuhvat' as const,
    naslov:    'Obim kvara',
    pitanje:   'Da li kvar pogađa više stanara ili korisnika?',
    Ikona:     UsersRound,
    ikonaStil: {} as React.CSSProperties,
    opcije:    [
      { v: 'true',  o: 'Da, više korisnika' },
      { v: 'false', o: 'Ne, samo ja'        },
    ],
  },
] as const;

// ─── Opcija gumb — plava kad je odabrana ─────────────────────────────────────

function OpcijaBtn({
  oznaka,
  aktivan,
  onClick,
}: {
  oznaka:  string;
  aktivan: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktivan}
      className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium
        transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1"
      style={
        aktivan
          ? {
              borderColor:     'var(--first-primary)',
              backgroundColor: 'var(--first-primary)',
              color:           '#ffffff',
            }
          : {
              borderColor:     'rgb(var(--first-quaternary-rgb) / 0.45)',
              backgroundColor: 'rgb(255 255 255 / 0.8)',
              color:           'var(--first-octonary)',
            }
      }
    >
      {aktivan && <Check className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2.5} />}
      {oznaka}
    </button>
  );
}

// ─── Korak 5: Trijaža ─────────────────────────────────────────────────────────

interface KorakTrijazaProps {
  triage:      TriageFormState;
  onUpdate:    (updates: Partial<TriageFormState>) => void;
  triageError: string | null;
}

export function KorakTrijaza({ triage, onUpdate, triageError }: KorakTrijazaProps) {
  function getOdabrana(id: keyof TriageFormState): string | undefined {
    const v = triage[id];
    if (v === null || v === undefined) return undefined;
    if (typeof v === 'boolean') return String(v);
    return v;
  }

  const odgovoreno = Object.values(triage).filter((v) => v !== null).length;
  const ukupno     = PITANJA.length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="mb-1 text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
          Procjena hitnosti
        </h2>
        <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
          Odgovorite na sva pitanja — sistem automatski određuje prioritet zahtjeva.
        </p>
      </div>

      {/* Traka napretka */}
      <div className="flex items-center gap-3">
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full"
          style={{ backgroundColor: 'rgb(var(--first-quaternary-rgb) / 0.25)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width:           `${(odgovoreno / ukupno) * 100}%`,
              backgroundColor: odgovoreno === ukupno ? 'var(--first-secondary)' : 'var(--first-primary)',
            }}
          />
        </div>
        <span
          className="shrink-0 text-xs font-medium tabular-nums"
          style={{ color: 'var(--first-nonary)' }}
        >
          {odgovoreno}/{ukupno}
        </span>
      </div>

      {triageError && <AlertMessage variant="error" message={triageError} />}

      {/* Lista pitanja */}
      <div className="flex flex-col gap-3">
        {PITANJA.map(({ id, naslov, pitanje, Ikona, ikonaStil, opcije }, index) => {
          const odabrana     = getOdabrana(id);
          const jeOdgovoreno = odabrana !== undefined;

          return (
            <div
              key={id}
              className="overflow-hidden rounded-xl border transition-all duration-200"
              style={{
                borderColor:     jeOdgovoreno
                  ? 'rgb(var(--first-primary-rgb) / 0.35)'
                  : 'rgb(var(--first-quaternary-rgb) / 0.35)',
                backgroundColor: jeOdgovoreno
                  ? 'rgb(var(--first-primary-rgb) / 0.03)'
                  : 'rgb(255 255 255 / 0.65)',
              }}
            >
              {/* Zaglavlje */}
              <div
                className="flex items-center gap-3 border-b px-4 py-3"
                style={{
                  borderColor:     jeOdgovoreno
                    ? 'rgb(var(--first-primary-rgb) / 0.15)'
                    : 'rgb(var(--first-quaternary-rgb) / 0.2)',
                  backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.08)',
                }}
              >
                {/* Redni broj — plavi */}
                <div
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full
                    text-xs font-bold"
                  style={{ backgroundColor: 'var(--first-primary)', color: '#ffffff' }}
                >
                  {index + 1}
                </div>

                {/* Ikona */}
                <Ikona
                  className="h-4 w-4 flex-shrink-0"
                  style={
                    Object.keys(ikonaStil).length > 0
                      ? ikonaStil
                      : { color: 'var(--first-nonary)' }
                  }
                />

                {/* Tekst */}
                <div className="min-w-0 flex-1">
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--first-nonary)' }}
                  >
                    {naslov}
                  </span>
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: 'var(--first-octonary)' }}
                  >
                    {pitanje}
                  </p>
                </div>

                {/* Odgovoreno indikator */}
                {jeOdgovoreno && (
                  <div
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'var(--first-secondary)' }}
                  >
                    <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {/* Opcije */}
              <div className="flex flex-wrap gap-2 px-4 py-3.5">
                {opcije.map(({ v, o }) => (
                  <OpcijaBtn
                    key={v}
                    oznaka={o}
                    aktivan={odabrana === v}
                    onClick={() => {
                      if (id === 'funkcionalnost') {
                        onUpdate({ funkcionalnost: v as TriageFormState['funkcionalnost'] });
                      } else {
                        onUpdate({ [id]: v === 'true' } as Partial<TriageFormState>);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
