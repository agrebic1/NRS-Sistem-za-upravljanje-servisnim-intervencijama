# Decision Log


## Odluka #001 - Centralizovana landing stranica sa više ulaznih tokova

| Polje | Opis |
|-------|------|
| ID odluke | DLI-001 |
| Datum | 25.04.2026. |
| Kratak naziv odluke | Landing page kao centralna ulazna tačka |
| Opis problema | Kako organizovati ulaz u sistem za različite tipove korisnika? |
| Razmatrane opcije | 1. Direktan pristup login/registraciji <br> 2. Više odvojenih ulaznih stranica <br> 3. Jedna centralna landing stranica sa izborom |
| Odabrana opcija | Centralna landing stranica sa više opcija |
| Razlog izbora | Jednostavnije korisničko iskustvo i jasna struktura ulaza u sistem |
| Posljedice odluke | Potrebno definisati više korisničkih tokova sa jedne početne stranice |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Jasnoća korisničkog toka | 5 |
| UX / jednostavnost | 5 |
| Skalabilnost ulaznih tokova | 4 |
| Održivost frontend strukture | 4 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Jasnoća toka | UX | Skalabilnost | Održivost | Kompleksnost | Ukupno |
|--------|--------------|----|--------------|-----------|--------------|--------|
| Direktan pristup login/registraciji | 3 | 3 | 2 | 3 | 5 | 62 |
| Više odvojenih ulaznih stranica | 2 | 2 | 3 | 2 | 3 | 43 |
| Centralna landing stranica sa izborom | 5 | 5 | 5 | 5 | 4 | **95** |

### Sažetak odluke

Krajnja odluka: **Centralna landing stranica sa izborom**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Centralizuje ulaz u sistem i korisniku jasno nudi odgovarajući tok |
| Prednosti | Bolji UX, manje konfuzije, jasna struktura i lakše proširenje sistema |
| Nedostaci | Potrebno pažljivo dizajnirati početnu stranicu i tokove nakon odabira |
| Napomena | Landing stranica postaje centralni UX element sistema |
| Implementacija | Početna stranica nudi odvojene tokove za registraciju korisnika, prijavu i prijavu interesa za pružanje usluga |

### Detaljno obrazloženje

Sistem za upravljanje servisnim intervencijama obuhvata različite tipove korisnika koji dolaze u sistem sa različitim ciljevima. Neki korisnici žele koristiti usluge, neki već imaju nalog i žele se prijaviti, dok drugi žele postati pružatelji usluga na platformi. Ako bi se svi ovi tokovi razdvojili na više ulaznih stranica, korisnici bi morali unaprijed znati gdje trebaju ići, što bi povećalo konfuziju i otežalo korištenje sistema. Zbog toga je odabrana centralna landing stranica kao jedinstvena ulazna tačka u sistem. Na toj stranici korisniku se jasno nude osnovni tokovi:

- registracija za korisnike koji žele koristiti usluge
- prijava u sistem za postojeće korisnike
- prijava interesa za pružanje usluga za korisnike koji žele postati serviseri

Ovim pristupom sistem postaje intuitivniji i pristupačniji, jer korisnik odmah na početku bira tok koji odgovara njegovoj namjeri. Centralna landing stranica omogućava veću fleksibilnost i inkluzivnost sistema, jer podržava različite tipove korisnika i njihove potrebe bez komplikovane navigacije. Ova odluka direktno utiče na strukturu frontend-a, jer definiše landing stranicu kao centralni UX element i polaznu tačku svih korisničkih tokova u aplikaciji.

---

## Odluka #002 - Javna registracija kreira samo korisnika usluge

| Polje | Opis |
|-------|------|
| ID odluke | DLI-002 |
| Datum | 26.04.2026. |
| Kratak naziv odluke | Ograničenje registracije |
| Opis problema | Da li omogućiti slobodnu registraciju za sve uloge u sistemu? |
| Razmatrane opcije | 1. Slobodna registracija za sve uloge <br> 2. Registracija samo za korisnike usluge <br> 3. Potpuno zatvoren sistem |
| Odabrana opcija | Javna registracija samo za korisnike usluge |
| Razlog izbora | Balans između dostupnosti sistema i sigurnosnog okvira |
| Posljedice odluke | Operativne uloge se dodjeljuju kroz kontrolisan proces |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Sigurnost sistema | 5 |
| Dostupnost (ease of entry) | 5 |
| Kontrola nad ulogama | 4 |
| Rizik zloupotrebe | 5 |
| Operativna kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Sigurnost | Dostupnost | Kontrola | Rizik zloupotrebe | Kompleksnost | Ukupno |
|--------|----------|------------|----------|-------------------|--------------|--------|
| Slobodna registracija za sve uloge | 2 | 5 | 1 | 1 | 4 | 54 |
| Registracija samo za korisnike usluge | 5 | 5 | 5 | 4 | 4 | **96** |
| Potpuno zatvoren sistem | 5 | 1 | 5 | 5 | 2 | 74 |

### Sažetak odluke

Krajnja odluka: **Registracija samo za korisnike usluge**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Omogućava brz ulaz krajnjim korisnicima uz zadržavanje sigurnosti sistema |
| Prednosti | Manji rizik zloupotrebe, kontrola operativnih uloga, bolji balans sigurnosti i UX-a |
| Nedostaci | Potreban dodatni proces za dodjelu naprednih uloga |
| Napomena | Operativne uloge (admin, serviser, dispečer) ne smiju biti javno dostupne |
| Implementacija | Registracija kreira samo "basic user", dok se ostale uloge dodjeljuju kroz backend procese ili administraciju |

### Detaljno obrazloženje

U kontekstu ovog sistema, krajnji korisnici često pristupaju platformi u stanju povećanog stresa, sa jasnom potrebom za hitnim rješavanjem problema. Uvođenje dodatnih koraka verifikacije u procesu registracije bi značajno povećalo barijeru ulaska i direktno uticalo na stopu odustajanja. Svaki dodatni korak između korisnika i funkcionalnosti sistema predstavlja potencijalni gubitak korisnika. Zbog toga je omogućena brza i jednostavna javna registracija za korisnike usluge, čime se obezbjeđuje instant pristup sistemu u kritičnim trenucima. Istovremeno, operativne uloge poput servisera, dispečera i administratora imaju pristup osjetljivim podacima i internim operacijama sistema. Omogućavanje javne registracije za ove uloge bi otvorilo prostor za zloupotrebe, kreiranje lažnih naloga, neovlašten pristup sistemu, potencijalno curenje podataka. Zbog toga je uveden jasan sigurnosni model u kojem javni sloj (end-user) ostaje otvoren i jednostavan, aoperativni sloj je strogo kontrolisan. Operativne uloge se dodjeljuju kroz administrativni proces, verifikaciju i onboarding procedure. Na ovaj način postiže se optimalan balans između dostupnosti sistema i sigurnosti i kontrole pristupa. Sistem ostaje pristupačan korisnicima kojima je potreban, ali zaštićen od zloupotreba u kritičnim dijelovima funkcionalnosti.

---

