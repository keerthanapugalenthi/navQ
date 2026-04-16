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

  let preMsg = "⚠️ Your route contains high accident-prone zones.";
  alert(preMsg);
  speak("Warning. Your route contains accident prone zones.");

  loadMap(start, end);
  getWeather();
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

// WEATHER
function getWeather(){
  document.getElementById("weather").innerText = "Normal";
}

// TIME
function detectTime(){
  document.getElementById("time").innerText = "10:30 PM";
}

// ALERT SYSTEM
function triggerAlertByStep(step){

  let msg = "";

  if(step === 1){

    msg = "⚠️ High accident-prone zone ahead.";

    if(mode === "bike"){
      msg += " Night-time bike accidents are frequent here. Reduce speed.";
      speak("Night time bike accidents are frequent here. Reduce speed.");
    }

  }
  else if(step === 2){
    msg = "⚠️ Sharp turn ahead. Most accidents here occur due to sudden braking.";
    speak("Sharp turn ahead. Slow down.");
  }
  else if(step === 3){
    msg = "⚠️ Road surface may be slippery due to recent weather conditions.";
    speak("Slippery road ahead.");
  }
  else if(step === 4){
    msg = "⚠️ Safer alternative route available. Recommended to avoid this high-risk stretch.";
    speak("Lower risk route detected. Consider switching.");
  }
  else{
    msg = "Safe zone. Continue riding carefully.";
  }

  showAlert(msg);
}

// ALERT + SCORE
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
}

// VOICE
function speak(text){
  let msg = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(msg);
}


/*HAZARD BUTTON (SAFE + PROPER LOAD TIMING) */
window.addEventListener("load", function () {

  const btn = document.getElementById("reportHazardBtn");

  if(btn){
    btn.addEventListener("click", function () {

      if(!map){
        alert("Map not ready yet");
        return;
      }

      reportHazard(map);
    });
  }

});
