Template:

Domain Model
- Glavni entiteti
- Ključni atributi
- Veze između entiteta
- Poslovna pravila važna za model


Use Case Model
- Akter
- Naziv use casea
- Kratak opis
- Preduslovi
- Glavni tok
- Alternativni tokovi
- Ishod

# Domain Model
## Glavni entiteti

Domain model sistema za servisne intervencije zasniva se na skupini ključnih entiteta koji zajedno podržavaju cjelokupan poslovni proces od trenutka prijave kvara, preko njegove obrade, pa sve do realizacije i zatvaranja intervencije.

Centralnu ulogu u modelu imaju korisnici sistema koji su podijeljeni na dvije osnovne kategorije: **korisnike usluge** i **uposlenike**. Entitet **Korisnik usluge** predstavlja krajnjeg korisnika koji inicira proces prijavom kvara, dok entitet **Uposlenici** obuhvata interne aktere sistema, poput dispečera i servisera, koji upravljaju i izvršavaju intervencije.

Proces započinje kreiranjem entiteta **Zahtjev**, koji sadrži osnovne informacije o prijavljenom kvaru, uključujući opis problema, vrijeme prijave i povezane atribute. Na osnovu jednog zahtjeva može se formirati entitet **Intervencija**, koji predstavlja konkretan operativni zadatak dodijeljen serviserima i koji se prati kroz različite faze realizacije.

Kako bi se omogućila organizacija i odgovornost u radu, uveden je entitet **Dodjela**, koji modelira odnos između intervencije i uključenih uposlenika, prije svega dispečera koji vrši raspodjelu i servisera koji izvršava zadatak. Tokom same realizacije intervencije, aktivnosti na terenu se evidentiraju kroz entitet **Evidencija rada**, koji omogućava detaljan uvid u izvršene radnje, trajanje intervencije i korištene resurse.

### Pomoćni entiteti

Pored ključnih entiteta, model uključuje i skup pomoćnih entiteta koji omogućavaju bolju organizaciju podataka, standardizaciju i praćenje toka poslovnog procesa.

Entitet **Historija aktivnosti** ima važnu ulogu u praćenju svih promjena nad intervencijama i povezanim objektima, čime se osigurava transparentnost i mogućnost naknadne analize (audit trag). Komunikacija između dispečera i servisera dodatno je podržana kroz entitet **Napomena**, koji omogućava razmjenu informacija vezanih za konkretnu intervenciju.

Prostorni aspekt kvara modeliran je kroz entitet **Lokacija**, koji definiše gdje se problem desio i omogućava efikasnije planiranje intervencija na terenu. Klasifikacija kvarova ostvarena je putem entiteta **Kategorija kvara**, čime se omogućava grupisanje i lakša obrada sličnih tipova problema.

Za prioritizaciju rada koristi se entitet **Prioritet**, koji definiše nivo hitnosti rješavanja zahtjeva ili intervencije. Paralelno s tim, entitet **Status** omogućava praćenje trenutnog stanja različitih elemenata sistema, poput zahtjeva, intervencija ili dostupnosti servisera.

Entitet **Uloga** definiše funkcionalnu podjelu unutar sistema, jasno razlikujući odgovornosti između dispečera i servisera, čime se osigurava pravilna kontrola pristupa i izvršavanje poslovnih operacija.

---

## Ključni atributi

Pored definicije entiteta, domain model uključuje i skup ključnih atributa koji detaljnije opisuju stanje sistema i omogućavaju praćenje toka poslovnih procesa. Ovi atributi predstavljaju najvažnije informacije potrebne za pravilno funkcionisanje sistema i donošenje odluka.

Entitet **Zahtjev** sadrži osnovne vremenske i statusne informacije vezane za prijavu kvara. Atributi poput datuma i vremena evidentiraju trenutak kreiranja zahtjeva, dok atribut *je_otkazan* omogućava označavanje da li je zahtjev poništen. U slučaju otkazivanja, atribut *razlog_otkazivanja* pruža dodatni kontekst i objašnjenje takve odluke.

Kod entiteta **Intervencija**, ključni atributi odnose se na planiranje i realizaciju zadatka. Atribut *planirani_datum* definiše kada je intervencija predviđena za izvršenje, dok *datum_zavrsetka* označava njen završetak. Dodatno, atributi *id_prioriteta* i *id_statusa* omogućavaju povezivanje sa odgovarajućim klasifikacijama prioriteta i trenutnog statusa, čime se obezbjeđuje praćenje toka rada.

Entitet **Dodjela** sadrži atribute koji opisuju proces raspodjele zadataka između uposlenika. *datum_dodjele* bilježi trenutak kada je intervencija dodijeljena serviseru, dok *datum_odgovora* predstavlja vrijeme reakcije servisera na dodijeljeni zadatak. U situacijama kada zadatak nije prihvaćen, atribut *razlog_odbijanja* omogućava evidentiranje razloga odbijanja.

Za praćenje rada na terenu koristi se entitet **Evidencija rada**, čiji atributi omogućavaju detaljan uvid u tok izvršenja intervencije. Atributi *vrijeme_početka* i *vrijeme_završetka* definišu trajanje aktivnosti, dok *utrošeni_materijal* i *ishod_rada* pružaju informacije o korištenim resursima i rezultatu intervencije.

Entitet **Uposlenici** sadrži osnovne identifikacione i sigurnosne podatke o internim korisnicima sistema. Atributi poput imena i prezimena služe za identifikaciju, dok *jmbg* predstavlja jedinstveni identifikator. Kontakt informacije su obuhvaćene atributom *email*, dok atribut *lozinka_hash* osigurava sigurnost autentifikacije kroz pohranu šifrovane lozinke.

---

## Veze između entiteta

Relacije između entiteta u modelu definišu način na koji podaci međusobno komuniciraju i zajedno formiraju cjelovit poslovni proces. Veze su modelirane tako da vjerno odražavaju tok aktivnosti u sistemu, od inicijalne prijave kvara do njegove realizacije i dokumentovanja.

