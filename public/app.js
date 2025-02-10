const map = L.map("map").setView([32.88, -97.0], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let aircraftMarkers = []; // Correct variable name

async function fetchAircraftData() {
    try {
        const response = await fetch("/api/aircraft");
        const data = await response.json();
        updateMap(data.aircraft);
    } catch (error) {
        console.error("Error fetching aircraft data:", error);
    }
}

function updateMap(aircraftList) {
    // Remove existing markers
    aircraftMarkers.forEach(marker => map.removeLayer(marker));
    aircraftMarkers = [];

    // Add new markers
    aircraftList.forEach(aircraft => {
        // Create a custom icon with rotation based on true_track
        const planeIcon = L.divIcon({
            className: "plane-icon",
            html: `<div style="transform: rotate(${aircraft.true_track || 0}deg);">✈️</div>`,
            iconSize: [30, 30],
        });

        const marker = L.marker([aircraft.latitude, aircraft.longitude], { icon: planeIcon }).addTo(map);
        marker.bindPopup(`
            <b>Callsign:</b> ${aircraft.callsign} <br>
            <b>Country:</b> ${aircraft.origin_country} <br>
            <b>Altitude:</b> ${aircraft.altitude || "Unknown"} meters <br>
            <b>Speed:</b> ${aircraft.velocity || "Unknown"} m/s <br>
            <b>Direction:</b> ${aircraft.true_track || "Unknown"}° <br>
            <b>On Ground:</b> ${aircraft.on_ground ? "Yes" : "No"}
        `);

        aircraftMarkers.push(marker);
    });
}

setInterval(fetchAircraftData, 10000); // Refresh every 10 seconds
fetchAircraftData();
