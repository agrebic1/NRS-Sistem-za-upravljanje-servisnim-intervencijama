# Sprint Retrospective Summary

## Šta je išlo dobro

1. Sinergija razvojnog tima i AI alata (Digitalna akceleracija)
Developeri su pokazali izuzetnu vještinu u integraciji AI alata u svakodnevni workflow. Umjesto da AI tretiraju samo kao prečicu, koristili su ga kao "multiplikator snage".
To nam je omogućilo da rutinske tehničke zadatke i pisanje kompleksnog boilerplate koda završimo u rekordnom roku. Ono što bi ranije trajalo danima, sada je završeno u satima, ali bez kompromisa u preciznosti.
Ova sinergija je stvorila prostor u kojem se tim nije iscrpljivao na sitnicama, već je ostao svjež za rješavanje ključnih problema.

2. Fokus na "Arhitekturu sigurnosti", modeliranje procesa i realne scenarije
Oslobađanje dragocjenog vremena zahvaljujući efikasnoj upotrebi AI alata omogućilo je developerima da se fokusiraju na duboko, strateško promišljanje o arhitekturi.
Umjesto fokusiranja na samu sintaksu koda, tim je resurse usmjerio na precizno modeliranje poslovnih procesa i tokova podataka.

Modeliranje tokova i realnih scenarija: Developeri nisu samo "kucali kod" prema specifikaciji, već su aktivno simulirali životni ciklus svake funkcije u stvarnom svijetu. 
Svaki proces je analiziran kroz prizmu realnih potreba korisnika, što je rezultiralo logikom koja nije samo funkcionalna, već i intuitivna i otporna na greške u koracima.

Obrada "Edge Case" situacija: Posebna pažnja posvećena je rubnim slučajevima koji se u ranoj fazi MVP-a često previđaju. 
Tim je unaprijed predvidio i programski obradio situacije poput iznenadnih prekida konekcije na terenu, pokušaja manipulacije sesijama, te nekonzistentnih unosa podataka. 
Time smo izbjegli buduće "gašenje požara" i tehnički dug.

Sigurnost (Security by Design): Od samog početka, sigurnost nije tretirana kao opcionalni sloj koji se dodaje na kraju, već kao integralni dio svakog modula. 
Implementirana je stroga validacija na svim nivoima, štiteći integritet podataka od neovlaštenih pokušaja pristupa i osiguravajući stabilnost performansi čak i pod opterećenjem.

Optimizacija performansi: Uz modeliranje sigurnosti, developeri su paralelno radili na optimizaciji odziva sistema, osiguravajući da arhitektura podržava brz rad dispečera i servisera, 
bez obzira na kompleksnost pozadinskih provjera.

Zahvaljujući ovom pristupu, stvoren je sistem koji je robustan, predvidiv i spreman za izazove stvarnog svijeta, a ne samo za idealne laboratorijske uslove.

4. Tehnička stabilnost i besprijekorna logika
Kao rezultat ovakvog pristupa, implementirana baza (autentifikacija, RBAC, upravljanje sesijama) postavljena je nevjerovatno stabilno.
Uloženi zajednički trud rezultirao je čistom logikom baze podataka koja je prošla sve interne provjere bez kritičnih grešaka.
Ova stabilnost nam daje ogromno samopouzdanje za nastavak projekta, jer znamo da gradimo na "armiranom betonu", a ne na privremenim rješenjima.


## Šta nije išlo dobro

Centralizacija odgovornosti i operativno opterećenje: Primijetili smo da se komunikacija, donošenje odluka i rješavanje svih tehničkih nedoumica trenutno u velikoj mjeri oslanjaju na koordinatora/Scrum mastera.
Iako je to na početku osiguralo smjer, stvoren je model "uskog grla" koji usporava tim. 
Cilj nam je da u narednoj fazi decentralizujemo odgovornost kako bi svaki član tima imao autonomiju da donosi odluke unutar svog domena, čime bismo ubrzali cjelokupni progres.