Entitet **Korisnik usluge** nalazi se u relaciji tipa *jedan-prema-više* sa entitetom **Zahtjev**, što znači da jedan korisnik može podnijeti više različitih zahtjeva tokom vremena, dok je svaki pojedinačni zahtjev vezan isključivo za jednog korisnika.

Između entiteta **Zahtjev** i **Intervencija** uspostavljena je relacija *jedan-prema-jedan*. Ova veza odražava poslovno pravilo prema kojem svaki odobreni zahtjev rezultira tačno jednom intervencijom, čime se osigurava direktna povezanost između prijavljenog problema i njegovog rješavanja.

Entitet **Intervencija** je u relaciji *jedan-prema-više* sa entitetom **Dodjela**. Ovakav model omogućava evidentiranje više pokušaja dodjele iste intervencije različitim serviserima, što je posebno važno u situacijama kada servisni zadatak bude odbijen ili preusmjeren.

Također, entitet **Intervencija** ima relaciju *jedan-prema-više* sa entitetom **Napomena**, čime je omogućeno da se za jednu intervenciju evidentira više operativnih bilješki. Ove napomene služe kao sredstvo komunikacije i dodatnog pojašnjenja između učesnika u procesu, prvenstveno dispečera i servisera.

Kada je riječ o realizaciji aktivnosti na terenu, entitet **Uposlenici** (u ulozi servisera) povezan je sa entitetom **Evidencija rada** relacijom *jedan-prema-više*. Na taj način jedan serviser može kreirati više zapisa o radu, pri čemu svaki zapis dokumentuje konkretne aktivnosti izvršene u okviru određene intervencije.

---

## Poslovna pravila važna za model

Poslovna pravila predstavljaju skup ograničenja i logičkih uslova koji osiguravaju ispravno funkcionisanje sistema i dosljednu primjenu definisanih procesa. Ova pravila su izvedena iz strukture domen modela i definisanih korisničkih zahtjeva, te imaju ključnu ulogu u očuvanju integriteta podataka i kontrole toka aktivnosti.

Jedno od osnovnih pravila odnosi se na upravljanje pristupom funkcionalnostima sistema. Prava korištenja pojedinih operacija direktno zavise od uloge uposlenika, pri čemu atribut *id_uloge* u entitetu **Uposlenici** određuje da li korisnik ima privilegije dispečera ili servisera. Na taj način se osigurava da samo dispečer može vršiti dodjelu intervencija, dok serviser ima pristup funkcijama vezanim za izvršenje zadataka.

Sistem također implementira mehanizam praćenja promjena kroz audit trag. Svaka izmjena nad ključnim podacima mora biti evidentirana u entitetu **Historija aktivnosti**, pri čemu se bilježe vrijednosti atributa *stara_vrijednost*, *nova_vrijednost* i vrijeme promjene kroz atribut *datum_promjene*. Ovakav pristup omogućava potpunu transparentnost i olakšava analizu prethodnih stanja sistema.

Važno poslovno pravilo odnosi se i na validaciju procesa dodjele intervencija. Status entiteta **Intervencija** ne može biti promijenjen u stanje „U toku“ sve dok serviser ne potvrdi prijem zadatka, što se evidentira kroz atribut *datum_odgovora* u entitetu **Dodjela**. Time se sprječava neusklađenost između stvarnog i evidentiranog stanja rada na terenu.

Geografski aspekt poslovanja dodatno je formalizovan pravilom prema kojem svaki **Zahtjev** i pripadajuća **Intervencija** moraju biti povezani sa entitetom **Lokacija**. Ova povezanost omogućava efikasnije planiranje i raspodjelu resursa na terenu, kao i optimizaciju vremena reakcije.

Proces intervencije smatra se završenim tek kada su ispunjeni svi uslovi za njegovo zatvaranje. To podrazumijeva da je u entitetu **Evidencija rada** unesen atribut *ishod_rada*, te da je status intervencije postavljen na odgovarajuće završno stanje. Ovim pravilom se osigurava da nijedna intervencija ne može biti formalno zatvorena bez potpune evidencije izvršenih aktivnosti.
Intervencija se smatra završenom tek nakon unosa atributa *ishod_rada* u entitetu **Evidencija rada** i postavljanja finalnog statusa.  


    







        
## Use Case Model – US-01

### **Aktor:**
Korisnik usluge

### **Naziv use case-a:**
Samostalna registracija korisnika

### **Kratak opis:**
Ovaj use case opisuje proces u kojem korisnik usluge kreira novi korisnički nalog kako bi mogao pristupiti sistemu i koristiti njegove funkcionalnosti.

### **Preduslovi:**
- Korisnik ima pristup registracionoj formi  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Korisnik otvara formu za registraciju  
2. Korisnik unosi potrebne podatke (ime, email, lozinka itd.)  
3. Korisnik potvrđuje registraciju  
4. Sistem validira unesene podatke  
5. Sistem kreira novi korisnički nalog  
6. Sistem automatski dodjeljuje ulogu korisnika  
7. Sistem prikazuje poruku o uspješnoj registraciji  

### **Alternativni tokovi:**

**A1: Neispravni ili nepotpuni podaci**  
3a. Korisnik nije unio sve obavezne podatke ili su neispravni  
4a. Sistem detektuje grešku  
5a. Sistem ne kreira nalog  
6a. Sistem prikazuje poruku o grešci  

### **Ishod:**
- Korisnički nalog je uspješno kreiran  
- Korisnik može pristupiti sistemu  





        

## Use Case Model – US-02

### **Aktor:**
Korisnik usluge

### **Naziv use case-a:**
Prijava korisnika u sistem

### **Kratak opis:**
Ovaj use case opisuje proces u kojem registrovani korisnik unosi svoje kredencijale kako bi se prijavio u sistem i pristupio dostupnim funkcionalnostima.

