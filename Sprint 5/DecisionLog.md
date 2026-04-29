# Decision Log

## Odluka # - Naziv odluke

| Polje | Opis |
|-------|------|
| ID odluke | |
| Datum | |
| Kratak naziv odluke | |
| Opis problema ili pitanja | |
| Razmatrane opcije | |
| Odabrana opcija | |
| Razlog izbora | |
| Posljedice odluke | |
| Status odluke | |

Mogući statusi: 
- aktivna
- izmijenjena
- zamijenjena




## Odluka #001 - Centralizovana landing stranica sa više ulaznih tokova

| Polje | Opis |
|-------|------|
| ID odluke | DLI-001 |
| Datum | 25.04.2026. |
| Kratak naziv odluke | Landing page kao centralna ulazna tačka |
| Opis problema ili pitanja | Kako organizovati ulaz u sistem za različite tipove korisnika? |
| Razmatrane opcije | 1. Direktan pristup login/registraciji  2. Više odvojenih ulaznih stranica  3. Jedna centralna landing stranica sa izborom |
| Odabrana opcija | Centralna landing stranica sa više opcija |
| Razlog izbora | Jednostavnije korisničko iskustvo i jasna struktura ulaza u sistem |
| Posljedice odluke | Potrebno definisati više korisničkih tokova sa jedne početne stranice |
| Status odluke | aktivna |

### Detaljno obrazloženje

Sistem za upravljanje servisnim intervencijama obuhvata različite tipove korisnika koji dolaze u sistem sa različitim ciljevima. Neki korisnici žele koristiti usluge, neki već imaju nalog i žele se prijaviti, dok drugi žele postati pružaoci usluga na platformi. Ako bi se svi ovi tokovi razdvojili na različite ulazne stranice, korisnici bi morali unaprijed znati gdje trebaju ići, što bi povećalo konfuziju i otežalo korištenje sistema. Zbog toga je donesena odluka da se implementira centralna landing stranica kao jedinstvena ulazna tačka u sistem. Na toj stranici korisniku se jasno nude tri osnovne opcije:

- registracija (za korisnike koji žele koristiti usluge)
- prijava u sistem (za postojeće korisnike)
- prijava interesa za pružanje usluga (za korisnike koji žele postati serviseri, tj. da ponude svoje usluge na platformi)

Ovim pristupom sistem postaje intuitivniji i pristupačniji, jer korisnik odmah na početku može izabrati tok koji odgovara njegovoj namjeri. Također, ovaj model omogućava veću fleksibilnost i inkluzivnost sistema, jer podržava različite tipove korisnika i njihove potrebe bez komplikovane navigacije. Ova odluka direktno utiče na strukturu frontend-a, jer definiše landing stranicu kao centralni UX element i polaznu tačku svih korisničkih tokova u aplikaciji.

---

## Odluka #002 - Javna registracija kreira samo korisnika usluge

| Polje | Opis |
|-------|------|
| ID odluke | DLI-002 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Ograničenje registracije |
| Opis problema ili pitanja | Da li omogućiti slobodnu registraciju za sve uloge u sistemu? |
| Razmatrane opcije | 1. Slobodna registracija za sve uloge  2. Registracija samo za korisnike usluge  3. Potpuno zatvoren sistem |
| Odabrana opcija | Javna registracija samo za korisnike usluge |
| Razlog izbora | Balans između dostupnosti sistema i sigurnosnog perimetra |
| Posljedice odluke | Operativne uloge se dodjeljuju kroz kontrolisan proces |
| Status odluke | aktivna |

### Detaljno obrazloženje

U kontekstu ovog sistema, krajnji korisnici često pristupaju platformi u stanju povećanog stresa, sa jasnom potrebom za hitnim rješavanjem problema. Uvođenje dodatnih koraka verifikacije u procesu registracije bi značajno povećalo barijeru ulaska i direktno uticalo na stopu odustajanja. Svaki dodatni korak između korisnika i funkcionalnosti sistema predstavlja potencijalni gubitak korisnika. Zbog toga je omogućena brza i jednostavna javna registracija za korisnike usluge, čime se obezbjeđuje instant pristup sistemu u kritičnom trenutku. Istovremeno, operativne uloge poput servisera, dispečera i administratora imaju pristup osjetljivim podacima, uključujući lične informacije korisnika i interne operativne resurse. Omogućavanje javne registracije za ove uloge bi otvorilo prostor za zloupotrebe, kreiranje lažnih naloga i potencijalno curenje podataka. Uveden je jasan sigurnosni perimetar kojim se razdvaja javni dio sistema od kontrolisanog operativnog sloja. Na taj način se postiže optimalan balans između dostupnosti sistema i zaštite njegovih ključnih funkcionalnosti.

