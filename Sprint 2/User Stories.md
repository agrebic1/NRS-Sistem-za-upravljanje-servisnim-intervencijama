# User  Stories i Acceptance Criteria
Template: 

ID storyja

Naziv storyja

Opis
Kao [tip korisnika], želim [funkcionalnost], kako bih [vrijednost/cilj].

Poslovna vrijednost
Objasniti zašto je story važan.

Prioritet

Pretpostavke i otvorena pitanja

Veze sa drugim storyjima ili zavisnostima

Upute za Acceptance Criteria:

Acceptance Criteria su kriteriji prihvatljivosti koji definišu kada je user story završen. Oni služe da se jasno zna:

šta mora biti ispunjeno
kako se ponašanje sistema provjerava
kada se story može smatrati gotovim.


Format za acceptance criteria: Given–When–Then

Šta znači:
Given = početni uslovi / kontekst
When = radnja korisnika ili događaj
Then = očekivani rezultat

acceptance criteria moraju biti konkretni
moraju pokrivati happy path
i trebaju uključiti edge case-ove i reset / greške kad je to potrebno



| ID | Naziv | Opis | Poslovna vrijednost | Prioritet | Pretpostavke i otvorena pitanja | Veze sa drugim storyjima ili zavisnostima | Acceptance Criteria |
|----|-------|------|---------------------|-----------|---------------------------------|------------------------------------------|---------------------|
| US-01 | Registracija | Kao novi korisnik, želim kreirati korisnički nalog, kako bih mogao koristiti sistem i pristupiti funkcionalnostima koje su mi dostupne. | Ovaj story je važan jer omogućava uključivanje korisnika u sistem i predstavlja osnovu za korištenje svih ostalih funkcionalnosti, poput prijave zahtjeva i praćenja statusa intervencije. | Visok | Pretpostavlja se da korisnik može samostalno kreirati nalog putem registracione forme. Otvoreno pitanje je da li se korisnička uloga dodjeljuje automatski pri registraciji ili je određuje administrator nakon kreiranja naloga. | Povezano sa storyjem za prijavu korisnika u sistem i sa storyjem za upravljanje korisničkim ulogama i pravima pristupa. | **AC_01 - Uspješna registracija**   <br> Given korisnik unese validne podatke  <br>  When klikne na registraciju <br> Then sistem kreira korisnički nalog <br> **AC_02 - Nepotpuni podaci**  <br> Given korisnik ne unese sve obavezne podatke  <br> When pokuša registraciju  <br> Then sistem prikazuje grešku  <br> **AC_03 - Neispravan format**  <br> Given korisnik unese neispravan format podataka  <br> When pokuša registraciju  <br> Then sistem prikazuje validacijsku grešku  <br> **AC_04 - Postojeći korisnik**  <br> Given korisnik već postoji u sistemu  <br> When pokuša registraciju  <br> Then sistem prikazuje grešku  <br>  **AC_05 - Lozinka ne zadovoljava pravila**  <br> Given lozinka ne ispunjava uslove  <br> When korisnik pokuša registraciju  <br> Then sistem prikazuje grešku  
| US-02 | Prijava korisnika u sistem | Kao registrovani korisnik, želim se prijaviti u sistem, kako bih mogao pristupiti funkcionalnostima koje su mi dostupne. | Ovaj story je važan jer omogućava registrovanim korisnicima pristup sistemu i predstavlja osnovu za korištenje svih ostalih funkcionalnosti u skladu sa njihovom ulogom. Bez uspješne prijave korisnik ne može koristiti funkcionalnosti sistema niti pristupiti svojim podacima i zadacima. | Visok | Pretpostavlja se da korisnik već ima kreiran i aktivan korisnički nalog. Otvoreno pitanje je da li se nakon uspješne prijave korisnik preusmjerava na zajednički početni ekran ili na prikaz prilagođen njegovoj ulozi. | Zavisi od storyja za registraciju korisnika i povezan je sa storyjem za upravljanje korisničkim ulogama i pravima pristupa. | **AC_01 - Uspješna prijava**  <br> Given korisnik unese tačne podatke  <br> When se prijavi  <br> Then sistem omogućava pristup  <br> **AC_02 - Nepotpuni podaci**  <br> Given podaci nisu uneseni  <br> When korisnik pokušava prijavu  <br> Then sistem prikazuje grešku  <br> **AC_03 - Neispravan format**  <br> Given podaci nisu u ispravnom formatu  <br> When korisnik pokuša prijavu  <br> Then sistem prikazuje grešku  <br> **AC_04 - Pogrešni podaci**  <br> Given podaci nisu tačni  <br> When korisnik pokuša prijavu  <br> Then pristup nije dozvoljen  <br> **AC_05 - Neaktivan ili nepostojeći nalog**  <br> Given nalog nije aktivan ili ne postoji  <br> When korisnik pokuša prijavu  <br> Then sistem prikazuje grešku
| US-03 | Odjava korisnika iz sistema | Kao prijavljeni korisnik sistema, želim se sigurno odjaviti sa svog naloga, kako bih spriječio neovlašten pristup svom korisničkom računu nakon završetka rada. |Ovaj story je važan jer omogućava korisniku da na siguran način završi rad u sistemu i spriječi neovlašten pristup svom nalogu i podacima nakon završetka korištenja. Time se povećava sigurnost sistema, smanjuje rizik od zloupotrebe korisničkog računa i osigurava pravilno zatvaranje korisničke sesije, posebno kada se sistem koristi na dijeljenom ili javno dostupnom uređaju. | Srednji | Pretpostavlja se da kroisnik ima aktivnu sesiju u sistemu. Otvoreno pitanje je da li se nakon odjave korisnik vraća na početni ekran ili direktno na formu za prijavu. | Povezano je sa storyjem za prijavu korisnika u sistem i sa storyjem za upravljanje kroisničkim nalozima i pravima pristupa. | **AC_01 - Uspješna odjava**  <br> Given korisnik je prijavljen  <br> When se odjavi  <br> Then sesisaj se prekida  <br> **AC_02 - Zaštićene stranice**  <br> Given korisnik se odjavio  <br> When pokuša pristupiti zaštićenoj stranici  <br> Then pristup nije dozvoljen
| US-04 | Upravljanje korisničkim ulogama i pravima pristupa | Kao administrator, želim upravljati korisničkim ulogama i pravima pristupa, kako bi svaki korisnik imao pristup samo podacima i funkcionalnostima su relevantne za njegovu ulogu. | Ovaj story je važan jer omogućava da svaki korisnik pristupa samo onim podacima i funkcionalnostima koje su relevantne za njegovu ulogu, čime se povećava sigurnost sistema i smanjuje rizik od grešaka i neovlaštenih akcija. Jasno definisana prava pristupa istovremeno podržavaju bolju organizaciju rada, olakšavaju razgraničenje odgovornosti među korisnicima i čine sistem preglednijim i jednostavnijim za korištenje, uz manje kognitivno opterećenje. | Visok | Pretpostavlja se da su osnovne korisničke uloge sistema unaprijed definisane. Otvoreno pitanje je da li administrator može samo dodjeljivati postojeće uloge ili može kreirati i nove uloge i mijenjati njihova prava pristupa. | Povezano sa storyjima za registraciju korisnika, prijavu korisnika u sistem. | **AC_01 - Dodjela uloge**  <br> Given administrator dodjeljuje ulogu  <br> When potvrdi akciju  <br> Then uloga se dodjeljuje  <br> **AC_02 - Ograničen prstup**  <br> Given korisnik nema prava  <br> When pokuša pristup funkcionalnosti  <br> Then pristup nije dozvoljen  <br> **AC_03 - Izmjena uloge**  <br> Given administrator mijenja ulogu  <br> When potvrdi izmjenu  <br> Then uloga se ažurira
| US-05 | Prijava zahtjeva za servisnu intervenciju | Kao korisnik, želim prijaviti kvar ili zahtjev za servisnu intervenciju, kako bi obrada mog zahtjeva mogla biti evidentirana i pokrenuta kroz sistema. | Ovaj story je važan jer omogućava da se problem koji korisnik prijavljuje formalno evidentira u sistemu i pretvori u konkretan zahtjev koji se može dalje obrađivati, pratiti i rješavati. Time se uspostavlja jasan i kontrolisan početak procesa servisne intervencije, smanjuje oslanjanje na neformalne kanale komunikacije i stvara osnova za sve naredne korake, kao što su određivanje prioriteta, dodjela izvršioca, planiranje intervencije i praćenje statusa zahtjeva. | Visok | Pretpostavlja se da kroisnik ima pristup formi za prijavu zahtjeva, kao i da smao registrovani korisnik može podnijeti prijavu. | Povezano sa storyjima zapregled vlastitog zahtjeva, pregled statusa zahtjeva, pregled otvorenih intervencija i dalju obradu servisne intervencije. | **AC_01 - Uspješna prijava**  <br> Given korisnik unese podatke  <br> When pošalje podatke  <br> Then zahtjev se kreira  <br> **AC_02 - Nepotpuni podaci**  <br> Given podaci nisu potpuni  <br> When korisnik pošalje zahtjev  <br> Then sistem prikazuje grešku |
| US-06 | Pregled statusa vlastitog zahtjeva | Kao korisnik, želim pregledati status svog zahtjeva, kako bih imao jasan uvid u fazu obrade u kojoj se nalazi moj zahtjev. | Ovaj story je važan jer korisniku omogućava transparentan uvid u tok obrade njegovog zahtjeva, smanjuje potrebu za dodatnim provjerama i neformalnim upitima te povećava povjerenje da je zahtjev evidentiran i da se njegovo rješavanje odvija kroz jasan i kontrolisan proces. | Visok | Pretpostvalja se da korisnik ima pristup svom zahtjevu u sistemu. Otvoreno pitanje je da li korisnik vidi samo osnovne statuse ili i dodatne informacije poput planiranog termina i dodjele zahtjeva. | Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyem upravljanje statusom intervencije. | **AC_01 - Pregled statusa**  <br> Given korisnik ima zahtjev  <br> When pregleda status  <br> Then vidi tačan status  <br> **AC_02 - Samo vlastiti zahtjevi**  <br> Given korisnik je prijavljen  <br> When pregleda zahtjeve  <br> Then vidi samo svoje |
| US-07 | Pregled otvorenih intervencija | Kao dispečer, želim pregledati sve otvorene i aktivne intervencije, kako bih imao jasan uvid u azhtjeve koji čekaju obradu i u tok rada. | Ovaj story je važan jer dispečeru omogućava centralizovan pregled zahtjeva koji su u obradi, olakšava organizaciju rada i pravovremeno reagovanje na zastoje, promjene prioriteta i opterećenost resursa. Time se uspostavlja pregledniji, efikasniji i bolje kontrolisan operativni tok rada. | Visok | Pretpostavlja se da sistem razlikuje otvorene, aktivne i završene intervencije. Otvoreno pitanje je da li pregled uključuje samo listu intervencija ili i osnovne informacije poput prioriteta, statusa i dodijeljenog servisera. | Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyjima za pregled detalja pojedinačne intervencije, određivanje prioriteta, dodjelu servisera i upravljanje statusom intervencije. | **AC_01 - Prikaz intervencija**  <br> Given postoje intervencije  <br> When dispečer pregleda  <br> Then vidi listu  <br> **AC_02 - Ažuriranje liste**  <br> Given status se promijeni  <br> When se lista osvježi  <br> Then prikaz je ažuriran |
| US-08 | Pregled detalja pojedinačne intervencije | Kao ovlašteni korisnik (dispečer), želim pregledati detalje pojedinačne intervencije, kako bih imao potpune informacije o njenom trenutnom stanju, toku i zaduženjima. | Ovaj story je važan jer omogućava dispečeru da na jednom mjestu dobije sve ključne informacije o konkretnoj intervenciji, čime se olakšava praćenje njenog toka, donošenje operativnih odluka i koordinacija daljih aktivnosti. Time se smanjuje potreba za dodatnim provjerama i oslanjanjem na nepovezane izvore informacija, a proces upravljanja intervencijom postaje pregledniji, brži i pouzdaniji. | Visok | Pretpostavlja se da korisnik već ima pristup listi intervencija i da može otvoriti pojedinačnu intervenciju iz pregleda. Otvoreno pitanje je koje tačno informacije čine minimalni skup detalja koji su dostupni u ovom prikazu i da li se prikaz razlikuje prema korisničkoj ulozi. | Pretpostavlja se da korisnik već ima pristup listi intervencija i da može otvoriti pojedinačnu intervenciju iz pregleda. Otvoreno pitanje je koje tačno informacije čine minimalni skup detalja koji su dostupni u ovom prikazu i da li se prikaz razlikuje prema korisničkoj ulozi. | **AC_01 - Pregled detalja** <br> Given korisnik otvori intervenciju <br> When pregleda detalje <br> Then vidi informacije <br>  **AC_02 - Prava pristupa** <br> Given korisnik nema prava <br> When pokuša otvoriti detalje <br> Then pristup nije dozvoljen |
| US-09 | Dodjela intervencije odgovornom licu | Kao dispečer, želim dodijeliti intervenciju odgovornom licu(serviseru), kako bi bilo jasno ko preuzima izvršenje zadatka.  | Ovaj story je važan jer omogućava da svaka intervencija dobije jasno određenog izvršioca, čime se uspostavlja odgovornost za njeno preuzimanje i dalje izvršenje. Na taj način olakšava se organizacija operativnog toka rada, planiranje aktivnosti, praćenje statusa i pravovremena realizacija zadatka. | Visok | Pretpostavlja se da sistem raspolaže listom servisera kojima se intervencija može dodijeliti. Otvoreno pitanje je da li ova verzija podržava samo dodjelu jednom serviseru ili i timu servisera. | Zavisi od storyja za pregled otvorenih i aktivnih intervencija i pregled detalja pojedinačne intervencije, a povezan je sa storyjima za određivanje prioriteta, planiranje izlaska na teren i upravljanje statusom intervencije. | **AC_01 - Uspješna dodjela** <br> Given dispečer odabere servisera <br> When potvrdi dodjelu <br> Then intervencija se dodjeljuje <br> **AC_02 - Bez odabira servisera** <br> Given serviser nije odabran <br> When pokuša dodjelu <br> Then sistem prikazuje grešku |
| US-10 | Dodjela intervencije timu servisera | Kao dispečer, želim dodijeliti intervenciju timu servisera, kako bi se složeniji zadaci mogli izvršavati timski i organizovano. | Ovaj story je važan jer omogućava da se intervencije dodjeljuju timu servisera na organizovan i pregledan način, što olakšava koordinaciju rada i bolju raspodjelu raspoloživih resursa. Na taj način smanjuje se rizik od kašnjenja i neobrađenih zadataka, a izvršenje složenijih intervencija postaje efikasnije i pouzdanije. | Srednji | Pretpostavlja se da u sistemu postoje definisani timovi servisera kojima se intervencije mogu dodijeliti, a otvoreno je pitanje da li se dodjela vrši cijelom timu ili se unutar tima mora dodatno odrediti konkretan serviser koji će izvršiti intervenciju. | Zavisi od storyja za kreiranje intervencije i povezan je sa storyjima za pregled dodijeljenih intervencija i pregled detalja pojedinačne intervencije. | **AC_01 - Uspješna dodjela timu** <br> Given dispečer odabere tim <br> When potvrdi dodjelu <br> Then tim se dodjeljuje <br> **AC_02 - Bez odabira tima** <br> Given tim nije odabran <br> When pokuša dodjelu <br> Then sistem prikazuje grešku <br> **AC_03 - Prava pristupa** <br> Given korisnik nije ovlašten <br> When pokuša dodjelu <br> Then akcija nije dozvoljena 
| US-11 | Planiranje intervencije | Kao dispečer, želim planirati intervenciju unaprijed, kako bih mogao organizovati termin, resurse i izvršenje zadatka. | Ovaj story je važan jer omogućava pravovremeno i efikasno planiranje intervencija, što optimizira raspodjelu resursa, smanjuje rizik od kašnjenja ili preklapanja zadataka, poboljšava koordinaciju timova i doprinosi preglednijem i organizovanijem operativnom radu. | Visok | Pretpostavlja se da postoje podaci o resursima, timu i rokovima za intervencije. Ostaje otvoreno pitanje ko će planirati, samo dispečer ili će serviseri također biti uključeni u planiranje. | Zavisi od storyja za kreiranje intervencije i povezan je sa storyjima za dodjelu intervencije odgovornom licu ili timu i pregled statusa intervencija. | **AC_01 - Uspješno planiranje** <br> Given unesen validan termin <br> When korisnik potvrdi <br> Then termin se sprema <br> **AC_02 - Nepotpuni podaci** <br> Given podaci nisu uneseni <br> When korisnik planira <br> Then sistem prikazuje grešku <br> **AC_03 - Neispravan termin** <br> Given termin nije validan <br> When korisnik potvrdi <br> Then sistem prikazuje grešku <br> **AC_04 - Konflikt termina** <br> Given postoji drugi termin <br> When korisnik planira <br> Then sistem upozorava 
| US-12 | Određivanje prioriteta intervencije | Kao dispečer, želim odrediti prioritet intervencije, kako bi zahtjevi bili obrađeni i raspoređeni prema njihovoj hitnosti i važnosti | Ovaj story je važan jer omogućava da se intervencije ne obrađuju proizvoljno, nego u skladu sa njihovom stvarnom hitnošću i poslovnim značajem, čime se olakšava raspodjela resursa, smanjuje rizik da važni zahtjevi ostanu neobrađeni ili budu obrađeni prekasno, te se omogućava pregledniji i efikasniji operativni rad. | Visok |  Otvoreno pitanje je da li dispečer prioritet određuje potpuno ručno ili sistem pruža podršku kroz prijedlog prioriteta koji dispečer može potvrditi ili izmijeniti. | Zavisi od storyja za prijavu zahtjeva i pregled detalja pojedinačne intervencije, a povezan je sa storyjima za dodjelu intervencije i planiranje izlaska na teren. | **AC_01 - Postavljanje prioriteta** <br> Given dispečer odabere prioritet <br> When potvrdi <br> Then prioritet se sprema <br> **AC_02 - Ručna izmjena** <br> Given prioritet postoji <br> When ga dispečer promijeni <br> Then novi prioritet se sprema <br> **AC_03 - Prikaz prioriteta** <br> Given prioritet je postavljen <br> When se pregleda intervencija <br> Then prioritet je vidljiv <br> **AC_04 - Prava pristupa** <br> Given korisnik nije ovlašten <br> When pokuša promjenu <br> Then akcija nije dozvoljena | 
| US-13 | Pregled statusa intervencija od strane dispečera | Kao dispečer, želim pregledati statuse intervencija, kako bih mogao pratiti tok rada i imati jasan uvid u trenutnu fazu obrade svakog zahtjeva. | Ovaj story je važan jer dispečeru daje pregled nad trenutnim stanjem procesa i omogućava da na vrijeme uoči zastoje, preopterećenost ili potrebu za dodatnom intervencijom. Bez jasnog pregleda statusa, upravljanje većim brojem zahtjeva postaje otežano i oslanja se na dodatne provjere i neformalne kanale komunikacije. | Visok | Pretpostavlja se da sistem podržava definisane statuse intervencije i da su oni dosljedno povezani sa tokom rada. Otvoreno pitanje je da li dispečer u ovom prikazu vidi samo trenutni status intervencije ili i dodatne informacije poput prioriteta, dodijeljenog servisera i planiranog termina. | Zavisi od storyja za pregled otvorenih i aktivnih intervencija i povezan je sa storyjima za pregled detalja pojedinačne intervencije, određivanje prioriteta, dodjelu intervencije serviseru, planiranje izlaska na teren i ažuriranje statusa intervencije. | **AC_01 - Pregled statusa** <br> Given postoje intervencije <br> When dispečer pregleda <br> Then vidi statuse <br> **AC_02 - Ažuriranje prikaza** <br> Given status se promijeni <br> When se lista osvježi <br> Then prikaz je ažuriran <br> **AC_03 - Pristup detaljima** <br> Given dispečer klikne intervenciju <br> When otvori detalje <br> Then vidi dodatne informacije |
| US-14 | Ažuriranje statusa intervencije od strane servisera | Kao serviser želim po potrebi ažurirati status intervencije na kojoj radim, kako bi sistem odražavao trenutno stanje rada na terenu. | Ovaj story je važan jer omogućava da sistem prati stvarni tok izvršenja intervencije i da ostali korisnici imaju pravovremenu i tačnu informaciju o tome u kojoj se fazi rad nalazi. Time se smanjuje potreba za dodatnim provjerama, pozivima i neformalnom koordinacijom. | Visok | Pretpostavlja se da serviser može ažurirati status samo za intervencije koje su mu dodijeljene. Otvoreno pitanje je da li serviser može postavljati sve operativne statuse ili samo one koji odgovaraju njegovom dijelu toka rada. Također, otvoreno pitanje je da li nakon završetka rada status prelazi direktno u „završeno“ ili postoji dodatna potvrda dispečera prije konačnog zatvaranja. | Zavisi od storyja za pregled dodijeljenih intervencija i pregled detalja zadatka na terenu. Povezan je sa storyjima za pregled statusa intervencija od strane dispečera, pregled statusa vlastitog zahtjeva od strane klijenta, evidenciju izvršenog rada i potvrdu zatvaranja intervencije. |  |
| US-15 | Pregled dodijeljenih intervencija | Kao serviser, želim pregledati intervencije koje su mi dodijeljene, kako bih znao koje zadatke trebam izvršiti i kojim redoslijedom ih trebam obrađivati. | Ovaj story je jako bitan. Pomaže zaposlenima i nadređenima da u bilo kojem trenutku vide koje su zadatke dobili ili koji su zadaci dodijeljeni njihovom timu. To olakšava praćenje zadataka. Također poboljšava koordinaciju i planiranje rada. Smanjuje rizik da se zaborave ili dupliraju zadaci. Također pomaže da se stvari lakše kontroliraju i da sve bude efektivnije kada je u pitanju upravljanje servisnim procesima. | Visok | Pretpostavlja se da korisnik ima ulogu servisera ili tima servisera i da mu je dodijeljena barem jedna intervencija. Pretpostavlja se da su intervencije već kreirane i dodijeljene od strane dispečera. Otvoreno pitanje: Da li serviser vidi samo svoje dodijeljene intervencije ili i intervencije cijelog tima? Otvoreno pitanje: Da li sistem treba prikazivati i detalje prethodnih ili samo aktivne intervencije? | Zavisi od storyja za dodjelu intervencije odgovornom serviseru ili timu, i povezan je sa storyjem za pregled detalja pojedinačne intervencije.| |
| US-16 | Pregled detalja zadatka na terenu | Kao serviser, želim pregledati detalje zadataka na terenu, kako bih imao sve potrebne informacije za njegovo pravilno i efikasno izvršavanje. | Ovaj story je važan jer omogućava serviseru da na terenu ima sve ključne informacije o zadatku na jednom mjestu, čime se smanjuju greške, nedoumice i potreba za dodatnim provjerama. Time se olakšava priprema za intervenciju, poboljšava kvalitet izvršenja zadatka i doprinosi efikasnijem i preglednijem toku rada. | Visok | Pretpostavlja se da je intervencija već evidentirana u sistemu i dodijeljena konkretnom serviseru ili timu, te da su osnovni podaci o zadatku prethodno uneseni i dostupni za pregled. Otvoreno pitanje je koje informacije čine minimalni obavezni skup detalja koje serviser mora imati dostupne na terenu, kao i da li se prikaz detalja razlikuje u zavisnosti od tipa zadatka ili načina dodjele intervencije. | Zavisi od storyja za pregled intervencija koje su dodijeljene i povezan je sa storyjima za ažuriranje statusa intervencije od strane servisera i evidentiranje izvršenog rada. | | 
| US-17 | Evidentiranje izvršenog rada | Kao serviser, želim evidentirati izvršeni rad, kako bi sistem sadržavao tačan zapis o aktivnostima obavljenim tokom intervencije. | Ovaj story je važan jer omogućava da se izvršene aktivnosti evidentiraju tačno i pravovremeno, čime se osigurava jasan uvid u obavljeni rad, praćenje napretka i korištenje resursa. Na taj način smanjuje se rizik da važni detalji ostanu nedokumentovani, a proces rada postaje transparentniji, pregledniji i efikasniji. | Srednji | Pretpostavlja se da serviser može precizno zabilježiti sve aktivnosti tokom ili poslije  intervencije u sistem, a otvoreno je pitanje koje informacije je obavezno unijeti prilikom evidencije (npr. opis rada, vrijeme trajanja, korišteni materijali). | Zavisi od storyja za pregled detalja zadatka na terenu i povezan je sa storyjima za ažuriranje statusa intervencije od strane servisera. | | 
| US-18 | Kreiranje novog korisničkog naloga | Kao administrator, želim kreirati novi korisnički nalog, kako bih omogućio korisniku pristup sistemu u skladu sa njegovom ulogom. | Ovaj story je važan jer omogućava uključivanje novih korisnika u sistem i predstavlja osnovu za korištenje svih ostalih funkcionalnosti. Bez kreiranja korisničkog naloga nije moguće dodijeliti odgovornosti niti omogućiti pristup sistemu. | Visok | Pretpostavlja se da administrator ima pravo kreiranja novih korisničkih naloga. Otvoreno pitanje je da li se korisnička uloga dodjeljuje odmah prilikom kreiranja naloga ili u posebnom koraku nakon toga. | Povezano sa storyjima za pregled korisničkih naloga i promjenu korisničke uloge. | **AC_01 - Uspješno kreiranje naloga**<br>Given administrator unese sve obavezne i ispravne podatke<br>When potvrdi kreiranje korisničkog naloga<br>Then sistem kreira novi korisnički nalog<br><br>**AC_02 - Nepotpuni podaci**<br>Given administrator nije unio sve obavezne podatke<br>When pokuša kreirati korisnički nalog<br>Then sistem ne kreira nalog i prikazuje poruku o grešci<br><br>**AC_03 - Dupliranje korisničkog naloga**<br>Given u sistemu već postoji korisnik sa istim jedinstvenim identifikatorom<br>When administrator pokuša kreirati novi nalog<br>Then sistem ne kreira nalog i prikazuje odgovarajuću poruku<br><br>**AC_04 - Ograničenje pristupa**<br>Given korisnik nije administrator<br>When pokuša pristupiti funkcionalnosti kreiranja naloga<br>Then sistem mu ne dozvoljava pristup. | 
| US-19 | Pregled postojećih korisničkih naloga | Kao administrator, želim pregledati postojeće korisničke naloge, kako bih imao uvid u korisnike sistema i mogao njima upravljati. | Ovaj story je važan jer administratoru omogućava pregled svih korisnika sistema, njihovih uloga i statusa naloga, što predstavlja osnovu za organizovano upravljanje pristupom i odgovornostima u sistemu. | Visok | Pretpostavlja se da korisnički nalozi već postoje u sistemu. Otvoreno pitanje je da li pregled treba prikazivati samo aktivne korisnike ili i deaktivirane naloge. | Zavisi od storyja za kreiranje korisničkog naloga i povezan je sa storyjima za promjenu korisničke uloge i deaktivaciju korisničkog naloga. | **AC_01 - Prikaz liste korisničkih naloga**<br>Given u sistemu postoje korisnički nalozi<br>When administrator pristupi pregledu korisnika<br>Then sistem prikazuje listu korisničkih naloga<br><br>**AC_02 - Prikaz osnovnih podataka o korisniku**<br>Given administrator pregleda listu korisničkih naloga<br>When sistem prikaže korisnike<br>Then za svakog korisnika prikazuje osnovne informacije, uključujući ime, ulogu i status naloga<br><br>**AC_03 - Prikaz praznog stanja**<br>Given u sistemu nema korisničkih naloga<br>When administrator pristupi pregledu korisnika<br>Then sistem prikazuje odgovarajuću poruku da nema dostupnih korisnika<br><br>**AC_04 - Ograničenje pristupa**<br>Given korisnik nije administrator<br>When pokuša pristupiti pregledu korisničkih naloga<br>Then sistem mu ne dozvoljava pristup. |
| US-20 | Promjena korisničke uloge | Kao administrator, želim promijeniti korisničku ulogu, kako bi korisnik imao pristup funkcionalnostima koje odgovaraju njegovoj odgovornosti u sistemu. | Ovaj story je važan jer omogućava da se prava pristupa i odgovornosti korisnika usklade sa njihovom stvarnom ulogom u poslovnom procesu. Time se povećava sigurnost sistema, smanjuje rizik od pogrešnih akcija i podržava jasna organizacija rada. | Visok | Pretpostavlja se da su korisničke uloge unaprijed definisane u sistemu. Otvoreno pitanje je da li se promjena uloge primjenjuje odmah ili tek nakon naredne prijave korisnika. | Zavisi od storyja za pregled korisničkih naloga i povezan je sa storyjem za upravljanje korisničkim pravima pristupa. | **AC_01 - Uspješna promjena korisničke uloge**<br>Given administrator odabere postojećeg korisnika i novu ulogu<br>When potvrdi promjenu<br>Then sistem evidentira novu korisničku ulogu<br><br>**AC_02 - Prikaz ažurirane uloge**<br>Given korisnička uloga je uspješno promijenjena<br>When administrator pregleda korisnički nalog<br>Then sistem prikazuje novu ulogu korisnika<br><br>**AC_03 - Nevažeća promjena uloge**<br>Given administrator nije odabrao novu ulogu<br>When pokuša potvrditi izmjenu<br>Then sistem ne sprema promjenu i prikazuje poruku o grešci<br><br>**AC_04 - Ograničenje pristupa**<br>Given korisnik nije administrator<br>When pokuša promijeniti korisničku ulogu<br>Then sistem mu ne dozvoljava pristup toj funkcionalnosti. | 
| US-21 | Deaktivacija korisničkog naloga | Kao administrator, želim deaktivirati korisnički nalog, kako bih spriječio dalji pristup korisniku koji više ne treba koristiti sistem. | Ovaj story je važan jer omogućava administratoru da onemogući pristup korisnicima koji više ne trebaju koristiti sistem, bez gubitka historijskih podataka i veza koje su vezane za njihov raniji rad. Time se povećava sigurnost sistema i čuva integritet evidencije. | Visok | Pretpostavlja se da korisnički nalog već postoji u sistemu. Otvoreno pitanje je da li deaktivirani korisnik ostaje vidljiv u listi korisnika i da li sistem prikazuje njegov status kao neaktivan. | Zavisi od storyja za pregled korisničkih naloga i povezan je sa storyjem za prijavu korisnika u sistem. | **AC_01 - Uspješna deaktivacija naloga**<br>Given administrator odabere aktivan korisnički nalog<br>When potvrdi deaktivaciju<br>Then sistem mijenja status naloga u neaktivan<br><br>**AC_02 - Onemogućen pristup deaktiviranom korisniku**<br>Given korisnički nalog je deaktiviran<br>When korisnik pokuša prijavu u sistem<br>Then sistem mu ne dozvoljava pristup<br><br>**AC_03 - Prikaz statusa neaktivnog naloga**<br>Given korisnički nalog je deaktiviran<br>When administrator pregleda korisnike<br>Then sistem prikazuje da je nalog neaktivan<br><br>**AC_04 - Ograničenje pristupa funkcionalnosti deaktivacije**<br>Given korisnik nije administrator<br>When pokuša deaktivirati korisnički nalog<br>Then sistem mu ne dozvoljava pristup toj funkcionalnosti. |
| US-22 | Pregled osnovnih informacija o vlastitom zahtjevu | Kao klijent, želim pregledati osnovne informacije o svom zahtjevu, kako bih imao uvid u ono što je prijavljeno i šta se trenutno obrađuje. | Ovaj story je važan jer klijentu omogućava da, pored statusa, vidi i osnovne informacije o svom zahtjevu, čime se povećava preglednost i povjerenje u proces obrade zahtjeva. | Visok | Pretpostavlja se da je zahtjev prethodno evidentiran u sistemu. Otvoreno pitanje je koji skup informacija će biti minimalno dostupan klijentu, npr. opis problema, lokacija, datum prijave i trenutni status. | Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyjem za pregled statusa vlastitog zahtjeva. |  |
| US-23 | Prihvatanje dodijeljenog zadatka | Kao serviser, želim prihvatiti dodijeljeni zadatak, kako bih potvrdio da preuzimam na sebe odgovornost za njegovu realizaciju. | Ovaj story je važan jer omogućava da sistem evidentira da je serviser svjesno preuzeo odgovornost za izvršenje zadatka, što olakšava koordinaciju rada i praćenje toka intervencije. | Visok | Pretpostavlja se da je zadatak prethodno dodijeljen serviseru. Otvoreno pitanje je da li prihvatanje zadatka automatski mijenja status intervencije u novu fazu procesa. | Zavisi od storyja za dodjelu intervencije odgovornom licu i povezan je sa storyjem za ažuriranje statusa intervencije od strane servisera. |  |
| US-24 | Odbijanje dodijeljenog zadatka | Kao serviser, želim odbiti dodijeljeni zadatak, kako bi dispečer mogao pravovremeno reagovati i dodijeliti ga drugom izvršiocu. | Ovaj story je važan jer omogućava da sistem evidentira da zadatak ne može biti preuzet, čime se izbjegava zastoj u procesu i omogućava pravovremena reakcija dispečera. | Visok | Pretpostavlja se da je zadatak prethodno dodijeljen serviseru. Otvoreno pitanje je da li serviser mora unijeti razlog odbijanja zadatka. | Zavisi od storyja za dodjelu intervencije odgovornom licu i povezan je sa storyjem za pregled dodijeljenih intervencija. |  |
| US-25 | Pregled evidentiranog izvršenog rada | Kao dispečer, želim pregledati evidentirani izvršeni rad, kako bih imao uvid u ono što je serviser uradio prije zatvaranja intervencije. | Ovaj story je važan jer omogućava dispečeru da pregleda dokaz o obavljenom radu prije donošenja odluke o zatvaranju intervencije, čime se povećava kontrola procesa i pouzdanost završetka zadatka. | Visok | Pretpostavlja se da je serviser prethodno evidentirao izvršeni rad u sistemu. Otvoreno pitanje je koji skup informacija dispečer mora minimalno vidjeti prije zatvaranja intervencije. | Zavisi od storyja za evidentiranje izvršenog rada i povezan je sa storyjem za potvrdu i zatvaranje intervencije. |  |
| US-26 | Potvrda i zatvaranje intervencije | Kao dispečer, želim potvrditi i zatvoriti završenu intervenciju, kako bi proces bio formalno okončan u sistemu. | Ovaj story je važan jer omogućava da se intervencija zvanično završi tek nakon pregleda izvršenog rada, čime se osigurava kontrolisan i pouzdan završetak procesa. | Visok | Pretpostavlja se da je serviser prethodno ažurirao status i evidentirao izvršeni rad. Otvoreno pitanje je da li zatvaranje automatski mijenja status u završeno ili postoji poseban završni status zatvoreno. | Zavisi od storyja za ažuriranje statusa intervencije od strane servisera i storyja za pregled evidentiranog izvršenog rada. |  |
|
Legenda

