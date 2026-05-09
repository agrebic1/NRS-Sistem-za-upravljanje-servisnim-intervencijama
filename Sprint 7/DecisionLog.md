# Decision Log

## Odluka #001 – 

| Polje | Opis |
|-------|------|
| ID odluke | DLI-001 |
| Datum | .05.2026. |
| Kratak naziv odluke | |
| Opis problema |  |
| Razmatrane opcije | |
| Odabrana opcija | |
| Razlog izbora | |
| Posljedice odluke |  |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|


### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|--------|------------|--------------|-----------|-----------------|--------------|--------|

---

### Sažetak odluke

### Krajnja odluka: 

| Stavka | Objašnjenje |
|--------|-------------|
| Razlog izbora | 
| Prednosti | 
| Nedostaci | 
| Napomena | 
| Implementacija | 

---

### Detaljno obrazloženje
---


## Odluka #001 – Početni dashboard dispečera kao operativni pregled, ne kao zamjena za module

| Polje | Opis |
|-------|------|
| ID odluke | DLI-001 |
| Datum | 09.05.2026. |
| Kratak naziv odluke | Dashboard kao command center |
| Opis problema | Potrebno je definisati da li početni dashboard dispečera treba sadržavati kompletne liste zahtjeva i intervencija ili samo sažeti operativni pregled stanja sistema. |
| Razmatrane opcije | 1. Dashboard kao puna lista zahtjeva i intervencija <br> 2. Dashboard kao dvije velike 50/50 liste zahtjeva i intervencija <br> 3. Dashboard kao sažeti operativni pregled sa KPI karticama, kratkim sekcijama i linkovima prema modulima |
| Odabrana opcija | Dashboard kao sažeti operativni pregled |
| Razlog izbora | Izbjegava se dupliranje modula i zadržava se fokus na informacijama koje trenutno zahtijevaju pažnju dispečera. |
| Posljedice odluke | Kompletne liste i detaljna obrada ostaju u zasebnim modulima “Zahtjevi” i “Intervencije”. |
| Status odluke | aktivna |


## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Stabilnost sistema | 5 |
| Skalabilnost | 5 |
| Održivost koda | 4 |
| Rizik regresionih grešaka | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|--------|------------|--------------|-----------|-----------------|--------------|--------|
| Dashboard kao puna lista | 2 | 2 | 2 | 2 | 4 | 48 |
| Dashboard sa dvije 50/50 liste | 3 | 3 | 3 | 3 | 4 | 63 |
| Sažeti operativni dashboard | 5 | 5 | 5 | 5 | 4 | 92 |

### Sažetak odluke

Krajnja odluka: **Dashboard kao sažeti operativni pregled**

| Stavka | Objašnjenje |
|--------|-------------|
| Razlog izbora | Dashboard treba brzo pokazati stanje sistema, a ne zamijeniti posebne module. |
| Prednosti | Manje dupliranja, bolja preglednost, lakše održavanje, jasniji UX |
| Nedostaci | Za detaljan rad korisnik mora preći u modul Zahtjevi ili Intervencije |
| Napomena | Dashboard odgovara na pitanje “Šta sada zahtijeva pažnju?” |
| Implementacija | KPI kartice, kratke sekcije, recent activity i linkovi prema filtriranim listama |

### Detaljno obrazloženje

Početni dashboard dispečera ne treba biti još jedna velika lista zahtjeva i intervencija, jer sistem već predviđa posebne module u navigaciji: “Zahtjevi” i “Intervencije”. Ti moduli su namijenjeni za detaljan operativni rad, filtriranje, pretragu, otvaranje detalja i obradu pojedinačnih zapisa.

Ako bi dashboard prikazivao kompletne liste, došlo bi do dupliranja funkcionalnosti. Dispečer bi imao isti ili vrlo sličan sadržaj na više mjesta, što bi otežalo održavanje sistema i moglo zbuniti korisnika gdje se određena radnja treba obaviti.

Zbog toga je donesena odluka da dashboard bude sažeti operativni pregled, odnosno “command center”. Njegova svrha je da dispečeru odmah pokaže trenutno stanje sistema: koliko ima novih zahtjeva, koliko čeka obradu, koliko je aktivnih intervencija, šta kasni i šta zahtijeva pažnju.