---

## Odluka #003 - Serviseri prolaze proces prijave i odobrenja

| Polje | Opis |
|-------|------|
| ID odluke | DLI-003 |
| Datum | 26.04.2026. |
| Kratak naziv odluke | Serviser onboarding |
| Opis problema | Kako omogućiti pristup ulozi servisera? |
| Razmatrane opcije | 1. Slobodna registracija  2. Prijava i administrativno odobrenje |
| Odabrana opcija | Prijava i administrativno odobrenje |
| Razlog izbora | Kontrola kvaliteta i pravna usklađenost |
| Posljedice odluke | Uveden onboarding proces |
| Status odluke | aktivna |

### Detaljno obrazloženje

Serviseri su ključna karika sistema čiji rad direktno utiče na kredibilitet cijele platforme. Slobodna registracija bi omogućila neprovjerenim profilima pristup radnim nalozima, što bi neminovno dovelo do pada kvaliteta i gubitka povjerenja korisnika. Kako bi sistem ostao pouzdan, uveden je proces verifikacije koji služi kao filter za osiguranje stručnosti unutar mreže saradnika.

Ova odluka je ključna iz tri strateška razloga:

* **Integritet identiteta (Trust Security):** U sistemu koji spaja digitalnu platformu sa fizičkim prostorom korisnika, identitet servisera je nulti faktor sigurnosti. Implementirana je „staging“ zona unutar baze podataka gdje profil čeka validaciju dokumenata i stručnosti prije aktivacije. Ovim se sprječava kreiranje lažnih profila i manipulacija sistemom preuzimanja poslova.

* **Zaštita privatnosti (Access Control):** Uloga servisera je privilegovana jer omogućava uvid u lične podatke klijenata (PII - adrese i brojevi telefona). Administrativno odobrenje djeluje kao ljudski „firewall“, sprečavajući da se pristup tim informacijama dodjeljuje automatizovano. Time osiguravamo da osjetljivi podaci budu dostupni isključivo provjerenim i potvrđenim osobama.

* **Operativna kontrola i skalabilnost:** Sistem je dizajniran da kroz ovaj proces gradi čvrst Audit Trail. U slučaju bilo kakvog incidenta, platforma posjeduje neoboriv digitalni trag o tome ko je i kada odobrio pristup određenom serviseru. Dodatno, Document Management podsistem omogućava da arhitektura prati validnost stručnih potvrda, čime se sistem pozicionira kao profesionalan ekosistem koji garantuje standard usluge.

Ovim pristupom osiguravamo da platforma ne bude samo tehnički posrednik, već siguran i kontrolisan sistem koji štiti i klijente i ugled profesionalnih servisera.

---

## Odluka #004 - Podrška za više uloga po jednom korisniku

| Polje | Opis |
|-------|------|
| ID odluke | DLI-004 |
| Datum | 24.04.2026. |
| Kratak naziv odluke | Više uloga po korisniku |
| Opis problema ili pitanja | Da li korisnik treba imati jednu ili više uloga u sistemu? |
| Razmatrane opcije | 1. Jedna uloga po korisniku  2. Više naloga po korisniku  3. Više uloga po jednom nalogu |
| Odabrana opcija | Više uloga po jednom korisniku |
| Razlog izbora | Omogućavanje fleksibilnosti i pokrivanje realnih scenarija korištenja sistema |
| Posljedice odluke | Potrebna implementacija odabira aktivne uloge i role-based pristupa, povećana kompleksnost autentifikacije |
| Status odluke | aktivna |

### Detaljno obrazloženje

