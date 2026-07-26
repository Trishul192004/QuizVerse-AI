require("dotenv").config();

const { generateEmbedding } = require("./src/services/openrouter.service");

(async () => {
  const embedding = await generateEmbedding(
    "Artificial Intelligence is transforming education."
  );

  console.log("Dimensions:", embedding.length);
  console.log(embedding.slice(0, 10));
})();