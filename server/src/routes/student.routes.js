const express = require("express");

const router = express.Router();

const studentController = require("../controllers/student.controller");

// Middleware
const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

/*
=================================
JOIN CLASSROOM
=================================
*/
router.post(
  "/join-classroom",
  verifyToken,
  authorizeRoles("student"),
  studentController.joinClassroom
);

/*
=================================
GET MY CLASSROOMS
=================================
*/
router.get(
  "/classrooms",
  verifyToken,
  authorizeRoles("student"),
  studentController.getStudentClassrooms
);

/*
=================================
GET CLASSROOM QUIZZES
=================================
*/
router.get(
  "/classrooms/:classroomId/quizzes",
  verifyToken,
  authorizeRoles("student"),
  studentController.getStudentClassroomQuizzes
);

/*
=================================
START QUIZ
=================================
*/
router.post(
  "/start-quiz/:quizId",
  verifyToken,
  authorizeRoles("student"),
  studentController.startQuiz
);

/*
=================================
GET ATTEMPT QUIZ
=================================
*/
router.get(
  "/attempt/:attemptId",
  verifyToken,
  authorizeRoles("student"),
  studentController.getAttemptQuiz
);

/*
=================================
SUBMIT QUIZ
=================================
*/
router.post(
  "/submit/:attemptId",
  verifyToken,
  authorizeRoles("student"),
  studentController.submitQuiz
);

module.exports = router;