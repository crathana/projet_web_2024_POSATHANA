<?php

declare(strict_types=1);
session_start();

require_once 'flight/Flight.php';

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
        $user = htmlspecialchars($_POST['username']); // Protège contre les injections XSS

        $query = "INSERT INTO joueurs (nom_joueur, score) VALUES ('$user', 0)";
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

    if (!$request){
        Flight::json(['error' => 'Echec lors de la recuperation des objets'], 500);
        return;
    }

    $objets = [];
    while ($row = pg_fetch_assoc($request)){
        $row['geojson'] = json_decode($row['geojson']);
        $objets[]= $row;
    }
    Flight::json(['objets' => $objets]);
});

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

Flight::start();

?>