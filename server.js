const express = require('express');
const axios = require('axios').default;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/', async (req, res) => {
  try {
    const { zipCode } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // Geocoding API call
    const geocodingResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`);
    const geocodingData = geocodingResponse.data;

    if (geocodingData.status === 'OK' && geocodingData.results && geocodingData.results[0] && geocodingData.results[0].geometry && geocodingData.results[0].geometry.location) {
      const location = geocodingData.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;
      const cityName = geocodingData.results[0].address_components[1].long_name;

      // Weather API calls
      const weatherResponse = await axios.get(`https://api.weather.gov/points/${latitude},${longitude}`);
      const weatherData = weatherResponse.data;

      if (weatherData.properties && weatherData.properties.forecast) {
        const forecastResponse = await axios.get(weatherData.properties.forecast);
        const forecastData = forecastResponse.data;
        const currentWeather = forecastData.properties.periods[0];

        return res.json({ success: true, currentWeather, latitude, longitude, cityName});
      } else {
        return res.json({ success: false, message: 'Weather data not available' });
      }
    } else {
      return res.json({ success: false, message: 'Location data not available' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({ success: false, message: 'Internal server error' });
  }
});

// Server startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});