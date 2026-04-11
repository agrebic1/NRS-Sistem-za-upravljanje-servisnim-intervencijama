# Test strategy 

## Cilj testiranja

Cilj testiranja je provjeriti i osigurati da sistem za upravljanje servisnim intervencijama funkcioniše ispravno, pouzdano i u skladu sa definisanim zahtjevima, user storyjima i acceptance kriterijima. Testiranjem se ne provjerava samo da li su pojedine funkcionalnosti tehnički implementirane bez grešaka, već i da li su ispravno osmišljene i realizovane u skladu sa stvarnim potrebama korisnika i predviđenim tokom poslovnog procesa.

U tom smislu, testiranje obuhvata i **verifikaciju** i **validaciju** sistema. Verifikacijom se provjerava da li je sistem izgrađen ispravno u odnosu na specifikaciju i definisane zahtjeve, dok se validacijom provjerava da li razvijeno rješenje zaista odgovara svojoj namjeni i podržava aktivnosti svih relevantnih korisničkih uloga u sistemu.

Poseban fokus testiranja stavlja se na tačnost obrade i prikaza podataka, ispravnost prava pristupa prema korisničkim ulogama, povezanost i međusobnu usklađenost modula, pravilno odvijanje glavnog toka od prijave zahtjeva do zatvaranja intervencije, kao i na podršku najvažnijim alternativnim scenarijima koji se mogu pojaviti u stvarnom radu sistema.

## Nivoi testiranja

U okviru ovog projekta testiranje se organizuje kroz više nivoa kako bi se kvalitet sistema provjerio iz različitih perspektiva. Na taj način ne provjerava se samo da li pojedinačne funkcionalnosti rade tehnički ispravno, nego i da li moduli međusobno pravilno sarađuju, da li kompletan sistem podržava predviđeni tok rada te da li razvijeno rješenje odgovara stvarnim potrebama korisnika i definisanim zahtjevima.

Korištenjem više nivoa testiranja obuhvataju se i **verifikacija** i **validacija** sistema. Verifikacijom se provjerava da li je sistem implementiran ispravno u odnosu na specifikaciju i definisane zahtjeve, dok se validacijom provjerava da li razvijeno rješenje zaista odgovara svojoj namjeni i podržava stvarni poslovni proces servisnih intervencija.

Iako su nivoi testiranja konceptualno odvojeni, pojedini testni scenariji mogu se koristiti na više nivoa testiranja, pri čemu se njihova svrha razlikuje u zavisnosti od fokusa provjere.

### Unit testiranje

Unit testiranje koristi se za provjeru manjih, izolovanih dijelova sistema, odnosno pojedinačnih funkcija, pravila i logičkih cjelina. Na ovom nivou fokus nije na kompletnom toku rada, nego na provjeri da li pojedinačna pravila implementacije daju ispravan rezultat.

U okviru ovog projekta unit testiranje primarno obuhvata:
- validaciju unosa u formama
- logiku određivanja prioriteta
- pravila prelaza statusa
- osnovne provjere prava pristupa
- pomoćne funkcije za obradu i prikaz podataka

### Integraciono testiranje

Integraciono testiranje koristi se za provjeru međusobne saradnje povezanih modula i komponenti sistema. Njegov cilj je utvrditi da li moduli koji su razvijani odvojeno pravilno razmjenjuju podatke i zajedno podržavaju predviđeni proces rada.

U okviru ovog projekta integraciono testiranje obuhvata, između ostalog:
- povezivanje registracije i prijave korisnika sa bazom podataka
- prijavu zahtjeva i njegovo evidentiranje u sistemu
- prikaz zahtjeva korisniku i dispečeru
- dodjelu zadatka serviseru i prikaz zadatka na serviserskoj strani
- evidentiranje rada i pregled izvršenog rada prije zatvaranja intervencije

### Sistemsko testiranje

Sistemsko testiranje koristi se za provjeru kompletnog sistema kao jedne funkcionalne cjeline. Na ovom nivou testiraju se glavni i alternativni tokovi rada kroz aplikaciju kako bi se potvrdilo da svi moduli zajedno ispravno podržavaju poslovni proces.

