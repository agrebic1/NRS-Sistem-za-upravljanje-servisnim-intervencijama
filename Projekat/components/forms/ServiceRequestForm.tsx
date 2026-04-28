'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { zahtjevShema, type VrijednostiZahtjeva } from '@/lib/validations/requestValidation';
import { posaljiZahtjev, getKategorijeKvara } from '@/services/zahtjevi/zahtjeviService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { AlertMessage } from '@/components/ui/AlertMessage';
import { SuccessMessage } from '@/components/ui/SuccessMessage';
import type { KategorijaKvara } from '@/domain/types';

const MAX_DUZINA_OPISA   = 1000;
const MAX_DUZINA_NAPOMENE = 500;

interface ServiceRequestFormProps {
  idKorisnika: string;
}

function NaslovSekcije({ children }: { children: string }) {
  return (
    <h2
      className="pb-2 text-xs font-semibold uppercase tracking-widest"
      style={{ color: 'var(--first-nonary)', borderBottom: '1px solid rgb(var(--first-quaternary-rgb) / 0.4)' }}
    >
      {children}
    </h2>
  );
}

export function ServiceRequestForm({ idKorisnika }: ServiceRequestFormProps) {
  const [greskaSlanja,   setGreskaSlanja]   = useState<string | null>(null);
  const [jeSlanjUspjelo, setJeSlanjeUspjelo] = useState(false);

  const { data: kategorijeKvara = [], isLoading: jeUcitavanjeKategorija } =
    useQuery<KategorijaKvara[]>({
      queryKey: ['kategorijeKvara'],
      queryFn:  getKategorijeKvara,
    });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VrijednostiZahtjeva>({
    resolver: zodResolver(zahtjevShema),
    mode: 'onChange',
  });

  const posmatranOpisText   = watch('opis', '');
  const posmatranaNapomenaText = watch('napomena', '');

  const opcijKategorija = kategorijeKvara.map((k) => ({
    value: k.id_kategorije_kvara,
    label: k.naziv,
  }));

  async function posaljiFormu(podaci: VrijednostiZahtjeva) {
    setGreskaSlanja(null);
    try {
      await posaljiZahtjev(podaci, idKorisnika);
      setJeSlanjeUspjelo(true);
      reset();
    } catch (greska) {
      setGreskaSlanja(
        greska instanceof Error ? greska.message : 'Greška pri slanju zahtjeva. Pokušajte ponovo.'
      );
    }
  }

  if (jeSlanjUspjelo) {
    return (
      <div className="flex flex-col gap-4">
        <SuccessMessage message="Zahtjev je uspješno poslan! Biti ćete obaviješteni o statusu." />
        <Button variant="secondary" onClick={() => setJeSlanjeUspjelo(false)}>
          Pošalji novi zahtjev
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(posaljiFormu)} noValidate className="flex flex-col gap-7">
      {greskaSlanja && <AlertMessage variant="error" message={greskaSlanja} />}

      {/* Sekcija: Opis problema */}
      <section className="flex flex-col gap-4">
        <NaslovSekcije>Opis problema</NaslovSekcije>

        <Input
          label="Naslov problema"
          type="text"
          placeholder="Npr. Električni kvar u dnevnoj sobi"
          error={errors.naslov?.message}
          {...register('naslov')}
        />

        <Select
          label="Kategorija kvara"
          options={opcijKategorija}
          placeholder={jeUcitavanjeKategorija ? 'Učitavanje...' : 'Odaberite kategoriju'}
          error={errors.idKategorije?.message}
          disabled={jeUcitavanjeKategorija}
          {...register('idKategorije')}
        />

        <Textarea
          label="Opis problema"
          rows={5}
          placeholder="Detaljno opišite problem. Što detaljniji opis, brže ćemo reagirati. (min. 10 karaktera)"
          showCharacterCount
          maxCharacters={MAX_DUZINA_OPISA}
          currentLength={posmatranOpisText?.length ?? 0}
          error={errors.opis?.message}
          {...register('opis')}
        />
      </section>

      {/* Sekcija: Lokacija i kontakt */}
      <section className="flex flex-col gap-4">
        <NaslovSekcije>Lokacija i kontakt</NaslovSekcije>

        <Input
          label="Adresa"
          type="text"
          placeholder="Ulica i broj, grad / Naziv objekta"
          error={errors.lokacija?.message}
          {...register('lokacija')}
        />

        <Input
          label="Kontakt telefon"
          type="tel"
          placeholder="+387 61 000 000"
          autoComplete="tel"
          error={errors.telefon?.message}
          {...register('telefon')}
        />
      </section>

      {/* Sekcija: Dodatno (opciono) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <NaslovSekcije>Dodatne informacije</NaslovSekcije>
          <span
            className="mb-2 rounded-full px-2 py-0.5 text-xs"
            style={{ backgroundColor: 'rgb(var(--first-septenary-rgb) / 0.2)', color: 'var(--first-senary)' }}
          >
            Opciono
          </span>
        </div>

        <Input
          label="Željeni datum intervencije"
          type="date"
          error={errors.zeljenoVrijeme?.message}
          {...register('zeljenoVrijeme')}
        />

        <Textarea
          label="Napomena za servisera"
          rows={3}
          placeholder="Posebne upute, ključ kod komšije, radno vrijeme zgrade..."
          showCharacterCount
          maxCharacters={MAX_DUZINA_NAPOMENE}
          currentLength={posmatranaNapomenaText?.length ?? 0}
          error={errors.napomena?.message}
          {...register('napomena')}
        />

        <div
          className="flex items-start gap-2 rounded-xl px-4 py-3 text-xs"
          style={{ backgroundColor: 'rgb(var(--first-secondary-rgb) / 0.08)', color: 'var(--first-nonary)' }}
        >
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--first-secondary)' }} />
          <span>
            Nakon slanja zahtjeva, dispečer će pregledati situaciju i dodijeliti servisera.
            Biti ćete obaviješteni putem email adrese.
          </span>
        </div>
      </section>

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Slanje zahtjeva..."
        className="w-full"
        size="lg"
      >
        Pošalji zahtjev
      </Button>
    </form>
  );
}