## Odluka #003 - Serviseri prolaze proces prijave i odobrenja

| Polje | Opis |
|-------|------|
| ID odluke | DLI-003 |
| Datum | 26.04.2026. |
| Kratak naziv odluke | Serviser onboarding |
| Opis problema | Kako omogućiti pristup ulozi servisera? |
| Razmatrane opcije | 1. Slobodna registracija <br> 2. Prijava i administrativno odobrenje <br> 3. Administrativno kreiranje naloga (ručni onboarding od strane sistema)|
| Odabrana opcija | Prijava i administrativno odobrenje |
| Razlog izbora | Kontrola kvaliteta i pravna usklađenost |
| Posljedice odluke | Uveden kontrolisani onboarding proces sa administracivnom verifikacijom i staging zonom prijave aktivacije |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

Kriteriji su ponderisani u skladu sa potrebom za fleksibilnošću, skalabilnošću i kvalitetom korisničkog iskustva.

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Sigurnost i kontrola kvaliteta | 5 |
| Skalabilnost | 4 |
| Brzina onboardinga | 3 |
| Operativni trošak | 3 |
| UX | 3 |

### Ocjenjivanje i rezultat

| Opcija | Sigurnost | Skalabilnost | Brzina | Trošak | UX | Ukupno |
|--------|----------|--------------|--------|--------|-----|--------|
| Slobodna registracija | 1 | 5 | 5 | 5 | 5 | 66 |
| Prijava i administrativno odobrenje | 5 | 4 | 3 | 3 | 3 | **77** |
| Ručni unos | 5 | 1 | 2 | 1 | 2 | 49 |

### Sažetak odluke

Krajnja odluka: **Prijava i administrativno odobrenje** 
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Najbolji balans sigurnosti, skalabilnosti i operativne kontrole |
| Prednosti | Visoka kontrola kvaliteta, zaštita sistema, audit trail |
| Nedostaci | Sporiji onboarding, potreban administrativni rad |
| Napomena | Ručni unos koristiti samo kao izuzetak (partneri, hitni slučajevi) |
| Implementacija | Sistem predviđa staging zonu u kojoj profil čeka validaciju prije aktivacije |

### Detaljno obrazloženje

Serviseri su ključna karika sistema čiji rad direktno utiče na kredibilitet cijele platforme. Slobodna registracija bi omogućila neprovjerenim profilima pristup radnim nalozima, što bi neminovno dovelo do pada kvaliteta i gubitka povjerenja korisnika. Kako bi sistem ostao pouzdan, uveden je proces verifikacije koji služi kao filter za osiguranje stručnosti unutar mreže saradnika.

Ova odluka je ključna iz tri strateška razloga:

* **Integritet identiteta (Trust Security):** U sistemu koji spaja digitalnu platformu sa fizičkim prostorom korisnika, identitet servisera je nulti faktor sigurnosti. Implementacijom „staging“ zone unutar sistema u kojoj profil čeka validaciju dokumenata i stručnosti prije aktivacije, sprječava se kreiranje lažnih profila i manipulacija sistemom preuzimanja poslova.

* **Zaštita privatnosti (Access Control):** Uloga servisera je privilegovana jer omogućava uvid u lične identifikacione podatke klijenata (adrese i brojevi telefona). Administrativno odobrenje djeluje kao kontrolni mehanizam za pristup osjetljivim podacima, sprečavajući da se pristup tim informacijama dodjeljuje automatizovano. Time osiguravamo da osjetljivi podaci budu dostupni isključivo provjerenim i potvrđenim osobama.

* **Operativna kontrola i skalabilnost:** Sistem je dizajniran da kroz ovaj proces gradi čvrst Audit Trail. U slučaju bilo kakvog incidenta, platforma posjeduje neoboriv digitalni trag o tome ko je i kada odobrio pristup određenom serviseru. Dodatno, Document Management podsistem omogućava da arhitektura prati validnost stručnih potvrda, čime se sistem pozicionira kao profesionalan ekosistem koji garantuje standard usluge.

Ovim pristupom osiguravamo da platforma ne bude samo tehnički posrednik, već siguran i kontrolisan sistem koji štiti i klijente i ugled profesionalnih servisera. Ova odluka predstavlja temelj za skalabilan i siguran rad platforme.

---

## Odluka #004 - Podrška za više uloga po jednom korisniku

| Polje | Opis |
|-------|------|
| ID odluke | DLI-004 |
| Datum | 24.04.2026. |
| Kratak naziv odluke | Više uloga po korisniku |
| Opis problema ili pitanja | Da li korisnik treba imati jednu ili više uloga u sistemu? |
| Razmatrane opcije | 1. Jedna uloga po korisniku <br> 2. Više naloga po korisniku <br> 3. Više uloga po jednom nalogu |
| Odabrana opcija | Više uloga po jednom korisniku |
| Razlog izbora | Omogućavanje fleksibilnosti i pokrivanje realnih scenarija korištenja sistema |
| Posljedice odluke | Potrebna implementacija odabira aktivne uloge i role-based pristupa, povećana kompleksnost autentifikacije |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

Kriteriji su ponderisani u skladu sa potrebom za fleksibilnošću, skalabilnošću i kvalitetom korisničkog iskustva.

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Fleksibilnost (realni scenariji) | 5 |
| UX / jednostavnost | 4 |
| Skalabilnost | 4 |
| Sigurnost / kontrola pristupa | 4 |
| Operativna kompleksnost | 3 |


### Ocjenjivanje i rezultat

| Opcija | Fleksibilnost | UX | Skalabilnost | Sigurnost | Kompleksnost | Ukupno |
|--------|--------------|----|--------------|-----------|--------------|--------|
| Jedna uloga po korisniku | 1 | 4 | 4 | 5 | 5 | 62 |
| Više naloga po korisniku | 3 | 2 | 2 | 4 | 2 | 43 |
| Više uloga po jednom nalogu | 5 | 4 | 4 | 4 | 3 | **75** |

### Sažetak odluke

Krajnja odluka: **Više uloga po jednom nalogu**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Najbolji balans fleksibilnosti, UX-a i skalabilnosti |
| Prednosti | Prirodno modeliranje realnih scenarija, bolji UX, nema fragmentacije podataka |
| Nedostaci | Veća kompleksnost implementacije i kontrole pristupa |
| Napomena | Potrebno jasno definisati aktivnu ulogu i RBAC pravila |
| Implementacija | Sistem omogućava više uloga po korisniku uz izbor jedne aktivne uloge po sesiji |

### Detaljno obrazloženje