U okviru ovog projekta sistemsko testiranje obuhvata:
- glavni tok od registracije korisnika i prijave zahtjeva do zatvaranja intervencije
- dispečersku obradu zahtjeva, određivanje prioriteta i dodjelu izvršioca
- serviserski tok rada, uključujući prihvatanje zadatka, ažuriranje statusa i evidentiranje rada
- alternativne scenarije, kao što su izmjena i otkazivanje zahtjeva, odbijanje zadatka, promjena izvršioca i vraćanje zadatka na ponovnu dodjelu

### Prihvatno testiranje

Prihvatno testiranje koristi se za provjeru da li razvijeni sistem ispunjava zahtjeve definisane user storyjima i acceptance kriterijima te da li odgovara stvarnim potrebama korisnika. Ovaj nivo testiranja posebno je važan jer potvrđuje da sistem nije samo tehnički ispravno implementiran, nego i funkcionalno prikladan za upotrebu u predviđenom kontekstu.

U okviru ovog projekta prihvatno testiranje obuhvata provjeru:
- da li korisnik usluge može uspješno prijaviti i pratiti zahtjev
- da li dispečer može pregledati, obraditi i dodijeliti intervenciju
- da li serviser može preuzeti zadatak, evidentirati rad i ažurirati tok izvršenja
- da li administrator može upravljati internim korisnicima i pravima pristupa
- da li sistem u cjelini podržava predviđeni poslovni proces i potrebe svih relevantnih korisničkih uloga

### Regresijsko testiranje

Regresijsko testiranje koristi se za provjeru da nove izmjene i funkcionalnosti nisu narušile ispravnost dijelova sistema koji su ranije implementirani. Ovo je posebno važno u agilnom načinu razvoja, gdje se sistem proširuje postepeno i gdje svaka nova izmjena može uticati na postojeće funkcionalnosti.

U okviru ovog projekta regresijsko testiranje provodi se nakon uvođenja novih funkcionalnosti i obuhvata provjeru ključnih ranije implementiranih tokova, posebno:
- autentifikacije i pristupa sistemu
- prijave i pregleda zahtjeva
- dispečerskog pregleda i dodjele
- serviserskog rada na zadatku
- zatvaranja intervencije

### Testiranje korisničkog interfejsa

Testiranje korisničkog interfejsa koristi se za provjeru ispravnosti i preglednosti korisničkog interfejsa. Na ovom nivou provjerava se da li forme, prikazi, poruke i osnovna navigacija funkcionišu ispravno i da li su razumljivi korisnicima različitih uloga.

U okviru ovog projekta testiranje korisničkog interfejsa obuhvata:
- formu za registraciju i prijavu korisnika
- formu za prijavu zahtjeva
- pregled zahtjeva i intervencija
- prikaz poruka o grešci i validacijskih upozorenja
- pregled statusa, detalja i napomena
- osnovnu preglednost i upotrebljivost interfejsa za korisnike usluge, dispečera, servisera i administratora

### Tabelarni pregled nivoa testiranja

| Nivo testiranja | Svrha | Šta se testira u projektu |
|-----------------|-------|---------------------------|
| **Unit testiranje** | Provjera pojedinačnih funkcija, pravila i logičkih cjelina | validacija unosa, logika prioriteta, pravila prelaza statusa, osnovne provjere prava pristupa, pomoćne funkcije |
| **Integraciono testiranje** | Provjera saradnje povezanih modula i razmjene podataka | registracija i prijava sa bazom, prijava zahtjeva i evidentiranje, prikaz zahtjeva korisniku i dispečeru, dodjela zadatka serviseru, evidentiranje i pregled rada |
| **Sistemsko testiranje** | Provjera kompletnog sistema kao jedne funkcionalne cjeline | glavni tok od prijave zahtjeva do zatvaranja intervencije, dispečerska obrada, serviserski tok rada, alternativni scenariji |
| **Prihvatno testiranje** | Provjera usklađenosti sistema sa zahtjevima, user storyjima i potrebama korisnika | podrška radu korisnika usluge, dispečera, servisera i administratora, kao i usklađenost sa predviđenim poslovnim procesom |
| **Regresijsko testiranje** | Provjera da nove izmjene nisu pokvarile ranije implementirane funkcionalnosti | autentifikacija, prijava i pregled zahtjeva, dodjela, serviserski tok rada, zatvaranje intervencije |
| **Testiranje korisničkog interfejsa** | Provjera ispravnosti i preglednosti korisničkog interfejsa | forme, prikazi, poruke o grešci, statusi, detalji, napomene i osnovna upotrebljivost interfejsa |

