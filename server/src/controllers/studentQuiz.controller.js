const db = require("../config/db");

/*
=================================
GET AVAILABLE QUIZZES
GET /api/student/quizzes
=================================
*/
exports.getAvailableQuizzes = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [quizzes] = await db.query(
      `
      SELECT
        q.id,
        q.title,
        q.description,
        q.time_limit,
        q.total_marks,
        q.created_at,
        c.id AS classroom_id,
        c.name AS classroom_name,
        COUNT(ques.id) AS total_questions
      FROM quizzes q
      INNER JOIN classrooms c
        ON q.classroom_id = c.id
      INNER JOIN classroom_students cs
        ON cs.classroom_id = c.id
      LEFT JOIN questions ques
        ON ques.quiz_id = q.id
      WHERE cs.student_id = ?
      GROUP BY
        q.id,
        q.title,
        q.description,
        q.time_limit,
        q.total_marks,
        q.created_at,
        c.id,
        c.name
      ORDER BY q.created_at DESC
      `,
      [studentId]
    );

    return res.status(200).json({
      success: true,
      quizzes,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
/*
=================================
GET QUIZ FOR STUDENT
GET /api/student/quizzes/:id
=================================
*/
exports.getQuizForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { id } = req.params;

    // Verify student has access to this quiz
    const [quizRows] = await db.query(
      `
      SELECT
        q.id,
        q.classroom_id,
        q.title,
        q.description,
        q.time_limit,
        q.total_marks,
        c.name AS classroom_name
      FROM quizzes q
      INNER JOIN classrooms c
        ON q.classroom_id = c.id
      INNER JOIN classroom_students cs
        ON cs.classroom_id = c.id
      WHERE
        q.id = ?
      AND
        cs.student_id = ?
      `,
      [id, studentId]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found or access denied",
      });
    }

    // Fetch questions (DO NOT send correct answers)
    const [questions] = await db.query(
      `
      SELECT
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        marks
      FROM questions
      WHERE quiz_id = ?
      ORDER BY id ASC
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      quiz: {
        ...quizRows[0],
        total_questions: questions.length,
        questions,
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
/*
=================================
START QUIZ ATTEMPT
POST /api/student/quizzes/:id/start
=================================
*/
exports.startQuizAttempt = async (req, res) => {
  try {

    const studentId = req.user.id;
    const { id } = req.params;

    // Verify quiz belongs to a classroom that student has joined
    const [quizRows] = await db.query(
      `
      SELECT
        q.id,
        q.total_marks
      FROM quizzes q
      INNER JOIN classroom_students cs
        ON q.classroom_id = cs.classroom_id
      WHERE
        q.id = ?
      AND
        cs.student_id = ?
      `,
      [id, studentId]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found or access denied",
      });
    }

    // Check if already submitted
    const [submittedAttempt] = await db.query(
      `
      SELECT
        id,
        status
      FROM quiz_attempts
      WHERE
        quiz_id = ?
      AND
        student_id = ?
      AND
        status = 'SUBMITTED'
      LIMIT 1
      `,
      [id, studentId]
    );

    if (submittedAttempt.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this quiz.",
      });
    }

    // Check if an unfinished attempt exists
    const [existingAttempt] = await db.query(
      `
      SELECT
        id
      FROM quiz_attempts
      WHERE
        quiz_id = ?
      AND
        student_id = ?
      AND
        status = 'IN_PROGRESS'
      LIMIT 1
      `,
      [id, studentId]
    );

    if (existingAttempt.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Existing attempt found.",
        attemptId: existingAttempt[0].id,
      });
    }

    // Create new attempt
    const [result] = await db.query(
      `
      INSERT INTO quiz_attempts
      (
        quiz_id,
        student_id,
        total_marks
      )
      VALUES (?, ?, ?)
      `,
      [
        id,
        studentId,
        quizRows[0].total_marks,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Quiz started successfully.",
      attemptId: result.insertId,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

/*
=================================
SUBMIT QUIZ
POST /api/student/quizzes/:id/submit
=================================
*/
exports.submitQuiz = async (req, res) => {
  const connection = await db.getConnection();

  try {

    const studentId = req.user.id;
    const { id } = req.params;
    const { attemptId, answers } = req.body;

    if (!attemptId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Attempt ID and answers are required",
      });
    }

    await connection.beginTransaction();

    // Verify attempt
    const [attemptRows] = await connection.query(
      `
      SELECT
        id,
        status
      FROM quiz_attempts
      WHERE
        id = ?
      AND
        quiz_id = ?
      AND
        student_id = ?
      `,
      [
        attemptId,
        id,
        studentId,
      ]
    );

    if (attemptRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Quiz attempt not found",
      });
    }

    if (attemptRows[0].status === "SUBMITTED") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Quiz already submitted",
      });
    }

    // Fetch correct answers
    const [questions] = await connection.query(
      `
      SELECT
        id,
        correct_option,
        marks
      FROM questions
      WHERE quiz_id = ?
      `,
      [id]
    );

    const questionMap = new Map();

    questions.forEach((q) => {
      questionMap.set(q.id, q);
    });

    let totalScore = 0;

    for (const answer of answers) {

      const question = questionMap.get(answer.question_id);

      if (!question) continue;

      const isCorrect =
        answer.selected_option === question.correct_option;

      const marksAwarded = isCorrect
        ? question.marks
        : 0;

      if (isCorrect) {
        totalScore += question.marks;
      }

      await connection.query(
        `
        INSERT INTO student_answers
        (
          attempt_id,
          question_id,
          selected_option,
          is_correct,
          marks_awarded
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          attemptId,
          answer.question_id,
          answer.selected_option,
          isCorrect,
          marksAwarded,
        ]
      );
    }

    await connection.query(
      `
      UPDATE quiz_attempts
      SET
        score = ?,
        submitted_at = NOW(),
        status = 'SUBMITTED'
      WHERE id = ?
      `,
      [
        totalScore,
        attemptId,
      ]
    );


    const earnedXP = totalScore * 10;
