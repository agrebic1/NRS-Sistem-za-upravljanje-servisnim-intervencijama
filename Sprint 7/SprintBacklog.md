# Sprint Goal

### Sprint broj 7

### Sprint cilj

Omogućiti dispečerima centralizovan operativni pregled svih aktivnih intervencija kroz dashboard, statusne liste i detaljne prikaze zahtjeva, uz uspostavljanje mehanizma za određivanje operativnog prioriteta intervencija i dodatno unapređenje upravljanja korisničkim zahtjevima kroz validiranu izmjenu i otkazivanje zahtjeva.


### Ključne stavke koje tim želi završiti

- implementacija dispečerskog pregleda otvorenih intervencija (US-07): *lista aktivnih zahtjeva sa osnovnim podacima, indikatorima priloga i lokacije (detalj/expand), grid kartica je sažetak, filtri po operativnim fazama i `potvrdeno`*
- implementacija detaljnog prikaza pojedinačne intervencije (US-08): *kompletan pregled korisničkih i operativnih podataka potrebnih za obradu zahtjeva*
- pregled statusa intervencija za dispečere (US-13): *statusni pregled aktivnih zahtjeva sa automatskim osvježavanjem podataka*
- implementacija operativnog dashboarda (US-31): *agregirani prikaz broja intervencija po statusima i prelazak na filtrirane liste*
- određivanje operativnog prioriteta intervencija (US-12): *dodjela i izmjena prioriteta od strane dispečera uz jasno razdvajanje korisničke hitnosti i operativnog prioriteta*
- dorada izmjene vlastitog zahtjeva (US-26): *dodatna ograničenja izmjene po statusima i validacija dozvoljenih polja*
- dorada otkazivanja vlastitog zahtjeva (US-27): *obavezni razlog otkazivanja, validacija statusa i uklanjanje iz aktivnih dispečerskih lista*
- usklađivanje statusa između korisničkog i dispečerskog dijela sistema
- implementacija role-based zaštite za sve dispečerske funkcionalnosti
- testiranje kompletnog toka: *korisnik kreira zahtjev → dispečer vidi zahtjev → otvara detalje → postavlja operativni prioritet (čarobnjak: termin, serviser, završna potvrda) → status `potvrdeno` → spremno za dodjelu serviseru u narednom sprintu*


### Rizici i zavisnosti

Sprint 7 uvodi centralnu operativnu logiku za rad dispečera i predstavlja osnovu za buduću dodjelu intervencija serviserima. Ako statusni pregledi, prioriteti i detalji intervencija nisu pravilno implementirani:

- dispečeri mogu donositi pogrešne operativne odluke zbog nepotpunih ili neažuriranih podataka
- može doći do neusklađenosti između korisničkog i dispečerskog prikaza statusa
- prioritet intervencije može biti pogrešno interpretiran ako nije jasno odvojen od korisničke hitnosti
- zahtjevi koji su otkazani ili zatvoreni mogu ostati vidljivi u aktivnim operativnim listama

### Postoji rizik:

- **state management**: kompleksnost sinhronizacije statusa i prioriteta između više ekrana
- **sigurnost**: neadekvatna zaštita dispečerskih ruta i API endpointa
- **konzistentnost podataka**: mogućnost da statusi i prioriteti ostanu neusklađeni između baze i korisničkog interfejsa
- **UX kompleksnost**: veliki broj operativnih podataka može otežati preglednost dashboarda i detalja intervencije

### Zavisnosti:

- stabilan sistem autentifikacije i role-based pristupa iz prethodnih sprintova
- ispravno evidentiranje zahtjeva i statusa iz Sprinta 6
- pouzdano spremanje lokacijskih i prilog podataka iz korisničkog wizard toka
- definisana struktura statusa intervencije i životnog ciklusa zahtjeva

---

# Sprint Backlog - Sprint 7

