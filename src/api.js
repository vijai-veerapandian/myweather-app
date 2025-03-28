
export const GEO_API_URL = process.env.REACT_APP_GEO_API_URL;
export const geoApiOptions  = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY, 
		'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST
	}
};

export const WEATHER_API_URL = process.env.REACT_APP_WEATHER_API_URL;
export const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const OPENAI_API_URL = process.env.REACT_APP_OPENAI_API_URL;
export const openAiApiOptions = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    },
};