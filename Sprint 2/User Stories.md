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
| US-01 | Registracija | Kao novi korisnik, želim kreirati korisnički nalog, kako bih mogao koristiti sistem i pristupiti funkcionalnostima koje su mi dostupne. | Ovaj story je važan jer omogućava uključivanje kroisnika u sistem i predstavlja osnovu za korištenje svih ostalih funkcionalnosti, poput prijave zahtjeva i praćenje statusa intervencije. | Visok | Pretpostavlja se da korisnik može samostalno kreirati nalog. Otvoreno pitanje je da li se korisnička uloga dodjeljuje automatski pri registraciji ili je određuje administrator. | | Napisati AC za sljedeće scenarije: uspješnu registraciju, neuspješnu zbog nepotpunih podatak, neuspješnu zbog neispravnog formata, već postojeći korisnički nalog, nesuspješno kad lozinka ne zadovoljava pravila
| US-02 | Prijava korisnika u sistem | Kao registrovani korisnik, želim se prijaviti u sistem, kako bih mogao pristupiti funkcionalnostima koje su mi dostupne. | Ovaj story je važan jer omogućava registrovanim korisnicima pristup sistemu i predstavlja osnovu za korištenje svih ostalih funkcionalnosti u skladu sa njihovom ulogom. | Visok | Pretpostavlja se da korisnik već ima kreiran i aktivan korisnički nalog. Otvoreno pitanje je da li se nakon uspješne prijave korisnik preusmjerava na zajednički početni ekran ili na prikaz prilagođen njegovoj ulozi. | Zavisi od storyja za registraciju korisnika i povezan je sa storyjem za upravljanje korisničkim ulogama i pravima pristupa. | Napisati AC za sljedeće scenarije: uspješna prijava, nepotpuni podaci, neispravan format podataka, neispravni podaci za prijavu, neaktivan ili nepostojeci nalog.
| US-03 | Odjava korisnika iz sistema | Kao korisnik sistema, želim se sigurno odjaviti sa svog naloga, kako bih spriječio neovlašten pristup svom korisničkom računu nakon završetka rada. | Ovaj story je važan jer omogućava korisniku da bezbjedno završi rad u sistemu i smanji rizik od neovlaštenog pristupa njegovom nalogu i podacima. | Srednji | Pretpostavlja se da kroisnik ima aktivnu sesiju u sistemu. Otvoreno pitanje je da li se nakon odjave korisnik vraća na početni ekran ili direktno na formu za prijavu. | Povezano je sa storyjem zaprijavu korisnika u sistem i sa storyjem za upravljanje kroisničkim nalozima i pravima pristupa. | Napisati AC za sljedeće scenarije: uspješna odjava, preusmjeravanje nakon odjave (na početni ekran ili formu za prijavu), zaštićene stranice nisu dostupne nakon odjave, odjava je dostupna samo prijavljenom korisniku.
| US-04 | Upravljanje korisničkim ulogama i pravima pristupa | Kao administrator, želim upravljati korisničkim ulogama i pravima pristupa, kako bi svaki korisnik imao pristup samo podacima i funkcionalnostima su relevantne za njegovu ulogu. | Ovaj story je važan jer omogućava sigurnu ipreglednu kontrolu pristupa sistemu, smanjuje rizik od neovlaštenog pristupa i osigurava da korisnici koriste samo one funkcionalnosti koje su u skladu sa njihovim odgovornostima. | Visok | Pretpostavlja se da su osnovne korisničke uloge sistema unaprijed definisane. Otvoreno pitanje je da li administrator može samo dodjeljivati postojeće uloge ili može kreirati i nove uloge i mijenjati njihova prava pristupa. | Povezano sa storyjima za registraciju korisnika, prijavu korisnika u sistem. | Napisati AC za sljedeće scenarije: dodjela uloge korisniku, ograničen pristup funkcionalnostima, prikaz funkcionalnosti prema ulozi, izmjena korisničke uloge, administratorski pristup upravljanju ulogama(niko drugi ne može ovo raditi osim admina).
| US-05 | Prijava zahtjeva za servisnu intervenciju | Kao korisnik, želim prijaviti kvar ili zahtjev za servisnu intervenciju, kako bi obrada mog zahtjeva mogla biti evidentirana i pokrenuta kroz sistema. | Ovaj story je važan jer omogućava korisniku d apokrene proces servisne intervencije i predstvalja početnu tačku cijelog  operativnog sistema, bez ove funkcionalnosti nije moguće evidentirati zahtjev niti započeti njegovu obradu. | Visok | Pretpostavlja se da kroisnik ima pristup formi za prijavu zahtjeva, kao i da smao registrovani korisnik može podnijeti prijavu. | Povezano sa storyjima zapregled vlastitog zahtjeva, pregled statusa zahtjeva, pregled otvorenih intervencija i dalju obradu servisne intervencije. | Napisati AC za sljedeće scenarije: uspješna prijava, nepotpuni podaci, unos osnovnih ifnromaicja o problemu, potvrda o zaprimanju zahtjeva... |
| US-06 | Pregled statusa vlastitog zahtjeva | Kao korisnik, želim pregledati status svog zahtjeva, kako bih imao jasan uvid u fazu obrade u kojoj se nalazi moj zahtjev. | Ovaj story je važan jer korisniku omogućava transparentan uvid u tok obrade njegovog zahtjeva, smanjuje potrebu za dodatnim provjerama i povećava osjećaj sigurnosti da se pproblem zaista rješava. | Visok | Pretpostvalja se da korisnik ima pristup svom zahtjevu u sistemu. Otvoreno pitanje je da li korisnik vidi samo osnovne statuse ili i dodatne informacije poput planiranog termina i dodjele zahtjeva. | Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyem upravljanje statusom intervencije. | Napisati AC za sljedeće scenarije: pregled statisa vlastitog zahtjeva, prikaz status au skaldu sa stvarnim stanjem, korisnik vidi samo vlastite zahtjeve, zahtjev bez završetka i zahtjev koji je završen... |
| US-07 | Pregled otvorenih intervencija | Kao dispečer, želim pregledati sve otvorene i aktivne intervencije, kako bih imao jasan uvid u azhtjeve koji čekaju obradu i u tok rada. | Ovaj story je važan jer dispečeru omogućava centralizovan pregled zahtjeva koji su u obradi, olakšava organizaciju rada i omogućava pravovremeno reagovanje na eventualne zastoje, promjene prioriteta i opterećenost resursa. | Visok | Pretpostavlja se da sistem razlikuje otvorene, aktivne i završene intervencije. Otvoreno pitanje je da li pregled uključuje samo listu intervencija ili i osnovne informacije poput prioriteta, statusa i dodijeljenog servisera. | Zavisi od storyja za prijavu zahtjeva za servisnu intervenciju i povezan je sa storyjima za pregled detalja pojedinačne intervencije, određivanje prioriteta, dodjelu servisera i upravljanje statusom intervencije. | Napisati AC za sljedeće scenarije: prikaz otvorenih i aktivnih intervencija , završene intervencije nisu u ovom pregledu, prikaz osnovnh informacija o svakoj intervenciji, pregled se ažurira u skladu sa promjenama satusa... |
| US-08 | Pregled detalja pojedinačne intervencije | Kao ovlašteni korisnik (dispečer), želim pregledati detalje pojedinačne intervencije, kako bih imao potpune informacije o njenom trenutnom stanju, toku i zaduženjima. | Ovaj story je važan jer omogućava korisniku da na jednom mjestu dobije sve ključne informacije o konkretnoj intervenciji, što olakšava donošenje odluka, praćenje toka rada i izvršenje zadataka bez dodatnih provjera i nepovezanih izvora informacija. | Visok | Pretpostavlja se da korisnik već ima pristup listi intervencija i da može otvoriti pojedinačnu intervenciju iz pregleda. Otvoreno pitanje je koje tačno informacije čine minimalni skup detalja koji su dostupni u ovom prikazu i da li se prikaz razlikuje prema korisničkoj ulozi. | Pretpostavlja se da korisnik već ima pristup listi intervencija i da može otvoriti pojedinačnu intervenciju iz pregleda. Otvoreno pitanje je koje tačno informacije čine minimalni skup detalja koji su dostupni u ovom prikazu i da li se prikaz razlikuje prema korisničkoj ulozi. | Napisati AC za sljedeće scenarije: otvaranje detalja intervencije, prikaz osnovnih informaacija o interv., prikaz podataka o zaduženjima, prikaz planiranih i operatvnih informacija, prikaz u skladu sa pravima pristupa. |
| US-09 | Dodjela intervencije odgovornom licu | Kao dispečer, želim dodijeliti intervenciju odgovornom licu(serviseru), kako bi nilo jasno ko preuzima izvršenje zadatka.  | Ovaj story je važan jer omogućava da svaka intervencija dobije jasno određenog izvršioca, što je osnova za dalji tok rada, planiranje, praćenje statusa i izvršenje zadatka. | Visok | Zavisi od storyja za pregled otvorenih i aktivnih intervencija i pregled detalja pojedinačne intervencije, a povezan je sa storyjima za određivanje prioriteta, planiranje izlaska na teren i upravljanje statusom intervencije. | Napisati AC za sljedeće scenarije: uspješna dodjela serviseru, prikaz dodijenljenog sevriser, dodjela nije moguća bez odabira servisera, promjena status anakon dodjele, dodjela dostupna smao ovlaštenom korisniku... |
| US-10 | Dodjela intervencije timu servisera? | | | Srednji |
| US-11 | Planiranje intervecnije |
| US-12 | Određivanje prioriteta intervencije | Kao dispečer, želim odrediti prioritet intervencije, kako bi zahtjevi bili obarađeni i raspoređeni prema njihovoj hitnosti i važnosti | Ovaj story je važan jer omogućava da se intervencije ne obrađuju proizvoljno, nego u skladu sa njihovom stvarnom hitnošću i poslovnim značajem, čime se olakšava raspodjela resursa, smanjuje rizik da važni zahtjevi ostanu neobrađeni ili budu obrađeni prekasno, te se omogućava pregledniji i efikasniji operativni rad. | Visok |  Otvoreno pitanje je da li dispečer prioritet određuje potpuno ručno ili sistem pruža podršku kroz prijedlog prioriteta koji dispečer može potvrditi ili izmijeniti. | Napisati AC za sljedeće scenarije: prijedlog prioriteta od strane sistema, potvrda predloženog prioriteta, ručna izmjena prioriteta, prikaz prioriteta, određivanje prioriteta dosrtupno samo ovlaštenom korisniku... |
| US-13 | Pregled statusa intervencija od strane dispečera | Kao dispečer, želim pregledati statuse intervencija, kako bih mogao pratiti tok rada i imati jasan uvid u trenutnu fazu obrade svakog zahtjeva. | Ovaj story je važan jer dispečeru daje pregled nad trenutnim stanjem procesa i omogućava da na vrijeme uoči zastoje, preopterećenost ili potrebu za dodatnom intervencijom. Bez jasnog pregleda statusa, upravljanje većim brojem zahtjeva postaje otežano i oslanja se na dodatne provjere i neformalne kanale komunikacije. | Visok | Pretpostavlja se da sistem podržava definisane statuse intervencije i da su oni dosljedno povezani sa tokom rada. Otvoreno pitanje je da li dispečer u ovom prikazu vidi samo trenutni status intervencije ili i dodatne informacije poput prioriteta, dodijeljenog servisera i planiranog termina. | Zavisi od storyja za pregled otvorenih i aktivnih intervencija i povezan je sa storyjima za pregled detalja pojedinačne intervencije, određivanje prioriteta, dodjelu intervencije serviseru, planiranje izlaska na teren i ažuriranje statusa intervencije. | Napisati AC za sljedeće scenarije: prikaz statusa intervencije, prikaz osnovnih statusa, ažurirano stanje prikaza, prikaz intervencija dostupnih samo dispečeru, mogućnost prelaska na detalje intervencije... |
| US-14 | Ažuriranje statusa intervencije od strane servisera | Kao serviser želim po potrebi ažurirati status intervencije na kojoj radim, kako bi sistem odražavao trenutno stanje rada na terenu. | Ovaj story je važan jer omogućava da sistem prati stvarni tok izvršenja intervencije i da ostali korisnici imaju pravovremenu i tačnu informaciju o tome u kojoj se fazi rad nalazi. Time se smanjuje potreba za dodatnim provjerama, pozivima i neformalnom koordinacijom. | Visok | Pretpostavlja se da serviser može ažurirati status samo za intervencije koje su mu dodijeljene. Otvoreno pitanje je da li serviser može postavljati sve operativne statuse ili samo one koji odgovaraju njegovom dijelu toka rada. Također, otvoreno pitanje je da li nakon završetka rada status prelazi direktno u „završeno“ ili postoji dodatna potvrda dispečera prije konačnog zatvaranja. | Zavisi od storyja za pregled dodijeljenih intervencija i pregled detalja zadatka na terenu. Povezan je sa storyjima za pregled statusa intervencija od strane dispečera, pregled statusa vlastitog zahtjeva od strane klijenta, evidenciju izvršenog rada i potvrdu zatvaranja intervencije. | 
| US-15 | Pregled dodijeljenih intervencija | Kao serviser, želim pregledati intervencije koje su mi dodijeljene, kako bih znao koje zadatke trebam izvršiti i kojim redoslijedom ih trebam obrađivati. | Visok |
| US-16 | Pregled detalja zadatka na terenu? | | Visok |
| US-17 | Ažuriranje statusa intervencije od strane servisera |
| US-18 | Evidentiranje izvršenog rada |


Legenda