Sistem za upravljanje servisnim intervencijama obuhvata različite tipove korisnika, uključujući korisnike usluge, servisere, dispečere i administratore. U realnim situacijama, ista osoba može imati više uloga u različitim kontekstima. Na primjer, serviser koji pruža određene usluge može se naći u situaciji da mu je potrebna intervencija iz oblasti koja nije njegova specijalnost. U tom slučaju, isti korisnik mora imati mogućnost da djeluje kao korisnik usluge, bez potrebe za kreiranjem dodatnog naloga. Ako bi sistem podržavao samo jednu ulogu po korisniku, korisnici bi bili primorani da kreiraju više naloga, što bi dovelo do fragmentacije podataka, otežanog upravljanja i lošijeg korisničkog iskustva. Ovakvo ograničenje bi stvorilo tzv. “blind spot” u sistemu, odnosno situacije koje nisu adekvatno podržane i koje bi u praksi često nastajale, ali ne bi bile predviđene dizajnom sistema. Zbog toga je donesena odluka da jedan korisnik može imati više uloga, čime se sistem čini inkluzivnijim i otvorenijim za različite scenarije korištenja. Ovaj pristup omogućava da se realne životne situacije modeliraju bez umjetnih ograničenja. Korisnik pri prijavi bira aktivnu ulogu kroz koju koristi sistem, a po potrebi može promijeniti ulogu, čime se postiže fleksibilnost uz zadržavanje jasne kontrole pristupa. Ova odluka povećava kompleksnost implementacije, ali značajno unapređuje skalabilnost i realnu primjenjivost sistema.

---

## Odluka #005 - Korisnik koristi sistem kroz jednu aktivnu ulogu

| Polje | Opis |
|-------|------|
| ID odluke | DLI-005 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Aktivna uloga kao kontekst rada |
| Opis problema ili pitanja | Kako organizovati rad korisnika koji posjeduje više uloga unutar jedne sesije? |
| Razmatrane opcije | 1. Istovremeno korištenje svih uloga 2. Rad kroz jednu eksplicitno odabranu aktivnu ulogu |
| Odabrana opcija | Jedna aktivna uloga u datom trenutku |
| Razlog izbora | Jasnoća interfejsa, smanjenje kognitivnog opterećenja i očuvanje integriteta sesije |
| Posljedice odluke | Potrebna implementacija mehanizma za odabir i promjenu uloge (role switcher) |
| Status odluke | aktivna |

### Detaljno obrazloženje

Istovremeno korištenje više uloga bi dovelo do konflikta u pristupu funkcionalnostima i značajno povećalo kompleksnost interfejsa. Različite uloge podrazumijevaju različite kontekste rada, a njihovo kombinovanje bi rezultiralo prenatrpanim i nejasnim korisničkim okruženjem. Uvođenjem jedne aktivne uloge u datom trenutku postiže se jasan kontekst interakcije sa sistemom, čime se smanjuje mogućnost grešaka i poboljšava upotrebljivost. Ovaj pristup dodatno sprječava situacije u kojima korisnik nenamjerno izvršava akcije u pogrešnom kontekstu, čime se povećava sigurnost i pouzdanost sistema.

Kao solution arhitekti, ovu odluku definišemo kao strategiju upravljanja stanjem (State Management) koja osigurava procesnu čistoću kroz sljedeće aspekte:

* **Kontekstualni integritet (Context Awareness):** Svaka uloga predstavlja odvojen poslovni domen. Arhitektura frontenda se oslanja na "aktivni kontekst", što omogućava *Separation of Concerns*. Time se izbjegava preopterećenje memorije klijenta učitavanjem nepotrebnih modula i API ruta koji nisu relevantni za trenutni radni tok, čime se optimizuju performanse aplikacije.

* **Session Scoping i ACL:** Aktivna uloga služi kao primarni filter za autorizaciju. Backend middleware ne provjerava samo statična prava korisnika, već i njihovu validnost unutar trenutno aktivnog opsega (scope). Ovo drastično smanjuje rizik od IDOR napada i osigurava precizan *Audit Trail* – svaki sistemski log sadrži informaciju o tome u kojem je tačno kapacitetu akcija izvršena.

* **Eliminacija logičkih paradoksa:** Uvođenjem jedne aktivne uloge sprječavamo konflikt interesa. Na primjer, onemogućava se situacija u kojoj korisnik pokušava istovremeno djelovati kao podnosilac zahtjeva i izvršilac (serviser) na istom nalogu, čime se štite poslovna pravila i integritet workflow-a.

* **Dynamic Entry Point:** Sistem omogućava dinamičko serviranje dashboarda. Umjesto hibridnih rješenja koja bi kompromitovala UX, arhitektura podržava specifične ulazne tačke, omogućavajući korisniku da se fokusira isključivo na alate potrebne za trenutnu ulogu, bilo da je to rad na terenu ili administracija sistema.

