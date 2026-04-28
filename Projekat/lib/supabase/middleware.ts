import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

export default async function middleware(zahtjev: NextRequest) {
  let supabaseOdgovor = NextResponse.next({ request: zahtjev });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return zahtjev.cookies.getAll();
        },
        setAll(
          kolaciciZaPostavljanje: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          kolaciciZaPostavljanje.forEach(({ name, value }) =>
            zahtjev.cookies.set(name, value)
          );
          supabaseOdgovor = NextResponse.next({ request: zahtjev });
          kolaciciZaPostavljanje.forEach(({ name, value, options }) =>
            supabaseOdgovor.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Provjera korisnika (bitno za sigurnost i RLS)
  await supabase.auth.getUser();

  return supabaseOdgovor;
}
