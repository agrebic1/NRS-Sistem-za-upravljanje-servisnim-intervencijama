# Početna lista nefunkcionalnih zahtjeva (NFR)

Kroz ovaj dokument obrađeni su nefunkcionalni zahtjevi (NFR) sistema. Svaki zahtjev formulisan je prema SMART kriteriju, sa jasno definisanom metrikom, mjernom jedinicom i granicom koja se može objektivno provjeriti, čime se izbjegavaju neprecizne formulacije koje se ne mogu izmjeriti niti jednoznačno potvrditi. Zahtjevi su klasifikovani prema Sommervilleovoj taksonomiji i prilagođeni realnom obimu MVP verzije sistema. 

# 1. Zahtjevi proizvoda 

## 1.1 Pregled 

| Kategorija | Broj zahtjeva | ID-evi | Prioritet |
|:-----------|:-------------:|:-------|:----------|
| Efikasnost (Performanse) | 3 | NFR-001, NFR-002, NFR-003 | 2× Visok, 1× Srednji |
| Pouzdanost | 3 | NFR-004, NFR-005, NFR-006 | 2× Visok, 1× Srednji |
| Sigurnost | 4 | NFR-007, NFR-008, NFR-009, NFR-010 | 4× Visok |
| Upotrebljivost | 3 | NFR-011, NFR-012, NFR-013 | 3× Visok |
| Portabilnost | 2 | NFR-014, NFR-015 | 1× Visok, 1× Srednji |
| Održivost | 2 | NFR-016, NFR-017 | 2× Srednji |
| **Ukupno** | **17** | | **13× Visok, 4× Srednji** |

### 1.1.1 Struktura zahtjeva
```
├── Efikasnost
│       ├── brzina učitavanja stranica
│       ├── vrijeme odgovora API-ja
│       └── ponašanje sistema pod opterećenjem
│
├── Sigurnost
│       ├── hashiranje lozinki
│       ├── istek sesije
│       ├── kontrola neovlaštenog pristupa
│       └── šifrovanje komunikacije
│
├── Pouzdanost
│       ├── dostupnost sistema u radnom vremenu
│       ├── zaštita potvrđenih podataka
│       └── redovno arhiviranje baze
│
├── Upotrebljivost
│       ├── minimalan broj koraka za servisera na terenu
│       ├── intuitivnost za klijenta
│       └── responzivnost interfejsa
│
├── Portabilnost
│       ├── podrška za glavne preglednike
│       └── rad bez ikakve dodatne instalacije
│
└── Održivost
        ├── modularna arhitektura otvorena za proširenje
        └── ažurna dokumentacija API-ja
```

## 1.2 Efikasnost (Performanse)

| ID | Kategorija | Opis zahtjeva | Način provjere | Prioritet | Napomena |
|:---|:-----------|:--------------|:---------------|:---------:|:---------|
| NFR-001 | Efikasnost (Performanse) | Stranica s pregledom aktivnih intervencija mora se u potpunosti učitati za najviše **3 sekunde** pri standardnoj internetskoj vezi brzine ≥ 10 Mbps i opterećenju od do 50 istovremenih korisnika. | Mjerenje vremena učitavanja putem Chrome DevTools (Network tab) sa 10 uzastopnih mjerenja u inkognito prozoru; prosječna vrijednost mora biti ≤ 3s. | Visok | Dispečer koristi dashboard kontinuirano tokom radnog dana; kašnjenje direktno usporava raspoređivanje intervencija. |
| NFR-002 | Efikasnost (Performanse) | Svaki API poziv za kreiranje, preuzimanje ili ažuriranje intervencije mora biti obrađen za najviše **1 sekundu** od slanja zahtjeva do prijema odgovora servera, pri normalnom opterećenju sistema do 20 istovremenih zahtjeva. | Mjerenje vremena odgovora API-ja putem alata Postman, 20 uzastopnih poziva za svaki tip operacije (GET, POST, PATCH); prosječno izmjereno vrijeme ne smije prelaziti 1s. | Visok | Posebno kritično za akciju ažuriranja statusa intervencije od strane servisera na terenu. |
| NFR-003 | Efikasnost (Performanse) | Sistem mora podržati istovremeni rad najmanje **50 korisnika** a da prosječno vrijeme odgovora ne poraste za više od **20%** u odnosu na bazno izmjereno vrijeme odgovora pri jednom korisniku. | Load testiranje putem alata k6 ili Apache JMeter. Simulacija 50 paralelnih sesija tokom 5 minuta; mjerenje prosječnog vremena odgovora i poređenje sa baznim rezultatom. | Srednji | Procjena kapaciteta zasnovana je na realnoj veličini organizacije za koju je sistem namijenjen u MVP fazi. |

