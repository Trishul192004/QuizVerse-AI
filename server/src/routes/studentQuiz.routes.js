const express = require("express");

const router = express.Router();

const { verifyToken } = require("../middleware/auth.middleware");

const {
  authorizeRoles,
} = require("../middleware/role.middleware");

const {
  getAvailableQuizzes,
  getQuizForStudent,
  startQuizAttempt,
  submitQuiz,
  getAttemptResult,
} = require("../controllers/studentQuiz.controller");

console.log({
  getAvailableQuizzes,
  getQuizForStudent,
  startQuizAttempt,
  submitQuiz,
  getAttemptResult,
});
console.log("verifyToken:", typeof verifyToken);
console.log("authorizeRoles:", typeof authorizeRoles);
console.log("getAvailableQuizzes:", typeof getAvailableQuizzes);
console.log("getQuizForStudent:", typeof getQuizForStudent);
console.log("startQuizAttempt:", typeof startQuizAttempt);
console.log("submitQuiz:", typeof submitQuiz);
console.log("getAttemptResult:", typeof getAttemptResult);
/*
=================================
GET AVAILABLE QUIZZES
GET /api/student/quizzes
=================================
*/
router.get(
  "/quizzes",
  verifyToken,
  authorizeRoles("student"),
  getAvailableQuizzes
);

/*
=================================
GET QUIZ DETAILS
GET /api/student/quizzes/:id
=================================
*/
router.get(
  "/quizzes/:id",
  verifyToken,
  authorizeRoles("student"),
  getQuizForStudent
);

/*
=================================
START QUIZ
POST /api/student/quizzes/:id/start
=================================
*/
router.post(
  "/quizzes/:id/start",
  verifyToken,
  authorizeRoles("student"),
  startQuizAttempt
);

/*
=================================
SUBMIT QUIZ
POST /api/student/quizzes/:id/submit
=================================
*/
router.post(
  "/quizzes/:id/submit",
  verifyToken,
  authorizeRoles("student"),
  submitQuiz
);

/*
=================================
RESULT
GET /api/student/attempt/:id/result
=================================
*/
router.get(
  "/attempt/:id/result",
  verifyToken,
  authorizeRoles("student"),
  getAttemptResult
);

module.exports = router;