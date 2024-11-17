// Coded by Lamla Mhlana

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#weather-description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind-speed");
  let iconElement = document.querySelector("#weather-icon");

  let temperature = Math.round(response.data.temperature.current);
  let city = response.data.city;
  let description = response.data.condition.description;
  let humidity = response.data.temperature.humidity;
  let windSpeed = Math.round(response.data.wind.speed * 3.6); // Convert m/s to km/h
  let iconUrl = response.data.condition.icon_url;

  cityElement.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
  temperatureElement.innerHTML = `${temperature}°C`;
  descriptionElement.innerHTML = description.charAt(0).toUpperCase() + description.slice(1);
  humidityElement.innerHTML = humidity;
  windElement.innerHTML = windSpeed;
  iconElement.src = iconUrl;
  iconElement.style.display = "block";
}

function displayForecast(response) {
  let forecastContainer = document.querySelector("#forecast-container");
  forecastContainer.innerHTML = "";

  response.data.daily.slice(0, 5).forEach(day => {
    let forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-day");
    forecastElement.innerHTML = `
      <p>${new Date(day.time * 1000).toLocaleDateString("en-US", { weekday: 'short' })}</p>
      <img src="${day.condition.icon_url}" alt="${day.condition.description}" />
      <p>${Math.round(day.temperature.day)}°C</p>
    `;
    forecastContainer.appendChild(forecastElement);
  });
}

function handleError(error) {
  alert("Unable to retrieve weather data. Please check the city name and try again.");
}

function search(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  let city = searchInputElement.value.trim();

  if (city) {
    let apiKey = "b2a5adcct04b33178913oc335f405433";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

    axios.get(apiUrl).then(displayTemperature).catch(handleError);

    let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
    axios.get(forecastUrl).then(displayForecast).catch(handleError);
  } else {
    alert("Please enter a city name.");
  }
}

function formatDate(date) {
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let hours = date.getHours().toString().padStart(2, '0');
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let formattedDay = days[date.getDay()];

  return `${formattedDay} ${hours}:${minutes}`;
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

let currentDateElement = document.querySelector("#current-date");
let currentDate = new Date();
currentDateElement.innerHTML = formatDate(currentDate);
