# Projet Web: Escape game géographique

Dans ce readme vous trouverez quels sont les paramètres à mettre afin de pouvoir lire notre jeu. En seconde partie, vous pourrez trouver la solution aux énigmes.

## Première partie: installations nécessaires

**PostgreSQL:**

Dans un premier temps, il faut installer pgAdmin4 (version 8.12) avec la version 17 de PostgreSQL. Il est important d'ajouter l'extension PostGIS au téléchargement.

Une fois cela fait, il faut aller dans les fichiers d'installation de PostgreSQL -> 17 -> data -> pg_hba.conf. Dedans changer la METHOD 'scram-sha-256' par 'md5' à toutes les lignes.
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     md5 #scram-sha-256
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5 #scram-sha-256
# IPv6 local connections:
host    all             all             ::1/128                 md5 #scram-sha-256
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     md5 #scram-sha-256
host    replication     all             127.0.0.1/32            md5 #scram-sha-256
host    replication     all             ::1/128                 md5 #scram-sha-256
```

Ensuite sur windows faites windows+r, ouvrez services.msc et cherchez 'postgresql-x64-17 - PostgreSQL Server 17'. Une fois trouvé, redémarrez le service.

- Relancez PgAdmin 4 et connectez vous avec les identifiants suivants: user: 'postgres', mot de passe: 'postgres'. Ouvrez le serveur de PostgreSQL 17 et créez une database que vous nommerez 'DB_Jeu'. 
- Ajoutez l'extension PostGIS en créant une nouvelle extension et en entrant "postgis" pour Name.
- Ouvrez une Query Tool et entrez-y les requêtes sql du fichier autre/DB_Jeu.sql (copier-coller) et executez la commande. Normalement la Base de Données est bien installé.

**GeoServer:**

Pour l'installation de GeoServer vous pouvez utiliser les tutos officiels en pensant à bien installer Java SE 17. Ensuite vous pouvez lancer "Start GeoServer" sur votre ordinateur (menu Windows) et accédez à GeoServer via votre navigateur en tapant: http://localhost:8080/geoserver. 

- Une fois dedans connectez vous (par défaut -> username: admin & password: geoserver).
- ensuite faites comme sur le sujet pour créer le workspace, le data store, le layer et le style en spécifiant ceci:
    * Workspace -> Name: Heat_Map_DiegoClement & URL: http://localhost:7779/.
    * Data Store -> choisissez PostGIS Database -> Espace de travail: Heat_Map_DiegoClement, Data Source Name: DataBase_DiegoClement, Database: DB_Jeu, user: postgres & passwd: postgres.
    * New Layer -> Add layer from: Heat_Map_DiegoClement:DataBase_DiegoClement -> objets -> Publish -> Penser à cliquer sur 'Compute from native bounds'; puis -> Publishing -> Default Style: Heat_Map_DiegoClement:Heat_Map.
    * Style Data -> Name: Heat_Map, Workspace: Heat_Map_DiegoClement, Style Content -> entrer le XML du fichier autre/Heat_Map_style.xml.

**MAMP:**

Installez MAMP et allez dans les fichiers d'installation:

- MAMP/bin/php -> changez le nom des fichiers "php8.XX.XX" par "_php8.XX.XX" à l'exception du dernier: "php8.3.1". Normalement l'avant dernier est donc "php7.4.16".
- MAMP/conf/php7.4.16 -> ouvrez le php.ini à partir de la ligne 666 décommentez toutes les lignes "extension=..." et notamment "extension=php_pgsql.dll".
- MAMP/conf/apache -> ouvrez le httpd.conf et ajoutez LoadFile "C:/MAMP/bin/php/php7.4.16/libpq.dll" lors de l'appel des Additionals Librairies.

Maintenant c'est bon, vous pouvez lancer MAMP. Avant de lancer le server:
- Preferences -> Ports -> Apache Port: 7779
- Preferences -> PHP -> version: 7.4.16
- Preferences -> Server -> Document Root: Sélectionnez le fichier "core-master"

Vous pouvez désormais lancer le server et taper http://localhost:7779/ dans votre navigateur web pour jouer.

## Deuxième partie: Solutions des énigmes

Toutes les coordonnées sont inscritent en (Latitude, Longitude) et en EPSG: 4326.

- Albufera: (-0.35557350252679676, 39.339373314514255) active -> Ticket: (-0.3517405847089456, 39.34075014058428)
  
- Clique sur Ticket permet d'avoir le choix entre voyager en France représenté par un drapeau français: (-0.4885363124791955, 39.48486293375731) et voyager au Cambodge représenté par un drapeau cambodgien: (-0.4769363124791955, 39.48486293375731), ici cliquer sur le drapeau cambodgien mène à une impasse. NB: On ne sait pas pourquoi mais quand le ticket est cliqué sans qu'on voit l'aéroport sur la carte, les drapeaux ne s'affichent pas et le jeu semble buguer.
  
- Pour récupérer le Traducteur: (2.1650446418390157, 48.71246565230332), il faut visiter les lieux suivants pour obtenir le code: Invalides: (2.312702153383917, 48.85650308619566), Tour Eiffel: (2.294466145187715, 48.85829909100211), Concorde: (2.32123616317396, 48.86563291514236), Arc de Triomphe: (2.295015532102536,48.87379582168809). Le code du Traducteur est 5564.
  
- Traduire le texte à l'aéroport du Cambodge: (104.84731480634035,11.54914405354804) débloque le Riz: (103.86688755999845,13.412501119970457).
  
- Ramener le Riz en Espagne via clique sur l'aéroport du Cambodge avec le Riz sélectionné dans l'inventaire puis clique sur le Restaurant avec Riz sélectionné dans l'inventaire provoque la fin du jeu.
  

Merci de votre lecture, amusez-vous bien. 
By Diego Posado Bañuls et Clement Rathana.
