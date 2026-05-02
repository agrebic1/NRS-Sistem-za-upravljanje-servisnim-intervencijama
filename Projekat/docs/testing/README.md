# Testiranje — vodič

Ovaj folder sadrži **automatske** testove (pokretanje iz projekta) i **ručne** test planove po sprint stavkama (`SB-05-…`, `SB-06-…`). Za prvo čitanje: prvo pogledaj [Automatski testovi](#automatski-testovi), zatim [Ručno testiranje](#ručno-testiranje) za sprint koji te zanima.

---

## Sadržaj

1. [Automatski testovi](#automatski-testovi) — komande, šta se mockuje, pokrivenost Sprinta 5 (Sprint 6: još nema)  
2. [Ručno testiranje](#ručno-testiranje) — kako su fajlovi organizovani, Sprint 5 i Sprint 6  
3. [Dokazi (screenshoti)](#dokazi-screenshoti)  
4. [Sigurnosna napomena (login)](#sigurnosna-napomena-login)

---

## Automatski testovi

Komande se pokreću iz **`Projekat/`** (gdje je `package.json`):

| Komanda | Šta radi |
|--------|----------|
| `npm run test` | Unit + integration testovi |
| `npm run test:coverage` | Isti testovi + coverage izvještaj za kritične module |
| `npm run test:e2e` | Playwright e2e (smoke) u browseru |

### Mockovi i backend

| Sloj | Ponašanje |
|------|-----------|
| **Unit** | Mock: Supabase klijent i auth, `next/navigation` router, servisne funkcije za forme |
| **Integration** | API route logika kroz simulirane HTTP zahtjeve/odgovore |
| **E2E** | Prava aplikacija u browseru; ključni tokovi i redirecti |

### Šta automatski testovi pokrivaju (veza sa sprintovima)

- **Sprint 5 (auth i uloge):** middleware (neprijavljeni, role-based pristup na `/admin`, `/serviser`, `/dispecer`, `/korisnik`), forme `LoginForm` i `RegisterForm`, e2e smoke na auth stranicama i redirect sa privatnih ruta na login.  
- **Sprint 6 (servisni zahtjevi, korisnik, dispečer):** _Još nisu urađeni posvećeni automatski testovi._ Cijela trenutna pokrivenost je u **ručnom** planu `SB-06-14` (`TC` / `EXEC` / `BUG`). Kad tim doda unit, integration ili e2e za wizard, liste i dispečera, ovdje se može dopuniti tabela ili lista fajlova.

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

### Sprint 6 — zahtjevi za servis, korisnik, dispečer

| Stavka | Fajl | Namjena |
|--------|------|--------|
| | `SB-06-14/TC_SB-06-14_ServiceRequests.csv` | Katalog: wizard, „Moji zahtjevi”, dispečerska pending lista, integracija, sigurnost, UX (125 slučajeva) |
| | `SB-06-14/EXEC_SB-06-14_ServiceRequests.csv` | Izvršenje |
| | `SB-06-14/BUG_SB-06-14_ServiceRequests.csv` | Greške |
| | `SB-06-14/SIGNOFF_SB-06-14_QA-SA.md` | Predložak sign-offa |

---

## Dokazi (screenshoti)

| Sprint / stavka | Folder |
|-----------------|--------|
| SB-05-12 | `evidence/SB-05-12/` |
| SB-05-13 | `evidence/SB-05-13/` |
| SB-06-14 | `evidence/SB-06-14/` |

Imenovanje: po dogovoru tima, npr. `TC-042_KratkiOpis.png`, da se mapira na `ID_testa` u `EXEC` fajlu.

