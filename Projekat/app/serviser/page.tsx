'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Clock, CheckCircle2, Truck, ClipboardList,
  ChevronRight, MapPin, Calendar, RefreshCw, AlertTriangle,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { StatusBadge } from '@/components/servisirane/ZahtjevKartica';
import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';
import { kreirajKlijenta } from '@/lib/supabase/klijent';
import { formatirajDatumPrikaz } from '@/lib/format/datumi';

interface IntervencijaZaListu extends ServisniZahtjev {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
}

export default function ServiserPage() {
  const [intervencije, setIntervencije] = useState<IntervencijaZaListu[]>([]);
  const [ucitava,      setUcitava]      = useState(true);
  const [greska,       setGreska]       = useState<string | null>(null);
  const [imeKorisnika, setImeKorisnika] = useState('Korisnik');

  async function ucitaj() {
    setUcitava(true);
    setGreska(null);
    try {
      const r = await fetch('/api/serviser/intervencije', { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri učitavanju.');
      setIntervencije(d.intervencije ?? []);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri učitavanju.');
    } finally {
      setUcitava(false);
    }
  }

  useEffect(() => { ucitaj(); }, []);

  useEffect(() => {
    const supabase = kreirajKlijenta();
    let mounted = true;
    const ucitajIme = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted || !user) return;
      const { data: profil } = await supabase
        .from('osoba').select('ime, prezime').eq('id_osobe', user.id).maybeSingle();
      const imeIzProfila = [profil?.ime, profil?.prezime].filter(Boolean).join(' ').trim();
      const imeIzMeta   = [user.user_metadata?.ime, user.user_metadata?.prezime].filter(Boolean).join(' ').trim();
      setImeKorisnika(imeIzProfila || imeIzMeta || user.email || 'Korisnik');
    };
    void ucitajIme();
    return () => { mounted = false; };
  }, []);

  const imeZaPozdrav = imeKorisnika.split(' ')[0]?.trim() || imeKorisnika;

  const dodijeljeno = intervencije.filter((z) => z.status === 'dodijeljeno').length;
  const uRadu       = intervencije.filter((z) => z.status === 'u_radu').length;
  const naTermenu   = intervencije.filter((z) => z.status === 'u_izvrsenju').length;
  const zavrseno    = intervencije.filter((z) => z.status === 'zavrseno').length;

  const aktivni = intervencije
    .filter((z) => ['dodijeljeno', 'u_radu', 'u_izvrsenju'].includes(z.status))
    .sort((a, b) => {
      if (Boolean(a.is_premium) !== Boolean(b.is_premium)) return a.is_premium ? -1 : 1;
      return (b.urgency_score ?? 0) - (a.urgency_score ?? 0);
    })
    .slice(0, 5);

  return (
    <AppShell uloga="serviser" imeKorisnika={imeKorisnika}>
      {/* Zaglavlje */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
            Dobro jutro, {imeZaPozdrav}!
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
            {formatirajDatumPrikaz(new Date())} — imate {dodijeljeno + uRadu + naTermenu} aktivnih zadataka
          </p>
        </div>
        <Button variant="secondary" size="md" onClick={ucitaj} isLoading={ucitava} loadingText="Osvježavanje...">
          <RefreshCw className="h-4 w-4" />
          Osvježi
        </Button>
      </div>

      {/* KPI kartice */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { oznaka: 'Dodijeljeno', v: dodijeljeno, boja: '#D97706',                   Ikona: Clock         },
          { oznaka: 'Prihvaćeno',  v: uRadu,       boja: '#2563EB',                   Ikona: ClipboardList },
          { oznaka: 'Na terenu',   v: naTermenu,   boja: '#22C55E',                   Ikona: Truck         },
          { oznaka: 'Završeno',    v: zavrseno,    boja: 'var(--first-secondary)',     Ikona: CheckCircle2  },
        ].map(({ oznaka, v, boja, Ikona }) => (
          <div
            key={oznaka}
            className="flex items-center gap-3 rounded-2xl p-4 shadow-card"
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

      {/* Aktivni zadaci */}
      <div
        className="rounded-2xl shadow-card"
        style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgb(var(--first-quaternary-rgb) / 0.3)' }}
        >
          <h2 className="font-semibold" style={{ color: 'var(--first-octonary)' }}>Aktivni zadaci</h2>
          <Link
            href="/serviser/zadaci"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--first-secondary)' }}
          >
            Svi zadaci <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="divide-y" style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.25)' }}>
          {ucitava && (
            <li className="px-5 py-8 text-center text-sm" style={{ color: 'var(--first-nonary)' }}>
              Učitavanje...
            </li>
          )}
          {!ucitava && aktivni.length === 0 && (
            <li className="flex flex-col items-center gap-2 px-5 py-10 text-center">
              <CheckCircle2 className="h-8 w-8" style={{ color: 'var(--first-quinary)' }} />
              <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
                Nemate aktivnih zadataka. Odlično!
              </p>
            </li>
          )}
          {!ucitava && aktivni.map((z) => {
            const kat    = labelKategorije(z);
            const naslov = kat.podkategorija ? `${kat.glavna} — ${kat.podkategorija}` : kat.glavna;
            const hitno  = (z.urgency_score ?? 0) >= 75 || z.is_premium;
            return (
              <li key={z.id}>
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
                    <div className="mt-1.5 flex flex-wrap gap-x-4 text-xs" style={{ color: 'var(--first-nonary)' }}>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {z.address.length > 45 ? `${z.address.substring(0, 45)}...` : z.address}
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
          })}
        </ul>
      </div>
    </AppShell>
  );
}
