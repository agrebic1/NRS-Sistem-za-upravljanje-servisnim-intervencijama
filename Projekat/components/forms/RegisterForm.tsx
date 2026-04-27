'use client';

import { useState } from 'react';
import { useForm, type FieldPath } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { registracijskaShema, type RegistracijskiPodaci } from '@/lib/validations/authValidation';
import { registrujKorisnika } from '@/services/auth/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

// Konfiguracija koraka 

const UKUPNO_KORAKA = 2;

const OZNAKE_KORAKA = ['Lični podaci', 'Sigurnost'] as const;

const POLJA_PO_KORAKU: Record<number, FieldPath<RegistracijskiPodaci>[]> = {
  1: ['ime', 'prezime', 'email', 'telefon'],
  2: ['lozinka', 'potvrdaLozinke'],
};

// Komponenta za progres bar 

function TrakaNapretka({ trenutniKorak }: { trenutniKorak: number }) {
  return (
    <div className="mb-7">
      <div className="mb-3 flex items-center">
        {OZNAKE_KORAKA.map((oznaka, i) => {
          const brojKoraka  = i + 1;
          const jeZavrsen   = brojKoraka < trenutniKorak;
          const jeTrenutni  = brojKoraka === trenutniKorak;

          return (
            <div key={oznaka} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                  style={{
                    backgroundColor: jeZavrsen
                      ? '#2C444D'
                      : jeTrenutni
                      ? '#D4B27F'
                      : 'rgba(199, 184, 164, 0.5)',
                    color: jeZavrsen ? '#FFFFFF' : jeTrenutni ? '#1F2A30' : '#6B7C82',
                  }}
                >
                  {jeZavrsen ? <Check className="h-3.5 w-3.5" /> : brojKoraka}
                </div>
                <span className="text-xs font-medium" style={{ color: jeTrenutni ? '#1F2A30' : '#6B7C82' }}>
                  {oznaka}
                </span>
              </div>
              {i < OZNAKE_KORAKA.length - 1 && (
                <div
                  className="mx-2 mb-4 h-px flex-1 transition-all duration-500"
                  style={{ backgroundColor: trenutniKorak > i + 1 ? '#2C444D' : '#CCB68E', opacity: 0.5 }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="h-1 overflow-hidden rounded-full" style={{ backgroundColor: 'rgba(204, 182, 142, 0.35)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((trenutniKorak - 1) / (UKUPNO_KORAKA - 1)) * 100}%`, backgroundColor: '#D4B27F' }}
        />
      </div>
    </div>
  );
}

// Glavna komponenta 

export function RegisterForm() {
  const router = useRouter();

  const [trenutniKorak,      setTrenutniKorak]      = useState(1);
  const [jeLozinkaVidljiva,  setJeLozinkaVidljiva]  = useState(false);
  const [jePotvrdaVidljiva,  setJePotvrdaVidljiva]  = useState(false);
  const [greskaRegistracije, setGreskaRegistracije] = useState<string | null>(null);
  const [jeKreiranjeNaloga,  setJeKreiranjeNaloga]  = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistracijskiPodaci>({
    resolver: zodResolver(registracijskaShema),
    mode: 'onChange',
  });

  const posmatranLozinka = watch('lozinka', '');

  async function idiNaSljedeciKorak() {
    const jeKorakValidan = await trigger(POLJA_PO_KORAKU[trenutniKorak]);
    if (jeKorakValidan) setTrenutniKorak((k) => Math.min(k + 1, UKUPNO_KORAKA));
  }

  function idiNaPrethodniKorak() {
    setTrenutniKorak((k) => Math.max(k - 1, 1));
  }

  async function posaljiRegistraciju(podaci: RegistracijskiPodaci) {
    setGreskaRegistracije(null);
    setJeKreiranjeNaloga(true);
    try {
      await registrujKorisnika(podaci);
      // Supabase signUp automatski kreira sesiju → odmah ulazi kao Korisnik usluge
      router.replace('/korisnik');
    } catch (greska) {
      setGreskaRegistracije(
        greska instanceof Error ? greska.message : 'Kreiranje naloga nije uspjelo. Pokušajte ponovo.'
      );
      setJeKreiranjeNaloga(false);
    }
    // Nema finally — loader ostaje vidljiv dok traje redirect
  }

  return (
    <>
      <LoadingOverlay isVisible={jeKreiranjeNaloga} message="Kreiranje naloga..." />

      <TrakaNapretka trenutniKorak={trenutniKorak} />

      {greskaRegistracije && (
        <div className="mb-5">
          <AlertMessage variant="error" message={greskaRegistracije} />
        </div>
      )}

      <form onSubmit={handleSubmit(posaljiRegistraciju)} noValidate>
        {/* Korak 1: Lični podaci */}
        {trenutniKorak === 1 && (
          <div className="flex flex-col gap-4 animate-fade-up">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Ime"
                type="text"
                placeholder="Npr. Amina"
                autoComplete="given-name"
                error={errors.ime?.message}
                {...register('ime')}
              />
              <Input
                label="Prezime"
                type="text"
                placeholder="Npr. Hodžić"
                autoComplete="family-name"
                error={errors.prezime?.message}
                {...register('prezime')}
              />
            </div>
            <Input
              label="Email adresa"
              type="email"
              placeholder="vas@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Broj telefona"
              type="tel"
              placeholder="+387 61 000 000"
              autoComplete="tel"
              error={errors.telefon?.message}
              {...register('telefon')}
            />
          </div>
        )}

        {/* Korak 2: Sigurnost */}
        {trenutniKorak === 2 && (
          <div className="flex flex-col gap-5 animate-fade-up">
            <div className="flex flex-col gap-1.5">
              <Input
                label="Lozinka"
                type={jeLozinkaVidljiva ? 'text' : 'password'}
                autoComplete="new-password"
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setJeLozinkaVidljiva((v) => !v)}
                    className="transition-opacity hover:opacity-70"
                    style={{ color: '#6B7C82' }}
                    aria-label={jeLozinkaVidljiva ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                  >
                    {jeLozinkaVidljiva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.lozinka?.message}
                {...register('lozinka')}
              />
              <PasswordStrengthIndicator lozinka={posmatranLozinka} />
            </div>
            <Input
              label="Potvrda lozinke"
              type={jePotvrdaVidljiva ? 'text' : 'password'}
              autoComplete="new-password"
              endAdornment={
                <button
                  type="button"
                  onClick={() => setJePotvrdaVidljiva((v) => !v)}
                  className="transition-opacity hover:opacity-70"
                  style={{ color: '#6B7C82' }}
                  aria-label={jePotvrdaVidljiva ? 'Sakrij lozinku' : 'Prikaži lozinku'}
                >
                  {jePotvrdaVidljiva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.potvrdaLozinke?.message}
              {...register('potvrdaLozinke')}
            />
          </div>
        )}

        {/* Navigacija između koraka */}
        <div className="mt-8 flex items-center justify-between">
          {trenutniKorak > 1 ? (
            <Button type="button" variant="ghost" size="md" onClick={idiNaPrethodniKorak}>
              <ChevronLeft className="h-4 w-4" />
              Nazad
            </Button>
          ) : (
            <span />
          )}
          {trenutniKorak < UKUPNO_KORAKA ? (
            <Button type="button" size="md" onClick={idiNaSljedeciKorak}>
              Nastavi
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Kreiranje naloga..."
              size="md"
            >
              Kreiraj nalog
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
