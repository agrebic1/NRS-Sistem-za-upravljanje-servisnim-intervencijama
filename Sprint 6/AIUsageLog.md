# AI Usage Log


| Polje                       | Opis                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 30.04.2026.                                                                                                                                                                                                                                                                                                                                                   |
| Sprint broj                 | 6                                                                                                                                                                                                                                                                                                                                                             |
| Alat koji je korišten       | Claude AI                                                                                                                                                                                                                                                                                                                                                     |
| Svrha korištenja            | Razvoj kompleksnih formi za upravljanje zahtjevima (prijava, pregled, izmjena, otkazivanje) i administrativni onboarding                                                                                                                                                                                                                                      |
| Kratak opis zadatka         | Implementacija US-05 (Smart Wizard), US-6, US-26, US-27 i US-18 (Onboarding) uz primjenu mjerljivog Velocity Boost-a (povećanje brzine isporuke kroz AI asistenciju).                                                                                                                                                                                         |
| Šta je AI generisao         | Inicijalnu strukturu višestepene forme, JSON shemu za trijažu kvarova, email templejte za onboarding, te osnovnu backend validaciju poslovnih pravila za statuse (US-26, US-27).                                                                                                                                                                              |
| Šta je tim prihvatio        | Mehanizam ""Double-check"" logike za otkazivanje zahtjeva i automatizovane email templejte za onboarding proces (US-16)                                                                                                                                                                                                                                       |
| Šta je tim izmijenio        | Redizajn trijaže: Umjesto generisane forme, implementirana je dvonivojska matrica kategorija u vidu kartica, čime je postignuta maksimalna obuhvatnost i preglednost. Lokalizacija i resursi: Korigovan je modul kalendara i odabir lokacije, integrisane su mape i razrađena stroga poslovna pravila za definisanje termina (radni sati, dostupnost resursa) |
| Šta je tim odbacio          | Generički UI izgled wizarda i standardna dugmad za navigaciju; odbačena je linearna struktura forme u korist interaktivne matrice radi bržeg unosa na terenu                                                                                                                                                                                                  |
| Rizici, problemi ili greške | Izazovi u sinhronizaciji stanja (state management) između koraka Wizarda kod SSR-a i kompleksne integracije mapa; riješeno uvođenjem perzistentnog klijentskog stanja i custom API poziva.                                                                                                                                                                    |
| Ko je koristio alat         | Amina Grebić                                                                                                                                                                                                                                                                                                                                                  |



| Polje                       | Opis                                                                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 02.05.2026.                                                                                                                                  |
| Sprint broj                 | 6                                                                                                                                            |
| Alat koji je korišten       | Cursor                                                                                                                                       |
| Svrha korištenja            | Usklađivanje login/registracija poruka i terminologije kroz kod baze.                                                                        |
| Kratak opis zadatka         | Implementirane su neutralne poruke o greškama kroz auth tokove i standardizovan je naziv "email" umjesto "e-pošta" u formama i validacijama. |
| Šta je AI generisao         | Prijedloge refaktorisanja poruka greške, mapiranje poruka kroz auth servis i listu mjesta gdje treba uskladiti terminologiju.                |
| Šta je tim prihvatio        | Neutralan stil poruka greške i jedinstvenu terminologiju u UI i API sloju.                                                                   |
| Šta je tim izmijenio        | Prilagođeni su tekstovi da budu usklađeni sa tonom aplikacije i QA očekivanjima.                                                             |
| Šta je tim odbacio          | Previše tehničke poruke koje otkrivaju interne detalje greške korisniku.                                                                     |
| Rizici, problemi ili greške | Rizik neusklađenosti poruka po modulima; mitigirano centralizacijom mapiranja auth grešaka.                                                  |
| Ko je koristio alat         | Ajna Ičić                                                                                                                                    |



| Polje                       | Opis                                                                                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 03.05.2026.                                                                                                                                                      |
| Sprint broj                 | 6                                                                                                                                                                |
| Alat koji je korišten       | Claude AI                                                                                                                                                        |
| Svrha korištenja            | Dovršavanje registracijskog toka sa potvrdom emaila i ponovnim slanjem koda.                                                                                     |
| Kratak opis zadatka         | Implementirana auto-prijava nakon kreiranja profila gdje je moguće, te dodan fallback tok potvrde emaila sa formom za ponovno slanje verifikacijskog koda/linka. |
| Šta je AI generisao         | Predloženu strukturu stanja registracije (uspjeh, potrebna potvrda, greška), UX tok za resend i poruke za korisnika.                                             |
| Šta je tim prihvatio        | Potvrdu emaila kao obavezan dio user story-ja i odvojenu formu za ponovno slanje.                                                                                |
| Šta je tim izmijenio        | Auto-login je zadržan samo kada backend vrati validnu sesiju; u suprotnom korisnik ide kroz potvrdu emaila.                                                      |
| Šta je tim odbacio          | Jednostavni tok bez potvrde emaila koji je bio u konfliktu sa sigurnosnim zahtjevima.                                                                            |
| Rizici, problemi ili greške | Potencijalni edge case kod maskiranog duplikata emaila; mitigirano eksplicitnim error handling-om i jasnom porukom korisniku.                                    |
| Ko je koristio alat         | Amina Grebić                                                                                                                                                     |



