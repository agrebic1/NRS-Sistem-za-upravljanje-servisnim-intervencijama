# User  Stories i Acceptance Criteria

Upute za Acceptance Criteria:

Acceptance Criteria su kriteriji prihvatljivosti koji definišu kada je user story završen. Oni služe da se jasno zna:

šta mora biti ispunjeno
kako se ponašanje sistema provjerava
kada se story može smatrati gotovim.


Format za acceptance criteria: Given–When–Then

Šta znači:
Given = početni uslovi / kontekst
When = radnja korisnika ili događaj
Then = očekivani rezultat

acceptance criteria moraju biti konkretni
moraju pokrivati happy path
i trebaju uključiti edge case-ove i reset / greške kad je to potrebno

## Hijerarhija zahtjeva
```
THEME (Tema)
└── "Sistem za upravljanje servisnim intervencijama"
    │
    ├── EPIC: Pristup sistemu za korisnike usluge
    │   │
    │   └── FEATURE: Autentifikacija korisnika usluge
    │       │
    │       ├── Story: US-01 Samostalna registracija korisnika usluge
    │       ├── Story: US-02 Prijava korisnika u sistem
    │       └── Story: US-03 Odjava korisnika iz sistema
    │
    ├── EPIC: Upravljanje internim korisnicima i pravima pristupa
    │   │
    │   ├── FEATURE: Kontrola pristupa prema ulozi
    │   │   │
    │   │   └── Story: US-04 Kontrola pristupa prema korisničkoj ulozi
    │   │
    │   └── FEATURE: Upravljanje internim korisničkim nalozima
    │       │
    │       ├── Story: US-18 Administrativno kreiranje internog korisničkog naloga
    │       ├── Story: US-19 Pregled postojećih korisničkih naloga
    │       ├── Story: US-20 Promjena korisničke uloge
    │       └── Story: US-21 Deaktivacija korisničkog naloga
    │
    ├── EPIC: Upravljanje zahtjevima korisnika usluge
    │   │
    │   ├── FEATURE: Kreiranje i pregled zahtjeva
    │   │   │
    │   │   ├── Story: US-05 Prijava zahtjeva za servisnu intervenciju
    │   │   └── Story: US-06 Pregled vlastitog zahtjeva
    │   │
    │   └── FEATURE: Izmjena korisničkog zahtjeva
    │       │
    │       ├── Story: US-26 Izmjena vlastitog zahtjeva
    │       └── Story: US-27 Otkazivanje vlastitog zahtjeva
    │
    ├── EPIC: Operativni pregled i obrada intervencija od strane dispečera
    │   │
    │   ├── FEATURE: Pregled operativnih intervencija
    │   │   │
    │   │   ├── Story: US-07 Pregled otvorenih intervencija
    │   │   ├── Story: US-08 Pregled detalja pojedinačne intervencije
    │   │   └── Story: US-13 Pregled statusa intervencija od strane dispečera
    │   │
    │   └── FEATURE: Određivanje prioriteta
    │       │
    │       └── Story: US-12 Određivanje prioriteta intervencije
    │
    ├── EPIC: Dodjela i organizacija izvršenja intervencije
    │   │
    │   ├── FEATURE: Dodjela izvršioca
    │   │   │
    │   │   ├── Story: US-09 Dodjela intervencije odgovornom serviseru
    │   │   ├── Story: US-10 Dodjela intervencije timu servisera
    │   │   └── Story: US-28 Promjena izvršioca intervencije
    │   │
    │   └── FEATURE: Planiranje intervencije
    │       │
    │       └── Story: US-11 Planiranje intervencije
    │
    ├── EPIC: Rad servisera na dodijeljenim zadacima
    │   │
    │   ├── FEATURE: Pregled i preuzimanje zadataka
    │   │   │
    │   │   ├── Story: US-15 Pregled dodijeljenih intervencija
    │   │   ├── Story: US-16 Pregled detalja zadatka na terenu
    │   │   ├── Story: US-22 Prihvatanje dodijeljenog zadatka
    │   │   └── Story: US-23 Odbijanje dodijeljenog zadatka
    │   │
    │   └── FEATURE: Vraćanje zadatka u operativni tok
    │       │
    │       └── Story: US-29 Vraćanje zadatka na ponovnu dodjelu
    │
    ├── EPIC: Upravljanje statusom intervencije
    │   │
    │   └── FEATURE: Praćenje i ažuriranje statusa
    │       │
    │       └── Story: US-14 Ažuriranje statusa intervencije od strane servisera
    │
    ├── EPIC: Evidencija izvršenog rada i zatvaranje intervencije
    │   │
    │   ├── FEATURE: Evidencija i pregled rada
    │   │   │
    │   │   ├── Story: US-17 Evidentiranje izvršenog rada
    │   │   └── Story: US-24 Pregled evidentiranog izvršenog rada
    │   │
    │   └── FEATURE: Formalni završetak intervencije
    │       │
    │       └── Story: US-25 Potvrda i zatvaranje intervencije
    │
    └── EPIC: Komunikacija i praćenje aktivnosti na intervenciji
        │
        ├── FEATURE: Operativna komunikacija
        │   │
        │   └── Story: US-30 Razmjena napomena na intervenciji
        │
        └── FEATURE: Historija aktivnosti
            │
            └── Story: US-31 Pregled historije aktivnosti intervencije
```

# User Stories

Sažeti pregled user story-a u okviru MVP-a: 

