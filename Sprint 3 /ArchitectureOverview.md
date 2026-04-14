# Architecture Overview

Kroz ovaj dokument opisan je i obrazložen izbor slojevite arhitekture.

Odabir slojevite arhitekture direktno je utemeljen na zahtjevima sistema:
1. Izolacija poslovne logike   
   Funkcionalnosti kao što su prioritizacija intervencija, planiranje izlazaka na teren i preraspodjela servisera predstavljaju složenu poslovnu logiku koja mora biti testabilna neovisno o korisničkom interfejsu.
2. Centralizovana primjena sigurnosnog modela  
   RBAC model zahtijeva dosljedno i jednoznačno provođenje provjere pristupa. U slojevitoj arhitekturi, ta provjera je locirana u aplikacijskom sloju i primjenjuje se konzistentno za sve zahtjeve, bez dupliciranja sigurnosne logike po prezentacijskim komponentama.
3. Neovisnost o izvoru podataka   
   Pristup podacima isključivo se odvija kroz repozitorij sloj, a nikad direktno iz prezentacijskih komponenti. Ova odluka osigurava da zamjena ili proširenje infrastrukture, na primjer prelazak na drugi mehanizam pohrane, zahtijeva izmjene samo u infrastrukturnom sloju, dok ostatak sistema ostaje nepromijenjen.
4. Paralelni razvoj unutar tima     
   Budući da svaki sloj ima jasno definisane granice i interfejse, članovi tima mogu raditi paralelno na različitim slojevima bez međusobnog blokiranja.
5. Podrška skalabilnosti    
    Slojevita arhitektura omogućava dodavanje novih modula ili integracija u kasnijim fazama razvoja bez strukturnih izmjena postojećeg koda.

U nastavku dokumenta ovaj segment je detaljno razrađen.

## 1. Opis arhitektonskog pristupa

 Odabrani arhitektonski stil je **slojevita (layered) arhitektura** s jasno definisanim i razdvojenim odgovornostima po slojevima. Svaka arhitektonska odluka izvedena je direktno iz konkretnog funkcionalnog ili nefunkcionalnog zahtjeva sistema, što prikazuje sljedeća tabela:

| Zahtjev sistema | Arhitektonska odluka |
| :--- | :--- |
| **4 uloge s različitim privilegijama** (PBI-002) | RBAC u aplikacijskom sloju + RLS politike u infrastrukturnom sloju |
| **Dostupnost na desktop i mobilnim uređajima** (NFR-013, NFR-014) | Vercel CDN + responzivni Next.js frontend bez dodatne instalacije |
| **Složena poslovna logika: prioritizacija, planiranje, dodjela** (PBI-010, PBI-011, PBI-012) | Izolacija u domenskom i aplikacijskom sloju, nezavisno od UI-a |
| **Sigurnost: hashiranje lozinki, HTTPS, zaštita sesija** (NFR-007, NFR-008, NFR-009) | Supabase Auth + RLS + automatski HTTPS kroz Vercel |
| **Evidencija historije aktivnosti i audit trail** (PBI-021) | Centralizirani Audit logger u aplikacijskom sloju, *HistorijaAktivnosti* entitet u domenskom sloju |
| **Pohrana slikovnih dokaza pri evidenciji rada** (PBI-017) | Supabase File Storage u infrastrukturnom sloju |
| **GDPR: minimalno prikupljanje i zaštita ličnih podataka** (EXT-ZAK-01) | *Privacy by Design* ugrađen u domenski model od početka razvoja |

Sistem koordinira četiri korisničke uloge s jasno razgraničenim ovlaštenjima i zasebnim poslovnim tokovima: klijenta, dispečera, servisera i administratora. Višeslojna arhitektura s jasno definiranim granicama između slojeva osigurava da se sigurnosna logika, poslovna pravila i mehanizmi pohrane podataka razvijaju i održavaju neovisno jedan od drugog, čime se postiže visok stepen fleksibilnosti i dugoročna održivost sistema.

Arhitektura je organizovana u četiri logička sloja: 
1. Presentation,
2. Application,
3. Domain i
4. Infrastructure.

Zavisnosti teku isključivo prema unutrašnjosti sistema, vanjski slojevi ovise o unutrašnjima, nikada obrnuto. Ovakva organizacija osigurava da promjena tehnološke implementacije u infrastrukturnom sloju, kao što je zamjena baze podataka ili servisa za autentifikaciju, ne uzrokuje izmjene u domenskoj ili prezentacijskoj logici.

Arhitektonski model implementiran je kroz odabrani tehnološki stack:

| Tehnologija | Sloj | Uloga u sistemu |
|---|---|---|
| **Next.js** | Prezentacijski + Aplikacijski | React komponente (UI) i API rute (`/api/v1/`) |
| **Supabase + PostgreSQL** | Infrastrukturni | Autentifikacija, RLS, file storage, baza podataka |
| **Vercel** | Deployment | HTTPS, globalni CDN, automatski deployment |

Next.js pokriva prezentacijski sloj putem React komponenti i aplikacijski sloj putem API ruta unutar /api/v1/, čineći prirodnu full-stack granicu unutar jednog okvira. Supabase + PostgreSQL čini infrastrukturni sloj sistema te donosi ugrađenu autentifikaciju, Row Level Security (RLS) i file storage, čime se sigurnosna osnova postiže bez pisanja dodatnog boilerplate koda. Vercel je platforma za deployment koja automatski osigurava HTTPS i globalni CDN, čime se direktno zadovoljavaju nefunkcionalni zahtjevi za sigurnošću komunikacije (NFR-009) i dostupnošću sistema (NFR-004).