| Polje                       | Opis                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 04.05.2026.                                                                                                                                                               |
| Sprint broj                 | 6                                                                                                                                                                         |
| Alat koji je korišten       | Cursor                                                                                                                                                                    |
| Svrha korištenja            | Refaktor prijave zahtjeva i usklađivanje logike obrasca sa user stories.                                                                                                  |
| Kratak opis zadatka         | Uklonjen mrtav kod stare forme, prepravljena logika "Vrsta kvara", poboljšana selekcija lokacije i termin prebačen na model preferiranog termina koji dispečer potvrđuje. |
| Šta je AI generisao         | Prijedlog čišćenja neiskorištenih grana, novu strukturu validacije forme i tekstualne izmjene za jasnije kategorije.                                                      |
| Šta je tim prihvatio        | Model preferiranog termina, prikaz završnog pregleda zahtjeva prije potvrde i mogućnost odustajanja od kreiranja.                                                         |
| Šta je tim izmijenio        | Nazivi i opisi form polja su prilagođeni da pokrivaju i instalacije/održavanje, ne samo kvar.                                                                             |
| Šta je tim odbacio          | Obavezno finalno biranje termina od strane korisnika bez dispečerske potvrde.                                                                                             |
| Rizici, problemi ili greške | Neusklađenost između US opisa i forme; mitigirano ažuriranjem US stavki i QA scenarija.                                                                                   |
| Ko je koristio alat         | Ajla Ćesir                                                                                                                                                                |



| Polje                       | Opis                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 05.05.2026.                                                                                                                                    |
| Sprint broj                 | 6                                                                                                                                              |
| Alat koji je korišten       | Cursor                                                                                                                                         |
| Svrha korištenja            | Stabilizacija baze i performansi prije završne validacije sprinta.                                                                             |
| Kratak opis zadatka         | Riješeni su identifikovani DB problemi i performance upozorenja, te usklađeni ID tipovi za sve uloge da budu stvarni numerički identifikatori. |
| Šta je AI generisao         | Check-listu migration koraka, SQL prijedloge za cleanup i preporuke za optimizaciju upita.                                                     |
| Šta je tim prihvatio        | Paket optimizacija i korekcija koji je podigao stabilnost API poziva i konzistentnost podataka.                                                |
| Šta je tim izmijenio        | Dio upita je ručno prilagođen nakon pregleda execution plan-a i poslovnih ograničenja.                                                         |
| Šta je tim odbacio          | Brza rješenja koja bi mogla narušiti konzistentnost podataka kroz različite uloge.                                                             |
| Rizici, problemi ili greške | Rizik regresije nakon DB izmjena; mitigirano dodatnim testiranjem i verifikacijom kroz automatizovane testove.                                 |
| Ko je koristio alat         | Ajna Ičić                                                                                                                                      |



| Polje                       | Opis                                                                                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 06.05.2026.                                                                                                                                                            |
| Sprint broj                 | 6                                                                                                                                                                      |
| Alat koji je korišten       | Cursor                                                                                                                                                                 |
| Svrha korištenja            | Usklađivanje premium lifecycle implementacije kroz bazu, API i UI za korisnika/dispečera/admina.                                                                       |
| Kratak opis zadatka         | Implementiran je premium lifecycle model sa statusima, korisničkim aktivacionim tokom, admin lifecycle upravljanjem, audit evidencijom i cron istekom premium statusa. |
| Šta je AI generisao         | Predloženu strukturu lifecycle tranzicija, API route kosture (`start`, `confirm`, `cancel`, `renew`), promjene za admin API i redizajn premium korisničke stranice.    |
| Šta je tim prihvatio        | Dvokorak aktivacije (`start` -> `confirm`), premium event audit, statusno upravljanje kroz admin panel i UI poboljšanja premium aktivacije.                            |
| Šta je tim izmijenio        | Uklonjen je brzi endpoint aktivacije; tok je standardizovan na dvokorak. Premium UI je doradjen sa jasnijim planovima i validacijom podataka kartice.                  |
| Šta je tim odbacio          | Quick activation endpoint i kombinovani tok koji je preskakao standardni activation flow.                                                                              |
| Rizici, problemi ili greške | Potrebno osigurati da je `CRON_SECRET` postavljen u produkciji; bez toga cron endpoint ne treba biti javno dostupan.                                                   |
| Ko je koristio alat         | Ajla Ćesir                                                                                                                                                             |



