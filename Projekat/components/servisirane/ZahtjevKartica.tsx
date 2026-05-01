'use client';

import Link from 'next/link';
import {
  ChevronRight, Calendar, MapPin, Clock,
  CheckCircle2, Truck, XCircle, Pencil, Ban,
} from 'lucide-react';
import { UrgencyBadge } from './UrgencyBadge';
import type { ServisniZahtjev, StatusZahtjeva } from '@/domain/types/servisirane';

// ─── Životni ciklus statusa — Triple Coding ───────────────────────────────────

export const STATUS_LIFECYCLE: Record<
  StatusZahtjeva,
  {
    oznaka:   string;
    boja:     string;
    pozadina: string;
    border:   string;
    Ikona:    React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  }
> = {
  na_cekanju:  { oznaka: 'Na čekanju',  boja: '#D97706',                    pozadina: 'rgba(217,119,6,0.12)',          border: 'rgba(217,119,6,0.3)',          Ikona: Clock },
  potvrdeno:   { oznaka: 'Potvrđeno',   boja: '#2563EB',                    pozadina: 'rgba(37,99,235,0.1)',           border: 'rgba(37,99,235,0.25)',         Ikona: CheckCircle2 },
  dodijeljeno: { oznaka: 'Dodijeljeno', boja: '#2563EB',                    pozadina: 'rgba(37,99,235,0.1)',           border: 'rgba(37,99,235,0.25)',         Ikona: CheckCircle2 },
  u_radu:      { oznaka: 'U radu',      boja: '#059669',                    pozadina: 'rgba(5,150,105,0.1)',           border: 'rgba(5,150,105,0.25)',         Ikona: Truck },
  u_izvrsenju: { oznaka: 'U izvršenju', boja: '#059669',                    pozadina: 'rgba(5,150,105,0.1)',           border: 'rgba(5,150,105,0.25)',         Ikona: Truck },
  zavrseno:    { oznaka: 'Završeno',    boja: 'var(--first-secondary)',     pozadina: 'rgb(var(--first-secondary-rgb) / 0.1)', border: 'rgb(var(--first-secondary-rgb) / 0.25)', Ikona: CheckCircle2 },
  otkazano:    { oznaka: 'Otkazano',    boja: 'var(--first-nonary)',        pozadina: 'rgb(var(--first-quinary-rgb) / 0.25)', border: 'rgb(var(--first-quaternary-rgb) / 0.4)', Ikona: Ban },
  odbijeno:    { oznaka: 'Odbijeno',    boja: '#DC2626',                    pozadina: 'rgba(220,38,38,0.1)',           border: 'rgba(220,38,38,0.25)',         Ikona: XCircle },
};

// ─── Status badge ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: StatusZahtjeva }) {
  const cfg   = STATUS_LIFECYCLE[status];
  const Ikona = cfg.Ikona;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: cfg.pozadina, color: cfg.boja, border: `1px solid ${cfg.border}` }}
    >
      <Ikona className="h-3 w-3" />
      {cfg.oznaka}
    </span>
  );
}

// ─── Kartica zahtjeva ─────────────────────────────────────────────────────────

interface ZahtjevKarticaProps {
  zahtjev:   ServisniZahtjev;
  onUredi?:  (zahtjev: ServisniZahtjev) => void;
  onOtkazi?: (zahtjev: ServisniZahtjev) => void;
}

export function ZahtjevKartica({ zahtjev, onUredi, onOtkazi }: ZahtjevKarticaProps) {
  const datum = new Date(zahtjev.created_at).toLocaleDateString('bs-BA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  const jeNaCekanju = zahtjev.status === 'na_cekanju';
  const jeOtkazano  = zahtjev.status === 'otkazano';

  return (
    <li>
      <div
        className="flex items-center gap-3 px-5 py-4 transition-colors duration-150"
        style={{ opacity: jeOtkazano ? 0.6 : 1 }}
      >
        {/* Klikabilna zona → detalji */}
        <Link
          href={`/korisnik/zahtjevi/${zahtjev.id}`}
          className="min-w-0 flex-1 hover:opacity-80"
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium" style={{ color: 'var(--first-octonary)' }}>
              {zahtjev.category}
            </p>
            <StatusBadge status={zahtjev.status} />
            <UrgencyBadge score={zahtjev.urgency_score} />
          </div>
          <p className="mt-0.5 truncate text-sm" style={{ color: 'var(--first-nonary)' }}>
            {zahtjev.description.length > 80
              ? `${zahtjev.description.substring(0, 80)}...`
              : zahtjev.description}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-x-4 text-xs" style={{ color: 'var(--first-nonary)' }}>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {datum}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {zahtjev.address.length > 40
                ? `${zahtjev.address.substring(0, 40)}...`
                : zahtjev.address}
            </span>
          </div>
        </Link>

        {/* Akcije (samo za na_cekanju) */}
        {jeNaCekanju && (onUredi || onOtkazi) && (
          <div className="flex flex-shrink-0 items-center gap-1">
            {onUredi && (
              <button
                type="button"
                onClick={() => onUredi(zahtjev)}
                title="Izmijeni zahtjev"
                className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all
                  duration-150 hover:scale-105"
                style={{
                  borderColor:     'rgb(var(--first-primary-rgb) / 0.25)',
                  backgroundColor: 'rgb(var(--first-primary-rgb) / 0.06)',
                  color:           'var(--first-primary)',
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onOtkazi && (
              <button
                type="button"
                onClick={() => onOtkazi(zahtjev)}
                title="Otkaži zahtjev"
                className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all
                  duration-150 hover:scale-105"
                style={{
                  borderColor:     'rgba(220,38,38,0.25)',
                  backgroundColor: 'rgba(220,38,38,0.06)',
                  color:           '#DC2626',
                }}
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-quinary)' }} />
      </div>
    </li>
  );
}
