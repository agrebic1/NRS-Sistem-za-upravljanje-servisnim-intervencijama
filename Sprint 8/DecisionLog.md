# Decision Log

## Odluka #001 – Višestruki preferirani termini korisnika

| Polje | Opis |
|---|---|
| ID odluke | DLI-001 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Višestruki preferirani termini |
| Opis problema | Potrebno je definisati da li korisnik treba imati mogućnost izbora samo jednog termina ili više preferiranih termina za servisnu intervenciju. |
| Razmatrane opcije | 1. Korisnik bira samo jedan termin <br> 2. Korisnik bira do tri preferirana termina <br> 3. Termin određuje isključivo dispečer |
| Odabrana opcija | Korisnik može odabrati do tri preferirana termina: jedan primarni i do dva alternativna |
| Razlog izbora | Veća fleksibilnost pri planiranju i lakše usklađivanje korisnika, servisera i operativnog rasporeda |
| Posljedice odluke | Potrebno je implementirati podršku za više termina u formama, validacijama, prikazima i logici planiranja |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Fleksibilnost planiranja | 5 |
| Operativna efikasnost | 5 |
| Jednostavnost korisničkog toka | 3 |
| Skalabilnost sistema | 4 |
| Implementacijska kompleksnost | 3 |

#### Ocjenjivanje i rezultat

| Opcija | Fleksibilnost | Efikasnost | Jednostavnost | Skalabilnost | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Samo jedan termin | 2 | 2 | 5 | 2 | 5 | 61 |
| Do tri termina | 5 | 5 | 4 | 5 | 3 | 90 |
| Termin određuje dispečer | 3 | 3 | 2 | 4 | 4 | 63 |

### Sažetak odluke

**Krajnja odluka:** Korisnik može odabrati do tri preferirana termina.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Omogućava fleksibilnije planiranje i smanjuje potrebu za dodatnim kontaktiranjem korisnika |
| Prednosti | Lakše usklađivanje termina, bolja organizacija rada, manje konflikata rasporeda |
| Nedostaci | Veća složenost validacije i prikaza termina |
| Napomena | Prvi termin se tretira kao primarni, ostali kao alternativni |
| Implementacija | Kartice termina, vizuelni prikaz prioriteta termina i validacija redoslijeda |

### Detaljno obrazloženje

U realnom procesu servisnih intervencija korisnici često nisu sigurni da im odgovara samo jedan termin. Ako sistem podržava isključivo jedan termin, dispečer ima veoma ograničen prostor za planiranje, posebno kada treba uskladiti raspored više servisera, postojeće intervencije i prioritetne zahtjeve.

Zbog toga je donesena odluka da korisnik može odabrati do tri preferirana termina. Prvi termin predstavlja primarni izbor korisnika, dok ostali termini služe kao alternativne opcije ukoliko primarni termin nije moguće organizovati.

Na ovaj način dispečer dobija veću fleksibilnost pri planiranju i smanjuje se potreba za dodatnim telefonskim kontaktima i ručnim usklađivanjem termina. Sistem postaje realniji i bliži stvarnom operativnom radu.

Odluka povećava složenost forme i validacije, ali donosi značajno kvalitetnije planiranje i bolju iskorištenost resursa.

---

## Odluka #002 – Asistivna preporuka servisera umjesto automatske dodjele

| Polje | Opis |
|---|---|
| ID odluke | DLI-017 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Asistivni izbor servisera |
| Opis problema | Potrebno je definisati da li sistem treba automatski dodjeljivati servisera ili samo pomoći dispečeru kroz preporuku kandidata. |
| Razmatrane opcije | 1. Potpuno ručna dodjela servisera <br> 2. Potpuno automatska dodjela servisera <br> 3. Sistem preporučuje servisera, a dispečer donosi konačnu odluku |
| Odabrana opcija | Sistem daje preporuku najpogodnijeg servisera, ali dispečer potvrđuje ili mijenja izbor |
| Razlog izbora | Balans između automatizacije i ljudske operativne kontrole |
| Posljedice odluke | Potrebno je implementirati scoring/ranking logiku i prikaz razloga preporuke |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Operativna kontrola | 5 |
| Brzina dodjele | 4 |
| Rizik pogrešne dodjele | 5 |
| Skalabilnost | 4 |
| Implementacijska kompleksnost | 3 |

#### Ocjenjivanje i rezultat

| Opcija | Kontrola | Brzina | Rizik | Skalabilnost | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Ručna dodjela | 5 | 2 | 5 | 2 | 5 | 74 |
| Automatska dodjela | 1 | 5 | 2 | 5 | 3 | 58 |
| Asistivna preporuka | 5 | 5 | 4 | 5 | 4 | 92 |

