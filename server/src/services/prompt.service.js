function buildQuizPrompt({
  topic,
  difficulty,
  questionCount,
  type,
}) {
  return `
You are an expert quiz generator.

Generate exactly ${questionCount} ${type} questions.

Topic:
${topic}

Difficulty:
${difficulty}

Return ONLY valid JSON.

Use this exact format:

{
  "questions":[
    {
      "question":"...",
      "options":["A","B","C","D"],
      "answer":"...",
      "explanation":"..."
    }
  ]
}

Do not include markdown.
Do not include triple backticks.
Do not write any extra text.
`;
}

module.exports = {
  buildQuizPrompt,
};