| ID | Naziv | Kratak opis | Poslovna vrijednost | Prioritet |
|:---|:------|:------------|:--------------------|:---------:|
| US-01 | Samostalna registracija korisnika usluge | Kao korisnik usluge, želim samostalno kreirati korisnički nalog, kako bih mogao prijaviti kvar i pratiti obradu svog zahtjeva. | - pristup sistemu<br>- početak korištenja<br>- osnova za ostale funkcionalnosti | Visok |
| US-02 | Prijava korisnika u sistem | Kao registrovani korisnik, želim se prijaviti u sistem, kako bih mogao pristupiti funkcionalnostima koje su mi dostupne. | - pristup funkcionalnostima<br>- pristup podacima<br>- rad prema ulozi | Visok |
| US-03 | Odjava korisnika iz sistema | Kao prijavljeni korisnik sistema, želim se sigurno odjaviti sa svog naloga, kako bih spriječio neovlašten pristup svom korisničkom računu nakon završetka rada. | - sigurnost naloga<br>- zaštita podataka<br>- zatvaranje sesije | Srednji |
| US-04 | Kontrola pristupa prema korisničkoj ulozi | Kao administrator, želim da sistem ograniči pristup podacima i funkcionalnostima prema korisničkoj ulozi, kako bi svaki korisnik mogao koristiti samo ono što je relevantno za njegovu odgovornost. | - sigurnost sistema<br>- kontrola pristupa<br>- jasne odgovornosti | Visok |
| US-05 | Prijava zahtjeva za servisnu intervenciju | Kao korisnik usluge, želim prijaviti kvar ili zahtjev za servisnu intervenciju, kako bi obrada mog zahtjeva mogla biti evidentirana i pokrenuta kroz sistem. | - evidentiranje problema<br>- početak procesa<br>- osnova za obradu | Visok |
| US-06 | Pregled vlastitog zahtjeva | Kao korisnik usluge, želim pregledati osnovne informacije i status svog zahtjeva, kako bih imao jasan uvid u ono što je prijavljeno i u fazu obrade u kojoj se zahtjev nalazi. | - preglednost zahtjeva<br>- transparentnost procesa<br>- veće povjerenje korisnika | Visok |
| US-07 | Pregled otvorenih intervencija | Kao dispečer, želim pregledati sve otvorene i aktivne intervencije, kako bih imao jasan uvid u zahtjeve koji čekaju obradu i u tok rada. | - centralizovan pregled<br>- bolja organizacija rada<br>- pravovremeno reagovanje | Visok |
| US-08 | Pregled detalja pojedinačne intervencije | Kao dispečer, želim pregledati detalje pojedinačne intervencije, kako bih imao potpune informacije o njenom trenutnom stanju, toku i zaduženjima. | - potpune informacije<br>- lakše odluke<br>- bolja koordinacija | Visok |
| US-09 | Dodjela intervencije odgovornom serviseru | Kao dispečer, želim dodijeliti intervenciju odgovornom serviseru, kako bi bilo jasno ko preuzima izvršenje zadatka. | - jasna odgovornost<br>- nastavak procesa<br>- lakše praćenje izvršenja | Visok |
| US-10 | Dodjela intervencije timu servisera | Kao dispečer, želim dodijeliti intervenciju timu servisera, kako bi se složeniji zadaci mogli izvršavati timski i organizovano. | - timski rad<br>- raspodjela resursa<br>- podrška složenim zadacima | Srednji |
| US-11 | Planiranje intervencije | Kao dispečer, želim planirati intervenciju unaprijed, kako bih mogao organizovati termin, resurse i izvršenje zadatka. | - koordinacija rada<br>- manje kašnjenja<br>- manje konflikata termina | Visok |
| US-12 | Određivanje prioriteta intervencije | Kao dispečer, želim odrediti prioritet intervencije, kako bi zahtjevi bili obrađeni i raspoređeni prema njihovoj hitnosti i važnosti. | - rad po hitnosti<br>- bolja raspodjela resursa<br>- efikasniji operativni tok | Visok |
| US-13 | Pregled statusa intervencija od strane dispečera | Kao dispečer, želim pregledati statuse intervencija, kako bih mogao pratiti tok rada i imati jasan uvid u trenutnu fazu obrade svakog zahtjeva. | - nadzor procesa<br>- uočavanje zastoja<br>- bolja kontrola rada | Visok |
| US-14 | Ažuriranje statusa intervencije od strane servisera | Kao serviser, želim po potrebi ažurirati status intervencije na kojoj radim, kako bi sistem odražavao trenutno stanje rada na terenu. | - tačno stanje rada<br>- manje dodatnih provjera<br>- bolja koordinacija | Visok |
| US-15 | Pregled dodijeljenih intervencija | Kao serviser, želim pregledati intervencije koje su mi dodijeljene, kako bih znao koje zadatke trebam izvršiti i kojim redoslijedom ih trebam obrađivati. | - pregled zadataka<br>- lakša organizacija rada<br>- manje propuštenih intervencija | Visok |
| US-16 | Pregled detalja zadatka na terenu | Kao serviser, želim pregledati detalje zadatka na terenu, kako bih imao sve potrebne informacije za njegovo pravilno i efikasno izvršavanje. | - manje grešaka<br>- bolja priprema<br>- efikasnije izvršenje | Visok |
| US-17 | Evidentiranje izvršenog rada | Kao serviser, želim evidentirati izvršeni rad, kako bi sistem sadržavao tačan zapis o aktivnostima obavljenim tokom intervencije. | - evidencija rada<br>- transparentnost procesa<br>- pregled izvršenja | Srednji |
| US-18 | Administrativno kreiranje internog korisničkog naloga | Kao administrator, želim kreirati korisnički nalog za internog korisnika sistema, kako bih mu omogućio pristup sistemu u skladu sa njegovom ulogom. | - uključivanje internih korisnika<br>- dodjela odgovornosti<br>- omogućavanje pristupa | Visok |
| US-19 | Pregled postojećih korisničkih naloga | Kao administrator, želim pregledati postojeće korisničke naloge, kako bih imao uvid u korisnike sistema i mogao njima upravljati. | - pregled korisnika<br>- uvid u uloge<br>- osnova za upravljanje nalozima | Visok |
| US-20 | Promjena korisničke uloge | Kao administrator, želim promijeniti korisničku ulogu, kako bi korisnik imao pristup funkcionalnostima koje odgovaraju njegovoj novoj odgovornosti u sistemu. | - usklađivanje pristupa<br>- sigurnost sistema<br>- organizacija rada | Visok |
| US-21 | Deaktivacija korisničkog naloga | Kao administrator, želim deaktivirati korisnički nalog, kako bih spriječio dalji pristup korisniku koji više ne treba koristiti sistem. | - onemogućavanje pristupa<br>- sigurnost sistema<br>- očuvanje evidencije | Visok |
| US-22 | Prihvatanje dodijeljenog zadatka | Kao serviser, želim prihvatiti dodijeljeni zadatak, kako bih potvrdio da preuzimam odgovornost za njegovu realizaciju. | - potvrda preuzimanja<br>- jasna odgovornost<br>- nastavak toka rada | Visok |
| US-23 | Odbijanje dodijeljenog zadatka | Kao serviser, želim odbiti dodijeljeni zadatak, kako bi dispečer mogao pravovremeno reagovati i dodijeliti ga drugom izvršiocu. | - izbjegavanje zastoja<br>- pravovremena reakcija<br>- nova dodjela | Visok |
| US-24 | Pregled evidentiranog izvršenog rada | Kao dispečer, želim pregledati evidentirani izvršeni rad, kako bih imao uvid u ono što je serviser uradio prije zatvaranja intervencije. | - kontrola izvršenja<br>- provjera rada<br>- osnova za zatvaranje | Visok |
| US-25 | Potvrda i zatvaranje intervencije | Kao dispečer, želim potvrditi i zatvoriti završenu intervenciju, kako bi proces bio formalno okončan u sistemu. | - formalni završetak procesa<br>- kontrolisan kraj intervencije<br>- uredna evidencija | Visok |
| US-26 | Izmjena vlastitog zahtjeva | Kao korisnik usluge, želim izmijeniti svoj zahtjev dok još nije preuzet u obradu, kako bih mogao ispraviti pogrešno unesene ili nepotpune podatke. | - ispravka grešaka<br>- tačniji podaci<br>- manje pogrešnih intervencija | Visok |
| US-27 | Otkazivanje vlastitog zahtjeva | Kao korisnik usluge, želim otkazati svoj zahtjev dok još nije u aktivnoj obradi, kako bih mogao povući greškom prijavljen ili više nepotreban zahtjev. | - manje operativnog šuma<br>- čišći backlog zahtjeva<br>- manje nepotrebnog rada | Visok |
| US-28 | Promjena izvršioca intervencije | Kao dispečer, želim promijeniti izvršioca intervencije, kako bi zadatak mogao biti dodijeljen drugom serviseru kada prvobitno dodijeljeni izvršilac ne može preuzeti ili završiti rad. | - fleksibilnost rada<br>- kontinuitet procesa<br>- manji rizik od zastoja | Visok |
| US-29 | Vraćanje zadatka na ponovnu dodjelu | Kao serviser, želim vratiti zadatak na ponovnu dodjelu, kako bi dispečer mogao organizovati dalje izvršenje kada zadatak nije moguće završiti u postojećim okolnostima. | - vraćanje u operativni tok<br>- sprječavanje zastoja<br>- nova organizacija rada | Visok |
| US-30 | Razmjena napomena na intervenciji | Kao dispečer ili serviser, želim dodati kratku napomenu na konkretnu intervenciju, kako bi sve važne operativne informacije bile dostupne na jednom mjestu svim učesnicima u procesu. | - interna komunikacija<br>- važne informacije na jednom mjestu<br>- manje oslanjanja na vanjske kanale | Srednji |
| US-31 | Pregled historije aktivnosti intervencije | Kao dispečer, želim vidjeti listu svih prethodnih promjena i aktivnosti na zahtjevu, kako bih imao jasan uvid u hronologiju obrade od trenutka prijave do trenutnog statusa. | - transparentnost procesa<br>- praćenje toka rada<br>- audit trag | Srednji | 



---

## US-01 — Samostalna registracija korisnika usluge

