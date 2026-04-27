

const Korisnik = {
  id: null,
  ime: "",
  email: "",
  uloga: "" // admin, dispecer, serviser, korisnik
};

const Zahtjev = {
  id: null,
  opis: "",
  status: "",
  korisnikId: null
};

const Intervencija = {
  id: null,
  status: "",
  prioritet: "",
  dodijeljeniServiser: null
};

module.exports = { Korisnik, Zahtjev, Intervencija };
