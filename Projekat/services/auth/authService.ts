import { kreirajKlijenta } from '@/lib/supabase/klijent';
import type { UserRole } from '@/domain/types';
import { PREUSMJERANJE_PO_ULOZI } from '@/domain/types';

// Prijava 

export async function prijaviSeEmailom(podaci: { email: string; lozinka: string }) {
  const supabase = kreirajKlijenta();
  const { data, error } = await supabase.auth.signInWithPassword({
    email:    podaci.email,
    password: podaci.lozinka,
  });

  if (error) {
    // Namjerno generička poruka radi zaštite od otkrivanja korisničkih emailova
    throw new Error('Pogrešna email adresa ili lozinka');
  }

  return data;
}

// Registracija (samo Korisnik usluge)

export async function registrujKorisnika(podaci: {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  lozinka: string;
}) {
  const supabase = kreirajKlijenta();

  const { data: authPodaci, error: greskaAuth } = await supabase.auth.signUp({
    email:    podaci.email,
    password: podaci.lozinka,
  });

  if (greskaAuth) throw new Error(greskaAuth.message);
  if (!authPodaci.user) throw new Error('Kreiranje naloga nije uspjelo');

  const { error: greska } = await supabase.from('korisnik_usluge').insert({
    id_korisnika_usluge: authPodaci.user.id,
    ime:          podaci.ime,
    prezime:      podaci.prezime,
    email:        podaci.email,
    broj_telefona: podaci.telefon,
  });

  if (greska) throw new Error('Greška pri kreiranju korisničkog profila');

  return authPodaci;
}

// Detekcija uloga 

export async function getUlogeKorisnika(idKorisnika: string): Promise<UserRole[]> {
  const supabase = kreirajKlijenta();
  const pronadjeneUloge: UserRole[] = [];

  // Provjera korisnik_usluge tabele
  const { data: korisnikUsluge } = await supabase
    .from('korisnik_usluge')
    .select('id_korisnika_usluge')
    .eq('id_korisnika_usluge', idKorisnika)
    .maybeSingle();

  if (korisnikUsluge) pronadjeneUloge.push('korisnik');

  // Provjera uposlenici tabele + join sa ulogom
  const { data: uposlenik } = await supabase
    .from('uposlenici')
    .select('id_uloge')
    .eq('id_uposlenika', idKorisnika)
    .maybeSingle();

  if (uposlenik?.id_uloge) {
    const { data: ulogaPodaci } = await supabase
      .from('uloga')
      .select('naziv')
      .eq('id_uloge', uposlenik.id_uloge)
      .single();

    const nazivUloge = ulogaPodaci?.naziv as UserRole | undefined;
    const INTERNE_ULOGE: UserRole[] = ['serviser', 'dispecer', 'admin'];

    if (nazivUloge && INTERNE_ULOGE.includes(nazivUloge)) {
      pronadjeneUloge.push(nazivUloge);
    }
  }

  return pronadjeneUloge;
}

// Određivanje redirect-a nakon prijave 

export async function odrediRedirectNakonPrijave(idKorisnika: string): Promise<string> {
  const uloge = await getUlogeKorisnika(idKorisnika);

  // Jedna uloga → direktno na odgovarajući dashboard
  if (uloge.length === 1) return PREUSMJERANJE_PO_ULOZI[uloge[0]];

  // Više uloga ILI nema uloga → stranica za odabir (ona obrađuje oba slučaja)
  return '/odabir-uloge';
}

// Session helpers 

export async function odjaviSe() {
  const supabase = kreirajKlijenta();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error('Greška pri odjavi iz sistema');
}

export async function getTrenutnogKorisnika() {
  const supabase = kreirajKlijenta();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
