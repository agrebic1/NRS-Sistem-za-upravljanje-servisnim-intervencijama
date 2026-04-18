Template:
Za svaki inkrement navesti: - naziv inkrementa - cilj inkrementa - glavne funkcionalnosti -
zavisnosti - glavni rizici - okvirni sprintovi u kojima se očekuje realizacija

Idejni prijedlozi release cjelina (dvije moguće varijante):

# Varijanta 1
# Initial Release Plan

## Planirani inkrementi / release cjeline

Initial release plan izrađen je na osnovu product backloga, user storyja, procijenjene složenosti funkcionalnosti, realnog kapaciteta tima i trajanja sprintova. Pri planiranju je uzeto u obzir da svi sprintovi nemaju jednak broj radnih dana, da je kapacitet tima neujednačen i da release cjeline moraju biti i smislene i ostvarive u okviru raspoloživog vremena.

---

## Inkrement 1 — Osnovni korisnički tok i evidentiranje zahtjeva

### Cilj inkrementa

Cilj prvog inkrementa je uspostaviti osnovni korisnički tok sistema, odnosno omogućiti korisniku pristup sistemu, prijavu zahtjeva za servisnu intervenciju i pregled vlastitih zahtjeva. Ovaj inkrement predstavlja prvi funkcionalni sloj sistema i osnovu za dalju operativnu obradu.

### Glavne funkcionalnosti

- tehnički setup projekta i osnovni skeleton sistema
- osnovni model baze podataka
- registracija, prijava i odjava korisnika
- osnovna prava pristupa prema korisničkim ulogama
- prijava zahtjeva za servisnu intervenciju
- pregled vlastitih zahtjeva i statusa
- izmjena zahtjeva kada je to dozvoljeno
- otkazivanje zahtjeva kada je to dozvoljeno

### Glavni rizici

- kašnjenje u tehničkoj osnovi sistema
- problemi u implementaciji autentifikacije i sesija
- nedovoljna stabilnost početnih modela podataka
- smanjen broj radnih dana u ranijim sprintovima

### Okvirni sprintovi realizacije

**Sprint 5–7**  
**Planirana release tačka:** kraj Sprinta 7 ili početak Sprinta 8

---

## Inkrement 2 — Dispečerska obrada i operativna dodjela

### Cilj inkrementa

Cilj drugog inkrementa je omogućiti dispečersku obradu zahtjeva i prelazak iz korisničkog toka u stvarni operativni tok rada. Ovaj inkrement treba omogućiti pregled intervencija, određivanje prioriteta, planiranje i dodjelu zadataka serviserima.

### Glavne funkcionalnosti

- pregled otvorenih i aktivnih intervencija od strane dispečera
- pregled detalja intervencije
- pregled statusa intervencije
- određivanje prioriteta intervencije
- planiranje termina intervencije
- dodjela intervencije glavnom izvršiocu
- dodjela intervencije timu servisera
- pregled dodijeljenih intervencija od strane servisera
- pregled detalja zadatka na terenu
- prihvatanje zadatka
- odbijanje zadatka
- promjena izvršioca intervencije
- vraćanje zadatka na ponovnu dodjelu

### Glavni rizici

- visoka složenost logike dodjele i preraspodjele
- problemi sa statusnim prelazima
- prenatrpanost sprintova srednje faze razvoja
- povećan broj alternativnih scenarija i edge-case situacija

### Okvirni sprintovi realizacije

**Sprint 8–9**  
**Planirana release tačka:** kraj Sprinta 9

---

## Inkrement 3 — Izvršenje, zatvaranje i administrativno zaokruživanje

### Cilj inkrementa

Cilj trećeg inkrementa je završiti puni poslovni tok sistema kroz izvršenje rada na terenu, evidentiranje rezultata, zatvaranje intervencije i uspostavljanje osnovnih administrativnih i nadzornih funkcionalnosti.

### Glavne funkcionalnosti

- ažuriranje statusa intervencije
- evidentiranje izvršenog rada
- pregled evidentiranog rada od strane dispečera
- potvrda i zatvaranje intervencije
- razmjena napomena
- pregled historije aktivnosti
- pregled korisničkih naloga
- promjena korisničke uloge
- deaktivacija korisničkog naloga
- pregled operativnog statusa na kontrolnoj tabli

### Glavni rizici

- regresije ranije implementiranih funkcionalnosti
- greške u evidenciji rada i zatvaranju intervencije
- nekonzistentna historija aktivnosti
- problemi u administratorskim akcijama nad korisnicima
- nedovoljno vremena za stabilizaciju ako se sprint prenatrpa

