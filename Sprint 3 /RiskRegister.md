# Risk Register

Risk Register predstavlja dokument za identifikaciju, procjenu i praćenje rizika koji mogu uticati na razvoj sistema za upravljanje servisnim intervencijama. Njegova svrha je da timu omogući pravovremeno prepoznavanje potencijalnih problema, procjenu njihove ozbiljnosti i planiranje odgovarajućih mjera ublažavanja prije nego što rizici ugroze funkcionalnost, kvalitet, sigurnost ili rokove projekta.

U okviru ovog projekta rizici se mogu pojaviti na više nivoa. Tehnički rizici odnose se na autentifikaciju, autorizaciju, integraciju modula, konzistentnost podataka, performanse i dostupnost sistema. Funkcionalni i domenski rizici odnose se na pogrešno modeliranje toka zahtjeva, intervencije, dodjele, prioriteta i statusa, kao i na neusklađenost sistema sa stvarnim poslovnim procesom. Pored toga, prisutni su i rizici kvaliteta, kao što su nedovoljno testiranje, fokus isključivo na osnovne scenarije i gomilanje tehničkog duga. Konačno, projekat uključuje i organizacijske i ljudske rizike, poput loše raspodjele zadataka, pogrešnog razumijevanja zahtjeva, slabije komunikacije u timu i kašnjenja u razvoju.

Procjena svakog rizika vrši se na osnovu dvije dimenzije: vjerovatnoće pojave i mogućeg uticaja na projekat. Na osnovu njihovog umnoška određuje se prioritet rizika, čime se timu omogućava da pažnju prvo usmjeri na najkritičnije stavke.

## Tabela rizika

