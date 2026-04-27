'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  UserX,
  ShieldOff,
  ChevronRight,
  PlusCircle,
  RefreshCw,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';

type StatusKorisnika = 'aktivan' | 'neaktivan' | 'suspendovan';

interface KorisnikSistema {
  id: string;
  imeIPrezime: string;
  email: string;
  uloga: string;
  status: StatusKorisnika;
  datumRegistracije: string;
  tip: 'korisnik' | 'uposlenik';
}

const BADGE_STATUSA: Record<StatusKorisnika, { oznaka: string; pozadina: string; boja: string }> = {
  aktivan: { oznaka: 'Aktivan', pozadina: 'rgb(var(--rgb-celestial-teal) / 0.15)', boja: 'var(--color-celestial-teal)' },
  neaktivan: { oznaka: 'Neaktivan', pozadina: 'rgb(var(--rgb-herbal-gold) / 0.2)', boja: 'var(--color-herbal-gold)' },
  suspendovan: { oznaka: 'Suspendovan', pozadina: 'rgb(var(--rgb-mystic-ember) / 0.12)', boja: 'var(--color-mystic-ember)' },
};

export default function AdminPage() {
  const [korisnici, setKorisnici] = useState<KorisnikSistema[]>([]);
  const [greska, setGreska] = useState<string | null>(null);
  const [ucitava, setUcitava] = useState(true);

  async function ucitajKorisnike() {
    setUcitava(true);
    setGreska(null);

    try {
      const odgovor = await fetch('/api/admin/users', { cache: 'no-store' });
      const podaci = await odgovor.json();

      if (!odgovor.ok) {
        throw new Error(podaci.error ?? 'Nije moguce ucitati korisnike.');
      }

      setKorisnici(podaci.users ?? []);
    } catch (error) {
      setGreska(error instanceof Error ? error.message : 'Nije moguce ucitati korisnike.');
    } finally {
      setUcitava(false);
    }
  }

  useEffect(() => {
    ucitajKorisnike();
  }, []);

  const kpiKartice = useMemo(
    () => [
      { oznaka: 'Ukupno korisnika', vrijednost: korisnici.length, boja: 'var(--color-deep-teal)', Ikona: Users },
      {
        oznaka: 'Aktivni',
        vrijednost: korisnici.filter((korisnik) => korisnik.status === 'aktivan').length,
        boja: 'var(--color-celestial-teal)',
        Ikona: UserCheck,
      },
      {
        oznaka: 'Neaktivni',
        vrijednost: korisnici.filter((korisnik) => korisnik.status === 'neaktivan').length,
        boja: 'var(--color-herbal-gold)',
        Ikona: UserX,
      },
      {
        oznaka: 'Suspendovani',
        vrijednost: korisnici.filter((korisnik) => korisnik.status === 'suspendovan').length,
        boja: 'var(--color-mystic-ember)',
        Ikona: ShieldOff,
      },
    ],
    [korisnici]
  );

  return (
    <AppShell uloga="admin" imeKorisnika="Administrator">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-main)' }}>
            Pregled sistema
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Upravljanje korisnicima i podesavanjima sistema.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={ucitajKorisnike}
            isLoading={ucitava}
            loadingText="Ucitavanje..."
          >
            <RefreshCw className="h-4 w-4" />
            Osvjezi
          </Button>
          <Link href="/admin/korisnici/novi">
            <Button size="md" className="w-full sm:w-auto">
              <PlusCircle className="h-4 w-4" />
              Dodaj korisnika
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpiKartice.map(({ oznaka, vrijednost, boja, Ikona }) => (
          <div
            key={oznaka}
            className="flex flex-col gap-3 rounded-2xl p-5 shadow-card"
            style={{
              backgroundColor: 'rgb(var(--rgb-muted-sand) / 0.22)',
              border: '1px solid rgb(var(--rgb-soft-beige) / 0.35)',
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `color-mix(in srgb, ${boja} 10%, transparent)` }}
            >
              <Ikona className="h-5 w-5" style={{ color: boja }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: boja }}>
                {vrijednost}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {oznaka}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl shadow-card"
        style={{
          backgroundColor: 'rgb(var(--rgb-muted-sand) / 0.22)',
          border: '1px solid rgb(var(--rgb-soft-beige) / 0.35)',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgb(var(--rgb-soft-beige) / 0.3)' }}
        >
          <h2 className="font-semibold" style={{ color: 'var(--color-text-main)' }}>
            Korisnici sistema
          </h2>
          <Link
            href="/admin/korisnici"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-celestial-teal)' }}
          >
            Svi korisnici <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {greska && (
          <div
            className="mx-5 mt-4 rounded-xl border px-4 py-3 text-sm"
            style={{
              borderColor: 'rgb(var(--rgb-mystic-ember) / 0.25)',
              backgroundColor: 'rgb(var(--rgb-mystic-ember) / 0.06)',
              color: 'var(--color-mystic-ember)',
            }}
          >
            {greska}
          </div>
        )}

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgb(var(--rgb-soft-beige) / 0.25)' }}>
                {['Ime i prezime', 'Email', 'Uloga', 'Status', 'Registrovan', ''].map((zaglavlje) => (
                  <th
                    key={zaglavlje}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {zaglavlje}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgb(var(--rgb-soft-beige) / 0.2)' }}>
              {ucitava && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    Ucitavanje korisnika...
                  </td>
                </tr>
              )}

              {!ucitava && korisnici.length === 0 && !greska && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    Nema korisnika za prikaz.
                  </td>
                </tr>
              )}

              {!ucitava &&
                korisnici.map((korisnik) => {
                  const badge = BADGE_STATUSA[korisnik.status];

                  return (
                    <tr key={korisnik.id} className="transition-colors hover:bg-soft-beige/10">
                      <td className="px-5 py-3.5 font-medium" style={{ color: 'var(--color-text-main)' }}>
                        {korisnik.imeIPrezime}
                      </td>
                      <td className="px-5 py-3.5" style={{ color: 'var(--color-text-muted)' }}>
                        {korisnik.email}
                      </td>
                      <td className="px-5 py-3.5" style={{ color: 'var(--color-text-muted)' }}>
                        {korisnik.uloga}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{ backgroundColor: badge.pozadina, color: badge.boja }}
                        >
                          {badge.oznaka}
                        </span>
                      </td>
                      <td className="px-5 py-3.5" style={{ color: 'var(--color-text-muted)' }}>
                        {korisnik.datumRegistracije}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/korisnici/${korisnik.id}`}
                          className="text-xs font-medium transition-opacity hover:opacity-70"
                          style={{ color: 'var(--color-celestial-teal)' }}
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

        <ul className="divide-y sm:hidden" style={{ borderColor: 'rgb(var(--rgb-soft-beige) / 0.25)' }}>
          {ucitava && (
            <li className="px-5 py-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Ucitavanje korisnika...
            </li>
          )}

          {!ucitava && korisnici.length === 0 && !greska && (
            <li className="px-5 py-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Nema korisnika za prikaz.
            </li>
          )}

          {!ucitava &&
            korisnici.map((korisnik) => {
              const badge = BADGE_STATUSA[korisnik.status];

              return (
                <li key={korisnik.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text-main)' }}>
                      {korisnik.imeIPrezime}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {korisnik.email}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: badge.pozadina, color: badge.boja }}
                  >
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
