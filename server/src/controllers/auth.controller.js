const db = require("../config/db");

const jwt = require("jsonwebtoken");

const {
  hashPassword,
  comparePassword
} = require("../utils/hash");

const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/jwt");

/*
=================================
REGISTER USER
POST /api/auth/register
=================================
*/

const register = async (req, res) => {
  try {

    const {
      username,
      email,
      password,
      role
    } = req.body;

    if (
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const [existingUser] =
      await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword =
      await hashPassword(password);

    await db.query(
      `
      INSERT INTO users
      (
        username,
        email,
        password_hash,
        role
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        username,
        email,
        hashedPassword,
        role || "student"
      ]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/*
=================================
LOGIN USER
POST /api/auth/login
=================================
*/

const login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password required"
      });
    }

    const [users] =
      await db.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        `,
        [email]
      );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = users[0];

    const isMatch =
      await comparePassword(
        password,
        user.password_hash
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    const expiresAt =
      new Date();

    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    await db.query(
      `
      INSERT INTO refresh_tokens
      (
        user_id,
        token,
        expires_at
      )
      VALUES (?, ?, ?)
      `,
      [
        user.id,
        refreshToken,
        expiresAt
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      accessToken,
      refreshToken,

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        xp: user.xp,
        coins: user.coins
      }
    });

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/*
=================================
CURRENT USER
GET /api/auth/me
=================================
*/

const getCurrentUser = async (
  req,
  res
) => {

  try {

    return res.status(200).json({
      success: true,

      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });

  } catch (error) {

    console.error(
      "CURRENT USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};

/*
=================================
REFRESH ACCESS TOKEN
POST /api/auth/refresh
=================================
*/
/*
=================================
REFRESH ACCESS TOKEN
POST /api/auth/refresh
=================================
*/

const refreshAccessToken = async (
  req,
  res
) => {

  try {

    const {
      refreshToken
    } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message:
          "Refresh token required"
      });
    }

    const decoded =
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      );

    const [tokens] =
      await db.query(
        `
        SELECT *
        FROM refresh_tokens
        WHERE token = ?
        `,
        [refreshToken]
      );

    if (tokens.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid refresh token"
      });
    }

    const [users] =
      await db.query(
        `
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [decoded.id]
      );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = users[0];

    const accessToken =
      generateAccessToken(user);

    return res.status(200).json({
      success: true,
      accessToken
    });

  } catch (error) {

    console.error(
      "REFRESH TOKEN ERROR:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
      "Refresh token expired or invalid"
    });

  }
};


/*
=================================
LOGOUT
POST /api/auth/logout
=================================
*/

const logout = async (
  req,
  res
) => {

  try {

    const {
      refreshToken
    } = req.body;

    await db.query(
      `
      DELETE FROM refresh_tokens
      WHERE token = ?
      `,
      [refreshToken]
    );

    return res.status(200).json({
      success: true,
      message:
        "Logged out successfully"
    });

  } catch (error) {

    console.error(
      "LOGOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
      "Server Error"
    });

  }
};

/*
=================================
LOGOUT ALL
POST /api/auth/logout-all
=================================
*/

const logoutAllDevices =
async (
  req,
  res
) => {

  try {

    await db.query(
      `
      DELETE FROM refresh_tokens
      WHERE user_id = ?
      `,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      message:
      "All sessions removed"
    });

  } catch(error){

    console.error(
      "LOGOUT ALL ERROR:",
      error
    );

    return res.status(500).json({
      success:false,
      message:
      "Server Error"
    });

  }
};

/*
=================================
GET SESSIONS
GET /api/auth/sessions
=================================
*/

const getSessions =
async (
  req,
  res
) => {

  try {

    const [sessions] =
      await db.query(
        `
        SELECT
        id,
        created_at,
        expires_at
        FROM refresh_tokens
        WHERE user_id = ?
        `,
        [req.user.id]
      );

    return res.status(200).json({
      success:true,
      sessions
    });

  } catch(error){

    console.error(
      "SESSIONS ERROR:",
      error
    );

    return res.status(500).json({
      success:false,
      message:
      "Server Error"
    });

  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
  logoutAllDevices,
  getSessions
};