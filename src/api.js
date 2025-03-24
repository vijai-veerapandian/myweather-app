
export const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
export const geoApiOptions  = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '', // Add your RapidAPI key here
		'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
	}
};

export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
export const WEATHER_API_KEY = ''; // Add your OpenWeatherMap API key here