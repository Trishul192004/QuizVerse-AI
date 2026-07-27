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
AI STUDY QUIZZES
=================================
*/
router.get(
  "/classrooms/:classroomId/ai-study/quizzes",
  verifyToken,
  authorizeRoles("student"),
  studentController.getAIStudyQuizzes
);
/*
=================================
LEADERBOARD
=================================
*/
router.get(
  "/leaderboard",
  verifyToken,
  authorizeRoles("student"),
  studentController.getLeaderboard
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

/*
=================================
REVIEW QUIZ
=================================
*/
router.get(
  "/review/:attemptId",
  verifyToken,
  authorizeRoles("student"),
  studentController.getQuizReview
);

/*
=================================
AI STUDY (RAG)
=================================
*/
/*
// List all published AI Study quizzes available to the student
router.get(
  "/quizzes",
  verifyToken,
  authorizeRoles("student"),
  studentController.getAvailableQuizzes
);

// Get a single AI Study quiz
router.get(
  "/quizzes/:quizId",
  verifyToken,
  authorizeRoles("student"),
  studentController.getQuizForStudent
);

// Submit AI Study quiz
router.post(
  "/quizzes/:quizId/submit",
  verifyToken,
  authorizeRoles("student"),
  studentController.submitAIStudyQuiz
);
*/
module.exports = router;