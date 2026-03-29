# Početni Product Backlog
U ovom dokumentu je prikazan početni product backlog sistema za upravljanje servisnim intervencijama. Backlog obuhvata ključne funkcionalnosti i zahtjeve sistema koje su organizovane prema prioritetu i procijenjenoj složenosti, te su povezane sa planiranim sprintovima i verzijama sistema. 


| ID | NAZIV STAVKE | KRATAK OPIS | TIP STAVKE | PRIORITET | PROCJENA SLOŽENOSTI ILI NAPORA | STATUS | VEZA SA SPRINTOM ILI RELEASE PLANOM | NAPOMENA |
|----|--------------|-------------|------------|-----------|--------------------------------|--------|-------------------------------------|----------|
|PB-001| Prijava kvara | Kao korisnik, želim da prijavim kvar unosom mjesta, lokacije i opisa kako bih pokrenuo proces servisiranja. | Feature | Visok | 5 | To Do | Sprint 2 (Razrada) / Release 1.0 | AC:<br>1. Sistem mora onemogućiti slanje prijave ako su polja za lokaciju i opis kvara prazna.<br>2. Nakon prijave, korisnik mora dobiti potvrdu sa ID brojem naloga.<br>3. Prijavljeni nalog mora biti vidljiv dispečeru u realnom vremenu sa statusom "Prijavljeno". |    
|PB-002| Planiranje izlazaka na teren | Kao dispečer(koordinator), želim da vidim kalendar dostupnosti servisera kako bi planiranje izlazaka na teren bilo efikasnije. | Feature | Visok | 8 | To Do | Sprint 3 (Dizajn) / Release 1.0 | Najkompleksniji dio poslovne logike koji je ključan za optimizaciju logistike. | 
|PB-003| Evidencija rada servisera | Kao serviser, želim unijeti utrošeni materijal i vrijeme te prateće slike kvara, kako bih dokumentovao početak i završetak posla. | Feature | Srednji | 5 | To Do | Sprint 4 (Skeleton) / Release 1.0 |AC:<br>1. Serviser treba imati mogućnost unosa utrošenog vremena.<br> 2.Sistem mora nuditi izbor zamjenskih dijelova iz predefinisanog šifarnika.<br>3. Nakon spremanja, status intervencije će se promijeniti u "Završeno" i biti će poslano dispečeru na odobrenje. | 
|PB-004| Prijava korisnika | Kao registrovani korisnik, želim se prijaviti pomoću emaila i lozinke kako bih pristupio svojim podacima i informacijama. | Feature | Visok | 3 | To Do | Sprint 2 | AC:<br>1. Sistem mora prepoznati pogrešnu lozinku ili email i ispisati upozorenje.<br>2. Korisnik ostaje prijavljen u sistemu dok ne klikne "Odjava".<br>3. Lozinka u bazi podataka mora biti kriptovana. |
|PB-005| Dashboard  | Kao korisnik želim vidjeti broj otvorenih i završenih intervencija te prosječno vrijeme rješavanja kako bih imao bolji uvid u stanje sistema. | Feature | Srednji | 3 | To Do | Sprint 3 | AC:<br>1. Prikazuje broj otvorenih intervencija.<br> 2.Prikazuje broj završenih intervencija.<br>3. Prikazuje prosječno vrijeme rješavanja. |
|PB-006| Registracija korisnika | Kao novi korisnik želim napraviti korisnički račun kako bih mogao koristiti sistem. | Feature | Visok | 5 | To Do | Sprint 2 (Razrada) / Release 1.0 | Osnova za korištenje ostalih funkcija.| 
|PB-007| Dodjela intervencije serviseru | Kao dispečer (koordinator) želim dodijeliti intervenciju serviseru kako bi se kvar mogao riješiti. | Feature | Visok | 5 | To Do | Sprint 3 | AC:<br>1. Dispečer može izabrati servisera iz liste.<br>2. Intervencija mora imati dodijeljenog servisera.<br>3. Nakon dodjele status prelazi u "Dodijeljeno". |
|PB-008| Ažuriranje statusa intervencije | Kao serviser želim ažurirati status intervencije kako bih pratio napredak rada. | Feature | Visok | 3 | To Do | Sprint 3 | AC:<br>1. Serviser može mijenjati status intervencije.<br>2. Statusi su: prijavljeno, u toku, završeno.<br>3. Promjena statusa se sprema u sistem. |
|PB-009| Historija intervencija | Kao korisnik želim vidjeti historiju intervencija kako bih imao pregled prethodnih kvarova. | Feature | Srednji | 5 | To Do | Sprint 4 | Pregled ranijih aktivnosti |
|PB-010| Dodjela više servisera | Kao administrator želim dodijeliti više servisera na jednu intervenciju kako bi se složeniji kvarovi brže riješili. | Feature | Visok | 5 | To Do | Sprint 4 | Podrška za kompleksne zadatke |
|PB-011| Potvrda zatvaranja intervencije | Kao korisnik želim potvrditi završetak intervencije kako bih bio siguran da je problem riješen. | Feature | Srednji | 3 | To Do | Sprint 4 | Validacija završetka rada |
|PB-012| Kontrola pristupa (Role Based Access Control) | Kao administrator, želim definisati korisničke uloge sa pripadajućim privilegijama (pristup, akcije i slično), kako bih osigurao da korisnici imaju pristup samo relevantnim podacima i funkcionalnostima sistema, u skladu sa svojom ulogom.| Technical Task | Visok | 5 | To Do | Sprint 2 |AC:<br>1. Sistem mora podržavati minimalno 3 uloge: Klijent, Serviser i Administrator.<br>2. Kada se novi korisnik registruje, ako mu administrator ne dodijeli ulogu, tada sistem mora spriječiti pristup bilo kojoj funkcionalnosti (Default Deny).<br>3. Svaki pokušaj pristupa neovlaštenoj stranici mora rezultirati porukom "Pristup odbijen".| 
|PB-013| Pregled Audit loga (historije promjena) | Kao administrator, želim imati uvid u historiju izmjena na svakom nalogu, kako bih znao ko je, kada i šta tačno promijenio. | Technical task | Srednji | 5 | To Do | Sprint 4/5 |AC:<br>1. Sistem mora automatski zabilježiti: ID korisnika, Timestamp (vrijeme), tip akcije (Insert/Update/Delete) i ID objekta koji je mijenjan.<br>2. Kada se desi izmjena statusa kvara, tada log mora sačuvati i staru i novu vrijednost statusa.<br>3. Audit podaci moraju biti "Read-only" (niko, pa čak ni administrator, ne smije moći mijenjati ili brisati ove zapise).| 