| ID | Opis rizika | Uzrok | Kategorija rizika | Vjerovatnoća | Uticaj | Prioritet rizika | Plan mitigacije | Odgovorna osoba ili uloga | Status |
|----|-------------|-------|-------------------|--------------|--------|------------------|-----------------|---------------------------|--------|
| R-01 | Postoji rizik da autentifikacija korisnika i kontrola pristupa prema korisničkim ulogama ne budu ispravno implementirane, što može dovesti do prijave sa neispravnim kredencijalima, pogrešnog prepoznavanja uloge ili pristupa nedozvoljenim funkcionalnostima. | Nedovoljno jasno definisana pravila pristupa i greške u implementaciji autentifikacije i RBAC logike | tehnički / sigurnosni | 2 | 3 | 6 | Implementirati provjerene autentifikacijske mehanizme, jasno definisati RBAC pravila, testirati prijavu, odjavu i pristup po ulogama | Backend developer | U praćenju |
| R-02 | Postoji rizik da dođe do sigurnosnih propusta ili curenja podataka, usljed čega bi neovlašteni korisnici mogli pristupiti podacima o zahtjevima, intervencijama, dodjelama ili korisničkim nalozima. | Slaba zaštita sesija, neadekvatna autorizacija, nedovoljno sigurna obrada i pohrana podataka | sigurnosni | 2 | 3 | 6 | Uvesti zaštitu sesija, kontrolu pristupa na backendu, hashiranje lozinki, sigurnosno testiranje i audit log pristupa | Backend developer / DevOps | U praćenju |
| R-03 | Postoji rizik od gubitka podataka o zahtjevima, intervencijama, dodjelama, napomenama ili evidenciji rada, što može ozbiljno narušiti pouzdanost sistema i tok obrade. | Problemi sa bazom podataka, greške pri spremanju ili nedovoljno pouzdan backup mehanizam | tehnički / sigurnosni | 1 | 3 | 3 | Uvesti redovan backup baze, testirati restore postupak i koristiti pouzdane mehanizme perzistencije podataka | Backend developer / DBA | Otvoren |
| R-04 | Postoji rizik da sistem povremeno postane nedostupan, što bi korisnicima onemogućilo prijavu zahtjeva, pregled intervencija ili rad na zadacima. | Pad servera, hosting problem, pogrešna konfiguracija okruženja ili preopterećenje sistema | tehnički / infrastrukturni | 1 | 3 | 3 | Uvesti monitoring, recovery plan i provjeru stabilnosti deployment okruženja | DevOps / tehnički tim | Otvoren |
| R-05 | Postoji rizik da integracija između pojedinih modula sistema bude zakašnjela ili neuspješna, zbog čega funkcionalnosti koje su razvijane odvojeno ne bi pravilno sarađivale u cjelini sistema. | Paralelan razvoj bez dovoljno jasno definisanih interfejsa i nedovoljno rano integraciono testiranje | tehnički / projektni | 3 | 2 | 6 | Definisati jasne interfejse između modula, raditi redovne integracione provjere i testirati povezane funkcionalnosti čim budu dostupne | Team lead / development tim | U praćenju |
| R-06 | Postoji rizik da frontend, API i backend ne budu potpuno usklađeni, zbog čega bi određene funkcionalnosti mogle raditi djelimično ili neispravno. | Neusklađeni ugovori podataka, izmjene endpointa bez koordinacije i slaba komunikacija između dijelova sistema | tehnički / integracioni | 2 | 3 | 6 | Rano definisati API ugovore, koristiti testne podatke i provoditi integraciono testiranje po funkcionalnim cjelinama | Frontend / Backend developer | U praćenju |
| R-07 | Postoji rizik da statusi i tok intervencije ne budu dovoljno jasno modelirani, zbog čega bi se mogle pojaviti nedozvoljene promjene stanja, neusklađenost između evidencije i stvarnog procesa rada ili zabuna među korisničkim ulogama. | Nedovoljno definisan workflow, nejasni prelazi između statusa i neusklađenost dokumentacije i implementacije | zahtjevi / tehnički | 2 | 3 | 6 | Definisati jasan workflow, dozvoljene prelaze statusa i poslovna pravila za zahtjev, intervenciju i dodjelu | Analitičar / Team lead | U praćenju |
| R-08 | Postoji rizik da logika prioriteta, dodjele, prihvatanja, odbijanja i ponovne dodjele intervencija bude pogrešno ili previše kompleksno modelirana, što može dovesti do nelogičnog ponašanja sistema. | Previše pravila, nejasno definisana poslovna logika i pokušaj podrške prevelikom broju scenarija bez pojednostavljenja | tehnički / domenski | 2 | 2 | 4 | Pojednostaviti logiku, jasno definisati pravila za prioritet, dodjelu i preraspodjelu te ih dokumentovati prije implementacije | Backend developer / analitičar | Otvoren |
| R-09 | Postoji rizik da domain model ne odražava stvarni poslovni proces, zbog čega entiteti, veze i poslovna pravila ne bi podržavali stvarne potrebe sistema. | Pogrešno modeliranje entiteta, atributa ili odnosa između zahtjeva, intervencije, dodjele i evidencije rada | domenski / zahtjevi | 2 | 3 | 6 | Validirati domain model u odnosu na use caseove i poslovna pravila, te rano korigovati model prije implementacije | Analitičar / arhitekta | U praćenju |
| R-10 | Postoji rizik od nekonzistentnosti podataka između zahtjeva, intervencija, dodjela, statusa, napomena i evidencije rada, zbog čega bi sistem mogao prikazivati nelogična ili međusobno neusaglašena stanja. | Nedovoljna validacija poslovnih pravila i veza između ključnih entiteta | tehnički / kvalitet | 2 | 3 | 6 | Uvesti validaciju poslovnih pravila, testirati statusne prelaze i provjeravati konzistentnost povezanih entiteta | Backend developer | U praćenju |
| R-11 | Postoji rizik da kvalitet podataka koje korisnici unose u sistem bude nedovoljan, što može dovesti do pogrešne obrade zahtjeva, netačnih prikaza i loših operativnih odluka. | Nedostatak validacije, nepotpuni unosi i korisničke greške pri unosu | kvalitet / tehnički | 3 | 2 | 6 | Uvesti validaciju podataka na frontendu i backendu, obavezna polja, ograničenja formata i provjere poslovnih pravila pri unosu | Backend / Frontend developer | U praćenju |
| R-12 | Postoji rizik da korisnik izmijeni ili otkaže zahtjev u trenutku kada je zahtjev već u obradi ili pretvoren u intervenciju, što može izazvati logičke konflikte u sistemu. | Nedovoljno jasno definisana pravila za izmjenu i otkazivanje zahtjeva | funkcionalni / domenski | 2 | 2 | 4 | Jasno definisati faze u kojima je dozvoljena izmjena ili otkazivanje zahtjeva i provjeravati ih kroz validaciju i testove | Backend developer / analitičar | Otvoren |
| R-13 | Postoji rizik da dodjela pomoćnog servisera, promjena izvršioca ili vraćanje zadatka na ponovnu dodjelu ne budu pravilno podržani, što može narušiti tok rada i odgovornost izvršilaca. | Nedovoljno precizno modeliranje dodatnih scenarija dodjele i preraspodjele | funkcionalni / domenski | 2 | 2 | 4 | Uskladiti use caseove, domain model i poslovna pravila za glavnog i pomoćnog izvršioca te za ponovnu dodjelu | Analitičar / Backend developer | Otvoren |
| R-14 | Postoji rizik da evidencija izvršenog rada ne bude potpuno ili ispravno unesena, zbog čega dispečer ne bi imao pouzdanu osnovu za pregled i zatvaranje intervencije. | Nedovoljno stroga validacija unosa i nejasno definisana obavezna polja evidencije rada | funkcionalni / kvalitet | 2 | 3 | 6 | Definisati obavezna polja evidencije rada, validirati unos i testirati scenarije djelimičnog ili pogrešnog unosa | Backend developer / QA | U praćenju |
| R-15 | Postoji rizik da historija aktivnosti i audit trag ne budu vođeni dosljedno, zbog čega kasnije ne bi bilo moguće pouzdano pratiti ko je izvršio koju promjenu i kada. | Nedovoljno centralizovano logovanje promjena i nejasna pravila evidencije aktivnosti | tehnički / kvalitet | 2 | 2 | 4 | Uvesti obavezno evidentiranje svih važnih promjena nad zahtjevima, intervencijama, dodjelama i statusima | Backend developer | U praćenju |
| R-16 | Postoji rizik da zatvaranje intervencije bude omogućeno bez potpune evidencije rada ili bez ispunjenih uslova za završetak, čime bi proces bio formalno zatvoren, ali sadržajno nedovršen. | Nedovoljno stroga poslovna pravila za završetak i zatvaranje intervencije | funkcionalni / domenski | 2 | 3 | 6 | Jasno definisati uslove zatvaranja, validirati ih u sistemu i testirati sve scenarije zatvaranja | Backend developer / analitičar | U praćenju |
| R-17 | Postoji rizik da alternativni scenariji i negativni slučajevi ne budu dovoljno razrađeni, zbog čega bi sistem bio razvijan i testiran uglavnom za osnovni tok rada. | Fokus na happy path i nedovoljno razmišljanje o rubnim slučajevima | kvalitet / zahtjevi | 2 | 2 | 4 | Posebno definisati edge case-ove, alternativne tokove i negativne scenarije u use caseovima i testnim scenarijima | Tim | Otvoren |
| R-18 | Postoji rizik da testiranje u sprintovima ne bude dovoljno obimno ili da se odgađa za kraj sprinta, zbog čega greške ne bi bile otkrivene na vrijeme. | Nedostatak vremena za testiranje, fokus na implementaciju bez paralelnog planiranja provjera | kvalitet / projektni | 2 | 3 | 6 | Uvesti obavezno testiranje po sprintu, definisati minimalne testne scenarije za svaku važniju funkcionalnost i planirati testne aktivnosti uz razvoj | QA / tim | U praćenju |
| R-19 | Postoji rizik da testiranje ostane ograničeno samo na osnovne funkcionalnosti i očekivani tok rada, zbog čega bi propusti u rubnim i negativnim scenarijima ostali neotkriveni. | Nedostatak vremena i fokus isključivo na osnovne funkcionalnosti | kvalitet | 3 | 2 | 6 | Uvesti testiranje negativnih i rubnih scenarija, ne samo osnovnog toka, i povezati ih sa acceptance kriterijima | QA / tim | U praćenju |
| R-20 | Postoji rizik da se tehnički dug gomila kroz sprintove, usljed brzog razvoja bez redovne dorade, refaktorisanja i stabilizacije implementiranih rješenja. | Fokus na brzo završavanje funkcionalnosti bez dovoljno pažnje na kvalitet koda i održivost | tehnički / kvalitet | 3 | 3 | 9 | Planirati refaktorisanje, code review i redovno smanjivati tehnički dug tokom sprintova | Development tim | U praćenju |
| R-21 | Postoji rizik da sprint obuhvati prevelik broj zadataka ili previše kompleksne funkcionalnosti, zbog čega tim ne bi uspio završiti planirani inkrement u predviđenom roku. | Loša procjena veličine zadataka, nerealno planiranje sprinta i uključivanje previše stavki u sprint backlog | projektni / vremenski | 2 | 3 | 6 | Realnije procjenjivati zadatke, smanjiti obim sprinta na prioritetne funkcionalnosti i planirati prema stvarnom kapacitetu tima | Scrum master / Team lead | U praćenju |
| R-22 | Postoji rizik da zavisnosti između sprintova budu prevelike, zbog čega kašnjenje jedne funkcionalne cjeline može direktno blokirati razvoj narednih sprintova. | Loše planiranje redoslijeda funkcionalnosti i međusobno prevelika povezanost zadataka | projektni / vremenski | 2 | 3 | 6 | Planirati sprintove tako da funkcionalne cjeline budu što nezavisnije i da kritične zavisnosti budu rano riješene | Scrum master / Team lead | U praćenju |
| R-23 | Postoji rizik da se složeniji i rizičniji zadaci odgađaju za završne sprintove, što bi moglo dovesti do zagušenja, kašnjenja i slabijeg kvaliteta završne isporuke. | Loše planiranje i odgađanje tehnički zahtjevnih funkcionalnosti | projektni / vremenski | 2 | 3 | 6 | Ravnomjerno rasporediti složene zadatke kroz sprintove i ranije otvarati tehnički teške stavke | Scrum master / Team lead | Otvoren |
| R-24 | Postoji rizik da tim pogrešno razumije zahtjeve sistema, user storyje ili upute asistenata, što može dovesti do implementacije funkcionalnosti koje ne odgovaraju stvarnim očekivanjima projekta. | Nedovoljno precizni zahtjevi, nejasne odluke i slaba interna validacija razumijevanja | zahtjevi / organizacijski | 2 | 2 | 4 | Redovno razjašnjavati otvorena pitanja, voditi evidenciju odluka i provjeravati usklađenost implementacije sa acceptance kriterijima | Team lead / cijeli tim | U praćenju |
| R-25 | Postoji rizik da se ključne odluke o modelu sistema, entitetima ili poslovnim pravilima mijenjaju kasno u projektu, što bi moglo izazvati refaktorisanje i kašnjenje implementacije. | Nedovoljno razrađeni zahtjevi na početku i kasna validacija modela | projektni / zahtjevi | 2 | 3 | 6 | Ranije validirati domain model, use case model i poslovna pravila, te smanjiti kasne promjene osnovnih odluka | Analitičar / Team lead | Otvoren |
| R-26 | Postoji rizik da doprinos članova tima ne bude ravnomjeran, zbog čega bi dio tima bio preopterećen, a dio zadataka ostao nedovoljno pokriven. | Loša raspodjela zadataka, nedovoljna koordinacija i nejasna odgovornost po stavkama | organizacijski / ljudski | 2 | 2 | 4 | Jasno definisati zadatke, pratiti napredak članova tima i pravovremeno preraspodijeliti obaveze | Team lead | U praćenju |
| R-27 | Postoji rizik da pojedini članovi tima nemaju dovoljno tehničkog znanja za određene dijelove projekta, što može usporiti implementaciju ili dovesti do slabijih rješenja. | Nedostatak iskustva sa tehnologijama, obrascima ili složenijim dijelovima sistema | ljudski / tehnički | 2 | 2 | 4 | Rano identifikovati kritične tehničke tačke, organizovati razmjenu znanja i rasporediti zadatke prema kompetencijama | Team lead / development tim | Otvoren |
| R-28 | Postoji rizik da komunikacija unutar tima ne bude dovoljno efikasna, zbog čega bi odluke, promjene ili otvorena pitanja ostali neusklađeni među članovima. | Nedovoljno redovni sastanci, nejasna interna komunikacija i odsustvo evidencije odluka | organizacijski / ljudski | 2 | 2 | 4 | Održavati redovne sastanke, voditi evidenciju odluka i otvorenih pitanja te jasno dogovarati sljedeće korake | Team lead / cijeli tim | U praćenju |
| R-29 | Postoji rizik da korisnički interfejs ne bude dovoljno intuitivan i pregledan za različite korisničke uloge, što može otežati korištenje sistema i povećati broj grešaka u radu. | Neintuitivan dizajn, nepregledni korisnički tokovi i nedovoljna provjera upotrebljivosti | kvalitet / UI/UX | 2 | 2 | 4 | Provoditi testiranje upotrebljivosti, iterativno poboljšavati prikaze i pojednostaviti ključne tokove rada | Frontend developer / UI/UX | Otvoren |
| R-30 | Postoji rizik da sistem ne funkcioniše jednako ispravno na različitim uređajima i preglednicima, što može dovesti do grešaka u prikazu ili ograničene upotrebljivosti. | Razlike u podršci tehnologijama, responzivnosti i prikazu među browserima i uređajima | tehnički / UI/UX | 2 | 2 | 4 | Testirati sistem na više browsera i uređaja te koristiti standardne i responzivne web tehnologije | Frontend developer | Otvoren |
| R-31 | Postoji rizik da sistem ne bude dovoljno skalabilan za veći broj zahtjeva, korisnika ili intervencija, što može uzrokovati spor odziv i degradaciju performansi u ključnim dijelovima rada. | Nedovoljno optimizovana arhitektura, upiti, backend logika ili način obrade podataka | tehnički / performanse | 2 | 3 | 6 | Optimizovati upite i poslovnu logiku, pratiti performanse i planirati skalabilnost ključnih dijelova sistema | Backend developer / arhitekta | Otvoren |
| R-32 | Postoji rizik da performanse dashboarda, pregleda lista i historije aktivnosti budu slabe kada količina podataka poraste, što može otežati operativni rad dispečera i administratora. | Nedostatak paginacije, filtriranja, optimizacije upita i loše upravljanje količinom podataka na prikazu | tehnički / performanse | 2 | 2 | 4 | Uvesti paginaciju, filtriranje, optimizovane upite i ograničiti količinu podataka po prikazu | Frontend / Backend developer | Otvoren |
| R-33 | Postoji rizik da notifikacije ili obavještenja, ako budu uvedene u sistem, ne budu ispravno poslane ili da kasne, zbog čega učesnici procesa ne bi bili pravovremeno informisani. | Problemi sa integracijom notifikacijskog servisa ili neadekvatna logika slanja | tehnički / funkcionalni | 1 | 2 | 2 | Uvesti retry mehanizam, logovanje slanja i fallback pristup za neuspjele isporuke | Backend developer | Otvoren |
| R-34 | Postoji rizik da dokumentacija projekta, uključujući modele, poslovna pravila i tehničke odluke, ne bude dovoljno ažurna, zbog čega bi došlo do raskoraka između dokumentacije i implementacije. | Kasne izmjene bez ažuriranja artefakata i nedovoljno odgovornosti za dokumentaciju | organizacijski / kvalitet | 2 | 2 | 4 | Redovno ažurirati dokumentaciju nakon važnih promjena i jasno dodijeliti odgovornost za njeno održavanje | Team lead / dokumentacijski dio tima | U praćenju |