### **Preduslovi:**
- Korisnik ima kreiran korisnički nalog  
- Korisnik ima pristup login formi  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Korisnik otvara formu za prijavu  
2. Korisnik unosi email i lozinku  
3. Korisnik potvrđuje prijavu  
4. Sistem validira unesene podatke  
5. Sistem provjerava kredencijale korisnika  
6. Sistem kreira korisničku sesiju  
7. Sistem preusmjerava korisnika na početnu stranicu (dashboard)  

### **Alternativni tokovi:**

**A1: Neispravni kredencijali**  
4a. Sistem utvrdi da email ili lozinka nisu tačni  
5a. Sistem ne dozvoljava prijavu  
6a. Sistem prikazuje poruku o grešci  

**A2: Prazna polja**  
2a. Korisnik nije unio email ili lozinku  
3a. Sistem detektuje nedostatak podataka  
4a. Sistem prikazuje poruku da su polja obavezna  

### **Ishod:**
- Korisnik je uspješno prijavljen u sistem  
- Kreirana je aktivna sesija  
- Korisnik ima pristup funkcionalnostima prema svojoj ulozi  


## Use Case Model – US-03

### **Aktor:**
Korisnik sistema

### **Naziv use case-a:**
Odjava korisnika iz sistema

### **Kratak opis:**
Ovaj use case opisuje proces u kojem prijavljeni korisnik završava svoju sesiju u sistemu kako bi spriječio neovlašten pristup svom korisničkom nalogu.

### **Preduslovi:**
- Korisnik je prijavljen u sistem  
- Postoji aktivna korisnička sesija  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Korisnik klikne na opciju za odjavu (logout)  
2. Sistem prima zahtjev za odjavu  
3. Sistem invalidira korisničku sesiju  
4. Sistem briše sesijske podatke  
5. Sistem preusmjerava korisnika na login stranicu  
6. Sistem prikazuje poruku o uspješnoj odjavi  

### **Alternativni tokovi:**

**A1: Istek sesije (automatska odjava)**  
1a. Korisnik je neaktivan određeni vremenski period  
2a. Sistem automatski prekida sesiju  
3a. Sistem preusmjerava korisnika na login stranicu  
4a. Sistem prikazuje poruku da je sesija istekla  

### **Ishod:**
- Korisnik je uspješno odjavljen iz sistema  
- Sesija je zatvorena  
- Onemogućen je dalji pristup bez ponovne prijave  
    



## Use Case Model – US-04

### **Aktor:**
Administrator

### **Naziv use case-a:**
Kontrola pristupa prema korisničkoj ulozi

### **Kratak opis:**
Ovaj use case opisuje proces u kojem administrator upravlja pristupom funkcionalnostima sistema dodjeljivanjem odgovarajućih uloga korisnicima, čime se osigurava da svaki korisnik ima pristup samo relevantnim podacima i akcijama.

### **Preduslovi:**
- Administrator je prijavljen u sistem  
- Postoje definisane korisničke uloge  
- Korisnici su registrovani u sistemu  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Administrator pristupa modulu za upravljanje korisnicima  
2. Administrator bira korisnika iz liste  
3. Administrator pregleda trenutnu korisničku ulogu  
4. Administrator mijenja ili dodjeljuje novu ulogu korisniku  
5. Sistem validira odabranu ulogu  
6. Sistem ažurira prava pristupa korisnika  
7. Sistem sprema promjene  
8. Sistem prikazuje potvrdu o uspješnoj izmjeni  

### **Alternativni tokovi:**

**A1: Nevažeća uloga**  
4a. Administrator odabere nepostojeću ili nevažeću ulogu  
5a. Sistem detektuje grešku  
6a. Sistem ne dozvoljava izmjenu  
7a. Sistem prikazuje poruku o grešci  

**A2: Nedozvoljen pristup**  
1a. Korisnik koji nije administrator pokušava pristupiti modulu  
2a. Sistem odbija pristup  
3a. Sistem prikazuje poruku o nedozvoljenom pristupu  

### **Ishod:**
- Korisniku je dodijeljena odgovarajuća uloga  
- Pristup funkcionalnostima sistema je ograničen prema ulozi  
- Sistem osigurava sigurnost i kontrolu pristupa  




## Use Case Model – US-05

### **Aktor:**
Korisnik usluge

### **Naziv use case-a:**
Prijava zahtjeva za servisnu intervenciju

### **Kratak opis:**
Ovaj use case opisuje proces u kojem korisnik usluge prijavljuje kvar ili zahtjev za servisnu intervenciju. Sistem evidentira unesene podatke, validira ih i kreira novi zahtjev koji postaje dostupan za dalju obradu.

### **Preduslovi:**
- Korisnik je registrovan u sistemu  
- Korisnik je prijavljen u sistem  
- Korisnik ima pristup formi za prijavu zahtjeva  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Korisnik otvara formu za prijavu zahtjeva  
2. Korisnik unosi podatke o kvaru (opis, lokacija, vrijeme itd.)  
3. Korisnik potvrđuje slanje zahtjeva  
4. Sistem validira unesene podatke  
5. Sistem kreira novi zahtjev u bazi podataka  
6. Sistem automatski dodjeljuje početni status zahtjevu  
7. Sistem povezuje zahtjev sa korisnikom  
8. Sistem prikazuje potvrdu o uspješnoj prijavi  

### **Alternativni tokovi:**

**A1: Nepotpuni podaci**  
2a. Korisnik ne unese sve obavezne podatke  
4a. Sistem detektuje nedostatak podataka  
5a. Sistem ne kreira zahtjev  
6a. Sistem prikazuje poruku o grešci i traži dopunu  

**A2: Nevažeći podaci**  
2a. Korisnik unese pogrešan format (npr. nevalidna lokacija)  
4a. Sistem detektuje grešku  
5a. Sistem odbija unos  
6a. Sistem prikazuje poruku o grešci  

