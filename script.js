
let map = L.map('map').setView([43.7696, 11.2558], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let professionistiData = [];
let markers = [];

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

function addProfessionistiToMap(data) {
  const listContainer = document.getElementById('professionisti-list');
  listContainer.innerHTML = "";
  clearMarkers();

  data.forEach(p => {
    if (!p.lat || !p.lng) return;

    const slug = p.nome.toLowerCase().replace(/ /g, "-");

    const marker = L.marker([p.lat, p.lng]).addTo(map);
    markers.push(marker);

    const popup = `
      <div style="text-align:center;">
        <img src="${p.immagine}" alt="${p.nome}" style="width:100px;height:100px;border-radius:50%;"><br>
        <strong>${p.nome}</strong><br>
        <em>${p.professione}</em><br>
        <p>${p.descrizione}</p>
        <a href="${slug}.html" target="_blank"><button>Recensioni</button></a>
      </div>
    `;
    marker.bindPopup(popup);

    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>${p.nome}</strong> - ${p.professione} - ${p.citta}<br>
      <a href="${slug}.html">Leggi o scrivi una recensione</a>
    `;
    listContainer.appendChild(listItem);
  });
}

fetch('professionisti.json')
  .then(response => response.json())
  .then(data => {
    professionistiData = data;
    addProfessionistiToMap(data);
  });

async function getCoordinatesFromCity(city) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
  const results = await response.json();
  if (results.length === 0) return null;
  return {
    lat: parseFloat(results[0].lat),
    lng: parseFloat(results[0].lon),
  };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function applyFilters() {
  const city = document.getElementById("user-city").value.trim();
  const profession = document.getElementById("profession-filter").value;
  const radius = parseInt(document.getElementById("radius-filter").value);

  if (!city) {
    alert("Inserisci la tua città per applicare i filtri.");
    return;
  }

  const userCoords = await getCoordinatesFromCity(city);
  if (!userCoords) {
    alert("Città non trovata. Controlla il nome.");
    return;
  }

  const filtered = professionistiData.filter((p) => {
    if (!p.lat || !p.lng) return false;
    const distance = calculateDistance(userCoords.lat, userCoords.lng, p.lat, p.lng);
    if (distance > radius) return false;
    if (profession && p.professione !== profession) return false;
    return true;
  });

  map.setView([userCoords.lat, userCoords.lng], 10);
  addProfessionistiToMap(filtered);
}
