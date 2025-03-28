import React, { useState } from 'react';
import './App.css';
import './quotes-service/quote-service.css'; 
import Search from './components/search/search';
import Forecast from './components/forecast/forecast';
import CurrentWeather from './components/current-weather/current-weather';
import fetchQuote from './quotes-service/quote-service';
import QuoteDisplay from './quotes-service/QuoteDisplay';
import { WEATHER_API_URL, WEATHER_API_KEY } from './api';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [quote, setQuote] = useState(null); 

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const CurrentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}&&units=metric`)
    const ForecastWeatherFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}&&units=metric`)
    
    Promise.all([CurrentWeatherFetch, ForecastWeatherFetch])
      .then(async (response) => {
        if (!response[0].ok || !response[1].ok) {
          throw new Error('Failed to fetch weather data');
        }
  
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });

        const quote = await fetchQuote(searchData.label);
        setQuote(quote);
      })
      .catch(err => {
        console.error('Error fetching weather data:', err);
      });
  }

  console.log(currentWeather);
  console.log(forecast);
  console.log(quote);

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {quote && <QuoteDisplay quote={quote} />}
      {forecast && <Forecast data={forecast}/>}
    </div>
  );
}

export default App;