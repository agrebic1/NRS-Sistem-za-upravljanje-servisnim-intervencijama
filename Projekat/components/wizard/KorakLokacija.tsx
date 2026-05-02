'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Search, X, Plus, Minus } from 'lucide-react';

// ─── Tile map matematika ──────────────────────────────────────────────────────

const TILE_SIZE = 256;

function latLonToTileFloat(lat: number, lon: number, z: number) {
  const n      = Math.pow(2, z);
  const x      = ((lon + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const y      = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x, y };
}

function pixelToLatLon(
  px: number, py: number,
  midX: number, midY: number,
  centerTile: { x: number; y: number },
  z: number
) {
  const n   = Math.pow(2, z);
  const tx  = centerTile.x + (px - midX) / TILE_SIZE;
  const ty  = centerTile.y + (py - midY) / TILE_SIZE;
  const lon = (tx / n) * 360 - 180;
  const lat = (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n))) * 180) / Math.PI;
  return { lat, lon };
}

// ─── Geocoding Nominatim ──────────────────────────────────────────────────────

interface NominatimResult {
  display_name: string;
  lat:          string;
  lon:          string;
}

async function geocodeAdresa(adresa: string): Promise<NominatimResult[]> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(adresa)}&format=json&limit=5&countrycodes=ba,hr,rs,si`,
      { headers: { Accept: 'application/json' } }
    );
    return r.ok ? await r.json() : [];
  } catch { return []; }
}

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { Accept: 'application/json' } }
    );
    if (!r.ok) return null;
    const d = await r.json();
    return d.display_name ?? null;
  } catch { return null; }
}

// ─── Interaktivna tile mapa ───────────────────────────────────────────────────

interface TileMapProps {
  center:   { lat: number; lon: number };
  pin:      { lat: number; lon: number } | null;
  zoom:     number;
  height:   number;
  onPin:    (c: { lat: number; lon: number }) => void;
  onCenter: (c: { lat: number; lon: number }) => void;
  onZoom:   (z: number) => void;
}

function TileMap({ center, pin, zoom, height, onPin, onCenter, onZoom }: TileMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [w, setW]    = useState(600);
  const dragRef      = useRef<{
    startX: number; startY: number;
    startLat: number; startLon: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(() => {
      if (containerRef.current) setW(containerRef.current.offsetWidth);
    });
    obs.observe(containerRef.current);
    setW(containerRef.current.offsetWidth);
    return () => obs.disconnect();
  }, []);

  const midX       = w / 2;
  const midY       = height / 2;
  const centerTile = latLonToTileFloat(center.lat, center.lon, zoom);
  const n          = Math.pow(2, zoom);
  const countX     = Math.ceil(w / TILE_SIZE) + 2;
  const countY     = Math.ceil(height / TILE_SIZE) + 2;
  const baseX      = Math.floor(centerTile.x) - Math.floor(countX / 2);
  const baseY      = Math.floor(centerTile.y) - Math.floor(countY / 2);

  const tiles: { tx: number; ty: number; left: number; top: number }[] = [];
  for (let dx = 0; dx <= countX; dx++) {
    for (let dy = 0; dy <= countY; dy++) {
      const tx   = baseX + dx;
      const ty   = baseY + dy;
      tiles.push({
        tx, ty,
        left: (tx - centerTile.x) * TILE_SIZE + midX,
        top:  (ty - centerTile.y) * TILE_SIZE + midY,
      });
    }
  }

  let pinLeft: number | null = null;
  let pinTop:  number | null = null;
  if (pin) {
    const pt = latLonToTileFloat(pin.lat, pin.lon, zoom);
    pinLeft  = (pt.x - centerTile.x) * TILE_SIZE + midX;
    pinTop   = (pt.y - centerTile.y) * TILE_SIZE + midY;
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (dragRef.current?.moved) return;
    const rect   = containerRef.current!.getBoundingClientRect();
    const coords = pixelToLatLon(e.clientX - rect.left, e.clientY - rect.top, midX, midY, centerTile, zoom);
    onPin(coords);
  }

  function handleMouseDown(e: React.MouseEvent) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, startLat: center.lat, startLon: center.lon, moved: false };
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true;
    if (!dragRef.current.moved) return;
    const st  = latLonToTileFloat(dragRef.current.startLat, dragRef.current.startLon, zoom);
    const tx  = st.x - dx / TILE_SIZE;
    const ty  = st.y - dy / TILE_SIZE;
    onCenter({
      lon: (tx / n) * 360 - 180,
      lat: (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n))) * 180) / Math.PI,
    });
  }, [zoom, n, onCenter]);

  function handleMouseUp() { dragRef.current = null; }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl"
      style={{
        height,
        cursor:          'crosshair',
        userSelect:      'none',
        border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.3)',
        backgroundColor: '#e8e0d8',
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={(e) => {
        e.preventDefault();
        onZoom(e.deltaY < 0 ? Math.min(zoom + 1, 18) : Math.max(zoom - 1, 3));
      }}
    >
      {tiles.map(({ tx, ty, left, top }) => {
        if (ty < 0 || ty >= n) return null;
        const wx = ((tx % n) + n) % n;
        return (
          <img
            key={`${tx}-${ty}-${zoom}`}
            src={`https://tile.openstreetmap.org/${zoom}/${wx}/${ty}.png`}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              left:     Math.round(left),
              top:      Math.round(top),
              width:    TILE_SIZE,
              height:   TILE_SIZE,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Pin */}
      {pin && pinLeft !== null && pinTop !== null && (
        <div
          style={{
            position:      'absolute',
            left:          Math.round(pinLeft) - 14,
            top:           Math.round(pinTop!)  - 32,
            pointerEvents: 'none',
            filter:        'drop-shadow(0 2px 5px rgba(0,0,0,0.4))',
          }}
        >
          <MapPin className="h-8 w-8" style={{ color: '#DC2626' }} />
        </div>
      )}

      {/* Hint bez pina */}
      {!pin && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-xl px-4 py-2 text-xs font-medium shadow-card"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#1f2a30' }}
        >
          <MapPin className="mr-1.5 inline h-3.5 w-3.5" style={{ color: '#DC2626' }} />
          Kliknite na mapu za postavljanje pina
        </div>
      )}

      {/* Zum dugmad */}
      <div className="absolute right-2 top-2 flex flex-col gap-1">
        {([
          { Icon: Plus,  action: () => onZoom(Math.min(zoom + 1, 18)) },
          { Icon: Minus, action: () => onZoom(Math.max(zoom - 1, 3)) },
        ] as const).map(({ Icon, action }, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => { e.stopPropagation(); action(); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg shadow-card
              transition-colors hover:bg-soft-beige/80"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#1f2a30' }}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Attribution */}
      <p
        className="pointer-events-none absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-xs"
        style={{ backgroundColor: 'rgba(255,255,255,0.75)', color: '#666' }}
      >
        © OpenStreetMap
      </p>
    </div>
  );
}

// ─── Autocomplete dropdown ────────────────────────────────────────────────────

interface AutocompleteProps {
  value:     string;
  onChange:  (val: string) => void;
  onSelect:  (result: NominatimResult) => void;
  error?:    string;
  loading?:  boolean;
}

function AddressAutocomplete({ value, onChange, onSelect, error, loading }: AutocompleteProps) {
  const [sugestije,   setSugestije]   = useState<NominatimResult[]>([]);
  const [otvoreno,    setOtvoreno]    = useState(false);
  const [aktivan,     setAktivan]     = useState(-1);
  const debounceRef   = useRef<ReturnType<typeof setTimeout>>();
  const containerRef  = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOtvoreno(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleChange(val: string) {
    onChange(val);
    setAktivan(-1);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 3) { setSugestije([]); setOtvoreno(false); return; }
    debounceRef.current = setTimeout(async () => {
      const rezultati = await geocodeAdresa(val);
      setSugestije(rezultati);
      setOtvoreno(rezultati.length > 0);
    }, 450);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!otvoreno) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setAktivan((a) => Math.min(a + 1, sugestije.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setAktivan((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && aktivan >= 0) { e.preventDefault(); onSelect(sugestije[aktivan]); setOtvoreno(false); }
    if (e.key === 'Escape') setOtvoreno(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
          Adresa kvara
        </label>
        <div className="relative">
          <input
            type="text"
            id="wizard-adresa"
            placeholder="Počnite tipkati adresu..."
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => sugestije.length > 0 && setOtvoreno(true)}
            autoComplete="off"
            className="w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200
              placeholder:text-text-muted/60 focus:outline-none focus:ring-2
              disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor:     error ? 'var(--first-senary)' : 'rgb(var(--first-quaternary-rgb) / 0.4)',
              backgroundColor: 'rgb(255 255 255 / 0.6)',
              color:           'var(--first-octonary)',
            }}
          />
          {loading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-celestial-teal border-t-transparent" />
            </div>
          )}
        </div>
        {error && <p className="text-xs" style={{ color: 'var(--first-senary)' }}>{error}</p>}
      </div>

      {/* Dropdown sa sugestijama */}
      {otvoreno && sugestije.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl shadow-card-lg"
          style={{
            backgroundColor: 'var(--first-tertiary)',
            border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.4)',
          }}
        >
          {sugestije.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { onSelect(s); setOtvoreno(false); }}
              className="flex w-full items-start gap-2 px-4 py-3 text-left transition-colors hover:bg-soft-beige/30"
              style={{ backgroundColor: i === aktivan ? 'rgb(var(--first-quaternary-rgb) / 0.2)' : 'transparent' }}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: '#DC2626' }} />
              <span className="text-sm" style={{ color: 'var(--first-octonary)' }}>
                {s.display_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Korak 2: Lokacija ────────────────────────────────────────────────────────

const DEFAULT_CENTER = { lat: 43.8563, lon: 18.4131 };
const DEFAULT_ZOOM   = 13;

interface KorakLokacijaProps {
  address:  string;
  onUpdate: (p: { address?: string }) => void;
  error?:   string;
}

export function KorakLokacija({ address, onUpdate, error }: KorakLokacijaProps) {
  const [mapCenter,  setMapCenter]  = useState(DEFAULT_CENTER);
  const [zoom,       setZoom]       = useState(DEFAULT_ZOOM);
  const [pin,        setPin]        = useState<{ lat: number; lon: number } | null>(null);
  const [geoGreska,  setGeoGreska]  = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  async function handlePin(coords: { lat: number; lon: number }) {
    setPin(coords);
    setMapCenter(coords);
    setGeoLoading(true);
    setGeoGreska(null);
    const adresa = await reverseGeocode(coords.lat, coords.lon);
    setGeoLoading(false);
    if (adresa) onUpdate({ address: adresa });
  }

  function handleAutocompleteSelect(r: NominatimResult) {
    const lat = parseFloat(r.lat);
    const lon = parseFloat(r.lon);
    onUpdate({ address: r.display_name });
    setMapCenter({ lat, lon });
    setPin({ lat, lon });
    setZoom(15);
  }

  async function locirajMe() {
    if (!('geolocation' in navigator)) return;
    setGeoLoading(true);
    setGeoGreska(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setMapCenter({ lat, lon });
        setPin({ lat, lon });
        setZoom(15);
        const adresa = await reverseGeocode(lat, lon);
        if (adresa) onUpdate({ address: adresa });
        setGeoLoading(false);
      },
      () => {
        setGeoGreska('Lokacija nije odobrena. Unesite adresu ručno.');
        setGeoLoading(false);
      },
      { timeout: 8000 }
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="mb-1 text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
          Lokacija kvara
        </h2>
        <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
          Kliknite na mapu za precizno pinovanje ili unesite adresu u polje ispod.
        </p>
      </div>

      {/* 1. Mapa — primarni alat za lociranje */}
      <TileMap
        center={mapCenter}
        pin={pin}
        zoom={zoom}
        height={340}
        onPin={handlePin}
        onCenter={setMapCenter}
        onZoom={setZoom}
      />

      <p className="text-xs" style={{ color: 'var(--first-quinary)' }}>
        <MapPin className="mr-1 inline h-3 w-3" style={{ color: '#DC2626' }} />
        Kliknite na mapu za pin • Prevucite za pomeranje • Scroll za zum.
      </p>

      {/* 2. Address input — tekstualna verifikacija */}
      <AddressAutocomplete
        value={address}
        onChange={(val) => { onUpdate({ address: val }); setGeoGreska(null); }}
        onSelect={handleAutocompleteSelect}
        error={error ?? (geoGreska ?? undefined)}
        loading={geoLoading}
      />

      {/* 3. Action dugmad */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={locirajMe}
          disabled={geoLoading}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5
            text-xs font-medium transition-colors hover:bg-soft-beige/30 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor:     'rgb(var(--first-secondary-rgb) / 0.35)',
            color:           'var(--first-secondary)',
            backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.05)',
          }}
        >
          <Navigation className="h-3.5 w-3.5" />
          {geoLoading ? 'Lociranje...' : 'Lociraj me (GPS)'}
        </button>
        {pin && (
          <button
            type="button"
            onClick={() => { setPin(null); setGeoGreska(null); }}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-medium
              transition-colors hover:bg-soft-beige/30"
            style={{ borderColor: 'rgba(220,38,38,0.3)', color: '#DC2626', backgroundColor: 'rgba(220,38,38,0.04)' }}
          >
            <X className="h-3.5 w-3.5" />
            Ukloni pin
          </button>
        )}
      </div>
    </div>
  );
}
