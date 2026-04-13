Template:

Domain Model
- Glavni entiteti
- Ključni atributi
- Veze između entiteta
- Poslovna pravila važna za model


Use Case Model
- Akter
- Naziv use casea
- Kratak opis
- Preduslovi
- Glavni tok
- Alternativni tokovi
- Ishod

# Domain Model

## Glavni entiteti

Domain model sistema za servisne intervencije zasniva se na skupini ključnih entiteta koji zajedno podržavaju cjelokupan poslovni proces od trenutka prijave kvara, preko njegove obrade, pa sve do realizacije i zatvaranja intervencije.

Centralnu ulogu u modelu imaju korisnici sistema koji su podijeljeni na dvije osnovne kategorije: **Korisnik_usluge** i **Uposlenici**. Entitet **Korisnik_usluge** predstavlja krajnjeg korisnika koji inicira proces prijavom kvara, dok entitet **Uposlenici** obuhvata interne aktere sistema, poput dispečera i servisera, koji upravljaju i izvršavaju intervencije.

Proces započinje kreiranjem entiteta **Zahtjev**, koji sadrži osnovne informacije o prijavljenom kvaru, uključujući opis problema, vrijeme prijave i povezane atribute. Na osnovu jednog zahtjeva može se formirati entitet **Intervencija**, koji predstavlja konkretan operativni zadatak dodijeljen serviserima i koji se prati kroz različite faze realizacije.

Kako bi se omogućila organizacija i odgovornost u radu, uveden je entitet **Dodjela**, koji modelira odnos između intervencije i uključenih uposlenika. Ovaj entitet omogućava evidentiranje procesa raspodjele zadataka, uključujući prihvatanje ili odbijanje zadatka, kao i mogućnost više pokušaja dodjele iste intervencije. Pored glavnog servisera, sistem podržava i opcionalno dodjeljivanje pomoćnog servisera.

Tokom same realizacije intervencije, aktivnosti na terenu se evidentiraju kroz entitet **Evidencija_rada**, koji omogućava detaljan uvid u izvršene radnje, trajanje intervencije i korištene resurse.

---

## Pomoćni entiteti

Pored ključnih entiteta, model uključuje i skup pomoćnih entiteta koji omogućavaju bolju organizaciju podataka, standardizaciju i praćenje toka poslovnog procesa.

Entitet **Historija_aktivnosti** ima važnu ulogu u praćenju svih promjena nad intervencijama i povezanim objektima, čime se osigurava transparentnost i mogućnost naknadne analize (audit trag). Svaka promjena je povezana sa uposlenikom koji ju je izvršio putem atributa `id_autora`, čime se osigurava odgovornost i sljedivost izmjena u sistemu.

Komunikacija između dispečera i servisera dodatno je podržana kroz entitet **Napomena**, koji omogućava razmjenu informacija vezanih za konkretnu intervenciju. Svaka napomena ima autora putem atributa `id_autora`.

Prostorni aspekt kvara modeliran je kroz entitet **Lokacija**, koji definiše gdje se problem desio i omogućava efikasnije planiranje intervencija na terenu.

Klasifikacija kvarova ostvarena je putem entiteta **Kategorija_kvara**, čime se omogućava grupisanje i lakša obrada sličnih tipova problema.

Za prioritizaciju rada koristi se entitet **Prioritet**, koji definiše nivo hitnosti rješavanja intervencije i direktno utiče na redoslijed izvršavanja zadataka.

Entitet **Status** omogućava praćenje trenutnog stanja sistema. Status je centralizovan entitet koji se koristi za više tipova objekata, pri čemu atribut `tip_statusa` (ENUM) definiše na koji se tip entiteta odnosi.

Entitet **Uloga** definiše funkcionalnu podjelu sistema između korisnika.

---

## Ključni atributi

Entitet **Zahtjev** sadrži osnovne informacije o prijavi kvara. Povezan je sa **Status**, **Kategorija_kvara** i **Lokacija**. Atribut `datum_vrijeme` označava vrijeme kreiranja zahtjeva, `je_otkazan` označava otkazivanje, a `razlog_otkazivanja` razlog.

Entitet **Intervencija** koristi `planirani_datum`, `datum_zavrsetka`, `id_dispecera` i veze sa **Prioritet** i **Status**.

Entitet **Dodjela** koristi `datum_dodjele`, `datum_odgovora`, `razlog_odbijanja`, `id_servisera`, `id_pomocnog_servisera`, `id_dispecera`.

Entitet **Evidencija_rada** koristi `vrijeme_pocetka`, `vrijeme_zavrsetka`, `utroseno_vrijeme`, `utroseni_materijal`, `ishod_rada`.

Entitet **Uposlenici** koristi `ime`, `prezime`, `jmbg`, `email`, `lozinka_hash`, `id_uloge`.

Kod entiteta **Evidencija_rada**, pored vremena početka i završetka, ključan je atribut `utroseno_vrijeme` koji služi za analitiku rada.

Entitet **Lokacija** je direktno povezan sa **Zahtjev**, a **Intervencija** ga nasljeđuje kroz 1:1 vezu.

---

## Veze između entiteta

**Korisnik_usluge** (1:N) **Zahtjev**

**Zahtjev** → **Status**, **Kategorija_kvara**, **Lokacija**

**Zahtjev** (1:1) **Intervencija**

**Intervencija** → **Uposlenici (dispečer)**, **Status**, **Prioritet**

**Intervencija** (1:N) **Dodjela**

**Dodjela** (1:N) **Uposlenici**
- `id_servisera`
- `id_pomocnog_servisera`
- `id_dispecera`

**Dodjela** ostvaruje trostruku relaciju sa **Uposlenici** putem stranih ključeva (dispečer, glavni serviser, pomoćni serviser).

**Dodjela** → **Status**

**Intervencija** (1:N) **Napomena**

**Napomena** (N:1) **Uposlenici** (`id_autora`)

**Intervencija** (1:N) **Evidencija_rada**

**Evidencija_rada** je direktno povezana sa **Intervencija** (1:N) i **Uposlenici**.

**Uposlenici** (1:N) **Evidencija_rada**

**Historija_aktivnosti** → **Uposlenici** (`id_autora`)

**Historija_aktivnosti** i **Intervencija** (1:N) omogućava hronološki audit svih promjena.

---

## Poslovna pravila

