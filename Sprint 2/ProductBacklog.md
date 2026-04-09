# Ažurirani Product Backlog
U ovom dokumentu je prikazan ažurirani product backlog sistema za upravljanje servisnim intervencijama. Backlog obuhvata ključne funkcionalnosti i zahtjeve sistema koje su organizovane prema prioritetu i procijenjenoj složenosti, te su povezane sa planiranim sprintovima i verzijama sistema. 


| ID | NAZIV STAVKE | KRATAK OPIS | TIP STAVKE | PRIORITET | PROCJENA SLOŽENOSTI ILI NAPORA | STATUS | VEZA SA SPRINTOM ILI RELEASE PLANOM | NAPOMENA |
|:---|:--------------|:-------------|:------------|:-----------|:--------------------------------|:--------|:-------------------------------------|:----------|
|PBI-001|Upravljanje korisnicima, ulogama i pravima pristupa (RBAC)|Kao administrator želim da kreiram, pregledam, ažuriram i deaktiviram korisničke račune, te da im dodijelim specifične uloge (dispečer, serviser, klijent), kako bih kontrolisao ko može pristupiti određenim podacima i funkcionalnostima u sistemu.|Feature/<br>Tehcnical Task|Visok|13|To Do|Sprint 6 i <br>Sprint 10|Tehnička osnova za sigurnost i razgraničenje ovlaštenja.|
|PBI-002|Pristup sistemu|Kao korisnik želim da se registrujem, prijavim i sigurno odjavim iz sistema kako bih mogao pristupati funkcionalnostima i informacijama u skaldu sa svojom ulogom.|Feature|Visok|8|To Do|Sprint 6 i<br>Sprint 7|Osnova za korištenje ostalih funkcija.|
|PBI-003|Prijava kvara|Kao korisnik usluge želim da prijavim kvar unosom mjesta kvara, lokacije i opisa kako bih pokrenuo proces obrade servisne intervencije.|Feature|Visok|5|To Do|Sprint 7|Osnovna funkcionalnost koja pokreće proces intervencije.|
|PBI-004|Detalji intervencije|Kao korisnik želim otvoriti zahtjev i vidjeti sve relevantne informacije kako bih imao potpuni uvid u proces servisne intervencije.|Feature|Srednji|3|To Do|Sprint 7|Detaljan prikaz intervencije.|
|PBI-005|Pregled intervencija|Kao dispečer želim vidjeti listu svih aktivnih i otvorenih intervencija kako bih imao jasan pregled šta je trenutno u toku.|Feature|Visok|5|To Do|Sprint 8|Pregled svih aktivnih zadataka.|
|PBI-006|Dodjela prioriteta|Kao dispečer želim dodijeliti prioritet intervenciji kako bi se najhitniji kvarovi riješili prvi.|Feature|Visok|5|To Do|Sprint 8|Implementacija poluatomatskog sistema koji asistira dispečeru pri odluci.|
|PBI-007|Planiranje izlazaka na teren|Kao dispečer želim da vidim kalendar/listu dostupnosti servisera kako bi planiranje izlazaka na teren bilo efikasnije.|Feature|Visok|8|To Do|Sprint 9|Najkompleksniji dio poslovne logike koji je ključan za optimizaciju logistike.|
|PBI-008|Dodjela intervencije serviseru|Kao dispečer (koordinator) želim dodijeliti intervenciju serviseru kako bi se kvar mogao riješiti.|Feature|Visok|5|To Do|Sprint 9|Povezivanje prijave kvara sa konkretnim izvršiocem.|
|PBI-009|Dodjela više servisera|Kao dispečer želim dodijeliti više servisera na jednu intervenciju za složenije kvarove.|Feature|Visok|5|To Do|Sprint 9|Podrška za kompleksne zadatke koji zahtijevaju timski rad.|
|PBI-010|Preuzimanje i odbijanje zadatka|Kao serviser želim imati mogućnost da prihvatim ili odbijem dodijeljeni zadatak, kako bi dispečer znao da li je intervencija preuzeta.|Feature|Srednji|3|To Do|Sprint 9|Omogućava serviseru davanje povratne informacije o prihvatanju posla.|
|PBI-011|Ažuriranje statusa intervencije|Kao serviser želim ažurirati status intervencije kako bih pratio napredak rada.|Feature|Visok|3|To Do|Sprint 10|Omogućava praćenje faze kvara (Započeto, U toku, Završeno).|
|PBI-012|Evidencija rada servisera|Kao serviser želim unijeti potrebne podatke, kako bih dokumentovao početak i završetak posla.|Feature|Srednji|5|To Do|Sprint 10|Mogućnost unosa podataka kao što su utrošeno vrijeme, materijali, ishod i opis rješenja.|
|PBI-013|Potvrda zatvaranja intervencije|Kao dispečer želim potvrditi završetak intervencije kako bih bio siguran da je problem riješen.|Feature|Srednji|3|To Do|Sprint 10|Finalna validacija od strane dispečera prije arhiviranja.|
|PBI-014|Historija aktivnosti intervencije|Kao dispečer ili serviser želim imati uvid u hronološki pregled svih promjena na intervenciji kako bih znao ko je, kada i koju akciju poduzeo (promjena statusa, dodjela, napomene).|Feature|Srednji|5|To Do|Sprint 10|Ključna stavka za praćenje toka rada od prijave do zatvaranja.|
|PBI-015|Napomene na intervenciji|Kao dispečer ili serviser želim ostavljati napomene na intervenciji kako bi komunikacija bila jasna i sve informacije bile na jednom mjestu.|Feature|Srednji|3|To Do|Sprint 10|Osnovna komunikacija.|
|PBI-016|Pregled operativnog statusa|Kao dispečer želim vidjeti brojčani pregled intervencija po ključnim fazama (otvorene, u toku, završene) na početnom ekranu, kako bih odmah uočio obim posla.|Feature|Srednji|3|To Do|Sprint 10|Vizuelni prikaz ključnih metrika za dispečera.|


