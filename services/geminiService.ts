import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData, AIStyleAdvice } from "../types";
import { getWeatherDescription } from "./weatherService";

// Initialize Gemini
// Note: In a real production app, ensure this key is guarded.
// The prompt instructions specify usage of process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStyleAdvice = async (weather: WeatherData): Promise<AIStyleAdvice> => {
  const modelId = "gemini-2.5-flash"; // Using Flash for speed and efficiency

  const weatherDesc = getWeatherDescription(weather.weatherCode);
  
  const prompt = `
    You are a high-end, witty fashion stylist and lifestyle planner ("VibeCast").
    
    Current Conditions in ${weather.locationName}:
    - Temperature: ${weather.temperature}°C
    - Condition: ${weatherDesc}
    - Wind: ${weather.windSpeed} km/h
    - Humidity: ${weather.humidity}%
    - Time: ${weather.isDay ? "Daytime" : "Nighttime"}

    Provide a JSON response with:
    1. A short, witty "Vibe Description" of the weather (max 1 sentence).
    2. A specific outfit suggestion suitable for these conditions (modern, stylish).
    3. A recommended activity (indoor/outdoor based on weather).
    4. A color palette of 3 hex codes that matches the mood.
    5. A single emoji that represents the vibe.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibeDescription: { type: Type.STRING },
            outfitSuggestion: { type: Type.STRING },
            activityRecommendation: { type: Type.STRING },
            colorPalette: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of 3 hex color strings"
            },
            emoji: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIStyleAdvice;
    } else {
      throw new Error("Empty response from Gemini");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in case of API error/limit
    return {
      vibeDescription: "The AI is meditating on the clouds right now.",
      outfitSuggestion: "Wear something comfortable and check back later.",
      activityRecommendation: "Relax and enjoy the moment.",
      colorPalette: ["#808080", "#A9A9A9", "#D3D3D3"],
      emoji: "🤖"
    };
  }
};