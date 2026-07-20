const express = require("express");

const router = express.Router();

const {
  verifyToken,
} = require("../middleware/auth.middleware");

const {
  authorizeRoles,
} = require("../middleware/role.middleware");
const {
  createClassroom,
  getTeacherClassrooms,
  getClassroomById,
  deleteClassroom,
  joinClassroom,
  getStudentClassrooms,
  } = require("../controllers/classroom.controller");

/*
=================================
CREATE CLASSROOM
POST /api/classrooms/create
=================================
*/

router.post(
  "/create",
  verifyToken,
  authorizeRoles("teacher"),
  createClassroom
);

/*
=================================
JOIN CLASSROOM
POST /api/classrooms/join
=================================
*/

router.post(
  "/join",
  verifyToken,
  authorizeRoles("student"),
  joinClassroom
);

/*
=================================
GET STUDENT CLASSROOMS
GET /api/classrooms/student
=================================
*/

router.get(
  "/student",
  verifyToken,
  authorizeRoles("student"),
  getStudentClassrooms
);

/*
=================================
GET TEACHER CLASSROOMS
GET /api/classrooms
=================================
*/

router.get(
  "/",
  verifyToken,
  authorizeRoles("teacher"),
  getTeacherClassrooms
);

/*
=================================
DELETE CLASSROOM
DELETE /api/classrooms/:id
=================================
*/

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  deleteClassroom
);

/*
=================================
GET SINGLE CLASSROOM
GET /api/classrooms/:id
=================================
*/

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  getClassroomById
);

module.exports = router;