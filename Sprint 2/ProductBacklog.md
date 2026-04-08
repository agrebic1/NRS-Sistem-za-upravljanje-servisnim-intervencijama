# Ažurirani Product Backlog
U ovom dokumentu je prikazan ažurirani product backlog sistema za upravljanje servisnim intervencijama. Backlog obuhvata ključne funkcionalnosti i zahtjeve sistema koje su organizovane prema prioritetu i procijenjenoj složenosti, te su povezane sa planiranim sprintovima i verzijama sistema. 


| ID | NAZIV STAVKE | KRATAK OPIS | TIP STAVKE | PRIORITET | PROCJENA SLOŽENOSTI ILI NAPORA | STATUS | VEZA SA SPRINTOM ILI RELEASE PLANOM | NAPOMENA |
|:---|:--------------|:-------------|:------------|:-----------|:--------------------------------|:--------|:-------------------------------------|:----------|
|PB-001|Kontrola pristupa (RBAC)|Kao administrator želim definisati korisničke uloge sa pripadajućim privilegijama (pristup, akcije i slično), kako bih osigurao da korisnici imaju pristup samo relevantnim podacima i funkcionalnostima sistema, u skladu sa svojom ulogom.|Technical Task|Visok|5|To Do|Sprint 6|Tehnička osnova za sigurnost i razgraničenje ovlaštenja.|
|PB-002|Registracija korisnika|Kao novi korisnik želim napraviti korisnički račun kako bih mogao koristiti sistem.|Feature|Visok|5|To Do|Sprint 6|Osnova za korištenje ostalih funkcija.|
|PB-003|Prijava korisnika|Kao registrovani korisnik želim se prijaviti u sistem kako bih pristupio svojim informacijama i funkcionalnostima.|Feature|Visok|3|To Do|Sprint 6|Standardni ulaz u sistem.|
|PB-004|Odjava korisnika (Logout)|Kao korisnik sistema želim se sigurno odjaviti sa svog računa kako bih spriječio neovlašteni pristup mojim podacima nakon završetka rada.|Feature|Visok|2|To Do|Sprint 7|Standardna sigurnosna funkcija koja uništava aktivnu sesiju korisnika.|
|PB-005|Prijava kvara|Kao korisnik usluge želim da prijavim kvar unosom mjesta kvara, lokacije i opisa kako bih pokrenuo proces obrade servisne intervencije.|Feature|Visok|5|To Do|Sprint 7|Osnovna funkcionalnost koja pokreće proces intervencije.|
|PB-006|Detalji intervencije|Kao klijent želim otvoriti intervenciju i vidjeti sve njene informacije kako bih imao potpuni uvid u zadatak.|Feature|Srednji|3|To Do|Sprint 7|Detaljan prikaz intervencije.|
|PB-007|Pregled intervencija|Kao dispečer želim vidjeti listu svih aktivnih i otvorenih intervencija kako bih imao jasan pregled šta je trenutno u toku.|Feature|Visok|5|To Do|Sprint 8|Pregled svih aktivnih zadataka.|
|PB-008|Dodjela prioriteta|Kao dispečer želim dodijeliti prioritet intervenciji kako bi se najhitniji kvarovi riješili prvi.|Feature|Visok|5|To Do|Sprint 8|Implementacija poluatomatskog sistema koji asistira dispečeru pri odluci.|
|PB-009|Planiranje izlazaka na teren|Kao dispečer želim da vidim kalendar/listu dostupnosti servisera kako bi planiranje izlazaka na teren bilo efikasnije.|Feature|Visok|8|To Do|Sprint 9|Najkompleksniji dio poslovne logike koji je ključan za optimizaciju logistike.|
|PB-010|Dodjela intervencije serviseru|Kao dispečer (koordinator) želim dodijeliti intervenciju serviseru kako bi se kvar mogao riješiti.|Feature|Visok|5|To Do|Sprint 9|Povezivanje prijave kvara sa konkretnim izvršiocem.|
|PB-011|Dodjela više servisera|Kao dispečer želim dodijeliti više servisera na jednu intervenciju za složenije kvarove.|Feature|Visok|5|To Do|Sprint 9|Podrška za kompleksne zadatke koji zahtijevaju timski rad.|
|PB-012|Preuzimanje i odbijanje zadatka|Kao serviser želim imati mogućnost da prihvatim ili odbijem dodijeljeni zadatak, kako bi dispečer znao da li je intervencija preuzeta.|Feature|Srednji|3|To Do|Sprint 9|Omogućava serviseru davanje povratne informacije o prihvatanju posla.|
|PB-013|Ažuriranje statusa intervencije|Kao serviser želim ažurirati status intervencije kako bih pratio napredak rada.|Feature|Visok|3|To Do|Sprint 10|Omogućava praćenje faze kvara (Započeto, U toku, Završeno).|
|PB-014|Evidencija rada servisera|Kao serviser želim unijeti potrebne podatke, kako bih dokumentovao početak i završetak posla.|Feature|Srednji|5|To Do|Sprint 10|Mogućnost unosa podataka kao što su utrošeno vrijeme, materijali, ishod i opis rješenja.|
|PB-015|Potvrda zatvaranja intervencije|Kao dispečer želim potvrditi završetak intervencije kako bih bio siguran da je problem riješen.|Feature|Srednji|3|To Do|Sprint 10|Finalna validacija od strane dispečera prije arhiviranja.|
|PB-016|Historija aktivnosti intervencije|Kao dispečer i serviser želim imati uvid u hronološki pregled svih promjena na intervenciji kako bih znao ko je, kada i koju akciju poduzeo (promjena statusa, dodjela, napomene).|Feature|Srednji|5|To Do|Sprint 10|Ključna stavka za praćenje toka rada od prijave do zatvaranja.|
|PB-017|Napomene na intervenciji|Kao dispečer i serviser želim ostavljati napomene na intervenciji kako bi komunikacija bila jasna i sve informacije bile na jednom mjestu.|Feature|Srednji|3|To Do|Sprint 10|Osnovna komunikacija.|
|PB-018|Upravljenje korisničkim računima|Kao administrator želim da kreiram, pregledam, ažuriram i brišem korisničke profile kako bih upravljao pristupom sistemu.|Feature|Visok|8|To Do|Sprint 10|Osnovna administracija korisnika neophodna za rad ostatka sistema.|
|PB-019|Pregled operativnog statusa|Kao dispečer želim vidjeti brojčani pregled intervencija po ključnim fazama (otvorene, u toku, završene) na početnom ekranu, kako bih odmah uočio obim posla.|Feature|Srednji|3|To Do|Sprint 10|Vizuelni prikaz ključnih metrika za dispečera.|
|PB-020|Historija intervencija|Kao korisnik želim vidjeti historiju intervencija kako bih imao pregled prethodnih kvarova.|Feature|Srednji|5|To Do|Sprint 10|Arhiva svih aktivnosti po korisniku radi lakšeg uvida.|



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