## Risk Matrix

Matrica rizika prikazuje raspored identificiranih rizika prema vjerovatnoći njihove pojave i uticaju koji mogu imati na projekat.

| Vjerovatnoća / Uticaj | Nizak uticaj (1) | Srednji uticaj (2) | Visok uticaj (3) |
|---|---|---|---|
| **Visoka vjerovatnoća (3)** |  | R-05, R-11, R-19 | R-20 |
| **Srednja vjerovatnoća (2)** |  | R-08, R-12, R-13, R-15, R-17, R-24, R-26, R-27, R-28, R-29, R-30, R-32, R-34 | R-01, R-02, R-06, R-07, R-09, R-10, R-14, R-16, R-18, R-21, R-22, R-23, R-31 |
| **Niska vjerovatnoća (1)** |  | R-33 | R-03, R-04 |

## Tumačenje matrice

- Rizici u polju **visoka vjerovatnoća / visok uticaj** predstavljaju najkritičnije rizike i zahtijevaju najveću pažnju tima.
- Rizici u polju **srednja vjerovatnoća / visok uticaj** takođe su vrlo značajni i trebaju biti pod stalnim nadzorom.
- Rizici sa **srednjim uticajem** zahtijevaju aktivno praćenje i pravovremenu reakciju ako se počnu materijalizovati.
- Rizici sa **niskim prioritetom** ne smiju biti zanemareni, ali ne zahtijevaju isti nivo pažnje kao visoki i kritični rizici.