- Prava zavise od `id_uloge`
- Svaka izmjena ide u **Historija_aktivnosti** sa `id_autora`
- Historija mora biti vezana za `id_intervencije` i `id_autora`
- Status mora odgovarati `tip_statusa`
- Intervencija ne postoji bez Zahtjev
- Svaka Intervencija ima Prioritet
- Dodjela ima tačno jednog glavnog servisera (`id_servisera`)
- `id_pomocnog_servisera` je opcionalan
- Nema "u toku" bez `datum_odgovora`
- Zahtjev i Intervencija imaju `id_lokacije`
- Intervencija završava tek sa `ishod_rada` + završni status
- `utroseni_materijal` može biti NULL

 
### Tabela entiteta i atributa

U sljedećoj tabeli su prikazani svi entiteti i svi atributi koji im pripadaju:

| **Entitet** | Atributi |
|----------|----------|
| **Uposlenici** | `id_uposlenika`, `id_uloge`, `ime`, `prezime`, `JMBG`, `broj_telefona`, `email`, `adresa`, `lozinka_hash` |
| **Uloga** | `id_uloge`, `naziv`, `opis` |
| **Korisnik usluge** | `id_korisnika_usluge`, `ime`, `prezime`, `broj_telefona`, `email`, `adresa`, `lozinka_hash` |
| **Zahtjev** | `id_zahtjeva`, `id_statusa`, `id_kategorije_kvara`, `id_korisnika_usluge`, `id_lokacije`, `opis_kvara`, `datum`, `vrijeme`, `je_otkazan`, `razlog_otkazivanja` |
| **Intervencija** | `id_intervencije`, `id_prioriteta`, `id_dispecera`, `id_zahtjeva`, `id_statusa`, `planirani_datum`, `datum_izvrsavanja`, `vrijeme_izvrsavanja`, `datum_kreiranja` |
| **Dodjela** | `id_dodjela`, `id_pomocnog_servisera`, `id_intervencije`, `id_servisera`, `id_dispecera`, `id_statusa`, `datum_dodjele`, `datum_odgovora`, `razlog_odbijanja` |
| **Evidencija_rada** | `id_evidencije`, `id_intervencije`, `id_servisera`, `datum_pocetka`, `datum_zavrsetka`, `vrijeme_pocetka`, `vrijeme_zavrsetka`, `utroseno_vrijeme`, `utroseni_materijal`, `opis`, `ishod_rada` |
| **Status** | `id_statusa`, `naziv`, `opis`, `tip_statusa` |
| **Prioritet** | `id_prioriteta`, `naziv`, `opis` |
| **Kategorija kvara** | `id_kategorije_kvara`, `naziv`, `opis` |
| **Lokacija** | `id_lokacije`, `adresa`, `grad`, `opcina`, `opis` |
| **Napomene** | `id_napomene`, `id_intervencije`, `id_autora`, `tekst`, `datum`, `vrijeme`, `tip_napomene` |
| **Historija aktivnosti** | `id_historije_aktivnosti`, `id_intervencije`, `id_autora`, `akcija`, `stara_vrijednost`, `nova_vrijednost`, `datum_promjene`, `vrijeme_promjene` |

---

# Use case model 
        
## Use Case 01 (US-01)

| Stavka | Sadržaj |
|--------|---------|
| **Aktor** | Korisnik usluge |
| **Naziv use case-a** | Samostalna registracija korisnika usluge |
| **Kratak opis** | Ovaj use case opisuje proces u kojem korisnik usluge samostalno kreira novi korisnički nalog kako bi kasnije mogao pristupiti sistemu i koristiti njegove funkcionalnosti. |
| **Preduslovi** | Korisnik ima pristup registracionoj formi.<br>Sistem je dostupan i funkcionalan. |
| **Glavni tok** | 1. Korisnik otvara formu za registraciju.<br>2. Korisnik unosi potrebne podatke za registraciju (ime, email, lozinka i sl.).<br>3. Korisnik potvrđuje registraciju.<br>4. Sistem validira unesene podatke.<br>5. Sistem kreira novi korisnički nalog.<br>6. Sistem automatski dodjeljuje korisničku ulogu.<br>7. Sistem prikazuje poruku o uspješnoj registraciji. |
| **Alternativni tokovi** | **A1: Neispravni ili nepotpuni podaci**<br>&nbsp;&nbsp;3a. Korisnik potvrdi registraciju sa nepotpunim ili neispravnim podacima.<br>&nbsp;&nbsp;4a. Sistem detektuje grešku u unosu.<br>&nbsp;&nbsp;5a. Sistem ne kreira novi nalog.<br>&nbsp;&nbsp;6a. Sistem prikazuje poruku o grešci i traži ispravku podataka.<br><br>**A2: Korisnik već postoji u sistemu**<br>&nbsp;&nbsp;4b. Sistem utvrdi da korisnik sa istim jedinstvenim podacima već postoji.<br>&nbsp;&nbsp;5b. Sistem ne kreira novi nalog.<br>&nbsp;&nbsp;6b. Sistem prikazuje poruku da korisnik već postoji. |
| **Ishod** | Korisnički nalog je uspješno kreiran.<br>Korisniku je dodijeljena odgovarajuća korisnička uloga.<br>Korisnik se može prijaviti u sistem. |

  
## Use Case 02 (US-02)

| Stavka | Sadržaj |
|--------|---------|
| **Aktor** | Korisnik usluge |
| **Naziv use case-a** | Prijava korisnika u sistem |
| **Kratak opis** | Ovaj use case opisuje proces u kojem registrovani korisnik unosi svoje kredencijale kako bi se prijavio u sistem i pristupio funkcionalnostima koje su mu dostupne. |
| **Preduslovi** | Korisnik ima kreiran korisnički nalog.<br>Korisnik ima pristup login formi.<br>Sistem je dostupan i funkcionalan. |
| **Glavni tok** | 1. Korisnik otvara formu za prijavu.<br>2. Korisnik unosi email i lozinku.<br>3. Korisnik potvrđuje prijavu.<br>4. Sistem validira unesene podatke.<br>5. Sistem provjerava kredencijale korisnika.<br>6. Sistem kreira korisničku sesiju.<br>7. Sistem preusmjerava korisnika na odgovarajuću početnu stranicu. |
| **Alternativni tokovi** | **A1: Neispravni kredencijali**<br>&nbsp;&nbsp;3a. Korisnik potvrdi prijavu sa netačnim kredencijalima.<br>&nbsp;&nbsp;4a. Sistem utvrđuje da kredencijali nisu ispravni.<br>&nbsp;&nbsp;5a. Sistem ne dozvoljava prijavu.<br>&nbsp;&nbsp;6a. Sistem prikazuje poruku o grešci.<br><br>**A2: Nepotpuni podaci za prijavu**<br>&nbsp;&nbsp;2a. Korisnik ne unese email ili lozinku.<br>&nbsp;&nbsp;3a. Sistem detektuje nedostatak podataka.<br>&nbsp;&nbsp;4a. Sistem prikazuje poruku da su polja obavezna.<br><br>**A3: Neaktivan korisnički nalog**<br>&nbsp;&nbsp;5a. Sistem utvrđuje da korisnički nalog nije aktivan.<br>&nbsp;&nbsp;6a. Sistem ne dozvoljava prijavu.<br>&nbsp;&nbsp;7a. Sistem prikazuje odgovarajuću poruku. |
| **Ishod** | Korisnik je uspješno prijavljen u sistem.<br>Kreirana je aktivna korisnička sesija.<br>Korisnik ima pristup funkcionalnostima u skladu sa svojom ulogom. |

