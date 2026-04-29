# TEST DATA - Sprint 5 (Auth, Sesija, Pristup)

Ovaj dokument definiše minimalne podatke i konvencije evidentiranja koje QA tim koristi za `SB-05-12` i `SB-05-13`.

## 1) Pre-test checklist

- Okruženje dostupno (URL aplikacije i API-ja).
- Supabase projekat aktivan i auth konfiguracija učitana.
- Poznat `build_verzija` (commit hash ili release tag).
- QA ima pristup test mail inboxu (ili mock inboxu) ako je potreban email flow.
- Browser cache/cookies očišćeni prije prvog run-a.
- Folderi `evidence/SB-05-12/` i `evidence/SB-05-13/` spremni za dokaze.

## 2) Obavezni test nalozi

- `admin@nrs.local` / `Admin123!Strong` -> `administrator`
- `dispecer@nrs.local` / `Dispecer123!Strong` -> `dispecer`
- `serviser@nrs.local` / `Serviser123!Strong` -> `serviser`
- `test@gmail.com` / `123456789Aa@` -> `korisnik_usluge`

## 3) Standard konvencija (obavezno)

- Status testa: `Prošao`, `Nije prošao`, `Djelimično prošao`, `Nije testirano`.
- Prioritet greške: `Nizak`, `Srednji`, `Visok`, `Kritičan`.
- Status greške: `Otvorena`, `U obradi`, `Ispravljena`, `Zatvorena`.
- Svaki red sa statusom `Nije prošao` ili `Djelimično prošao` mora imati `ID_greske`.

## 4) Kako otvoriti zapis u BUG fajlu

- Otvori `SB-05-12/BUG_SB-05-12_AuthFlows.csv`.
- Dodaj novi red ispod headera (`B-01`, `B-02`, ...).
- U `EXEC`/`ACCESS`/`SEC` red upiši isti `ID_greske`.
- Red `PRIMJER_B-XX_NE_UNOSITI_U_REZULTATE` je samo primjer formata i briše se prije finalnog sign-offa.

## 5) Kako popuniti ACCESS i SEC

- `ACCESS` = matrica ko smije/ne smije pristupiti ruti.
- `SEC` = sigurnosni scenariji pokušaja zaobilaženja kontrole pristupa.
- Za svaki red popuniti: `Stvarno_ponasanje`, `Status`, `Dokaz_putanja`, `Napomena`.
- Ako red nije `Prošao`, obavezno otvoriti bug.

## 6) Kako popuniti AUTH FLOWS (TC + EXEC)

- `TC_SB-05-12_AuthFlows.csv` je dizajn testova (ne upisuje se izvršenje).
- `EXEC_SB-05-12_AuthFlows.csv` sadrži stvarne rezultate izvršenja.
- Izvršavati testove `TC-01` do `TC-15` redom i unositi stvarne rezultate + dokaz.