**A3: Greška sistema**  
5a. Dođe do greške pri kreiranju zahtjeva  
6a. Sistem ne sprema zahtjev  
7a. Sistem obavještava korisnika da pokuša ponovo  

### **Ishod:**
- Novi zahtjev za servisnu intervenciju je kreiran  
- Zahtjev je povezan sa korisnikom  
- Zahtjev ima početni status (npr. "Kreiran")  
- Zahtjev je spreman za dalju obradu od strane dispečera  




## Use Case Model – US-06

### **Aktor:**
Korisnik usluge

### **Naziv use case-a:**
Pregled vlastitog zahtjeva

### **Kratak opis:**
Ovaj use case opisuje proces u kojem korisnik pregledava svoje prethodno prijavljene zahtjeve, uključujući osnovne informacije i trenutni status obrade.

### **Preduslovi:**
- Korisnik je registrovan u sistemu  
- Korisnik je prijavljen u sistem  
- Korisnik ima kreiran barem jedan zahtjev  
- Sistem je dostupan  

### **Glavni tok:**
1. Korisnik otvara listu svojih zahtjeva  
2. Sistem prikazuje listu svih korisnikovih zahtjeva  
3. Korisnik bira jedan zahtjev za pregled  
4. Sistem prikazuje detalje zahtjeva (opis, status, datum, itd.)  
5. Korisnik pregledava informacije  

### **Alternativni tokovi:**

**A1: Nema zahtjeva**  
1a. Korisnik nema nijedan zahtjev  
2a. Sistem prikazuje poruku da nema dostupnih zahtjeva  

**A2: Greška pri učitavanju**  
2a. Sistem ne može učitati zahtjeve  
3a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
3a. Korisnik pokuša pristupiti zahtjevu koji nije njegov  
4a. Sistem blokira pristup  
5a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Korisnik vidi listu svojih zahtjeva  
- Korisnik može pregledati detalje pojedinačnog zahtjeva  
- Prikazan je tačan status i informacije o zahtjevu  




## Use Case Model – US-07

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Pregled otvorenih intervencija

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer pregledava sve otvorene i aktivne intervencije kako bi imao jasan uvid u zahtjeve koji čekaju obradu ili su trenutno u toku.

### **Preduslovi:**
- Dispečer je registrovan u sistemu  
- Dispečer je prijavljen u sistem  
- U sistemu postoje otvorene ili aktivne intervencije  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara pregled intervencija (dashboard ili lista)  
2. Sistem prikazuje listu svih otvorenih i aktivnih intervencija  
3. Sistem prikazuje ključne informacije (status, prioritet, lokacija, dodijeljeni serviser itd.)  
4. Dispečer pregledava listu i identifikuje relevantne intervencije  
5. Dispečer može odabrati intervenciju za detaljniji pregled  

### **Alternativni tokovi:**

**A1: Nema otvorenih intervencija**  
2a. Sistem ne pronalazi nijednu otvorenu intervenciju  
3a. Sistem prikazuje poruku da nema aktivnih zahtjeva  

**A2: Greška pri učitavanju**  
2a. Sistem ne može učitati intervencije  
3a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Korisnik bez uloge dispečera pokuša pristupiti  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Dispečer ima pregled svih aktivnih intervencija  
- Intervencije su jasno prikazane sa ključnim informacijama  
- Omogućen je dalji rad (dodjela, pregled detalja, promjene)  




## Use Case Model – US-08

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Pregled detalja pojedinačne intervencije

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer pregledava detaljne informacije o jednoj intervenciji kako bi imao potpuni uvid u njen status, tok i zaduženja.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji barem jedna intervencija u sistemu  
- Dispečer ima pristup listi intervencija  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara listu intervencija  
2. Dispečer odabire jednu intervenciju  
3. Sistem prikazuje detalje intervencije  
4. Sistem prikazuje informacije (opis, status, prioritet, lokacija, dodijeljeni serviser, historija aktivnosti itd.)  
5. Dispečer pregledava podatke  

### **Alternativni tokovi:**

**A1: Intervencija ne postoji**  
2a. Odabrana intervencija više ne postoji  
3a. Sistem prikazuje poruku o grešci  

**A2: Greška pri učitavanju detalja**  
3a. Sistem ne može učitati detalje  
4a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Korisnik bez prava pristupa pokuša otvoriti intervenciju  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani  

### **Ishod:**
- Dispečer ima detaljan uvid u intervenciju  
- Prikazani su svi relevantni podaci  
- Omogućeno donošenje odluka (dodjela, promjena prioriteta itd.)  




## Use Case Model – US-09

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Dodjela intervencije odgovornom serviseru

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer dodjeljuje intervenciju odgovornom serviseru kako bi bilo jasno ko preuzima izvršenje zadatka.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji kreirana intervencija  
- Postoji barem jedan serviser u sistemu  
- Intervencija još nije dodijeljena ili se može promijeniti izvršilac  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara detalje intervencije  
2. Dispečer bira opciju za dodjelu servisera  
3. Sistem prikazuje listu dostupnih servisera  
4. Dispečer odabire servisera  
5. Dispečer potvrđuje dodjelu  
6. Sistem dodjeljuje intervenciju izabranom serviseru  
7. Sistem ažurira status intervencije (npr. "Dodijeljeno")  
8. Sistem bilježi promjenu u historiji aktivnosti  
9. Sistem obavještava servisera o dodjeli  

### **Alternativni tokovi:**

**A1: Nema dostupnih servisera**  
3a. Sistem ne pronalazi dostupne servisere  
4a. Sistem prikazuje poruku da nema dostupnih izvršilaca  

**A2: Greška pri dodjeli**  
6a. Sistem ne uspije dodijeliti intervenciju  
7a. Sistem prikazuje poruku o grešci  

**A3: Promjena dodjele**  
4a. Intervencija je već dodijeljena  
5a. Dispečer bira drugog servisera  
6a. Sistem ažurira dodjelu novim serviserom  

