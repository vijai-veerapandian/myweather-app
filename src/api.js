export const GEO_API_URL = process.env.REACT_APP_GEO_API_URL;
export const geoApiOptions = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST
    }
};