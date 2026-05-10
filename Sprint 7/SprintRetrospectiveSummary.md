# Sprint Retrospective Summary

Ova retrospektiva nam je pomogla da spoznamo kako funkcionišemo kada pokušamo promijeniti samu srž naše organizacije. Jasnije smo uvidjeli posljedice odluke da razvoj otvorimo svima, spoznali smo šta je u ovoj fazi projekta efikasno, a šta nas, uprkos dobroj namjeri, vodi u tehnički i operativni haos.

---

## Šta je išlo dobro

### Zajedničko istrajavanje i očuvanje stabilnosti sistema
Iako je ovaj sprint pred nas postavio ozbiljne organizacione izazove, uspjeli smo završiti sve planirane zadatke. Proces prilagođavanja na nove uloge donio je dosta neusklađenosti, ali zahvaljujući brzoj reakciji i dodatnom trudu na stabilizaciji koda, održali smo sistem funkcionalnim. Temelji koje smo ranije postavili izdržali su ove promjene, što potvrđuje važnost arhitektonske stabilnosti.

### Iskreno razumijevanje naših trenutnih mogućnosti
Odluka da u razvoj uključimo širi krug ljudi bila je vođena željom da svi zajedno napredujemo. Ipak, Sprint 7 nam je otvoreno pokazao da dobra namjera nije dovoljna za rad na ovako kompleksnom sistemu. Uvidjeli smo da svako odstupanje od pravila zahtijeva ogroman napor iskusnijih članova da se stvari vrate u početno stanje.

### Uspostavljanje tehničke discipline tokom samog sprinta
Suočeni sa neusklađenostima, unutar sprinta smo uveli strogu kontrolu koda. Kreirani su zasebni branchevi za sve članove, zabranjeni su direktni commiti na main granu, te je uveden obavezan proces odobravanja Pull Requestova. Ove mjere su zaustavile degradaciju sistema i vratile nam kontrolu nad integritetom aplikacije.

### Zajednička spoznaja o cijeni nekonzistentnosti
Ovaj period nam je svima bio lekcija o tome koliko je važan sklad u svakom detalju. Vidjeli smo u praksi kako odstupanja direktno otežavaju rad kolegama. Kroz trud uložen u ispravke, svi smo razumjeli da disciplina u razvoju nije suvišna teorija, već jedini način da jedni drugima ne otežavamo posao.

---

## Šta nije išlo dobro

### Neuspjeh modela potpune decentralizacije
Pokušaj da svi članovi preuzmu razvojne taskove doveo je do usporavanja. Pojavili su se problemi pri pokretanju sistema, odstupanja u dizajnu i bojama, te neovlaštene izmjene u bazi podataka koje su narušavale logiku cijelog modela.

### Dvostruki teret za mentore i iskusnije članove
Umjesto pomoći, mentori su završili sa dvostruko većim obimom posla. Veliki dio vremena trošio se na "gašenje požara" i sanaciju štete, čime je mentorski rad prestao biti podrška razvoju i postao ispravljanje osnovnih grešaka.

### Gubitak fokusa na nove funkcionalnosti
Značajna energija je utrošena na popravljanje već implementiranih dijelova. Umjesto da gradimo nove segmente, proveli smo sprint učvršćujući temelje koje je neusklađen rad slučajno potkopao.

---

## Šta treba promijeniti

### Povratak na provjereni developerski model
Decentralizacija u ovoj fazi nije efikasna. Vraćamo se modelu užeg razvojnog tima i prvobitnoj raspodjeli uloga. Cilj je očuvanje kvaliteta i zaštita projekta od tehničkog duga.

### Potpuna centralizacija arhitektonskih odluka i ownership-a
Uloge vlasnika modula su ponovo fiksne. Svaka promjena nad bazom, frontend standardima ili API-jem mora proći kroz filter odgovornih osoba.

---

## Koje konkretne akcije tim uvodi u narednom sprintu

### Zadržavanje "Stop-Gate" provjera
Tehnička disciplina uvedena tokom sprinta postaje standard (rad isključivo u granama, obavezan Code Review za svaki PR, zabrana direktnog merganja).

### Repozicioniranje tima za testiranje
Članovi tima se vraćaju fokusiranom testiranju aplikacije, dokumentovanju procesa i analizi korisničkih scenarija. Dragocjeno iskustvo koje su stekli pokušavajući direktno pisati kod sada im daje potpuno novu perspektivu, oni više ne testiraju samo površno, već s mnogo boljim razumijevanjem logike sistema mogu predvidjeti gdje bi on mogao "puknuti". Njihova uloga je sada ključna da kroz intenzivno testiranje osiguraju da svaka nova funkcionalnost radi besprijekorno u stvarnim situacijama, čime postaju zaštitni sloj koji garantuje stabilnost našeg rada.

### Ownership nad bazičnim izmjenama
Sve promjene nad modelom baze ili API strukturama odobrava isključivo Solution Architect prije same implementacije, čime se nekonzistentnost sprečava u korijenu.

### Fokus na dispečerski dashboard
Ulazimo u naredni sprint s ciljem da "ispeglamo" sistem uz beskompromisno poštovanje dizajna, kako bismo vratili osjećaj profesionalnog i utegnutog operativnog alata.
