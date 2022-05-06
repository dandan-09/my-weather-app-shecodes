let now = new Date();
let currentDate = document.querySelector("#date");
let currentTime = document.querySelector("#clock");
let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let year = now.getFullYear();
let date = now.getDate();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let months = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];
currentDate.innerHTML = `${day}, ${date} ${month}, ${year}`;
currentTime.innerHTML = `${hour}:${minutes}`;

function search(city) {
  let apiKey = "13b94033b60914cbb8ecf6edd8947b96";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-text-input");
  let city = `${cityInput.value}`;
  search(city);
}

let searchForm = document.querySelector("#input-city");
searchForm.addEventListener("submit", handleSubmit);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let forecastDay = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[forecastDay];
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
  <div class="weather-forecast">
  <div class="row">
  <div class="col-5" id="forecast-date">${formatDay(forecastDay.dt)}</div>
  <div class="col-4"><img src="http://openweathermap.org/img/wn/${
    forecastDay.weather[0].icon
  }@2x.png" alt=Clouds width="38" /></div>
  <div class="col-2"><span class="max-forecast-temp">${Math.round(
    forecastDay.temp.max
  )}°C</span> | <span class="min-forecast-temp">${Math.round(
          forecastDay.temp.min
        )}°C</span></div>
  </div>
  </div>`;
      forecastElement.innerHTML = forecastHTML;
    }
  });
}

function getForecast(coordinates) {
  let apiKey = "13b94033b60914cbb8ecf6edd8947b96";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function showTemperature(response) {
  document.querySelector("#city-element").innerHTML = response.data.name;
  document.querySelector("#main-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = `${Math.round(
    response.data.main.humidity
  )}%`;
  document
    .querySelector("#main-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#main-icon")
    .setAttribute("alt", response.data.weather[0].description);
  celsiusTemperature = Math.round(response.data.main.temp);

  getForecast(response.data.coord);
}

function showLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "13b94033b60914cbb8ecf6edd8947b96";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function getCurrentLocation() {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}

function showFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  document.querySelector("#main-temperature").innerHTML =
    Math.round(fahrenheitTemp);
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelector("#main-temperature").innerHTML =
    Math.round(celsiusTemperature);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-temperature");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-temperature");
celsiusLink.addEventListener("click", showCelsiusTemperature);

search("London");
