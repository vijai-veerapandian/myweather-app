import React from 'react';
import './weather-news.css';

const WeatherNews = ({ summary, flagUrl }) => {
  return (
    <div className="weather-news">
      <h2>Weather News Summary</h2>
      <p>{summary}</p>
      {flagUrl && (
        <div className="flag-container">
          <img src={flagUrl} alt="Country Flag" className="flag-image" />
        </div>
      )}
    </div>
  );
};

export default WeatherNews;