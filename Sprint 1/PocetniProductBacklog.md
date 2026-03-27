# Početni Product Backlog
U ovom dokumentu je prikazan početni product backlog sistema za upravljanje servisnim intervencijama. Backlog obuhvata ključne funkcionalnosti i zahtjeve sistema koje su organizovane prema prioritetu i procijenjenoj složenosti, te su povezane sa planiranim sprintovima i verzijama sistema. 

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
|PB-001| Prijava kvara | Kao korisnik, želim da prijavim kvar unosom mjesta, lokacije i opisa kako bih pokrenuo proces servisiranja. | Feature | Visok | 5 | To Do | Sprint 2 (Razrada) / Release 1.0 | Osnova za sve ostale procese.|    
|PB-002| Planiranje izlazaka na teren | Kao dispečer(koordinator), želim da vidim kalendar dostupnosti servisera kako bi planiranje izlazaka na teren bilo efikasnije. | Feature | Visok | 8 | To Do | Sprint 3 (Dizajn) / Release 1.0 | Najkompleksniji dio poslovne logike koji je ključan za optimizaciju logistike. | 
|PB-003| Evidencija rada servisera | Kao serviser, želim unijeti utrošeni materijal i vrijeme te prateće slike kvara, kako bih dokumentovao početak i završetak posla. | Feature | Srednji | 5 | To Do | Sprint 4 (Skeleton) / Release 1.0 | Serviseri unose podatke putem mobilnog interfejsa. | 
| PB-004 | Prijava korisnika | Kao registrovani korisnik, želim se prijaviti pomoću emaila i lozikne kako bih pristupio svojim podacima i informacijama. | Feature | Visok | 3 | To Do | Sprint 2 | Osnovna funkcionalnost |
| PB-005 | Dashboard  | Kao korisnik želim vidjeti pregled statusa kvarova kako bih imao uvid u njihovo stanje. | Feature | Srednji | 3 | To Do | Sprint 3 | Pregled stanja za korisnike |
|PB-006| Registracija korisnika | Kao novi korisnik želim napraviti korisnički račun kako bih mogao koristiti sistem. | Feature | Visok | 5 | To Do | Sprint 2 (Razrada) / Release 1.0 | Osnova za korištenje ostalih funkcija.| 
| PB-007 | Dodjela intervencije serviseru | Kao administrator želim dodijeliti intervenciju serviseru kako bi se kvar mogao riješiti. | Feature | Visok | 5 | To Do | Sprint 3 | Ključni korak u procesu rješavanja kvara |
| PB-008 | Ažuriranje statusa intervencije | Kao serviser želim ažurirati status intervencije kako bih pratio napredak rada. | Feature | Visok | 3 | To Do | Sprint 3 | Praćenje stanja problema |
| PB-009 | Historija intervencija | Kao korisnik želim vidjeti historiju intervencija kako bih imao pregled prethodnih kvarova. | Feature | Srednji | 5 | To Do | Sprint 4 | Pregled ranijih aktivnosti |
| PB-010 | Dodjela više servisera | Kao administrator želim dodijeliti više servisera na jednu intervenciju kako bi se složeniji kvarovi brže riješili. | Feature | Visok | 5 | To Do | Sprint 4 | Podrška za kompleksne zadatke |
| PB-011 | Potvrda zatvaranja intervencije | Kao korisnik želim potvrditi završetak intervencije kako bih bio siguran da je problem riješen. | Feature | Srednji | 3 | To Do | Sprint 4 | Validacija završetka rada |


Stavke sa visokim prioritetom predstavljaju osnovne funkcije potrebne za rad za MVP verziju sistema.