Detaljan rad ostaje u zasebnim modulima. Dashboard samo daje pregled i omogućava brz ulaz u odgovarajuće filtrirane prikaze.

Ovakav pristup smanjuje kognitivno opterećenje, čuva čistu arhitekturu sistema i omogućava da se dashboard razvija kao pregledni kontrolni ekran, a ne kao duplicirani radni modul.

---

## Odluka #002 – Odvajanje modula “Zahtjevi” i “Intervencije” u navigaciji

| Polje | Opis |
|-------|------|
| ID odluke | DLI-002 |
| Datum | 09.05.2026. |
| Kratak naziv odluke | Zahtjevi i intervencije kao odvojeni moduli |
| Opis problema | Potrebno je definisati da li zahtjeve i intervencije prikazivati unutar istog modula ili ih razdvojiti u navigaciji kao dvije različite cjeline. |
| Razmatrane opcije | 1. Jedan zajednički modul za zahtjeve i intervencije <br> 2. Jedan modul sa tabovima <br> 3. Dva odvojena modula u navigaciji: Zahtjevi i Intervencije |
| Odabrana opcija | Dva odvojena modula u navigaciji |
| Razlog izbora | Zahtjev i intervencija predstavljaju različite faze poslovnog procesa i zahtijevaju različit način obrade. |
| Posljedice odluke | Potrebno je održavati jasnu granicu između zahtjeva koji čekaju obradu i intervencija koje su već u operativnom toku. |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Stabilnost sistema | 5 |
| Skalabilnost | 5 |
| Održivost koda | 4 |
| Rizik regresionih grešaka | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|--------|------------|--------------|-----------|-----------------|--------------|--------|
| Jedan zajednički modul | 3 | 2 | 2 | 3 | 5 | 62 |
| Jedan modul sa tabovima | 4 | 3 | 3 | 4 | 4 | 76 |
| Odvojeni moduli | 5 | 5 | 5 | 5 | 4 | 92 |

### Sažetak odluke

Krajnja odluka: **Odvojeni moduli “Zahtjevi” i “Intervencije”**

| Stavka | Objašnjenje |
|--------|-------------|
| Razlog izbora | Različite faze procesa zahtijevaju različite ekrane i pravila rada |
| Prednosti | Jasnija navigacija, lakša obrada, bolja skalabilnost |
| Nedostaci | Veći broj stranica/modula |
| Napomena | Zahtjev prelazi u intervenciju tek nakon obrade i operativne odluke |
| Implementacija | Posebne rute i prikazi za zahtjeve i intervencije |

### Detaljno obrazloženje

Zahtjev i intervencija nisu ista stvar u poslovnom procesu. Zahtjev predstavlja korisničku prijavu problema ili potrebe, dok intervencija predstavlja operativni rad koji nastaje nakon što se zahtjev obradi i prihvati za dalji tok.

Ako bi se zahtjevi i intervencije držali u istom modulu, korisnik bi morao stalno razlikovati zapise koji čekaju obradu od onih koji su već aktivni. To bi otežalo navigaciju i povećalo mogućnost greške.

Razdvajanjem ova dva modula sistem prati prirodan tok rada: zahtjev prvo dolazi u sistem, zatim se obrađuje, a nakon toga može preći u intervenciju. Ovaj pristup je jasniji i za korisnike sistema i za razvojni tim.

Odvojeni moduli također olakšavaju budući razvoj. Modul “Zahtjevi” može se fokusirati na prijavu, pregled, obradu i trijažu zahtjeva, dok modul “Intervencije” može sadržavati dodjelu serviserima, praćenje izvršenja, statuse rada i zatvaranje intervencija.

Iako ovakav pristup uvodi više ruta i ekrana, dugoročno donosi čistiju arhitekturu i bolju održivost sistema.

---

## Odluka #003 – Dashboard prikazuje kratke sekcije koje zahtijevaju pažnju

| Polje | Opis |
|-------|------|
| ID odluke | DLI-003 |
| Datum | 09.05.2026. |
| Kratak naziv odluke | Sekcije “zahtijeva pažnju” |
| Opis problema | Potrebno je odlučiti koje podatke prikazivati na početnom dashboardu dispečera bez preopterećenja korisnika. |
| Razmatrane opcije | 1. Prikaz svih zapisa na dashboardu <br> 2. Prikaz samo KPI kartica bez listi <br> 3. Prikaz kratkih sekcija za najvažnije zahtjeve i intervencije |
| Odabrana opcija | Prikaz kratkih sekcija za najvažnije zahtjeve i intervencije |
| Razlog izbora | Omogućava brz pregled kritičnih stvari bez pretvaranja dashboarda u punu radnu listu. |
| Posljedice odluke | Potrebno definisati pravila šta ulazi u kratke sekcije, npr. najnovije, najduže čekajuće ili visoko prioritetne stavke. |
| Status odluke | aktivna |


## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Stabilnost sistema | 5 |
| Skalabilnost | 5 |
| Održivost koda | 4 |
| Rizik regresionih grešaka | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|--------|------------|--------------|-----------|-----------------|--------------|--------|
| Svi zapisi na dashboardu | 2 | 2 | 2 | 2 | 4 | 48 |
| Samo KPI kartice | 4 | 4 | 4 | 4 | 5 | 83 |
| KPI + kratke sekcije | 5 | 5 | 5 | 5 | 4 | 92 |

### Sažetak odluke

Krajnja odluka: **KPI kartice + kratke sekcije koje zahtijevaju pažnju**

| Stavka | Objašnjenje |
|--------|-------------|
| Razlog izbora | Dashboard treba dati brzi pregled i usmjeriti pažnju na najbitnije |
| Prednosti | Dobar balans između pregleda i operativne korisnosti |
| Nedostaci | Potrebno definisati kriterije za izbor prikazanih stavki |
| Napomena | Kompletni pregledi ostaju u modulima Zahtjevi i Intervencije |
| Implementacija | KPI kartice + kratke liste + link “Prikaži sve” |

### Detaljno obrazloženje

Dashboard treba dispečeru pomoći da brzo shvati šta se trenutno dešava u sistemu i šta zahtijeva njegovu pažnju. Zbog toga nije dovoljno prikazati samo brojeve, ali nije dobro ni prikazati sve zapise.

Samo KPI kartice daju dobar pregled, ali ne pokazuju konkretne stavke koje treba otvoriti. S druge strane, prikaz svih zapisa pretvara dashboard u još jednu radnu listu i duplira module.

Zato je odabrano srednje rješenje: dashboard prikazuje KPI kartice i kratke sekcije sa najvažnijim stavkama. Na primjer, može prikazati nekoliko zahtjeva koji najduže čekaju obradu, nekoliko aktivnih intervencija koje kasne ili nekoliko stavki visokog prioriteta.

Na taj način dashboard ostaje pregledan, ali i praktično koristan. Dispečer odmah vidi stanje sistema, ali i ima konkretne ulaze prema zapisima koje treba otvoriti.

Kompletan rad, filtriranje i detaljna obrada ostaju u zasebnim modulima.

---

## Odluka #004 - Sistemski prijedlog prioriteta uz dispečersku potvrdu

| Polje | Opis |
|-------|------|
| ID odluke | DLI-004 |
| Datum | 09.05.2026. |
| Kratak naziv odluke | Hibridni model određivanja prioriteta |
| Opis problema | Potrebno je definisati kako se određuje prioritet intervencije i ko donosi konačnu odluku o hitnosti obrade zahtjeva. |
| Razmatrane opcije | 1. Korisnik direktno određuje prioritet <br> 2. Dispečer ručno određuje prioritet bez sistemske pomoći <br> 3. Sistem automatski određuje prioritet bez ljudske potvrde <br> 4. Sistem generiše prijedlog prioriteta, a dispečer potvrđuje ili mijenja prioritet |
| Odabrana opcija | Sistem generiše prijedlog prioriteta, a dispečer potvrđuje ili mijenja prioritet |
| Razlog izbora | Kombinuje automatizaciju i ljudsku procjenu uz zadržavanje operativne kontrole. |
| Posljedice odluke | Potrebna implementacija poslovne logike za procjenu prioriteta i interfejsa za potvrdu ili izmjenu prioriteta. |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|----------|--------|
| Stabilnost sistema | 5 |
| Skalabilnost | 5 |
| Održivost koda | 4 |
| Rizik regresionih grešaka | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|--------|------------|--------------|-----------|-----------------|--------------|--------|
| Korisnik određuje prioritet | 1 | 2 | 2 | 1 | 5 | 41 |
| Dispečer ručno određuje prioritet | 4 | 4 | 4 | 4 | 4 | 76 |
| Potpuno automatski sistem | 4 | 5 | 5 | 3 | 2 | 79 |
| Hibridni model | 5 | 5 | 5 | 5 | 3 | 91 |