### Sažetak odluke

**Krajnja odluka:** Sistem preporučuje servisera, ali dispečer donosi konačnu odluku.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Zadržava ljudsku kontrolu uz pomoć automatizacije |
| Prednosti | Brža dodjela, bolja podrška dispečeru, manji rizik loše odluke |
| Nedostaci | Potrebna dodatna scoring logika |
| Napomena | Sistem ne smije automatski zaključavati izbor servisera |
| Implementacija | Ranking kandidata, prikaz procenta podudaranja i razloga preporuke |

### Detaljno obrazloženje

Dodjela servisera predstavlja operativnu odluku koja direktno utiče na kvalitet i brzinu izvršenja intervencije. Potpuno ručna dodjela ostavlja sav teret odlučivanja na dispečeru, dok potpuno automatska dodjela može proizvesti pogrešne odluke u situacijama koje zahtijevaju ljudsku procjenu.

Zbog toga je odabran asistivni model. Sistem analizira dostupne podatke o serviserima i predlaže najpogodnije kandidate na osnovu kriterija kao što su stručnost, dostupnost, blizina i opterećenje. Međutim, konačna odluka ostaje na dispečeru.

Na taj način sistem funkcioniše kao pametan pomoćnik, a ne kao potpuno autonoman mehanizam za raspoređivanje ljudi.

---

## Odluka #003 – Model glavnog servisera i pomoćnih servisera

| Polje | Opis |
|---|---|
| ID odluke | DLI-003 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Glavni i pomoćni serviseri |
| Opis problema | Potrebno je definisati kako organizovati dodjelu više servisera jednoj intervenciji. |
| Razmatrane opcije | 1. Samo jedan serviser po intervenciji <br> 2. Svi serviseri ravnopravni članovi tima <br> 3. Jedan glavni serviser uz pomoćne servisere |
| Odabrana opcija | Jedan glavni serviser uz mogućnost dodavanja pomoćnih servisera |
| Razlog izbora | Jasna odgovornost uz podršku timskog rada |
| Posljedice odluke | Potrebno je razlikovati glavnog servisera i pomoćne servisere u sistemu |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Jasna odgovornost | 5 |
| Podrška timskom radu | 4 |
| Jednostavnost modela | 3 |
| Skalabilnost | 4 |
| Operativna preglednost | 5 |

#### Ocjenjivanje i rezultat

| Opcija | Odgovornost | Timski rad | Jednostavnost | Skalabilnost | Preglednost | Ukupno |
|---|---|---|---|---|---|---|
| Samo jedan serviser | 5 | 1 | 5 | 2 | 5 | 66 |
| Svi ravnopravni | 2 | 5 | 3 | 5 | 2 | 63 |
| Glavni + pomoćni | 5 | 5 | 4 | 5 | 5 | 94 |

### Sažetak odluke

**Krajnja odluka:** Jedan glavni serviser uz pomoćne servisere po potrebi.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Omogućava timski rad bez gubitka odgovornosti |
| Prednosti | Jasno definisan odgovorni izvršilac i podrška složenim intervencijama |
| Nedostaci | Veća složenost modela i UI prikaza |
| Napomena | Glavni serviser vodi intervenciju, pomoćni servisera asistiraju |
| Implementacija | Team assignment, razdvajanje glavnog i pomoćnih servisera |

### Detaljno obrazloženje

Jednostavne intervencije uglavnom zahtijevaju samo jednog servisera. Međutim, složenije intervencije često traže dodatno osoblje ili više stručnjaka različitih profila.

Ako bi svi serviseri bili tretirani kao potpuno ravnopravni članovi tima, sistem ne bi jasno pokazivao ko je odgovoran za intervenciju. Zbog toga je uveden model jednog glavnog servisera koji predstavlja odgovornog izvršioca, dok se pomoćni serviseri dodaju po potrebi.

Na ovaj način sistem podržava timski rad, ali i dalje zadržava jasnu odgovornost nad intervencijom.

---

## Odluka #004 – Obavezno obrazloženje kod odbijanja zadatka

| Polje | Opis |
|---|---|
| ID odluke | DLI-004 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Obavezno obrazloženje odbijanja |
| Opis problema | Potrebno je definisati da li serviser može odbiti zadatak bez dodatnog objašnjenja ili sistem mora zahtijevati razlog odbijanja. |
| Razmatrane opcije | 1. Odbijanje bez razloga <br> 2. Opcionalan razlog odbijanja <br> 3. Obavezan razlog odbijanja |
| Odabrana opcija | Obavezan razlog odbijanja zadatka |
| Razlog izbora | Dispečer mora imati kontekst za novu dodjelu i operativnu procjenu situacije |
| Posljedice odluke | Potrebno je evidentirati razlog odbijanja i prikazati ga dispečeru |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Operativna transparentnost | 5 |
| Kvalitet planiranja | 5 |
| Jednostavnost korištenja | 3 |
| Audit i evidencija | 4 |
| Implementacijska kompleksnost | 2 |

