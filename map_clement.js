Vue.createApp({
    data() {
        return {
            seconds: 0, 
            map: null,
            inventoryActive: false,
            objects: [], 
            username : ''
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
        },

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
                
                // Peu importe si le temps est mis à jour ou non, on affiche l'alerte et on redirige
                alert(`Jeu terminé ! Votre temps: ${time}`);
                window.location.href = '/classement'; 
            })
            .catch(err => {
                console.error("Erreur lors de l'appel à l'API : ", err);
                alert(`Erreur lors de l'enregistrement du temps: ${time}`);
                window.location.href = '/classement';
            });
        }

    },
    mounted() {
        this.username = document.getElementById("pseudo").innerText;
        this.initializeMap();
        this.loadObjects();
        document.getElementById('finishButton').addEventListener('click', this.finishGame)
        setInterval(() => {
            this.seconds++;
        }, 1000);
    }
}).mount('body'); 
