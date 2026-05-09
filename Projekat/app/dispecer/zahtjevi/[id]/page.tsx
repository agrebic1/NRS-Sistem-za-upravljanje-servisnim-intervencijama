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
import { labelKategorije } from '@/lib/servisirane/kategorije';

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
  const [akcijaGreska, setAkcijaGreska] = useState<string | null>(null);
  const [jeSlanje, setJeSlanje] = useState(false);

  
  const [prioritet, setPrioritet] = useState<'NISKO' | 'SREDNJE' | 'VISOKO' | 'HITNO'>('SREDNJE');

  const [downgradeRazlog, setDowngradeRazlog] = useState('');
  const kategorija = zahtjev ? labelKategorije(zahtjev) : null;
  const kategorijaPrikaz = kategorija
    ? (kategorija.podkategorija ? `${kategorija.glavna} — ${kategorija.podkategorija}` : kategorija.glavna)
    : '';

  useEffect(() => {
    async function ucitaj() {
      try {
        const r = await fetch(`/api/dispecer/zahtjevi/${id}`, { cache: 'no-store' });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? 'Zahtjev nije pronađen.');
        setZahtjev(d.zahtjev);

        
        if (d.zahtjev?.is_premium) setPrioritet('HITNO');
        
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
              #{zahtjev.id} · {kategorijaPrikaz}
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--first-nonary)' }}>{zahtjev.description}</p>

            <div className="mt-4 grid gap-2 text-sm" style={{ color: 'var(--first-octonary)' }}>
              {zahtjev.is_premium && (
                <div className="space-y-1">
                  <p className="font-semibold" style={{ color: '#B91C1C' }}>Premium zahtjev — prioritetna obrada</p>
                  {zahtjev.premium_priority_override_reason?.trim() && (
                    <p className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: 'rgba(37,99,235,0.25)', color: '#1D4ED8', backgroundColor: 'rgba(37,99,235,0.06)' }}>
                      <span className="font-semibold">Snižen prioritet: </span>
                      {zahtjev.premium_priority_override_reason}
                    </p>
                  )}
                </div>
              )}
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
            <div className="mt-6 rounded-xl border p-4" style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.35)', backgroundColor: 'rgb(255 255 255 / 0.65)' }}>
              <p className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>Obrada zahtjeva</p>
              {akcijaGreska && <div className="mt-2"><AlertMessage variant="error" message={akcijaGreska} /></div>}
              <label className="mt-3 block text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>Operativni prioritet</label>
              <select
  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
  style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.45)' }}
  value={prioritet}
  onChange={(e) => setPrioritet(e.target.value as typeof prioritet)}
>
  <option value="NISKO">Nizak</option>
  <option value="SREDNJE">Srednji</option>
  <option value="VISOKO">Visok</option>
  <option value="HITNO">Hitno</option>
</select>
              {zahtjev.is_premium && prioritet !== 'HITNO' && (
                <>
                  <label className="mt-3 block text-xs font-medium" style={{ color: 'var(--first-nonary)' }}>
                    Obrazloženje snižavanja premium prioriteta
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.45)' }}
                    rows={3}
                    value={downgradeRazlog}
                    onChange={(e) => setDowngradeRazlog(e.target.value)}
                  />
                </>
              )}
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  isLoading={jeSlanje}
                  onClick={async () => {
                    setJeSlanje(true);
                    setAkcijaGreska(null);
                    try {
                      const r = await fetch(`/api/dispecer/zahtjevi/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          action: 'potvrdi',
                          final_priority: prioritet,
                          premium_downgrade_reason: downgradeRazlog,
                        }),
                      });
                      const d = await r.json();
                      if (!r.ok) throw new Error(d.error ?? 'Greška pri potvrdi.');
                      const rr = await fetch(`/api/dispecer/zahtjevi/${id}`, { cache: 'no-store' });
                      const dd = await rr.json();
                      if (rr.ok) setZahtjev(dd.zahtjev);
                    } catch (e) {
                      setAkcijaGreska(e instanceof Error ? e.message : 'Greška pri potvrdi.');
                    } finally {
                      setJeSlanje(false);
                    }
                  }}
                >
                  Potvrdi
                </Button>
              </div>
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
