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
  - `ServiceRequestForm` (uspjesan submit, error submit, loading kategorija)
- e2e smoke:
  - auth stranice
  - redirect sa privatnih ruta na login

## Security controls

- Login rate limiting je aktivan za prijavu:
  - maksimalno 5 neuspjesnih pokusaja
  - unutar 5 minuta
  - nakon toga blokada prijave 5 minuta
- Korisnik nakon limita dobija poruku: `Previše pokušaja prijave. Sačekajte 5 minuta i pokušajte ponovo.`

### QA reprodukcija brute-force zastite

1. Otvoriti `/auth/login`.
2. Unijeti validan format email adrese i pogresnu lozinku.
3. Ponoviti neuspjesnu prijavu 5 puta.
4. Pokusati prijavu 6. put i potvrditi poruku o blokadi.
5. Verifikacija automatski kroz e2e test: `tests/e2e/auth.smoke.spec.ts` (test `blocks brute-force login attempts after repeated failures`).

## Troubleshooting (flaky testovi)

- Ako e2e padnu zbog zauzetog porta, ugasiti lokalni dev server i ponovo pokrenuti `npm run test:e2e`.
- Ako se pojavi spor startup u Playwright-u, ponoviti test (`npm run test:e2e`) jer se Next cache stabilizuje nakon prvog pokretanja.
- Ako testovi zavise od cache fajlova, ne commitati artefakte (`coverage`, `test-results`, `playwright-report`, `.next`).
