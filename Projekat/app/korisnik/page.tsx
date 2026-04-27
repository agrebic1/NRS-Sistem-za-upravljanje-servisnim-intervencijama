'use client';

import Link from 'next/link';
import { PlusCircle, Clock, CheckCircle, AlertTriangle, ChevronRight, FileText } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';

// ─── Mock podaci (zamijeniti Supabase upitima) ───────────────────────────────

type StatusZahtjeva = 'novi' | 'u_toku' | 'zavrsen' | 'hitno';

interface MockZahtjev {
  id: string;
  naslov: string;
  status: StatusZahtjeva;
  datum: string;
  serviser: string | null;
}

const MOCK_ZAHTJEVI: MockZahtjev[] = [
  { id: '1', naslov: 'Električni kvar u dnevnoj sobi', status: 'u_toku',  datum: '24.04.2026.', serviser: 'Marko Jovanović' },
  { id: '2', naslov: 'Curenje vode ispod sudopere',    status: 'hitno',   datum: '23.04.2026.', serviser: null },
  { id: '3', naslov: 'HVAC servis — godišnji pregled', status: 'zavrsen', datum: '20.04.2026.', serviser: 'Ana Petrović' },
  { id: '4', naslov: 'Lift — neuobičajena buka',       status: 'novi',    datum: '18.04.2026.', serviser: null },
];

const KPI_KARTICE = [
  { oznaka: 'Aktivnih zahtjeva',    vrijednost: 2, boja: '#5A7C83', Ikona: Clock },
  { oznaka: 'Hitnih zahtjeva',      vrijednost: 1, boja: '#8B4A2B', Ikona: AlertTriangle },
  { oznaka: 'Završenih intervenc.', vrijednost: 5, boja: '#D4B27F', Ikona: CheckCircle },
];

const BADGE_STATUSA: Record<StatusZahtjeva, { oznaka: string; pozadina: string; boja: string }> = {
  novi:    { oznaka: 'Novi',    pozadina: 'rgba(204,182,142,0.2)',   boja: '#6B7C82' },
  u_toku:  { oznaka: 'U toku', pozadina: 'rgba(90,124,131,0.15)',   boja: '#5A7C83' },
  zavrsen: { oznaka: 'Završen',pozadina: 'rgba(212,178,127,0.2)',   boja: '#D4B27F' },
  hitno:   { oznaka: 'Hitno',  pozadina: 'rgba(139,74,43,0.12)',    boja: '#8B4A2B' },
};

// ─── Stranica ─────────────────────────────────────────────────────────────────

export default function KorisnikPage() {
  return (
    <AppShell uloga="korisnik" imeKorisnika="Amina H.">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1F2A30' }}>
            Dobrodošli, Amina!
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#6B7C82' }}>
            Pregled vaših servisnih zahtjeva i intervencija.
          </p>
        </div>
        <Link href="/korisnik/novi_zahtjev">
          <Button size="md" className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            Prijavi novi zahtjev
          </Button>
        </Link>
      </div>

      {/* KPI kartice */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {KPI_KARTICE.map(({ oznaka, vrijednost, boja, Ikona }) => (
          <div
            key={oznaka}
            className="flex items-center gap-4 rounded-2xl p-5 shadow-card"
            style={{ backgroundColor: 'rgba(199, 184, 164, 0.22)', border: '1px solid rgba(204, 182, 142, 0.35)' }}
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${boja}18` }}>
              <Ikona className="h-5 w-5" style={{ color: boja }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: boja }}>{vrijednost}</p>
              <p className="text-xs" style={{ color: '#6B7C82' }}>{oznaka}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lista zahtjeva */}
      <div
        className="rounded-2xl shadow-card"
        style={{ backgroundColor: 'rgba(199, 184, 164, 0.22)', border: '1px solid rgba(204, 182, 142, 0.35)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(204, 182, 142, 0.3)' }}
        >
          <h2 className="font-semibold" style={{ color: '#1F2A30' }}>Moji zahtjevi</h2>
          <Link
            href="/korisnik/intervencije"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: '#5A7C83' }}
          >
            Svi zahtjevi <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {MOCK_ZAHTJEVI.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <FileText className="h-10 w-10" style={{ color: '#C7B8A4' }} />
            <p className="text-sm" style={{ color: '#6B7C82' }}>Nemate još nijednog zahtjeva.</p>
            <Link href="/korisnik/novi_zahtjev">
              <Button size="sm" variant="secondary">Prijavi prvi kvar</Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'rgba(204, 182, 142, 0.25)' }}>
            {MOCK_ZAHTJEVI.map((zahtjev) => {
              const badge = BADGE_STATUSA[zahtjev.status];
              return (
                <li key={zahtjev.id}>
                  <Link
                    href={`/korisnik/intervencija/${zahtjev.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-[#CCB68E]/10"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium" style={{ color: '#1F2A30' }}>{zahtjev.naslov}</p>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: badge.pozadina, color: badge.boja }}>
                          {badge.oznaka}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 text-xs" style={{ color: '#6B7C82' }}>
                        <span>{zahtjev.datum}</span>
                        {zahtjev.serviser && <span>Serviser: {zahtjev.serviser}</span>}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: '#C7B8A4' }} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
