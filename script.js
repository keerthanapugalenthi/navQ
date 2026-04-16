let map;
let mode = "bike";
let marker;
let route = [];
let accidentData = [];
let currentStep = 0;

// MODE
function setMode(m){
  mode = m;
  document.getElementById("modeDisplay").innerText = m;
}

// START NAVIGATION
function startNavigation(){

  let start = [12.9221, 80.1275];
  let end   = [13.0067, 80.2206];

  // 🔥 PRE-TRIP ALERT (NEW)
  let preMsg = "⚠️ Your route contains high accident-prone zones.";
  alert(preMsg);
  speak("Warning. Your route contains accident prone zones.");

  loadMap(start, end);
  getWeather();   // now fixed as NORMAL
  detectTime();
}

// LOAD MAP
function loadMap(start, end){

  map = L.map('map').setView(start, 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19
  }).addTo(map);

  route = [
    start,
    [12.9350, 80.1400],
    [12.9550, 80.1650],
    [12.9700, 80.1850],
    [12.9850, 80.2050],
    [12.9950, 80.2150],
    end
  ];

  L.polyline(route, {color:'blue'}).addTo(map);

  // 🔥 ARROW MARKER (NEW CHANGE)
  let arrowIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30]
  });

  marker = L.marker(start, {icon: arrowIcon}).addTo(map);

  loadAccidents();

  map.on("click", moveStep);
}

// MOVE ALONG ROUTE
function moveStep(){

  if(currentStep >= route.length) return;

  let pos = route[currentStep];
  marker.setLatLng(pos);

  triggerAlertByStep(currentStep);
  currentStep++;
}

// LOAD ACCIDENTS
function loadAccidents(){
  fetch("data.json")
  .then(res=>res.json())
  .then(data=>{
    accidentData = data;

    data.forEach(d=>{
      L.circle([d.lat, d.lng],{
        color: d.risk==="high"?"red":"orange",
        fillColor: d.risk==="high"?"red":"orange",
        fillOpacity: 0.4,
        radius: 300
      }).addTo(map);
    });
  });
}

// WEATHER (FIXED: NORMAL)
function getWeather(){
  document.getElementById("weather").innerText = "Normal";
}

// TIME (FIXED: 10:30 PM)
function detectTime(){
  document.getElementById("time").innerText = "10:30 PM";
}

// 🔥 NEW ALERT SYSTEM (REPLACED FULLY)
function triggerAlertByStep(step){

  let msg = "";

  // 1️⃣ STEP 1 - HIGH ACCIDENT ZONE
  if(step === 1){

    msg = "⚠️ High accident-prone zone ahead.";

    if(mode === "bike"){
      msg += " Night-time bike accidents are frequent here. Reduce speed.";
      speak("Night time bike accidents are frequent here. Reduce speed.");
    }

  }

  // 2️⃣ STEP 2 - SHARP TURN
  else if(step === 2){

    msg = "⚠️ Sharp turn ahead. Most accidents here occur due to sudden braking.";
    speak("Sharp turn ahead. Slow down.");
  }

  // 3️⃣ STEP 3 - SLIPPERY ROAD
  else if(step === 3){

    msg = "⚠️ Road surface may be slippery due to recent weather conditions.";
    speak("Slippery road ahead.");
  }

  // 4️⃣ STEP 4 - GENERAL WARNING
  else if(step === 4){

    msg = "⚠️ Safer alternative route available. Recommended to avoid this high-risk stretch.";
    speak("Lower risk route detected. Consider switching.");
  }

  else{
    msg = "Safe zone. Continue riding carefully.";
  }

  showAlert(msg);
}

// 🔥 ALERT + SCORE SYSTEM
function showAlert(msg){

  document.getElementById("alertText").innerText = msg;

  let score = 100;

  if(msg.includes("High")) score -= 25;
  if(msg.includes("Sharp")) score -= 15;
  if(msg.includes("Slippery")) score -= 20;

  document.getElementById("score").innerText = score + "%";

  if(score < 60){
    document.getElementById("suggestion").innerText = "Drive extremely carefully ⚠️";
  } else {
    document.getElementById("suggestion").innerText = "Stay alert 👍";
  }

  async function findRoutes() {
    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;

    if (!source || !destination) {
        alert("Enter both source and destination");
        return;
    }

    const response = await fetch("http://127.0.0.1:5000/route", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            source: source,
            destination: destination
        })
    });

    const data = await response.json();

    document.getElementById("fast").innerText =
        "Fastest: " + data.fastest.path.join(" → ") +
        " | Cost: " + data.fastest.cost;

    document.getElementById("safe").innerText =
        "Safest: " + data.safest.path.join(" → ") +
        " | Cost: " + data.safest.cost;
}


// VOICE
function speak(text){
  let msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}