#### Ocjenjivanje i rezultat

| Opcija | Transparentnost | Planiranje | Jednostavnost | Audit | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| Bez razloga | 1 | 1 | 5 | 1 | 5 | 44 |
| Opcionalan razlog | 3 | 3 | 4 | 3 | 4 | 65 |
| Obavezan razlog | 5 | 5 | 3 | 5 | 4 | 88 |

### Sažetak odluke

**Krajnja odluka:** Razlog odbijanja zadatka je obavezan.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Dispečer mora znati zašto je zadatak odbijen |
| Prednosti | Veća transparentnost i kvalitetnija preraspodjela |
| Nedostaci | Dodatni korak za servisera |
| Napomena | Razlog se evidentira u historiji aktivnosti |
| Implementacija | Modal sa obaveznim unosom razloga |

### Detaljno obrazloženje

Ako bi serviser mogao odbiti zadatak bez objašnjenja, dispečer ne bi imao dovoljno informacija za procjenu problema i novu dodjelu intervencije. To bi moglo dovesti do ponavljanja istih grešaka, lošeg planiranja i dodatnih operativnih zastoja.

Zbog toga je donesena odluka da razlog odbijanja bude obavezan. Time sistem zadržava operativni kontekst i omogućava kvalitetniju organizaciju rada.

---

## Odluka #005 – Ponovno rangiranje servisera nakon odbijanja

| Polje | Opis |
|---|---|
| ID odluke | DLI-005 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Smart reassignment |
| Opis problema | Potrebno je definisati ponašanje sistema nakon što serviser odbije dodijeljenu intervenciju. |
| Razmatrane opcije | 1. Ručna nova dodjela bez preporuka <br> 2. Ponovno predlaganje istog servisera <br> 3. Novo rangiranje kandidata uz isključenje odbijenog servisera |
| Odabrana opcija | Novo rangiranje kandidata uz privremeno isključenje odbijenog servisera |
| Razlog izbora | Izbjegava se ponavljanje neuspješnih dodjela i ubrzava nova organizacija intervencije |
| Posljedice odluke | Potrebna dodatna reassignment logika i audit evidencija |
| Status odluke | aktivna |

### Sažetak odluke

**Krajnja odluka:** Nakon odbijanja sistem ponovo računa preporuke servisera.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Sprječava ponavljanje istih neuspješnih dodjela |
| Prednosti | Brža nova organizacija intervencije |
| Nedostaci | Dodatna kompleksnost ranking logike |
| Napomena | Odbijeni serviser se ne preporučuje odmah ponovo |
| Implementacija | Re-ranking kandidata i status „Potrebna nova dodjela“ |

### Detaljno obrazloženje

Kada serviser odbije intervenciju, sistem mora reagovati brzo i pomoći dispečeru da pronađe novog kandidata. Ako bi sistem ponovo preporučio istog servisera, povećala bi se mogućnost ponovnog odbijanja i dodatnog gubitka vremena.

Zbog toga je implementirano ponovno rangiranje kandidata uz privremeno isključenje odbijenog servisera iz aktivnih preporuka.

---

## Odluka #006 – Ponovno rangiranje servisera nakon odbijanja

| Polje | Opis |
|---|---|
| ID odluke | DLI-006 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Smart reassignment |
| Opis problema | Potrebno je definisati ponašanje sistema nakon što serviser odbije dodijeljenu intervenciju. |
| Razmatrane opcije | 1. Ručna nova dodjela bez preporuka <br> 2. Ponovno predlaganje istog servisera <br> 3. Novo rangiranje kandidata uz isključenje odbijenog servisera |
| Odabrana opcija | Novo rangiranje kandidata uz privremeno isključenje odbijenog servisera |
| Razlog izbora | Izbjegava se ponavljanje neuspješnih dodjela i ubrzava nova organizacija intervencije |
| Posljedice odluke | Potrebna dodatna reassignment logika i audit evidencija |
| Status odluke | aktivna |

### Sažetak odluke

