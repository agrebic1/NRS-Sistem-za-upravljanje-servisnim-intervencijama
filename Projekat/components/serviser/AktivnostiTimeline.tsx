'use client';

import {
  ArrowRightLeft, MessageSquare, UserCheck, ClipboardCheck,
  UserX, Cog, Clock,
} from 'lucide-react';
import type { InterventionActivity, TipAktivnosti } from '@/domain/types/servisirane';

// ─── Config po tipu aktivnosti ───────────────────────────────────────────────

const TIP_CONFIG: Record<TipAktivnosti, {
  Ikona: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  boja:  string;
  rgb:   string;
}> = {
  status_promjena: { Ikona: ArrowRightLeft, boja: '#2563EB', rgb: '37,99,235' },
  napomena:        { Ikona: MessageSquare,  boja: '#617089', rgb: '97,112,137' },
  dodjela:         { Ikona: UserCheck,      boja: '#22C55E', rgb: '34,197,94' },
  evidencija:      { Ikona: ClipboardCheck, boja: '#D97706', rgb: '217,119,6' },
  odbijanje:       { Ikona: UserX,          boja: '#DC2626', rgb: '220,38,38' },
  sistem:          { Ikona: Cog,            boja: '#9CA3AF', rgb: '156,163,175' },
};

// ─── Format vremena ───────────────────────────────────────────────────────────

function formatirajVrijeme(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('bs-BA', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

// ─── Komponenta ───────────────────────────────────────────────────────────────

interface AktivnostiTimelineProps {
  aktivnosti: InterventionActivity[];
  ucitava?:   boolean;
}

export function AktivnostiTimeline({ aktivnosti, ucitava }: AktivnostiTimelineProps) {
  if (ucitava) {
    return (
      <div className="flex items-center gap-2 py-6">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'var(--first-primary)' }} />
        <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
          Učitavanje aktivnosti...
        </p>
      </div>
    );
  }

  if (aktivnosti.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <Clock className="h-8 w-8" style={{ color: 'var(--first-quinary)' }} />
        <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
          Nema zabilježenih aktivnosti.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {aktivnosti.map((a, idx) => {
        const cfg      = TIP_CONFIG[a.tip] ?? TIP_CONFIG.sistem;
        const Ikona    = cfg.Ikona;
        const jeLast   = idx === aktivnosti.length - 1;
        const autorIme = a.autor
          ? `${a.autor.ime} ${a.autor.prezime}`.trim()
          : 'Sistem';

        return (
          <div key={a.id} className="flex gap-3">
            {/* Ikona + linija */}
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `rgba(${cfg.rgb}, 0.12)`,
                  border:          `1.5px solid rgba(${cfg.rgb}, 0.3)`,
                }}
              >
                <Ikona className="h-4 w-4" style={{ color: cfg.boja }} />
              </div>
              {!jeLast && (
                <div
                  className="w-px flex-1 my-1"
                  style={{ backgroundColor: 'rgb(var(--first-quaternary-rgb) / 0.4)' }}
                />
              )}
            </div>

            {/* Sadržaj */}
            <div className={`min-w-0 flex-1 ${jeLast ? '' : 'pb-4'}`}>
              <div className="flex flex-wrap items-start gap-2">
                <p
                  className="text-sm font-medium leading-snug"
                  style={{ color: 'var(--first-octonary)' }}
                >
                  {a.sadrzaj}
                </p>
              </div>
              <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs" style={{ color: 'var(--first-nonary)' }}>
                <span>{autorIme}</span>
                <span>{formatirajVrijeme(a.created_at)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