| Polje                       | Opis                                                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 06.05.2026.                                                                                                                                                          |
| Sprint broj                 | 6                                                                                                                                                                    |
| Alat koji je korišten       | Cursor                                                                                                                                                               |
| Svrha korištenja            | Proširenje premium lifecycle funkcionalnosti kroz API i admin upravljanje.                                                                                           |
| Kratak opis zadatka         | Uveden je lifecycle model (`inactive`, `pending_payment`, `active`, `expired`, `cancelled`) i usklađeni su admin/korisnički tokovi bez brzog aktivacionog endpointa. |
| Šta je AI generisao         | Predložene tranzicije state machine logike, skeleton endpointa (`start`, `confirm`, `cancel`, `renew`) i mapiranje statusnih poruka prema UI-u.                      |
| Šta je tim prihvatio        | Striktni dvokorak aktivacije (`start -> confirm`) i audit event logging za premium akcije.                                                                           |
| Šta je tim izmijenio        | Admin premium ON/OFF model zamijenjen lifecycle akcijama po statusima; profil API dopunjen cancellation metadata poljima.                                            |
| Šta je tim odbacio          | Quick/activate endpoint koji zaobilazi standardne validacije tranzicije.                                                                                             |
| Rizici, problemi ili greške | Potencijalna neusklađenost lifecycle stanja između UI i API sloja; mitigirano dodatnim validacijama tranzicija i test scenarijima.                                   |
| Ko je koristio alat         | Amina Grebić                                                                                                                                                         |



| Polje                       | Opis                                                                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 06.05.2026.                                                                                                                                              |
| Sprint broj                 | 6                                                                                                                                                        |
| Alat koji je korišten       | Claude AI                                                                                                                                                |
| Svrha korištenja            | Poboljšanje korisničkog premium UI iskustva i poruka u wizardu/trijaži.                                                                                  |
| Kratak opis zadatka         | Premium korisnička stranica je preoblikovana u subscription activation stil sa planovima, payment validacijama i statusnim prikazom po lifecycle fazama. |
| Šta je AI generisao         | Prijedlog sekcija UI-a (planovi, payment forma, status kartice, historija događaja) i tekstualne poruke za CTA/greške.                                   |
| Šta je tim prihvatio        | Prikaz planova (mjesečni/godišnji), validacije kartice/roka/CVV i odvojena stanja za `inactive/pending/active/expired/cancelled`.                        |
| Šta je tim izmijenio        | Tekstovi u wizardu i kategorizaciji su dodatno prilagođeni poslovnoj terminologiji (prijava zahtjeva umjesto prijava kvara gdje je primjenjivo).         |
| Šta je tim odbacio          | Generičke poruke za kategoriju "Ostalo" koje nisu dovoljno jasne krajnjem korisniku.                                                                     |
| Rizici, problemi ili greške | Rizik konfuzije korisnika zbog nejasnih kategorija i naziva akcija; smanjen kroz preciznije poruke i CTA tekstove.                                       |
| Ko je koristio alat         | Ajna Ičić                                                                                                                                                |



| Polje                       | Opis                                                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 07.05.2026.                                                                                                                            |
| Sprint broj                 | 6                                                                                                                                      |
| Alat koji je korišten       | Cursor                                                                                                                                 |
| Svrha korištenja            | Validacija i finalno usklađivanje QA dokumentacije za Sprint 6 manual flows.                                                           |
| Kratak opis zadatka         | Usklađeni su EXEC, BUG i SIGNOFF fajlovi za SB-06-20, uključujući status prolaznosti 24/24 i usklađene podatke o izvršiocima.          |
| Šta je AI generisao         | Prijedlog standardizovanih vrijednosti za status, datum, okruženje i raspored izvršilaca kroz test slučajeve.                          |
| Šta je tim prihvatio        | Jedinstven format za evidenciju izvršenja testova i konsolidovan QA sign-off rezime.                                                   |
| Šta je tim izmijenio        | Uklonjene su putanje dokaza iz tabela i prilagođen tekst očekivanih/stvarnih rezultata za realni proces rada tima.                     |
| Šta je tim odbacio          | Korištenje screenshot dokaza kao obavezne kolone u SB-06-20 tabelama.                                                                  |
| Rizici, problemi ili greške | Rizik nekonzistentnosti između ručnih i automatskih izvještaja; riješeno jedinstvenim izvorom podataka i ponovnom validacijom fajlova. |
| Ko je koristio alat         | Ajna Ičić                                                                                                                              |



