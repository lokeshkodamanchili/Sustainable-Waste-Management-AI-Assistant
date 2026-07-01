# Project Video Demonstration & Scenario Walkthrough

This document outlines the step-by-step demonstration walkthrough for the **EcoSense Smart Sustainable Waste Assistant** application, highlighting the 4 core user scenarios.

---

## 🎬 Video Walkthrough Script & Scenes

### Scenario 1: Hazardous Waste Scanning (Battery)
* **Timestamp**: `0:00 - 0:45`
* **Scene Description**: The user opens the **EcoSense Scanner** dashboard and inputs "battery" into the search bar.
* **Key Features Shown**:
  * **Generative AI Parsing**: Llama 3.3 model analyzes the chemical nature of the battery.
  * **Classification Indicator**: Item is highlighted in red as **Hazardous Waste** with a **High** hazard level rating.
  * **Safety Alerts**: Displays warnings about toxic heavy metal leaching (mercury, lead, cadmium).
  * **Disposal Protocol**: Instructions guide the user to avoid standard garbage bins and tape terminals before dropoff.
  * **Eco-Friendly Recommendations**: Suggests switching to rechargeable batteries.

---

### Scenario 2: Recyclable Sorting & Logging (Plastic Bottle)
* **Timestamp**: `0:45 - 1:30`
* **Scene Description**: The user enters "plastic bottle" into the scanner to verify its recyclability.
* **Key Features Shown**:
  * **AI Sorting Response**: The model classifies the item as **Plastic Waste** and flags it as **Recyclable (True)**.
  * **Preparation Protocol**: Lists 4 clear steps:
    1. Empty remaining liquids.
    2. Rinse thoroughly with water.
    3. Remove cap (separate stream).
    4. Crush bottle to conserve bin space.
  * **Personalized History Stack**: Showcases the scan automatically logging into the user's local history database.

---

### Scenario 3: Local dropoff Center Locator (Interactive Map)
* **Timestamp**: `1:30 - 2:15`
* **Scene Description**: After scanning a hazardous item, the user navigates to the **Map** tab to locate a safe dropoff site.
* **Key Features Shown**:
  * **Leaflet.js Map Rendering**: A responsive map centered on coordinates loads immediately without licensing API fees.
  * **Color-Coded Marker Pins**: Markers are color-coded based on center classifications:
    * **Red Pins**: Hazardous/E-waste hubs.
    * **Green Pins**: General municipal recycling centers.
    * **Blue Pins**: Organic compost centers.
  * **Pop-up Detail Cards**: Clicking a pin reveals the center's name, physical address, opening hours, list of accepted materials, and phone number.

---

### Scenario 4: Sustainability Analytics Dashboard (Chart.js Metrics)
* **Timestamp**: `2:15 - 3:00`
* **Scene Description**: The user navigates to the **Analytics Dashboard** page to review their cumulative recycling footprints.
* **Key Features Shown**:
  * **Doughnut Chart**: Shows the distribution of recyclable vs. non-recyclable items scanned.
  * **Line Graph**: A 7-day visualization of daily scan volume trends, indicating user engagement.
  * **Bar Chart**: A breakdown of scans by category (e.g. Plastic, E-waste, Organic, Glass).
  * **Summary Indicators**: KPI metric cards displaying:
    * **Total Items Scanned**: e.g., `12 items`
    * **Recyclable Count**: `9 items`
    * **Recycling Success Rate**: `75%`
    * **Hazardous Detections**: `2 items`
