# Sprint Review Summary

## Sprint broj 6

## Planirani sprint goal

Omogućiti korisnicima intuitivan proces prijave kvara kroz pametni wizard, uspostaviti mehanizam za upravljanje vlastitim zahtjevima (pregled, izmjena, otkazivanje) i automatizovati proces onboardinga servisnih partnera putem administrativne verifikacije.

---

## Šta je završeno

Planirane aktivnosti koje su završene u ovom sprintu su:

- implementacija pametnog wizarda za prijavu kvara (US-05)
- implementacija sistema kategorija i potkategorija kvarova
- integracija mape i unosa lokacije u procesu prijave
- implementacija kalendarskog izbora termina intervencije
- implementacija trijaže i priority score logike za procjenu hitnosti
- pregled vlastitih zahtjeva i statusa intervencija (US-06)
- implementacija izmjene zahtjeva u dozvoljenim statusima (US-26)
- implementacija otkazivanja zahtjeva uz potvrdu korisnika (US-27)
- implementacija premium/hitne usluge u toku prijave zahtjeva (US-33)
- implementacija premium lifecycle sistema i aktivacije premium statusa (US-34)
- implementacija onboarding procesa za interne uloge i partnere (US-18, US-35)
- administrativno kreiranje korisničkih naloga i dodjela uloga
- implementacija validacija kroz Zod fail-fast pristup
- testiranje toka prijave kvara i onboarding procesa

---

## Šta nije završeno

Sve stavke koje su planirane u okviru Sprinta 6 su završene.

---

## Demonstritane funkcionalnosti ili artefakti

U ovom sprintu demonstrirane su sljedeće funkcionalnosti i artefakti:

- AI Usage Log
- Decision Log
- Sprint Backlog
- Pametni wizard za prijavu kvara
- Sistem kategorija i potkategorija kvarova
- Trijaža i automatski priority score sistem
- Pregled i praćenje vlastitih zahtjeva
- Izmjena i otkazivanje zahtjeva
- Premium aktivacija i premium lifecycle
- Administrativni onboarding servisera i dispečera
- Upravljanje statusima onboardinga
- Role-based administrativne funkcionalnosti
- Validacija prijave i onboardinga
- End-to-end testiranje procesa prijave i onboardinga

---

## Glavni problemi i blokeri

- Kompleksnost održavanja stanja pametnog wizarda kroz više koraka zahtijevala je dodatnu validaciju i sinhronizaciju frontend/backend logike.
- Integracija premium lifecycle logike zahtijevala je dodatne backend validacije i kontrolu tranzicija statusa.
- Postojao je rizik od nekonzistentnosti između frontend i backend validacije kategorija i potkategorija kvarova, zbog čega je uvedena centralizovana konfiguracija.
- Administrativni onboarding zahtijevao je dodatnu zaštitu API ruta i validaciju permisija kako bi se spriječio neautorizovan pristup.
- Integracija email servisa predstavljala je potencijalni rizik za dostavu pristupnih podataka i onboarding proces.

---

## Ključne odluke donesene u sprintu

- Modularno proširenje sistema kroz zasebne module i API rute - tim je odlučio da nove funkcionalnosti implementira modularno radi stabilnosti sistema, lakšeg održavanja i smanjenja rizika regresionih grešaka.
- Objektivna procjena hitnosti kroz bodovni sistem trijaže - odlučeno je da se hitnost zahtjeva određuje na osnovu više kriterija kako bi se smanjila subjektivnost korisnika i unaprijedila prioritizacija intervencija.
- Hibridni model zakazivanja termina - tim je odlučio da korisnik predlaže termine dostupnosti dok dispečer potvrđuje konačni termin radi balansa između fleksibilnosti i operativne kontrole.
- Ograničenje maksimalnog broja slotova termina - odlučeno je da korisnik može ponuditi fiksni broj termina kako bi se održala preglednost sistema i olakšala organizacija intervencija.
- Hijerarhijski model kategorija i potkategorija kvarova - tim je odlučio da se koristi main + sub kategorijski model radi preciznijeg klasifikovanja kvarova i jednostavnijeg korisničkog toka.
- Premium aktivacija kao odvojeni lifecycle tok - odlučeno je da premium funkcionalnosti koriste poseban activation flow radi bolje validacije prava korištenja i buduće integracije payment sistema.
- Standardizacija premium aktivacije na dvokorak - tim je odlučio da koristi jedinstveni start → confirm activation flow radi konzistentnosti sistema i jednostavnijeg održavanja.
- SOS bypass protokol za hitne slučajeve - analiziran je model ubrzane prijave hitnih premium intervencija, ali je implementacija odgođena za post-MVP fazu.
- Centralizovana validacija kategorija i poslovnih pravila - odlučeno je da frontend i backend koriste iste validacione definicije radi konzistentnosti sistema.
- Administrativni onboarding internih uloga - tim je odlučio da administratori imaju kontrolisani proces odobravanja i kreiranja naloga za servisere i dispečere radi sigurnosti sistema.
- Premium status validacija prije kreiranja zahtjeva - odlučeno je da backend validira premium prava prije obrade premium zahtjeva kako bi se spriječila zloupotreba sistema.
- Fail-fast validacija kroz Zod sheme - tim je nastavio koristiti fail-fast pristup validaciji radi brže povratne informacije korisniku i smanjenja nepotrebnih zahtjeva prema serveru.

---

## Povratna informacija Product Ownera

Product Owner je izrazio zadovoljstvo implementiranim funkcionalnostima i načinom na koji je tim realizovao planirane aktivnosti u okviru Sprinta 6. Naglašeno je da tim nastavi sa istim pristupom rada i organizacije i u narednom sprintu, uz fokus na održavanje kvaliteta implementacije i konzistentnosti sistema.

---

## Zaključak za naredni sprint

S obzirom na uspješnu implementaciju procesa prijave kvara, upravljanja zahtjevima i onboardinga internih uloga, tim može preći na aktivnosti vezane za sprint 7.
