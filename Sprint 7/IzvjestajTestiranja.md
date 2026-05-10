# Izvjestaj testiranja
## Sprint 7

Datum: 10/05/2026  

## Obuhvat

Validacija je rađena kroz:
- automatske testove (unit, integration, e2e)
- manuelne testove za Sprint 7 dispecerske tokove (`TC-01` do `TC-26`)

Pokriveni domeni:
- dispecerski dashboard i KPI pregled
- lista aktivnih zahtjeva, filteri i statusni pregled
- detalj pojedinacne intervencije i dispecerski carobnjak
- operativni prioritet i razdvajanje od korisnicke hitnosti
- izmjena i otkazivanje vlastitog zahtjeva prema statusima
- autorizacija dispecerskih stranica i API endpointa (RBAC)
- uskladjenost statusa izmedju korisnickog i dispecerskog dijela sistema

## Podjela po sprintovima

- Sprint 5: auth/RBAC osnova, registracija, prijava, odjava, sesija, role redirect i kontrola pristupa.
- Sprint 6: korisnicki zahtjevi, admin kreiranje korisnika, onboarding partnera i premium tokovi.
- Sprint 7: dispecerski dashboard, liste, detalj intervencije, carobnjak, operativni prioritet, statusi i RBAC API provjere.

## Dodano u Sprintu 7

- Automatski testovi: +42 u odnosu na Sprint 6 zbir (sa 69 na 111 automatskih testova).
- Manuelni test scenariji: +26 za `SB-07-35`.
- Novi Sprint 7 automatski testovi pokrivaju dispecerske faze, operativni prioritet, dispecerski pristup, API liste/detalja/PATCH akcija i E2E smoke tok dispecera.

## Rezultati automatskih testova

Izvrsene komande:
1. `npm test`
2. `npm run test:coverage`
3. `npm run test:e2e`

Rezultat:
- Unit testovi: 54/54 PASS
- Integration testovi: 41/41 PASS
- E2E testovi: 16/16 PASS
- Ukupno automatskih: 111/111 PASS

Coverage (`npm run test:coverage`):
- Statements: 99.61%
- Branches: 87.39%
- Functions: 100%
- Lines: 100%

Status cilja pokrivenosti:
- trazeni minimum: 98%
- ostvareno: cilj ispunjen

## Rezultati manuelnih testova (SB-07-35)

Izvor: `Projekat/docs/testing/SB-07-35/EXEC_SB-07-35_Sprint7_DispecerManualFlows.csv`

- Ukupno testova: 26
- Proslo: 0
- Nije proslo: 0
- Blokirano: 0
- Ceka rucnu QA potvrdu: 26

## Bug status

Izvor: `Projekat/docs/testing/SB-07-35/BUG_SB-07-35_Sprint7_DispecerManualFlows.csv`

- Otvoreni bugovi: 0

## Artefakti

- sprint izvjestaj: `Projekat/docs/testing/SB-07-35/IZVJESTAJ_SB-07-35_Sprint7_Testiranje.md`
- sign-off: `Projekat/docs/testing/SB-07-35/SIGNOFF_SB-07-35_QA-SA.md`
- test case matrica: `Projekat/docs/testing/SB-07-35/TC_SB-07-35_Sprint7_DispecerManualFlows.csv`
- manual execution: `Projekat/docs/testing/SB-07-35/EXEC_SB-07-35_Sprint7_DispecerManualFlows.csv`
- automatski timestamp izvjestaji: `Projekat/docs/testing/Izvjestaji/`
- zadnji run pointer: `Projekat/docs/testing/Izvjestaji/ZADNJI_RUN.txt`

## Zakljucak

Sprint 7 automatsko testiranje je uspjesno zavrseno. Svi automatski testovi prolaze, nema otvorenih bugova u evidenciji, a pokrivenost kriticnih modula je iznad trazenog praga. Manuelni testovi za dispecerski operativni tok su pripremljeni i cekaju formalnu QA potvrdu prije zavrsnog sign-offa.
