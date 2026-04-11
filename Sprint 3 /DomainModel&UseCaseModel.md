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


    







        
##**Use Case Model – US-01**  




Aktor:  

Korisnik usluge  


Naziv use case-a:  

Samostalna registracija korisnika  


Kratak opis:  

Ovaj use case opisuje proces u kojem korisnik usluge kreira novi korisnički nalog kako bi mogao pristupiti sistemu i koristiti njegove funkcionalnosti.  


Preduslovi:  

Korisnik ima pristup registracionoj formi  

Sistem je dostupan i funkcionalan  

Glavni tok:  

Korisnik otvara formu za registraciju  

Korisnik unosi potrebne podatke (ime, email, lozinka itd.)  

Korisnik potvrđuje registraciju  

Sistem validira unesene podatke  

Sistem kreira novi korisnički nalog  

Sistem automatski dodjeljuje ulogu korisnika  

Sistem prikazuje poruku o uspješnoj registraciji  

Alternativni tokovi:  


A1: Neispravni ili nepotpuni podaci  

3a. Korisnik nije unio sve obavezne podatke ili su neispravni  

4a. Sistem detektuje grešku  

5a. Sistem ne kreira nalog  

6a. Sistem prikazuje poruku o grešci  


Ishod:  

Korisnički nalog je uspješno kreiran  

Korisnik može pristupiti sistemu  






        

##**Use Case Model – US-02**  


Aktor:  

Korisnik usluge

Naziv use case-a:  

Prijava korisnika u sistem

Kratak opis:  

Ovaj use case opisuje proces u kojem registrovani korisnik unosi svoje kredencijale kako bi se prijavio u sistem i pristupio dostupnim funkcionalnostima.

Preduslovi:  

Korisnik ima kreiran korisnički nalog  

Korisnik ima pristup login formi  

Sistem je dostupan i funkcionalan  

Glavni tok:  

Korisnik otvara formu za prijavu  

Korisnik unosi email i lozinku  

Korisnik potvrđuje prijavu  

Sistem validira unesene podatke  

Sistem provjerava kredencijale korisnika  

Sistem kreira korisničku sesiju  

Sistem preusmjerava korisnika na početnu stranicu (dashboard)  

Alternativni tokovi:  


A1: Neispravni kredencijali  

4a. Sistem utvrdi da email ili lozinka nisu tačni  

5a. Sistem ne dozvoljava prijavu  

6a. Sistem prikazuje poruku o grešci  


A2: Prazna polja  

2a. Korisnik nije unio email ili lozinku  

3a. Sistem detektuje nedostatak podataka  

4a. Sistem prikazuje poruku da su polja obavezna  


Ishod:  

Korisnik je uspješno prijavljen u sistem  

Kreirana je aktivna sesija  

Korisnik ima pristup funkcionalnostima prema svojoj ulozi  




##**Use Case Model – US-03**  


Aktor:  

Korisnik sistema

Naziv use case-a:  

Odjava korisnika iz sistema

Kratak opis:  

Ovaj use case opisuje proces u kojem prijavljeni korisnik završava svoju sesiju u sistemu kako bi spriječio neovlašten pristup svom korisničkom nalogu.

Preduslovi:  

Korisnik je prijavljen u sistem 

Postoji aktivna korisnička sesija  

Sistem je dostupan i funkcionalan  

Glavni tok:  

Korisnik klikne na opciju za odjavu (logout)  

Sistem prima zahtjev za odjavu  

Sistem invalidira korisničku sesiju  

Sistem briše sesijske podatke  

Sistem preusmjerava korisnika na login stranicu  

Sistem prikazuje poruku o uspješnoj odjavi  

Alternativni tokovi:  


A1: Istek sesije (automatska odjava)  

1a. Korisnik je neaktivan određeni vremenski period  

2a. Sistem automatski prekida sesiju  

3a. Sistem preusmjerava korisnika na login stranicu  

4a. Sistem prikazuje poruku da je sesija istekla  


Ishod:  

Korisnik je uspješno odjavljen iz sistema  

Sesija je zatvorena  

Onemogućen je dalji pristup bez ponovne prijave  


    



##**Use Case Model – US-04**

Aktor:  

Administrator

Naziv use case-a:  

Kontrola pristupa prema korisničkoj ulozi

Kratak opis:  

Ovaj use case opisuje proces u kojem administrator upravlja pristupom funkcionalnostima sistema dodjeljivanjem odgovarajućih uloga korisnicima, čime se osigurava da svaki korisnik ima pristup samo relevantnim podacima i akcijama.

Preduslovi:  

Administrator je prijavljen u sistem  

Postoje definisane korisničke uloge  

Korisnici su registrovani u sistemu  

Sistem je dostupan i funkcionalan  

Glavni tok:  

