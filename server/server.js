const express = require('express');
const cors = require('cors');
const redis = require('redis');
const { Pool } = require('pg');
const fetch = require('node-fetch');

const app = express();
const port = 5001;

// Enable CORS
app.use(cors());

// Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// PostgreSQL client
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  // Check Redis cache
  redisClient.get(`${lat},${lon}`, async (err, data) => {
    if (err) throw err;

    if (data) {
      res.send(JSON.parse(data));
    } else {
      try {
        // Fetch data from OpenWeatherMap API
        const weatherResponse = await fetch(`${process.env.WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`);
        const weatherData = await weatherResponse.json();

        // Save response in Redis cache
        redisClient.setex(`${lat},${lon}`, 3600, JSON.stringify(weatherData));

        // Save response in PostgreSQL
        await pool.query('INSERT INTO weather_data (lat, lon, data) VALUES ($1, $2, $3)', [lat, lon, weatherData]);

        res.send(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).send('Error fetching weather data');
      }
    }
  });
});

app.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    // Fetch data from OpenWeatherMap API
    const forecastResponse = await fetch(`${process.env.WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`);
    const forecastData = await forecastResponse.json();

    res.send(forecastData);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    res.status(500).send('Error fetching forecast data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});