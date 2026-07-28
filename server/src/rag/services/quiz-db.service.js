const db = require("../../config/db");

function getCorrectOption(question) {
    if (!question.options || !question.answer) {
        return null;
    }

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

async function saveQuiz({
    teacherId,
    classroomId = null,
    title,
    description,
    timeLimit,
    questions,
}) {

    const totalMarks = questions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0
    );

    const [quizResult] = await db.execute(
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

        const isMCQ = q.type === "MCQ";

        const optionA =
            isMCQ ? (q.options?.[0] ?? null) : null;

        const optionB =
            isMCQ ? (q.options?.[1] ?? null) : null;

        const optionC =
            isMCQ ? (q.options?.[2] ?? null) : null;

        const optionD =
            isMCQ ? (q.options?.[3] ?? null) : null;

        const correctOption =
            isMCQ ? getCorrectOption(q) : null;

        await db.execute(
            `
            INSERT INTO questions
            (
                quiz_id,
                question,
                question_type,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_option,
                answer,
                marks,
                explanation
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                quizId,

                q.question,

                isMCQ ? "MCQ" : "DESCRIPTIVE",

                optionA,
                optionB,
                optionC,
                optionD,

                correctOption,

                isMCQ ? null : (q.answer ?? null),

                q.marks ?? 1,

                q.explanation ?? null,
            ]
        );
    }

    return quizId;
}

module.exports = {
    saveQuiz,
};