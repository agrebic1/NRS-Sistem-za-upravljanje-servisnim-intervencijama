# Testing dokumentacija

Ovaj dokument opisuje kako se pokrecu automatski testovi i sta je trenutno pokriveno.

## Lokalne komande

- `npm run test` - pokrece unit + integration testove
- `npm run test:coverage` - pokrece coverage izvjestaj za kriticne module
- `npm run test:e2e` - pokrece Playwright e2e smoke testove

## Sta se mockuje, a sta ide ka backendu

- **Unit testovi** koriste mockove za:
  - Supabase klijenta i auth pozive
  - `next/navigation` router
  - servisne funkcije za forme
- **Integration testovi** testiraju API route logiku kroz simulirane request/response tokove.
- **E2E testovi** pokrecu aplikaciju kroz browser i provjeravaju kljucne korisnicke tokove i redirecte.

## Pokriveni tokovi u Sprint 5

- middleware: redirect neprijavljenih i role-based pristup (`/admin`, `/serviser`, `/dispecer`, `/korisnik`)
- forme:
  - `LoginForm` (happy path, error, resend verifikacije)
  - `RegisterForm` (step navigacija, valid submit, error submit)
  - `ServiceRequestWizard` (petokoračna prijava — pokriveno e2e gdje je primjenjivo)
- e2e smoke:
  - auth stranice
  - redirect sa privatnih ruta na login

## Security controls

- Login rate limiting je aktivan za prijavu:
  - maksimalno 5 neuspjesnih pokusaja
  - unutar 5 minuta
  - nakon toga blokada prijave 5 minuta
- Korisnik nakon limita dobija poruku: `Previše pokušaja prijave. Sačekajte 5 minuta i pokušajte ponovo.`

