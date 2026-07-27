console.log(">>> LOADED RAG SERVICE <<<");
const db = require("../../config/db");
const fs = require("fs");
const { chunkText } = require("../utils/textChunker");
const { extractTextFromPDF } = require("../utils/pdfParser");
const { generateEmbedding } = require("../../services/openrouter.service");
const { retrieveRelevantChunks } = require("./retrieval.service");
const { buildRagPrompt } = require("../prompts/rag.prompt");
const { generateText } = require("../../services/ai.service");
const { generateQuiz } = require("./quiz-generator.service");
console.log("generateQuiz:", typeof generateQuiz);

const uploadDocument = async (req) => {
    if (!req.file) {
        throw new Error("No file uploaded");
    }

    const {
        originalname,
        filename,
        path,
        size,
        mimetype,
    } = req.file;

    // Temporary values until we integrate classrooms
    const classroomId = 1;
    const teacherId = req.user.id;

    const [result] = await db.query(
        `INSERT INTO rag_documents
        (
            classroom_id,
            teacher_id,
            original_name,
            stored_name,
            file_path,
            file_size,
            mime_type,
            upload_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            classroomId,
            teacherId,
            originalname,
            filename,
            path,
            size,
            mimetype,
            "READY",
        ]
    );
    // Extract text from uploaded PDF
const extractedText = await extractTextFromPDF(req.file.path);
console.log("Length:", extractedText.length);
console.log("Preview:");
console.log(extractedText.substring(0, 300));
console.log("===== Extracted Text Preview =====");
console.log(extractedText.substring(0, 500));
console.log("==================================");

// Save extracted text
await db.query(
    `INSERT INTO rag_document_text (document_id, extracted_text)
     VALUES (?, ?)`,
    [result.insertId, extractedText]
);
// Split extracted text into chunks
const chunks = chunkText(extractedText);

console.log("Total Chunks:", chunks.length);

// Save every chunk
for (let i = 0; i < chunks.length; i++) {

    const [chunkResult] = await db.query(
        `INSERT INTO rag_chunks
        (document_id, chunk_index, chunk_text)
        VALUES (?, ?, ?)`,
        [result.insertId, i, chunks[i]]
    );

    const chunkId = chunkResult.insertId;

    const embedding = await generateEmbedding(chunks[i]);

await db.query(
  `INSERT INTO rag_embeddings (chunk_id, embedding)
   VALUES (?, ?)`,
  [
    chunkId,
    JSON.stringify(embedding)
  ]
);
}

console.log("Chunks saved successfully.");
    return {
        success: true,
        message: "Document uploaded successfully",
        document: {
            id: result.insertId,
            originalName: originalname,
            storedName: filename,
        },
    };
};

const getDocuments = async (req) => {
    const teacherId = req.user.id;

    const [documents] = await db.query(
        `SELECT
            id,
            classroom_id,
            original_name,
            stored_name,
            file_size,
            mime_type,
            upload_status,
            created_at
         FROM rag_documents
         WHERE teacher_id = ?
         ORDER BY created_at DESC`,
        [teacherId]
    );

    return {
        success: true,
        documents,
    };
};

const deleteDocument = async (req) => {
    const documentId = req.params.id;
    const teacherId = req.user.id;

    const [documents] = await db.query(
        `SELECT * FROM rag_documents
         WHERE id = ? AND teacher_id = ?`,
        [documentId, teacherId]
    );

    if (documents.length === 0) {
        throw new Error("Document not found");
    }

    const document = documents[0];

    if (fs.existsSync(document.file_path)) {
        fs.unlinkSync(document.file_path);
    }

    await db.query(
        "DELETE FROM rag_documents WHERE id = ?",
        [documentId]
    );

    return {
        success: true,
        message: "Document deleted successfully",
    };
};

const askQuestion = async (req) => {

    const { question } = req.body;

    if (!question) {
        throw new Error("Question is required");
    }

    // Temporary classroom
    const classroomId = 1;

    const chunks =
        await retrieveRelevantChunks(
            question,
            classroomId,
            5
        );

    const prompt =
        buildRagPrompt(
            question,
            chunks
        );

    const answer =
        await generateText(prompt);

    return {
        success: true,
        answer,
        retrievedChunks: chunks,
    };
};

const generateQuizFromDocument = async (req) => {

    const {
        documentId,
        classroomId = null,
        title = "AI Generated Quiz",
        description = "Generated from uploaded PDF",
        timeLimit = 30,
        numberOfQuestions = 10,
        difficulty = "medium",
        questionType,
    } = req.body;

    if (!documentId) {
        throw new Error("Document ID is required");
    }

    const quiz = await generateQuiz(documentId, {
        teacherId: req.user.id,
        classroomId,
        title,
        description,
        timeLimit,
        numberOfQuestions,
        difficulty,
        questionType,
    });

    return quiz;
};

console.log("Exporting:", {
    uploadDocument: typeof uploadDocument,
    getDocuments: typeof getDocuments,
    deleteDocument: typeof deleteDocument,
    askQuestion: typeof askQuestion,
    generateQuizFromDocument: typeof generateQuizFromDocument,
});
module.exports = {
    uploadDocument,
    getDocuments,
   deleteDocument,
    askQuestion,
    generateQuizFromDocument,
};