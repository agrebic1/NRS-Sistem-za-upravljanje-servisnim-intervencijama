'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, MapPin, FileText,
  Clock, Calendar, Users, CheckCircle2, AlertTriangle,
  Briefcase, User, Phone, MessageSquare, Wrench,
  ExternalLink, ChevronRight, Shield,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { StatusBadge } from '@/components/servisirane/ZahtjevKartica';
import { ServiserOdabirKartica } from '@/components/dispecer/ServiserOdabirKartica';
import type { ServisniZahtjev, ServiserZaDodjelu } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';

// ─── Koraci wizard-a ──────────────────────────────────────────────────────────

const KORACI = [
  { kljuc: 'pregled',  naziv: 'Pregled zahtjeva' },
  { kljuc: 'procjena', naziv: 'Procjena' },
  { kljuc: 'termin',   naziv: 'Termin' },
  { kljuc: 'dodjela',  naziv: 'Dodjela servisera' },
  { kljuc: 'potvrda',  naziv: 'Potvrda' },
] as const;

type KorakBroj = 1 | 2 | 3 | 4 | 5;

// ─── Vizuelni step indicator ──────────────────────────────────────────────────

function WizardProgressBar({ korak }: { korak: KorakBroj }) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        {KORACI.map((k, i) => {
          const broj      = (i + 1) as KorakBroj;
          const isDone    = broj < korak;
          const isActive  = broj === korak;
          const isFuture  = broj > korak;

          return (
            <div key={k.kljuc} className="flex flex-1 flex-col items-center">
              {/* Linha + krug */}
              <div className="flex w-full items-center">
                {/* Lijevа linija */}
                {i > 0 && (
                  <div
                    className="h-0.5 flex-1 transition-colors duration-300"
                    style={{ backgroundColor: isDone || isActive ? 'var(--first-secondary)' : 'rgb(var(--first-quaternary-rgb)/0.35)' }}
                  />
                )}
                {/* Krug */}
                <div
                  className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200"
                  style={{
                    backgroundColor: isDone
                      ? 'var(--first-secondary)'
                      : isActive
                        ? 'var(--first-primary)'
                        : 'rgb(var(--first-quinary-rgb)/0.45)',
                    color: isDone || isActive ? '#ffffff' : 'var(--first-nonary)',
                    boxShadow: isActive ? '0 0 0 4px rgb(var(--first-primary-rgb)/0.18)' : 'none',
                  }}
                >
                  {isDone ? <Check className="h-4 w-4" strokeWidth={2.5} /> : broj}
                </div>
                {/* Desna linija */}
                {i < KORACI.length - 1 && (
                  <div
                    className="h-0.5 flex-1 transition-colors duration-300"
                    style={{ backgroundColor: isDone ? 'var(--first-secondary)' : 'rgb(var(--first-quaternary-rgb)/0.35)' }}
                  />
                )}
              </div>
              {/* Naziv koraka */}
              <span
                className="mt-2 hidden text-center text-[11px] font-semibold leading-tight sm:block"
                style={{
                  color: isActive ? 'var(--first-primary)' : isDone ? 'var(--first-secondary)' : 'var(--first-nonary)',
                  opacity: isFuture ? 0.6 : 1,
                }}
              >
                {k.naziv}
              </span>
            </div>
          );
        })}
      </div>
      {/* Naziv aktivnog koraka na mobileu */}
      <p className="mt-3 text-center text-sm font-semibold sm:hidden" style={{ color: 'var(--first-primary)' }}>
        Korak {korak}/{KORACI.length} — {KORACI[korak - 1].naziv}
      </p>
    </div>
  );
}

// ─── Stanje wizard-a ──────────────────────────────────────────────────────────

interface WizardState {
  procijenjeno_trajanje:    number | null;
  napomene:                 string;
  termin_pocetak_datum:     string;
  termin_pocetak_vrijemeOd: string;
  termin_pocetak_vrijemeDo: string;
  serviser_id:              string | null;
  potvrdio:                 boolean;
}

const INITIAL_WZ: WizardState = {
  procijenjeno_trajanje:    null,
  napomene:                 '',
  termin_pocetak_datum:     '',
  termin_pocetak_vrijemeOd: '',
  termin_pocetak_vrijemeDo: '',
  serviser_id:              null,
  potvrdio:                 false,
};

