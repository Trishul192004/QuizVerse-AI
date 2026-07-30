const axios = require("axios");

const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

async function generateResponse(messages) {
  try {
    // Check if API key exists
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error(
        "OPENROUTER_API_KEY is missing. Check your .env file."
      );
    }

    // Check if model exists
    if (!process.env.AI_MODEL) {
      throw new Error(
        "AI_MODEL is missing. Check your .env file."
      );
    }


    console.log("API KEY:", process.env.OPENROUTER_API_KEY);
    console.log("MODEL:", process.env.AI_MODEL);

    const response = await axios.post(
      BASE_URL,
      {
        model: process.env.AI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "QuizVerse AI",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("\n========== OPENROUTER ERROR ==========");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error(
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error(error.message);
    }

    console.error("======================================\n");

    throw error;
  }
}

module.exports = {
  generateResponse,
};