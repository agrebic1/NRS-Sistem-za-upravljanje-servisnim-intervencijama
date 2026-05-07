# Decision Log

# Odluka #001 – Modularno proširenje sistema (Open-Closed princip)

| Polje | Opis |
|---|---|
| ID odluke | DLI-001 |
| Datum | 30.04.2026. |
| Kratak naziv odluke | Modularno proširenje sistema |
| Opis problema | Kako implementirati nove funkcionalnosti bez narušavanja stabilnosti postojećeg sistema i povećanja rizika od regresionih grešaka? |
| Razmatrane opcije | 1. Modifikacija postojećih kontrolera i ruta  <br> 2. Implementacija novih modula i odvojenih API ruta |
| Odabrana opcija | Modularno proširenje kroz nove module i rute |
| Razlog izbora | Omogućava stabilnost jezgra sistema, lakše održavanje i smanjuje rizik regresionih grešaka pri dodavanju novih funkcionalnosti. |
| Posljedice odluke | Povećan broj modula i fajlova, potreba za jasnijom organizacijom projekta i standardizacijom arhitekture. |
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
| Modifikacija postojećeg sistema | 2 | 2 | 2 | 1 | 5 | 47 |
| Modularno proširenje | 5 | 5 | 5 | 5 | 3 | 91 |

---

## Sažetak odluke

### Krajnja odluka: Modularno proširenje sistema

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Novi use-caseovi se mogu dodavati bez destabilizacije postojećeg sistema |
| Prednosti | Veća skalabilnost, lakše održavanje, bolja organizacija koda |
| Nedostaci | Veći broj fajlova i složenija struktura projekta |
| Napomena | Odluka prati Open-Closed princip arhitekture |
| Implementacija | Novi feature-i implementirani kroz zasebne module, rute i servise |

---

## Detaljno obrazloženje

Sistem je projektovan tako da podržava kontinuirano dodavanje novih funkcionalnosti bez potrebe za izmjenom stabilnog jezgra aplikacije. Direktno mijenjanje postojećih kontrolera i ruta povećava rizik od regresionih grešaka i otežava održavanje sistema kako broj funkcionalnosti raste.

Zbog toga je usvojen modularni pristup razvoja u kojem se nove funkcionalnosti implementiraju kroz zasebne module, servise i API rute. Time se postiže jasna separacija odgovornosti i omogućava da se pojedinačne funkcionalnosti razvijaju, testiraju i održavaju nezavisno od ostatka sistema.

Ovakav pristup omogućava:

- lakše uvođenje novih use-caseova
- manji rizik destabilizacije postojećeg sistema
- jednostavniji rollback problematičnih funkcionalnosti
- bolju organizaciju backend i frontend arhitekture
- lakše testiranje i održavanje

Iako modularni pristup povećava broj fajlova i inicijalnu kompleksnost arhitekture, dugoročno značajno poboljšava skalabilnost i održivost sistema.

---

# Odluka #002 – Algoritam objektivne hitnosti (Triage sistem)

| Polje | Opis |
|---|---|
| ID odluke | DLI-002 |
| Datum | 30.04.2026. |
| Kratak naziv odluke | Objektivna procjena hitnosti |
| Opis problema | Korisnici subjektivno označavaju svaki kvar kao “hitan”, što otežava prioritizaciju zahtjeva. |
| Razmatrane opcije | 1. Ručno određivanje prioriteta  <br> 2. Prioritetna skala 1-5  <br> 3. Bodovni sistem zasnovan na stvarnim posljedicama |
| Odabrana opcija | Bodovni sistem sa više kriterija |
| Razlog izbora | Smanjuje subjektivnost i omogućava automatsku prioritizaciju prema stvarnom riziku. |
| Posljedice odluke | Potreban backend servis za izračun hitnosti i logika za automatsko sortiranje zahtjeva. |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Objektivnost procjene | 5 |
| Preciznost prioritizacije | 5 |
| Skalabilnost | 4 |
| Automatizacija | 4 |
| Implementacijska kompleksnost | 3 |

### Ocjenjivanje i rezultat

