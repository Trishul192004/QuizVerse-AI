    const db = require("../config/db");
    const getQuizAnalytics = async (req, res) => {
    try {
        const { quizId } = req.params;

        // Quiz Details
        const [quizRows] = await db.query(
        `
        SELECT id, title, total_marks, classroom_id
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

        // Total Students
        const [studentRows] = await db.query(
        `
        SELECT COUNT(*) AS total_students
        FROM classroom_students
        WHERE classroom_id = ?
        `,
        [quiz.classroom_id]
        );

        // Submitted Stats
        const [statsRows] = await db.query(
        `
        SELECT
            COUNT(*) submitted,
            COALESCE(AVG(score),0) average_score,
            COALESCE(MAX(score),0) highest_score,
            COALESCE(MIN(score),0) lowest_score
        FROM quiz_attempts
        WHERE quiz_id = ?
        AND status='SUBMITTED'
        `,
        [quizId]
        );

        // Student Attempts
        const [attemptRows] = await db.query(
        `
        SELECT
            qa.id AS attempt_id,
            qa.student_id,
            u.username,
            qa.score,
            qa.total_marks,
            qa.status,
            qa.started_at,
            qa.submitted_at
        FROM quiz_attempts qa
        JOIN users u
        ON qa.student_id = u.id
        WHERE qa.quiz_id = ?
        ORDER BY qa.started_at DESC
        `,
        [quizId]
        );

        const summary = statsRows[0];

        res.json({
        success: true,

        quiz,

        summary: {
            total_students: studentRows[0].total_students,
            submitted: summary.submitted,
            pending:
            studentRows[0].total_students - summary.submitted,
            average_score: Number(summary.average_score),
            highest_score: summary.highest_score,
            lowest_score: summary.lowest_score,
        },

        students: attemptRows,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
        success: false,
        message: "Internal Server Error",
        });
    }
    };


    const getAttemptDetails = async (req, res) => {
    try {
        const { attemptId } = req.params;

        // Attempt Summary
        const [attemptRows] = await db.query(
        `
        SELECT
            qa.id,
            qa.score,
            qa.total_marks,
            qa.started_at,
            qa.submitted_at,
            u.username,
            q.title
        FROM quiz_attempts qa
        JOIN users u
            ON qa.student_id = u.id
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

        // Question-wise Details
        const [questionRows] = await db.query(
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

        FROM student_answers sa

        JOIN questions q
            ON sa.question_id = q.id

        WHERE sa.attempt_id = ?

        ORDER BY q.id
        `,
        [attemptId]
        );

        res.json({
        success: true,
        attempt: attemptRows[0],
        questions: questionRows,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
        success: false,
        message: "Internal Server Error",
        });
    }
    };

module.exports = {
  getQuizAnalytics,
  getAttemptDetails,
};