**Opis:**  
Kao korisnik usluge, želim samostalno kreirati korisnički nalog, kako bih mogao prijaviti kvar i pratiti obradu svog zahtjeva.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava korisniku usluge da samostalno pristupi sistemu i koristi osnovne funkcionalnosti namijenjene klijentu, bez potrebe za posrednim unosom od strane administratora.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da korisnik usluge može samostalno pristupiti registracionoj formi.  

**Otvorena pitanja:** Da li sistem korisniku automatski dodjeljuje ulogu klijenta pri registraciji?

**Veze sa drugim storyjima:**  
Povezano sa storyjem za prijavu korisnika u sistem, prijavu zahtjeva za servisnu intervenciju i pregled vlastitog zahtjeva.

**Acceptance Criteria:**

- **AC1: Uspješna registracija**  
  - **GIVEN** korisnik unese validne podatke  
  - **WHEN** klikne na registraciju  
  - **THEN** sistem kreira korisnički nalog

- **AC2: Nepotpuni podaci**  
  - **GIVEN** korisnik ne unese sve obavezne podatke  
  - **WHEN** pokuša registraciju  
  - **THEN** sistem prikazuje grešku

- **AC3: Neispravan format**  
  - **GIVEN** korisnik unese neispravan format podataka  
  - **WHEN** pokuša registraciju  
  - **THEN** sistem prikazuje validacijsku grešku

- **AC4: Postojeći korisnik**  
  - **GIVEN** korisnik već postoji u sistemu  
  - **WHEN** pokuša registraciju  
  - **THEN** sistem prikazuje grešku

- **AC5: Lozinka ne zadovoljava pravila**  
  - **GIVEN** lozinka ne ispunjava uslove  
  - **WHEN** korisnik pokuša registraciju  
  - **THEN** sistem prikazuje grešku

---

## US-02 — Prijava korisnika u sistem

**Opis:**  
Kao registrovani korisnik, želim se prijaviti u sistem, kako bih mogao pristupiti funkcionalnostima koje su mi dostupne.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava registrovanim korisnicima pristup sistemu i predstavlja osnovu za korištenje svih ostalih funkcionalnosti u skladu sa njihovom ulogom.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da korisnik već ima kreiran i aktivan korisnički nalog.

**Otvorena pitanja:** Otvoreno pitanje je da li se nakon uspješne prijave korisnik preusmjerava na početni ekran prilagođen njegovoj ulozi.


**Veze sa drugim storyjima:**  
Zavisi od storyja za registraciju korisnika i povezan je sa svim storyjima koji zahtijevaju autentifikovan pristup sistemu.

**Acceptance Criteria:**

- **AC1: Uspješna prijava**  
  - **GIVEN** korisnik unese tačne podatke  
  - **WHEN** prijavi se  
  - **THEN** sistem omogućava pristup

- **AC2: Nepotpuni podaci**  
  - **GIVEN** podaci nisu uneseni  
  - **WHEN** korisnik pokušava prijavu  
  - **THEN** sistem prikazuje grešku

- **AC3: Neispravan format**  
  - **GIVEN** podaci nisu u ispravnom formatu  
  - **WHEN** korisnik pokuša prijavu  
  - **THEN** sistem prikazuje grešku

- **AC4: Pogrešni podaci**  
  - **GIVEN** podaci nisu tačni  
  - **WHEN** korisnik pokuša prijavu  
  - **THEN** pristup nije dozvoljen

- **AC5: Neaktivan ili nepostojeći nalog**  
  - **GIVEN** nalog nije aktivan ili ne postoji  
  - **WHEN** korisnik pokuša prijavu  
  - **THEN** sistem prikazuje grešku

---

## US-03 — Odjava korisnika iz sistema

**Opis:**  
Kao prijavljeni korisnik sistema, želim se sigurno odjaviti sa svog naloga, kako bih spriječio neovlašten pristup svom korisničkom računu nakon završetka rada.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava korisniku da na siguran način završi rad u sistemu i spriječi neovlašten pristup svom nalogu i podacima nakon završetka korištenja.

**Prioritet:**  
*Srednji*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da korisnik ima aktivnu sesiju u sistemu.

**Otvorena pitanja:** Otvoreno pitanje je da li se nakon odjave korisnik vraća na početni ekran ili direktno na formu za prijavu.

**Veze sa drugim storyjima:**  
Povezano sa storyjem za prijavu korisnika u sistem.

**Acceptance Criteria:**

- **AC1: Uspješna odjava**  
  - **GIVEN** korisnik je prijavljen  
  - **WHEN** odjavi se  
  - **THEN** sesija se prekida

- **AC2: Zaštićene stranice**  
  - **GIVEN** korisnik se odjavio  
  - **WHEN** pokuša pristupiti zaštićenoj stranici  
  - **THEN** pristup nije dozvoljen

---

## US-04 — Kontrola pristupa prema korisničkoj ulozi

**Opis:**  
Kao administrator, želim da sistem ograniči pristup podacima i funkcionalnostima prema korisničkoj ulozi, kako bi svaki korisnik mogao koristiti samo ono što je relevantno za njegovu odgovornost.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava sigurnu i preglednu kontrolu pristupa sistemu, smanjuje rizik od grešaka i neovlaštenih akcija te podržava jasno razgraničenje odgovornosti među korisnicima.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:** 

**Pretpostavka:** Pretpostavlja se da su osnovne korisničke uloge sistema unaprijed definisane.

**Otvorena pitanja:** Otvoreno pitanje je da li će sistem koristiti fiksno definisane uloge ili se kasnije podržava proširivanje modela prava pristupa.

**Veze sa drugim storyjima:**  
Povezano sa storyjima za prijavu korisnika u sistem, administrativno kreiranje korisničkih naloga i promjenu korisničke uloge.

**Acceptance Criteria:**

- **AC1: Dodjela uloge**  
  - **GIVEN** administrator dodjeljuje ulogu  
  - **WHEN** potvrdi akciju  
  - **THEN** uloga se dodjeljuje

- **AC2: Ograničen pristup**  
  - **GIVEN** korisnik nema prava  
  - **WHEN** pokuša pristup funkcionalnosti  
  - **THEN** pristup nije dozvoljen

- **AC3: Izmjena uloge**  
  - **GIVEN** administrator mijenja ulogu  
  - **WHEN** potvrdi izmjenu  
  - **THEN** uloga se ažurira

---

## US-05 — Prijava zahtjeva za servisnu intervenciju

**Opis:**  
Kao korisnik usluge, želim prijaviti kvar ili zahtjev za servisnu intervenciju, kako bi obrada mog zahtjeva mogla biti evidentirana i pokrenuta kroz sistem.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se problem koji korisnik prijavljuje formalno evidentira u sistemu i pretvori u konkretan zahtjev koji se može dalje obrađivati, pratiti i rješavati.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da registrovani korisnik usluge ima pristup formi za prijavu zahtjeva.

**Otvorena pitanja:**  Otvoreno pitanje je koji je minimalni skup obaveznih podataka potreban za validnu prijavu.

**Veze sa drugim storyjima:**  
Povezano sa storyjima za pregled vlastitog zahtjeva, pregled otvorenih intervencija i dalju obradu servisne intervencije.

**Acceptance Criteria:**

- **AC1: Uspješna prijava**  
  - **GIVEN** korisnik unese podatke  
  - **WHEN** pošalje podatke  
  - **THEN** zahtjev se kreira

- **AC2: Nepotpuni podaci**  
  - **GIVEN** podaci nisu potpuni  
  - **WHEN** korisnik pošalje zahtjev  
  - **THEN** sistem prikazuje grešku

---

## US-06 — Pregled vlastitog zahtjeva

**Opis:**  
Kao korisnik usluge, želim pregledati osnovne informacije i status svog zahtjeva, kako bih imao jasan uvid u ono što je prijavljeno i u fazu obrade u kojoj se zahtjev nalazi.

