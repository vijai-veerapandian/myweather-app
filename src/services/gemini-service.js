// filepath: /home/vboxuser/apps-dev/myweather-app/src/services/gemini-service.js
const fetchAndSummarizeWeatherNews = async (city) => {
    if (!process.env.REACT_APP_BACKEND_AI_URL) {
        console.error('Error: REACT_APP_BACKEND_AI_URL is not defined. Please set it in your environment variables.');
        return 'Error: Backend URL is not configured.';
    }

    const backendUrl = process.env.REACT_APP_BACKEND_AI_URL;

    if (!city || typeof city !== 'string') {
        console.error('Invalid city parameter. City must be a non-empty string.');
        return 'Error: Invalid city parameter.';
    }

    try {
        const response = await fetch(`${backendUrl}/api/weather-news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city }),
        });

        if (!response.ok) {
            console.error(`Error: Received status ${response.status} from ${backendUrl}/api/weather-news`);
            return `Error: Unable to fetch weather news (status: ${response.status}).`;
        }

        const data = await response.json();

        if (data && data.news) {
            return data.news; // Return the summarized weather news
        } else {
            console.warn('No relevant weather news found for the given city.');
            return 'No relevant weather news found.';
        }
    } catch (error) {
        console.error(`Error fetching weather news for city "${city}" from ${backendUrl}:`, error.message);
        return 'Error: Unable to fetch weather news.';
    }
};

export default fetchAndSummarizeWeatherNews;