Prijedlog za reformatiranje sadržaja: 

# User Stories

---

## US-01 — Samostalna registracija korisnika usluge

**Opis:**  
Kao korisnik usluge, želim samostalno kreirati korisnički nalog, kako bih mogao prijaviti kvar i pratiti obradu svog zahtjeva.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava korisniku usluge da samostalno pristupi sistemu i koristi osnovne funkcionalnosti namijenjene klijentu, bez potrebe za posrednim unosom od strane administratora.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da korisnik usluge može samostalno pristupiti registracionoj formi. Otvoreno pitanje je da li sistem korisniku automatski dodjeljuje ulogu klijenta pri registraciji.

**Veze sa drugim storyjima:**  
Povezano sa storyjem za prijavu korisnika u sistem, prijavu zahtjeva za servisnu intervenciju i pregled vlastitog zahtjeva.

**Acceptance Criteria:**

- **AC1: Uspješna registracija**  
  - korisnik unese validne podatke  
  - klikne na registraciju  
  - sistem kreira korisnički nalog

- **AC2: Nepotpuni podaci**  
  - korisnik ne unese sve obavezne podatke  
  - pokuša registraciju  
  - sistem prikazuje grešku

- **AC3: Neispravan format**  
  - korisnik unese neispravan format podataka  
  - pokuša registraciju  
  - sistem prikazuje validacijsku grešku

