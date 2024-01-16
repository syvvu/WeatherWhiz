document.addEventListener("DOMContentLoaded", function () {
  const weatherWidget = document.getElementById("weather-widget");
  const loadingMessage = document.getElementById("loading-message");
  const getCity = document.getElementById("city-name");
  const localTimeElement = document.getElementById("local-time");
  const weatherIcon = document.getElementById("weather-icon");
  const weatherDetails = document.getElementById("weather-details");
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
          calculateLocalTime(data.timeZone);
          updateWeatherUI(data.currentWeather, data.cityName);
          setInterval(() => calculateLocalTime(data.timeZone), 1000);
        } else {
          loadingMessage.textContent = "Oops..Weather data unavailable ❄️";

          weatherWidget.style.display = "none";
          loadingMessage.style.display = "block";
        }
      })
      .catch((error) => {
        loadingMessage.textContent = "Oops..Location data unavailable ❄️";

        weatherWidget.style.display = "none";
        loadingMessage.style.display = "block";
      });
  }

  function calculateLocalTime(timeZone) {
    const now = new Date();
    const localTime = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(now);

    localTimeElement.textContent = localTime;
  }

  function updateWeatherUI(weatherData, cityName) {
    weatherWidget.style.display = "block";
    loadingMessage.style.display = "none";
    loadingMessage.textContent = "Summoning the weather spirits... 🌩️✨";

    getCity.textContent = `Current Weather at ${cityName}`;

    let iconName;

    switch (weatherData.shortForecast) {
      case "Partly Cloudy":
        iconName = "partly-cloudy";
        break;
      case "Mostly Sunny":
        iconName = "mostly-sunny";
        break;
      case "Sunny":
        iconName = "sunny";
        break;
      case "Mostly Clear":
        iconName = "mostly-clear";
        break;
      case "Patchy Fog":
        iconName = "patchy-fog";
        break;
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

  function handleWeatherRequest() {
    const zipCode = zipCodeInput.value;
    if (zipCode) {
      weatherWidget.style.display = "none";
      loadingMessage.style.display = "block";
      loadingMessage.textContent = "Summoning the weather spirits... 🌩️✨";
      fetchWeather(zipCode);
    } else {
      alert("Please enter a valid zip code.");
    }
  }

  zipCodeInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      handleWeatherRequest();
    }
  });

  getWeatherButton.addEventListener("click", handleWeatherRequest);
});