## Use Case 03 (US-03)

| Stavka | Sadržaj |
|--------|---------|
| **Aktor** | Korisnik sistema |
| **Naziv use case-a** | Odjava korisnika iz sistema |
| **Kratak opis** | Ovaj use case opisuje proces u kojem prijavljeni korisnik završava svoju sesiju u sistemu kako bi spriječio neovlašten pristup svom korisničkom nalogu nakon završetka rada. |
| **Preduslovi** | Korisnik je prijavljen u sistem.<br>Postoji aktivna korisnička sesija.<br>Sistem je dostupan i funkcionalan. |
| **Glavni tok** | 1. Korisnik klikne na opciju za odjavu (logout).<br>2. Sistem prima zahtjev za odjavu.<br>3. Sistem invalidira korisničku sesiju.<br>4. Sistem briše sesijske podatke.<br>5. Sistem preusmjerava korisnika na login stranicu.<br>6. Sistem prikazuje poruku o uspješnoj odjavi. |
| **Alternativni tokovi** | **A1: Istek sesije (automatska odjava)**<br>&nbsp;&nbsp;1a. Korisnik je neaktivan tokom definisanog vremenskog perioda.<br>&nbsp;&nbsp;2a. Sistem automatski završava korisničku sesiju.<br>&nbsp;&nbsp;3a. Sistem preusmjerava korisnika na login stranicu.<br>&nbsp;&nbsp;4a. Sistem prikazuje poruku da je sesija istekla. |
| **Ishod** | Korisnik je uspješno odjavljen iz sistema.<br>Sesija je zatvorena.<br>Onemogućen je dalji pristup bez ponovne prijave. |

## Use Case 04 (US-04)

| Stavka | Sadržaj |
|--------|---------|
| **Aktor** | Administrator |
| **Naziv use case-a** | Kontrola pristupa prema korisničkoj ulozi |
| **Kratak opis** | Ovaj use case opisuje proces u kojem administrator upravlja korisničkim ulogama i pristupom funkcionalnostima sistema, kako bi svaki korisnik imao pristup samo onim podacima i akcijama koje odgovaraju njegovoj odgovornosti. |
| **Preduslovi** | Administrator je prijavljen u sistem.<br>U sistemu postoje definisane korisničke uloge.<br>Korisnici su evidentirani u sistemu.<br>Sistem je dostupan i funkcionalan. |
| **Glavni tok** | 1. Administrator pristupa modulu za upravljanje korisnicima i pravima pristupa.<br>2. Administrator bira korisnika iz liste.<br>3. Sistem prikazuje trenutnu korisničku ulogu i dostupne opcije pristupa.<br>4. Administrator dodjeljuje ili mijenja korisničku ulogu.<br>5. Sistem validira odabranu ulogu i pripadajuća pravila pristupa.<br>6. Sistem ažurira prava pristupa korisnika u skladu sa odabranom ulogom.<br>7. Sistem sprema promjene.<br>8. Sistem prikazuje potvrdu o uspješnoj izmjeni. |
| **Alternativni tokovi** | **A1: Nevažeća ili nedozvoljena uloga**<br>&nbsp;&nbsp;4a. Administrator odabere nepostojeću ili nedozvoljenu ulogu.<br>&nbsp;&nbsp;5a. Sistem detektuje grešku.<br>&nbsp;&nbsp;6a. Sistem ne dozvoljava izmjenu.<br>&nbsp;&nbsp;7a. Sistem prikazuje poruku o grešci.<br><br>**A2: Korisnik nije dostupan u sistemu**<br>&nbsp;&nbsp;2a. Administrator odabere korisnika koji više nije dostupan ili nije moguće učitati njegove podatke.<br>&nbsp;&nbsp;3a. Sistem prikazuje poruku o grešci.<br><br>**A3: Nedozvoljen pristup modulu**<br>&nbsp;&nbsp;1a. Korisnik bez administratorskih ovlaštenja pokuša pristupiti modulu za upravljanje korisnicima i pravima pristupa.<br>&nbsp;&nbsp;2a. Sistem odbija pristup.<br>&nbsp;&nbsp;3a. Sistem prikazuje poruku o nedozvoljenom pristupu. |
| **Ishod** | Korisniku je dodijeljena ili izmijenjena odgovarajuća korisnička uloga.<br>Pristup funkcionalnostima i podacima sistema je usklađen sa korisničkom ulogom.<br>Sistem osigurava kontrolu pristupa i jasnu raspodjelu odgovornosti. |

## Use Case 05 (US-05)

