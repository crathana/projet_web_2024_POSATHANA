// Fonction appelée lors de la soumission du formulaire, lorsqu'on rentre notre pseudo sur la page d'accueil
function submitForm() {
  var username = document.getElementById("username").value;

  if (username !== "") {
    document.getElementById("loginForm").submit();
  } 
}

document.getElementById("username").addEventListener("input", toggleButton);

// Fonction pour activer ou désactiver le bouton de connexion en fonction de la valeur du champ "username"
function toggleButton() {
  var username = document.getElementById("username").value;
  var loginButton = document.getElementById("loginButton");

  if (username !== "") {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}