'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ClipboardList, Clock, Wrench, ChevronRight, AlertTriangle,
  User, RefreshCw, MapPin, Phone, CheckCircle2, XCircle, BellOff,
} from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { UrgencyBadge } from '@/components/servisirane/UrgencyBadge';
import { StatusBadge } from '@/components/servisirane/ZahtjevKartica';
import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { kategorizirajHitnost } from '@/lib/servisirane/urgency';
import { kreirajKlijenta } from '@/lib/supabase/klijent';

// ─── Tipovi ───────────────────────────────────────────────────────────────────

interface ZahtjevSaPodnosiocem extends ServisniZahtjev {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
}

const PRIORITETI = ['NISKO', 'SREDNJE', 'VISOKO', 'KRITIČNO'] as const;
type Prioritet = typeof PRIORITETI[number];

const PRIORITET_BOJE: Record<Prioritet, string> = {
  NISKO:    '#64748b',
  SREDNJE:  '#D97706',
  VISOKO:   '#EA580C',
  KRITIČNO: '#DC2626',
};

// ─── Override panel ───────────────────────────────────────────────────────────

function OverridePanel({
  zahtjev,
  onZatvori,
  onAkcija,
}: {
  zahtjev:  ZahtjevSaPodnosiocem;
  onZatvori: () => void;
  onAkcija:  () => void;
}) {
  const sistemskiPrioritet = kategorizirajHitnost(zahtjev.system_score || zahtjev.urgency_score);
  const [odabranPrioritet, setOdabranPrioritet] = useState<Prioritet>(sistemskiPrioritet as Prioritet);
  const [jeOdbijanje,      setJeOdbijanje]       = useState(false);
  const [razlogOdbijanja,  setRazlogOdbijanja]   = useState('');
  const [jeSlanje,         setJeSlanje]          = useState(false);
  const [greska,           setGreska]            = useState<string | null>(null);

  async function potvrdi() {
    setJeSlanje(true);
    setGreska(null);
    try {
      const r = await fetch(`/api/dispecer/zahtjevi/${zahtjev.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'potvrdi', final_priority: odabranPrioritet }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri potvrdi.');
      onAkcija();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška.');
    } finally {
      setJeSlanje(false);
    }
  }

  async function odbij() {
    if (!razlogOdbijanja.trim() || razlogOdbijanja.trim().length < 5) {
      setGreska('Unesite razlog odbijanja (min. 5 karaktera).');
      return;
    }
    setJeSlanje(true);
    setGreska(null);
    try {
      const r = await fetch(`/api/dispecer/zahtjevi/${zahtjev.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'odbij', rejection_reason: razlogOdbijanja }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri odbijanju.');
      onAkcija();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška.');
    } finally {
      setJeSlanje(false);
    }
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.18)',
        border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.4)',
      }}
    >
      {greska && <div className="mb-4"><AlertMessage variant="error" message={greska} /></div>}

      {!jeOdbijanje ? (
        <>
          {/* Sistem prijedlog */}
          <div
            className="mb-4 flex items-center justify-between rounded-xl px-4 py-2.5"
            style={{ backgroundColor: `${PRIORITET_BOJE[sistemskiPrioritet as Prioritet]}15`, border: `1px solid ${PRIORITET_BOJE[sistemskiPrioritet as Prioritet]}30` }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>
              Sistem predlaže:
            </span>
            <span className="text-sm font-bold" style={{ color: PRIORITET_BOJE[sistemskiPrioritet as Prioritet] }}>
              {sistemskiPrioritet}
            </span>
          </div>

          {/* Override prioriteta */}
          <p className="mb-2 text-xs font-semibold" style={{ color: 'var(--first-nonary)' }}>
            Konačni prioritet
          </p>
          <div className="mb-4 flex gap-2">
            {PRIORITETI.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setOdabranPrioritet(p)}
                className="flex-1 rounded-xl border py-1.5 text-xs font-semibold transition-all duration-150"
                style={{
                  borderColor:     odabranPrioritet === p ? PRIORITET_BOJE[p] : 'rgb(var(--first-quaternary-rgb) / 0.35)',
                  backgroundColor: odabranPrioritet === p ? `${PRIORITET_BOJE[p]}18` : 'transparent',
                  color:           odabranPrioritet === p ? PRIORITET_BOJE[p] : 'var(--first-nonary)',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={potvrdi} isLoading={jeSlanje} loadingText="Potvrđivanje...">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Potvrdi
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setJeOdbijanje(true)}
              disabled={jeSlanje}
            >
              <XCircle className="h-3.5 w-3.5" />
              Odbij
            </Button>
            <Button size="sm" variant="ghost" onClick={onZatvori} disabled={jeSlanje}>
              Odustani
            </Button>
          </div>
        </>
      ) : (
        <>
          <textarea
            className="mb-3 w-full resize-none rounded-xl border px-3 py-2.5 text-sm"
            style={{
              borderColor:     'rgb(var(--first-senary-rgb) / 0.3)',
              backgroundColor: 'rgb(var(--first-senary-rgb) / 0.04)',
              color:           'var(--first-octonary)',
            }}
            rows={3}
            placeholder="Razlog odbijanja zahtjeva (min. 5 karaktera)..."
            value={razlogOdbijanja}
            onChange={(e) => setRazlogOdbijanja(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="danger" onClick={odbij} isLoading={jeSlanje} loadingText="Odbijanje...">
              Potvrdi odbijanje
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setJeOdbijanje(false)} disabled={jeSlanje}>
              Nazad
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Redak zahtjeva ───────────────────────────────────────────────────────────

function ZahtjevRedak({
  zahtjev,
  onRefresh,
}: {
  zahtjev:   ZahtjevSaPodnosiocem;
  onRefresh: () => void;
}) {
  const [otvoren, setOtvoren] = useState(false);
  const datum = new Date(zahtjev.created_at).toLocaleDateString('bs-BA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const sistemskiPrioritet = kategorizirajHitnost(zahtjev.system_score || zahtjev.urgency_score);

  return (
    <li>
      <div
        className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-soft-beige/10"
      >
        <div className="mt-1 flex-shrink-0">
          {zahtjev.status === 'na_cekanju'
            ? <AlertTriangle className="h-4 w-4" style={{ color: '#D97706' }} />
            : <User className="h-4 w-4" style={{ color: 'var(--first-quinary)' }} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium" style={{ color: 'var(--first-octonary)' }}>
              {zahtjev.category}
            </p>
            <StatusBadge status={zahtjev.status} />
            <UrgencyBadge score={zahtjev.urgency_score} />
            {/* Sistem prijedlog */}
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${PRIORITET_BOJE[sistemskiPrioritet as Prioritet]}15`,
                color:           PRIORITET_BOJE[sistemskiPrioritet as Prioritet],
                border:          `1px dashed ${PRIORITET_BOJE[sistemskiPrioritet as Prioritet]}40`,
              }}
            >
              Sistem: {sistemskiPrioritet}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm" style={{ color: 'var(--first-nonary)' }}>
            {zahtjev.description.length > 80
              ? `${zahtjev.description.substring(0, 80)}...`
              : zahtjev.description}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-x-4 text-xs" style={{ color: 'var(--first-nonary)' }}>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {zahtjev.address.length > 35 ? `${zahtjev.address.substring(0, 35)}...` : zahtjev.address}
            </span>
            {zahtjev.podnosilac && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {zahtjev.podnosilac.ime} {zahtjev.podnosilac.prezime}
              </span>
            )}
            {zahtjev.podnosilac?.broj_telefona && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {zahtjev.podnosilac.broj_telefona}
              </span>
            )}
            <span>{datum}</span>
          </div>

          {/* Override panel */}
          {otvoren && zahtjev.status === 'na_cekanju' && (
            <div className="mt-3">
              <OverridePanel
                zahtjev={zahtjev}
                onZatvori={() => setOtvoren(false)}
                onAkcija={() => { setOtvoren(false); onRefresh(); }}
              />
            </div>
          )}
        </div>

        {zahtjev.status === 'na_cekanju' && !otvoren && (
          <Button size="sm" onClick={() => setOtvoren(true)} className="flex-shrink-0">
            Obradi
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </li>
  );
}

// ─── Stranica ─────────────────────────────────────────────────────────────────

interface ToastPoruka {
  id:      number;
  tekst:   string;
  boja:    string;
}

export default function DispecerPage() {
  const [zahtjevi, setZahtjevi] = useState<ZahtjevSaPodnosiocem[]>([]);
  const [ucitava,  setUcitava]  = useState(true);
  const [greska,   setGreska]   = useState<string | null>(null);
  const [toast,    setToast]    = useState<ToastPoruka | null>(null);
  const toastTimerRef           = useRef<ReturnType<typeof setTimeout>>();

  function prikaziToast(tekst: string, boja = '#DC2626') {
    clearTimeout(toastTimerRef.current);
    setToast({ id: Date.now(), tekst, boja });
    toastTimerRef.current = setTimeout(() => setToast(null), 6000);
  }

  // Supabase Realtime — prati otkazivanje zahtjeva od strane korisnika
  useEffect(() => {
    const supabase = kreirajKlijenta();
    const kanal = supabase
      .channel('dispecer-zahtjevi-realtime')
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'service_requests',
          filter: 'status=eq.otkazano',
        },
        (payload) => {
          const z = payload.new as { id: number; category?: string; status: string };
          const naziv = z.category ?? 'Nepoznat zahtjev';
          prikaziToast(`Zahtjev "${naziv}" je upravo otkazan od strane korisnika.`);
          // Ukloni iz lokalne liste
          setZahtjevi((prev) => prev.filter((x) => x.id !== z.id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(kanal); };
  }, []);

  async function ucitajZahtjeve() {
    setUcitava(true);
    setGreska(null);
    try {
      const r = await fetch('/api/dispecer/zahtjevi', { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri učitavanju.');
      setZahtjevi(d.zahtjevi ?? []);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška.');
    } finally {
      setUcitava(false);
    }
  }

  useEffect(() => { ucitajZahtjeve(); }, []);

  const naCekanju = zahtjevi.filter((z) => z.status === 'na_cekanju').length;
  const potvrdeno = zahtjevi.filter((z) => z.status === 'potvrdeno').length;
  const aktivnih  = zahtjevi.filter((z) => !['zavrseno', 'otkazano', 'odbijeno'].includes(z.status)).length;

  return (
    <>
    <AppShell uloga="dispecer" imeKorisnika="Dispečer">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
            Upravljanje zahtjevima
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
            Sortirano po sistemskom prioritetu. Pregledajte i obradite zahtjeve.
          </p>
        </div>
        <Button type="button" variant="secondary" size="md" onClick={ucitajZahtjeve} isLoading={ucitava} loadingText="Osvježavanje...">
          <RefreshCw className="h-4 w-4" />
          Osvježi
        </Button>
      </div>

      {/* KPI */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { oznaka: 'Na čekanju',  vrijednost: naCekanju, boja: '#D97706', Ikona: ClipboardList },
          { oznaka: 'Potvrđeno',   vrijednost: potvrdeno, boja: '#2563EB', Ikona: Clock },
          { oznaka: 'Svi aktivni', vrijednost: aktivnih,  boja: '#059669', Ikona: Wrench },
        ].map(({ oznaka, vrijednost, boja, Ikona }) => (
          <div key={oznaka} className="flex items-center gap-4 rounded-2xl p-5 shadow-card"
            style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}>
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${boja}18` }}>
              <Ikona className="h-5 w-5" style={{ color: boja }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: boja }}>{vrijednost}</p>
              <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>{oznaka}</p>
            </div>
          </div>
        ))}
      </div>

      {greska && <div className="mb-6"><AlertMessage variant="error" message={greska} /></div>}

      <div className="rounded-2xl shadow-card"
        style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgb(var(--first-quaternary-rgb) / 0.3)' }}>
          <h2 className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
            Svi zahtjevi ({zahtjevi.length})
          </h2>
          <Link href="/dispecer/zahtjevi"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--first-secondary)' }}>
            Upravljanje <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {ucitava && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Učitavanje zahtjeva...</p>
          </div>
        )}
        {!ucitava && zahtjevi.length === 0 && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Nema aktivnih zahtjeva.</p>
          </div>
        )}
        {!ucitava && zahtjevi.length > 0 && (
          <ul className="divide-y" style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.25)' }}>
            {zahtjevi.map((z) => (
              <ZahtjevRedak key={z.id} zahtjev={z} onRefresh={ucitajZahtjeve} />
            ))}
          </ul>
        )}
      </div>
    </AppShell>

      {/* Realtime toast — zahtjev otkazan */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3
            rounded-2xl p-4 shadow-2xl transition-all duration-300"
          style={{
            backgroundColor: '#ffffff',
            border:          `1px solid ${toast.boja}40`,
            boxShadow:       `0 8px 32px ${toast.boja}20`,
          }}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${toast.boja}15` }}
          >
            <BellOff className="h-4 w-4" style={{ color: toast.boja }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: toast.boja }}>
              Zahtjev otkazan
            </p>
            <p className="mt-0.5 text-sm leading-snug" style={{ color: 'var(--first-octonary)' }}>
              {toast.tekst}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="flex-shrink-0 transition-opacity hover:opacity-60"
            style={{ color: 'var(--first-nonary)' }}
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
