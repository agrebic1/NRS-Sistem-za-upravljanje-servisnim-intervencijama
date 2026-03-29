# Product Vision

 **Naziv projekta:**

Sistem za upravljanje servisnim intervencijama - Service Track 

---

## Problem koji sistem rješava

U procesu servisnih intervencija često se koristi više nepovezanih alata, kao što su Excel tabele, telefonski pozivi i poruke. Tok intervencije, koji uključuje prijavu kvara, dodjelu servisera, izvršenje rada i završetak zahtjeva, nije centralizovan u jednom sistemu, što otežava praćenje i upravljanje procesom.

Zbog ovakvog načina rada dolazi do loše koordinacije između zaposlenih, nejasnog statusa intervencija i kašnjenja u obavljanju zadataka. Serviseri nemaju uvijek potpune informacije, dok administracija nema jasan pregled svih aktivnih intervencija. Kao rezultat toga jeste da dolazi do smanjenja efikasnosti rada i nezadovoljstva klijenata, što ukazuje na potrebu za jedinstvenim sistemom koji bi povezao cijeli proces servisnih intervencija.

---

## Ciljni korisnici

Ciljni korisnici ovog sistema uključuju servisne kompanije kao organizaciju, kao i konkretne korisnike sistema: dispečere, servisere i klijente. Svaka od ovih grupa ima jasno definisanu i važnu ulogu u procesu servisnih intervencija i realizaciji servisnih zahtjeva.

Klijenti koriste sistem za prijavu kvarova, praćenje statusa svojih zahtjeva i to im omogućava bolju informisanost i sigurnost da će njihov problem biti riješen na vrijeme. Dispečeri imaju ključnu ulogu jer upravljaju zaprimljenim zahtjevima, dodjeljuju intervencije serviserima i prate njihov tok. Serviseri koriste sistem kako bi dobili informacije o intervencijama, izvršili zadatke na terenu i evidentirali status završenog posla. Na ovaj način sistem povezuje sve grupe u jedinstven proces.

---

## Vrijednost sistema

Vrijednost ovog sistema ogleda se u tome što omogućava centralizovan pregled svih servisnih intervencija na jednom mjestu i jasan tok njihovog izvršavanja. Sistem ima jasan pregled servisnih zahtjeva, preciznu dodjelu zadataka, prikaz statusa intervencija i evidenciju izvršenog rada. Na taj način se smanjuje mogućnost grešaka, ubrzava proces rada i olakšava koordinaciju između dispečera i servisera.

Za razliku od trenutnog načina rada koji se oslanja na nepovezane alate, sistem uvodi jedinstven i organizovan proces upravljanja intervencijama. Dispečeri imaju bolju kontrolu nad svim zaprimljenim zahtjevima, dok serviseri dobijaju tačne i pravovremene informacije potrebne za rad na terenu.

Sistem također pomaže u određivanju prioriteta ili kategorije intervencija, ali konačnu odluku donosi korisnik, čime se zadržava kontrola nad procesom. Na ovaj način sistem ne služi samo kao evidencija, već kao operativni alat koji aktivno podržava upravljanje servisnim intervencijama i omogućava efikasniji rad.

---

## Scope MVP verzije

MVP verzija sistema obuhvata osnovne funkcionalnosti potrebne za prijavu, obradu, dodjelu i praćenje servisnih intervencija, uz fokus na operativni tok rada i primarne korisnike sistema.

MVP verzija treba sadržavati sljedeće funkcionalnosti:

* Registracija i prijava korisnika  
Sistem treba omogućiti kreiranje korisničkog naloga i prijavu u sistem putem osnovnih autentifikacijskih podataka.

* Prijava zahtjeva za servisnu intervenciju  
Sistem treba omogućiti korisnicima kreiranje novog zahtjeva za intervencijom unosom osnovnih podataka o kvaru ili problemu, lokaciji i kratkom opisu problema.

* Pregled otvorenih intervencija  
Sistem treba omogućiti dispečeru i drugim ovlaštenim korisnicima pregled svih aktivnih i otvorenih intervencija, kako bi se jasno vidjelo koji zahtjevi čekaju na obradu, koji su dodijeljeni i koji su trenutno u toku. U okviru ove funkcionalnosti omogućen je i detaljan pregled pojedinačne intervencije, kao i osnovni uvid u intervencije prema statusu, prioritetu i dodijeljenom serviseru.

* Dodjela intervencije odgovornom serviseru ili timu  
Sistem treba omogućiti dodjelu intervencije odgovornom serviseru ili timu servisera, u skladu sa podacima o intervenciji i potrebama konkretnog zadatka. U slučaju timskog rada, potrebno je odrediti glavnog nosioca zadatka, a po potrebi i dodatne članove tima. 

* Upravljanje statusom intervencije  
Sistem treba omogućiti postavljanje i promjenu statusa intervencija tako da status u svakom trenutku što vjernije odražava njeno stvarno stanje na terenu i fazu u kojoj se intervencija nalazi, kako bi  sistemu pratio prirodan, logičan i u praksi ustaljeni tok servisnog procesa, od trenutka prijave i dodjele, preko izvršenja radova, pa sve do samog završetka intervencije. Minimalni skup statusa koju sistem treba podržati obuhvata: kreirano, dodijeljeno, u toku i završeno.

* Evidencija osnovnih informacija o izvršenom radu  
Sistem treba omogućiti evidentiranje osnovnih informacija o izvršenom radu, kako bi se za svaku intervenciju moglo zabilježiti šta je urađeno, koliko je rad trajao i kakav je bio ishod intervencije.