Administrator pristupa modulu za upravljanje korisnicima  

Administrator bira korisnika iz liste  

Administrator pregleda trenutnu korisničku ulogu  

Administrator mijenja ili dodjeljuje novu ulogu korisniku  

Sistem validira odabranu ulogu  

Sistem ažurira prava pristupa korisnika  

Sistem sprema promjene  

Sistem prikazuje potvrdu o uspješnoj izmjeni  

Alternativni tokovi:  


A1: Nevažeća uloga  

4a. Administrator odabere nepostojeću ili nevažeću ulogu  

5a. Sistem detektuje grešku  

6a. Sistem ne dozvoljava izmjenu  

7a. Sistem prikazuje poruku o grešci  


A2: Nedozvoljen pristup  

1a. Korisnik koji nije administrator pokušava pristupiti modulu  

2a. Sistem odbija pristup  

3a. Sistem prikazuje poruku o nedozvoljenom pristupu  


Ishod:  

Korisniku je dodijeljena odgovarajuća uloga  

Pristup funkcionalnostima sistema je ograničen prema ulozi  

Sistem osigurava sigurnost i kontrolu pristupa  




Use Case Model – US-05

Aktor:
Korisnik usluge

Naziv use case-a:
Prijava zahtjeva za servisnu intervenciju

Kratak opis:
Ovaj use case opisuje proces u kojem korisnik usluge prijavljuje kvar ili zahtjev za servisnu intervenciju. Sistem evidentira unesene podatke, validira ih i kreira novi zahtjev koji postaje dostupan za dalju obradu.

Preduslovi:
Korisnik je registrovan u sistemu
Korisnik je prijavljen u sistem
Korisnik ima pristup formi za prijavu zahtjeva
Sistem je dostupan i funkcionalan
Glavni tok:
Korisnik otvara formu za prijavu zahtjeva
Korisnik unosi podatke o kvaru (opis, lokacija, vrijeme itd.)
Korisnik potvrđuje slanje zahtjeva
Sistem validira unesene podatke
Sistem kreira novi zahtjev u bazi podataka
Sistem automatski dodjeljuje početni status zahtjevu
Sistem povezuje zahtjev sa korisnikom
Sistem prikazuje potvrdu o uspješnoj prijavi
Alternativni tokovi:

A1: Nepotpuni podaci
2a. Korisnik ne unese sve obavezne podatke
4a. Sistem detektuje nedostatak podataka
5a. Sistem ne kreira zahtjev
6a. Sistem prikazuje poruku o grešci i traži dopunu

A2: Nevažeći podaci
2a. Korisnik unese pogrešan format (npr. nevalidna lokacija)
4a. Sistem detektuje grešku
5a. Sistem odbija unos
6a. Sistem prikazuje poruku o grešci

A3: Greška sistema
5a. Dođe do greške pri kreiranju zahtjeva
6a. Sistem ne sprema zahtjev
7a. Sistem obavještava korisnika da pokuša ponovo

Ishod:
Novi zahtjev za servisnu intervenciju je kreiran
Zahtjev je povezan sa korisnikom
Zahtjev ima početni status (npr. "Kreiran")
Zahtjev je spreman za dalju obradu od strane dispečera



Use Case Model – US-06

Aktor:
Korisnik usluge

Naziv use case-a:
Pregled vlastitog zahtjeva

Kratak opis:
Ovaj use case opisuje proces u kojem korisnik pregledava svoje prethodno prijavljene zahtjeve, uključujući osnovne informacije i trenutni status obrade.

Preduslovi:
Korisnik je registrovan u sistemu
Korisnik je prijavljen u sistem
Korisnik ima kreiran barem jedan zahtjev
Sistem je dostupan
Glavni tok:
Korisnik otvara listu svojih zahtjeva
Sistem prikazuje listu svih korisnikovih zahtjeva
Korisnik bira jedan zahtjev za pregled
Sistem prikazuje detalje zahtjeva (opis, status, datum, itd.)
Korisnik pregledava informacije
Alternativni tokovi:

A1: Nema zahtjeva
1a. Korisnik nema nijedan zahtjev
2a. Sistem prikazuje poruku da nema dostupnih zahtjeva

A2: Greška pri učitavanju
2a. Sistem ne može učitati zahtjeve
3a. Sistem prikazuje poruku o grešci

A3: Neovlašten pristup
3a. Korisnik pokuša pristupiti zahtjevu koji nije njegov
4a. Sistem blokira pristup
5a. Sistem prikazuje poruku o zabrani pristupa

Ishod:
Korisnik vidi listu svojih zahtjeva
Korisnik može pregledati detalje pojedinačnog zahtjeva
Prikazan je tačan status i informacije o zahtjevu



Use Case Model – US-07

Aktor:
Dispečer

Naziv use case-a:
Pregled otvorenih intervencija

