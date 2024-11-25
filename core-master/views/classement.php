<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hall of Fame</title>
    <link rel="stylesheet" href="assets/classement.css">
</head>
<body>

<div class="container">
    <h2>🏆 Classement 🏆</h2>

    <?php if ($justPlayed && $user): ?>
        <div class="message">
            <?php if ($playerRank): ?>
                <p>Votre meilleur temps: <?= htmlspecialchars($playerTime) ?> | Votre classement: <?= $playerRank ?><?= ($playerRank <= 10) ? '' : ' (hors du top 10)' ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <table>
        <thead>
            <tr>
                <th>Rang</th>
                <th>Nom d'utilisateur</th>
                <th>Temps</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($joueurs as $index => $joueur): ?>
                <tr class="<?= ($joueur['nom_joueur'] === $user) ? 'highlight' : '' ?>">
                    <td><?= $index + 1 ?></td>
                    <td><?= htmlspecialchars($joueur['nom_joueur']) ?></td>
                    <td><?= htmlspecialchars($joueur['temps']) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    <a href="/">Retour à l'accueil</a>
</div>

</body>
</html>