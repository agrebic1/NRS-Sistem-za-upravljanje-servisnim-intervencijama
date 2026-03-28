# Product Vision

 **Naziv projekta:**

Sistem za upravljanje servisnim intervencijama - Service Track 

---

## Problem koji sistem rješava

U procesu servisnih intervencija često se koristi više nepoveyanih alata, kao što su Excel tabele, telefonski pozivi i poruke. Tok intervencije, koji uključuje prijavu kvara, dodjelu servisera, izvršenje rada i završetak zahtjeva, nije centralizovan u jednom sistemu, što otežava praćenje i upravljanje procesom.

Zbog ovakvog načina rada dolazi do loše koordinacije između zaposlenih, nejasnog statusa intervencija i kašnjenja u obavljannju zadataka. Serviseri nemaju uvijek potpune informacije, dok administarcija nema jasan pregled svih aktivnih intervencija. Kao rezultat toga jeste da dolazi do smanjenja efikasnosti rada i nezadovoljstvo klijenata, što ukazuje na potrebu za jedinstvenim sistemom koji bi povezao cijeli proces servisnih intervencija.

---

## Ciljni korisnici

Ciljni korisnici ovog sistema uključuju servisne kompanije kao organizaciju, kao i korisnike sistema kao što su dispečeri, serviseri i klijenti. Svaka od ovih grupa ima jasno definisanu i važnu ulogu u procesu servisnih intervencija i realizaciji servisnih zahtjeva.

Klijenti koriste sistem za prijavu kvarova, praćenja statusa svojih zahtjeva i to im omogućava bolju informisanost i sigurnost da će njihov problem biti riješen na vrijeme. Dispečeri imaju ključnu ulogu jer upravljaju zaprimljenim zahtjevima, dodjeljuju intervencije serviserima i prate njihov tok. Serviseri koriste sistem kako bi dobili informacije o intervencijama, izvršili zadatke na terenu i evidentirali status završenog posla. Na ovaj način sistem povezuje sve grupe u jedinstven proces.

---

## Vrijednost sistema

Vrijednost ovog sistema ogleda se u unapređenju organizacije i efikasnosti rada sevisnih kompanija pri radu sa intervencijama. Sistem ima jasan pregled servisnih zahtjeva i lakšu podjelu zadataka. Na taj način se smanjuje mogućnost grešaka, ubrzava proces rada i olakšava komunikaciju između klijent-administrator, administator-serviser.

Pored toga, sistem donosi veliku vrijednost i klijentima koji korisne servisne usluge. Klijentima je omogućeno da na jednostavan način prijave kvar i prate status i vrijeme rada svog zahtjeva. Time se povećava njihova informisanost i povjerenje u uslugu, jer imaju jasnu sliku o tome kada i kako će njihov problem biti riješen.

Sistem doprinosi digitalizaciji poslovanja i modernizaciji procesa rada unutar kompanija. Ovakvim rješenjem smanjuje se potreba za manuelnim vođenjem evidencije, a dugoročno gledano, sistem može doprinijeti smanjenju troškova, boljoj organizaciji resursa i unepređenju kvaliteta usluga.

---

## Scope MVP verzije

Naš sistem za praćenje servisa će vam olakšati vođenje servisa, pregled zahtjeva i komunikaciju između zaposlenih i vanjskih servisa.

MVP verzija treba sadržavti sljedeće funkcionalnosti:

* Registracija i prijava korisnika
Sistem omogućava kreirnaje korisničkog naloga i prijavu u sistem putem osnovnih autentifikacijskih podataka (korisničko ime, lozinka).

* Prijava zahtjeva za servisnu intervenciju
Sistem treba omogućiti korisnicima kreiranje novog zahtjeva za intervencijom unosom osnovnih podataka o kvaru/problemu, lokaciji, kratkom opisu problema i vlastitim podacima.

* Pregled otvorenih intervencija
Dispečer i drugi ovlašteni korisnici mogu pregledati sve aktivne i otvorene intervencije, kako bi se jasno vidjelo koji zahtjevi čekaju na obradu, koji su dodijeljeni i koji su trenutno u toku.  

* Pregled svih servisnih intervencija?
Imat ćete listu svih dostupnih servisa sa osnovnim informacijama i saznat ćete u kojem su stanju.

* Pregled detalja pojedinačnih servisnih intervencija?
//Svaki servis će imati svoju stranicu sa svim detaljima o zahtjevu i šta se s njim dešava.

* Dodjela intervencije odgovornom serviseru
Sistem treba omogućiti generisanje prijedloga odgovornih servisera na osnovu osnovnih podataka o intervenciji, dok konačnu odluku o dodjeli donosi sam dispečer, Dispečer ima mogućnost da privati prijedlog koji mu je generisao sistem ili odbije i ručno odabere drugu osobu koju smatra pogodnijom za taj posao.

