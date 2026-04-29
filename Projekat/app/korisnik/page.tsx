'use client';

import { AppShell } from '@/components/layout/AppShell';
import { KorisnikPregledDashboard } from '@/components/korisnik/KorisnikPregledDashboard';

export default function KorisnikPage() {
  return (
    <AppShell uloga="korisnik" imeKorisnika="Amina H.">
      <KorisnikPregledDashboard />
    </AppShell>
  );
}
