Flight::route('GET /classement', function () {
    $conn = Flight::get('db');
    $user = isset($_SESSION['user']) ? $_SESSION['user'] : null;

    // Supprimer les doublons de la base de données (je ne sais pas pourquoi il y en a mais en tout cas je les supprime)
    $deleteQuery = "DELETE FROM joueurs WHERE id NOT IN (SELECT MIN(id) FROM joueurs GROUP BY nom_joueur, temps)";
    pg_query($conn, $deleteQuery);

    // Récupérer les joueurs classés par score décroissant
    $query = "SELECT nom_joueur, temps FROM joueurs ORDER BY temps LIMIT 10";
    $result = pg_query($conn, $query);

    if (!$result) {
        die("Erreur lors de la récupération des joueurs");
    }

    // Récupérer tous les joueurs pour déterminer la position du joueur qui vient de jouer
    $allPlayersQuery = "SELECT nom_joueur, temps FROM joueurs ORDER BY temps";
    $allPlayersResult = pg_query($conn, $allPlayersQuery);
    $allPlayers = [];
    while ($row = pg_fetch_assoc($allPlayersResult)) {
        $allPlayers[] = $row;
    }

    // Chercher le temps et le rang du joueur qui vient de jouer
    $playerRank = null;
    $playerTime = null;
    foreach ($allPlayers as $index => $player) {
        if ($player['nom_joueur'] == $user) {
            $playerTime = $player['temps'];
            $playerRank = $index + 1; // Le rang commence à 1
            break;
        }
    }

    $joueurs = [];
    while ($row = pg_fetch_assoc($result)) {
        $joueurs[] = $row;
    }

    // Vérifier si un message doit être affiché
    $justPlayed = isset($_SESSION['just_played']) && $_SESSION['just_played'] === true;

    // Réinitialiser l'indicateur
    if ($justPlayed) {
        $_SESSION['just_played'] = false;
    }

    Flight::render('classement', [
        'joueurs' => $joueurs,
        'user' => $user,
        'playerRank' => $playerRank,
        'playerTime' => $playerTime,
        'justPlayed' => $justPlayed // Indique si on doit afficher le message
    ]);
});


Flight::route('POST /api/finish', function () {
    $conn = Flight::get('db');
    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'];
    $time = $data['time'];

    if (!$username || !$time) {
        Flight::json(['error' => 'Paramètres invalides'], 400);
        return;
    }

    // Vérifier si l'utilisateur existe déjà dans la base
    $query = "SELECT temps FROM joueurs WHERE nom_joueur = $1";
    $result = pg_query_params($conn, $query, [$username]);

    if ($result && pg_num_rows($result) > 0) {
        // L'utilisateur existe, vérifier si le nouveau temps est meilleur
        $row = pg_fetch_assoc($result);
        $currentBestTime = $row['temps'];

        if (strtotime($time) < strtotime($currentBestTime)) {
            // Mettre à jour le temps si le nouveau est meilleur
            $updateQuery = "UPDATE joueurs SET temps = $1 WHERE nom_joueur = $2";
            pg_query_params($conn, $updateQuery, [$time, $username]);

            /*if ($updateResult) {
                Flight::json(['success' => true, 'message' => 'Temps amélioré']);
            } else {
                Flight::json(['error' => 'Erreur lors de la mise à jour du temps'], 500);
            }
        } else {
            Flight::json(['success' => true, 'message' => 'Jeu terminé', 'existing_time' => $currentBestTime, 'submitted_time' => $time]);*/
        }
    } else {
        // Si l'utilisateur n'existe pas, enregistrer son temps
        $insertQuery = "INSERT INTO joueurs (nom_joueur, temps) VALUES ($1, $2)";
        pg_query_params($conn, $insertQuery, [$username, $time]);

        /*if ($insertResult) {
            Flight::json(['success' => true, 'message' => 'Temps enregistré']);
        } else {
            Flight::json(['error' => 'Erreur lors de l\'enregistrement du temps'], 500);
        }*/
    }

    $_SESSION['just_played'] = true;
    $_SESSION['user'] = $username;

    Flight::json(['success' => true]);
});
