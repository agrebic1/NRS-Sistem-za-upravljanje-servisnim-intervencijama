import type { SupabaseClient } from '@supabase/supabase-js';

function getUlogaNaziv(uloga: unknown): string {
  if (!uloga) return '';
  if (Array.isArray(uloga)) return (uloga[0] as { naziv?: string })?.naziv ?? '';
  return (uloga as { naziv?: string })?.naziv ?? '';
}

export async function assertServiserAccess(
  supabase: SupabaseClient,
  userId:   string
): Promise<boolean> {
  const { data } = await supabase
    .from('uposlenici')
    .select('id_uloge, uloga(naziv)')
    .eq('id_uposlenika', userId)
    .maybeSingle();

  if (!data) return false;
  const naziv = getUlogaNaziv(data.uloga);
  return naziv === 'Serviser' || naziv === 'serviser';
}

export async function assertServiserVlasnistvo(
  supabase:   SupabaseClient,
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