Ovakav dizajn osigurava visoku skalabilnost jer omogućava dodavanje novih, kompleksnih uloga u budućnosti bez narušavanja postojeće navigacione logike ili sigurnosnih protokola.

---

## Odluka #006 - Role-based navigacija i preusmjeravanje korisnika

| Polje | Opis |
|-------|------|
| ID odluke | DLI-006 |
| Datum | 27.04.2026. |
| Kratak naziv odluke | Role-based navigacija i preusmjeravanje |
| Opis problema ili pitanja | Kako usmjeriti korisnika kroz sistem nakon registracije i prijave, na način koji je u skladu s njegovom ulogom i odgovornostima, uz očuvanje efikasnosti i jasnoće korisničkog toka? |
| Razmatrane opcije | 1. Jedinstven (univerzalni) dashboard za sve korisnike 2. Ručni odabir stranica bez kontrole 3. Automatsko preusmjeravanje prema ulozi uz mogućnost izbora |
| Odabrana opcija | Automatsko preusmjeravanje prema ulozi s mogućnošću izbora aktivne uloge |
| Razlog izbora | Osigurava jasnoću u korisničkom toku, povećava efikasnost i pruža personalizovano iskustvo rada unutar sistema |
| Posljedice odluke | Potrebna implementacija role-based navigacije, zaštite ruta i modularne arhitekture dashboarda |
| Status odluke | aktivna |

### Detaljno obrazloženje

U sistemima koji podržavaju više tipova korisnika poput administratora, servisera, korisnika usluge i menadžera, svaki tip ima različite potrebe, odgovornosti i očekivanja od interfejsa. Primjena jedinstvenog dashboarda za sve korisnike često dovodi do preklapanja funkcionalnosti, zbunjujućeg korisničkog iskustva i većeg rizika od grešaka, jer korisnici vidi opcije koje nisu relevantne ili za koje nemaju ovlaštenje. Da bi se osigurala jasnoća i relevantnost interfejsa, odlučeno je da se nakon autentifikacije korisnik automatski preusmjerava na dashboard koji odgovara njegovoj aktivnoj ulozi. U slučaju da korisnik posjeduje više uloga (npr. istovremeno je i serviser i korisnik usluge), sistem mu nudi mogućnost izbora aktivne uloge prije inicijalnog preusmjeravanja. Ovim pristupom postiže se ravnoteža između automatizacije (sistem zna gdje korisnika treba odvesti) i fleksibilnosti (korisnik zadržava kontrolu nad svojim kontekstom rada).

Takva arhitektura omogućava sljedeće:

* **Efikasnost:** korisnik odmah dolazi do funkcionalnosti koje su mu relevantne. Serviser vidi otvorene radne naloge, korisnik usluge praćenje svojih zahtjeva, a administrator nadzorne i konfiguracione panele. 

* **Personalizacija i sigurnost:** prikaz i dozvole su usklađene s korisničkom ulogom, čime se smanjuje površina potencijalnih grešaka i rizika od neovlaštenog pristupa.

* **Skalabilnost:** sistem može lako dodavati nove uloge ili poslovne procese, jer je navigacija temeljena na jasno definisanim pravilima i odvojenim modulima.

* **Pozitivno korisničko iskustvo:** ovakav tok stvara percepciju pametnog, prilagođenog sistema koji “razumije” korisnika i vodi ga kroz procese bez nepotrebnog opterećenja.

*Implementacijom role-based navigacije i preusmjeravanja, sistem stiče jasno definisanu strukturu, postaje intuitivniji i spreman za daljnji rast bez gubitka konzistentnosti. Ova odluka stoga ne predstavlja samo tehničko rješenje, već stratešku usmjerenost ka uspostavljanju korisničkog toka koji logično odražava poslovne procese i organizacionu hijerarhiju.*

---

## Odluka #007 - Neutralne poruke greške pri loginu

| Polje | Opis |
|-------|------|
| ID odluke | DLI-007 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Neutralne poruke greške pri autentifikaciji |
| Opis problema ili pitanja | Kako komunicirati neuspješnu prijavu bez otkrivanja osjetljivih sistemskih informacija? |
| Razmatrane opcije | 1. Specifične poruke (npr. "Korisnik ne postoji") 2. Neutralne poruke (npr. "Neispravni podaci") |
| Odabrana opcija | Neutralne poruke |
| Razlog izbora | Prevencija eksploatacije korisničkih podataka i povećanje nivoa sigurnosti |
| Posljedice odluke | Manja preciznost u povratnoj informaciji za legitimnog korisnika |
| Status odluke | aktivna |

