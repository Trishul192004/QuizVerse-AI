function buildQuizPrompt({
  topic,
  difficulty = "Medium",
  number_of_questions = 10,
  timer = 30,
  mode = "classroom",
}) {
  const modeInstructions =
    mode === "battle"
      ? `
Battle Mode Rules:
- Questions must be short.
- Each question should be readable within a few seconds.
- Suitable for ${timer}-second gameplay.
- Keep options concise.
- Avoid lengthy explanations.
`
      : `
Classroom Mode Rules:
- Questions may be slightly descriptive.
- Focus on conceptual understanding.
- Suitable for classroom assessments.
`;

  return `
You are QuizVerse AI, an expert educator and professional quiz creator.

Generate EXACTLY ${number_of_questions} multiple-choice questions.

Topic:
${topic}

Difficulty:
${difficulty}

${modeInstructions}

Requirements:

- Every question must be unique.
- Every question must have exactly 4 options.
- Exactly ONE option must be correct.
- The answer must exactly match one of the option strings.
- Explanation should be 1-2 short sentences.
- Questions should match the requested difficulty.
- Do not repeat concepts.
- Do not leave any field empty.

Return ONLY a valid JSON object.

The response MUST follow EXACTLY this schema:

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
      "answer": "Option A",
      "explanation": "Short explanation."
    }
  ]
}

STRICT RULES:

- Output ONLY JSON.
- Do NOT use markdown.
- Do NOT wrap JSON inside \`\`\`.
- Do NOT write "Here is the quiz".
- Do NOT write notes.
- Do NOT write explanations outside JSON.
- Do NOT write "User Safety".
- Do NOT write anything before the opening {.
- Do NOT write anything after the closing }.
- The response MUST begin with {.
- The response MUST end with }.
- Ensure the JSON is complete and valid before finishing.
`;
}

module.exports = {
  buildQuizPrompt,
};