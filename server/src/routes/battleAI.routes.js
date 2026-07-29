const express = require("express");

const router = express.Router();

const {
  generateBattleQuiz,
} = require("../controllers/battleAI.controller");

const { verifyToken } = require("../middleware/auth.middleware");

router.post("/generate", verifyToken, generateBattleQuiz);

module.exports = router;