## Legenda  
Kako bismo osigurali konzistentnost i razumijevanje unutar tima, koristimo sljedeće standarde za definisanje stavki:

**1. Tip stavke (Item Type)**
Određuje prirodu posla koji treba obaviti:

**Feature:** Nova funkcionalnost sistema koja donosi direktnu vrijednost korisniku (npr. Prijava kvara).

**Bug:** Ispravka greške u postojećoj funkcionalnosti koja ne radi kako je planirano.

**Technical Task:** Rad na infrastrukturi, bazi podataka ili kodu koji je neophodan za funkcionisanje sistema (npr. Setup servera).

**Research:** Istraživanje tehnologija, API-ja ili korisničkih potreba prije same implementacije.

**Documentation:** Izrada korisničkih uputstava, tehničkih specifikacija ili dijagrama.

**2. Prioritet (Priority)**
Određuje redoslijed rješavanja stavki prema poslovnoj važnosti:

**Visok (Must Have):** Kritične stavke bez kojih MVP ne može funkcionisati.

**Srednji (Should Have):** Važne funkcionalnosti koje nisu kritične za prvu verziju, ali su bitne za korisničko iskustvo.

**Nizak (Could Have):** Stavke koje bi bilo "lijepo imati" ako ostane vremena i resursa.

**3. Procjena složenosti (Estimation)**
Koristimo Story Points (Fibonaccijev niz: 1, 2, 3, 5, 8, 13). Procjena ne predstavlja sate, već kombinaciju:

**Obima posla:** Koliko toga treba uraditi?

**Složenosti:** Koliko je teško to implementirati?

**Neizvjesnosti:** Koliko nam je nepoznata tehnologija ili zahtjev?
  (**Napomena:** 1 = vrlo jednostavno, 13 = velika nepoznanica koju treba razbiti na manje dijelove).

**4. Status**
Prati životni ciklus stavke:

**To Do:** Stavka je definisana i čeka na red za rad.

**In Progress:** Tim aktivno radi na stavci u trenutnom sprintu.

**Done:** Stavka ispunjava sve kriterije iz Definition of Done (implementirana, testirana, dokumentovana).

**5. Veza sa sprintom / Release planom**
Označava kada planiramo raditi na stavci:

**Sprint X:** Stavka je planirana za konkretnu sedmicu rada.

**Release 1.0 (MVP):** Stavka je dio prve verzije sistema.

**6. Acceptance Criteria (AC)**  
**Kriteriji prihvaćanja:** specifični i mjerljivi uslovi koje svaka stavka u backlogu mora ispuniti da bi se smatrala završenom. AC precizno definiše pravila rada i testne scenarije (npr. "Sistem ne smije dozvoliti prazan unos."). Kriteriji prihvaćanja služe kao "ugovor o kvalitetu" između tima i naručioca posla. 

