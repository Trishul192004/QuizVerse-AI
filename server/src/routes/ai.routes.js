const express = require("express");

const router = express.Router();

const {
  testAI,
  createQuiz,
} = require("../controllers/ai.controller");

router.get("/test", testAI);

router.post("/generate-quiz", createQuiz);

module.exports = router;