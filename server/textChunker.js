const { chunkText } = require("./src/rag/utils/textChunker");

const text =
    "Hello ".repeat(1200);

const chunks = chunkText(text);

console.log("Chunks:", chunks.length);

chunks.forEach((chunk, index) => {
    console.log(
        `Chunk ${index + 1}:`,
        chunk.split(/\s+/).length,
        "words"
    );
});