**Krajnja odluka:** Nakon odbijanja sistem ponovo računa preporuke servisera.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Sprječava ponavljanje istih neuspješnih dodjela |
| Prednosti | Brža nova organizacija intervencije |
| Nedostaci | Dodatna kompleksnost ranking logike |
| Napomena | Odbijeni serviser se ne preporučuje odmah ponovo |
| Implementacija | Re-ranking kandidata i status „Potrebna nova dodjela“ |

### Detaljno obrazloženje

Kada serviser odbije intervenciju, sistem mora reagovati brzo i pomoći dispečeru da pronađe novog kandidata. Ako bi sistem ponovo preporučio istog servisera, povećala bi se mogućnost ponovnog odbijanja i dodatnog gubitka vremena.

Zbog toga je implementirano ponovno rangiranje kandidata uz privremeno isključenje odbijenog servisera iz aktivnih preporuka.

---

## Odluka #007 – Backend validacija statusnih prelaza kao izvor istine

| Polje | Opis |
|---|---|
| ID odluke | DLI-007 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Backend kao izvor istine |
| Opis problema | Potrebno je definisati gdje će se validirati dozvoljeni prelazi statusa intervencije. |
| Razmatrane opcije | 1. Validacija samo na frontend-u <br> 2. Validacija samo na backend-u <br> 3. Frontend UX validacija + backend finalna validacija |
| Odabrana opcija | Backend predstavlja finalni izvor istine uz dodatnu frontend validaciju radi UX-a |
| Razlog izbora | Sigurnost i konzistentnost poslovne logike |
| Posljedice odluke | Potrebna centralizovana status transition logika |
| Status odluke | aktivna |

### Sažetak odluke

**Krajnja odluka:** Backend validira sve statusne prelaze.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Frontend ne smije biti jedini mehanizam kontrole poslovne logike |
| Prednosti | Veća sigurnost i konzistentnost sistema |
| Nedostaci | Dodatna backend logika |
| Napomena | Frontend i dalje prikazuje samo dozvoljene akcije radi UX-a |
| Implementacija | Centralni transition rules modul |

### Detaljno obrazloženje

Frontend validacija može poboljšati korisničko iskustvo, ali ne smije biti jedini mehanizam zaštite poslovnih pravila. Korisnik može zaobići frontend ograničenja ili poslati nevalidne zahtjeve direktno prema API-ju.

Zbog toga je donesena odluka da backend bude finalni izvor istine za statusne prelaze.

---

## Odluka #008 – Formalno zatvaranje intervencije i read-only stanje

| Polje | Opis |
|---|---|
| ID odluke | DLI-008 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Read-only zatvorena intervencija |
| Opis problema | Potrebno je definisati šta se dešava nakon formalnog zatvaranja intervencije. |
| Razmatrane opcije | 1. Intervencija ostaje potpuno editable <br> 2. Djelimično zaključavanje <br> 3. Read-only stanje nakon zatvaranja |
| Odabrana opcija | Intervencija prelazi u read-only stanje nakon zatvaranja |
| Razlog izbora | Sprječava naknadne nekontrolisane izmjene |
| Posljedice odluke | Potrebno je zaključati određene akcije i prikazati status zatvorenosti |
| Status odluke | aktivna |

### Sažetak odluke

**Krajnja odluka:** Zatvorena intervencija prelazi u read-only stanje.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Očuvanje integriteta završenih intervencija |
| Prednosti | Stabilniji audit i manje rizika od grešaka |
| Nedostaci | Potrebni dodatni workflow uslovi |
| Napomena | Samo određene administrativne akcije mogu ostati dozvoljene |
| Implementacija | Zaključavanje status akcija i edit mogućnosti |

### Detaljno obrazloženje

Nakon što dispečer potvrdi završetak intervencije, sistem mora tretirati taj zapis kao formalno završen proces. Ako bi intervencija ostala potpuno otvorena za izmjene, postojala bi mogućnost naknadnog mijenjanja važnih podataka bez jasne kontrole.

Zbog toga je implementirano read-only stanje nakon zatvaranja intervencije.

---

## Odluka #009 – Komunikacija kroz napomene umjesto eksternog chata

| Polje | Opis |
|---|---|
| ID odluke | DLI-009 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Centralizovane napomene |
| Opis problema | Potrebno je definisati način komunikacije između servisera i dispečera. |
| Razmatrane opcije | 1. Eksterni chat sistem <br> 2. Komunikacija van sistema <br> 3. Napomene vezane za intervenciju |
| Odabrana opcija | Komunikacija kroz napomene vezane za konkretnu intervenciju |
| Razlog izbora | Sve informacije ostaju centralizovane i povezane sa intervencijom |
| Posljedice odluke | Potrebno je implementirati timeline napomena |
| Status odluke | aktivna |

### Sažetak odluke

