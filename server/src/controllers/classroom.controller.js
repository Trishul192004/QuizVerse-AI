const db = require("../config/db");

const generateJoinCode = require(
  "../utils/generateJoinCode"
);

exports.createClassroom = async (
  req,
  res
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Classroom name is required",
      });
    }

    const joinCode = generateJoinCode();

    const [result] = await db.query(
      `
      INSERT INTO classrooms
      (name, join_code, teacher_id)
      VALUES (?, ?, ?)
      `,
      [
        name,
        joinCode,
        req.user.id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Classroom created successfully",
      classroom: {
        id: result.insertId,
        name,
        joinCode,
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

exports.getTeacherClassrooms = async (
  req,
  res
) => {
  try {

    const [rows] = await db.query(
      `
      SELECT
        id,
        name,
        join_code,
        created_at
      FROM classrooms
      WHERE teacher_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    return res.status(200).json({
      success: true,
      classrooms: rows,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch classrooms",
    });

  }
};


exports.deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT id
      FROM classrooms
      WHERE id = ?
      AND teacher_id = ?
      `,
      [id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    await db.query(
      `
      DELETE FROM classrooms
      WHERE id = ?
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "Classroom deleted successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};