'use client';

import { MapPin, ExternalLink, Navigation } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface MapPreviewProps {
  adresa: string;
  lat?:   number | null;
  lng?:   number | null;
}

// ─── URL za Google Maps ───────────────────────────────────────────────────────

function googleMapsUrl(adresa: string, lat?: number | null, lng?: number | null): string {
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresa)}`;
}

// ─── Dekorativni vizual lokacije ──────────────────────────────────────────────

function LokacijaVizual() {
  return (
    <div
      className="relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl sm:h-32"
      style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #2563eb 100%)',
      }}
    >
      {/* Dekorativni krugovi u pozadini */}
      <div
        className="absolute -left-6 -top-6 h-28 w-28 rounded-full opacity-20"
        style={{ backgroundColor: '#ffffff' }}
      />
      <div
        className="absolute -bottom-8 -right-4 h-36 w-36 rounded-full opacity-15"
        style={{ backgroundColor: '#ffffff' }}
      />
      <div
        className="absolute left-1/3 top-1/4 h-16 w-16 rounded-full opacity-10"
        style={{ backgroundColor: '#ffffff' }}
      />

      {/* Stilizovana mreža (imitacija karte) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        viewBox="0 0 200 120"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Horizontalne linije */}
        {[20, 40, 60, 80, 100].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="200" y2={y} stroke="white" strokeWidth="0.8" />
        ))}
        {/* Vertikalne linije */}
        {[30, 60, 90, 120, 150, 180].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="120" stroke="white" strokeWidth="0.8" />
        ))}
        {/* Imitacija ceste */}
        <path d="M 0 60 Q 60 45 100 60 T 200 55" stroke="white" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M 30 0 Q 50 40 45 120" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" />
      </svg>

      {/* Pin ikona u centru */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
        >
          <MapPin className="h-6 w-6" style={{ color: '#0d9488' }} />
        </div>
        {/* Sjena pina */}
        <div
          className="h-1 w-6 rounded-full opacity-40"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
      </div>
    </div>
  );
}

// ─── Glavna komponenta ────────────────────────────────────────────────────────

export function MapPreview({ adresa, lat, lng }: MapPreviewProps) {
  const imaKoordinate = lat != null && lng != null;
  const url = googleMapsUrl(adresa, lat, lng);

  function otvoriKartu() {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl shadow-sm"
      style={{
        backgroundColor: 'var(--first-tertiary)',
        border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
      }}
    >
      {/* Dekorativni vizual */}
      <div className="p-3 pb-0">
        <LokacijaVizual />
      </div>

      {/* Informacije o adresi */}
      <div className="flex flex-col gap-3 px-4 py-4">
        {/* Adresa */}
        <div className="flex items-start gap-2.5">
          <div
            className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: 'rgba(13,148,136,0.12)',
              border:          '1px solid rgba(13,148,136,0.25)',
            }}
          >
            <MapPin className="h-3.5 w-3.5" style={{ color: '#0d9488' }} />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: 'var(--first-nonary)' }}
            >
              Adresa intervencije
            </p>
            <p
              className="mt-0.5 break-words text-sm font-medium leading-snug"
              style={{ color: 'var(--first-octonary)' }}
            >
              {adresa.trim() || '—'}
            </p>
          </div>
        </div>

        {/* Koordinate (ako postoje) */}
        {imaKoordinate && (
          <div className="flex items-center gap-2">
            <Navigation className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
            <p
              className="text-xs font-mono tabular-nums"
              style={{ color: 'var(--first-nonary)' }}
            >
              {lat!.toFixed(5)}, {lng!.toFixed(5)}
            </p>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                backgroundColor: 'rgba(13,148,136,0.1)',
                color:           '#0d9488',
                border:          '1px solid rgba(13,148,136,0.25)',
              }}
            >
              GPS
            </span>
          </div>
        )}

        {/* Dugme */}
        <button
          type="button"
          onClick={otvoriKartu}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity duration-150 hover:opacity-85 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
            color:      '#ffffff',
          }}
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
          Otvori u Google Maps
        </button>
      </div>
    </div>
  );
}
