    document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getLocationButton').addEventListener('click', getLocation);
});

function getLocation() {
    console.log("Button clicked");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('locationResult').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    document.getElementById('locationResult').innerHTML =
        `Latitude: ${latitude}<br>Longitude: ${longitude}<br>Accuracy: ${accuracy} meters`;
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('locationResult').innerHTML = "User denied the request for Geolocation.";
            break;
        default:
            document.getElementById('locationResult').innerHTML = "An unspecified error occurred.";
            break;
    }
}