## 2. Glavne komponente sistema
Sistem je organizovan u četiri arhitektonska sloja. Svaki sloj ima precizno definiranu granicu odgovornosti i komunicira isključivo s neposredno susjednim slojem, kroz jasno definirane interfejse.
```
├── PRESENTATION LAYER
│       Next.js stranice i React komponente
│       │
│       ├── Klijent UI          → Prijava kvara, pregled statusa
│       ├── Dispečer UI         → Dashboard, dodjela, prioritizacija
│       ├── Serviser UI         → Zadaci, evidencija rada
│       └── Admin UI            → Upravljanje korisničkim nalozima
│
│                        ↕ HTTP / REST API (/api/v1/...)
│
├── APPLICATION LAYER
│       Next.js API rute · poslovni tokovi · RBAC middleware
│       │
│       ├── Auth middleware      → Provjera JWT tokena i korisničke uloge
│       ├── Intervention service → Životni ciklus intervencije
│       ├── Assignment service   → Dodjela i preraspodjela servisera
│       └── Audit logger         → Evidencija historije aktivnosti
│
│                        ↕ Domenski entiteti
│
├── DOMAIN LAYER
│       Entiteti · poslovna pravila · validacija · tehnološki neovisno
│       │
│       ├── Zahtjev              → Prijava kvara od strane klijenta
│       ├── Intervencija         → Operativni zadatak dodijeljen serviseru
│       ├── Dodjela              → Veza između intervencije i servisera
│       ├── EvidencijaRada       → Unos vremena, materijala i ishoda
│       ├── Uposlenici           → Dispečeri i serviseri
│       └── HistorijaAktivnosti  → Audit trail svih promjena
│
│                        ↕ Repository pattern
│
└── INFRASTRUCTURE LAYER
       Supabase · PostgreSQL · Vercel
       │
       ├── PostgreSQL           → Primarna pohrana svih entiteta
       ├── Supabase Auth        → JWT sesije, hashiranje lozinki
       ├── RLS politike         → Kontrola pristupa na nivou baze
       ├── File Storage         → Slikovni dokazi evidencije rada
       └── Vercel               → CI/CD, HTTPS, globalni CDN
```

## 3. Odgovornosti komponenti

**Presentation layer** predstavlja jedinu tačku direktne interakcije između korisnika i sistema. 
- Implementiran je kroz Next.js stranice i React komponente, organizovane prema korisničkim ulogama definiranim u Product Visionu. Klijentski interfejs pruža funkcionalnosti prijave zahtjeva za servisnu intervenciju i praćenja statusa vlastite prijave.
- Dispečerski interfejs obuhvata pregled liste aktivnih intervencija, operativnu kontrolnu tablu s ključnim metrikama te ekrane za dodjelu, prioritizaciju i planiranje izlazaka na teren.
- Serviserski interfejs projektovan je s primarnim fokusom na mobilni prikaz, omogućavajući brz pristup dodijeljenim zadacima i obrazac za evidenciju izvršenog rada.
- Administratorski interfejs pokriva upravljanje korisničkim nalozima i ulogama. Svi tekstualni resursi eksternalizirani su iz komponenti, čime se osigurava arhitektonska osnova za buduću višejezičnost bez izmjena izvornog koda (EXT-ETI-02). Ovaj sloj ne sadržava poslovnu logiku, isključivo prima korisničke unose i prikazuje podatke dobijene od Application sloja.

---

**Application layer** realizuje se kroz Next.js API rute strukturirane prema RESTful principima unutar putanje /api/v1/. 
- Ovaj sloj koordinira poslovne tokove koji odgovaraju use caseovima specificiranim u projektnoj dokumentaciji. Ključne komponente su: Auth middleware, koji pri svakom pristiglom zahtjevu verificira JWT token i korisničku ulogu te blokira neovlašteni pristup prije bilo kakve dalje obrade (PBI-002, NFR-007, NFR-008); Intervention service, koji orkestrira cjelovit životni ciklus intervencije od kreiranja zahtjeva, određivanja prioriteta i dodjele servisera, do evidentiranja rada i formalnog zatvaranja; Assignment service, koji upravlja procesom dodjele i ponovne dodjele intervencije, uključujući scenarije odbijanja zadatka i preraspodjele (PBI-012, PBI-013, US-22, US-23); te Audit logger, koji se poziva po završetku svake akcije promjene stanja kako bi evidentirao identitet aktera, tip akcije i vremensku oznaku (PBI-021, EXT-ZAK-02). 
- Dependency Injection primjenjuje se u ovom sloju radi upravljanja zavisnostima, čime se postiže visoka testabilnost komponenti i mogućnost zamjene implementacija bez narušavanja poslovne logike.

---

**Domain layer** predstavlja jezgro sistema i jedini sloj koji je u potpunosti neovisan o vanjskim tehnologijama. 
- U ovom sloju definirani su svi entiteti identificirani u Domain Modelu: Zahtjev, Intervencija, Dodjela, EvidencijaRada, Uposlenici, HistorijaAktivnosti, Napomena, Lokacija, Prioritet i Status.
- Ovaj sloj nema direktnu spoznaju o Supabaseu, PostgreSQL-u niti Next.js-u. Sva poslovna pravila enkapsulirana su unutar ovog sloja. Izolacija domenske logike osigurava da izmjena infrastrukturnih tehnologija ili prezentacijskih mehanizama ne zahtijeva modifikaciju poslovnih pravila, što je preduvjet za dugoročnu održivost sistema.

