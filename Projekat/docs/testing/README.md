# Testing paket - Sprint 5

Ovaj folder sadrži kompletan QA paket za početak testiranja stavki `SB-05-12` i `SB-05-13`.

## Cilj testiranja

Potvrditi da autentifikacija, sesija i kontrola pristupa rade sigurno i stabilno:
- registracija, prijava, odjava
- upravljanje sesijom
- role-based redirect i zaštita ruta
- validacija pristupa po ulozi

## Šta QA radi redom

1. U `SB-05-12/TC...csv` pročita test slučajeve i pripremi podatke.
   Početni podaci i preduvjeti su u `TEST_DATA_SB-05_Common.md`.
2. Svaki pokrenuti test upiše u `SB-05-12/EXEC...csv`.
3. Svaki fail ili partial upise u `SB-05-12/BUG...csv`.
4. Za role/access validaciju popuni `SB-05-13/ACCESS...csv` i `SB-05-13/SEC...csv`.
5. Kada su kriteriji ispunjeni, popuni i potpiše `SB-05-13/SIGNOFF...md`.
6. Dokaze (slike/video/log) čuva u `evidence/SB-05-12/` ili `evidence/SB-05-13/`.

## Pravila evidencije

- Ovaj paket je očišćen od dummy rezultata; unositi samo stvarne rezultate.
- Dozvoljeni statusi testa: `Prošao`, `Nije prošao`, `Djelimično prošao`, `Nije testirano`.
- Prioritet greške: `Nizak`, `Srednji`, `Visok`, `Kritičan`.
- Status greške: `Otvorena`, `U obradi`, `Ispravljena`, `Zatvorena`.
- Svaki `Nije prošao` ili `Djelimično prošao` mora imati `ID_greske`.
- Sprint se smatra QA spremnim tek kada su obavezni testovi prošli i sign-off završen.
