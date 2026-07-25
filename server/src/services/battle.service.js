const db = require("../config/db");
  const generateRoomCode = require("../utils/roomCode");

/* ==========================================================
   CREATE BATTLE
========================================================== */

const createBattle = async (hostId, quizId, maxPlayers) => {
    const [quiz] = await db.query(
        "SELECT id FROM quizzes WHERE id = ?",
        [quizId]
    );

    if (quiz.length === 0)
        throw new Error("Quiz not found");

    let roomCode;

    while (true) {
        roomCode = generateRoomCode();

        const [existing] = await db.query(
            "SELECT id FROM battle_rooms WHERE room_code = ?",
            [roomCode]
        );

        if (existing.length === 0)
            break;
    }

    const [result] = await db.query(
        `
        INSERT INTO battle_rooms
        (
            room_code,
            host_id,
            quiz_id,
            max_players,
            current_players,
            current_question_index,
            status
        )
        VALUES (?, ?, ?, ?, 1, 0, 'waiting')
        `,
        [
            roomCode,
            hostId,
            quizId,
            maxPlayers
        ]
    );


    await db.query(
        `
        INSERT INTO battle_players
        (
            room_id,
            student_id,
            score,
            total_response_time_ms
        )
        VALUES (?, ?, 0, 0)
        `,
        [
            result.insertId,
            hostId
        ]
    );
console.log("Inserted answer");
    return {
        roomId: result.insertId,
        roomCode,
        quizId,
        hostId,
        maxPlayers,
        currentPlayers: 1,
        currentQuestionIndex: 0,
        status: "waiting",
    };
};

/* ==========================================================
   JOIN BATTLE
========================================================== */

const joinBattle = async (userId, roomCode) => {

    const [rooms] = await db.query(
        "SELECT * FROM battle_rooms WHERE room_code = ?",
        [roomCode]
    );

    if (rooms.length === 0)
        throw new Error("Room not found");

    const room = rooms[0];

    if (room.status !== "waiting")
        throw new Error("Battle already started");

    if (room.current_players >= room.max_players)
        throw new Error("Room is full");

    const [existing] = await db.query(
        `
        SELECT id
        FROM battle_players
        WHERE room_id = ?
        AND student_id = ?
        `,
        [
            room.id,
            userId
        ]
    );

    if (existing.length > 0)
        throw new Error("Already joined");

    await db.query(
        `
        INSERT INTO battle_players
        (
            room_id,
            student_id,
            score,
            total_response_time_ms
        )
        VALUES (?, ?, 0, 0)
        `,
        [
            room.id,
            userId
        ]
    );

    await db.query(
        `
        UPDATE battle_rooms
        SET current_players = current_players + 1
        WHERE id = ?
        `,
        [
            room.id
        ]
    );

    return {
        roomId: room.id,
        roomCode: room.room_code,
        currentPlayers: room.current_players + 1,
        maxPlayers: room.max_players,
        currentQuestionIndex: room.current_question_index,
        status: room.status,
    };
};

/* ==========================================================
   GET ROOM
========================================================== */

const getBattleRoom = async (roomCode) => {

    const [rooms] = await db.query(
        `
        SELECT
            id,
            room_code,
            host_id,
            quiz_id,
            max_players,
            current_players,
            current_question_index,
            status,
            created_at,
            started_at,
            ended_at
        FROM battle_rooms
        WHERE room_code = ?
        `,
        [
            roomCode
        ]
    );

    if (rooms.length === 0)
        throw new Error("Battle room not found");

    const room = rooms[0];

    return {
        roomId: room.id,
        roomCode: room.room_code,
        hostId: room.host_id,
        quizId: room.quiz_id,
        maxPlayers: room.max_players,
        currentPlayers: room.current_players,
        currentQuestionIndex: room.current_question_index,
        status: room.status,
        createdAt: room.created_at,
        startedAt: room.started_at,
        endedAt: room.ended_at,
    };
};

