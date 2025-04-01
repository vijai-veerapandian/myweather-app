import { REACT_APP_GEMINI_API_KEY } from '../api.js';
import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gemini AI client
const ai = new GoogleGenAI({ apiKey:REACT_APP_GEMINI_API_KEY});

const fetchAndSummarizeWeatherNews = async (city) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Would like to know recent weather news in ${city} within 25 words.`,
    });

    if (response && response.text) {
      return response.text; // Return the summarized weather news
    } else {
      return 'No relevant weather news found.';
    }
  } catch (error) {
    console.error('Error fetching weather news with Google Gemini:', error.message);
    return 'Error: Unable to fetch weather news.';
  }
};

export default fetchAndSummarizeWeatherNews;