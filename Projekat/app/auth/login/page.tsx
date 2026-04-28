import Link from 'next/link';
import { Settings, Wrench, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { LoginForm } from '@/components/forms/LoginForm';

// ─── Left panel pieces ───────────────────────────────────────────────────────

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div
      className="flex flex-col gap-0.5 rounded-xl p-4"
      style={{ backgroundColor: 'rgb(255 255 255 / 0.08)' }}
    >
      <span className="text-2xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: 'rgb(var(--first-tertiary-rgb) / 0.6)' }}>
        {label}
      </span>
    </div>
  );
}

type JobStatus = 'hitno' | 'u_toku' | 'zavrseno';

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }> = {
  hitno:    { label: 'Hitno',    color: 'var(--first-senary)', Icon: AlertTriangle },
  u_toku:   { label: 'U toku',   color: 'var(--first-secondary)', Icon: Clock },
  zavrseno: { label: 'Završeno', color: 'var(--first-septenary)', Icon: CheckCircle },
};

function JobRow({ title, time, status }: { title: string; time: string; status: JobStatus }) {
  const { color, Icon } = STATUS_CONFIG[status];
  return (
    <div
      className="flex items-center justify-between border-b py-2.5 last:border-0"
      style={{ borderColor: 'rgb(255 255 255 / 0.08)' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color }} />
        <span className="truncate text-xs leading-snug" style={{ color: 'rgb(var(--first-tertiary-rgb) / 0.85)' }}>
          {title}
        </span>
      </div>
      <span className="ml-3 flex-shrink-0 text-xs" style={{ color: 'rgb(var(--first-tertiary-rgb) / 0.4)' }}>
        {time}
      </span>
    </div>
  );
}

function DashboardVisualPanel() {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--first-primary)' }}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-16 -top-16 opacity-[0.06]" aria-hidden>
        <Settings className="h-80 w-80" strokeWidth={0.8} style={{ color: 'var(--first-tertiary)' }} />
      </div>
      <div className="pointer-events-none absolute -bottom-20 -left-12 opacity-[0.05]" aria-hidden>
        <Wrench className="h-64 w-64" strokeWidth={0.8} style={{ color: 'var(--first-tertiary)' }} />
      </div>

      <div className="relative flex flex-col gap-8 p-10 xl:p-14">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: 'rgb(var(--first-septenary-rgb) / 0.2)' }}
          >
            <Settings className="h-5 w-5" style={{ color: 'var(--first-septenary)' }} />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--first-tertiary)' }}>
            InterServ
          </span>
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-3xl font-bold leading-tight xl:text-4xl" style={{ color: 'var(--first-tertiary)' }}>
            Servisni menadžment sistem
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgb(var(--first-quaternary-rgb) / 0.75)' }}>
            Upravljanje intervencijama, serviseri na terenu i kompletna historija rada — sve na jednom mjestu.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard value="24"  label="Aktivnih"    color="var(--first-septenary)" />
          <StatCard value="12"  label="Servisera"   color="var(--first-secondary)" />
          <StatCard value="189" label="Završeno"    color="var(--first-quaternary)" />
        </div>

        {/* Recent interventions */}
        <div
          className="flex-1 rounded-2xl p-5"
          style={{ backgroundColor: 'rgb(255 255 255 / 0.07)' }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'rgb(var(--first-quaternary-rgb) / 0.7)' }}
          >
            Nedavne intervencije
          </p>
          <JobRow title="Električni kvar — Objekat A"        time="2 min"  status="hitno"    />
          <JobRow title="HVAC servis — Zona 3"               time="18 min" status="u_toku"   />
          <JobRow title="Vodoinstalaterski popravak — St. 204" time="1 sat" status="zavrseno" />
          <JobRow title="Lift — Toranj B"                    time="3 sata" status="zavrseno" />
        </div>

        {/* Trust signal */}
        <p className="text-xs" style={{ color: 'rgb(var(--first-tertiary-rgb) / 0.35)' }}>
          Koristi ga{' '}
          <span style={{ color: 'var(--first-septenary)' }}>1.200+ servisnih kompanija</span>{' '}
          u regionu
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--first-tertiary)' }}>
      {/* Left — visual panel (hidden below lg) */}
      <div className="hidden w-[58%] lg:block xl:w-[60%]">
        <DashboardVisualPanel />
      </div>

      {/* Right — form */}
      <div
        className="flex w-full flex-col items-center justify-center px-5 py-12 sm:px-8 lg:w-[42%] xl:w-[40%]"
        style={{ backgroundColor: 'var(--first-tertiary)' }}
      >
        {/* Mobile brand */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--first-primary)' }}>
            <Settings className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold" style={{ color: 'var(--first-octonary)' }}>InterServ</span>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm">
          <div
            className="rounded-2xl p-7 shadow-card-lg sm:p-8"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
                Prijava u sistem
              </h1>
              <p className="mt-1.5 text-sm" style={{ color: 'var(--first-nonary)' }}>
                Prijavite se kao korisnik usluge ili kao uposlenik sistema, u zavisnosti od naloga koji koristite.
              </p>
            </div>

            <LoginForm />

            <div
              className="mt-6 border-t pt-5"
              style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.4)' }}
            >
              <p className="text-center text-sm" style={{ color: 'var(--first-nonary)' }}>
                Nemate korisnički nalog?{' '}
                <Link
                  href="/auth/registracija"
                  className="font-semibold transition-opacity duration-200 hover:opacity-70"
                  style={{ color: 'var(--first-primary)' }}
                >
                  Kreirajte korisnički nalog
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
