/*Powered by SunriseSunset.io*/
document.addEventListener('DOMContentLoaded', function () {
    const cityDropdown = document.getElementById('cityDropdown');
    const locationResult = document.getElementById('locationResult');
    const getLocationButton = document.getElementById('getLocationButton');
    const resultDataButton = document.getElementById('resultDataButton');
    let cityData = [];
//array of city names
    const cityCoordinates = {
        'New York': { latitude: 40.71427, longitude: -74.00597 },
        'Chicago': { latitude: 41.85003, longitude: -87.65005 },
        'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
        'Boston': { latitude: 42.3601, longitude: -71.0589 },
        'Toronto': { latitude: 43.6532, longitude: -79.3832 }
    };
//function to get the current location
    function createDataElement(label, value, className, parent) {
        const element = document.createElement('p');
        element.innerHTML = `<strong>${label}:</strong> ${value}`;
        element.classList.add(className);
        parent.appendChild(element);
    }

    cityDropdown.addEventListener('change', function () {
        fetchCityData(cityDropdown.value);
    });

    getLocationButton.addEventListener('click', getLocation);

    fetchCityData('New York')
        .then(() => showImages())
        .catch(error => console.error('Error fetching New York data:', error));
    populateDropdown(Object.keys(cityCoordinates));

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
        await fetchNextDayData(selectedCity);
    }
//function to get json data from api.sunrisesunset.io
    async function fetchNextDayData(selectedCity) {
        const apiUrl = 'https://api.sunrisesunset.io/json?';
        const { latitude, longitude } = cityCoordinates[selectedCity];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextDay = tomorrow.toISOString().split('T')[0];
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

            cityData.push(nextDayDataItem);
            displaySelectedCity(selectedCity);
        } catch (error) {
            console.error(`Error fetching data for ${selectedCity} (next day):`, error);
        }
    }

    function populateDropdown(cities) {
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityDropdown.appendChild(option);
        });
    }
//function to create elements to display json data
    function displaySelectedCity(selectedCity) {
        const selectedCityData = cityData.find(city => city.city === selectedCity);

        if (selectedCityData) {
            const { sunrise, sunset, dawn, dusk, solar_noon, day_length, timezone } = selectedCityData;
            const info = document.createElement('div');

            createDataElement('Sunrise (Today)', sunrise, 'sunrise', info);
            createDataElement('Sunset (Today)', sunset, 'sunset', info);
            createDataElement('Dawn (Today)', dawn, 'dawn', info);
            createDataElement('Dusk (Today)', dusk, 'dusk', info);
            createDataElement('Solar Noon (Today)', solar_noon, 'solar-noon', info);
            createDataElement('Day Length (Today)', day_length, 'day-length', info);
            createDataElement('Timezone (Today)', timezone, 'timezone', info);

            if (cityData.length > 1) {
                const nextDayData = cityData[1];

                if (nextDayData) {
                    const { sunrise: nextSunrise, sunset: nextSunset, dawn: nextDawn, dusk: nextDusk, solar_noon: nextSolarNoon, day_length: nextDayLength } = nextDayData;

                    createDataElement('Sunrise (Next Day)', nextSunrise, 'sunrise2', info);
                    createDataElement('Sunset (Next Day)', nextSunset, 'sunset2', info);
                    createDataElement('Dawn (Next Day)', nextDawn, 'dawn2', info);
                    createDataElement('Dusk (Next Day)', nextDusk, 'dusk2', info);
                    createDataElement('Solar Noon (Next Day)', nextSolarNoon, 'solar-noon2', info);
                    createDataElement('Day Length (Next Day)', nextDayLength, 'day-length2', info);
                } else {
                    createDataElement('Next Day Data', 'N/A', 'no-data', info);
                }
            }

            locationResult.innerHTML = '';
            locationResult.appendChild(info);
        }
    }

    let isButtonClicked = false; // Flag to check if the button is clicked
    let isLocationFetched = false; // Flag to check if the location has been fetched
//function for getlocationbutton to gather user location and display images
    function getLocation() {
        console.log("Button clicked");
        document.body.classList.toggle('button-pressed');
    
        if (navigator.geolocation && !isLocationFetched) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
            isLocationFetched = true;
        } else {
            locationResult.innerHTML = "Geolocation is not supported by this browser.";
        }
    
        setTimeout(() => {
            if (isButtonClicked) {
                fetchCityData('New York');
                showImages();
                isButtonClicked = false;
                getLocation();
            }
        }, 3000);
    
        isButtonClicked = true;
    }
    
    function showImages() {
        console.log('showImages function called');
    
        const imgContainer = document.getElementById('img-container');
        const imgContainer2 = document.getElementById('img-container2');
    
        imgContainer.classList.remove('hide-images');
        imgContainer2.classList.remove('hide-images');
    }
    
    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;
    
        locationResult.innerHTML = `Latitude: ${latitude}<br>Longitude: ${longitude}<br>Accuracy: ${accuracy} meters`;
    }
    //error handler for geolocation 
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                locationResult.innerHTML = "User denied the request for Geolocation.";
                break;
            default:
                locationResult.innerHTML = "An unspecified error occurred.";
                break;
        }
    }
});