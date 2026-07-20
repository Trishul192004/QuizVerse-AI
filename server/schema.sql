/*
=============================================
QUIZVERSE AI - DATABASE SCHEMA
Run this to verify/fix your database schema
=============================================
*/

CREATE DATABASE IF NOT EXISTS quizverse_ai;

USE quizverse_ai;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
  xp INT DEFAULT 0,
  coins INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- REFRESH TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- CLASSROOMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS classrooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  join_code VARCHAR(10) NOT NULL UNIQUE,
  teacher_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- CLASSROOM STUDENTS (Enrollment) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS classroom_students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  classroom_id INT NOT NULL,
  student_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (classroom_id, student_id),
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- QUIZZES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  classroom_id INT NOT NULL,
  teacher_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  time_limit INT NOT NULL DEFAULT 10,
  total_marks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_option ENUM('A', 'B', 'C', 'D') NOT NULL,
  marks INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- ============================================
-- VERIFY ROLE VALUES
-- Run this to check for role issues
-- ============================================
SELECT id, username, email, role FROM users;

-- ============================================
-- VERIFY CLASSROOM ENROLLMENTS
-- ============================================
SELECT
  c.id AS classroom_id,
  c.name AS classroom_name,
  c.join_code,
  u.username AS teacher_name,
  COUNT(cs.student_id) AS student_count
FROM classrooms c
JOIN users u ON c.teacher_id = u.id
LEFT JOIN classroom_students cs ON c.id = cs.classroom_id
GROUP BY c.id, c.name, c.join_code, u.username;

-- ============================================
-- VERIFY STUDENT ENROLLMENTS
-- ============================================
SELECT
  cs.student_id,
  u.username AS student_name,
  cs.classroom_id,
  c.name AS classroom_name
FROM classroom_students cs
JOIN users u ON cs.student_id = u.id
JOIN classrooms c ON cs.classroom_id = c.id;
