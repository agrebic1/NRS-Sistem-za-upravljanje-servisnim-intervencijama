'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { Button } from '@/components/ui/Button';
import { DispecerZahtjevDetaljSadrzaj } from '@/components/dispecer/DispecerZahtjevDetaljSadrzaj';
import type { ServisniZahtjev } from '@/domain/types/servisirane';
import { labelKategorije } from '@/lib/servisirane/kategorije';
import { oznakaZaDispecerskiPrikazBroja } from '@/lib/servisirane/korisnickiBrojZahtjeva';

type ZahtjevDetalj = ServisniZahtjev & {
  podnosilac: { ime: string; prezime: string; broj_telefona: string | null } | null;
};

const STATUSI_ZA_ZATVARANJE = new Set(['dodijeljeno', 'u_radu', 'u_izvrsenju']);

function DispecerZahtjevDetaljSaUpitom({
  zahtjev,
  requestId,
  setZahtjev,
}: {
  zahtjev: ZahtjevDetalj;
  requestId: string;
  setZahtjev: (z: ZahtjevDetalj) => void;
}) {
  const searchParams = useSearchParams();
  const fokusKorakTermin = searchParams.get('korak') === 'termin';

  return (
    <DispecerZahtjevDetaljSadrzaj
      zahtjev={zahtjev}
      requestId={requestId}
      onRequestUpdated={(noviZahtjev) => setZahtjev(noviZahtjev)}
      prikaziDugmeNazad
      hrefNazad={`/dispecer?z=${zahtjev.id}`}
      fokusKorakTermin={fokusKorakTermin}
    />
  );
}

function ZatvorIntervencijePanel({
  zahtjevId,
  onUspjeh,
}: {
  zahtjevId: number;
  onUspjeh: () => void;
}) {
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [napomene,     setNapomene]     = useState('');
  const [jeSlanje,     setJeSlanje]     = useState(false);
  const [greska,       setGreska]       = useState<string | null>(null);

  async function zatvori() {
    setJeSlanje(true);
    setGreska(null);
    try {
      const r = await fetch(`/api/dispecer/zahtjevi/${zahtjevId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'zatvori', napomene: napomene.trim() || null }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri zatvaranju.');
      onUspjeh();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri zatvaranju.');
    } finally {
      setJeSlanje(false);
    }
  }

  return (
    <div
      className="mt-6 rounded-2xl p-5"
      style={{
        backgroundColor: 'rgb(34 197 94 / 0.06)',
        border:          '1px solid rgb(34 197 94 / 0.25)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: 'rgb(34 197 94 / 0.12)' }}
          >
            <CheckCircle2 className="h-5 w-5" style={{ color: '#22C55E' }} />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
              Zatvori intervenciju
            </p>
            <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
              Označi intervenciju kao završenu
            </p>
          </div>
        </div>
        {!prikaziFormu && (
          <Button size="sm" onClick={() => setPrikaziFormu(true)}>
            <CheckCircle2 className="h-4 w-4" />
            Zatvori
          </Button>
        )}
      </div>

      {prikaziFormu && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
              Napomena
              <span className="ml-1 font-normal" style={{ color: 'var(--first-nonary)' }}>(opciono)</span>
            </label>
            <textarea
              rows={2}
              value={napomene}
              onChange={(e) => setNapomene(e.target.value)}
              placeholder="Npr. Intervencija uspješno završena, serviser dostavlja izvještaj..."
              className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor:     'rgb(var(--first-quaternary-rgb) / 0.4)',
                backgroundColor: 'rgb(255 255 255 / 0.9)',
                color:           'var(--first-octonary)',
              }}
            />
          </div>

          {greska && (
            <p className="text-xs font-medium" style={{ color: '#DC2626' }}>{greska}</p>
          )}

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setPrikaziFormu(false); setNapomene(''); setGreska(null); }}
              disabled={jeSlanje}
            >
              <X className="h-4 w-4" />
              Odustani
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={zatvori}
              isLoading={jeSlanje}
              loadingText="Zatvaranje..."
            >
              <CheckCircle2 className="h-4 w-4" />
              Potvrdi zatvaranje
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DispecerZahtjevDetaljPage() {
  const { id } = useParams<{ id: string }>();
  const [zahtjev, setZahtjev] = useState<ZahtjevDetalj | null>(null);
  const [ucitava, setUcitava] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void ucitaj(); }, [id]);

  const kategorija = zahtjev ? labelKategorije(zahtjev) : null;
  const naslovStr = zahtjev && kategorija
    ? `${kategorija.podkategorija || kategorija.glavna}`
    : 'Obrada zahtjeva';

  return (
    <AppShell uloga="dispecer" imeKorisnika="Dispečer">
      <div className="mx-auto max-w-6xl px-4 sm:px-0">
        {/* Header: nazad + breadcrumb + naslov + badge */}
        <div className="mb-5">
          <div className="mb-3 flex items-center gap-1.5 text-sm" style={{ color: 'var(--first-nonary)' }}>
            <Link href={zahtjev ? `/dispecer?z=${zahtjev.id}` : '/dispecer'}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium transition-all hover:bg-black/[0.04]"
              style={{ color: 'var(--first-secondary)' }}>
              <ArrowLeft className="h-3.5 w-3.5" />Kontrolna ploča
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/dispecer/zahtjevi"
              className="rounded-lg px-2 py-1 font-medium transition-all hover:bg-black/[0.04]"
              style={{ color: 'var(--first-secondary)' }}>
              Zahtjevi
            </Link>
            {zahtjev && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
                  #{oznakaZaDispecerskiPrikazBroja(zahtjev)}
                </span>
              </>
            )}
          </div>
          {zahtjev && (
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-black" style={{ color: 'var(--first-octonary)' }}>
                {naslovStr}
              </h1>
              {kategorija?.podkategorija && (
                <span className="text-sm font-medium" style={{ color: 'var(--first-nonary)' }}>
                  {kategorija.glavna}
                </span>
              )}
              {zahtjev.is_premium && (
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                  style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#DC2626', border: '1.5px solid rgba(220,38,38,0.25)' }}>
                  Premium
                </span>
              )}
              {zahtjev.final_priority && (
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: 'rgba(220,38,38,0.08)',
                    color: zahtjev.final_priority === 'HITNO' || zahtjev.final_priority === 'KRITIČNO' ? '#DC2626' : 'var(--first-secondary)',
                    border: '1px solid rgba(220,38,38,0.2)',
                  }}>
                  {zahtjev.final_priority}
                </span>
              )}
            </div>
          )}
        </div>

        {ucitava && (
          <div className="flex items-center gap-3 py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-transparent"
              style={{ borderTopColor: 'var(--first-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Učitavanje zahtjeva...</p>
          </div>
        )}
        {greska && <AlertMessage variant="error" message={greska} />}

        {zahtjev && (
          <>
            <Suspense fallback={null}>
              <DispecerZahtjevDetaljSaUpitom
                zahtjev={zahtjev}
                requestId={String(id)}
                setZahtjev={setZahtjev}
              />
            </Suspense>

            {STATUSI_ZA_ZATVARANJE.has(zahtjev.status) && (
              <ZatvorIntervencijePanel
                zahtjevId={zahtjev.id}
                onUspjeh={ucitaj}
              />
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
