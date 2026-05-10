import { createAdminClient } from '@/lib/supabase/admin';

export function getUlogaNaziv(uloga: unknown): string {
  if (!uloga) return '';
  if (Array.isArray(uloga)) return (uloga[0] as { naziv?: string })?.naziv ?? '';
  return (uloga as { naziv?: string })?.naziv ?? '';
}

/** Dispečerske rute i API: samo dispečer ili administrator (ne serviser). */
export function jeDispecerIliAdmin(nazivUloge: string): boolean {
  const n = nazivUloge.toLowerCase();
  return ['dispečer', 'dispecer', 'administrator', 'admin'].includes(n);
}

export async function assertDispatcherAccess(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
): Promise<boolean> {
  const { data: uposlenik } = await supabase
    .from('uposlenici')
    .select('uloga(naziv)')
    .eq('id_uposlenika', userId)
    .maybeSingle();

  const naziv = getUlogaNaziv(uposlenik?.uloga);
  return jeDispecerIliAdmin(naziv);
}
