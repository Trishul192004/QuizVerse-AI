function buildRagPrompt(question, chunks) {

    const context = chunks
        .map((c, i) => `Chunk ${i + 1}:\n${c.chunk}`)
        .join("\n\n");

    return `
You are QuizVerse AI.

Answer ONLY using the provided context.

If the answer is not present in the context, reply:

"I couldn't find the answer in the uploaded classroom documents."

Context:
${context}

Question:
${question}

Answer:
`;
}

module.exports = {
    buildRagPrompt,
};