Kratak opis:
Ovaj use case opisuje proces u kojem dispečer pregledava sve otvorene i aktivne intervencije kako bi imao jasan uvid u zahtjeve koji čekaju obradu ili su trenutno u toku.

Preduslovi:
Dispečer je registrovan u sistemu
Dispečer je prijavljen u sistem
U sistemu postoje otvorene ili aktivne intervencije
Sistem je dostupan
Glavni tok:
Dispečer otvara pregled intervencija (dashboard ili lista)
Sistem prikazuje listu svih otvorenih i aktivnih intervencija
Sistem prikazuje ključne informacije (status, prioritet, lokacija, dodijeljeni serviser itd.)
Dispečer pregledava listu i identifikuje relevantne intervencije
Dispečer može odabrati intervenciju za detaljniji pregled
Alternativni tokovi:

A1: Nema otvorenih intervencija
2a. Sistem ne pronalazi nijednu otvorenu intervenciju
3a. Sistem prikazuje poruku da nema aktivnih zahtjeva

A2: Greška pri učitavanju
2a. Sistem ne može učitati intervencije
3a. Sistem prikazuje poruku o grešci

A3: Neovlašten pristup
1a. Korisnik bez uloge dispečera pokuša pristupiti
2a. Sistem blokira pristup
3a. Sistem prikazuje poruku o zabrani pristupa

Ishod:
Dispečer ima pregled svih aktivnih intervencija
Intervencije su jasno prikazane sa ključnim informacijama
Omogućen je dalji rad (dodjela, pregled detalja, promjene)



Use Case Model – US-08

Aktor:
Dispečer

Naziv use case-a:
Pregled detalja pojedinačne intervencije

Kratak opis:
Ovaj use case opisuje proces u kojem dispečer pregledava detaljne informacije o jednoj intervenciji kako bi imao potpuni uvid u njen status, tok i zaduženja.

Preduslovi:
Dispečer je prijavljen u sistem
Postoji barem jedna intervencija u sistemu
Dispečer ima pristup listi intervencija
Sistem je dostupan
Glavni tok:
Dispečer otvara listu intervencija
Dispečer odabire jednu intervenciju
Sistem prikazuje detalje intervencije
Sistem prikazuje informacije (opis, status, prioritet, lokacija, dodijeljeni serviser, historija aktivnosti itd.)
Dispečer pregledava podatke
Alternativni tokovi:

A1: Intervencija ne postoji
2a. Odabrana intervencija više ne postoji
3a. Sistem prikazuje poruku o grešci

A2: Greška pri učitavanju detalja
3a. Sistem ne može učitati detalje
4a. Sistem prikazuje poruku o grešci

A3: Neovlašten pristup
2a. Korisnik bez prava pristupa pokuša otvoriti intervenciju
3a. Sistem blokira pristup
4a. Sistem prikazuje poruku o zabrani

Ishod:
Dispečer ima detaljan uvid u intervenciju
Prikazani su svi relevantni podaci
Omogućeno donošenje odluka (dodjela, promjena prioriteta itd.)



Use Case Model – US-09

Aktor:
Dispečer

Naziv use case-a:
Dodjela intervencije odgovornom serviseru

Kratak opis:
Ovaj use case opisuje proces u kojem dispečer dodjeljuje intervenciju odgovornom serviseru kako bi bilo jasno ko preuzima izvršenje zadatka.

Preduslovi:
Dispečer je prijavljen u sistem
Postoji kreirana intervencija
Postoji barem jedan serviser u sistemu
Intervencija još nije dodijeljena ili se može promijeniti izvršilac
Sistem je dostupan
Glavni tok:
Dispečer otvara detalje intervencije
Dispečer bira opciju za dodjelu servisera
Sistem prikazuje listu dostupnih servisera
Dispečer odabire servisera
Dispečer potvrđuje dodjelu
Sistem dodjeljuje intervenciju izabranom serviseru
Sistem ažurira status intervencije (npr. "Dodijeljeno")
Sistem bilježi promjenu u historiji aktivnosti
Sistem obavještava servisera o dodjeli
Alternativni tokovi:

A1: Nema dostupnih servisera
3a. Sistem ne pronalazi dostupne servisere
4a. Sistem prikazuje poruku da nema dostupnih izvršilaca

A2: Greška pri dodjeli
6a. Sistem ne uspije dodijeliti intervenciju
7a. Sistem prikazuje poruku o grešci

A3: Promjena dodjele
4a. Intervencija je već dodijeljena
5a. Dispečer bira drugog servisera
6a. Sistem ažurira dodjelu novim serviserom

Ishod:
Intervencija je dodijeljena odgovornom serviseru
Serviser je obaviješten o zadatku
Status intervencije je ažuriran
Promjena je evidentirana u sistemu



