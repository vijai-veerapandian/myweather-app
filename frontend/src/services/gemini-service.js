// filepath: /home/vboxuser/apps-dev/myweather-app3/frontend/src/services/gemini-service.js
const fetchAndSummarizeWeatherNews = async (city) => {
    if (!city || typeof city !== 'string') {
        console.error('Invalid city parameter. City must be a non-empty string.');
        return 'Error: Invalid city parameter.';
    }

    const apiEndpoint = '/api/weather-news'; // Nginx will proxy this

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city }),
        });

        if (!response.ok) {
            console.error(`Error: Received status ${response.status} from ${apiEndpoint}`);
            let errorDetails = `Status Code: ${response.status}`; // Default error detail
            try {
                const errorText = await response.text();
                errorDetails += ` - Response: ${errorText}`; // Add text content if available
            } catch (readError) {
                console.error('Could not read error response body:', readError);
                errorDetails += ' - Could not read response body.';
            }
            console.error(`Backend error details: ${errorDetails}`);
            return `Error: Unable to fetch weather news (status: ${response.status}).`;
        }
        const data = await response.json();

        if (data && data.news) {
            return data.news;
        } else {
            console.warn(`No relevant weather news found for city "${city}" via ${apiEndpoint}. Response:`, data);
            return 'No relevant weather news found.';
        }
    } catch (error) {
        console.error(`Network or parsing error fetching weather news for city "${city}" from ${apiEndpoint}:`, error);
        return 'Error: Unable to fetch weather news due to a network issue or invalid response.';
    }
};

export default fetchAndSummarizeWeatherNews;