Kombinovanjem navedenih nivoa testiranja nastoji se osigurati da sistem bude tehnički ispravan, međusobno usklađen i funkcionalno prikladan za stvarnu upotrebu u okviru predviđenog poslovnog procesa.
  
## Šta se testira na kojem nivou

Nakon definisanja nivoa testiranja, potrebno je jasno odrediti koje funkcionalnosti i aspekti sistema se provjeravaju na kojem nivou. Time se osigurava da testiranje bude direktno povezano sa konkretnim dijelovima sistema i stvarnim poslovnim tokom servisnih intervencija, a ne svedeno samo na opšti opis vrsta testova.

U okviru ovog projekta pojedine funkcionalne cjeline testiraju se na više nivoa, ali sa različitim fokusom. Ista funkcionalnost može biti predmet unit testiranja radi provjere pojedinačne logike, integracionog testiranja radi provjere povezanosti sa drugim modulima, sistemskog testiranja radi provjere mjesta te funkcionalnosti u cjelokupnom toku rada, te prihvatnog testiranja radi provjere da li rješenje zaista odgovara potrebama korisnika i definisanom poslovnom procesu.

### 1. Autentifikacija i pristup sistemu

Funkcionalnosti registracije, prijave i odjave korisnika testiraju se kroz unit, integraciono, sistemsko, prihvatno, regresijsko i testiranje korisničkog interfejsa.

Na **unit nivou** provjerava se validacija unosa, obavezna polja, format email adrese, osnovna pravila lozinke i logika autentifikacije.  
Na **integracionom nivou** provjerava se povezivanje registracije i prijave sa bazom podataka, kreiranje korisničkog naloga, upravljanje sesijom i pravilno prepoznavanje korisničke uloge nakon prijave.  
Na **sistemskom nivou** provjerava se da li korisnik može pristupiti sistemu i koristiti funkcionalnosti u skladu sa svojom ulogom.  
Na **prihvatnom nivou** provjerava se da li autentifikacija zaista podržava očekivani način pristupa sistemu za klijente i interne korisnike.  
Na **regresijskom nivou** provjerava se da kasnije izmjene ne naruše registraciju, prijavu i odjavu.  
Kroz **testiranje korisničkog interfejsa** provjeravaju se forme, validacijske poruke, poruke greške i preglednost procesa prijave i registracije.

### 2. Upravljanje korisnicima, ulogama i pravima pristupa

Funkcionalnosti vezane za kreiranje internih korisnika, pregled naloga, promjenu uloga, deaktivaciju naloga i kontrolu pristupa prema korisničkoj ulozi testiraju se kroz unit, integraciono, sistemsko, prihvatno i regresijsko testiranje.

Na **unit nivou** provjeravaju se pravila dodjele uloga, ograničenja pristupa i osnovna logika promjene statusa naloga.  
Na **integracionom nivou** provjerava se da li promjena korisničke uloge ili statusa naloga ispravno utiče na funkcionalnosti koje korisnik vidi i koristi.  
Na **sistemskom nivou** provjerava se da li različiti korisnici zaista imaju pristup samo onim dijelovima sistema koji odgovaraju njihovoj ulozi.  
Na **prihvatnom nivou** provjerava se da li sistem podržava stvarnu poslovnu podjelu odgovornosti između administratora, dispečera, servisera i klijenata.  
Na **regresijskom nivou** provjerava se da nove izmjene u korisničkim nalozima i ulogama nisu narušile postojeću kontrolu pristupa.

### 3. Prijava i pregled zahtjeva korisnika usluge

Funkcionalnosti prijave zahtjeva i pregleda vlastitog zahtjeva testiraju se kroz unit, integraciono, sistemsko, prihvatno, regresijsko i testiranje korisničkog interfejsa.

Na **unit nivou** provjeravaju se validacija unosa, obavezna polja i osnovna pravila za evidentiranje zahtjeva.  
Na **integracionom nivou** provjerava se da li se zahtjev pravilno sprema u bazu, da li dobija početni status i da li je povezan sa korisnikom koji ga je podnio.  
Na **sistemskom nivou** provjerava se da li korisnik može prijaviti zahtjev i zatim pregledati njegove osnovne informacije i status.  
Na **prihvatnom nivou** provjerava se da li sistem zaista podržava korisničku potrebu da prijavi problem i prati njegovu obradu.  
Na **regresijskom nivou** provjerava se da uvođenje novih funkcionalnosti ne naruši prijavu i pregled zahtjeva.  
Kroz **testiranje korisničkog interfejsa** provjeravaju se forma za prijavu zahtjeva, poruke o grešci, pregled zahtjeva i prikaz statusa.

