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
