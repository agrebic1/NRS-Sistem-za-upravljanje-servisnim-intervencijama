# Definition of Done


Definition of Done je definisan kroz tri nivoa završetka: tehnički završeno (task nivo), funkcionalno završeno (user story nivo) i spremno za isporuku (release nivo). Ova podjela osigurava jasnu razliku između implementacije, funkcionalne ispravnosti i spremnosti za demonstraciju.

---

## Tehnički završeno (task nivo)

Task se smatra tehnički završenim kada:

- je funkcionalnost implementirana ili dokumentovana u skladu sa dogovorenim opsegom  
- je funkcionalnost pravilno povezana sa relevantnim dijelovima sistema  
- su ispoštovana pravila autentifikacije, autorizacije i RBAC pristupa gdje je primjenjivo  
- su podaci pravilno obrađeni (kreiranje, izmjena, brisanje i prikaz) u skladu sa poslovnim pravilima  
- je kod pregledan unutar tima i usklađen sa dogovorenom arhitekturom i organizacijom projekta  
- kod je stabilan i ne sadrži blokirajuće greške koje sprečavaju dalju integraciju  

---

## Funkcionalno završeno (user story nivo)

User story se smatra funkcionalno završenim kada:

- su ispunjeni svi definisani acceptance kriteriji  
- su implementirani osnovni ispravni i neispravni scenariji unosa i korištenja  
- funkcionalnost funkcioniše ispravno kroz cjelovit tok od početka do kraja  
- je korisnički interfejs jasan, razumljiv i usklađen sa namjenom funkcionalnosti  
- je implementirana odgovarajuća validacija unosa i obrada grešaka  
- je funkcionalnost testirana kroz osnovne pozitivne i negativne testne slučajeve  
- funkcionalnost ne narušava postojeće dijelove sistema  

---

## Spremno za isporuku (release nivo)

User story se smatra spremnom za isporuku kada:

- su svi pripadajući taskovi završeni i integrisani u jedinstvenu funkcionalnu cjelinu  
- je funkcionalnost uspješno integrisana u glavnu razvojnu granu kroz dogovoreni merge/pull request proces  
- sistem se uspješno builda i pokreće bez grešaka  
- nema poznatih kritičnih ili blokirajućih bugova povezanih sa tom funkcionalnošću  
- je dokumentacija ažurirana ukoliko funkcionalnost utiče na API, bazu, poslovna pravila ili korisnički tok  
- su promjene jasno evidentirane kroz commit poruke i repozitorij  
- je funkcionalnost spremna za demonstraciju na sprint review sastanku  
