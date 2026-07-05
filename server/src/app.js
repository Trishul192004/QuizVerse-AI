const express = require("express");
const cors = require("cors");

const testRoute = require("./routes/test.route");
const authRoutes = require("./routes/auth.routes");
const classroomRoutes = require("./routes/classroom.routes");
const quizRoutes = require("./routes/quiz.routes");

const app = express();

const jsonParser = express.json();
const urlencodedParser = express.urlencoded({
  extended: true,
});

/*
=================================
GLOBAL MIDDLEWARE
=================================
*/

app.use(cors());

app.use((req, res, next) => {
  if (
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    return next();
  }

  return jsonParser(req, res, next);
});

app.use((req, res, next) => {
  if (
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    return next();
  }

  return urlencodedParser(req, res, next);
});

/*
=================================
HEALTH CHECK
GET /
=================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "QuizVerse Backend Running",
  });
});

/*
=================================
API ROUTES
=================================
*/

app.use("/api/test", testRoute);

app.use("/api/auth", authRoutes);

app.use("/api/classrooms", classroomRoutes);

app.use("/api/classroom", classroomRoutes);

app.use("/api/quizzes", quizRoutes);

/*
=================================
404 ROUTE HANDLER
=================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  return next(err);
});

/*
=================================
EXPORT APP
=================================
*/

module.exports = app;