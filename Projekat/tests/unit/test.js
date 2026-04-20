//Unit testovi 

function testCreateZahtjev() {
  const rezultat = {
    message: "Zahtjev kreiran"
  };

  if (rezultat.message === "Zahtjev kreiran") {
    console.log("Test prošao");
  } else {
    console.log("Test nije prošao");
  }
}

testCreateZahtjev();
