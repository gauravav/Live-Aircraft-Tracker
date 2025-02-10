const map = L.map("map").setView([32.94, -97.0], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

async function fetchAircraftData() {
    try {
        const response = await fetch("/api/aircraft");
        const data = await response.json();
        updateMap(data.aircraft);
    } catch (error) {
        console.error("Error fetching aircraft data:", error);
    }
}

let aircraftMarkers = [];

function updateMap(aircraftList) {
    aircraftMarkers.forEach(marker => map.removeLayer(marker));
    aircraftMarkers = [];

    aircraftList.forEach(aircraft => {
        const icon = L.divIcon({
            className: "aircraft-icon",
            html: `✈️`,
            iconSize: [25, 25]
        });

        const marker = L.marker([aircraft.latitude, aircraft.longitude], { icon }).addTo(map);
        marker.bindPopup(`
            <b>Callsign:</b> ${aircraft.callsign} <br>
            <b>Country:</b> ${aircraft.origin_country} <br>
            <b>Altitude:</b> ${aircraft.altitude || "Unknown"} meters <br>
            <b>Speed:</b> ${aircraft.velocity || "Unknown"} m/s <br>
            <b>Direction:</b> ${aircraft.true_track || "Unknown"}°
        `);

        aircraftMarkers.push(marker);
    });
}

setInterval(fetchAircraftData, 5000);
fetchAircraftData();
