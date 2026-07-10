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
  getQuizById,
  updateQuiz,
  deleteQuiz,
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


/*
=================================
GET SINGLE QUIZ
GET /api/quizzes/:id
=================================
*/

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  getQuizById
);

/*
=================================
UPDATE QUIZ
PUT /api/quizzes/:id
=================================
*/

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  updateQuiz
);

/*
=================================
DELETE QUIZ
DELETE /api/quizzes/:id
=================================
*/

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  deleteQuiz
);
module.exports = router;