- **AC4: Postojeći korisnik**  
  - korisnik već postoji u sistemu  
  - pokuša registraciju  
  - sistem prikazuje grešku

- **AC5: Lozinka ne zadovoljava pravila**  
  - lozinka ne ispunjava uslove  
  - korisnik pokuša registraciju  
  - sistem prikazuje grešku

---

## US-02 — Prijava korisnika u sistem

**Opis:**  
Kao registrovani korisnik, želim se prijaviti u sistem, kako bih mogao pristupiti funkcionalnostima koje su mi dostupne.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava registrovanim korisnicima pristup sistemu i predstavlja osnovu za korištenje svih ostalih funkcionalnosti u skladu sa njihovom ulogom.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da korisnik već ima kreiran i aktivan korisnički nalog. Otvoreno pitanje je da li se nakon uspješne prijave korisnik preusmjerava na početni ekran prilagođen njegovoj ulozi.

**Veze sa drugim storyjima:**  
Zavisi od storyja za registraciju korisnika i povezan je sa svim storyjima koji zahtijevaju autentifikovan pristup sistemu.

**Acceptance Criteria:**

- **AC1: Uspješna prijava**  
  - korisnik unese tačne podatke  
  - prijavi se  
  - sistem omogućava pristup

- **AC2: Nepotpuni podaci**  
  - podaci nisu uneseni  
  - korisnik pokušava prijavu  
  - sistem prikazuje grešku

