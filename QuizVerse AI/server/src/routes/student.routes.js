const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/auth.middleware");

const {
  authorizeRoles,
} = require("../middleware/role.middleware");
  const {
  joinClassroom,
  getStudentClassrooms,
  getStudentClassroomQuizzes,
  startQuiz,
  getAttemptQuiz,
  submitQuiz,
} = require("../controllers/student.controller");

/*
=================================
JOIN CLASSROOM
POST /api/student/join-classroom
=================================
*/

router.post(
  "/join-classroom",
  verifyToken,
  authorizeRoles("student"),
  joinClassroom
  );
  
router.get(
  "/classrooms",
  verifyToken,
  authorizeRoles("student"),
  getStudentClassrooms
);
router.get(
  "/classrooms/:classroomId/quizzes",
  verifyToken,
  authorizeRoles("student"),
  getStudentClassroomQuizzes
);

router.post(
  "/start-quiz/:quizId",
  verifyToken,
  authorizeRoles("student"),
  startQuiz
);
router.get(
  "/attempt/:attemptId",
  verifyToken,
  authorizeRoles("student"),
  getAttemptQuiz
);

router.post(
  "/submit/:attemptId",
  verifyToken,
  authorizeRoles("student"),
  submitQuiz
);

module.exports = router;