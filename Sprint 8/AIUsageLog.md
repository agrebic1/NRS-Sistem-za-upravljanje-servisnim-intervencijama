# AI Usage Log

| Polje | Opis |
|---|---|
| Datum | 15.05.2026. |
| Sprint broj | 8 |
| Alat koji je korišten | Claude AI |
| Svrha korištenja | Pomoć pri unapređenju UX/UI dizajna dispečerskog modula |
| Kratak opis zadatka | AI alat je korišten za analizu postojećeg interfejsa i prijedloge unapređenja operativnog workflow-a dispečera kroz wizard pristup i pregled detalja intervencije. |
| Šta je AI generisao | Generisani su prijedlozi za redesign stranice detalja intervencije, uključujući hero kartice, live tracking workflow, sticky operativni panel, KPI prikaze, vizuelni prikaz termina, status badgeve, activity feed i pregled servisera/korisnika. |
| Šta je tim prihvatio | Prihvaćen je koncept da detalji intervencije budu predstavljeni kao “dispatch control panel” umjesto klasične CRUD forme. Prihvaćen je horizontalni workflow tracker, sticky summary panel i vizuelno odvajanje glavnih operativnih informacija. |
| Šta je tim izmijenio | Određeni UI prijedlozi prilagođeni su postojećem dizajnu sistema aplikacije i uklonjeni su dijelovi koji bi previše odstupali od trenutnog vizuelnog identiteta sistema. |
| Šta je tim odbacio | Odbačeni su dijelovi koji bi zahtijevali kompleksne real-time integracije koje nisu planirane za trenutni sprint. |
| Rizici, problemi ili greške | Postojao je rizik da interfejs postane previše kompleksan i vizuelno preopterećen, zbog čega je dio prijedloga pojednostavljen. |
| Ko je koristio alat | Amina Grebić |




| Polje | Opis |
|---|---|
| Datum | 16.05.2026. |
| Sprint broj | 8 |
| Alat koji je korišten | Claude AI |
| Svrha korištenja | Implementacija poslovne logike i workflow pravila servisnih intervencija |
| Kratak opis zadatka | AI alat je korišten za implementaciju operativnog toka intervencije, statusnih prelaza, planiranja termina i odnosa između dispečera i servisera. |
| Šta je AI generisao | Generisani su prijedlozi za workflow statusa, validaciju prelaza između statusa, rollback logiku, audit log pristup, pregled historije aktivnosti i pravila zatvaranja intervencije. |
| Šta je tim prihvatio | Prihvaćen je status-driven pristup gdje backend validacije predstavljaju izvor istine. Prihvaćena je mogućnost vraćanja intervencije u prethodne faze uz obavezno obrazloženje i audit zapis. |
| Šta je tim izmijenio | Poslovna pravila dodatno su prilagođena realnim operativnim potrebama i pojednostavljen je dio workflow-a kako bi implementacija bila realistična u okviru sprinta. |
| Šta je tim odbacio | Odbačen je pristup potpuno jednosmjernog workflow-a bez mogućnosti povratka u prethodne faze. |
| Rizici, problemi ili greške | Uočen je rizik povećanja kompleksnosti sistema zbog velikog broja statusa i povezanih pravila. |
| Ko je koristio alat | Amina Grebić |




| Polje | Opis |
|---|---|
| Datum | 17.05.2026. |
| Sprint broj | 8 |
| Alat koji je korišten | Claude AI |
| Svrha korištenja | Implementacija modela dodjele servisera i pomoćnog osoblja |
| Kratak opis zadatka | AI alat je korišten za implementaciju i razradu načina dodjele servisera intervencijama i organizacije pomoćnog servisnog osoblja. |
| Šta je AI generisao | Generisan je prijedlog modela sa glavnim serviserom i pomoćnim serviserima, uključujući backend relacije, UI prijedloge za team assignment i audit log evidenciju. |
| Šta je tim prihvatio | Prihvaćen je model gdje intervencija ima jednog glavnog servisera kao odgovornog izvršioca, dok se pomoćni serviseri dodaju samo po potrebi. |
| Šta je tim izmijenio | Izmijenjen je početni koncept “tima servisera” tako da svi članovi nisu ravnopravni, nego postoji jasna hijerarhija odgovornosti. |
| Šta je tim odbacio | Odbačen je koncept u kojem bi svi serviseri imali identične privilegije i operativnu odgovornost na intervenciji. |
| Rizici, problemi ili greške | Dodatna kompleksnost u planiranju termina i prikazu dostupnosti servisera. |
| Ko je koristio alat | Amina Grebić |




