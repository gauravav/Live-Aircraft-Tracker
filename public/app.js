document.addEventListener("DOMContentLoaded", () => {
    // Initialize the map
    const map = L.map("map").setView([32.88, -97.0], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let aircraftMarkers = {}; // Store markers indexed by ICAO24
    let previousPositions = {}; // Store previous positions for animation

    // Fetch aircraft data from the server
    async function fetchAircraftData() {
        try {
            const response = await fetch("/api/aircraft");
            const data = await response.json();
            
            if (data.aircraft && data.aircraft.length > 0) {
                updateMap(data.aircraft);
                updateTable(data.aircraft);
            } else {
                console.warn("No aircraft data received.");
            }
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

                // If marker exists, animate movement
                if (aircraftMarkers[icao24]) {
                    const previous = previousPositions[icao24] || { latitude, longitude };

                    const steps = 30; // Smooth animation steps
                    const duration = 1000; // Total animation time in ms
                    const interval = duration / steps;

                    let step = 0;
                    const animate = setInterval(() => {
                        step++;
                        const lat = previous.latitude + (latitude - previous.latitude) * (step / steps);
                        const lon = previous.longitude + (longitude - previous.longitude) * (step / steps);

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
                        <b>Callsign:</b> ${aircraft.callsign || "Unknown"} <br>
                        <b>Country:</b> ${aircraft.origin_country || "Unknown"} <br>
                        <b>Altitude:</b> ${aircraft.altitude || "Unknown"} meters <br>
                        <b>Speed:</b> ${aircraft.velocity || "Unknown"} m/s <br>
                        <b>Direction:</b> ${true_track || "Unknown"}° <br>
                        <b>On Ground:</b> ${aircraft.on_ground ? "Yes" : "No"}
                    `);

                    aircraftMarkers[icao24] = marker;
                }
            }
        });

        // Store previous positions for smooth animation
        previousPositions = updatedPositions;
    }

    // Update the flight table
    function updateTable(aircraftList) {
        const tableBody = document.querySelector("#flight-table tbody");

        // Ensure the table body exists before updating
        if (!tableBody) {
            console.error("Table body not found! Make sure #flight-table exists in your HTML.");
            return;
        }

        tableBody.innerHTML = ""; // Clear previous rows

        aircraftList.forEach(aircraft => {
            if (aircraft.latitude && aircraft.longitude) {
                const row = `
                    <tr>
                        <td>${aircraft.callsign || "Unknown"}</td>
                        <td>${aircraft.origin_country || "Unknown"}</td>
                        <td>${aircraft.latitude.toFixed(4)}</td>
                        <td>${aircraft.longitude.toFixed(4)}</td>
                        <td>${aircraft.altitude || "Unknown"}</td>
                        <td>${aircraft.velocity || "Unknown"}</td>
                        <td>${aircraft.true_track || "Unknown"}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            }
        });
    }

    // Fetch aircraft data every 10 seconds
    setInterval(fetchAircraftData, 10000);
    fetchAircraftData();
});
