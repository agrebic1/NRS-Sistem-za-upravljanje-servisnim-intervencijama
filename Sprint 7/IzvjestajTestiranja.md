# Izvjestaj testiranja
## Sprint 7

Datum: 15/05/2026  

## Obuhvat

Validacija je rađena kroz:
- automatske testove (unit, integration, e2e)
- manuelne testove za Sprint 7 dispecerske tokove (`TC-01` do `TC-26`)

Pokriveni domeni:
- dispečerski dashboard i KPI pregled
- lista aktivnih zahtjeva, filteri i statusni pregled
- detalj pojedinačne intervencije i dispečerski wizard
- operativni prioritet i razdvajanje od korisničke hitnosti
- izmjena i otkazivanje vlastitog zahtjeva prema statusima
- autorizacija dispečerskih stranica i API endpointa (RBAC)
- uskladjenost statusa između korisničkog i dispečerskog dijela sistema

## Podjela po sprintovima

- Sprint 5: auth/RBAC osnova, registracija, prijava, odjava, sesija, role redirect i kontrola pristupa.
- Sprint 6: korisnički zahtjevi, admin kreiranje korisnika, onboarding partnera i premium tokovi.
- Sprint 7: dispečerski dashboard, liste, detalj intervencije, wizard, operativni prioritet, statusi i RBAC API provjere.

## Dodano u Sprintu 7

- Automatski testovi: +42 u odnosu na Sprint 6 zbir (sa 69 na 111 automatskih testova).
- Manuelni test scenariji: +26 za `SB-07-35`.
- Novi Sprint 7 automatski testovi pokrivaju dispečerske faze, operativni prioritet, dispečerski pristup, API liste/detalja/PATCH akcija i E2E smoke tok dispečera.

## Rezultati automatskih testova

Izvršene komande:
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
- traženi minimum: 98%
- ostvareno: cilj ispunjen

## Rezultati manuelnih testova (SB-07-35)

Izvor: `Projekat/docs/testing/SB-07-35/EXEC_SB-07-35_Sprint7_DispecerManualFlows.csv`

- Ukupno testova: 26
- Prošlo: 26
- Nije prošlo: 0
- Blokirano: 0
- Čeka ručnu QA potvrdu: 0
- Izvršilac: Ajla Ćesir; datum izvrsenja: 15/05/2026

## Bug status

Izvor: `Projekat/docs/testing/SB-07-35/BUG_SB-07-35_Sprint7_DispecerManualFlows.csv`

- Otvoreni bugovi: 0

## Artefakti

- sprint izvjestaj: `Projekat/docs/testing/SB-07-35/IZVJESTAJ_SB-07-35_Sprint7_Testiranje.md`
- sign-off: `Projekat/docs/testing/SB-07-35/SIGNOFF_SB-07-35_QA-SA.md`
- test case matrica: `Projekat/docs/testing/SB-07-35/TC_SB-07-35_Sprint7_DispecerManualFlows.csv`
- manual execution: `Projekat/docs/testing/SB-07-35/EXEC_SB-07-35_Sprint7_DispecerManualFlows.csv`
- automatski timestamp izvještaji: `Projekat/docs/testing/Izvjestaji/`
- zadnji run pointer: `Projekat/docs/testing/Izvjestaji/ZADNJI_RUN.txt`

## Zakljucak

Sprint 7 automatsko i manuelno testiranje je uspjesno zavrseno. Svi automatski testovi prolaze (111/111), nema otvorenih bugova u evidenciji, a pokrivenost kriticnih modula je iznad trazenog praga. Svi manualni testovi za dispecerski operativni tok (SB-07-35) izvrseni su sa statusom PASSED; QA sign-off: Ajla Ćesir, 15/05/2026. Detalji u `Projekat/docs/testing/SB-07-35/`.
