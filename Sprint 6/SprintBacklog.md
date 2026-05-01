# Sprint Goal

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
| SBI-06-14 |
| SBI-06-15 |
| SBI-06-16 |
| SBI-06-17 |
| SBI-06-18 |
| SBI-06-19 |
| SBI-06-20 |

Prijedlog za sprint 6:
US-05	Prijava zahtjeva za servisnu intervenciju
US-06	Pregled vlastitog zahtjeva
US-18	Administrativno kreiranje internog korisničkog naloga
US-26	Izmjena vlastitog zahtjeva
US-27	Otkazivanje vlastitog zahtjeva
