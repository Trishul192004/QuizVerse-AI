function buildQuizPrompt(context, config) {
    const {
        numberOfQuestions = 10,
        difficulty = "Medium",
        questionType = "Multiple Choice",
    } = config;

    // ==========================================
    // Multiple Choice
    // ==========================================

    if (
        questionType === "Multiple Choice" ||
        questionType === "MCQ"
    ) {

        return `
You are an expert educational AI.

Generate exactly ${numberOfQuestions} ${difficulty} Multiple Choice Questions ONLY from the provided study material.

IMPORTANT RULES:

1. Use ONLY the study material.
2. Do NOT invent facts.
3. Do NOT ask anything outside the document.
4. Every question must have exactly 4 options.
5. Only ONE option must be correct.
6. Return ONLY valid JSON.
7. No markdown.
8. No explanation outside JSON.
9. Return the correct answer as the OPTION TEXT (NOT A/B/C/D).
10. Keep explanations under 30 words.

Return exactly:

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
      "answer":"Correct Option Text",
      "explanation":"..."
    }
  ]
}

Study Material:

${context}
`;
    }

    // ==========================================
    // Descriptive
    // ==========================================

    if (questionType === "Descriptive") {

        return `
You are an expert educational AI.

Generate exactly ${numberOfQuestions} ${difficulty} Descriptive Questions ONLY from the provided study material.

IMPORTANT RULES:

1. Use ONLY the study material.
2. Do NOT invent facts.
3. Questions must require detailed written answers.
4. Do NOT generate options.
5. Include an ideal answer.
6. Return ONLY valid JSON.
7. No markdown.
8. No text before or after JSON.

Return exactly:

{
  "questions":[
    {
      "question":"...",
      "answer":"Ideal answer based only on the study material.",
      "marks":5,
      "explanation":"..."
    }
  ]
}

Study Material:

${context}
`;
    }

    // ==========================================
    // Mixed
    // ==========================================

    const mcqCount = Math.ceil(numberOfQuestions * 0.7);
    const descriptiveCount = numberOfQuestions - mcqCount;

    return `
You are an expert educational AI.

Generate exactly ${numberOfQuestions} ${difficulty} questions from the study material.

Question Distribution:

- ${mcqCount} Multiple Choice Questions
- ${descriptiveCount} Descriptive Questions

IMPORTANT RULES:

1. Use ONLY the study material.
2. Do NOT invent facts.
3. MCQs must have exactly four options.
4. Descriptive questions must NOT have options.
5. Return ONLY JSON.
6. No markdown.
7. No extra text.

Return exactly:

{
  "questions":[

    {
      "type":"MCQ",
      "question":"...",
      "options":[
        "...",
        "...",
        "...",
        "..."
      ],
      "answer":"Correct Option Text",
      "explanation":"..."
    },

    {
      "type":"DESCRIPTIVE",
      "question":"...",
      "answer":"Ideal answer",
      "marks":5,
      "explanation":"..."
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