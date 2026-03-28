# Product Vision

 **Naziv projekta:**

Sistem za upravljanje servisnim intervencijama - Service Track 


**Problem koji sistem rješava:**

Većina današnjih kompanija koje se bave servisnim intervencijama nemaju jednostavan sistem za upravljanje zahtjevima. Mnoge kompanije koriste različite alate, kao što su Excel tabele, što dosta otežava pregled svih aktivnih i završenih intervencija. Javljaju se problemi u praćenju zahtjeva kao i sam problem komunikacije između zaposlenih, servisera na terenu i administracije.

Kao rezultat ovoga, često dolazi do kašnjenja ili zaboravljanja zahtjeva a i smanjene efikasnosti u radu. Klijenti mogu biti nezadovoljni zbog nedostataka informacija o statusu svojih zahtjeva, ćime gube vrijeme i kvalitet zbog loše organizacije. Samim tim se ukazuje na potrebu za jednostavnim sistemom koji će omogućiti bolje upravljanje servisnim intervencijama, bolju komunikaciju između zaposlenih i povećati ukupnu efikasnost poslovanja.  


**Ciljni korisnici:**

Ciljni korisnici ovog sistema jesu servisne kompanije, serviseri koji obavljaju intervencije na terenu i klijenti koji koriste njihove servisne usluge. Sve tri grupe imaju važnu ulogu u procesu servisiranja i svakodnevno učestvuju u prijavi, organizaciji i realizaciji servisnih zahtjeva.

Servisne kompanije koriste sistem kako bi lakše pregledale zahtjeve, poboljšale organizaciju rada i jednostavnije dodjeljivali zadatke serviserima. Serviseri koriste sistem kako bi dobili tačne informacije o intervencijama, lokaciji, vrsti kvara, te kako bi mogli evidentirati status završenog posla. Klijenti koriste sistem za prijavu kvarova, praćenja statusa svojih zahtjeva i to im omogućava bolju informisanost i sigurnost da će njihov problem biti riješen na vrijeme. 

**Vrijednost sistema**

Vrijednost ovog sistema ogleda se u unapređenju organizacije i efikasnosti rada sevisnih kompanija pri radu sa intervencijama. Sistem ima jasan pregled servisnih zahtjeva i lakšu podjelu zadataka. Na taj način se smanjuje mogućnost grešaka, ubrzava proces rada i olakšava komunikaciju između klijent-administrator, administator-serviser.

Pored toga, sistem donosi veliku vrijednost i klijentima koji korisne servisne usluge. Klijentima je omogućeno da na jednostavan način prijave kvar i prate status i vrijeme rada svog zahtjeva. Time se povećava njihova informisanost i povjerenje u uslugu, jer imaju jasnu sliku o tome kada i kako će njihov problem biti riješen.

Sistem doprinosi digitalizaciji poslovanja i modernizaciji procesa rada unutar kompanija. Ovakvim rješenjem smanjuje se potreba za manuelnim vođenjem evidencije, a dugoročno gledano, sistem može doprinijeti smanjenju troškova, boljoj organizaciji resursa i unepređenju kvaliteta usluga. 

**Scope MVP verzije**

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



**Šta ne ulazi u MVP**

Funkcionalnosti koje neće biti dio početne verzije:

  Prva verzija sistema Service Track neće sadržavati sve funkcije. One koje nisu potrebne za osnovno korištenje servisnim intervencijama će se razvijati kasnije.

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



**Ključna ograničenja**

* Imamo ograničeno vrijeme za razvoj sistema. Zbog toga će prva verzija sadržavati samo osnovne stvari koje su potrebne za efikasnu funkcionalnost.

  Sistem će se razvijati u kratkom roku, pa će zbog toga sadržavati samo osnovne funkcionalnosti. To znači da neke stvari neće biti dostupne odmah.

* Ograničeni resursi

  Naš tim broji manji broj ljudi, pa ne možemo učiniti sve što želimo u prvoj verziji sistema. Moramo birati što je najvažnije.

* Tehnološka ograničenja

  Sistem će biti web aplikacija, a ne mobilna aplikacija. Neće biti povezan sa drugim sistemima.

* Budžetska ograničenja

  Imamo ograničen budžet, pa ćemo se fokusirati na stvari koje su najvažnije za upravljanje servisnim intervencijama.

**Pretpostavke:**

Administratori će redovno unositi i updateovati servisne zahtjeve u sistemu. 
Serviseri će imati pristup sistemu i moći će pregledati i updejtovati informacije o intervencijama. 
Korisnici sistema će znati osnove kako raditi i koristiti web aplikaciju. 
Kompanija koja koristi sistem će imati dobro organizovan servis i zaposlene servisere koji će izvršavati intervencije. 