* Upravljanje statusom intervencije
Sistem treba omogućiti postavljanje i promjenu statusa intervencija tako da status u svakom trenutnku što vjernije odražava njeno stvarno stanje na terenu i fazu u kojoj se intervencija nalazi. Time se obezbjeđuje da tok rada u sistemu prati prirodan, logičan i u praksi ustaljeni tok servisnog procesa, od trenutka prijave i dodjele, preko izvršenja radova, pa sve do samog završetka intervencije. Na taj način svi uključeni korisnici imaju jasniji uvid u to što je već urađeno , šta je u toku i koja je naredna faza postupanja. Miniminalni skup statusa koju sistem treba podržati obuhvata: kreirano, dodijeljeno, u toku i završeno.

* Evidencija osnovnih informacija o izvršenom radu
Sistem treba omogućiti evidentiranje izvršenog rada na način koji serviseru olakšava unos podataka i smanjuje administrativno opterećenje. Serviser unosi ključne informacije o intervenciji, dok sistem na osnovu njih može pripremiti pregledan i strukturisan zapis o obavljenom poslu. Na taj način evidencija rada postaje jasnija i ujednačenija, a istovremeno se zadržava kontrola ljudskog faktora, jer ovlašteni korisnik takav zapis može pregledati, potvrditi ili dopuniti prije konačnog spremanja u evidenciju.

* Određivanje prioriteta intervencija uz podršku sistema i potvrdu od strane dispečera
Sistem treba omogućiti određivanje prioriteta intervencije na način da, na osnovu unesenih informacija o kvaru ili zahtjevu, može predložiti odgovarajući nivo prioriteta. Takav prijedlog služi kao podrška dispečeru u procjeni hitnosti i važnosti intervencije, ali konačnu odluku i dalje donosi ljudski faktor. Dispečer može prihvatiti predloženi prioritet, izmijeniti ga ili odabrati drugi nivo prioriteta u skladu sa svojom procjenom i konkretnom situacijom. Na taj način se olakšava donošenje odluka, postiže veća ujednačenost u obradi zahtjeva i zadržava potrebna kontrola nad procesom.

* Osnovna komunikacija između dispečera i servisera putem napomena
Sistem treba omogućiti jednostavnu razmjenu kratkih poruka i napomena između dispečera i servisera u okviru konkretne intervencije. Na taj način se olakšava prenos važnih informacija vezanih za izlazak na teren, tok rada i eventualne promjene u vezi sa zadatkom. Cilj je da komunikacija bude vezana za samu intervenciju i dostupna na jednom mjestu, kako bi se smanjila potreba za dodatnim pozivima i nepovezanim kanalima komunikacije, a svi učesnici imali jasniji uvid u relevantne informacije.

* Dashboard sa pregledom ključnih informacija  

---

## Šta ne ulazi u MVP

Funkcionalnosti koje neće biti dio početne verzije:

* Mobilna aplikacija za servisere 

  Za sada, sistem će biti dostupan samo kao web aplikacija. Mobilna aplikacija će se razviti kasnije.

* Automatske notifikacije

  Automatske obavijesti neće izvještavati o statusu svog servisnog zahtjeva putem e-maila ili SMS-a.

* Napredni izvještaji i analitika

 // Klijenti neće dobijati detaljne statistike, izvještaje o radu servisera ili analize efikasnosti servisa.

* Integracija sa drugim sistemima

  Sistem neće biti povezan sa drugim poslovnim alatima, kao što je računovodstvo ili Enterprise Resource Planning.

* Sistem za ocjenjivanje zadovoljstva klijenata

  Ocjene od klijenata neće biti prikazivane u inicijalnoj fazi sistema.
  
* Potpuno automatsko određivanje prioriteta

* Napredna komunikacija putem chata

* Upravljanje materijalima i skladištem

* Upravljanje finansijama i obračun usluga

* Upravljanje ugovorima i klijentima

---

## Ključna ograničenja i pretpostavke

### Ključna ograničenja

* Ograničeno vrijeme razvoja sistema  
Projekat se realizuje u okviru trajanja jednog semestra, zbog čega raspoloživo vrijeme za analizu, dizajn, implementaciju i testiranje ostaje ograničeno. 

* Ograničeni  razvojni resursi  
Iako tim broji 8 članova, stvarni razvojni kapaciteti projekta i dalje su ograničeni u odnosu na složenost sistema koji se razvija. Članovi tima imaju različit nivo tehničkog znanja, iskustva i usmjerenosti, a značajan dio vremena tokom semestra ne odlazi samo na implementaciju, nego i na analizu zahtjeva, definisanje poslovne logike, modeliranje procesa, dizajn, dokumentaciju i testiranje. 

