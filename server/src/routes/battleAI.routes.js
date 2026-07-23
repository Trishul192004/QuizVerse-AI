const express = require("express");

const router = express.Router();

const {
  generateBattleQuiz,
} = require("../controllers/battleAI.controller");

router.post("/generate", generateBattleQuiz);

module.exports = router;