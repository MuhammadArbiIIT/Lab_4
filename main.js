document.addEventListener('DOMContentLoaded', function () {
    const cityDropdown = document.getElementById('cityDropdown');
    const locationResult = document.getElementById('locationResult');
    let cityData = [];

    // Coordinates for each city
    const cityCoordinates = {
        'New York': { latitude: 40.71427, longitude: -74.00597 },
        'Chicago': { latitude: 41.85003, longitude: -87.65005 },
        'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
        'Boston': { latitude: 42.3601, longitude: -71.0589 },
        'Toronto': { latitude: 43.6532, longitude: -79.3832 }
    };

    // Function to create a data element with a specific class
    function createDataElement(label, value, className, parent) {
        const element = document.createElement('p');
        element.innerHTML = `<strong>${label}:</strong> ${value}`;
        element.classList.add(className);
        parent.appendChild(element);
    }

    // Add event listener for city selection
    cityDropdown.addEventListener('change', function () {
        const selectedCity = cityDropdown.value;
        fetchCityData(selectedCity);
    });

    // Add event listener for button click
    document.getElementById('getLocationButton').addEventListener('click', getLocation);

    // Fetch initial city data
    fetchCityData('New York');
    populateDropdown(Object.keys(cityCoordinates));

    // Function to fetch city data
    async function fetchCityData(selectedCity) {
        const apiUrl = 'https://api.sunrisesunset.io/json?';
        const { latitude, longitude } = cityCoordinates[selectedCity];

        const cityUrl = `${apiUrl}lat=${latitude}&lng=${longitude}`;
        try {
            const response = await fetch(cityUrl);
            const data = await response.json();
            const cityDataItem = {
                city: selectedCity,
                sunrise: data.results.sunrise,
                sunset: data.results.sunset,
                dawn: data.results.dawn,
                dusk: data.results.dusk,
                solar_noon: data.results.solar_noon,
                day_length: data.results.day_length,
                timezone: data.results.timezone
            };

            cityData = [cityDataItem];
            displaySelectedCity(selectedCity);
        } catch (error) {
            console.error(`Error fetching data for ${selectedCity}:`, error);
            cityData = [{
                city: selectedCity,
                sunrise: 'N/A',
                sunset: 'N/A',
                dawn: 'N/A',
                dusk: 'N/A',
                solar_noon: 'N/A',
                day_length: 'N/A',
                timezone: 'N/A'
            }];
            displaySelectedCity(selectedCity);
        }
        // Call fetchNextDayData here to fetch data for the next day
        await fetchNextDayData(selectedCity);
    }

    // Function to fetch city data for the next day
    async function fetchNextDayData(selectedCity) {
        const apiUrl = 'https://api.sunrisesunset.io/json?';
        const { latitude, longitude } = cityCoordinates[selectedCity];

        // Get the date for the next day
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextDay = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Build the API URL for the next day
        const nextDayUrl = `${apiUrl}lat=${latitude}&lng=${longitude}&date=${nextDay}`;

        try {
            const response = await fetch(nextDayUrl);
            const data = await response.json();
            const nextDayDataItem = {
                city: selectedCity,
                sunrise: data.results.sunrise,
                sunset: data.results.sunset,
                dawn: data.results.dawn,
                dusk: data.results.dusk,
                solar_noon: data.results.solar_noon,
                day_length: data.results.day_length,
                timezone: data.results.timezone
            };

            // Append the next day data to the cityData array
            cityData.push(nextDayDataItem);
            displaySelectedCity(selectedCity);
        } catch (error) {
            console.error(`Error fetching data for ${selectedCity} (next day):`, error);
        }
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

    function displaySelectedCity(selectedCity) {
        const selectedCityData = cityData.find(city => city.city === selectedCity);

        if (selectedCityData) {
            const { sunrise, sunset, dawn, dusk, solar_noon, day_length, timezone } = selectedCityData;
            const info = document.createElement('div');

            // Create elements for different data points and add classes
            createDataElement('Sunrise (Today)', sunrise, 'sunrise', info);
            createDataElement('Sunset (Today)', sunset, 'sunset', info);
            createDataElement('Dawn (Today)', dawn, 'dawn', info);
            createDataElement('Dusk (Today)', dusk, 'dusk', info);
            createDataElement('Solar Noon (Today)', solar_noon, 'solar-noon', info);
            createDataElement('Day Length (Today)', day_length, 'day-length', info);
            createDataElement('Timezone (Today)', timezone, 'timezone', info);

            // Check if there is data for the next day
            if (cityData.length > 1) {
                const nextDayData = cityData[1];

                if (nextDayData) {
                    const { sunrise: nextSunrise, sunset: nextSunset, dawn: nextDawn, dusk: nextDusk, solar_noon: nextSolarNoon, day_length: nextDayLength } = nextDayData;

                    // Create elements for next day data
                    createDataElement('Sunrise (Next Day)', nextSunrise, 'sunrise2', info);
                    createDataElement('Sunset (Next Day)', nextSunset, 'sunset2', info);
                    createDataElement('Dawn (Next Day)', nextDawn, 'dawn2', info);
                    createDataElement('Dusk (Next Day)', nextDusk, 'dusk2', info);
                    createDataElement('Solar Noon (Next Day)', nextSolarNoon, 'solar-noon2', info);
                    createDataElement('Day Length (Next Day)', nextDayLength, 'day-length2', info);
                } else {
                    // Handle the case where there is no data for the next day
                    createDataElement('Next Day Data', 'N/A', 'no-data', info);
                }
            }

            locationResult.innerHTML = '';
            locationResult.appendChild(info);
        }
    }

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
});
