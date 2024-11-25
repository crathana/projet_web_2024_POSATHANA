<?php

declare(strict_types=1);
session_start();

require_once 'flight/Flight.php';

// Initialisation de la base de données
$host = 'localhost'; 
$port = '5432'; 
$dbname = 'DB_Jeu'; 
$user = 'postgres'; 
$password = 'postgres'; 

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    die("Echec de la connexion à la base de données");
}

Flight::set('db', $conn);

Flight::route('/', function () {
    $conn = Flight::get('db');

    Flight::render('accueil');
    
  });

Flight::route('POST /map', function () {
    $conn = Flight::get('db');
    
    if (!empty($_POST['username'])) {
        $user = htmlspecialchars($_POST['username']); 
        
        $query = "INSERT INTO joueurs (nom_joueur, temps) VALUES ('$user', '23:59:59')";
        $result = pg_query($conn, $query);

        if ($result) {
            $_SESSION['user'] = $user; 
            Flight::redirect('/map'); 
        } else {
            Flight::redirect('/'); 
        }
    } else {
        Flight::redirect('/'); 
    }
});

Flight::route('GET /map', function () {
    $user = null;

    if (isset($_SESSION['user'])) {
        $user = $_SESSION['user'];
    }

    if ($user) {
        Flight::render('map', ['user' => $user]);
    } else {
        Flight::redirect('/'); 
    }
});

Flight::route('GET /api/objets', function() {
    $conn = Flight::get('db');

    $query = "SELECT *,  ST_AsGeoJSON(coordonnees) AS geojson FROM objets";
    $request = pg_query($conn, $query);

    // Affiche si une erreur liée à la récupération des objets
    if (!$request){
        Flight::json(['error' => 'Echec lors de la recuperation des objets'], 500);
        return;
    }
    // Ajout des objets dans l'API
    $objets = [];
    while ($row = pg_fetch_assoc($request)){
        $row['geojson'] = json_decode($row['geojson']);
        $objets[]= $row;
    }
    Flight::json(['objets' => $objets]);
});

//Similaire au flight précédent mais fonctionnelle pour afficher les données de l'objet demandé
Flight::route('GET /api/objets/@id', function($id) {
    $conn = Flight::get('db');

    
    $query = "SELECT *, ST_AsGeoJSON(coordonnees) AS geojson FROM objets WHERE id = $1";
    $request = pg_query_params($conn, $query, array($id)); 

    if (!$request) {
        Flight::json(['error' => 'Echec lors de la recuperation de l\'objet'], 500);
        return;
    }

    $objet = pg_fetch_assoc($request);
    if ($objet) {
        $objet['geojson'] = json_decode($objet['geojson']);
        Flight::json(['objet' => $objet]); 
    } else {
        Flight::json(['error' => 'Objet non trouve'], 404); 
    }
});

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


Flight::route('GET /api/finish', function() {
    $conn = Flight::get('db');

    // Récupérer tous les joueurs avec leur temps classés par temps croissant
    $query = "SELECT nom_joueur, temps FROM joueurs ORDER BY temps";
    $result = pg_query($conn, $query);

    if (!$result) {
        Flight::json(['error' => 'Erreur lors de la récupération des joueurs'], 500);
        return;
    }

    // Préparer les résultats dans un tableau
    $players = [];
    while ($row = pg_fetch_assoc($result)) {
        $players[] = $row;
    }

    // Retourner les données au client
    Flight::json([
        'success' => true,
        'players' => $players
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

Flight::start();

?>