- **AC3: Neispravan format**  
  - podaci nisu u ispravnom formatu  
  - korisnik pokuša prijavu  
  - sistem prikazuje grešku

- **AC4: Pogrešni podaci**  
  - podaci nisu tačni  
  - korisnik pokuša prijavu  
  - pristup nije dozvoljen

- **AC5: Neaktivan ili nepostojeći nalog**  
  - nalog nije aktivan ili ne postoji  
  - korisnik pokuša prijavu  
  - sistem prikazuje grešku

---

## US-03 — Odjava korisnika iz sistema

**Opis:**  
Kao prijavljeni korisnik sistema, želim se sigurno odjaviti sa svog naloga, kako bih spriječio neovlašten pristup svom korisničkom računu nakon završetka rada.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava korisniku da na siguran način završi rad u sistemu i spriječi neovlašten pristup svom nalogu i podacima nakon završetka korištenja.

**Prioritet:**  
*Srednji*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da korisnik ima aktivnu sesiju u sistemu. Otvoreno pitanje je da li se nakon odjave korisnik vraća na početni ekran ili direktno na formu za prijavu.

**Veze sa drugim storyjima:**  
Povezano sa storyjem za prijavu korisnika u sistem.

**Acceptance Criteria:**

- **AC1: Uspješna odjava**  
  - korisnik je prijavljen  
  - odjavi se  
  - sesija se prekida