| ID | Naziv zadatka ili storyja | Odgovorna osoba ili osobe | Status | Napomena |
|---|---|---|---|---|
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
| SBI-06-14 | Prijava zahtjeva za servisnu intervenciju (US-05) | Frontend + backend | Done | Implementiran wizard sa kategorijama/potkategorijama, mapom, terminima i trijažom, validacija usklađena sa API slojem. |
| SBI-06-15 | Pregled vlastitog zahtjeva (US-06) | Frontend + backend + baza | Done | Implementiran pregled liste i detalja vlastitih zahtjeva sa statusima i premium oznakama. |
| SBI-06-16 | Administrativno kreiranje internog korisničkog naloga (US-18) | Frontend + backend + baza | Done | Administrativni onboarding internih korisnika i dodjela uloga implementirani kroz admin tok. |
| SBI-06-17 | Izmjena vlastitog zahtjeva (US-26) | Frontend + backend + baza | Done | PATCH `/api/service-requests/[id]`: samo `na_cekanju` / `pending_review`, Zod ograničava polja, nakon dispečerskog čarobnjaka (`in_review`) izmjena je blokirana. |
| SBI-06-18 | Otkazivanje vlastitog zahtjeva (US-27) | Frontend + backend + baza | Done | Obavezan `cancel_reason`, `cancelled_at`, ista pravila statusa kao izmjena, dispečerski pregled isključuje terminalne statuse, realtime uklanja otkazane iz inboxa. |
| SBI-06-19 | Zahtjev za premium/hitnom uslugom (US-33) | Frontend + backend + baza | Done | Usklađen korak Hitnost/Premium sa US-05, backend validira premium status i dispečerski override razloga. U MVP-u naplata ostaje simulirana. |
| SBI-06-20 | Testiranje toka prijave kvara i onboarding procesa | Testeri / QA | Done | Pokriveni su ključni ručni scenariji, potrebno finalno formalno sign-off test matrice. |
| SBI-06-21 | Aktivacija premium usluge (US-34) | Frontend + backend + baza | Done | Implementiran premium lifecycle (inactive, pending_payment, active, expired, cancelled), API tok (start/confirm/cancel/renew), audit log (premium_events) i cron expiry obrada. |
| SBI-06-22 | Podnosenje zahtjeva za internu ulogu (dispecer/serviser) sa statusom na_cekanju (US-35) | Product owner + QA + Solution architect | Done | Implementirano da korisnik moze poslati zahtjev da postane serviser ili dispecer. |
| SBI-07-23 | Dispečerski pregled otvorenih zahtjeva / intervencija (US-07) | Frontend + backend | Done | Implementirani kontrolna ploča i pregled liste aktivnih zahtjeva sa osnovnim podacima; indikatori priloga i lokacije u proširenom prikazu i na detalju; mreža kartica daje sažetiji pregled; filtriranje po operativnim fazama i statusu potvrđeno; prelazak na detalj intervencije. |
| SBI-07-24 | Pregled detalja pojedinačne intervencije (US-08) | Frontend + backend | Done | Implementiran detaljni prikaz zahtjeva sa informacijama potrebnim za obradu i operativno planiranje; vođenje kroz korake dispečerskog čarobnjaka; dio koraka još nije potpuno povezan sa svim poslovnim podacima. |
| SBI-07-25 | Pregled statusa intervencija od strane dispečera (US-13) | Frontend + backend | Done | Omogućen pregled aktivnih intervencija po fazama uz povremeno osvježavanje podataka i obavještenja o relevantnim promjenama (npr. otkazivanje, premium); jasni vizuelni indikatori trenutne faze obrade. |
| SBI-07-26 | Operativni dashboard / sažeti status (US-31) | Frontend + backend | Done | Implementiran sažeti prikaz broja zahtjeva u ključnim fazama (Novi, U obradi, Potvrđeno) sa prelaskom na filtrirane liste; inbox sa podijeljenim prikazom na većim ekranima. |
| SBI-07-27 | Određivanje prioriteta intervencije (US-12) | Frontend + backend + baza | Done | Omogućeno postavljanje i izmjena operativnog prioriteta od strane dispečera, uključujući posebna pravila za premium zahtjeve; prioritet je vidljiv u listama i detaljima; usklađeno sa životnim ciklusom statusa u inboxu. |
| SBI-07-28 | Izmjena vlastitog zahtjeva | Frontend + backend + baza | Done | Izmjena je dozvoljena samo prije početka dispečerske obrade zahtjeva, uz validaciju dozvoljenih polja i bilježenje vremena izmjene u sistemu. |
| SBI-07-29 | Otkazivanje vlastitog zahtjeva | Frontend + backend + baza | Done | Otkazivanje je moguće uz obavezan razlog i bilježenje vremena otkazivanja, dok zahtjev nije u aktivnoj dispečerskoj obradi; otkazani zahtjevi više nisu dio aktivnih operativnih lista. |
| SBI-07-30 | Usklađivanje statusa između korisničkog i dispečerskog pregleda | Backend + baza | Done | Osigurana konzistentnost prikaza statusa i faza između korisničkog modula, dispečerskih ekrana i stanja u bazi podataka. |
| SBI-07-31 | Dodavanje filtriranja po statusu za dispečerske liste | Frontend + backend | Done | Implementirano filtriranje otvorenih intervencija po statusima i pod-fazama obrade uz osvježavanje prikaza nakon promjene podataka. |
| SBI-07-32 | Provjera role-based pristupa za dispečerske funkcionalnosti | Backend / security support | Done | Dispečerske stranice i prateće operacije na serveru dostupne su samo ovlaštenim korisnicima sa ulogom dispečera. |
| SBI-07-33 | Validacija izmjene i otkazivanja zahtjeva prema statusima | Backend + frontend | Done | Implementirane provjere na backendu i jasne poruke u interfejsu kako bi izmjena i otkazivanje bili mogući samo u dozvoljenim statusima životnog ciklusa zahtjeva. |
| SBI-07-34 | Razdvajanje korisničke hitnosti i operativnog prioriteta | Backend + frontend + baza | Done | Korisnička procjena hitnosti ostaje informativna; operativni prioritet koji određuje dispečer jasno je odvojen u prikazu i u redoslijedu obrade u inboxu. |
| SBI-07-35 | Testiranje operativnog toka dispečera | Testeri / QA | Done | Formalno testiranje i QA sign-off završeni (Ajla Ćesir, 15/05/2026): svi 26 manualnih scenarija PASSED, uključujući dispečerski čarobnjak do statusa potvrđeno, premium pravila, RBAC, usklađenost statusa i rubne slučajeve. |