### 4. Izmjena i otkazivanje zahtjeva

Funkcionalnosti izmjene i otkazivanja zahtjeva testiraju se kroz unit, integraciono, sistemsko, prihvatno, regresijsko i testiranje korisničkog interfejsa.

Na **unit nivou** provjeravaju se pravila koja određuju kada je izmjena ili otkazivanje dozvoljeno.  
Na **integracionom nivou** provjerava se da li promjena podataka ili statusa pravilno utiče na dalju obradu zahtjeva.  
Na **sistemskom nivou** provjerava se da li korisnik može izvršiti izmjenu ili otkazivanje u odgovarajućoj fazi procesa.  
Na **prihvatnom nivou** provjerava se da li sistem podržava realne situacije ispravke pogrešno unesenih podataka ili povlačenja nepotrebnog zahtjeva.  
Na **regresijskom nivou** provjerava se da nova pravila za izmjenu i otkazivanje ne naruše osnovni tok prijave i obrade zahtjeva.  
Kroz **testiranje korisničkog interfejsa** provjerava se jasnoća opcija za izmjenu i otkazivanje, kao i poruka koje sistem prikazuje.

### 5. Dispečerski pregled i obrada intervencija

Funkcionalnosti pregleda otvorenih intervencija, pregleda detalja intervencije i pregleda statusa od strane dispečera testiraju se kroz integraciono, sistemsko, prihvatno, regresijsko i testiranje korisničkog interfejsa, a djelimično i kroz unit testiranje tamo gdje postoji pomoćna logika filtriranja i prikaza.

Na **unit nivou** mogu se provjeravati pomoćna pravila filtriranja, sortiranja i prikaza podataka.  
Na **integracionom nivou** provjerava se da li dispečer vidi ispravne i ažurne podatke koji nastaju iz korisničkih prijava i serviserskih aktivnosti.  
Na **sistemskom nivou** provjerava se da li dispečer može nesmetano pratiti i obrađivati intervencije kao dio ukupnog procesa.  
Na **prihvatnom nivou** provjerava se da li dispečerski prikaz zaista podržava organizaciju rada i donošenje operativnih odluka.  
Na **regresijskom nivou** provjerava se da uvođenje novih prikaza, statusa ili dodatnih podataka ne naruši osnovni pregled intervencija.  
Kroz **testiranje korisničkog interfejsa** provjerava se preglednost liste intervencija, detaljnog prikaza i prikaza statusa.

### 6. Određivanje prioriteta intervencije

Funkcionalnosti vezane za određivanje prioriteta testiraju se kroz unit, integraciono, sistemsko, prihvatno i regresijsko testiranje.

Na **unit nivou** provjerava se logika određivanja prioriteta, uključujući pravila, bodovanje i eventualna ograničenja.  
Na **integracionom nivou** provjerava se da li je prioritet pravilno povezan sa intervencijom i vidljiv u relevantnim prikazima.  
Na **sistemskom nivou** provjerava se da li određivanje prioriteta pravilno utiče na dalju obradu i organizaciju rada.  
Na **prihvatnom nivou** provjerava se da li model određivanja prioriteta zaista odgovara potrebama sistema i realnoj hitnosti intervencija.  
Na **regresijskom nivou** provjerava se da uvođenje ili izmjena logike prioriteta ne naruši druge dijelove obrade intervencija.

### 7. Dodjela i organizacija izvršenja intervencije

Funkcionalnosti dodjele glavnog izvršioca, evidentiranja pomoćnih izvršilaca, promjene izvršioca i vraćanja zadatka na ponovnu dodjelu testiraju se kroz integraciono, sistemsko, prihvatno, regresijsko i djelimično UI testiranje.

Na **integracionom nivou** provjerava se da li intervencija nakon dodjele postaje dostupna odgovarajućem serviseru i eventualnim pomoćnim izvršiocima.  
Na **sistemskom nivou** provjerava se da li tok od dispečerske obrade do serviserskog prijema zadatka funkcioniše bez prekida.  
Na **prihvatnom nivou** provjerava se da li sistem podržava realne organizacijske scenarije, uključujući promjenu izvršioca i vraćanje zadatka u operativni tok.  
Na **regresijskom nivou** provjerava se da nove izmjene u logici dodjele ne naruše postojeće funkcionalnosti vezane za pregled, prihvatanje i status zadatka.  
Kroz **testiranje korisničkog interfejsa** provjerava se jasnoća prikaza dodjele, odabira izvršioca i prikaza pomoćnih izvršilaca.