| Opcija | Objektivnost | Preciznost | Skalabilnost | Automatizacija | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Ručno određivanje | 1 | 2 | 1 | 1 | 5 | 36 |
| Skala 1-5 | 3 | 3 | 3 | 2 | 4 | 58 |
| Bodovni sistem | 5 | 5 | 5 | 5 | 3 | 91 |

---

## Sažetak odluke

### Krajnja odluka: Bodovni sistem objektivne hitnosti

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Prioritet se određuje prema realnom riziku, a ne subjektivnoj procjeni korisnika |
| Prednosti | Preciznija trijaža, automatsko sortiranje, bolja organizacija rada |
| Nedostaci | Potrebna dodatna backend logika |
| Napomena | Sistem koristi više kriterija za kalkulaciju hitnosti |
| Implementacija | Backend servis računa ukupni score nakon prijave zahtjeva |

---

## Detaljno obrazloženje

Korisnici često označavaju svoje probleme kao hitne bez obzira na stvarni nivo rizika, što dovodi do preopterećenja dispečerskog sistema i otežava obradu stvarno kritičnih slučajeva.

Kako bi se uklonila subjektivnost iz procesa prioritizacije, uveden je bodovni sistem koji procjenjuje hitnost na osnovu stvarnih posljedica kvara.

Sistem procjenjuje:

- sigurnosni rizik
- uticaj na funkcionisanje objekta
- potencijalnu štetu
- ranjivost korisnika
- obuhvat problema

Na osnovu ukupnog broja bodova zahtjevi se automatski sortiraju po prioritetu.

Ovakav pristup omogućava:

- objektivniju obradu zahtjeva
- smanjenje manipulacije prioritetima
- efikasniji rad dispečera
- bolju raspodjelu servisera
- automatizovanu trijažu sistema

Iako zahtijeva dodatnu backend logiku i održavanje pravila bodovanja, sistem značajno unapređuje operativnu efikasnost platforme.

---

# Odluka #003 – Korisnički prijedlozi termina intervencije

| Polje | Opis |
|---|---|
| ID odluke | DLI-003 |
| Datum | 30.04.2026. |
| Kratak naziv odluke | Hibridni model zakazivanja |
| Opis problema | Kako smanjiti manuelnu komunikaciju između korisnika i dispečera prilikom zakazivanja termina? |
| Razmatrane opcije | 1. Potpuno manuelno zakazivanje  <br> 2. Potpuno automatsko zakazivanje  <br> 3. Hibridni model |
| Odabrana opcija | Korisnik predlaže termine, dispečer potvrđuje |
| Razlog izbora | Balans između fleksibilnosti korisnika i operativne kontrole sistema |
| Posljedice odluke | Potreban razvoj kalendarskog UI-a i backend logike za vremenske slotove |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| UX i fleksibilnost | 5 |
| Operativna kontrola | 5 |
| Smanjenje manuelne komunikacije | 4 |
| Skalabilnost | 4 |
| Kompleksnost implementacije | 3 |

### Ocjenjivanje i rezultat

| Opcija | UX | Kontrola | Automatizacija | Skalabilnost | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Manuelno zakazivanje | 2 | 5 | 1 | 2 | 5 | 53 |
| Automatsko zakazivanje | 4 | 2 | 5 | 5 | 2 | 71 |
| Hibridni model | 5 | 5 | 4 | 5 | 3 | 89 |

---

## Sažetak odluke

### Krajnja odluka: Hibridni model zakazivanja

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Omogućava asinhronu komunikaciju i veću fleksibilnost |
| Prednosti | Manje telefonskih poziva, bolji UX, efikasnija organizacija termina |
| Nedostaci | Kompleksniji UI i backend logika |
| Napomena | Dispečer zadržava finalnu kontrolu nad terminom |
| Implementacija | Korisnik bira slotove dostupnosti, dispečer potvrđuje termin |

---

## Detaljno obrazloženje

Potpuno manuelno zakazivanje zahtijeva veliki broj telefonskih poziva i dodatnu komunikaciju između korisnika i dispečera. S druge strane, potpuno automatsko zakazivanje može dovesti do konflikta termina i operativnih problema.

Zbog toga je usvojen hibridni model u kojem korisnik predlaže vremenske prozore dostupnosti, dok dispečer donosi konačnu odluku o terminu intervencije.

Ovakav pristup omogućava:

