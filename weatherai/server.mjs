// filepath: /home/vboxuser/apps-dev/myweather-app3/backend/server.mjs
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import fetch from 'node-fetch'; // Make sure node-fetch is installed if using older Node versions

config();

if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- API Routes ---
// POST /weather-news  <--- CORRECTED PATH
// Receives a city name in the request body and returns a weather news summary.
app.post("/weather-news", async (req, res) => { // <--- CORRECTED PATH
  console.log("Received POST /weather-news"); // <--- Updated log message
  console.log("Request body:", req.body);

  const { city } = req.body;

  if (!city || typeof city !== 'string' || city.trim() === '') {
    console.log("Validation Error: City is missing or invalid.");
    return res.status(400).json({ error: "City is required and must be a non-empty string." });
  }

  try {
    console.log(`Fetching weather news summary for: ${city}`);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Provide a concise weather news summary (around 25 words) for ${city}. Focus on recent or upcoming significant weather events or general conditions.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini API Response Text:", text);

    if (text) {
      res.json({ news: text });
    } else {
      console.log("Gemini API returned no text.");
      res.json({ news: "No relevant weather news summary could be generated." });
    }
  } catch (error) {
    console.error("Error fetching weather news from Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch weather news summary due to an internal server error." });
  }
});

// GET /cities?namePrefix=...
// Fetches city suggestions from GeoDB API
app.get("/cities", async (req, res) => {
  const namePrefix = req.query.namePrefix;
  console.log(`Received GET /cities with namePrefix: ${namePrefix}`);

  if (!namePrefix) {
      return res.status(400).json({ error: "namePrefix query parameter is required." });
  }

  const geoDbApiKey = process.env.REACT_APP_RAPIDAPI_KEY;
  if (!geoDbApiKey) {
       console.error("FATAL ERROR: REACT_APP_RAPIDAPI_KEY environment variable is not set.");
       return res.status(500).json({ error: "API key configuration error." });
  }

  const geoDbApiUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=1000000&namePrefix=${encodeURIComponent(namePrefix)}`;
  const options = {
      method: 'GET',
      headers: {
          'x-rapidapi-key': geoDbApiKey,
          'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
      }
  };

  try {
      // Use node-fetch explicitly if needed (Node < 18)
      const geoResponse = await fetch(geoDbApiUrl, options);
      if (!geoResponse.ok) {
          console.error(`GeoDB API Error: ${geoResponse.status} ${geoResponse.statusText}`);
          const errorBody = await geoResponse.text();
          console.error("GeoDB Error Body:", errorBody);
          return res.status(geoResponse.status).json({ error: `Failed to fetch cities from GeoDB: ${geoResponse.statusText}` });
      }
      const geoData = await geoResponse.json();
      res.json(geoData);
  } catch (error) {
      console.error("Error calling GeoDB API:", error);
      res.status(500).json({ error: "Internal server error fetching city data." });
  }
});
app.listen(PORT, () => {
  console.log(`Backend server is running and listening on port ${PORT}`);
  console.log(`Accepting POST requests at /weather-news`); // <--- CORRECTED LOG
  console.log(`Accepting GET requests at /cities`);
});