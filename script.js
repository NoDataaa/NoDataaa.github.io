function checkPIN() {
  const pin = document.getElementById("pin-input").value;
  const correctPIN = "2026";

  if (pin === correctPIN) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("homepage").style.display = "block";
  } else {
    document.getElementById("error-message").innerText = "Incorrect PIN. Try again.";
  }
}