### Sažetak odluke

Krajnja odluka: **Hibridni model određivanja prioriteta**

| Stavka | Objašnjenje |
|--------|-------------|
| Razlog izbora | Kombinovanje sistemske procjene i ljudske kontrole |
| Prednosti | Preciznija obrada, manja subjektivnost, operativna kontrola |
| Nedostaci | Potrebna dodatna poslovna logika i UI za potvrdu prioriteta |
| Napomena | Korisnik ne određuje prioritet direktno |
| Implementacija | Sistem predlaže prioritet na osnovu korisničkih odgovora, dispečer potvrđuje ili mijenja |

### Detaljno obrazloženje

Korisnik koji prijavljuje servisnu intervenciju ne posjeduje dovoljno operativnog konteksta niti stručnog znanja da bi mogao pouzdano procijeniti prioritet zahtjeva. Korisnik problem posmatra iz vlastite perspektive, dok sistem mora uzeti u obzir mnogo širi skup informacija:
- sigurnosni rizik,
- vrstu problema,
- moguće posljedice,
- raspoloživost servisera,
- trenutno opterećenje sistema,
- postojeće aktivne intervencije.

Zbog toga je odbačena opcija da korisnik direktno određuje prioritet.

S druge strane, potpuno ručno određivanje prioriteta od strane dispečera bez ikakve sistemske pomoći povećava operativno opterećenje i usporava obradu zahtjeva.

Također, potpuno automatsko određivanje prioriteta bez ljudske potvrde predstavljalo bi rizik jer sistem ne može uvijek prepoznati sve specifične okolnosti ili poslovni kontekst.

Zbog toga je usvojen hibridni model odlučivanja:
- korisnik popunjava upitnik i opisuje problem,
- sistem na osnovu poslovnih pravila i odgovora korisnika generiše prijedlog hitnosti/prioriteta,
- dispečer pregledava prijedlog i donosi konačnu operativnu odluku.

Na ovaj način sistem koristi automatizaciju kao pomoć operativnom osoblju, ali konačna odgovornost i kontrola ostaju na čovjeku.

Ovakav pristup omogućava:
- bržu obradu zahtjeva,
- konzistentniju prioritizaciju,
- smanjenje subjektivnih procjena,
- bolju skalabilnost sistema,
- zadržavanje ljudske kontrole nad operativnim procesima.

Iako ovaj model zahtijeva dodatnu poslovnu logiku i razvoj mehanizma za procjenu prioriteta, dugoročno pruža najbolji balans između automatizacije i profesionalne operativne kontrole.

---

# Odluka #005 – Detalji zahtjeva dostupni su samo ovlaštenim korisnicima

| Polje | Opis |
|---|---|
| ID odluke | DLI-005 |
| Datum | 09.05.2026. |
| Kratak naziv odluke | Role-based pristup detaljima intervencija |
| Opis problema | Potrebno je definisati ko može pristupiti detaljnim informacijama o zahtjevima i intervencijama, te kako spriječiti pristup osjetljivim podacima neovlaštenim korisnicima. |
| Razmatrane opcije | 1. Svi prijavljeni korisnici imaju pristup detaljima <br> 2. Samo operativne uloge imaju pristup detaljima <br> 3. Djelimičan pristup zavisno od vlasništva zahtjeva <br> 4. Role-based pristup sa granularnim dozvolama |
| Odabrana opcija | Role-based pristup sa granularnim dozvolama |
| Razlog izbora | Omogućava sigurnu i fleksibilnu kontrolu pristupa zavisno od uloge, odgovornosti i konteksta korisnika. |
| Posljedice odluke | Potrebna implementacija centralizovane autorizacije, role guard logike i zaštite ruta i API poziva. |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Stabilnost sistema | 5 |
| Skalabilnost | 5 |
| Održivost koda | 4 |
| Rizik regresionih grešaka | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Otvoren pristup detaljima | 1 | 2 | 2 | 1 | 5 | 40 |
| Samo operativne uloge | 4 | 4 | 4 | 4 | 4 | 76 |
| Djelimičan pristup po vlasništvu | 4 | 4 | 4 | 4 | 3 | 73 |
| Role-based granularni pristup | 5 | 5 | 5 | 5 | 4 | 92 |


