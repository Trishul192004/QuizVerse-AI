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

async function generateQuiz({
  topic,
  difficulty,
  number_of_questions,
  timer,
  mode = "classroom",
}) {
  const prompt = buildQuizPrompt({
    topic,
    difficulty,
    number_of_questions,
    timer,
    mode,
  });

  const response = await generateText(prompt);

  console.log("\n===== RAW AI RESPONSE =====");
  console.log(response);
  console.log("===========================\n");

  try {
    return JSON.parse(response);
  } catch (err) {
    console.error("Invalid AI Response:", response);
    throw new Error("AI returned invalid JSON.");
  }
}

module.exports = {
  generateText,
  generateQuiz,
};