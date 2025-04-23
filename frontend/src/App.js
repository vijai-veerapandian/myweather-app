import React, { useState } from 'react';
import './App.css';
import Search from './components/search/search.js';
import Forecast from './components/forecast/forecast.js';
import CurrentWeather from './components/current-weather/current-weather.js';
import WeatherNews from './components/WeatherNews/WeatherNews.js';
import WeatherGraph from './components/WeatherGraph/WeatherGraph.js';
import fetchAndSummarizeWeatherNews from './services/gemini-service.js';
import { REACT_APP_WEATHER_API_URL, REACT_APP_WEATHER_API_KEY } from './api.js';

function App() {
    // State variables
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [weatherNewsSummary, setWeatherNewsSummary] = useState(null);
    const [flagUrl, setFlagUrl] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOnSearchChange = async (searchData) => {
        setIsLoading(true);
        setError(null);
        setCurrentWeather(null);
        setForecast(null);
        setHourlyForecast([]);
        setFlagUrl(null);
        setWeatherNewsSummary(null);
    
        if (!searchData || !searchData.value || typeof searchData.value !== 'string') {
            setError("Invalid search data provided.");
            setIsLoading(false);
            return;
        }
    
        const valueParts = searchData.value.split(" ");
        if (valueParts.length < 2) {
            setError("Invalid location data format.");
            setIsLoading(false);
            return;
        }
        const [lat, lon] = valueParts;
    
        try {
            const [weatherResponse, forecastResponse] = await Promise.all([
                fetch(`${REACT_APP_WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${REACT_APP_WEATHER_API_KEY}`),
                fetch(`${REACT_APP_WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${REACT_APP_WEATHER_API_KEY}`)
            ]);
    
            if (!weatherResponse.ok || !forecastResponse.ok) {
                throw new Error("Failed to fetch weather data.");
            }
    
            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();
    
            setCurrentWeather({ city: searchData.label, ...weatherData });
            setForecast({ city: searchData.label, ...forecastData });
    
            // Populate hourlyForecast with the next 24 hours of data
            const hourlyData = forecastData.list.slice(0, 8); // 8 entries for 24 hours (3-hour intervals)
            setHourlyForecast(hourlyData);
    
            const countryCode = weatherData.sys?.country || "unknown";
            const flagUrl = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
            setFlagUrl(flagUrl);
    
            const cityName = searchData.label || "the selected location";
    
            try {
                const newsSummary = await fetchAndSummarizeWeatherNews(cityName);
                setWeatherNewsSummary(newsSummary);
            } catch (newsError) {
                console.error("Error fetching weather news summary:", newsError.message);
                setWeatherNewsSummary("Unable to fetch weather news summary.");
            }
        } catch (err) {
            console.error("Error during data fetching:", err);
            setError(`Error: ${err.message || "Could not fetch data. Please check your connection or API keys."}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <Search onSearchChange={handleOnSearchChange} />
            {isLoading && <div className="loading-indicator">Loading weather data...</div>}
            {error && <div className="error-message">{error}</div>}
            {!isLoading && !error && (
                <>
                    <div className="main-container">
                        {currentWeather && <CurrentWeather flagUrl={flagUrl} data={currentWeather} />}
                        {weatherNewsSummary && <WeatherNews summary={weatherNewsSummary} />}
                        {hourlyForecast.length > 0 && <WeatherGraph data={hourlyForecast} />}
                    </div>
                    {forecast && <Forecast data={forecast} />}
                </>
            )}
        </div>
    );
}
export default App;