//function for button when clicked to get the location
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getLocationButton').addEventListener('click', getLocation);

//Fetch selected cities
const cities = ['New York', 'Chicago','Los Angeles','Boston','Toronto'];
fetchCityData(cities);
});

function fetchCityData(cities) {
    const apiUrl = 'https://sunrisesunset.io/api/v1/sun?';
    
    //Create an array of promises for each city
    const promises = cities.map(city => {
        const cityUrl = `${apiUrl}&city=${encodeURIComponent(city)}`;
        return fetch(cityUrl)
        .then(response => response.json())
        .then(data => {
            return {
                city, 
                sunrise: data.results.sunrise,
                sunset: data.results.senset

            };
        });
    });
}
//resolve all promises
Promise.all(promises)
    .then(cityData => {
        //display the sunrise and sunset information
        diplayCityData(cityData);
    })
    .catch(error => {
        consolse.error('Error fetching the data', error);
    });
//function display city data
function displayCityData(cityData) {
    const cityDropdown = document.getElementById('cityDropdown');
    const locationResult = document.getElementById('locationResult');
    //clear previous data
    locationResult.innerHTML= '';

    //diplay sunrise and sunset information for each city
    cityData.forEach(data => {
        const {city, sunrise, sunset } = data;
        const info = document.createElement('p');
        info.innerHTML = `<strong>${city}:</strong> Sunrise at ${sunrise}, Sunset at ${sunset}`;
        locationResult.appendChild(info);
        //add each city to the dropdown menu
        const option = document.createElement('option');
        option.value=city;
        option.textContent = city;
        cityDropdown.appendChild(option);
    });
}

//used for button clicked and show error
function getLocation() {
    console.log("Button clicked");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('locationResult').innerHTML = "Geolocation is not supported by this browser.";
    }
}
//getting coords and getting information frrom api
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    document.getElementById('locationResult').innerHTML =
        `Latitude: ${latitude}<br>Longitude: ${longitude}<br>Accuracy: ${accuracy} meters`;
}
//error handeling
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
