document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("js-content").style.display = "block";

  const weatherIcon = document.getElementById("weather-icon");
  const weatherDetails = document.getElementById("weather-details");
  const currentTime = document.getElementById("current-time");

  function fetchWeather() {
    fetch('/weather')
      .then((response) => response.json())
      .then((data) => updateWeatherUI(data))
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        weatherDetails.innerHTML = "Current Weather Conditions Unavailable";
      });
  }

  function updateTime() {
    const now = new Date();
    currentTime.textContent = now.toLocaleTimeString();
  }

  function updateWeatherUI(weatherData) {
    let iconName;

    switch (weatherData.shortForecast) {
      case "Partly Cloudy":
        iconName = "partly-cloudy";
      case "Mostly Sunny":
        iconName = "mostly-sunny";
      case "Sunny":
        iconName = "sunny";
      case "Mostly Clear":
        iconName = "mostly-clear";
      case "Patchy Fog":
        iconName = "patchy-fog";
      case "Patchy Fog then Mostly Sunny":
        iconName = "fog-then-sunny";
        break;
      default:
        iconName = "idea";
    }

    weatherIcon.src = `./assets/${iconName}.png`;

    const details = `
      <div class="weather-detail"><strong>Temperature:</strong> ${weatherData.temperature}°${weatherData.temperatureUnit}</div>
      <div class="weather-detail"><strong>Condition:</strong> ${weatherData.shortForecast}</div>
      <div class="weather-detail"><strong>Wind:</strong> ${weatherData.windSpeed} ${weatherData.windDirection}</div>
      <div class="weather-detail"><strong>Humidity:</strong> ${weatherData.relativeHumidity.value}%</div>
      <div class="weather-detail"><strong>Description:</strong> ${weatherData.detailedForecast}</div>
    `;

    weatherDetails.innerHTML = details;
  }

  const modeToggle = document.getElementById("mode-toggle");
  let currentMode = localStorage.getItem("mode") || "light";

  modeToggle.addEventListener("click", () => {
    if (currentMode === "light") {
      document.body.classList.add("dark-mode");
      currentMode = "dark";
      modeToggle.innerHTML = "Light Mode";
    } else {
      document.body.classList.remove("dark-mode");
      currentMode = "light";
      modeToggle.innerHTML = "Dark Mode";
    }
    localStorage.setItem("mode", currentMode);
  });

  setInterval(updateTime, 1000);
  fetchWeather();
  setInterval(fetchWeather, 600000);
});
