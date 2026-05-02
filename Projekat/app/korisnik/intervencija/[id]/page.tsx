'use client';

import Link from 'next/link';
import {
  ChevronLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Phone,
  User,
  MessageSquare,
  XCircle,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_INTERVENCIJA = {
  id: '1',
  naslov: 'Električni kvar u dnevnoj sobi',
  opisProblema: 'Struja nestala u dnevnoj sobi i hodniku. Osigurač se vraća ali struja ne proradi. Problem nastao jučer u večernjim satima.',
  status: 'u_toku' as const,
  prioritet: 'hitno' as const,
  lokacija: 'Ul. Ferhadija 8, Stan 304, Sarajevo',
  kontaktTelefon: '+387 61 234 567',
  datumKreiranja: '23. 04. 2026. 09:15',
  datumIntervencije: '24. 04. 2026.',
  serviser: {
    ime: 'Marko',
    prezime: 'Jovanović',
    telefon: '+387 61 987 654',
  },
  historija: [
    { naziv: 'Zahtjev primljen',       datum: '23. 04. 2026. 09:15', napomena: '' },
    { naziv: 'Pregled od strane dispečera', datum: '23. 04. 2026. 10:00', napomena: 'Zahtjev pregledan i odobren.' },
    { naziv: 'Dodijeljen serviseru',  datum: '23. 04. 2026. 10:30', napomena: 'Dodijeljeno: Marko Jovanović' },
    { naziv: 'Intervencija u toku',   datum: '24. 04. 2026. 08:00', napomena: 'Serviser stigao na lokaciju.' },
  ],
};

type IntervencijaStatus = 'novi' | 'u_toku' | 'zavrsen' | 'hitno';

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; Icon: React.ComponentType<{ className?: string }> }> = {
  novi:    { label: 'Novi',    bg: 'rgb(var(--first-quaternary-rgb) / 0.2)',  color: 'var(--first-nonary)', Icon: Clock },
  u_toku:  { label: 'U toku', bg: 'rgb(var(--first-secondary-rgb) / 0.15)',  color: 'var(--first-secondary)', Icon: Clock },
  zavrsen: { label: 'Završen',bg: 'rgb(var(--first-septenary-rgb) / 0.2)',  color: 'var(--first-septenary)', Icon: CheckCircle },
  hitno:   { label: 'Hitno',  bg: 'rgb(var(--first-senary-rgb) / 0.12)',   color: 'var(--first-senary)', Icon: AlertTriangle },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntervencijaDetaljePage({
  params,
}: {
  params: { id: string };
}) {
  const intervencija = MOCK_INTERVENCIJA;
  const statusCfg = STATUS_CONFIG[intervencija.status];

  return (
    <AppShell uloga="korisnik" imeKorisnika="Amina H.">
      {/* Back link */}
      <Link
        href="/korisnik/dashboard"
        className="mb-5 flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: 'var(--first-secondary)' }}
      >
        <ChevronLeft className="h-4 w-4" />
        Nazad na pregled
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content — left 2/3 */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Header card */}
          <div
            className="rounded-2xl p-6 shadow-card"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
            }}
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
                {intervencija.naslov}
              </h1>
              <span
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
                style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
              >
                <statusCfg.Icon className="h-3.5 w-3.5" />
                {statusCfg.label}
              </span>
            </div>

            <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--first-nonary)' }}>
              {intervencija.opisProblema}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: 'var(--first-nonary)' }}>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" style={{ color: 'var(--first-secondary)' }} />
                {intervencija.lokacija}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" style={{ color: 'var(--first-secondary)' }} />
                Kreiran: {intervencija.datumKreiranja}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div
            className="rounded-2xl p-6 shadow-card"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
            }}
          >
            <h2 className="mb-5 font-semibold" style={{ color: 'var(--first-octonary)' }}>
              Historija zahtjeva
            </h2>
            <ol className="relative flex flex-col gap-0">
              {intervencija.historija.map((event, i) => {
                const isLast = i === intervencija.historija.length - 1;
                return (
                  <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                    {/* Connector line */}
                    {!isLast && (
                      <div
                        className="absolute left-[9px] top-5 h-full w-px"
                        style={{ backgroundColor: 'rgb(var(--first-quaternary-rgb) / 0.5)' }}
                      />
                    )}
                    {/* Dot */}
                    <div
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2"
                      style={{
                        borderColor: isLast ? 'var(--first-primary)' : 'var(--first-quaternary)',
                        backgroundColor: isLast ? 'var(--first-primary)' : 'var(--first-tertiary)',
                      }}
                    >
                      {isLast && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--first-octonary)' }}>
                        {event.naziv}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                        {event.datum}
                      </p>
                      {event.napomena && (
                        <p className="mt-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                          {event.napomena}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Notes */}
          <div
            className="rounded-2xl p-6 shadow-card"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" style={{ color: 'var(--first-secondary)' }} />
              <h2 className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                Napomene
              </h2>
            </div>
            <textarea
              className="w-full resize-none rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2"
              rows={3}
              placeholder="Dodajte napomenu ili poruku serviseru..."
              style={{
                borderColor: 'var(--first-quaternary)',
                backgroundColor: 'rgb(255 255 255 / 0.5)',
                color: 'var(--first-octonary)',
              }}
            />
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="secondary">
                Pošalji napomenu
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar — right 1/3 */}
        <div className="flex flex-col gap-5">
          {/* Assigned technician */}
          {intervencija.serviser && (
            <div
              className="rounded-2xl p-5 shadow-card"
              style={{
                backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
                border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
              }}
            >
              <h3
                className="mb-4 text-xs font-semibold uppercase tracking-widest"
                style={{ color: 'var(--first-nonary)' }}
              >
                Dodijeljeni serviser
              </h3>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgb(var(--first-primary-rgb) / 0.1)' }}
                >
                  <User className="h-5 w-5" style={{ color: 'var(--first-primary)' }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--first-octonary)' }}>
                    {intervencija.serviser.ime} {intervencija.serviser.prezime}
                  </p>
                  <a
                    href={`tel:${intervencija.serviser.telefon}`}
                    className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
                    style={{ color: 'var(--first-secondary)' }}
                  >
                    <Phone className="h-3 w-3" />
                    {intervencija.serviser.telefon}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Info card */}
          <div
            className="rounded-2xl p-5 shadow-card"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
            }}
          >
            <h3
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--first-nonary)' }}
            >
              Informacije
            </h3>
            <dl className="flex flex-col gap-3 text-sm">
              {[
                { label: 'Prioritet',         value: intervencija.prioritet === 'hitno' ? 'Hitno' : 'Normalno' },
                { label: 'Datum kreiranja',   value: intervencija.datumKreiranja },
                { label: 'Planirani datum',   value: intervencija.datumIntervencije },
                { label: 'Kontakt telefon',   value: intervencija.kontaktTelefon },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <dt style={{ color: 'var(--first-nonary)' }}>{label}</dt>
                  <dd className="text-right font-medium" style={{ color: 'var(--first-octonary)' }}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Actions */}
          <div
            className="rounded-2xl p-5 shadow-card"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
            }}
          >
            <h3
              className="mb-4 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--first-nonary)' }}
            >
              Akcije
            </h3>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="sm" className="w-full justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                Kontaktiraj servis
              </Button>
              <Button variant="danger" size="sm" className="w-full justify-start gap-2">
                <XCircle className="h-4 w-4" />
                Otkaži zahtjev
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