## 1.3 Pouzdanost

| ID | Kategorija | Opis zahtjeva | Način provjere | Prioritet | Napomena |
|:---|:-----------|:--------------|:---------------|:---------:|:---------|
| NFR-004 | Pouzdanost | Sistem mora biti dostupan korisnicima najmanje **99%** radnog vremena (07:00–21:00 radnim danima), što odgovara maksimalno **13 minuta nedostupnosti sedmično** u tom periodu. | Praćenje dostupnosti putem alata UptimeRobot (provjera svakih 5 minuta); evidentiranje svakog prekida u radu s oznakom trajanja i uzroka. | Visok | Nedostupnost sistema direktno blokira dispečera u dodjeli intervencija. |
| NFR-005 | Pouzdanost | Podaci o intervenciji koji su uspješno potvrđeni od strane servera (HTTP 200 ili 201) ne smiju biti izgubljeni ni u jednom slučaju normalnog serverskog pada. Gubitak potvrđenog zapisa nije prihvatljiv. | Simulacija serverskog gašenja odmah nakon uspješno primljenog API odgovora; provjera baze podataka da li je odgovarajući zapis pohranjen i ispravan. | Visok | Gubitak podataka o intervenciji direktno narušava povjerenje korisnika i onemogućava buduću analizu rada. |
| NFR-006 | Pouzdanost | Baza podataka mora biti automatski arhivirana (backup) najmanje **svakih 6 sati**, a svaka arhiva mora biti pohranjena na lokaciji fizički ili logički odvojenoj od primarne baze podataka. | Provjera konfiguracije automatskog backupa i potvrda da arhiva postoji na odvojenoj lokaciji; jednom po sprintu izvršiti testnu restauraciju arhive radi potvrde ispravnosti podataka. | Srednji | Backup svakih 6 sati znači maksimalni gubitak podataka od 6 sati u najgorem scenariju. |

## 1.4 Sigurnost

| ID | Kategorija | Opis zahtjeva | Način provjere | Prioritet | Napomena |
|:---|:-----------|:--------------|:---------------|:---------:|:---------|
| NFR-007 | Sigurnost | Lozinke korisnika moraju biti pohranjene isključivo u hashiranom obliku korištenjem **bcrypt** algoritma sa minimalnim **cost faktorom 10**. Pohrana u čitljivom ili reverzibilno enkriptovanom obliku nije prihvatljiva ni u kakvim okolnostima. | Nakon registracije testnog korisnika, direktan pregled kolone u bazi podataka, vrijednost mora počinjati s `$2b$10$` ili ekvivalentnim bcrypt prefiksom; plaintext lozinka ne smije biti vidljiva nigdje u sistemu. | Visok | |
| NFR-008 | Sigurnost | Autentifikacijski token (JWT ili session token) mora automatski isteći nakon **8 sati neaktivnosti** korisnika. Vremenski aktivna sesija bez ijedne korisničke interakcije ne smije ostati važeća duže od navedenog perioda. | Ručno testiranje: prijava u sistem, čekanje 8 sati bez korisničke akcije, pokušaj pristupa zaštićenoj ruti, server mora odgovoriti sa HTTP 401 i prikazati ekran za ponovnu prijavu. | Visok | Posebno važno za servisere koji sistem koriste na terenu, ponekad na dijeljenoj opremi. |
| NFR-009 | Sigurnost | Svaki pokušaj pristupa funkcionalnosti ili podatku koji nije dozvoljen korisnikovoj ulozi mora biti odbijen sa **HTTP statusom 403**, a svaki takav pokušaj mora biti evidentiran u sistemskom logu s vremenskom oznakom i identitetom korisnika. | Testiranje neovlaštenog pristupa sa računima različitih uloga; provjera da server vraća 403 i da log sadrži odgovarajući zapis. | Visok | |
| NFR-010 | Sigurnost | Sva komunikacija između klijentske aplikacije i servera mora biti šifrovana putem **HTTPS protokola (TLS 1.2 ili noviji)**. HTTP zahtjevi moraju biti automatski preusmjereni na HTTPS statusnim kodom 301. | Provjera u pregledaču; slanje ručnog HTTP zahtjeva i provjera da server odgovara sa 301 redirekcijom ka HTTPS adresi. | Visok | |

## 1.5 Upotrebljivost

