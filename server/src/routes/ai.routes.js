const express = require("express");

const router = express.Router();

const {
  testAI,
  createQuiz,
  generateQuizPreview
} = require("../controllers/ai.controller");

const { verifyToken } = require("../middleware/auth.middleware");

router.get("/test", testAI);

router.post("/generate-quiz", verifyToken, createQuiz);

router.post("/generate-quiz-preview", verifyToken, generateQuizPreview);

module.exports = router;