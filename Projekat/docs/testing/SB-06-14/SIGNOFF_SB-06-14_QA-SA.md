# SB-06-14 QA + SA Sign-off

## Opšti podaci

- Stavka: `SB-06-14`
- Naziv: Prijava servisnog zahtjeva, korisnički i dispečerski pregled (US-05 / US-06 / US-07)
- Datum validacije: _(popuniti)_
- Okruženje: _(npr. staging / production)_


## Rezime rezultata

- Ukupan broj scenarija: 125 (`TC_SB-06-14_ServiceRequests.csv`)
- Prošlo: _(broj)_
- Nije prošlo: _(broj)_
- Djelimično prošlo: _(broj)_
- Nije testirano: _(broj)_


## Odluka

- [ ] Approved
- [ ] Approved with conditions
- [ ] Rejected


## Kriteriji za Approved

- Svi obavezni testovi (`Obavezno_za_signoff = DA`) iz `TC_SB-06-14_ServiceRequests.csv` imaju status **Prošao** u `EXEC_SB-06-14_ServiceRequests.csv`.
- Integracioni testovi **TC-95–TC-101** (end-to-end i konzistentnost između korisnika i dispečera) moraju proći prije sign-offa.
- Sigurnosni testovi **TC-102–TC-107** i **TC-69** nemaju otvorenih propusta **Kritičan** / **Visok**.
- Nema dupliranja regresije na auth matricu iz SB-05: u slučaju konflikta, SB-05 ostaje izvor istine za generičku zaštitu ruta; SB-06 dodaje **kontekst zahtjeva** (podaci, API, izolacija po korisniku).
- Dokazi (screenshot / video / log) su u `docs/testing/evidence/SB-06-14/`.


## Potvrda

- QA ime i prezime: _(ime)_
- QA potpis: _(potpis)_
- Datum: _(datum)_
