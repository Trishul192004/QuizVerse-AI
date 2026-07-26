const db = require("../../config/db");
const { generateEmbedding } = require("../../services/openrouter.service");
const { cosineSimilarity } = require("../utils/cosineSimilarity");

async function retrieveRelevantChunks(question, classroomId, topK = 5) {
    // Generate embedding for the user's question
    const questionEmbedding = await generateEmbedding(question);

    // Fetch all chunks and embeddings for the classroom
    const [rows] = await db.query(
        `
        SELECT
            rc.id,
            rc.chunk_text,
            re.embedding
        FROM rag_chunks rc
        JOIN rag_documents rd
            ON rc.document_id = rd.id
        JOIN rag_embeddings re
            ON rc.id = re.chunk_id
        WHERE rd.classroom_id = ?
        `,
        [classroomId]
    );

    // Calculate similarity score for every chunk
    const scoredChunks = rows.map((row) => {
        const embedding = JSON.parse(row.embedding);

        return {
            chunkId: row.id,
            chunk: row.chunk_text,
            score: cosineSimilarity(questionEmbedding, embedding),
        };
    });

    // Sort by similarity (highest first)
    scoredChunks.sort((a, b) => b.score - a.score);

    // Debug logs
    console.log("\n========== TOP MATCHING CHUNKS ==========");

    scoredChunks.slice(0, topK).forEach((chunk, index) => {
        console.log(
            `${index + 1}. Score: ${chunk.score.toFixed(4)}`
        );
        console.log(chunk.chunk.substring(0, 150));
        console.log("----------------------------------------");
    });

    console.log("=========================================\n");

    return scoredChunks.slice(0, topK);
}

module.exports = {
    retrieveRelevantChunks,
};