### Sažetak odluke

Krajnja odluka: **Role-based pristup sa granularnim dozvolama**

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Zaštita osjetljivih podataka i jasno razdvajanje odgovornosti između korisničkih uloga |
| Prednosti | Veća sigurnost, bolja kontrola pristupa, manji rizik zloupotrebe i greške |
| Nedostaci | Veća kompleksnost autorizacione logike |
| Napomena | Korisnici vide samo podatke relevantne za svoju ulogu i odgovornost |
| Implementacija | Middleware + role guards + backend provjera pristupa |

### Detaljno obrazloženje

Sistem za upravljanje servisnim intervencijama obrađuje veliki broj osjetljivih i operativno važnih podataka. Ti podaci uključuju:
- adresu lokacije kvara,
- kontakt podatke korisnika,
- opis problema,
- fotografije i priloge,
- podatke o intervencijama,
- interne operativne statuse,
- prioritete i operativne napomene.

Zbog toga nije prihvatljivo da svaki prijavljeni korisnik ima pristup svim detaljima sistema.

U okviru višeslojne arhitekture sistema, korisničke uloge imaju potpuno različite odgovornosti i potrebe:
- korisnik usluge treba vidjeti samo vlastite zahtjeve,
- dispečer mora imati operativni pregled i pristup zahtjevima koje obrađuje,
- serviser treba pristup samo intervencijama koje su mu dodijeljene,
- administrator ima širi pristup radi upravljanja sistemom.

Da bi sistem ostao siguran i pregledan, donesena je odluka da se koristi role-based pristup sa granularnim dozvolama. To znači da pristup nije definisan samo na nivou “ulogovan / nije ulogovan”, nego zavisi od:
- korisničke uloge,
- vlasništva nad zapisom,
- operativnog konteksta,
- dozvoljenih akcija unutar poslovnog procesa.

Ova odluka direktno podržava višeslojnu enterprise arhitekturu sistema:
- frontend sloj prikazuje samo relevantne funkcionalnosti,
- middleware sloj vrši zaštitu ruta i validaciju sesije,
- backend/API sloj provjerava dozvole pristupa,
- baza podataka dodatno ograničava pristup podacima kroz sigurnosna pravila.

Na taj način sigurnost ne zavisi samo od korisničkog interfejsa, nego se provodi kroz više slojeva sistema.

Pored sigurnosti, ova odluka ima i značajan UX efekat. Korisnicima se prikazuju samo informacije koje su im stvarno potrebne za rad. Time se:
- smanjuje kognitivno opterećenje,
- pojednostavljuje interfejs,
- smanjuje mogućnost greške,
- poboljšava intuitivnost sistema.

Na primjer, serviseru nije potrebno da vidi administrativne ili korisničke podatke koji nisu relevantni za njegov zadatak, dok korisnik usluge ne treba imati pristup internim operativnim informacijama dispečera.

Ovakav pristup omogućava:
- veću sigurnost sistema,
- jasnije razdvajanje odgovornosti,
- lakšu skalabilnost budućih uloga,
- jednostavnije održavanje arhitekture,
- profesionalniji i pregledniji korisnički interfejs.

Iako implementacija granularne autorizacije zahtijeva dodatni razvoj middleware logike, role guard mehanizama i backend validacija, dugoročno predstavlja mnogo sigurnije, održivije i profesionalnije rješenje za sistem ovog tipa.

---

# Odluka #006 – Sistemska procjena hitnosti i operativni prioritet nisu ista stvar

