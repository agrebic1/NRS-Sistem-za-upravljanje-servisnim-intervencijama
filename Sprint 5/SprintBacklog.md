# Sprint Goal

### **Sprint broj: 5** 

### **Sprint cilj:**  
Uspostaviti povezivanje sa Supabase platformom i omogućiti osnovni korisnički pristup kroz registraciju i prijavu, uz pripremu početne forme za unos zahtjeva.

### **Ključne stavke koje tim želi završiti:**  
- povezivanje aplikacije sa Supabase platformom  
- konfiguracija autentifikacije korisnika (Supabase auth)  
- definisanje korisnika, uloga i osnovnih permisija (US-04)  
- registraciona forma za korisnika usluge (US-01)  
- login forma i osnovna prijava korisnika (US-02)  
- osnova forme za prijavu zahtjeva (US-05 – UI dio)  
- definisanje modela zahtjeva i radnog naloga (podloga za US-05 i US-07)   

### **Rizici i zavisnosti:**  
- zavisnost od stabilnog povezivanja sa Supabase platformom (auth i baza podataka)  
- rizik nepravilne konfiguracije autentifikacije korisnika  
- zavisnost od jasno definisanih korisničkih uloga i permisija (RBAC)  
- zavisnost od prethodno postavljenog skeletona projekta  
- rizik širenja funkcionalnosti izvan planiranog opsega (scope creep)  
- zavisnost od pravilnog modela podataka za zahtjeve i radne naloge  

---

# Sprint Backlog

| ID | Naziv zadatka ili storyja | Odgovorna osoba ili osobe | Status | Napomena |
|----|---------------------------|---------------------------|--------|----------|
| US-01 | Registracija korisnika (forma + logika) | Frontend + Backend | To Do | Supabase auth |
| US-02 | Login korisnika | Frontend + Backend | To Do | Osnovna verzija |
| US-04 | Definisanje korisnika, uloga i permisija | Backend / DB | To Do | RBAC osnova |
| US-05 (UI) | Forma za prijavu zahtjeva | Frontend | To Do | UI bez logike |
| T5-01 | Povezivanje aplikacije sa Supabase | Backend | To Do | Auth + DB |
| T5-02 | Konfiguracija autentifikacije | Backend | To Do | Supabase setup |
| T5-03 | Definisanje modela zahtjeva i naloga | Backend | To Do | Podloga |
