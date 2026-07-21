const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("\n========== ROLE MIDDLEWARE ==========");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found in request",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
};