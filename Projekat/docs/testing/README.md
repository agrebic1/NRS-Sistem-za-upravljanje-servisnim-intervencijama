# Testiranje

Ovaj folder sadrži **automatske** testove (pokretanje iz projekta) i **ručne** test planove po sprint stavkama (`SB-05-…`, `SB-06-…`). Za prvo čitanje: prvo pogledaj [Automatski testovi](#automatski-testovi), zatim [Ručno testiranje](#ručno-testiranje) za sprint koji te zanima.

---

## Sadržaj

1. [Automatski testovi](#automatski-testovi) — komande, šta se mockuje, pokrivenost  
2. [Ručno testiranje](#ručno-testiranje) — kako su fajlovi organizovani
3. [Dokazi (screenshoti)](#dokazi-screenshoti)  

---

## Automatski testovi

Komande se pokreću iz **`Projekat/`** (gdje je `package.json`):

| Komanda | Šta radi |
|--------|----------|
| `npm run test` | Unit + integration testovi |
| `npm run test:coverage` | Isti testovi + coverage izvještaj za kritične module |
| `npm run test:e2e` | Playwright e2e (smoke) u browseru |
| `npm run test:krajnje` | Jedna komanda za krajnje testiranje: pokreće coverage i generiše sažetak u `docs/testing/KRAJNJE_TESTIRANJE_IZVJESTAJ.md` |

### E2E kredencijali

Neki e2e testovi koriste stvarne role naloge (admin, korisnik, serviser, dispecer).  
Ako varijable ne postoje, ti testovi se automatski označe kao `skipped`.

Kopiraj ih u `.env.local` i po potrebi promijeni prema svom okruženju.  
Potrebne su sve 4 uloge (`admin`, `dispecer`, `serviser`, `korisnik`) da bi svi e2e smoke testovi bili izvršeni bez `skipped` statusa.

E2E_ADMIN_EMAIL=admin@nrs.local
E2E_ADMIN_PASSWORD=Admin123!Strong

E2E_DISPECER_EMAIL=dispecer@nrs.local
E2E_DISPECER_PASSWORD=Dispecer123!Strong

E2E_SERVISER_EMAIL=serviser@nrs.local
E2E_SERVISER_PASSWORD=Serviser123!Strong

E2E_KORISNIK_EMAIL=test@gmail.com
E2E_KORISNIK_PASSWORD=123456789Aa@


### Mockovi i backend

| Sloj | Ponašanje |
|------|-----------|
| **Unit** | Mock: Supabase klijent i auth, `next/navigation` router, servisne funkcije za forme |
| **Integration** | API route logika kroz simulirane HTTP zahtjeve/odgovore |
| **E2E** | Prava aplikacija u browseru; ključni tokovi i redirecti |

### Šta automatski testovi pokrivaju (veza sa sprintovima)

- **Sprint 5 (auth i uloge):** middleware (neprijavljeni, role-based pristup na `/admin`, `/serviser`, `/dispecer`, `/korisnik`), forme `LoginForm` i `RegisterForm`, e2e smoke na auth stranicama i redirect sa privatnih ruta na login.  
- **Sprint 6 (servisni zahtjevi, korisnik, dispečer):** 
  - **Unit:** validacija auth podataka, auth servis (login, rate-limit, registracija, verifikacijski email, mapiranje uloga, redirect logika, session helperi).
  - **Integration:** API `/api/auth/uloge` i `/api/admin/users` (GET/POST), uključujući admin autorizaciju, premium fallback tokove, duplikate, validaciju payload-a, audit zapis i greške.
  - **E2E:** smoke tokovi (`auth.smoke`, `korisnik.zahtjev.smoke`) + RBAC cross-access + admin create-user stranica (sa i bez admin privilegija).

### Coverage cilj (99%)

- Za kritične module postavljen je prag: **Statements >= 99%, Lines >= 99%, Functions >= 99%**.
- Branches su ostavljene na 85% zbog velikog broja odbrambenih fallback grana u API sloju.
- Trenutno stanje se vidi kroz:
  1. terminal izlaz komande `npm run test:coverage`
  2. fajl `docs/testing/KRAJNJE_TESTIRANJE_IZVJESTAJ.md` (generiše `npm run test:krajnje`)

### Premium MVP test matrica 

Napomena: u MVP-u je premium naplata **simulirana** (bez eksternog payment gateway-a). Testovi verifikuju lifecycle i prava korištenja, a ne realnu finansijsku transakciju.

| Scenarij | Očekivanje |
|----------|------------|
| Aktivacija premiuma (success) | Korisnik prelazi u `premium_status=active`, upisuje se `premium_events` |
| Aktivacija premiuma (fail) | Status ostaje neaktivan, korisnik dobija poruku greške |
| Slanje premium zahtjeva sa `active` statusom | Zahtjev prolazi validaciju i kreira se `is_premium=true` |
| Slanje premium zahtjeva sa `expired` statusom | Zahtjev se odbija uz poruku za obnovu/aktivaciju |
| Slanje premium zahtjeva sa `pending_payment` statusom | Zahtjev se odbija uz poruku da aktivacija nije dovršena |
| Cron istek premiuma | `active -> expired`, `is_premium=false`, upis `premium_expired` događaja |

---

## Ručno testiranje

### Tipičan tok za QA

1. Otvori **`TC_*.csv`** — katalog slučajeva (preduslovi, koraci, očekivani rezultat).  
2. Tokom izvršenja popunjavaj **`EXEC_*.csv`** — okruženje, datum, izvršilac, stvarni rezultat, status, putanja dokaza.  
3. Greške bilježi u **`BUG_*.csv`** i poveži ih s ID testa.  
4. Na kraju ciklusa: **`SIGNOFF_*_QA-SA.md`** (predložak ili popunjen sign-off).

### Sprint 5 — autentifikacija i kontrola pristupa

| Stavka | Fajl | Namjena |
|--------|------|--------|
| **SB-05-12** | `SB-05-12/TC_SB-05-12_AuthFlows.csv` | Katalog: registracija, login, odjava, sesija, uloge, zaštita ruta (15 testova) |
| | `SB-05-12/EXEC_SB-05-12_AuthFlows.csv` | Izvršenje tih testova |
| | `SB-05-12/BUG_SB-05-12_AuthFlows.csv` | Evidencija grešaka |
| **SB-05-13** | `SB-05-13/ACCESS_SB-05-13_MatricaPristupa.csv` | Matrica: koja uloga smije na koju rutu |
| | `SB-05-13/SEC_SB-05-13_ValidacijaPristupa.csv` | Sigurnosni scenariji (npr. neautorizovan pristup, sesija) |
| | `SB-05-13/SIGNOFF_SB-05-13_QA-SA.md` | Završni QA/SA sign-off za tu stavku |

### Sprint 6 — administrativni onboarding internog korisnika

| Stavka | Fajl | Namjena |
|--------|------|--------|
| **SB-06-20** | `SB-06-20/TC_SB-06-20_Sprint6_ManualFlows.csv` | Ručna test matrica za Sprint 6 tokove (prijava kvara, onboarding partnera, admin kreiranje naloga, premium aktivacija) |
| | `SB-06-20/EXEC_SB-06-20_Sprint6_ManualFlows.csv` | Evidencija izvršenja manualnih testova za SB-06-20 |
| | `SB-06-20/BUG_SB-06-20_Sprint6_ManualFlows.csv` | Evidencija bugova za SB-06-20 |
| | `SB-06-20/SIGNOFF_SB-06-20_QA-SA.md` | Formalni QA/SA sign-off za SB-06-20 |


Imenovanje: po dogovoru tima, npr. `TC-042_KratkiOpis.png`, da se mapira na `ID_testa` u `EXEC` fajlu.

