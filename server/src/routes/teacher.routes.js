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
  teacherController.getQuizAnalytics
);

router.get(
  "/attempts/:attemptId",
  teacherController.getAttemptDetails
);


module.exports = router;