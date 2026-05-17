'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList, CheckCircle2, Truck, Clock,
  ChevronRight, MapPin, Calendar, RefreshCw, AlertTriangle,
  Zap, Shield,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';
import { prioritetBoja } from '@/lib/servisirane/statusBoja';

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

// ─── Helperi ─────────────────────────────────────────────────────────────────

function jeKasni(z: IntervencijaZaListu): boolean {
  if (!z.termin_planirani_pocetak) return false;
  if (['zavrseno', 'zatvoreno', 'otkazano'].includes(z.status)) return false;
  return new Date(z.termin_planirani_pocetak) < new Date();
}

function fmtTermin(iso: string): string {
  const d = new Date(iso);
  const danas = new Date();
  const sutra = new Date(danas);
  sutra.setDate(danas.getDate() + 1);
  const sat = d.toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === danas.toDateString()) return `Danas, ${sat}`;
  if (d.toDateString() === sutra.toDateString()) return `Sutra, ${sat}`;
  return `${d.toLocaleDateString('bs-BA', { day: '2-digit', month: '2-digit' })}, ${sat}`;
}

// ─── Kartica zadatka ──────────────────────────────────────────────────────────

function ZadatakKartica({ z }: { z: IntervencijaZaListu }) {
  const kat    = labelKategorije(z);
  const naslov = kat.podkategorija ?? kat.glavna;
  const kasni  = jeKasni(z);
  const pboja  = prioritetBoja(z.final_priority);

  const statusBoja = z.status === 'dodijeljeno' ? 'var(--first-senary)'
    : ['u_radu', 'u_izvrsenju'].includes(z.status) ? 'var(--first-secondary)'
    : 'var(--first-nonary)';

  const statusNaziv = z.status === 'dodijeljeno' ? 'Dodijeljeno'
    : z.status === 'u_radu' ? 'Na putu'
    : z.status === 'u_izvrsenju' ? 'Na terenu'
    : 'Završeno';

  return (
    <li>
      <Link
        href={`/serviser/intervencije/${z.id}`}
        className="group flex min-w-0 overflow-hidden rounded-2xl transition-all hover:shadow-md"
        style={{
          backgroundColor: 'rgb(255 255 255/0.85)',
          border:          '1px solid rgb(var(--first-quaternary-rgb)/0.32)',
          borderLeftWidth: 4,
          borderLeftColor: kasni ? '#DC2626' : z.is_premium ? '#DC2626' : pboja,
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
              style={{ backgroundColor: `color-mix(in srgb, ${statusBoja} 10%, transparent)`, color: statusBoja, border: `1px solid color-mix(in srgb, ${statusBoja} 22%, transparent)` }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusBoja }} />
              {statusNaziv}
            </span>
            {z.final_priority && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{ backgroundColor: `color-mix(in srgb, ${pboja} 10%, transparent)`, color: pboja }}>
                <Zap className="h-2.5 w-2.5" />{z.final_priority}
              </span>
            )}
            {z.is_premium && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#DC2626' }}>
                <Shield className="h-2.5 w-2.5" />Premium
              </span>
            )}
            {kasni && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#DC2626' }}>
                <AlertTriangle className="h-2.5 w-2.5" />Kasni
              </span>
            )}
          </div>

          {/* Naslov */}
          <p className="font-bold leading-snug" style={{ color: 'var(--first-octonary)' }}>{naslov}</p>
          {kat.podkategorija && (
            <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>{kat.glavna}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
            {z.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="line-clamp-1 max-w-[180px]">{z.address}</span>
              </span>
            )}
            {z.termin_planirani_pocetak && (
              <span className="flex items-center gap-1"
                style={{ color: kasni ? '#DC2626' : undefined, fontWeight: kasni ? 700 : undefined }}>
                <Calendar className="h-3 w-3 flex-shrink-0" />
                {fmtTermin(z.termin_planirani_pocetak)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center pr-4">
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            style={{ color: 'var(--first-secondary)' }} />
        </div>
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
          { oznaka: 'Prihvaćeno',  v: uRadu,       boja: 'var(--first-secondary)', Ikona: ClipboardList },
          { oznaka: 'Na terenu',   v: uIzvrsenju,  boja: 'var(--first-secondary)', Ikona: Truck },
          { oznaka: 'Završeno',    v: zavrseno,    boja: 'var(--first-nonary)',    Ikona: CheckCircle2 },
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
        <ul className="flex flex-col gap-3 p-4">
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