---

**Infrastructure layer** realizuje sve tehničke zavisnosti koje domenski sloj zahtijeva, posredstvom Repository patterna koji apstrahuje interakciju s mehanizmima pohrane podataka. 
- Supabase PostgreSQL pohrana služi kao primarni mehanizam perzistencije domenskih entiteta. Row-Level Security politike konfigurirane su tako da enforciraju pristupna prava direktno na razini baze podataka, čime se uspostavlja drugi sloj zaštite uz aplikacijsku RBAC implementaciju (NFR-008, NFR-010).
- Supabase Auth upravlja životnim ciklusom JWT sesija, kriptografskim hashiranjem lozinki i istekom sesija (NFR-009).
- Supabase File Storage koristi se za pohranu slikovnih dokaza pri evidenciji izvršenog rada (PBI-017). Vercel platforma osigurava automatiziran deployment s GitHub integracijom, HTTPS enkripciju komunikacije i globalnu CDN distribuciju, čime se direktno adresiraju zahtjevi vezani za performanse (NFR-001, NFR-002) i sigurnost prijenosa podataka (NFR-010, EXT-ZAK-04).

--- 
## 4. Tok podataka i interakcija

Svaka korisničku akcija u sistemu prolazi kroz jasno definisan višeslojni tok: počinje u prezentacijskom sloju, nastavlja se u aplikacijskom sloju gdje se primjenjuju sigurnosna pravila i poslovna logika, domenski sloj validira poslovne koncepte i statusne tranzicije, a infrastrukturni sloj osigurava trajnu pohranu i revizijski trag. Na isti način prolaze i dispečerske i serviserske akcije — svaka akcija ima svog ljudskog pokretača, i svaki tok završava konkretnom promjenom stanja sistema uz potpunu evidenciju.

> **Napomena o dubini toka:** Neke akcije se u potpunosti rješavaju unutar jednog sloja (npr. prikaz podataka koji je već učitan u prezenacijskom sloju), neke prelaze kroz dva sloja (npr. validacija forme u prezentacijskom sloju pa pohrana u infrastrukturnom), dok se najsloženiji poslovni tokovi protežu kroz sva četiri sloja.

---

### 4.1 Tok prijave zahtjeva za servisnu intervenciju (US-05)

**Ko pokreće akciju:** Korisnik usluge koji želi prijaviti kvar.

Korisnik usluge otvara formu za prijavu kvara u mobilnom ili desktop pretraživaču. Popunjava obavezna polja — opis problema, lokaciju i tip kvara — i šalje zahtjev.

**Prezentacijski sloj** prima unos i primjenjuje prvu liniju validacije direktno u interfejsu: provjerava da li su obavezna polja popunjena i da li je format lokacije ispravan. Ako validacija ne prođe, greška se prikazuje korisniku bez ijednog zahtjeva prema serveru. Tek nakon uspješne klijentske validacije, interfejs šalje HTTP `POST /api/v1/interventions` zahtjev s JWT tokenom u `Authorization` headeru.

**Aplikacijski sloj** prima zahtjev i odmah pokreće autentifikacijsku i autorizacijsku provjeru: Auth middleware verificira JWT token, a RBAC middleware potvrđuje da korisnik ima ulogu klijenta. Ako provjera ne prođe — zahtjev je blokiran ovdje, korisnik dobija odgovarajuću grešku. Intervention service zatim provodi server-side validaciju obaveznih polja neovisno o klijentskoj validaciji (NFR-005). Ovo je ključno sigurnosno pravilo: server nikad ne smije slijepo vjerovati unosu s klijenta.

**Domenski sloj** kreira novi entitet `Zahtjev` i automatski mu dodjeljuje početni status `Na čekanju` (US-05 AC4). Entitet se veže za korisnički nalog koji ga je podnio (US-05 AC5). Ovdje se primjenjuju sva poslovna pravila vezana za životni ciklus zahtjeva.

**Infrastrukturni sloj** upisuje novi entitet u PostgreSQL putem Supabase klijenta. RLS politike provjeravaju pristup na nivou baze — drugi sloj zaštite. Pohrana se potvrđuje povratnom informacijom prema gore.

**Aplikacijski sloj** vraća HTTP 201 Created s ID-em novog zahtjeva. **Prezentacijski sloj** prikazuje korisniku potvrdu da je zahtjev uspješno evidentiran i da čeka obradu.

Korisnik sada može pregledati vlastiti zahtjev i pratiti njegov status (US-06).

```
Korisnik usluge
      │ popunjava formu za prijavu kvara
      ▼
[PREZENTACIJSKI SLOJ]
  → klijentska validacija forme (obavezna polja, format lokacije)
  → HTTP POST /api/v1/interventions + JWT token
      │
      ▼
[APLIKACIJSKI SLOJ]
  → Auth middleware: verifikacija JWT tokena
  → RBAC middleware: provjera uloge klijenta
  → Intervention service: server-side validacija polja (NFR-005)
      │
      ▼
[DOMENSKI SLOJ]
  → kreiranje entiteta Zahtjev
  → dodjela statusa "Na čekanju" (US-05 AC4)
  → vezivanje za korisnički nalog (US-05 AC5)
      │
      ▼
[INFRASTRUKTURNI SLOJ]
  → Repository: INSERT u PostgreSQL putem Supabase
  → RLS politike: provjera pristupa na nivou baze
      │
      ▼
[APLIKACIJSKI SLOJ]
  → HTTP 201 Created + ID novog zahtjeva
      │
      ▼
[PREZENTACIJSKI SLOJ]
  → prikaz potvrde korisniku
```

