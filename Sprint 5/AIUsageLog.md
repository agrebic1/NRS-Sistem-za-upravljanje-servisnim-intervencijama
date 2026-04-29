# AI Usage Log

| Polje | Opis |
|-------|------|
| Datum | 28.04.2026|
| Sprint broj | |
| Alat koji je korišten | |
| Svrha korištenja | |
| Kratak opis zadatka ili upita | |
| Šta je AI predložio ili generisao | |
| Šta je tim prihvatio | |
| Šta je tim izmijenio | |
| Šta je tim odbacio | |
| Rizici, problemi ili greške koje su uočene | |
| Ko je koristio alat | |


## AI Usage Log #1: Arhitektura i core backend logika
**Faza:** Inicijalna postavka projekta i autentifikacijski servisi

| Polje | Opis |
|-------|------|
| **Datum** | 20.04.2026. |
| **Sprint broj** | 5 |
| **Alat koji je korišten** | Claude 3.5 Sonnet |
| **Svrha korištenja** | Definisanje arhitekture i Supabase integracije uz strogo poštovanje inženjerskih standarda |
| **Kratak opis zadatka** | Postavljanje Next.js 14 strukture sa domain, services i repository slojevima uz primjenu SOLID principa |
| **Šta je AI generisao** | Strukturu direktorija, `authService.ts`, middleware za sesije i TypeScript interfejse za uloge koji prate Separation of Concerns |
| **Šta je tim prihvatio** | Predloženu arhitekturu, jer je AI uspješno ispoštovao zahtjev tima za striktnom primjenom **SOLID principa** i potpunim odvajanjem poslovne logike od UI komponenti |
| **Šta je tim izmijenio** | Nazive tabela u bazi (prelazak na bosanski jezik: `korisnik_usluge` umjesto `service_users`) radi usklađenosti sa lokalnim zahtjevima |
| **Šta je tim odbacio** | Korištenje eksternih auth provajdera, zadržan isključivo Supabase Auth radi smanjenja kompleksnosti |
| **Rizici, problemi ili greške** | Nekompatibilnost generisanih Supabase tipova sa SSR klijentom, riješeno uklanjanjem striktnog generika u inicijalizaciji klijenta |
| **Ko je koristio alat** | Ajna Ičić |

## AI Usage Log #2: Frontend Development & UX (Lokalizacija)
**Faza:** Izrada formi i vizuelnog identiteta

| Polje | Opis |
|-------|------|
| **Datum** | 25.04.2026. |
| **Sprint broj** | 5 |
| **Alat koji je korišten** | Claude 3.5 Sonnet |
| **Svrha korištenja** | Razvoj responzivnih formi sa naprednim UX elementima i "live" validacijom |
| **Kratak opis zadatka** | Dorada UI komponenti: kreiranje RegisterForm čarobnjaka (wizard), implementacija animacija učitavanja i sistema validacije |
| **Šta je AI generisao** | Dinamički `RegisterForm.tsx`, `LoginForm.tsx`, te na specifičan zahtjev FD, `LoadingOverlay` sa animacijom rotirajućih zupčanika i Zod sheme sa porukama na bosanskom jeziku |
| **Šta je tim prihvatio** | Implementaciju "live" validacije koja korisniku pruža trenutni feedback i vizuelni indikator jačine lozinke, te automatski redirect na dashboard nakon registracije |
| **Šta je tim izmijenio** | Redoslijed koraka u registracionoj formi i specifične hex kodove za paletu unutar animacija |
| **Šta je tim odbacio** | Prvobitni prijedlog standardnog "spinnera" za učitavanje, FD je tražio i dobio unikatnu animaciju zupčanika koja prati vizuelni identitet servisa |
| **Rizici, problemi ili greške** | Inicijalni problem sa tipizacijom `style` atributa na Lucide ikonama unutar animacije; AI uspješno refaktorisao kod prema TypeScript standardima |
| **Ko je koristio alat** | Amina Grebić |

## AI Usage Log #3: Debugging & Deployment (Vercel Fix)
**Faza:** Stabilizacija aplikacije i pokušaj rješavanja Error 500

