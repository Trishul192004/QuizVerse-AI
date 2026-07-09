const jwt = require("jsonwebtoken");

/*
=================================
ACCESS TOKEN
=================================
*/

const generateAccessToken = (user) => {

  console.log("=================================");
  console.log("Generating Access Token");
  console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌");
  console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);
  console.log("=================================");

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

/*
=================================
REFRESH TOKEN
=================================
*/

const generateRefreshToken = (user) => {

  console.log("Generating Refresh Token");
  console.log("REFRESH_SECRET:", process.env.REFRESH_SECRET ? "Loaded ✅" : "Missing ❌");
  console.log("REFRESH_EXPIRES_IN:", process.env.REFRESH_EXPIRES_IN);

  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRES_IN,
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};