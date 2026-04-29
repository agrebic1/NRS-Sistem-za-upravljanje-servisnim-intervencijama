# Sprint Goal

### Sprint broj 5

### Sprint cilj

Uspostaviti stabilan i siguran ulazak korisnika u sistem kroz registraciju i prijavu, omogućiti upravljanje sesijom, osnovnu kontrolu pristupa prema korisničkim ulogama i preusmjeravanje korisnika na odgovarajući početni dashboard.

---

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

---

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
| SB-05-01 | Definisanje poslovnih pravila za registraciju, login, uloge i pristup sistemu | Solution architect | Done | Obuhvata decision log odluke: javna registracija samo za korisnika usluge, više uloga po korisniku, aktivna uloga, role-based redirect, odjava i osnovni dashboard po ulozi. |
| SB-05-02 | Povezivanje aplikacije sa Supabase okruženjem | Backend / baza | Done | Podesiti Supabase projekat, env varijable i osnovnu auth konfiguraciju. |
| SB-05-03 | Implementacija registracije korisnika usluge (US-01, PBI-001) | Frontend + backend | Done | Korisnik se javno registruje samo kao korisnik usluge. Potrebne validacije i poruke grešaka. |
| SB-05-04 | Implementacija prijave korisnika u sistem (US-02, PBI-001) | Frontend + backend | Done | Login forma, autentifikacija, neutralna poruka greške i povezivanje sa Supabase Auth. |
| SB-05-05 | Implementacija odjave korisnika iz sistema (US-03, PBI-001) | Backend / frontend | Done | Odjava prekida sesiju i korisnika vraća na login ili landing stranicu. |
| SB-05-06 | Definisanje korisnika, uloga i osnovnih permisija (US-04, PBI-002) | Backend / baza | Done | Uloge: korisnik_usluge, serviser, dispecer, administrator. Predvidjeti mogućnost više uloga po korisniku. |
| SB-05-07 | Implementacija odabira aktivne uloge | Frontend + backend | Done | Samo za korisnike koji imaju više uloga. Korisnik u jednom trenutku koristi sistem kroz jednu aktivnu ulogu. |
| SB-05-08 | Implementacija role-based preusmjeravanja nakon prijave | Frontend + backend | Done | Korisnik se preusmjerava na dashboard prema aktivnoj ulozi. |
| SB-05-09 | Osnovna zaštita ruta prema korisničkoj ulozi | Backend / security support | Done | Neprijavljen korisnik ne može pristupiti dashboardu; korisnik ne smije pristupiti tuđim ulogama preko URL-a. |
| SB-05-10 | Implementacija osnovnih početnih dashboarda po ulozi | Frontend | Done | Početne verzije ekrana za korisnika, servisera, dispečera i administratora, bez napredne poslovne logike. |
| SB-05-11 | Upravljanje korisničkom sesijom | Backend / frontend | Done | Provjera sesije nakon refresh-a, održavanje prijavljenog stanja i usklađivanje server/client logike. |
| SB-05-12 | Testiranje registracije, prijave, odjave, sesije i preusmjeravanja | Testeri | To Do | Testirati pozitivne, negativne i edge case scenarije prema acceptance kriterijima i decision log pravilima. |
| SB-05-13 | Validacija autentifikacije i kontrole pristupa korisnika | QA / Solution architect | To Do | Validacija poslovnih pravila i logike sistema | 
