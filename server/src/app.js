const express = require("express");
const cors = require("cors");

const testRoute = require("./routes/test.route");
const authRoutes = require("./routes/auth.routes");
const classroomRoutes = require("./routes/classroom.routes");
const quizRoutes = require("./routes/quiz.routes");
const questionRoutes = require("./routes/question.routes");

const app = express();

/*
=================================
GLOBAL MIDDLEWARE
=================================
*/

app.use(cors());

app.use(express.json());

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

/*
=================================
CLASSROOM ROUTES
=================================
*/

app.use("/api/classrooms", classroomRoutes);
app.use("/api/classroom", classroomRoutes);

/*
=================================
QUIZ ROUTES
=================================
*/

app.use("/api/quizzes", quizRoutes);

/*
=================================
QUESTION ROUTES
=================================
*/

app.use("/api/questions", questionRoutes);

/*
=================================
404 ROUTE HANDLER
(KEEP THIS LAST)
=================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
  });

  module.exports = app;