Vue.createApp({
    data() {
        return {
            seconds: 0, // Initialisation du temps
            map: null,
            inventoryActive: false, // Permet de savoir si l'inventaire est ouvert ou non
            inventoryItems: [], // Liste contenant les objets présents dans l'inventaire
            selectedItem: null,
            markers: [], // Liste de tous les marqueurs
            username : '', // Nom entré par l'utilisateur

            // Récupération du flux WMS provenant du geoserver
            triche: L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
                layers: 'Heat_Map_DiegoClement:objets', 
                format: 'image/png',
                transparent: true,
            }),
        };
    },

    computed: {

        // Fonction permettant de formater le temps
        formattedTime() {
            const minutes = Math.floor(this.seconds / 60);
            const displaySeconds = this.seconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
        }
    },
    
    methods: {

        // Fonction qui permet d'ouvrir et fermer l'inventaire
        toggleInventory() {
            this.inventoryActive = !this.inventoryActive;
        },

        // Fonction pour récupérer les objets depuis l'API
        fetchObjets() {
            fetch('/api/objets')
                .then(response => response.json())
                .then(data => {
                    this.objets = data.objets || []; 
                    this.markers = []; 
    
                    let mark = [];
    
                    // Création des marqueurs pour chaque objet
                    this.objets.forEach((objet, index) => {
                        const lat = objet.geojson.coordinates[1];
                        const lng = objet.geojson.coordinates[0];
                        const zoomLevel = objet.niveau_zoom;
                        
                        //creation de l'icone visible sur la map
                        const Icon = L.icon({
                            iconUrl: objet.chemin_image,
                            iconSize: [objet.hauteur, objet.largeur],
                        });
    
                        
                        const marker = L.marker([lat, lng], { icon: Icon, zoom: zoomLevel });
    
                        
                       mark.push(marker);
                    });
    
                    
                    this.markers = mark;
                    

                    const self = this; //permet d'éviter des problèmes liés à Vue

                    console.log(this.markers);
                    
                    this.markers[0].bindPopup(`
                        <p><strong>Hola Amigo !</strong></p>
                        <p>Il ne reste plus de riz au restaurant pour de la paëlla, il nous en faut au plus vite !</p>
                        <p>Comme tu le sais ici nous utilisons uniquement du riz khmer soit venant du Cambodge, c'est pourquoi tu dois t'y rendre pour y récupérer le riz</p>
                        <p>Rends toi à l'aéroport pour y prendre l'avion, on compte sur toi !</p>
                        <p><strong>Suerte y gracias !</strong></p>
                    `).addTo(this.map);
                    
                    // Rendre les marqueurs autres que le 0 non visible
                    for (let i = 1; i <= 21; i++) {
                        if (this.markers[i]) {
                            this.markers[i].setOpacity(0);
                        }
                    }

                    // Affichage du marqueur 1
                    this.markers[0].on('click', function(){
                        self.markers[1].setOpacity(1);
                    });
    
                    // Messages des différents popups

                    // Restaurant
                    this.markers[1].bindPopup(`
                        <p><strong>Bienvenido al aeropuerto de Valencia !</strong></p>
                        <p>Mince, il semble que votre ticket ne fonctionne pas et que la copie que nous avions préparée a été emmenée en ville par le Señor Ignacio</p>
                        <p>Je te conseille de te rendre du côté du stade de Mestalla, tu trouveras peut être ton ticket là bas</p>
                        <p>Mais dépêche-toi, le temps presse</p>
                    `).addTo(this.map);

                    // Stade
                    this.markers[2].bindPopup(`
                        <p><strong>Estadio de Mestalla</strong></p>
                        <p><strong>Speaker du stade:</strong> GOOOOOOOOOOL !! 3-0 en favor del Valencia CF</p>
                        <p><strong>Sécurité:</strong> Désolé monsieur, le ticket n'est plus ici, mais j'ai cru entendre que la personne qui l'avait était parti à la plage de la Malvarossa</p>
                        <p><strong>Annonce publicitaire:</strong> La France tente de révolutionner le monde de la tech avec...</p>
                    `).addTo(this.map);

                    // Plage
                    this.markers[3].bindPopup(`
                        <p><strong>Platja de la Malvarossa</strong></p>
                        <p><strong>Serveur du chiringuito:</strong> Oh non ! Señor Ignacio vient de partir visiter la cité des arts et des sciences, à l'ouest du port.</p>
                        <p><strong>Bout de conversation entre des amis:</strong> T'as entendu parler du nouveau joujou qui permet de traduire un texte dans toutes les langues ?</p>
                    `).addTo(this.map);

                    // Cité
                    this.markers[4].bindPopup(`
                        <p><strong>Ciudad de las Artes y las Ciencias</strong></p>
                        <p><strong>Guide touristique:</strong> Señor Ignacio faisait partie de ma visite et elle vient de se finir.. j'ai cru comprendre qu'il comptait flâner dans l'Albufera semblable à des rizières se situant au sud de Valence</p>
                        <p><strong>Touriste qui parle à son amie:</strong> Oui, moi je travail au plateau de SACLAY dans la recherche linguistique</p>
                    `).addTo(this.map);

                    // Albufera
                    this.markers[5].bindPopup(`
                        <p><strong>Albufera</strong></p>
                        <p><strong>Señor Ignacio:</strong> Oh je suis sincèrement désolé, je ne m'en étais pas aperçu... vous avez au moins pu visiter la ville ! Mais d'ailleurs, parlez-vous khmer ?</p>
                    `).addTo(this.map);
                    
                    // Permet d'afficher le ticket
                    this.markers[5].on('click', function(){
                        self.markers[6].setOpacity(1);
                    });

                    //Active le nouveau popup pour l'aeroport et ajoute le ticket à l'inventaire
                    this.markers[6].on('click', function(){
                        
                        self.objetToInventory({ imageUrl: self.markers[6].options.icon.options.iconUrl, name: "ticket"})
                        self.markers[6].setOpacity(0); 
                        self.map.removeLayer(self.markers[1]);
                        self.markers[1].bindPopup(`
                            <p><strong>Aeropuerto de Valencia</strong></p>
                            <p>Veuillez préparer votre ticket afin de pouvoir embarquer</p>
                        `).addTo(this.map);       
                             
                    });

                    
                    this.markers[20].setOpacity(1);

                    // Aeroport Cambodge sans traducteur
                    this.markers[20].bindPopup(`
                        <p><strong> Aéroport de Phnom Penh</strong> </p>
                        
                        <p><strong> Bora: </strong>សួស្តី យើងកំពុងរង់ចាំអ្នក។ ខ្ញុំឈ្មោះ បូរ៉ា ជាអ្នកស្រែ។ ម្យ៉ាងវិញទៀត អ្នកមិនមានអ្នកបកប្រែទេ? វានឹងពិបាកយល់</p>  
                    `).addTo(this.map);   

                    
                    const zoomLevelRequired = 15;
                    
                    // Permet de gérer le fait qu'un objet soit visible ou non selon son niveau de zoom
                    this.map.on('zoomend', function () {
                        const zoom = self.map.getZoom();  
                        if (zoom >= zoomLevelRequired) {
                            
                            self.markers[2].setOpacity(1);
                            self.markers[3].setOpacity(1);
                            self.markers[4].setOpacity(1);
                            self.markers[5].setOpacity(1);
                        } else {
                            
                            self.markers[2].setOpacity(0);
                            self.markers[3].setOpacity(0);
                            self.markers[4].setOpacity(0);
                            self.markers[5].setOpacity(0);
                        }
                        
                        self.markers.forEach(marker => {
                            const zoomLevel = marker.options.zoom;  
                    
                            if (zoom >= zoomLevel) {
                                
                                    self.map.addLayer(marker);  
                                
                            } else {
                                
                                    self.map.removeLayer(marker);  
                                
                            }
                        });
                    });
                     

                      
                    // Traducteur
                    this.markers[7].bindPopup(`
                        <p><strong> Traducteur universel </strong> </p>
                        <p>Vous avez entre les mains le traducteur dernier cri développé par © Saclay-mentPerformant! Toutefois, pour pouvoir bénéficier de toutes les fonctionnalités, il faut le dévérouiller en tapant le code secret. </p>
                        <p>Nous avons perdu la notice de cet exemplaire et ne pouvons pas vous le fournir... Par contre nous avons retrouvé un papier contenant les informations suivantes... </p>
                        <p><strong> Indice:</strong></p>
                        <p> " Vous qui avez la chance d'être un valide,</p>
                        <p>Combattez l'ennemi pleutre et félon. </p>
                        <p>Pour cela il faut qu'on corde de manière rapide</p>
                        <p>L'arc avec lequel nous triompherons.</p>
                        <p><strong>Code:</strong></p>

                        <form id="codeForm" style="margin-top: 10px;">
                        
                        <label for="inputPassword2" class="visually-hidden">Code</label>
                        <input type="text" class="form-control" id="inputPassword2" placeholder="Votre réponse" style="margin-bottom: 5px;">
                        <button type="submit" class="btn btn-danger mb-3">Valider</button>
                        </form>
                    `).addTo(this.map);
                    
                    // Vérifie si le code donné est bon et renvoie une réponse selon le cas. Si code bon, redirige vers le Cambodge quand un clique est fait sur l'aéroport CDG
                    this.markers[7].on('popupopen', function () {

                        const codeForm = document.getElementById('codeForm'); 
                        const inputField = document.getElementById('inputPassword2'); 
                    
                        codeForm.addEventListener('submit', function (event) {
                            event.preventDefault(); 
                    
                            const userInput = inputField.value.trim(); 
                            if (userInput === '5574') { 
                                alert('Félicitations, le code est correct ! Le traducteur a été ajouté à votre inventaire');
                                self.markers[7].setOpacity(0);
                                self.markers[20].setOpacity(1);
                                self.objetToInventory({ imageUrl: self.markers[7].options.icon.options.iconUrl, name: "traducteur"});
                                self.markers[17].on('click', function(){
                                    self.map.setView([11.551792881624623, 104.84633588678238], 13);
                                });
                                console.log('Le code correct a été entré :', userInput);
                            } else { 
                                alert('Code incorrect. Retentez votre chance.');
                                console.log('Code incorrect entré :', userInput);
                            }
                        });
                    });
                    
                    // Affiche les marqueurs relatifs à Paris
                    this.markers[7].on('click', function(){

                        for (let i = 7; i <= 16; i++) {
                            self.markers[i].setOpacity(1);
                        }
                    });

                    // Popup pour les marqueurs de Paris

                    // Tour Eiffel
                    this.markers[8].bindPopup(`
                        <p><strong> Tour Eiffel</strong> </p>
                        <p> L'adresse de ce monument emblématique de la France est le ... avenue Anatole France.</p>  
                    `).addTo(this.map);
                    
                    // Invalides
                    this.markers[9].bindPopup(`
                        <p><strong> Les Invalides</strong> </p>
                        <p> Cette structure impressionante a été construite en seulement ... ans! </p>  
                    `).addTo(this.map);
                    
                    // Notre-Dame
                    this.markers[10].bindPopup(`
                        <p><strong> Cathédrale Notre-Dame de Paris</strong> </p>
                        <p> Dans cette cathédrale iconique de la ville de Paris, ... empereurs ont été intronisés </p>  
                    `).addTo(this.map);
                    
                    // Arc de Triomphe
                    this.markers[11].bindPopup(`
                        <p><strong> Arc de Triomphe</strong> </p>
                        <p> Il y a ... grands reliefs représentant des victoires militaires et des evenements historiques sculptés sur ce monument.</p>  
                    `).addTo(this.map);
                    
                    // Louvre
                    this.markers[12].bindPopup(`
                        <p><strong> Musée du Louvre</strong> </p>
                        <p> Le musée comporte un total de ... portes principales !</p>  
                    `).addTo(this.map);

                    // Concorde
                    this.markers[13].bindPopup(`
                        <p><strong> Place de la Concorde</strong> </p>
                        <p> Si on fait la somme des numéros de métro qui passent par cette station, on obtient ....</p> 
                    `).addTo(this.map);
                    
                    //Panthéon
                    this.markers[14].bindPopup(`
                        <p><strong> Panthéon</strong> </p>
                        <p> Dans ce bâtiment est stocké le pendule de Foucault, qui mesure ... mètres de long environs.</p>  
                    `).addTo(this.map);
                    
                    //Sacré-Coeur
                    this.markers[15].bindPopup(`
                        <p><strong> Basilique du Sacré-Coeur</strong> </p>
                        <p> On peut parfois y entendre sonner ses ... cloches.</p>  
                    `).addTo(this.map);
                    
                    // Garnier
                    this.markers[16].bindPopup(`
                        <p><strong> Opéra Garnier</strong> </p>
                        <p> Il a été construit avec ... types différents de marbre !</p>  
                    `).addTo(this.map);
                    

                    
                    
                });
                
        },

        // Fonction ajoutant un objet à l'inventaire
        objetToInventory(item) {
            if (!this.inventoryItems.some(existingItem => existingItem.name === item.name)) {
                this.inventoryItems.push(item);
            }
        },

        // Fonction qui selectionne un objet et manip si un objet est sélectionné
        selectItem(item) {

            this.selectedItem = item;  
            const self = this;

            // Actions si l'objet Ticket et sélectionné dans l'inventaire
            if(item.name === "ticket"){

                this.map.removeLayer(this.markers[1]);
                
                // Aéroport Valence
                this.markers[1].bindPopup(`
                    <p><strong>Prêt au décollage !</strong></p>
                    <p>Veuillez choisir la destination où vous souhaitez aller</p>
                `).addTo(this.map);
                
                // Si clique sur drapeau français alors centré sur l'aéroport CDG
                this.markers[18].on('click', function(){
                    ;
                    if (item.name === "ticket") {
                        self.map.setView([49.012030387445044, 2.5468684771972105], 13);
                    }
                    
                });
                
                // Si clique sur drapeau français alors centré sur l'aéroport Cambodge
                this.markers[19].on('click', function(){
                    if (item.name === "ticket") {
                        self.map.setView([11.551792881624623, 104.84633588678238], 13);
                    }
                    
                });  

                this.markers[18].setOpacity(1);
                this.markers[19].setOpacity(1);
                this.markers[17].setOpacity(1);
                this.markers[7].setOpacity(1);  
            }

            // Actions si l'objet Traducteur et sélectionné dans l'inventaire
            if(item.name === "traducteur"){
                
                // Aéroport Cambodge
                this.markers[20].bindPopup(`
                    <p><strong> Aéroport de Phnom Penh</strong> </p>
                    <p><strong> Bora: </strong>Bonjour je suis Bora, je suis votre fournisseur de riz. Vous trouverez le sac de riz que j'ai stocké dans le temple d'Angkor Wat.</p>  
                `).addTo(this.map);

                this.markers[21].setOpacity(1);

                // Ajout du riz dans l'inventaire
                this.markers[21].on('click', function(){
                    self.objetToInventory({ imageUrl: self.markers[21].options.icon.options.iconUrl, name: "riz"})
                    self.markers[21].setOpacity(0);
                });
                
            }

            // Actions si l'objet Riz et sélectionné dans l'inventaire
            if(item.name === "riz") {
                
                // Unbind du marqueur 20 pour pouvoir cliquer dessus sans l'affichage d'un popup
                this.markers[20].unbindPopup(); 
                this.markers[20].addTo(this.map);
            
                // Centre la carte sur le restaurant
                this.markers[20].on('click', function() {
                    self.map.setView([39.4699, -0.3763], 13); 
                });

                // Unbind du marqueur 0 pour pouvoir cliquer dessus sans l'affichage d'un popup
                this.markers[0].unbindPopup();
                this.markers[0].addTo(this.map);

                // Fin de la partie quand clique sur le restaurant avec le riz sélectionné
                this.markers[0].on('click', function(){
                    self.finishGame();
                });
            }
        },

        // Fonction permettant de finir la partie et de gérer l'envoi des infos du joueur à la base de données
        finishGame() {

            const time = `00:${this.formattedTime}`;
            const username = this.username;
            
            fetch('/api/finish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, time })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Réponse reçue de l\'API :', data);
                
                // Alerte affichant le temps au joueur
                alert(`Jeu terminé ! Votre temps: ${time}`);
                window.location.href = '/classement'; 
            })
            .catch(err => {
                console.error("Erreur lors de l'appel à l'API : ", err);
                alert(`Erreur lors de l'enregistrement du temps: ${time}`);
                window.location.href = '/classement';
            });
        },

        // Fonction permettant de gérer la checkbox qui affiche ou non la triche
        toggleWMSLayer() {

            const checkbox = document.getElementById('cheatCheckbox');
            
            if (checkbox.checked) {
                this.triche.addTo(this.map);
            } else {
                this.map.removeLayer(this.triche);
            }
        },
        
    },
    
    mounted() {

        // Récupération des tuiles OpenStreetMap et centrage de la carte sur le restaurant
        this.map = L.map('map').setView([39.4699, -0.3763], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    
        // Appel de la fonction fetch
        this.fetchObjets();
        
        // Vérifie et change si nécessaire le checkbox relatif à la triche
        const checkbox = document.getElementById('cheatCheckbox');
        checkbox.addEventListener('change', this.toggleWMSLayer);   

        // Gère le temps
        setInterval(() => {
            this.seconds++;
        }, 1000);
    }
    

}).mount('body');














