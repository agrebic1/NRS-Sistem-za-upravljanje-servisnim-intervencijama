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
| US-06 | Pregled statusa (vlastitog) zahtjeva | Kao korisnik, želim pregledati status svoje intervencije, kako bih znao u kojoj je fazi rješevanje/ispunjenje mog zahtjeva | | Visok | | | |
| US-07 | Pregled otvorenih intervencije | Kao dispečer, želim pregledati sve otvorene i aktivne intervencije, kako bih mogao pratiti koje zahtjeve treba obraditi i kako se odvija tok rada. | | Visok| | |
| US-08 | Pregled detalja pojedinačne intervencije | Kao ovlašteni korisnik, želim pregledati detalje pojedinačne intervencije, kako bih imao potpune informacije o njenom trenutnom stanju, toki i zaduženjima. | | Visok | | |
| US-09 | Dodjela intervencije odgovornom licu | Kao dispečer, želim dodijeliti intervenciju odgovornom licu(serviseru), kako bi zahtjev mogao biti preuzet i izvršen od strane odgovarajuće osobe.  | | Visok | | |
| US-10 | Dodjela intervencije timu servisera? | | | Srednji |
| US-11 | Planiranje intervecnije |
| US-12 | Određivanje prioriteta intervencije | Kao dispečer, želim odrediti prioritet intervencije (uz podršku sistema), kako bi zahtjevi bili obaređeni i raspoređeni prema njihovoj hitnosti i važnosti | Ovaj story je važan jer omogućava da se intervencije ne obrađuju proizvoljno, nego u skladu sa njihovom stvarnom hitnošću i poslovnim značajem, čime se olakšava raspodjela resursa, smanjuje rizik da važni zahtjevi ostanu neobrađeni (uli budu obrađeni prekasno) i omogućava pregledniji i efikasniji operativni rad. | Visok |
| US-13 | Pregled statusa intervencija od strane dispečera | Kao dispečer, želim pregledati statuse intervencija, kako bih mogao pratiti tok rada i imati jasan uvid u to koji su zahtjevi otvoreni, dodijeljeni, u toku ili završeni. | Ovaj story je važan jer dispečeru daje pregled nad trenutnim stanjem procesa i omogućava da na vrijeme uoči zastoje, preopterećenost ili potrebu za dodatnom intervencijom. Bez jasnog pregleda statusa, upravljanje večim brojem zahtjeva postaje otežano i oslanja se na dodatne provjere i decentraliziranu neformalnu komunikaciju. | Visok |
| US-14 | Ažuriranje statusa intervencije od strane dispečera/servisera | Kao _ želim po potrebi ažurirati status intervencije, kako bi sistem odražavao stvarno stanje procesa na terenu i ostao usklađen sa operativnim tokom. | Ovaj story je važan jer omogućava da ... | Visok | | 
| US-15 | Pregled dodijeljenih intervencija | Kao serviser, želim pregledati intervencije koje su mi dodijeljene, kako bih znao koje zadatke trebam izvršiti i kojim redoslijedom ih trebam obrađivati. | Visok |
| US-16 | Pregled detalja zadatka na terenu? | | Visok |
| US-17 | Ažuriranje statusa intervencije od strane servisera |
| US-18 | Evidentiranje izvršenog rada |


Legenda



