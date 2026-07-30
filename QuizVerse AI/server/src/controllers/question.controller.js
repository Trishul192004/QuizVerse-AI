const db = require("../config/db");

/*
=================================
CREATE QUESTION
POST /api/questions/create
=================================
*/

exports.createQuestion = async (req, res) => {

  console.log("\n========== CREATE QUESTION ==========");
  console.log("Headers:");
  console.log(req.headers);

  console.log("\nBody:");
  console.log(req.body);

  console.log("=====================================\n");

  try {

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is undefined",
      });
    }

    const {
      quiz_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      marks,
    } = req.body;

    if (
      !quiz_id ||
      !question ||
      !option_a ||
      !option_b ||
      !option_c ||
      !option_d ||
      !correct_option
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    if (
      !["A", "B", "C", "D"].includes(correct_option)
    ) {
      return res.status(400).json({
        success: false,
        message: "Correct option must be A, B, C or D",
      });
    }

    /*
    ==========================
    VERIFY QUIZ OWNERSHIP
    ==========================
    */

    const [quiz] = await db.query(
      `
      SELECT
        q.id
      FROM quizzes q
      INNER JOIN classrooms c
        ON q.classroom_id = c.id
      WHERE
        q.id = ?
      AND
        c.teacher_id = ?
      `,
      [
        quiz_id,
        req.user.id,
      ]
    );

    if (quiz.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    /*
    ==========================
    INSERT QUESTION
    ==========================
    */

    const [result] = await db.query(
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
        marks
      )
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        quiz_id,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        marks || 1,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Question added successfully",
      question: {
        id: result.insertId,
      },
    });

  } catch (error) {

    console.error("\n========== CREATE QUESTION ERROR ==========");
    console.error(error);
    console.error("SQL Message:", error.sqlMessage);
    console.error("SQL Code:", error.code);
    console.error("==========================================\n");

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }

  };
/*
=================================
GET QUESTIONS OF A QUIZ
GET /api/questions/quiz/:quizId
=================================
*/

exports.getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

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
        created_at
      FROM questions
      WHERE quiz_id = ?
      ORDER BY id ASC
      `,
      [quizId]
    );

    return res.status(200).json({
      success: true,
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

/*
=================================
UPDATE QUESTION
PUT /api/questions/:id
=================================
*/

exports.updateQuestion = async (req, res) => {
  console.log("updateQuestion reached. params:", req.params, "user:", req.user);
  console.log("updateQuestion body:", req.body);
  try {

    const { id } = req.params;

    const {
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      marks,
    } = req.body;

    if (
      !question ||
      !option_a ||
      !option_b ||
      !option_c ||
      !option_d ||
      !correct_option
    ) {

      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });

    }

    if (
      !["A", "B", "C", "D"].includes(correct_option)
    ) {

      return res.status(400).json({
        success: false,
        message: "Correct option must be A, B, C or D",
      });

    }

    /*
    =====================================
    VERIFY QUESTION BELONGS TO TEACHER
    =====================================
    */

    const [result] = await db.query(
      `
      SELECT qn.id
      FROM questions qn
      JOIN quizzes q
      ON qn.quiz_id = q.id
      JOIN classrooms c
      ON q.classroom_id = c.id
      WHERE
      qn.id = ?
      AND
      c.teacher_id = ?
      `,
      [
        id,
        req.user.id,
      ]
    );

    if (result.length === 0) {

      return res.status(403).json({
        success: false,
        message: "Access denied",
      });

    }

    /*
    =====================================
    UPDATE QUESTION
    =====================================
    */

    await db.query(
      `
      UPDATE questions
      SET
      question=?,
      option_a=?,
      option_b=?,
      option_c=?,
      option_d=?,
      correct_option=?,
      marks=?
      WHERE id=?
      `,
      [
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        marks || 1,
        id,
      ]
    );

    return res.status(200).json({

      success: true,

      message: "Question updated successfully",

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Internal Server Error",

    });

  }

};

/*
=================================
DELETE QUESTION
DELETE /api/questions/:id
=================================
*/

exports.deleteQuestion = async (req, res) => {

  try {

    const { id } = req.params;

    /*
    =====================================
    VERIFY QUESTION BELONGS TO TEACHER
    =====================================
    */

    const [question] = await db.query(
      `
      SELECT
        qn.id
      FROM questions qn
      JOIN quizzes q
        ON qn.quiz_id = q.id
      JOIN classrooms c
        ON q.classroom_id = c.id
      WHERE
        qn.id = ?
      AND
        c.teacher_id = ?
      `,
      [
        id,
        req.user.id,
      ]
    );

    if (question.length === 0) {

      return res.status(403).json({
        success: false,
        message: "Access denied",
      });

    }

    /*
    =====================================
    DELETE QUESTION
    =====================================
    */

    await db.query(
      `
      DELETE FROM questions
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({

      success: true,

      message: "Question deleted successfully",

    });

  }

  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,

      message: "Internal Server Error",

    });

  }

};