interface ZahtjevSaPodnosiocem extends ServisniZahtjev {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
}

// ─── Helper: trajanje u tekstu ────────────────────────────────────────────────

function trajanjeLabel(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

// ─── Sticky summary sidebar ───────────────────────────────────────────────────

function SummarySidebar({
  zahtjev,
  wz,
  naslov,
  serviser,
}: {
  zahtjev: ZahtjevSaPodnosiocem;
  wz: WizardState;
  naslov: string;
  serviser: ServiserZaDodjelu | null;
}) {
  const redak = (label: string, value: React.ReactNode, Ikona?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>) => (
    <div key={label} className="flex items-start gap-2.5 py-2.5" style={{ borderBottom: '1px solid rgb(var(--first-quaternary-rgb)/0.2)' }}>
      {Ikona && <Ikona className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>{label}</p>
        <div className="mt-0.5 text-xs font-semibold leading-snug" style={{ color: 'var(--first-octonary)' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div
      className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0"
    >
      <div
        className="sticky top-6 rounded-2xl p-4"
        style={{
          backgroundColor: 'rgb(var(--first-quinary-rgb)/0.28)',
          border: '1px solid rgb(var(--first-quaternary-rgb)/0.35)',
        }}
      >
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--first-nonary)' }}>
          Pregled plana
        </p>

        {redak('Zahtjev', naslov, FileText)}
        {redak('Status', <StatusBadge status={zahtjev.status} />, undefined)}

        {zahtjev.is_premium && (
          redak('Prioritet', (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ backgroundColor: 'rgba(220,38,38,0.12)', color: '#B91C1C', border: '1px solid rgba(220,38,38,0.25)' }}>
              <AlertTriangle className="h-3 w-3" />
              Premium HITNO
            </span>
          ))
        )}

        {zahtjev.final_priority && redak('Op. prioritet', (
          <span className="font-bold" style={{ color: '#2563EB' }}>{zahtjev.final_priority}</span>
        ))}

        {zahtjev.podnosilac && redak('Korisnik',
          `${zahtjev.podnosilac.ime} ${zahtjev.podnosilac.prezime}`, User)}

        {redak('Lokacija', zahtjev.address, MapPin)}

        {wz.termin_pocetak_datum && redak('Termin',
          `${wz.termin_pocetak_datum}${wz.termin_pocetak_vrijemeOd ? ` · ${wz.termin_pocetak_vrijemeOd}` : ''}${wz.termin_pocetak_vrijemeDo ? ` – ${wz.termin_pocetak_vrijemeDo}` : ''}`,
          Calendar)}

        {wz.procijenjeno_trajanje && redak('Trajanje',
          trajanjeLabel(wz.procijenjeno_trajanje), Clock)}

        {serviser && redak('Serviser',
          `${serviser.ime} ${serviser.prezime}`, Users)}
      </div>
    </div>
  );
}

// ─── Kartica info retka ───────────────────────────────────────────────────────

function InfoKartica({
  Ikona, naslov, sadrzaj, akcent = false,
}: {
  Ikona: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  naslov: string;
  sadrzaj: React.ReactNode;
  akcent?: boolean;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3.5"
      style={{
        backgroundColor: akcent ? 'rgb(var(--first-primary-rgb)/0.04)' : 'rgb(255 255 255 / 0.65)',
        border: `1px solid ${akcent ? 'rgb(var(--first-primary-rgb)/0.18)' : 'rgb(var(--first-quaternary-rgb)/0.3)'}`,
      }}
    >
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: 'rgb(var(--first-quinary-rgb)/0.4)' }}
      >
        <Ikona className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
          {naslov}
        </p>
        <div className="mt-1 text-sm leading-snug" style={{ color: 'var(--first-octonary)' }}>
          {sadrzaj}
        </div>
      </div>
    </div>
  );
}

// ─── Sekcija naslova ──────────────────────────────────────────────────────────

function SekcijaHeader({ naziv, opis }: { naziv: string; opis?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-bold" style={{ color: 'var(--first-octonary)' }}>{naziv}</h2>
      {opis && <p className="mt-0.5 text-xs" style={{ color: 'var(--first-nonary)' }}>{opis}</p>}
    </div>
  );
}

// ─── Stranica ─────────────────────────────────────────────────────────────────

