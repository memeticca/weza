const API =
  "https://api.weatherapi.com/v1/current.json?key=b502083565da49e39d3165635232002&q=";

const getCurrentWeather = async (city) =>
  fetch(`${API}${city}`).then((response) => response.json());

const getWeatherForecast = async (city, days) =>
  fetch(`${API.replace("current", "forecast")}${city}&days=${days}`).then(
    (response) => response.json()
  );

const generateMainCard = (currentWeather) => {
  const {
    location: { name, region },
    current: {
      temp_c: temperature,
      condition: { text: currentCondition, icon: conditionIcon },
    },
  } = currentWeather;

  return `
    <img src="https:${conditionIcon.replace("64x64", "128x128")}" />
    <div class="main-card__header">
      <p>${name},</p>
      <p>${region}</p>
    </div>
    <h1>${temperature}°</h1>
    <p>${currentCondition}</p>
  `;
};

const generateWeatherCard = (currentWeather) => {
  const {
    location: { name },
    current: {
      temp_c: temperature,
      feelslike_c: FeelsLikeTemperature,
      pressure_mb: pressure,
      humidity,
      wind_kph: windVelocity,
      wind_dir: windDirection,
    },
  } = currentWeather;

  return `
    <h3>Weather in ${name}</h3>
    <div class="main-weather-card__feels-like">
      <h1>${FeelsLikeTemperature}°</h1>
      <p>Feels like</p>
    </div>
    <div class="main-weather-card__info-container">
      <div class="weather-info">
        <div class="weather-info__header">
          <img class="weater-info__icon" src="images/temperature.png" />
          <p>Temperature</p>
        </div>
        <p>${temperature}°</p>
      </div>
      <div class="weather-info">
        <div class="weather-info__header">
          <img class="weater-info__icon" src="images/humidity.png" />
          <p>Humidity</p>
        </div>
        <p>${humidity}%</p>
      </div>
      <div class="weather-info">
        <div class="weather-info__header">
          <img class="weater-info__icon" src="images/pressure.png" />
          <p>Pressure</p>
        </div>
        <p>${pressure} mb</p>
      </div>
      <div class="weather-info">
        <div class="weather-info__header">
          <img class="weater-info__icon" src="images/wind.png" />
          <p>Wind</p>
        </div>
        <p>${windDirection}, ${windVelocity} km/h</p>
      </div>
    </div>
  `;
};

const generateHourlyForecast = (weatherForecast, count) => {
  const currentDate = new Date();
  let cardHtml = ``;
  const {
    forecast: {
      forecastday: [today],
    },
  } = weatherForecast;

  const hoursAvaible = Object.keys(today.hour).length - currentDate.getHours();
  for (let i = 0; i < hoursAvaible; i++) {
    const {
      time,
      temp_c: temperature,
      condition: { icon },
      humidity,
    } = today.hour[currentDate.getHours() + i];
    const date = new Date(time);

    cardHtml += `
      <div class="forecast">
        <p>${date.getHours()}:00</p>
        <h1>${temperature}°</h1>
        <img
          class="forecast__icon"
          src="https:${icon.replace("64x64", "128x128")}"
        />
        <div class="forecast__humidity">
          <img src="images/humidity.png" />
          <p>${humidity}%</p>
        </div>
      </div>
    `;
  }

  return cardHtml;
};

const generateDailyForecast = (weatherForecast, count) => {
  let cardHtml = ``;
  const {
    forecast: { forecastday },
  } = weatherForecast;

  for (let i = 0; i < Math.min(Object.keys(forecastday).length, count); i++) {
    const {
      date: forecastDate,
      day: {
        maxtemp_c: temperature,
        condition: { icon },
        avghumidity: humidity,
      },
    } = forecastday[i];
    const date = new Date(forecastDate);
    const month = date.getMonth() + 1;
    const day = date.getDate() + 1;

    cardHtml += `
      <div class="forecast">
        <p>${day}/${month > 9 ? `${month}` : `0${month}`}</p>
        <h1>${temperature}°</h1>
        <img
          class="forecast__icon"
          src="https:${icon.replace("64x64", "128x128")}"
        />
        <div class="forecast__humidity">
          <img src="images/humidity.png" />
          <p>${humidity}%</p>
        </div>
      </div>
    `;
  }

  return cardHtml;
};

const updateWeatherCards = async (city) => {
  const currentWeather = await getCurrentWeather(city);
  const weatherCard = document.querySelector(".main__weather-card");
  const mainCard = document.querySelector(".main__main-card");

  const weatherCardHtml = generateWeatherCard(currentWeather);
  const mainCardHtml = generateMainCard(currentWeather);

  weatherCard.innerHTML = weatherCardHtml;
  mainCard.innerHTML = mainCardHtml;
};

const updateForecastCards = async (city, days) => {
  const forecast = await getWeatherForecast(city, days);
  const dailyCardContainer = document.querySelector("#daily-card-container");
  const hourlyCardContainer = document.querySelector("#hourly-card-container");

  const dailyForecast = generateDailyForecast(forecast, days);
  const hourlyForecast = generateHourlyForecast(forecast, days);

  dailyCardContainer.innerHTML = dailyForecast;
  hourlyCardContainer.innerHTML = hourlyForecast;
};

const updateAll = (city) => {
  updateWeatherCards(city);
  updateForecastCards(city, 5);
};

updateAll("Paris");
