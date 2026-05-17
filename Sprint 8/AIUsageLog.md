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
| Svrha korištenja | Definisanje poslovne logike i workflow pravila servisnih intervencija |
| Kratak opis zadatka | AI alat je korišten za razradu operativnog toka intervencije, statusnih prelaza, planiranja termina i odnosa između dispečera i servisera. |
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
| Svrha korištenja | Definisanje modela dodjele servisera i pomoćnog osoblja |
| Kratak opis zadatka | AI alat je korišten za razradu načina dodjele servisera intervencijama i organizacije pomoćnog servisnog osoblja. |
| Šta je AI generisao | Generisan je prijedlog modela sa glavnim serviserom i pomoćnim serviserima, uključujući backend relacije, UI prijedloge za team assignment i audit log evidenciju. |
| Šta je tim prihvatio | Prihvaćen je model gdje intervencija ima jednog glavnog servisera kao odgovornog izvršioca, dok se pomoćni serviseri dodaju samo po potrebi. |
| Šta je tim izmijenio | Izmijenjen je početni koncept “tima servisera” tako da svi članovi nisu ravnopravni, nego postoji jasna hijerarhija odgovornosti. |
| Šta je tim odbacio | Odbačen je koncept u kojem bi svi serviseri imali identične privilegije i operativnu odgovornost na intervenciji. |
| Rizici, problemi ili greške | Dodatna kompleksnost u planiranju termina i prikazu dostupnosti servisera. |
| Ko je koristio alat | Amina Grebić |
