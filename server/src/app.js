const express = require("express");
const cors = require("cors");
const testRoute = require("./routes/test.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "QuizVerse Backend Running"
  });
});

app.use("/api/test", testRoute);

module.exports = app;