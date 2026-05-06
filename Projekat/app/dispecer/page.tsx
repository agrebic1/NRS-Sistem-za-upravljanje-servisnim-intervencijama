'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ClipboardList, Clock, Wrench, ChevronRight,
  RefreshCw, XCircle, BellOff,
} from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import {
  DispecerskaZahtjevKartica,
  zahtjevCekaObraduSprint7,
  type ZahtjevZaDispecerskuKarticu,
} from '@/components/dispecer/DispecerskaZahtjevKartica';
import { kreirajKlijenta } from '@/lib/supabase/klijent';

const JE_PENDING = (status: string) =>
  status === 'na_cekanju' || status === 'pending_review' || status === 'in_review';

interface ToastPoruka {
  id:      number;
  naslov:  string;
  tekst:   string;
  boja:    string;
}

export default function DispecerPage() {
  const [zahtjevi, setZahtjevi] = useState<ZahtjevZaDispecerskuKarticu[]>([]);
  const [ucitava,  setUcitava]  = useState(true);
  const [greska,   setGreska]   = useState<string | null>(null);
  const [toast,    setToast]    = useState<ToastPoruka | null>(null);
  const toastTimerRef           = useRef<ReturnType<typeof setTimeout>>();

  const zahtjeviCekajuObradu = zahtjevi
    .filter((z) => zahtjevCekaObraduSprint7(z.status))
    .sort((a, b) => {
      if (Boolean(a.is_premium) !== Boolean(b.is_premium)) {
        return a.is_premium ? -1 : 1;
      }
      const t = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (t !== 0) return t;
      return a.id - b.id;
    });

  function prikaziToast(tekst: string, boja = '#DC2626', naslov = 'Obavještenje') {
    clearTimeout(toastTimerRef.current);
    setToast({ id: Date.now(), naslov, tekst, boja });
    toastTimerRef.current = setTimeout(() => setToast(null), 6000);
  }

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
          prikaziToast(`Zahtjev "${naziv}" je upravo otkazan od strane korisnika.`, '#DC2626', 'Zahtjev otkazan');
          setZahtjevi((prev) => prev.filter((x) => x.id !== z.id));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(kanal); };
  }, []);

  useEffect(() => {
    const supabase = kreirajKlijenta();
    let premiumKanal: ReturnType<typeof supabase.channel> | null = null;
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted || !data.user) return;
      premiumKanal = supabase
        .channel(`dispecer-premium-alert-${data.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'dispatcher_alerts',
            filter: `recipient_user_id=eq.${data.user.id}`,
          },
          (payload) => {
            const a = payload.new as { message?: string };
            prikaziToast(
              a.message ?? 'Novi premium zahtjev čeka prioritetnu obradu.',
              '#B91C1C',
              'Premium zahtjev'
            );
          }
        )
        .subscribe();
    });
    return () => {
      mounted = false;
      if (premiumKanal) supabase.removeChannel(premiumKanal);
    };
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

  const naCekanju = zahtjevi.filter((z) => JE_PENDING(z.status)).length;
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
            Pregled zahtjeva u redu za obradu. Redoslijed: prvo ranije prijavljeni.
          </p>
        </div>
        <Button type="button" variant="secondary" size="md" onClick={ucitajZahtjeve} isLoading={ucitava} loadingText="Osvježavanje...">
          <RefreshCw className="h-4 w-4" />
          Osvježi
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { oznaka: 'Čeka obradu',  vrijednost: naCekanju, boja: '#D97706', Ikona: ClipboardList },
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
            Zahtjevi koji čekaju obradu ({zahtjeviCekajuObradu.length})
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
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
              Nema aktivnih zahtjeva
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
              Kada korisnik pošalje zahtjev, pojavit će se ovdje.
            </p>
          </div>
        )}
        {!ucitava && zahtjevi.length > 0 && zahtjeviCekajuObradu.length === 0 && (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
              Nema zahtjeva koji čekaju obradu
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
              Svi trenutni zahtjevi su dalje u obradi. Pregled svih zahtjeva: Upravljanje.
            </p>
          </div>
        )}
        {!ucitava && zahtjeviCekajuObradu.length > 0 && (
          <div className="p-4 sm:p-5">
            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {zahtjeviCekajuObradu.map((z) => (
                <li key={z.id}>
                  <DispecerskaZahtjevKartica zahtjev={z} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AppShell>

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
              {toast.naslov}
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