### **Ishod:**
- Intervencija je dodijeljena odgovornom serviseru  
- Serviser je obaviješten o zadatku  
- Status intervencije je ažuriran  
- Promjena je evidentirana u sistemu  




## Use Case Model – US-10

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Dodjela intervencije timu servisera

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer dodjeljuje intervenciju timu servisera kako bi se složeniji zadaci mogli izvršavati timski i efikasnije.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji kreirana intervencija  
- Postoji definisan tim servisera u sistemu  
- Intervencija nije dodijeljena ili se dodjela može promijeniti  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara detalje intervencije  
2. Dispečer bira opciju za dodjelu timu  
3. Sistem prikazuje listu dostupnih timova  
4. Dispečer odabire tim servisera  
5. Dispečer potvrđuje dodjelu  
6. Sistem dodjeljuje intervenciju odabranom timu  
7. Sistem ažurira status intervencije  
8. Sistem bilježi promjenu u historiji aktivnosti  
9. Sistem obavještava članove tima  

### **Alternativni tokovi:**

**A1: Nema dostupnih timova**  
3a. Sistem ne pronalazi nijedan tim  
4a. Sistem prikazuje poruku da nema dostupnih timova  

**A2: Greška pri dodjeli**  
6a. Sistem ne uspije dodijeliti intervenciju  
7a. Sistem prikazuje poruku o grešci  

**A3: Promjena dodjele**  
4a. Intervencija je već dodijeljena  
5a. Dispečer bira drugi tim  
6a. Sistem ažurira dodjelu  

### **Ishod:**
- Intervencija je dodijeljena timu servisera  
- Svi članovi tima su obaviješteni  
- Status intervencije je ažuriran  
- Promjena je evidentirana u sistemu  




## Use Case Model – US-11

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Planiranje intervencije

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer planira intervenciju unaprijed definisanjem termina, resursa i organizacije izvršenja zadatka.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji kreirana intervencija  
- Intervencija ima osnovne podatke (lokacija, opis itd.)  
- Dostupni su serviseri ili timovi  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara detalje intervencije  
2. Dispečer bira opciju planiranja  
3. Sistem prikazuje dostupne termine i resurse  
4. Dispečer odabire datum i vrijeme intervencije  
5. Dispečer određuje potrebne resurse (serviser/tim)  
6. Dispečer potvrđuje plan  
7. Sistem sprema planirane podatke  
8. Sistem ažurira status intervencije (npr. "Planirano")  
9. Sistem obavještava uključene servisere  

### **Alternativni tokovi:**

**A1: Nema dostupnih termina**  
3a. Sistem ne pronalazi slobodan termin  
4a. Sistem prikazuje poruku o nedostupnosti  

**A2: Konflikt termina**  
4a. Odabrani termin se preklapa sa drugim zadatkom  
5a. Sistem upozorava dispečera  
6a. Dispečer bira novi termin  

**A3: Greška pri spremanju**  
7a. Sistem ne uspije spremiti plan  
8a. Sistem prikazuje poruku o grešci  

### **Ishod:**
- Intervencija ima definisan termin i resurse  
- Status intervencije je ažuriran  
- Serviseri su obaviješteni o planu  
- Omogućeno efikasnije izvršenje zadatka  



## Use Case Model – US-12

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Određivanje prioriteta intervencije

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer određuje prioritet intervencije kako bi zahtjevi bili obrađeni i raspoređeni prema njihovoj hitnosti i važnosti.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji kreirana intervencija  
- Intervencija ima osnovne informacije (opis, lokacija, hitnost)  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara detalje intervencije  
2. Dispečer bira opciju za postavljanje prioriteta  
3. Sistem prikazuje dostupne nivoe prioriteta (npr. nizak, srednji, visok)  
4. Dispečer odabire nivo prioriteta  
5. Dispečer potvrđuje izbor  
6. Sistem sprema odabrani prioritet  
7. Sistem ažurira prikaz intervencije  
8. Sistem bilježi promjenu u historiji aktivnosti  

### **Alternativni tokovi:**

**A1: Već postavljen prioritet**  
2a. Intervencija već ima prioritet  
3a. Dispečer može promijeniti postojeći prioritet  

**A2: Greška pri spremanju**  
6a. Sistem ne uspije spremiti promjenu  
7a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Korisnik bez uloge dispečera pokuša promijeniti prioritet  
3a. Sistem blokira akciju  

### **Ishod:**
- Intervencija ima definisan prioritet  
- Prioritet je vidljiv u sistemu  
- Promjena je evidentirana  
- Omogućena bolja organizacija i raspodjela zadataka


## Use Case Model – US-13

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Pregled statusa intervencija od strane dispečera

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer pregledava statuse intervencija kako bi mogao pratiti tok rada i imati jasan uvid u trenutnu fazu obrade svakog zahtjeva.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoje intervencije u sistemu  
- Intervencije imaju definisan status  
- Sistem je dostupan  

### **Glavni tok:**
1. Dispečer otvara pregled intervencija  
2. Sistem prikazuje listu intervencija sa njihovim statusima  
3. Sistem prikazuje dodatne informacije (npr. prioritet, dodijeljeni serviser, rok)  
4. Dispečer pregledava statuse intervencija  
5. Dispečer prati tok rada i identifikuje intervencije koje zahtijevaju pažnju  

### **Alternativni tokovi:**

**A1: Nema intervencija**  
2a. Sistem ne pronalazi nijednu intervenciju  
3a. Sistem prikazuje poruku da nema dostupnih podataka  

**A2: Greška pri učitavanju**  
2a. Sistem ne može učitati podatke  
3a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Korisnik bez uloge dispečera pokuša pristupiti  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Dispečer ima pregled statusa svih intervencija  
- Omogućen je nadzor procesa  
- Lakše se uočavaju zastoji i problemi  
- Omogućena je bolja kontrola rada  


## Use Case Model – US-14

