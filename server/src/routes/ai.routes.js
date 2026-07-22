const express = require("express");

const router = express.Router();

const {
  testAI,
  createQuiz,
  generateQuizPreview
} = require("../controllers/ai.controller");

router.get("/test", testAI);

router.post("/generate-quiz", createQuiz);

router.post("/generate-quiz-preview", generateQuizPreview);

module.exports = router;