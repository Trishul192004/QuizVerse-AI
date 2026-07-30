const jwt = require("jsonwebtoken");
const db = require("../config/db");

const verifyToken = async (req, res, next) => {
  try {
    // Debug logs
    console.log("\n========== VERIFY TOKEN ==========");
    console.log("Authorization Header:", req.headers.authorization);
    console.log("All Headers:", req.headers);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const parts = authHeader.trim().split(/\s+/);

    console.log("Split Parts:", parts);

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = parts[1];

    console.log("Token:", token);

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

    console.log("Decoded Payload:", decoded);
    console.log("=================================\n");

    next();
  } catch (err) {
    console.error("JWT Error:", err);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  verifyToken,
};