- smanjenje manuelne komunikacije
- asinhrono zakazivanje
- bolju organizaciju ruta servisera
- fleksibilnost korisniku
- veću operativnu kontrolu

Sistem koristi kalendarski interfejs za izbor termina i backend logiku za validaciju i čuvanje vremenskih slotova.

---

# Odluka #004 – Definisanje maksimalnog broja slotova

| Polje | Opis |
|---|---|
| ID odluke | DLI-004 |
| Datum | 30.04.2026. |
| Kratak naziv odluke | Ograničenje broja termina |
| Opis problema | Koliko termina korisnik treba moći ponuditi prilikom zakazivanja? |
| Razmatrane opcije | 1. Samo jedan termin  <br> 2. Fiksni broj termina  <br> 3. Neograničen broj termina |
| Odabrana opcija | Fiksni broj termina |
| Razlog izbora | Balans između fleksibilnosti i operativne efikasnosti |
| Posljedice odluke | Potrebna frontend validacija i ograničenje izbora |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Operativna efikasnost | 5 |
| UX | 4 |
| Fleksibilnost | 4 |
| Jednostavnost obrade | 4 |
| Kompleksnost implementacije | 3 |

### Ocjenjivanje i rezultat

| Opcija | Efikasnost | UX | Fleksibilnost | Obrada | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Jedan termin | 2 | 2 | 1 | 5 | 5 | 48 |
| Fiksni broj termina | 5 | 5 | 4 | 5 | 4 | 87 |
| Neograničeno termina | 2 | 3 | 5 | 1 | 2 | 49 |

---

## Sažetak odluke

### Krajnja odluka: Fiksni broj termina

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Dovoljno opcija za dispečera bez preopterećenja korisnika |
| Prednosti | Bolja logistika, jasniji UI, lakša obrada |
| Nedostaci | Ograničena fleksibilnost |
| Napomena | Slotovi predstavljaju prijedloge dostupnosti |
| Implementacija | Frontend ograničava maksimalan broj odabranih termina |

---

## Detaljno obrazloženje

Ako korisnik može ponuditi samo jedan termin, povećava se vjerovatnoća dodatne komunikacije i potrebe za ponovnim zakazivanjem. S druge strane, neograničen broj termina otežava preglednost i obradu zahtjeva.

Zbog toga je odabran model sa fiksnim brojem slotova koji korisniku daje dovoljno fleksibilnosti, a dispečeru više mogućnosti za organizaciju rasporeda.

Ovaj pristup:

- smanjuje potrebu za dodatnim kontaktiranjem korisnika
- poboljšava organizaciju ruta servisera
- održava preglednost interfejsa
- smanjuje kompleksnost obrade termina

---

# Odluka #005 – Hijerarhija kategorija sa potkategorijom

| Polje | Opis |
|---|---|
| ID odluke | DLI-005 |
| Datum | 03.05.2026. |
| Kratak naziv odluke | Main + sub kategorije |
| Opis problema | Kako omogućiti precizan izbor vrste kvara bez preopterećenja korisnika? |
| Razmatrane opcije | 1. Slobodan unos teksta  <br> 2. Jedna velika lista svih kvarova  <br> 3. Glavna kategorija + potkategorija |
| Odabrana opcija | Glavna kategorija + potkategorija |
| Razlog izbora | Balans između preciznosti podataka i jednostavnosti korištenja |
| Posljedice odluke | Potrebna centralna kategorijska konfiguracija i validacija kombinacija |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| UX / kognitivno opterećenje | 5 |
| Preciznost podataka | 5 |
| Skalabilnost modela | 4 |
| FE/BE usklađenost | 4 |
| Održivost | 3 |

### Ocjenjivanje i rezultat

| Opcija | UX | Preciznost | Skalabilnost | Usklađenost | Održivost | Ukupno |
|---|---|---|---|---|---|---|
| Slobodan unos | 3 | 1 | 2 | 1 | 4 | 38 |
| Jedna velika lista | 2 | 3 | 3 | 3 | 4 | 45 |
| Main + optional sub | 5 | 5 | 5 | 5 | 4 | 89 |

---

## Sažetak odluke

