'use client';

import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { DispecerStatusBadge } from '@/components/servisirane/zahtjevBadgeovi';
import { DISPECER_PALETA_STATUS } from '@/lib/servisirane/dispecerPaleta';
import {
  fazaObradeNazivZaKarticu,
  zahtjevJeNoviUPregleduDispecera,
} from '@/lib/servisirane/dispecerskeFaze';
import { zahtjevCekaObraduUInboxuDispecera } from '@/lib/servisirane/statusZahtjeva';

type DispecerPaletaStatus = (typeof DISPECER_PALETA_STATUS)[keyof typeof DISPECER_PALETA_STATUS];

function stilBedza(pal: DispecerPaletaStatus) {
  return {
    color: pal.tekst,
    backgroundColor: pal.pozadina,
    border: `1px solid ${pal.border}`,
  } as const;
}

function FazaBedz({ naziv, title }: { naziv: string; title?: string }) {
  return (
    <span
      className="inline-flex max-w-[12.5rem] truncate rounded-md px-2 py-0.5 text-[10px] font-semibold"
      style={stilBedza(DISPECER_PALETA_STATUS.neutral)}
      title={title ?? naziv}
    >
      {naziv}
    </span>
  );
}

/**
 * Prikazuje STATUS zahtjeva + FAZU obrade kao odvojene bedževe.
 *
 * - Inbox: "Novi" ili "U obradi" + faza (Procjena zahtjeva / Dogovor termina / Izbor servisera / Potvrda termina)
 * - Potvrdeno: DispecerStatusBadge + "Dodjela serviseru" faza
 * - Ostali aktivni statusi: samo DispecerStatusBadge
 */
export function DispecerPregledTokaBadzevi({ zahtjev }: { zahtjev: ServisniZahtjev }) {
  const uInboxu = zahtjevCekaObraduUInboxuDispecera(zahtjev.status);

  // Requests outside inbox (potvrdeno, dodijeljeno, u_radu, u_izvrsenju, zavrseno, etc.)
  if (!uInboxu) {
    const fazaNaziv = fazaObradeNazivZaKarticu(zahtjev);
    return (
      <span className="flex flex-wrap items-center gap-1">
        <DispecerStatusBadge status={zahtjev.status} />
        {fazaNaziv ? <FazaBedz naziv={fazaNaziv} /> : null}
      </span>
    );
  }

  const jeNovi    = zahtjevJeNoviUPregleduDispecera(zahtjev);
  const glavnaPal = jeNovi ? DISPECER_PALETA_STATUS.inbox : DISPECER_PALETA_STATUS.uObradi;
  const fazaNaziv = fazaObradeNazivZaKarticu(zahtjev);

  return (
    <span className="flex flex-wrap items-center gap-1">
      <span
        className="inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold"
        style={stilBedza(glavnaPal)}
      >
        {jeNovi ? 'Novi' : 'U obradi'}
      </span>
      {fazaNaziv ? (
        <FazaBedz naziv={fazaNaziv} title={`Faza: ${fazaNaziv}`} />
      ) : null}
    </span>
  );
}