- **AC2: Zaštićene stranice**  
  - korisnik se odjavio  
  - pokuša pristupiti zaštićenoj stranici  
  - pristup nije dozvoljen

---

## US-04 — Kontrola pristupa prema korisničkoj ulozi

**Opis:**  
Kao administrator, želim da sistem ograniči pristup podacima i funkcionalnostima prema korisničkoj ulozi, kako bi svaki korisnik mogao koristiti samo ono što je relevantno za njegovu odgovornost.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava sigurnu i preglednu kontrolu pristupa sistemu, smanjuje rizik od grešaka i neovlaštenih akcija te podržava jasno razgraničenje odgovornosti među korisnicima.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da su osnovne korisničke uloge sistema unaprijed definisane. Otvoreno pitanje je da li će sistem koristiti fiksno definisane uloge ili se kasnije podržava proširivanje modela prava pristupa.

**Veze sa drugim storyjima:**  
Povezano sa storyjima za prijavu korisnika u sistem, administrativno kreiranje korisničkih naloga i promjenu korisničke uloge.

**Acceptance Criteria:**

- **AC1: Dodjela uloge**  
  - administrator dodjeljuje ulogu  
  - potvrdi akciju  
  - uloga se dodjeljuje

- **AC2: Ograničen pristup**  
  - korisnik nema prava  
  - pokuša pristup funkcionalnosti  
  - pristup nije dozvoljen

- **AC3: Izmjena uloge**  
  - administrator mijenja ulogu  
  - potvrdi izmjenu  
  - uloga se ažurira

---

## US-05 — Prijava zahtjeva za servisnu intervenciju

**Opis:**  
Kao korisnik usluge, želim prijaviti kvar ili zahtjev za servisnu intervenciju, kako bi obrada mog zahtjeva mogla biti evidentirana i pokrenuta kroz sistem.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se problem koji korisnik prijavljuje formalno evidentira u sistemu i pretvori u konkretan zahtjev koji se može dalje obrađivati, pratiti i rješavati.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da registrovani korisnik usluge ima pristup formi za prijavu zahtjeva. Otvoreno pitanje je koji je minimalni skup obaveznih podataka potreban za validnu prijavu.

**Veze sa drugim storyjima:**  
Povezano sa storyjima za pregled vlastitog zahtjeva, pregled otvorenih intervencija i dalju obradu servisne intervencije.

**Acceptance Criteria:**

- **AC1: Uspješna prijava**  
  - korisnik unese podatke  
  - pošalje podatke  
  - zahtjev se kreira

- **AC2: Nepotpuni podaci**  
  - podaci nisu potpuni  
  - korisnik pošalje zahtjev  
  - sistem prikazuje grešku

---

## US-06 — Pregled vlastitog zahtjeva

**Opis:**  
Kao korisnik usluge, želim pregledati osnovne informacije i status svog zahtjeva, kako bih imao jasan uvid u ono što je prijavljeno i u fazu obrade u kojoj se zahtjev nalazi.

**Poslovna vrijednost:**  
Ovaj story je važan jer korisniku omogućava da na jednom mjestu vidi šta je prijavio i u kojoj se fazi obrade njegov zahtjev nalazi, čime se povećava preglednost, smanjuje potreba za dodatnim provjerama i povećava povjerenje u proces rješavanja problema.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da korisnik ima evidentiran zahtjev u sistemu. Otvoreno pitanje je koji skup informacija će biti minimalno dostupan korisniku, npr. opis problema, lokacija, datum prijave, trenutni status i eventualni planirani termin.

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyjem za ažuriranje statusa intervencije.

**Acceptance Criteria:**

- **AC1: Pregled statusa**  
  - korisnik ima zahtjev  
  - pregleda status  
  - vidi tačan status

- **AC2: Samo vlastiti zahtjevi**  
  - korisnik je prijavljen  
  - pregleda zahtjeve  
  - vidi samo svoje

---

## US-07 — Pregled otvorenih intervencija

**Opis:**  
Kao dispečer, želim pregledati sve otvorene i aktivne intervencije, kako bih imao jasan uvid u zahtjeve koji čekaju obradu i u tok rada.

**Poslovna vrijednost:**  
Ovaj story je važan jer dispečeru omogućava centralizovan pregled zahtjeva koji su u obradi, olakšava organizaciju rada i pravovremeno reagovanje na zastoje, promjene prioriteta i opterećenost resursa.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da sistem razlikuje otvorene, aktivne i završene intervencije. Otvoreno pitanje je da li pregled uključuje samo listu intervencija ili i osnovne informacije poput prioriteta, statusa i dodijeljenog servisera.

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva i povezan je sa storyjima za pregled detalja pojedinačne intervencije, određivanje prioriteta, dodjelu servisera i pregled statusa intervencija.

