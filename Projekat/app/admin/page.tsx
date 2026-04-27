'use client';

import Link from 'next/link';
import { Users, UserCheck, UserX, ShieldOff, ChevronRight, PlusCircle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';

// ─── Mock podaci ──────────────────────────────────────────────────────────────

type StatusKorisnika = 'aktivan' | 'neaktivan' | 'suspendovan';

interface MockKorisnik {
  id: string;
  imeIPrezime: string;
  email: string;
  uloga: string;
  status: StatusKorisnika;
  datumRegistracije: string;
}

const MOCK_KORISNICI: MockKorisnik[] = [
  { id: '1', imeIPrezime: 'Amina Hodžić',  email: 'amina@email.com',  uloga: 'Korisnik usluge', status: 'aktivan',     datumRegistracije: '01.04.2026.' },
  { id: '2', imeIPrezime: 'Marko Jovanović',email: 'marko@email.com',  uloga: 'Serviser',        status: 'aktivan',     datumRegistracije: '15.03.2026.' },
  { id: '3', imeIPrezime: 'Elma Karić',    email: 'elma@email.com',   uloga: 'Korisnik usluge', status: 'neaktivan',   datumRegistracije: '10.02.2026.' },
  { id: '4', imeIPrezime: 'Sanel Mujić',   email: 'sanel@email.com',  uloga: 'Dispečer',        status: 'aktivan',     datumRegistracije: '05.01.2026.' },
  { id: '5', imeIPrezime: 'Adnan Čolić',   email: 'adnan@email.com',  uloga: 'Korisnik usluge', status: 'suspendovan', datumRegistracije: '20.12.2025.' },
];

const KPI_KARTICE = [
  { oznaka: 'Ukupno korisnika',   vrijednost: 5, boja: '#2C444D', Ikona: Users },
  { oznaka: 'Aktivni',            vrijednost: 3, boja: '#5A7C83', Ikona: UserCheck },
  { oznaka: 'Neaktivni',          vrijednost: 1, boja: '#D4B27F', Ikona: UserX },
  { oznaka: 'Suspendovani',       vrijednost: 1, boja: '#8B4A2B', Ikona: ShieldOff },
];

const BADGE_STATUSA: Record<StatusKorisnika, { oznaka: string; pozadina: string; boja: string }> = {
  aktivan:     { oznaka: 'Aktivan',     pozadina: 'rgba(90,124,131,0.15)',  boja: '#5A7C83' },
  neaktivan:   { oznaka: 'Neaktivan',   pozadina: 'rgba(212,178,127,0.2)', boja: '#D4B27F' },
  suspendovan: { oznaka: 'Suspendovan', pozadina: 'rgba(139,74,43,0.12)',  boja: '#8B4A2B' },
};

// ─── Stranica ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  return (
    <AppShell uloga="admin" imeKorisnika="Administrator">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1F2A30' }}>Pregled sistema</h1>
          <p className="mt-1 text-sm" style={{ color: '#6B7C82' }}>
            Upravljanje korisnicima i podešavanjima sistema.
          </p>
        </div>
        <Link href="/admin/korisnici/novi">
          <Button size="md" className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4" />
            Dodaj korisnika
          </Button>
        </Link>
      </div>

      {/* KPI kartice — 4 u redu */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {KPI_KARTICE.map(({ oznaka, vrijednost, boja, Ikona }) => (
          <div
            key={oznaka}
            className="flex flex-col gap-3 rounded-2xl p-5 shadow-card"
            style={{ backgroundColor: 'rgba(199, 184, 164, 0.22)', border: '1px solid rgba(204, 182, 142, 0.35)' }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${boja}18` }}>
              <Ikona className="h-5 w-5" style={{ color: boja }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: boja }}>{vrijednost}</p>
              <p className="text-xs" style={{ color: '#6B7C82' }}>{oznaka}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabela korisnika */}
      <div
        className="rounded-2xl shadow-card"
        style={{ backgroundColor: 'rgba(199, 184, 164, 0.22)', border: '1px solid rgba(204, 182, 142, 0.35)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(204, 182, 142, 0.3)' }}
        >
          <h2 className="font-semibold" style={{ color: '#1F2A30' }}>Korisnici sistema</h2>
          <Link
            href="/admin/korisnici"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: '#5A7C83' }}
          >
            Svi korisnici <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Desktop tabela */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(204, 182, 142, 0.25)' }}>
                {['Ime i prezime', 'Email', 'Uloga', 'Status', 'Registrovan', ''].map((zaglavlje) => (
                  <th
                    key={zaglavlje}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#6B7C82' }}
                  >
                    {zaglavlje}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(204, 182, 142, 0.2)' }}>
              {MOCK_KORISNICI.map((korisnik) => {
                const badge = BADGE_STATUSA[korisnik.status];
                return (
                  <tr key={korisnik.id} className="transition-colors hover:bg-[#CCB68E]/10">
                    <td className="px-5 py-3.5 font-medium" style={{ color: '#1F2A30' }}>{korisnik.imeIPrezime}</td>
                    <td className="px-5 py-3.5" style={{ color: '#6B7C82' }}>{korisnik.email}</td>
                    <td className="px-5 py-3.5" style={{ color: '#6B7C82' }}>{korisnik.uloga}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: badge.pozadina, color: badge.boja }}>
                        {badge.oznaka}
                      </span>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: '#6B7C82' }}>{korisnik.datumRegistracije}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/korisnici/${korisnik.id}`}
                        className="text-xs font-medium transition-opacity hover:opacity-70"
                        style={{ color: '#5A7C83' }}
                      >
                        Uredi
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobilna lista */}
        <ul className="divide-y sm:hidden" style={{ borderColor: 'rgba(204, 182, 142, 0.25)' }}>
          {MOCK_KORISNICI.map((korisnik) => {
            const badge = BADGE_STATUSA[korisnik.status];
            return (
              <li key={korisnik.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium" style={{ color: '#1F2A30' }}>{korisnik.imeIPrezime}</p>
                  <p className="text-xs" style={{ color: '#6B7C82' }}>{korisnik.uloga}</p>
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: badge.pozadina, color: badge.boja }}>
                  {badge.oznaka}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </AppShell>
  );
}
