'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Phone, Calendar, Clock, ClipboardCheck,
  CheckCircle2, Truck, UserX, AlertTriangle, FileText, History,
  RefreshCw,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { StatusBadge } from '@/components/servisirane/ZahtjevKartica';
import { AktivnostiTimeline } from '@/components/serviser/AktivnostiTimeline';
import { EvidencijaRadaModal } from '@/components/serviser/EvidencijaRadaModal';
import type { ServisniZahtjev, WorkEvidence, InterventionActivity } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formDatumVrijeme(iso: string): string {
  return new Date(iso).toLocaleString('bs-BA', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function trajanjeOznaka(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

// ─── Akcije na osnovu statusa ─────────────────────────────────────────────────

interface AkcijeProps {
  status:     string;
  zahtjevId:  number;
  onRefresh:  () => void;
  onEvidencija: () => void;
}

function AkcijeServiser({ status, zahtjevId, onRefresh, onEvidencija }: AkcijeProps) {
  const [showOdbij, setShowOdbij] = useState(false);
  const [razlog,    setRazlog]    = useState('');
  const [jeSlanje,  setJeSlanje]  = useState(false);
  const [greska,    setGreska]    = useState<string | null>(null);

  async function promijeniStatus(action: 'prihvati' | 'pocni', razlogOdbijanja?: string) {
    setJeSlanje(true);
    setGreska(null);
    try {
      const body: Record<string, string> = { action };
      if (razlogOdbijanja) body.razlog = razlogOdbijanja;
      const r = await fetch(`/api/serviser/intervencije/${zahtjevId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška.');
      onRefresh();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška.');
    } finally {
      setJeSlanje(false);
    }
  }

  async function odbijSaRazlogom() {
    if (razlog.trim().length < 10) { setGreska('Razlog mora imati najmanje 10 karaktera.'); return; }
    setJeSlanje(true);
    setGreska(null);
    try {
      const r = await fetch(`/api/serviser/intervencije/${zahtjevId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'odbij', razlog: razlog.trim() }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška.');
      onRefresh();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška.');
    } finally {
      setJeSlanje(false);
    }
  }

  if (greska) {
    return (
      <div className="flex flex-col gap-3">
        <AlertMessage variant="error" message={greska} />
        <Button variant="ghost" size="sm" onClick={() => setGreska(null)}>Zatvori</Button>
      </div>
    );
  }

  if (status === 'dodijeljeno') {
    if (showOdbij) {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
            Razlog odbijanja *
          </p>
          <textarea
            rows={3}
            value={razlog}
            onChange={(e) => setRazlog(e.target.value)}
            placeholder="Objasnite zašto odbijate ovaj zadatak (min. 10 karaktera)..."
            className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none"
            style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.45)', color: 'var(--first-octonary)', backgroundColor: 'rgb(255 255 255 / 0.8)' }}
          />
          <div className="flex gap-2">
            <Button variant="danger" size="md" onClick={odbijSaRazlogom} isLoading={jeSlanje} loadingText="Odbijanje...">
              <UserX className="h-4 w-4" />
              Potvrdi odbijanje
            </Button>
            <Button variant="ghost" size="md" onClick={() => setShowOdbij(false)} disabled={jeSlanje}>
              Odustani
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-3">
        <Button size="md" onClick={() => promijeniStatus('prihvati')} isLoading={jeSlanje} loadingText="Prihvatanje...">
          <CheckCircle2 className="h-4 w-4" />
          Prihvati zadatak
        </Button>
        <Button variant="secondary" size="md" onClick={() => setShowOdbij(true)} disabled={jeSlanje}>
          <UserX className="h-4 w-4" />
          Odbij zadatak
        </Button>
      </div>
    );
  }

  if (status === 'u_radu') {
    return (
      <div className="flex flex-wrap gap-3">
        <Button size="md" onClick={() => promijeniStatus('pocni')} isLoading={jeSlanje} loadingText="Ažuriranje...">
          <Truck className="h-4 w-4" />
          Počni intervenciju
        </Button>
        <Button variant="secondary" size="md" onClick={onEvidencija}>
          <ClipboardCheck className="h-4 w-4" />
          Evidentiraj rad
        </Button>
      </div>
    );
  }

  if (status === 'u_izvrsenju') {
    return (
      <Button size="md" onClick={onEvidencija}>
        <ClipboardCheck className="h-4 w-4" />
        Evidentiraj rad
      </Button>
    );
  }

  return null;
}

// ─── Stranica ─────────────────────────────────────────────────────────────────

interface IntervencijaDetalji extends ServisniZahtjev {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
}

export default function ServiserIntervencijaDetaljiPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();

  const [zahtjev,     setZahtjev]     = useState<IntervencijaDetalji | null>(null);
  const [evidencije,  setEvidencije]  = useState<WorkEvidence[]>([]);
  const [aktivnosti,  setAktivnosti]  = useState<InterventionActivity[]>([]);
  const [ucitava,     setUcitava]     = useState(true);
  const [greska,      setGreska]      = useState<string | null>(null);
  const [pokaziEvid,  setPokaziEvid]  = useState(false);

  async function ucitaj() {
    setUcitava(true);
    setGreska(null);
    try {
      const r = await fetch(`/api/serviser/intervencije/${id}`, { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Zahtjev nije pronađen.');
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
      <AppShell uloga="serviser">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Učitavanje...</p>
        </div>
      </AppShell>
    );
  }

  if (greska || !zahtjev) {
    return (
      <AppShell uloga="serviser">
        <AlertMessage variant="error" message={greska ?? 'Intervencija nije pronađena.'} />
        <Link href="/serviser/zadaci">
          <Button variant="secondary" size="md" className="mt-4">
            <ArrowLeft className="h-4 w-4" /> Nazad
          </Button>
        </Link>
      </AppShell>
    );
  }

  const kat    = labelKategorije(zahtjev);
  const naslov = kat.podkategorija ? `${kat.glavna} — ${kat.podkategorija}` : kat.glavna;

  const SEKCIJA_STYL = {
    backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
    border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
  };

  return (
    <AppShell uloga="serviser">
      {/* Zaglavlje */}
      <div className="mb-6">
        <Link
          href="/serviser/zadaci"
          className="mb-2 inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: 'var(--first-nonary)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Zadaci
        </Link>
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
              {naslov}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status={zahtjev.status} />
              {zahtjev.final_priority && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.25)' }}
                >
                  {zahtjev.final_priority}
                </span>
              )}
              {zahtjev.is_premium && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(220,38,38,0.12)', color: '#B91C1C', border: '1px solid rgba(220,38,38,0.25)' }}
                >
                  Premium HITNO
                </span>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={ucitaj}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5">

        {/* Akcije */}
        {['dodijeljeno', 'u_radu', 'u_izvrsenju'].includes(zahtjev.status) && (
          <div
            className="rounded-2xl p-5"
            style={{
              ...SEKCIJA_STYL,
              borderColor: zahtjev.status === 'dodijeljeno' ? 'rgba(217,119,6,0.4)' : 'rgba(37,99,235,0.3)',
              backgroundColor: zahtjev.status === 'dodijeljeno' ? 'rgba(217,119,6,0.04)' : 'rgba(37,99,235,0.03)',
            }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
              {zahtjev.status === 'dodijeljeno'
                ? 'Čeka vaše prihvatanje'
                : zahtjev.status === 'u_radu'
                ? 'Prihvaćeno — pokrenite intervenciju'
                : 'Intervencija u toku — evidentirajte rad'}
            </p>
            <AkcijeServiser
              status={zahtjev.status}
              zahtjevId={zahtjev.id}
              onRefresh={ucitaj}
              onEvidencija={() => setPokaziEvid(true)}
            />
          </div>
        )}

        {/* Detalji */}
        <div className="rounded-2xl p-5" style={SEKCIJA_STYL}>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
            Detalji zahtjeva
          </p>
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
            {zahtjev.podnosilac?.broj_telefona && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                <a
                  href={`tel:${zahtjev.podnosilac.broj_telefona}`}
                  className="text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: 'var(--first-secondary)' }}
                >
                  {zahtjev.podnosilac.broj_telefona}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Planirani termin */}
        {(zahtjev.termin_planirani_pocetak || zahtjev.dispecer_napomene) && (
          <div className="rounded-2xl p-5" style={SEKCIJA_STYL}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
              Plan dispečera
            </p>
            <div className="flex flex-col gap-3">
              {zahtjev.termin_planirani_pocetak && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>Planirani početak</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
                      {formDatumVrijeme(zahtjev.termin_planirani_pocetak)}
                    </p>
                  </div>
                </div>
              )}
              {zahtjev.termin_planirani_kraj && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>Planirani kraj</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
                      {formDatumVrijeme(zahtjev.termin_planirani_kraj)}
                    </p>
                  </div>
                </div>
              )}
              {zahtjev.procijenjeno_trajanje && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-nonary)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>Procijenjeno trajanje</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
                      {trajanjeOznaka(zahtjev.procijenjeno_trajanje)}
                    </p>
                  </div>
                </div>
              )}
              {zahtjev.dispecer_napomene && (
                <div
                  className="rounded-xl p-3 text-sm"
                  style={{ backgroundColor: 'rgb(var(--first-septenary-rgb)/0.12)', color: 'var(--first-octonary)' }}
                >
                  <p className="mb-1 text-xs font-semibold" style={{ color: 'var(--first-nonary)' }}>
                    Napomene dispečera:
                  </p>
                  {zahtjev.dispecer_napomene}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evidencija rada */}
        {evidencije.length > 0 && (
          <div className="rounded-2xl p-5" style={SEKCIJA_STYL}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
              Evidencija rada ({evidencije.length})
            </p>
            <div className="flex flex-col gap-3">
              {evidencije.map((e) => (
                <div
                  key={e.id}
                  className="rounded-xl border p-4"
                  style={{ borderColor: 'rgb(var(--first-quaternary-rgb)/0.35)', backgroundColor: 'rgb(255 255 255 / 0.6)' }}
                >
                  <p className="text-sm" style={{ color: 'var(--first-octonary)' }}>{e.opis_rada}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 text-xs" style={{ color: 'var(--first-nonary)' }}>
                    {e.trajanje_minuta && <span>{trajanjeOznaka(e.trajanje_minuta)}</span>}
                    {e.materijal && <span>Materijal: {e.materijal}</span>}
                    <span>{new Date(e.created_at).toLocaleDateString('bs-BA')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historija aktivnosti */}
        <div className="rounded-2xl p-5" style={SEKCIJA_STYL}>
          <div className="mb-4 flex items-center gap-2">
            <History className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--first-nonary)' }}>
              Historija aktivnosti
            </p>
          </div>
          <AktivnostiTimeline aktivnosti={aktivnosti} />
        </div>
      </div>

      {/* Modal za evidenciju */}
      {pokaziEvid && (
        <EvidencijaRadaModal
          zahtjevId={zahtjev.id}
          onZatvori={() => setPokaziEvid(false)}
          onUspjeh={() => { setPokaziEvid(false); ucitaj(); }}
        />
      )}
    </AppShell>
  );
}