| Stavka | Sadržaj |
|--------|---------|
| **Aktor** | Korisnik usluge |
| **Naziv use case-a** | Prijava zahtjeva za servisnu intervenciju |
| **Kratak opis** | Ovaj use case opisuje proces u kojem korisnik usluge prijavljuje kvar ili zahtjev za servisnu intervenciju. Sistem evidentira unesene podatke, validira ih i kreira novi zahtjev koji postaje dostupan za dalju obradu. |
| **Preduslovi** | Korisnik je registrovan u sistemu.<br>Korisnik je prijavljen u sistem.<br>Korisnik ima pristup formi za prijavu zahtjeva.<br>Sistem je dostupan i funkcionalan. |
| **Glavni tok** | 1. Korisnik otvara formu za prijavu zahtjeva.<br>2. Korisnik unosi podatke o kvaru ili zahtjevu (opis, lokacija, vrijeme i sl.).<br>3. Korisnik potvrđuje slanje zahtjeva.<br>4. Sistem validira unesene podatke.<br>5. Sistem kreira novi zahtjev u bazi podataka.<br>6. Sistem automatski dodjeljuje početni status zahtjevu.<br>7. Sistem povezuje zahtjev sa korisnikom koji ga je podnio.<br>8. Sistem prikazuje potvrdu o uspješnoj prijavi. |
| **Alternativni tokovi** | **A1: Nepotpuni podaci**<br>&nbsp;&nbsp;2a. Korisnik ne unese sve obavezne podatke.<br>&nbsp;&nbsp;4a. Sistem detektuje nedostatak podataka.<br>&nbsp;&nbsp;5a. Sistem ne kreira zahtjev.<br>&nbsp;&nbsp;6a. Sistem prikazuje poruku o grešci i traži dopunu podataka.<br><br>**A2: Nevažeći podaci**<br>&nbsp;&nbsp;2a. Korisnik unese podatke u neispravnom formatu ili unese nevažeće vrijednosti.<br>&nbsp;&nbsp;4a. Sistem detektuje grešku u unosu.<br>&nbsp;&nbsp;5a. Sistem ne kreira zahtjev.<br>&nbsp;&nbsp;6a. Sistem prikazuje poruku o grešci.<br><br>**A3: Greška pri kreiranju zahtjeva**<br>&nbsp;&nbsp;5a. Dođe do greške pri kreiranju zahtjeva u sistemu.<br>&nbsp;&nbsp;6a. Sistem ne sprema zahtjev.<br>&nbsp;&nbsp;7a. Sistem obavještava korisnika da pokuša ponovo. |
| **Ishod** | Novi zahtjev za servisnu intervenciju je kreiran.<br>Zahtjev je povezan sa korisnikom koji ga je podnio.<br>Zahtjevu je dodijeljen početni status.<br>Zahtjev je spreman za dalju obradu od strane dispečera. |

## Use Case 06 (US-06)

| Stavka | Sadržaj |
|--------|---------|
| **Aktor** | Korisnik usluge |
| **Naziv use case-a** | Pregled vlastitog zahtjeva |
| **Kratak opis** | Ovaj use case opisuje proces u kojem korisnik pregledava svoje prethodno prijavljene zahtjeve, uključujući osnovne informacije i trenutni status obrade. |
| **Preduslovi** | Korisnik je registrovan u sistemu.<br>Korisnik je prijavljen u sistem.<br>Sistem je dostupan i funkcionalan. |
| **Glavni tok** | 1. Korisnik otvara listu svojih zahtjeva.<br>2. Sistem prikazuje listu svih zahtjeva povezanih sa korisnikom.<br>3. Korisnik bira jedan zahtjev za pregled.<br>4. Sistem prikazuje detalje odabranog zahtjeva (opis, status, datum i druge relevantne informacije).<br>5. Korisnik pregledava prikazane informacije. |
| **Alternativni tokovi** | **A1: Korisnik nema prijavljenih zahtjeva**<br>&nbsp;&nbsp;1a. Korisnik nema nijedan evidentiran zahtjev u sistemu.<br>&nbsp;&nbsp;2a. Sistem prikazuje poruku da nema dostupnih zahtjeva.<br><br>**A2: Greška pri učitavanju zahtjeva**<br>&nbsp;&nbsp;2a. Sistem ne može učitati listu zahtjeva ili detalje odabranog zahtjeva.<br>&nbsp;&nbsp;3a. Sistem prikazuje poruku o grešci.<br><br>**A3: Pokušaj pristupa tuđem zahtjevu**<br>&nbsp;&nbsp;3a. Korisnik pokuša otvoriti zahtjev koji nije povezan sa njegovim nalogom.<br>&nbsp;&nbsp;4a. Sistem blokira pristup.<br>&nbsp;&nbsp;5a. Sistem prikazuje poruku o zabrani pristupa. |
| **Ishod** | Korisnik vidi listu svojih zahtjeva.<br>Korisnik može pregledati detalje pojedinačnog zahtjeva.<br>Prikazan je tačan status i relevantne informacije o zahtjevu. |

## Use Case 07 (US-07)

| Stavka | Sadržaj |
|--------|---------|
| **Aktor** | Dispečer |
| **Naziv use case-a** | Pregled otvorenih intervencija |
| **Kratak opis** | Ovaj use case opisuje proces u kojem dispečer pregledava sve otvorene i aktivne intervencije kako bi imao jasan uvid u zahtjeve koji čekaju obradu ili su trenutno u toku. |
| **Preduslovi** | Dispečer je prijavljen u sistemu.<br>Sistem je dostupan i funkcionalan. |
| **Glavni tok** | 1. Dispečer otvara pregled intervencija (dashboard ili lista).<br>2. Sistem prikazuje listu svih otvorenih i aktivnih intervencija.<br>3. Sistem prikazuje ključne informacije o svakoj intervenciji (status, prioritet, lokacija, dodijeljeni serviser i sl.).<br>4. Dispečer pregledava listu i identifikuje relevantne intervencije.<br>5. Dispečer može odabrati intervenciju za detaljniji pregled ili dalju obradu. |
| **Alternativni tokovi** | **A1: Nema otvorenih intervencija**<br>&nbsp;&nbsp;2a. Sistem ne pronalazi nijednu otvorenu ili aktivnu intervenciju.<br>&nbsp;&nbsp;3a. Sistem prikazuje poruku da nema aktivnih intervencija.<br><br>**A2: Greška pri učitavanju intervencija**<br>&nbsp;&nbsp;2a. Sistem ne može učitati listu intervencija.<br>&nbsp;&nbsp;3a. Sistem prikazuje poruku o grešci.<br><br>**A3: Nedozvoljen pristup**<br>&nbsp;&nbsp;1a. Korisnik bez odgovarajuće uloge pokuša pristupiti pregledu intervencija.<br>&nbsp;&nbsp;2a. Sistem blokira pristup.<br>&nbsp;&nbsp;3a. Sistem prikazuje poruku o zabrani pristupa. |
| **Ishod** | Dispečer ima pregled svih aktivnih intervencija.<br>Intervencije su prikazane sa ključnim informacijama.<br>Omogućen je dalji rad nad odabranim intervencijama. |

## Use Case 08 (US-08)

