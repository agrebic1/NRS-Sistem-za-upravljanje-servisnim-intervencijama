# Sprint Goal

### Sprint broj 6

### Sprint cilj

Omogućiti korisnicima intuitivan proces prijave kvara kroz pametni wizard, uspostaviti mehanizam za upravljanje vlastitim zahtjevima (pregled, izmjena, otkazivanje) i automatizovati proces onboardinga servisnih partnera putem administrativne verifikacije. 

## Ključne stavke koje tim želi završiti

- implementacija pametnog wizarda za prijavu kvara (US-05): 5+1 sistem kategorizacije, integracija mape, hromatski kalendar i trijaža

- upravljanje životnim ciklusom zahtjeva (US-06, US-26, US-27): Pregled statusa u realnom vremenu, mogućnost izmjene i sigurno otkazivanje zahtjeva dok je u statusu "na čekanju"

- premium model u toku prijave (US-34, US-33): aktivacija premium statusa, validacija premium prava pri slanju zahtjeva, prioritetna obrada i notifikacije prema dispečeru/adminu

- onboarding i verifikacija partnera (US-18): Hibridna forma za servisere i dispečere sa Zod fail-fast validacijom

- administrativna aktivacija naloga: Automatsko kreiranje auth korisnika, dodjela verifikacione kvačice i slanje pristupnih podataka putem emaila

- testiranje end-to-end toka: Validacija procesa od momenta slanja prijave kvara do momenta kada admin odobri servisera koji taj kvar treba preuzeti

## Rizici i zavisnosti

Sprint 6 unosi prvu pravu poslovnu logiku i direktnu interakciju između tri strane (korisnik, admin, partner).
Ako procesi prijave i onboardinga nisu ispravno implementirani:

- korisnici mogu unositi nepotpune ili netačne podatke (rizik loše validacije)

- partneri (serviseri) neće moći pristupiti sistemu jer proces kreiranja naloga od strane admina može zakazati

- dolazi do neusklađenosti prioriteta ako priority score algoritam ne obrađuje trijažu ispravno

Postoji rizik:

- eksterni servisi: Problemi sa slanjem emailova (Resend/SMTP) ili API-jem za mape

- state Management: Kompleksnost održavanja stanja wizarda kroz 4 koraka

- sigurnost: Rizik da admin API za kreiranje korisnika ne bude pravilno zaštićen (samo za administratore)

Zavisnosti:

- stabilna struktura baze podataka definisana u Sprintu 5

- ispravno funkcionisanje role-based ruta (kako bi admin pristupio onboarding listi)

- pouzdanost email servisa za dostavu privremenih lozinki


# Sprint Backlog – Sprint 6

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
| SBI-05-13 | Validacija autentifikacije i kontrole pristupa korisnika | QA / Solution architect | Done | Validacija poslovnih pravila i logike sistema. | 
| SBI-06-14 | Prijava zahtjeva za servisnu intervenciju (US-05) | Frontend + backend | Done | Implementiran wizard sa kategorijama/potkategorijama, mapom, terminima i trijažom; validacija usklađena sa API slojem. |
| SBI-06-15 | Pregled vlastitog zahtjeva (US-06) | Frontend + backend + baza | Done | Implementiran pregled liste i detalja vlastitih zahtjeva sa statusima i premium oznakama. |
| SBI-06-16 | Administrativno kreiranje internog korisničkog naloga (US-18) | Frontend + backend + baza | Done | Administrativni onboarding internih korisnika i dodjela uloga implementirani kroz admin tok. |
| SBI-06-17 | Izmjena vlastitog zahtjeva (US-26) | Frontend + backend + baza | Done | Omogućena izmjena zahtjeva kada je status dozvoljen, uz backend validaciju pravila statusa. | 
| SBI-06-18 | Otkazivanje vlastitog zahtjeva (US-27) | Frontend + backend + baza | Done | Implementirana funkcija otkazivanja sa potvrdom i promjenom statusa na "otkazano". |
| SBI-06-19 | Zahtjev za premium/hitnom uslugom (US-33) | Frontend + backend + baza | Done | Usklađen korak Hitnost/Premium sa US-05; backend validira premium status i dispečerski override razloga. U MVP-u naplata ostaje simulirana. |
| SBI-06-21 | Aktivacija premium usluge (US-34) | Frontend + backend + baza | Done | Implementiran premium lifecycle (`inactive`, `pending_payment`, `active`, `expired`, `cancelled`), API tok (`start/confirm/cancel/renew`), audit log (`premium_events`) i cron expiry obrada. |
| SBI-06-20 | Testiranje toka prijave kvara i onboarding procesa | Testeri / QA | In Progress | Pokriveni su ključni ručni scenariji; potrebno finalno formalno sign-off test matrice. |

