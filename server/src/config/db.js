const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Trishul@1992004",
  database: "quizverse_ai"
});

module.exports = connection.promise();