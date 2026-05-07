# Izvjestaj testiranja
## Sprint 6 

Datum: 07/05/2026  
Stavka: SB-06-20  
Okruzenje: production

## Obuhvat

Validacija je radjena kroz:
- automatske testove (unit, integration, e2e)
- manuelne testove za Sprint 6 tokove (`TC-01` do `TC-24`)

Pokriveni domeni:
- autentifikacija i autorizacija po ulogama (RBAC)
- admin kreiranje korisnika
- onboarding partnera
- premium aktivacija i validacije
- korisnicki zahtjevi i zastita ruta

## Rezultati automatskih testova

Izvrsene komande:
1. `npm test`
2. `npm run test:coverage`
3. `npm run test:e2e`

Rezultat:
- Unit testovi: 31/31 PASS
- Integration testovi: 27/27 PASS
- E2E testovi: 11/11 PASS
- Ukupno automatskih: 69/69 PASS

Coverage (`npm run test:coverage`):
- Statements: 99.61%
- Branches: 87.39%
- Functions: 100%
- Lines: 100%

Status cilja pokrivenosti:
- trazeni minimum: 98%
- ostvareno: cilj ispunjen

## Rezultati manuelnih testova (SB-06-20)

Izvor: `Projekat/docs/testing/SB-06-20/EXEC_SB-06-20_Sprint6_ManualFlows.csv`

- Ukupno testova: 24
- Proslo: 24
- Nije proslo: 0
- Blokirano: 0

## Bug status

Izvor: `Projekat/docs/testing/SB-06-20/BUG_SB-06-20_Sprint6_ManualFlows.csv`

- Otvoreni bugovi: 0

## Artefakti

- sprint izvjestaj: `Projekat/docs/testing/SB-06-20/IZVJESTAJ_SB-06-20_Sprint6_Testiranje.md`
- sign-off: `Projekat/docs/testing/SB-06-20/SIGNOFF_SB-06-20_QA-SA.md`
- automatski timestamp izvjestaji: `Projekat/docs/testing/Izvjestaji/`
- zadnji run pointer: `Projekat/docs/testing/Izvjestaji/ZADNJI_RUN.txt`

## Zakljucak

Sprint 6 testiranje je uspjesno zavrseno. Svi automatski i manuelni testovi su prosli, nema otvorenih bugova, a pokrivenost kriticnih modula je iznad trazenog praga.
