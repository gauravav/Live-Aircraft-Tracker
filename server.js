const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// OpenSky API URL
const API_URL = "https://opensky-network.org/api/states/all";

// Set location bounding box for tracking around DFW Airport
const LATITUDE_RANGE = [32.89, 32.98]; // DFW Approximate Lat Range
const LONGITUDE_RANGE = [-97.05, -96.95]; // DFW Approximate Lon Range

app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory

// Route to fetch aircraft data
app.get("/api/aircraft", async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
            const aircraftData = response.data.states || [];
            const filteredAircraft = aircraftData
                .map(state => ({
                    icao24: state[0],
                    callsign: state[1]?.trim() || "Unknown",
                    origin_country: state[2],
                    latitude: state[6],
                    longitude: state[5],
                    altitude: state[7],
                    velocity: state[9],
                    true_track: state[10],
                    on_ground: state[8]
                }))
                .filter(aircraft =>
                    aircraft.latitude >= LATITUDE_RANGE[0] &&
                    aircraft.latitude <= LATITUDE_RANGE[1] &&
                    aircraft.longitude >= LONGITUDE_RANGE[0] &&
                    aircraft.longitude <= LONGITUDE_RANGE[1]
                );

            res.json({ aircraft: filteredAircraft });
        } else {
            res.status(500).json({ error: "Failed to fetch data from OpenSky API" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching aircraft data" });
    }
});

// Catch-all route to serve the index.html file
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
