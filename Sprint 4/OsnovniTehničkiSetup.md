# Osnovni tehnički setup
Ovaj dokument opisuje osnovni tehnički setup, branching strategiju, odabrane tehnologije te razvojne procese.

## Branching strategy
Za branching strategiju odabrana je Feature Branch strategija, zasnovana na GitHub Flow modelu, jer se radi o manjem razvojnom timu od osam članova koji rade organizovano kroz sedmične sprintove. Ovaj pristup nudi jednostavnost i dobru preglednost, što odgovara veličini i prirodi projekta, te omogućava kontinuirani razvoj uz česte integracije i iterativni rad.

Feature Branch strategija u potpunosti pokriva potrebe projekta: svaka nova funkcionalnost razvija se na zasebnoj grani povezanoj s odgovarajućim backlog zadatkom, a nakon završetka i odobrenog code reviewa, promjene se spajaju u main granu, koja je u svakom trenutku stabilna i spremna za deployment.

### Osnovna struktura grana
Struktura se sastoji od dvije vrste grana: main grana, koja uvijek sadrži stabilan kod spreman za produkcijski deployment, i feature/fix grane koje se kreiraju iz main-a, na kojima se implementiraju promjene, te se nakon završetka mergeaju nazad u main.

1. Main branch: Na njoj se uvijek nalazi kod koji je stabilan, testiran i spreman za deployment. Direktno commitovanje na main nije dozvoljeno. Svaki push na main automatski pokreće Vercel deployment u produkcijsko okruženje.

2. Feature/fix branch: Sve nove funkcionalnosti, ispravke grešaka i poboljšanja implementiraju se na zasebnim granama kreiranim iz main-a. Ovaj pristup omogućava paralelan rad članova tima bez međusobnog ometanja i smanjuje rizik od konflikata na main grani. Pored toga, svaki otvoreni pull request prema main grani automatski dobija vlastito Vercel preview okruženje, što olakšava testiranje i code review prije merga.

### Imenovanje grana
Za imenovanje grana koristi se standardizovana konvencija koja grani daje i kontekst i vezu sa backlogom:
```
feature/PBI-XXX-kratak-opis-funkcionalnosti
fix/PBI-XXX-kratak-opis-greske
docs/kratak-opis-promjene
```
Nova grana uvijek se kreira iz najnovije verzije main grane kako bi se izbjeglo nakupljanje zastarjelih razlika.

### Proces rada
Način rada je sljedeći:
1. Za svaki novi user story, bug fix ili drugu promjenu kreirati novu granu iz main-a prema dogovorenoj konvenciji imenovanja
2. Raditi commitove lokalno na tom branchu i pushati ih na remote repozitorij
3. Otvoriti pull request prema main grani kada je funkcionalnost završena ili spremna za pregled, Vercel automatski kreira preview deployment
4. Najmanje jedan drugi član tima provodi code review koji nije radio na implementaciji te funkcionalnosti
5. Nakon odobrenja i prolaska svih CI provjera u GitHub Actions-u, grana se mergea u main
6. Vercel automatski deployira novu verziju u produkcijsko okruženje; privremena grana se briše

### Pull request i code review
Pull request otvara se kada je funkcionalnost gotova i spremna za review. Review obavlja minimalno jedan član tima koji nije radio na implementaciji, i obuhvata:
1. Provjeru ispravnosti i čitljivosti koda
2. Provjeru usklađenosti sa poslovnim zahtjevima i acceptance kriterijima user story-ja
3. Provjeru sigurnosnih aspekata (autorizacija, RLS politike, validacija unosa)
4. Provjeru pokrivenosti testovima
5. Provjeru eventualnih konflikata i nedosljednosti s ostalim dijelovima sistema

Grana se može mergeati u main tek kada su ispunjeni sljedeći uslovi:
1. Funkcionalnost je u potpunosti implementirana
2. Review je uspješno završen i svi uočeni nedostaci su ispravljeni
3. Svi GitHub Actions CI koraci prolaze bez grešaka (lint, unit testovi)
4. Nema neriješenih konflikata s main granom
5. Ispunjeni su svi kriteriji iz Definition of Done

### Konvencija commit poruka
Svi commiti prate Conventional Commits format kako bi historija razvoja bila čitljiva i praćena. 

Format: 
```
<tip>: kratki opis promjene u imperativu
```
Dozvoljeni tipovi:
| Tip      | Upotreba                                      |
|----------|-----------------------------------------------|
| `feat`   | Nova funkcionalnost                           |
| `fix`    | Ispravka greške                               |
| `docs`   | Izmjena dokumentacije                         |
| `refactor` | Refaktorisanje bez promjene ponašanja       |
| `test`   | Dodavanje ili izmjena testova                 |
| `chore`  | Konfiguracija, build, zavisnosti              |
| `style`  | Formatiranje koda (bez logičkih izmjena)      |

Primjeri ispravnih commit poruka:
```
feat: dodaj kreiranje zahtjeva za servisnu intervenciju
fix: ispravi validaciju statusa pri zatvaranju intervencije
test: dodaj unit testove za logiku prelaza statusa
docs: azuriraj README s uputama za Supabase setup
refactor: izvuci logiku prioritizacije u domenski servis
```

