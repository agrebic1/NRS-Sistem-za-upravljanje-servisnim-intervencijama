'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Calendar, MapPin, Phone, Tag,
  Pencil, X, AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { UrgencyBadge } from '@/components/servisirane/UrgencyBadge';
import type { ServisniZahtjev, StatusZahtjeva } from '@/domain/types/servisirane';

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  StatusZahtjeva,
  { oznaka: string; pozadina: string; boja: string }
> = {
  na_cekanju:  { oznaka: 'Na čekanju',  pozadina: 'rgb(var(--first-quaternary-rgb) / 0.2)',  boja: 'var(--first-nonary)' },
  dodijeljeno: { oznaka: 'Dodijeljeno', pozadina: 'rgb(var(--first-secondary-rgb) / 0.12)',  boja: 'var(--first-secondary)' },
  u_radu:      { oznaka: 'U radu',      pozadina: 'rgb(var(--first-septenary-rgb) / 0.2)',   boja: 'var(--first-senary)' },
  zavrseno:    { oznaka: 'Završeno',    pozadina: 'rgb(var(--first-secondary-rgb) / 0.15)',  boja: 'var(--first-secondary)' },
  otkazano:    { oznaka: 'Otkazano',    pozadina: 'rgb(var(--first-quinary-rgb) / 0.3)',     boja: 'var(--first-nonary)' },
};

const RAZLOZI_OTKAZIVANJA = [
  { value: 'Kvar otklonjen samostalno',     label: 'Kvar otklonjen samostalno' },
  { value: 'Greška pri prijavi',            label: 'Greška pri prijavi' },
  { value: 'Promijenio/la sam mišljenje',   label: 'Promijenio/la sam mišljenje' },
  { value: 'Angažovao/la drugog servisera', label: 'Angažovao/la drugog servisera' },
  { value: 'Ostalo',                        label: 'Ostalo' },
];

// ─── Panel za izmjenu ─────────────────────────────────────────────────────────

function PanelZaIzmjenu({
  zahtjev,
  onUspjeh,
  onOdustanak,
}: {
  zahtjev:     ServisniZahtjev;
  onUspjeh:    () => void;
  onOdustanak: () => void;
}) {
  const [description,   setDescription]   = useState(zahtjev.description);
  const [address,       setAddress]       = useState(zahtjev.address);
  const [contactPhone,  setContactPhone]  = useState(zahtjev.contact_phone);
  const [jeSlanje,      setJeSlanje]      = useState(false);
  const [greska,        setGreska]        = useState<string | null>(null);

  async function spremi() {
    if (description.trim().length < 10) { setGreska('Opis mora imati najmanje 10 karaktera.'); return; }
    if (address.trim().length < 5)      { setGreska('Adresa mora imati najmanje 5 karaktera.'); return; }

    setJeSlanje(true);
    setGreska(null);
    try {
      const odgovor = await fetch(`/api/service-requests/${zahtjev.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ description, address, contact_phone: contactPhone }),
      });
      const podaci = await odgovor.json();
      if (!odgovor.ok) throw new Error(podaci.error ?? 'Greška pri izmjeni.');
      onUspjeh();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri izmjeni.');
    } finally {
      setJeSlanje(false);
    }
  }

  return (
    <div
      className="flex flex-col gap-5 rounded-2xl p-6"
      style={{
        backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.05)',
        border:          '1px solid rgb(var(--first-secondary-rgb) / 0.2)',
      }}
    >
      <h3 className="font-semibold" style={{ color: 'var(--first-octonary)' }}>
        Izmjena zahtjeva
      </h3>
      {greska && <AlertMessage variant="error" message={greska} />}
      <Textarea
        label="Opis kvara"
        id="edit-opis"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        showCharacterCount
        maxCharacters={2000}
        currentLength={description.length}
      />
      <Input
        label="Adresa"
        id="edit-adresa"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Input
        label="Kontakt telefon"
        id="edit-telefon"
        type="tel"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
      />
      <div className="flex gap-3">
        <Button
          type="button"
          size="md"
          onClick={spremi}
          isLoading={jeSlanje}
          loadingText="Spremanje..."
        >
          Spremi izmjene
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onOdustanak}
          disabled={jeSlanje}
        >
          Odustani
        </Button>
      </div>
    </div>
  );
}

// ─── Panel za otkazivanje ─────────────────────────────────────────────────────

function PanelZaOtkazivanje({
  zahtjevId,
  onUspjeh,
  onOdustanak,
}: {
  zahtjevId:   number;
  onUspjeh:    () => void;
  onOdustanak: () => void;
}) {
  const [razlog,    setRazlog]    = useState('');
  const [jeSlanje,  setJeSlanje]  = useState(false);
  const [greska,    setGreska]    = useState<string | null>(null);

  async function potvrdiOtkazivanje() {
    if (!razlog) { setGreska('Odaberite razlog otkazivanja.'); return; }

    setJeSlanje(true);
    setGreska(null);
    try {
      const odgovor = await fetch(`/api/service-requests/${zahtjevId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'cancel', cancel_reason: razlog }),
      });
      const podaci = await odgovor.json();
      if (!odgovor.ok) throw new Error(podaci.error ?? 'Greška pri otkazivanju.');
      onUspjeh();
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri otkazivanju.');
    } finally {
      setJeSlanje(false);
    }
  }

  return (
    <div
      className="flex flex-col gap-5 rounded-2xl p-6"
      style={{
        backgroundColor: 'rgb(var(--first-senary-rgb) / 0.05)',
        border:          '1px solid rgb(var(--first-senary-rgb) / 0.2)',
      }}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" style={{ color: 'var(--first-senary)' }} />
        <h3 className="font-semibold" style={{ color: 'var(--first-senary)' }}>
          Otkazivanje zahtjeva
        </h3>
      </div>
      {greska && <AlertMessage variant="error" message={greska} />}
      <Select
        label="Razlog otkazivanja"
        id="cancel-razlog"
        options={RAZLOZI_OTKAZIVANJA}
        placeholder="— Odaberite razlog —"
        value={razlog}
        onChange={(e) => setRazlog(e.target.value)}
        error={!razlog && greska ? 'Razlog je obavezan' : undefined}
      />
      <div className="flex gap-3">
        <Button
          type="button"
          variant="danger"
          size="md"
          onClick={potvrdiOtkazivanje}
          isLoading={jeSlanje}
          loadingText="Otkazivanje..."
        >
          Potvrdi otkazivanje
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onOdustanak}
          disabled={jeSlanje}
        >
          Odustani
        </Button>
      </div>
    </div>
  );
}

