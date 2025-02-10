# [Live Aircraft Tracker](http://localhost:3000/)
Track Live Aircraft Around DFW Airport

## Getting Started
To start using the app, clone the repository and follow the setup instructions in the [Usage](#usage) section.

## Table of Contents

- [Live Aircraft Tracker](#live-aircraft-tracker)
  - [Getting Started](#getting-started)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Testing](#testing)
  - [Usage](#usage)
  - [Contact](#contact)

## Description

Welcome to **Live Aircraft Tracker**, an interactive web application that provides real-time tracking of aircraft around **DFW Airport**. This app fetches live data from the **OpenSky Network API** and displays aircraft positions and details on an intuitive map interface.

## Features

- **Live Aircraft Data:** Fetch real-time data from the OpenSky Network API and display it dynamically on the map.
- **Interactive Map:** Visualize aircraft positions on a Leaflet.js-powered map with details like altitude, speed, direction, and callsign.
- **User-Friendly Interface:** Easy-to-use interface to track aircraft in a specific region.
- **Regular Updates:** Aircraft data is refreshed every 10 seconds to ensure up-to-date information.

## Testing

#### Map Functionality Testing
![Map Testing](Screenshots/Screenshot-1.png)

## Usage

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/live-aircraft-tracker.git
   cd live-aircraft-tracker
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the server:**
   ```sh
   node server.js
   ```

4. **Open the app:**
   - Visit `http://localhost:3000` in your browser to start tracking live aircraft.

### Key Points
- Aircraft positions around **DFW Airport** are displayed based on latitude and longitude ranges.
- Aircraft details include:
  - Callsign
  - Altitude
  - Speed
  - Direction
  - Country of origin

## Contact

For any inquiries or feedback, feel free to reach out:

- **Email:** gavula@uncc.edu
- **Twitter:** [@avulagaurav](https://twitter.com/avulagaurav) ![Twitter](https://img.icons8.com/color/48/000000/twitter.png)
- **LinkedIn:** [Gaurav Avula](https://www.linkedin.com/in/gauravavula/) ![LinkedIn](https://img.icons8.com/color/48/000000/linkedin.png)
