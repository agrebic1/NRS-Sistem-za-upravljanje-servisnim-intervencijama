# Sprint Goal

### Sprint broj 5

### Sprint cilj

Uspostaviti stabilan i siguran ulazak korisnika u sistem kroz registraciju i prijavu, omogućiti upravljanje sesijom, osnovnu kontrolu pristupa prema korisničkim ulogama i preusmjeravanje korisnika na odgovarajući početni dashboard.

## Ključne stavke koje tim želi završiti

- povezivanje aplikacije sa Supabase platformom  
- konfiguracija autentifikacije korisnika  
- implementacija registracije korisnika usluge (US-01)  
- implementacija prijave korisnika (US-02)  
- implementacija odjave korisnika (US-03)  
- upravljanje korisničkom sesijom  
- definisanje korisničkih uloga i osnovnih permisija (US-04)  
- role-based preusmjeravanje nakon prijave  
- zaštita ruta prema ulozi korisnika  
- osnovni dashboard prikaz po ulozi (bez poslovne logike)  
- testiranje autentifikacije i pristupa  

## Rizici i zavisnosti

Sprint 5 predstavlja temelj cijelog sistema i od njegovog uspješnog završetka zavise svi naredni sprintovi.

Ako autentifikacija i sesija nisu ispravno implementirani:
- korisnici neće moći pouzdano pristupiti sistemu  
- kontrola pristupa neće biti sigurna  
- kasniji moduli (zahtjevi, intervencije) neće imati validan kontekst korisnika  

Postoji rizik:
- pogrešne konfiguracije Supabase auth-a  
- problema sa session state-om između servera i klijenta  
- neispravnog role-based redirecta  

Zavisnosti:
- Supabase platforma (auth + baza)  
- ispravna definicija korisničkih uloga  
- frontend-backend integracija  

---

# Sprint Backlog – Sprint 5

| ID | Naziv zadatka ili storyja | Odgovorna osoba ili osobe | Status | Napomena |
|----|----------------------------|----------------------------|--------|----------|
| SBI-05-01 | Definisanje poslovnih pravila za registraciju, login, uloge i pristup sistemu | Solution architect | Done | Obuhvata decision log odluke: javna registracija samo za korisnika usluge, više uloga po korisniku, aktivna uloga, role-based redirect, odjava i osnovni dashboard po ulozi. |
| SBI-05-02 | Povezivanje aplikacije sa Supabase okruženjem | Backend / baza | Done | Podesiti Supabase projekat, env varijable i osnovnu auth konfiguraciju. |
| SBI-05-03 | Implementacija registracije korisnika usluge (US-01, PBI-001) | Frontend + backend | Done | Korisnik se javno registruje samo kao korisnik usluge. Potrebne validacije i poruke grešaka. |
| SBI-05-04 | Implementacija prijave korisnika u sistem (US-02, PBI-001) | Frontend + backend | Done | Login forma, autentifikacija, neutralna poruka greške i povezivanje sa Supabase Auth. |
| SBI-05-05 | Implementacija odjave korisnika iz sistema (US-03, PBI-001) | Backend / frontend | Done | Odjava prekida sesiju i korisnika vraća na login ili landing stranicu. |
| SBI-05-06 | Definisanje korisnika, uloga i osnovnih permisija (US-04, PBI-002) | Backend / baza | Done | Uloge: korisnik_usluge, serviser, dispecer, administrator. Predvidjeti mogućnost više uloga po korisniku. |
| SBI-05-07 | Implementacija odabira aktivne uloge | Frontend + backend | Done | Samo za korisnike koji imaju više uloga. Korisnik u jednom trenutku koristi sistem kroz jednu aktivnu ulogu. |
| SBI-05-08 | Implementacija role-based preusmjeravanja nakon prijave | Frontend + backend | Done | Korisnik se preusmjerava na dashboard prema aktivnoj ulozi. |
| SBI-05-09 | Osnovna zaštita ruta prema korisničkoj ulozi | Backend / security support | Done | Neprijavljen korisnik ne može pristupiti dashboardu, korisnik ne smije pristupiti tuđim ulogama preko URL-a. |
| SBI-05-10 | Implementacija osnovnih početnih dashboarda po ulozi | Frontend | Done | Početne verzije ekrana za korisnika, servisera, dispečera i administratora, bez napredne poslovne logike. |
| SBI-05-11 | Upravljanje korisničkom sesijom | Backend / frontend | Done | Provjera sesije nakon refresh-a, održavanje prijavljenog stanja i usklađivanje server/client logike. |
| SBI-05-12 | Testiranje registracije, prijave, odjave, sesije i preusmjeravanja | Testeri | Done | Testirati pozitivne, negativne i edge case scenarije prema acceptance kriterijima i decision log pravilima. |
| SBI-05-13 | Validacija autentifikacije i kontrole pristupa korisnika | QA / Solution architect | Done | Validacija poslovnih pravila i logike sistema | 


# Velocity analiza – Sprint 5

**Trajanje sprinta:** 23.04 – 30.04  
**Ukupan planirani obim:** 36 story pointa  

Sprint 5 fokusiran je na implementaciju autentifikacije, upravljanje korisničkim ulogama i kontrolu pristupa sistemu.

### Raspodjela story pointsa

| Funkcionalnost | Tip | Kompleksnost | SP |
|---------------|-----|--------------|----|
| Registracija korisnika (US-01) | Feature | Visoka | 5 |
| Prijava korisnika (US-02) | Feature | Visoka | 5 |
| Definisanje uloga i permisija | Feature | Visoka | 5 |
| Supabase integracija (auth) | Feature | Visoka | 5 |
| Upravljanje sesijom | Feature | Srednja | 4 |
| Osnovni dashboard (redirect + layout) | Feature | Srednja | 4 |
| Odabir aktivne uloge | Feature | Srednja | 3 |
| Role-based redirect | Feature | Srednja | 3 |
| Zaštita ruta | Feature | Srednja | 3 |
| Odjava korisnika | Feature | Niska | 2 |
| Funkcionalno testiranje autentifikacije | Testiranje | Srednja | 4 |
| Validacija poslovne logike | Testiranje | Srednja | 3 |

### Realizacija po danima

| Datum | Aktivnosti | Završeni SP |
|------|-----------|-------------|
| 23.04 | Planiranje sprinta | 0 |
| 24.04 | Definisanje uloga, upravljanje sesijom | 9 |
| 25.04 | Frontend registracija i prijava | 10 |
| 26.04 | Backend registracija i prijava | 10 |
| 27.04 | Dashboard, role-based redirect, zaštita ruta | 7 |
| 28.04 | Stabilizacija i dorade | 0 |
| 29.04 | Testiranje i validacija | 7 |
| 30.04 | Ažuriranje i finalizacija sprint dokumentacije | 0 |

### Burndown analiza

| Dan | Datum | Preostali SP |
|-----|-------|-------------|
| 1 | 23.04 | 36 |
| 2 | 24.04 | 27 |
| 3 | 25.04 | 17 |
| 4 | 26.04 | 7 |
| 5 | 27.04 | 7 |
| 6 | 28.04 | 7 |
| 7 | 29.04 | 0 |
| 8 | 30.04 | 0 |

### Burndown graf

```mermaid
xychart-beta
    title "Sprint 5 Burndown (Realni)"
    x-axis ["23","24","25","26","27","28","29","30"]
    y-axis "Story Points" 0 --> 36
    line "Remaining" [36,27,17,7,7,7,0,0]
