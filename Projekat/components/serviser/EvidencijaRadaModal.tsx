'use client';

import { useState } from 'react';
import { ClipboardCheck, X, Clock, Wrench, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EvidencijaRadaModalProps {
  zahtjevId:  number;
  onZatvori:  () => void;
  onUspjeh:   () => void;
}

const MIN_OPIS = 5;
const MAX_OPIS = 2000;

export function EvidencijaRadaModal({ zahtjevId, onZatvori, onUspjeh }: EvidencijaRadaModalProps) {
  const [opisRada,       setOpisRada]       = useState('');
  const [trajanje,       setTrajanje]       = useState('');
  const [materijal,      setMaterijal]      = useState('');
  const [napomene,       setNapomene]       = useState('');
  const [jeSlanje,       setJeSlanje]       = useState(false);
  const [greska,         setGreska]         = useState<string | null>(null);

  const opisValid = opisRada.trim().length >= MIN_OPIS;
  const trajanjeNum = trajanje ? parseInt(trajanje, 10) : null;
  const trajanjeValid = !trajanje || (trajanjeNum !== null && trajanjeNum > 0 && trajanjeNum <= 1440);

  async function posalji() {
    if (!opisValid) { setGreska('Opis rada mora imati najmanje 5 karaktera.'); return; }
    if (!trajanjeValid) { setGreska('Trajanje mora biti između 1 i 1440 minuta.'); return; }

    setJeSlanje(true);
    setGreska(null);

    try {
      const r = await fetch(`/api/serviser/intervencije/${zahtjevId}/evidencija`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opis_rada:       opisRada.trim(),
          trajanje_minuta: trajanjeNum,
          materijal:       materijal.trim() || null,
          napomene:        napomene.trim() || null,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? 'Greška pri evidentiranju.');
      onUspjeh();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri slanju.');
    } finally {
      setJeSlanje(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onZatvori(); }}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
        style={{
          backgroundColor: 'var(--first-tertiary)',
          border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.4)',
        }}
      >
        {/* Zaglavlje */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.3)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: 'rgb(var(--first-senary-rgb) / 0.12)' }}
            >
              <ClipboardCheck className="h-5 w-5" style={{ color: 'var(--first-senary)' }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--first-octonary)' }}>
                Evidencija izvršenog rada
              </h2>
              <p className="text-xs" style={{ color: 'var(--first-nonary)' }}>
                Dokumentirajte šta ste uradili
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onZatvori}
            className="transition-opacity hover:opacity-70"
            style={{ color: 'var(--first-nonary)' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tijelo */}
        <div className="flex flex-col gap-4 px-6 py-5">

          {/* Opis rada — obavezno */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
              <label className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                Opis izvršenog rada *
              </label>
            </div>
            <textarea
              rows={4}
              value={opisRada}
              onChange={(e) => setOpisRada(e.target.value)}
              placeholder="Opišite šta je urađeno, koji problem je riješen, koje korake ste poduzeli..."
              className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor:     'rgb(var(--first-quaternary-rgb) / 0.45)',
                backgroundColor: 'rgb(255 255 255 / 0.8)',
                color:           'var(--first-octonary)',
              }}
            />
            <p className="text-right text-xs" style={{ color: 'var(--first-quinary)' }}>
              {opisRada.length}/{MAX_OPIS}
            </p>
          </div>

          {/* Trajanje */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
              <label className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                Trajanje intervencije
                <span className="ml-1 font-normal" style={{ color: 'var(--first-nonary)' }}>(minuta, opciono)</span>
              </label>
            </div>
            <input
              type="number"
              min={1}
              max={1440}
              value={trajanje}
              onChange={(e) => setTrajanje(e.target.value)}
              placeholder="npr. 90"
              className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor:     'rgb(var(--first-quaternary-rgb) / 0.45)',
                backgroundColor: 'rgb(255 255 255 / 0.8)',
                color:           'var(--first-octonary)',
              }}
            />
          </div>

          {/* Materijal/oprema */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4" style={{ color: 'var(--first-nonary)' }} />
              <label className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
                Materijal / oprema
                <span className="ml-1 font-normal" style={{ color: 'var(--first-nonary)' }}>(opciono)</span>
              </label>
            </div>
            <input
              type="text"
              value={materijal}
              onChange={(e) => setMaterijal(e.target.value)}
              placeholder="npr. Zamjenski ventil, kabel 2m..."
              className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor:     'rgb(var(--first-quaternary-rgb) / 0.45)',
                backgroundColor: 'rgb(255 255 255 / 0.8)',
                color:           'var(--first-octonary)',
              }}
            />
          </div>

          {/* Napomene */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--first-octonary)' }}>
              Napomene
              <span className="ml-1 font-normal" style={{ color: 'var(--first-nonary)' }}>(opciono)</span>
            </label>
            <textarea
              rows={2}
              value={napomene}
              onChange={(e) => setNapomene(e.target.value)}
              placeholder="Dodatne napomene za dispečera ili korisnika..."
              className="w-full resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor:     'rgb(var(--first-quaternary-rgb) / 0.45)',
                backgroundColor: 'rgb(255 255 255 / 0.8)',
                color:           'var(--first-octonary)',
              }}
            />
          </div>

          {greska && (
            <p className="text-xs font-medium" style={{ color: '#DC2626' }}>{greska}</p>
          )}
        </div>

        {/* Akcije */}
        <div
          className="flex items-center justify-end gap-3 border-t px-6 py-4"
          style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.3)' }}
        >
          <Button type="button" variant="ghost" size="md" onClick={onZatvori} disabled={jeSlanje}>
            Odustani
          </Button>
          <Button
            type="button"
            size="md"
            onClick={posalji}
            isLoading={jeSlanje}
            loadingText="Slanje..."
            disabled={!opisValid}
          >
            <ClipboardCheck className="h-4 w-4" />
            Evidentiraj rad
          </Button>
        </div>
      </div>
    </div>
  );
}
