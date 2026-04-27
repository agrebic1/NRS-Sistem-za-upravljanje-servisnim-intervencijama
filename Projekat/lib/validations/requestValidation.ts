import { z } from 'zod';

export const zahtjevShema = z.object({
  naslov: z
    .string()
    .min(5, 'Naslov mora imati najmanje 5 karaktera')
    .max(100, 'Naslov ne smije biti duži od 100 karaktera'),
  idKategorije: z.coerce.number().int().min(1, 'Odaberite kategoriju'),
  opis: z
    .string()
    .min(10, 'Opis mora imati najmanje 10 karaktera')
    .max(1000, 'Opis ne smije biti duži od 1000 karaktera'),
  lokacija: z
    .string()
    .min(5, 'Adresa mora imati najmanje 5 karaktera')
    .max(200, 'Adresa ne smije biti duža od 200 karaktera'),
  telefon: z
    .string()
    .min(9, 'Unesite ispravan broj telefona')
    .regex(/^[+]?[0-9\s\-()]+$/, 'Unesite ispravan broj telefona'),
  zeljenoVrijeme: z
    .string()
    .refine(
      (vrijednost) => !vrijednost || new Date(vrijednost) >= new Date(new Date().toDateString()),
      'Datum ne smije biti u prošlosti'
    )
    .optional(),
  napomena: z
    .string()
    .max(500, 'Napomena ne smije biti duža od 500 karaktera')
    .optional(),
});

export type VrijednostiZahtjeva = z.infer<typeof zahtjevShema>;
