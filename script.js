const map = L.map('map').setView([43.7696, 11.2558], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('professionisti.json')
  .then(response => response.json())
  .then(data => {
    const listContainer = document.getElementById('professionisti-list');
    data.forEach(p => {
      if (!p.lat || !p.lng) return;

      const slug = p.nome.toLowerCase().replace(/ /g, "-");

      const marker = L.marker([p.lat, p.lng]).addTo(map);
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
  });