---

### 4.2 Tok određivanja prioriteta i dodjele intervencije serviseru (US-12, US-09, US-11)

**Ko pokreće akciju:** Dispečer koji obrađuje pristigle zahtjeve.

Dispečer se prijavljuje u sistem i na kontrolnoj tabli (US-31) odmah vidi sažet pregled intervencija po fazama. Otvara listu otvorenih zahtjeva (US-07), pregleda detalje konkretne intervencije (US-08) i donosi odluku o prioritetu i dodjeli.

**Određivanje prioriteta (US-12):**

Dispečer odabire prioritet intervencije (hitno, visoko, srednje, nisko) i potvrđuje izbor.

**Prezentacijski sloj** šalje HTTP `PATCH /api/v1/interventions/{id}/priority` s JWT tokenom. **Aplikacijski sloj** verificira token i potvrđuje ulogu dispečera. Intervention service primjenjuje poslovnu logiku prioritizacije. **Domenski sloj** ažurira polje prioriteta na entitetu Intervencija. **Infrastrukturni sloj** izvršava `UPDATE` i bilježi promjenu u `HistorijaAktivnosti`. Dispečerski interfejs osvježava prikaz.

**Planiranje termina (US-11):**

Dispečer pregleda kalendar dostupnosti servisera i odabira termin izlaska na teren.

**Prezentacijski sloj** prikazuje dostupne termine. **Aplikacijski sloj** prima odabir termina — Assignment service provjerava dostupnost servisera i odsustvo konflikata termina (US-11). **Domenski sloj** bilježi planirani termin na entitetu Intervencija. **Infrastrukturni sloj** pohranjuje izmjenu i dodaje zapis u `HistorijaAktivnosti`.

**Dodjela serviseru (US-09):**

Dispečer iz liste dostupnih servisera odabira odgovornog izvršioca i potvrđuje dodjelu.

**Prezentacijski sloj** šalje HTTP `PATCH /api/v1/interventions/{id}/assign` s JWT tokenom. **Aplikacijski sloj** verificira token, potvrđuje ulogu dispečera i poziva Assignment service koji provjerava dostupnost servisera. **Domenski sloj** kreira entitet `Dodjela`, ažurira status intervencije u `Dodijeljeno` i evidentira promjenu. **Infrastrukturni sloj** izvršava `UPDATE` na intervenciji i `INSERT` u `HistorijaAktivnosti` s identitetom dispečera i vremenskom oznakom (EXT-ZAK-02, US-32). **Aplikacijski sloj** vraća HTTP 200 OK. Serviser sada vidi novi zadatak u svom pregledu dodijeljenih intervencija (US-15).

```
Dispečer
      │ pregleda listu otvorenih zahtjeva (US-07, US-08)
      │ određuje prioritet → PATCH /api/v1/interventions/{id}/priority
      │ planira termin    → Assignment service: provjera dostupnosti (US-11)
      │ dodjeljuje serviseru → PATCH /api/v1/interventions/{id}/assign
      ▼
[APLIKACIJSKI SLOJ]
  → Auth + RBAC: provjera uloge dispečera
  → Intervention service: primjena logike prioritizacije
  → Assignment service: provjera dostupnosti i konflikata termina (US-11)
      │
      ▼
[DOMENSKI SLOJ]
  → ažuriranje prioriteta na Intervenciji
  → kreiranje entiteta Dodjela
  → promjena statusa: "Na čekanju" → "Dodijeljeno"
      │
      ▼
[INFRASTRUKTURNI SLOJ]
  → UPDATE status intervencije
  → INSERT u HistorijaAktivnosti (ko, kada, šta)
      │
      ▼
[PREZENTACIJSKI SLOJ]
  → osvježen prikaz dispečera
  → novi zadatak vidljiv serviseru (US-15)
```

---

### 4.3 Tok prihvatanja zadatka i ažuriranja statusa intervencije (US-22, US-23, US-14)

**Ko pokreće akciju:** Serviser kome je zadatak dodijeljen.

Serviser otvara mobilni interfejs i vidi listu dodijeljenih intervencija (US-15). Pregleda detalje zadatka — opis kvara, lokaciju, planirani termin, napomene dispečera (US-16). Donosi odluku: prihvata ili odbija zadatak.

**Prihvatanje zadatka (US-22):**

Serviser pritisne "Prihvati zadatak".

**Prezentacijski sloj** šalje HTTP `PATCH /api/v1/interventions/{id}/accept`. **Aplikacijski sloj** verificira token i RBAC middleware provjerava da je upravo taj serviser dodijeljen toj konkretnoj intervenciji — ne bilo koji serviser, već tačno taj. **Domenski sloj** primjenjuje statusnu tranziciju: `Dodijeljeno → Prihvaćeno`. **Infrastrukturni sloj** bilježi promjenu s vremenskom oznakom u `HistorijaAktivnosti`. Dispečer na svojoj kontrolnoj tabli vidi da je serviser preuzeo zadatak.

**Odbijanje zadatka (US-23):**

