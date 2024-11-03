<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carte Interactive Leaflet</title>

    

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
     
    <!-- Styles personnalisés -->
    <link rel="stylesheet" href="assets/map.css">
    
    <script src="https://unpkg.com/vue@3.0.0"></script>

</head>
<body>
   
    <div id="header">
        <div id="app"><div id="timer" class="timer"> {{ formattedTime }} </div></div>
        <?php if ($user) { ?>
        <div id="pseudo" class = "pseudo"><?= $user; ?></div><?php }?>
        <h1>A la recherche du riz khmer</h1>
        
        <label for="cheatCheckbox" class="cheat-label">
            <input type="checkbox" id="cheatCheckbox" class="cheat-checkbox">
            Triche
        </label>
    </div>
    

    <!-- Conteneur pour la carte -->
    <div id="map"></div>

    <div id="inventory" class="inventory">
    <span>Inventaire</span>
    </div>

    <div id="inventoryPanel" class="inventory-panel">
     
    <!-- Librairie Leaflet -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
    <!-- Script personnalisé -->
    <script src="assets/map.js"></script>

</body>
</html>