### Detaljno obrazloženje

Odluka o korištenju neutralnih poruka direktno sprečava **User Enumeration** napade. Specifične poruke o greškama, poput „Email ne postoji“ ili „Pogrešna lozinka“, omogućavaju napadačima da kroz automatizovane skripte testiraju baze email adresa i precizno mapiraju koji stvarni korisnici imaju nalog u sistemu. Identifikacija validnog emaila je prvi korak u svakom napadu, a neutralnim odgovorom ta faza postaje nemoguća jer napadač nikada ne dobija potvrdu o postojanju naloga. Ovaj pristup je ključni dio **Defense in Depth** (slojevite odbrane) strategije. Neutralna poruka „Neispravan email ili lozinka“ stvara informacijsku asimetriju u korist sistema. Napadač ne zna koji dio kredencijala treba mijenjati, što eksponencijalno povećava vrijeme i resurse potrebne za bilo kakav pokušaj provale. Ova mjera se nadovezuje na ostale zaštite poput ograničenja broja pokušaja, osiguravajući da login forma ne bude najslabija tačka ulaza. **Konzistentnost API odgovora** je obavezna na svim nivoima kako bi se izbjegli suptilni tragovi. Sistem mora vraćati identičan HTTP statusni kod (401 Unauthorized) i uniformnu strukturu podataka, bez obzira na to da li je pogrešan email, lozinka ili oboje. Čak i vrijeme odgovora servera mora biti ujednačeno; bez vještačkog ujednačavanja vremena obrade, napadač bi mogao mjeriti milisekunde (timing attack) i zaključiti da sistem brže odbija nepostojeće mailove nego što provjerava lozinke postojećih. Postignut je **balans kroz UX podršku** kako bi se ublažila smanjena informativnost za stvarne korisnike, umjesto otkrivanja statusa naloga na login formi, sistem nudi jasno vidljiv i siguran tok za oporavak lozinke. Na taj način, legitimni korisnik koji je zaboravio podatke ima jasan put do svog naloga, dok napadač ostaje bez ikakvog povratnog signala o strukturi baze korisnika. Ovim se postiže maksimalna sigurnost bez žrtvovanja funkcionalnosti za stvarne korisnike.

---

## Odluka #008 - Upravljanje sesijom korisnika

| Polje | Opis |
|-------|------|
| ID odluke | DLI-008 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Hibridni pristup upravljanju sesijom |
| Opis problema | Kako efikasno upravljati autentifikacijom i stanjem korisnika kroz cijeli sistem? |
| Razmatrane opcije | 1. Isključivo client-side (Stateless - npr. JWT) 2. Isključivo server-side (Stateful - npr. Session Cookies) 3. Hibridni pristup |
| Odabrana opcija | Hibridni pristup |
| Razlog izbora | Optimalan balans između sigurnosne kontrole i sistemskih performansi |
| Posljedice odluke | Implementirana kompleksnija logika koja zahtijeva sinhronizaciju servera i klijenta |
| Status odluke | aktivna |

### Detaljno obrazloženje

