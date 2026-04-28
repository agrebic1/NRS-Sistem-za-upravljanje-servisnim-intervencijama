'use client';

import Link from 'next/link';
import { ClipboardList, Clock, Wrench, ChevronRight, AlertTriangle, User } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';

// ─── Mock podaci ──────────────────────────────────────────────────────────────

type StatusZahtjeva = 'novi' | 'u_obradi' | 'aktivan';

interface MockPristiglihZahtjev {
  id: string;
  naslov: string;
  korisnik: string;
  vrijemeSlanja: string;
  status: StatusZahtjeva;
  jeHitno: boolean;
}

const MOCK_ZAHTJEVI: MockPristiglihZahtjev[] = [
  { id: '1', naslov: 'Električni kvar u stanu', korisnik: 'Amina Hodžić',  vrijemeSlanja: 'Danas, 09:15', status: 'novi',    jeHitno: true },
  { id: '2', naslov: 'Curenje vode — 2. sprat', korisnik: 'Elma Karić',    vrijemeSlanja: 'Danas, 08:40', status: 'u_obradi',jeHitno: false },
  { id: '3', naslov: 'Lift ne radi',            korisnik: 'Sanel Mujić',   vrijemeSlanja: 'Jučer, 17:30', status: 'aktivan',  jeHitno: false },
  { id: '4', naslov: 'HVAC servis — Zona 2',    korisnik: 'Adnan Čolić',   vrijemeSlanja: 'Jučer, 14:00', status: 'novi',    jeHitno: false },
];

const KPI_KARTICE = [
  { oznaka: 'Novi zahtjevi', vrijednost: 2, boja: 'var(--color-mystic-ember)', Ikona: ClipboardList },
  { oznaka: 'U obradi',      vrijednost: 1, boja: 'var(--color-celestial-teal)', Ikona: Clock },
  { oznaka: 'Aktivnih',      vrijednost: 1, boja: 'var(--color-herbal-gold)', Ikona: Wrench },
];

const BADGE_STATUSA: Record<StatusZahtjeva, { oznaka: string; pozadina: string; boja: string }> = {
  novi:     { oznaka: 'Novi',     pozadina: 'rgb(var(--rgb-mystic-ember) / 0.12)',   boja: 'var(--color-mystic-ember)' },
  u_obradi: { oznaka: 'U obradi', pozadina: 'rgb(var(--rgb-celestial-teal) / 0.15)', boja: 'var(--color-celestial-teal)' },
  aktivan:  { oznaka: 'Aktivan',  pozadina: 'rgb(var(--rgb-herbal-gold) / 0.2)', boja: 'var(--color-herbal-gold)' },
};

// ─── Stranica ─────────────────────────────────────────────────────────────────

export default function DispecerPage() {
  return (
    <AppShell uloga="dispecer" imeKorisnika="Dispečer">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>Pregled zahtjeva</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>Upravljanje pristiglim servisnim zahtjevima.</p>
        </div>
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

      {/* Pristigli zahtjevi */}
      <div
        className="rounded-2xl shadow-card"
        style={{ backgroundColor: 'rgb(var(--rgb-muted-sand) / 0.22)', border: '1px solid rgb(var(--rgb-soft-beige) / 0.35)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgb(var(--rgb-soft-beige) / 0.3)' }}
        >
          <h2 className="font-semibold" style={{ color: 'var(--color-text-main)' }}>Pristigli zahtjevi</h2>
          <Link
            href="/dispecer/zahtjevi"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-celestial-teal)' }}
          >
            Svi zahtjevi <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="divide-y" style={{ borderColor: 'rgb(var(--rgb-soft-beige) / 0.25)' }}>
          {MOCK_ZAHTJEVI.map((zahtjev) => {
            const badge = BADGE_STATUSA[zahtjev.status];
            return (
              <li key={zahtjev.id}>
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-shrink-0">
                    {zahtjev.jeHitno
                      ? <AlertTriangle className="h-4 w-4" style={{ color: 'var(--color-mystic-ember)' }} />
                      : <User className="h-4 w-4" style={{ color: 'var(--color-muted-sand)' }} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium" style={{ color: 'var(--color-text-main)' }}>{zahtjev.naslov}</p>
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: badge.pozadina, color: badge.boja }}>
                        {badge.oznaka}
                      </span>
                      {zahtjev.jeHitno && (
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: 'rgb(var(--rgb-mystic-ember) / 0.12)', color: 'var(--color-mystic-ember)' }}>
                          Hitno
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <span>{zahtjev.korisnik}</span>
                      <span>{zahtjev.vrijemeSlanja}</span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <Button size="sm" variant="secondary">Dodijeli</Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