**Poslovna vrijednost:**  
Ovaj story je važan jer korisniku omogućava da na jednom mjestu vidi šta je prijavio i u kojoj se fazi obrade njegov zahtjev nalazi, čime se povećava preglednost, smanjuje potreba za dodatnim provjerama i povećava povjerenje u proces rješavanja problema.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da korisnik ima evidentiran zahtjev u sistemu.

**Otvorena pitanja:**  Otvoreno pitanje je koji skup informacija će biti minimalno dostupan korisniku, npr. opis problema, lokacija, datum prijave, trenutni status i eventualni planirani termin.

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyjem za ažuriranje statusa intervencije.

**Acceptance Criteria:**

- **AC1: Pregled statusa**  
  - **GIVEN** korisnik ima zahtjev  
  - **WHEN** pregleda status  
  - **THEN** vidi tačan status

- **AC2: Samo vlastiti zahtjevi**  
  - **GIVEN** korisnik je prijavljen  
  - **WHEN** pregleda zahtjeve  
  - **THEN** vidi samo svoje

---

## US-07 — Pregled otvorenih intervencija

**Opis:**  
Kao dispečer, želim pregledati sve otvorene i aktivne intervencije, kako bih imao jasan uvid u zahtjeve koji čekaju obradu i u tok rada.

**Poslovna vrijednost:**  
Ovaj story je važan jer dispečeru omogućava centralizovan pregled zahtjeva koji su u obradi, olakšava organizaciju rada i pravovremeno reagovanje na zastoje, promjene prioriteta i opterećenost resursa.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da sistem razlikuje otvorene, aktivne i završene intervencije.

**Otvorena pitanja:**  Otvoreno pitanje je da li pregled uključuje samo listu intervencija ili i osnovne informacije poput prioriteta, statusa i dodijeljenog servisera.

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva i povezan je sa storyjima za pregled detalja pojedinačne intervencije, određivanje prioriteta, dodjelu servisera i pregled statusa intervencija.

**Acceptance Criteria:**

- **AC1: Prikaz intervencija**  
  - **GIVEN** postoje intervencije  
  - **WHEN** dispečer pregleda  
  - **THEN** vidi listu

- **AC2: Ažuriranje liste**  
  - **GIVEN** status se promijeni  
  - **WHEN** lista se osvježi  
  - **THEN** prikaz je ažuriran

---

## US-08 — Pregled detalja pojedinačne intervencije

**Opis:**  
Kao dispečer, želim pregledati detalje pojedinačne intervencije, kako bih imao potpune informacije o njenom trenutnom stanju, toku i zaduženjima.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava dispečeru da na jednom mjestu dobije sve ključne informacije o konkretnoj intervenciji, što olakšava praćenje toka rada, donošenje operativnih odluka i koordinaciju daljih aktivnosti.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da dispečer već ima pristup listi intervencija i da može otvoriti pojedinačnu intervenciju iz pregleda.

**Otvorena pitanja:**  Otvoreno pitanje je koje informacije čine minimalni skup detalja u ovom prikazu.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled otvorenih intervencija i povezan je sa storyjima za određivanje prioriteta, dodjelu izvršioca, planiranje intervencije i pregled statusa intervencija.

**Acceptance Criteria:**

- **AC1: Pregled detalja**  
  - **GIVEN** korisnik otvori intervenciju  
  - **WHEN** pregleda detalje  
  - **THEN** vidi informacije

- **AC2: Prava pristupa**  
  - **GIVEN** korisnik nema prava  
  - **WHEN** pokuša otvoriti detalje  
  - **THEN** pristup nije dozvoljen

---

## US-09 — Dodjela intervencije odgovornom serviseru

**Opis:**  
Kao dispečer, želim dodijeliti intervenciju odgovornom serviseru, kako bi bilo jasno ko preuzima izvršenje zadatka.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da svaka intervencija dobije jasno određenog izvršioca, čime se uspostavlja odgovornost za njeno preuzimanje i dalje izvršenje.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da sistem raspolaže listom servisera kojima se intervencija može dodijeliti.

**Otvorena pitanja:**  Otvoreno pitanje je da li ova verzija podržava samo dodjelu jednom serviseru.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled otvorenih intervencija i pregled detalja pojedinačne intervencije, a povezan je sa storyjima za planiranje intervencije i ažuriranje statusa intervencije.

**Acceptance Criteria:**

- **AC1: Uspješna dodjela**  
  - **GIVEN** dispečer odabere servisera  
  - **WHEN** potvrdi dodjelu  
  - **THEN** intervencija se dodjeljuje

- **AC2: Bez odabira servisera**  
  - **GIVEN** serviser nije odabran  
  - **WHEN** pokuša dodjelu  
  - **THEN** sistem prikazuje grešku

---

## US-10 — Dodjela intervencije timu servisera

**Opis:**  
Kao dispečer, želim dodijeliti intervenciju timu servisera, kako bi se složeniji zadaci mogli izvršavati timski i organizovano.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se složenije intervencije rasporede timu servisera na organizovan način, što olakšava koordinaciju rada i raspodjelu resursa.

**Prioritet:**  
*Srednji*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da u sistemu postoje definisani timovi servisera kojima se intervencije mogu dodijeliti.

**Otvorena pitanja:**  Otvoreno pitanje je da li se unutar tima dodatno određuje glavni izvršilac.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled detalja pojedinačne intervencije i povezan je sa storyjima za pregled dodijeljenih intervencija i planiranje intervencije.

**Acceptance Criteria:**

- **AC1: Uspješna dodjela timu**  
  - **GIVEN** dispečer odabere tim  
  - **WHEN** potvrdi dodjelu  
  - **THEN** tim se dodjeljuje

- **AC2: Bez odabira tima**  
  - **GIVEN** tim nije odabran  
  - **WHEN** pokuša dodjelu  
  - **THEN** sistem prikazuje grešku

- **AC3: Prava pristupa**  
  - **GIVEN** korisnik nije ovlašten  
  - **WHEN** pokuša dodjelu  
  - **THEN** akcija nije dozvoljena

---

## US-11 — Planiranje intervencije

**Opis:**  
Kao dispečer, želim planirati intervenciju unaprijed, kako bih mogao organizovati termin, resurse i izvršenje zadatka.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava pravovremeno i efikasno planiranje intervencija, smanjuje rizik od kašnjenja i preklapanja zadataka te poboljšava organizaciju operativnog rada.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:** Pretpostavlja se da postoje podaci o resursima, timu i raspoloživim terminima.

**Otvorena pitanja:**  Otvoreno pitanje je da li u planiranju učestvuju i drugi korisnici osim dispečera.

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije izvršiocu i povezan je sa storyjima za pregled statusa intervencija i pregled detalja pojedinačne intervencije.

**Acceptance Criteria:**

- **AC1: Uspješno planiranje**  
  - **GIVEN** unesen validan termin  
  - **WHEN** korisnik potvrdi  
  - **THEN** termin se sprema

- **AC2: Nepotpuni podaci**  
  - **GIVEN** podaci nisu uneseni  
  - **WHEN** korisnik planira  
  - **THEN** sistem prikazuje grešku

- **AC3: Neispravan termin**  
  - **GIVEN** termin nije validan  
  - **WHEN** korisnik potvrdi  
  - **THEN** sistem prikazuje grešku

- **AC4: Konflikt termina**  
  - **GIVEN** postoji drugi termin  
  - **WHEN** korisnik planira  
  - **THEN** sistem upozorava

---

## US-12 — Određivanje prioriteta intervencije

**Opis:**  
Kao dispečer, želim odrediti prioritet intervencije, kako bi zahtjevi bili obrađeni i raspoređeni prema njihovoj hitnosti i važnosti.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se intervencije ne obrađuju proizvoljno, nego u skladu sa njihovom stvarnom hitnošću i poslovnim značajem.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da su svi relevantni podaci o intervenciji (opis problema, lokacija, hitnost) već uneseni u sistem kako bi dispečer mogao odrediti prioritet.