Hibridni pristup upravljanju sesijom odabran je kako bi se eliminisali nedostaci pojedinačnih modela uz zadržavanje njihovih prednosti. Dok čisti *server-side* modeli opterećuju bazu podataka pri svakom zahtjevu, a čisti *client-side* modeli otežavaju trenutnu invalidaciju sesije, hibridni model omogućava **visoku skalabilnost i preciznu kontrolu**. Jedan od ključnih faktora je **sigurnost i momentalna opozivost pristupa**. U sistemu gdje administratori moraju imati mogućnost da odmah prekinu pristup korisniku (npr. u slučaju suspenzije servisera ili detekcije napada), čisti klijentski tokeni (JWT) su neprikladni jer ostaju validni do svog isteka. Hibridni model koristi kratkotrajne tokene na klijentu, ali zadržava referencu sesije na serveru (npr. u Redis-u), omogućavajući sistemu da u milisekundi invalidira bilo koju sesiju bez čekanja da klijentski token istekne. **Performanse i responzivnost (UX)** značajno su poboljšane jer se dio stanja sesije čuva na klijentu. To omogućava aplikaciji da trenutno reaguje na korisničke akcije i renderuje interfejs bez čekanja na validaciju svake rute od strane servera. Na ovaj način se drastično smanjuje mrežni saobraćaj i opterećenje glavne baze podataka, jer se validacija prava pristupa (ACL) vrši primarno kroz brze *cache* slojeve na serveru, dok klijent drži neosjetljive podatke potrebne za UI/UX. Ova odluka rješava i problem **sinhronizacije stanja kroz više uređaja**. Hibridni model omogućava korisniku da bude prijavljen na telefonu i računaru istovremeno, uz centralizovanu kontrolu na serveru. Ako korisnik promijeni aktivnu ulogu na jednom uređaju, server može sinhronizovati to stanje kroz sve aktivne klijentske instance. Time se osigurava konzistentnost podataka i sprječavaju situacije u kojima korisnik vidi zastarjele informacije o svojim ovlaštenjima ili statusu zahtjeva. Konačno, implementacijom ovog modela postignuta je **robousnost protiv Session Hijacking napada**. Koristeći sigurne, HTTP-only i Secure cookie-je za čuvanje sesijskih identifikatora, uz klijentski state management za operativne podatke, smanjujemo površinu napada. Čak i u slučaju kompromitacije klijentskog dijela memorije, napadač ne može lako preuzeti punu kontrolu nad sesijom jer se kritična logika validacije i dalje izvršava na serveru uz strogu provjeru integriteta.

---

## Odluka #009 - Zaštita ruta na osnovu autentifikacije i uloge

| Polje | Opis |
|-------|------|
| ID odluke | DLI-009 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Višeslojna zaštita ruta |
| Opis problema | Kako spriječiti neovlašten pristup privatnim dijelovima sistema i osjetljivim podacima? |
| Razmatrane opcije | 1. Osnovna zaštita (samo autentifikacija) 2. Napredna Role-based zaštita sa više slojeva |
| Odabrana opcija | Role-based zaštita sa više slojeva |
| Razlog izbora | Maksimalna sigurnost podataka i precizna kontrola pristupa |
| Posljedice odluke | Obavezna implementacija Middleware slojeva na klijentskoj i serverskoj strani |
| Status odluke | aktivna |

### Detaljno obrazloženje

Zaštita ruta implementirana je kroz višeslojni pristup koji uključuje rigoroznu provjeru autentifikacije i trenutno aktivne uloge korisnika. Ova odluka direktno rješava problem potencijalnih sigurnosnih propusta gdje bi puko postojanje sesije (autentifikacija) bilo dovoljno za pristup bilo kojem dijelu sistema. Uvođenjem **Role-based kontrole (RBAC)**, sistem osigurava da korisnik može pristupiti samo onim resursima koji su eksplicitno dozvoljeni za njegovu trenutno aktivnu ulogu, čime se drastično smanjuje površina napada.

Ovaj pristup predstavlja suštinu **Defense in Depth** strategije. Sigurnost se ne oslanja na jedan izolovani mehanizam, već na sinergiju provjera:
* **Frontend zaštita (Client-side Guards):** Služi kao prva linija odbrane koja filtrira UI navigaciju. Korisniku se onemogućava da fizički vidi ili pristupi rutama koje mu ne pripadaju (npr. serviser ne može pristupiti administratorskom panelu čak ni direktnim unosom URL-a). Ovo značajno poboljšava korisničko iskustvo (UX) sprečavanjem zabuna, ali se ne smatra dovoljnim sa sigurnosnog aspekta jer se klijentska logika može zaobići.
* **Backend Middleware (Server-side Enforcement):** Ovo je kritična tačka sigurnosti. Svaki API zahtjev koji klijent uputi prema serveru prolazi kroz middleware koji validira sesiju i autorizaciju za traženi resurs. Ako korisnik pokuša "napasti" sistem direktnim pozivanjem API endpointa za koje nema dozvolu, server odbija zahtjev bez otkrivanja podataka.

