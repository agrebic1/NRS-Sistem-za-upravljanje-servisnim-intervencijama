-- 1. ŠIFRARNICI I POMOĆNE TABELE
CREATE TABLE uloga (
    id_uloge SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    opis VARCHAR(255)
);

CREATE TABLE status (
    id_statusa SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    opis VARCHAR(255),
    tip_statusa VARCHAR(50) -- npr. 'zahtjev', 'intervencija', 'dodjela'
);

CREATE TABLE prioritet (
    id_prioriteta SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    opis VARCHAR(255)
);

CREATE TABLE kategorija_kvara (
    id_kategorije_kvara SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL
);

CREATE TABLE lokacija (
    id_lokacije SERIAL PRIMARY KEY,
    adresa VARCHAR(255) NOT NULL,
    grad VARCHAR(255) NOT NULL,
    opcina VARCHAR(255) NOT NULL,
    opis TEXT
);

-- 2. KORISNICI I UPOSLENICI (Povezani sa Supabase Auth sistemom)
CREATE TABLE uposlenici (
    id_uposlenika UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    id_uloge INTEGER REFERENCES uloga(id_uloge),
    ime VARCHAR(255) NOT NULL,
    prezime VARCHAR(255) NOT NULL,
    jmbg VARCHAR(13),
    broj_telefona VARCHAR(50),
    email VARCHAR(255),
    adresa VARCHAR(255),
    lozinka_hash VARCHAR(255)
);

CREATE TABLE korisnik_usluge (
    id_korisnika_usluge UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    id_uloge INTEGER REFERENCES uloga(id_uloge),
    ime VARCHAR(255) NOT NULL,
    prezime VARCHAR(255) NOT NULL,
    broj_telefona VARCHAR(50),
    email VARCHAR(255),
    adresa VARCHAR(255),
    lozinka_hash VARCHAR(255)
);

-- 3. ZAHTJEV I INTERVENCIJA
CREATE TABLE zahtjev (
    id_zahtjeva SERIAL PRIMARY KEY,
    id_statusa INTEGER REFERENCES status(id_statusa),
    id_kategorije_kvara INTEGER REFERENCES kategorija_kvara(id_kategorije_kvara),
    id_korisnika_usluge UUID REFERENCES korisnik_usluge(id_korisnika_usluge),
    id_lokacije INTEGER REFERENCES lokacija(id_lokacije),
    adresa VARCHAR(255),
    opis_kvara TEXT,
    datum DATE DEFAULT CURRENT_DATE,
    vrijeme TIME DEFAULT CURRENT_TIME,
    je_otkazan BOOLEAN DEFAULT FALSE,
    razlog_otkazivanja TEXT
);

CREATE TABLE intervencija (
    id_intervencije SERIAL PRIMARY KEY,
    id_prioriteta INTEGER REFERENCES prioritet(id_prioriteta),
    id_dispecera UUID REFERENCES uposlenici(id_uposlenika),
    id_zahtjeva INTEGER REFERENCES zahtjev(id_zahtjeva),
    id_statusa INTEGER REFERENCES status(id_statusa),
    planirani_datum DATE,
    datum_izvrsavanja DATE,
    vrijeme_izvrsavanja TIME,
    datum_kreiranja DATE DEFAULT CURRENT_DATE
);

-- 4. OPERATIVNE TABELE (DODJELA, EVIDENCIJA, NAPOMENE)
CREATE TABLE dodjela (
    id_dodjela SERIAL PRIMARY KEY,
    id_pomocnog_servisera UUID REFERENCES uposlenici(id_uposlenika),
    id_intervencije INTEGER REFERENCES intervencija(id_intervencije),
    id_servisera UUID REFERENCES uposlenici(id_uposlenika),
    id_dispecera UUID REFERENCES uposlenici(id_uposlenika),
    id_statusa INTEGER REFERENCES status(id_statusa),
    datum_dodjele DATE DEFAULT CURRENT_DATE,
    datum_odgovora DATE,
    razlog_odbijanja TEXT
);

CREATE TABLE evidencija_rada (
    id_evidencije SERIAL PRIMARY KEY,
    id_intervencije INTEGER REFERENCES intervencija(id_intervencije),
    id_servisera UUID REFERENCES uposlenici(id_uposlenika),
    datum_pocetka DATE,
    datum_zavrsetka DATE,
    vrijeme_pocetka TIME,
    vrijeme_zavrsetka TIME,
    utroseno_vrijeme TIME,
    utroseni_materijal TEXT,
    opis TEXT,
    ishod_rada BOOLEAN
);

CREATE TABLE napomene (
    id_napomene SERIAL PRIMARY KEY,
    id_intervencije INTEGER REFERENCES intervencija(id_intervencije),
    id_autora UUID REFERENCES uposlenici(id_uposlenika), -- Autor može biti uposlenik (dispečer/serviser)
    tekst TEXT NOT NULL,
    datum DATE DEFAULT CURRENT_DATE,
    vrijeme TIME DEFAULT CURRENT_TIME,
    tip_napomene VARCHAR(50)
);

CREATE TABLE historija_aktivnosti (
    id_historije_aktivnosti SERIAL PRIMARY KEY,
    id_intervencije INTEGER REFERENCES intervencija(id_intervencije),
    id_autora UUID NOT NULL, -- UUID autora promjene
    akcija VARCHAR(255),
    stara_vrijednost TEXT,
    nova_vrijednost TEXT,
    datum_promjene DATE DEFAULT CURRENT_DATE,
    vrijeme_promjene TIME DEFAULT CURRENT_TIME
);