Sistem za upravljanje servisnim intervencijama obuhvata različite tipove korisnika, uključujući korisnike usluge, servisere, dispečere i administratore. U realnim situacijama, ista osoba može imati više uloga u različitim kontekstima. Na primjer, serviser koji pruža određene usluge može se naći u situaciji da mu je potrebna intervencija iz oblasti koja nije njegova specijalnost. U tom slučaju, isti korisnik mora imati mogućnost da djeluje kao korisnik usluge, bez potrebe za kreiranjem dodatnog naloga. Ako bi sistem podržavao samo jednu ulogu po korisniku, korisnici bi bili primorani da kreiraju više naloga, što bi dovelo do fragmentacije podataka, otežanog upravljanja i lošijeg korisničkog iskustva. Ovakvo ograničenje bi stvorilo tzv. “blind spot” u sistemu, odnosno situacije koje nisu adekvatno podržane i koje bi u praksi često nastajale, ali ne bi bile predviđene dizajnom sistema. Zbog toga je donesena odluka da jedan korisnik može imati više uloga, čime se sistem čini inkluzivnijim i otvorenijim za različite scenarije korištenja. Ovaj pristup omogućava da se realne životne situacije modeliraju bez umjetnih ograničenja. Korisnik pri prijavi bira aktivnu ulogu kroz koju koristi sistem, a po potrebi može promijeniti ulogu, čime se postiže fleksibilnost uz zadržavanje jasne kontrole pristupa. Ova odluka povećava kompleksnost implementacije, ali značajno unapređuje skalabilnost i realnu primjenjivost sistema.

---

## Odluka #005 - Korisnik koristi sistem kroz jednu aktivnu ulogu

| Polje | Opis |
|-------|------|
| ID odluke | DLI-005 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Aktivna uloga kao kontekst rada |
| Opis problema | Kako organizovati rad korisnika koji posjeduje više uloga unutar jedne sesije? |
| Razmatrane opcije | 1. Istovremeno korištenje svih uloga <br> 2. Rad kroz jednu eksplicitno odabranu aktivnu ulogu <br> 3. Implicitni kontekst (automatski izbor uloge od strane sistema) |
| Odabrana opcija | Jedna aktivna uloga u datom trenutku |
| Razlog izbora | Jasno definisan kontekst rada, smanjenje grešaka i bolja kontrola pristupa |
| Posljedice odluke | Potrebna implementacija mehanizma za izbor i promjenu uloge (role switcher) i kontekstualne autorizacije |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

Kriteriji su ponderisani u skladu sa potrebom za jasnoćom konteksta, sigurnošću i upotrebljivošću sistema.

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Jasnoća konteksta (UX) | 5 |
| Sigurnost / smanjenje grešaka | 5 |
| Jednostavnost korištenja | 4 |
| Skalabilnost | 4 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Kontekst | Sigurnost | UX | Skalabilnost | Kompleksnost | Ukupno |
|--------|----------|-----------|----|--------------|--------------|--------|
| Sve uloge istovremeno | 1 | 1 | 2 | 3 | 1 | 31 |
| Jedna aktivna uloga | 5 | 5 | 4 | 5 | 3 | 86 |
| Implicitni kontekst | 3 | 2 | 3 | 4 | 2 | 54 |

### Sažetak odluke

Krajnja odluka: **Jedna aktivna uloga**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Najbolji balans jasnoće, sigurnosti i upotrebljivosti |
| Prednosti | Jasan kontekst rada, smanjen rizik grešaka, bolji UX |
| Nedostaci | Potrebno eksplicitno prebacivanje uloge |
| Napomena | Potrebno jasno vizuelno označiti aktivnu ulogu u interfejsu |
| Implementacija | Sistem koristi aktivnu ulogu kao kontekst sesije uz mogućnost promjene |

### Detaljno obrazloženje

Istovremeno korištenje više uloga dovelo bi do konflikta u pristupu funkcionalnostima i značajno povećalo kompleksnost interfejsa. Različite uloge podrazumijevaju različite kontekste rada, a njihovo kombinovanje bi rezultiralo prenatrpanim i nejasnim korisničkim okruženjem. Uvođenjem jedne aktivne uloge u datom trenutku postiže se jasan kontekst interakcije sa sistemom, čime se smanjuje mogućnost grešaka i poboljšava upotrebljivost. Ovaj pristup dodatno sprječava situacije u kojima korisnik nenamjerno izvršava akcije u pogrešnom kontekstu. Alternativni pristup implicitnog određivanja uloge od strane sistema uvodi dodatnu nepredvidivost i smanjuje transparentnost, jer korisnik nema jasan uvid u kontekst u kojem trenutno djeluje. Ovu odluku definišemo kao strategiju upravljanja stanjem (State Management) gdje aktivna uloga predstavlja primarni kontekst sesije. Ovakav pristup omogućava:

- Jasno razdvajanje poslovnih domena (Separation of Concerns)
- Preciznu kontrolu pristupa kroz kontekstualnu autorizaciju
- Smanjenje sigurnosnih rizika (npr. pogrešne akcije u pogrešnoj ulozi)
- Skalabilnost kroz dodavanje novih uloga bez narušavanja postojećeg modela

Korisnik u svakom trenutku koristi sistem kroz jednu aktivnu ulogu, koju može promijeniti po potrebi, čime se postiže balans između fleksibilnosti i kontrole.

---

## Odluka #006 - Role-based navigacija i preusmjeravanje korisnika

| Polje | Opis |
|-------|------|
| ID odluke | DLI-006 |
| Datum | 27.04.2026. |
| Kratak naziv odluke | Role-based navigacija i preusmjeravanje |
| Opis problema | Kako usmjeriti korisnika kroz sistem nakon registracije i prijave, u skladu s njegovom aktivnom ulogom i odgovornostima? |
| Razmatrane opcije | 1. Jedinstven dashboard za sve korisnike <br> 2. Ručni odabir stranica bez kontrole <br> 3. Automatsko preusmjeravanje prema aktivnoj ulozi uz mogućnost izbora |
| Odabrana opcija | Automatsko preusmjeravanje prema aktivnoj ulozi uz mogućnost izbora aktivne uloge |
| Razlog izbora | Jasniji korisnički tok, veća efikasnost i personalizovano iskustvo rada |
| Posljedice odluke | Potrebna implementacija role-based navigacije, zaštite ruta i modularne arhitekture dashboarda |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

Kriteriji su ponderisani u skladu sa potrebom za jasnoćom korisničkog toka, sigurnošću pristupa i skalabilnošću interfejsa.

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Jasnoća korisničkog toka | 5 |
| Sigurnost / kontrola pristupa | 5 |
| UX / personalizacija | 4 |
| Skalabilnost | 4 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Jasnoća toka | Sigurnost | UX | Skalabilnost | Kompleksnost | Ukupno |
|--------|--------------|-----------|----|--------------|--------------|--------|
| Jedinstven dashboard za sve korisnike | 2 | 2 | 2 | 2 | 5 | 45 |
| Ručni odabir stranica bez kontrole | 1 | 1 | 2 | 2 | 4 | 35 |
| Automatsko preusmjeravanje prema ulozi uz mogućnost izbora | 5 | 5 | 5 | 4 | 3 | **87** |

### Sažetak odluke

Krajnja odluka: **Automatsko preusmjeravanje prema ulozi uz mogućnost izbora**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Najbolji balans jasnoće, sigurnosti, personalizacije i skalabilnosti |
| Prednosti | Korisnik odmah dolazi do relevantnih funkcionalnosti, smanjuje se rizik grešaka i neovlaštenog pristupa |
| Nedostaci | Veća kompleksnost implementacije navigacije i zaštite ruta |
| Napomena | Odluka se oslanja na koncept aktivne uloge iz odluke DLI-005 |
| Implementacija | Nakon autentifikacije sistem preusmjerava korisnika na dashboard koji odgovara njegovoj aktivnoj ulozi |