| Stavka | Sadržaj |
|--------|--------|
| **Aktor** | Dispečer |
| **Naziv use case-a** | Pregled detalja pojedinačne intervencije |
| **Kratak opis** | Ovaj use case opisuje proces u kojem dispečer pregledava detaljne informacije o jednoj intervenciji kako bi imao potpuni uvid u njen status, tok i zaduženja. |
| **Preduslovi** | Dispečer je prijavljen u sistem.<br>Postoji barem jedna intervencija u sistemu.<br>Dispečer ima pristup listi intervencija.<br>Sistem je dostupan. |
| **Glavni tok** | 1. Dispečer otvara listu intervencija.<br>2. Dispečer odabire jednu intervenciju.<br>3. Sistem prikazuje detalje intervencije.<br>4. Sistem prikazuje informacije (opis, status, prioritet, lokacija, dodijeljeni serviser, historija aktivnosti itd.).<br>5. Dispečer pregledava podatke. |
| **Alternativni tokovi** | **A1: Intervencija ne postoji**<br>2a. Odabrana intervencija više ne postoji.<br>3a. Sistem prikazuje poruku o grešci.<br><br>**A2: Greška pri učitavanju detalja**<br>3a. Sistem ne može učitati detalje.<br>4a. Sistem prikazuje poruku o grešci.<br><br>**A3: Neovlašten pristup**<br>2a. Korisnik bez prava pristupa pokuša otvoriti intervenciju.<br>3a. Sistem blokira pristup.<br>4a. Sistem prikazuje poruku o zabrani. |
| **Ishod** | Dispečer ima detaljan uvid u intervenciju.<br>Prikazani su svi relevantni podaci.<br>Omogućeno donošenje odluka (dodjela, promjena prioriteta itd.). |

## Use Case Model – US-09

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Dodjela intervencije odgovornom serviseru

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer dodjeljuje intervenciju odgovornom serviseru kako bi bilo jasno ko preuzima izvršenje zadatka.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji kreirana intervencija  
- Postoji barem jedan serviser u sistemu  
- Intervencija još nije dodijeljena ili se može promijeniti izvršilac  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara detalje intervencije  
2. Dispečer bira opciju za dodjelu servisera  
3. Sistem prikazuje listu dostupnih servisera  
4. Dispečer odabire servisera  
5. Dispečer potvrđuje dodjelu  
6. Sistem dodjeljuje intervenciju izabranom serviseru  
7. Sistem ažurira status intervencije (npr. "Dodijeljeno")  
8. Sistem bilježi promjenu u historiji aktivnosti  
9. Sistem obavještava servisera o dodjeli  

### **Alternativni tokovi:**

**A1: Nema dostupnih servisera**  
3a. Sistem ne pronalazi dostupne servisere  
4a. Sistem prikazuje poruku da nema dostupnih izvršilaca  

**A2: Greška pri dodjeli**  
6a. Sistem ne uspije dodijeliti intervenciju  
7a. Sistem prikazuje poruku o grešci  

**A3: Promjena dodjele**  
4a. Intervencija je već dodijeljena  
5a. Dispečer bira drugog servisera  
6a. Sistem ažurira dodjelu novim serviserom  

### **Ishod:**
- Intervencija je dodijeljena odgovornom serviseru  
- Serviser je obaviješten o zadatku  
- Status intervencije je ažuriran  
- Promjena je evidentirana u sistemu  

## Use Case Model – US-10

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Dodjela intervencije timu servisera

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer dodjeljuje intervenciju timu servisera kako bi se složeniji zadaci mogli izvršavati timski i efikasnije.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji kreirana intervencija  
- Postoji definisan tim servisera u sistemu  
- Intervencija nije dodijeljena ili se dodjela može promijeniti  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara detalje intervencije  
2. Dispečer bira opciju za dodjelu timu  
3. Sistem prikazuje listu dostupnih timova  
4. Dispečer odabire tim servisera  
5. Dispečer potvrđuje dodjelu  
6. Sistem dodjeljuje intervenciju odabranom timu  
7. Sistem ažurira status intervencije  
8. Sistem bilježi promjenu u historiji aktivnosti  
9. Sistem obavještava članove tima  

### **Alternativni tokovi:**

**A1: Nema dostupnih timova**  
3a. Sistem ne pronalazi nijedan tim  
4a. Sistem prikazuje poruku da nema dostupnih timova  

**A2: Greška pri dodjeli**  
6a. Sistem ne uspije dodijeliti intervenciju  
7a. Sistem prikazuje poruku o grešci  

**A3: Promjena dodjele**  
4a. Intervencija je već dodijeljena  
5a. Dispečer bira drugi tim  
6a. Sistem ažurira dodjelu  

### **Ishod:**
- Intervencija je dodijeljena timu servisera  
- Svi članovi tima su obaviješteni  
- Status intervencije je ažuriran  
- Promjena je evidentirana u sistemu  

## Use Case Model – US-11

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Planiranje intervencije

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer planira intervenciju unaprijed definisanjem termina, resursa i organizacije izvršenja zadatka.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji kreirana intervencija  
- Intervencija ima osnovne podatke (lokacija, opis itd.)  
- Dostupni su serviseri ili timovi  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara detalje intervencije  
2. Dispečer bira opciju planiranja  
3. Sistem prikazuje dostupne termine i resurse  
4. Dispečer odabire datum i vrijeme intervencije  
5. Dispečer određuje potrebne resurse (serviser/tim)  
6. Dispečer potvrđuje plan  
7. Sistem sprema planirane podatke  
8. Sistem ažurira status intervencije (npr. "Planirano")  
9. Sistem obavještava uključene servisere  

### **Alternativni tokovi:**

**A1: Nema dostupnih termina**  
3a. Sistem ne pronalazi slobodan termin  
4a. Sistem prikazuje poruku o nedostupnosti  

**A2: Konflikt termina**  
4a. Odabrani termin se preklapa sa drugim zadatkom  
5a. Sistem upozorava dispečera  
6a. Dispečer bira novi termin  

**A3: Greška pri spremanju**  
7a. Sistem ne uspije spremiti plan  
8a. Sistem prikazuje poruku o grešci  

### **Ishod:**
- Intervencija ima definisan termin i resurse  
- Status intervencije je ažuriran  
- Serviseri su obaviješteni o planu  
- Omogućeno efikasnije izvršenje zadatka  



