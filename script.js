const map = L.map('map').setView([45.4642, 9.19], 6); // centro Italia

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Aggiungi marker
L.marker([45.4642, 9.19]).addTo(map)
  .bindPopup('<strong>Mario Rossi</strong><br>Massaggiatore - Milano');

L.marker([41.9028, 12.4964]).addTo(map)
  .bindPopup('<strong>Luca Bianchi</strong><br>Nutrizionista - Roma');
