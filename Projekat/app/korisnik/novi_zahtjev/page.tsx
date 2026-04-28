'use client';

// DEV: Auth guard je privremeno zakomentarisan radi pregleda UI.
// Odkomentirajte blok ispod i uklonite DEV_ID_KORISNIKA prije produkcije.

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import type { User } from '@supabase/supabase-js';
// import { getTrenutnogKorisnika } from '@/services/auth/authService';

import { ServiceRequestForm } from '@/components/forms/ServiceRequestForm';
import { AppShell } from '@/components/layout/AppShell';

const DEV_ID_KORISNIKA = 'dev-preview-user-id';

export default function NoviZahtjevPage() {
  // ── AUTH GUARD (odkomentirajte za produkciju) ─────────────────────────────
  // const router = useRouter();
  // const [korisnik, setKorisnik] = useState<User | null>(null);
  // const [jeUcitavanje, setJeUcitavanje] = useState(true);
  //
  // useEffect(() => {
  //   getTrenutnogKorisnika().then((prijavljeniKorisnik) => {
  //     if (!prijavljeniKorisnik) {
  //       router.replace('/auth/login');
  //       return;
  //     }
  //     setKorisnik(prijavljeniKorisnik);
  //     setJeUcitavanje(false);
  //   });
  // }, [router]);
  //
  // if (jeUcitavanje) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'var(--first-tertiary)' }}>
  //       <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Učitavanje...</p>
  //     </div>
  //   );
  // }
  //
  // if (!korisnik) return null;
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AppShell uloga="korisnik" imeKorisnika="Korisnik (preview)">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--first-octonary)' }}>
            Prijava kvara
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--first-nonary)' }}>
            Popunite detalje o kvaru. Što detaljniji opis, brže ćemo reagirati.
          </p>
        </div>

        <div
          className="rounded-2xl p-6 shadow-card sm:p-8"
          style={{
            backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
            border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)',
          }}
        >
          {/* DEV: zamijeniti sa korisnik.id iz sesije */}
          <ServiceRequestForm idKorisnika={DEV_ID_KORISNIKA} />
        </div>
      </div>
    </AppShell>
  );
}