**Krajnja odluka:** Komunikacija se odvija kroz napomene na intervenciji.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Važne informacije ostaju trajno vezane za intervenciju |
| Prednosti | Centralizacija komunikacije i bolji audit |
| Nedostaci | Nije zamjena za real-time chat |
| Napomena | Fokus je na operativnim informacijama |
| Implementacija | NapomeneThread i activity timeline |

### Detaljno obrazloženje

Komunikacija između servisera i dispečera predstavlja važan dio operativnog procesa. Ako bi komunikacija bila izvan sistema, informacije bi bile rasute po različitim kanalima i teže dostupne kasnije.

Zbog toga je odlučeno da komunikacija bude vezana direktno za intervenciju kroz sistem napomena.

---

## Odluka #010 – Audit log i historija aktivnosti intervencije

| Polje | Opis |
|---|---|
| ID odluke | DLI-010 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Audit log intervencije |
| Opis problema | Potrebno je definisati da li sistem treba evidentirati historiju promjena i aktivnosti nad intervencijama. |
| Razmatrane opcije | 1. Bez historije aktivnosti <br> 2. Evidentiranje samo statusa <br> 3. Centralizovani audit log svih važnih aktivnosti |
| Odabrana opcija | Centralizovani audit log svih važnih aktivnosti |
| Razlog izbora | Omogućava transparentnost, praćenje promjena i operativni audit |
| Posljedice odluke | Potrebno je evidentirati i prikazivati sve važne aktivnosti nad intervencijom |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Transparentnost sistema | 5 |
| Operativni audit | 5 |
| Praćenje promjena | 5 |
| Implementacijska kompleksnost | 3 |
| Performanse | 3 |

#### Ocjenjivanje i rezultat

| Opcija | Transparentnost | Audit | Praćenje | Kompleksnost | Performanse | Ukupno |
|---|---|---|---|---|---|---|
| Bez historije | 1 | 1 | 1 | 5 | 5 | 44 |
| Samo statusi | 3 | 3 | 3 | 4 | 4 | 66 |
| Centralni audit log | 5 | 5 | 5 | 3 | 4 | 90 |

### Sažetak odluke

**Krajnja odluka:** Sistem vodi centralizovani audit log svih važnih aktivnosti.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Potrebno je pratiti kompletan tok intervencije |
| Prednosti | Veća transparentnost i lakše praćenje problema |
| Nedostaci | Dodatna količina podataka i logike |
| Napomena | Historija aktivnosti prikazuje se hronološki |
| Implementacija | Activity timeline i audit evidencija |

### Detaljno obrazloženje

Intervencija prolazi kroz više faza i više korisničkih uloga. Bez centralne historije aktivnosti bilo bi teško pratiti ko je izvršio određenu promjenu, kada je intervencija dodijeljena, odbijena, zatvorena ili vraćena u prethodnu fazu.

Zbog toga je donesena odluka da sistem vodi centralizovani audit log svih važnih aktivnosti nad intervencijom.

---

## Odluka #011 – Sistemske notifikacije za sve korisničke uloge

| Polje | Opis |
|---|---|
| ID odluke | DLI-011 |
| Datum | 17.05.2026. |
| Kratak naziv odluke | Centralizovane notifikacije |
| Opis problema | Potrebno je definisati kako korisnici sistema dobijaju informacije o važnim promjenama i događajima. |
| Razmatrane opcije | 1. Bez notifikacija <br> 2. Parcijalne notifikacije po modulima <br> 3. Centralni sistem notifikacija za sve uloge |
| Odabrana opcija | Centralni notification sistem za sve korisničke uloge |
| Razlog izbora | Konzistentno informisanje korisnika o relevantnim događajima |
| Posljedice odluke | Potrebno je implementirati notification centar i logiku događaja |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Informisanost korisnika | 5 |
| Operativna efikasnost | 5 |
| Konzistentnost UX-a | 4 |
| Implementacijska kompleksnost | 3 |
| Skalabilnost | 4 |

#### Ocjenjivanje i rezultat

| Opcija | Informisanost | Efikasnost | UX | Kompleksnost | Skalabilnost | Ukupno |
|---|---|---|---|---|---|---|
| Bez notifikacija | 1 | 1 | 2 | 5 | 3 | 39 |
| Parcijalne notifikacije | 3 | 3 | 3 | 4 | 3 | 63 |
| Centralni sistem | 5 | 5 | 5 | 3 | 5 | 92 |

### Sažetak odluke