## Use Case Model – US-12

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Određivanje prioriteta intervencije

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer određuje prioritet intervencije kako bi zahtjevi bili obrađeni i raspoređeni prema njihovoj hitnosti i važnosti.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji kreirana intervencija  
- Intervencija ima osnovne informacije (opis, lokacija, hitnost)  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara detalje intervencije  
2. Dispečer bira opciju za postavljanje prioriteta  
3. Sistem prikazuje dostupne nivoe prioriteta (npr. nizak, srednji, visok)  
4. Dispečer odabire nivo prioriteta  
5. Dispečer potvrđuje izbor  
6. Sistem sprema odabrani prioritet  
7. Sistem ažurira prikaz intervencije  
8. Sistem bilježi promjenu u historiji aktivnosti  

### **Alternativni tokovi:**

**A1: Već postavljen prioritet**  
2a. Intervencija već ima prioritet  
3a. Dispečer može promijeniti postojeći prioritet  

**A2: Greška pri spremanju**  
6a. Sistem ne uspije spremiti promjenu  
7a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Korisnik bez uloge dispečera pokuša promijeniti prioritet  
3a. Sistem blokira akciju  

### **Ishod:**
- Intervencija ima definisan prioritet  
- Prioritet je vidljiv u sistemu  
- Promjena je evidentirana  
- Omogućena bolja organizacija i raspodjela zadataka


## Use Case Model – US-13

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Pregled statusa intervencija od strane dispečera

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer pregledava statuse intervencija kako bi mogao pratiti tok rada i imati jasan uvid u trenutnu fazu obrade svakog zahtjeva.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoje intervencije u sistemu  
- Intervencije imaju definisan status  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara pregled intervencija  
2. Sistem prikazuje listu intervencija sa njihovim statusima  
3. Sistem prikazuje dodatne informacije (npr. prioritet, dodijeljeni serviser, rok)  
4. Dispečer pregledava statuse intervencija  
5. Dispečer prati tok rada i identifikuje intervencije koje zahtijevaju pažnju  

### **Alternativni tokovi:**

**A1: Nema intervencija**  
2a. Sistem ne pronalazi nijednu intervenciju  
3a. Sistem prikazuje poruku da nema dostupnih podataka  

**A2: Greška pri učitavanju**  
2a. Sistem ne može učitati podatke  
3a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Korisnik bez uloge dispečera pokuša pristupiti  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Dispečer ima pregled statusa svih intervencija  
- Omogućen je nadzor procesa  
- Lakše se uočavaju zastoji i problemi  
- Omogućena je bolja kontrola rada  

## Use Case Model – US-14

### **Aktor:**
Serviser

### **Naziv use case-a:**
Ažuriranje statusa intervencije od strane servisera

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser po potrebi ažurira status intervencije na kojoj radi, kako bi sistem odražavao trenutno stanje rada na terenu.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Serviser ima dodijeljenu intervenciju  
- Intervencija postoji u sistemu  
- Sistem je dostupan  

### **Glavni tok:**
1. Serviser otvara listu svojih dodijeljenih intervencija  
2. Serviser odabire intervenciju  
3. Serviser bira opciju za promjenu statusa  
4. Sistem prikazuje dostupne statuse (npr. "U toku", "Završeno", "Na čekanju")  
5. Serviser odabire novi status  
6. Serviser potvrđuje izmjenu  
7. Sistem ažurira status intervencije  
8. Sistem bilježi promjenu u historiji aktivnosti  

### **Alternativni tokovi:**

**A1: Nevažeći status**  
5a. Serviser odabere nevažeći status  
6a. Sistem detektuje grešku  
7a. Sistem ne dozvoljava izmjenu  
8a. Sistem prikazuje poruku o grešci  

**A2: Greška pri spremanju**  
7a. Sistem ne uspije spremiti promjenu  
8a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Serviser pokuša pristupiti intervenciji koja mu nije dodijeljena  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Status intervencije je ažuriran  
- Sistem prikazuje tačno stanje rada  
- Smanjena je potreba za dodatnim provjerama  
- Poboljšana je koordinacija između učesnika

## Use Case Model – US-15

### **Aktor:**
Serviser

### **Naziv use case-a:**
Pregled dodijeljenih intervencija

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser pregledava intervencije koje su mu dodijeljene, kako bi znao koje zadatke treba izvršiti i kojim redoslijedom ih treba obraditi.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Serviser ima dodijeljene intervencije  
- Intervencije postoje u sistemu  
- Sistem je dostupan  

### **Glavni tok:**
1. Serviser otvara listu svojih dodijeljenih intervencija  
2. Sistem prikazuje listu intervencija dodijeljenih serviseru  
3. Sistem prikazuje ključne informacije (status, prioritet, lokacija, rok itd.)  
4. Serviser pregledava listu i organizuje redoslijed rada  
5. Serviser može odabrati intervenciju za detaljniji pregled  

### **Alternativni tokovi:**

**A1: Nema dodijeljenih intervencija**  
2a. Sistem ne pronalazi nijednu intervenciju  
3a. Sistem prikazuje poruku da nema dodijeljenih zadataka  

**A2: Greška pri učitavanju**  
2a. Sistem ne može učitati intervencije  
3a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Neautorizovan korisnik pokuša pristupiti listi  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Serviser ima pregled svojih zadataka  
- Omogućena je lakša organizacija rada  
- Smanjen je broj propuštenih intervencija  
- Serviser može planirati izvršenje zadataka

## Use Case Model – US-16

### **Aktor:**
Serviser

### **Naziv use case-a:**
Pregled detalja zadatka na terenu

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser pregledava detalje zadatka na terenu kako bi imao sve potrebne informacije za njegovo pravilno i efikasno izvršavanje.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Serviser ima dodijeljenu intervenciju  
- Intervencija postoji u sistemu  
- Sistem je dostupan  

### **Glavni tok:**
1. Serviser otvara listu svojih intervencija  
2. Serviser odabire intervenciju  
3. Sistem prikazuje detalje zadatka  
4. Sistem prikazuje informacije (opis kvara, lokacija, prioritet, status, napomene itd.)  
5. Serviser pregledava podatke prije izvršenja zadatka  

### **Alternativni tokovi:**

**A1: Intervencija ne postoji**  
2a. Odabrana intervencija više ne postoji  
3a. Sistem prikazuje poruku o grešci  

**A2: Greška pri učitavanju**  
3a. Sistem ne može učitati detalje  
4a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Serviser pokuša pristupiti intervenciji koja mu nije dodijeljena  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Serviser ima sve potrebne informacije za izvršenje zadatka  
- Smanjen je broj grešaka tokom rada  
- Poboljšana je priprema prije intervencije  
- Omogućeno efikasnije izvršenje zadatka

