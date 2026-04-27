import { createClient } from '@/lib/supabase/server'

export type RegistracijaParams = {
  email: string
  lozinka: string
  ime: string
  prezime: string
  uloga: string
}

export interface IAuthRepozitorij {
  prijaviKorisnika(email: string, lozinka: string): Promise<{ greska?: string }>
  registrujKorisnika(params: RegistracijaParams): Promise<{ greska?: string }>
  odjaviKorisnika(): Promise<void>
}

export class SupabaseAuthRepozitorij implements IAuthRepozitorij {
  async prijaviKorisnika(email: string, lozinka: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: lozinka,
    })
    return { greska: error?.message }
  }

  async registrujKorisnika({ email, lozinka, ime, prezime, uloga }: RegistracijaParams) {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password: lozinka,
      options: { data: { ime, prezime, uloga } },
    })
    return { greska: error?.message }
  }

  async odjaviKorisnika() {
    const supabase = createClient()
    await supabase.auth.signOut()
  }
}