**Otvorena pitanja:** Otvoreno pitanje je da li dispečer prioritet određuje ručno ili sistem daje prijedlog koji dispečer potvrđuje ili mijenja.

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva i pregled detalja pojedinačne intervencije, a povezan je sa storyjima za dodjelu intervencije i planiranje intervencije.

**Acceptance Criteria:**

- **AC1: Postavljanje prioriteta**  
  - **GIVEN** dispečer odabere prioritet  
  - **WHEN** potvrdi  
  - **THEN** prioritet se sprema

- **AC2: Ručna izmjena**  
  - **GIVEN** prioritet postoji  
  - **WHEN** dispečer ga promijeni  
  - **THEN** novi prioritet se sprema

- **AC3: Prikaz prioriteta**  
  - **GIVEN** prioritet je postavljen  
  - **WHEN** pregleda se intervencija  
  - **THEN** prioritet je vidljiv

- **AC4: Prava pristupa**  
  - **GIVEN** korisnik nije ovlašten  
  - **WHEN** pokuša promjenu  
  - **THEN** akcija nije dozvoljena

---

## US-13 — Pregled statusa intervencija od strane dispečera

**Opis:**  
Kao dispečer, želim pregledati statuse intervencija, kako bih mogao pratiti tok rada i imati jasan uvid u trenutnu fazu obrade svakog zahtjeva.

**Poslovna vrijednost:**  
Ovaj story je važan jer dispečeru daje pregled nad trenutnim stanjem procesa i omogućava da na vrijeme uoči zastoje, preopterećenost ili potrebu za dodatnom intervencijom.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da sistem podržava definisane statuse intervencije.

**Otvorena pitanja:** Otvoreno pitanje je da li dispečer vidi samo trenutni status ili i dodatne informacije poput prioriteta, izvršioca i termina.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled otvorenih intervencija i povezan je sa storyjima za pregled detalja pojedinačne intervencije, određivanje prioriteta, dodjelu izvršioca, planiranje i ažuriranje statusa.

**Acceptance Criteria:**

- **AC1: Pregled statusa**  
  - **GIVEN** postoje intervencije  
  - **WHEN** dispečer pregleda  
  - **THEN** vidi statuse

- **AC2: Ažuriranje prikaza**  
  - **GIVEN** status se promijeni  
  - **WHEN** lista se osvježi  
  - **THEN** prikaz je ažuriran

- **AC3: Pristup detaljima**  
  - **GIVEN** dispečer klikne intervenciju  
  - **WHEN** otvori detalje  
  - **THEN** vidi dodatne informacije

---

## US-14 — Ažuriranje statusa intervencije od strane servisera

**Opis:**  
Kao serviser, želim po potrebi ažurirati status intervencije na kojoj radim, kako bi sistem odražavao trenutno stanje rada na terenu.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da sistem prati stvarni tok izvršenja intervencije i da ostali korisnici imaju pravovremenu i tačnu informaciju o tome u kojoj se fazi rad nalazi.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da serviser može ažurirati status samo za intervencije koje su mu dodijeljene.

**Otvorena pitanja:** Otvoreno pitanje je koje operativne statuse serviser može postavljati.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled dodijeljenih intervencija i pregled detalja zadatka na terenu. Povezan je sa storyjima za pregled statusa intervencija od strane dispečera, pregled vlastitog zahtjeva i evidentiranje izvršenog rada.

**Acceptance Criteria:**  

---

## US-15 — Pregled dodijeljenih intervencija

**Opis:**  
Kao serviser, želim pregledati intervencije koje su mi dodijeljene, kako bih znao koje zadatke trebam izvršiti i kojim redoslijedom ih trebam obrađivati.

**Poslovna vrijednost:**  
Ovaj story je važan jer serviseru daje pregled njegovih zadataka, olakšava organizaciju rada i smanjuje rizik da neka intervencija bude zaboravljena ili obrađena van prioriteta.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da su intervencije već kreirane i dodijeljene od strane dispečera.

**Otvorena pitanja:** Otvoreno pitanje je da li serviser vidi samo svoje zadatke ili i zadatke cijelog tima.

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije odgovornom serviseru ili timu i povezan je sa storyjem za pregled detalja zadatka na terenu.

**Acceptance Criteria:**  

---

## US-16 — Pregled detalja zadatka na terenu

**Opis:**  
Kao serviser, želim pregledati detalje zadatka na terenu, kako bih imao sve potrebne informacije za njegovo pravilno i efikasno izvršavanje.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava serviseru da na terenu ima sve ključne informacije o zadatku na jednom mjestu, čime se smanjuju greške, nedoumice i potreba za dodatnim provjerama.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:** 

**Pretpostavka:**  Pretpostavlja se da je intervencija već evidentirana i dodijeljena serviseru ili timu.

**Otvorena pitanja:** Otvoreno pitanje je koje informacije čine minimalni obavezni skup detalja koje serviser mora imati dostupne na terenu.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled dodijeljenih intervencija i povezan je sa storyjima za ažuriranje statusa intervencije i evidentiranje izvršenog rada.

**Acceptance Criteria:**  

---

## US-17 — Evidentiranje izvršenog rada

**Opis:**  
Kao serviser, želim evidentirati izvršeni rad, kako bi sistem sadržavao tačan zapis o aktivnostima obavljenim tokom intervencije.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se izvršene aktivnosti evidentiraju tačno i pravovremeno, čime se osigurava jasan uvid u obavljeni rad, praćenje napretka i korištenje resursa.

**Prioritet:**  
*Srednji*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da serviser može evidentirati aktivnosti tokom ili nakon intervencije.

**Otvorena pitanja:** Otvoreno pitanje je koje informacije su obavezne prilikom evidencije.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled detalja zadatka na terenu i povezan je sa storyjima za ažuriranje statusa intervencije i pregled evidentiranog izvršenog rada.

**Acceptance Criteria:**  

---

## US-18 — Administrativno kreiranje internog korisničkog naloga

**Opis:**  
Kao administrator, želim kreirati korisnički nalog za internog korisnika sistema, kako bih mu omogućio pristup sistemu u skladu sa njegovom ulogom.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava uključivanje internih korisnika u sistem i predstavlja osnovu za organizovan rad servisera, dispečera i drugih internih aktera.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da administrator ima pravo kreiranja internih korisničkih naloga.

**Otvorena pitanja:** Otvoreno pitanje je da li se korisnička uloga dodjeljuje odmah prilikom kreiranja naloga ili u posebnom koraku nakon toga.

**Veze sa drugim storyjima:**  
Povezano sa storyjima za pregled korisničkih naloga i promjenu korisničke uloge.

**Acceptance Criteria:**

- **AC1: Uspješno kreiranje internog naloga**  
  - **GIVEN** administrator unese sve obavezne i ispravne podatke  
  - **WHEN** potvrdi kreiranje korisničkog naloga  
  - **THEN** sistem kreira novi interni korisnički nalog.

- **AC2: Nepotpuni podaci**  
  - **GIVEN** administrator nije unio sve obavezne podatke  
  - **WHEN** pokuša kreirati korisnički nalog  
  - **THEN** sistem ne kreira nalog i prikazuje poruku o grešci.

- **AC3: Dupliranje korisničkog naloga**  
  - **GIVEN** da u sistemu već postoji korisnik sa istim jedinstvenim identifikatorom  
  - **WHEN** administrator pokuša kreirati novi nalog  
  - **THEN** sistem ne kreira nalog i prikazuje odgovarajuću poruku.

- **AC4: Ograničenje pristupa**  
  - **GIVEN** korisnik nije administrator  
  - **WHEN** pokuša pristupiti funkcionalnosti kreiranja naloga  
  - **THEN** sistem mu ne dozvoljava pristup.

---

