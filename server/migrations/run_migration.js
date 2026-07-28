require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mysql = require("mysql2/promise");

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS student_answers (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      attempt_id      INT           NOT NULL,
      question_id     INT           NOT NULL,
      selected_option ENUM('A','B','C','D') DEFAULT NULL,
      answer_text     TEXT          DEFAULT NULL,
      is_correct      TINYINT(1)    NOT NULL DEFAULT 0,
      marks_awarded   INT           NOT NULL DEFAULT 0,
      created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (attempt_id)  REFERENCES quiz_attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id)     ON DELETE CASCADE
    )
  `);

  console.log("student_answers table created / already exists — OK");
  await conn.end();
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
