# Sprint Review Summary

## Sprint broj 7

## Planirani sprint goal

Omogućiti dispečerima centralizovan operativni pregled svih aktivnih intervencija kroz dashboard, statusne liste i detaljne prikaze zahtjeva, uz uspostavljanje mehanizma za određivanje operativnog prioriteta intervencija i dodatno unapređenje upravljanja korisničkim zahtjevima kroz validiranu izmjenu i otkazivanje zahtjeva.

---

## Šta je završeno

Planirane aktivnosti koje su završene u ovom sprintu su:

- implementacija dispečerskog pregleda otvorenih intervencija (US-07)
- implementacija detaljnog prikaza pojedinačne intervencije (US-08)
- implementacija statusnog pregleda aktivnih intervencija za dispečere (US-13)
- implementacija operativnog dashboarda sa agregiranim pregledom statusa (US-31)
- implementacija određivanja i izmjene operativnog prioriteta intervencija (US-12)
- razdvajanje korisničke hitnosti i operativnog prioriteta u sistemu
- implementacija filtriranja intervencija po statusima i operativnim fazama
- dorada izmjene vlastitog zahtjeva uz dodatna ograničenja i validacije (US-26)
- dorada otkazivanja vlastitog zahtjeva uz obavezan razlog i validaciju statusa (US-27)
- uklanjanje otkazanih zahtjeva iz aktivnih dispečerskih lista
- usklađivanje statusa između korisničkog i dispečerskog dijela sistema
- implementacija role-based zaštite za dispečerske funkcionalnosti
- implementacija dispečerskog step-by-step wizarda za operativnu obradu zahtjeva
- implementacija centralizovanog operativnog inbox/dashboard pristupa
- implementacija odvojenih modula za zahtjeve i intervencije
- implementacija prikaza aktivnih i historijskih zapisa kroz odvojene operativne tokove
- validacija poslovnih pravila za statusne tranzicije i prioritete
- testiranje kompletnog toka rada dispečera i upravljanja intervencijama

---

## Šta nije završeno

Sve stavke koje su planirane u okviru Sprinta 7 su završene.

---

## Demonstrirane funkcionalnosti ili artefakti

U ovom sprintu demonstrirane su sljedeće funkcionalnosti i artefakti:

- AI Usage Log
- Decision Log
- Sprint Backlog
- Dispečerski pregled otvorenih intervencija
- Operativni dashboard sa KPI pregledom statusa
- Statusni pregled aktivnih intervencija
- Detaljni prikaz pojedinačne intervencije
- Step-by-step wizard za operativnu obradu zahtjeva
- Operativni prioritet intervencija
- Filtriranje intervencija po statusima i fazama
- Razdvajanje korisničke hitnosti i operativnog prioriteta
- Izmjena i otkazivanje zahtjeva sa validacijom statusa
- Usklađenost statusa između korisničkog i dispečerskog sistema
- Role-based zaštita dispečerskih funkcionalnosti
- Odvojeni moduli “Zahtjevi” i “Intervencije”
- Pregled aktivnih i historijskih zapisa
- Testiranje kompletnog operativnog toka dispečera

---

## Glavni problemi i blokeri

- Kompleksnost sinhronizacije statusa između korisničkog i dispečerskog dijela sistema zahtijevala je dodatne backend validacije i kontrolu statusnih tranzicija.
- Implementacija operativnog prioriteta zahtijevala je jasno razdvajanje korisničke procjene hitnosti i internog operativnog prioriteta dispečera.
- Veliki broj operativnih podataka na dashboardu i detaljima intervencije predstavljao je izazov za održavanje preglednog i intuitivnog korisničkog interfejsa.
- Postojao je rizik od nekonzistentnosti prikaza podataka između dashboarda, liste intervencija, detaljnog prikaza i baze podataka.
- Role-based zaštita dispečerskih ruta i API endpointa zahtijevala je dodatnu validaciju permisija i zaštitu pristupa osjetljivim operativnim podacima.
- Implementacija step-by-step wizarda zahtijevala je dodatnu kontrolu stanja i validaciju podataka kroz više koraka obrade.
- Razdvajanje zahtjeva i intervencija u različite operativne faze zahtijevalo je dodatnu poslovnu logiku za prelazak između statusa i modula.
- Upravljanje aktivnim i historijskim zapisima zahtijevalo je dodatnu logiku filtriranja i održavanja preglednosti operativnih ekrana.

