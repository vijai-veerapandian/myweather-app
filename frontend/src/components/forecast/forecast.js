import React from "react";
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from "react-accessible-accordion";
import "./forecast.css";

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Forecast = ({ data }) => {
  // Add check for data validity
  if (!data || !data.list || !Array.isArray(data.list) || data.list.length === 0) {
    // Return null or some placeholder if data is not valid
    return <div className="forecast-nodata">Forecast data not available.</div>;
  }

  const dayInAWeek = new Date().getDay();
  const forecastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length).concat(WEEK_DAYS.slice(0, dayInAWeek));

  // Use slice() instead of splice()
  const forecastItems = data.list.slice(0, 7);

  return (
    <>
      {/* Consider renaming "Daily" if showing time slots */}
      <label className="title">Upcoming Forecast</label>
      <Accordion allowZeroExpanded>
        {/* Map over the new forecastItems array */}
        {forecastItems.map((item, idx) => (
          <AccordionItem key={idx}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className="daily-item">
                  {/* Add check for weather array */}
                  {item.weather && item.weather[0] && (
                     <img src={`icons/${item.weather[0].icon}.png`} className="icon-small" alt="weather" />
                  )}
                  <label className="day">{forecastDays[idx]}</label>
                  <label className="description">{item.weather && item.weather[0] ? item.weather[0].description : 'N/A'}</label>
                  <label className="min-max">
                    {/* Add checks for main temp data */}
                    {item.main ? `${Math.round(item.main.temp_max)}°C / ${Math.round(item.main.temp_min)}°C` : 'N/A'}
                  </label>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
            <div className="daily-details-grid">
                {/* Pressure */}
                <div className="daily-details-grid-item">
                  <label>Pressure:</label>
                  <label>{item.main?.pressure || 'N/A'} hPa</label>
                </div>
                {/* Humidity */}
                <div className="daily-details-grid-item">
                  <label>Humidity:</label>
                  <label>{item.main?.humidity || 'N/A'}%</label>
                </div>
                {/* Wind Speed */}
                <div className="daily-details-grid-item">
                  <label>Wind Speed:</label>
                  <label>{item.wind?.speed || 'N/A'} m/s</label>
                </div>
                {/* Cloudiness */}
                <div className="daily-details-grid-item">
                  <label>Cloudiness:</label>
                  <label>{item.clouds?.all || 'N/A'}%</label>
                </div>
                {/* Feels Like */}
                <div className="daily-details-grid-item">
                  <label>Feels Like:</label>
                  <label>{item.main?.feels_like || 'N/A'}°C</label>
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default Forecast;