'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList, CheckCircle2, Truck, Clock,
  ChevronRight, MapPin, Calendar, RefreshCw, AlertTriangle,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { StatusBadge } from '@/components/servisirane/ZahtjevKartica';
import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';

// ─── Status tab config ────────────────────────────────────────────────────────

const TABOVI = [
  { key: 'aktivni',   oznaka: 'Aktivni',   statusi: ['dodijeljeno', 'u_radu', 'u_izvrsenju'] },
  { key: 'cekanje',   oznaka: 'Na čekanju', statusi: ['dodijeljeno'] },
  { key: 'u_toku',    oznaka: 'U toku',    statusi: ['u_radu', 'u_izvrsenju'] },
  { key: 'zavrseni',  oznaka: 'Završeni',  statusi: ['zavrseno'] },
] as const;

type TabKey = typeof TABOVI[number]['key'];

// ─── Tip za zahtjev sa podnosiocem ───────────────────────────────────────────

interface IntervencijaZaListu extends ServisniZahtjev {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
}

// ─── Kartica zadatka ──────────────────────────────────────────────────────────

function ZadatakKartica({ z }: { z: IntervencijaZaListu }) {
  const kat     = labelKategorije(z);
  const naslov  = kat.podkategorija ? `${kat.glavna} — ${kat.podkategorija}` : kat.glavna;
  const hitno   = (z.urgency_score ?? 0) >= 75 || z.is_premium;

  return (
    <li>
      <Link
        href={`/serviser/intervencije/${z.id}`}
        className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-soft-beige/10"
      >
        <div className="mt-0.5 flex-shrink-0">
          {hitno
            ? <AlertTriangle className="h-4 w-4" style={{ color: 'var(--first-senary)' }} />
            : <ClipboardList className="h-4 w-4" style={{ color: 'var(--first-quinary)' }} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium" style={{ color: 'var(--first-octonary)' }}>{naslov}</p>
            <StatusBadge status={z.status} />
            {z.is_premium && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: 'rgba(220,38,38,0.12)', color: '#B91C1C', border: '1px solid rgba(220,38,38,0.25)' }}
              >
                Premium HITNO
              </span>
            )}
          </div>

          <p className="mt-0.5 line-clamp-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
            {z.description}
          </p>

          <div className="mt-1.5 flex flex-wrap gap-x-4 text-xs" style={{ color: 'var(--first-nonary)' }}>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {z.address.length > 40 ? `${z.address.substring(0, 40)}...` : z.address}
            </span>
            {z.termin_planirani_pocetak && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(z.termin_planirani_pocetak).toLocaleDateString('bs-BA')}
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-quinary)' }} />
      </Link>
    </li>
  );
}

// ─── Stranica ─────────────────────────────────────────────────────────────────

export default function ServiserZadaciPage() {
  const [sve,      setSve]      = useState<IntervencijaZaListu[]>([]);
  const [ucitava,  setUcitava]  = useState(true);
  const [greska,   setGreska]   = useState<string | null>(null);
  const [aktTabKey, setAktTabKey] = useState<TabKey>('aktivni');

  async function ucitaj() {
    setUcitava(true);
    setGreska(null);
    try {
      const r = await fetch('/api/serviser/intervencije', { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri učitavanju.');
      setSve(d.intervencije ?? []);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri učitavanju.');
    } finally {
      setUcitava(false);
    }
  }

  useEffect(() => { ucitaj(); }, []);

  const aktTab    = TABOVI.find((t) => t.key === aktTabKey) ?? TABOVI[0];
  const filtriran = sve.filter((z) => (aktTab.statusi as readonly string[]).includes(z.status));

  const dodijeljeno = sve.filter((z) => z.status === 'dodijeljeno').length;
  const uRadu       = sve.filter((z) => z.status === 'u_radu').length;
  const uIzvrsenju  = sve.filter((z) => z.status === 'u_izvrsenju').length;
  const zavrseno    = sve.filter((z) => z.status === 'zavrseno').length;

  return (
    <AppShell uloga="serviser">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
            Moji zadaci
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
            Pregled svih dodijeljenih intervencija.
          </p>
        </div>
        <Button variant="secondary" size="md" onClick={ucitaj} isLoading={ucitava} loadingText="Osvježavanje...">
          <RefreshCw className="h-4 w-4" />
          Osvježi
        </Button>
      </div>

      {/* KPI */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { oznaka: 'Dodijeljeno', v: dodijeljeno, boja: '#D97706',  Ikona: Clock },
          { oznaka: 'Prihvaćeno',  v: uRadu,       boja: '#2563EB',  Ikona: ClipboardList },
          { oznaka: 'Na terenu',   v: uIzvrsenju,  boja: '#22C55E',  Ikona: Truck },
          { oznaka: 'Završeno',    v: zavrseno,    boja: 'var(--first-secondary)', Ikona: CheckCircle2 },
        ].map(({ oznaka, v, boja, Ikona }) => (
          <div
            key={oznaka}
            className="flex items-center gap-3 rounded-2xl p-4"
            style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}
          >
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `color-mix(in srgb, ${boja} 12%, transparent)` }}
            >
              <Ikona className="h-4 w-4" style={{ color: boja }} />
            </div>
            <div>
              <p className="text-xl font-bold tabular-nums" style={{ color: boja }}>{v}</p>
              <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>{oznaka}</p>
            </div>
          </div>
        ))}
      </div>

      {greska && <div className="mb-4"><AlertMessage variant="error" message={greska} /></div>}

      {/* Tabovi */}
      <div
        className="rounded-2xl shadow-card"
        style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}
      >
        {/* Tab header */}
        <div
          className="flex gap-1 overflow-x-auto border-b px-4 py-2"
          style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.3)' }}
        >
          {TABOVI.map((tab) => {
            const br = sve.filter((z) => (tab.statusi as readonly string[]).includes(z.status)).length;
            const aktivan = aktTabKey === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setAktTabKey(tab.key)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium
                  transition-all whitespace-nowrap"
                style={{
                  backgroundColor: aktivan ? 'var(--first-primary)' : 'transparent',
                  color:           aktivan ? '#ffffff' : 'var(--first-nonary)',
                }}
              >
                {tab.oznaka}
                <span
                  className="rounded-full px-1.5 text-xs font-bold"
                  style={{
                    backgroundColor: aktivan ? 'rgba(255,255,255,0.25)' : 'rgb(var(--first-quaternary-rgb)/0.4)',
                    color:           aktivan ? '#fff' : 'var(--first-nonary)',
                  }}
                >
                  {br}
                </span>
              </button>
            );
          })}
        </div>

        {/* Lista */}
        <ul className="divide-y" style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.25)' }}>
          {ucitava && (
            <li className="px-5 py-8 text-center text-sm" style={{ color: 'var(--first-nonary)' }}>
              Učitavanje...
            </li>
          )}
          {!ucitava && filtriran.length === 0 && (
            <li className="flex flex-col items-center gap-2 px-5 py-10 text-center">
              <ClipboardList className="h-8 w-8" style={{ color: 'var(--first-quinary)' }} />
              <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
                Nema zadataka u ovoj kategoriji.
              </p>
            </li>
          )}
          {!ucitava && filtriran.map((z) => <ZadatakKartica key={z.id} z={z} />)}
        </ul>
      </div>
    </AppShell>
  );
}
