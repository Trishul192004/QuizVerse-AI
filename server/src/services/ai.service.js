const { generateResponse } = require("./openrouter.service");
const { buildQuizPrompt } = require("./prompt.service");

async function generateText(prompt) {
  const messages = [
    {
      role: "system",
      content:
        "You are QuizVerse AI. You generate quizzes and ALWAYS return valid JSON only.",
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
    // Already valid JSON
    return JSON.parse(response);
  } catch (err) {
    console.warn("Response is not pure JSON. Trying to extract JSON...");

    try {
      const start = response.indexOf("{");
      const end = response.lastIndexOf("}");

      if (start === -1 || end === -1 || end <= start) {
        throw new Error("No JSON object found.");
      }

      const jsonString = response.substring(start, end + 1);

      console.log("\n===== EXTRACTED JSON =====");
      console.log(jsonString);
      console.log("==========================\n");

      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("\n========== INVALID AI RESPONSE ==========");
      console.error(response);
      console.error("=========================================\n");

      throw new Error("AI returned invalid JSON.");
    }
  }
}

module.exports = {
  generateText,
  generateQuiz,
};