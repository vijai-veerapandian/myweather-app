
export const REACT_APP_GEO_API_URL = process.env.REACT_APP_GEO_API_URL;
export const geoApiOptions  = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY, 
		'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST
	}
};

export const REACT_APP_GEMINI_API_KEY= process.env.REACT_APP_GEMINI_API_KEY;
export const REACT_APP_WEATHER_API_URL = process.env.REACT_APP_WEATHER_API_URL;
export const REACT_APP_WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
export const REACT_APP_BACKEND_AI_URL = process.env.REACT_APP_BACKEND_AI_URL;