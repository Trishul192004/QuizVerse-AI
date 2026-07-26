function buildQuizPrompt(context, config) {
    const {
        numberOfQuestions = 10,
        difficulty = "Medium",
        questionType = "MCQ",
    } = config;

    return `
You are an expert educational AI.

Generate exactly ${numberOfQuestions} ${difficulty} ${questionType} questions ONLY from the provided study material.

IMPORTANT RULES:

1. Use ONLY the given context.
2. Do NOT invent facts.
3. If the answer is not present in the context, do not create a question.
4. Questions should test understanding, not memorization.
5. Return ONLY valid JSON.
6. Do NOT include markdown.
7. Do NOT include explanations outside the JSON.

Return JSON in this exact format:

{
  "questions": [
    {
      "question": "...",
      "options": [
        "...",
        "...",
        "...",
        "..."
      ],
      "correctAnswer": "...",
      "explanation": "..."
    }
  ]
}

Study Material:

${context}
`;
}

module.exports = {
    buildQuizPrompt,
};