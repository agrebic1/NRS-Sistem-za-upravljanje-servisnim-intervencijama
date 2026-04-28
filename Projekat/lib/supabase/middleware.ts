import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(zahtjev: NextRequest) {
  try {
    let supabaseOdgovor = NextResponse.next({ request: zahtjev });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return { supabaseResponse: supabaseOdgovor, user: null };
    }

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return zahtjev.cookies.getAll();
        },
        setAll(kolaciciZaPostavljanje: { name: string; value: string; options: CookieOptions }[]) {
          kolaciciZaPostavljanje.forEach(({ name, value }) =>
            zahtjev.cookies.set(name, value)
          );
          supabaseOdgovor = NextResponse.next({ request: zahtjev });
          kolaciciZaPostavljanje.forEach(({ name, value, options }) =>
            supabaseOdgovor.cookies.set(name, value, options)
          );
        },
      },
    });

    // Koristimo getUser() - ovo je sigurno
    const { data: { user } } = await supabase.auth.getUser();

    return { supabaseResponse: supabaseOdgovor, user };
  } catch (e) {
    // AKO SVE PUKNE, VRATI SAMO ODGOVOR DA STRANICA NE BUDE 500
    return { 
      supabaseResponse: NextResponse.next({ request: zahtjev }), 
      user: null 
    };
  }
}
