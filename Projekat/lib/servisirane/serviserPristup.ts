import type { createAdminClient } from '@/lib/supabase/admin';

type AdminClient = ReturnType<typeof createAdminClient>;

function getUlogaNaziv(uloga: unknown): string {
  if (!uloga) return '';
  if (Array.isArray(uloga)) return (uloga[0] as { naziv?: string })?.naziv ?? '';
  return (uloga as { naziv?: string })?.naziv ?? '';
}

/**
 * Provjera da li korisnik ima ulogu Serviser u bazi.
 * Vraća true ako ima pristup, false ako nema.
 */
export async function assertServiserAccess(
  supabase: AdminClient,
  userId:   string
): Promise<boolean> {
  const { data } = await supabase
    .from('uposlenici')
    .select('uloga(naziv), is_verified')
    .eq('id_uposlenika', userId)
    .maybeSingle();

  if (!data) return false;
  const naziv = getUlogaNaziv(data.uloga);
  return naziv === 'Serviser' || naziv === 'serviser';
}

/**
 * Provjera da li je zahtjev dodijeljen ovom serviseru.
 */
export async function assertServiserVlasnistvo(
  supabase:   AdminClient,
  zahtjevId:  number,
  servizerId: string
): Promise<{ ok: true; status: string; is_premium: boolean } | { ok: false; greska: string }> {
  const { data } = await supabase
    .from('service_requests')
    .select('serviser_dodijeljen_id, status, is_premium')
    .eq('id', zahtjevId)
    .maybeSingle();

  if (!data) return { ok: false, greska: 'Zahtjev nije pronađen.' };
  if (data.serviser_dodijeljen_id !== servizerId) {
    return { ok: false, greska: 'Nemate pristup ovom zadatku.' };
  }
  return { ok: true, status: data.status, is_premium: Boolean(data.is_premium) };
}

/** Dozvoljeni prijelazi statusa za servisera. */
export const SERVISER_DOZVOLJENI_PRIJELAZI: Record<string, string[]> = {
  dodijeljeno:  ['u_radu'],
  u_radu:       ['u_izvrsenju'],
  u_izvrsenju:  [], // serviser može evidencirati rad, ali ne mijenja status — dispatcher zatvara
};

export function serviserSmijeMijenjatiStatus(
  trenutni: string,
  novi:     string
): boolean {
  return (SERVISER_DOZVOLJENI_PRIJELAZI[trenutni] ?? []).includes(novi);
}