**Acceptance Criteria:**

- **AC1: Prikaz intervencija**  
  - postoje intervencije  
  - dispečer pregleda  
  - vidi listu

- **AC2: Ažuriranje liste**  
  - status se promijeni  
  - lista se osvježi  
  - prikaz je ažuriran

---

## US-08 — Pregled detalja pojedinačne intervencije

**Opis:**  
Kao dispečer, želim pregledati detalje pojedinačne intervencije, kako bih imao potpune informacije o njenom trenutnom stanju, toku i zaduženjima.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava dispečeru da na jednom mjestu dobije sve ključne informacije o konkretnoj intervenciji, što olakšava praćenje toka rada, donošenje operativnih odluka i koordinaciju daljih aktivnosti.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da dispečer već ima pristup listi intervencija i da može otvoriti pojedinačnu intervenciju iz pregleda. Otvoreno pitanje je koje informacije čine minimalni skup detalja u ovom prikazu.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled otvorenih intervencija i povezan je sa storyjima za određivanje prioriteta, dodjelu izvršioca, planiranje intervencije i pregled statusa intervencija.

**Acceptance Criteria:**

- **AC1: Pregled detalja**  
  - korisnik otvori intervenciju  
  - pregleda detalje  
  - vidi informacije

- **AC2: Prava pristupa**  
  - korisnik nema prava  
  - pokuša otvoriti detalje  
  - pristup nije dozvoljen

---

## US-09 — Dodjela intervencije odgovornom serviseru

**Opis:**  
Kao dispečer, želim dodijeliti intervenciju odgovornom serviseru, kako bi bilo jasno ko preuzima izvršenje zadatka.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da svaka intervencija dobije jasno određenog izvršioca, čime se uspostavlja odgovornost za njeno preuzimanje i dalje izvršenje.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da sistem raspolaže listom servisera kojima se intervencija može dodijeliti. Otvoreno pitanje je da li ova verzija podržava samo dodjelu jednom serviseru.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled otvorenih intervencija i pregled detalja pojedinačne intervencije, a povezan je sa storyjima za planiranje intervencije i ažuriranje statusa intervencije.

**Acceptance Criteria:**

- **AC1: Uspješna dodjela**  
  - dispečer odabere servisera  
  - potvrdi dodjelu  
  - intervencija se dodjeljuje

- **AC2: Bez odabira servisera**  
  - serviser nije odabran  
  - pokuša dodjelu  
  - sistem prikazuje grešku

---

## US-10 — Dodjela intervencije timu servisera

**Opis:**  
Kao dispečer, želim dodijeliti intervenciju timu servisera, kako bi se složeniji zadaci mogli izvršavati timski i organizovano.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se složenije intervencije rasporede timu servisera na organizovan način, što olakšava koordinaciju rada i raspodjelu resursa.

**Prioritet:**  
*Srednji*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da u sistemu postoje definisani timovi servisera kojima se intervencije mogu dodijeliti. Otvoreno pitanje je da li se unutar tima dodatno određuje glavni izvršilac.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled detalja pojedinačne intervencije i povezan je sa storyjima za pregled dodijeljenih intervencija i planiranje intervencije.

**Acceptance Criteria:**

- **AC1: Uspješna dodjela timu**  
  - dispečer odabere tim  
  - potvrdi dodjelu  
  - tim se dodjeljuje

- **AC2: Bez odabira tima**  
  - tim nije odabran  
  - pokuša dodjelu  
  - sistem prikazuje grešku

- **AC3: Prava pristupa**  
  - korisnik nije ovlašten  
  - pokuša dodjelu  
  - akcija nije dozvoljena

---

## US-11 — Planiranje intervencije

**Opis:**  
Kao dispečer, želim planirati intervenciju unaprijed, kako bih mogao organizovati termin, resurse i izvršenje zadatka.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava pravovremeno i efikasno planiranje intervencija, smanjuje rizik od kašnjenja i preklapanja zadataka te poboljšava organizaciju operativnog rada.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da postoje podaci o resursima, timu i raspoloživim terminima. Otvoreno pitanje je da li u planiranju učestvuju i drugi korisnici osim dispečera.

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije izvršiocu i povezan je sa storyjima za pregled statusa intervencija i pregled detalja pojedinačne intervencije.

**Acceptance Criteria:**

- **AC1: Uspješno planiranje**  
  - unesen validan termin  
  - korisnik potvrdi  
  - termin se sprema

- **AC2: Nepotpuni podaci**  
  - podaci nisu uneseni  
  - korisnik planira  
  - sistem prikazuje grešku

- **AC3: Neispravan termin**  
  - termin nije validan  
  - korisnik potvrdi  
  - sistem prikazuje grešku

- **AC4: Konflikt termina**  
  - postoji drugi termin  
  - korisnik planira  
  - sistem upozorava

---

## US-12 — Određivanje prioriteta intervencije

**Opis:**  
Kao dispečer, želim odrediti prioritet intervencije, kako bi zahtjevi bili obrađeni i raspoređeni prema njihovoj hitnosti i važnosti.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se intervencije ne obrađuju proizvoljno, nego u skladu sa njihovom stvarnom hitnošću i poslovnim značajem.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Otvoreno pitanje je da li dispečer prioritet određuje ručno ili sistem daje prijedlog koji dispečer potvrđuje ili mijenja.

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva i pregled detalja pojedinačne intervencije, a povezan je sa storyjima za dodjelu intervencije i planiranje intervencije.

**Acceptance Criteria:**

- **AC1: Postavljanje prioriteta**  
  - dispečer odabere prioritet  
  - potvrdi  
  - prioritet se sprema

- **AC2: Ručna izmjena**  
  - prioritet postoji  
  - dispečer ga promijeni  
  - novi prioritet se sprema

- **AC3: Prikaz prioriteta**  
  - prioritet je postavljen  
  - pregleda se intervencija  
  - prioritet je vidljiv

- **AC4: Prava pristupa**  
  - korisnik nije ovlašten  
  - pokuša promjenu  
  - akcija nije dozvoljena

---

## US-13 — Pregled statusa intervencija od strane dispečera

**Opis:**  
Kao dispečer, želim pregledati statuse intervencija, kako bih mogao pratiti tok rada i imati jasan uvid u trenutnu fazu obrade svakog zahtjeva.

**Poslovna vrijednost:**  
Ovaj story je važan jer dispečeru daje pregled nad trenutnim stanjem procesa i omogućava da na vrijeme uoči zastoje, preopterećenost ili potrebu za dodatnom intervencijom.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da sistem podržava definisane statuse intervencije. Otvoreno pitanje je da li dispečer vidi samo trenutni status ili i dodatne informacije poput prioriteta, izvršioca i termina.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled otvorenih intervencija i povezan je sa storyjima za pregled detalja pojedinačne intervencije, određivanje prioriteta, dodjelu izvršioca, planiranje i ažuriranje statusa.

**Acceptance Criteria:**

- **AC1: Pregled statusa**  
  - postoje intervencije  
  - dispečer pregleda  
  - vidi statuse

- **AC2: Ažuriranje prikaza**  
  - status se promijeni  
  - lista se osvježi  
  - prikaz je ažuriran

- **AC3: Pristup detaljima**  
  - dispečer klikne intervenciju  
  - otvori detalje  
  - vidi dodatne informacije

---

## US-14 — Ažuriranje statusa intervencije od strane servisera

**Opis:**  
Kao serviser, želim po potrebi ažurirati status intervencije na kojoj radim, kako bi sistem odražavao trenutno stanje rada na terenu.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da sistem prati stvarni tok izvršenja intervencije i da ostali korisnici imaju pravovremenu i tačnu informaciju o tome u kojoj se fazi rad nalazi.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da serviser može ažurirati status samo za intervencije koje su mu dodijeljene. Otvoreno pitanje je koje operativne statuse serviser može postavljati.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled dodijeljenih intervencija i pregled detalja zadatka na terenu. Povezan je sa storyjima za pregled statusa intervencija od strane dispečera, pregled vlastitog zahtjeva i evidentiranje izvršenog rada.

**Acceptance Criteria:**  

---

## US-15 — Pregled dodijeljenih intervencija

**Opis:**  
Kao serviser, želim pregledati intervencije koje su mi dodijeljene, kako bih znao koje zadatke trebam izvršiti i kojim redoslijedom ih trebam obrađivati.

**Poslovna vrijednost:**  
Ovaj story je važan jer serviseru daje pregled njegovih zadataka, olakšava organizaciju rada i smanjuje rizik da neka intervencija bude zaboravljena ili obrađena van prioriteta.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da su intervencije već kreirane i dodijeljene od strane dispečera. Otvoreno pitanje je da li serviser vidi samo svoje zadatke ili i zadatke cijelog tima.

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije odgovornom serviseru ili timu i povezan je sa storyjem za pregled detalja zadatka na terenu.