Jedan od ključnih argumenata za ovu odluku je prevencija **Broken Access Control** ranjivosti, koje su redovno na vrhu liste sigurnosnih rizika (OWASP Top 10). Čak i ako korisnik sazna za postojanje određene rute ili administrativnog alata, višeslojna zaštita osigurava da je svaki pristup izolovan unutar strogo definisanih "dozvola" aktivne uloge. To eliminiše rizik od *Insecure Direct Object Reference (IDOR)* napada, gdje bi napadač modifikacijom parametara u URL-u pokušao pristupiti podacima drugih korisnika ili sistemskim postavkama. Ovakva arhitektura omogućava **visoku modularnost i skalabilnost**. Kako sistem raste i uvode se nove uloge (npr. vanjski revizori ili regionalni menadžeri), novi setovi pravila se jednostavno integrišu u postojeće middleware slojeve, time se osigurava da svaki novi modul automatski nasljeđuje definisani sigurnosni standard, čineći sistem robusnim protiv neovlaštenih upada i grešaka u konfiguraciji pristupa.

---

## Odluka #010 - Odjava korisnika prekida pristup sistemu

| Polje | Opis |
|-------|------|
| ID odluke | DLI-010 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Potpuna invalidacija sesije pri odjavi |
| Opis problema | Kako osigurati da sesija postane trajno neupotrebljiva nakon što korisnik zatraži odjavu? |
| Razmatrane opcije | 1. Client-side odjava (samo brisanje lokalnih podataka) 2. Potpuna invalidacija sesije na serveru i klijentu |
| Odabrana opcija | Potpuna invalidacija sesije |
| Razlog izbora | Sigurnost i sprječavanje zloupotrebe aktivnih tokena |
| Posljedice odluke | Potrebna implementacija serverskog mehanizma za uništavanje sesijskih podataka |
| Status odluke | aktivna |

### Detaljno obrazloženje

Jednostavno brisanje lokalnih podataka na klijentskoj strani (npr. uklanjanje tokena iz *Local Storage-a* ili brisanje *Cookie-ja*) nije dovoljno za sigurnu odjavu korisnika. Takav pristup samo vizuelno uklanja korisnika iz aplikacije, dok na serverskoj strani sesija tehnički ostaje validna sve do prirodnog isteka (*TTL - Time To Live*). Odluka o potpunoj invalidaciji sesije osigurava da se proces odjave tretira kao kritična sigurnosna operacija koja se mora potvrditi i izvršiti na nivou servera. Ovim pristupom se direktno sprječavaju **Session Replay** napadi i zloupotreba ukradenih sesijskih identifikatora. Ako bi se oslonili isključivo na klijentsku odjavu, napadač koji je prethodno uspio presresti važeći token mogao bi nastaviti koristiti sistem u ime korisnika, bez obzira na to što se legitimni korisnik "odjavio". Forsiranjem serverske invalidacije, svaki pokušaj ponovne upotrebe tog tokena biva trenutno odbijen jer sistem više ne prepoznaje taj identifikator kao aktivan u svojoj bazi ili *cache* sloju. Konzistentnost stanja sistema postignuta je kroz **obaveznu komunikaciju klijenta i servera tokom logout-a**. Prilikom klika na odjavu, sistem šalje zahtjev backendu koji momentalno briše sesiju iz memorije (npr. Redis-a ili baze podataka). Tek nakon potvrde sa servera, klijentska aplikacija čisti lokalni *state*. Ovo osigurava da se korisnik ne može naći u "međustanju" gdje misli da je siguran, dok su njegovi resursi i dalje otvoreni za pristup. Ovaj model je od posebnog značaja za **javne i dijeljene uređaje**, koje često koriste serviseri na terenu ili administratori u uredima. Potpuna invalidacija garantuje da sljedeća osoba koja koristi isti uređaj ne može, upotrebom *back* dugmeta u browseru ili ekstrakcijom podataka iz memorije, pristupiti prethodnoj sesiji. Ovim se postiže najviši nivo zaštite integriteta podataka i usklađenost sa sigurnosnim preporukama (poput OWASP standarda) koje nalažu da odjava mora biti "skupa" operacija koja garantuje nepovratni prekid autorizacije. 

---

## Odluka #011 - Početni dashboard zavisi od aktivne uloge

| Polje | Opis |
|-------|------|
| ID odluke | DLI-011 |
| Datum | 25.04.2026. |
| Kratak naziv odluke | Namjenski dashboard prema aktivnoj ulozi |
| Opis problema | Kako korisniku prikazati kritične informacije bez preopterećenja interfejsa nebitnim podacima? |
| Razmatrane opcije | 1. Jedinstveni (univerzalni) dashboard za sve 2. Specifični dashboard za svaku pojedinačnu ulogu |
| Odabrana opcija | Role-based dashboard |
| Razlog izbora | Povećanje operativne efikasnosti i drastično smanjenje kognitivnog opterećenja |
| Posljedice odluke | Potreban razvoj modularnih UI komponenti za različite tipove prikaza |
| Status odluke | aktivna |