### 8. Planiranje intervencije

Funkcionalnosti planiranja intervencije testiraju se kroz unit, integraciono, sistemsko, prihvatno, regresijsko i UI testiranje.

Na **unit nivou** provjeravaju se osnovna pravila unosa termina i eventualna ograničenja planiranja.  
Na **integracionom nivou** provjerava se da li planirani termin pravilno postaje dio podataka o intervenciji i da li je vidljiv relevantnim korisnicima.  
Na **sistemskom nivou** provjerava se da li planiranje pravilno podržava organizaciju izvršenja u ukupnom toku rada.  
Na **prihvatnom nivou** provjerava se da li sistem omogućava dovoljno jasan i praktičan način planiranja termina.  
Na **regresijskom nivou** provjerava se da izmjene u planiranju ne naruše dodjelu, pregled intervencija ili zatvaranje procesa.  
Kroz **testiranje korisničkog interfejsa** provjerava se unos i prikaz termina, poruke greške i opšta preglednost planiranja.

### 9. Pregled i preuzimanje zadataka od strane servisera

Funkcionalnosti pregleda dodijeljenih intervencija, pregleda detalja zadatka, prihvatanja i odbijanja zadatka testiraju se kroz integraciono, sistemsko, prihvatno, regresijsko i testiranje korisničkog interfejsa.

Na **integracionom nivou** provjerava se da li se dodijeljeni zadaci pravilno prikazuju serviseru i da li je veza sa dodjelom ispravna.  
Na **sistemskom nivou** provjerava se da li serviser može preuzeti i pravilno razumjeti svoj zadatak u okviru ukupnog toka rada.  
Na **prihvatnom nivou** provjerava se da li serviserski prikaz i logika preuzimanja zadatka odgovaraju stvarnim potrebama rada na terenu.  
Na **regresijskom nivou** provjerava se da nove izmjene ne naruše pregled zadataka i logiku prihvatanja ili odbijanja.  
Kroz **testiranje korisničkog interfejsa** provjerava se preglednost liste zadataka, detalja intervencije i opcija za akciju nad zadatkom.

### 10. Ažuriranje toka rada na terenu

Funkcionalnosti ažuriranja statusa i vraćanja zadatka u operativni tok testiraju se kroz unit, integraciono, sistemsko, prihvatno, regresijsko i UI testiranje.

Na **unit nivou** provjeravaju se pravila promjene statusa i dozvoljeni prelazi između statusa.  
Na **integracionom nivou** provjerava se da li se promjene koje serviser izvrši pravilno odražavaju u dispečerskom pregledu i drugim povezanim prikazima.  
Na **sistemskom nivou** provjerava se da li statusni tok podržava stvarni tok rada na terenu.  
Na **prihvatnom nivou** provjerava se da li sistem omogućava realno praćenje napretka intervencije i povratak zadatka u obradu kada je to potrebno.  
Na **regresijskom nivou** provjerava se da promjene u statusnoj logici ne poremete ranije implementirane procese.  
Kroz **testiranje korisničkog interfejsa** provjerava se jasnoća opcija za promjenu statusa i prikaz trenutnog stanja intervencije. 

### 11. Evidentiranje i pregled izvršenog rada

Funkcionalnosti evidentiranja izvršenog rada i pregleda evidentiranog rada testiraju se kroz unit, integraciono, sistemsko, prihvatno, regresijsko i UI testiranje.

Na **unit nivou** provjerava se validacija unosa podataka o radu i osnovna pravila evidencije.  
Na **integracionom nivou** provjerava se da li se podaci o radu pravilno spremaju i prikazuju odgovarajućim korisnicima.  
Na **sistemskom nivou** provjerava se da li evidencija rada ispravno podržava završni dio procesa.  
Na **prihvatnom nivou** provjerava se da li sistem omogućava dovoljno jasan i upotrebljiv zapis o izvršenom radu.  
Na **regresijskom nivou** provjerava se da nova evidencija ne poremeti prikaz statusa, zatvaranje intervencije ili pregled od strane dispečera.  
Kroz **testiranje korisničkog interfejsa** provjerava se preglednost forme za evidenciju rada i prikaza unesenih podataka.