Serviser pritisne "Odbij zadatak" i unese razlog odbijanja.

**Prezentacijski sloj** šalje zahtjev s razlogom odbijanja. **Aplikacijski sloj** prima odbijanje — Assignment service registruje razlog i status intervencije se vraća u stanje koje zahtijeva ponovnu dodjelu (US-29). **Domenski sloj** bilježi odbijanje i razlog na entitetu Dodjela. **Infrastrukturni sloj** ažurira status i dodaje zapis u `HistorijaAktivnosti`. Dispečer dobija informaciju da je zadatak odbijen i može dodijeliti drugog servisera (US-28).

**Ažuriranje statusa tokom rada (US-14):**

Serviser je na terenu i ažurira status kako rad napreduje.

**Prezentacijski sloj** šalje HTTP `PATCH /api/v1/interventions/{id}/status` s novim statusom i JWT tokenom. **Aplikacijski sloj** verificira token i RBAC middleware provjerava da je taj serviser dodijeljen toj konkretnoj intervenciji. Intervention service provjerava da li je zatražena statusna tranzicija dozvoljena prema definisanom životnom ciklusu intervencije:

```
Na čekanju → Dodijeljeno → Prihvaćeno → U toku → Završeno
```

Svaka tranzicija van ovog redoslijeda je odbijena na aplikacijskom sloju. **Domenski sloj** primjenjuje novu tranziciju. **Infrastrukturni sloj** izvršava `UPDATE` na statusu i `INSERT` u `HistorijaAktivnosti` s identitetom servisera i vremenskom oznakom (US-32). Dispečer u realnom vremenu prati napredak na kontrolnoj tabli (US-13).

```
Serviser
      │ pregleda dodijeljene intervencije (US-15, US-16)
      │ prihvata ili odbija zadatak (US-22 / US-23)
      │ ažurira status tokom rada → PATCH /api/v1/interventions/{id}/status
      ▼
[APLIKACIJSKI SLOJ]
  → Auth + RBAC: provjera da je taj serviser dodijeljen toj intervenciji
  → Intervention service: validacija statusne tranzicije
    (Na čekanju → Dodijeljeno → Prihvaćeno → U toku → Završeno)
      │
      ▼
[DOMENSKI SLOJ]
  → primjena dozvoljene statusne tranzicije
  → evidencija odbijanja + razloga (US-23)
      │
      ▼
[INFRASTRUKTURNI SLOJ]
  → UPDATE status intervencije
  → INSERT u HistorijaAktivnosti (ko, kada, šta) (US-32)
      │
      ▼
[PREZENTACIJSKI SLOJ]
  → osvježen prikaz servisera
  → dispečer vidi ažurirani status na kontrolnoj tabli (US-13)
```

---

### 4.4 Tok evidentiranja rada i zatvaranja intervencije (US-17, US-24, US-25)

**Ko pokreće akciju:** Serviser koji je završio rad na terenu, a zatim dispečer koji formalno zatvara proces.

Serviser je završio intervenciju na terenu. Otvara formu za evidenciju i unosi utrošeno vrijeme, korištene materijale, opis obavljenih aktivnosti i opciono fotografije kao dokaze izvršenog rada (US-17, PBI-017).

**Prezentacijski sloj** šalje HTTP `POST /api/v1/interventions/{id}/work-log` s podacima o radu i eventualnim slikovnim dokazima. **Aplikacijski sloj** verificira token i potvrđuje ulogu servisera. Intervention service validira unesene podatke. **Domenski sloj** kreira entitet `EvidencijaRada` i vezuje ga za intervenciju. **Infrastrukturni sloj** pohranjuje zapis u PostgreSQL, a slikovne dokaze u Supabase File Storage. Zapis se dodaje u `HistorijaAktivnosti`. Serviser ažurira status na `Završeno`.

**Dispečer pregleda evidentirani rad (US-24):**

Dispečer otvara intervenciju i pregleda sve što je serviser evidentirao — opis rada, utrošeno vrijeme, materijale i slikovne dokaze. Ova provjera je preduvjet za zatvaranje: dispečer mora biti siguran da je problem stvarno riješen.

**Zatvaranje intervencije (US-25):**

Dispečer potvrđuje zatvaranje. **Prezentacijski sloj** šalje HTTP `PATCH /api/v1/interventions/{id}/close`. **Aplikacijski sloj** verificira token i potvrđuje ulogu dispečera. Intervention service provjerava da su svi preduvjeti za zatvaranje ispunjeni — evidencija rada mora postojati. **Domenski sloj** primjenjuje finalnu statusnu tranziciju na `Zatvoreno` i zaključava intervenciju za dalje izmjene. **Infrastrukturni sloj** finalizira sve zapise i dodaje završni zapis u `HistorijaAktivnosti` s identitetom dispečera, datumom i vremenom zatvaranja. Korisnik koji je prijavio kvar može vidjeti da je njegova intervencija zatvorena (US-06).

