const axios = require("axios");

const CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const EMBEDDING_URL = "https://openrouter.ai/api/v1/embeddings";

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


    console.log("MODEL:", process.env.AI_MODEL);

    const response = await axios.post(
  CHAT_URL,
  {
    model: process.env.AI_MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 4000,
  },
  {
    timeout: 120000,
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.SITE_URL || process.env.CORS_ORIGIN || "http://localhost:5000",
      "X-Title": "QuizVerse AI",
    },
  }
);

const content = response?.data?.choices?.[0]?.message?.content;

if (!content) {
  throw new Error("OpenRouter returned an empty response.");
}

return content;  }

catch (error) {
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
async function generateEmbedding(text) {
  try {
    const response = await axios.post(
      EMBEDDING_URL,
      {
        model: process.env.AI_EMBEDDING_MODEL,
        input: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.SITE_URL || process.env.CORS_ORIGIN || "http://localhost:5000",
          "X-Title": "QuizVerse AI",
        },
      }
    );

    return response.data.data[0].embedding;
  } catch (error) {
    console.error("Embedding Error:");

    if (error.response) {
      console.error(error.response.status);
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }

    throw error;
  }
}
module.exports = {
  generateResponse,
  generateEmbedding
};