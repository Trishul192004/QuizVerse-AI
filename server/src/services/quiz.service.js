const db = require("../config/db");

async function saveQuiz({
  classroom_id,
  teacher_id,
  title,
  description,
  time_limit,
  questions,
}) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const total_marks = questions.length;

    const [quizResult] = await connection.query(
      `
      INSERT INTO quizzes
      (
        classroom_id,
        teacher_id,
        title,
        description,
        time_limit,
        total_marks
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        classroom_id,
        teacher_id,
        title,
        description,
        time_limit,
        total_marks,
      ]
    );

    const quizId = quizResult.insertId;

    for (const q of questions) {
      await connection.query(
        `
        INSERT INTO questions
        (
          quiz_id,
          question,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option,
          marks,
          explanation
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          quizId,
          q.question,
          q.options[0],
          q.options[1],
          q.options[2],
          q.options[3],
          getCorrectOption(q),
          1,
          q.explanation,
        ]
      );
    }

    await connection.commit();

    return quizId;

  } catch (err) {

    await connection.rollback();
    throw err;

  } finally {

    connection.release();

  }
}

function getCorrectOption(question) {

  const index = question.options.findIndex(
    (option) =>
      option.trim() === question.answer.trim()
  );

  if (index === 0) return "A";
  if (index === 1) return "B";
  if (index === 2) return "C";
  if (index === 3) return "D";

  throw new Error(
    `Correct answer "${question.answer}" does not match any option.`
  );
}

async function getTeacherQuizzes(teacherId) {

  const [rows] = await db.query(
    `
    SELECT
      q.id,
      q.title,
      q.description,
      q.time_limit,
      q.total_marks,
      q.classroom_id,
      q.created_at,
      COUNT(ques.id) AS total_questions
    FROM quizzes q
    LEFT JOIN questions ques
      ON q.id = ques.quiz_id
    WHERE q.teacher_id = ?
    GROUP BY
      q.id,
      q.title,
      q.description,
      q.time_limit,
      q.total_marks,
      q.classroom_id,
      q.created_at
    ORDER BY q.created_at DESC
    `,
    [teacherId]
  );

  return rows;
}

module.exports = {
  saveQuiz,
  getTeacherQuizzes,
};