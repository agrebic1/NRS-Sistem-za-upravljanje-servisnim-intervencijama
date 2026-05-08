'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw, Filter } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import {
  DispecerskaZahtjevKartica,
  type ZahtjevZaDispecerskuKarticu,
} from '@/components/dispecer/DispecerskaZahtjevKartica';
import { kreirajKlijenta } from '@/lib/supabase/klijent';

const STATUSI = [
  { vrijednost: 'svi',           oznaka: 'Svi aktivni' },
  { vrijednost: 'na_cekanju',    oznaka: 'Čeka obradu' },
  { vrijednost: 'in_review',     oznaka: 'U obradi' },
  { vrijednost: 'potvrdeno',     oznaka: 'Potvrđeno' },
  { vrijednost: 'dodijeljeno',   oznaka: 'Dodijeljeno' },
  { vrijednost: 'in_progress',   oznaka: 'U toku' },
  { vrijednost: 'zavrseno',      oznaka: 'Završeno' },
  { vrijednost: 'otkazano',      oznaka: 'Otkazano' },
];

export default function DispecerZahtjeviPage() {
  const searchParams = useSearchParams();
  const statusIzUrla = searchParams.get('status') ?? 'svi';

  const [zahtjevi, setZahtjevi]       = useState<ZahtjevZaDispecerskuKarticu[]>([]);
  const [ucitava, setUcitava]         = useState(true);
  const [greska, setGreska]           = useState<string | null>(null);
  const [aktivniFilter, setAktivniFilter] = useState(statusIzUrla);
  const [imeKorisnika, setImeKorisnika]   = useState('Dispečer');

  const ucitajZahtjeve = useCallback(async () => {
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
  }, []);

  useEffect(() => { ucitajZahtjeve(); }, [ucitajZahtjeve]);

  useEffect(() => {
    setAktivniFilter(statusIzUrla);
  }, [statusIzUrla]);

  // Realtime osvježavanje
  useEffect(() => {
    const supabase = kreirajKlijenta();
    const kanal = supabase
      .channel('dispecer-zahtjevi-lista-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_requests' },
        () => { ucitajZahtjeve(); })
      .subscribe();
    return () => { supabase.removeChannel(kanal); };
  }, [ucitajZahtjeve]);

  useEffect(() => {
    const supabase = kreirajKlijenta();
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted || !data.user) return;
      supabase.from('osoba').select('ime, prezime')
        .eq('id_osobe', data.user.id).maybeSingle()
        .then(({ data: profil }) => {
          if (!mounted) return;
          const ime = [profil?.ime, profil?.prezime].filter(Boolean).join(' ').trim();
          setImeKorisnika(ime || data.user?.email || 'Dispečer');
        });
    });
    return () => { mounted = false; };
  }, []);

  const filtrirani = aktivniFilter === 'svi'
    ? zahtjevi
    : zahtjevi.filter((z) => z.status === aktivniFilter);

  const brojPoStatusu = (status: string) =>
    status === 'svi'
      ? zahtjevi.length
      : zahtjevi.filter((z) => z.status === status).length;

  return (
    <AppShell uloga="dispecer" imeKorisnika={imeKorisnika}>
      {/* Zaglavlje */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
            Pregled intervencija po statusu
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
            Filtrirajte intervencije prema trenutnom statusu. Kliknite na intervenciju za detalje.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dispecer">
            <Button type="button" variant="secondary" size="md">
              ← Dashboard
            </Button>
          </Link>
          <Button type="button" variant="secondary" size="md"
            onClick={ucitajZahtjeve} isLoading={ucitava} loadingText="Osvježavanje...">
            <RefreshCw className="h-4 w-4" />
            Osvježi
          </Button>
        </div>
      </div>

      {/* Filter tabovi po statusu */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUSI.map(({ vrijednost, oznaka }) => {
          const broj = brojPoStatusu(vrijednost);
          const jeAktivan = aktivniFilter === vrijednost;
          return (
            <button
              key={vrijednost}
              type="button"
              onClick={() => setAktivniFilter(vrijednost)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all"
              style={{
                backgroundColor: jeAktivan
                  ? 'var(--first-secondary)'
                  : 'rgb(var(--first-quinary-rgb) / 0.3)',
                color: jeAktivan ? '#fff' : 'var(--first-octonary)',
                border: jeAktivan
                  ? '1px solid var(--first-secondary)'
                  : '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
              }}
            >
              <Filter className="h-3 w-3" />
              {oznaka}
              <span
                className="rounded-full px-1.5 py-0.5 text-xs font-bold"
                style={{
                  backgroundColor: jeAktivan ? 'rgba(255,255,255,0.25)' : 'rgb(var(--first-quaternary-rgb) / 0.3)',
                }}
              >
                {broj}
              </span>
            </button>
          );
        })}
      </div>

      {greska && <div className="mb-6"><AlertMessage variant="error" message={greska} /></div>}

      {/* Lista */}
      {ucitava && (
        <div className="py-12 text-center">
          <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Učitavanje intervencija...</p>
        </div>
      )}

      {!ucitava && filtrirani.length === 0 && (
        <div className="rounded-2xl py-12 text-center shadow-card"
          style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
            Nema intervencija za odabrani status
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
            Pokušajte odabrati drugi filter ili osvježite stranicu.
          </p>
        </div>
      )}

      {!ucitava && filtrirani.length > 0 && (
        <div className="rounded-2xl shadow-card"
          style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgb(var(--first-quaternary-rgb) / 0.3)' }}>
            <h2 className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
              {STATUSI.find(s => s.vrijednost === aktivniFilter)?.oznaka ?? 'Intervencije'} ({filtrirani.length})
            </h2>
          </div>
          <div className="p-4 sm:p-5">
            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filtrirani.map((z) => (
                <li key={z.id}>
                  <DispecerskaZahtjevKartica zahtjev={z} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AppShell>
  );
}