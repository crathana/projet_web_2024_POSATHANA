Vue.createApp({
    data() {
        return {
            seconds: 0, 
            map: null,
            inventoryActive: false,
            objects: [] 
        };
    },
    computed: {
        formattedTime() {
            const minutes = Math.floor(this.seconds / 60);
            const displaySeconds = this.seconds % 60;
            return `${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
        }
    },
    methods: {
        toggleInventory() {
            this.inventoryActive = !this.inventoryActive;
        },
        loadObjects() {
            
            fetch('/api/objets')
                .then(response => response.json())
                .then(data => {
                    if (data.objets) {
                        data.objets.forEach(objet => {
                            
                            const lat = objet.geojson.coordinates[1];
                            const lng = objet.geojson.coordinates[0];
                            const imagePath = objet.chemin_image; 
                            const zoomLevel = objet.niveau_zoom; 
                            const width = objet.largeur; 
                            const height = objet.hauteur; 
        
                            const imageDiv = L.divIcon({
                                className: 'custom-image',
                                html: `<div style="width: ${width}px; height: ${height}px;">
                                           <img src="${imagePath}" style="width: 100%; height: 100%;">
                                       </div>`,
                                iconSize: [width, height]
                            });
    
                            
                            const marker = L.marker([lat, lng], { icon: imageDiv });
    
                            // Ajouter le marqueur à la carte au début
                            marker.addTo(this.map);
    
                            // Stocker l'objet et son niveau de zoom
                            this.objects.push({ marker, zoomLevel });
                        });
                        this.toggleMarkers();
                    }
                })
                
        },
        
        toggleMarkers() {
            const currentZoom = this.map.getZoom(); // Obtient le niveau de zoom actuel
            this.objects.forEach(obj => {
                const { marker, zoomLevel } = obj;
                if (currentZoom >= zoomLevel) {
                    // Ajouter le marqueur à la carte si le niveau de zoom est suffisant
                    if (!this.map.hasLayer(marker)) {
                        marker.addTo(this.map);
                    }
                } else {
                    // Supprimer le marqueur de la carte si le niveau de zoom n'est pas suffisant
                    if (this.map.hasLayer(marker)) {
                        this.map.removeLayer(marker);
                    }
                }
            });
        },
        
        initializeMap() {
            
            this.map = L.map('map').setView([39.46, -0.3763], 13);
            
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            
            this.map.on('zoomend', this.toggleMarkers);
        }
    },
    mounted() {
        this.initializeMap();
        this.loadObjects();
        setInterval(() => {
            this.seconds++;
        }, 1000);
    }
}).mount('body'); 





















    
    /*
const restaurant = [
    {
        coords: [39.47297241032112, -0.3806533524066482],
        image: 'images/restaurant.png', // Chemin de l'image
        popupText: 'Ceci est une image à Valence!',
        marker: null // Pour stocker le marqueur
    }
];

    // Fonction pour créer des marqueurs
    function createMarkerRestaurant() {
        restaurant.forEach(restaurants => {
            const markerIcon = L.icon({
                iconUrl: restaurants.image, // Utilisation de l'image comme icône
                iconSize: [125, 125], // Taille de l'image
                iconAnchor: [25, 50] // Point d'ancrage pour l'image
            });

            // Création du marqueur
            restaurants.marker = L.marker(restaurants.coords, { icon: markerIcon }).bindPopup(restaurants.popupText);
        });
    }

    function toggleMarkerRestaurant() {
        const zoomLevel = map.getZoom(); // Obtient le niveau de zoom actuel
        restaurant.forEach(restaurants => {
            if (zoomLevel >= 10) { // Change 15 au niveau de zoom souhaité
                restaurants.marker.addTo(map); // Ajoute le marqueur à la carte
            } else {
                map.removeLayer(restaurants.marker); // Supprime le marqueur de la carte
            }
        });
    }

   

const locations = [
        {
            coords: [39.47805676182557, -0.32354983125966935],
            image: 'images/plage.png', // Chemin de l'image
            popupText: 'Ceci est une image à Valence!',
            marker: null // Pour stocker le marqueur
        },
        {
            coords: [39.47432684166863, -0.3585], // Autre coordonnée à Valence
            image: 'images/stade.png', // Assure-toi que cette image existe
            popupText: 'Voici une autre image!',
            marker: null // Pour stocker le marqueur
        },
        {
            coords: [39.455695557681075, -0.35168809960320374],
            image: 'images/ciudad.png', // Chemin de l'image
            popupText: 'Ceci est une image à Valence!',
            marker: null // Pour stocker le marqueur
        },
        {
            coords: [39.339373314514255, -0.35557350252679676], // Autre coordonnée à Valence
            image: 'images/albufera.png', // Assure-toi que cette image existe
            popupText: 'Voici une autre image!',
            marker: null // Pour stocker le marqueur
        },
        {
            coords: [39.489219807054525, -0.48396404445657826], // Autre coordonnée à Valence
            image: 'images/avion.png', // Assure-toi que cette image existe
            popupText: 'Voici une autre image!',
            marker: null // Pour stocker le marqueur
        }
        // Ajoute d'autres images et coordonnées ici
    ];

    // Fonction pour créer des marqueurs
    function createMarkers() {
        locations.forEach(location => {
            const markerIcon = L.icon({
                iconUrl: location.image, // Utilisation de l'image comme icône
                iconSize: [200, 200], // Taille de l'image
                iconAnchor: [25, 50] // Point d'ancrage pour l'image
            });

            // Création du marqueur
            location.marker = L.marker(location.coords, { icon: markerIcon }).bindPopup(location.popupText);
        });
    }

    // Fonction pour afficher ou masquer les marqueurs selon le niveau de zoom
    function toggleMarkers() {
        const zoomLevel = map.getZoom(); // Obtient le niveau de zoom actuel
        locations.forEach(location => {
            if (zoomLevel >= 18) { // Change 15 au niveau de zoom souhaité
                location.marker.addTo(map); // Ajoute le marqueur à la carte
            } else {
                map.removeLayer(location.marker); // Supprime le marqueur de la carte
            }
        });
    }

    createMarkers();
    createMarkerRestaurant();

    map.on('zoomend', toggleMarkers);
    map.on('zoomend', toggleMarkerRestaurant);

    // Appelle toggleMarkers au chargement initial pour définir l'état des marqueurs
    toggleMarkers();

    

    

    // Appelle toggleMarkers au chargement initial pour définir l'état des marqueurs
    toggleMarkerRestaurant();

    */