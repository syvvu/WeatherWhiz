const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  const latitude = "32.8328";
  const longitude = "-117.2713";

  try {
    const response = await axios.get(`https://api.weather.gov/points/${latitude},${longitude}`);
    const forecastURL = response.data.properties.forecast;
    const forecastResponse = await axios.get(forecastURL);

    res.json(forecastResponse.data.properties.periods[0]);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
