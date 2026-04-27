import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(zahtjev: NextRequest) {
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

  // Koristiti getUser() umjesto getSession() radi zaštite od CSRF lažiranja tokena
  const {
    data: { user: korisnik },
  } = await supabase.auth.getUser();

  return { supabaseResponse: supabaseOdgovor, user: korisnik };
}
