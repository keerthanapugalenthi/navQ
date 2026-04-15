Project Overview:

navQ the app, highlights risky road segments on a map and provides step-by-step alerts during navigation, helping users make safer travel decisions, especially during specific times and weather condition.
This project focuses on bringing hidden accident patterns directly to the user before they enter dangerous zones.

Key Features:
Interactive map-based navigation using Leaflet.js  
Accident-prone zones displayed using historical data points  
Route-based risk alerts before and during travel  
Mode selection for different travel types (Bike, Car, Walk, Cycle)  
Voice alerts for real-time safety warnings   
Safety score system based on risk exposure  
Smart rerouting with safest path suggestion
 
We combine multiple real-world factors because road safety is not dependent on a single cause but on overlapping conditions that together determine actual risk:
Historical accident hotspots  
Time of travel  
Road condition assumptions   
Vehicle type sensitivity (especially for bikes)

Tech Stack:
HTML  
CSS  
JavaScript  
Leaflet.js (OpenStreetMap)  
Web Speech API (voice alerts)  
Static accident dataset (JSON)

How It Works:
1. Loads map and route using Leaflet.js  
2. Loads historical accident points from dataset  
3. Draws route and risk zones on map  
4. Simulates navigation step-by-step  
5. Triggers alerts based on:
Location on route  
Time of day  
Risk zone proximity  
Vehicle type  

Future Scope:
AI-based accident prediction using ML models  
Live government accident data integration  
Real-time traffic & weather API fusion  
Smart rerouting with safest path suggestion  
Mobile GPS-based live tracking system  

How to Run:
1. Clone or download the repository  
2. Open "index.html" in a browser  
3. Click "Start Navigation"  
4. Observe risk zones and alerts during route simulation  

