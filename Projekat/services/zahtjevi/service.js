//Servis za rad sa zahtjevima

function getZahtjevi() {
  return [];
}

function createZahtjev(data) {
  return {
    message: "Zahtjev kreiran",
    data
  };
}

module.exports = { getZahtjevi, createZahtjev };