| Polje                       | Opis                                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 07.05.2026.                                                                                                                                           |
| Sprint broj                 | 6                                                                                                                                                     |
| Alat koji je korišten       | Cursor                                                                                                                                                |
| Svrha korištenja            | Definisanje jedinstvene komande za pokretanje svih testova i generisanje izvještaja.                                                                  |
| Kratak opis zadatka         | Implementirana je komanda `npm run test:izvjestaj` koja pokreće unit, integration, coverage i e2e testove te automatski generiše timestamp izvještaj. |
| Šta je AI generisao         | Node skriptu za orchestration testova, kreiranje foldera `docs/testing/Izvjestaji/<datum_vrijeme>/`, generisanje `IZVJESTAJ.md` i log fajlova.        |
| Šta je tim prihvatio        | Strukturu izvještavanja sa run ID-jem, statusom (PASS/FAIL), coverage metrikama i pointer fajlom `ZADNJI_RUN.txt`.                                    |
| Šta je tim izmijenio        | E2E korak je promijenjen na `--workers=1` radi stabilnosti batch pokretanja i smanjenja flaky padova.                                                 |
| Šta je tim odbacio          | Ručno sastavljanje izvještaja nakon svakog run-a.                                                                                                     |
| Rizici, problemi ili greške | Povremeni fail E2E login scenarija u paralelnom režimu; mitigirano serijskim izvršavanjem E2E testova.                                                |
| Ko je koristio alat         | Ajla Ćesir                                                                                                                                            |



| Polje                       | Opis                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Datum                       | 07.05.2026.                                                                                                                       |
| Sprint broj                 | 6                                                                                                                                 |
| Alat koji je korišten       | Cursor                                                                                                                            |
| Svrha korištenja            | Hardening sigurnosnih i operativnih tačaka premium lifecycle tokova.                                                              |
| Kratak opis zadatka         | Hardenovan je cron premium-expiry endpoint uz obavezni `CRON_SECRET` u produkciji i zadržanu kompatibilnost sa postojećim flowom. |
| Šta je AI generisao         | Check-listu sigurnosnih uslova za produkciju, fallback ponašanja i smjernice za validaciju endpoint autentifikacije.              |
| Šta je tim prihvatio        | Obaveznost tajnog ključa za cron u produkciji i dodatne provjere prije izvršavanja expiry logike.                                 |
| Šta je tim izmijenio        | Dokumentacija je dopunjena operativnim napomenama i QA validacijom vezanom za cron endpoint.                                      |
| Šta je tim odbacio          | Otvoren javni cron endpoint bez verifikacije tajnog ključa.                                                                       |
| Rizici, problemi ili greške | Pogrešna produkcijska konfiguracija može onemogućiti expiry proces; mitigacija kroz eksplicitnu konfiguracionu provjeru.          |
| Ko je koristio alat         | Ajla Ćesir                                                                                                                        |



| Polje                       | Opis                                                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Datum                       | 07.05.2026.                                                                                                                                                                    |
| Sprint broj                 | 6                                                                                                                                                                              |
| Alat koji je korišten       | Claude AI                                                                                                                                                                      |
| Svrha korištenja            | Implementacija i stabilizacija automatizovane test-run komande na kod nivou.                                                                                                   |
| Kratak opis zadatka         | Napisana je Node skripta koja orkestrira `npm test`, `npm run test:coverage` i `npm run test:e2e`, zatim generiše timestamp folder izvještaja sa logovima i coverage sazetkom. |
| Šta je AI generisao         | Osnovni kod za `tools/pokreniSveTestoveIzvjestaj.mjs` (spawn komande, obrada exit code-a, kreiranje `IZVJESTAJ.md` i `ZADNJI_RUN.txt`).                                        |
| Šta je tim prihvatio        | Jedinstvenu komandu `npm run test:izvjestaj` i strukturu artefakata u `docs/testing/Izvjestaji/<datum_vrijeme>/`.                                                              |
| Šta je tim izmijenio        | E2E dio skripte je promijenjen na `--workers=1` da bi se uklonili flaky padovi pri batch pokretanju.                                                                           |
| Šta je tim odbacio          | Paralelni E2E run u okviru agregatne komande zbog nestabilnosti login scenarija.                                                                                               |
| Rizici, problemi ili greške | Povremeni race condition i autentifikacioni fail u E2E kada se testovi vrte paralelno; mitigirano serijskim worker režimom i detaljnim logovanjem po koraku.                   |
| Ko je koristio alat         | Amina Grebić                                                                                                                                                                   |


