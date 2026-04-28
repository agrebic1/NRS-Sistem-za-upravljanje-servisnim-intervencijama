import { kreirajKlijenta } from '@/lib/supabase/klijent';
import type { UserRole } from '@/domain/types';
import { PREUSMJERANJE_PO_ULOZI } from '@/domain/types';

function normalizujEmail(email: string) {
  return email.trim().replace(/^["']|["']$/g, '').toLowerCase();
}

// Prijava 

export async function prijaviSeEmailom(podaci: { email: string; lozinka: string }) {
  const supabase = kreirajKlijenta();
  const email = normalizujEmail(podaci.email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
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
  const email = normalizujEmail(podaci.email);

  const { data: authPodaci, error: greskaAuth } = await supabase.auth.signUp({
    email,
    password: podaci.lozinka,
  });

  if (greskaAuth) throw new Error(greskaAuth.message);
  if (!authPodaci.user) throw new Error('Kreiranje naloga nije uspjelo');

  const { error: greska } = await supabase.from('korisnik_usluge').insert({
    id_korisnika_usluge: authPodaci.user.id,
    ime:          podaci.ime,
    prezime:      podaci.prezime,
    email,
    broj_telefona: podaci.telefon,
  });

  if (greska) throw new Error('Greška pri kreiranju korisničkog profila');

  return authPodaci;
}

// Detekcija uloga 

function mapirajNazivUloge(naziv: string | null | undefined): UserRole | null {
  const normalizovanNaziv = naziv?.toLowerCase();

  switch (normalizovanNaziv) {
    case 'klijent':
    case 'korisnik':
    case 'korisnik usluge':
      return 'korisnik';
    case 'serviser':
      return 'serviser';
    case 'dispečer':
    case 'dispecer':
      return 'dispecer';
    case 'administrator':
    case 'admin':
      return 'admin';
    default:
      return null;
  }
}

export async function getUlogeKorisnika(idKorisnika: string): Promise<UserRole[]> {
  const supabase = kreirajKlijenta();
  const pronadjeneUloge: UserRole[] = [];

  try {
    const odgovor = await fetch('/api/auth/uloge', { cache: 'no-store' });
    const podaci = await odgovor.json();

    if (odgovor.ok && Array.isArray(podaci.uloge)) {
      return podaci.uloge;
    }
  } catch {
    // Ako server ruta nije dostupna, nastavi sa direktnom provjerom ispod.
  }

  // Provjera korisnik_usluge tabele
  const { data: korisnikUsluge } = await supabase
    .from('korisnik_usluge')
    .select('id_korisnika_usluge, id_uloge')
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

    const uloga = mapirajNazivUloge(ulogaPodaci?.naziv);
    const INTERNE_ULOGE: UserRole[] = ['serviser', 'dispecer', 'admin'];

    if (uloga && INTERNE_ULOGE.includes(uloga)) {
      pronadjeneUloge.push(uloga);
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
