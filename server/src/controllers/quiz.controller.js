const db = require("../config/db");

exports.createQuiz = async (req, res) => {
  try {

    const {
      classroom_id,
      title,
      description,
      time_limit,
      total_marks,
    } = req.body;

    if (
      !classroom_id ||
      !title ||
      !time_limit
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Verify that the classroom belongs to this teacher
    const [classrooms] = await db.query(
      `
      SELECT id
      FROM classrooms
      WHERE id = ?
      AND teacher_id = ?
      `,
      [
        classroom_id,
        req.user.id,
      ]
    );

    if (classrooms.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "You cannot create quizzes for this classroom",
      });
    }

    const [result] = await db.query(
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
        req.user.id,
        title,
        description,
        time_limit,
        total_marks || 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz: {
        id: result.insertId,
        classroom_id,
        title,
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

exports.getClassroomQuizzes = async (
  req,
  res
) => {
  try {

    const { classroomId } = req.params;

    // Verify classroom belongs to teacher
    const [classrooms] = await db.query(
      `
      SELECT id
      FROM classrooms
      WHERE id = ?
      AND teacher_id = ?
      `,
      [
        classroomId,
        req.user.id,
      ]
    );

    if (classrooms.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

const [quizzes] = await db.query(
  `
  SELECT
    q.id,
    q.title,
    q.description,
    q.time_limit,
    q.total_marks,
    q.created_at,
    COUNT(ques.id) AS total_questions
  FROM quizzes q
  LEFT JOIN questions ques
    ON q.id = ques.quiz_id
  WHERE q.classroom_id = ?
  GROUP BY
    q.id,
    q.title,
    q.description,
    q.time_limit,
    q.total_marks,
    q.created_at
  ORDER BY q.created_at DESC
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

/*
=================================
GET SINGLE QUIZ
GET /api/quizzes/:id
=================================
*/
  exports.getQuizById = async (req, res) => {
  try {
      const { id } = req.params;

    // Verify quiz belongs to teacher
    const [quizRows] = await db.query(
      `
      SELECT
        id,
        classroom_id,
        title,
        description,
        time_limit,
        total_marks,
        created_at
      FROM quizzes
      WHERE id = ?
      AND teacher_id = ?
      `,
      [id, req.user.id]
    );

    if (quizRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Fetch all questions
    const [questions] = await db.query(
      `
      SELECT
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        marks,
        explanation
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
UPDATE QUIZ
PUT /api/quizzes/:id
=================================
*/

exports.updateQuiz = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      title,
      description,
      time_limit,
      total_marks,
    } = req.body;

    if (
      !title ||
      !time_limit
    ) {

      return res.status(400).json({
        success: false,
        message: "Title and time limit are required",
      });

    }

    const [quiz] = await db.query(
      `
      SELECT id
      FROM quizzes
      WHERE
        id = ?
      AND
        teacher_id = ?
      `,
      [
        id,
        req.user.id,
      ]
    );

    if (quiz.length === 0) {

      return res.status(403).json({
        success: false,
        message: "Access denied",
      });

    }

    await db.query(
      `
      UPDATE quizzes
      SET
        title = ?,
        description = ?,
        time_limit = ?,
        total_marks = ?
      WHERE
        id = ?
      `,
      [
        title,
        description,
        time_limit,
        total_marks || 0,
        id,
      ]
    );

    return res.status(200).json({

      success: true,

      message: "Quiz updated successfully",

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
DELETE QUIZ
DELETE /api/quizzes/:id
=================================
*/

exports.deleteQuiz = async (req, res) => {

  try {

    const { id } = req.params;

    const [quiz] = await db.query(
      `
      SELECT id
      FROM quizzes
      WHERE
        id = ?
      AND
        teacher_id = ?
      `,
      [
        id,
        req.user.id,
      ]
    );

    if (quiz.length === 0) {

      return res.status(403).json({
        success: false,
        message: "Access denied",
      });

    }

    await db.query(
      `
      DELETE
      FROM quizzes
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({

      success: true,

      message: "Quiz deleted successfully",

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Internal Server Error",

    });

  }

};


exports.saveAIQuiz = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      classroom_id,
      title,
      description,
      time_limit,
      questions,
    } = req.body;

if (
  !title ||
  !time_limit ||
  !questions ||
  questions.length === 0
) {
  return res.status(400).json({
    success: false,
    message: "Missing required fields",
  });
}

    await connection.beginTransaction();

    const totalMarks = questions.reduce(
      (sum, q) => sum + (q.marks || 1),
      0
    );

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
    classroom_id || null,
    req.user.id,
    title,
    description || "",
    time_limit,
    totalMarks,
  ]
);

    const quizId = quizResult.insertId;

function getCorrectOption(q) {
  const answer = q.answer.trim().toLowerCase();

  const index = q.options.findIndex(
    (option) =>
      option.trim().toLowerCase() === answer
  );

  switch (index) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "C";
    case 3:
      return "D";
    default:
      throw new Error(
        `Correct answer "${q.answer}" does not match any option`
      );
  }
}

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
          q.marks || 1,
          q.explanation || null,
        ]
      );
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      quizId,
      message: "Quiz saved successfully",
    });

  } catch (err) {
    await connection.rollback();
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  } finally {
    connection.release();
  }
};
exports.getTeacherQuizzes = async (req, res) => {
    try {

        const quizzes = await quizService.getTeacherQuizzes(req.user.id);

        res.json({
            success: true,
            quizzes
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};