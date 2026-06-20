const express = require("express");
const cors = require("cors");

const testRoute = require("./routes/test.route");
const authRoutes = require("./routes/auth.routes");
const classroomRoutes = require("./routes/classroom.routes");

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
    message: "QuizVerse Backend Running"
  });
});

/*
=================================
API ROUTES
=================================
*/

app.use("/api/test", testRoute);

app.use("/api/auth", authRoutes);

app.use("/api/classroom", classroomRoutes);

/*
=================================
404 ROUTE HANDLER
=================================
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

/*
=================================
EXPORT APP
=================================
*/

module.exports = app;