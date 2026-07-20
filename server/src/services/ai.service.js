const { QuizSchema } = require("../validators/quiz.validator");
const { generateResponse } = require("./openrouter.service");
const { buildQuizPrompt } = require("./prompt.service");

async function generateText(prompt) {
  const messages = [
    {
      role: "system",
      content:
        "You are QuizVerse AI, an intelligent quiz assistant.",
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  return await generateResponse(messages);
}

async function generateQuiz(data) {
  const prompt = buildQuizPrompt(data);

  const response = await generateText(prompt);

  console.log("\n===== RAW AI RESPONSE =====");
  console.log(response);
  console.log("===========================\n");

  try {
    return JSON.parse(response);
  } catch (err) {
    throw new Error("AI returned invalid JSON.");
  }
}

module.exports = {
  generateText,
  generateQuiz,
};