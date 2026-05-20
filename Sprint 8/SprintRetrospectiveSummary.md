# Sprint Retrospective Summary

## Šta je išlo dobro
- Tim je uspio implementirati planirane user storyje i veliki dio ključnog operativnog workflow-a sistema servisnih intervencija.
- Uspostavljena je funkcionalna povezanost između dispečerskog i serviserskog modula kroz dodjelu intervencija, promjene statusa, evidenciju rada, napomene i historiju aktivnosti.
- Operativni wizard za obradu zahtjeva pokazao se kao dobro rješenje za vođenje dispečera kroz složen proces obrade, planiranja i dodjele intervencije.
- Vizuelni identitet sistema postao je konzistentniji, profesionalniji i više usmjeren na stvarni operativni rad.
- Uspješno su unaprijeđeni i ranije implementirani dijelovi sistema, posebno izbor preferiranih termina, gdje korisnik sada može odabrati do tri termina umjesto samo jednog.
- Postignut je značajan napredak u razumijevanju poslovne logike i stvarnih operativnih tokova servisnih intervencija.

---

## Šta nije išlo dobro
- Sprint je imao manje raspoloživog vremena nego inače, pa je veliki obim posla morao biti urađen u kraćem periodu.
- Zbog vremenskog pritiska dio posla je morao biti “sabijen”, što je povećalo intenzitet rada i potrebu za brzim donošenjem odluka.
- Veliki dio implementacije, koordinacije i donošenja ključnih tehničkih odluka ostao je koncentrisan na mali broj članova tima.
- Članovi koji nose najveći dio razvoja bili su opterećeni velikim brojem paralelnih obaveza: implementacijom, analizom poslovne logike, UX/UI odlukama, pregledom koda, dokumentacijom i planiranjem sprinta.
- Pojavio se izražen kognitivni pritisak jer je nekoliko članova moralo istovremeno pratiti veliki broj međusobno povezanih dijelova sistema.
- Iako je centralizovan način rada pomogao da se održi kontrola i konzistentnost, takav pristup povećava zavisnost tima od manjeg broja osoba.

---

## Šta treba promijeniti
- U narednom sprintu potrebno je još ranije raditi UX reviziju i provjeru toka korištenja aplikacije, posebno jer se sistem približava završnoj fazi.
- Potrebno je više pažnje posvetiti provjeri da li svi korisnički tokovi imaju smisla iz perspektive stvarnog korisnika, a ne samo iz perspektive implementacije.
- Kompleksne odluke i dalje mogu ostati koordinisane centralno radi konzistentnosti, ali je potrebno bolje dokumentovati razloge odluka kako bi ostatak tima lakše pratio sistem.
- Veće zadatke treba ranije razbijati na manje dijelove kako bi se smanjio pritisak na članove koji nose najviše posla.
- Potrebno je nastaviti sa cleanup-om, uklanjanjem duplog koda i provjerom povezanosti svih ruta, kako se sistem ne bi komplikovao pred kraj projekta.
- Fokus treba pomjeriti sa same implementacije funkcionalnosti na provjeru kvaliteta, preglednosti, konzistentnosti i upotrebljivosti cijele aplikacije.

---

## Koje konkretne akcije tim uvodi u narednom sprintu
- Prije nove implementacije uraditi kratku UX reviziju glavnih tokova: korisnik, dispečer, serviser i administrator.
- Za svaku novu funkcionalnost provjeriti da li se uklapa u postojeći workflow i da li ne uvodi nepotrebnu kompleksnost.
- Nastaviti sa praksom decision logova kako bi se jasno dokumentovalo zašto su donesene određene tehničke i UX odluke.
- Uvesti dodatnu provjeru ruta, preusmjeravanja, empty state-ova i error state-ova nakon svake veće izmjene.
- Smanjiti oslanjanje na implicitno znanje pojedinaca kroz bolju dokumentaciju implementiranih tokova.
- Nastaviti sa refaktoringom i uklanjanjem mrtvog ili duplog koda.
- Fokus narednog sprinta postaviti na stabilizaciju sistema, UX usklađivanje i provjeru da aplikacija funkcioniše kao jedinstvena cjelina.
