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

1. Use ONLY the given study material.
2. Do NOT invent facts.
3. If the answer is not present in the study material, do NOT create a question.
4. Questions should test understanding, not memorization.
5. Each question must have exactly 4 options.
6. Return ONLY valid JSON.
7. Do NOT include markdown (\`\`\`json).
8. Do NOT include any text before or after the JSON.
9. The correct answer must be returned ONLY as the option letter ("A", "B", "C", or "D").
10. Do NOT return the correct answer text.

Return JSON in this exact format:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctOption": "A",
      "explanation": "Short explanation."
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