### Rješavanje konflikata
Konflikti nastaju kada dva člana tima istovremeno mijenjaju isti fajl. Kako bi se konflikt riješio, član tima lokalno povlači najnovije izmjene iz main-a u svoj feature branch, ručno pregleda konfliktna mjesta i bira odgovarajuću verziju koda, nakon čega commituje i pusha razriješene promjene na repozitorij.
Važno je napomenuti da se konflikt uvijek rješava na feature branchu, nikada direktno na main-u. Kako bi se konflikti sveli na minimum, preporučuje se svakodnevno povlačenje najnovijih izmjena iz main-a u aktivni feature branch.


## Tehnički setup
| Komponenta            | Tehnologija                         | Verzija / Plan                 |
|----------------------|-------------------------------------|--------------------------------|
| Full-stack framework | Next.js + TypeScript                | Next.js 14.x (App Router)      |
| UI biblioteka        | React                               | 18.x (uključen u Next.js)      |
| Stilizovanje         | Tailwind CSS                        | 3.x                            |
| Backend-as-a-Service | Supabase                            | Free / Pro tier                |
| Baza podataka        | PostgreSQL (Supabase managed)       | 15.x                           |
| Autentifikacija      | Supabase Auth (JWT + bcrypt)        | uključeno u Supabase           |
| Sigurnosne politike  | Row Level Security (RLS)            | uključeno u Supabase/PostgreSQL|
| File storage         | Supabase Storage                    | uključeno u Supabase           |
| Deployment           | Vercel                              |                                |
| CI pipeline          | GitHub Actions                      |                                |
| Unit testovi         | Jest                                | 29.x                           |
| E2E testovi          | Playwright                          | 1.x                            |
| Linting              | ESLint                              | uključen u Next.js             |
| Formatiranje         | Prettier                            | 3.x                            |
| API testiranje       | Bruno                               | latest                         |
| API dokumentacija    | Swagger / OpenAPI                   | -                              |

## Obrazloženje izbora tehnologija

### Next.js + TypeScript
Next.js je odabran kao jedinstven full-stack okvir koji u jednom projektu objedinjuje React prezentacijski sloj i API sloj putem API Routes (`/api/v1/`). Ovaj odabir direktno podržava arhitektonsku odluku (KTO u *Architecture Overview*) kojom se smanjuje kompleksnost projekta, jedan repozitorij, jedan deployment, bez potrebe za zasebnim frontend i backend servisima.  

Next.js ispunjava:
- NFR-013 (responzivnost)
- NFR-015 (web aplikacija bez instalacije)
- ORG-IMP-01 (dogovoreni tech stack)

TypeScript je uveden jer tip-sigurnost sprječava čitavu klasu grešaka pri radu s domenskim objektima (zahtjevi za intervencijom, dodjele, statusi, korisničke uloge).

**Alternativa:**  
Zasebni React + Node.js/Express servisi bili bi funkcionalni, ali uvode dodatnu kompleksnost (dva projekta, deploymenta i koordinacija), što nije opravdano za MVP.

---

### Tailwind CSS
Tailwind CSS pruža *utility-first* pristup koji ubrzava izgradnju responzivnih interfejsa bez pisanja zasebnih CSS fajlova.  

Prednosti:
- Ugrađene klase za pristupačnost (`sr-only`, `focus:ring`)
- Direktna podrška za WCAG 2.1 (EXT-ETI-01)
- Nema dodatne konfiguracije u Next.js ekosistemu

---

### Supabase (PostgreSQL + Auth + RLS + Storage)
Supabase je odabran kao *Backend-as-a-Service* koji objedinjuje bazu, autentifikaciju, sigurnost i storage.

#### Ključne komponente:
- **PostgreSQL**  
  Podaci su visoko relacioni (zahtjev → intervencija → dodjela → evidencija rada).  
  ACID garantuje konzistentnost i sprječava parcijalna ažuriranja.

- **Supabase Auth**  
  - JWT sesije  
  - bcrypt hash (cost ≥ 10 - NFR-007)  
  - automatski timeout (8h - NFR-008)

- **Row Level Security (RLS)**  
  Implementira *defence in depth*:
  - klijent → samo vlastiti zahtjevi  
  - serviser → dodijeljene intervencije  
  - dispečer → sve aktivne  
  - admin → puni pristup  

  Zadovoljava: NFR-009, PBI-002

- **Supabase Storage**  
  Pohrana slika (dokazi rada - PBI-017)

- **EU hosting**  
  Podaci unutar EU (GDPR - EXT-ZAK-01)

**Alternativa:**  
- MongoDB → neprikladan zbog nedostatka relacione konzistentnosti  
- VPS + Docker → prekompleksno za MVP

---

### Vercel
Vercel omogućava:
- automatski deployment (GitHub integracija)
- HTTPS bez konfiguracije
- globalni CDN
- preview okruženja za svaki PR