```
Serviser
      │ evidentira rad: vrijeme, materijal, opis, slike (US-17)
      │ ažurira status na "Završeno"
      ▼
[APLIKACIJSKI SLOJ]
  → validacija unesenih podataka o radu
      │
      ▼
[DOMENSKI SLOJ]
  → kreiranje entiteta EvidencijaRada
  → vezivanje za Intervenciju
      │
      ▼
[INFRASTRUKTURNI SLOJ]
  → pohrana u PostgreSQL
  → slikovni dokazi → Supabase File Storage (PBI-017)
  → INSERT u HistorijaAktivnosti

Dispečer
      │ pregleda evidentirani rad (US-24)
      │ potvrđuje zatvaranje → PATCH /api/v1/interventions/{id}/close
      ▼
[APLIKACIJSKI SLOJ]
  → provjera preduvjeta: evidencija rada mora postojati
      │
      ▼
[DOMENSKI SLOJ]
  → finalna statusna tranzicija: "Završeno" → "Zatvoreno"
  → zaključavanje intervencije za izmjene
      │
      ▼
[INFRASTRUKTURNI SLOJ]
  → finalizacija zapisa
  → INSERT završni zapis u HistorijaAktivnosti (dispečer, datum, US-32)
      │
      ▼
[PREZENTACIJSKI SLOJ]
  → korisnik vidi status "Zatvoreno" na svom zahtjevu (US-06)
```

---

### 4.5 Autentifikacijski tok (US-02, US-03)

**Ko pokreće akciju:** Bilo koji registrovani korisnik sistema koji pristupa sistemu.

Korisnik otvara stranicu za prijavu i unosi email i lozinku. Ovo je polazna tačka za sve uloge — klijent, dispečer, serviser i administrator imaju isti mehanizam prijave, ali se nakon uspješne autentifikacije preusmjeravaju na interfejse specifične za svoju ulogu.

**Prezentacijski sloj** šalje `POST /api/v1/auth/login`. **Aplikacijski sloj** prosljeđuje zahtjev Supabase Auth servisu. **Infrastrukturni sloj** (Supabase Auth) provjerava bcrypt hash lozinke; pri neuspjehu vraća generičku poruku o grešci kako bi se spriječilo otkrivanje validnih email adresa (NFR-007). Pri uspjehu, Supabase Auth izdaje JWT token s rokom trajanja 8 sati (NFR-008). **Aplikacijski sloj** čita korisničku ulogu iz tokena i preusmjerava korisnika na odgovarajući interfejs. **Prezentacijski sloj** pohranjuje token i sve naredne akcije prenose JWT u `Authorization` headeru — Auth middleware verificira token pri svakom zahtjevu, a RLS politike na bazi osiguravaju drugi sloj zaštite (NFR-009).

Pri odjavi (US-03), **prezentacijski sloj** inicira invalidaciju tokena, sesija se uništava i korisnik se preusmjerava na stranicu za prijavu.

```
Korisnik (bilo koja uloga)
      │ unosi email i lozinku
      │ POST /api/v1/auth/login
      ▼
[APLIKACIJSKI SLOJ]
  → prosljeđivanje prema Supabase Auth
      │
      ▼
[INFRASTRUKTURNI SLOJ — Supabase Auth]
  → provjera bcrypt hash lozinke
  → generička greška pri neuspjehu (NFR-007)
  → JWT token (8h trajanje) pri uspjehu (NFR-008)
      │
      ▼
[APLIKACIJSKI SLOJ]
  → čitanje uloge iz JWT tokena
  → preusmjeravanje na interfejs prema ulozi
      │
      ▼
[PREZENTACIJSKI SLOJ]
  → pohrana JWT tokena
  → svaki naredni zahtjev: JWT u Authorization headeru
  → Auth middleware verificira token pri svakom zahtjevu
  → RLS politike: drugi sloj zaštite (NFR-009)
```

---

### 4.6 Komunikacijski kanali

| Komunikacijski kanal | Namjena | Protokol |
|---|---|---|
| Korisnik ↔ Prezentacijski sloj | Interakcija s UI-om, unos podataka, prikaz statusa i poruka | HTTPS / Browser |
| Prezentacijski sloj ↔ Aplikacijski sloj | CRUD operacije, autentifikacija, ažuriranje statusa | HTTPS / REST API (`/api/v1/`) |
| Aplikacijski sloj ↔ Infrastrukturni sloj | Čitanje i pisanje poslovnih podataka putem Repository sloja | HTTPS (Supabase klijent) |
| Aplikacijski sloj ↔ Supabase Auth | Verifikacija JWT tokena, upravljanje sesijama | HTTPS (Supabase Auth) |
| Aplikacijski sloj ↔ HistorijaAktivnosti | Evidentiranje svih promjena na intervencijama | Interni servisni poziv (Audit logger) |
| Infrastrukturni sloj ↔ PostgreSQL | Perzistencija podataka, RLS provjere pristupa | SQL (interno) |
| Infrastrukturni sloj ↔ File Storage | Pohrana slikovnih dokaza evidentiranog rada (PBI-017) | HTTPS (Supabase Storage) |

---

### 4.7 Vizualni prikaz: koje akcije ostaju u jednom sloju, a koje se protežu kroz sve slojeve

Nije svaka akcija jednako "duboka". Neke se rješavaju unutar jednog sloja i nikad ne dolaze do baze, neke prelaze kroz dva sloja, a puni poslovni tokovi protežu se kroz sva četiri. Sljedeći primjeri to ilustruju:

**Primjer A — Akcija unutar jednog sloja:**
Korisnik otvara pregled vlastitog zahtjeva (US-06). Ako su podaci već učitani i prikazani u interfejsu, jedina aktivnost je u prezentacijskom sloju — prikaz već dostupnih podataka. Nema HTTP zahtjeva, nema poziva prema serveru.

