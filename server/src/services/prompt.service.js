function buildQuizPrompt({
  topic,
  difficulty,
  questionCount,
  type,
}) {
  return `
You are an expert educator and professional quiz creator.

Generate exactly ${questionCount} ${type} questions.

Topic:
${topic}

Difficulty:
${difficulty}

Rules:

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