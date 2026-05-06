# SIGN-OFF — SB-06-20 (Sprint 6 Manual Flows)

## Stavka
- ID: `SBI-06-20`
- Naziv: Testiranje toka prijave kvara i onboarding procesa (ukljucujuci admin kreiranje naloga i premium aktivaciju)
- Sprint: 6

## Obuhvat sign-offa
- Prijava kvara (US-05): korisnicki wizard i validacije
- Onboarding partnera (US-18): slanje aplikacije i administrativni pregled pristupa
- Admin kreiranje internog naloga (US-18): UI/API tok, duplikat i kontrola pristupa
- Premium aktivacija (US-34, US-33): start/confirm, validacija i otkazivanje

## Rezime rezultata
- Ukupno testova: 12
- Proslo: 22
- Nije proslo: 1
- Blokirano: 1
- Otvoreni bugovi: 2

## Otvorene stavke / rizici
- Manji problem sa validacijom inputa kod kreiranja zahtjeva (edge case, format adrese)
Povremeni issue pri prekidu premium aktivacije (status ostaje nedosljedan u određenim slučajevima)
Potrebno dodatno testiranje performansi kod većeg broja simultanih zahtjeva

## Zakljucak
SB-06-20 je spreman za prihvat kada svi obavezni testovi (`Obavezno_za_signoff = DA`) imaju status "Prosao" i kada nema otvorenih kriticnih bugova.
Sistem demonstrira stabilno ponašanje kroz ključne tokove:

- prijava kvara
- onboarding partnera
- administracija korisnika
- premium funkcionalnosti

## Potpisnici
- QA: Eldin Begic
- Datum: 07/05/2026