Potreba za sinhronizacijom u kolaboracijskim alatima: Tokom rada na zajedničkom kodu (GitHub), identifikovali smo značajan jaz u poznavanju radnih procesa. 
Umjesto paralelnog i nesmetanog rada, trošili smo dodatno vrijeme na ručno integrisanje rješenja, što je povećalo opterećenje aktivnih članova. 
Ovo ne vidimo kao grešku pojedinca, već kao jasan signal da nam je potrebna interna edukacija i standardizacija kako bi svi mogli ravnopravno doprinositi razvoju.

Neiskorišteni kapaciteti i dinamika uključivanja: Jedan od izazova je bio i neujednačen nivo angažovanosti unutar tima. 
Rad sa manjim brojem aktivnih članova od planiranog stvorio je disbalans u raspodjeli tereta. 
Želimo stvoriti okruženje u kojem će se svaki član osjećati pozvanim i odgovornim za svoj dio zadataka, jer samo puni kapacitet tima garantuje dugoročni uspjeh bez izgaranja pojedinaca.

Prilagođavanje ambicija stvarnim mogućnostima: Planiranje u Sprintu 5 bilo je prilično oprezno, u međuvremenu smo shvatili da smo potcijenili brzinu razvoja koju nam omogućava AI sinergija. 
"Zid" koji smo podigli iz predostrožnosti spriječio nas je da isporučimo još više funkcionalnosti. U buduće sprintove ulazimo sa hrabrijim procjenama, svjesni da nas tehnički detalji više ne mogu usporiti kao ranije.

## Šta treba promijeniti
Decentralizacija odlučivanja i osnaživanje članova: Vrijeme je da se odgovornost za specifične module prebaci na tim. 
Promjenom fokusa sa jedne centralne tačke odlučivanja na više manjih "vlasnika procesa", smanjit ćemo zastoje i omogućiti koordinatoru da se bavi strategijom, a ne mikro-menadžmentom svake linije koda. 
Svaki član tima treba dobiti slobodu (i odgovornost) da samostalno rješava izazove unutar svog domena.

Standardizacija i ujednačavanje tehničkih vještina: Neophodno je premostiti tehnički jaz u korištenju alata za kolaboraciju (GitHub). 
Promjena koju uvodimo je prelazak sa "individualnog rada" na "sinhronizovan rad". 
Investiranjem vremena u edukaciju onih koji su manje iskusni, prestajemo trošiti sate na ručno spajanje koda i prelazimo na automatizovan, paralelan razvoj.

Dinamičnije i ambicioznije planiranje: Na osnovu iskustva iz Sprinta 5, moramo promijeniti način na koji procjenjujemo sopstvenu brzinu. 
Uz AI alate kao saveznike, tehnička implementacija više nije glavna prepreka. Treba promijeniti mentalni sklop iz "oprezno i sporo" u "ambiciozno i agilno", preuzimajući veći obim posla bez straha od kompleksnosti.

Transparentna raspodjela zadataka i odgovornosti: Kako bismo aktivirali sve dostupne resurse, potrebno je promijeniti način delegiranja. Umjesto opštih zadataka, uvodimo direktna zaduženja koja su jasno mjerljiva. 
Time se smanjuje prostor za neaktivnost i osigurava da svaki član tima ima jasnu ulogu u uspjehu sprinta.


## Koje konkretne akcije tim uvodi u narednom sprintu

Velocity Boost – Povećanje obima zadataka: Na osnovu uštede vremena koju nam pruža sinergija sa AI alatima, u Sprint 6 ulazimo sa 30% većim brojem User Story-ja. Fokus se pomjera na razvoj kompleksnijih funkcionalnosti kao što su Smart Wizard i Onboarding sistem, koristeći stabilne temelje postavljene u Sprintu 5.

Individualna zaduženja i Check-in sistem: Svaki član tima će dobiti specifične, mjerljive zadatke (tasks) u Backlogu. Uvodimo kratke, fokusirane "check-in" momente tokom sprinta kako bismo na vrijeme identifikovali eventualne zastoje i osigurali da se svaki resurs koristi u punom kapacitetu.

Refaktorisanje kroz Peer Review: Uvodimo praksu da članovi tima pregledaju kod jedni drugima (uz asistenciju AI za analizu performansi). Ovo ne služi samo kontroli kvaliteta, već je i najbolji način za prenos znanja unutar tima, posebno u pogledu onih realnih scenarija i sigurnosti koje smo ranije definisali.
