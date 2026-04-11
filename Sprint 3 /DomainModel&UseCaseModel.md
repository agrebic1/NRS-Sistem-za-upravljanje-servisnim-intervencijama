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
