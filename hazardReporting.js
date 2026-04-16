let userHazards = [];

function reportHazard(map) {

    // safety check
    if (!map) {
        alert("Map not ready yet. Start navigation first.");
        return;
    }

    const center = map.getCenter();

    const hazard = {
        lat: center.lat,
        lng: center.lng,
        type: "Road Hazard",
        timestamp: Date.now()
    };

    userHazards.push(hazard);

    addHazardMarker(map, hazard);
}

function addHazardMarker(map, hazard) {
    L.marker([hazard.lat, hazard.lng])
        .addTo(map)
        .bindPopup("⚠️ User Reported Hazard");
}

function checkUserHazards(map, userLocation, speakAlert) {

    if (!map || !userLocation) return;

    userHazards.forEach(hazard => {

        const distance = map.distance(
            [userLocation.lat, userLocation.lng],
            [hazard.lat, hazard.lng]
        );

        if (distance < 200) {
            speakAlert("Warning. User reported hazard ahead.");
        }
    });
}
