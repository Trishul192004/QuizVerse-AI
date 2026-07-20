const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "quizverse_ai",
});

module.exports = connection.promise();