### Detaljno obrazloženje

U sistemima koji podržavaju više tipova korisnika, poput administratora, servisera, korisnika usluge i menadžera, svaki tip korisnika ima različite potrebe, odgovornosti i očekivanja od interfejsa. Primjena jedinstvenog dashboarda za sve korisnike dovela bi do preklapanja funkcionalnosti, zbunjujućeg korisničkog iskustva i većeg rizika od grešaka, jer bi korisnici vidjeli opcije koje nisu relevantne za njihov trenutni kontekst rada ili za koje nemaju ovlaštenje. Ručni odabir stranica bez jasne kontrole dodatno povećava rizik od neusklađenog korisničkog toka i potencijalnog pristupa dijelovima sistema koji nisu namijenjeni određenoj ulozi. Zbog toga je usvojeno automatsko preusmjeravanje prema aktivnoj ulozi korisnika, uz mogućnost izbora aktivne uloge kada korisnik posjeduje više uloga. Time se postiže ravnoteža između automatizacije i fleksibilnosti. Ovakva arhitektura omogućava:

- efikasnost, jer korisnik odmah dolazi do funkcionalnosti koje su mu relevantne
- personalizaciju, jer su prikaz i dostupne akcije usklađeni s aktivnom ulogom
- sigurnost, jer se pristup rutama i funkcionalnostima kontroliše kroz role-based pravila
- skalabilnost, jer se nove uloge i dashboard moduli mogu dodavati bez narušavanja postojećeg toka

Implementacijom role-based navigacije i preusmjeravanja sistem dobija jasnu strukturu korisničkog toka, smanjuje kognitivno opterećenje korisnika i postaje spremniji za dalji rast bez gubitka konzistentnosti.

---

## Odluka #007 - Neutralne poruke greške pri autentifikaciji

| Polje | Opis |
|-------|------|
| ID odluke | DLI-007 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Neutralne poruke greške |
| Opis problema | Kako komunicirati neuspješnu prijavu bez otkrivanja osjetljivih sistemskih informacija? |
| Razmatrane opcije | 1. Specifične poruke (npr. "Korisnik ne postoji") <br> 2. Neutralne poruke (npr. "Neispravni podaci") <br> 3. Djelimično specifične poruke (različit feedback kroz login i recovery flow) |
| Odabrana opcija | Neutralne poruke |
| Razlog izbora | Prevencija user enumeration napada i povećanje nivoa sigurnosti |
| Posljedice odluke | Manja preciznost povratne informacije za legitimnog korisnika |
| Status odluke | aktivna |


## Trade-off analiza (Decision Matrix)

Kriteriji su ponderisani u skladu sa prioritetom sigurnosti i zaštite korisničkih podataka.

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Sigurnost (user enumeration zaštita) | 5 |
| Informaciona izolacija sistema | 5 |
| UX / jasnoća korisniku | 3 |
| Implementacijska jednostavnost | 3 |
| Konzistentnost API ponašanja | 4 |

### Ocjenjivanje i rezultat

| Opcija | Sigurnost | Izolacija | UX | Jednostavnost | Konzistentnost | Ukupno |
|--------|----------|-----------|----|---------------|----------------|--------|
| Specifične poruke | 1 | 1 | 5 | 5 | 3 | 39 |
| Neutralne poruke | 5 | 5 | 3 | 4 | 5 | **89** |
| Djelimično specifične | 3 | 2 | 4 | 3 | 3 | 55 |

### Sažetak odluke

Krajnja odluka: **Neutralne poruke**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Maksimalna zaštita od user enumeration napada |
| Prednosti | Visoka sigurnost, nema curenja informacija, konzistentan API |
| Nedostaci | Manje informativan feedback za korisnika |
| Napomena | UX se kompenzuje kroz password recovery flow |
| Implementacija | Sistem vraća uniformne poruke i identične statuse bez obzira na uzrok greške |

### Detaljno obrazloženje

Korištenje neutralnih poruka greške direktno sprječava user enumeration napade. Specifične poruke poput „Email ne postoji” ili „Pogrešna lozinka” omogućavaju napadačima da kroz automatizovane pokušaje mapiraju postojeće korisničke naloge. Neutralnim odgovorom („Neispravni podaci”) sistem ne otkriva da li je email validan ili ne, čime se eliminiše prvi korak u većini napada. Ovaj pristup je ključni dio Defense in Depth strategije. Napadač ne dobija nikakav signal o strukturi sistema, što značajno povećava vrijeme i resurse potrebne za napad. Dodatno, sistem mora osigurati:

- Uniformne HTTP odgovore (npr. uvijek 401 Unauthorized)
- Identičnu strukturu odgovora za sve slučajeve greške
- Ujednačeno vrijeme odgovora (zaštita od timing attack-a)

Alternativni pristup djelimično specifičnih poruka uvodi rizik curenja informacija kroz recovery ili druge pomoćne tokove, čime se kompromituje sigurnosni model. Balans između sigurnosti i korisničkog iskustva postiže se kroz jasan i siguran proces oporavka lozinke, umjesto otkrivanja informacija na login formi. Ovim pristupom sistem postiže maksimalnu zaštitu bez kompromitovanja funkcionalnosti za legitimne korisnike.

---

## Odluka #008 - Upravljanje sesijom korisnika

| Polje | Opis |
|-------|------|
| ID odluke | DLI-008 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Hibridni pristup upravljanju sesijom |
| Opis problema | Kako efikasno upravljati autentifikacijom i stanjem korisnika kroz cijeli sistem? |
| Razmatrane opcije | 1. Isključivo client-side pristup (stateless, npr. JWT) <br> 2. Isključivo server-side pristup (stateful, npr. session cookies) <br> 3. Hibridni pristup |
| Odabrana opcija | Hibridni pristup |
| Razlog izbora | Optimalan balans između sigurnosne kontrole, skalabilnosti i sistemskih performansi |
| Posljedice odluke | Potrebna sinhronizacija stanja između servera i klijenta, uz kompleksniju logiku upravljanja sesijom |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

Kriteriji su ponderisani u skladu sa potrebom za sigurnošću, performansama, skalabilnošću i kontrolom sesije.

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Sigurnost i kontrola sesije | 5 |
| Performanse i responzivnost | 4 |
| Skalabilnost | 4 |
| Mogućnost trenutne invalidacije | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Sigurnost | Performanse | Skalabilnost | Invalidacija | Kompleksnost | Ukupno |
|--------|-----------|-------------|--------------|--------------|--------------|--------|
| Isključivo client-side (JWT) | 2 | 5 | 5 | 1 | 4 | 63 |
| Isključivo server-side (session cookies) | 5 | 3 | 3 | 5 | 4 | 77 |
| Hibridni pristup | 5 | 4 | 5 | 5 | 3 | **89** |


### Sažetak odluke