/* ==========================================================
   GET PLAYERS
========================================================== */

  const getBattlePlayers = async (roomCode) => {

    const [rooms] = await db.query(
        `
        SELECT id
        FROM battle_rooms
        WHERE room_code = ?
        `,
        [
            roomCode
        ]
     );

    if (rooms.length === 0)
        throw new Error("Room not found");

    const roomId = rooms[0].id;

    const [players] = await db.query(
        `
        SELECT
            u.id,
            u.username,
            u.role,
            bp.score,
            bp.total_response_time_ms
        FROM battle_players bp
        JOIN users u
            ON bp.student_id = u.id
        WHERE bp.room_id = ?
        ORDER BY
            bp.score DESC,
            bp.total_response_time_ms ASC
        `,
        [
            roomId
        ]
    );

    return players;
};

/* ==========================================================
   START BATTLE
========================================================== */

const startBattle = async (hostId, roomCode) => {

    const [rooms] = await db.query(
        `
        SELECT *
        FROM battle_rooms
        WHERE room_code = ?
        `,
        [roomCode]
    );

    if (rooms.length === 0)
        throw new Error("Room not found");

    const room = rooms[0];

    if (room.host_id !== hostId)
        throw new Error("Only the host can start the battle");

    if (room.status !== "waiting")
        throw new Error("Battle already started");

    if (room.current_players < 2)
        throw new Error("At least 2 players are required");

    await db.query(
        `
        UPDATE battle_rooms
        SET
            status = 'in_progress',
            current_question_index = 0,
            started_at = NOW()
        WHERE id = ?
        `,
        [room.id]
    );

    return {
        roomId: room.id,
        roomCode: room.room_code,
        status: "in_progress",
        currentPlayers: room.current_players,
        maxPlayers: room.max_players,
        currentQuestionIndex: 0
    };
};
/* ==========================================================
   GET CURRENT QUESTION
========================================================== */

