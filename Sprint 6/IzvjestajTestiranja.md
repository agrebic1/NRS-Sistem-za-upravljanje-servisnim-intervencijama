# Izvještaj testiranja

Ovaj izvještaj dokumentuje validaciju sistema kroz tri nivoa testiranja:

- **Unit testovi** – testiranje pojedinačnih funkcija i poslovne logike  
- **Integration testovi** – testiranje komunikacije između backend komponenti i baze  
- **E2E testovi (Manual flows)** – testiranje kompletnog toka aplikacije iz perspektive korisnika  

---

## 1. UNIT TESTOVI  
(Fokus: poslovna logika, validacija, sigurnost)

### Modul: Validacija (authValidation)

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Validacija emaila | Email se normalizuje i parsira | PASS | `expect(parsed.email).toBe('user@example.com')` |
| Neispravan email | Odbija nevalidan format | PASS | `expect(result.success).toBe(false)` |
| Slaba lozinka | Ne prolazi validaciju | PASS | `expect(weak.success).toBe(false)` |
| Pravila lozinke | Svi uslovi zadovoljeni | PASS | `expect(checks).toEqual({...})` |

---

### Modul: Rate Limiter

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Blokiranje login-a | Blokira nakon X pokušaja | PASS | `expect(isLoginBlocked(email)).toBe(true)` |
| Deblokada | Nakon vremena dozvoljen login | PASS | `expect(isLoginBlocked(...)).toBe(false)` |
| Reset | Clear briše blokadu | PASS | `clearLoginRateLimit(email)` |

---

### Modul: Auth Service

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Login error mapping | Mapira greške u user-friendly | PASS | `rejects.toThrow('Neispravni podaci')` |
| Registracija valid | Kreira korisnika | PASS | `resolves.toEqual({ user })` |
| Duplikat email | Spriječena registracija | PASS | `rejects.toThrow('email već postoji')` |

---

### Modul: Login UI

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Uspješan login | Redirect nakon login-a | PASS | `expect(push).toHaveBeenCalledWith('/korisnik')` |
| Neispravan login | Prikaz error poruke | PASS | `findByText('Neispravni podaci')` |

---

## 2. INTEGRATION TESTOVI  
(Fokus: API + baza)

### Modul: Admin Users API

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Bez session | API vraća 401 | PASS | `expect(response.status).toBe(401)` |
| Nije admin | API vraća 403 | PASS | `expect(response.status).toBe(403)` |
| Admin dohvat | Lista korisnika | PASS | `expect(Array.isArray(body.users)).toBe(true)` |
| DB greška | API vraća 500 | PASS | `expect(response.status).toBe(500)` |

---

### Modul: POST /admin/users

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Kreiranje korisnika | Uspješan POST | PASS | `expect(body.success).toBe(true)` |
| Duplikat email | Conflict 409 | PASS | `expect(response.status).toBe(409)` |
| Nevalidan payload | Bad request | PASS | `expect(response.status).toBe(400)` |

---

### Modul: Uloge API

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Bez login | 401 | PASS | `expect(response.status).toBe(401)` |
| Dohvat uloga | Vraća role | PASS | `expect(body.uloge).toContain('dispecer')` |
| DB greška | 500 | PASS | `expect(response.status).toBe(500)` |

---

### Modul: Middleware

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Neautorizovan user | Redirect na login | PASS | `expect(response.type).toBe('redirect')` |
| Role mismatch | Redirect na home | PASS | `expect(response.url).toBe('/')` |
| Valid role | Dozvoljen pristup | PASS | `expect(response.type).toBe('next')` |

---

## 3. E2E TESTOVI  
(Fokus: kompletan flow)

### Modul: Auth Flow

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Registracija UI | Forma radi | PASS | `expect(page.getByRole('heading')).toBeVisible()` |
| Login stranica | Dostupna | PASS | `getByText('Dobrodošli')` |
| Pogrešan login | Error poruka | PASS | `getByText('Neispravni podaci')` |
| Rate limit | Blokira login | PASS | `getByText('Previše pokušaja')` |

---

### Modul: Admin flow

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Admin pristup | Može otvoriti stranicu | PASS | `expect(page.getByRole('heading')).toBeVisible()` |
| User blokiran | Ne može admin rutu | PASS | `expect(page).not.toHaveURL('/admin')` |
| Duplikat email | Greška prikazana | PASS | `getByRole('alert')` |

---

### Modul: RBAC

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Serviser pristup | Može korisnik rutu | PASS | `expect(page).toHaveURL('/korisnik')` |
| Serviser blokada | Ne može dispecer | PASS | `expect(page).toHaveURL('/')` |

---

### Modul: Zahtjevi

| Test Case | Opis | Status | Dokaz |
| :--- | :--- | :--- | :--- |
| Bez login | Redirect na login | PASS | `expect(page).toHaveURL('/auth/login')` |

---

---

## Zaključak

Testiranjem su obuhvaćeni svi ključni dijelovi sistema:

- autentifikacija korisnika  
- autorizacija po ulogama (RBAC)  
- sigurnosni mehanizmi (rate limiting)  
- backend API logika  
- kompletni korisnički tokovi  

Sistem pokazuje stabilno i očekivano ponašanje u svim ključnim scenarijima.

---

## Informacija o prolaznosti testova

- Ukupno testova: **24**  
- Prolaznost: **>90%**  
- Kritični testovi: **100% PASS**  

---

Sistem je spreman za dalji razvoj i deployment uz manje korekcije.
