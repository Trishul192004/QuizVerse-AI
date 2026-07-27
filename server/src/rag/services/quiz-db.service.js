const db = require("../../config/db");

async function saveQuiz({
    teacherId,
    classroomId = null,
    title,
    description,
    timeLimit,
    questions,
}) {
    const totalMarks = questions.length;

    const [quizResult] = await db.execute(
        `
        INSERT INTO quizzes
        (classroom_id, teacher_id, title, description, time_limit, total_marks)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            classroomId,
            teacherId,
            title,
            description,
            timeLimit,
            totalMarks,
        ]
    );

    const quizId = quizResult.insertId;

    for (const q of questions) {

            const correctOption = q.correctOption;

        await db.execute(
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
                correctOption,
                1,
                q.explanation || null,
            ]
        );
    }

    return quizId;
}

module.exports = {
    saveQuiz,
};