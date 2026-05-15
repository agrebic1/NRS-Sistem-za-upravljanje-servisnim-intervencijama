import type { createClient } from '@/lib/supabase/server'

type KlijentSupabase = ReturnType<typeof createClient>

// Lokalni tipovi za tabele koje nisu u generiranim DB tipovima
// ili čiji join rezultati nisu automatski inferovani
type UposlenikSaUlogom = {
  id_uloge: number | null
  uloga: { naziv: string | null } | { naziv: string | null }[] | null
}

type ServiceRequestBasic = {
  serviser_dodijeljen_id: string | null
  status: string
  is_premium: boolean | null
}

function getUlogaNaziv(uloga: unknown): string {
  if (!uloga) return '';
  if (Array.isArray(uloga)) return (uloga[0] as { naziv?: string })?.naziv ?? '';
  return (uloga as { naziv?: string })?.naziv ?? '';
}

export async function assertServiserAccess(
  supabase: KlijentSupabase,
  userId:   string
): Promise<boolean> {
  const { data } = await supabase
    .from('uposlenici')
    .select('id_uloge, uloga(naziv)')
    .eq('id_uposlenika', userId)
    .maybeSingle() as unknown as { data: UposlenikSaUlogom | null }

  if (!data) return false;
  const naziv = getUlogaNaziv(data.uloga);
  return naziv === 'Serviser' || naziv === 'serviser';
}

export async function assertServiserVlasnistvo(
  supabase:   KlijentSupabase,
  zahtjevId:  number,
  servizerId: string
): Promise<{ ok: true; status: string; is_premium: boolean } | { ok: false; greska: string }> {
  // service_requests nije u generiranim tipovima — cast je neophodan
  const { data } = await (supabase as ReturnType<typeof createClient>)
    .from('service_requests' as never)
    .select('serviser_dodijeljen_id, status, is_premium')
    .eq('id', zahtjevId)
    .maybeSingle() as unknown as { data: ServiceRequestBasic | null }

  if (!data) return { ok: false, greska: 'Zahtjev nije pronađen.' };
  if (data.serviser_dodijeljen_id !== servizerId) {
    return { ok: false, greska: 'Nemate pristup ovom zadatku.' };
  }
  return { ok: true, status: data.status, is_premium: Boolean(data.is_premium) };
}

export const SERVISER_DOZVOLJENI_PRIJELAZI: Record<string, string[]> = {
  dodijeljeno:  ['u_radu'],
  u_radu:       ['u_izvrsenju'],
  u_izvrsenju:  [],
};

export function serviserSmijeMijenjatiStatus(
  trenutni: string,
  novi:     string
): boolean {
  return (SERVISER_DOZVOLJENI_PRIJELAZI[trenutni] ?? []).includes(novi);
}
