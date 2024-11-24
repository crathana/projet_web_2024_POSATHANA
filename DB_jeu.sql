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

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('traducteur', 'images/traducteur.png', ST_SetSRID(ST_MakePoint(2.1650446418390157, 48.71246565230332), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('eiffel', 'images/eiffel.png', ST_SetSRID(ST_MakePoint(2.294466145187715, 48.85829909100211), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('invalides', 'images/invalides.png', ST_SetSRID(ST_MakePoint(2.312702153383917, 48.85650308619566), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('notredame', 'images/notredame.png', ST_SetSRID(ST_MakePoint(2.3499641320949265,48.85301814819735), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('arc', 'images/arc.png', ST_SetSRID(ST_MakePoint(2.295015532102536,48.87379582168809), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('louvres', 'images/louvres.png', ST_SetSRID(ST_MakePoint(2.337633119903641, 48.86059907587742), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('concorde', 'images/concorde.png', ST_SetSRID(ST_MakePoint(2.32123616317396, 48.86563291514236), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('pantheon', 'images/pantheon.png', ST_SetSRID(ST_MakePoint(2.3461463608309594, 48.84623479107907), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('sacrecoeur', 'images/sacrecoeur.png', ST_SetSRID(ST_MakePoint(2.343059249782238, 48.88672092373468), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('garnier', 'images/garnier.png', ST_SetSRID(ST_MakePoint(2.3317358689310463, 48.87198356654497), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('cdg', 'images/cdg.png', ST_SetSRID(ST_MakePoint(2.5514822631763883,49.008166299107586), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('aeroport_cambodge', 'images/cdg.png', ST_SetSRID(ST_MakePoint(104.84731480634035,11.54914405354804), 4326), 100, 100, 1);

INSERT INTO Objets (nom, chemin_image, coordonnees, largeur, hauteur, niveau_zoom) 
VALUES ('riz', 'images/riz.png', ST_SetSRID(ST_MakePoint(103.86688755999845,13.412501119970457 ), 4326), 100, 100, 1);

