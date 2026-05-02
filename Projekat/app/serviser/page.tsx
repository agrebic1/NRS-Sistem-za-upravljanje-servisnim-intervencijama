'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle,
  ClipboardCheck,
  Calendar,
  ChevronRight,
  AlertTriangle,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { UrgencyBadge } from '@/components/servisirane/UrgencyBadge';
import { StatusBadge } from '@/components/servisirane/ZahtjevKartica';
import type { ServisniZahtjev } from '@/domain/types/servisirane';

interface ZahtjevSaPodnosiocem extends ServisniZahtjev {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
}

export default function ServiserPage() {
  const [zahtjevi, setZahtjevi] = useState<ZahtjevSaPodnosiocem[]>([]);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);

  async function ucitajZahtjeve() {
    setUcitava(true);
    setGreska(null);
    try {
      const r = await fetch('/api/dispecer/zahtjevi', { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri učitavanju zahtjeva.');
      setZahtjevi(d.zahtjevi ?? []);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri učitavanju zahtjeva.');
    } finally {
      setUcitava(false);
    }
  }

  useEffect(() => {
    ucitajZahtjeve();
  }, []);

  const datumDanas = new Date().toLocaleDateString('bs', { weekday: 'long', day: 'numeric', month: 'long' });
  const aktivniZadaci = zahtjevi.filter((z) => !['zavrseno', 'otkazano', 'odbijeno'].includes(z.status)).length;
  const danasnji = zahtjevi.filter((z) => {
    const d = new Date(z.created_at);
    const t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  }).length;
  const zavrseni = zahtjevi.filter((z) => z.status === 'zavrseno').length;

  return (
    <AppShell uloga="serviser" imeKorisnika="Marko J.">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
          Dobro jutro, Marko!
        </h1>
        <p className="mt-1 text-sm capitalize" style={{ color: 'var(--first-nonary)' }}>
          {datumDanas} — imate {aktivniZadaci} aktivnih zadataka
        </p>
      </div>

      {/* KPI kartice */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { oznaka: 'Ukupno zahtjeva', vrijednost: zahtjevi.length, boja: 'var(--first-secondary)', Ikona: ClipboardCheck },
          { oznaka: 'Dodano danas', vrijednost: danasnji, boja: 'var(--first-septenary)', Ikona: Calendar },
          { oznaka: 'Završeno', vrijednost: zavrseni, boja: 'var(--first-primary)', Ikona: CheckCircle },
        ].map(({ oznaka, vrijednost, boja, Ikona }) => (
          <div
            key={oznaka}
            className="flex items-center gap-4 rounded-2xl p-5 shadow-card"
            style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `color-mix(in srgb, ${boja} 10%, transparent)` }}>
              <Ikona className="h-5 w-5" style={{ color: boja }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: boja }}>{vrijednost}</p>
              <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>{oznaka}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex justify-end">
        <Button type="button" variant="secondary" size="md" onClick={ucitajZahtjeve} isLoading={ucitava} loadingText="Osvježavanje...">
          <RefreshCw className="h-4 w-4" />
          Osvježi
        </Button>
      </div>

      {greska && <div className="mb-4"><AlertMessage variant="error" message={greska} /></div>}

      {/* Lista zadataka */}
      <div
        className="rounded-2xl shadow-card"
        style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgb(var(--first-quaternary-rgb) / 0.3)' }}
        >
          <h2 className="font-semibold" style={{ color: 'var(--first-octonary)' }}>Zadaci za danas</h2>
          <Link
            href="/dispecer/zahtjevi"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--first-secondary)' }}
          >
            Svi zahtjevi <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="divide-y" style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.25)' }}>
          {!ucitava && zahtjevi.length === 0 && (
            <li className="px-5 py-6 text-center text-sm" style={{ color: 'var(--first-nonary)' }}>
              Nema zahtjeva za prikaz.
            </li>
          )}

          {zahtjevi.map((zadatak) => {
            return (
              <li key={zadatak.id}>
                <Link
                  href={`/korisnik/intervencija/${zadatak.id}`}
                  className="flex items-start gap-4 px-5 py-4 transition-colors duration-150 hover:bg-soft-beige/10"
                >
                  <div className="mt-1 flex-shrink-0">
                    {(zadatak.urgency_score ?? 0) >= 75
                      ? <AlertTriangle className="h-4 w-4" style={{ color: 'var(--first-senary)' }} />
                      : <Clock className="h-4 w-4" style={{ color: 'var(--first-quinary)' }} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium" style={{ color: 'var(--first-octonary)' }}>{zadatak.category}</p>
                      <StatusBadge status={zadatak.status} />
                      <UrgencyBadge score={zadatak.urgency_score} />
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 text-xs" style={{ color: 'var(--first-nonary)' }}>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{zadatak.address}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(zadatak.created_at).toLocaleDateString('bs-BA')}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--first-quinary)' }}>
                      Korisnik: {zadatak.podnosilac ? `${zadatak.podnosilac.ime} ${zadatak.podnosilac.prezime}` : 'Nepoznato'}
                    </p>
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
