const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/auth.middleware");

const {
  authorizeRoles,
} = require("../middleware/role.middleware");

const {
  createQuiz,
} = require("../controllers/quiz.controller");

/*
=================================
CREATE QUIZ
POST /api/quizzes/create
=================================
*/

router.post(
  "/create",
  verifyToken,
  authorizeRoles("teacher"),
  createQuiz
  );

  module.exports = router;