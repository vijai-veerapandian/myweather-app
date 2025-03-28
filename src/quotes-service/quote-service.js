import { OPENAI_API_URL, openAiApiOptions } from '../api';

const fetchQuote = async (city) => {
  try {
    console.log('Using OpenAI API to fetch quote for city:', city);

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: openAiApiOptions.headers,
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Specify the correct model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides inspiring quotes.',
          },
          {
            role: 'user',
            content: `Provide an inspiring quote from a famous person born in ${city}.`,
          },
        ],
        max_tokens: 100, // Limit the response length
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quote for city: ${city}. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim(); // Return the generated quote
  } catch (error) {
    console.error('Error fetching quote from OpenAI:', error.message);
    return null; // Return null if there's an error
  }
};

export default fetchQuote;