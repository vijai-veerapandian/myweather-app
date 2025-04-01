import React from 'react';

const CurrentWeather = ({ data, flagUrl }) => {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString(undefined, options);

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-80">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{data.city}</span>
          {flagUrl && (
            <img
              src={flagUrl}
              alt={`${data.city} flag`}
              className="h-6 w-auto rounded shadow-md"
            />
          )}
        </div>
        {data.weather[0].icon && (
          <img
            src={`/icons/${data.weather[0].icon}.png`}
            alt="weather"
            className="h-12 w-12"
          />
        )}
      </div>
      <div className="mt-4">
        <p className="text-4xl font-bold">{Math.round(data.main.temp)}°C</p>
        <p className="text-sm text-gray-400 capitalize">{data.weather[0].description}</p>
      </div>
      <div className="mt-4 border-t border-gray-600 pt-4">
        <div className="flex justify-between text-sm">
          <span>Feels like</span>
          <span className="font-semibold">{Math.round(data.main.feels_like)}°C</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Wind</span>
          <span className="font-semibold">{data.wind.speed} m/s</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Humidity</span>
          <span className="font-semibold">{data.main.humidity}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Pressure</span>
          <span className="font-semibold">{data.main.pressure} hPa</span>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-400">{formattedDate}</div>
    </div>
  );
};

export default CurrentWeather;