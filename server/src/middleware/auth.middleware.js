const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    console.log("Authorization:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err);

    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  verifyToken,
};