## US-19 — Pregled postojećih korisničkih naloga

**Opis:**  
Kao administrator, želim pregledati postojeće korisničke naloge, kako bih imao uvid u korisnike sistema i mogao njima upravljati.

**Poslovna vrijednost:**  
Ovaj story je važan jer administratoru omogućava pregled svih korisnika sistema, njihovih uloga i statusa naloga, što predstavlja osnovu za organizovano upravljanje pristupom i odgovornostima u sistemu.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da korisnički nalozi već postoje u sistemu.

**Otvorena pitanja:** Otvoreno pitanje je da li pregled treba prikazivati samo aktivne korisnike ili i deaktivirane naloge.

**Veze sa drugim storyjima:**  
Zavisi od storyja za administrativno kreiranje korisničkog naloga i povezan je sa storyjima za promjenu korisničke uloge i deaktivaciju korisničkog naloga.

**Acceptance Criteria:**

- **AC1: Prikaz liste korisničkih naloga**  
  - **GIVEN** u sistemu postoje korisnički nalozi  
  - **WHEN** administrator pristupi pregledu korisnika  
  - **THEN** sistem prikazuje listu korisničkih naloga.

- **AC2: Prikaz osnovnih podataka o korisniku**  
  - **GIVEN** administrator pregleda listu korisničkih naloga  
  - **WHEN** sistem prikaže korisnike  
  - **THEN** za svakog korisnika prikazuje osnovne informacije, uključujući ime, ulogu i status naloga.

- **AC3: Prikaz praznog stanja**  
  - **GIVEN** u sistemu nema korisničkih naloga  
  - **WHEN** administrator pristupi pregledu korisnika  
  - **THEN** sistem prikazuje odgovarajuću poruku da nema dostupnih korisnika.

- **AC4: Ograničenje pristupa**  
  - **GIVEN** korisnik nije administrator  
  - **WHEN** pokuša pristupiti pregledu korisničkih naloga  
  - **THEN** sistem mu ne dozvoljava pristup.

---

## US-20 — Promjena korisničke uloge

**Opis:**  
Kao administrator, želim promijeniti korisničku ulogu, kako bi korisnik imao pristup funkcionalnostima koje odgovaraju njegovoj novoj odgovornosti u sistemu.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se prava pristupa i odgovornosti korisnika usklade sa njihovom stvarnom ulogom u poslovnom procesu, čime se povećava sigurnost sistema i podržava jasna organizacija rada.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da su korisničke uloge unaprijed definisane u sistemu.

**Otvorena pitanja:** Otvoreno pitanje je da li se promjena uloge primjenjuje odmah ili tek nakon naredne prijave korisnika.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled korisničkih naloga i povezan je sa storyjem za kontrolu pristupa prema korisničkoj ulozi.

**Acceptance Criteria:**

- **AC1: Uspješna promjena korisničke uloge**  
  - **GIVEN** administrator odabere postojećeg korisnika i novu ulogu  
  - **WHEN** potvrdi promjenu  
  - **THEN** sistem evidentira novu korisničku ulogu.

- **AC2: Prikaz ažurirane uloge**  
  - **GIVEN** korisnička uloga je uspješno promijenjena  
  - **WHEN** administrator pregleda korisnički nalog  
  - **THEN** sistem prikazuje novu ulogu korisnika.

- **AC3: Nevažeća promjena uloge**  
  - **GIVEN** administrator nije odabrao novu ulogu  
  - **WHEN** pokuša potvrditi izmjenu  
  - **THEN** sistem ne sprema promjenu i prikazuje poruku o grešci.

- **AC4: Ograničenje pristupa**  
  - **GIVEN** korisnik nije administrator  
  - **WHEN** pokuša promijeniti korisničku ulogu  
  - **THEN** sistem mu ne dozvoljava pristup toj funkcionalnosti.

---

## US-21 — Deaktivacija korisničkog naloga

**Opis:**  
Kao administrator, želim deaktivirati korisnički nalog, kako bih spriječio dalji pristup korisniku koji više ne treba koristiti sistem.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava administratoru da onemogući pristup korisnicima koji više ne trebaju koristiti sistem, bez gubitka historijskih podataka i veza koje su vezane za njihov raniji rad.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:** 

**Pretpostavka:**  Pretpostavlja se da korisnički nalog već postoji u sistemu.

**Otvorena pitanja:** Otvoreno pitanje je da li deaktivirani korisnik ostaje vidljiv u listi korisnika i da li sistem prikazuje njegov status kao neaktivan.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled korisničkih naloga i povezan je sa storyjem za prijavu korisnika u sistem.

**Acceptance Criteria:**

- **AC1: Uspješna deaktivacija naloga**  
  - **GIVEN** administrator odabere aktivan korisnički nalog  
  - **WHEN** potvrdi deaktivaciju  
  - **THEN** sistem mijenja status naloga u neaktivan.

- **AC2: Onemogućen pristup deaktiviranom korisniku**  
  - **GIVEN** korisnički nalog je deaktiviran  
  - **WHEN** korisnik pokuša prijavu u sistem  
  - **THEN** sistem mu ne dozvoljava pristup.

- **AC3: Prikaz statusa neaktivnog naloga**  
  - **GIVEN** korisnički nalog je deaktiviran  
  - **WHEN** administrator pregleda korisnike  
  - **THEN** sistem prikazuje da je nalog neaktivan.

- **AC4: Ograničenje pristupa funkcionalnosti deaktivacije**  
  - **GIVEN** korisnik nije administrator  
  - **WHEN** pokuša deaktivirati korisnički nalog  
  - **THEN** sistem mu ne dozvoljava pristup toj funkcionalnosti.

---

## US-22 — Prihvatanje dodijeljenog zadatka

**Opis:**  
Kao serviser, želim prihvatiti dodijeljeni zadatak, kako bih potvrdio da preuzimam odgovornost za njegovu realizaciju.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da sistem evidentira da je serviser svjesno preuzeo odgovornost za izvršenje zadatka, što olakšava koordinaciju rada i praćenje toka intervencije.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da je zadatak prethodno dodijeljen serviseru.

**Otvorena pitanja:** Otvoreno pitanje je da li prihvatanje zadatka automatski mijenja status intervencije.

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije odgovornom licu i povezan je sa storyjem za ažuriranje statusa intervencije od strane servisera.

**Acceptance Criteria:**  

---

## US-23 — Odbijanje dodijeljenog zadatka

**Opis:**  
Kao serviser, želim odbiti dodijeljeni zadatak, kako bi dispečer mogao pravovremeno reagovati i dodijeliti ga drugom izvršiocu.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da sistem evidentira da zadatak ne može biti preuzet, čime se izbjegava zastoj u procesu i omogućava pravovremena reakcija dispečera.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da je zadatak prethodno dodijeljen serviseru.

**Otvorena pitanja:** Otvoreno pitanje je da li serviser mora unijeti razlog odbijanja zadatka.

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije odgovornom licu i povezan je sa storyjem za pregled dodijeljenih intervencija.

**Acceptance Criteria:**  

---

## US-24 — Pregled evidentiranog izvršenog rada

**Opis:**  
Kao dispečer, želim pregledati evidentirani izvršeni rad, kako bih imao uvid u ono što je serviser uradio prije zatvaranja intervencije.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava dispečeru da pregleda dokaz o obavljenom radu prije donošenja odluke o zatvaranju intervencije, čime se povećava kontrola procesa i pouzdanost završetka zadatka.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da je serviser prethodno evidentirao izvršeni rad u sistemu.

**Otvorena pitanja:** Otvoreno pitanje je koji skup informacija dispečer mora minimalno vidjeti prije zatvaranja intervencije.

**Veze sa drugim storyjima:**  
Zavisi od storyja za evidentiranje izvršenog rada i povezan je sa storyjem za potvrdu i zatvaranje intervencije.

**Acceptance Criteria:**  

