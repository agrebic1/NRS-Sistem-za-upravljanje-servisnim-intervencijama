import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const JAVNE_PUTANJE = [
  '/',
  '/auth/login',
  '/auth/registracija',
  '/auth/zaboravljena-lozinka',
] as const;

// Mapiranje putanje na uloge koje SMIJU pristupiti
const ULOGE_PO_PUTANJI: Record<string, string[]> = {
  '/admin':    ['admin'],
  '/dispecer': ['dispecer'],
  '/serviser': ['serviser'],
  '/korisnik': ['korisnik', 'admin'],
};

/*export async function middleware(zahtjev: NextRequest) {
  const { supabaseResponse, user: prijavljeniKorisnik } = await updateSession(zahtjev);
  const { pathname } = zahtjev.nextUrl;

  const jeJavnaPutanja = JAVNE_PUTANJE.some(
    (putanja) => pathname === putanja || pathname.startsWith(putanja + '/')
  );

  // Neautoriziran korisnik ne smije pristupiti zaštićenim rutama
 /* if (!prijavljeniKorisnik && !jeJavnaPutanja) {
    const stranicaZaPrijavu = new URL('/auth/login', zahtjev.url);
    stranicaZaPrijavu.searchParams.set('preusmjereno_sa', pathname);
    return NextResponse.redirect(stranicaZaPrijavu);
  }

  // Autoriziran korisnik ne treba vidjeti login/registraciju
  if (prijavljeniKorisnik && (pathname === '/auth/login' || pathname === '/auth/registracija')) {
    return NextResponse.redirect(new URL('/odabir-uloge', zahtjev.url));
  }

  return supabaseResponse;
}*/

export async function middleware(zahtjev: NextRequest) {
  // Pozivamo updateSession samo da vidimo prolazi li veza
  const { supabaseResponse } = await updateSession(zahtjev);
  
  // Vratimo odgovor odmah - bez ikakvih provjera uloga ili redirecta
  return supabaseResponse;
}

export const config = {
  runtime: 'nodejs', // Vratit ćemo ovo, ali uz dodatak ispod
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
