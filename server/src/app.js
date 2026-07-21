const express = require("express");
require("dotenv").config();
const cors = require("cors");
const teacherRoutes = require("./routes/teacher.routes");

/*
=================================
ROUTES
=================================
*/

const testRoute = require("./routes/test.route");
const authRoutes = require("./routes/auth.routes");
const classroomRoutes = require("./routes/classroom.routes");
const quizRoutes = require("./routes/quiz.routes");
const questionRoutes = require("./routes/question.routes");
const studentRoutes = require("./routes/student.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

/*
=================================
GLOBAL MIDDLEWARE
=================================
*/

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/teacher", teacherRoutes);

/*
=================================
DEBUG ROUTE
=================================
*/

  app.post("/debug", (req, res) => {
  console.log("\n========= DEBUG =========");
    console.log(req.headers);
    console.log(req.body);
  console.log("=========================\n");

  res.json({
    success: true,
    body: req.body,
  });
  });

/*
=================================
HEALTH CHECK
=================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "QuizVerse Backend Running 🚀",
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
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/ai", aiRoutes);

/*
=================================
404 HANDLER
=================================
*/

  app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
  });

module.exports = app;