'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, MapPin, Phone } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { Button } from '@/components/ui/Button';
import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { formatirajDatumPrikaz } from '@/lib/format/datumi';

type ZahtjevDetalj = ServisniZahtjev & {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
};

function formatirajPreferiraniTermin(zahtjev: ServisniZahtjev): string {
  const schedule = zahtjev.preferred_schedule;
  if (!schedule || schedule.no_preferred_time || (schedule.termini?.length ?? 0) === 0) {
    return 'Bez preferiranog termina — kontaktirati korisnika.';
  }
  const prvi = schedule.termini[0];
  if (!prvi) return 'Bez preferiranog termina — kontaktirati korisnika.';
  return `${prvi.date} (${prvi.from} - ${prvi.to})`;
}

export default function DispecerZahtjevDetaljPage() {
  const { id } = useParams<{ id: string }>();
  const [zahtjev, setZahtjev] = useState<ZahtjevDetalj | null>(null);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    async function ucitaj() {
      try {
        const r = await fetch(`/api/dispecer/zahtjevi/${id}`, { cache: 'no-store' });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? 'Zahtjev nije pronađen.');
        setZahtjev(d.zahtjev);
      } catch (err) {
        setGreska(err instanceof Error ? err.message : 'Greška pri učitavanju.');
      } finally {
        setUcitava(false);
      }
    }
    ucitaj();
  }, [id]);

  return (
    <AppShell uloga="dispecer" imeKorisnika="Dispečer">
      <div className="mx-auto max-w-3xl">
        <Link href="/dispecer" className="mb-4 inline-flex items-center gap-1 text-sm" style={{ color: 'var(--first-nonary)' }}>
          <ArrowLeft className="h-4 w-4" />
          Nazad na listu
        </Link>

        {ucitava && <p style={{ color: 'var(--first-nonary)' }}>Učitavanje...</p>}
        {greska && <AlertMessage variant="error" message={greska} />}

        {zahtjev && (
          <div className="rounded-2xl p-6 shadow-card" style={{ backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)', border: '1px solid rgb(var(--first-quaternary-rgb) / 0.35)' }}>
            <h1 className="text-xl font-bold" style={{ color: 'var(--first-octonary)' }}>
              #{zahtjev.id} · {zahtjev.category}
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--first-nonary)' }}>{zahtjev.description}</p>

            <div className="mt-4 grid gap-2 text-sm" style={{ color: 'var(--first-octonary)' }}>
              <p className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {zahtjev.address}</p>
              <p className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {formatirajPreferiraniTermin(zahtjev)}</p>
              <p className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {formatirajDatumPrikaz(zahtjev.created_at)}</p>
              <p className="inline-flex items-center gap-1"><Phone className="h-4 w-4" /> {zahtjev.contact_phone}</p>
              {zahtjev.podnosilac && (
                <p>Podnosilac: {zahtjev.podnosilac.ime} {zahtjev.podnosilac.prezime}</p>
              )}
              {zahtjev.latitude !== null && zahtjev.longitude !== null && (
                <p>Koordinate dodane.</p>
              )}
              {zahtjev.photo_url && <p>Zahtjev sadrži fotografiju.</p>}
            </div>

            <div className="mt-5">
              <Link href="/dispecer">
                <Button size="sm">
                  Nazad na obradu zahtjeva
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