Krajnja odluka: **Hibridni pristup**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Najbolji balans sigurnosne kontrole, performansi i skalabilnosti |
| Prednosti | Brza validacija, centralizovana kontrola sesije, mogućnost trenutne invalidacije i bolji UX |
| Nedostaci | Veća kompleksnost implementacije i potreba za sinhronizacijom servera i klijenta |
| Napomena | Kritične odluke o validnosti sesije ostaju na serveru, dok klijent čuva samo podatke potrebne za UI/UX |
| Implementacija | Klijent koristi kratkotrajne tokene i lokalni state za prikaz interfejsa, dok server čuva referencu sesije i vrši konačnu validaciju pristupa |


### Detaljno obrazloženje

Hibridni pristup upravljanju sesijom odabran je kako bi se zadržale prednosti client-side i server-side modela, uz smanjenje njihovih pojedinačnih nedostataka. Isključivo client-side pristup, poput stateless JWT modela, omogućava dobre performanse i skalabilnost, ali otežava trenutnu invalidaciju sesije. Tokeni ostaju validni do isteka, što predstavlja rizik u scenarijima kao što su suspenzija korisnika, promjena ovlaštenja ili detekcija sigurnosnog incidenta. Isključivo server-side pristup omogućava preciznu kontrolu i trenutnu invalidaciju sesije, ali može povećati opterećenje servera i baze podataka ako se validacija vrši pri svakom zahtjevu bez dodatnih optimizacija. Zbog toga je usvojen hibridni model. Klijent čuva kratkotrajne tokene i neosjetljive podatke potrebne za prikaz korisničkog interfejsa, dok server zadržava autoritativnu referencu sesije i konačnu kontrolu nad validnošću pristupa. Ovakav model omogućava:

- trenutnu invalidaciju sesije u slučaju suspenzije, odjave ili detekcije napada
- bolje performanse kroz korištenje cache slojeva i kratkotrajnih tokena
- sigurnije upravljanje sesijom jer kritična validacija ostaje na serveru
- konzistentnost korisničkog stanja kroz više uređaja ili aktivnih klijentskih instanci
- manju površinu napada jer osjetljivi identifikatori sesije ne moraju biti dostupni aplikacionom JavaScript kodu

Posebno je važno da sistem koristi sigurne mehanizme čuvanja sesijskih identifikatora, poput HTTP-only i Secure cookie postavki. Time se smanjuje rizik od krađe tokena kroz klijentski kod i ograničava mogućnost session hijacking napada. Ova odluka uvodi dodatnu implementacijsku kompleksnost, ali omogućava robusniji, sigurniji i skalabilniji model upravljanja sesijom koji bolje odgovara sistemu sa više uloga, različitim nivoima pristupa i potrebom za centralizovanom kontrolom.

---

## Odluka #009 - Zaštita ruta na osnovu autentifikacije i uloge

| Polje | Opis |
|-------|------|
| ID odluke | DLI-009 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Višeslojna zaštita ruta |
| Opis problema | Kako spriječiti neovlašten pristup privatnim dijelovima sistema i osjetljivim podacima? |
| Razmatrane opcije | 1. Osnovna zaštita (samo autentifikacija) <br> 2. Role-based zaštita (RBAC) <br> 3. Višeslojna zaštita (frontend + backend + RBAC) |
| Odabrana opcija | Višeslojna role-based zaštita |
| Razlog izbora | Maksimalna sigurnost kroz kombinaciju kontrola i preciznu autorizaciju pristupa |
| Posljedice odluke | Potrebna implementacija zaštite na frontend i backend nivou, uključujući middleware slojeve i kontrolu pristupa |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

Kriteriji su ponderisani u skladu sa prioritetom sigurnosti, kontrole pristupa i skalabilnosti sistema.

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Sigurnost (zaštita od neovlaštenog pristupa) | 5 |
| Preciznost kontrole pristupa | 5 |
| Skalabilnost | 4 |
| UX (jasnoća i predvidivost) | 3 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Sigurnost | Preciznost | Skalabilnost | UX | Kompleksnost | Ukupno |
|--------|-----------|------------|--------------|----|--------------|--------|
| Samo autentifikacija | 1 | 1 | 3 | 3 | 5 | 34 |
| Role-based zaštita | 4 | 4 | 4 | 4 | 3 | 67 |
| Višeslojna zaštita (FE + BE + RBAC) | 5 | 5 | 5 | 4 | 2 | **84** |

### Sažetak odluke

Krajnja odluka: **Višeslojna zaštita**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Najviši nivo sigurnosti kroz višeslojnu kontrolu pristupa |
| Prednosti | Smanjena površina napada, precizna autorizacija i zaštita na više nivoa |
| Nedostaci | Veća kompleksnost implementacije |
| Napomena | Frontend zaštita služi za UX i navigaciju, backend je autoritativan |
| Implementacija | Kombinacija client-side guardova i server-side middleware validacije |


### Detaljno obrazloženje

Zaštita ruta implementirana je kroz višeslojni pristup koji uključuje provjeru autentifikacije i aktivne uloge korisnika na više nivoa sistema. Osnovni model koji se oslanja samo na autentifikaciju nije dovoljan, jer prisustvo validne sesije ne garantuje da korisnik ima pravo pristupa svim dijelovima sistema. Ovakav pristup može dovesti do ozbiljnih sigurnosnih propusta. Uvođenjem role-based kontrole (RBAC), sistem osigurava da korisnik može pristupiti samo onim resursima koji su eksplicitno dozvoljeni za njegovu aktivnu ulogu. Međutim, ključna odluka je primjena višeslojne zaštite:

- Frontend zaštita (client-side guardovi) služi kao prva linija odbrane i unapređuje korisničko iskustvo filtriranjem navigacije i dostupnih opcija
- Backend zaštita (middleware) predstavlja autoritativnu kontrolu i validira svaki zahtjev bez oslanjanja na klijentsku logiku
- RBAC pravila osiguravaju preciznu kontrolu pristupa na nivou resursa

Ovaj pristup implementira Defense in Depth strategiju, gdje sigurnost ne zavisi od jednog mehanizma, već od kombinacije više kontrolnih slojeva. Time se sprječavaju ranjivosti poput:

- Broken Access Control
- IDOR (Insecure Direct Object Reference)
- Neovlašten pristup API endpointima

Dodatno, ovakav model omogućava:

- lakše uvođenje novih uloga i pravila pristupa
- konzistentnu sigurnosnu politiku kroz cijeli sistem
- veću otpornost na greške u implementaciji pojedinačnih slojeva

Iako povećava kompleksnost implementacije, višeslojna zaštita ruta predstavlja ključni sigurnosni mehanizam za sisteme koji obrađuju osjetljive podatke i imaju više tipova korisnika.

---

## Odluka #010 - Odjava korisnika prekida pristup sistemu

