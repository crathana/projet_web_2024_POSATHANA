<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page d'Accueil</title>
    <link rel="stylesheet" href="assets/accueil.css">
</head>
<body>

<div class="container">
    <h2>Bienvenue dans l'Escape Game</h2>
    <p>Veuillez entrer votre nom d'utilisateur pour commencer :</p>
    <form method="POST" action="/map">
    <input type="text" name="username" placeholder="Nom d'utilisateur" required>
    <button type="submit">Commencer</button>
    <a href="/classement">Classement</a>
</form>
</div>

</body>
</html>