**Acceptance Criteria:**  

---

## US-16 — Pregled detalja zadatka na terenu

**Opis:**  
Kao serviser, želim pregledati detalje zadatka na terenu, kako bih imao sve potrebne informacije za njegovo pravilno i efikasno izvršavanje.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava serviseru da na terenu ima sve ključne informacije o zadatku na jednom mjestu, čime se smanjuju greške, nedoumice i potreba za dodatnim provjerama.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da je intervencija već evidentirana i dodijeljena serviseru ili timu. Otvoreno pitanje je koje informacije čine minimalni obavezni skup detalja koje serviser mora imati dostupne na terenu.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled dodijeljenih intervencija i povezan je sa storyjima za ažuriranje statusa intervencije i evidentiranje izvršenog rada.

**Acceptance Criteria:**  

---

## US-17 — Evidentiranje izvršenog rada

**Opis:**  
Kao serviser, želim evidentirati izvršeni rad, kako bi sistem sadržavao tačan zapis o aktivnostima obavljenim tokom intervencije.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se izvršene aktivnosti evidentiraju tačno i pravovremeno, čime se osigurava jasan uvid u obavljeni rad, praćenje napretka i korištenje resursa.

**Prioritet:**  
*Srednji*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da serviser može evidentirati aktivnosti tokom ili nakon intervencije. Otvoreno pitanje je koje informacije su obavezne prilikom evidencije.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled detalja zadatka na terenu i povezan je sa storyjima za ažuriranje statusa intervencije i pregled evidentiranog izvršenog rada.

**Acceptance Criteria:**  

---

## US-18 — Administrativno kreiranje internog korisničkog naloga

**Opis:**  
Kao administrator, želim kreirati korisnički nalog za internog korisnika sistema, kako bih mu omogućio pristup sistemu u skladu sa njegovom ulogom.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava uključivanje internih korisnika u sistem i predstavlja osnovu za organizovan rad servisera, dispečera i drugih internih aktera.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da administrator ima pravo kreiranja internih korisničkih naloga. Otvoreno pitanje je da li se korisnička uloga dodjeljuje odmah prilikom kreiranja naloga ili u posebnom koraku nakon toga.

**Veze sa drugim storyjima:**  
Povezano sa storyjima za pregled korisničkih naloga i promjenu korisničke uloge.

**Acceptance Criteria:**

- **AC1: Uspješno kreiranje internog naloga**  
  - **GIVEN** administrator unese sve obavezne i ispravne podatke  
  - **WHEN** potvrdi kreiranje korisničkog naloga  
  - **THEN** sistem kreira novi interni korisnički nalog.

- **AC2: Nepotpuni podaci**  
  - **GIVEN** administrator nije unio sve obavezne podatke  
  - **WHEN** pokuša kreirati korisnički nalog  
  - **THEN** sistem ne kreira nalog i prikazuje poruku o grešci.

- **AC3: Dupliranje korisničkog naloga**  
  - **GIVEN** da u sistemu već postoji korisnik sa istim jedinstvenim identifikatorom  
  - **WHEN** administrator pokuša kreirati novi nalog  
  - **THEN** sistem ne kreira nalog i prikazuje odgovarajuću poruku.

- **AC4: Ograničenje pristupa**  
  - **GIVEN** korisnik nije administrator  
  - **WHEN** pokuša pristupiti funkcionalnosti kreiranja naloga  
  - **THEN** sistem mu ne dozvoljava pristup.

---

## US-19 — Pregled postojećih korisničkih naloga

**Opis:**  
Kao administrator, želim pregledati postojeće korisničke naloge, kako bih imao uvid u korisnike sistema i mogao njima upravljati.

**Poslovna vrijednost:**  
Ovaj story je važan jer administratoru omogućava pregled svih korisnika sistema, njihovih uloga i statusa naloga, što predstavlja osnovu za organizovano upravljanje pristupom i odgovornostima u sistemu.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da korisnički nalozi već postoje u sistemu. Otvoreno pitanje je da li pregled treba prikazivati samo aktivne korisnike ili i deaktivirane naloge.

**Veze sa drugim storyjima:**  
Zavisi od storyja za administrativno kreiranje korisničkog naloga i povezan je sa storyjima za promjenu korisničke uloge i deaktivaciju korisničkog naloga.

**Acceptance Criteria:**

- **AC1: Prikaz liste korisničkih naloga**  
  - **GIVEN** u sistemu postoje korisnički nalozi  
  - **WHEN** administrator pristupi pregledu korisnika  
  - **THEN** sistem prikazuje listu korisničkih naloga.

- **AC2: Prikaz osnovnih podataka o korisniku**  
  - **GIVEN** administrator pregleda listu korisničkih naloga  
  - **WHEN** sistem prikaže korisnike  
  - **THEN** za svakog korisnika prikazuje osnovne informacije, uključujući ime, ulogu i status naloga.

- **AC3: Prikaz praznog stanja**  
  - **GIVEN** u sistemu nema korisničkih naloga  
  - **WHEN** administrator pristupi pregledu korisnika  
  - **THEN** sistem prikazuje odgovarajuću poruku da nema dostupnih korisnika.

- **AC4: Ograničenje pristupa**  
  - **GIVEN** korisnik nije administrator  
  - **WHEN** pokuša pristupiti pregledu korisničkih naloga  
  - **THEN** sistem mu ne dozvoljava pristup.

---

## US-20 — Promjena korisničke uloge

**Opis:**  
Kao administrator, želim promijeniti korisničku ulogu, kako bi korisnik imao pristup funkcionalnostima koje odgovaraju njegovoj novoj odgovornosti u sistemu.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se prava pristupa i odgovornosti korisnika usklade sa njihovom stvarnom ulogom u poslovnom procesu, čime se povećava sigurnost sistema i podržava jasna organizacija rada.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da su korisničke uloge unaprijed definisane u sistemu. Otvoreno pitanje je da li se promjena uloge primjenjuje odmah ili tek nakon naredne prijave korisnika.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled korisničkih naloga i povezan je sa storyjem za kontrolu pristupa prema korisničkoj ulozi.

**Acceptance Criteria:**

- **AC1: Uspješna promjena korisničke uloge**  
  - **GIVEN** administrator odabere postojećeg korisnika i novu ulogu  
  - **WHEN** potvrdi promjenu  
  - **THEN** sistem evidentira novu korisničku ulogu.

- **AC2: Prikaz ažurirane uloge**  
  - **GIVEN** korisnička uloga je uspješno promijenjena  
  - **WHEN** administrator pregleda korisnički nalog  
  - **THEN** sistem prikazuje novu ulogu korisnika.

- **AC3: Nevažeća promjena uloge**  
  - **GIVEN** administrator nije odabrao novu ulogu  
  - **WHEN** pokuša potvrditi izmjenu  
  - **THEN** sistem ne sprema promjenu i prikazuje poruku o grešci.

- **AC4: Ograničenje pristupa**  
  - **GIVEN** korisnik nije administrator  
  - **WHEN** pokuša promijeniti korisničku ulogu  
  - **THEN** sistem mu ne dozvoljava pristup toj funkcionalnosti.

---

## US-21 — Deaktivacija korisničkog naloga

**Opis:**  
Kao administrator, želim deaktivirati korisnički nalog, kako bih spriječio dalji pristup korisniku koji više ne treba koristiti sistem.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava administratoru da onemogući pristup korisnicima koji više ne trebaju koristiti sistem, bez gubitka historijskih podataka i veza koje su vezane za njihov raniji rad.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da korisnički nalog već postoji u sistemu. Otvoreno pitanje je da li deaktivirani korisnik ostaje vidljiv u listi korisnika i da li sistem prikazuje njegov status kao neaktivan.

**Veze sa drugim storyjima:**  
Zavisi od storyja za pregled korisničkih naloga i povezan je sa storyjem za prijavu korisnika u sistem.

**Acceptance Criteria:**

- **AC1: Uspješna deaktivacija naloga**  
  - **GIVEN** administrator odabere aktivan korisnički nalog  
  - **WHEN** potvrdi deaktivaciju  
  - **THEN** sistem mijenja status naloga u neaktivan.

- **AC2: Onemogućen pristup deaktiviranom korisniku**  
  - **GIVEN** korisnički nalog je deaktiviran  
  - **WHEN** korisnik pokuša prijavu u sistem  
  - **THEN** sistem mu ne dozvoljava pristup.

- **AC3: Prikaz statusa neaktivnog naloga**  
  - **GIVEN** korisnički nalog je deaktiviran  
  - **WHEN** administrator pregleda korisnike  
  - **THEN** sistem prikazuje da je nalog neaktivan.

- **AC4: Ograničenje pristupa funkcionalnosti deaktivacije**  
  - **GIVEN** korisnik nije administrator  
  - **WHEN** pokuša deaktivirati korisnički nalog  
  - **THEN** sistem mu ne dozvoljava pristup toj funkcionalnosti.

