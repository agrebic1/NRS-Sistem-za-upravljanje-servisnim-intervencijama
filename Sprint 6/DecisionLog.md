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
| ID odluke | DLI-08 |
| Datum | 06.05.2026. |
| Kratak naziv odluke | Premium aktivacija kao odvojeni tok (US-34) + premium zahtjev (US-33) |
| Opis problema | Premium opcija je postojala u prijavi zahtjeva, ali bez formalno razdvojenog toka aktivacije, što je stvaralo nejasnoću oko prava korištenja i naplate. |
| Razmatrane opcije | 1. Premium samo kao checkbox u US-05/US-33 <br> 2. Odvojeni tok aktivacije (US-34) + kontrolisano korištenje u US-33 |
| Odabrana opcija | Opcija 2: US-34 + US-33 |
| Razlog izbora | Odvajanje aktivacije od korištenja uklanja nejasnoće, omogućava validaciju premium statusa i smanjuje operativne greške u obradi zahtjeva. |
| Posljedice odluke | Implementirani su odvojeni premium lifecycle tokovi kroz API (`start`, `confirm`, `cancel`, `renew`), validacija premium prava pri slanju zahtjeva, audit događaji i cron obrada isteka. U MVP-u je naplata premiuma simulirana (bez eksternog payment gateway-a). |
| Status odluke | Aktivna |

| Polje | Opis |
|-------|------|
| ID odluke | DLI-09 |
| Datum | 06.05.2026. |
| Kratak naziv odluke | Standardizacija premium aktivacije na dvokorak |
| Opis problema | U implementaciji je postojao i skraćeni put aktivacije koji je uvodio nejasnoću između standardnog i brzog toka. |
| Razmatrane opcije | 1. Zadržati i dvokorak i brzi endpoint <br> 2. Zadržati samo standardni dvokorak (`start` -> `confirm`) |
| Odabrana opcija | Opcija 2: standardni dvokorak |
| Razlog izbora | Jasniji korisnički tok, jednostavnije testiranje i dosljednija dokumentacija lifecycle tranzicija. |
| Posljedice odluke | Uklonjen je brzi endpoint aktivacije; korisnički UI vodi kroz standardni activation flow. |
| Status odluke | Aktivna |

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
| Kratak naziv odluke | Hijerarhija kategorija sa opcionom potkategorijom |
| Opis problema | Potrebno je obezbijediti jasan izbor vrste kvara u wizardu, uz validaciju kombinacije na frontendu i backendu. |
| Razmatrane opcije | 1. Slobodan unos teksta <br> 2. Jedna velika lista svih tipova kvarova <br> 3. Glavna kategorija + potkategorija kada je potrebna |
| Odabrana opcija | Opcija 3: glavna kategorija + opcionalna potkategorija |
| Razlog izbora | Model daje dovoljno precizan unos bez preopterećenja korisnika i podržava kategorije koje nemaju potkategorije. |
| Posljedice odluke | Implementirana je centralna kategorijska konfiguracija i validacija kombinacije (`main/sub`) kroz util funkcije i wizard/API logiku. |
| Status odluke | aktivna |

### Tradeoff analiza

| Kriterij | Težina |
|----------|--------|
| UX / Kognitivno opterećenje | 5 |
| Preciznost podataka za obradu zahtjeva | 5 |
| Fleksibilnost modela (kategorije sa/bez sub) | 4 |
| Usklađenost FE/BE validacije | 4 |
| Jednostavnost održavanja | 3 |

| Opcija | UX | Skalabilnost | Automatizacija | Preciznost | Kompleksnost | Ukupno |
| 1. Slobodan unos teksta | 3 | 2 | 1 | 1 | 4 | 38 |
| 2. Jedna velika lista | 2 | 3 | 2 | 3 | 4 | 45 |
| 3. Main + opcionalni sub | 5 | 5 | 4 | 5 | 4 | 82 |

### Detaljno obrazloženje
Implementirano rješenje koristi centralni katalog glavnih kategorija i pripadajućih potkategorija, uz jasno pravilo:
- ako glavna kategorija ima definisane potkategorije, izbor potkategorije je obavezan,
- ako glavna kategorija nema potkategorije, potkategorija se ne traži.

Usklađenost implementacije:
- frontend wizard koristi iste kategorijske definicije i validaciju kombinacije (`validnaKombinacijaKategorije`),
- backend pri kreiranju zahtjeva prihvata i čuva `category_main` / `category_sub` konzistentno sa wizard logikom,
- prikaz u listama i detaljima koristi labeliranje iz centralnog kategorijskog modula.

Napomena:
- istorijski tekst “8+1 x 8+1 matrica sa 80+ stavki” nije više izvor istine za implementaciju,
- aktuelni izvor istine je kategorijski modul u aplikacionom kodu (main + opcionalni sub model).

| Polje | Opis |
|-------|------|
| ID odluke | DLI-10 |
| Datum | 06.05.2026. |
| Kratak naziv odluke | SOS Bypass (Preskakanje trijaže za hitne slučajeve) |
| Opis problema | Da li korisnik koji plaća premium hitnu uslugu treba prolaziti kroz standardni Wizard proces? |
| Razmatrane opcije | 1. Standardni tok za sve (Gubljenje dragocjenog vremena u krizi) <br> 2. Telefonski poziv samo za hitne (Teško praćenje i logovanje) <br> 3. SOS Bypass protokol (Automatizovano preskakanje koraka uz premium naplatu) |
| Odabrana opcija | 3. SOS Bypass protokol |
| Razlog izbora | Korisnik koji plaća hitnost je u kriznoj situaciji. Svaka sekunda u aplikaciji povećava frustraciju. Sistem preuzima rizik manje preciznih podataka u zamjenu za maksimalnu brzinu odziva. |
| Posljedice odluke | Majstor na teren izlazi sa manje informacija, ali sa opremom za hitne intervencije. |
| Status odluke | odgođeno (post-MVP) |

Detaljno obrazloženje
U kriznim situacijama, svaki dodatni klik u aplikaciji povećava vjerovatnoću da će korisnik odustati od sistema i pozvati vatrogasce ili drugog majstora van platforme. SOS Bypass je dizajniran da zadrži tog korisnika tako što mu nudi najbrži mogući put do rješenja.

Logika preskakanja (The Bypass):
Dok standardna popravka zahtijeva popunu upitnika za trijažu zahtjeva, SOS Bypass preskače korak trijaže, s obzirom da je to već ranije određeno.

Ekonomski model:
Budući da hitni izlazak remeti planirane termine ostalih korisnika, ovaj protokol uvodi vanrednu tarifu. Ta tarifa služi i kao prirodni filter: korisnik kojem nije stvarno hitno, vratiće se na standardni Wizard kada vidi cijenu SOS izlaska.