const getBattleQuestions = async (roomCode) => {

    const [rooms] = await db.query(
        `
        SELECT
            id,
            quiz_id,
            current_question_index,
            status
        FROM battle_rooms
        WHERE room_code = ?
        `,
        [roomCode]
    );

    if (rooms.length === 0)
        throw new Error("Room not found");

    const room = rooms[0];

    if (room.status === "completed") {
        return {
            completed: true
        };
    }

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
        ORDER BY id
        LIMIT 1 OFFSET ?
        `,
        [
            room.quiz_id,
            room.current_question_index
        ]
    );

    if (questions.length === 0) {
        return {
            completed: true
        };
    }

    return {
        completed: false,
        currentQuestionIndex: room.current_question_index,
        question: questions[0]
    };
};
/* ==========================================================
   SUBMIT BATTLE ANSWER
========================================================== */
/* ==========================================================
   GET CURRENT BATTLE QUESTION
========================================================== */
exports.getBattleQuestions = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const result = await battleService.getBattleQuestions(roomCode);

        return res.json({
            success: true,
            ...result
        });

    } catch (err) {
        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
const submitBattleAnswer = async (userId, data) => {

    const {
        roomCode,
        questionId,
        selectedOption,
        responseTime = 0
    } = data;

    /* -------------------------------
       Find Battle Room
    --------------------------------*/

    const [rooms] = await db.query(
        `
        SELECT *
        FROM battle_rooms
        WHERE room_code = ?
        `,
        [roomCode]
    );

    if (rooms.length === 0)
        throw new Error("Room not found");

    const room = rooms[0];
    console.log("========== SUBMIT ==========");
        console.log("User:", userId);
        console.log("Room:", room.id);
        console.log("Question:", questionId);
    if (room.status !== "in_progress")
        throw new Error("Battle is not active");

    /* -------------------------------
       Prevent Duplicate Answer
    --------------------------------*/

    const [alreadyAnswered] = await db.query(
        `
        SELECT id
        FROM battle_answers
        WHERE room_id = ?
        AND student_id = ?
        AND question_id = ?
        `,
        [
            room.id,
            userId,
            questionId
        ]
    );
    console.log("Already Answered:", alreadyAnswered);

    if (alreadyAnswered.length > 0)
        throw new Error("You have already answered this question");

    /* -------------------------------
       Get Question
    --------------------------------*/

    const [questions] = await db.query(
        `
        SELECT
            correct_option,
            marks
        FROM questions
        WHERE id = ?
        `,
        [questionId]
    );

    if (questions.length === 0)
        throw new Error("Question not found");

    const question = questions[0];

    const isCorrect =
        question.correct_option === selectedOption;

    const score =
        isCorrect ? question.marks : 0;

    /* -------------------------------
       Save Answer
    --------------------------------*/

    await db.query(
        `
        INSERT INTO battle_answers
        (
            room_id,
            student_id,
            question_id,
            selected_option,
            is_correct,
            response_time_ms
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            room.id,
            userId,
            questionId,
            selectedOption,
            isCorrect,
            responseTime
        ]
    );

    /* -------------------------------
       Update Player Score
    --------------------------------*/

    await db.query(
        `
        UPDATE battle_players
        SET
            score = score + ?,
            total_response_time_ms =
                total_response_time_ms + ?
        WHERE room_id = ?
        AND student_id = ?
        `,
        [
            score,
            responseTime,
            room.id,
            userId
        ]
    );

    /* -------------------------------
       Reward XP / Coins
    --------------------------------*/

    if (isCorrect) {

        await db.query(
            `
            UPDATE users
            SET
                xp = xp + 10,
                coins = coins + 5
            WHERE id = ?
            `,
            [userId]
        );

    }

    /* -------------------------------
       Count Answers
    --------------------------------*/

    const [answerCount] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM battle_answers
        WHERE room_id = ?
        AND question_id = ?
        `,
        [
            room.id,
            questionId
        ]
    );
    console.log("Answer Count:", answerCount[0].total);
    /* -------------------------------
       Count Players
    --------------------------------*/

    const [playerCount] = await db.query(
        `
        SELECT current_players
        FROM battle_rooms
        WHERE id = ?
        `,
        [room.id]
    );
    console.log("Player Count:", playerCount[0].current_players);

    const everyoneAnswered =
        answerCount[0].total ===
        playerCount[0].current_players;

    let battleCompleted = false;

    /* -------------------------------
       Move To Next Question
    --------------------------------*/

    if (everyoneAnswered) {

        const nextIndex =
            room.current_question_index + 1;

        const [questionCount] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM questions
            WHERE quiz_id = ?
            `,
            [room.quiz_id]
        );
        console.log("Moving to next question...");

        if (nextIndex >= questionCount[0].total) {
            console.log("Battle Finished");

            battleCompleted = true;

            await db.query(
                `
                UPDATE battle_rooms
                SET
                    status = 'completed',
                    ended_at = NOW()
                WHERE id = ?
                `,
                [room.id]
            );

        } else {

            console.log("Next Question Index:", nextIndex);

            await db.query(
                `
                UPDATE battle_rooms
                SET current_question_index = ?
                WHERE id = ?
                `,
                [
                    nextIndex,
                    room.id
                ]
            );

        }

    }
    console.log("Everyone Answered:", everyoneAnswered);

    return {

        correct: isCorrect,

        score,

        everyoneAnswered,

        battleCompleted

    };

};
/* ==========================================================
   GET LEADERBOARD
========================================================== */

const getBattleLeaderboard = async (roomCode) => {

    const [rooms] = await db.query(
        `
        SELECT id, status
        FROM battle_rooms
        WHERE room_code = ?
        `,
        [roomCode]
    );

    if (rooms.length === 0)
        throw new Error("Room not found");

    const room = rooms[0];

    const [leaderboard] = await db.query(
        `
        SELECT
            u.id,
            u.username,
            u.role,
            bp.score,
            bp.total_response_time_ms
        FROM battle_players bp
        JOIN users u
            ON bp.student_id = u.id
        WHERE bp.room_id = ?
        ORDER BY
            bp.score DESC,
            bp.total_response_time_ms ASC,
            u.username ASC
        `,
        [room.id]
    );

    return {
        status: room.status,
        leaderboard
    };
};

module.exports = {
    createBattle,
    joinBattle,
    getBattleRoom,
    getBattlePlayers,
    startBattle,
    getBattleQuestions,
    submitBattleAnswer,
    getBattleLeaderboard
  };