| Polje | Opis |
|-------|------|
| ID odluke | DLI-010 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Potpuna invalidacija sesije pri odjavi |
| Opis problema | Kako osigurati da sesija postane trajno neupotrebljiva nakon što korisnik izvrši odjavu? |
| Razmatrane opcije | 1. Client-side odjava (brisanje lokalnih podataka) <br> 2. Server-side invalidacija sesije <br> 3. Potpuna invalidacija (server + klijent) |
| Odabrana opcija | Potpuna invalidacija sesije |
| Razlog izbora | Maksimalna sigurnost i eliminacija mogućnosti zloupotrebe aktivnih tokena |
| Posljedice odluke | Potrebna implementacija server-side mehanizma za invalidaciju i koordinacija sa klijentom |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

Kriteriji su ponderisani u skladu sa prioritetom sigurnosti, konzistentnosti sistema i pouzdanosti odjave.

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Sigurnost (zaštita od zloupotrebe sesije) | 5 |
| Potpuna invalidacija (nepovratnost odjave) | 5 |
| Konzistentnost stanja | 4 |
| UX (brzina i jasnoća odjave) | 3 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Sigurnost | Invalidacija | Konzistentnost | UX | Kompleksnost | Ukupno |
|--------|-----------|--------------|----------------|----|--------------|--------|
| Client-side odjava | 1 | 1 | 2 | 5 | 5 | 39 |
| Server-side invalidacija | 5 | 5 | 4 | 3 | 3 | 76 |
| Potpuna invalidacija (server + klijent) | 5 | 5 | 5 | 4 | 3 | **87** |

### Sažetak odluke

Krajnja odluka: **Potpuna invalidacija (server + klijent)**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Najviši nivo sigurnosti kroz potpunu invalidaciju sesije |
| Prednosti | Sprječava reuse tokena, eliminiše session replay rizik, osigurava konzistentno stanje |
| Nedostaci | Veća kompleksnost i potreba za komunikacijom klijent-server |
| Napomena | Klijent čisti lokalni state tek nakon potvrde servera |
| Implementacija | Logout zahtjev briše sesiju na serveru, nakon čega klijent uklanja lokalne podatke |

### Detaljno obrazloženje

Jednostavno brisanje lokalnih podataka na klijentskoj strani (npr. uklanjanje tokena iz Local Storage-a ili brisanje cookie-ja) nije dovoljno za sigurnu odjavu korisnika. Takav pristup samo vizuelno uklanja korisnika iz aplikacije, dok na serverskoj strani sesija može ostati validna do isteka. U takvom scenariju, napadač koji je prethodno kompromitovao token može nastaviti koristiti sistem bez obzira na to što se korisnik “odjavio”. Zbog toga je usvojena strategija potpune invalidacije sesije, gdje se odjava tretira kao sigurnosno kritična operacija.

Ovaj pristup podrazumijeva:

- serversku invalidaciju sesije (brisanje iz baze ili cache-a, npr. Redis)
- trenutnu nevažeću referencu sesije za sve naredne zahtjeve
- klijentsko brisanje lokalnih podataka tek nakon potvrde servera

Time se postiže:

- zaštita od session replay napada
- nemogućnost ponovne upotrebe kompromitovanih tokena
- konzistentno stanje između klijenta i servera
- sigurnost na javnim i dijeljenim uređajima

Ovaj model osigurava da se korisnik ne može naći u “lažnom” stanju odjave gdje vjeruje da je izašao iz sistema, dok backend i dalje prihvata njegove stare kredencijale. Iako uvodi dodatnu kompleksnost, ovaj pristup je u skladu sa sigurnosnim standardima (npr. OWASP preporuke) i predstavlja neophodan mehanizam za sisteme koji upravljaju osjetljivim podacima i privilegovanim pristupom.

---

## Odluka #011 - Početni dashboard zavisi od aktivne uloge

| Polje | Opis |
|-------|------|
| ID odluke | DLI-011 |
| Datum | 25.04.2026. |
| Kratak naziv odluke | Namjenski dashboard prema aktivnoj ulozi |
| Opis problema | Kako korisniku prikazati ključne informacije bez preopterećenja interfejsa nebitnim podacima? |
| Razmatrane opcije | 1. Jedinstveni (univerzalni) dashboard za sve korisnike <br> 2. Specifični dashboard za svaku ulogu <br> 3. Hibridni dashboard (osnovni zajednički + role-based moduli) |
| Odabrana opcija | Role-based dashboard |
| Razlog izbora | Smanjenje kognitivnog opterećenja i povećanje operativne efikasnosti kroz prikaz relevantnih informacija |
| Posljedice odluke | Potreban razvoj modularnih UI komponenti i odvojenih prikaza po ulozi |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

Kriteriji su ponderisani u skladu sa potrebom za jasnoćom interfejsa, efikasnošću rada i skalabilnošću UI-a.

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Relevantnost informacija | 5 |
| UX (jasnoća i jednostavnost) | 5 |
| Operativna efikasnost | 4 |
| Skalabilnost UI arhitekture | 4 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Relevantnost | UX | Efikasnost | Skalabilnost | Kompleksnost | Ukupno |
|--------|-------------|----|------------|--------------|--------------|--------|
| Univerzalni dashboard | 2 | 2 | 2 | 2 | 5 | 45 |
| Role-based dashboard | 5 | 5 | 5 | 4 | 3 | **87** |
| Hibridni dashboard | 4 | 4 | 4 | 5 | 2 | 78 |

### Sažetak odluke

Krajnja odluka: **Role-based dashboard**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Maksimalna relevantnost informacija i smanjenje kognitivnog opterećenja |
| Prednosti | Fokusiran UI, brže donošenje odluka, bolji UX |
| Nedostaci | Veći razvojni napor i potreba za modularnim dizajnom |
| Napomena | Odluka direktno zavisi od koncepta aktivne uloge (DLI-005) |
| Implementacija | Dashboard se dinamički renderuje na osnovu aktivne uloge korisnika |

### Detaljno obrazloženje

Različite korisničke uloge unutar sistema zahtijevaju potpuno različite skupove informacija i funkcionalnosti. Univerzalni dashboard bi doveo do pojave "šuma" u interfejsu (UI clutter), gdje bi korisnici morali filtrirati veliku količinu nebitnih informacija. Role-based pristup omogućava da interfejs direktno reflektuje kontekst rada korisnika. Time se eliminiše potreba za dodatnom navigacijom i smanjuje kognitivno opterećenje. Na primjer:

- Serviser vidi aktivne zadatke, lokacije intervencija i tehničke detalje
- Korisnik usluge vidi status svojih zahtjeva
- Administrator vidi metrike sistema i upravljačke alate

Ovakav pristup omogućava:

- brže donošenje odluka kroz prikaz relevantnih podataka
- smanjenje grešaka jer su dostupne samo relevantne akcije
- intuitivniji interfejs prilagođen ulozi
- bolju skalabilnost kroz modularne UI komponente

Alternativni hibridni model (zajednički + specifični moduli) nudi fleksibilnost, ali povećava kompleksnost i može ponovo uvesti nepotrebne informacije u interfejs. Role-based dashboard se ponaša kao "kontrolni toranj" za korisnika, pružajući tačno one informacije koje su mu potrebne u datom trenutku. Ova odluka omogućava dugoročnu skalabilnost sistema, jer se nove uloge mogu dodavati kroz nove module bez narušavanja postojećih prikaza.

---

