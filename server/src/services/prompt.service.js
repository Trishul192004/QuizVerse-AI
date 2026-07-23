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
- Questions should be short and easy to read.
- Players have only ${timer} seconds per question.
- Avoid long paragraphs.
- Focus on speed and accuracy.
- Keep options concise.
`
      : `
Classroom Mode Rules:
- Questions can be slightly descriptive.
- Focus on conceptual understanding.
- Suitable for assignments and classroom assessments.
`;

  return `
You are an expert educator and professional quiz creator.

Generate exactly ${number_of_questions} multiple-choice questions.

Topic:
${topic}

Difficulty:
${difficulty}

${modeInstructions}

General Rules:

- Questions must be unique.
- Questions must test conceptual understanding.
- Avoid duplicate questions.
- Every question must have exactly four options.
- Only ONE option is correct.
- Distractors should be realistic.
- Explanation should be concise (1-2 sentences).

Return ONLY valid JSON.

The response MUST exactly follow this structure:

{
  "questions":[
    {
      "question":"...",
      "options":[
        "...",
        "...",
        "...",
        "..."
      ],
      "answer":"...",
      "explanation":"..."
    }
  ]
}

Important:

- Do NOT return markdown.
- Do NOT wrap JSON inside \`\`\`.
- Do NOT add introductory text.
- Do NOT add concluding text.
- Return ONLY the JSON object.
`;
}

module.exports = {
  buildQuizPrompt,
};