* Određivanje prioriteta intervencija   
Sistem treba omogućiti određivanje prioriteta intervencije na osnovu unesenih informacija o kvaru ili zahtjevu, kako bi se intervencije mogle pravovremeno obraditi i rasporediti u zavisnosti od njihovog stepena hitnosti i važnosti.

* Osnovna komunikacija između dispečera i servisera putem napomena  
Sistem treba omogućiti jednostavnu razmjenu kratkih poruka i napomena između dispečera i servisera u okviru konkretne intervencije, kako bi sve važne informacije vezane za zadatak bile dostupne na jednom mjestu.

* Osnovna historija aktivnosti intervencije  
Sistem treba omogućiti pregled osnovnih aktivnosti vezanih za konkretnu intervenciju, kako bi korisnici na jednom  mjestu mogli vidjeti šta se dešavalo sa zahtjevom od trenutka prijave do trenutnog stanja.

* Osnovna kontrola pristupa prema korisničkim ulogama (RBAC)  
Sistem treba omogućiti osnovno razlikovanje korisničkih uloga i njihovih prava pristupa (funkcionalnostima) u skladu sa odgovornostima pojedinih korisnika.

* Planiranje intervencije  
Sistem treba omogućiti planiranje intervencije kroz određivanje planiranog datuma, vremena, lokacije i odgovorne osobe ili tima, kako bi se zahtjevi mogli organizovati i izvršavati u skladu sa operativnim potrebama.

---

## Šta ne ulazi u MVP

Funkcionalnosti koje neće biti dio početne verzije:

* Mobilna aplikacija za servisere   
U početnoj verziji, sistem će biti dostupan samo kao web aplikacija putem preglednika. Razvoj posebne mobilne aplikacije za servisere ostavlja se za kasniju fazu razvoja.

* Automatske notifikacije  
Početna verzija sistema neće podržavati automatsko obavještavanje korisnika o promjenama statusa intervencije putem e-maila, SMS-a ili drugih kanala. 

* Napredni izvještaji i analitika  
Početna verzija neće uključivati detaljne statistike, analize efikasnosti rada, izvještaje o učinku servisera niti napredne analitičke prikaze za menadžment i druge korisnike.

* Integracija sa drugim sistemima  
Početna verzija sistema neće uključivati složenije integracije sa drugim poslovnim sistemima, kao što su računovodstveni, ERP i drugi slični alati.

* Sistem za ocjenjivanje zadovoljstva klijenata  
U početnoj verziji sistema neće biti podržano ocjenjivanje izvršene usluge, ostavljanje povratnih informacija niti mjerenje zadovoljstva korisnika nakon završetka intervencije.
  
* Potpuno automatsko određivanje prioriteta  
Iako sistem može pružiti podršku pri određivanju prioriteta, u prvoj verziji nije planirano da ovu odluku donosi samostalno. Umjesto potpunog automatizma, koristiće se kombinovani pristup u kojem sistem pomaže, a konačnu odluku potvrđuje ovlašteni korisnik.

* Napredna komunikacija putem chata  
Početna verzija sistema ne uključuje poseban chat modul niti kontinuiranu komunikaciju između korisnika u realnom vremenu. Komunikacija je u MVP-u ograničena na osnovne napomene vezane za konkretnu intervenciju.

* Upravljanje materijalima i skladištem  
Praćenje utrošenih materijala, rezervnih dijelova, stanja zaliha i skladišnih evidencija nije obuhvaćeno MVP verzijom.

* Upravljanje finansijama i obračun usluga  
Početna verzija sistema neće podržavati obračun troškova, fakturiranje, evidenciju uplata niti druge finansijske funkcionalnosti.

* Napredno upravljanje ugovorima i klijentima  
Početna verzija sistema neće uključivati poseban modul za upravljanje ugovorima, detaljne profile klijenata, ugovorene uslove usluge niti naprednu evidenciju odnosa sa klijentima.

* Napredna podrška za timski rad na intervencijama  
Iako početna verzija sistema omogućava dodjelu intervencije timu servisera, napredna pravila timske koordinacije, zasebne uloge unutar tima, složeniji tokovi odobravanja i detaljno praćenje rada svakog člana tima nisu dio početne verzije sistema.

* Napredno planiranje i optimizacija izlazaka na teren  
Početna verzija sistema neće uključivati automatsko raspoređivanje intervencija prema lokaciji, optimizaciju ruta, napredno usklađivanje termina niti druge složenije mehanizme planiranja terenskog rada.

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
* Ovlašteni korisnici će redovno unositi i ažurirati podatke o servisnim zahtjevima i intervencijama u skladu sa svojom ulogom u sistemu. 

* Serviseri će imati pristup sistemu putem odgovarajućeg uređaja i moći će pregledati i ažurirati informacije relevantne za intervencije na kojima rade.

* Korisnici sistema posjeduju osnovna znanja potrebna za korištenje web aplikacije ili će za njen rad dobiti odgovarajuće upute.

* Organizacija koja koristi sistem ima osnovno definisane uloge i odgovornosti u procesu prijave, dodjele i izvršavanja servisnih intervencija.

* Pretpostavlja se dostupnost internet konekcije u trenucima kada korisnici pristupaju sistemu.

* Pretpostavlja se da će za svaku intervenciju biti dostupni osnovni podaci, kao što su opis problema, lokacija i podaci o prijavi.

* Pretpostavlja se da će korisnici unositi tačne i dovoljno potpune informacije kako bi sistem mogao pravilno podržati tok rada i obradu
intervencija.

* Ukoliko se koriste eksterni servisi, pretpostavlja se njihova osnovna dostupnost u mjeri potrebnoj za podršku ključnim funkcionalnostima MVP-a.
