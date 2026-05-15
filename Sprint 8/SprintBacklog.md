# Sprint Goal

### Sprint broj 8

### Sprint cilj
Omogućiti nastavak operativnog toka nakon dispečerske obrade zahtjeva kroz dodjelu intervencije serviseru, razvoj osnovnog serviserskog modula, praćenje statusa rada na terenu, evidentiranje izvršenog rada i pripremu intervencije za zatvaranje.

### Ključne stavke koje tim želi završiti
- završiti povezivanje dispečerskog toka sa serviserskim modulom
- omogućiti dodjelu intervencije jednom serviseru ili timu servisera
- omogućiti serviseru pregled dodijeljenih intervencija
- omogućiti serviseru pregled detalja zadatka na terenu
- omogućiti prihvatanje i odbijanje dodijeljenog zadatka
- omogućiti ažuriranje statusa intervencije od strane servisera
- omogućiti evidentiranje izvršenog rada
- omogućiti dispečeru pregled evidentiranog rada
- omogućiti potvrdu i zatvaranje intervencije
- omogućiti razmjenu napomena između dispečera i servisera
- omogućiti pregled historije aktivnosti intervencije
- testirati kompletan tok: dispečer → serviser → izvršenje → evidencija → zatvaranje

### Rizici i zavisnosti

Postoji rizik:
- da statusi intervencije ne budu konzistentni između dispečerskog i serviserskog prikaza
- da se intervencija dodijeli serviseru koji nije dostupan ili nema odgovarajuću ulogu
- da odbijeni zadatak ne bude pravilno vraćen u dispečerski tok
- da serviser ažurira status u pogrešnom redoslijedu
- da se intervencija zatvori bez evidentiranog izvršenog rada
- da napomene i historija aktivnosti ne budu dovoljno jasno povezane sa intervencijom
- da se zbog velikog obima serviserskog modula dio funkcionalnosti mora pojednostaviti u osnovnu verziju

Zavisnosti:
- završena autentifikacija i kontrola pristupa po ulozi
- postojeći dispečerski pregled aktivnih intervencija
- postojeći detaljni prikaz intervencije za dispečera
- prethodno definisani statusi i faze intervencije
- postojeći model korisnika, servisera i dispečera
- postojeći model zahtjeva/intervencije u bazi
- ispravno definisana pravila dodjele intervencije
- ispravno definisana pravila prelaza statusa
- dostupni testni podaci za dispečera, servisera i intervencije

# Sprint Backlog

| ID | User Story | Prioritet | Procjena težine | Zadaci | Acceptance Criteria |
|-----|-------------|-----------|-----------|--------|----------------------|
| US-09 | Kao dispečer, želim dodijeliti intervenciju odgovornom serviseru kako bi bilo jasno ko preuzima izvršenje zadatka. | Visok | 5 pts | Kreirati logiku dodjele servisera; povezati intervenciju sa serviserom; prikaz dodjele u dispečerskom modulu; validacija statusa prije dodjele | Dispečer može uspješno dodijeliti intervenciju serviseru. Sistem evidentira odgovornog izvršioca i ažurira status intervencije. |
| US-10 | Kao dispečer, želim dodijeliti intervenciju timu servisera kako bi složeniji zadaci mogli biti organizovani timski. | Srednji | 3 pts | Omogućiti višestruku dodjelu servisera; prikaz članova tima; validacija duplih dodjela | Dispečer može dodijeliti više servisera istoj intervenciji. Sistem prikazuje kompletan tim izvršilaca. |
| US-11 | Kao dispečer, želim planirati intervenciju unaprijed kako bih organizovao termin i resurse. | Visok | 5 pts | Kreirati unos termina; validacija datuma; povezivanje termina sa intervencijom; prikaz u detaljima intervencije | Dispečer može definisati termin intervencije. Termin se evidentira i prikazuje u sistemu. |
| US-15 | Kao serviser, želim pregledati dodijeljene intervencije kako bih znao koje zadatke trebam izvršiti. | Visok | 5 pts | Kreirati serviserski dashboard; prikaz liste zadataka; filtriranje aktivnih zadataka | Serviser vidi samo svoje dodijeljene intervencije sa osnovnim informacijama i statusima. |
| US-16 | Kao serviser, želim pregledati detalje zadatka na terenu kako bih imao sve potrebne informacije za izvršenje. | Visok | 5 pts | Kreirati detaljni prikaz intervencije; prikaz lokacije, termina, opisa i prioriteta | Serviser može otvoriti detalje zadatka i vidjeti sve relevantne informacije za izvršenje intervencije. |
| US-22 | Kao serviser, želim prihvatiti dodijeljeni zadatak kako bih potvrdio preuzimanje odgovornosti. | Visok | 3 pts | Dodati opciju prihvatanja zadatka; ažurirati status; evidentirati vrijeme prihvatanja | Serviser može prihvatiti zadatak, a sistem mijenja status intervencije u odgovarajuće stanje. |
| US-23 | Kao serviser, želim odbiti dodijeljeni zadatak kako bi dispečer mogao reagovati i izvršiti novu dodjelu. | Srednji | 3 pts | Dodati opciju odbijanja; unos razloga odbijanja; vraćanje intervencije dispečeru | Serviser može odbiti zadatak uz obrazloženje. Sistem vraća intervenciju u operativni tok dispečera. |
| US-14 | Kao serviser, želim ažurirati status intervencije kako bi sistem prikazivao trenutno stanje rada na terenu. | Visok | 5 pts | Implementirati promjenu statusa; validacija dozvoljenih prelaza; sinhronizacija sa dispečerskim pregledom | Promjena statusa od strane servisera automatski se prikazuje i dispečeru. Nedozvoljeni prelazi statusa nisu mogući. |
| US-17 | Kao serviser, želim evidentirati izvršeni rad kako bi sistem sadržavao zapis o obavljenim aktivnostima. | Srednji | 5 pts | Kreirati formu za evidentiranje rada; unos opisa rada i napomena; spremanje evidencije | Serviser može evidentirati izvršeni rad i povezati ga sa intervencijom. |
| US-24 | Kao dispečer, želim pregledati evidentirani izvršeni rad kako bih imao uvid u ono što je serviser uradio. | Visok | 3 pts | Prikaz evidentiranog rada; povezivanje sa detaljima intervencije | Dispečer može pregledati evidentirani rad prije zatvaranja intervencije. |
| US-25 | Kao dispečer, želim potvrditi i zatvoriti intervenciju kako bi proces bio formalno završen. | Visok | 5 pts | Implementirati zatvaranje intervencije; validacija prethodnih koraka; zaključavanje daljih izmjena | Dispečer može zatvoriti samo završenu intervenciju sa evidentiranim radom. |
| US-30 | Kao dispečer ili serviser, želim razmjenjivati napomene na intervenciji kako bi sve važne informacije bile dostupne na jednom mjestu. | Srednji | 3 pts | Kreirati modul napomena; prikaz vremenske linije; povezivanje korisnika sa napomenama | Dispečer i serviser mogu dodavati i pregledati napomene vezane za intervenciju. |
| US-32 | Kao dispečer, želim pregledati historiju aktivnosti intervencije kako bih imao pregled svih promjena i aktivnosti. | Srednji | 4 pts | Evidentiranje promjena statusa; log aktivnosti; prikaz historije intervencije | Sistem prikazuje hronološku listu svih važnih aktivnosti nad intervencijom. |