## Legenda  
Kako bismo osigurali konzistentnost i razumijevanje unutar tima, koristimo sljedeće standarde za definisanje stavki:

**1. Tip stavke (Item Type)**
Određuje prirodu posla koji treba obaviti:

* **Feature:** Nova funkcionalnost sistema koja donosi direktnu vrijednost korisniku (npr. Prijava kvara).

* **Bug:** Ispravka greške u postojećoj funkcionalnosti koja ne radi kako je planirano.

* **Technical Task:** Rad na infrastrukturi, bazi podataka ili kodu koji je neophodan za funkcionisanje sistema (npr. Setup servera).

* **Research:** Istraživanje tehnologija, API-ja ili korisničkih potreba prije same implementacije.

* **Documentation:** Izrada korisničkih uputstava, tehničkih specifikacija ili dijagrama.

**2. Prioritet (Priority)**
Određuje redoslijed rješavanja stavki prema poslovnoj važnosti:

* **Visok (Must Have):** Kritične stavke bez kojih MVP ne može funkcionisati.

* **Srednji (Should Have):** Važne funkcionalnosti koje nisu kritične za prvu verziju, ali su bitne za korisničko iskustvo.

* **Nizak (Could Have):** Stavke koje bi bilo "lijepo imati" ako ostane vremena i resursa.

**3. Procjena složenosti (Estimation)**
Koristimo Story Points (Fibonaccijev niz: 1, 2, 3, 5, 8, 13). Procjena ne predstavlja sate, već kombinaciju:

* **Obima posla:** Koliko toga treba uraditi?

* **Složenosti:** Koliko je teško to implementirati?

* **Neizvjesnosti:** Koliko nam je nepoznata tehnologija ili zahtjev?
  (**Napomena:** 1 = vrlo jednostavno, 13 = velika nepoznanica koju treba razbiti na manje dijelove).

**4. Status**
Prati životni ciklus stavke:

* **To Do:** Stavka je definisana i čeka na red za rad.

* **In Progress:** Tim aktivno radi na stavci u trenutnom sprintu.

* **Done:** Stavka ispunjava sve kriterije iz Definition of Done (implementirana, testirana, dokumentovana).

**5. Veza sa sprintom / Release planom**
Označava kada planiramo raditi na stavci:

* **Sprint X:** Stavka je planirana za konkretnu sedmicu rada.

* **Release 1.0 (MVP):** Stavka je dio prve verzije sistema.