### Detaljno obrazloženje

Različite korisničke uloge unutar sistema zahtijevaju radikalno različite setove informacija i funkcionalnosti kako bi obavljale svoje primarne zadatke. Prikaz univerzalnog dashboarda bi neizbježno doveo do pojave „šuma“ u interfejsu (UI clutter), gdje bi korisnici bili prisiljeni vizuelno filtrirati gomilu nebitnih podataka. Odlukom o implementaciji **Role-based dashboarda**, postižemo da interfejs direktno reflektuje radni kontekst korisnika, čime se eliminira potreba za nepotrebnom navigacijom kroz sistem. Ovaj pristup direktno smanjuje **kognitivno opterećenje** korisnika. Na primjer, serviseru na terenu je u fokusu geografska lokacija kvara, hitnost intervencije i tehnički detalji opreme, dok je administratoru fokus na statistici sistema, upravljanju nalozima i logovima. Serviranjem isključivo relevantnih informacija, sistem omogućava korisniku da brže donosi odluke i reaguje na promjene, što direktno utiče na ključne metrike uspješnosti sistema poput *Mean Time to Repair (MTTR)*. Sa stanovišta **operativne efikasnosti i preciznosti**, namjenski dashboard služi kao "kontrolni toranj" koji minimizira mogućnost grešaka. Kada korisnik vidi samo opcije koje su mu u tom trenutku dozvoljene i potrebne, rizik od slučajnog aktiviranja pogrešnih funkcija svodi se na minimum. Time se postiže visok stepen **intuitivnosti sistema**, jer dashboard postaje personalizovani alat koji "predviđa" sljedeći korak korisnika na osnovu njegove odgovornosti u poslovnom procesu. Arhitektonski, ova odluka podržava **modularnost i budući rast platforme**. Umjesto kreiranja jedne masivne, kompleksne stranice koja bi s vremenom postala neodrživa, sistem je dizajniran kroz set specifičnih modula (widgets). To omogućava lako dodavanje novih uloga ili modifikaciju postojećih dashboarda bez rizika od narušavanja iskustva ostalih korisnika. Ovim se postiže skalabilnost na UI nivou, osiguravajući da sistem ostane čist, pregledan i profesionalan bez obzira na rastuću kompleksnost backend procesa.

---

## Odluka #012 - Korisnik ne određuje prioritet zahtjeva

| Polje | Opis |
|-------|------|
| ID odluke | DLI-012 |
| Datum | 27.04.2026. |
| Kratak naziv odluke | Ograničenje određivanja prioriteta |
| Opis problema ili pitanja | Da li korisniku omogućiti da prilikom prijave zahtjeva sam odredi prioritet? |
| Razmatrane opcije | 1. Korisnik određuje prioritet  2. Sistem automatski određuje  3. Prioritet se određuje u kasnijoj fazi obrade |
| Odabrana opcija | Korisnik ne određuje prioritet |
| Razlog izbora | Očuvanje tačnosti i konzistentnosti podataka |
| Posljedice odluke | Prioritet se uklanja iz korisničke forme i ostavlja za kasniju obradu |
| Status odluke | aktivna |

### Detaljno obrazloženje

Korisnici koji prijavljuju zahtjeve za servisnu intervenciju u pravilu nemaju dovoljno informacija niti stručnog znanja da bi mogli realno procijeniti hitnost problema. Omogućavanje korisniku da sam određuje prioritet dovelo bi do čestog precjenjivanja važnosti vlastitog zahtjeva, što bi rezultiralo nepouzdanim podacima i otežalo organizaciju rada sistema. Zbog toga je donesena odluka da se korisniku ne omogući određivanje prioriteta prilikom unosa zahtjeva. Time se izbjegava unošenje subjektivnih i nepouzdanih informacija u sistem. Prioritet se u ovom modelu ostavlja kao dio poslovne logike koja se obrađuje u kasnijoj fazi, na osnovu dodatnih informacija i šireg konteksta sistema. Ovaj pristup doprinosi većoj konzistentnosti podataka, boljoj organizaciji procesa i pouzdanijem donošenju odluka unutar sistema.



