'use client';

import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { DispecerStatusBadge } from '@/components/servisirane/zahtjevBadgeovi';
import { DISPECER_PALETA_STATUS } from '@/lib/servisirane/dispecerPaleta';
import {
  nazivDispecerskeFazePregleda,
  uzmiDispecerskuFazuZaPregled,
  zahtjevJeNoviUPregleduDispecera,
} from '@/lib/servisirane/dispecerskeFaze';
import { zahtjevCekaObraduUInboxuDispecera } from '@/lib/servisirane/statusZahtjeva';

function stilBedza(pal: (typeof DISPECER_PALETA_STATUS)['inbox']) {
  return {
    color: pal.tekst,
    backgroundColor: pal.pozadina,
    border: `1px solid ${pal.border}`,
  } as const;
}

/**
 * Na pregledu: **Novi** dok dispečer nije postavio operativni prioritet; zatim **U obradi** + pod-faza
 * (dogovor termina, izbor servisera, potvrda u čarobnjaku). Izvan inboxa — bedž statusa iz baze.
 */
export function DispecerPregledTokaBadzevi({ zahtjev }: { zahtjev: ServisniZahtjev }) {
  if (!zahtjevCekaObraduUInboxuDispecera(zahtjev.status)) {
    return <DispecerStatusBadge status={zahtjev.status} />;
  }

  const jeNovi = zahtjevJeNoviUPregleduDispecera(zahtjev);
  const faza = uzmiDispecerskuFazuZaPregled(zahtjev);
  const glavnaPal = jeNovi ? DISPECER_PALETA_STATUS.inbox : DISPECER_PALETA_STATUS.uObradi;
  const prikaziPodfazu = !jeNovi && faza !== 'ceka_operativni_prioritet';

  return (
    <span className="flex flex-wrap items-center gap-1">
      <span
        className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold"
        style={stilBedza(glavnaPal)}
      >
        {jeNovi ? 'Novi' : 'U obradi'}
      </span>
      {prikaziPodfazu ? (
        <span
          className="inline-flex max-w-[12.5rem] truncate rounded-md px-2 py-0.5 text-[10px] font-semibold"
          style={stilBedza(DISPECER_PALETA_STATUS.neutral)}
          title={nazivDispecerskeFazePregleda(faza)}
        >
          {nazivDispecerskeFazePregleda(faza)}
        </span>
      ) : null}
    </span>
  );
}
