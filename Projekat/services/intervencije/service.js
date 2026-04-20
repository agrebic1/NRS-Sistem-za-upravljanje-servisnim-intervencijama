//Servis za upravljanje intervencijama

function getIntervencije() {
  return [];
}

function updateStatus(id, status) {
  return {
    id,
    status,
    message: "Status ažuriran"
  };
}

module.exports = { getIntervencije, updateStatus };
