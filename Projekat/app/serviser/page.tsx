'use client';

import Link from 'next/link';
import { Clock, CheckCircle, ClipboardCheck, Calendar, ChevronRight, AlertTriangle, MapPin } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';

// ─── Mock podaci ──────────────────────────────────────────────────────────────

type StatusZadatka  = 'dodijeljen' | 'u_toku' | 'zavrsen';
type PrioritatZadatka = 'normalno' | 'hitno';

interface MockZadatak {
  id: string;
  naslov: string;
  lokacija: string;
  vrijemePocetka: string;
  status: StatusZadatka;
  prioritet: PrioritatZadatka;
  korisnik: string;
}

const MOCK_ZADACI: MockZadatak[] = [
  { id: '1', naslov: 'Električni kvar — Objekat A',          lokacija: 'Ul. Ferhadija 8, Sarajevo',     vrijemePocetka: '08:30', status: 'u_toku',    prioritet: 'hitno',    korisnik: 'Amina H.' },
  { id: '2', naslov: 'HVAC servis — Zona 3',                 lokacija: 'Trg Oslobođenja 1, Sarajevo',   vrijemePocetka: '11:00', status: 'dodijeljen', prioritet: 'normalno', korisnik: 'Elma K.' },
  { id: '3', naslov: 'Vodoinstalaterski popravak — St. 204', lokacija: 'Ul. Branilaca 12, Mostar',      vrijemePocetka: '14:00', status: 'dodijeljen', prioritet: 'normalno', korisnik: 'Sanel M.' },
  { id: '4', naslov: 'Lift — godišnji pregled',              lokacija: 'Ul. Maršala Tita 5, Sarajevo', vrijemePocetka: '16:30', status: 'zavrsen',    prioritet: 'normalno', korisnik: 'Adnan Č.' },
];

const KPI_KARTICE = [
  { oznaka: 'Ukupno zadataka',    vrijednost: 4,  boja: 'var(--color-celestial-teal)', Ikona: ClipboardCheck },
  { oznaka: 'Danas',             vrijednost: 3,  boja: 'var(--color-herbal-gold)', Ikona: Calendar },
  { oznaka: 'Završeno ovaj mj.', vrijednost: 12, boja: 'var(--color-deep-teal)', Ikona: CheckCircle },
];

const BADGE_STATUSA: Record<StatusZadatka, { oznaka: string; pozadina: string; boja: string }> = {
  dodijeljen: { oznaka: 'Dodijeljen', pozadina: 'rgb(var(--rgb-soft-beige) / 0.2)',  boja: 'var(--color-text-muted)' },
  u_toku:     { oznaka: 'U toku',    pozadina: 'rgb(var(--rgb-celestial-teal) / 0.15)',  boja: 'var(--color-celestial-teal)' },
  zavrsen:    { oznaka: 'Završen',   pozadina: 'rgb(var(--rgb-herbal-gold) / 0.2)',  boja: 'var(--color-herbal-gold)' },
};

// ─── Stranica ─────────────────────────────────────────────────────────────────

export default function ServiserPage() {
  const datumDanas = new Date().toLocaleDateString('bs', { weekday: 'long', day: 'numeric', month: 'long' });
  const aktivniZadaci = MOCK_ZADACI.filter((z) => z.status !== 'zavrsen').length;

  return (
    <AppShell uloga="serviser" imeKorisnika="Marko J.">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>
          Dobro jutro, Marko!
        </h1>
        <p className="mt-1 text-sm capitalize" style={{ color: 'var(--color-text-muted)' }}>
          {datumDanas} — imate {aktivniZadaci} aktivnih zadataka
        </p>
      </div>

      {/* KPI kartice */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {KPI_KARTICE.map(({ oznaka, vrijednost, boja, Ikona }) => (
          <div
            key={oznaka}
            className="flex items-center gap-4 rounded-2xl p-5 shadow-card"
            style={{ backgroundColor: 'rgb(var(--rgb-muted-sand) / 0.22)', border: '1px solid rgb(var(--rgb-soft-beige) / 0.35)' }}
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `color-mix(in srgb, ${boja} 10%, transparent)` }}>
              <Ikona className="h-5 w-5" style={{ color: boja }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: boja }}>{vrijednost}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{oznaka}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lista zadataka */}
      <div
        className="rounded-2xl shadow-card"
        style={{ backgroundColor: 'rgb(var(--rgb-muted-sand) / 0.22)', border: '1px solid rgb(var(--rgb-soft-beige) / 0.35)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgb(var(--rgb-soft-beige) / 0.3)' }}
        >
          <h2 className="font-semibold" style={{ color: 'var(--color-text-main)' }}>Zadaci za danas</h2>
          <Link
            href="/serviser/zadaci"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-celestial-teal)' }}
          >
            Svi zadaci <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="divide-y" style={{ borderColor: 'rgb(var(--rgb-soft-beige) / 0.25)' }}>
          {MOCK_ZADACI.map((zadatak) => {
            const badge = BADGE_STATUSA[zadatak.status];
            return (
              <li key={zadatak.id}>
                <Link
                  href={`/serviser/intervencija/${zadatak.id}`}
                  className="flex items-start gap-4 px-5 py-4 transition-colors duration-150 hover:bg-soft-beige/10"
                >
                  <div className="mt-1 flex-shrink-0">
                    {zadatak.prioritet === 'hitno'
                      ? <AlertTriangle className="h-4 w-4" style={{ color: 'var(--color-mystic-ember)' }} />
                      : <Clock className="h-4 w-4" style={{ color: 'var(--color-muted-sand)' }} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium" style={{ color: 'var(--color-text-main)' }}>{zadatak.naslov}</p>
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: badge.pozadina, color: badge.boja }}>
                        {badge.oznaka}
                      </span>
                      {zadatak.prioritet === 'hitno' && (
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: 'rgb(var(--rgb-mystic-ember) / 0.12)', color: 'var(--color-mystic-ember)' }}>
                          Hitno
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{zadatak.vrijemePocetka}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{zadatak.lokacija}</span>
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--color-muted-sand)' }}>Korisnik: {zadatak.korisnik}</p>
                  </div>
                  <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0" style={{ color: 'var(--color-muted-sand)' }} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