| Polje | Opis |
|---|---|
| Datum | 17.05.2026. |
| Sprint broj | 8 |
| Alat koji je korišten | Claude AI |
| Svrha korištenja | Pomoć pri implementaciji serviserskog modula |
| Kratak opis zadatka | Korisnik je definisao da serviser u sekciji intervencija mora moći otvoriti pojedinačnu intervenciju, pregledati detalje, ažurirati status, unositi napomene i komunicirati sa dispečerom kroz sistem. |
| Šta je AI generisao | AI je generisao kod i implementacione dijelove za listu intervencija servisera, otvaranje detalja intervencije, prikaz osnovnih informacija, ažuriranje statusa, napomene, komunikaciju dispečer-serviser, historiju aktivnosti, mapu/lokaciju i evidenciju rada, u skladu sa korisničkim zahtjevima i postojećom arhitekturom sistema. |
| Šta je tim prihvatio | Prihvaćeno je da serviser vidi samo svoje intervencije i da klikom na karticu može otvoriti detaljan prikaz intervencije. Prihvaćen je i koncept komunikacije između servisera i dispečera kroz napomene vezane za konkretnu intervenciju. |
| Šta je tim izmijenio | Generisani kod i prijedlozi prilagođeni su postojećem serviserskom modulu, postojećem dizajn sistemu i poslovnoj logici aplikacije. |
| Šta je tim odbacio | Odbačen je pristup u kojem bi serviser vidio nepotrebne administrativne podatke ili tuđe intervencije. Također nije implementiran eksterni chat sistem, nego komunikacija kroz napomene unutar aplikacije. |
| Rizici, problemi ili greške | Rizik je da serviserski prikaz postane preopterećen informacijama koje nisu potrebne na terenu, zbog čega je zadržan fokus na relevantnim operativnim podacima. |
| Ko je koristio alat | Amina Grebić |




| Polje | Opis |
|---|---|
| Datum | 17.05.2026. |
| Sprint broj | 8 |
| Alat koji je korišten | Claude AI |
| Svrha korištenja | Pomoć pri implementaciji fleksibilnog planiranja termina i asistivnog izbora servisera |
| Kratak opis zadatka | Korisnik je definisao da korisnik prilikom kreiranja zahtjeva može odabrati do tri preferirana termina, a da sistem pri planiranju dispečeru pomogne izborom najpogodnijeg servisera prema kriterijima kao što su stručnost, blizina, dostupnost i opterećenje. |
| Šta je AI generisao | AI je generisao kod i implementacione prijedloge za izbor više preferiranih termina, scoring/ranking model za preporuku servisera, prikaz najboljeg izbora i djelimičnih poklapanja, kriterije za izbor servisera, odbijanje dodjele uz razlog i ponovno rangiranje kandidata nakon odbijanja servisera. |
| Šta je tim prihvatio | Prihvaćen je asistivni model u kojem sistem predlaže najpogodnijeg servisera, ali dispečer donosi finalnu odluku. Prihvaćeno je i da korisnik može navesti više termina kako bi dispečer lakše uskladio korisnika i servisera. |
| Šta je tim izmijenio | Generisana logika i prijedlozi prilagođeni su tako da sistem ne dodjeljuje servisera automatski, nego daje preporuke i objašnjenje podudaranja kandidata. |
| Šta je tim odbacio | Odbačena je potpuno automatska dodjela servisera bez potvrde dispečera. Također je odbačeno ponovno preporučivanje istog servisera odmah nakon odbijanja dodjele. |
| Rizici, problemi ili greške | Rizik je povećana kompleksnost planiranja zbog više termina, više kriterija rangiranja i potrebe za ponovnim rangiranjem nakon odbijanja servisera. Zbog toga je naglašeno da scoring logika bude odvojena od UI sloja i usklađena sa postojećom arhitekturom sistema. |
| Ko je koristio alat | Amina Grebić |



