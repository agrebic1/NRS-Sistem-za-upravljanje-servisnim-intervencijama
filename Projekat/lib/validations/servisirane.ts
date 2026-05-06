import { z } from 'zod';

export const partnerApplicationSchema = z.object({
  first_name:      z.string().min(2, 'Ime mora imati najmanje 2 karaktera').max(100),
  last_name:       z.string().min(2, 'Prezime mora imati najmanje 2 karaktera').max(100),
  email:           z.string().email('Unesite ispravnu email adresu'),
  phone:           z
    .string()
    .min(6, 'Unesite ispravan broj telefona')
    .regex(/^[0-9+\-\/ ]*$/, 'Dozvoljeni su samo brojevi i znakovi +, -, /.'),
  service_type:    z.enum(['serviser', 'dispecer'], {
    errorMap: () => ({ message: 'Odaberite tip usluge' }),
  }),
  education_level: z.enum(['SSS', 'VŠS', 'VSS', 'Certifikovani majstor'], {
    errorMap: () => ({ message: 'Odaberite stepen obrazovanja' }),
  }),
  experience:      z.string().min(20, 'Opis iskustva mora imati najmanje 20 karaktera').max(2000),
  document_url:    z.string().url().optional().nullable(),
  specialnosti:    z.array(z.string()).optional(),
});

export const adminCreateUserSchema = z.object({
  first_name: z.string().min(2, 'Ime mora imati najmanje 2 karaktera').max(100),
  last_name: z.string().min(2, 'Prezime mora imati najmanje 2 karaktera').max(100),
  email: z.string().email('Unesite ispravnu email adresu'),
  role: z.enum(['serviser', 'dispecer', 'administrator'], {
    errorMap: () => ({ message: 'Odaberite validnu internu ulogu' }),
  }),
});

// Zod sheme po koracima wizarda
export const wizardKorak1Schema = z.object({
  category: z.string().min(1, 'Odaberite kategoriju zahtjeva'),
  address:  z
    .string()
    .min(5, 'Adresa mora imati najmanje 5 karaktera')
    .max(500, 'Adresa ne smije biti duža od 500 karaktera'),
});

export const terminSlotSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Neispravan format datuma'),
    from: z.string().min(1, 'Unesite početno vrijeme'),
    to:   z.string().min(1, 'Unesite završno vrijeme'),
  })
  .refine((d) => !d.from || !d.to || d.from < d.to, {
    message: '"Vrijeme do" mora biti nakon "Vrijeme od"',
  });

export const wizardKorakTerminSchema = z.object({
  termini: z.array(terminSlotSchema).min(1, 'Odaberite najmanje jedan datum'),
});

export const preferredScheduleBaseSchema = z.object({
  termini:              z.array(terminSlotSchema).default([]),
  no_preferred_time:    z.boolean().optional(),
  preferred_time_label: z.string().max(64).optional().nullable(),
});

export const preferredScheduleSchema = preferredScheduleBaseSchema
  .superRefine((data, ctx) => {
    const bezPreference = data.no_preferred_time === true;
    if (bezPreference) {
      if (data.termini.length > 0) {
        ctx.addIssue({
          code:    z.ZodIssueCode.custom,
          message: 'Uz opciju bez preferiranog termina ne šaljite termine.',
          path:    ['termini'],
        });
      }
      return;
    }

    if (data.termini.length === 0) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        message: 'Odaberite preferirani termin ili označite da nemate preferenciju.',
        path:    ['termini'],
      });
      return;
    }

    if (data.termini.length > 1) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        message: 'Dozvoljen je najviše jedan preferirani datum.',
        path:    ['termini'],
      });
    }
  });

export const wizardKorak2Schema = z.object({
  description:  z
    .string()
    .min(20, 'Opis zahtjeva mora sadržavati dovoljno informacija za obradu.')
    .max(2000, 'Opis ne smije biti duži od 2000 karaktera'),
  contactPhone: z
    .string()
    .min(1, 'Unesite kontakt telefon.')
    .regex(/^[+]?[0-9\s\-()]{8,20}$/, 'Unesite ispravan kontakt telefon.'),
});

export const wizardKorak3Schema = z.object({
  opasnost:       z.boolean({ required_error: 'Odgovorite na pitanje o sigurnosti' }),
  funkcionalnost: z.enum(['potpuni_prekid', 'otezana', 'manja_smetnja'], {
    errorMap: () => ({ message: 'Odaberite uticaj na funkcionisanje' }),
  }),
  steta:     z.boolean({ required_error: 'Odgovorite na pitanje o riziku od štete' }),
  ranjivost: z.boolean({ required_error: 'Odgovorite na pitanje o ranjivim osobama' }),
  obuhvat:   z.boolean({ required_error: 'Odgovorite na pitanje o obimu uticaja' }),
});

export const serviceRequestSchema = z.object({
  category:      z.string().min(1),
  category_main: z.string().min(1).optional(),
  category_sub:  z.string().min(1).optional(),
  address:       z.string().min(5).max(500),
  description:   z.string().min(20).max(2000),
  // Usklađeno s wizardom (PHONE_REGEX): 8–20 znakova
  contact_phone: z
    .string()
    .min(8, 'Unesite ispravan kontakt telefon.')
    .max(20, 'Kontakt telefon je predugačak.')
    .regex(/^[+]?[0-9\s\-()]{8,20}$/, 'Unesite ispravan kontakt telefon.'),
  photo_url:     z.string().url().optional().nullable(),
  /** Opcionalno: GPS / mapa (AC15) */
  latitude:      z.number().min(-90).max(90).optional().nullable(),
  longitude:     z.number().min(-180).max(180).optional().nullable(),
  is_premium:    z.boolean().optional(),
  premium_terms_accepted: z.boolean().optional(),
  triage:        wizardKorak3Schema,
});

export const cancelRequestSchema = z.object({
  cancel_reason: z.string().min(1, 'Odaberite razlog otkazivanja').max(500),
});

export const updateRequestSchema = z
  .object({
    description:        z.string().min(10, 'Opis mora imati najmanje 10 karaktera').max(2000).optional(),
    address:            z.string().min(5, 'Unesite ispravnu adresu').max(500).optional(),
    contact_phone:      z.string().min(1, 'Unesite kontakt telefon.').regex(/^[+]?[0-9\s\-()]{8,20}$/, 'Unesite ispravan kontakt telefon.').optional(),
    preferred_schedule: preferredScheduleSchema.optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: 'Nema polja za ažuriranje',
  });

export const profilUpdateSchema = z.object({
  ime:           z.string().min(2, 'Ime mora imati najmanje 2 karaktera').max(100).optional(),
  prezime:       z.string().min(2, 'Prezime mora imati najmanje 2 karaktera').max(100).optional(),
  broj_telefona: z
    .string()
    .regex(/^[+]?[0-9\s\-()]+$/, 'Neispravan format broja')
    .optional()
    .nullable(),
  adresa: z.string().max(255).optional().nullable(),
});

/** MVP: otkazivanje premiuma (simulacija naplate). */
export const premiumCancelSchema = z.object({
  reason: z.string().max(500).optional().nullable(),
});
