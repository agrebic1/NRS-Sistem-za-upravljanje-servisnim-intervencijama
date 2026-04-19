# Initial Release Plan

## Planirani inkrementi / release cjeline

Ovaj initial release plan izrađen je na osnovu product backloga, user storyja, procijenjene složenosti funkcionalnosti, raspoloživog kapaciteta tima i realnog trajanja sprintova. Pri planiranju su uzeti u obzir kratko trajanje sprintova, neujednačen broj raspoloživih radnih dana, ograničeno iskustvo tima, kao i povećan organizacijski rizik u pojedinim sprintovima. Zbog toga release cjeline nisu planirane prečesto, nego su grupisane u veće i smislenije inkremente koji ostavljaju dovoljno prostora za implementaciju, integraciju, testiranje i doradu.

## Sažeti pregled release plana

| Inkrement | Fokus | Sprintovi | Release tačka |
|---|---|---|---|
| **Inkrement 1** | osnovni korisnički i dispečerski tok | 5-8 | kraj Sprinta 8 |
| **Inkrement 2** | izvršenje intervencije, zatvaranje i administrativna kontrola | 9-10 | kraj Sprinta 10 |

---

## Inkrement 1 - Osnovni korisnički i dispečerski tok

| Element | Opis |
|---|---|
| **Cilj inkrementa** | Uspostaviti prvi stabilan i upotrebljiv dio sistema koji omogućava pristup sistemu, prijavu zahtjeva za servisnu intervenciju, pregled vlastitih zahtjeva i njihovu početnu obradu od strane dispečera. Ovaj inkrement treba predstavljati prvu zaokruženu funkcionalnu cjelinu sistema koja korisniku i dispečeru daje stvarnu operativnu vrijednost. |
| **Glavne funkcionalnosti** | **Tehnička osnova i pristup sistemu**<br>- tehnički setup projekta i osnovni skeleton sistema<br>- osnovni model baze podataka<br>- registracija, prijava i odjava korisnika<br>- osnovna prava pristupa prema korisničkim ulogama<br><br>**Upravljanje zahtjevima korisnika**<br>- prijava zahtjeva za servisnu intervenciju<br>- pregled vlastitih zahtjeva i njihovih statusa<br>- izmjena vlastitog zahtjeva kada je to dozvoljeno<br>- otkazivanje vlastitog zahtjeva kada je to dozvoljeno<br><br>**Početna dispečerska obrada**<br>- pregled otvorenih i aktivnih intervencija od strane dispečera<br>- pregled detalja pojedinačne intervencije<br>- pregled statusa intervencije<br>- određivanje prioriteta intervencije<br>- planiranje termina intervencije |
| **Zavisnosti** | - uspješno postavljen osnovni skeleton projekta<br>- definisan i implementiran osnovni model baze podataka<br>- funkcionalna autentifikacija i upravljanje sesijom<br>- definisane korisničke uloge i osnovna prava pristupa<br>- usklađenost implementacije sa definisanom arhitekturom sistema |
| **Glavni rizici** | - kašnjenje u postavljanju tehničke osnove i modela baze<br>- problemi u autentifikaciji, upravljanju sesijom i pravima pristupa<br>- smanjen kapacitet tima u ranim sprintovima<br>- povećan organizacijski rizik u Sprintu 7<br>- potcjenjivanje složenosti logike statusa, prioriteta i dozvoljenih izmjena zahtjeva |
| **Okvirni sprintovi realizacije** | **Sprint 5-8**<br>**Planirana release tačka:** kraj Sprinta 8 |

> **Napomena:**
> Prvi inkrement obuhvata sprintove 5-8 jer se tek na kraju tog perioda formira dovoljno zaokružena i upotrebljiva funkcionalna cjelina. Ranije pravljenje release-a ne bi bilo smisleno, jer bi obuhvatalo samo djelimično implementirane i međusobno nedovoljno povezane funkcionalnosti, bez potpunog poslovnog toka koji bi sistemu davao stvarnu operativnu vrijednost.

## Kontrolna tabela pokrivenosti - Inkrement 1

| PBI | Naziv funkcionalnosti | User Story |
|---|---|---|
| PBI-001 | Registracija, prijava i odjava korisnika | US-01 Samostalna registracija korisnika usluge |
| PBI-001 | Registracija, prijava i odjava korisnika | US-02 Prijava korisnika u sistem |
| PBI-001 | Registracija, prijava i odjava korisnika | US-03 Odjava korisnika iz sistema |
| PBI-002 | Kontrola pristupa prema korisničkoj ulozi (RBAC) | US-04 Kontrola pristupa prema korisničkoj ulozi |
| PBI-004 | Kreiranje zahtjeva za servisnu intervenciju | US-05 Prijava zahtjeva za servisnu intervenciju |
| PBI-005 | Pregled detalja vlastitog zahtjeva | US-06 Pregled vlastitog zahtjeva |
| PBI-006 | Izmjena i otkazivanje vlastitog zahtjeva | US-26 Izmjena vlastitog zahtjeva |
| PBI-006 | Izmjena i otkazivanje vlastitog zahtjeva | US-27 Otkazivanje vlastitog zahtjeva |
| PBI-007 | Pregled liste aktivnih i otvorenih intervencija | US-07 Pregled otvorenih intervencija |
| PBI-007 | Pregled liste aktivnih i otvorenih intervencija | US-13 Pregled statusa intervencija od strane dispečera |
| PBI-008 | Pregled detalja pojedinačne intervencije za dispečera | US-08 Pregled detalja pojedinačne intervencije |
| PBI-010 | Određivanje prioriteta intervencije | US-12 Određivanje prioriteta intervencije |
| PBI-011 | Planiranje izlazaka na teren | US-11 Planiranje intervencije |

---
