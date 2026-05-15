'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, MapPin, FileText,
  Clock, Calendar, Users, CheckCircle2, AlertTriangle,
  Briefcase, User,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { StatusBadge } from '@/components/servisirane/ZahtjevKartica';
import { ServiserOdabirKartica } from '@/components/dispecer/ServiserOdabirKartica';
import type { ServisniZahtjev, ServiserZaDodjelu } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';

// ─── Step indicator ───────────────────────────────────────────────────────────

const KORACI = ['Pregled', 'Procjena', 'Termin', 'Dodjela', 'Potvrda'] as const;
type KorakBroj = 1 | 2 | 3 | 4 | 5;

function StepIndicator({ korak }: { korak: KorakBroj }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-1">
      {KORACI.map((oznaka, i) => {
        const step     = (i + 1) as KorakBroj;
        const isActive = step === korak;
        const isDone   = step < korak;
        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: isDone ? 'var(--first-secondary)' : isActive ? 'var(--first-primary)' : 'rgb(var(--first-quinary-rgb)/0.4)',
                  color: isDone || isActive ? 'white' : 'var(--first-nonary)',
                }}
              >
                {isDone ? '✓' : step}
              </div>
              <span className="hidden text-xs font-medium sm:block" style={{ color: isActive ? 'var(--first-primary)' : 'var(--first-nonary)' }}>
                {oznaka}
              </span>
            </div>
            {step < KORACI.length && (
              <div
                className="mb-4 h-0.5 w-6 sm:w-10"
                style={{ backgroundColor: isDone ? 'var(--first-secondary)' : 'rgb(var(--first-quinary-rgb)/0.4)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Wizard state ─────────────────────────────────────────────────────────────

interface WizardState {
  procijenjeno_trajanje:    number | null;   // minuta
  napomene:                 string;
  termin_pocetak_datum:     string;           // YYYY-MM-DD
  termin_pocetak_vrijemeOd: string;           // HH:mm
  termin_pocetak_vrijemeDo: string;           // HH:mm
  serviser_id:              string | null;
}

const INITIAL_WZ: WizardState = {
  procijenjeno_trajanje:    null,
  napomene:                 '',
  termin_pocetak_datum:     '',
  termin_pocetak_vrijemeOd: '',
  termin_pocetak_vrijemeDo: '',
  serviser_id:              null,
};

// ─── Tip za zahtjev s podnosiocem ─────────────────────────────────────────────

interface ZahtjevSaPodnosiocem extends ServisniZahtjev {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
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
    if (k === 2) return null; // procjena je opcionalna
    if (k === 3) {
      if (!wz.termin_pocetak_datum) return 'Odaberite datum termina.';
      if (!wz.termin_pocetak_vrijemeOd || !wz.termin_pocetak_vrijemeDo)
        return 'Unesite vremenski raspon termina.';
      if (wz.termin_pocetak_vrijemeOd >= wz.termin_pocetak_vrijemeDo)
        return '"Kraj" mora biti nakon "Početka".';
    }
    if (k === 4) {
      if (!wz.serviser_id) return 'Odaberite servisera.';
    }
    return null;
  }

  function sljedeci() {
    const err = validirajKorak(korak);
    if (err) { setGreska(err); return; }
    setGreska(null);
    setKorak((k) => Math.min(k + 1, 5) as KorakBroj);
  }

  function prethodni() {
    setGreska(null);
    setKorak((k) => Math.max(k - 1, 1) as KorakBroj);
  }

  async function dodijeli() {
    if (!wz.serviser_id) { setGreska('Odaberite servisera.'); return; }
    setJeSlanje(true);
    setGreska(null);
    try {
      let pocetak: string | null = null;
      let kraj: string | null    = null;

      if (wz.termin_pocetak_datum && wz.termin_pocetak_vrijemeOd) {
        pocetak = `${wz.termin_pocetak_datum}T${wz.termin_pocetak_vrijemeOd}:00`;
      }
      if (wz.termin_pocetak_datum && wz.termin_pocetak_vrijemeDo) {
        kraj = `${wz.termin_pocetak_datum}T${wz.termin_pocetak_vrijemeDo}:00`;
      }

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

  // ─── Loading / Error ────────────────────────────────────────────────────────

  if (ucitava) {
    return (
      <AppShell uloga="dispecer" imeKorisnika="Dispečer">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Učitavanje...</p>
        </div>
      </AppShell>
    );
  }

  if (greska && !zahtjev) {
    return (
      <AppShell uloga="dispecer" imeKorisnika="Dispečer">
        <AlertMessage variant="error" message={greska} />
        <Link href="/dispecer"><Button variant="secondary" size="md" className="mt-4"><ArrowLeft className="h-4 w-4" /> Nazad</Button></Link>
      </AppShell>
    );
  }

  // ─── Uspjeh ─────────────────────────────────────────────────────────────────

  if (jeUspjelo) {
    const s = serviseri.find((x) => x.id === wz.serviser_id);
    return (
      <AppShell uloga="dispecer" imeKorisnika="Dispečer">
        <div className="flex flex-col items-center gap-5 py-16 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgb(34,197,94,0.12)' }}
          >
            <CheckCircle2 className="h-8 w-8" style={{ color: '#22C55E' }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
            Intervencija dodijeljena!
          </h2>
          <p className="max-w-xs text-sm" style={{ color: 'var(--first-nonary)' }}>
            {s ? `${s.ime} ${s.prezime}` : 'Serviser'} je obaviješten i čeka prihvatanje zadatka.
          </p>
          <Button size="md" onClick={() => router.push('/dispecer')}>
            <ArrowLeft className="h-4 w-4" /> Nazad na panel
          </Button>
        </div>
      </AppShell>
    );
  }

  if (!zahtjev) return null;

  const kat    = labelKategorije(zahtjev);
  const naslov = kat.podkategorija ? `${kat.glavna} — ${kat.podkategorija}` : kat.glavna;
  const odabraniServiser = serviseri.find((s) => s.id === wz.serviser_id) ?? null;

  const cardStyle = {
    backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
    border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
  };

  return (
    <AppShell uloga="dispecer" imeKorisnika="Dispečer">
      {/* Zaglavlje */}
      <div className="mb-6">
        <Link
          href="/dispecer"
          className="mb-2 inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: 'var(--first-nonary)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kontrolna ploča
        </Link>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
          Planiranje intervencije
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
          {naslov}
        </p>
      </div>

      <StepIndicator korak={korak} />

      {greska && <div className="mb-4"><AlertMessage variant="error" message={greska} /></div>}

      {/* ─── Korak 1: Pregled zahtjeva ─────────────────────────────────────── */}
      {korak === 1 && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-5" style={cardStyle}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold" style={{ color: 'var(--first-octonary)' }}>
                {naslov}
              </h2>
              <StatusBadge status={zahtjev.status} />
              {zahtjev.final_priority && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563EB' }}
                >
                  {zahtjev.final_priority}
                </span>
              )}
              {zahtjev.is_premium && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(220,38,38,0.12)', color: '#B91C1C' }}
                >
                  Premium HITNO
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--first-octonary)' }}>
                  {zahtjev.description}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                <p className="text-sm" style={{ color: 'var(--first-octonary)' }}>{zahtjev.address}</p>
              </div>
              {zahtjev.podnosilac && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                  <p className="text-sm" style={{ color: 'var(--first-octonary)' }}>
                    {zahtjev.podnosilac.ime} {zahtjev.podnosilac.prezime}
                    {zahtjev.podnosilac.broj_telefona && ` · ${zahtjev.podnosilac.broj_telefona}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Korak 2: Procjena ─────────────────────────────────────────────── */}
      {korak === 2 && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h2 className="mb-4 text-base font-bold" style={{ color: 'var(--first-octonary)' }}>
              Procjena i organizacija
            </h2>

            {/* Procijenjeno trajanje */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                <Clock className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                Procijenjeno trajanje (minuta)
                <span className="font-normal" style={{ color: 'var(--first-nonary)' }}>(opciono)</span>
              </label>
              <input
                type="number"
                min={5}
                max={1440}
                value={wz.procijenjeno_trajanje ?? ''}
                onChange={(e) => azuriraj({ procijenjeno_trajanje: e.target.value ? parseInt(e.target.value, 10) : null })}
                placeholder="npr. 90"
                className="w-full max-w-xs rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.45)', backgroundColor: 'rgb(255 255 255 / 0.8)', color: 'var(--first-octonary)' }}
              />
            </div>

            {/* Napomene za servisera */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                <FileText className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                Napomene za servisera
                <span className="font-normal" style={{ color: 'var(--first-nonary)' }}>(opciono)</span>
              </label>
              <textarea
                rows={3}
                value={wz.napomene}
                onChange={(e) => azuriraj({ napomene: e.target.value })}
                placeholder="Posebne upute, oprema, kontakt lica, pristupni kodovi..."
                className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.45)', backgroundColor: 'rgb(255 255 255 / 0.8)', color: 'var(--first-octonary)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── Korak 3: Planiranje termina ───────────────────────────────────── */}
      {korak === 3 && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h2 className="mb-4 text-base font-bold" style={{ color: 'var(--first-octonary)' }}>
              Planiranje termina
            </h2>

            {/* Referenca korisnikovog termina */}
            {zahtjev.preferred_schedule?.termini?.length ? (
              <div
                className="mb-4 rounded-xl p-3 text-xs"
                style={{ backgroundColor: 'rgb(var(--first-septenary-rgb)/0.12)', color: 'var(--first-octonary)' }}
              >
                <p className="mb-1 font-semibold" style={{ color: 'var(--first-nonary)' }}>
                  Korisnik predlaže:
                </p>
                {zahtjev.preferred_schedule.termini.map((t, i) => (
                  <p key={i}>{t.date} · {t.from} – {t.to}</p>
                ))}
              </div>
            ) : null}

            {/* Brze akcije */}
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                { oznaka: 'Danas',  datum: new Date().toISOString().slice(0, 10) },
                { oznaka: 'Sutra',  datum: new Date(Date.now() + 86400000).toISOString().slice(0, 10) },
              ].map(({ oznaka, datum }) => (
                <button
                  key={oznaka}
                  type="button"
                  onClick={() => azuriraj({ termin_pocetak_datum: datum })}
                  className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    borderColor:     wz.termin_pocetak_datum === datum ? 'var(--first-primary)' : 'rgb(var(--first-quaternary-rgb)/0.4)',
                    backgroundColor: wz.termin_pocetak_datum === datum ? 'rgb(var(--first-primary-rgb)/0.08)' : 'transparent',
                    color:           wz.termin_pocetak_datum === datum ? 'var(--first-primary)' : 'var(--first-nonary)',
                  }}
                >
                  {oznaka}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {/* Datum */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                  <Calendar className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                  Datum intervencije *
                </label>
                <input
                  type="date"
                  value={wz.termin_pocetak_datum}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => azuriraj({ termin_pocetak_datum: e.target.value })}
                  className="w-full max-w-xs rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.45)', backgroundColor: 'rgb(255 255 255 / 0.8)', color: 'var(--first-octonary)' }}
                />
              </div>

              {/* Vremenski raspon */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                  <Clock className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                  Vremenski raspon *
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs" style={{ color: 'var(--first-nonary)' }}>Od</label>
                    <input
                      type="time"
                      value={wz.termin_pocetak_vrijemeOd}
                      onChange={(e) => azuriraj({ termin_pocetak_vrijemeOd: e.target.value })}
                      className="rounded-xl border px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.45)', backgroundColor: 'rgb(255 255 255 / 0.8)', color: 'var(--first-octonary)' }}
                    />
                  </div>
                  <span className="mt-4 text-sm" style={{ color: 'var(--first-quinary)' }}>—</span>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs" style={{ color: 'var(--first-nonary)' }}>Do</label>
                    <input
                      type="time"
                      value={wz.termin_pocetak_vrijemeDo}
                      onChange={(e) => azuriraj({ termin_pocetak_vrijemeDo: e.target.value })}
                      className="rounded-xl border px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.45)', backgroundColor: 'rgb(255 255 255 / 0.8)', color: 'var(--first-octonary)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Korak 4: Dodjela servisera ────────────────────────────────────── */}
      {korak === 4 && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-5" style={cardStyle}>
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" style={{ color: 'var(--first-nonary)' }} />
              <h2 className="text-base font-bold" style={{ color: 'var(--first-octonary)' }}>
                Odaberite servisera
              </h2>
            </div>

            {serviseri.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Briefcase className="h-9 w-9" style={{ color: 'var(--first-quinary)' }} />
                <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
                  Nema dostupnih verificiranih servisera.
                </p>
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

      {/* ─── Korak 5: Potvrda ──────────────────────────────────────────────── */}
      {korak === 5 && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h2 className="mb-4 text-base font-bold" style={{ color: 'var(--first-octonary)' }}>
              Pregled plana — potvrda
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start justify-between gap-4 rounded-xl border p-3"
                style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.35)' }}>
                <span style={{ color: 'var(--first-nonary)' }}>Zahtjev</span>
                <span className="font-medium text-right" style={{ color: 'var(--first-octonary)' }}>
                  {naslov}
                </span>
              </div>

              {odabraniServiser && (
                <div className="flex items-center justify-between rounded-xl border p-3"
                  style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.35)' }}>
                  <span style={{ color: 'var(--first-nonary)' }}>Serviser</span>
                  <span className="font-medium" style={{ color: 'var(--first-octonary)' }}>
                    {odabraniServiser.ime} {odabraniServiser.prezime}
                  </span>
                </div>
              )}

              {wz.termin_pocetak_datum && (
                <div className="flex items-center justify-between rounded-xl border p-3"
                  style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.35)' }}>
                  <span style={{ color: 'var(--first-nonary)' }}>Termin</span>
                  <span className="font-medium" style={{ color: 'var(--first-octonary)' }}>
                    {wz.termin_pocetak_datum}
                    {wz.termin_pocetak_vrijemeOd && ` · ${wz.termin_pocetak_vrijemeOd}`}
                    {wz.termin_pocetak_vrijemeDo && ` – ${wz.termin_pocetak_vrijemeDo}`}
                  </span>
                </div>
              )}

              {wz.procijenjeno_trajanje && (
                <div className="flex items-center justify-between rounded-xl border p-3"
                  style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.35)' }}>
                  <span style={{ color: 'var(--first-nonary)' }}>Trajanje</span>
                  <span className="font-medium" style={{ color: 'var(--first-octonary)' }}>
                    {wz.procijenjeno_trajanje} min
                  </span>
                </div>
              )}

              {wz.napomene && (
                <div className="rounded-xl border p-3"
                  style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.35)' }}>
                  <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--first-nonary)' }}>
                    Napomene za servisera:
                  </p>
                  <p style={{ color: 'var(--first-octonary)' }}>{wz.napomene}</p>
                </div>
              )}
            </div>

            {!wz.serviser_id && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: 'rgba(220,38,38,0.3)', backgroundColor: 'rgba(220,38,38,0.05)', color: '#DC2626' }}>
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                Morate odabrati servisera u koraku 4.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Navigacija ─────────────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between gap-3">
        {korak > 1 ? (
          <Button variant="secondary" size="md" onClick={prethodni} disabled={jeSlanje}>
            <ArrowLeft className="h-4 w-4" /> Nazad
          </Button>
        ) : (
          <div />
        )}

        {korak < 5 ? (
          <Button size="md" onClick={sljedeci}>
            Dalje <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={dodijeli}
            isLoading={jeSlanje}
            loadingText="Dodjela..."
            disabled={!wz.serviser_id}
          >
            <Check className="h-4 w-4" />
            Dodijeli intervenciju
          </Button>
        )}
      </div>
    </AppShell>
  );
}
