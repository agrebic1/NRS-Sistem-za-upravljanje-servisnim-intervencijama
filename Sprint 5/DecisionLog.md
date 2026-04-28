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

## Odluka #01 - Podrška za više uloga po jednom korisniku

| Polje | Opis |
|-------|------|
| ID odluke | DL-001 |
| Datum | 24.04.2026. |
| Kratak naziv odluke | Više uloga po korisniku |
| Opis problema ili pitanja | Da li korisnik treba imati jednu ili više uloga u sistemu? |
| Razmatrane opcije | 1. Jedna uloga po korisniku  2. Više naloga po korisniku  3. Više uloga po jednom nalogu |
| Odabrana opcija | Više uloga po jednom korisniku |
| Razlog izbora | Omogućavanje fleksibilnosti i pokrivanje realnih scenarija korištenja sistema |
| Posljedice odluke | Potrebna implementacija odabira aktivne uloge i role-based pristupa; povećana kompleksnost autentifikacije |
| Status odluke | aktivna |

### Detaljno obrazloženje

Sistem za upravljanje servisnim intervencijama obuhvata različite tipove korisnika, uključujući korisnike usluge, servisere, dispečere i administratore. U realnim situacijama, ista osoba može imati više uloga u različitim kontekstima. Na primjer, serviser koji pruža određene usluge može se naći u situaciji da mu je potrebna intervencija iz oblasti koja nije njegova specijalnost. U tom slučaju, isti korisnik mora imati mogućnost da djeluje kao korisnik usluge, bez potrebe za kreiranjem dodatnog naloga. Ako bi sistem podržavao samo jednu ulogu po korisniku, korisnici bi bili primorani da kreiraju više naloga, što bi dovelo do fragmentacije podataka, otežanog upravljanja i lošijeg korisničkog iskustva. Ovakvo ograničenje bi stvorilo tzv. “blind spot” u sistemu, odnosno situacije koje nisu adekvatno podržane i koje bi u praksi često nastajale, ali ne bi bile predviđene dizajnom sistema. Zbog toga je donesena odluka da jedan korisnik može imati više uloga, čime se sistem čini inkluzivnijim i otvorenijim za različite scenarije korištenja. Ovaj pristup omogućava da se realne životne situacije modeliraju bez umjetnih ograničenja. Korisnik pri prijavi bira aktivnu ulogu kroz koju koristi sistem, a po potrebi može promijeniti ulogu, čime se postiže fleksibilnost uz zadržavanje jasne kontrole pristupa. Ova odluka povećava kompleksnost implementacije, ali značajno unapređuje skalabilnost i realnu primjenjivost sistema.


## Odluka #02 - Korisnik ne određuje prioritet zahtjeva

| Polje | Opis |
|-------|------|
| ID odluke | DL-002 |
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

## Odluka #03 - Role-based navigacija i preusmjeravanje korisnika

| Polje | Opis |
|-------|------|
| ID odluke | DL-008 |
| Datum | 27.04.2026. |
| Kratak naziv odluke | Role-based redirect |
| Opis problema ili pitanja | Kako usmjeriti korisnika kroz sistem nakon registracije i prijave, u zavisnosti od njegove uloge? |
| Razmatrane opcije | 1. Jedinstven dashboard za sve korisnike  2. Ručno biranje stranica bez kontrole  3. Automatsko preusmjeravanje prema ulozi |
| Odabrana opcija | Automatsko preusmjeravanje prema ulozi uz mogućnost izbora |
| Razlog izbora | Jasna struktura sistema i prilagođeno korisničko iskustvo |
| Posljedice odluke | Potrebna implementacija role-based navigacije i zaštite ruta |
| Status odluke | aktivna |

### Detaljno obrazloženje

Sistem uključuje više različitih tipova korisnika, od kojih svaki ima specifične funkcionalnosti i odgovornosti. Zbog toga nije prikladno koristiti jedinstveni početni ekran za sve korisnike. Ako bi svi korisnici imali isti dashboard, došlo bi do preopterećenja interfejsa, zbunjenosti i izlaganja funkcionalnosti koje korisniku nisu relevantne ili mu nisu dozvoljene. Zbog toga je donesena odluka da se korisnik nakon prijave automatski preusmjerava na početni ekran (dashboard) koji odgovara njegovoj ulozi. U slučaju da korisnik ima više uloga, uvodi se dodatni korak u kojem korisnik bira aktivnu ulogu. Na osnovu tog izbora, sistem ga preusmjerava na odgovarajući dashboard. Time se postiže balans između automatizacije i fleksibilnosti, jer korisnik ne mora ručno navigirati kroz sistem, ali i dalje ima kontrolu nad tim kako koristi aplikaciju. Ovaj pristup poboljšava korisničko iskustvo, smanjuje mogućnost grešaka i osigurava da korisnik uvijek vidi samo relevantne funkcionalnosti.


## Odluka #04 - Centralizovana landing stranica sa više ulaznih tokova

| Polje | Opis |
|-------|------|
| ID odluke | DL-010 |
| Datum | 28.04.2026. |
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
- prijava interesa za pružanje usluga (za korisnike koji žele postati serviseri, tj. da ponude svoje usluge na stranici)

Ovim pristupom sistem postaje intuitivniji i pristupačniji, jer korisnik odmah na početku može izabrati tok koji odgovara njegovoj namjeri. Također, ovaj model omogućava veću fleksibilnost i inkluzivnost sistema, jer podržava različite tipove korisnika i njihove potrebe bez komplikovane navigacije. Ova odluka direktno utiče na strukturu frontend-a, jer definiše landing stranicu kao centralni UX element i polaznu tačku svih korisničkih tokova u aplikaciji.


## Odluka #05 - Naziv odluke

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
