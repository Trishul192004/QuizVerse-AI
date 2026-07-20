const jwt = require("jsonwebtoken");
const db = require("../config/db");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = parts[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );

    if (!decoded.role) {
      const [users] = await db.query(
        "SELECT role FROM users WHERE id = ?",
        [decoded.id]
      );

      if (users.length > 0) {
        decoded.role = users[0].role;
      }
    }

    req.user = decoded;
    console.log("verifyToken:", req.user);
    console.log('verifyToken - decoded payload:', decoded);

    next();
  } catch (err) {
    console.log("JWT Error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  verifyToken,
};