### 12. Zatvaranje intervencije

Funkcionalnosti potvrde i zatvaranja intervencije testiraju se kroz integraciono, sistemsko, prihvatno, regresijsko i UI testiranje.

Na **integracionom nivou** provjerava se da li dispečer može vidjeti sve prethodno unesene podatke potrebne za zatvaranje intervencije.  
Na **sistemskom nivou** provjerava se da li kompletan tok završava ispravno, odnosno da li se intervencija može zatvoriti tek nakon ispunjavanja potrebnih uslova.  
Na **prihvatnom nivou** provjerava se da li završni dio procesa odgovara potrebi da se intervencija formalno i kontrolisano okonča.  
Na **regresijskom nivou** provjerava se da izmjene u zatvaranju ne naruše prethodne korake procesa.  
Kroz **testiranje korisničkog interfejsa** provjerava se jasnoća prikaza završnog statusa i akcije zatvaranja.

### 13. Komunikacija na intervenciji

Funkcionalnosti razmjene napomena testiraju se kroz integraciono, sistemsko, prihvatno, regresijsko i UI testiranje.

Na **integracionom nivou** provjerava se da li se napomene pravilno povezuju sa odgovarajućom intervencijom i autorom.  
Na **sistemskom nivou** provjerava se da li napomene podržavaju kontinuitet rada i komunikaciju između učesnika procesa.  
Na **prihvatnom nivou** provjerava se da li sistem omogućava smislen i praktičan način razmjene operativnih informacija.  
Na **regresijskom nivou** provjerava se da uvođenje napomena ne naruši druge prikaze intervencije.  
Kroz **testiranje korisničkog interfejsa** provjerava se preglednost unosa i prikaza napomena.

### 14. Praćenje historije aktivnosti

Funkcionalnosti pregleda historije aktivnosti testiraju se kroz integraciono, sistemsko, prihvatno, regresijsko i UI testiranje.

Na **integracionom nivou** provjerava se da li se promjene i aktivnosti pravilno bilježe i povezuju sa odgovarajućom intervencijom.  
Na **sistemskom nivou** provjerava se da li historija aktivnosti podržava transparentnost i sljedivost kompletnog procesa.  
Na **prihvatnom nivou** provjerava se da li korisnici koji imaju pravo pristupa mogu dobiti smislen uvid u tok obrade intervencije.  
Na **regresijskom nivou** provjerava se da dodavanje novih aktivnosti i promjena ne naruši postojeći audit trag.  
Kroz **testiranje korisničkog interfejsa** provjerava se preglednost i razumljivost hronološkog prikaza aktivnosti.

### Tabelarni pregled šta se testira na kojem nivou

| Funkcionalnost / cjelina | Unit | Integraciono | Sistemsko | Prihvatno | Regresijsko | Testiranje korisničkog interfejsa |
|--------------------------|------|--------------|-----------|-----------|-------------|-----------------------------------|
| Autentifikacija i pristup sistemu | x | x | x | x | x | x |
| Upravljanje korisnicima, ulogama i pravima pristupa | x | x | x | x | x |  |
| Prijava i pregled zahtjeva korisnika usluge | x | x | x | x | x | x |
| Izmjena i otkazivanje zahtjeva | x | x | x | x | x | x |
| Dispečerski pregled i obrada intervencija | x | x | x | x | x | x |
| Određivanje prioriteta intervencije | x | x | x | x | x |  |
| Dodjela i organizacija izvršenja intervencije |  | x | x | x | x | x |
| Planiranje intervencije | x | x | x | x | x | x |
| Pregled i preuzimanje zadataka od strane servisera |  | x | x | x | x | x |
| Ažuriranje toka rada na terenu | x | x | x | x | x | x |
| Evidentiranje i pregled izvršenog rada | x | x | x | x | x | x |
| Zatvaranje intervencije |  | x | x | x | x | x |
| Komunikacija na intervenciji |  | x | x | x | x | x |
| Praćenje historije aktivnosti |  | x | x | x | x | x |

Prikazana raspodjela pokazuje da se funkcionalne cjeline sistema ne posmatraju samo iz jedne perspektive, nego se provjeravaju kroz više nivoa testiranja u skladu sa njihovom ulogom u sistemu. Na taj način nastoji se osigurati da sistem bude tehnički ispravan, međusobno usklađen i funkcionalno prikladan za stvarnu upotrebu.

