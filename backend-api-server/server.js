require('dotenv').config();
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const { Pool } = require('pg');
const axios = require('axios');
const promClient = require('prom-client');

const app = express();
const port = 5001;

// Enable CORS
app.use(cors());

// Function to create a Redis client with retry logic
const createRedisClient = () => {
  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        console.error('Redis connection refused. Retrying...');
      }
      if (options.total_retry_time > 1000 * 60) {
        // Stop retrying after 1 minute
        console.error('Retry time exhausted. Giving up on Redis.');
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        // Stop retrying after 10 attempts
        console.error('Too many attempts to connect to Redis. Giving up.');
        return undefined;
      }
      // Retry after 2 seconds
      return 2000;
    },
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis successfully!');
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  return redisClient;
};

// Initialize Redis client
const redisClient = createRedisClient();

// PostgreSQL client
// Function to create a PostgreSQL client with retry logic
const createPostgresClient = async () => {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Test the connection
      await pool.query('SELECT NOW()');
      console.log('Connected to PostgreSQL successfully!');
      return pool;
    } catch (err) {
      retries++;
      console.error(`PostgreSQL connection failed. Retrying (${retries}/${maxRetries})...`, err.message);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }
  }

  console.error('Failed to connect to PostgreSQL after maximum retries. Exiting...');
  process.exit(1); // Exit the application if connection fails
};

// Initialize PostgreSQL client
let pool;
(async () => {
  pool = await createPostgresClient();
})();

// Create a Registry which registers the metrics
const register = new promClient.Registry();

// Add default metrics collection
promClient.collectDefaultMetrics({ register });

// Define custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 750, 1000, 2000, 5000],
});

const httpRequestCount = new promClient.Counter({
  name: 'http_request_count',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Register custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestCount);

// Middleware to measure request duration and count
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route ? req.route.path : '', status_code: res.statusCode });
    httpRequestCount.inc({ method: req.method, route: req.route ? req.route.path : '', status_code: res.statusCode });
  });
  next();
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Pre-fetch data and store in Redis
const prefetchData = async () => {
  try {
      const lat = '45.424722222';
      const lon = '-75.695';
      const url = `${process.env.REACT_APP_WEATHER_API_URL}/weather`;
      const params = {
          lat,
          lon,
          units: 'metric',
          appid: process.env.REACT_APP_WEATHER_API_KEY,
      };

      console.log('Fetching weather data from:', url, params);

      const weatherResponse = await axios.get(url, { params });
      const weatherData = weatherResponse.data;

      redisClient.setex(`${lat},${lon}`, 3600, JSON.stringify(weatherData));
      console.log('Pre-fetched weather data and stored in Redis');
  } catch (error) {
      console.error('Error pre-fetching weather data:', error.response ? error.response.data : error.message);
  }
};

prefetchData();

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;

  // Check Redis cache
  redisClient.get(`${lat},${lon}`, async (err, data) => {
    if (err) {
      console.error('Error accessing Redis:', err);
      return res.status(500).send('Error accessing Redis');
    }

    if (data) {
      res.send(JSON.parse(data));
    } else {
      try {
        // Fetch data from OpenWeatherMap API
        const weatherResponse = await axios.get(`${process.env.REACT_APP_WEATHER_API_URL}/weather`, {
          params: {
            lat,
            lon,
            units: 'metric',
            appid: process.env.REACT_APP_WEATHER_API_KEY,
          },
        });
        const weatherData = weatherResponse.data;

        // Save response in Redis cache
        redisClient.setex(`${lat},${lon}`, 3600, JSON.stringify(weatherData));

        // Save response in PostgreSQL
        await pool.query('INSERT INTO weather_data (lat, lon, data) VALUES ($1, $2, $3)', [lat, lon, weatherData]);

        res.send(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching weather data');
      }
    }
  });
});

app.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    // Fetch data from OpenWeatherMap API
    const forecastResponse = await axios.get(`${process.env.REACT_APP_WEATHER_API_URL}/forecast`, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: process.env.REACT_APP_WEATHER_API_KEY,
      },
    });
    const forecastData = forecastResponse.data;

    res.send(forecastData);
  } catch (error) {
    console.error('Error fetching forecast data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching forecast data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