### Krajnja odluka: Main + sub model

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Precizan unos bez komplikovanja korisničkog toka |
| Prednosti | Bolja organizacija podataka, jednostavniji UX |
| Nedostaci | Potrebna dodatna validaciona logika |
| Napomena | Potkategorija je obavezna |
| Implementacija | Centralni katalog kategorija + validacija kombinacija |

---

## Detaljno obrazloženje

Slobodan unos teksta dovodi do nekonzistentnih podataka i otežava automatizaciju sistema. Jedna velika lista svih kvarova stvara preveliko kognitivno opterećenje i otežava pronalazak odgovarajuće opcije.

Zbog toga je uveden model glavne kategorije sa potkategorijom.

Sistem funkcioniše po principu:

- korisnik prvo bira glavnu kategoriju
- ako kategorija ima potkategorije, izbor podkategorije postaje obavezan
- ako ne postoje potkategorije, proces se nastavlja bez dodatnog koraka

Ovakav model omogućava:

- preciznije klasifikovanje kvarova
- bolju organizaciju podataka
- jednostavniji korisnički tok
- lakšu backend obradu i automatizaciju

Frontend i backend koriste iste kategorijske definicije i validacione funkcije kako bi se održala konzistentnost sistema.

---

# Odluka #006 – Premium aktivacija kao odvojeni tok

| Polje | Opis |
|---|---|
| ID odluke | DLI-006 |
| Datum | 06.05.2026. |
| Kratak naziv odluke | Odvojeni premium lifecycle |
| Opis problema | Premium opcija je postojala bez jasno definisanog procesa aktivacije i validacije prava korištenja. |
| Razmatrane opcije | 1. Premium samo kao checkbox  <br> 2. Odvojeni premium activation flow |
| Odabrana opcija | Odvojeni tok aktivacije i korištenja |
| Razlog izbora | Jasno razdvajanje aktivacije i korištenja premium funkcionalnosti |
| Posljedice odluke | Potrebni posebni API endpointi, validacija statusa i lifecycle logika |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Jasnoća lifecycle-a | 5 |
| Sigurnost i validacija | 5 |
| Skalabilnost premium sistema | 4 |
| Održivost | 4 |
| Kompleksnost implementacije | 3 |

### Ocjenjivanje i rezultat

| Opcija | Jasnoća | Sigurnost | Skalabilnost | Održivost | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Premium checkbox | 2 | 2 | 2 | 2 | 5 | 49 |
| Odvojeni activation flow | 5 | 5 | 5 | 5 | 3 | 91 |

---

## Sažetak odluke

### Krajnja odluka: Odvojeni premium activation flow

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Jasna kontrola premium prava i lifecycle tranzicija |
| Prednosti | Bolja validacija, audit trail, skalabilnost |
| Nedostaci | Veća kompleksnost backend logike |
| Napomena | MVP koristi simuliranu naplatu |
| Implementacija | start / confirm / cancel / renew lifecycle |

---

## Detaljno obrazloženje

Premium funkcionalnosti predstavljaju poseban poslovni model sistema i zahtijevaju jasnu kontrolu prava korištenja. Jednostavan checkbox pristup ne omogućava precizno praćenje aktivacije, isteka i validacije premium statusa.

Zbog toga je premium aktivacija izdvojena u zaseban lifecycle tok koji obuhvata:

- pokretanje aktivacije
- potvrdu aktivacije
- obnovu
- otkazivanje
- validaciju prava korištenja

Sistem implementira audit događaje i kontrolu premium statusa prije korištenja premium funkcionalnosti.

Ovakav pristup omogućava:

- bolju kontrolu pristupa premium opcijama
- lakšu integraciju budućih payment gateway sistema
- jasniji lifecycle model
- precizniju validaciju korisničkih prava

---

# Odluka #007 – Standardizacija premium aktivacije na dvokorak

| Polje | Opis |
|---|---|
| ID odluke | DLI-007 |
| Datum | 06.05.2026. |
| Kratak naziv odluke | Standardni activation flow |
| Opis problema | Paralelno postojanje brzog i standardnog activation flow-a stvaralo je nekonzistentnost. |
| Razmatrane opcije | 1. Zadržati oba toka  <br> 2. Standardizovati activation flow |
| Odabrana opcija | Standardni dvokorak |
| Razlog izbora | Konzistentnost lifecycle tranzicija i jednostavnije održavanje |
| Posljedice odluke | Uklanjanje brzog activation endpointa |
| Status odluke | aktivna |

