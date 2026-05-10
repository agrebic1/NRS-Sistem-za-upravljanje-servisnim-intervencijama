'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { DispecerZahtjevDetaljSadrzaj } from '@/components/dispecer/DispecerZahtjevDetaljSadrzaj';
import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';

type ZahtjevDetalj = ServisniZahtjev & {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
};

export default function DispecerZahtjevDetaljPage() {
  const { id } = useParams<{ id: string }>();
  const [zahtjev, setZahtjev] = useState<ZahtjevDetalj | null>(null);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);
  const kategorija = zahtjev ? labelKategorije(zahtjev) : null;
  const naslovKruh =
    zahtjev && kategorija
      ? `#${zahtjev.id} ${kategorija.podkategorija || kategorija.glavna}`
      : '';

  useEffect(() => {
    async function ucitaj() {
      try {
        const r = await fetch(`/api/dispecer/zahtjevi/${id}`, { cache: 'no-store' });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? 'Zahtjev nije pronađen.');
        setZahtjev(d.zahtjev);
      } catch (err) {
        setGreska(err instanceof Error ? err.message : 'Greška pri učitavanju podataka.');
      } finally {
        setUcitava(false);
      }
    }
    void ucitaj();
  }, [id]);

  return (
    <AppShell uloga="dispecer" imeKorisnika="Dispečer">
      <div className="mx-auto max-w-6xl px-4 sm:px-0">
        <nav
          className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
          aria-label="Navigacija"
        >
          <Link
            href={zahtjev ? `/dispecer?z=${zahtjev.id}` : '/dispecer'}
            className="font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--first-secondary)' }}
          >
            Kontrolna ploča
          </Link>
          <span style={{ color: 'var(--first-nonary)' }}>/</span>
          <Link
            href="/dispecer/zahtjevi"
            className="font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--first-secondary)' }}
          >
            Pregled zahtjeva
          </Link>
          {zahtjev && (
            <>
              <span style={{ color: 'var(--first-nonary)' }}>/</span>
              <span className="font-medium" style={{ color: 'var(--first-octonary)' }}>
                {naslovKruh}
              </span>
            </>
          )}
        </nav>

        {ucitava && <p style={{ color: 'var(--first-nonary)' }}>Učitavanje...</p>}
        {greska && <AlertMessage variant="error" message={greska} />}

        {zahtjev && (
          <DispecerZahtjevDetaljSadrzaj
            zahtjev={zahtjev}
            requestId={id}
            onRequestUpdated={(noviZahtjev) => setZahtjev(noviZahtjev)}
            prikaziDugmeNazad
            hrefNazad={`/dispecer?z=${zahtjev.id}`}
          />
        )}
      </div>
    </AppShell>
  );
}