---

## US-22 — Prihvatanje dodijeljenog zadatka

**Opis:**  
Kao serviser, želim prihvatiti dodijeljeni zadatak, kako bih potvrdio da preuzimam odgovornost za njegovu realizaciju.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da sistem evidentira da je serviser svjesno preuzeo odgovornost za izvršenje zadatka, što olakšava koordinaciju rada i praćenje toka intervencije.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da je zadatak prethodno dodijeljen serviseru. Otvoreno pitanje je da li prihvatanje zadatka automatski mijenja status intervencije.

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije odgovornom licu i povezan je sa storyjem za ažuriranje statusa intervencije od strane servisera.

**Acceptance Criteria:**  

---

## US-23 — Odbijanje dodijeljenog zadatka

**Opis:**  
Kao serviser, želim odbiti dodijeljeni zadatak, kako bi dispečer mogao pravovremeno reagovati i dodijeliti ga drugom izvršiocu.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da sistem evidentira da zadatak ne može biti preuzet, čime se izbjegava zastoj u procesu i omogućava pravovremena reakcija dispečera.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da je zadatak prethodno dodijeljen serviseru. Otvoreno pitanje je da li serviser mora unijeti razlog odbijanja zadatka.

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije odgovornom licu i povezan je sa storyjem za pregled dodijeljenih intervencija.

**Acceptance Criteria:**  

---

## US-24 — Pregled evidentiranog izvršenog rada

**Opis:**  
Kao dispečer, želim pregledati evidentirani izvršeni rad, kako bih imao uvid u ono što je serviser uradio prije zatvaranja intervencije.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava dispečeru da pregleda dokaz o obavljenom radu prije donošenja odluke o zatvaranju intervencije, čime se povećava kontrola procesa i pouzdanost završetka zadatka.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da je serviser prethodno evidentirao izvršeni rad u sistemu. Otvoreno pitanje je koji skup informacija dispečer mora minimalno vidjeti prije zatvaranja intervencije.

**Veze sa drugim storyjima:**  
Zavisi od storyja za evidentiranje izvršenog rada i povezan je sa storyjem za potvrdu i zatvaranje intervencije.

**Acceptance Criteria:**  

---

## US-25 — Potvrda i zatvaranje intervencije

**Opis:**  
Kao dispečer, želim potvrditi i zatvoriti završenu intervenciju, kako bi proces bio formalno okončan u sistemu.

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se intervencija zvanično završi tek nakon pregleda izvršenog rada, čime se osigurava kontrolisan i pouzdan završetak procesa.

**Prioritet:**  
*Visok*

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da je serviser prethodno ažurirao status i evidentirao izvršeni rad. Otvoreno pitanje je da li zatvaranje automatski mijenja status u završeno ili postoji poseban završni status zatvoreno.

**Veze sa drugim storyjima:**  
Zavisi od storyja za ažuriranje statusa intervencije od strane servisera i storyja za pregled evidentiranog izvršenog rada.

**Acceptance Criteria:**  

---

## US-26 — Izmjena vlastitog zahtjeva

**Opis:**   
Kao korisnik usluge, želim izmijeniti svoj zahtjev dok još nije preuzet u obradu, kako bih mogao ispraviti pogrešno unesene ili nepotpune podatke.  

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava korisniku da ispravi greške u prijavi bez potrebe da pravi novi zahtjev, čime se povećava tačnost podataka i smanjuje broj pogrešno evidentiranih intervencija.  

**Prioritet:**  
*Visok*  

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da je izmjena dozvoljena samo dok zahtjev nije dodijeljen ili dok rad na njemu nije započeo. Otvoreno pitanje je koje podatke korisnik smije mijenjati.  

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyjem za pregled vlastitog zahtjeva.  

**Acceptance Criteria:**  

---

## US-27 — Otkazivanje vlastitog zahtjeva

**Opis:**  
Kao korisnik usluge, želim otkazati svoj zahtjev dok još nije u aktivnoj obradi, kako bih mogao povući greškom prijavljen ili više nepotreban zahtjev.  

**Poslovna vrijednost:**  
Ovaj story je važan jer sprečava da pogrešno prijavljeni ili više nepotrebni zahtjevi ostanu aktivni u sistemu, čime se smanjuje operativni šum i olakšava rad dispečera i servisera.  

**Prioritet:**  
*Visok*  

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da je otkazivanje dozvoljeno samo dok zahtjev nije dodijeljen izvršiocu ili dok rad nije počeo. Otvoreno pitanje je da li sistem treba čuvati razlog otkazivanja.  

**Veze sa drugim storyjima:**  
Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyjem za pregled vlastitog zahtjeva.  

**Acceptance Criteria:**  

---

## US-28 — Promjena izvršioca intervencije

**Opis:**  
Kao dispečer, želim promijeniti izvršioca intervencije, kako bi zadatak mogao biti dodijeljen drugom serviseru kada prvobitno dodijeljeni izvršilac ne može preuzeti ili završiti rad.  

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da operativni tok ne "zapne" kada dodijeljeni serviser postane nedostupan ili ne može izvršiti zadatak, čime se povećava fleksibilnost i pouzdanost sistema.  

**Prioritet:**  
*Visok*  

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da intervencija već ima dodijeljenog izvršioca. Otvoreno pitanje je da li se prilikom promjene izvršioca automatski evidentira prethodno zaduženje u historiji aktivnosti.  

**Veze sa drugim storyjima:**  
Zavisi od storyja za dodjelu intervencije odgovornom serviseru i povezan je sa storyjima za pregled otvorenih intervencija, pregled detalja pojedinačne intervencije i pregled statusa intervencija.  

**Acceptance Criteria:**  

---

## US-29 — Vraćanje zadatka na ponovnu dodjelu  

**Opis:**  
Kao serviser, želim vratiti zadatak na ponovnu dodjelu, kako bi dispečer mogao organizovati dalje izvršenje kada zadatak nije moguće završiti u postojećim okolnostima.  

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava da se zadatak ne zaglavi kod servisera koji ga ne može završiti, nego da se vrati u operativni tok i ponovo organizuje na ispravan način.  

**Prioritet:**  
*Visok*  

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da je serviser već preuzeo ili započeo obradu zadatka. Otvoreno pitanje je da li je unos napomene ili razloga vraćanja obavezan.  

**Veze sa drugim storyjima:**  
Zavisi od storyja za prihvatanje dodijeljenog zadatka i povezan je sa storyjima za promjenu izvršioca, pregled dodijeljenih intervencija i ažuriranje statusa intervencije od strane servisera.  

**Acceptance Criteria:**  

---

## US-30 — Razmjena napomena na intervenciji  

**Opis:**  
Kao dispečer ili serviser, želim dodati kratku napomenu na konkretnu intervenciju, kako bi sve važne operativne informacije bile dostupne na jednom mjestu svim učesnicima u procesu.  

**Poslovna vrijednost:**  
Ovaj story je važan jer omogućava brzu i direktnu komunikaciju između ureda i terena bez potrebe za vanjskim kanalima komunikacije, osiguravajući da ključni detalji (npr. specifične upute za pristup lokaciji) ostanu trajno vezani uz zahtjev.  

**Prioritet:**  
*Srednji*  

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da korisnik ima pravo pristupa detaljima konkretne intervencije. Otvoreno pitanje je da li su napomene vidljive klijentu (korisniku usluge) ili služe isključivo za internu komunikaciju.  

**Veze sa drugim storyjima:**  
Povezano sa storyjima za pregled detalja pojedinačne intervencije, pregled detalja zadatka na terenu i vraćanje zadatka na ponovnu dodjelu.  

**Acceptance Criteria:**  

---

## US-30 — Pregled historije aktivnosti intervencije  

**Opis:** 
Kao dispečer, želim vidjeti listu svih prethodnih promjena i aktivnosti na zahtjevu, kako bih imao jasan uvid u hronologiju obrade od trenutka prijave do trenutnog statusa.  

**Poslovna vrijednost:**  
Ovaj story je važan jer osigurava transparentnost i omogućava praćenje toka rada (audit trail). Pomaže u rješavanju nesporazuma i pruža uvid u to ko je, kada i koju akciju poduzeo na konkretnom zahtjevu.  

**Prioritet:**  
*Srednji*  

**Pretpostavke i otvorena pitanja:**  
Pretpostavlja se da sistem automatski bilježi ključne promjene (status, dodjela, prioritet). Otvoreno pitanje je koliki nivo detalja historija treba sadržavati (npr. da li bilježi i stare vrijednosti polja prije izmjene).  

**Veze sa drugim storyjima:**  
Zavisi od svih storyja koji mijenjaju stanje intervencije (prijava, dodjela, promjena statusa, planiranje, određivanje prioriteta).  

**Acceptance Criteria:**  

---