### Okvirni sprintovi realizacije

**Sprint 10**  
**Planirana release tačka:** kraj Sprinta 10

---

## Završna stabilizacija

Sprint 11 nije planiran kao poseban inkrement, nego kao završni sprint za:
- ispravke grešaka
- regresijsko testiranje
- integraciono i sistemsko testiranje
- doradu funkcionalnosti i interfejsa
- dopunu dokumentacije
- pripremu za demonstraciju i predaju

# Varijanta 2
# Initial Release Plan

## Planirani inkrementi / release cjeline

Ovaj initial release plan izrađen je na osnovu product backloga, user storyja, procijenjene složenosti funkcionalnosti, raspoloživog kapaciteta tima i realnog trajanja sprintova. Pri planiranju je uzeto u obzir da sprintovi traju kratko, da pojedini sprintovi imaju smanjen broj radnih dana i da tim raspolaže ograničenim iskustvom, zbog čega release cjeline moraju biti dovoljno velike da budu smislene, ali i dovoljno realne da se mogu kvalitetno završiti.

---

## Inkrement 1 — Osnovni korisnički i dispečerski tok

### Cilj inkrementa

Cilj prvog inkrementa je uspostaviti osnovni i stabilan tok sistema koji omogućava pristup sistemu, prijavu zahtjeva za servisnu intervenciju i početnu obradu zahtjeva od strane dispečera. Ovaj inkrement treba predstavljati prvi upotrebljiv dio sistema koji korisniku i dispečeru daje stvarnu vrijednost.

### Glavne funkcionalnosti

- tehnički setup projekta i osnovni skeleton sistema
- osnovni model baze podataka
- registracija, prijava i odjava korisnika
- osnovna prava pristupa prema korisničkim ulogama
- prijava zahtjeva za servisnu intervenciju
- pregled vlastitih zahtjeva i statusa
- pregled otvorenih i aktivnih intervencija od strane dispečera
- pregled detalja intervencije
- pregled statusa intervencije
- određivanje prioriteta intervencije
- planiranje termina intervencije
- izmjena zahtjeva kada je to dozvoljeno
- otkazivanje zahtjeva kada je to dozvoljeno

### Glavni rizici

- kašnjenje u postavljanju tehničke osnove i modela baze
- problemi u autentifikaciji i pravima pristupa
- smanjen kapacitet tima u ranim sprintovima
- prenatrpanost sprintova 6 i 7
- potcjenjivanje složenosti logike statusa, prioriteta i dozvoljenih izmjena

### Okvirni sprintovi realizacije

**Sprint 5–8**  
**Planirana release tačka:** kraj Sprinta 8

---

## Inkrement 2 — Operativno izvršenje, zatvaranje i administrativno zaokruživanje

### Cilj inkrementa

Cilj drugog inkrementa je zaokružiti sistem kroz funkcionalnosti koje omogućavaju stvarnu operativnu realizaciju intervencije, saradnju između dispečera i servisera, evidentiranje rada, zatvaranje procesa i osnovnu administrativnu kontrolu nad korisnicima i aktivnostima sistema.

### Glavne funkcionalnosti

- dodjela intervencije glavnom izvršiocu
- dodjela intervencije timu servisera
- pregled dodijeljenih intervencija od strane servisera
- pregled detalja zadatka na terenu
- prihvatanje zadatka
- odbijanje zadatka
- promjena izvršioca intervencije
- vraćanje zadatka na ponovnu dodjelu
- ažuriranje statusa intervencije
- evidentiranje izvršenog rada
- pregled evidentiranog rada
- potvrda i zatvaranje intervencije
- razmjena napomena
- pregled historije aktivnosti
- pregled korisničkih naloga
- promjena korisničke uloge
- deaktivacija korisničkog naloga
- pregled operativnog statusa na kontrolnoj tabli

### Glavni rizici

- visoka složenost alternativnih tokova
- regresije ranije implementiranih funkcionalnosti
- problemi pri dodjeli, odbijanju i preraspodjeli zadataka
- greške u evidenciji rada i zatvaranju intervencije
- nekonzistentna historija aktivnosti
- prenatrpanost sprintova 9 i 10

### Okvirni sprintovi realizacije

**Sprint 9–10**  
**Planirana release tačka:** kraj Sprinta 10

---

## Završna stabilizacija

Sprint 11 nije planiran kao poseban inkrement, nego kao završni sprint za:
- ispravke grešaka
- regresijsko testiranje
- integraciono i sistemsko testiranje
- doradu postojećih funkcionalnosti
- dopunu dokumentacije
- pripremu za demonstraciju i predaju
