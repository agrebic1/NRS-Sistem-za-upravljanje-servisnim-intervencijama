# Početni Product Backlog
U ovom dokumentu je prikazan početni product backlog sistema za upravljanje servisnim intervencijama. Backlog obuhvata ključne funkcionalnosti i zahtjeve sistema kojw su organizovane prema prioritetu i procijenjenoj složenosti, te su povezane sa planiranim sprintovima i verzijama sistema. 

Kako bismo osigurali konzistentnost i razumijevanje unutar tima, koristimo sljedeće standarde za definisanje stavki:

1. Tip stavke (Item Type)
Određuje prirodu posla koji treba obaviti:

Feature: Nova funkcionalnost sistema koja donosi direktnu vrijednost korisniku (npr. Prijava kvara).

Bug: Ispravka greške u postojećoj funkcionalnosti koja ne radi kako je planirano.

Technical Task: Rad na infrastrukturi, bazi podataka ili kodu koji je neophodan za funkcionisanje sistema (npr. Setup servera).

Research: Istraživanje tehnologija, API-ja ili korisničkih potreba prije same implementacije.

Documentation: Izrada korisničkih uputstava, tehničkih specifikacija ili dijagrama.

2. Prioritet (Priority)
Određuje redoslijed rješavanja stavki prema poslovnoj važnosti:

Visok (Must Have): Kritične stavke bez kojih MVP ne može funkcionisati.

Srednji (Should Have): Važne funkcionalnosti koje nisu kritične za prvu verziju, ali su bitne za korisničko iskustvo.

Nizak (Could Have): Stavke koje bi bilo "lijepo imati" ako ostane vremena i resursa.

3. Procjena složenosti (Estimation)
Koristimo Story Points (Fibonaccijev niz: 1, 2, 3, 5, 8, 13). Procjena ne predstavlja sate, već kombinaciju:

Obima posla: Koliko toga treba uraditi?

Složenosti: Koliko je teško to implementirati?

Neizvjesnosti: Koliko nam je nepoznata tehnologija ili zahtjev?
(Napomena: 1 = vrlo jednostavno, 13 = velika nepoznanica koju treba razbiti na manje dijelove).

4. Status
Prati životni ciklus stavke:

To Do: Stavka je definisana i čeka na red za rad.

In Progress: Tim aktivno radi na stavci u trenutnom sprintu.

Done: Stavka ispunjava sve kriterije iz Definition of Done (implementirana, testirana, dokumentovana).

5. Veza sa sprintom / Release planom
Označava kada planiramo raditi na stavci:

Sprint X: Stavka je planirana za konkretnu sedmicu rada.

Release 1.0 (MVP): Stavka je dio prve javne verzije sistema.

Backlog: Stavka koja još nije dodijeljena nijednom sprintu.

| ID | NAZIV STAVKE | KRATAK OPIS | TIP STAVKE | PRIORITET | PROCJENA SLOŽENOSTI ILI NAPORA | STATUS | VEZA SA SPRINTOM ILI RELEASE PLANOM | NAPOMENA |
|----|--------------|-------------|------------|-----------|--------------------------------|--------|-------------------------------------|----------|
|PB-001| Prijava kvara | Omogućiti korisniku unos podataka o kvaru, lokaciji i opisu problema. | Feature | Visok | 5 | To Do | Sprint 2 (Razrada) / Release 1.0 | Osnova za sve ostale procese.|    
|PB-002| Planiranje izlazaka na teren | Kalendarski prikaz dostupnih servisera i dodjela naloga prema lokaciji. | Feature | Visok | 8 | To Do | Sprint 3 (Dizajn) / Release 1.0 | Najkompleksniji dio poslovne logike koji je ključan za optimizaciju logistike. | 
|PB-003| Evidencija rada servisera | Mogućnost unosa utrošenog vremena, zamjenskih dijelova i opisa obavljenog posla na terenu. | Feature | Srednji | 5 | To Do | Sprint 4 (Skeleton) / Release 1.0 | Serviseri unose podatke putem mobilnog interfejsa. | 
| PB-006 | Prijava korisnika | Omogućiti korisnicima prijavu u sistem pomoću emaila i lozinke | Feature | Visok | 5 | To Do | Sprint 2 | Osnovna funkcionalnost |
| PB-007 | Dashboard sistema | Pregled ključnih informacija (broj kvarova, statusi) | Feature | Srednji | 3 | To Do | Sprint 3 | Pregled stanja za korisnike |
|PB-004| Pregled statusa intervencije | Kreiranje dashboarda za klijente i admine za praćenje faza intervencije. | Feature | Srednji | 3 | To Do | Sprint 2 (Razrada) / Release 1.0 | Ključno za praćenje toka rada, povećava transparentnost prema klijentu. | 
