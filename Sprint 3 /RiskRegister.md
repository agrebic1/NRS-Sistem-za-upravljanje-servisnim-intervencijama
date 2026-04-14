# Risk Register

Tabela rizika: 

| ID | Opis rizika | Uzrok | Vjerovatnoća | Uticaj | Prioritet rizika | Plan mitigacije | Odgovorna osoba ili uloga | Status |
|----|-------------|-------|--------------|--------|------------------|-----------------|---------------------------|--------|
| R-01 | Problemi sa autentifikacijom i RBAC logikom: | Nedovoljno jasno definisana pravila pristupa i greške u implementaciji autentifikacije | 2 | 3 | 6 | Implementirati provjerene autentifikacijske mehanizme, jasno definisati RBAC pravila i izvršiti detaljno testiranje pristupa | Backend developer | U praćenju |
| R-02 | Kašnjenje integracije između modula: | Neusklađen razvoj različitih modula i nedovoljna komunikacija u timu | 3 | 2 | 6 | Definisati jasne interfejse između modula i uvesti redovne integracione provjere | Team lead | U praćenju |
| R-03 | Preširok obim sprinta: | Loša procjena vremena i prevelik broj zadataka u sprintu | 2 | 3 | 6 | Bolje planiranje sprinta i realnija procjena zadataka | Scrum master | Zatvoren |
| R-04 | Nedovoljno testiranja po sprintu: | Nedostatak vremena ili resursa za testiranje | 2 | 3 | 6 | Uvesti obavezno testiranje i automatizovane testove prije završetka sprinta | QA / tim | U praćenju |
| R-05 | Prekompleksna logika prioriteta i dodjela: | Previše pravila i nedovoljno jasno definisana poslovna logika | 2 | 2 | 4 | Pojednostaviti logiku i jasno definisati pravila za prioritete i dodjelu | Backend developer | Otvoren | 
| R-06 | Nejasno modeliranje statusa i toka intervencija: | Nedovoljno definisan workflow i stanja intervencija | 2 | 3 | 6 | Definisati jasan workflow i dokumentovati sve statuse i prelaze između njih | Analitičar / Team lead | U praćenju |
| R-07 | Neravnomjeran doprinos članova tima: | Loša raspodjela zadataka i nedostatak koordinacije | 2 | 2 | 4 | Jasno definisati zadatke i redovno pratiti napredak članova tima | Team lead | Otvoren |
| R-08 | Problemi sa kvalitetom podataka unesenih od strane korisnika: | Nedostatak validacije i korisničke greške pri unosu | 3 | 2 | 6 | Uvesti validaciju podataka i ograničenja pri unosu | Backend / Frontend developer | U praćenju | 
| R-09 | Pogrešno razumijevanje zahtjeva ili uputa asistenata: | Nedovoljno jasni zahtjevi i komunikacija unutar tima | 2 | 2 | 4 | Precizno definisati zahtjeve i održavati redovne sastanke za razjašnjenje | Team lead / cijeli tim | Zatvoren |
| R-10 | Loša raspodjela zadataka u timu: | Neadekvatno planiranje i neuzimanje u obzir kapaciteta članova tima | 2 | 2 | 4 | Planirati zadatke prema sposobnostima i dostupnosti članova tima | Scrum master / Team lead | Otvoren |
| R-11 | Kašnjenje integracije paralelno razvijanih dijelova: | Paralelni razvoj bez koordinacije i neusklađeni interfejsi | 3 | 2 | 6 | Redovno usklađivanje između timova i ranije testiranje integracije | Team lead | U praćenju |
| R-12 | Kasne promjene odluka o modelu sistema: | Nedovoljno jasno definisani zahtjevi na početku projekta | 2 | 3 | 6 | Bolja analiza zahtjeva i validacija sa stakeholderima prije implementacije | Analitičar / Team lead | Otvoren |
| R-13 | Nedovoljno razrađeni alternativni scenariji: | Fokus samo na osnovne (happy path) scenarije | 2 | 2 | 4 | Detaljnije definisati edge case-ove i negativne scenarije | Tim | Otvoren |
| R-14 | Prevelika zavisnost između sprintova: | Loše planiranje i međusobna zavisnost funkcionalnosti | 2 | 3 | 6 | Planirati sprintove tako da budu što nezavisniji | Scrum master / Team lead | U praćenju |
| R-15 | Površno tetsiranje samo happy path-a: | Nedostatak vremena ili fokus samo na osnovne funkcionalnosti | 3 | 2 | 6 | Uvesti testiranje edge case-ova i negativnih scenarija | QA / tim | U praćenju |
| R-16 | Ostavljanje previše posla za završne sprintove: | Loše planiranje i odgađanje kompleksnih zadataka | 2 | 3 | 6 | Ravnomjerno rasporediti zadatke kroz sprintove | Scrum master | Otvoren |
| R-17 | Tehnički dug koji se gomila kroz sprintove: | Brzo implementiranje bez refaktorisanja i optimizacije | 3 | 3 | 9 | Planirati refaktorisanje i redovno smanjivati tehnički dug | Development tim | U praćenju | 




## Legenda za tabelu

Risk Register tabela služi za identifikaciju, procjenu i praćenje rizika tokom projekta.

- **ID rizika** — jedinstvena oznaka rizika radi lakšeg praćenja i referenciranja  
  *Primjer: R-01, R-02, R-03*

- **Naziv rizika** — kratak i jasan naziv koji sažeto opisuje suštinu rizika

- **Opis rizika** — kratko objašnjenje šta bi moglo poći po zlu i zašto je to važno za projekat

- **Kategorija rizika** — vrsta rizika kojoj stavka pripada  
  *Primjeri: tehnički, projektni, organizacijski, zahtjevi, kvalitet, vremenski*

- **Vjerovatnoća** — procjena koliko je vjerovatno da će se rizik pojaviti  
  - **1** = niska  
  - **2** = srednja  
  - **3** = visoka  

- **Uticaj** — procjena koliko bi posljedice bile ozbiljne ako se rizik desi  
  - **1** = nizak  
  - **2** = srednji  
  - **3** = visok  

- **Prioritet rizika** — ukupni nivo ozbiljnosti rizika, računa se formulom:  
  **Prioritet = Vjerovatnoća × Uticaj**  

  Tumačenje:
  - **1–2** = nizak  
  - **3–4** = srednji  
  - **6** = visok  
  - **9** = kritičan  

- **Strategija odgovora / mitigacija** — mjere koje tim planira poduzeti da smanji vjerovatnoću pojave rizika, njegov uticaj ili da ublaži posljedice ako se rizik pojavi

- **Vlasnik rizika** — osoba odgovorna za praćenje rizika i koordinaciju mjera ublažavanja

- **Status rizika** — trenutno stanje rizika  
  - **Otvoren** — rizik je identifikovan i još je aktuelan  
  - **U praćenju** — rizik se prati i provode se mjere ublažavanja  
  - **Ublažen** — vjerovatnoća ili uticaj rizika su smanjeni  
  - **Zatvoren** — rizik više nije relevantan ili više ne utiče na projekat  

- **Pogođeni dio projekta / sprint** — modul, funkcionalnost, sprint ili dio sistema na koji se rizik odnosi

- **Datum identifikacije** — datum kada je rizik prvi put evidentiran

- **Datum posljednje izmjene** — datum posljednjeg ažuriranja zapisa o riziku

- **Napomena** — dodatni komentar, pojašnjenje ili poseban kontekst vezan za rizik
