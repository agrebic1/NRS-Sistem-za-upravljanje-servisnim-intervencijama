# AI Usage Log

| Polje | Opis |
|-------|------|
| Datum | 28.04.2026|
| Sprint broj | |
| Alat koji je korišten | |
| Svrha korištenja | |
| Kratak opis zadatka ili upita | |
| Šta je AI predložio ili generisao | |
| Šta je tim prihvatio | |
| Šta je tim izmijenio | |
| Šta je tim odbacio | |
| Rizici, problemi ili greške koje su uočene | |
| Ko je koristio alat | |


| Polje | Opis |
|------|------|
| Datum | 28.04.2026 |
| Sprint broj | Sprint 5 |
| Alat koji je korišten | ChatGPT |
| Svrha korištenja | Poboljšanje sigurnosti aplikacije, implementacija autorizacije i RLS politika, te refaktorisanje middleware logike |
| Kratak opis zadatka ili upita | Ispravljanje greške `500 MIDDLEWARE_INVOCATION_FAILED`, unapređenje autorizacije (prebacivanje na DB logiku), uvođenje RLS politika i role-based pristupa, te validacija korisničkih uloga kroz sistem |
| Šta je AI predložio ili generisao | Predložio hardening middleware-a (try/catch + fallback), korištenje `is_admin` iz baze umjesto `user_metadata`, strukturu RLS politika, helper funkcije za role (`is_admin`, `is_dispecer`, itd.), te organizaciju authorization flow-a |
| Šta je tim prihvatio | Middleware hardening, DB-based autorizaciju, RLS migracije, helper funkcije i jedinstveni authorization flow za admin rute |
| Šta je tim izmijenio | Prilagodio RLS politike konkretnim tabelama i poslovnoj logici (zahtjev, intervencija, evidencije itd.), te optimizirao role mapiranje i test naloge |
| Šta je tim odbacio | Oslanjanje na `user_metadata` za autorizaciju (zbog sigurnosnih rizika) |
| Rizici, problemi ili greške koje su uočene | Početna 500 greška u middleware-u, potencijalne sigurnosne ranjivosti pri oslanjanju na client-side metadata, potreba za pažljivim definisanjem RLS politika da ne blokiraju validne upite |
| Ko je koristio alat | Ajla Ćesir |
