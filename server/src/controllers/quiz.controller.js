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
        id,
        title,
        description,
        time_limit,
        total_marks,
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

/*
=================================
GET SINGLE QUIZ
GET /api/quizzes/:id
=================================
*/

exports.getQuizById = async (req, res) => {

  try {

    const { id } = req.params;

    const [quiz] = await db.query(
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

      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });

    }

    return res.status(200).json({

      success: true,

      quiz: quiz[0],

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


