const db = require("../config/db");

/*
=================================
JOIN CLASSROOM
POST /api/student/join-classroom
=================================
*/

 

/*
=================================
START QUIZ
POST /api/student/start-quiz/:quizId
=================================
*/
exports.joinClassroom = async (req, res) => {
    try {
    const { join_code } = req.body;

    if (!join_code) {
      return res.status(400).json({
        success: false,
        message: "Join code is required",
      });
    }

    // Find classroom
    const [classrooms] = await db.query(
      `
      SELECT
        id,
        name,
        join_code
      FROM classrooms
      WHERE join_code = ?
      `,
      [join_code]
    );

    if (classrooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid join code",
      });
    }

    const classroom = classrooms[0];

    // Already joined?
    const [existing] = await db.query(
      `
      SELECT id
      FROM classroom_students
      WHERE classroom_id = ?
      AND student_id = ?
      `,
      [
        classroom.id,
        req.user.id,
      ]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already joined this classroom",
      });
    }

    // Join classroom
    await db.query(
      `
      INSERT INTO classroom_students
      (
        classroom_id,
        student_id
      )
      VALUES (?, ?)
      `,
      [
        classroom.id,
        req.user.id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Joined classroom successfully",
      classroom,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
  };
exports.getStudentClassrooms = async (req, res) => {
  try {

    const [classrooms] = await db.query(
      `
      SELECT
        c.id,
        c.name,
        c.join_code,
        c.created_at,
        u.username AS teacher_name
      FROM classroom_students cs
      JOIN classrooms c
        ON cs.classroom_id = c.id
      JOIN users u
        ON c.teacher_id = u.id
      WHERE cs.student_id = ?
      ORDER BY c.created_at DESC
      `,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      classrooms,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
  };
exports.getStudentClassroomQuizzes = async (req, res) => {
  try {

    const { classroomId } = req.params;

    // Verify student belongs to classroom
    const [membership] = await db.query(
      `
      SELECT id
      FROM classroom_students
      WHERE classroom_id = ?
      AND student_id = ?
      `,
      [
        classroomId,
        req.user.id,
      ]
    );

    if (membership.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this classroom",
      });
    }

    // Classroom details
    const [classrooms] = await db.query(
      `
      SELECT
        c.id,
        c.name,
        u.username AS teacher_name
      FROM classrooms c
      JOIN users u
        ON c.teacher_id = u.id
      WHERE c.id = ?
      `,
      [classroomId]
    );

    if (classrooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    // Quiz list
    const [quizzes] = await db.query(
      `
      SELECT
        id,
        title,
        description,
        total_marks,
        time_limit,
        created_at
      FROM quizzes
      WHERE classroom_id = ?
      ORDER BY created_at DESC
      `,
      [classroomId]
    );

    return res.status(200).json({
      success: true,
      classroom: classrooms[0],
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


  exports.getAIStudyQuizzes = async (req, res) => {
  try {
    const { classroomId } = req.params;

    // Verify student belongs to classroom
    const [membership] = await db.query(
      `
      SELECT id
      FROM classroom_students
      WHERE classroom_id = ?
      AND student_id = ?
      `,
      [classroomId, req.user.id]
    );

    if (membership.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this classroom",
      });
    }

    // Get quizzes of this classroom
    const [quizzes] = await db.query(
      `
      SELECT
        id,
        title,
        description,
        total_marks,
        time_limit,
        created_at
      FROM quizzes
      WHERE classroom_id = ?
      ORDER BY created_at DESC
      `,
      [classroomId]
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

exports.getQuizForStudent = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Load quiz
    const [quizRows] = await db.query(
      `
      SELECT
        id,
        classroom_id,
        title,
        description,
        time_limit,
        total_marks
      FROM quizzes
      WHERE id = ?
      `,
      [quizId]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const quiz = quizRows[0];

    // Verify student belongs to classroom
    const [membership] = await db.query(
      `
      SELECT id
      FROM classroom_students
      WHERE classroom_id = ?
      AND student_id = ?
      `,
      [quiz.classroom_id, req.user.id]
    );

    if (membership.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this classroom",
      });
    }

    // Load questions
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
      [quizId]
    );

    return res.status(200).json({
      success: true,
      quiz,
      questions,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.startQuiz = async (req, res) => {
  try {

    const { quizId } = req.params;

    // Check quiz exists
    const [quizRows] = await db.query(
      `
      SELECT
        id,
        classroom_id,
        title,
        time_limit,
        total_marks
      FROM quizzes
      WHERE id = ?
      `,
      [quizId]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const quiz = quizRows[0];

    // Verify student belongs to classroom
    const [membership] = await db.query(
      `
      SELECT id
      FROM classroom_students
      WHERE classroom_id = ?
      AND student_id = ?
      `,
      [
        quiz.classroom_id,
        req.user.id,
      ]
    );

    if (membership.length === 0) { 
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this classroom",
      });
    }

    // Already submitted?
    const [submitted] = await db.query(
      `
      SELECT id
      FROM quiz_attempts
      WHERE quiz_id = ?
      AND student_id = ?
      AND status='SUBMITTED'
      `,
      [
        quizId,
        req.user.id,
      ]
    );

    if (submitted.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Quiz already submitted",
      });
    }

    // Resume unfinished attempt
    const [existing] = await db.query(
      `
      SELECT id
      FROM quiz_attempts
      WHERE quiz_id = ?
      AND student_id = ?
      AND status='IN_PROGRESS'
      `,
      [
        quizId,
        req.user.id,
      ]
    );

    if (existing.length > 0) {
      return res.status(200).json({
        success: true,
        attemptId: existing[0].id,
        resumed: true,
      });
    }

    // Create attempt
    const [attempt] = await db.query(
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
        quizId,
        req.user.id,
        quiz.total_marks,
      ]
    );

    return res.status(201).json({
      success: true,
      attemptId: attempt.insertId,
      resumed: false,
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
GET ATTEMPT QUIZ
GET /api/student/attempt/:attemptId
=================================
*/

exports.getAttemptQuiz = async (req, res) => {
  try {

    const { attemptId } = req.params;

    /*
    =================================
    VERIFY ATTEMPT
    =================================
    */

    const [attemptRows] = await db.query(
      `
      SELECT
        qa.id,
        qa.quiz_id,
        qa.student_id,
        qa.status,
        qa.started_at,
        q.title,
        q.description,
        q.time_limit,
        q.total_marks
      FROM quiz_attempts qa
      JOIN quizzes q
        ON qa.quiz_id = q.id
      WHERE qa.id = ?
      `,
      [attemptId]
    );

    if (attemptRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const attempt = attemptRows[0];

    if (attempt.student_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (attempt.status === "SUBMITTED") {
      return res.status(400).json({
        success: false,
        message: "Quiz already submitted",
      });
    }

    /*
    =================================
    GET QUESTIONS
    =================================
    */

    const [questions] = await db.query(
      `
      SELECT
        id,
        question,
        question_type,
        option_a,
        option_b,
        option_c,
        option_d,
        marks,
        explanation
      FROM questions
      WHERE quiz_id = ?
      ORDER BY id ASC
      `,
      [attempt.quiz_id]
    );

    /*
    =================================
    REMOVE ANSWERS
    =================================
    */

    const formattedQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      question_type: q.question_type,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      marks: q.marks,
      explanation: q.explanation,
    }));

    /*
    =================================
    RETURN
    =================================
    */

    return res.status(200).json({
      success: true,
      attempt: {
        id: attempt.id,
        quiz_id: attempt.quiz_id,
        title: attempt.title,
        description: attempt.description,
        time_limit: attempt.time_limit,
        total_marks: attempt.total_marks,
        started_at: attempt.started_at,
      },
      questions: formattedQuestions,
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
POST /api/student/submit/:attemptId
=================================
*/

exports.submitQuiz = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { attemptId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Answers are required",
      });
    }

    /*
    =================================
    VERIFY ATTEMPT
    =================================
    */

    const [attemptRows] = await connection.query(
      `
      SELECT
        id,
        quiz_id,
        student_id,
        status,
        total_marks
      FROM quiz_attempts
      WHERE id = ?
      `,
      [attemptId]
    );

    if (attemptRows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const attempt = attemptRows[0];

    if (attempt.student_id !== req.user.id) {
      await connection.rollback();

      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (attempt.status === "SUBMITTED") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Quiz already submitted",
      });
    }

    /*
    =================================
    LOAD QUESTIONS
    =================================
    */

    const [questions] = await connection.query(
      `
      SELECT
        id,
        question_type,
        correct_option,
        answer,
        marks
      FROM questions
      WHERE quiz_id = ?
      `,
      [attempt.quiz_id]
    );

    const questionMap = new Map();

    questions.forEach((question) => {
      questionMap.set(question.id, question);
    });

    let score = 0;
    let correct = 0;
    let wrong = 0;

    /*
    =================================
    SAVE ANSWERS
    =================================
    */

    for (const answer of answers) {
      const question = questionMap.get(answer.question_id);

      if (!question) continue;

      const isDescriptive = question.question_type === "DESCRIPTIVE";

      const isCorrect = isDescriptive
        ? false
        : answer.selected_option === question.correct_option;

      const marksAwarded = isCorrect ? question.marks : 0;

      if (!isDescriptive) {
        if (isCorrect) {
          score += marksAwarded;
          correct++;
        } else {
          wrong++;
        }
      }

      await connection.query(
        `
        INSERT INTO student_answers
        (
          attempt_id,
          question_id,
          selected_option,
          answer_text,
          is_correct,
          marks_awarded
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          attempt.id,
          question.id,
          isDescriptive ? null : (answer.selected_option || null),
          isDescriptive ? (answer.answer || null) : null,
          isCorrect,
          marksAwarded,
        ]
      );
    }

    /*
    =================================
    UPDATE ATTEMPT
    =================================
    */

    await connection.query(
      `
      UPDATE quiz_attempts
      SET
        score = ?,
        status = 'SUBMITTED',
        submitted_at = NOW()
      WHERE id = ?
      `,
      [
        score,
        attempt.id,
      ]
    );
  
    /*
=================================
AWARD XP & COINS
=================================
*/
/*
=================================
AWARD XP & COINS
=================================
*/

const earnedXP = score * 10;
const earnedCoins = score * 2;

const [updateResult] = await connection.query(
  `
  UPDATE users
  SET
    xp = xp + ?,
    coins = coins + ?
  WHERE id = ?
  `,
  [
    earnedXP,
    earnedCoins,
    attempt.student_id,
  ]
);

console.log("Student ID:", attempt.student_id);
console.log("Score:", score);
console.log("XP Earned:", earnedXP);
console.log("Coins Earned:", earnedCoins);
console.log("Update Result:", updateResult);
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      score,
      total_marks: attempt.total_marks,
      correct,
      wrong,
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
REVIEW QUIZ
GET /api/student/review/:attemptId
=================================
*/

exports.getQuizReview = async (req, res) => {
  try {
    const { attemptId } = req.params;

    /*
    =================================
    VERIFY ATTEMPT
    =================================
    */

    const [attemptRows] = await db.query(
      `
      SELECT
        id,
        quiz_id,
        student_id,
        score,
        total_marks,
        status
      FROM quiz_attempts
      WHERE id = ?
      `,
      [attemptId]
    );

    if (attemptRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const attempt = attemptRows[0];

    if (attempt.student_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /*
    =================================
    LOAD QUESTIONS + ANSWERS
    =================================
    */

    const [questions] = await db.query(
      `
      SELECT
        q.id,
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

      FROM questions q

      LEFT JOIN student_answers sa
        ON sa.question_id = q.id
       AND sa.attempt_id = ?

      WHERE q.quiz_id = ?

      ORDER BY q.id ASC
      `,
      [
        attempt.id,
        attempt.quiz_id,
      ]
    );

    const correct = questions.filter(
      (q) => q.is_correct === 1
    ).length;

    const wrong = questions.filter(
      (q) => q.selected_option && q.is_correct === 0
    ).length;

    return res.status(200).json({
      success: true,

      result: {
        score: attempt.score,
        total_marks: attempt.total_marks,
        correct,
        wrong,
      },

      questions,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};
exports.getLeaderboard = async (req, res) => {
  try {
    const [leaderboard] = await db.query(`
      SELECT
        ROW_NUMBER() OVER (
          ORDER BY xp DESC, coins DESC
        ) AS user_rank,
        id,
        username,
        avatar_url,
        xp,
        coins
      FROM users
      WHERE role = 'student'
      ORDER BY xp DESC, coins DESC
    `);

    return res.status(200).json({
      success: true,
      leaderboard,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};