export default function DispecerPlaniranjePage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const [zahtjev,   setZahtjev]   = useState<ZahtjevSaPodnosiocem | null>(null);
  const [serviseri, setServiseri] = useState<ServiserZaDodjelu[]>([]);
  const [ucitava,   setUcitava]   = useState(true);
  const [greska,    setGreska]    = useState<string | null>(null);
  const [jeSlanje,  setJeSlanje]  = useState(false);
  const [jeUspjelo, setJeUspjelo] = useState(false);
  const [korak,     setKorak]     = useState<KorakBroj>(1);
  const [wz,        setWz]        = useState<WizardState>(INITIAL_WZ);
  const [vrijemePotvrdio] = useState(() => new Date().toISOString());

  useEffect(() => {
    async function ucitaj() {
      try {
        const [rZ, rS] = await Promise.all([
          fetch(`/api/dispecer/zahtjevi/${id}`, { cache: 'no-store' }),
          fetch('/api/dispecer/serviseri',       { cache: 'no-store' }),
        ]);
        const dZ = await rZ.json();
        const dS = await rS.json();
        if (!rZ.ok) throw new Error(dZ.error ?? 'Zahtjev nije pronađen.');
        if (!rS.ok) throw new Error(dS.error ?? 'Greška pri učitavanju servisera.');
        setZahtjev(dZ.zahtjev);
        setServiseri(dS.serviseri ?? []);
      } catch (err) {
        setGreska(err instanceof Error ? err.message : 'Greška pri učitavanju.');
      } finally {
        setUcitava(false);
      }
    }
    ucitaj();
  }, [id]);

  function azuriraj(updates: Partial<WizardState>) {
    setWz((prev) => ({ ...prev, ...updates }));
  }

  function validirajKorak(k: KorakBroj): string | null {
    if (k === 3) {
      if (!wz.termin_pocetak_datum)              return 'Odaberite datum termina.';
      if (!wz.termin_pocetak_vrijemeOd || !wz.termin_pocetak_vrijemeDo)
        return 'Unesite vremenski raspon (od — do).';
      if (wz.termin_pocetak_vrijemeOd >= wz.termin_pocetak_vrijemeDo)
        return '"Kraj" mora biti nakon "Početka".';
    }
    if (k === 4 && !wz.serviser_id) return 'Odaberite servisera prije nastavka.';
    return null;
  }

  function sljedeci() {
    const err = validirajKorak(korak);
    if (err) { setGreska(err); return; }
    setGreska(null);
    setKorak((k) => Math.min(k + 1, 5) as KorakBroj);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prethodni() {
    setGreska(null);
    setKorak((k) => Math.max(k - 1, 1) as KorakBroj);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function dodijeli() {
    if (!wz.serviser_id)  { setGreska('Odaberite servisera.'); return; }
    if (!wz.potvrdio)     { setGreska('Potvrdite da su podaci provjereni.'); return; }
    setJeSlanje(true);
    setGreska(null);
    try {
      const pocetak = wz.termin_pocetak_datum && wz.termin_pocetak_vrijemeOd
        ? `${wz.termin_pocetak_datum}T${wz.termin_pocetak_vrijemeOd}:00`
        : null;
      const kraj = wz.termin_pocetak_datum && wz.termin_pocetak_vrijemeDo
        ? `${wz.termin_pocetak_datum}T${wz.termin_pocetak_vrijemeDo}:00`
        : null;

      const r = await fetch(`/api/dispecer/zahtjevi/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:                   'dodijeli',
          serviser_id:              wz.serviser_id,
          termin_planirani_pocetak: pocetak,
          termin_planirani_kraj:    kraj,
          procijenjeno_trajanje:    wz.procijenjeno_trajanje,
          dispecer_napomene:        wz.napomene.trim() || null,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri dodjeli.');
      setJeUspjelo(true);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri dodjeli.');
    } finally {
      setJeSlanje(false);
    }
  }

  // ─── Loading ────────────────────────────────────────────────────────────────

  if (ucitava) {
    return (
      <AppShell uloga="dispecer" imeKorisnika="Dispečer">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
              style={{ borderTopColor: 'var(--first-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Učitavanje zahtjeva...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (greska && !zahtjev) {
    return (
      <AppShell uloga="dispecer" imeKorisnika="Dispečer">
        <AlertMessage variant="error" message={greska} />
        <Link href="/dispecer">
          <Button variant="secondary" size="md" className="mt-4">
            <ArrowLeft className="h-4 w-4" /> Nazad na panel
          </Button>
        </Link>
      </AppShell>
    );
  }

  // ─── Uspjeh ─────────────────────────────────────────────────────────────────

  if (jeUspjelo && zahtjev) {
    const s = serviseri.find((x) => x.id === wz.serviser_id);
    const kat    = labelKategorije(zahtjev);
    const naslov = kat.podkategorija ? `${kat.glavna} — ${kat.podkategorija}` : kat.glavna;

    return (
      <AppShell uloga="dispecer" imeKorisnika="Dispečer">
        <div className="mx-auto max-w-lg py-12">
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb)/0.22)',
              border: '1px solid rgb(var(--first-quaternary-rgb)/0.35)',
            }}
          >
            {/* Ikona uspjeha */}
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgb(34,197,94,0.1)', border: '2px solid rgb(34,197,94,0.25)' }}
            >
              <CheckCircle2 className="h-10 w-10" style={{ color: '#22C55E' }} />
            </div>

            <h2 className="text-2xl font-bold" style={{ color: 'var(--first-octonary)' }}>
              Intervencija dodijeljena
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--first-nonary)' }}>
              Radni nalog je kreiran i serviser je obaviješten.
            </p>

            {/* Sažetak */}
            <div className="mt-6 flex flex-col gap-2 text-left">
              {[
                { Ikona: FileText, label: 'Intervencija', v: naslov },
                s ? { Ikona: Users, label: 'Serviser', v: `${s.ime} ${s.prezime}` } : null,
                wz.termin_pocetak_datum ? {
                  Ikona: Calendar,
                  label: 'Termin',
                  v: `${wz.termin_pocetak_datum}${wz.termin_pocetak_vrijemeOd ? ` · ${wz.termin_pocetak_vrijemeOd}` : ''}${wz.termin_pocetak_vrijemeDo ? ` – ${wz.termin_pocetak_vrijemeDo}` : ''}`,
                } : null,
              ].filter(Boolean).map((row) => {
                if (!row) return null;
                const { Ikona, label, v } = row;
                return (
                  <div key={label}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: 'rgb(255 255 255 / 0.6)', border: '1px solid rgb(var(--first-quaternary-rgb)/0.3)' }}>
                    <Ikona className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>{label}</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>{v}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button size="md" onClick={() => router.push('/dispecer')}>
                <ArrowLeft className="h-4 w-4" /> Kontrolna ploča
              </Button>
              <Button variant="secondary" size="md" onClick={() => router.push('/dispecer/zahtjevi')}>
                Svi zahtjevi
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!zahtjev) return null;

  const kat    = labelKategorije(zahtjev);
  const naslov = kat.podkategorija ? `${kat.glavna} — ${kat.podkategorija}` : kat.glavna;
  const odabraniServiser = serviseri.find((s) => s.id === wz.serviser_id) ?? null;

  const inputStil = {
    borderColor:     'rgb(var(--first-quaternary-rgb)/0.45)',
    backgroundColor: 'rgb(255 255 255 / 0.85)',
    color:           'var(--first-octonary)',
  };

  const sekcija = {
    backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.18)',
    border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.32)',
  };

  return (
    <AppShell uloga="dispecer" imeKorisnika="Dispečer">
      {/* ─── Navigacija (gore) ───────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/dispecer"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all hover:bg-black/[0.04]"
          style={{ color: 'var(--first-nonary)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kontrolna ploča
        </Link>
        <ChevronRight className="h-3.5 w-3.5" style={{ color: 'var(--first-quinary)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
          Planiranje intervencije
        </span>
      </div>

      {/* ─── Header zahtjeva ─────────────────────────────────────────────────── */}
      <div
        className="mb-6 rounded-2xl p-5"
        style={{
          backgroundColor: zahtjev.is_premium ? 'rgba(220,38,38,0.03)' : 'rgb(var(--first-quinary-rgb)/0.18)',
          border: zahtjev.is_premium
            ? '1px solid rgba(220,38,38,0.22)'
            : '1px solid rgb(var(--first-quaternary-rgb)/0.32)',
        }}
      >
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--first-nonary)' }}>
                #{id} · Planiranje
              </span>
              <StatusBadge status={zahtjev.status} />
              {zahtjev.is_premium && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: 'rgba(220,38,38,0.12)', color: '#B91C1C', border: '1px solid rgba(220,38,38,0.25)' }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  Premium HITNO
                </span>
              )}
              {zahtjev.final_priority && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.2)' }}
                >
                  {zahtjev.final_priority}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold leading-snug" style={{ color: 'var(--first-octonary)' }}>
              {naslov}
            </h1>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color: 'var(--first-nonary)' }}>
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">{zahtjev.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Progress bar ─────────────────────────────────────────────────────── */}
      <WizardProgressBar korak={korak} />

      {greska && (
        <div className="mb-5">
          <AlertMessage variant="error" message={greska} />
        </div>
      )}

      {/* ─── Glavni layout: sadržaj + sidebar ────────────────────────────────── */}
      <div className="flex gap-6">
        {/* Sadržaj koraka */}
        <div className="min-w-0 flex-1">

          {/* ── Korak 1: Pregled zahtjeva ───────────────────────────────────── */}
          {korak === 1 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-5" style={sekcija}>
                <SekcijaHeader naziv="Pregled zahtjeva" opis="Pregledajte informacije o zahtjevu prije nastavka." />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {zahtjev.podnosilac && (
                    <InfoKartica
                      Ikona={User}
                      naslov="Korisnik"
                      sadrzaj={`${zahtjev.podnosilac.ime} ${zahtjev.podnosilac.prezime}`}
                    />
                  )}
                  {zahtjev.podnosilac?.broj_telefona && (
                    <InfoKartica
                      Ikona={Phone}
                      naslov="Kontakt"
                      sadrzaj={
                        <a
                          href={`tel:${zahtjev.podnosilac.broj_telefona}`}
                          className="font-semibold transition-opacity hover:opacity-70"
                          style={{ color: 'var(--first-secondary)' }}
                        >
                          {zahtjev.podnosilac.broj_telefona}
                        </a>
                      }
                    />
                  )}
                  <InfoKartica
                    Ikona={MapPin}
                    naslov="Lokacija"
                    sadrzaj={zahtjev.address}
                  />
                  {kat.podkategorija && (
                    <InfoKartica
                      Ikona={Wrench}
                      naslov="Kategorija"
                      sadrzaj={`${kat.glavna} · ${kat.podkategorija}`}
                    />
                  )}
                </div>

                {/* Lokacija — dugme za mapu */}
                <div className="mt-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(zahtjev.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                    style={{
                      backgroundColor: 'rgb(var(--first-secondary-rgb)/0.08)',
                      color: 'var(--first-secondary)',
                      border: '1px solid rgb(var(--first-secondary-rgb)/0.2)',
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Otvori u Google Maps
                  </a>
                </div>
              </div>

              {/* Opis (poruka korisnika) */}
              <div className="rounded-2xl p-5" style={sekcija}>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
                    Opis problema
                  </p>
                </div>
                <div
                  className="rounded-xl border-l-4 px-4 py-3 text-sm leading-relaxed"
                  style={{
                    backgroundColor: 'rgb(255 255 255 / 0.7)',
                    borderLeftColor: 'var(--first-secondary)',
                    color: 'var(--first-octonary)',
                  }}
                >
                  {zahtjev.description}
                </div>
              </div>

              {/* Korisnički preferirani termini */}
              {zahtjev.preferred_schedule?.termini?.length ? (
                <div className="rounded-2xl p-5" style={sekcija}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
                      Korisnik predlaže termine
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {zahtjev.preferred_schedule.termini.map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl px-3 py-2"
                        style={{ backgroundColor: 'rgb(var(--first-septenary-rgb)/0.1)', border: '1px solid rgb(var(--first-septenary-rgb)/0.25)' }}
                      >
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--first-senary)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
                          {t.date} · {t.from} – {t.to}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ── Korak 2: Procjena ───────────────────────────────────────────── */}
          {korak === 2 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-5" style={sekcija}>
                <SekcijaHeader
                  naziv="Procjena intervencije"
                  opis="Unesite procijenjeno trajanje i posebne napomene za servisera."
                />

                {/* Procijenjeno trajanje */}
                <div className="mb-5">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                    <Clock className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                    Procijenjeno trajanje
                    <span className="font-normal text-xs" style={{ color: 'var(--first-nonary)' }}>(opciono)</span>
                  </label>
                  {/* Brzi odabir */}
                  <div className="mb-2.5 flex flex-wrap gap-2">
                    {[30, 60, 90, 120, 180].map((min) => (
                      <button
                        key={min}
                        type="button"
                        onClick={() => azuriraj({ procijenjeno_trajanje: min })}
                        className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: wz.procijenjeno_trajanje === min
                            ? 'rgb(var(--first-primary-rgb)/0.1)'
                            : 'rgb(255 255 255 / 0.6)',
                          border: wz.procijenjeno_trajanje === min
                            ? '1px solid rgb(var(--first-primary-rgb)/0.4)'
                            : '1px solid rgb(var(--first-quaternary-rgb)/0.4)',
                          color: wz.procijenjeno_trajanje === min ? 'var(--first-primary)' : 'var(--first-nonary)',
                        }}
                      >
                        {trajanjeLabel(min)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    value={wz.procijenjeno_trajanje ?? ''}
                    onChange={(e) => azuriraj({ procijenjeno_trajanje: e.target.value ? parseInt(e.target.value, 10) : null })}
                    placeholder="npr. 90 minuta"
                    className="w-full max-w-xs rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                    style={inputStil}
                  />
                </div>

                {/* Napomene */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                    <FileText className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                    Napomene za servisera
                    <span className="font-normal text-xs" style={{ color: 'var(--first-nonary)' }}>(opciono)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={wz.napomene}
                    onChange={(e) => azuriraj({ napomene: e.target.value })}
                    placeholder="Posebne upute, potrebna oprema, kontakt lice na lokaciji, šifre pristupa..."
                    className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                    style={inputStil}
                  />
                  <p className="mt-1 text-right text-xs" style={{ color: 'var(--first-quinary)' }}>
                    {wz.napomene.length}/500
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Korak 3: Planiranje termina ─────────────────────────────────── */}
          {korak === 3 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-5" style={sekcija}>
                <SekcijaHeader
                  naziv="Termin intervencije"
                  opis="Odredite datum i vremenski raspon za izvođenje intervencije."
                />

                {/* Brze akcije */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {[
                    { oznaka: 'Danas', datum: new Date().toISOString().slice(0, 10) },
                    { oznaka: 'Sutra', datum: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10) },
                    { oznaka: 'Prekosutra', datum: new Date(Date.now() + 172_800_000).toISOString().slice(0, 10) },
                  ].map(({ oznaka, datum }) => (
                    <button
                      key={oznaka}
                      type="button"
                      onClick={() => azuriraj({ termin_pocetak_datum: datum })}
                      className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: wz.termin_pocetak_datum === datum ? 'rgb(var(--first-primary-rgb)/0.1)' : 'rgb(255 255 255 / 0.65)',
                        border: wz.termin_pocetak_datum === datum ? '2px solid rgb(var(--first-primary-rgb)/0.5)' : '1px solid rgb(var(--first-quaternary-rgb)/0.4)',
                        color: wz.termin_pocetak_datum === datum ? 'var(--first-primary)' : 'var(--first-nonary)',
                      }}
                    >
                      {oznaka}
                    </button>
                  ))}
                </div>

                {/* Korisnikov preferirani termin referenca */}
                {zahtjev.preferred_schedule?.termini?.length ? (
                  <div
                    className="mb-4 rounded-xl px-4 py-3"
                    style={{ backgroundColor: 'rgb(var(--first-septenary-rgb)/0.1)', border: '1px solid rgb(var(--first-septenary-rgb)/0.22)' }}
                  >
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-senary)' }}>
                      Korisnik predlaže
                    </p>
                    {zahtjev.preferred_schedule.termini.map((t, i) => (
                      <p key={i} className="text-xs font-medium" style={{ color: 'var(--first-octonary)' }}>
                        {t.date} · {t.from} – {t.to}
                      </p>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-col gap-4">
                  {/* Datum */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      <Calendar className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                      Datum intervencije *
                    </label>
                    <input
                      type="date"
                      value={wz.termin_pocetak_datum}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => azuriraj({ termin_pocetak_datum: e.target.value })}
                      className="w-full max-w-xs rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                      style={inputStil}
                    />
                  </div>

                  {/* Vremenski raspon */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      <Clock className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                      Vremenski raspon *
                    </label>
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>Početak</span>
                        <input
                          type="time"
                          value={wz.termin_pocetak_vrijemeOd}
                          onChange={(e) => azuriraj({ termin_pocetak_vrijemeOd: e.target.value })}
                          className="rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                          style={inputStil}
                        />
                      </div>
                      <span className="pb-2.5 text-sm font-medium" style={{ color: 'var(--first-nonary)' }}>—</span>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>Kraj</span>
                        <input
                          type="time"
                          value={wz.termin_pocetak_vrijemeDo}
                          onChange={(e) => azuriraj({ termin_pocetak_vrijemeDo: e.target.value })}
                          className="rounded-xl border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                          style={inputStil}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vizuelni prikaz odabranog termina */}
                {wz.termin_pocetak_datum && wz.termin_pocetak_vrijemeOd && (
                  <div
                    className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: 'rgb(var(--first-primary-rgb)/0.06)', border: '1px solid rgb(var(--first-primary-rgb)/0.18)' }}
                  >
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-secondary)' }} />
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--first-secondary)' }}>Odabrani termin</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                        {wz.termin_pocetak_datum}
                        {wz.termin_pocetak_vrijemeOd && ` · ${wz.termin_pocetak_vrijemeOd}`}
                        {wz.termin_pocetak_vrijemeDo && ` – ${wz.termin_pocetak_vrijemeDo}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Korak 4: Dodjela servisera ──────────────────────────────────── */}
          {korak === 4 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl p-5" style={sekcija}>
                <SekcijaHeader
                  naziv="Odaberite servisera"
                  opis="Odaberite dostupnog servisera za ovu intervenciju. Sortirano prema dostupnosti."
                />

                {serviseri.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ backgroundColor: 'rgb(var(--first-quinary-rgb)/0.4)' }}
                    >
                      <Briefcase className="h-7 w-7" style={{ color: 'var(--first-quinary)' }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                        Nema dostupnih servisera
                      </p>
                      <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
                        Nije pronađen nijedan verificirani serviser u sistemu.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {serviseri.map((s) => (
                      <ServiserOdabirKartica
                        key={s.id}
                        serviser={s}
                        odabran={wz.serviser_id === s.id}
                        onClick={() => azuriraj({ serviser_id: s.id })}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Korak 5: Pregled i potvrda ──────────────────────────────────── */}
          {korak === 5 && (
            <div className="flex flex-col gap-4">
              {/* Final review */}
              <div className="rounded-2xl p-5" style={sekcija}>
                <SekcijaHeader
                  naziv="Pregled plana"
                  opis="Pregledajte sve odluke prije finalne potvrde."
                />

                <div className="flex flex-col gap-2">
                  {/* Zahtjev */}
                  <div
                    className="grid grid-cols-2 gap-3 rounded-xl p-4"
                    style={{ backgroundColor: 'rgb(255 255 255 / 0.65)', border: '1px solid rgb(var(--first-quaternary-rgb)/0.3)' }}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>Zahtjev</p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug" style={{ color: 'var(--first-octonary)' }}>{naslov}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>Status</p>
                      <div className="mt-0.5"><StatusBadge status={zahtjev.status} /></div>
                    </div>
                    {zahtjev.podnosilac && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>Korisnik</p>
                        <p className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                          {zahtjev.podnosilac.ime} {zahtjev.podnosilac.prezime}
                        </p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>Lokacija</p>
                      <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                        {zahtjev.address}
                      </p>
                    </div>
                  </div>

                  {/* Termin */}
                  {wz.termin_pocetak_datum && (
                    <div
                      className="flex items-center gap-4 rounded-xl p-4"
                      style={{ backgroundColor: 'rgb(var(--first-primary-rgb)/0.05)', border: '1px solid rgb(var(--first-primary-rgb)/0.18)' }}
                    >
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: 'rgb(var(--first-secondary-rgb)/0.1)' }}
                      >
                        <Calendar className="h-5 w-5" style={{ color: 'var(--first-secondary)' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>Termin</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--first-octonary)' }}>
                          {wz.termin_pocetak_datum}
                          {wz.termin_pocetak_vrijemeOd && ` · ${wz.termin_pocetak_vrijemeOd}`}
                          {wz.termin_pocetak_vrijemeDo && ` – ${wz.termin_pocetak_vrijemeDo}`}
                        </p>
                        {wz.procijenjeno_trajanje && (
                          <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                            Procijenjeno trajanje: {trajanjeLabel(wz.procijenjeno_trajanje)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Serviser */}
                  {odabraniServiser ? (
                    <div
                      className="flex items-center gap-4 rounded-xl p-4"
                      style={{ backgroundColor: 'rgb(34,197,94,0.04)', border: '1px solid rgb(34,197,94,0.2)' }}
                    >
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                        style={{ backgroundColor: 'rgb(34,197,94,0.1)', color: '#16A34A' }}
                      >
                        {odabraniServiser.ime.charAt(0)}{odabraniServiser.prezime.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>Serviser</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--first-octonary)' }}>
                          {odabraniServiser.ime} {odabraniServiser.prezime}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                          {odabraniServiser.aktivnih_zadataka === 0 ? 'Slobodan' : `${odabraniServiser.aktivnih_zadataka} aktivnih zadataka`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-3 rounded-xl px-4 py-3"
                      style={{ backgroundColor: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.25)', color: '#DC2626' }}
                    >
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <p className="text-sm font-semibold">Serviser nije odabran. Idite na korak 4.</p>
                    </div>
                  )}

                  {/* Napomene */}
                  {wz.napomene.trim() && (
                    <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: 'rgb(var(--first-septenary-rgb)/0.08)', border: '1px solid rgb(var(--first-septenary-rgb)/0.2)' }}
                    >
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-senary)' }}>
                        Napomene za servisera
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--first-octonary)' }}>{wz.napomene}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Operativna potvrda */}
              <div
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: wz.potvrdio ? 'rgb(34,197,94,0.05)' : 'rgb(var(--first-quinary-rgb)/0.18)',
                  border: wz.potvrdio ? '2px solid rgb(34,197,94,0.3)' : '2px solid rgb(var(--first-quaternary-rgb)/0.35)',
                }}
              >
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => azuriraj({ potvrdio: !wz.potvrdio })}
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-all focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: wz.potvrdio ? '#22C55E' : 'transparent',
                      border: wz.potvrdio ? '2px solid #22C55E' : '2px solid rgb(var(--first-quaternary-rgb)/0.5)',
                    }}
                    aria-checked={wz.potvrdio}
                    role="checkbox"
                  >
                    {wz.potvrdio && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </button>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                      Potvrđujem da su svi podaci provjereni i tačni.
                    </p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                      Klikom na &quot;Dodijeli intervenciju&quot; kreirate radni nalog i obavještavate servisera.
                    </p>
                    {wz.potvrdio && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5" style={{ color: '#22C55E' }} />
                        <p className="text-xs font-semibold" style={{ color: '#16A34A' }}>
                          Potvrđeno · {new Date(vrijemePotvrdio).toLocaleString('bs-BA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Navigacijska traka ──────────────────────────────────────────── */}
          <div
            className="mt-6 flex items-center justify-between gap-3 rounded-2xl px-5 py-4"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb)/0.18)',
              border: '1px solid rgb(var(--first-quaternary-rgb)/0.3)',
            }}
          >
            {korak > 1 ? (
              <Button variant="secondary" size="md" onClick={prethodni} disabled={jeSlanje}>
                <ArrowLeft className="h-4 w-4" />
                Nazad
              </Button>
            ) : (
              <Link href="/dispecer">
                <Button variant="ghost" size="md">
                  <ArrowLeft className="h-4 w-4" />
                  Odustani
                </Button>
              </Link>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                {korak} / {KORACI.length}
              </span>
              {korak < 5 ? (
                <Button size="md" onClick={sljedeci}>
                  Nastavi
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={dodijeli}
                  isLoading={jeSlanje}
                  loadingText="Dodjela u toku..."
                  disabled={!wz.serviser_id || !wz.potvrdio}
                >
                  <Check className="h-4 w-4" />
                  Dodijeli intervenciju
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Sticky summary sidebar (desktop) ─────────────────────────────── */}
        <SummarySidebar
          zahtjev={zahtjev}
          wz={wz}
          naslov={naslov}
          serviser={odabraniServiser}
        />
      </div>
    </AppShell>
  );
}