**Primjer B — Akcija kroz dva sloja:**
Serviser otvara stranicu sa detaljima zadatka (US-16). Prezentacijski sloj šalje zahtjev za podatke, aplikacijski sloj verificira token i dohvaća podatke iz infrastrukturnog sloja, vraća ih u prezentacijski sloj koji ih prikazuje. Domenski sloj nije uključen jer nema poslovne logike — samo čitanje postojećeg entiteta.

**Primjer C — Akcija kroz sva četiri sloja:**
Dispečer dodjeljuje intervenciju serviseru (US-09). Tok prolazi kroz: prezentacijski sloj (UI akcija i HTTP zahtjev) → aplikacijski sloj (autentifikacija, autorizacija, Assignment service, provjera dostupnosti) → domenski sloj (kreiranje entiteta Dodjela, statusna tranzicija, poslovna pravila) → infrastrukturni sloj (pohrana u bazu, zapis u HistorijaAktivnosti, RLS provjere).

```
┌─────────────────────────────────────────────────────────────────────┐
│  PRIMJER A: Pregled podataka (US-06)                                │
│                                                                     │
│  [PREZENTACIJSKI]  ←── samo prikaz već učitanih podataka           │
│       ↕                                                             │
│  [APLIKACIJSKI]    ←── GET podaci, verifikacija tokena             │
│       ↕                                                             │
│  [DOMENSKI]        ←── nije uključen (samo čitanje)                │
│       ↕                                                             │
│  [INFRASTRUKTURNI] ←── SELECT iz baze                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  PRIMJER B: Ažuriranje statusa (US-14)                              │
│                                                                     │
│  [PREZENTACIJSKI]  ←── PATCH /status, korisnikov unos              │
│       ↕                                                             │
│  [APLIKACIJSKI]    ←── Auth + RBAC + validacija tranzicije         │
│       ↕                                                             │
│  [DOMENSKI]        ←── primjena statusne tranzicije                │
│       ↕                                                             │
│  [INFRASTRUKTURNI] ←── UPDATE + INSERT u HistorijaAktivnosti       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  PRIMJER C: Dodjela intervencije serviseru (US-09)                  │
│             → Najsloženiji tok, prolazi kroz SVA ČETIRI sloja       │
│                                                                     │
│  [PREZENTACIJSKI]  ←── UI akcija + PATCH /assign + JWT             │
│       ↕                                                             │
│  [APLIKACIJSKI]    ←── Auth + RBAC + Assignment service            │
│                        provjera dostupnosti servisera (US-11)       │
│       ↕                                                             │
│  [DOMENSKI]        ←── kreiranje entiteta Dodjela                  │
│                        statusna tranzicija: Na čekanju→Dodijeljeno  │
│       ↕                                                             │
│  [INFRASTRUKTURNI] ←── UPDATE + INSERT HistorijaAktivnosti         │
│                        RLS provjera pristupa                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Ključne tehničke odluke

| Odluka | Razlog | Odbijena alternativa | Zašto odbijena |
|---|---|---|---|
| Layered (slojevita) arhitektura | Jasna podjela odgovornosti između slojeva, paralelni rad tima, podrška modularnosti (NFR-016). Svaki sloj komunicira isključivo s neposredno susjednim slojem. | Mikroservisi | Zahtijeva zasebnu infrastrukturu po servisu (API gateway, service discovery) — prevelik overhead za tim od 8 studenata i ograničen rok (ORG-ISP-01) |
| Next.js kao full-stack okvir | Pokriva i UI (React) i API rute unutar jednog projekta. Vercel automatski osigurava HTTPS, globalni CDN i preview deploymente za svaki pull request (NFR-010, NFR-004, ORG-IMP-02). | Odvojen React frontend + Express backend | Dupla infrastruktura i složeniji deployment bez konkretne koristi za MVP obim |
| Supabase kao infrastrukturna platforma | Dolazi s ugrađenim bcrypt hashiranjem (NFR-007), JWT sesijama s istekom (NFR-008), RLS politikama (NFR-009) i file storageom za slikovne dokaze (PBI-017). Podaci pohranjeni unutar EU (EXT-ZAK-01). Besplatan plan primjeren MVP-u. | Vlastiti auth sistem | Zahtijeva opsežno testiranje sigurnosnih rubnih slučajeva i razvojno vrijeme koje tim nema |
| REST API | Jednostavan za implementaciju i testiranje. Next.js nativno podržava API rute. Bruno kolekcije verzionirane u repozitoriju (ORG-STD-03). | GraphQL | Dodaje složenost schema definicije i resolver logike bez koristi za MVP — svi podaci se dohvataju prema predvidljivim obrascima |
| Repository pattern | Izoluje domensku logiku od infrastrukture. Omogućava unit testiranje s mock repozitorijima bez stvarne baze (ORG-STD-02, NFR-016). | Direktni Supabase pozivi u komponentama | Veže poslovnu logiku za infrastrukturnu implementaciju; onemogućava testiranje i povećava dupliciranje koda |
| Dependency Injection (DI) | Servisi primaju zavisnosti izvana umjesto da ih kreiraju direktno. Visoka testabilnost Application layera (Intervention service, Assignment service, Audit logger). Omogućava zamjenu implementacija bez izmjene poslovne logike (NFR-016). | Direktno kreiranje zavisnosti unutar klasa | Kruta vezanost između komponenti; onemogućava unit testiranje bez stvarnih servisa |
| JWT autentifikacija (Supabase Auth) | Stateless pristup — bez server-side sesija. Token se verificira pri svakom zahtjevu u Auth middlewareu. Istek nakon 8 sati neaktivnosti (NFR-008). | Session-based autentifikacija | Zahtijeva server-side pohranivanje sesija što komplicira skaliranje i nije u skladu s Supabase ekosistemom |
| HTTPS / TLS 1.2+ | Sva komunikacija između klijenta i servera enkriptira se. HTTP zahtjevi automatski se preusmjeravaju na HTTPS statusnim kodom 301. Vercel to osigurava automatski (NFR-010). | HTTP bez enkripcije | Nije prihvatljivo — podaci korisnika i JWT tokeni bi bili izloženi (NFR-010) |
| Strategija testiranja: Jest + Playwright | Jest pokriva unit testove poslovne logike (Domain i Application layer); Playwright pokriva E2E testove kritičnih tokova. Ciljna pokrivenost 40–50% za ključnu logiku (ORG-STD-02). | Isključivo ručno testiranje | Nije skalabilno kroz sprintove 6–10; regresijske greške teško uočljive bez automatizacije |

---

## 6. Ograničenja i rizici arhitekture

| Rizik / Ograničenje | Utjecaj | Vjerovatnoća | Mitigacija |
|---|---|---|---|
| Ovisnost o Supabase platformi | Visok | Niska | Repository pattern izolira Infrastructure layer od ostatka sistema. Zamjena platforme zahvata samo jedan sloj. Besplatan plan zadovoljava MVP zahtjeve (ORG-IMP-02). |
| Ovisnost o Vercel platformi | Srednji | Niska | Vercel nudi besplatan plan za studentske projekte i automatski HTTPS. Migracija na drugi hosting bi zahtijevala rekonfiguraciju CI/CD-a, ali ne bi zahvatila poslovnu logiku. |
| Sistem podržava jednu organizaciju (single-tenant) | Srednji | Niska | ProductVision eksplicitno definiše MVP za jednu organizaciju. Proširenje na višetenantni model zahtijevalo bi izmjenu sheme baze (tenant_id) i RLS politika — ostaje za post-MVP fazu. |
| Degradacija performansi pri velikom broju korisnika | Visok | Srednja | NFR-003 propisuje podršku za 50 istovremenih korisnika. Vercel CDN i Supabase connection pooling ublažavaju problem u okviru MVP-a. Monitoring putem UptimeRobot (NFR-004). |
| Ograničena testna pokrivenost | Srednji | Srednja | Ciljna pokrivenost 40–50% za ključnu poslovnu logiku (ORG-STD-02). Fokus: prijava zahtjeva (US-05), određivanje prioriteta (US-12), dodjela servisera (US-09), ažuriranje statusa (US-14), zatvaranje intervencije (US-25). |
| RLS politike kao jedina linija autorizacije na bazi | Visok | Srednja | RBAC middleware u Application layeru je prvi sloj autorizacije. RLS je redundantni drugi sloj. NFR-009 propisuje obavezno logiranje svakog pokušaja neovlaštenog pristupa s HTTP 403. |
| Nema offline podrške | Srednji | Visoka | Sistem zahtijeva aktivnu internet konekciju. Svjesno ograničenje MVP-a navedeno u ProductVision. Pretpostavka dostupnosti konekcije dokumentovana je kao projektna pretpostavka. |
| Neusklađenost RBAC pravila između frontend i backend sloja | Visok | Srednja | Backend je jedini autoritativni izvor za autorizaciju. Frontend skriva UI elemente radi korisničkog iskustva, ali ne štiti podatke — zaštita je uvijek na API sloju (NFR-009). |

---

## 7. Otvorena pitanja

| # | Pitanje | Prioritet | Komentar |
|---|---|---|---|
| 1 | Koji mehanizam koristiti za notifikacije servisera i dispečera? | Visok | StakeholderMap navodi pravovremene notifikacije kao ključno očekivanje. US-23 pominje automatsku notifikaciju dispečeru pri odbijanju zadatka, a US-09 i US-22 pretpostavljaju obavještavanje servisera pri dodjeli. Nije definirano: Supabase Realtime, email ili push notifikacije. Niti jedan PBI u backlogu trenutno ne implementira ovaj mehanizam. |
| 2 | Kako implementirati SLA praćenje i eskalacijski workflow? | Srednji | StakeholderMap definiše menadžera koji prati SLA kršenja i KPI metrike. Niti jedan NFR niti PBI ne implementira automatsko SLA praćenje. Zahtijevalo bi proširenje domenskog modela (SLA pravila, eskalacijski statusi) i novi Application service. Ostaje za post-MVP fazu. |
| 3 | Kada i kako uvesti višeorganizacijsku (multitenant) podršku? | Nizak | IT tim (StakeholderMap) navodi proširenje na više lokacija i timova kao buduće tehničko očekivanje. Trenutna arhitektura to ne podržava. Migracija zahtijeva izmjenu sheme baze (tenant_id kolona), RLS prilagodbe i zasebni sprint — van MVP scopea. |
| 4 | Da li uvesti offline podršku za servisere na terenu? | Nizak | NFR-013 zahtijeva responzivnost na mobilnim uređajima, ali ProductVision isključuje offline rad iz MVP-a. Terenska realnost servisera s ograničenim signalom ostavlja ovo kao otvoreno pitanje za buduće faze. Potencijalno rješenje: Service Worker / PWA pristup. |

---