### **Aktor:**
Serviser

### **Naziv use case-a:**
Ažuriranje statusa intervencije od strane servisera

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser po potrebi ažurira status intervencije na kojoj radi, kako bi sistem odražavao trenutno stanje rada na terenu.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Serviser ima dodijeljenu intervenciju  
- Intervencija postoji u sistemu  
- Sistem je dostupan  

### **Glavni tok:**
1. Serviser otvara listu svojih dodijeljenih intervencija  
2. Serviser odabire intervenciju  
3. Serviser bira opciju za promjenu statusa  
4. Sistem prikazuje dostupne statuse (npr. "U toku", "Završeno", "Na čekanju")  
5. Serviser odabire novi status  
6. Serviser potvrđuje izmjenu  
7. Sistem ažurira status intervencije  
8. Sistem bilježi promjenu u historiji aktivnosti  

### **Alternativni tokovi:**

**A1: Nevažeći status**  
5a. Serviser odabere nevažeći status  
6a. Sistem detektuje grešku  
7a. Sistem ne dozvoljava izmjenu  
8a. Sistem prikazuje poruku o grešci  

**A2: Greška pri spremanju**  
7a. Sistem ne uspije spremiti promjenu  
8a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Serviser pokuša pristupiti intervenciji koja mu nije dodijeljena  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Status intervencije je ažuriran  
- Sistem prikazuje tačno stanje rada  
- Smanjena je potreba za dodatnim provjerama  
- Poboljšana je koordinacija između učesnika

## Use Case Model – US-15

### **Aktor:**
Serviser

### **Naziv use case-a:**
Pregled dodijeljenih intervencija

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser pregledava intervencije koje su mu dodijeljene, kako bi znao koje zadatke treba izvršiti i kojim redoslijedom ih treba obraditi.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Serviser ima dodijeljene intervencije  
- Intervencije postoje u sistemu  
- Sistem je dostupan  

### **Glavni tok:**
1. Serviser otvara listu svojih dodijeljenih intervencija  
2. Sistem prikazuje listu intervencija dodijeljenih serviseru  
3. Sistem prikazuje ključne informacije (status, prioritet, lokacija, rok itd.)  
4. Serviser pregledava listu i organizuje redoslijed rada  
5. Serviser može odabrati intervenciju za detaljniji pregled  

### **Alternativni tokovi:**

**A1: Nema dodijeljenih intervencija**  
2a. Sistem ne pronalazi nijednu intervenciju  
3a. Sistem prikazuje poruku da nema dodijeljenih zadataka  

**A2: Greška pri učitavanju**  
2a. Sistem ne može učitati intervencije  
3a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Neautorizovan korisnik pokuša pristupiti listi  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Serviser ima pregled svojih zadataka  
- Omogućena je lakša organizacija rada  
- Smanjen je broj propuštenih intervencija  
- Serviser može planirati izvršenje zadataka

## Use Case Model – US-16

### **Aktor:**
Serviser

### **Naziv use case-a:**
Pregled detalja zadatka na terenu

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser pregledava detalje zadatka na terenu kako bi imao sve potrebne informacije za njegovo pravilno i efikasno izvršavanje.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Serviser ima dodijeljenu intervenciju  
- Intervencija postoji u sistemu  
- Sistem je dostupan  

### **Glavni tok:**
1. Serviser otvara listu svojih intervencija  
2. Serviser odabire intervenciju  
3. Sistem prikazuje detalje zadatka  
4. Sistem prikazuje informacije (opis kvara, lokacija, prioritet, status, napomene itd.)  
5. Serviser pregledava podatke prije izvršenja zadatka  

### **Alternativni tokovi:**

**A1: Intervencija ne postoji**  
2a. Odabrana intervencija više ne postoji  
3a. Sistem prikazuje poruku o grešci  

**A2: Greška pri učitavanju**  
3a. Sistem ne može učitati detalje  
4a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Serviser pokuša pristupiti intervenciji koja mu nije dodijeljena  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Serviser ima sve potrebne informacije za izvršenje zadatka  
- Smanjen je broj grešaka tokom rada  
- Poboljšana je priprema prije intervencije  
- Omogućeno efikasnije izvršenje zadatka

  ## Use Case Model – US-17

### **Aktor:**
Serviser

### **Naziv use case-a:**
Evidentiranje izvršenog rada

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser evidentira izvršeni rad kako bi sistem sadržavao tačan zapis o aktivnostima obavljenim tokom intervencije.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Serviser ima dodijeljenu intervenciju  
- Intervencija postoji u sistemu  
- Intervencija je u toku ili završena  
- Sistem je dostupan  

### **Glavni tok:**
1. Serviser otvara detalje intervencije  
2. Serviser bira opciju za evidentiranje rada  
3. Serviser unosi podatke o izvršenim aktivnostima (opis rada, utrošeno vrijeme, materijal itd.)  
4. Serviser potvrđuje unos  
5. Sistem validira unesene podatke  
6. Sistem sprema evidenciju rada  
7. Sistem povezuje zapis sa intervencijom  
8. Sistem bilježi promjenu u historiji aktivnosti  

### **Alternativni tokovi:**

**A1: Nepotpuni podaci**  
3a. Serviser ne unese sve obavezne podatke  
5a. Sistem detektuje nedostatak podataka  
6a. Sistem ne sprema zapis  
7a. Sistem prikazuje poruku o grešci  

**A2: Greška pri spremanju**  
6a. Sistem ne uspije spremiti podatke  
7a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Serviser pokuša pristupiti intervenciji koja mu nije dodijeljena  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Evidencija izvršenog rada je uspješno zabilježena  
- Podaci o intervenciji su ažurirani  
- Omogućena je transparentnost procesa  
- Omogućen je pregled izvršenja rada

  ## Use Case Model – US-18

### **Aktor:**
Administrator

### **Naziv use case-a:**
Administrativno kreiranje internog korisničkog naloga

