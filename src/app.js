let dayNow = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let day = days[dayNow.getDay()];
let date = dayNow.getDate();

let month = months[dayNow.getMonth()];

let nowDay = document.querySelector(".now-day");
nowDay.innerHTML = `${day}`;
let nowDate = document.querySelector(".date");
nowDate.innerHTML = ` / ${date} ${month}`;

let hours = dayNow.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = dayNow.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let nowTime = document.querySelector(".timetoday");
nowTime.innerHTML = `${hours}:${minutes}`;
/* для более сложных вариантов, лучше писать через формулу *(ниже)
сейчас формула только для времени, но можно сделать и для даты и 
в случае, если дата и время вместе, то для всего вместе (один id или class для всех).
*function fullTime(time) {
  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;}
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;}
  return `${hours}:${minutes}`;}
let nowTime = document.querySelector(".timetoday");
nowTime.innerHTML = fullTime(dayNow);
ВАЖНО - что если пишу формулу, то уже для получения актуальных значений
использую не dayNow из (let dayNow = new Date();)
а беру то, что поставила в формулу. В данном случае time ( time.getHours();)
*/

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  /*let days = ["Wed", "Thu", "Fri", "Sat", "Sun"]; */
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      forecastHTML =
        forecastHTML +
        ` <div class="col">
          <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
          <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="52"
        />
            <div class="forecast-temp">
              <span class="forecast-temp-max">${Math.round(
                forecastDay.temp.max
              )}°</span>
              <span class="forecast-temp-min">${Math.round(
                forecastDay.temp.min
              )}°</span>
            </div>
          </div>
        `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "701f06352d61835bc4fc894e7b084629";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
} /*!!!!!!!!!!*/

function showTemperature(response) {
  let cityName = document.querySelector("h2");
  cityName.innerHTML = `🌍${response.data.name}`;
  let Temperature = document.querySelector("#gradtoday");
  Temperature.innerHTML = Math.round(response.data.main.temp);
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )}km/h`;
  document.querySelector(".description").innerHTML =
    response.data.weather[0].main;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord); /*!!!!!!!!!!*/
}

function searchCity(city) {
  let apiKey = "701f06352d61835bc4fc894e7b084629";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  searchCity(city);
}
/*можно то что сверху написано в двух ф-ях function searchCity(city) и function handleSubmit(event), 
расписать через одну функцию, как ниже :)
function search(event) {
  event.preventDefault();
  let apiKey = "ed55b36e362d8733f7d859247cedeaf2";
  let city = document.querySelector("#search-text-input").value;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);}*/

/*function convertFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#gradtoday");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheiTemperature);
} 
function convertCelsius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#gradtoday");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  tempElement.innerHTML = Math.round(celsiusTemperature);
}
*/
function searchLocation(position) {
  /* console.log(position); */
  let apiKey = "701f06352d61835bc4fc894e7b084629";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

/*let celsiusTemperature = null; */
/* ввела внешнюю переменную для использования в любых ф-циях
 и самой переменной и присвоенных ей значений в любых функциях */

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

/*let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertFahrenheit); */

/*let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertCelsius); */

searchCity("London");
/* чтобы изначально было не пустое значение, а сразу показывало для Лондона */
/*displayForecast(); */