| ID | Kategorija | Opis zahtjeva | Način provjere | Prioritet | Napomena |
|:---|:-----------|:--------------|:---------------|:---------:|:---------|
| NFR-011 | Upotrebljivost | Serviser mora biti u mogućnosti ažurirati status intervencije u **najviše 3 korisničke akcije** od trenutka otvaranja detalja intervencije, bez ikakvog scrollanja na ekranu mobilnog uređaja standardne veličine (360×800px). | Korisničko testiranje s 3 ispitanika koji nisu učestvovali u dizajnu sistema. Broji se broj koraka od otvaranja ekrana do uspješnog ažuriranja statusa; svi ispitanici moraju završiti zadatak u ≤ 3 koraka. | Visok | Serviseri sistem koriste na terenu u ograničenim uvjetima. Minimalan broj koraka za najčešću akciju je direktna operativna vrijednost. |
| NFR-012 | Upotrebljivost | Novi korisnik (klijent) koji prvi put koristi sistem mora biti u mogućnosti uspješno prijaviti kvar unutar **5 minuta** od prvog pokretanja aplikacije, bez prethodnog uputstva ili obuke. | Korisničko testiranje s 3 ispitanika koji nikad nisu vidjeli sistem, mjerenje vremena od pokretanja aplikacije do prikaza potvrdne poruke o uspješnoj prijavi; svi ispitanici moraju završiti zadatak unutar 5 minuta. | Visok | Ako prijava kvara nije intuitivna, klijenti će nastaviti koristiti telefon kao alternativu, čime se gubi osnovna vrijednost sistema.|
| NFR-013 | Upotrebljivost | Korisnički interfejs mora biti funkcionalan, čitljiv i vizualno konzistentan na svim uređajima sa širinom ekrana između **360px i 1920px**, bez pojave horizontalnog scrollanja, presijecanja elemenata ili gubitka kritičnih akcijskih gumba. | Vizualna provjera u Chrome DevTools na četiri standardne rezolucije: 360px (mobilni), 768px (tablet), 1280px i 1920px (desktop), za svaku rezoluciju proći kroz ključne ekrane: login, dashboard, forma za kvar, detalji intervencije. | Visok | |

## 1.6 Portabilnost

| ID | Kategorija | Opis zahtjeva | Način provjere | Prioritet | Napomena |
|:---|:-----------|:--------------|:---------------|:---------:|:---------|
| NFR-014 | Portabilnost | Sistem mora biti u potpunosti funkcionalan u **posljednje dvije stabilne verzije** sljedećih preglednika: Google Chrome, Mozilla Firefox, Microsoft Edge i Safari (iOS). Funkcionalnost i vizualni prikaz ne smiju se razlikovati između navedenih preglednika. | Ručno testiranje ključnih korisničkih tokova (prijava, kreiranje intervencije, ažuriranje statusa, odjava) u svakom navedenom pregledniku; evidentirati sve vizualne ili funkcionalne razlike. | Srednji | |
| NFR-015 | Portabilnost | Sistem ne smije zahtijevati instalaciju nikakvih dodatnih plugina, proširenja, runtime okruženja niti softverskih paketa na korisničkom uređaju. Jedini preduvjet za pristup sistemu je web pregledač. | Testiranje na čistom profilu preglednika (incognito, bez ekstenzija) i na uređaju bez posebnih konfiguracija, sistem mora biti u potpunosti operativan bez ijedne prethodne instalacije. | Visok | Kritično za servisere koji sistem koriste na terenu, ponekad na uređajima bez administratorskih prava. |

## 1.7 Održivost

| ID | Kategorija | Opis zahtjeva | Način provjere | Prioritet | Napomena |
|:---|:-----------|:--------------|:---------------|:---------:|:---------|
| NFR-016 | Održivost | Sistem mora biti strukturisan prema principu **modularnosti**, izmjena jednog modula ne smije zahtijevati izmjene u nepovezanim modulima. Dodavanje nove korisničke uloge ne smije zahtijevati promjene u poslovnoj logici postojećih uloga. | Code review od strane tehničkih članova tima, svaki PR koji uvodi promjene u jedan modul mora biti praćen potvrdom da nijedan neovisni modul nije morao biti istovremeno modificiran. | Srednji | Ključno za proširenje sistema u kasnijim sprintovima |
| NFR-017 | Održivost | Svaka implementirana API ruta mora biti dokumentovana sa: nazivom rute, HTTP metodom, ulaznim parametrima (tip i format), primjerom odgovora i mogućim statusnim kodovima. Dokumentacija mora biti usklađena sa stanjem implementacije pri predaji svakog sprinta. | Pregled API dokumentacije u repozitoriju (Postman Collection, Swagger/OpenAPI ili ručna .md dokumentacija), svaka implementirana ruta mora imati odgovarajući zapis; nekompatibilnost između koda i dokumentacije smatra se neispunjenošću zahtjeva. | Srednji | Direktno olakšava paralelni rad frontend i backend dijelova tima i ubrzava razumijevanje sistema od strane svih članova. |

---






# 2. Organizacioni zahtjevi 
---
# 3. Vanjski zahtjevi 
