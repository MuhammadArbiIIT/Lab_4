document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getLocationButton').addEventListener('click', getLocation);

    // Fetch selected cities
    const cities = ['New York', 'Chicago', 'Los Angeles', 'Boston', 'Toronto'];
    fetchCityData(cities);
});

function fetchCityData(cities) {
    const apiUrl = 'https://api.sunrise-sunset.org/json?';

    // Create an array of promises for each city
    const promises = cities.map(city => {
        const cityUrl = `${apiUrl}&q=${encodeURIComponent(city)}`;
        return fetch(cityUrl)
            .then(response => response.json())
            .then(data => ({
                city,
                sunrise: data.results.sunrise,
                sunset: data.results.sunset
            }))
            .catch(error => {
                console.error(`Error fetching data for ${city}:`, error);
                return {
                    city,
                    sunrise: 'N/A',
                    sunset: 'N/A'
                };
            });
    });

    // Resolve all promises
    Promise.all(promises)
        .then(cityData => {
            // Display the sunrise and sunset information
            displayCityData(cityData);
        })
        .catch(error => {
            console.error('Error fetching city data:', error);
        });
}

// Function to display city data
function displayCityData(cityData) {
    const cityDropdown = document.getElementById('cityDropdown');
    const locationResult = document.getElementById('locationResult');

    // Clear previous data
    locationResult.innerHTML = '';
    cityDropdown.innerHTML = ''; // Clear the dropdown before populating

    // Display sunrise and sunset information for each city
    cityData.forEach(data => {
        const { city, sunrise, sunset } = data;
        const info = document.createElement('p');
        info.innerHTML = `<strong>${city}:</strong> Sunrise at ${sunrise}, Sunset at ${sunset}`;
        locationResult.appendChild(info);

        // Populate the dropdown after displaying city data
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityDropdown.appendChild(option);
    });
}

// Used for button clicked and show error
function getLocation() {
    console.log("Button clicked");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('locationResult').innerHTML = "Geolocation is not supported by this browser.";
    }
}

// Getting coords and getting information from API
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    document.getElementById('locationResult').innerHTML =
        `Latitude: ${latitude}<br>Longitude: ${longitude}<br>Accuracy: ${accuracy} meters`;
}

// Error handling
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
