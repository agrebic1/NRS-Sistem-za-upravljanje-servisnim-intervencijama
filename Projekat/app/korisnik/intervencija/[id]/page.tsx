import { redirect } from 'next/navigation';

/**
 * Ruta /korisnik/intervencija/[id] je legacy alias.
 * Kompletna korisnička detaljna stranica je na /korisnik/zahtjevi/[id].
 */
export default function IntervencijaDetaljePage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/korisnik/zahtjevi/${params.id}`);
}