### **Kratak opis:**
Ovaj use case opisuje proces u kojem administrator kreira korisnički nalog za internog korisnika sistema, kako bi mu omogućio pristup sistemu u skladu sa njegovom ulogom.

### **Preduslovi:**
- Administrator je prijavljen u sistem  
- Postoje definisane korisničke uloge  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Administrator otvara modul za upravljanje korisnicima  
2. Administrator bira opciju za kreiranje novog korisnika  
3. Administrator unosi podatke o korisniku (ime, email, uloga itd.)  
4. Administrator potvrđuje unos  
5. Sistem validira unesene podatke  
6. Sistem kreira novi korisnički nalog  
7. Sistem dodjeljuje odgovarajuću ulogu korisniku  
8. Sistem sprema podatke  
9. Sistem prikazuje potvrdu o uspješnom kreiranju naloga  

### **Alternativni tokovi:**

**A1: Nepotpuni ili nevažeći podaci**  
3a. Administrator unese nepotpune ili neispravne podatke  
5a. Sistem detektuje grešku  
6a. Sistem ne kreira nalog  
7a. Sistem prikazuje poruku o grešci  

**A2: Duplikat korisnika**  
3a. Administrator unese email koji već postoji u sistemu  
5a. Sistem detektuje duplikat  
6a. Sistem ne dozvoljava kreiranje naloga  
7a. Sistem prikazuje poruku da korisnik već postoji  

**A3: Neovlašten pristup**  
1a. Korisnik bez administratorske uloge pokuša pristupiti modulu  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Novi korisnički nalog je kreiran  
- Korisniku je dodijeljena odgovarajuća uloga  
- Omogućen je pristup sistemu  
- Jasno su definisane odgovornosti korisnika

  ## Use Case Model – US-19

### **Aktor:**
Administrator

### **Naziv use case-a:**
Pregled postojećih korisničkih naloga

### **Kratak opis:**
Ovaj use case opisuje proces u kojem administrator pregledava postojeće korisničke naloge kako bi imao uvid u korisnike sistema i mogao njima upravljati.

### **Preduslovi:**
- Administrator je prijavljen u sistem  
- Postoje korisnički nalozi u sistemu  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Administrator otvara modul za upravljanje korisnicima  
2. Sistem prikazuje listu svih korisničkih naloga  
3. Sistem prikazuje osnovne informacije (ime, email, uloga, status itd.)  
4. Administrator pregledava listu korisnika  
5. Administrator može odabrati korisnika za detaljniji pregled ili izmjene  

### **Alternativni tokovi:**

**A1: Nema korisničkih naloga**  
2a. Sistem ne pronalazi nijedan korisnički nalog  
3a. Sistem prikazuje poruku da nema dostupnih korisnika  

**A2: Greška pri učitavanju**  
2a. Sistem ne može učitati korisničke naloge  
3a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Korisnik bez administratorske uloge pokuša pristupiti modulu  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Administrator ima pregled svih korisničkih naloga  
- Omogućen je uvid u korisničke uloge  
- Olakšano je upravljanje korisnicima  
- Sistem omogućava dalje administrativne akcije

## Use Case Model – US-20

### **Aktor:**
Administrator

### **Naziv use case-a:**
Promjena korisničke uloge

### **Kratak opis:**
Ovaj use case opisuje proces u kojem administrator mijenja korisničku ulogu kako bi korisnik imao pristup funkcionalnostima koje odgovaraju njegovoj novoj odgovornosti u sistemu.

### **Preduslovi:**
- Administrator je prijavljen u sistem  
- Postoje korisnički nalozi u sistemu  
- Postoje definisane korisničke uloge  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Administrator otvara modul za upravljanje korisnicima  
2. Administrator bira korisnika iz liste  
3. Administrator pregleda trenutnu korisničku ulogu  
4. Administrator bira novu korisničku ulogu  
5. Administrator potvrđuje izmjenu  
6. Sistem validira odabranu ulogu  
7. Sistem ažurira korisničku ulogu  
8. Sistem sprema promjene  
9. Sistem prikazuje potvrdu o uspješnoj izmjeni  

### **Alternativni tokovi:**

**A1: Nevažeća uloga**  
4a. Administrator odabere nepostojeću ili nevažeću ulogu  
6a. Sistem detektuje grešku  
7a. Sistem ne dozvoljava izmjenu  
8a. Sistem prikazuje poruku o grešci  

**A2: Greška pri spremanju**  
7a. Sistem ne uspije spremiti promjene  
8a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Korisnik bez administratorske uloge pokuša pristupiti modulu  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Korisniku je dodijeljena nova uloga  
- Pristup funkcionalnostima je ažuriran  
- Osigurana je sigurnost sistema  
- Omogućena je bolja organizacija rada

  ## Use Case Model – US-21

### **Aktor:**
Administrator

### **Naziv use case-a:**
Deaktivacija korisničkog naloga

### **Kratak opis:**
Ovaj use case opisuje proces u kojem administrator deaktivira korisnički nalog kako bi spriječio dalji pristup korisniku koji više ne treba koristiti sistem.

### **Preduslovi:**
- Administrator je prijavljen u sistem  
- Postoje korisnički nalozi u sistemu  
- Korisnik čiji se nalog deaktivira postoji u sistemu  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Administrator otvara modul za upravljanje korisnicima  
2. Administrator bira korisnički nalog iz liste  
3. Administrator pregleda detalje korisnika  
4. Administrator bira opciju za deaktivaciju naloga  
5. Administrator potvrđuje deaktivaciju  
6. Sistem mijenja status naloga u "deaktiviran"  
7. Sistem onemogućava dalju prijavu korisnika  
8. Sistem sprema promjene  
9. Sistem prikazuje potvrdu o uspješnoj deaktivaciji  

### **Alternativni tokovi:**

**A1: Već deaktiviran nalog**  
4a. Administrator pokuša deaktivirati već deaktiviran nalog  
5a. Sistem prikazuje informaciju da je nalog već deaktiviran  

