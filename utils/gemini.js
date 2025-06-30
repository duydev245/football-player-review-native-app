import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_API_AI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzePlayerWithAI = async (player) => {
    const prompt = `
You are an expert football analyst. Analyze this player:

- Name: ${player.playerName}
- Position: ${player.position}
- Minutes Played: ${player.MinutesPlayed}
- Passing Accuracy: ${(player.PassingAccuracy * 100).toFixed(1)}%
- Average Rating: ${player.averageRating ?? 'N/A'}

Give a short paragraph that highlights strengths, potential, and suggestions.
  `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};