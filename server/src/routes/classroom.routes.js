const express = require("express");

const router = express.Router();

const {
  verifyToken
} = require(
  "../middleware/auth.middleware"
);

const {
  authorizeRoles
} = require(
  "../middleware/role.middleware"
);

router.post(
  "/create",
  verifyToken,
  authorizeRoles("teacher"),
  (req, res) => {

    res.json({
      success: true,
      message:
        "Classroom created successfully",

      teacherId:
        req.user.id
    });

  }
);

module.exports = router;