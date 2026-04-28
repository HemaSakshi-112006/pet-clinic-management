document.addEventListener("DOMContentLoaded", function () {

  const btn = document.getElementById("emergencyBtn");

  console.log("JS Loaded");

  btn.addEventListener("click", function (e) {
    e.preventDefault();

    console.log("Button clicked");

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log("Location received");

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log(lat, lng);

        // Create map
        const map = L.map('map').setView([lat, lng], 15);

        // Add map tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // Add marker
        L.marker([lat, lng]).addTo(map)
          .bindPopup("You are here 📍")
          .openPopup();
      },

      function () {
        alert("Location permission denied!");
      }
    );
  });

});