**A2: Greška pri spremanju**  
6a. Sistem ne uspije promijeniti status naloga  
7a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
1a. Korisnik bez administratorske uloge pokuša izvršiti deaktivaciju  
2a. Sistem blokira pristup  
3a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Korisnički nalog je deaktiviran  
- Korisniku je onemogućen pristup sistemu  
- Podaci o korisniku ostaju sačuvani u sistemu  
- Osigurana je sigurnost i kontrola pristupa

## Use Case Model – US-22

### **Aktor:**
Serviser

### **Naziv use case-a:**
Prihvatanje dodijeljenog zadatka

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser prihvata dodijeljeni zadatak kako bi potvrdio da preuzima odgovornost za njegovu realizaciju.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Postoji dodijeljena intervencija serviseru  
- Serviser ima pristup listi svojih zadataka  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Serviser otvara listu dodijeljenih intervencija  
2. Serviser bira jednu intervenciju  
3. Serviser pregleda detalje zadatka  
4. Serviser bira opciju za prihvatanje zadatka  
5. Serviser potvrđuje prihvatanje  
6. Sistem ažurira status intervencije (npr. "U toku")  
7. Sistem bilježi promjenu u historiji aktivnosti  
8. Sistem prikazuje potvrdu o uspješnom prihvatanju  

### **Alternativni tokovi:**

**A1: Zadatak već prihvaćen**  
4a. Intervencija je već prihvaćena od strane servisera  
5a. Sistem prikazuje informaciju da je zadatak već u obradi  

**A2: Greška pri ažuriranju**  
6a. Sistem ne uspije ažurirati status  
7a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Korisnik koji nije dodijeljeni serviser pokušava pristupiti zadatku  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Zadatak je prihvaćen od strane servisera  
- Status intervencije je ažuriran  
- Serviser preuzima odgovornost za izvršenje  
- Promjena je evidentirana u sistemu

## Use Case Model – US-23

### **Aktor:**
Serviser

### **Naziv use case-a:**
Odbijanje dodijeljenog zadatka

### **Kratak opis:**
Ovaj use case opisuje proces u kojem serviser odbija dodijeljeni zadatak kako bi dispečer mogao pravovremeno reagovati i dodijeliti ga drugom izvršiocu.

### **Preduslovi:**
- Serviser je prijavljen u sistem  
- Postoji dodijeljena intervencija serviseru  
- Serviser ima pristup listi svojih zadataka  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Serviser otvara listu dodijeljenih intervencija  
2. Serviser bira jednu intervenciju  
3. Serviser pregleda detalje zadatka  
4. Serviser bira opciju za odbijanje zadatka  
5. Serviser unosi razlog odbijanja (opcionalno)  
6. Serviser potvrđuje odbijanje  
7. Sistem ažurira status intervencije (npr. "Odbijeno")  
8. Sistem bilježi promjenu u historiji aktivnosti  
9. Sistem obavještava dispečera o odbijanju  

### **Alternativni tokovi:**

**A1: Zadatak već prihvaćen**  
4a. Intervencija je već prihvaćena od strane servisera  
5a. Sistem ne dozvoljava odbijanje i prikazuje poruku  

**A2: Greška pri ažuriranju**  
7a. Sistem ne uspije ažurirati status  
8a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Korisnik koji nije dodijeljeni serviser pokušava izvršiti akciju  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani pristupa  

### **Ishod:**
- Zadatak je odbijen od strane servisera  
- Dispečer je obaviješten o odbijanju  
- Intervencija je spremna za ponovnu dodjelu  
- Promjena je evidentirana u sistemu

## Use Case Model – US-24

### **Aktor:**
Dispečer

### **Naziv use case-a:**
Pregled evidentiranog izvršenog rada

### **Kratak opis:**
Ovaj use case opisuje proces u kojem dispečer pregledava evidentirani izvršeni rad kako bi imao uvid u aktivnosti koje je serviser obavio prije zatvaranja intervencije.

### **Preduslovi:**
- Dispečer je prijavljen u sistem  
- Postoji intervencija sa evidentiranim izvršenim radom  
- Serviser je unio podatke o izvršenom radu  
- Sistem je dostupan i funkcionalan  

### **Glavni tok:**
1. Dispečer otvara listu intervencija  
2. Dispečer bira intervenciju za pregled  
3. Dispečer otvara sekciju evidentiranog rada  
4. Sistem prikazuje detalje izvršenog rada (opis, vrijeme, utrošeni materijal itd.)  
5. Dispečer pregledava unesene informacije  
6. Dispečer donosi odluku o daljim koracima (npr. zatvaranje intervencije)  

### **Alternativni tokovi:**

**A1: Nema evidentiranog rada**  
3a. Intervencija nema unesene podatke o radu  
4a. Sistem prikazuje poruku da nema dostupnih informacija  

**A2: Greška pri učitavanju**  
4a. Sistem ne može učitati podatke  
5a. Sistem prikazuje poruku o grešci  

**A3: Neovlašten pristup**  
2a. Korisnik bez uloge dispečera pokuša pristupiti  
3a. Sistem blokira pristup  
4a. Sistem prikazuje poruku o zabrani  

### **Ishod:**
- Dispečer ima uvid u izvršeni rad  
- Podaci o radu su jasno prikazani  
- Omogućena je kontrola i verifikacija rada  
- Intervencija je spremna za zatvaranje ili dodatne akcije


## Zaključak

U ovom dokumentu definisani su ključni use case-ovi sistema za upravljanje servisnim intervencijama. Svaki use case detaljno opisuje interakciju između aktera i sistema, uključujući glavne i alternativne tokove, kao i očekivane ishode.

Ovakva specifikacija omogućava jasno razumijevanje funkcionalnosti sistema, olakšava dalji razvoj i implementaciju, te služi kao osnova za testiranje i validaciju sistema.
