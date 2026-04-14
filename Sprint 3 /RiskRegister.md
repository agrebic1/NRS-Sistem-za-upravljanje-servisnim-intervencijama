# Risk Register

Tabela rizika: 

| ID | Opis rizika | Uzrok | Vjerovatnoća | Uticaj | Prioritet rizika | Plan mitigacije | Odgovorna osoba ili uloga | Status |
|----|-------------|-------|--------------|--------|------------------|-----------------|---------------------------|--------|
| R-01 | Problemi sa autentifikacijom i RBAC logikom: | Nedovoljno jasno definisana pravila pristupa i greške u implementaciji autentifikacije | 2 | 3 | 6 | Implementirati provjerene autentifikacijske mehanizme, jasno definisati RBAC pravila i izvršiti detaljno testiranje pristupa | Backend developer | Otvoren |
| R-02 | Kašnjenje integracije između modula: |
| R-03 | Preširok obim sprinta: |
| R-04 | Nedovoljno testiranja po sprintu: |
| R-05 | Prekompleksna logika prioriteta i dodjela: |
| R-06 | Nejasno modeliranje statusa i toka intervencija: |
| R-07 | Neravnomjeran doprinos članova tima: |
| R-08 | Problemi sa kvalitetom podataka unesenih od strane korisnika: |
| R-09 | Pogrešno razumijevanje zahtjeva ili uputa asistenata: |
| R-10 | Loša raspodjela zadataka u timu: |
| R-11 | Kašnjenje integracije paralelno razvijanih dijelova: |
| R-12 | Kasne promjene odluka o modelu sistema: |
| R-13 | Nedovoljno razrađeni alternativni scenariji: |
| R-14 | Prevelika zavisnost između sprintova: |
| R-15 | Površno tetsiranje samo happy path-a: |
| R-16 | Ostavljanje previše posla za završne sprintove: |
| R-17 | Tehnički dug koji se gomila kroz sprintove: |




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
