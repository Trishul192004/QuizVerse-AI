const express = require("express");

const router = express.Router();

const teacherController = require("../controllers/teacher.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Teacher test route works",
  });
});

router.get(
  "/quizzes/:quizId/analytics",
  verifyToken,
  authorizeRoles("teacher"),
  teacherController.getQuizAnalytics
);

router.get(
  "/attempts/:attemptId",
  verifyToken,
  authorizeRoles("teacher"),
  teacherController.getAttemptDetails
);


module.exports = router;