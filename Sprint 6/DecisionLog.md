# Decision Log


| Polje | Opis |
|-------|------|
| ID odluke | |
| Datum ||
| Kratak naziv odluke |
| Opis problema |
| Razmatrane opcije |
| Odabrana opcija |
| Razlog izbora |
| Posljedice odluke |
| Status odluke |

| Polje | Opis |
|-------|------|
| ID odluke | DLI-01|
| Datum | 30.04.2026. |
| Kratak naziv odluke | Modularno proširenje sistema (Open-Closed) |
| Opis problema | Implementacija novih US bez narušavanja stabilnosti i izmjene postojećeg koda |
| Razmatrane opcije | 1. Modifikacija postojećih kontrolera <br> 2. Kreiranje potpuno novog odvojenog modula |
| Odabrana opcija | Modularno proširenje kroz nove rute i komponente |
| Razlog izbora | Osigurava stabilnost jezgra sistema i omogućava lakši rollback u slučaju greške. |
| Posljedice odluke | Povećan broj fajlova, ali značajno veća čitljivost i lakše održavanje |
| Status odluke | Aktivna |

| Polje | Opis |
|-------|------|
| ID odluke | DLI-02 |
| Datum | 30.04.2026. |
| Kratak naziv odluke | Modularna ekstenzija sistema (Open-Closed) |
| Opis problema | Kako implementirati nove funkcionalnosti (US-05, US-06, US-18, US-26, US-27) bez narušavanja stabilnosti postojećeg koda? |
| Razmatrane opcije | 1. Modifikacija postojećih kontrolera i ruta <br> 2. Implementacija potpuno novih modula i odvojenih API ruta |
| Odabrana opcija | Opcija 2: Modularno proširenje |
| Razlog izbora | Osigurava stabilnost jezgre sistema i omogućava lakši razvoj bez regresionih grešaka. |
| Posljedice odluke | Potrebno definisati nove modele i kontrolere koji se integrišu preko auth middleware-a. |
| Status odluke | aktivna |

| Polje | Opis |
|-------|------|
| ID odluke | DLI-03 |
| Datum | 30.04.2026.|
| Kratak naziv odluke | Algoritam objektivne hitnosti (Triage) |
| Opis problema | Korisnici tendenciozno označavaju svaki kvar kao "Hitno", što otežava trijažu |
| Razmatrane opcije | 1. Skala prioriteta 1-5 <br> 2. Bodovni sistem (0-110) baziran na činjeničnim posljedicama |
| Odabrana opcija | Bodovni sistem sa 5 stubova (Sigurnost, Zastoj, Posljedica, Ranjivost, Obuhvat) |
| Razlog izbora | Smanjuje subjektivnost, dispečer dobija automatski sortiranu listu po stvarnom riziku |
| Posljedice odluke | Potreban specifičan backend servis za kalkulaciju bodova nakon svake prijave |
| Status odluke | Aktivna |


| Polje | Opis |
|-------|------|
| ID odluke | DLI-04 |
| Datum | 30.04.2026. |
| Kratak naziv odluke | Uvođenje korisničkih prijedloga termina intervencije |
| Opis problema | Potreba za smanjenjem manuelne komunikacije (telefonskih poziva) između dispečera i korisnika prilikom zakazivanja servisa |
| Razmatrane opcije | 1. Potpuno manuelno zakazivanje (dispečer zove klijenta nakon prijave) <br> 2. Automatizovano zakazivanje (sistem sam dodjeljuje termin) <br> 3. Hibridni model (korisnik predlaže prozor dostupnosti)
| Odabrana opcija | Opcija 3: Hibridni model - Korisnik predlaže termine, dispečer potvrđuje |
| Razlog izbora | Omogućava asinhronu komunikaciju, smanjuje opterećenje dispečera i poboljšava korisničko iskustvo (UX) pružanjem osjećaja kontrole klijentu |
| Posljedice odluke | Potreban razvoj kompleksnijeg UI interfejsa (kalendara) i logike u bazi podataka za čuvanje nizova vremenskih slotova |
| Status odluke | aktivna |


| Polje | Opis |
|-------|------|
| ID odluke | DLI-05 |
| Datum | 30.04.2026. |
| Kratak naziv odluke | Definisanje maksimalnog broja slotova za odabir |
| Opis proBlema | Određivanje optimalnog broja termina koje korisnik može ponuditi kako bi se maksimizirala efikasnost logistike bez zbunjivanja korisnika |
| Razmatrane opcija | 1. Samo 1 termin (striktno) <br> 2. Fiksni broj termina (3 ili 5) <br> 3. Neograničen broj termina |
| Odabran opcija | Fiksni broj termina |
| Razlog izbora | Enterprise standard koji daje dispečeru više šansi da uklopi zahtjev u optimalnu rutu bez dodatnog kontaktiranja klijenta |
| Posljedice odluke | Implementacija validacije na frontendu (limit odabira) i potreba za jasnom komunikacijom korisniku da su termini informativni |
| Status odluke | aktivna |