const earnedCoins = totalScore * 2;

console.log("Student:", studentId);
console.log("Score:", totalScore);
console.log("XP:", earnedXP);
console.log("Coins:", earnedCoins);

await connection.query(
  `
  UPDATE users
  SET
    xp = xp + ?,
    coins = coins + ?
  WHERE id = ?
  `,
  [earnedXP, earnedCoins, studentId]
);

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      result: {
        attemptId,
        score: totalScore,
        totalMarks: questions.reduce(
          (sum, q) => sum + q.marks,
          0
        ),
        correctAnswers: answers.filter((a) => {
          const q = questionMap.get(a.question_id);
          return (
            q &&
            q.correct_option === a.selected_option
          );
        }).length,
        totalQuestions: questions.length,
      },
    });

  } catch (error) {

    await connection.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  } finally {

    connection.release();

  }
};
/*
=================================
GET ATTEMPT RESULT
GET /api/student/attempt/:id/result
=================================
*/
exports.getAttemptResult = async (req, res) => {
  try {

    const studentId = req.user.id;
    const { id } = req.params;

    // Verify attempt belongs to logged-in student
    const [attemptRows] = await db.query(
      `
      SELECT
        qa.id,
        qa.quiz_id,
        qa.score,
        qa.total_marks,
        qa.started_at,
        qa.submitted_at,
        qa.status,
        q.title,
        q.description
      FROM quiz_attempts qa
      INNER JOIN quizzes q
        ON qa.quiz_id = q.id
      WHERE
        qa.id = ?
      AND
        qa.student_id = ?
      `,
      [
        id,
        studentId,
      ]
    );

    if (attemptRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    // Fetch all answers with question details
    const [answers] = await db.query(
      `
      SELECT
        q.id AS question_id,
        q.question,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option,
        q.explanation,
        q.marks,
        sa.selected_option,
        sa.is_correct,
        sa.marks_awarded
      FROM student_answers sa
      INNER JOIN questions q
        ON sa.question_id = q.id
      WHERE sa.attempt_id = ?
      ORDER BY q.id ASC
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      result: {
        ...attemptRows[0],
        total_questions: answers.length,
        answers,
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};