// ─── Stranica ─────────────────────────────────────────────────────────────────

export default function ZahtjevDetaljPage() {
  const params = useParams();
  const router = useRouter();
  const id     = params.id as string;

  const [zahtjev,       setZahtjev]       = useState<ServisniZahtjev | null>(null);
  const [ucitava,       setUcitava]       = useState(true);
  const [greska,        setGreska]        = useState<string | null>(null);
  const [aktivniPanel,  setAktivniPanel]  = useState<'izmjena' | 'otkazivanje' | null>(null);
  const [jeAkcijaDone,  setJeAkcijaDone] = useState(false);

  const ucitajZahtjev = useCallback(async () => {
    setUcitava(true);
    setGreska(null);
    try {
      const odgovor = await fetch(`/api/service-requests/${id}`, { cache: 'no-store' });
      const podaci  = await odgovor.json();
      if (!odgovor.ok) throw new Error(podaci.error ?? 'Zahtjev nije pronađen.');
      setZahtjev(podaci.zahtjev);
    } catch (err) {
      setGreska(err instanceof Error ? err.message : 'Greška pri učitavanju.');
    } finally {
      setUcitava(false);
    }
  }, [id]);

  useEffect(() => { ucitajZahtjev(); }, [ucitajZahtjev]);

  function onUspjehAkcije() {
    setJeAkcijaDone(true);
    setAktivniPanel(null);
    ucitajZahtjev();
  }

  if (ucitava) {
    return (
      <AppShell uloga="korisnik">
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>Učitavanje...</p>
        </div>
      </AppShell>
    );
  }

  if (greska || !zahtjev) {
    return (
      <AppShell uloga="korisnik">
        <div className="flex flex-col gap-4">
          <AlertMessage variant="error" message={greska ?? 'Zahtjev nije pronađen.'} />
          <Link href="/korisnik/zahtjevi">
            <Button variant="secondary" size="md">
              <ArrowLeft className="h-4 w-4" />
              Povratak na listu
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const status        = STATUS_CONFIG[zahtjev.status];
  const mozeBitMijenjan = zahtjev.status === 'na_cekanju';
  const datum = new Date(zahtjev.created_at).toLocaleDateString('bs-BA', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <AppShell uloga="korisnik">
      <div className="mx-auto max-w-2xl">
        {/* Zaglavlje */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/korisnik/zahtjevi"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-soft-beige/30"
            style={{ color: 'var(--first-nonary)' }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0">
            <h1
              className="truncate text-xl font-bold"
              style={{ color: 'var(--first-octonary)' }}
            >
              {zahtjev.category}
            </h1>
            <p className="text-sm" style={{ color: 'var(--first-nonary)' }}>
              Zahtjev #{zahtjev.id}
            </p>
          </div>
        </div>

        {jeAkcijaDone && (
          <div className="mb-5">
            <AlertMessage variant="success" message="Izmjena je uspješno sačuvana." />
          </div>
        )}

        {/* Kartica detalja */}
        <div
          className="rounded-2xl p-6 shadow-card sm:p-8"
          style={{
            backgroundColor: 'rgb(var(--first-quinary-rgb) / 0.22)',
            border:          '1px solid rgb(var(--first-quaternary-rgb) / 0.4)',
          }}
        >
          {/* Status i hitnost */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-sm font-semibold"
              style={{ backgroundColor: status.pozadina, color: status.boja }}
            >
              {status.oznaka}
            </span>
            <UrgencyBadge score={zahtjev.urgency_score} showScore size="md" />
          </div>

          {/* Podaci */}
          <dl className="flex flex-col gap-4">
            <div>
              <dt
                className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--first-nonary)' }}
              >
                <Tag className="h-3 w-3" /> Kategorija
              </dt>
              <dd className="text-sm font-medium" style={{ color: 'var(--first-octonary)' }}>
                {zahtjev.category}
              </dd>
            </div>

            <div>
              <dt
                className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--first-nonary)' }}
              >
                Opis kvara
              </dt>
              <dd className="text-sm leading-relaxed" style={{ color: 'var(--first-octonary)' }}>
                {zahtjev.description}
              </dd>
            </div>

            <div>
              <dt
                className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--first-nonary)' }}
              >
                <MapPin className="h-3 w-3" /> Adresa
              </dt>
              <dd className="text-sm" style={{ color: 'var(--first-octonary)' }}>
                {zahtjev.address}
              </dd>
            </div>

            <div>
              <dt
                className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--first-nonary)' }}
              >
                <Phone className="h-3 w-3" /> Kontakt
              </dt>
              <dd className="text-sm" style={{ color: 'var(--first-octonary)' }}>
                {zahtjev.contact_phone}
              </dd>
            </div>

            <div>
              <dt
                className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--first-nonary)' }}
              >
                <Calendar className="h-3 w-3" /> Datum prijave
              </dt>
              <dd className="text-sm" style={{ color: 'var(--first-octonary)' }}>
                {datum}
              </dd>
            </div>

            {zahtjev.cancel_reason && (
              <div>
                <dt
                  className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--first-senary)' }}
                >
                  Razlog otkazivanja
                </dt>
                <dd className="text-sm" style={{ color: 'var(--first-senary)' }}>
                  {zahtjev.cancel_reason}
                </dd>
              </div>
            )}
          </dl>

          {/* Akcije — samo dok je na_cekanju */}
          {mozeBitMijenjan && aktivniPanel === null && (
            <div
              className="mt-6 flex flex-wrap gap-3 border-t pt-6"
              style={{ borderColor: 'rgb(var(--first-quaternary-rgb) / 0.3)' }}
            >
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setAktivniPanel('izmjena')}
              >
                <Pencil className="h-4 w-4" />
                Izmijeni zahtjev
              </Button>
              <Button
                type="button"
                variant="danger"
                size="md"
                onClick={() => setAktivniPanel('otkazivanje')}
              >
                <X className="h-4 w-4" />
                Otkaži zahtjev
              </Button>
            </div>
          )}

          {/* Paneli za akcije */}
          {aktivniPanel === 'izmjena' && (
            <div className="mt-6">
              <PanelZaIzmjenu
                zahtjev={zahtjev}
                onUspjeh={onUspjehAkcije}
                onOdustanak={() => setAktivniPanel(null)}
              />
            </div>
          )}

          {aktivniPanel === 'otkazivanje' && (
            <div className="mt-6">
              <PanelZaOtkazivanje
                zahtjevId={zahtjev.id}
                onUspjeh={() => { onUspjehAkcije(); router.push('/korisnik/zahtjevi'); }}
                onOdustanak={() => setAktivniPanel(null)}
              />
            </div>
          )}

          {!mozeBitMijenjan && zahtjev.status !== 'otkazano' && (
            <div
              className="mt-6 rounded-xl border px-4 py-3 text-xs"
              style={{
                borderColor:     'rgb(var(--first-secondary-rgb) / 0.2)',
                backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.06)',
                color:           'var(--first-nonary)',
              }}
            >
              Zahtjev je preuzet — izmjena i otkazivanje više nisu mogući.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