Podržava:
- NFR-004 (dostupnost)
- NFR-010 (HTTPS)
- ORG-IMP-02 (deployment platforma)

**Alternativa:**  
VPS daje više kontrole, ali zahtijeva ručni setup (SSL, Docker, pipeline).

---

### Jest (unit testovi)
Jest je standard u Next.js ekosistemu.

Fokus:
- poslovna logika
- statusi intervencija
- validacija
- autorizacija

Podržava: ORG-STD-02

---

### Playwright (E2E testovi)
Playwright omogućava testiranje u stvarnim browserima.

Pokriva:
- registraciju
- login
- tok intervencije

Podržava: ORG-STD-02

---

### Bruno (API testiranje)
Bruno koristi *plain-text* kolekcije verzionirane u Git-u.

Prednosti:
- nema ograničenja
- bolja integracija s timskim radom

**Alternativa:**  
Postman free plan ima ograničenja (nije pogodno za timski razvoj).

---

### ESLint + Prettier
- **ESLint** → kvalitet i konzistentnost koda  
- **Prettier** → automatsko formatiranje  

Konfiguracija:
- `.eslintrc`
- `.prettierrc`
- preporučeno: `.vscode/settings.json`

Podržava: ORG-STD-01

## Tehnička arhitektura i implementacijski detalji
### Frontend -> Next.js + TypeScript

- **Programski jezik** -> TypeScript (ES2022+)  
- **Framework** -> Next.js 14.x (App Router + Server Components)  
- **UI biblioteka** -> React 18.x (funkcionalne komponente + Hooks)  
- **Stilizovanje** -> Tailwind CSS 3.x  

### Ključne biblioteke

| Biblioteka | Namjena |
|------------|--------|
| `@supabase/supabase-js` | Supabase klijent (baza, auth, storage) |
| `@supabase/auth-helpers-nextjs` | Integracija autentifikacije s Next.js |
| `react-hook-form` | Upravljanje formama i validacija |
| `zod` | Schema validacija (frontend + backend) |
| `@tanstack/react-query` | State management i caching |
| `date-fns` | Rad s datumima |
| `lucide-react` | Ikone |

---

### Backend -> Next.js API Routes + TypeScript

- **Programski jezik** -> TypeScript (Node.js, kroz Next.js)  
- **API okvir** -> Next.js API Routes (`/api/v1/`)  
- **Pristup podacima** -> Repository pattern + Supabase klijent  

### Ključne biblioteke

| Biblioteka | Namjena |
|------------|--------|
| `@supabase/supabase-js` | Server pristup bazi (admin privilegije) |
| `zod` | Validacija ulaznih podataka |
| `next` | Routing, middleware, JWT provjera |

---

### Baza podataka -> Supabase PostgreSQL

| Konfiguracija | Detalji |
|--------------|--------|
| Verzija | PostgreSQL 15.x (managed) |
| Migracije | Supabase CLI (SQL migracije) |
| Connection | ENV varijable (`SUPABASE_URL`, ključevi) |
| Backup | Automatski dnevni |
| Mrežna izolacija | Pristup samo preko API-ja + RLS |

**Strategija migracija:**  
Migracije se verzioniraju u `supabase/migrations/` i izvršavaju kroz CI/CD pipeline.

---

### Kontrola pristupa -> RBAC + RLS

Dvoslojna sigurnost (*defence in depth*):

- **RBAC (API sloj)**  
  - Provjera JWT tokena i uloge  
  - Neovlašten pristup → HTTP 403  

- **RLS (baza)**  
  - Ograničenje pristupa na nivou podataka  

### Uloge

| Uloga | Pristup |
|------|--------|
| Klijent | Vlastiti zahtjevi |
| Serviser | Dodijeljene intervencije |
| Dispečer | Sve aktivne intervencije |
| Administrator | Svi podaci |

---

## Autentifikacija i sigurnost

| Mehanizam | Detalji |
|----------|--------|
| Hashiranje | bcrypt (cost ≥ 10) |
| JWT | Istek nakon 8h |
| HTTPS | Automatski (Vercel) |
| Sesije | httpOnly cookies |
| Kontrola pristupa | RBAC + RLS |
| Validacija | Zod na svakom endpointu |

---

### Deployment

### Vercel

Vercel je odabran za hosting Next.js aplikacije jer nudi nativnu integraciju s Next.js frameworkom i GitHub repozitorijem. Deployment se odvija automatski bez ručne intervencije.

| Resurs | Vrijednost |
|-------|-----------|
| Platforma | Vercel (Hobby / Pro) |
| Okruženje | Serverless |
| CDN | Globalni |
| Preview | Po PR-u |
| Produkcija | Merge na `main` |

---

### Supabase projekt

| Resurs | Vrijednost |
|-------|-----------|
| Platforma | Supabase |
| Region | EU (Frankfurt) |
| Backup | Automatski |
| RLS | Konfigurisan |

---

### Environment varijable

- Čuvaju se u Vercel/Supabase
- Nikad se ne commituju
- `.env.example` služi kao template

| Varijabla | Opis |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL projekta |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Javni API ključ |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin ključ (server only) |
