'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, User, Wrench, Shield, Crown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { getTrenutnogKorisnika, getUlogeKorisnika } from '@/services/auth/authService';
import { PREUSMJERANJE_PO_ULOZI, type UserRole } from '@/domain/types';

// ─── Konfiguracija kartica uloga ──────────────────────────────────────────────

interface KarticaUloge {
  uloga:     UserRole;
  oznaka:    string;
  opis:      string;
  Ikona:     React.ComponentType<{ className?: string }>;
}

const KARTICE_ULOGA: KarticaUloge[] = [
  {
    uloga:  'korisnik',
    oznaka: 'Korisnik usluge',
    opis:   'Prijava kvara, praćenje statusa intervencije i komunikacija sa servisom.',
    Ikona:  User,
  },
  {
    uloga:  'serviser',
    oznaka: 'Serviser',
    opis:   'Pregled dodijeljenih intervencija, promjena statusa i unos izvještaja o radu.',
    Ikona:  Wrench,
  },
  {
    uloga:  'dispecer',
    oznaka: 'Dispečer',
    opis:   'Upravljanje zahtjevima, dodjela intervencija i praćenje servisera.',
    Ikona:  Shield,
  },
  {
    uloga:  'admin',
    oznaka: 'Administrator',
    opis:   'Upravljanje korisnicima, ulogama i sistemskim postavkama.',
    Ikona:  Crown,
  },
];

// ─── Stranica ─────────────────────────────────────────────────────────────────

export default function OdabirUlogePage() {
  const router = useRouter();

  const [dostupneUloge,  setDostupneUloge]  = useState<UserRole[]>([]);
  const [odabranaUloga,  setOdabranaUloga]  = useState<UserRole | null>(null);
  const [jeUcitavanje,   setJeUcitavanje]   = useState(true);
  const [jeNavigacija,   setJeNavigacija]   = useState(false);
  const [greska,         setGreska]         = useState<string | null>(null);

  useEffect(() => {
    async function ucitajUloge() {
      const korisnik = await getTrenutnogKorisnika();
      if (!korisnik) {
        router.replace('/auth/login');
        return;
      }

      const uloge = await getUlogeKorisnika(korisnik.id);

      // Jedna uloga → nema potrebe za odabirom, odmah preusmjeri
      if (uloge.length === 1) {
        router.replace(PREUSMJERANJE_PO_ULOZI[uloge[0]]);
        return;
      }

      // Nema uloga → anomalija (korisnik postoji u Auth ali ne u profilnim tabelama)
      if (uloge.length === 0) {
        setGreska('Vaš nalog nema dodijeljenu ulogu. Kontaktirajte administratora sistema.');
        setJeUcitavanje(false);
        return;
      }

      // Više uloga → prikaži izbor
      setDostupneUloge(uloge);
      setJeUcitavanje(false);
    }
    ucitajUloge();
  }, [router]);

  async function nastavi() {
    if (!odabranaUloga) {
      setGreska('Odaberite jednu od ponuđenih opcija da biste nastavili.');
      return;
    }
    setGreska(null);
    setJeNavigacija(true);
    router.push(PREUSMJERANJE_PO_ULOZI[odabranaUloga]);
  }

  if (jeUcitavanje) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#F2E6D8' }}>
        <p className="text-sm" style={{ color: '#6B7C82' }}>Učitavanje...</p>
      </div>
    );
  }

  const vidljiveKartice = KARTICE_ULOGA.filter((k) => dostupneUloge.includes(k.uloga));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: '#F2E6D8' }}>
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: '#2C444D' }}>
          <Settings className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight" style={{ color: '#1F2A30' }}>
          InterServ
        </span>
      </div>

      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-7 shadow-card-lg sm:p-8"
          style={{
            backgroundColor: 'rgba(199, 184, 164, 0.22)',
            border: '1px solid rgba(204, 182, 142, 0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl" style={{ color: '#1F2A30' }}>
              Odaberite način korištenja sistema
            </h1>
            <p className="mt-2 text-sm" style={{ color: '#6B7C82' }}>
              Vaš nalog ima više uloga. Odaberite u kojoj ulozi želite nastaviti.
            </p>
          </div>

          {greska && (
            <div className="mb-4">
              <AlertMessage variant="warning" message={greska} />
            </div>
          )}

          <div className="flex flex-col gap-3">
            {vidljiveKartice.map(({ uloga, oznaka, opis, Ikona }) => {
              const jeOdabrana = odabranaUloga === uloga;
              return (
                <button
                  key={uloga}
                  type="button"
                  onClick={() => { setOdabranaUloga(uloga); setGreska(null); }}
                  className="flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5A7C83]/40 focus:ring-offset-2"
                  style={{
                    borderColor:     jeOdabrana ? '#2C444D' : '#CCB68E',
                    backgroundColor: jeOdabrana ? 'rgba(44, 68, 77, 0.07)' : 'rgba(255, 255, 255, 0.45)',
                  }}
                  aria-pressed={jeOdabrana}
                >
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: jeOdabrana ? '#2C444D' : 'rgba(199, 184, 164, 0.45)',
                      color:           jeOdabrana ? '#F2E6D8' : '#6B7C82',
                    }}
                  >
                    <Ikona className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold" style={{ color: '#1F2A30' }}>{oznaka}</p>
                    <p className="mt-0.5 text-sm leading-snug" style={{ color: '#6B7C82' }}>{opis}</p>
                  </div>
                  {jeOdabrana && (
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: '#2C444D' }}>
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={nastavi}
            isLoading={jeNavigacija}
            loadingText="Učitavanje..."
            disabled={!odabranaUloga || jeNavigacija}
          >
            Nastavi
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
