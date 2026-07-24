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
  saveAIQuiz,
  getTeacherQuizzes,
} = require("../controllers/quiz.controller");

/*
=================================
SAVE AI GENERATED QUIZ
POST /api/quizzes/save-ai
(Both Teacher & Student)
=================================
*/
router.post(
  "/save-ai",
  verifyToken,
  saveAIQuiz
);

/*
=================================
CREATE QUIZ
POST /api/quizzes/create
(Teacher Only)
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
(Teacher Only)
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
GET ALL TEACHER QUIZZES
GET /api/quizzes/teacher/all
(Teacher Only)
=================================
*/
router.get(
  "/teacher/all",
  verifyToken,
  authorizeRoles("teacher"),
  getTeacherQuizzes
);

/*
=================================
GET SINGLE QUIZ
GET /api/quizzes/:id
(Teacher Only)
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
(Teacher Only)
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
(Teacher Only)
=================================
*/
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  deleteQuiz
);

module.exports = router;