---

## Ključne odluke donesene u sprintu

- Dashboard kao centralizovani operativni pregled (“command center”) - tim je odlučio da početni dashboard dispečera bude sažeti operativni pregled sa KPI karticama, kratkim sekcijama i brzim pristupom filtriranim listama, umjesto pune radne liste zahtjeva i intervencija.
- Razdvajanje modula “Zahtjevi” i “Intervencije” - odlučeno je da zahtjevi i intervencije budu odvojeni moduli u navigaciji jer predstavljaju različite faze poslovnog procesa i zahtijevaju različite operativne tokove.
- Fokus dashboarda na stavke koje zahtijevaju pažnju - tim je odlučio da dashboard prikazuje samo najvažnije i operativno relevantne zahtjeve i intervencije umjesto svih zapisa sistema.
- Hibridni model određivanja prioriteta - odlučeno je da sistem generiše prijedlog hitnosti/prioriteta na osnovu poslovnih pravila, dok dispečer potvrđuje ili mijenja konačni operativni prioritet.
- Razdvajanje korisničke hitnosti i operativnog prioriteta - tim je odlučio da korisnička procjena hitnosti ostane informativna, dok operativni prioritet određuje dispečer na osnovu šireg operativnog konteksta.
- Role-based pristup detaljima zahtjeva i intervencija - odlučeno je da pristup detaljima i operativnim funkcionalnostima bude dozvoljen samo ovlaštenim korisnicima kroz granularnu autorizaciju i zaštitu ruta.
- Centralizovani statusni model sistema - tim je odlučio da svi moduli koriste jedinstveni statusni lifecycle i ista pravila tranzicije radi konzistentnosti između dashboarda, zahtjeva i intervencija.
- Razdvajanje korisničkog zahtjeva i operativne intervencije - odlučeno je da intervencija nastaje tek nakon operativne obrade zahtjeva i određivanja prioriteta od strane sistema/dispečera.
- Odvajanje aktivnih i historijskih zapisa - tim je odlučio da aktivni operativni podaci budu prikazani odvojeno od historijskih i završenih zapisa radi preglednijeg rada dispečera.
- Automatski prioritet za premium hitne zahtjeve - odlučeno je da premium hitni zahtjevi automatski dobiju visok prioritet uz mogućnost korekcije od strane dispečera i evidentiranje izmjena.
- Dinamički wizard za premium zahtjeve - tim je odlučio da sistem preskače nepotrebne korake određivanja hitnosti kada je premium prioritet već definisan poslovnim pravilima.
- Step-by-step wizard za operativnu obradu prioriteta - odlučeno je da dispečer prolazi kroz vođeni višekoračni proces određivanja prioriteta radi konzistentnijeg i sigurnijeg operativnog odlučivanja.
- Fail-fast validacija poslovnih pravila - tim je nastavio koristiti fail-fast pristup validaciji radi brže detekcije grešaka, konzistentnosti podataka i smanjenja nepotrebnih serverskih zahtjeva.

---

## Povratna informacija Product Ownera

Product Owner je izrazio zadovoljstvo implementiranim funkcionalnostima i načinom na koji je tim realizovao planirane aktivnosti u okviru Sprinta 7. Naglašeno je da tim nastavi sa istim pristupom rada i organizacije i u narednom sprintu, uz fokus na održavanje kvaliteta implementacije i konzistentnosti sistema.

---

## Zaključak za naredni sprint

S obzirom na uspješnu implementaciju operativnog dashboarda, statusnog pregleda intervencija i upravljanja prioritetima, tim može preći na aktivnosti vezane za dodjelu intervencija serviserima, upravljanje servisnim tokovima i dalju automatizaciju operativnog procesa u narednom sprintu.
