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
  deleteClassroom,
} = require("../controllers/classroom.controller");
/*
=================================
CREATE CLASSROOM
POST /api/classroom/create
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
GET TEACHER CLASSROOMS
GET /api/classroom
=================================
*/

router.get(
  "/",
  verifyToken,
  authorizeRoles("teacher"),
  getTeacherClassrooms
);

module.exports = router;


/*
=================================
DELETE CLASSROOM
DELETE /api/classroom/:id
=================================
*/

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  deleteClassroom
);