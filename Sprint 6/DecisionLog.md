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

| Polje | Opis |
|-------|------|
| ID odluke | DLI-07 |
| Datum | 03.05.2026. |
| Kratak naziv odluke | Dvoslojna hijerarhija kategorija (8+1 model) |
| Opis problema | Kako strukturirati ogroman broj različitih servisnih usluga (80+) a da korisnik ne bude preopterećen, dok sistem istovremeno dobija precizne podatke za automatizaciju? |
| Razmatrane opcije | 1. Slobodan unos teksta (Free text field) <br> 2. Padajuća lista (Dropdown sa 80+ stavki) <br> 3. Jednonivojski Wizard (8+1) <br> 4. Dvonivojski Wizard (8+1 x 8+1) |
| Odabrana opcija | Dvonivojski Wizard (8+1 x 8+1) |
| Razlog izbora | Jedini model koji omogućava hiruršku preciznost podataka bez kognitivnog preopterećenja korisnika |
| Posljedice odluke | Potrebno definirati "parent-child" logiku u bazi; omogućava automatsko rutiranje naloga prema vještinama (skill-matching) |
| Status odluke | aktivna |

### Tradeoff analiza

| Kriterij | Težina |
|----------|--------|
| UX / Kognitivno opterećenje | 5 |
| Skalabilnost (širina ponude) | 5 |
| Mogućnost automatizacije (prioriteti) | 4 |
| Preciznost podataka (za majstore) | 4 |
| Jednostavnost implementacije | 2  |

| Opcija | UX | Skalabilnost | Automatizacija | Preciznost | Kompleksnost | Ukupno |
| 1. Slobodan unos teksta | 4 | 5 | 1 | 1 | 5 | 53 |
| 2. Padajuća lista | 2 | 4 | 3 | 3 | 5 | 63 |
| 3. Jednonivojski Wizard | 5 | 2 | 2 | 2 | 5 | 64 |
| 4. Wizard Matrica (8+1 x 8+1) | 5 | 5 | 5 | 5 | 3 | 91 |

### Detaljno obrazloženje
Analizom opcija, zaključeno je sljedeće:
- Slobodan unos teksta (Opcija 1): Najlakši za klijenta, ali najgori za sistem. Dispečer mora ručno čitati svaki unos, što onemogućava bilo kakvu automatizaciju ili skaliranje.
- Padajuća lista (Opcija 2): Sa preko 80 stavki, lista postaje nepregledna na mobilnim uređajima. Korisnici biraju nasumične opcije samo da završe proces, što kvari kvalitet podataka.
- Jednonivojski Wizard (Opcija 3): Pregledan je, ali nedovoljno precizan. Informacija "Problem sa strujom" je nedovoljna za slanje majstora bez dodatnih poziva i pojašnjenja.
Pobjedničko rješenje: Dvonivojska Wizard Matrica (Opcija 4)
Ovaj model funkcioniše kao filtracija u dva koraka. Prvi nivo definiše koji zanat (struja, voda, IT), a drugi nivo definiše koji alat i koji prioritet (utičnica, puknuće cijevi, servis klime). Struktura 8+1 x 8+1 osigurava da sistem pokrije 99% svih intervencija u zgradi. Deveta stavka ("Ostalo" ili "Specifično") služi kao sigurnosni ventil za rijetke slučajeve i omogućava sistemu da uči iz slobodnih unosa korisnika. Ovim se postiže "iPhone jednostavnost" na ekranu, dok u pozadini sistem radi kao enterprise ERP platforma.

Kompletno stablo kategorija
1. Grijanje i Toplota
1.1. Servis kotla/peći, 1.2. Kvar na kotlu [HITNO], 1.3. Radijatori/ventili, 1.4. Podno grijanje, 1.5. Curenje plina [HITNO], 1.6. Termostati/regulacija, 1.7. Pumpe/ekspanzija, 1.8. Dimovodni sistemi, 1.9. Ostalo.

2. Klimatizacija i Ventilacija
2.1. Godišnji servis, 2.2. Klima ne hladi, 2.3. Curenje kondenzata, 2.4. Buka/vibracije, 2.5. Ventilacija/napa, 2.6. Rekuperatori, 2.7. Čišćenje kanala, 2.8. Dopuna gasa, 2.9. Ostalo.

3. Vodovod i Kanalizacija
3.1. Puknuće cijevi [HITNO], 3.2. Začepljen odvod, 3.3. Servis bojlera, 3.4. Sanitarije/česme, 3.5. Pumpe/hidrofori, 3.6. Ventili/vodomjeri, 3.7. Curenje u zidu, 3.8. Vanjska mreža, 3.9. Ostalo.

4. Elektroinstalacije i Rasvjeta
4.1. Razvodna ploča [HITNO], 4.2. Utičnice/prekidači, 4.3. Unutrašnja rasvjeta, 4.4. Vanjska rasvjeta, 4.5. Jaka struja, 4.6. Interfoni/brave, 4.7. Uzemljenje/gromobran, 4.8. Fiksni uređaji, 4.9. Ostalo.

5. Sigurnost i Zaštita
5.1. Alarmni sistemi, 5.2. Video nadzor, 5.3. Kontrola pristupa, 5.4. Vatrodojava, 5.5. PP aparati, 5.6. Hidranti, 5.7. Razglas/evakuacija, 5.8. Pametne brave, 5.9. Ostalo.

6. Pristup i Automatika
6.1. Garažna vrata, 6.2. Rampe/stubići, 6.3. Servis lifta [HITNO], 6.4. Senzorska vrata, 6.5. Roletne/tende, 6.6. Daljinski upravljači, 6.7. Kapije, 6.8. Pokretne stepenice, 6.9. Ostalo.

7. Bravarija i Stolarija
7.1. Hitno otvaranje [HITNO], 7.2. Zamjena brave, 7.3. Podešavanje stolarije, 7.4. Zamjena stakla, 7.5. Kvake/okovi, 7.6. Reparacija namještaja, 7.7. Automati za vrata, 7.8. Metalne ograde, 7.9. Ostalo.

8. IT i Pametni sistemi
8.1. WiFi/Mreža, 8.2. Mrežni ormari/Rack, 8.3. Smart Hub, 8.4. Pametna rasvjeta, 8.5. Audio/Video sale, 8.6. LAN kabliranje, 8.7. Serverska oprema, 8.8. Integracija termostata, 8.9. Ostalo.

9. (+1) Specifične usluge
9.1. Bazeni, 9.2. Krov/oluci, 9.3. Solarni sistemi, 9.4. Dezinsekcija, 9.5. Održavanje okoliša, 9.6. Fasaderski radovi, 9.7. Profesionalno čišćenje, 9.8. Odvoz otpada, 9.9. SVE OSTALO.
