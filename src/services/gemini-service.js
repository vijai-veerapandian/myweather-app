// filepath: /home/vboxuser/apps-dev/myweather-app/src/services/gemini-service.js
const fetchAndSummarizeWeatherNews = async (city) => {
    try {
        const backendApiUrl = process.env.REACT_APP_BACKEND_AI_URL || 'http://localhost:5000';
        const response = await fetch(`${backendApiUrl}/api/weather-news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city }),
        });

        const data = await response.json();

        if (data && data.news) {
            return data.news; // Return the summarized weather news
        } else {
            return 'No relevant weather news found.';
        }
    } catch (error) {
        console.error('Error fetching weather news:', error.message);
        return 'Error: Unable to fetch weather news.';
    }
};

export default fetchAndSummarizeWeatherNews;