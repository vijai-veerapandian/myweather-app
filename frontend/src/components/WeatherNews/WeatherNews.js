import React from 'react';
import './WeatherNews.css';

const WeatherNews = ({ summary }) => {
  // Get the current date
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="weather-news">
      <h2>Weather Report</h2>
      <p className="weather-news-date">{currentDate}</p> {/* Display the date */}
      <p>{summary}</p>
    </div>
  );
};

export default WeatherNews;