'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Settings,
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Wrench,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { UserRole } from '@/domain/types';
import { odjaviSe } from '@/services/auth/authService';

// Konfiguracija navigacije po ulozi 

interface StavkaNavigacije {
  href:  string;
  oznaka: string;
  Ikona: React.ComponentType<{ className?: string }>;
}

const NAVIGACIJA_PO_ULOZI: Record<UserRole, StavkaNavigacije[]> = {
  korisnik: [
    { href: '/korisnik',               oznaka: 'Pregled',           Ikona: LayoutDashboard },
    { href: '/korisnik/intervencije',  oznaka: 'Moje intervencije', Ikona: ClipboardList },
    { href: '/korisnik/novi_zahtjev',  oznaka: 'Prijavi kvar',      Ikona: PlusCircle },
  ],
  serviser: [
    { href: '/serviser',               oznaka: 'Pregled',       Ikona: LayoutDashboard },
    { href: '/serviser/zadaci',        oznaka: 'Moji zadaci',   Ikona: ClipboardList },
    { href: '/serviser/intervencije',  oznaka: 'Intervencije',  Ikona: Wrench },
  ],
  dispecer: [
    { href: '/dispecer',               oznaka: 'Pregled',       Ikona: LayoutDashboard },
    { href: '/dispecer/zahtjevi',      oznaka: 'Zahtjevi',      Ikona: ClipboardList },
    { href: '/dispecer/intervencije',  oznaka: 'Intervencije',  Ikona: Wrench },
  ],
  admin: [
    { href: '/admin',                  oznaka: 'Pregled',       Ikona: LayoutDashboard },
    { href: '/admin/korisnici',        oznaka: 'Korisnici',     Ikona: Users },
    { href: '/admin/serviseri',        oznaka: 'Serviseri',     Ikona: Wrench },
  ],
};

const OZNAKA_ULOGE: Record<UserRole, string> = {
  korisnik: 'Korisnik usluge',
  serviser: 'Serviser',
  dispecer: 'Dispečer',
  admin:    'Administrator',
};

// Stavka navigacije 

function VezaNavigacije({ stavka, onKlik }: { stavka: StavkaNavigacije; onKlik?: () => void }) {
  const putanja  = usePathname();
  const jeAktivna = putanja === stavka.href || putanja.startsWith(stavka.href + '/');

  return (
    <Link
      href={stavka.href}
      onClick={onKlik}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200"
      style={{
        backgroundColor: jeAktivna ? 'rgb(var(--first-primary-rgb) / 0.1)' : 'transparent',
        color:           jeAktivna ? 'var(--first-primary)' : 'var(--first-nonary)',
      }}
    >
      <stavka.Ikona className="h-4 w-4 flex-shrink-0" />
      {stavka.oznaka}
    </Link>
  );
}

// Glavna komponenta 

interface AppShellProps {
  children:    ReactNode;
  uloga:       UserRole;
  imeKorisnika?: string;
}

export function AppShell({ children, uloga, imeKorisnika }: AppShellProps) {
  const [jeMenuOtvoren, setJeMenuOtvoren] = useState(false);
  const [jeOdjavaUToku, setJeOdjavaUToku] = useState(false);
  const router = useRouter();
  const stavkeNavigacije = NAVIGACIJA_PO_ULOZI[uloga] ?? [];

  async function odjaviKorisnika() {
    setJeOdjavaUToku(true);
    await odjaviSe();
    router.replace('/auth/login');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--first-tertiary)' }}>
      {/* Gornja traka */}
      <header
        className="sticky top-0 z-40 flex h-14 items-center justify-between px-4 md:px-6"
        style={{
          backgroundColor: 'rgb(var(--first-tertiary-rgb) / 0.92)',
          backdropFilter:  'blur(12px)',
          borderBottom:    '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
        }}
      >
        <Link href={`/${uloga}`} className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--first-primary)' }}>
            <Settings className="h-4 w-4 text-white" />
          </div>
          <span className="hidden font-bold tracking-tight sm:block" style={{ color: 'var(--first-octonary)' }}>
            InterServ
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {stavkeNavigacije.map((stavka) => (
            <VezaNavigacije key={stavka.href} stavka={stavka} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={odjaviKorisnika}
            disabled={jeOdjavaUToku}
            className="hidden items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-soft-beige/30 disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex"
            style={{ color: 'var(--color-mystic-ember)' }}
            aria-label="Odjava"
          >
            <LogOut className="h-4 w-4" />
            {jeOdjavaUToku ? 'Odjavljivanje...' : 'Odjava'}
          </button>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-soft-beige/30"
            style={{ color: 'var(--first-nonary)' }}
            aria-label="Obavještenja"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <div className="text-right">
              <p className="text-xs font-semibold leading-none" style={{ color: 'var(--first-octonary)' }}>
                {imeKorisnika ?? 'Korisnik'}
              </p>
              <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                {OZNAKA_ULOGE[uloga]}
              </p>
            </div>
            <button
              type="button"
              onClick={odjaviKorisnika}
              disabled={jeOdjavaUToku}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                color: 'var(--first-senary)',
                backgroundColor: 'rgb(var(--first-senary-rgb) / 0.08)',
              }}
            >
              <LogOut className="h-4 w-4" />
              {jeOdjavaUToku ? 'Odjavljivanje...' : 'Odjava'}
            </button>
          </div>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-soft-beige/30 md:hidden"
            style={{ color: 'var(--first-octonary)' }}
            onClick={() => setJeMenuOtvoren(true)}
            aria-label="Otvori meni"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobilni drawer */}
      {jeMenuOtvoren && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setJeMenuOtvoren(false)}
          />
          <div
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col p-5 md:hidden"
            style={{ backgroundColor: 'var(--first-tertiary)' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--first-primary)' }}>
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>InterServ</span>
              </div>
              <button
                onClick={() => setJeMenuOtvoren(false)}
                className="rounded-lg p-1.5 hover:bg-soft-beige/30"
                style={{ color: 'var(--first-nonary)' }}
                aria-label="Zatvori meni"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5 rounded-xl px-4 py-3" style={{ backgroundColor: 'rgb(var(--first-quaternary-rgb) / 0.2)' }}>
              <p className="font-semibold" style={{ color: 'var(--first-octonary)' }}>{imeKorisnika ?? 'Korisnik'}</p>
              <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>{OZNAKA_ULOGE[uloga]}</p>
            </div>

            <nav className="flex flex-col gap-1">
              {stavkeNavigacije.map((stavka) => (
                <VezaNavigacije key={stavka.href} stavka={stavka} onKlik={() => setJeMenuOtvoren(false)} />
              ))}
            </nav>

            <div className="mt-auto border-t pt-4" style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.4)' }}>
              <button
                type="button"
                onClick={odjaviKorisnika}
                disabled={jeOdjavaUToku}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                style={{ color: 'var(--first-senary)' }}
              >
                <span className="flex items-center gap-3">
                  <LogOut className="h-4 w-4" />
                  {jeOdjavaUToku ? 'Odjavljivanje...' : 'Odjava'}
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Sadržaj stranice */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
