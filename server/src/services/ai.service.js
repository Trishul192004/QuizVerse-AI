const { generateResponse } = require("./openrouter.service");

async function generateText(prompt) {
  const messages = [
    {
      role: "system",
      content:
        "You are QuizVerse AI, an intelligent assistant that creates high-quality quizzes.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  return await generateResponse(messages);
}

module.exports = {
  generateText,
};