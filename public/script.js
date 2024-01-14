document.addEventListener("DOMContentLoaded", function () {

  const weatherIcon = document.getElementById("weather-icon");
  const weatherDetails = document.getElementById("weather-details");
  const currentTime = document.getElementById("current-time");
  const zipCodeInput = document.getElementById("zip-code");
  const getWeatherButton = document.getElementById("get-weather");

  function fetchWeather(zipCode) {
    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ zipCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Latitude:", data.latitude);
          console.log("Longitude:", data.longitude);
          updateWeatherUI(data.currentWeather);
        } else {
          console.error("Server response:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
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

  const modeToggle = document.getElementById("theme-toggle");
  let currentTheme = localStorage.getItem("theme") || "light";

  modeToggle.addEventListener("click", () => {
    var img = document.getElementById("theme-image");

    if (currentTheme === "light") {
      document.body.classList.add("dark-theme");
      currentTheme = "dark";
      img.src = "./assets/coffee-machine.png";
      img.alt = "Light Theme";
    } else {
      document.body.classList.remove("dark-theme");
      currentTheme = "light";
      img.src = "./assets/fried-chicken.png";
      img.alt = "Dark Theme";
    }
    localStorage.setItem("theme", currentTheme);
  });

  getWeatherButton.addEventListener("click", () => {
    const zipCode = zipCodeInput.value;
    if (zipCode) {
      fetchWeather(zipCode);
    } else {
      alert("Please enter a valid zip code.");
    }
  });

  setInterval(updateTime, 1000);
  fetchWeather();
  setInterval(fetchWeather, 600000);
});
