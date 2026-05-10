'use client';

import Link from 'next/link';
import { labelKategorije } from '@/lib/servisirane/kategorije';
import {
  imePrezimePodnosioca,
  preferiraniTerminZaDispecera,
  relativnoPrijavljenoZaDispecera,
} from '@/lib/servisirane/zahtjevPrikaz';
import {
  bojaRelativnogPrijaveDispecera,
  DISPECER_PALETA_HITNOST,
  DISPECER_PALETA_PREMIUM,
} from '@/lib/servisirane/dispecerPaleta';
import { DispecerPregledTokaBadzevi } from '@/components/dispecer/DispecerPregledTokaBadzevi';
import { DispecerPremiumKruna, KorisnickaHitnostOutlinedChip } from '@/components/servisirane/zahtjevBadgeovi';
import type { ZahtjevZaDispecerskuKarticu } from '@/components/dispecer/DispecerskaZahtjevKartica';
import {
  DISPECER_HITNOST_KORISNIK_NASLOV,
  DISPECER_OPERATIVNI_NASLOV,
} from '@/lib/servisirane/dispecerPojmovi';
import { efektivniKorisnickiUrgencyScore, inboxGrupaIzKorisnickeProcjene } from '@/lib/servisirane/urgency';

/** Kartica za Pregled zahtjeva — isti sadržaj kao red u listi, bez expand panela. */
export function DispecerskaZahtjevPregledGridKartica({ zahtjev }: { zahtjev: ZahtjevZaDispecerskuKarticu }) {
  const podnosilac = zahtjev.podnosilac;
  const { glavna } = labelKategorije(zahtjev);
  const { tekstCijeli: terminTekst } = preferiraniTerminZaDispecera(zahtjev);
  const imePrezime = imePrezimePodnosioca(podnosilac);
  const prijavljenoRel = relativnoPrijavljenoZaDispecera(zahtjev.created_at);
  const prijavljenoBoja = bojaRelativnogPrijaveDispecera(prijavljenoRel.ton);
  const scoreZaPrikaz = efektivniKorisnickiUrgencyScore(zahtjev);
  const grupaInboxaPoKorisniku = inboxGrupaIzKorisnickeProcjene(zahtjev);
  const accentBoja = zahtjev.is_premium
    ? DISPECER_PALETA_PREMIUM.akcent
    : DISPECER_PALETA_HITNOST[grupaInboxaPoKorisniku].border;

  return (
    <article
      className="flex h-full min-w-0 w-full flex-col overflow-hidden rounded-2xl shadow-sm transition-[box-shadow,border-color] duration-200 ease-out hover:shadow-md"
      style={{
        backgroundColor: 'rgb(255 255 255 / 0.72)',
        borderStyle: 'solid',
        borderColor: 'rgb(var(--first-quaternary-rgb) / 0.35)',
        borderWidth: 1,
        borderLeftWidth: 4,
        borderLeftColor: accentBoja,
      }}
    >
      <Link
        href={`/dispecer/zahtjevi/${zahtjev.id}`}
        className="flex min-h-[60px] min-w-0 flex-col gap-2 px-3 py-3 text-left transition-colors hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--first-secondary-rgb)/0.45)] focus-visible:ring-offset-2 sm:px-4"
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-x-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="inline-flex max-w-full items-center gap-1.5">
              <span
                className="inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums"
                style={{
                  backgroundColor: 'rgb(var(--first-quaternary-rgb) / 0.2)',
                  color: 'var(--first-octonary)',
                  border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
                }}
              >
                #{zahtjev.id}
              </span>
              {zahtjev.is_premium ? <DispecerPremiumKruna className="translate-y-px" /> : null}
            </span>
            <div className="max-w-full">
              <DispecerPregledTokaBadzevi zahtjev={zahtjev} />
            </div>
            <p className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--first-octonary)' }}>
              <span style={{ color: 'rgb(var(--first-nonary-rgb) / 0.78)' }}>{DISPECER_OPERATIVNI_NASLOV}: </span>
              {zahtjev.final_priority?.trim() || '—'}
            </p>
          </div>
          <div className="flex min-w-0 max-w-[10rem] flex-shrink-0 flex-col items-start gap-1 text-left sm:items-end sm:text-right">
            <span
              className="text-[10px] font-semibold uppercase leading-tight tracking-wide"
              style={{ color: 'rgb(var(--first-nonary-rgb) / 0.78)' }}
            >
              {DISPECER_HITNOST_KORISNIK_NASLOV}
            </span>
            <KorisnickaHitnostOutlinedChip score={scoreZaPrikaz} />
            <p
              suppressHydrationWarning
              className={[
                'max-w-full text-right text-[12px] leading-tight',
                prijavljenoRel.ton === 'stale' ? 'font-bold' : 'font-semibold',
              ].join(' ')}
              style={{ color: prijavljenoBoja }}
              title={prijavljenoRel.tooltipApsolutno}
            >
              {prijavljenoRel.label}
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <p
            className="truncate text-sm font-bold leading-tight"
            style={{ color: 'var(--first-octonary)' }}
            title={glavna}
          >
            {glavna}
          </p>
          <p
            className="mt-0.5 truncate text-xs font-medium leading-tight"
            style={{ color: 'var(--first-nonary)' }}
            title={imePrezime}
          >
            {imePrezime}
          </p>
          <div className="mt-1 flex min-w-0 items-center gap-1.5">
            <p
              className="min-w-0 flex-1 truncate text-xs font-semibold leading-tight tabular-nums"
              style={{ color: 'var(--first-octonary)' }}
              title={terminTekst}
            >
              {terminTekst}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
