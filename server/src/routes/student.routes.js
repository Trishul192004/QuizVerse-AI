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

/*
=================================
GET STUDENT CLASSROOMS
GET /api/student/classrooms
=================================
*/

router.get(
  "/classrooms",
  verifyToken,
  authorizeRoles("student"),
  getStudentClassrooms
);

module.exports = router;