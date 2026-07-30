const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
  logoutAllDevices,
  getSessions
} = require("../controllers/auth.controller");

const {
  verifyToken
} = require("../middleware/auth.middleware");

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.post(
  "/refresh",
  refreshAccessToken
);

router.get(
  "/me",
  verifyToken,
  getCurrentUser
);

router.post(
  "/logout",
  logout
);

router.post(
  "/logout-all",
  verifyToken,
  logoutAllDevices
);

router.get(
  "/sessions",
  verifyToken,
  getSessions
);

module.exports = router;