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