## Najkritičniji rizici

Na osnovu prioriteta i rasporeda u matrici, posebnu pažnju treba usmjeriti na:

- **R-20** — gomilanje tehničkog duga kroz sprintove
- **R-05** — neuspješna ili zakašnjela integracija modula
- **R-01** — problemi sa autentifikacijom i RBAC logikom
- **R-02** — sigurnosni propusti i curenje podataka
- **R-07** — nejasno modeliranje statusa i toka intervencije
- **R-10** — nekonzistentnost podataka između ključnih entiteta
- **R-18** — nedovoljno testiranja po sprintu
- **R-21** — preširok obim sprinta
- **R-22** — prevelika zavisnost između sprintova
- **R-31** — problemi sa skalabilnošću i performansama sistema


## Legenda za tabelu

Risk Register tabela služi za identifikaciju, procjenu i praćenje rizika tokom projekta.

- **ID rizika** — jedinstvena oznaka rizika radi lakšeg praćenja i referenciranja  
  *Primjer: R-01, R-02, R-03*

- **Opis rizika** — sažet, ali smislen opis rizika koji objašnjava šta bi moglo poći po zlu i kakvu posljedicu to može imati na projekat

- **Uzrok** — osnovni razlog zbog kojeg se rizik može pojaviti

- **Kategorija rizika** — vrsta rizika kojoj stavka pripada  
  *Primjeri: tehnički, projektni, organizacijski, zahtjevi, kvalitet, sigurnosni, vremenski, UI/UX, infrastrukturni, ljudski, domenski, funkcionalni, performanse*