* Tehnološka ograničenja  
Sistem se razvija kao web aplikacija dostupna na desktop i mobilnim uređajima putem preglednika. Pri tome se polazi od toga da različiti korisnici sistem koriste u različitim situacijama i na različitim uređajima, pa se interfejs i funkcionalnosti tome i prilagođavaju. Dispečer i administrator će veći dio posla prirodnije obavljati na većem ekranu, dok su serviseru i klijentu važnije funkcije koje su lako dostupne i putem mobilnog uređaja. Na taj način sistem ostaje jedinstven, ali istovremeno prati stvarne potrebe korisnika i način na koji ga koriste u praksi. Sistem u početnoj verziji neće podržavati offline rad, dok složenije integracije sa drugim poslovnim sistemima neće biti u fokusu MVP-a. Po potrebi, mogu se koristiti ograničeni eksterni servisi koji podržavaju ključne funkcionalnosti sistema, kao što su AI podrška ili mapni servisi. 

* Budžetska ograničenja  
Kako se projekat razvija u okviru studentskog rada i bez značajnijih finansijskih ulaganja, potrebno je pažljivo birati tehnologije, dodatne servise i obim funkcionalnosti koje će biti uključene u prvu verziju sistema. Zbog toga će se pri izboru tehnoloških rješenja težiti open source i besplatnim alatima i servisima koji mogu zadovoljiti potrebe sistema bez dodatnih troškova.

* Fokus na operativni modul  
Zbog ograničenja vremena i opsega, MVP je usmjeren na osnovni tok servisne intervencije i primarne korisnike sistema, prije svega dispečera, servisera i korisnika koji prijavljuje zahtjev. Potrebe sekundarnih stakeholdera i napredni moduli ostavljaju se za kasnije faze razvoja.

* Ograničenje složenih poslovnih scenarija  
Napredniji scenariji, kao što su rad više servisera na jednoj intervenciji, kompleksne eskalacije i napredno planiranje izlazaka na teren, nisu obuhvaćeni MVP-om.

* Ograničena integracija AI i eksternih servisa  
U početnoj verziji sistema moguće je koristiti određene eksterne servise, poput AI podrške ili mapnih servisa, ali samo u mjeri u kojoj oni pomažu osnovnim funkcionalnostima sistema. Njihova uloga nije da samostalno vode proces ili donose konačne odluke, nego da korisnicima olakšaju rad kroz prijedloge, obradu informacija i dodatni kontekst. Time se zadržava kontrola od strane ljudskog faktora.  

Sva prethodno navedena ograničenja zajedno određuju obim i fokus MVP verzije sistema. Zbog toga je početna verzija usmjerena na najvažnije funkcionalnosti koje podržavaju osnovni tok servisne intervencije i korisnicima donose stvarnu vrijednost u svakodnevnom radu, dok se složenije funkcionalnosti i zahtjevnija proširenja ostavljaju za kasnije faze razvoja, kada za njih budu postojali odgovarajući resursi i uslovi. Kako je riječ o MVP verziji, cilj nije razviti potpuno zaokružen proizvod, nego kroz ključne funkcionalnosti pokazati kako sistem može odgovoriti na stvarne potrebe korisnika i donijeti im konkretnu vrijednost u praksi.

### Pretpostavke
Ovlašteni korisnici će redovno unositi i ažurirati podatke o servisnim zahtjevima i intervencijama u skladu sa svojom ulogom u sistemu. 

Serviseri će imati pristup sistemu putem odgovarajućeg uređaja i moći će pregledati i ažurirati informacije relevantne za intervencije na kojima rade.

Korisnici sistema posjeduju osnovna znanja potrebna za korištenje web aplikacije ili će za njen rad dobiti odgovarajuće upute.

Organizacija koja koristi sistem ima osnovno definisane uloge i odgovornosti u procesu prijave, dodjele i izvršavanja servisnih intervencija.

Pretpostavlja se dostupnost internet konekcije u trenucima kada korisnici pristupaju sistemu.

Pretpostavlja se da će za svaku intervenciju biti dostupni osnovni podaci, kao što su opis problema, lokacija i podaci o prijavi.

Pretpostavlja se da će korisnici unositi tačne i dovoljno potpune informacije kako bi sistem mogao pravilno podržati tok rada i obradu
intervencija.

Ukoliko se koriste eksterni servisi, pretpostavlja se njihova osnovna dostupnost u mjeri potrebnoj za podršku ključnim funkcionalnostima MVP-a.
