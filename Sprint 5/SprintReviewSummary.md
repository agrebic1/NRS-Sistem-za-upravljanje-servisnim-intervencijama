# Sprint Review Summary
## Sprint broj 5

## Planirani sprint goal
Uspostaviti stabilan i siguran ulazak korisnika u sistem kroz registraciju i prijavu, omogućiti upravljanje sesijom, osnovnu kontrolu pristupa prema korisničkim ulogama i preusmjeravanje korisnika na odgovarajući početni dashboard.

## Šta je završeno

Planirane aktivnosti koje su završene u ovom sprintu su: 
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
  
## Šta nije završeno

Sve stavke koje su planirane u okviru Sprinta 5 su završene. 

## Demonstritane funkcionalnosti ili artefakti

U ovom sprintu demonstrirane su sljedeće funkcionalnosti i artefakti: 
- AI Usage Log
- Decision Log
- Sprint Backlog
- Registracija korisnika
- Prijava korisnika
- Odjava korisnika
- Prikaz osnovnog dashboarda po ulozi
- Upravljanje korisničkom sesijom
- Zaštita ruta prema ulozi korisnika
  
## Glavni problemi i blokeri

## Ključne uloge donesene u sprintu
- Centralizovana landing stranica sa više ulaznih tokova - tim je odlučio da se koristi centralizovana landing stranica zbog jednostavnijeg korisničkog iskustva i jasne strukture ulaza u sistem
- Javna registracija kreira samo korisnika usluge - odlučeno je da javna registracija kreira nalog samo za korisnika usluge zbog balansa između dostupnosti sistema i sigurnosnog okvira.
- Serviseri prolaze proces prijave i odobrenja - 	odlučeno je da se uvede kontrolisani onboarding proces sa administrativnom verifikacijom i staging zonom prijave aktivacije naloga servisera.
- Podrška za više uloga po jednom korisniku - tim je odlučio da određeni korisnici kao što su administratori, dispečeri i serviseri mogu imati i ulogu korisnika usluge kako bi mogli pokriti realne scenarije korištenja sistema.
- Korisnik koristi sistem kroz jednu aktivnu ulogu - odlučeno je da korisnik koristi aplikaciju kroz jednu aktivnu ulogu zbog jasno definisanog konteksta rada, smanjenje grešaka i bolja kontrola pristupa
- Role-based navigacija i preusmjeravanje korisnika - odlučeno je da se implementira automatsko preusmjeravanje prema aktivnoj ulozi uz mogućnost izbora aktivne uloge radi jasnijeg korisničkog toka, veće efikasnosti i personalizovanog iskustva rada
- Neutralne poruke greške pri autentifikaciji - tim je odlučio da se koriste neutralne poruke greške zbog prevencije user enumeration napada i povećanje nivoa sigurnosti
- Upravljanje sesijom korisnika - tim je odlučio da se koristi hibridni pristup upravljanja sesijom korisnika zbog optimalnog balansa između sigurnosne kontrole, skalabilnosti i sistemskih performansi
- Zaštita ruta na osnovu autentifikacije i uloge - tim je odlučio da se implementira zaštita ruta na osnovu autentifikacije i uloge zbog povećanja sigurnosti kroz kombinaciju kontrola i preciznu autorizaciju pristupa
- Odjava korisnika prekida pristup sistemu - odlučeno je da odjava korisnika prekida pristup sistemu zbog povećanja sigurnosti sistema i eliminacije mogućnosti zloupotrebe aktivnih tokena
- Početni dashboard zavisi od aktivne uloge - tim je odlučio da prikaz početnog dashboarda zavisi od uloge kako bi se smanjilo kognitivnog opterećenja i povećala operativna efikasnost kroz prikaz relevantnih informacija
- Middleware kao centralni "Traffic Controller" - odlučeno je da se middleware koristi kao centralni kontroler zbog centralizacije sigurnosne logike, veće konzistentnosti i smanjenja mogućnosti greške
- Razdvajanje auth naloga od operativnih profila - tim je odlučio da se auth nalog odvoji od operativnog profila kako bi se povećala sigurnost, osigurala jasna separacija odgovornosti i fleksibilnost sistema
- Automatska prijava nakon uspješne registracije - odlučeno je da korisnik nakon uspješne registracije bude automatski prijavljen na sistem zbog boljeg korisničkog iskustva i eliminacije nepotrebnih koraka
- Fail-fast validacija pomoću Zod shema - tim je odlučio da se koristi Zod validacija na frontend strani uz backend provjere radi dobijanja brze povratne informacije i smanjenja nepotrebnih zahtjeva prema serveru
 
## Povratna informacija Product Ownera

Product Owner je skrenuo pažnju na proširenje User story-ja koje smo implementirali u sprintu 5 te naglasio važnost usklađivanja zahtjeva product ownera sa odlukama tima.

## Zaključak za naredni sprint

S obzirom na uspješnu implementaciju svih aktivnosti vezanih za sprint 5 tim može preći na implementaciju aktivnosti iz sprinta 6. 