## Use Case Model – US-17

### **Aktor:**
Serviser

### **Naziv use case-a:**
Evidentiranje izvršenog rada

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser evidentira izvršeni rad kako bi sistem sadržavao tačan zapis o aktivnostima obavljenim tokom intervencije.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Serviser ima dodijeljenu intervenciju  
- Intervencija postoji u sistemu  
- Intervencija je u toku ili završena  
- Sistem je dostupan  

### **Glavni tok:**
1. Serviser otvara detalje intervencije  
2. Serviser bira opciju za evidentiranje rada  
3. Serviser unosi podatke o izvršenim aktivnostima (opis rada, utrošeno vrijeme, materijal itd.)  
4. Serviser potvrđuje unos  
5. Sistem validira unesene podatke  
6. Sistem sprema evidenciju rada  
7. Sistem povezuje zapis sa intervencijom  
8. Sistem bilježi promjenu u historiji aktivnosti  

### **Alternativni tokovi:**

**A1: Nepotpuni podaci**  
3a. Serviser ne unese sve obavezne podatke  
5a. Sistem detektuje nedostatak podataka  
6a. Sistem ne sprema zapis  
7a. Sistem prikazuje poruku o grešci  

**A2: Greška pri spremanju**  
6a. Sistem ne uspije spremiti podatke  
7a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Serviser pokuša pristupiti intervenciji koja mu nije dodijeljena  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Evidencija izvršenog rada je uspješno zabilježena  
- Podaci o intervenciji su ažurirani  
- Omogućena je transparentnost procesa  
- Omogućen je pregled izvršenja rada

## Use Case Model – US-18

### **Aktor:**
Administrator

### **Naziv use case-a:**
Administrativno kreiranje internog korisničkog naloga

### **Kratak opis:**
Ovaj use case opisuje proces u kojem administrator kreira korisnički nalog za internog korisnika sistema, kako bi mu omogućio pristup sistemu u skladu sa njegovom ulogom.

### **Preduslovi:**
- Administrator je prijavljen u sistem  
- Postoje definisane korisničke uloge  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Administrator otvara modul za upravljanje korisnicima  
2. Administrator bira opciju za kreiranje novog korisnika  
3. Administrator unosi podatke o korisniku (ime, email, uloga itd.)  
4. Administrator potvrđuje unos  
5. Sistem validira unesene podatke  
6. Sistem kreira novi korisnički nalog  
7. Sistem dodjeljuje odgovarajuću ulogu korisniku  
8. Sistem sprema podatke  
9. Sistem prikazuje potvrdu o uspješnom kreiranju naloga  

### **Alternativni tokovi:**

**A1: Nepotpuni ili nevažeći podaci**  
3a. Administrator unese nepotpune ili neispravne podatke  
5a. Sistem detektuje grešku  
6a. Sistem ne kreira nalog  
7a. Sistem prikazuje poruku o grešci  

**A2: Duplikat korisnika**  
3a. Administrator unese email koji već postoji u sistemu  
5a. Sistem detektuje duplikat  
6a. Sistem ne dozvoljava kreiranje naloga  
7a. Sistem prikazuje poruku da korisnik već postoji  

**A3: Neovlašten pristup**  
1a. Korisnik bez administratorske uloge pokuša pristupiti modulu  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Novi korisnički nalog je kreiran  
- Korisniku je dodijeljena odgovarajuća uloga  
- Omogućen je pristup sistemu  
- Jasno su definisane odgovornosti korisnika

## Use Case Model – US-19

### **Aktor:**
Administrator

### **Naziv use case-a:**
Pregled postojećih korisničkih naloga

### **Kratak opis:**
Ovaj use case opisuje proces u kojem administrator pregledava postojeće korisničke naloge kako bi imao uvid u korisnike sistema i mogao njima upravljati.

### **Preduslovi:**
- Administrator je prijavljen u sistem  
- Postoje korisnički nalozi u sistemu  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Administrator otvara modul za upravljanje korisnicima  
2. Sistem prikazuje listu svih korisničkih naloga  
3. Sistem prikazuje osnovne informacije (ime, email, uloga, status itd.)  
4. Administrator pregledava listu korisnika  
5. Administrator može odabrati korisnika za detaljniji pregled ili izmjene  

### **Alternativni tokovi:**

**A1: Nema korisničkih naloga**  
2a. Sistem ne pronalazi nijedan korisnički nalog  
3a. Sistem prikazuje poruku da nema dostupnih korisnika  

**A2: Greška pri učitavanju**  
2a. Sistem ne može učitati korisničke naloge  
3a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Korisnik bez administratorske uloge pokuša pristupiti modulu  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Administrator ima pregled svih korisničkih naloga  
- Omogućen je uvid u korisničke uloge  
- Olakšano je upravljanje korisnicima  
- Sistem omogućava dalje administrativne akcije

## Use Case Model – US-20

### **Aktor:**
Administrator

### **Naziv use case-a:**
Promjena korisničke uloge

### **Kratak opis:**
Ovaj use case opisuje proces u kojem administrator mijenja korisničku ulogu kako bi korisnik imao pristup funkcionalnostima koje odgovaraju njegovoj novoj odgovornosti u sistemu.

### **Preduslovi:**
- Administrator je prijavljen u sistem  
- Postoje korisnički nalozi u sistemu  
- Postoje definisane korisničke uloge  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Administrator otvara modul za upravljanje korisnicima  
2. Administrator bira korisnika iz liste  
3. Administrator pregleda trenutnu korisničku ulogu  
4. Administrator bira novu korisničku ulogu  
5. Administrator potvrđuje izmjenu  
6. Sistem validira odabranu ulogu  
7. Sistem ažurira korisničku ulogu  
8. Sistem sprema promjene  
9. Sistem prikazuje potvrdu o uspješnoj izmjeni  

### **Alternativni tokovi:**

**A1: Nevažeća uloga**  
4a. Administrator odabere nepostojeću ili nevažeću ulogu  
6a. Sistem detektuje grešku  
7a. Sistem ne dozvoljava izmjenu  
8a. Sistem prikazuje poruku o grešci  

**A2: Greška pri spremanju**  
7a. Sistem ne uspije spremiti promjene  
8a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Korisnik bez administratorske uloge pokuša pristupiti modulu  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Korisniku je dodijeljena nova uloga  
- Pristup funkcionalnostima je ažuriran  
- Osigurana je sigurnost sistema  
- Omogućena je bolja organizacija rada

