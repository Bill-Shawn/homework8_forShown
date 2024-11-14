const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.OPENWEATHER_API_KEY;
console.log("API Key:", API_KEY);
app.use(express.static(''));
app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const { city, state } = req.query;

    if (!city || !state) {
        return res.status(400).json({ error: 'City and state are required' });
    }

    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.length) {
            console.error("Geocoding Error: Location not found");
            return res.status(404).json({ error: 'Location not found' });
        }

        const { lat, lon } = geoData[0];

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) {
            console.error("Weather Data Error:", weatherData.message);
            return res.status(500).json({ error: `Error fetching weather data: ${weatherData.message}` });
        }

        const result = {
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            wind_speed: weatherData.wind.speed,
            condition: weatherData.weather[0].main.toLowerCase()
        };
        res.json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
