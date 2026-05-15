'use client';

import Link from 'next/link';
import {
  ChevronLeft,
  Clock,
  MapPin,
  Phone,
  User,
  MessageSquare,
  XCircle,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { DispecerStatusBadge, PremiumHitnaBadge } from '@/components/servisirane/zahtjevBadgeovi';
import type { StatusZahtjeva } from '@/domain/types/servisirane';

/**
 * Probni sadržaj usklađen s `ServisniZahtjev`: status iz `StatusZahtjeva`,
 * operativni prioritet NISKO…HITNO, kategorije kvara kao u čarobnjaku.
 */
function mockIntervencijaZaZahtjev(zahtjevId: string) {
  return {
    zahtjevId,
    naslov: 'Elektro i rasvjeta — Osigurači iskaču',
    opisProblema:
      'Osigurači u razvodnoj kutiji iskaču pri uključivanju štednjaka u kuhinji. Dogodilo se prvi put jučer u večernjim satima; nema mirisa paljevine.',
    status: 'u_izvrsenju' as StatusZahtjeva,
    finalPriority: 'VISOKO' as const,
    isPremium: false,
    lokacija: 'Ul. Maršala Tita 12, Stan 5, Sarajevo',
    kontaktTelefon: '+387 61 234 567',
    datumKreiranja: '08. 05. 2026. 09:15',
    planiraniTermin: '12. 05. 2026. 08:30',
    serviser: {
      ime: 'Marko',
      prezime: 'Horvat',
      telefon: '+387 61 987 654',
    },
    historija: [
      { naziv: 'Zahtjev zaprimljen', datum: '08. 05. 2026. 09:15', napomena: 'Status: novi zahtjev (pending_review).' },
      { naziv: 'U čarobnjaku', datum: '08. 05. 2026. 10:00', napomena: 'Dispečer u čarobnjaku obrade (in_review).' },
      { naziv: 'Potvrđeno', datum: '08. 05. 2026. 11:20', napomena: 'Prioritet i termin potvrđeni u čarobnjaku (potvrdeno).' },
      { naziv: 'Dodijeljeno serviseru', datum: '09. 05. 2026. 08:45', napomena: 'Marko Horvat (dodijeljeno).' },
      {
        naziv: 'U toku — serviser na terenu',
        datum: '10. 05. 2026. 08:05',
        napomena: 'Serviser na lokaciji (u_izvrsenju).',
      },
    ],
  };
}

export default function IntervencijaDetaljePage({
  params,
}: {
  params: { id: string };
}) {
  const intervencija = mockIntervencijaZaZahtjev(params.id);

  return (
    <AppShell uloga="korisnik" imeKorisnika="Korisnik">
      <Link
        href="/korisnik/dashboard"
        className="mb-5 flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: 'var(--first-secondary)' }}
      >
        <ChevronLeft className="h-4 w-4" />
        Nazad na pregled
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div
            className="rounded-2xl p-6 shadow-card"
            style={{
              backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
              border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
            }}
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-semibold tabular-nums" style={{ color: 'var(--first-nonary)' }}>
                  Zahtjev #{intervencija.zahtjevId}
                </p>
                <h1 className="text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
                  {intervencija.naslov}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DispecerStatusBadge status={intervencija.status} />
                {intervencija.isPremium ? <PremiumHitnaBadge /> : null}
              </div>
            </div>

            <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--first-nonary)' }}>
              {intervencija.opisProblema}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: 'var(--first-nonary)' }}>
              <span className="flex min-w-0 max-w-full items-start gap-1.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--first-secondary)' }} />
                <span className="min-w-0 break-words font-medium leading-snug" style={{ color: 'var(--first-nonary)' }}>
                  {intervencija.lokacija}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" style={{ color: 'var(--first-secondary)' }} />
                Kreiran: {intervencija.datumKreiranja}
              </span>
            </div>
          </div>

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
                    {!isLast && (
                      <div
                        className="absolute left-[9px] top-5 h-full w-px"
                        style={{ backgroundColor: 'rgb(var(--first-quaternary-rgb) / 0.5)' }}
                      />
                    )}
                    <div
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2"
                      style={{
                        borderColor: isLast ? 'var(--first-primary)' : 'var(--first-quaternary)',
                        backgroundColor: isLast ? 'var(--first-primary)' : 'var(--first-tertiary)',
                      }}
                    >
                      {isLast ? <div className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
                        {event.naziv}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                        {event.datum}
                      </p>
                      {event.napomena ? (
                        <p className="mt-1 text-xs" style={{ color: 'var(--first-nonary)' }}>
                          {event.napomena}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

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
              placeholder="Dodajte napomenu ili poruku serviseru…"
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

        <div className="flex flex-col gap-5">
          {intervencija.serviser ? (
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
                  <p className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
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
          ) : null}

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
                { label: 'Operativni prioritet', value: intervencija.finalPriority },
                { label: 'Datum kreiranja', value: intervencija.datumKreiranja },
                { label: 'Planirani termin', value: intervencija.planiraniTermin },
                { label: 'Kontakt telefon', value: intervencija.kontaktTelefon },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <dt style={{ color: 'var(--first-nonary)' }}>{label}</dt>
                  <dd className="text-right font-medium tabular-nums" style={{ color: 'var(--first-octonary)' }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

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
