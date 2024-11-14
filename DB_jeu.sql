CREATE TABLE Joueurs (
    id SERIAL PRIMARY KEY,           
    nom_joueur VARCHAR(255) NOT NULL,      
    score INTEGER NOT NULL    
);

CREATE TABLE Objets (
    id SERIAL PRIMARY KEY,           
    nom VARCHAR(255) NOT NULL,      
    chemin_image VARCHAR(255) NOT NULL,  
    coordonnees GEOMETRY(POINT, 4326) NOT NULL,  
    largeur FLOAT NOT NULL,        
    hauteur FLOAT NOT NULL,        
    niveau_zoom INTEGER NOT NULL     
);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('restaurant', 'images/restaurant.png', ST_SetSRID(ST_MakePoint(-0.3806533524066482, 39.47297241032112), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('avion', 'images/avion.png', ST_SetSRID(ST_MakePoint(-0.48396404445657826, 39.489219807054525), 4326), 125, 125, 13);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('stade', 'images/stade.png', ST_SetSRID(ST_MakePoint(-0.3585, 39.47432684166863), 4326), 150, 150, 15);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('plage', 'images/plage.png', ST_SetSRID(ST_MakePoint(-0.32354983125966935, 39.47805676182557), 4326), 150, 150, 15);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('ciudad', 'images/ciudad.png', ST_SetSRID(ST_MakePoint(-0.35168809960320374, 39.455695557681075), 4326), 150, 150, 15);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('albufera', 'images/albufera.png', ST_SetSRID(ST_MakePoint(-0.35557350252679676, 39.339373314514255), 4326), 150, 150, 15);