Veza sa acceptance kriterijima

| User story ID | Acceptance Criteria ID | Test Case ID | Nivo testiranja | Status |
|---------------|------------------------|--------------|-----------------|--------|

## Veza sa acceptance kriterijima

Testiranje u okviru ovog projekta direktno se oslanja na acceptance kriterije definisane uz user storyje. Acceptance kriteriji predstavljaju konkretne uslove koje funkcionalnost mora ispuniti da bi se smatrala prihvatljivo implementiranom, te zbog toga služe kao osnova za planiranje i provođenje testiranja.

Veza između testiranja i acceptance kriterija važna je jer osigurava jasnu povezanost između zahtjeva, implementacije i provjere kvaliteta. Na taj način testiranje nije zasnovano samo na opštoj procjeni da li funkcionalnost „radi“, nego na jasno definisanim uslovima koji opisuju očekivano ponašanje sistema u različitim situacijama.

U okviru ovog projekta acceptance kriteriji se koriste za:
- definisanje testnih scenarija
- određivanje očekivanih rezultata testiranja
- provjeru da li je user story u potpunosti ispunjen
- povezivanje funkcionalnosti sa odgovarajućim nivoima testiranja

Pojedini acceptance kriteriji mogu se provjeravati na više nivoa testiranja, u zavisnosti od njihove prirode. Na primjer, kriteriji koji se odnose na validaciju unosa mogu biti predmet unit i UI testiranja, dok kriteriji koji opisuju tok rada između više korisničkih uloga češće pripadaju integracionom, sistemskom i prihvatnom testiranju.

### Tabelarni pregled veze sa acceptance kriterijima

| ID storyja | Acceptance kriterij | Nivo testiranja | Način provjere | Očekivani rezultat |
|------------|---------------------|-----------------|----------------|--------------------|
| **US-01** | Korisnik unese validne podatke i registracija bude uspješna | Unit, integraciono, sistemsko, UI | test validacije, provjera kreiranja naloga i prikaza forme | korisnički nalog je uspješno kreiran |

## Način evidentiranja rezultata testiranja

Rezultati testiranja u okviru ovog projekta evidentiraju se na sistematičan, pregledan i dosljedan način kako bi tim u svakom trenutku imao jasan uvid u to šta je testirano, kakav je bio ishod testiranja, koje su greške uočene i da li su one naknadno otklonjene. Evidentiranje rezultata testiranja važno je ne samo radi praćenja kvaliteta sistema, nego i radi kontrole napretka kroz sprintove, lakšeg uočavanja ponavljajućih problema i provjere da li su ranije identifikovani nedostaci zaista ispravljeni.

U okviru ovog projekta rezultati testiranja evidentiraju se za svaku važniju funkcionalnost i testni scenario. Za svaki izvršeni test bilježe se osnovni podaci o tome šta je testirano, kada je testiranje provedeno, ko je izvršio testiranje, koji je bio očekivani rezultat i kakav je bio stvarni ishod. Na taj način omogućava se jasan pregled nad uspješnim i neuspješnim testovima, kao i nad funkcionalnostima koje zahtijevaju dodatne dorade.

Prilikom evidentiranja rezultata testiranja posebno se bilježi:
- identifikator testa
- funkcionalnost ili modul koji se testira
- kratak opis testnog scenarija
- sprint ili faza u kojoj je test izvršen
- datum testiranja
- osoba koja je izvršila testiranje
- očekivani rezultat
- stvarni rezultat
- status testa
- dodatna napomena

Status testa može biti evidentiran na jednostavan i jasan način, kroz sljedeće oznake:
| Oznaka | Značenje |
|--------|----------|
| **Prošao** | funkcionalnost radi u skladu sa očekivanim rezultatom |
| **Nije prošao** | uočen je problem ili odstupanje od očekivanog rezultata |
| **Djelimično prošao** | dio funkcionalnosti radi ispravno, ali postoje određena ograničenja ili nedostaci |
| **Nije testirano** | test još nije izvršen |

Kada rezultat testiranja ukaže na problem, pored osnovnog rezultata testiranja evidentira se i uočena greška. Time se osigurava da rezultati testiranja ne ostanu samo na nivou konstatacije da nešto „ne radi“, nego da služe kao osnova za dalje otklanjanje problema i unapređenje sistema. Evidencija grešaka omogućava jasnu vezu između testnog scenarija, uočene nepravilnosti i procesa njene ispravke.

