'use client';

import Link from 'next/link';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Calendar,
  ClipboardCheck,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';

// ─── Mock data ────────────────────────────────────────────────────────────────

type TaskStatus = 'dodijeljen' | 'u_toku' | 'zavrsen';
type TaskPriority = 'normalno' | 'hitno';

interface Zadatak {
  id: string;
  naslov: string;
  lokacija: string;
  vrijemePocetka: string;
  status: TaskStatus;
  prioritet: TaskPriority;
  korisnik: string;
}

const MOCK_ZADACI: Zadatak[] = [
  { id: '1', naslov: 'Električni kvar — Objekat A',         lokacija: 'Ul. Ferhadija 8, Sarajevo',     vrijemePocetka: '08:30', status: 'u_toku',   prioritet: 'hitno',    korisnik: 'Amina Hodžić' },
  { id: '2', naslov: 'HVAC servis — Zona 3',                lokacija: 'Trg Oslobođenja 1, Sarajevo',   vrijemePocetka: '11:00', status: 'dodijeljen',prioritet: 'normalno', korisnik: 'Elma Karić' },
  { id: '3', naslov: 'Vodoinstalaterski popravak — St. 204',lokacija: 'Ul. Branilaca 12, Mostar',      vrijemePocetka: '14:00', status: 'dodijeljen',prioritet: 'normalno', korisnik: 'Sanel Mujić' },
  { id: '4', naslov: 'Lift — godišnji pregled',             lokacija: 'Ul. Maršala Tita 5, Sarajevo', vrijemePocetka: '16:30', status: 'zavrsen',   prioritet: 'normalno', korisnik: 'Adnan Čolić' },
];

const STATS = [
  { label: 'Ukupno zadataka',   value: 4, color: 'var(--first-secondary)', Icon: ClipboardCheck },
  { label: 'Danas',             value: 3, color: 'var(--first-septenary)', Icon: Calendar },
  { label: 'Završeno ovaj mj.', value: 12, color: 'var(--first-primary)', Icon: CheckCircle },
];

// ─── Status/priority pieces ───────────────────────────────────────────────────

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; color: string }> = {
  dodijeljen: { label: 'Dodijeljen', bg: 'rgb(var(--first-quaternary-rgb) / 0.2)',   color: 'var(--first-nonary)' },
  u_toku:     { label: 'U toku',    bg: 'rgb(var(--first-secondary-rgb) / 0.15)',   color: 'var(--first-secondary)' },
  zavrsen:    { label: 'Završen',   bg: 'rgb(var(--first-septenary-rgb) / 0.2)',   color: 'var(--first-septenary)' },
};

function TaskRow({ zadatak }: { zadatak: Zadatak }) {
  const { label, bg, color } = STATUS_CONFIG[zadatak.status];
  return (
    <li>
      <Link
        href={`/serviser/intervencija/${zadatak.id}`}
        className="flex items-start gap-4 px-5 py-4 transition-colors duration-150 hover:bg-soft-beige/10"
      >
        {/* Priority indicator */}
        <div className="mt-1 flex-shrink-0">
          {zadatak.prioritet === 'hitno' ? (
            <AlertTriangle className="h-4 w-4" style={{ color: 'var(--first-senary)' }} />
          ) : (
            <Clock className="h-4 w-4" style={{ color: 'var(--first-quinary)' }} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium" style={{ color: 'var(--first-octonary)' }}>
              {zadatak.naslov}
            </p>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: bg, color }}
            >
              {label}
            </span>
            {zadatak.prioritet === 'hitno' && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: 'rgb(var(--first-senary-rgb) / 0.12)', color: 'var(--first-senary)' }}
              >
                Hitno
              </span>
            )}
          </div>
          <div
            className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs"
            style={{ color: 'var(--first-nonary)' }}
          >
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {zadatak.vrijemePocetka}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {zadatak.lokacija}
            </span>
          </div>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--first-quinary)' }}>
            Korisnik: {zadatak.korisnik}
          </p>
        </div>

        <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0" style={{ color: 'var(--first-quinary)' }} />
      </Link>
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServiserDashboardPage() {
  const danas = new Date().toLocaleDateString('bs', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <AppShell uloga="serviser" imeKorisnika="Marko J.">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
          Dobro jutro, Marko!
        </h1>
        <p className="mt-1 text-sm capitalize" style={{ color: 'var(--first-nonary)' }}>
          {danas} — imate {MOCK_ZADACI.filter((z) => z.status !== 'zavrsen').length} aktivnih zadataka
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, color, Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl p-5 shadow-card"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
            }}
          >
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)` }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color }}>
                {value}
              </p>
              <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tasks for today */}
      <div
        className="rounded-2xl shadow-card"
        style={{
          backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
          border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgb(var(--first-quaternary-rgb) / 0.3)' }}
        >
          <h2 className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
            Zadaci za danas
          </h2>
          <Link
            href="/serviser/zadaci"
            className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--first-secondary)' }}
          >
            Svi zadaci <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="divide-y" style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.25)' }}>
          {MOCK_ZADACI.map((zadatak) => (
            <TaskRow key={zadatak.id} zadatak={zadatak} />
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