| Polje | Opis |
|-------|------|
| **Datum** | 28.04.2026. |
| **Sprint broj** | 5 |
| **Alat koji je korišten** | Claude 3.5 Sonnet |
| **Svrha korištenja** | Rješavanje kritične Error 500 greške na Vercel produkciji |
| **Kratak opis zadatka** | Debugging middleware-a i sinhronizacija sesije na Edge runtime-u |
| **Šta je AI predložio** | Refaktorisanje `middleware.ts` za pravilnu sinhronizaciju kolačića i prelazak na `getUser()` |
| **Šta je tim prihvatio** | Novu logiku rukovanja kolačićima koja sprečava "Infinite Redirect" loop |
| **Šta je tim izmijenio** | Dodata eksplicitna provjera za `uloge.length === 0` sa povratnom porukom korisniku |
| **Šta je tim odbacio** | Isključivanje middleware-a za određene rute; zadržana potpuna zaštita svih ruta |
| **Rizici, problemi ili greške** | Nedostajući `encoding` paket u produkciji uzrokovao pucanje build-a; dodat ručno u dependencies |
| **Ko je koristio alat** | Ajna Ičić i Amina Grebić |


## AI Usage Log #4: 
**Faza:** 

| Polje | Opis |
|------|------|
| Datum | 28.04.2026 |
| Sprint broj | 5 |
| Alat koji je korišten | ChatGPT |
| Svrha korištenja | Poboljšanje sigurnosti aplikacije, implementacija autorizacije i RLS politika, te refaktorisanje middleware logike |
| Kratak opis zadatka ili upita | Ispravljanje greške `500 MIDDLEWARE_INVOCATION_FAILED`, unapređenje autorizacije (prebacivanje na DB logiku), uvođenje RLS politika i role-based pristupa, te validacija korisničkih uloga kroz sistem |
| Šta je AI predložio ili generisao | Predložio hardening middleware-a (try/catch + fallback), korištenje `is_admin` iz baze umjesto `user_metadata`, strukturu RLS politika, helper funkcije za role (`is_admin`, `is_dispecer`, itd.), te organizaciju authorization flow-a |
| Šta je tim prihvatio | Middleware hardening, DB-based autorizaciju, RLS migracije, helper funkcije i jedinstveni authorization flow za admin rute |
| Šta je tim izmijenio | Prilagodio RLS politike konkretnim tabelama i poslovnoj logici (zahtjev, intervencija, evidencije itd.), te optimizirao role mapiranje i test naloge |
| Šta je tim odbacio | Oslanjanje na `user_metadata` za autorizaciju (zbog sigurnosnih rizika) |
| Rizici, problemi ili greške koje su uočene | Početna 500 greška u middleware-u, potencijalne sigurnosne ranjivosti pri oslanjanju na client-side metadata, potreba za pažljivim definisanjem RLS politika da ne blokiraju validne upite |
| Ko je koristio alat | Ajla Ćesir |

## AI Usage Log #5: Logic Flow & RBAC (Role Selection)
**Faza:** Poslovna logika usmjeravanja korisnika

| Polje | Opis |
|-------|------|
| **Datum** | 29.04.2026. |
| **Sprint broj** | 5 |
| **Alat koji je korišten** | Claude 3.5 Sonnet |
| **Svrha korištenja** | Implementacija ekrana za odabir uloge (Role Selection) |
| **Kratak opis zadatka** | Razvoj logike koja prepoznaje korisnike sa više uloga i nudi im izbor pri prijavi |
| **Šta je AI generisao** | Funkciju `odrediRedirectNakonPrijave` i `odabir-uloge/page.tsx` sa dinamičkim karticama |
| **Šta je tim prihvatio** | Vizuelni stil kartica (glass-morphism) i automatski redirect za korisnike sa samo jednom ulogom |
| **Šta je tim izmijenio** | Tekstove opisa uloga (npr. precizniji opis zaduženja servisera na bosanskom jeziku) |
| **Šta je tim odbacio** | Mogućnost promjene uloge unutar dashboarda bez ponovnog logina (radi jednostavnosti MVP-a) |
| **Rizici, problemi ili greške** | Session mismatch pri brzom prebacivanju uloga, riješeno čišćenjem cache-a routera |
| **Ko je koristio alat** | Amina Grebić |

