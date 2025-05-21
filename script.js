fetch('professionisti.json')
  .then(response => response.json())
  .then(data => {
    const listContainer = document.getElementById('professionisti-list');
    data.forEach(p => {
      const marker = L.marker([p.lat, p.lng]).addTo(map);
      const popup = `
        <div style="text-align:center;">
          <img src="${p.immagine}" alt="${p.nome}" style="width:100px;height:100px;border-radius:50%;"><br>
          <strong>${p.nome}</strong><br>
          <em>${p.professione}</em><br>
          <p>${p.descrizione}</p>
          <p><a href="${p.contatti.sito}" target="_blank">Sito Web</a></p>
          <p>Email: <a href="mailto:${p.contatti.email}">${p.contatti.email}</a></p>
          <p>Tel: <a href="tel:${p.contatti.telefono}">${p.contatti.telefono}</a></p>
        </div>`;
      marker.bindPopup(popup);

      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${p.nome}</strong> - ${p.professione} - ${p.citta}`;
      listContainer.appendChild(listItem);
    });
  });

const map = L.map('map').setView([43.7696, 11.2558], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
