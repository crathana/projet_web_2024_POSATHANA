<?php

declare(strict_types=1);
session_start();
$link = mysqli_connect('u2.ensg.eu', 'geo', '', 'geobase');


require_once 'flight/Flight.php';
// require 'flight/autoload.php';

Flight::set('geobase', $link);

Flight::route('/', function () {
    Flight::render('newapp');
});

Flight::route('/today', function () {
    date_default_timezone_set('Europe/Paris');
    $moisFr = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    $jourToday = date('d');
    $moisToday = date('m');
    $moisTodayFr = $moisFr[$moisToday-1];
    $anneeToday = date('Y');
    $dateJour = $jourToday ." ". $moisTodayFr." ".$anneeToday;
    Flight::render('today', ['dateJour' => $dateJour]);
});

Flight::route('GET /login', function() {
    $user=null;
    if (isset($_SESSION['user'])){
        $user = $_SESSION['user'];
    }

    Flight::render('login', ['user' => $user]);
});

Flight::route('POST /login', function () {
    $user= $_POST['user'];
    $_SESSION['user']= $user;
    Flight::render('login', ['user' => $user]);
});

Flight::route('GET /logout', function() {
    $user=null;
    $_SESSION['user']=[];
    Flight::render('newapp', ['user' => $user]);
});

Flight::route('GET /departements', function() {
    $geo = Flight::get('geobase');
    if (isset($_GET['region'])){
        $regchoisi = $_GET['region'];
        $dep = mysqli_query($geo, "SELECT insee, nom FROM departements WHERE region_insee=$regchoisi");
    }
    else {
        $dep = mysqli_query($geo, "SELECT insee, nom FROM departements");
    }
    $reg = mysqli_query($geo, "SELECT insee, nom FROM regions");
    Flight::render('departements', ['dep' => $dep, 'reg' => $reg]);
});

Flight::start();

?>