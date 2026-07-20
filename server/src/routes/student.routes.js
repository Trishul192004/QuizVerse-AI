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

module.exports = router;