## Odluka #012 - Middleware kao centralni "Traffic Controller"

| Polje | Opis |
|-------|------|
| ID odluke | DLI-012 |
| Datum | 27.04.2026. |
| Kratak naziv odluke | Middleware-level session management |
| Opis problema | Kako osigurati da je sesija uvijek validna prije nego što zahtjev dođe do stranice ili API-ja? |
| Razmatrane opcije | 1. Provjera unutar svake komponente (client-side) <br> 2. Centralizovani middleware na nivou zahtjeva <br> 3. Hibridni pristup (client-side guard + middleware validacija) |
| Odabrana opcija | Centralizovani middleware za presretanje zahtjeva |
| Razlog izbora | Centralizacija sigurnosne logike, veća konzistentnost i smanjenje mogućnosti greške |
| Posljedice odluke | Potrebno pažljivo upravljanje sesijom, kolačićima i lifecycle-om zahtjeva |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Sigurnost | 5 |
| Konzistentnost logike | 5 |
| Performanse | 4 |
| Održivost (maintainability) | 4 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Sigurnost | Konzistentnost | Performanse | Održivost | Kompleksnost | Ukupno |
|--------|----------|----------------|-------------|------------|--------------|--------|
| Client-side provjere | 2 | 2 | 5 | 2 | 4 |  Fifty? wait compute: 2*5=10,2*5=10,5*4=20,2*4=8,4*3=12 total=60 |
| Middleware (centralno) | 5 | 5 | 4 | 5 | 3 | **87** |
| Hibridni pristup | 5 | 4 | 4 | 4 | 2 | 80 |

### Sažetak odluke

Krajnja odluka: **Middleware (centralno)**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Jedinstvena kontrolna tačka za autentifikaciju i autorizaciju |
| Prednosti | Veća sigurnost, nema dupliranja logike, lakše održavanje |
| Nedostaci | Veća kompleksnost u inicijalnoj implementaciji |
| Napomena | Client-side provjere ostaju kao UX sloj, ali nisu sigurnosni mehanizam |
| Implementacija | Middleware presreće svaki zahtjev i validira sesiju prije daljeg procesiranja |

### Detaljno obrazloženje

Provjera sesije unutar pojedinačnih komponenti (client-side) nije pouzdan sigurnosni mehanizam. Takav pristup može dovesti do situacija gdje korisnik privremeno vidi sadržaj kojem ne bi smio imati pristup prije nego što se izvrši provjera. Centralizovani middleware uvodi jedinstvenu kontrolnu tačku kroz koju prolazi svaki zahtjev — bilo da je riječ o renderovanju stranice ili API pozivu. Time se osigurava da:

- nijedan zahtjev ne može zaobići validaciju sesije
- autentifikacija i autorizacija budu konzistentne kroz cijeli sistem
- nema dupliranja logike po komponentama ili rutama

Middleware funkcioniše kao "traffic controller" koji odlučuje:

- da li je korisnik autentifikovan  
- da li ima pravo pristupa traženom resursu  
- da li treba biti preusmjeren (npr. na login)

Ova odluka je u skladu sa principima višeslojne arhitekture (separation of concerns), gdje:

- UI sloj je odgovoran za prikaz  
- middleware/auth sloj za sigurnost i kontrolu pristupa  

Hibridni pristup (client + middleware) može dodatno poboljšati UX (brže preusmjeravanje, skrivanje UI elemenata), ali sigurnosna odluka uvijek mora ostati na server/middleware sloju. Iako middleware uvodi dodatnu kompleksnost (upravljanje kolačićima, tokenima i lifecycle-om sesije), dugoročno donosi stabilniji, sigurniji i održiviji sistem.

---

## Odluka #013 - Razdvajanje auth naloga od operativnih profila

| Polje | Opis |
|-------|------|
| ID odluke | DLI-013 |
| Datum | 28.04.2026. |
| Kratak naziv odluke | Razdvajanje autentifikacije od uloga |
| Opis problema | Kako omogućiti registraciju korisnika bez automatskog pristupa osjetljivim funkcionalnostima sistema? |
| Razmatrane opcije | 1. Sve informacije u jednoj tabeli <br> 2. Razdvajanje auth naloga i aplikativnih profila <br> 3. Lazy provisioning profila (kreiranje operativnog profila tek nakon dodjele uloge) |
| Odabrana opcija | Razdvajanje auth naloga od aplikativnih tabela |
| Razlog izbora | Veća sigurnost, jasna separacija odgovornosti i fleksibilnost sistema |
| Posljedice odluke | Potrebno povezivanje entiteta kroz jedinstveni identifikator korisnika |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Sigurnost | 5 |
| Fleksibilnost modela | 5 |
| Skalabilnost | 4 |
| Održivost (maintainability) | 4 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Sigurnost | Fleksibilnost | Skalabilnost | Održivost | Kompleksnost | Ukupno |
|--------|----------|--------------|--------------|------------|--------------|--------|
| Jedna tabela | 2 | 2 | 3 | 2 | 5 | 51 |
| Razdvojeni modeli | 5 | 5 | 5 | 5 | 3 | **91** |
| Lazy provisioning | 4 | 5 | 4 | 4 | 2 | 80 |

### Sažetak odluke

Krajnja odluka: **Razdvojeni modeli**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Jasno razdvajanje identiteta i prava pristupa |
| Prednosti | Veća sigurnost, fleksibilnost, podrška za kompleksne role modele |
| Nedostaci | Potrebna dodatna logika povezivanja podataka |
| Napomena | Auth sloj ne nosi poslovnu logiku niti prava pristupa |
| Implementacija | `auth_user` tabela za identitet, aplikativne tabele za uloge i profile |

### Detaljno obrazloženje

Ključna razlika u ovoj odluci je razdvajanje **identiteta korisnika** od njegovih **operativnih prava u sistemu**. 

Ako bi svi podaci bili smješteni u jednoj tabeli:

- povećava se rizik da korisnik dobije pristup koji mu ne pripada  
- dolazi do miješanja autentifikacije i autorizacije  
- sistem postaje rigidniji i teži za proširenje  

Razdvajanjem modela uvodimo jasnu arhitekturu:

- **Auth sloj (`auth_user`)** → identitet (email, password, autentifikacija)  
- **Aplikativni sloj** → uloge, profili, prava pristupa  

Time se postiže:

- korisnik može postojati u sistemu bez ikakvih prava  
- prava se dodjeljuju eksplicitno (npr. onboarding, admin odobrenje)  
- podržava se više uloga po korisniku bez dupliranja naloga  
- sistem je sigurniji jer registracija ≠ autorizacija  

Alternativa poput *lazy provisioning* pristupa dodatno optimizuje resurse (profil se kreira tek kada je potreban), ali uvodi dodatnu kompleksnost u lifecycle korisnika.

Odabrani pristup omogućava:

- bolju kontrolu pristupa (RBAC integracija)  
- lakšu integraciju sa onboarding procesima (DLI-003)  
- jasnu separaciju odgovornosti (separation of concerns)  