**Krajnja odluka:** Implementiran je centralni sistem notifikacija.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Korisnici moraju pravovremeno znati za relevantne promjene |
| Prednosti | Konzistentno iskustvo i brža reakcija korisnika |
| Nedostaci | Veća kompleksnost event logike |
| Napomena | Svaka uloga vidi samo relevantne notifikacije |
| Implementacija | Notification bell, unread badge i notification panel |

### Detaljno obrazloženje

Sistem uključuje više korisničkih uloga koje međusobno zavise od brzog protoka informacija. Bez notifikacija korisnici bi morali ručno provjeravati module kako bi saznali da li se nešto promijenilo.

Zbog toga je implementiran centralni notification sistem koji korisnike automatski obavještava o relevantnim događajima.

---

## Odluka #012 – Uklanjanje silent mock fallback podataka

| Polje | Opis |
|---|---|
| ID odluke | DLI-012 |
| Datum | 18.05.2026. |
| Kratak naziv odluke | Uklanjanje silent mock fallbackova |
| Opis problema | Potrebno je definisati kako sistem treba reagovati kada backend ne vrati stvarne podatke. |
| Razmatrane opcije | 1. Silent fallback na mock podatke <br> 2. Prikaz djelimičnih mock podataka <br> 3. Error i empty state bez fake podataka |
| Odabrana opcija | Error/empty state bez prikazivanja mock podataka kao stvarnih |
| Razlog izbora | Korisnik ne smije vidjeti lažne podatke misleći da su stvarni |
| Posljedice odluke | Potrebno je ukloniti mock fallback logiku iz produkcionih ruta |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Integritet podataka | 5 |
| Povjerenje korisnika | 5 |
| Stabilnost UX-a | 4 |
| Implementacijska kompleksnost | 2 |
| Brzina razvoja | 2 |

#### Ocjenjivanje i rezultat

| Opcija | Integritet | Povjerenje | UX | Kompleksnost | Razvoj | Ukupno |
|---|---|---|---|---|---|---|
| Silent fallback | 1 | 1 | 4 | 5 | 5 | 46 |
| Djelimični mock | 2 | 2 | 3 | 4 | 4 | 51 |
| Error/empty state | 5 | 5 | 5 | 3 | 3 | 88 |

### Sažetak odluke

**Krajnja odluka:** Sistem ne koristi silent mock fallback podatke.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Fake podaci ne smiju izgledati kao stvarni |
| Prednosti | Veći integritet sistema i jasnije greške |
| Nedostaci | Korisnik će vidjeti empty/error state |
| Napomena | Mock podaci ostaju samo razvojni resurs |
| Implementacija | Empty state i error state umjesto fallback mock prikaza |

### Detaljno obrazloženje

Tokom razvoja korišteni su mock podaci za UI i testiranje. Međutim, ostavljanje silent fallback mehanizama u produkcionom sistemu moglo bi dovesti do toga da korisnici vide lažne podatke i donose pogrešne odluke.

Zbog toga je donesena odluka da sistem nikada ne prikazuje mock podatke kao stvarne kada backend ne vrati podatke.

---

## Odluka #013 – Redirect pomoćnih ruta prema stvarnim izvorima podataka

| Polje | Opis |
|---|---|
| ID odluke | DLI-013 |
| Datum | 18.05.2026. |
| Kratak naziv odluke | Redirect pomoćnih ruta |
| Opis problema | Potrebno je definisati kako tretirati pomoćne ili zastarjele rute koje više nemaju zasebnu funkcionalnost. |
| Razmatrane opcije | 1. Ostaviti stare stranice <br> 2. Ukloniti rute <br> 3. Redirect na stvarne aktivne module |
| Odabrana opcija | Redirect pomoćnih ruta na postojeće funkcionalne module |
| Razlog izbora | Izbjegavaju se 404 greške i dupliranje funkcionalnosti |
| Posljedice odluke | Potrebno je implementirati redirect logiku |
| Status odluke | aktivna |

### Sažetak odluke

**Krajnja odluka:** Pomoćne rute se redirectuju na stvarne module.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Korisnik ne smije završiti na neispravnoj ili zastarjeloj stranici |
| Prednosti | Stabilniji routing i manje duplog koda |
| Nedostaci | Potrebno održavati redirect pravila |
| Napomena | Redirect koristi server-side logiku |
| Implementacija | redirect() prema postojećim aktivnim rutama |

### Detaljno obrazloženje

Tokom razvoja određene pomoćne rute ostale su iz ranijih iteracija sistema. Umjesto održavanja dodatnih stranica sa istom funkcionalnošću, donesena je odluka da se korisnik automatski preusmjeri na aktivne module koji koriste stvarne podatke.

---

## Odluka #014 – Role-based prikaz podataka po principu “samo relevantne informacije”