- **Vjerovatnoća** — procjena koliko je vjerovatno da će se rizik pojaviti  
  - **1** = niska  
  - **2** = srednja  
  - **3** = visoka  

- **Uticaj** — procjena koliko bi posljedice bile ozbiljne ako se rizik desi  
  - **1** = nizak  
  - **2** = srednji  
  - **3** = visok  

- **Prioritet rizika** — ukupni nivo ozbiljnosti rizika, računa se formulom:  
  **Prioritet = Vjerovatnoća × Uticaj**

  Tumačenje:
  - **1–2** = nizak  
  - **3–4** = srednji  
  - **6** = visok  
  - **9** = kritičan  

- **Plan mitigacije** — mjere koje tim planira poduzeti kako bi smanjio vjerovatnoću pojave rizika, njegov uticaj ili posljedice ako se rizik ostvari

- **Odgovorna osoba ili uloga** — osoba ili uloga odgovorna za praćenje rizika i koordinaciju mjera ublažavanja

- **Status rizika** — trenutno stanje rizika  
  - **Otvoren** — rizik je identifikovan i još nije aktivno obrađen  
  - **U praćenju** — rizik se prati i provode se mjere ublažavanja  
  - **Ublažen** — vjerovatnoća ili uticaj rizika su smanjeni  
  - **Zatvoren** — rizik više nije relevantan ili više ne utiče na projekat  