| Polje | Opis |
|---|---|
| Datum | 17.05.2026. |
| Sprint broj | 8 |
| Alat koji je korišten | Claude AI |
| Svrha korištenja | Refactoring, cleanup i standardizacija postojećeg koda sistema |
| Kratak opis zadatka | Korisnik je zahtijevao završni audit i cleanup aplikacije nakon implementacije većeg broja funkcionalnosti. AI je korišten za generisanje i refaktorisanje koda u skladu sa clean code principima, uklanjanje mrtvog i duplog koda, standardizaciju komponenti i pripremu sistema za dalje održavanje i testiranje. |
| Šta je AI generisao | AI je generisao refaktorisani kod za uklanjanje dead code-a, standardizaciju reusable helper funkcija, standardizaciju status/prioritet badge komponenti, konsolidaciju tipova, cleanup mock fallback logike, reusable error/loading/empty state komponente i reorganizaciju dijelova poslovne logike u odvojene module. |
| Šta je tim prihvatio | Prihvaćen je pristup sistematskog cleanup-a i modularizacije poslovne logike. Prihvaćeno je uklanjanje silent mock fallbackova, standardizacija UI stanja i izdvajanje reusable helper funkcija i tipova. |
| Šta je tim izmijenio | Određeni dijelovi refaktorisanja prilagođeni su postojećoj arhitekturi sistema kako bi se izbjegle velike promjene u strukturi projekta tokom sprinta. |
| Šta je tim odbacio | Odbačeno je potpuno restrukturiranje aplikacije i uvođenje novih biblioteka koje nisu bile neophodne za trenutni sprint. |
| Rizici, problemi ili greške | Postojao je rizik regresionih grešaka prilikom uklanjanja fallback logike i reorganizacije reusable komponenti, zbog čega je dodatno provjerena povezanost ruta, redirect logika i korištenje postojećih API poziva. |
| Ko je koristio alat | Amina Grebić |

| Polje | Opis |
|---|---|
| Datum | 19.05.2026. |
| Sprint broj | 8 |
| Alat koji je korišten | Claude AI |
| Svrha korištenja | Planiranje testiranja kompleksnog operativnog toka intervencije |
| Kratak opis zadatka | AI alat je korišten za definisanje test plana koji pokriva cijeli tok od kreiranja zahtjeva do zatvaranja intervencije, uključujući identifikaciju kritičnih test scenarija, rubnih slučajeva i prioritizaciju test slučajeva prema riziku. |
| Šta je AI generisao | Generisan je strukturirani test plan sa popisom prioritetnih test scenarija za tok: zahtjev → dodjela → intervencija u toku → završetak → zatvaranje. Predloženi su scenariji za sretni tok, alternativne tokove (odbijanje, vraćanje, rollback statusa) i rubne slučajeve (zatvaranje bez evidentiranog rada, nedozvoljeni prelazi statusa). |
| Šta je tim prihvatio | Prihvaćena je struktura test plana sa prioritizacijom scenarija prema kritičnosti, pristup testiranja po korisničkim ulogama (korisnik usluge, dispečer, serviser) i lista minimalnih uslova za prolaz QA sign-off. |
| Šta je tim izmijenio | Opseg testiranja je sužen na scenarije koji su implementirani u okviru Sprinta 8, a dio predloženih E2E scenarija prebačen je u naredni sprint. |
| Šta je tim odbacio | Odbačeno je uvođenje automatizovanih E2E testova za kompleksne višekorisničke tokove u ovoj fazi zbog ograničenja sprinta. |
| Rizici, problemi ili greške | Uočen je rizik nepotpunog pokrića testiranjem zbog velikog broja statusa i korisničkih uloga; smanjen fokusiranjem na kritične putanje i RBAC provjere. |
| Ko je koristio alat | Ajna Ičić |

