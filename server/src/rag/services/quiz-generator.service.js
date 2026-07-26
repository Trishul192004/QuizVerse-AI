const db = require("../../config/db");
const { generateResponse } = require("../../services/openrouter.service");
const { buildQuizPrompt } = require("../prompts/quiz.prompt");

async function generateQuiz(documentId, config) {
    // Fetch all chunks for the document
    const [rows] = await db.query(
        `
        SELECT chunk_text
        FROM rag_chunks
        WHERE document_id = ?
        ORDER BY chunk_index
        `,
        [documentId]
    );

    if (rows.length === 0) {
        throw new Error("No chunks found for this document.");
    }

    // Merge chunks into one context
    const context = rows
        .map(row => row.chunk_text)
        .join("\n\n");

    // Build AI prompt
    const prompt = buildQuizPrompt(context, config);

    // Generate quiz
const response = await generateResponse([
    {
        role: "user",
        content: prompt,
    },
]);
    // Parse JSON returned by AI
    try {
        return JSON.parse(response);
    } catch (err) {
        console.error("Invalid JSON returned by AI:");
        console.log(response);

        throw new Error(
            "AI returned an invalid quiz format."
        );
    }
}

module.exports = {
    generateQuiz,
};