## Use Case Model – US-21

### **Aktor:**
Administrator

### **Naziv use case-a:**
Deaktivacija korisničkog naloga

### **Kratak opis:**
Ovaj use case opisuje proces u kojem administrator deaktivira korisnički nalog kako bi spriječio dalji pristup korisniku koji više ne treba koristiti sistem.

### **Preduslovi:**
- Administrator je prijavljen u sistem  
- Postoje korisnički nalozi u sistemu  
- Korisnik čiji se nalog deaktivira postoji u sistemu  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Administrator otvara modul za upravljanje korisnicima  
2. Administrator bira korisnički nalog iz liste  
3. Administrator pregleda detalje korisnika  
4. Administrator bira opciju za deaktivaciju naloga  
5. Administrator potvrđuje deaktivaciju  
6. Sistem mijenja status naloga u "deaktiviran"  
7. Sistem onemogućava dalju prijavu korisnika  
8. Sistem sprema promjene  
9. Sistem prikazuje potvrdu o uspješnoj deaktivaciji  

### **Alternativni tokovi:**

**A1: Već deaktiviran nalog**  
4a. Administrator pokuša deaktivirati već deaktiviran nalog  
5a. Sistem prikazuje informaciju da je nalog već deaktiviran  

**A2: Greška pri spremanju**  
6a. Sistem ne uspije promijeniti status naloga  
7a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Korisnik bez administratorske uloge pokuša izvršiti deaktivaciju  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Korisnički nalog je deaktiviran  
- Korisniku je onemogućen pristup sistemu  
- Podaci o korisniku ostaju sačuvani u sistemu  
- Osigurana je sigurnost i kontrola pristupa

## Use Case Model – US-22

### **Aktor:**
Serviser

### **Naziv use case-a:**
Prihvatanje dodijeljenog zadatka

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser prihvata dodijeljeni zadatak kako bi potvrdio da preuzima odgovornost za njegovu realizaciju.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Postoji dodijeljena intervencija serviseru  
- Serviser ima pristup listi svojih zadataka  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Serviser otvara listu dodijeljenih intervencija  
2. Serviser bira jednu intervenciju  
3. Serviser pregleda detalje zadatka  
4. Serviser bira opciju za prihvatanje zadatka  
5. Serviser potvrđuje prihvatanje  
6. Sistem ažurira status intervencije (npr. "U toku")  
7. Sistem bilježi promjenu u historiji aktivnosti  
8. Sistem prikazuje potvrdu o uspješnom prihvatanju  

### **Alternativni tokovi:**

**A1: Zadatak već prihvaćen**  
4a. Intervencija je već prihvaćena od strane servisera  
5a. Sistem prikazuje informaciju da je zadatak već u obradi  

**A2: Greška pri ažuriranju**  
6a. Sistem ne uspije ažurirati status  
7a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Korisnik koji nije dodijeljeni serviser pokušava pristupiti zadatku  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Zadatak je prihvaćen od strane servisera  
- Status intervencije je ažuriran  
- Serviser preuzima odgovornost za izvršenje  
- Promjena je evidentirana u sistemu

## Use Case Model – US-23

### **Aktor:**
Serviser

### **Naziv use case-a:**
Odbijanje dodijeljenog zadatka

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser odbija dodijeljeni zadatak kako bi dispečer mogao pravovremeno reagovati i dodijeliti ga drugom izvršiocu.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Postoji dodijeljena intervencija serviseru  
- Serviser ima pristup listi svojih zadataka  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Serviser otvara listu dodijeljenih intervencija  
2. Serviser bira jednu intervenciju  
3. Serviser pregleda detalje zadatka  
4. Serviser bira opciju za odbijanje zadatka  
5. Serviser unosi razlog odbijanja (opcionalno)  
6. Serviser potvrđuje odbijanje  
7. Sistem ažurira status intervencije (npr. "Odbijeno")  
8. Sistem bilježi promjenu u historiji aktivnosti  
9. Sistem obavještava dispečera o odbijanju  

### **Alternativni tokovi:**

**A1: Zadatak već prihvaćen**  
4a. Intervencija je već prihvaćena od strane servisera  
5a. Sistem ne dozvoljava odbijanje i prikazuje poruku  

**A2: Greška pri ažuriranju**  
7a. Sistem ne uspije ažurirati status  
8a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Korisnik koji nije dodijeljeni serviser pokušava izvršiti akciju  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Zadatak je odbijen od strane servisera  
- Dispečer je obaviješten o odbijanju  
- Intervencija je spremna za ponovnu dodjelu  
- Promjena je evidentirana u sistemu

## Use Case Model – US-24

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Pregled evidentiranog izvršenog rada

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer pregledava evidentirani izvršeni rad kako bi imao uvid u aktivnosti koje je serviser obavio prije zatvaranja intervencije.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji intervencija sa evidentiranim izvršenim radom  
- Serviser je unio podatke o izvršenom radu  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Dispečer otvara listu intervencija  
2. Dispečer bira intervenciju za pregled  
3. Dispečer otvara sekciju evidentiranog rada  
4. Sistem prikazuje detalje izvršenog rada (opis, vrijeme, utrošeni materijal itd.)  
5. Dispečer pregledava unesene informacije  
6. Dispečer donosi odluku o daljim koracima (npr. zatvaranje intervencije)  

### **Alternativni tokovi:**

**A1: Nema evidentiranog rada**  
3a. Intervencija nema unesene podatke o radu  
4a. Sistem prikazuje poruku da nema dostupnih informacija  

**A2: Greška pri učitavanju**  
4a. Sistem ne može učitati podatke  
5a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Korisnik bez uloge dispečera pokuša pristupiti  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani  

### **Ishod:**
- Dispečer ima uvid u izvršeni rad  
- Podaci o radu su jasno prikazani  
- Omogućena je kontrola i verifikacija rada  
- Intervencija je spremna za zatvaranje ili dodatne akcije


## Zaključak

U ovom dokumentu definisani su ključni use case-ovi sistema za upravljanje servisnim intervencijama. Svaki use case detaljno opisuje interakciju između aktera i sistema, uključujući glavne i alternativne tokove, kao i očekivane ishode.

Ovakva specifikacija omogućava jasno razumijevanje funkcionalnosti sistema, olakšava dalji razvoj i implementaciju, te služi kao osnova za testiranje i validaciju sistema.
