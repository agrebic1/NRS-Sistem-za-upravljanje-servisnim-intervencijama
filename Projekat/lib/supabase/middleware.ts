import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

// Mora se zvati updateSession i imati export
export async function updateSession(zahtjev: NextRequest) {
  let supabaseOdgovor = NextResponse.next({ request: zahtjev });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Ako varijable fale, middleware će pasti sa 500 greškom. 
  // Ovo osigurava da imamo vrijednosti prije nego pokrenemo klijenta.
  if (!url || !key) {
    return supabaseOdgovor; 
  }
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  // Dobijamo korisnika da bi ga root middleware mogao provjeriti
  const { data: { user } } = await supabase.auth.getUser();

  return { supabaseResponse: supabaseOdgovor, user };
}
