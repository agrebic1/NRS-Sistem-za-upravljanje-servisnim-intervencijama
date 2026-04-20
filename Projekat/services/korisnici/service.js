//Servis za korisnike

function getKorisnici() {
  return [];
}

function updateKorisnik(id, data) {
  return {
    id,
    data,
    message: "Korisnik ažuriran"
  };
}

module.exports = { getKorisnici, updateKorisnik };
