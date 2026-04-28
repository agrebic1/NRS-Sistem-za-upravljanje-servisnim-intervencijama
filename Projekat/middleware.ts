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

    if (authUser && pathname.startsWith(ADMIN_PREFIX)) {
      const { data: adminIzBaze } = await (supabase as any).rpc('is_admin', {
        p_user_id: authUser.id,
      });
      jeAdministrator = adminIzBaze === true;
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

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
