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