| Polje | Opis |
|---|---|
| ID odluke | DLI-014 |
| Datum | 18.05.2026. |
| Kratak naziv odluke | Minimalni role-based prikaz |
| Opis problema | Potrebno je definisati koliko informacija prikazivati različitim korisničkim ulogama. |
| Razmatrane opcije | 1. Sve informacije svim korisnicima <br> 2. Minimalni prikaz po ulozi <br> 3. Ručno prilagodljiv prikaz |
| Odabrana opcija | Prikaz samo relevantnih informacija prema ulozi korisnika |
| Razlog izbora | Smanjenje kognitivnog opterećenja i fokus na operativno relevantne informacije |
| Posljedice odluke | Potrebno je prilagoditi UI i dozvole po ulozi |
| Status odluke | aktivna |

### Sažetak odluke

**Krajnja odluka:** Svaka uloga vidi samo informacije relevantne za svoj rad.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Korisnici ne trebaju biti opterećeni nepotrebnim podacima |
| Prednosti | Jasniji interfejs i bolji fokus |
| Nedostaci | Veća kompleksnost role-based logike |
| Napomena | Serviser vidi samo operativno relevantne informacije |
| Implementacija | Role-based rendering i permission layer |

### Detaljno obrazloženje

Različite korisničke uloge imaju različite potrebe. Serviseru na terenu nisu potrebni administrativni podaci, dok administratoru nisu potrebni detalji operativnog workflow-a u realnom vremenu.

Zbog toga je donesena odluka da sistem koristi role-based prikaz podataka po principu “samo relevantne informacije”.

---

## Odluka #015 – Serviserski detalj intervencije kao operativni prikaz zadatka

| Polje | Opis |
|---|---|
| ID odluke | DLI-015 |
| Datum | 18.05.2026. |
| Kratak naziv odluke | Operativni prikaz za servisera |
| Opis problema | Potrebno je definisati kako treba izgledati detalj intervencije za servisera na terenu. |
| Razmatrane opcije | 1. Klasični CRUD prikaz svih podataka <br> 2. Minimalni tekstualni prikaz <br> 3. Operativni mobilno-orijentisani prikaz sa vizuelnim komponentama |
| Odabrana opcija | Operativni prikaz fokusiran na izvršenje intervencije |
| Razlog izbora | Serviseru su potrebne samo relevantne informacije za rad na terenu |
| Posljedice odluke | Potrebno je prilagoditi UI serviserskoj ulozi i mobilnom korištenju |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Operativna preglednost | 5 |
| Brzina korištenja | 5 |
| Mobilna upotrebljivost | 5 |
| Kognitivno opterećenje | 4 |
| Implementacijska kompleksnost | 3 |

#### Ocjenjivanje i rezultat

| Opcija | Preglednost | Brzina | Mobilnost | Opterećenje | Kompleksnost | Ukupno |
|---|---|---|---|---|---|---|
| CRUD prikaz | 2 | 2 | 2 | 1 | 5 | 44 |
| Minimalni tekst | 3 | 3 | 4 | 4 | 5 | 67 |
| Operativni prikaz | 5 | 5 | 5 | 5 | 3 | 93 |

### Sažetak odluke

**Krajnja odluka:** Serviserski detalj intervencije predstavlja operativni prikaz zadatka.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Serviser mora brzo razumjeti trenutno stanje zadatka |
| Prednosti | Brži rad na terenu i jasnije informacije |
| Nedostaci | Veća kompleksnost UI dizajna |
| Napomena | Fokus na mobilnom korištenju i operativnim akcijama |
| Implementacija | Hero kartica, workflow tracker, mapa, sticky akcije i checklist |

### Detaljno obrazloženje

Serviser na terenu radi u drugačijem kontekstu od administratora ili dispečera. Potrebne su mu samo informacije relevantne za izvršenje intervencije, bez administrativnih ili sistemskih detalja koji bi stvarali dodatno opterećenje.

Zbog toga je implementiran operativni prikaz zadatka sa fokusom na:
- status
- prioritet
- termin
- lokaciju
- instrukcije
- evidenciju rada
- komunikaciju sa dispečerom

Cilj je bio da serviser može što brže razumjeti situaciju i izvršiti potrebne radnje bez nepotrebnog čitanja i navigacije.

---
## Odluka #016 – Vizuelni prioritet kroz kartice umjesto dropdown liste

