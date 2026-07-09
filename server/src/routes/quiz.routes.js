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
  getClassroomQuizzes,
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

/*
=================================
GET QUIZZES OF A CLASSROOM
GET /api/quizzes/classroom/:classroomId
=================================
*/

router.get(
  "/classroom/:classroomId",
  verifyToken,
  authorizeRoles("teacher"),
  getClassroomQuizzes
);

module.exports = router;