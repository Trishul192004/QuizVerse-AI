const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/auth.middleware");

const {
  authorizeRoles,
} = require("../middleware/role.middleware");
  const {
  createQuestion,
  getQuestionsByQuiz,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/question.controller");

/*
=================================
CREATE QUESTION
POST /api/questions/create
=================================
*/

router.post(
  "/create",
  verifyToken,
  authorizeRoles("teacher"),
  createQuestion
);
/*
=================================
UPDATE QUESTION
PUT /api/questions/:id
=================================
*/

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  updateQuestion
);

/*
=================================
DELETE QUESTION
DELETE /api/questions/:id
=================================
*/

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  deleteQuestion
);
/*
=================================
GET QUESTIONS OF A QUIZ
GET /api/questions/quiz/:quizId
=================================
*/

router.get(
  "/quiz/:quizId",
  verifyToken,
  getQuestionsByQuiz
);

module.exports = router;