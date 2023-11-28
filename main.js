document.addEventListener('DOMContentLoaded', function () {
    const cityDropdown = document.getElementById('cityDropdown');
    const locationResult = document.getElementById('locationResult');
    let cityData = [];
  
    // Hardcoded coordinates for each city
    const cityCoordinates = {
      'New York': { latitude: 40.7128, longitude: -74.0060 },
      'Chicago': { latitude: 41.8781, longitude: -87.6298 },
      'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
      'Boston': { latitude: 42.3601, longitude: -71.0589 },
      'Toronto': { latitude: 43.6532, longitude: -79.3832 }
    };
  
    // Add event listener for city selection
    cityDropdown.addEventListener('change', function () {
      const selectedCity = cityDropdown.value;
      const selectedCityCoords = cityCoordinates[selectedCity];
      
      if (selectedCityCoords) {
        fetchCityData(selectedCity, selectedCityCoords.latitude, selectedCityCoords.longitude)
          .then(() => displaySelectedCity(selectedCity))
          .catch(error => console.error('Error fetching and displaying data:', error));
      }
    });
  
    // Add event listener for button click
    document.getElementById('getLocationButton').addEventListener('click', getLocation);
  
    // Fetch selected cities
    const cities = ['New York', 'Chicago', 'Los Angeles', 'Boston', 'Toronto'];
  
    // Function to fetch city data
    async function fetchCityData(city, latitude, longitude) {
      const apiUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`;
  
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
  
        const cityInfo = {
          city,
          sunrise: data.results.sunrise,
          sunset: data.results.sunset,
          solar_noon: data.results.solar_noon,
          dawn: data.results.dawn,
          dusk: data.results.dusk,
          day_length: data.results.day_length,
          timezone: data.results.timezone
        };
  
        cityData = [cityInfo]; // Update cityData array
      } catch (error) {
        console.error(`Error fetching data for ${city}:`, error);
        cityData = [{
          city,
          sunrise: 'N/A',
          sunset: 'N/A',
          solar_noon: 'N/A',
          dawn: 'N/A',
          dusk: 'N/A',
          day_length: 'N/A',
          timezone: 'N/A'
        }];
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
  
    // Function to display information for the selected city
    function displaySelectedCity(selectedCity) {
      // Find the data for the selected city in the cityData array
      const selectedCityData = cityData.find(city => city.city === selectedCity);
  
      // Display the information for the selected city
      if (selectedCityData) {
        const { sunrise, sunset, solar_noon, dawn, dusk, day_length, timezone } = selectedCityData;
        const info = document.createElement('p');
        info.innerHTML = `<strong>${selectedCity}:</strong> Sunrise at ${sunrise}, Sunset at ${sunset}, Solar Noon at ${solar_noon}, Dawn at ${dawn}, Dusk at ${dusk}, Day Length: ${day_length}, Timezone: ${timezone}`;
        locationResult.innerHTML = '';
        locationResult.appendChild(info);
      }
    }
  
    // Populate dropdown menu and fetch initial city data
    populateDropdown(cities);
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
     
    }
}