| Polje | Opis |
|---|---|
| ID odluke | DLI-006 |
| Datum | 09.05.2026. |
| Kratak naziv odluke | Hibridni model određivanja prioriteta |
| Opis problema | Potrebno je definisati kako sistem određuje hitnost i prioritet zahtjeva, te ko donosi konačnu operativnu odluku o obradi intervencije. |
| Razmatrane opcije | 1. Korisnik direktno određuje prioritet <br> 2. Dispečer ručno određuje prioritet bez sistemske pomoći <br> 3. Sistem automatski određuje prioritet bez ljudske potvrde <br> 4. Sistem generiše prijedlog hitnosti/prioriteta, a dispečer potvrđuje ili mijenja operativni prioritet |
| Odabrana opcija | Sistem generiše prijedlog hitnosti/prioriteta, a dispečer potvrđuje ili mijenja operativni prioritet |
| Razlog izbora | Kombinuje automatizaciju i ljudsku procjenu uz zadržavanje operativne kontrole nad sistemom. |
| Posljedice odluke | Potrebna implementacija poslovne logike za procjenu hitnosti i interfejsa za potvrdu ili izmjenu prioriteta. |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Stabilnost sistema | 5 |
| Skalabilnost | 5 |
| Održivost koda | 4 |
| Rizik regresionih grešaka | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Korisnik određuje prioritet | 1 | 2 | 2 | 1 | 5 | 41 |
| Dispečer ručno određuje prioritet | 4 | 4 | 4 | 4 | 4 | 76 |
| Potpuno automatski sistem | 4 | 5 | 5 | 3 | 2 | 79 |
| Hibridni model | 5 | 5 | 5 | 5 | 3 | 91 |

### Sažetak odluke

Krajnja odluka: **Hibridni model određivanja prioriteta**

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Automatizacija pomaže procjeni, ali konačna operativna odluka ostaje na čovjeku |
| Prednosti | Brža obrada, konzistentnija prioritizacija, manja subjektivnost |
| Nedostaci | Potrebna dodatna poslovna logika i UI za potvrdu prioriteta |
| Napomena | Korisnik ne određuje direktno prioritet intervencije |
| Implementacija | Sistem generiše prijedlog hitnosti, dispečer potvrđuje ili mijenja prioritet |

### Detaljno obrazloženje

U sistemu za upravljanje servisnim intervencijama korisnik ne određuje direktno operativni prioritet zahtjeva. Korisnik prilikom prijave problema samo popunjava upitnik i opisuje situaciju iz svoje perspektive.

Međutim, stvarni operativni prioritet zahtjeva zavisi od mnogo šireg konteksta koji korisnik ne vidi i ne može procijeniti:
- sigurnosni rizik,
- tip i ozbiljnost problema,
- potencijalne posljedice,
- raspoloživost servisera,
- trenutno opterećenje sistema,
- postojeće aktivne intervencije,
- poslovna pravila i SLA ograničenja.

Zbog toga je odbačena opcija da korisnik direktno određuje prioritet. Takav pristup bi doveo do velikog broja subjektivnih procjena i potencijalne zloupotrebe prioriteta, jer bi većina korisnika vlastiti problem označila kao “hitan”.

S druge strane, potpuno ručno određivanje prioriteta od strane dispečera bez ikakve sistemske pomoći povećava operativno opterećenje i usporava obradu zahtjeva.

Također, potpuno automatsko određivanje prioriteta bez ljudske potvrde nije dovoljno sigurno ni fleksibilno za realne operativne situacije. Sistem ne može uvijek razumjeti specifične okolnosti koje iskusan dispečer može prepoznati.

Zbog toga je usvojen hibridni model odlučivanja.

Korisnik samo unosi informacije kroz strukturisani upitnik i opis problema. Sistem zatim koristi poslovna pravila i logiku procjene kako bi izračunao preporučenu hitnost ili prijedlog prioriteta.

Na primjer, sistem može uzeti u obzir:
- vrstu kvara,
- da li postoji sigurnosni rizik,
- broj pogođenih korisnika,
- mogućnost dodatne štete,
- vrijeme prijave,
- hitnost termina,
- istoriju sličnih problema.

Na osnovu toga sistem generiše prijedlog prioriteta koji se prikazuje dispečeru.

Dispečer zatim:
- prihvata prijedlog,
- mijenja prioritet,
- ili donosi drugačiju operativnu odluku na osnovu iskustva i trenutnog stanja sistema.

Na ovaj način automatizacija služi kao pomoć operativnom osoblju, ali konačna kontrola i odgovornost ostaju na čovjeku.

Ovakav pristup omogućava:
- bržu obradu zahtjeva,
- konzistentniju prioritizaciju,
- smanjenje subjektivnih procjena,
- bolju skalabilnost sistema,
- zadržavanje ljudske kontrole nad operativnim procesima,
- mogućnost buduće nadogradnje sistema inteligentnijim modelima procjene.

