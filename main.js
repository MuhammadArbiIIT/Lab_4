document.addEventListener('DOMContentLoaded', function() {
    const cityDropdown = document.getElementById('cityDropdown');
    const locationResult = document.getElementById('locationResult');
    let cityData = [];

    // Add event listener for city selection
    cityDropdown.addEventListener('change', function() {
        const selectedCity = cityDropdown.value;
        if (selectedCity) {
            displaySelectedCity(selectedCity);
        }
    });

    // Add event listener for button click
    document.getElementById('getLocationButton').addEventListener('click', getLocation);

    // Fetch selected cities
    const cities = ['New York', 'Chicago', 'Los Angeles', 'Boston', 'Toronto'];

    // Fetch initial city data and populate dropdown
    fetchCityData(cities);
    populateDropdown(cities);

    // Function to fetch city data
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
            .then(newCityData => {
                // Update the cityData array
                cityData = newCityData;
            })
            .catch(error => {
                console.error('Error fetching city data:', error);
            });
    }

    // Function to populate dropdown menu
    function populateDropdown(cities) {
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityDropdown.appendChild(option);
        });
    }

    // Function to display information for the selected city
    function displaySelectedCity(selectedCity) {
        // Find the data for the selected city in the cityData array
        const selectedCityData = cityData.find(city => city.city === selectedCity);

        // Display the information for the selected city
        if (selectedCityData) {
            const { sunrise, sunset } = selectedCityData;
            const info = document.createElement('p');
            info.innerHTML = `<strong>${selectedCity}:</strong> Sunrise at ${sunrise}, Sunset at ${sunset}`;
            locationResult.innerHTML = '';
            locationResult.appendChild(info);
        }
    }
});

// Function for button click and show error
function getLocation() {
    console.log("Button clicked");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('locationResult').innerHTML = "Geolocation is not supported by this browser.";
    }
}

// Function to get coordinates and information from API
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    document.getElementById('locationResult').innerHTML =
        `Latitude: ${latitude}<br>Longitude: ${longitude}<br>Accuracy: ${accuracy} meters`;
}

// Function for error handling
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
