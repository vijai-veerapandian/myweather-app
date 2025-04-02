import { GoogleGenAI } from "@google/genai";
import express from "express";
import cors from "cors";
import { config } from "dotenv";

config(); // Load environment variables from .env

// Validate environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not defined in the environment variables.");
  process.exit(1); // Exit the process with an error code
}
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize GoogleGenAI with the API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Route to handle Gemini API calls
app.post("/api/weather-news", async (req, res) => {
  console.log("Incoming request body:", req.body); // Debug log

  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Would like to know recent weather news in and around ${city} within 25 words.`,
    });

    console.log("API Response:", response.text); // Debug log

    if (response && response.text) {
      res.json({ news: response.text });
    } else {
      res.json({ news: "No relevant weather news found." });
    }
  } catch (error) {
    console.error("Error fetching weather news:", error.response?.data || error.message);
    res.status(500).json({ error: "Unable to fetch weather news." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});