Iako implementacija ovakvog modela zahtijeva dodatnu poslovnu logiku, procjenu hitnosti i UI mehanizme za potvrdu prioriteta, dugoročno predstavlja najstabilnije i najrealnije rješenje za operativni sistem ovog tipa.

---

# Odluka #007 – Standardizovani životni ciklus zahtjeva i intervencija

| Polje | Opis |
|---|---|
| ID odluke | DLI-007 |
| Datum | 09.05.2026. |
| Kratak naziv odluke | Statusni model operativnog toka |
| Opis problema | Potrebno je definisati jedinstven statusni model za zahtjeve i intervencije kako bi svi moduli sistema koristili ista pravila i isti životni ciklus zapisa. |
| Razmatrane opcije | 1. Svaki modul koristi vlastite statuse <br> 2. Minimalan broj generičkih statusa <br> 3. Jedinstveni centralizovani statusni model za cijeli sistem |
| Odabrana opcija | Jedinstveni centralizovani statusni model |
| Razlog izbora | Omogućava konzistentnost poslovne logike između dashboarda, zahtjeva, intervencija i operativnog toka. |
| Posljedice odluke | Potrebno jasno definisati dozvoljene statuse i prelaze između njih. |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Stabilnost sistema | 5 |
| Skalabilnost | 5 |
| Održivost koda | 4 |
| Rizik regresionih grešaka | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Odvojeni statusi po modulima | 2 | 2 | 2 | 1 | 5 | 46 |
| Minimalni generički statusi | 3 | 3 | 3 | 3 | 5 | 69 |
| Centralizovani statusni model | 5 | 5 | 5 | 5 | 4 | 92 |

### Sažetak odluke

Krajnja odluka: **Centralizovani statusni model**

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Svi moduli sistema moraju koristiti ista pravila životnog ciklusa |
| Prednosti | Konzistentnost sistema, lakše održavanje i filtriranje |
| Nedostaci | Potrebna stroga kontrola statusnih prelaza |
| Napomena | Statusi definišu šta je aktivno, završeno ili u obradi |
| Implementacija | Centralni statusni model u bazi i backend logici |

### Detaljno obrazloženje

Sistem za upravljanje servisnim intervencijama zavisi od velikog broja operativnih procesa koji koriste statuse za određivanje trenutnog stanja zahtjeva ili intervencije. Dashboard, filtriranje, prioriteti, izmjena zahtjeva, otkazivanje i dodjela servisera direktno zavise od statusnog modela.

Zbog toga nije prihvatljivo da svaki modul koristi vlastita pravila ili različite nazive statusa.

Donesena je odluka da sistem koristi jedinstveni centralizovani statusni model koji definiše:
- koje stanje zapis trenutno ima,
- da li je zahtjev aktivan,
- da li je dozvoljena izmjena,
- da li je dozvoljeno otkazivanje,
- da li zapis prelazi u intervenciju,
- da li je proces završen.

Na ovaj način svi dijelovi sistema koriste istu poslovnu logiku i ista pravila ponašanja.

Ovakav pristup značajno smanjuje rizik nekonzistentnosti između dashboarda, korisničkog pregleda, dispečerskog modula i baze podataka.

---

# Odluka #008 – Razdvajanje korisničkog zahtjeva i operativne intervencije

| Polje | Opis |
|---|---|
| ID odluke | DLI-008 |
| Datum | 09.05.2026. |
| Kratak naziv odluke | Zahtjev nije isto što i intervencija |
| Opis problema | Potrebno je definisati da li korisnički zahtjev i operativna intervencija predstavljaju isti zapis ili dvije različite faze poslovnog procesa. |
| Razmatrane opcije | 1. Zahtjev i intervencija predstavljaju isti entitet <br> 2. Zahtjev i intervencija su odvojene faze procesa <br> 3. Intervencija nastaje tek nakon operativne obrade zahtjeva |
| Odabrana opcija | Intervencija nastaje nakon operativne obrade zahtjeva |
| Razlog izbora | Zahtjev predstavlja korisničku prijavu problema, dok intervencija predstavlja operativni rad sistema. |
| Posljedice odluke | Potrebno definisati trenutak prelaska zahtjeva u intervenciju. |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Stabilnost sistema | 5 |
| Skalabilnost | 5 |
| Održivost koda | 4 |
| Rizik regresionih grešaka | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Isti entitet | 2 | 2 | 2 | 2 | 5 | 51 |
| Odvojene faze | 4 | 4 | 4 | 4 | 4 | 76 |
| Intervencija nastaje nakon obrade | 5 | 5 | 5 | 5 | 4 | 92 |

