const db = require("../../config/db");
const { generateResponse } = require("../../services/openrouter.service");
const { buildQuizPrompt } = require("../prompts/quiz.prompt");
const { saveQuiz } = require("./quiz-db.service");

async function generateQuiz(documentId, config) {

    const {
        teacherId,
        classroomId = null,
        title = "AI Generated Quiz",
        description = "Generated from uploaded PDF",
        timeLimit = 30,
        numberOfQuestions,
        difficulty,
    } = config;

    console.log("\n========== AI QUIZ GENERATION ==========");
    console.log("Document ID:", documentId);
    console.log("Teacher ID:", teacherId);

    // Fetch chunks
    console.log("1. Fetching document chunks...");

    const [rows] = await db.query(
        `
        SELECT chunk_text
        FROM rag_chunks
        WHERE document_id = ?
        ORDER BY chunk_index
        `,
        [documentId]
    );

    console.log("Chunks Found:", rows.length);

    if (rows.length === 0) {
        throw new Error("No chunks found for this document.");
    }

    // Merge chunks
    console.log("2. Building context...");

    const context = rows
        .slice(0, 5)
        .map((row) => row.chunk_text)
        .join("\n\n");

    console.log("Context Length:", context.length);

    // Build prompt
    console.log("3. Building prompt...");

    const prompt = buildQuizPrompt(context, {
        numberOfQuestions,
        difficulty,
    });

    console.log("Prompt Length:", prompt.length);

    // Call OpenRouter
    console.log("4. Calling OpenRouter...");

const response = await generateResponse([
    {
        role: "user",
        content: prompt,
    },
]);

console.log("\n========== RAW AI RESPONSE ==========");
console.log(response);
console.log("=====================================\n");

    console.log("5. OpenRouter Response Received");
    console.log("--------------------------------");
    console.log(response);
    console.log("--------------------------------");

let quiz;

try {

    console.log("6. Parsing JSON...");

    quiz = JSON.parse(response);

    console.log("JSON Parsed Successfully");

} catch (err) {

    console.error("JSON Parse Error");
    console.error(err);

    console.log("Raw AI Response:");
    console.log(response);

    throw new Error("AI returned invalid JSON.");

}

if (
    !quiz.questions ||
    quiz.questions.length === 0
) {
    throw new Error(
        "AI could not generate any questions from this document."
    );
}

console.log("Questions Generated:", quiz.questions.length);
    console.log("7. Saving Quiz...");

    const quizId = await saveQuiz({
        teacherId,
        classroomId,
        title,
        description,
        timeLimit,
        questions: quiz.questions,
    });

    console.log("Quiz Saved Successfully");
    console.log("Quiz ID:", quizId);

    console.log("========== DONE ==========\n");

    return {
        success: true,
        quizId,
        totalQuestions: quiz.questions.length,
        questions: quiz.questions,
    };

}

module.exports = {
    generateQuiz,
};