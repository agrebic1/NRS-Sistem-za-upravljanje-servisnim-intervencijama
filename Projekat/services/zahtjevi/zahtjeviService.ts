import { kreirajKlijenta } from '@/lib/supabase/klijent';
import type { PodaciZahtjeva, KategorijaKvara } from '@/domain/types';

export async function posaljiZahtjev(
  podaci: PodaciZahtjeva,
  idKorisnika: string
) {
  const supabase = kreirajKlijenta();

  const { data, error } = await supabase
    .from('zahtjev')
    .insert({
      opis_kvara:          `${podaci.naslov}\n\n${podaci.opis}`,
      adresa:              podaci.lokacija,
      id_kategorije_kvara: podaci.idKategorije,
      id_korisnika_usluge: idKorisnika,
      datum:               podaci.zeljenoVrijeme ?? null,
      je_otkazan:          false,
    })
    .select()
    .single();

  if (error) throw new Error('Greška pri slanju zahtjeva. Pokušajte ponovo.');

  return data;
}

export async function getKategorijeKvara(): Promise<KategorijaKvara[]> {
  const supabase = kreirajKlijenta();

  const { data, error } = await supabase
    .from('kategorija_kvara')
    .select('id_kategorije_kvara, naziv')
    .order('naziv');

  if (error) throw new Error('Greška pri učitavanju kategorija');

  return data;
}
