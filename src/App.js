import React, { useState } from 'react';
import './App.css';
import Search from './components/search/search.js';
import Forecast from './components/forecast/forecast.js';
import CurrentWeather from './components/current-weather/current-weather.js';
import WeatherNews from './components/WeatherNews/WeatherNews.js';
import fetchAndSummarizeWeatherNews from './services/gemini-service.js';
import { REACT_APP_WEATHER_API_URL, REACT_APP_WEATHER_API_KEY } from './api.js';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [weatherNewsSummary, setWeatherNewsSummary] = useState(null);
  const [flagUrl, setFlagUrl] = useState(null); // State to store the flag URL

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const CurrentWeatherFetch = fetch(
      `${REACT_APP_WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${REACT_APP_WEATHER_API_KEY}`
    );

    const ForecastWeatherFetch = fetch(
      `${REACT_APP_WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${REACT_APP_WEATHER_API_KEY}`
    );

    Promise.all([CurrentWeatherFetch, ForecastWeatherFetch])
      .then(async (response) => {
        if (!response[0].ok || !response[1].ok) {
          throw new Error("Failed to fetch weather data");
        }

        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });

        // Fetch and summarize weather news using Google Gemini
        try {
          const newsSummary = await fetchAndSummarizeWeatherNews(searchData.label);
          setWeatherNewsSummary(newsSummary);
        } catch (error) {
          console.error("Error fetching weather news summary:", error.message);
          setWeatherNewsSummary("Unable to fetch weather news at this time.");
        }

        // Fetch the flag URL
        const countryCode = weatherResponse.sys?.country || "unknown"; // Handle undefined country code
        const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`; // Generate the flag URL
        setFlagUrl(flagUrl);
      })
      .catch((err) => {
        console.error(err);
        setWeatherNewsSummary("Unable to fetch weather data at this time.");
      });
  };

  return (
    <div className="App">
      <Search onSearchChange={handleOnSearchChange} />
      <div className="main-container">
        {currentWeather && <CurrentWeather flagUrl={flagUrl} data={currentWeather} />}
        {weatherNewsSummary && (
          <WeatherNews summary={weatherNewsSummary} />
        )}
      </div>
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;