| Polje | Opis |
|---|---|
| ID odluke | DLI-016 |
| Datum | 18.05.2026. |
| Kratak naziv odluke | Prioritet kroz kartice |
| Opis problema | Potrebno je definisati način odabira operativnog prioriteta intervencije. |
| Razmatrane opcije | 1. Dropdown lista prioriteta <br> 2. Radio button opcije <br> 3. Vizuelne prioritet kartice |
| Odabrana opcija | Vizuelne prioritet kartice sa sistemskom preporukom |
| Razlog izbora | Jasniji pregled prioriteta i bolja vizuelna orijentacija dispečera |
| Posljedice odluke | Potrebno je implementirati vizuelni prikaz prioriteta i sistemsku preporuku |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Vizuelna preglednost | 5 |
| Brzina odlučivanja | 5 |
| Jednostavnost implementacije | 3 |
| Operativna jasnoća | 5 |
| UX konzistentnost | 4 |

#### Ocjenjivanje i rezultat

| Opcija | Preglednost | Brzina | Jednostavnost | Jasnoća | UX | Ukupno |
|---|---|---|---|---|---|---|
| Dropdown | 2 | 2 | 5 | 2 | 3 | 54 |
| Radio opcije | 3 | 3 | 4 | 3 | 3 | 63 |
| Vizuelne kartice | 5 | 5 | 3 | 5 | 5 | 91 |

### Sažetak odluke

**Krajnja odluka:** Prioritet se bira kroz vizuelne kartice.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Dispečer mora brzo uočiti preporučeni prioritet |
| Prednosti | Brža orijentacija i bolja preglednost |
| Nedostaci | Veća složenost UI implementacije |
| Napomena | Sistem preporučuje prioritet, ali dispečer može promijeniti izbor |
| Implementacija | Kartice prioriteta sa aktivnim vizuelnim stanjem |

### Detaljno obrazloženje

Klasične dropdown liste nisu dovoljno pregledne za operativni rad gdje dispečer mora brzo procijeniti ozbiljnost intervencije. Vizuelne kartice omogućavaju jasnije razlikovanje prioriteta i bržu odluku.

Sistem dodatno vizuelno ističe preporučeni prioritet na osnovu podataka iz zahtjeva, ali dispečer i dalje zadržava pravo konačne odluke.

---

## Odluka #017 – Horizontalni workflow tracker za praćenje intervencije

| Polje | Opis |
|---|---|
| ID odluke | DLI-017 |
| Datum | 18.05.2026. |
| Kratak naziv odluke | Horizontalni workflow tracker |
| Opis problema | Potrebno je definisati kako vizuelno prikazati tok i trenutno stanje intervencije. |
| Razmatrane opcije | 1. Samo tekstualni status <br> 2. Vertikalna status lista <br> 3. Horizontalni workflow tracker |
| Odabrana opcija | Horizontalni workflow tracker sa live indikatorima |
| Razlog izbora | Jasnije prikazuje tok intervencije i trenutno stanje procesa |
| Posljedice odluke | Potrebno je implementirati vizuelni workflow komponentni sistem |
| Status odluke | aktivna |

### Trade-off analiza (Decision Matrix)

#### Težine kriterija

| Kriterij | Težina |
|---|---|
| Vizuelna jasnoća | 5 |
| Praćenje toka | 5 |
| Operativna preglednost | 5 |
| Implementacijska kompleksnost | 3 |
| UX modernost | 4 |

#### Ocjenjivanje i rezultat

| Opcija | Jasnoća | Praćenje | Preglednost | Kompleksnost | UX | Ukupno |
|---|---|---|---|---|---|---|
| Tekstualni status | 2 | 2 | 2 | 5 | 2 | 49 |
| Vertikalna lista | 3 | 4 | 3 | 4 | 3 | 65 |
| Horizontalni tracker | 5 | 5 | 5 | 3 | 5 | 92 |

### Sažetak odluke

**Krajnja odluka:** Intervencija koristi horizontalni workflow tracker.

| Stavka | Objašnjenje |
|---|---|
| Razlog izbora | Omogućava brzo razumijevanje trenutne faze intervencije |
| Prednosti | Pregledniji operativni tok i moderniji UX |
| Nedostaci | Veća UI kompleksnost |
| Napomena | Aktivna faza se dodatno vizuelno ističe |
| Implementacija | Horizontalni tracker sa live badge indikatorima |

### Detaljno obrazloženje

Intervencija prolazi kroz više statusnih faza i korisnici moraju brzo razumjeti gdje se proces trenutno nalazi. Tekstualni statusi nisu dovoljno pregledni za operativni rad.

Zbog toga je implementiran horizontalni workflow tracker koji jasno prikazuje:
- prethodne faze
- trenutnu aktivnu fazu
- naredne korake procesa

Na ovaj način korisnici dobijaju osjećaj “real-time” toka intervencije umjesto običnog statusnog zapisa.

---

