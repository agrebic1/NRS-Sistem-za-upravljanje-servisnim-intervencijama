'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Phone, Calendar, Clock,
  User, FileText, AlertTriangle, CheckCircle2,
  MessageSquare, ExternalLink, RefreshCw,
  ChevronRight, Wrench, ClipboardList,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { StatusBadge } from '@/components/servisirane/ZahtjevKartica';
import { AktivnostiTimeline } from '@/components/serviser/AktivnostiTimeline';
import { IntervencijaWorkflowTimeline } from '@/components/dispecer/IntervencijaWorkflowProgress';
import type { ServisniZahtjev, WorkEvidence, InterventionActivity } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';

// ─── Tip za detalje ───────────────────────────────────────────────────────────

interface IntervencijaDetalji extends ServisniZahtjev {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
  serviser?:  { id: string; ime: string; prezime: string; broj_telefona?: string | null } | null;
}

// ─── Helperi ──────────────────────────────────────────────────────────────────

function formDatumVrijeme(iso: string): string {
  return new Date(iso).toLocaleString('bs-BA', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function trajanjeLabel(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function prioritetBoja(p: string | null): string {
  switch ((p ?? '').toUpperCase()) {
    case 'HITNO':    return '#DC2626';
    case 'KRITIČNO': return '#991B1B';
    case 'VISOKO':   return '#EA580C';
    case 'SREDNJE':  return '#D97706';
    default:         return '#2563EB';
  }
}

function statusBoja(s: string): string {
  switch (s) {
    case 'dodijeljeno':  return '#D97706';
    case 'u_radu':       return '#2563EB';
    case 'u_izvrsenju':  return '#22C55E';
    case 'zavrseno':     return 'var(--first-secondary)';
    default:             return '#617089';
  }
}

// ─── Time-on-task indikator ───────────────────────────────────────────────────

function TimeOnTask({
  terminPocetak,
  procijenjeno,
  status,
}: {
  terminPocetak?: string | null;
  procijenjeno?:  number | null;
  status:         string;
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!terminPocetak || ['zavrseno', 'otkazano', 'odbijeno'].includes(status)) return;
    const start = new Date(terminPocetak).getTime();
    const update = () => setElapsed(Math.max(0, Math.floor((Date.now() - start) / 60_000)));
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, [terminPocetak, status]);

  if (!terminPocetak || ['zavrseno', 'otkazano', 'odbijeno'].includes(status)) return null;

  const jePrekoracio = procijenjeno ? elapsed > procijenjeno : false;
  const postotak     = procijenjeno ? Math.min(100, Math.round((elapsed / procijenjeno) * 100)) : null;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: jePrekoracio ? 'rgba(220,38,38,0.05)' : 'rgb(var(--first-primary-rgb)/0.04)',
        border: jePrekoracio ? '1px solid rgba(220,38,38,0.2)' : '1px solid rgb(var(--first-primary-rgb)/0.15)',
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 flex-shrink-0" style={{ color: jePrekoracio ? '#DC2626' : 'var(--first-secondary)' }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
              Trajanje intervencije
            </p>
            <p className="text-lg font-bold tabular-nums" style={{ color: jePrekoracio ? '#DC2626' : 'var(--first-octonary)' }}>
              {trajanjeLabel(elapsed)}
            </p>
          </div>
        </div>
        {procijenjeno && (
          <div className="text-right">
            <p className="text-[10px]" style={{ color: 'var(--first-nonary)' }}>Procijenjeno</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--first-nonary)' }}>
              {trajanjeLabel(procijenjeno)}
            </p>
          </div>
        )}
      </div>

      {postotak !== null && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'rgb(var(--first-quaternary-rgb)/0.3)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${postotak}%`,
                backgroundColor: jePrekoracio ? '#DC2626' : postotak > 75 ? '#D97706' : '#22C55E',
              }}
            />
          </div>
          {jePrekoracio && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold" style={{ color: '#DC2626' }}>
              <AlertTriangle className="h-3 w-3" />
              Prekoračeno procijenjeno trajanje za {trajanjeLabel(elapsed - (procijenjeno ?? 0))}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stranica ─────────────────────────────────────────────────────────────────

export default function DispecerIntervencijaDetaljiPage() {
  const { id } = useParams<{ id: string }>();

  const [zahtjev,     setZahtjev]     = useState<IntervencijaDetalji | null>(null);
  const [evidencije,  setEvidencije]  = useState<WorkEvidence[]>([]);
  const [aktivnosti,  setAktivnosti]  = useState<InterventionActivity[]>([]);
  const [ucitava,     setUcitava]     = useState(true);
  const [greska,      setGreska]      = useState<string | null>(null);

  async function ucitaj() {
    setUcitava(true);
    setGreska(null);
    try {
      const r = await fetch(`/api/dispecer/zahtjevi/${id}`, { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Intervencija nije pronađena.');
      setZahtjev(d.zahtjev);
      setEvidencije(d.evidencije ?? []);
      setAktivnosti(d.aktivnosti ?? []);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri učitavanju.');
    } finally {
      setUcitava(false);
    }
  }

  useEffect(() => { ucitaj(); }, [id]);

  // ─── Loading ────────────────────────────────────────────────────────────────

  if (ucitava) {
    return (
      <AppShell uloga="dispecer">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
              style={{ borderTopColor: 'var(--first-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Učitavanje intervencije...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (greska || !zahtjev) {
    return (
      <AppShell uloga="dispecer">
        <AlertMessage variant="error" message={greska ?? 'Intervencija nije pronađena.'} />
        <Link href="/dispecer/intervencije">
          <Button variant="secondary" size="md" className="mt-4">
            <ArrowLeft className="h-4 w-4" /> Nazad
          </Button>
        </Link>
      </AppShell>
    );
  }

  const kat    = labelKategorije(zahtjev);
  const naslov = kat.podkategorija ? `${kat.glavna} — ${kat.podkategorija}` : kat.glavna;
  const pboja  = prioritetBoja(zahtjev.final_priority);
  const sboja  = statusBoja(zahtjev.status);
  const jeHitna = (zahtjev.urgency_score ?? 0) >= 75 || Boolean(zahtjev.is_premium);

  const sekcija = {
    backgroundColor: 'rgb(var(--first-quinary-rgb)/0.18)',
    border:          '1px solid rgb(var(--first-quaternary-rgb)/0.32)',
  };

  return (
    <AppShell uloga="dispecer">
      {/* ─── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2 text-sm" style={{ color: 'var(--first-nonary)' }}>
        <Link href="/dispecer" className="hover:opacity-70 transition-opacity">Kontrolna ploča</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/dispecer/intervencije" className="hover:opacity-70 transition-opacity">Intervencije</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium" style={{ color: 'var(--first-octonary)' }}>#{id}</span>
      </div>

      {/* ─── Sticky header ──────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 -mx-4 mb-6 rounded-2xl px-4 py-4 sm:-mx-6 sm:px-6"
        style={{
          backgroundColor: jeHitna ? 'rgba(220,38,38,0.04)' : 'rgb(var(--first-quinary-rgb)/0.92)',
          border: jeHitna ? '1px solid rgba(220,38,38,0.18)' : '1px solid rgb(var(--first-quaternary-rgb)/0.35)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Badges */}
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold tabular-nums" style={{ color: 'var(--first-nonary)' }}>
                #{zahtjev.id}
              </span>
              <StatusBadge status={zahtjev.status} />
              {zahtjev.is_premium && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.25)' }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  Premium HITNO
                </span>
              )}
              {zahtjev.final_priority && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: `color-mix(in srgb, ${pboja} 10%, transparent)`, color: pboja }}
                >
                  {zahtjev.final_priority}
                </span>
              )}
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: `color-mix(in srgb, ${sboja} 12%, transparent)`, color: sboja }}
              >
                {zahtjev.status === 'dodijeljeno' ? 'Dodijeljeno'
                  : zahtjev.status === 'u_radu' ? 'Na putu'
                  : zahtjev.status === 'u_izvrsenju' ? 'Na terenu'
                  : zahtjev.status === 'zavrseno' ? 'Završeno'
                  : zahtjev.status}
              </span>
            </div>
            <h1 className="text-lg font-bold leading-snug" style={{ color: 'var(--first-octonary)' }}>
              {naslov}
            </h1>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs" style={{ color: 'var(--first-nonary)' }}>
              {zahtjev.serviser && (
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {zahtjev.serviser.ime} {zahtjev.serviser.prezime}
                </span>
              )}
              {zahtjev.termin_planirani_pocetak && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formDatumVrijeme(zahtjev.termin_planirani_pocetak)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="line-clamp-1 max-w-[28rem]">{zahtjev.address}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={ucitaj} title="Osvježi">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Link href={`/dispecer/zahtjevi/${zahtjev.id}`}>
              <Button variant="secondary" size="sm">
                Obrada zahtjeva
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Glavni layout (3 kolone) ────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

        {/* ── LIJEVI PANEL: Workflow timeline ─────────────────────────────── */}
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <div className="rounded-2xl p-5" style={sekcija}>
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
                Tok intervencije
              </p>
            </div>
            <IntervencijaWorkflowTimeline
              status={zahtjev.status}
              terminPocetak={zahtjev.termin_planirani_pocetak}
              radEvidentiran={zahtjev.rad_evidentiran_at}
            />
          </div>
        </div>

        {/* ── CENTRALNI PANEL: Operativno stanje ──────────────────────────── */}
        <div className="min-w-0 flex-1 flex flex-col gap-5">

          {/* Time-on-task */}
          {['u_radu', 'u_izvrsenju'].includes(zahtjev.status) && (
            <TimeOnTask
              terminPocetak={zahtjev.termin_planirani_pocetak}
              procijenjeno={zahtjev.procijenjeno_trajanje}
              status={zahtjev.status}
            />
          )}

          {/* Opis problema */}
          <div className="rounded-2xl p-5" style={sekcija}>
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
                Opis problema
              </p>
            </div>
            <div
              className="rounded-xl border-l-4 px-4 py-3 text-sm leading-relaxed"
              style={{ borderLeftColor: 'var(--first-secondary)', backgroundColor: 'rgb(255 255 255 / 0.65)', color: 'var(--first-octonary)' }}
            >
              {zahtjev.description}
            </div>
          </div>

          {/* Napomene dispečera */}
          {zahtjev.dispecer_napomene && (
            <div className="rounded-2xl p-5" style={sekcija}>
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
                  Napomene dispečera
                </p>
              </div>
              <div
                className="rounded-xl px-4 py-3 text-sm leading-relaxed"
                style={{ backgroundColor: 'rgb(var(--first-septenary-rgb)/0.1)', border: '1px solid rgb(var(--first-septenary-rgb)/0.22)', color: 'var(--first-octonary)' }}
              >
                {zahtjev.dispecer_napomene}
              </div>
            </div>
          )}

          {/* Evidencija rada */}
          {evidencije.length > 0 && (
            <div className="rounded-2xl p-5" style={sekcija}>
              <div className="mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
                  Evidencija rada ({evidencije.length})
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {evidencije.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-xl border p-4"
                    style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.3)', backgroundColor: 'rgb(255 255 255 / 0.65)' }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--first-octonary)' }}>{e.opis_rada}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                      {e.trajanje_minuta && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{trajanjeLabel(e.trajanje_minuta)}
                        </span>
                      )}
                      {e.materijal && <span>Materijal: {e.materijal}</span>}
                      <span>{new Date(e.created_at).toLocaleDateString('bs-BA')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historija aktivnosti */}
          {aktivnosti.length > 0 && (
            <div className="rounded-2xl p-5" style={sekcija}>
              <div className="mb-3 flex items-center gap-2">
                <ClipboardList className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
                  Historija aktivnosti
                </p>
              </div>
              <AktivnostiTimeline aktivnosti={aktivnosti} />
            </div>
          )}
        </div>

        {/* ── DESNI PANEL: Mapa + serviser info ───────────────────────────── */}
        <div className="lg:w-60 xl:w-72 flex-shrink-0 flex flex-col gap-4">

          {/* Lokacija */}
          <div className="rounded-2xl overflow-hidden" style={sekcija}>
            {/* Map placeholder */}
            <div
              className="relative flex h-28 items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #2563eb 100%)' }}
            >
              <div className="absolute inset-0 opacity-15"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)' }}
              />
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg"
                style={{ backgroundColor: '#fff' }}
              >
                <MapPin className="h-5 w-5" style={{ color: '#DC2626' }} />
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--first-nonary)' }}>Lokacija</p>
              <p className="text-sm font-semibold leading-snug mb-3" style={{ color: 'var(--first-octonary)' }}>
                {zahtjev.address}
              </p>
              <a
                href={zahtjev.latitude && zahtjev.longitude
                  ? `https://www.google.com/maps/search/?api=1&query=${zahtjev.latitude},${zahtjev.longitude}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(zahtjev.address)}`}
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

          {/* Serviser */}
          {zahtjev.serviser ? (
            <div className="rounded-2xl p-4" style={sekcija}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>Serviser</p>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                  style={{ backgroundColor: 'rgb(var(--first-secondary-rgb)/0.12)', color: 'var(--first-secondary)' }}
                >
                  {zahtjev.serviser.ime.charAt(0)}{zahtjev.serviser.prezime.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--first-octonary)' }}>
                    {zahtjev.serviser.ime} {zahtjev.serviser.prezime}
                  </p>
                  {zahtjev.serviser.broj_telefona && (
                    <a
                      href={`tel:${zahtjev.serviser.broj_telefona}`}
                      className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70 mt-0.5"
                      style={{ color: 'var(--first-secondary)' }}
                    >
                      <Phone className="h-3 w-3" />
                      {zahtjev.serviser.broj_telefona}
                    </a>
                  )}
                </div>
              </div>

              <div
                className="mt-3 rounded-xl px-3 py-2 text-xs font-semibold"
                style={{
                  backgroundColor: zahtjev.status === 'u_izvrsenju'
                    ? 'rgba(34,197,94,0.1)'
                    : zahtjev.status === 'u_radu'
                      ? 'rgba(37,99,235,0.08)'
                      : 'rgb(var(--first-quinary-rgb)/0.4)',
                  color: zahtjev.status === 'u_izvrsenju'
                    ? '#16A34A'
                    : zahtjev.status === 'u_radu'
                      ? '#2563EB'
                      : 'var(--first-nonary)',
                }}
              >
                {zahtjev.status === 'u_izvrsenju' ? 'Na lokaciji — radovi u toku'
                  : zahtjev.status === 'u_radu' ? 'Na putu do lokacije'
                  : zahtjev.status === 'dodijeljeno' ? 'Čeka prihvatanje'
                  : 'Status nije poznat'}
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-4"
              style={{ ...sekcija, borderColor: 'rgba(217,119,6,0.35)', backgroundColor: 'rgba(217,119,6,0.04)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4" style={{ color: '#D97706' }} />
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#D97706' }}>Serviser</p>
              </div>
              <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Serviser nije dodijeljen</p>
              <Link href={`/dispecer/planiranje/${zahtjev.id}`} className="mt-2 block">
                <Button size="sm" className="w-full">
                  Dodijeli servisera
                </Button>
              </Link>
            </div>
          )}

          {/* Korisnik */}
          {zahtjev.podnosilac && (
            <div className="rounded-2xl p-4" style={sekcija}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>Podnosilac zahtjeva</p>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold"
                  style={{ backgroundColor: 'rgb(var(--first-quinary-rgb)/0.45)', color: 'var(--first-nonary)' }}
                >
                  {zahtjev.podnosilac.ime.charAt(0)}{zahtjev.podnosilac.prezime.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--first-octonary)' }}>
                    {zahtjev.podnosilac.ime} {zahtjev.podnosilac.prezime}
                  </p>
                  {zahtjev.podnosilac.broj_telefona && (
                    <a
                      href={`tel:${zahtjev.podnosilac.broj_telefona}`}
                      className="flex items-center gap-1 text-xs mt-0.5 transition-opacity hover:opacity-70"
                      style={{ color: 'var(--first-secondary)' }}
                    >
                      <Phone className="h-3 w-3" />
                      {zahtjev.podnosilac.broj_telefona}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Termin */}
          {(zahtjev.termin_planirani_pocetak || zahtjev.procijenjeno_trajanje) && (
            <div className="rounded-2xl p-4" style={sekcija}>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>Termin</p>
              <div className="flex flex-col gap-2 text-sm">
                {zahtjev.termin_planirani_pocetak && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                    <span style={{ color: 'var(--first-octonary)' }}>
                      {formDatumVrijeme(zahtjev.termin_planirani_pocetak)}
                    </span>
                  </div>
                )}
                {zahtjev.termin_planirani_kraj && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                    <span style={{ color: 'var(--first-octonary)' }}>
                      {formDatumVrijeme(zahtjev.termin_planirani_kraj)}
                    </span>
                  </div>
                )}
                {zahtjev.procijenjeno_trajanje && (
                  <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                    Procijenjeno: {trajanjeLabel(zahtjev.procijenjeno_trajanje)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