| Polje | Opis |
|---|---|
| Datum | 19.05.2026. |
| Sprint broj | 8 |
| Alat koji je korišten | Claude AI |
| Svrha korištenja | Dijagnostika i popravka grešaka u operativnom toku intervencije |
| Kratak opis zadatka | Tokom testiranja otkrivene su greške u toku zahtjev → intervencija → završetak intervencije → zatvaranje intervencije. AI alat je korišten za analizu uzroka grešaka, identifikaciju mjesta prekida toka i generisanje ispravki za statusne prelaze, validacije i API pozive koji nisu funkcionisali ispravno. |
| Šta je AI generisao | Generisane su ispravke za logiku statusnih prelaza (nedozvoljeni prelaz iz aktivne intervencije direktno u zatvoreno bez evidencije rada), popravka API validacija za završetak intervencije i usklađivanje prikaza statusa između dispečerskog i serviserskog modula. Predložen je i revidirani dijagram toka sa jasno definisanim dozvoljenim i nedozvoljenim prelazima. |
| Šta je tim prihvatio | Prihvaćena je ispravka validacije koja sprečava zatvaranje intervencije bez evidentiranog izvršenog rada. Prihvaćeno je i usklađivanje naziva statusa između frontenda i baze podataka kako bi prikaz bio konzistentan za sve uloge. |
| Šta je tim izmijenio | Poruke o greškama prilagođene su bosanskom jeziku i učinjene su razumljivijim za krajnjeg korisnika umjesto tehničkih opisa koji su AI inicijalno predložio. |
| Šta je tim odbacio | Odbačen je prijedlog za automatsko zatvaranje intervencije nakon isteka definisanog roka bez eksplicitne dispečerske potvrde. |
| Rizici, problemi ili greške | Greška u toku je uzrokovala da se intervencija mogla zatvoriti bez evidentiranog rada; ispravka je verifikovana ponovnim prolazom kroz test scenarije sretnog toka i alternativnih tokova. |
| Ko je koristio alat | Ajna Ičić |

| Polje | Opis |
|---|---|
| Datum | 20.05.2026. |
| Sprint broj | 8 |
| Alat koji je korišten | Claude AI |
| Svrha korištenja | Izvršavanje testova i generisanje izvještaja o testiranju za Sprint 8 |
| Kratak opis zadatka | AI alat je korišten za podršku pri izvršavanju ručnih testova kompleksnog operativnog toka, strukturiranje nalaza iz testiranja i generisanje QA izvještaja sa statusom prolaznosti, pronađenim greškama i QA sign-off rezimeom. |
| Šta je AI generisao | Generisana je struktura izvještaja testiranja sa tabelama test slučajeva (očekivani vs. stvarni rezultat, status PASS/FAIL), format za evidentiranje bugova sa severity oznakom i konsolidovani QA sign-off sa pregledom pokrivenosti user storija. |
| Šta je tim prihvatio | Prihvaćen je format izvještaja sa jasnim PASS/FAIL statusima, pregledom pokrivenosti po user storiju i rezimeom otvorenih nalaza. Prihvaćena je i klasifikacija grešaka po prioritetu (kritično, visoko, nisko). |
| Šta je tim izmijenio | Prilagođeni su nazivi kolona i struktura tabela kako bi bili usklađeni sa formatom koji tim koristi od Sprinta 5, a dio automatski generisanih komentara je ručno dorađen. |
| Šta je tim odbacio | Odbačeno je generisanje Screenshot putanja kao obaveznih dokaza u tabelama, u skladu sa odlukom iz prethodnih sprintova. |
| Rizici, problemi ili greške | Postojao je rizik nekonzistentnosti između ručno izvršenih testova i generisanog izvještaja; smanjen direktnom validacijom svakog unosa prije finalizacije dokumenta. |
| Ko je koristio alat | Ajna Ičić |