---

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Konzistentnost sistema | 5 |
| Jednostavnost testiranja | 4 |
| Održivost | 4 |
| UX jasnoća | 4 |
| Kompleksnost implementacije | 3 |

### Ocjenjivanje i rezultat

| Opcija | Konzistentnost | Testiranje | Održivost | UX | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Dva toka | 2 | 2 | 2 | 3 | 3 | 43 |
| Standardni dvokorak | 5 | 5 | 5 | 5 | 4 | 88 |

---

## Sažetak odluke

### Krajnja odluka: Standardni dvokorak

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Jedinstven i predvidiv activation lifecycle |
| Prednosti | Lakše održavanje, jednostavnije testiranje |
| Nedostaci | Sporiji activation flow |
| Napomena | UI koristi standardni lifecycle |
| Implementacija | start → confirm flow |

---

## Detaljno obrazloženje

Paralelno postojanje brzog i standardnog activation toka uvodilo je nekonzistentnost u lifecycle premium sistema. Različiti tokovi otežavali su testiranje, dokumentaciju i održavanje backend logike.

Standardizacijom activation flow-a sistem dobija:

- predvidiv lifecycle
- jednostavniju validaciju tranzicija
- konzistentniji UX
- lakše održavanje i testiranje

Iako dvokorak uvodi dodatni korak aktivacije, dugoročno pruža stabilniji i održiviji sistem.

---

# Odluka #008 – SOS Bypass za hitne slučajeve

| Polje | Opis |
|---|---|
| ID odluke | DLI-008 |
| Datum | 06.05.2026. |
| Kratak naziv odluke | SOS Bypass protokol |
| Opis problema | Da li premium hitni korisnici trebaju prolaziti kroz standardni wizard proces? |
| Razmatrane opcije | 1. Standardni tok za sve  <br> 2. Telefonski poziv  <br> 3. SOS bypass |
| Odabrana opcija | SOS bypass protokol |
| Razlog izbora | Maksimalno ubrzavanje procesa za krizne situacije |
| Posljedice odluke | Serviser izlazi na teren sa manje informacija |
| Status odluke | odgođeno (post-MVP) |

---

## Trade-off analiza (Decision Matrix)

### Težine kriterija

| Kriterij | Težina |
|---|---|
| Brzina reakcije | 5 |
| UX u kriznim situacijama | 5 |
| Preciznost podataka | 4 |
| Operativna kontrola | 4 |
| Kompleksnost implementacije | 3 |

### Ocjenjivanje i rezultat

| Opcija | Brzina | UX | Preciznost | Kontrola | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Standardni tok | 2 | 2 | 5 | 5 | 5 | 63 |
| Telefonski poziv | 4 | 3 | 2 | 2 | 2 | 49 |
| SOS bypass | 5 | 5 | 3 | 4 | 3 | 82 |

---

## Sažetak odluke

### Krajnja odluka: SOS bypass

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Minimizacija vremena potrebnog za prijavu hitnog slučaja |
| Prednosti | Veća brzina reakcije, manja frustracija korisnika |
| Nedostaci | Manje detaljne informacije za servisera |
| Napomena | Funkcionalnost planirana nakon MVP faze |
| Implementacija | Preskakanje standardnog wizard toka uz premium naplatu |

---

## Detaljno obrazloženje

U kriznim situacijama svaki dodatni korak povećava vjerovatnoću da korisnik odustane od sistema i potraži pomoć van platforme.

Zbog toga je predviđen SOS bypass protokol koji omogućava:

- preskakanje standardne trijaže
- minimalan broj koraka
- najbrži mogući put do servisera

Sistem prihvata kompromis da serviser na teren izlazi sa manje informacija u zamjenu za maksimalnu brzinu reakcije.

Dodatno, premium cijena SOS intervencije funkcioniše kao prirodni filter protiv zloupotrebe hitnog režima rada.

Ova funkcionalnost je planirana za post-MVP fazu zbog povećane kompleksnosti logistike i operativne organizacije.
