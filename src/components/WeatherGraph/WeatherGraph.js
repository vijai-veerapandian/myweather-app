// filepath: /home/vboxuser/apps-dev/myweather-app/src/components/WeatherGraph/WeatherGraph.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './WeatherGraph.css'; // Import the CSS file

const WeatherGraph = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => entry.dt_txt.split(" ")[1]), // Extract time (HH:MM)
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map((entry) => entry.main.temp),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#fff', // Bright white text for the legend
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          color: '#fff', // Bright white text for the x-axis title
        },
        ticks: {
          color: '#fff', // Bright white text for x-axis labels
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: '#fff', // Bright white text for the y-axis title
        },
        ticks: {
          color: '#fff', // Bright white text for y-axis labels
        },
      },
    },
  };

  return (
    <div className="weather-graph-container">
        <h3 className="weather-graph-title">24-Hour Temperature Forecast</h3>
        <Line data={chartData} options={options} />
    </div>
    );
};

export default WeatherGraph;