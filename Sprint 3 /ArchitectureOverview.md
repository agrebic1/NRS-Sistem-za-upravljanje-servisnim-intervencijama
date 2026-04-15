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

Svaka akcija u sistemu prolazi kroz jasno definisan put: počinje u korisničkom interfejsu, nastavlja se kroz slojeve koji provjeravaju ko je korisnik i šta smije raditi, primjenjuje poslovna pravila, i završava trajnom pohranjem podataka uz potpunu evidenciju svake promjene. Ovaj put nije slučajan, svaki korak postoji zbog konkretnog zahtjeva iz dokumentacije. Bez provjere identiteta nema sigurnosti (NFR-007, NFR-008). Bez provjere uloge dispečer bi mogao raditi ono što smije samo administrator (PBI-002). Bez evidencije promjena nema revizijskog traga koji zakon zahtijeva (EXT-ZAK-02).

Nije svaka akcija jednako složena. Neke se završe unutar jednog sloja. Primjerice, pregled podataka koji su već prikazani u interfejsu ne zahtijeva nikakav poziv prema serveru. Neke prelaze kroz dva sloja, čitanje podataka o intervenciji zahtijeva provjeru identiteta i dohvatanje iz baze, ali ne uključuje nikakvu poslovnu logiku. Najsloženiji tokovi, poput dodjele servisera, prolaze kroz sve četiri sloja jer uključuju sigurnosne provjere, poslovnu logiku provjere dostupnosti, kreiranje novih poslovnih entiteta i trajnu pohranu s evidencijom.

---

### 4.1 Tok dodjele intervencije serviseru (US-09, US-11, US-12)

**Ko pokreće akciju:** Dispečer koji obrađuje pristigle zahtjeve klijenata.

Dispečer se prijavljuje u sistem i na svojoj kontrolnoj tabli odmah vidi sažet pregled svih otvorenih intervencija po fazama (US-31). Otvara listu zahtjeva (US-07), pregleda detalje konkretne intervencije (US-08) i donosi tri međusobno zavisne odluke: koliki je prioritet kvara, kada serviser izlazi na teren, i koji serviser je odgovaran.

Ove tri odluke su namjerno razdvojene u zasebne korake jer svaka ima svoju poslovnu logiku. Prioritet određuje redoslijed obrade i ne zahtijeva provjeru dostupnosti servisera. Planiranje termina zahtijeva uvid u kalendar i provjeru da li odabrani serviser već ima zakazan izlazak u to vrijeme, bez ove provjere sistem bi dozvolio konflikt termina (US-11). Tek nakon što su prioritet i termin definisani, dodjela serviseru ima smisla jer dispečer tada zna koga traži i kada.

**Određivanje prioriteta:**

Dispečer odabira prioritet intervencije i potvrđuje izbor. Korisnikov interfejs šalje zahtjev za izmjenu prioriteta prema sistemu. Sigurnosni sloj provjerava identitet korisnika i potvrđuje da ima ulogu dispečera, bez ove provjere bilo ko bi mogao mijenjati prioritete. Sloj poslovne logike primjenjuje pravila prioritizacije. Podaci se ažuriraju i svaka promjena se bilježi uz zapis o tome ko je, kada i šta promijenio (EXT-ZAK-02).

**Planiranje termina:**

Dispečer pregleda kalendar dostupnosti i odabira termin izlaska. Sloj poslovne logike provjerava dostupnost servisera i odsustvo konflikata s već zakazanim terminima (US-11). Ova provjera je ključna, bez nje sistem ne bi mogao garantovati da dodjela ima smisla u praksi. Planirani termin se bilježi na intervenciji.

## Dispečer

- pregleda otvorene intervencije (US-07, US-08)  
- određuje prioritet  
- planira termin izlaska na teren  
- dodjeljuje serviseru  

---

## [SIGURNOSNI SLOJ]

- provjera identiteta korisnika  
- provjera da korisnik ima ulogu dispečera  

---

## [SLOJ POSLOVNE LOGIKE]

- primjena pravila prioritizacije  
- provjera dostupnosti servisera i konflikata termina (US-11)  
- provjera da je serviser stvarno slobodan za dodjelu  

---

## [SLOJ POSLOVNIH ENTITETA]

- ažuriranje prioriteta na intervenciji  
- kreiranje evidencije dodjele  
- promjena statusa: `"Na čekanju"` → `"Dodijeljeno"`  

---

## [SLOJ POHRANE]

- trajno snimanje svih izmjena  
- bilježenje: ko je dodijelio, kada, kome (EXT-ZAK-02, US-32)  

---

## [KORISNIKOV INTERFEJS]

- osvježen prikaz dispečera  
- novi zadatak vidljiv serviseru u njegovom pregledu (US-15)  

---

## Zašto ovaj redoslijed i ne neki drugi

Sigurnosna provjera mora biti prva jer je besmisleno primjenjivati poslovnu logiku na zahtjev koji dolazi od neovlaštene osobe.  

Poslovna logika mora doći prije kreiranja entiteta jer ne smijemo kreirati dodjelu ako serviser nije dostupan.  

Pohrana je uvijek zadnja jer se snima samo ono što je prošlo sve prethodne provjere.

### 4.2 Komunikacijski kanali

| Komunikacijski kanal | Namjena | Protokol |
|---|---|---|
| Korisnik ↔ Prezentacijski sloj | Interakcija sa UI-om, unos podataka, prikaz statusa i poruka | HTTPS / Browser |
| Prezentacijski sloj → Aplikacijski sloj | CRUD operacije, autentifikacija, ažuriranje statusa | HTTPS / REST API (`/api/v1/`) |
| Aplikacijski sloj ↔ Infrastrukturni sloj | Čitanje i pisanje poslovnih podataka putem Repository sloja | HTTPS (Supabase klijent) |
| Aplikacijski sloj ↔ Supabase Auth | Verifikacija JWT tokena, upravljanje sesijama | HTTPS (Supabase Auth) |
| Aplikacijski sloj ↔ AuditLogger | Evidentiranje svih promjena na intervencijama | Interni servisni poziv (Audit logger) |
| Infrastrukturni sloj ↔ PostgreSQL | Perzistencija podataka, RLS provjere pristupa | SQL (interno) |
| Infrastrukturni sloj ↔ File Storage | Pohrana slikovnih dokaza evidentiranog rada (PBI-017) | HTTPS (Supabase Storage) |

---

### 4.3 Zašto ne neki drugi pristup komunikacije

Jedina alternativa koja je razmatrana bila je direktna komunikacija između korisničkog interfejsa i baze podataka, bez slojeva poslovne logike između. Ovaj pristup bi bio brži za implementaciju, ali bi u potpunosti uklonio mogućnost primjene sigurnosnih provjera i poslovnih pravila na centralnom mjestu. Provjera dostupnosti servisera, validacija statusnih tranzicija i evidencija promjena moraju biti na jednom kontrolisanom mjestu — ne raspršene po korisničkom interfejsu koji se lako može zaobići. Odabrani pristup to garantuje jer svaki zahtjev neizbježno prolazi kroz isti sigurnosni i logički sloj, bez obzira odakle dolazi.

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
