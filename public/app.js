// Initialize the map
const map = L.map("map").setView([32.88, -97.0], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let aircraftMarkers = {}; // Object to store current markers indexed by `icao24`
let previousPositions = {}; // Store previous positions of planes

// Fetch aircraft data from the server
async function fetchAircraftData() {
    try {
        const response = await fetch("/api/aircraft");
        const data = await response.json();
        updateMap(data.aircraft);
    } catch (error) {
        console.error("Error fetching aircraft data:", error);
    }
}

// Update the map with aircraft markers and animate their motion
function updateMap(aircraftList) {
    const updatedPositions = {};

    aircraftList.forEach(aircraft => {
        if (aircraft.latitude && aircraft.longitude) {
            const { icao24, latitude, longitude, true_track } = aircraft;
            updatedPositions[icao24] = { latitude, longitude, true_track };

            // If marker exists, animate its movement
            if (aircraftMarkers[icao24]) {
                const previous = previousPositions[icao24] || { latitude, longitude };

                // Animate the movement
                const steps = 30; // Number of animation steps
                const duration = 1000; // Total animation duration in ms
                const interval = duration / steps;

                let step = 0;

                const animate = setInterval(() => {
                    step++;
                    const lat = previous.latitude + (latitude - previous.latitude) * (step / steps);
                    const lon = previous.longitude + (longitude - previous.longitude) * (step / steps);

                    // Update marker position
                    aircraftMarkers[icao24].setLatLng([lat, lon]);

                    if (step === steps) {
                        clearInterval(animate);
                    }
                }, interval);

                // Update icon rotation
                const iconHtml = `
                    <img 
                        src="plane.png" 
                        style="transform: rotate(${true_track || 0}deg); width: 30px; height: 30px;"
                        alt="plane icon"
                    />
                `;
                aircraftMarkers[icao24].setIcon(L.divIcon({
                    className: "plane-icon",
                    html: iconHtml,
                    iconSize: [30, 30],
                }));
            } else {
                // Create a new marker for new aircraft
                const planeIcon = L.divIcon({
                    className: "plane-icon",
                    html: `
                        <img 
                            src="plane.png" 
                            style="transform: rotate(${true_track || 0}deg); width: 30px; height: 30px;"
                            alt="plane icon"
                        />
                    `,
                    iconSize: [30, 30],
                });

                const marker = L.marker([latitude, longitude], { icon: planeIcon }).addTo(map);
                marker.bindPopup(`
                    <b>Callsign:</b> ${aircraft.callsign} <br>
                    <b>Country:</b> ${aircraft.origin_country} <br>
                    <b>Altitude:</b> ${aircraft.altitude || "Unknown"} meters <br>
                    <b>Speed:</b> ${aircraft.velocity || "Unknown"} m/s <br>
                    <b>Direction:</b> ${true_track || "Unknown"}° <br>
                    <b>On Ground:</b> ${aircraft.on_ground ? "Yes" : "No"}
                `);

                aircraftMarkers[icao24] = marker;
            }
        }
    });

    // Update the previous positions for the next iteration
    previousPositions = updatedPositions;
}

// Fetch aircraft data every 10 seconds
setInterval(fetchAircraftData, 10000);
fetchAircraftData();
