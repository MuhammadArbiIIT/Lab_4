document.addEventListener('DOMContentLoaded', function () {
  const cityDropdown = document.getElementById('cityDropdown');
  const locationResult = document.getElementById('locationResult');
  let cityData = [];

  // Add event listener for city selection
  cityDropdown.addEventListener('change', function () {
    const selectedCity = cityDropdown.value;
    fetchCityData([selectedCity])
      .then(() => displaySelectedCity(selectedCity))
      .catch(error => console.error('Error fetching and displaying data:', error));
  });

  // Add event listener for button click
  document.getElementById('getLocationButton').addEventListener('click', getLocation);

  // Fetch selected cities
  const cities = ['New York', 'Chicago', 'Los Angeles', 'Boston', 'Toronto'];

  // Function to fetch city data
  async function fetchCityData(cities) {
    const apiUrl = 'https://api.sunrise-sunset.org/json?';

    // Create an array of promises for each city
    const promises = cities.map(city => {
      const cityUrl = `${apiUrl}&q=${encodeURIComponent(city)}`;
      return fetch(cityUrl)
        .then(response => response.json())
        .then(data => {
          return {
            city,
            sunrise: data.results.sunrise,
            sunset: data.results.sunset,
            solar_noon: data.results.solar_noon,
            dawn: data.results.dawn,
            dusk: data.results.dusk,
            day_length: data.results.day_length,
            timezone: data.results.timezone
          };
        })
        .catch(error => {
          console.error(`Error fetching data for ${city}:`, error);
          return {
            city,
            sunrise: 'N/A',
            sunset: 'N/A',
            solar_noon: 'N/A',
            dawn: 'N/A',
            dusk: 'N/A',
            day_length: 'N/A',
            timezone: 'N/A'
          };
        });
    });

    // Resolve all promises
    cityData = await Promise.all(promises);
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
    default:
      document.getElementById('locationResult').innerHTML = "An unspecified error occurred.";
      break;
  }
}
