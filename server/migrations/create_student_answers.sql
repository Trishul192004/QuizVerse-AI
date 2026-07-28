-- ============================================================
-- MIGRATION: Create student_answers table
-- Run this against the quizverse_ai database
-- ============================================================

USE quizverse_ai;

CREATE TABLE IF NOT EXISTS student_answers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id    INT          NOT NULL,
  question_id   INT          NOT NULL,
  selected_option ENUM('A','B','C','D') DEFAULT NULL,   -- MCQ answer
  answer_text   TEXT         DEFAULT NULL,              -- DESCRIPTIVE answer
  is_correct    TINYINT(1)   NOT NULL DEFAULT 0,
  marks_awarded INT          NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id)  REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id)     ON DELETE CASCADE
);
