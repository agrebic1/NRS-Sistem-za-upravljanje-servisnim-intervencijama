import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from './domain/types/supabase';

const JAVNE_RUTE = [
  '/',
  '/auth/login',
  '/auth/registracija',
  '/auth/odabir-uloge',
  '/odabir-uloge',
] as const;

const ADMIN_PREFIX = '/admin';
const SERVISER_PREFIX = '/serviser';
const DISPECER_PREFIX = '/dispecer';
const KORISNIK_PREFIX = '/korisnik';

export async function middleware(zahtjev: NextRequest) {
  let supabaseResponse = NextResponse.next({ request: zahtjev });
  const { pathname } = zahtjev.nextUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Gracefully skip auth if env vars aren't configured yet
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  let user: { id: string } | null = null;
  let jeAdministrator = false;
  let jeServiser = false;
  let jeDispecer = false;
  let jeKorisnik = false;
  try {
    const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return zahtjev.cookies.getAll();
        },
        setAll(kolacici: { name: string; value: string; options: CookieOptions }[]) {
          kolacici.forEach(({ name, value }) => zahtjev.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: zahtjev });
          kolacici.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Must use getUser(), not getSession() — prevents CSRF token spoofing
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;

    if (authUser) {
      // Provjeri samo zonu kojoj korisnik trenutno pristupa.
      if (pathname.startsWith(ADMIN_PREFIX)) {
        const { data: adminIzBaze, error } = await supabase.rpc('is_admin');
        jeAdministrator = !error && adminIzBaze === true;
      } else if (pathname.startsWith(SERVISER_PREFIX)) {
        const { data: serviserIzBaze, error } = await supabase.rpc('is_serviser');
        jeServiser = !error && serviserIzBaze === true;
      } else if (pathname.startsWith(DISPECER_PREFIX)) {
        const { data: dispecerIzBaze, error } = await supabase.rpc('is_dispecer');
        jeDispecer = !error && dispecerIzBaze === true;
      } else if (pathname.startsWith(KORISNIK_PREFIX)) {
        const { data: korisnikUsluge, error } = await supabase
          .from('korisnik_usluge')
          .select('id_korisnika_usluge')
          .eq('id_korisnika_usluge', authUser.id)
          .maybeSingle();
        jeKorisnik = !error && !!korisnikUsluge;
      }
    }
  } catch (error) {
    console.error('Middleware auth provjera nije uspjela:', error);
  }

  const jeJavnaRuta = JAVNE_RUTE.some(
    (ruta) => pathname === ruta || pathname.startsWith(ruta + '/')
  );

  if (!user && !jeJavnaRuta) {
    const loginUrl = new URL('/auth/login', zahtjev.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname.startsWith(ADMIN_PREFIX)) {
    if (!jeAdministrator) {
      return NextResponse.redirect(new URL('/', zahtjev.url));
    }
  }

  if (user && pathname.startsWith(SERVISER_PREFIX)) {
    if (!jeServiser) {
      return NextResponse.redirect(new URL('/', zahtjev.url));
    }
  }

  if (user && pathname.startsWith(DISPECER_PREFIX)) {
    if (!jeDispecer) {
      return NextResponse.redirect(new URL('/', zahtjev.url));
    }
  }

  if (user && pathname.startsWith(KORISNIK_PREFIX)) {
    if (!jeKorisnik) {
      return NextResponse.redirect(new URL('/', zahtjev.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