---

## US-25 — Potvrda i zatvaranje intervencije

**Opis:**  
Kao dispečer, želim potvrditi i zatvoriti završenu intervenciju, kako bi proces bio formalno okončan u sistemu.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se intervencija zvanično završi tek nakon pregleda izvršenog rada, čime se osigurava kontrolisan i pouzdan završetak procesa.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da je serviser prethodno ažurirao status i evidentirao izvršeni rad.

**Otvorena pitanja:** Otvoreno pitanje je da li zatvaranje automatski mijenja status u završeno ili postoji poseban završni status zatvoreno.


**Veze sa drugim storyjima:**  
Zavisi od storyja za ažuriranje statusa intervencije od strane servisera i storyja za pregled evidentiranog izvršenog rada.

**Acceptance Criteria:**  

---

## US-26 — Izmjena vlastitog zahtjeva

**Opis:**   
Kao korisnik usluge, želim izmijeniti svoj zahtjev dok još nije preuzet u obradu, kako bih mogao ispraviti pogrešno unesene ili nepotpune podatke.  

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava korisniku da ispravi greške u prijavi bez potrebe da pravi novi zahtjev, čime se povećava tačnost podataka i smanjuje broj pogrešno evidentiranih intervencija.  

**Prioritet:**  
*Visok*  

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da je izmjena dozvoljena samo dok zahtjev nije dodijeljen ili dok rad na njemu nije započeo.

**Otvorena pitanja:** Otvoreno pitanje je koje podatke korisnik smije mijenjati.

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyjem za pregled vlastitog zahtjeva.  

**Acceptance Criteria:**  

---

## US-27 — Otkazivanje vlastitog zahtjeva

**Opis:**  
Kao korisnik usluge, želim otkazati svoj zahtjev dok još nije u aktivnoj obradi, kako bih mogao povući greškom prijavljen ili više nepotreban zahtjev.  

**Poslovna vrijednost:**  
Ovaj story je važan jer sprečava da pogrešno prijavljeni ili više nepotrebni zahtjevi ostanu aktivni u sistemu, čime se smanjuje operativni šum i olakšava rad dispečera i servisera.  

**Prioritet:**  
*Visok*  

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da je otkazivanje dozvoljeno samo dok zahtjev nije dodijeljen izvršiocu ili dok rad nije počeo.

**Otvorena pitanja:** Otvoreno pitanje je da li sistem treba čuvati razlog otkazivanja.

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyjem za pregled vlastitog zahtjeva.  

**Acceptance Criteria:**  

---

## US-28 — Promjena izvršioca intervencije

**Opis:**  
Kao dispečer, želim promijeniti izvršioca intervencije, kako bi zadatak mogao biti dodijeljen drugom serviseru kada prvobitno dodijeljeni izvršilac ne može preuzeti ili završiti rad.  

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da operativni tok ne "zapne" kada dodijeljeni serviser postane nedostupan ili ne može izvršiti zadatak, čime se povećava fleksibilnost i pouzdanost sistema.  

**Prioritet:**  
*Visok*  

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da intervencija već ima dodijeljenog izvršioca.

**Otvorena pitanja:** Otvoreno pitanje je da li se prilikom promjene izvršioca automatski evidentira prethodno zaduženje u historiji aktivnosti.

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije odgovornom serviseru i povezan je sa storyjima za pregled otvorenih intervencija, pregled detalja pojedinačne intervencije i pregled statusa intervencija.  

**Acceptance Criteria:**  

---

## US-29 — Vraćanje zadatka na ponovnu dodjelu  

**Opis:**  
Kao serviser, želim vratiti zadatak na ponovnu dodjelu, kako bi dispečer mogao organizovati dalje izvršenje kada zadatak nije moguće završiti u postojećim okolnostima.  

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se zadatak ne zaglavi kod servisera koji ga ne može završiti, nego da se vrati u operativni tok i ponovo organizuje na ispravan način.  

**Prioritet:**  
*Visok*  

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da je serviser već preuzeo ili započeo obradu zadatka.

**Otvorena pitanja:** Otvoreno pitanje je da li je unos napomene ili razloga vraćanja obavezan.

**Veze sa drugim storyjima:**  
Zavisi od storyja za prihvatanje dodijeljenog zadatka i povezan je sa storyjima za promjenu izvršioca, pregled dodijeljenih intervencija i ažuriranje statusa intervencije od strane servisera.  

**Acceptance Criteria:**  

---

## US-30 — Razmjena napomena na intervenciji  

**Opis:**  
Kao dispečer ili serviser, želim dodati kratku napomenu na konkretnu intervenciju, kako bi sve važne operativne informacije bile dostupne na jednom mjestu svim učesnicima u procesu.  

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava brzu i direktnu komunikaciju između ureda i terena bez potrebe za vanjskim kanalima komunikacije, osiguravajući da ključni detalji (npr. specifične upute za pristup lokaciji) ostanu trajno vezani uz zahtjev.  

**Prioritet:**  
*Srednji*  

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da korisnik ima pravo pristupa detaljima konkretne intervencije.

**Otvorena pitanja:** Otvoreno pitanje je da li su napomene vidljive klijentu (korisniku usluge) ili služe isključivo za internu komunikaciju.

**Veze sa drugim storyjima:**  
Povezano sa storyjima za pregled detalja pojedinačne intervencije, pregled detalja zadatka na terenu i vraćanje zadatka na ponovnu dodjelu.  

**Acceptance Criteria:**  

---

## US-31 — Pregled historije aktivnosti intervencije  

**Opis:** 
Kao dispečer, želim vidjeti listu svih prethodnih promjena i aktivnosti na zahtjevu, kako bih imao jasan uvid u hronologiju obrade od trenutka prijave do trenutnog statusa.  

**Poslovna vrijednost:**  
Ovaj story je važan jer osigurava transparentnost i omogućava praćenje toka rada (audit trail). Pomaže u rješavanju nesporazuma i pruža uvid u to ko je, kada i koju akciju poduzeo na konkretnom zahtjevu.  

**Prioritet:**  
*Srednji*  

**Pretpostavke i otvorena pitanja:**  

**Pretpostavka:**  Pretpostavlja se da sistem automatski bilježi ključne promjene (status, dodjela, prioritet).

**Otvorena pitanja:** Otvoreno pitanje je koliki nivo detalja historija treba sadržavati (npr. da li bilježi i stare vrijednosti polja prije izmjene).

**Veze sa drugim storyjima:**  
Zavisi od svih storyja koji mijenjaju stanje intervencije (prijava, dodjela, promjena statusa, planiranje, određivanje prioriteta).  

**Acceptance Criteria:**  

---

# Raspodjela zadataka po sprintovima i sprint ciljevi:

Ovaj plan je organizovan tako da se razvoj sistema odvija **postepeno, smisleno i zavisno od blokatora**, pri čemu se u ranijim sprintovima prioritet daje **happy path-u**, a u kasnijim sprintovima se uvode **alternativni putevi** i dodatne funkcionalnosti.

---

## **Sprint 6**

### **Sprint broj**
**6**

### **Sprint cilj**
**Postaviti tehničku osnovu sistema i osposobiti korisnički pristup aplikaciji.**

### **Ključne stavke koje tim želi završiti**
- postavljanje projekta i Supabase okruženja  
- definisanje korisnika, uloga i osnovnih permisija  
- registraciona forma za korisnika usluge  
- login forma i osnovna prijava korisnika  
- osnova forme za prijavu zahtjeva  
- definisanje modela zahtjeva i radnog naloga  