## Sažetak odluke

Krajnja odluka: **Intervencija nastaje nakon obrade zahtjeva**

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Zahtjev i intervencija imaju različitu poslovnu svrhu |
| Prednosti | Jasniji operativni tok i lakše upravljanje procesima |
| Nedostaci | Potrebna dodatna logika prelaska između faza |
| Napomena | Korisnik kreira zahtjev, sistem/dispečer kreira intervenciju |
| Implementacija | Razdvojeni moduli i statusni prelazi |

## Detaljno obrazloženje

Korisnički zahtjev predstavlja prijavu problema ili potrebe od strane korisnika usluge. U tom trenutku sistem još uvijek ne zna da li će zahtjev biti prihvaćen, kako će se obraditi i da li zahtijeva operativnu intervenciju.

Intervencija predstavlja potpuno drugačiju fazu procesa. Ona nastaje tek nakon što dispečer ili sistem obradi zahtjev, odredi prioritet i odluči da zahtjev ulazi u operativni tok rada.

Zbog toga je donesena odluka da zahtjev i intervencija ne predstavljaju istu stvar unutar sistema.

Ovakvo razdvajanje omogućava:
- jasnije razumijevanje poslovnog toka,
- bolju organizaciju dashboarda,
- jednostavnije filtriranje,
- precizniji operativni rad,
- lakšu skalabilnost sistema u budućnosti.

---

# Odluka #009 - Aktivni i historijski zapisi se prikazuju odvojeno

| Polje | Opis |
|---|---|
| ID odluke | DLI-009 |
| Datum | 09.05.2026. |
| Kratak naziv odluke | Odvajanje aktivnih i historijskih zapisa |
| Opis problema | Potrebno je definisati da li dashboard i operativni pregledi trebaju prikazivati sve zapise ili samo operativno relevantne podatke. |
| Razmatrane opcije | 1. Prikaz svih zapisa zajedno <br> 2. Ručno filtriranje historijskih zapisa <br> 3. Odvojeni prikaz aktivnih i historijskih zapisa |
| Odabrana opcija | Odvojeni prikaz aktivnih i historijskih zapisa |
| Razlog izbora | Aktivni rad zahtijeva fokus na trenutno relevantne intervencije i zahtjeve. |
| Posljedice odluke | Potrebno implementirati arhivu/historiju i logiku aktivnih statusa. |
| Status odluke | aktivna |

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Stabilnost sistema | 5 |
| Skalabilnost | 5 |
| Održivost koda | 4 |
| Rizik regresionih grešaka | 5 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Stabilnost | Skalabilnost | Održivost | Rizik regresije | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Sve zajedno | 2 | 2 | 2 | 2 | 5 | 51 |
| Ručni filteri | 3 | 3 | 3 | 3 | 4 | 66 |
| Odvojeni prikaz | 5 | 5 | 5 | 5 | 4 | 92 |

### Sažetak odluke

Krajnja odluka: **Odvojeni prikaz aktivnih i historijskih zapisa**

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Operativni korisnici moraju imati fokus na trenutno aktivne procese |
| Prednosti | Pregledniji dashboard i manje kognitivno opterećenje |
| Nedostaci | Potrebna dodatna arhiva/historija |
| Napomena | Historijski podaci ostaju dostupni kroz posebne sekcije |
| Implementacija | Aktivni dashboard + historijski pregled/arhiva |

## Detaljno obrazloženje

Prikazivanje svih zahtjeva i intervencija zajedno unutar operativnih ekrana dovelo bi do velikog broja irelevantnih podataka koji otežavaju svakodnevni rad dispečera i servisera.

Operativni korisnici moraju imati fokus na:
- zahtjeve koji čekaju obradu,
- aktivne intervencije,
- prioritete,
- stavke koje zahtijevaju pažnju.

Historijski i završeni zapisi imaju drugačiju svrhu: analizu, audit, pregled prethodnih intervencija i administrativnu evidenciju.

Zbog toga je donesena odluka da sistem odvojeno prikazuje aktivne i historijske zapise.

Ovakav pristup poboljšava preglednost sistema, smanjuje kognitivno opterećenje i omogućava brži operativni rad.