Za svaku uočenu grešku bilježe se:
- identifikator greške
- povezani identifikator testa
- funkcionalnost ili modul u kojem je greška uočena
- kratak opis greške
- prioritet greške
- status greške
- sprint ili faza u kojoj je greška uočena
- dodatna napomena o planiranoj doradi ili ispravci

Prioritet greške može se evidentirati kroz jednostavne kategorije:
| Kategorija | Opis |
|------------|------|
| **Nizak** | greška ne blokira osnovni tok rada i ima manji uticaj na korištenje sistema |
| **Srednji** | greška otežava korištenje funkcionalnosti, ali ne blokira cijeli proces |
| **Visok** | greška značajno narušava rad sistema ili blokira važan dio procesa |
| **Kritičan** | greška onemogućava izvršavanje ključnog toka rada ili ozbiljno ugrožava ispravnost sistema |

Status greške može se evidentirati kroz sljedeće oznake:
| Oznaka | Značenje |
|--------|----------|
| **Otvorena** | greška je evidentirana i čeka obradu |
| **U obradi** | radi se na otklanjanju greške |
| **Ispravljena** | greška je otklonjena i spremna za ponovnu provjeru |
| **Zatvorena** | greška je potvrđeno otklonjena i više nije prisutna |

Rezultati testiranja i evidentirane greške prate se kontinuirano tokom razvoja, a posebno na kraju svakog sprinta, kada se provjerava inkrement funkcionalnosti razvijen u toj iteraciji. Pored testiranja novih funkcionalnosti, evidentiraju se i rezultati regresijskog testiranja ključnih ranije implementiranih dijelova sistema, kako bi se potvrdilo da nove izmjene nisu narušile postojeće funkcionalnosti aplikacije.

Za potrebe ovog projekta rezultati testiranja i uočene greške mogu se evidentirati u jednostavnim tabelama, dokumentu ili drugom internom alatu koji tim koristi za praćenje rada. Najvažnije je da način evidentiranja bude dosljedan, pregledan i dovoljno jasan da omogući:
- praćenje statusa testiranja
- pregled uočenih grešaka
- povezivanje testova i grešaka sa konkretnim funkcionalnostima i sprintovima
- provjeru da li su ranije uočeni problemi ispravljeni
- lakšu pripremu za završno testiranje i demonstraciju sistema

### Tabelarni pregled rezultata testiranja

| ID testa | Funkcionalnost / modul | Opis testa | Sprint / faza | Datum testiranja | Izvršilac testiranja | Očekivani rezultat | Stvarni rezultat | Status testa | Napomena |
|----------|------------------------|------------|---------------|------------------|----------------------|--------------------|------------------|--------------|----------|
| TC-01 | Registracija korisnika | Provjera uspješne registracije sa validnim podacima | Sprint 6 |  |  | Korisnički nalog je uspješno kreiran |  |  |  |

### Tabelarni pregled uočenih grešaka

| ID greške | Povezani ID testa | Funkcionalnost / modul | Opis greške | Prioritet greške | Status greške | Sprint / faza | Napomena |
|---|---|---|---|---|---|---|---|
| B-01 | TC-01 | | | | | | |

Na ovaj način tim dobija jasan i povezan pregled nad provedenim testovima, njihovim rezultatima, uočenim greškama i statusom njihovog rješavanja. Takav pristup omogućava efikasnije upravljanje kvalitetom sistema i pruža bolju osnovu za završno testiranje, dorade i pripremu sistema za demonstraciju i predaju.

## Glavni rizici kvaliteta

Neki primjeri rizika kvaliteta: 
- Pogrešna prava pristupa po ulozi
- Nekonzistentan prikaz podataka između uloga
- Neispravan tok statusa intervencije
- Greške pri dodjeli i ponovnoj dodjeli zadataka

Tabela rizika: 

| ID | Rizik kvaliteta-| Opis rizika | Moguće posljedice | Način kontrole kroz testiranje |
|----|-----------------|-------------|-------------------|--------------------------------|
| QR-01 | Pogrešna prava pristupa | Korisnik vidi podatke koje ne bi smio vidjeti ili ima funkcionalnosti koje ne bi smio imati | Sigurnosni i funkcionalni problem | Testiranje po ulogama | 
