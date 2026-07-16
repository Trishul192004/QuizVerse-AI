const db = require("../config/db");

/*
=================================
JOIN CLASSROOM
POST /api/student/join-classroom
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

    /*
    =================================
    FIND CLASSROOM
    =================================
    */

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

    /*
    =================================
    CHECK ALREADY JOINED
    =================================
    */

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

    /*
    =================================
    JOIN CLASSROOM
    =================================
    */

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

/*
=================================
GET STUDENT CLASSROOMS
GET /api/student/classrooms
=================================
*/

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