const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

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
const teacherRoutes = require("./routes/teacher.routes");
const aiRoutes = require("./routes/ai.routes");
const studentQuizRoutes = require("./routes/studentQuiz.routes");
const battleRoutes = require("./routes/battle.routes");
const battleAIRoutes = require("./routes/battleAI.routes");
const ragRoutes = require("./rag/routes/rag.routes");/*
=================================
GLOBAL MIDDLEWARE
=================================
*/

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/rag", ragRoutes);

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
DEBUG ROUTE
=================================
*/

app.post("/debug", (req, res) => {
  console.log(req.headers);
  console.log(req.body);

  res.json({
    success: true,
    body: req.body,
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
app.use("/api/teacher", teacherRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/student", studentQuizRoutes);
app.use("/api/battle", battleRoutes);
app.use("/api/battle-ai", battleAIRoutes);

/*
=================================
404
=================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

module.exports = app;