### **Rizici i zavisnosti**
- Sprint 6 predstavlja **tehnički temelj cijelog sistema** i od njegovog uspješnog završetka zavise svi naredni sprintovi.  
- Ako povezivanje sa **Supabase** platformom ne bude stabilno postavljeno na početku, kasnije funkcionalnosti vezane za autentifikaciju, spremanje podataka i prikaz zahtjeva mogu biti usporene ili potpuno blokirane.  
- Definisanje korisnika, uloga i permisija mora biti dovoljno jasno i jednostavno, jer od toga zavisi **kontrola pristupa** u svim kasnijim modulima.  
- Registracija i prijava korisnika moraju ostati u **osnovnoj i stabilnoj verziji**, bez širenja na dodatne funkcionalnosti koje nisu neophodne u ovoj fazi.  
- Forma za prijavu zahtjeva u ovom sprintu treba biti pripremljena kao **osnova za kasnije uvezivanje**, ali se ne treba opterećivati potpunim završetkom korisničkog toka.  
- Bez tehničke osnove, korisnika i autentifikacije nije moguće uvezati korisnički tok u narednom sprintu.  

---

## **Sprint 7**

### **Sprint broj**
**7**

### **Sprint cilj**
**Omogućiti korisniku da se prijavi, pošalje zahtjev i vidi da je zahtjev evidentiran u sistemu.**

### **Ključne stavke koje tim želi završiti**
- povezivanje registracije i prijave sa bazom  
- spremanje zahtjeva u bazu  
- dodjeljivanje početnog statusa zahtjevu  
- pregled vlastitog zahtjeva za korisnika  
- prikaz zahtjeva u dispečerovoj listi zahtjeva koji čekaju obradu  

### **Rizici i zavisnosti**
- Sprint 7 direktno zavisi od **tehničke osnove, korisničkih uloga, prijave korisnika i pripremljene forme zahtjeva** iz Sprinta 6.  
- Ako autentifikacija i povezivanje korisničkog naloga sa bazom nisu ispravno postavljeni, korisnik neće moći pouzdano slati i pregledati vlastite zahtjeve.  
- Spremanje zahtjeva u bazu i dodjeljivanje početnog statusa moraju biti **konzistentni**, jer od tih podataka kasnije zavise dispečerski pregled, prioriteti i dodjela izvršiocu.  
- Prikaz zahtjeva korisniku i dispečeru mora biti zasnovan na **istom izvoru podataka**, kako bi se izbjegla nedosljednost između korisničkog i internog pogleda na sistem.  
- U ovoj fazi ne treba previše širiti logiku statusa, već je zadržati na **osnovnom nivou** potrebnom za evidentiranje i pregled zahtjeva.  
- Ovaj sprint zatvara **prvi stvarni korisnički tok** i priprema sistem za dispečersku obradu u Sprintu 8.  

---

## **Sprint 8**

### **Sprint broj**
**8**

### **Sprint cilj**
**Omogućiti dispečeru da pregleda i obradi zahtjev te odredi njegov prioritet.**

### **Ključne stavke koje tim želi završiti**
- pregled otvorenih zahtjeva / intervencija  
- pregled detalja pojedinačne intervencije  
- pregled statusa intervencija od strane dispečera  
- određivanje prioriteta intervencije  
- izmjena vlastitog zahtjeva  
- otkazivanje vlastitog zahtjeva  

### **Rizici i zavisnosti**
- Sprint 8 zavisi od toga da su zahtjevi iz Sprinta 7 već **ispravno evidentirani u bazi** i prikazani korisniku i dispečeru.  
- Pregled otvorenih zahtjeva i detalja intervencije predstavlja osnovu za svu dalju dispečersku obradu, pa njihov prikaz mora biti **jasan, stabilan i usklađen sa stanjem u bazi**.  
- Određivanje prioriteta može postati rizično ako se pokuša napraviti previše složeno, pa ga treba zadržati na **jednostavnom i pouzdanom modelu**, uz mogućnost kasnijeg proširenja.  
- Izmjena i otkazivanje zahtjeva moraju biti **vremenski i statusno ograničeni**, kako korisnik ne bi mogao mijenjati ili povlačiti zahtjev nakon što je već prešao u internu obradu ili dodjelu.  
- Ovaj sprint treba zatvoriti **korisničke alternativne tokove** prije nego što zahtjev pređe u fazu dodjele serviseru.  
- Završetkom ovog sprinta sistem mora biti spreman da dispečer iz zahtjeva pređe na **operativnu dodjelu zadatka** u narednom sprintu.  

---

## **Sprint 9**

### **Sprint broj**
**9**

### **Sprint cilj**
**Omogućiti dodjelu zadatka serviseru i serviserski prijem zadatka.**

### **Ključne stavke koje tim želi završiti**
- dodjela intervencije odgovornom serviseru  
- dodjela intervencije timu servisera  
- planiranje intervencije  
- pregled dodijeljenih intervencija za servisera  
- pregled detalja zadatka na terenu  
- prihvatanje dodijeljenog zadatka  
- odbijanje dodijeljenog zadatka  
- promjena izvršioca intervencije  
- vraćanje zadatka na ponovnu dodjelu  

### **Rizici i zavisnosti**
- Sprint 9 zavisi od toga da dispečer u Sprintu 8 već može **pregledati, razumjeti i pripremiti zahtjev za izvršenje**.  
- Dodjela serviseru predstavlja ključni prelaz iz dispečerskog dijela sistema u serviserski tok rada, pa mora biti **jednostavna, pregledna i pouzdana**.  
- Dodjela timu servisera i planiranje intervencije mogu lako preopteretiti sprint ako se pokušaju implementirati previše detaljno, pa ih treba ograničiti na **minimalnu funkcionalnu verziju**.  
- Prihvatanje, odbijanje i vraćanje zadatka moraju biti dio jednog **jednostavnog i logičnog toka**, kako bi serviser mogao jasno reagovati na dodijeljeni zadatak bez nepotrebne složenosti.  
- Promjena izvršioca zavisi od već funkcionalne osnovne dodjele i mora se oslanjati na **jednostavan model reasignacije**, bez komplikovanih dodatnih pravila.  
- Ovaj sprint treba zatvoriti fazu prijema zadatka i sve glavne alternativne tokove vezane za samu dodjelu, kako bi Sprint 10 mogao biti fokusiran isključivo na **izvršenje rada i završetak intervencije**.  

---

## **Sprint 10**

### **Sprint broj**
**10**

### **Sprint cilj**
**Omogućiti izvršenje intervencije, evidenciju rada i zatvaranje kompletnog toka.**

### **Ključne stavke koje tim želi završiti**
- ažuriranje statusa intervencije od strane servisera  
- evidentiranje izvršenog rada  
- pregled evidentiranog izvršenog rada  
- potvrda i zatvaranje intervencije  
- razmjena napomena na intervenciji  
- pregled historije aktivnosti intervencije  
- pregled postojećih korisničkih naloga  
- promjena korisničke uloge  
- deaktivacija korisničkog naloga  

### **Rizici i zavisnosti**
- Sprint 10 zavisi od toga da su tok dodjele i serviserski prijem zadatka iz Sprinta 9 već **funkcionalni i stabilni**.  
- Ažuriranje statusa mora ostati **jasno definisano i ograničeno na jednostavan operativni tok**, kako bi sistem pouzdano pratio prelaz iz rada na terenu u završetak intervencije.  
- Evidentiranje izvršenog rada i zatvaranje intervencije čine završni dio glavnog procesa, pa njihova povezanost mora biti **posebno pažljivo implementirana i testirana**.  
- Napomene i historija aktivnosti treba da budu **podrška glavnom toku**, a ne da usporavaju njegov završetak, pa ih treba realizovati u jednostavnoj i preglednoj formi.  
- Administratorske funkcionalnosti pregleda korisnika, promjene uloge i deaktivacije naloga treba implementirati u **osnovnoj verziji**, bez nepotrebnog proširivanja logike.  
- Završetkom Sprinta 10 treba biti pokriven **kompletan happy path i svi glavni alternativni putevi**, tako da Sprint 11 ostane rezervisan samo za ispravke, testiranje, tehnički dug i završnu pripremu.  

---