Ovaj model čini sistem sigurnijim (nema implicitnih prava), fleksibilnijim (podrška za kompleksne scenarije) i održivijim (lakše proširenje u budućnosti).

---

## Odluka #014 - Automatska prijava nakon uspješne registracije

| Polje | Opis |
|-------|------|
| ID odluke | DLI-014 |
| Datum | 25.04.2026. |
| Kratak naziv odluke | Automatska prijava nakon registracije |
| Opis problema | Da li korisnik nakon registracije treba ponovo prolaziti kroz login proces? |
| Razmatrane opcije | 1. Preusmjeravanje na login <br> 2. Automatska prijava <br> 3. Automatska prijava uz dodatnu verifikaciju (npr. email potvrda prije pune aktivacije) |
| Odabrana opcija | Automatska prijava i preusmjeravanje na početni ekran |
| Razlog izbora | Bolje korisničko iskustvo i eliminacija nepotrebnih koraka |
| Posljedice odluke | Potrebno odmah kreirati validnu i sigurnu sesiju |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| UX (korisničko iskustvo) | 5 |
| Brzina pristupa sistemu | 4 |
| Sigurnost | 5 |
| Jednostavnost implementacije | 3 |
| Kontrola pristupa | 4 |

### Ocjenjivanje i rezultat

| Opcija | UX | Brzina | Sigurnost | Jednostavnost | Kontrola | Ukupno |
|--------|----|--------|------------|----------------|-----------|--------|
| Login nakon registracije | 2 | 2 | 5 | 5 | 5 | 69 |
| Automatska prijava | 5 | 5 | 4 | 4 | 4 | **86** |
| Auto + verifikacija | 4 | 4 | 5 | 3 | 5 | 83 |

### Sažetak odluke

Krajnja odluka: **Automatska prijava**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Eliminacija frikcije u onboarding flow-u |
| Prednosti | Brži ulazak u sistem, bolji UX |
| Nedostaci | Potrebno pažljivo upravljanje sigurnošću sesije |
| Napomena | Može se kombinovati sa kasnijom verifikacijom (npr. email potvrda) |
| Implementacija | Nakon registracije odmah se kreira sesija i korisnik se redirecta |

### Detaljno obrazloženje

Korisnik koji se registruje ima jasan cilj — što prije početi koristiti sistem. Vraćanje na login formu nakon registracije uvodi nepotreban korak:

- korisnik mora ponovo unositi iste podatke  
- prekida se prirodan tok (flow)  
- povećava se šansa za odustajanje  

Automatska prijava spaja registraciju i autentifikaciju u jedan kontinualan proces.

Ovim pristupom:

- korisnik odmah dobija pristup sistemu  
- onboarding djeluje brže i intuitivnije  
- smanjuje se trenje (friction) u UX-u  

Sigurnosni aspekt:

- sesija mora biti pravilno inicijalizovana odmah nakon registracije  
- tokeni/kolačići moraju biti sigurni (HTTP-only, secure)  
- dodatne provjere (npr. verifikacija emaila) mogu se implementirati kao *post-login restrikcije*  

Treća opcija (auto-login + verifikacija) je posebno korisna u sistemima gdje:

- postoji osjetljiv pristup (osobni identifikacioni podaci, finansije)  
- potrebna je potvrda identiteta prije pune aktivacije  

U tom slučaju korisnik može biti prijavljen, ali sa ograničenim pravima dok ne završi verifikaciju. Ova odluka direktno podržava onboarding strategiju sistema, omogućavajući brz i gladak ulazak korisnika bez kompromisa u sigurnosti, uz mogućnost kasnijeg uvođenja dodatnih kontrola.

---

## Odluka #015 - Fail-fast validacija pomoću Zod shema

| Polje | Opis |
|-------|------|
| ID odluke | DLI-015 |
| Datum | 25.04.2026. |
| Kratak naziv odluke | Validacija podataka u formama |
| Opis problema | Kako spriječiti unos neispravnih podataka i korisniku dati jasnu i brzu povratnu informaciju? |
| Razmatrane opcije | 1. Validacija samo na serveru <br> 2. Validacija na frontend i backend strani <br> 3. Centralizovana validacija (shared schema između frontend-a i backend-a) |
| Odabrana opcija | Korištenje Zod validacije na frontend strani uz backend provjeru |
| Razlog izbora | Brza povratna informacija i smanjenje nepotrebnih zahtjeva prema serveru |
| Posljedice odluke | Potrebno održavanje i sinhronizacija validacionih pravila |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| UX (brzina feedback-a) | 5 |
| Sigurnost | 5 |
| Performanse (load na serveru) | 4 |
| Održivost (maintainability) | 4 |
| Kompleksnost implementacije | 3 |

### Ocjenjivanje i rezultat

| Opcija | UX | Sigurnost | Performanse | Održivost | Kompleksnost | Ukupno |
|--------|----|------------|-------------|------------|--------------|--------|
| Samo backend validacija | 2 | 5 | 2 | 4 | 5 | 65 |
| Frontend + backend | 5 | 5 | 5 | 3 | 3 | **86** |
| Shared schema (full reuse) | 5 | 5 | 5 | 5 | 2 | 92 |

> Napomena: “shared schema” je idealan cilj (npr. isti Zod schema i na FE i BE), ali zavisi od arhitekture i toolinga.

### Sažetak odluke

Krajnja odluka: **Frontend + backend**
| Stavka | Objašnjenje |
|--------|------------|
| Razlog izbora | Trenutni balans između UX-a i sigurnosti |
| Prednosti | Instant feedback korisniku, manje nepotrebnih API poziva |
| Nedostaci | Dupliranje validacione logike ako nije shared |
| Napomena | Dugoročno težiti shared schema pristupu |
| Implementacija | Zod na frontend-u + obavezna backend validacija kao finalni sloj |

### Detaljno obrazloženje

Validacija podataka je ključna za:

- integritet sistema  
- kvalitet podataka  
- korisničko iskustvo  

Ako se validacija radi samo na backend-u:

- korisnik dobija feedback tek nakon slanja forme  
- UX je sporiji i frustrirajući  
- povećava se broj nepotrebnih requestova  

Uvođenjem **fail-fast validacije na frontend-u (Zod)**:

- korisnik odmah vidi grešku  
- jasno mu je šta treba ispraviti  
- forma postaje interaktivnija i intuitivnija  

Backend validacija ipak ostaje:

- **obavezna** (security layer)  
- finalna provjera integriteta podataka  
- zaštita od manipulacije klijenta  

Treća opcija — **shared schema pristup** — predstavlja ideal:

- isti Zod schema koristi se i na frontend-u i backend-u  
- nema dupliranja logike  
- smanjuje se mogućnost nekonzistentnosti  

Međutim, to zahtijeva:

- zajednički codebase ili shared package  
- disciplinu u upravljanju verzijama  

Zato trenutna odluka predstavlja pragmatičan kompromis:

- frontend validacija za UX  
- backend validacija za sigurnost  

Ova kombinacija omogućava:

- responzivan interfejs  
- smanjenje opterećenja servera  
- robusnu zaštitu sistema  

i čini sistem otpornim na greške, ali i ugodnim za korištenje.