Use Case Model – US-10

Aktor:
Dispečer

Naziv use case-a:
Dodjela intervencije timu servisera

Kratak opis:
Ovaj use case opisuje proces u kojem dispečer dodjeljuje intervenciju timu servisera kako bi se složeniji zadaci mogli izvršavati timski i efikasnije.

Preduslovi:
Dispečer je prijavljen u sistem
Postoji kreirana intervencija
Postoji definisan tim servisera u sistemu
Intervencija nije dodijeljena ili se dodjela može promijeniti
Sistem je dostupan
Glavni tok:
Dispečer otvara detalje intervencije
Dispečer bira opciju za dodjelu timu
Sistem prikazuje listu dostupnih timova
Dispečer odabire tim servisera
Dispečer potvrđuje dodjelu
Sistem dodjeljuje intervenciju odabranom timu
Sistem ažurira status intervencije
Sistem bilježi promjenu u historiji aktivnosti
Sistem obavještava članove tima
Alternativni tokovi:

A1: Nema dostupnih timova
3a. Sistem ne pronalazi nijedan tim
4a. Sistem prikazuje poruku da nema dostupnih timova

A2: Greška pri dodjeli
6a. Sistem ne uspije dodijeliti intervenciju
7a. Sistem prikazuje poruku o grešci

A3: Promjena dodjele
4a. Intervencija je već dodijeljena
5a. Dispečer bira drugi tim
6a. Sistem ažurira dodjelu

Ishod:
Intervencija je dodijeljena timu servisera
Svi članovi tima su obaviješteni
Status intervencije je ažuriran
Promjena je evidentirana u sistemu



Use Case Model – US-11

Aktor:
Dispečer

Naziv use case-a:
Planiranje intervencije

Kratak opis:
Ovaj use case opisuje proces u kojem dispečer planira intervenciju unaprijed definisanjem termina, resursa i organizacije izvršenja zadatka.

Preduslovi:
Dispečer je prijavljen u sistem
Postoji kreirana intervencija
Intervencija ima osnovne podatke (lokacija, opis itd.)
Dostupni su serviseri ili timovi
Sistem je dostupan
Glavni tok:
Dispečer otvara detalje intervencije
Dispečer bira opciju planiranja
Sistem prikazuje dostupne termine i resurse
Dispečer odabire datum i vrijeme intervencije
Dispečer određuje potrebne resurse (serviser/tim)
Dispečer potvrđuje plan
Sistem sprema planirane podatke
Sistem ažurira status intervencije (npr. "Planirano")
Sistem obavještava uključene servisere
Alternativni tokovi:

A1: Nema dostupnih termina
3a. Sistem ne pronalazi slobodan termin
4a. Sistem prikazuje poruku o nedostupnosti

A2: Konflikt termina
4a. Odabrani termin se preklapa sa drugim zadatkom
5a. Sistem upozorava dispečera
6a. Dispečer bira novi termin

A3: Greška pri spremanju
7a. Sistem ne uspije spremiti plan
8a. Sistem prikazuje poruku o grešci

Ishod:
Intervencija ima definisan termin i resurse
Status intervencije je ažuriran
Serviseri su obaviješteni o planu
Omogućeno efikasnije izvršenje zadatka



Use Case Model – US-12

Aktor:
Dispečer

Naziv use case-a:
Određivanje prioriteta intervencije

Kratak opis:
Ovaj use case opisuje proces u kojem dispečer određuje prioritet intervencije kako bi zahtjevi bili obrađeni i raspoređeni prema njihovoj hitnosti i važnosti.

Preduslovi:
Dispečer je prijavljen u sistem
Postoji kreirana intervencija
Intervencija ima osnovne informacije (opis, lokacija, hitnost)
Sistem je dostupan
Glavni tok:
Dispečer otvara detalje intervencije
Dispečer bira opciju za postavljanje prioriteta
Sistem prikazuje dostupne nivoe prioriteta (npr. nizak, srednji, visok)
Dispečer odabire nivo prioriteta
Dispečer potvrđuje izbor
Sistem sprema odabrani prioritet
Sistem ažurira prikaz intervencije
Sistem bilježi promjenu u historiji aktivnosti
Alternativni tokovi:

A1: Već postavljen prioritet
2a. Intervencija već ima prioritet
3a. Dispečer može promijeniti postojeći prioritet

A2: Greška pri spremanju
6a. Sistem ne uspije spremiti promjenu
7a. Sistem prikazuje poruku o grešci

A3: Neovlašten pristup
2a. Korisnik bez uloge dispečera pokuša promijeniti prioritet
3a. Sistem blokira akciju

Ishod:
Intervencija ima definisan prioritet
Prioritet je vidljiv u sistemu
Promjena je evidentirana
Omogućena bolja organizacija i raspodjela zadataka
