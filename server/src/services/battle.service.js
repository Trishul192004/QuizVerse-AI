const db = require("../config/db");
const generateRoomCode = require("../utils/roomCode");
const { getManager } = require("../socket");

const MAX_PLAYERS_DEFAULT = 20;

const createBattle = async (hostId, quizId, maxPlayers) => {
    const [quiz] = await db.query("SELECT id, time_limit FROM quizzes WHERE id = ?", [quizId]);
    if (quiz.length === 0) throw new Error("Quiz not found");

    const [questions] = await db.query("SELECT COUNT(*) AS cnt FROM questions WHERE quiz_id = ?", [quizId]);
    const totalQuestions = questions[0].cnt;
    const timeLimit = quiz[0].time_limit || 10;

    let roomCode;
    while (true) {
        roomCode = generateRoomCode();
        const [existing] = await db.query("SELECT id FROM battle_rooms WHERE room_code = ?", [roomCode]);
        if (existing.length === 0) break;
    }

    const [result] = await db.query(
        `INSERT INTO battle_rooms (room_code, host_id, quiz_id, total_questions, time_limit, status)
         VALUES (?, ?, ?, ?, ?, 'waiting')`,
        [roomCode, hostId, quizId, totalQuestions, timeLimit]
    );

    await db.query(
        `INSERT INTO battle_players (room_code, user_id, score, correct_count, wrong_count)
         VALUES (?, ?, 0, 0, 0)`,
        [roomCode, hostId]
    );

    return {
        roomId: result.insertId,
        roomCode,
        quizId,
        hostId,
        maxPlayers: maxPlayers || MAX_PLAYERS_DEFAULT,
        currentPlayers: 1,
        currentQuestionIndex: 0,
        status: "waiting",
        createdAt: new Date().toISOString(),
        startedAt: null,
        endedAt: null,
    };
};

const joinBattle = async (userId, roomCode) => {
    const [rooms] = await db.query("SELECT * FROM battle_rooms WHERE room_code = ?", [roomCode]);
    if (rooms.length === 0) throw new Error("Room not found");

    const room = rooms[0];
    if (room.status !== "waiting") throw new Error("Battle already started");

    const [playerCount] = await db.query("SELECT COUNT(*) AS cnt FROM battle_players WHERE room_code = ?", [roomCode]);
    if (playerCount[0].cnt >= MAX_PLAYERS_DEFAULT) throw new Error("Room is full");

    const [existing] = await db.query(
        "SELECT id FROM battle_players WHERE room_code = ? AND user_id = ?",
        [roomCode, userId]
    );
    if (existing.length > 0) throw new Error("Already joined");

    await db.query(
        "INSERT INTO battle_players (room_code, user_id, score, correct_count, wrong_count) VALUES (?, ?, 0, 0, 0)",
        [roomCode, userId]
    );

    return {
        roomId: room.id,
        roomCode: room.room_code,
        hostId: room.host_id,
        quizId: room.quiz_id,
        maxPlayers: MAX_PLAYERS_DEFAULT,
        currentPlayers: playerCount[0].cnt + 1,
        currentQuestionIndex: room.current_question || 0,
        status: room.status,
        createdAt: room.created_at,
        startedAt: null,
        endedAt: room.finished_at,
    };
};

const getBattleRoom = async (roomCode) => {
    const [rooms] = await db.query(
        `SELECT id, room_code, host_id, quiz_id, status, current_question,
                total_questions, time_limit, created_at, finished_at
         FROM battle_rooms WHERE room_code = ?`,
        [roomCode]
    );
    if (rooms.length === 0) throw new Error("Battle room not found");

    const room = rooms[0];
    const [playerCount] = await db.query(
        "SELECT COUNT(*) AS cnt FROM battle_players WHERE room_code = ?",
        [roomCode]
    );

    return {
        roomId: room.id,
        roomCode: room.room_code,
        hostId: room.host_id,
        quizId: room.quiz_id,
        maxPlayers: MAX_PLAYERS_DEFAULT,
        currentPlayers: playerCount[0].cnt,
        currentQuestionIndex: room.current_question || 0,
        status: room.status,
        createdAt: room.created_at,
        startedAt: null,
        endedAt: room.finished_at,
    };
};

const getBattlePlayers = async (roomCode) => {
    const [rooms] = await db.query("SELECT id FROM battle_rooms WHERE room_code = ?", [roomCode]);
    if (rooms.length === 0) throw new Error("Room not found");

    const [players] = await db.query(
        `SELECT u.id, u.username, u.role, bp.score
         FROM battle_players bp
         JOIN users u ON bp.user_id = u.id
         WHERE bp.room_code = ?
         ORDER BY bp.score DESC`,
        [roomCode]
    );

    return players;
};

const startBattle = async (hostId, roomCode) => {
    const [rooms] = await db.query("SELECT * FROM battle_rooms WHERE room_code = ?", [roomCode]);
    if (rooms.length === 0) throw new Error("Room not found");

    const room = rooms[0];
    if (room.host_id !== hostId) throw new Error("Only the host can start the battle");
    if (room.status !== "waiting") throw new Error("Battle already started");

    const [playerCount] = await db.query("SELECT COUNT(*) AS cnt FROM battle_players WHERE room_code = ?", [roomCode]);
    if (playerCount[0].cnt < 2) throw new Error("At least 2 players are required");

    await db.query(
        "UPDATE battle_rooms SET status = 'active', current_question = 0 WHERE room_code = ?",
        [roomCode]
    );

    return {
        roomId: room.id,
        roomCode: room.room_code,
        status: "active",
        currentPlayers: playerCount[0].cnt,
        maxPlayers: MAX_PLAYERS_DEFAULT,
        currentQuestionIndex: 0,
    };
};

const getBattleQuestions = async (roomCode) => {
    const [rooms] = await db.query(
        "SELECT id, quiz_id, current_question, status FROM battle_rooms WHERE room_code = ?",
        [roomCode]
    );
    if (rooms.length === 0) throw new Error("Room not found");

    const room = rooms[0];
    if (room.status === "finished") {
        return { completed: true };
    }

    const [questions] = await db.query(
        `SELECT id, question, option_a, option_b, option_c, option_d, marks
         FROM questions WHERE quiz_id = ?
         ORDER BY id LIMIT 1 OFFSET ?`,
        [room.quiz_id, room.current_question || 0]
    );

    if (questions.length === 0) {
        return { completed: true };
    }

    return {
        completed: false,
        currentQuestionIndex: room.current_question || 0,
        question: questions[0],
    };
};

const submitBattleAnswer = async (userId, data) => {
    const { roomCode, questionId, selectedOption, responseTime = 0 } = data;

    const [rooms] = await db.query("SELECT * FROM battle_rooms WHERE room_code = ?", [roomCode]);
    if (rooms.length === 0) throw new Error("Room not found");

    const room = rooms[0];
    if (room.status !== "active") throw new Error("Battle is not active");

    const questionIndex = room.current_question || 0;

    const [alreadyAnswered] = await db.query(
        "SELECT id FROM battle_answers WHERE room_code = ? AND user_id = ? AND question_id = ?",
        [roomCode, userId, questionId]
    );

    if (alreadyAnswered.length > 0) throw new Error("You have already answered this question");

    const [questions] = await db.query("SELECT correct_option, marks FROM questions WHERE id = ?", [questionId]);
    if (questions.length === 0) throw new Error("Question not found");

    const question = questions[0];
    const isCorrect = question.correct_option === selectedOption;
    const score = isCorrect ? question.marks : 0;

    await db.query(
        `INSERT INTO battle_answers (room_code, user_id, question_id, question_index, selected_option, is_correct, answer_time_ms, points_earned)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [roomCode, userId, questionId, questionIndex, selectedOption, isCorrect, responseTime, score]
    );

    await db.query(
        `UPDATE battle_players
         SET score = score + ?,
             correct_count = correct_count + ?,
             wrong_count = wrong_count + ?
         WHERE room_code = ? AND user_id = ?`,
        [score, isCorrect ? 1 : 0, isCorrect ? 0 : 1, roomCode, userId]
    );

    const [answerCount] = await db.query(
        "SELECT COUNT(*) AS total FROM battle_answers WHERE room_code = ? AND question_id = ?",
        [roomCode, questionId]
    );

    const [playerCount] = await db.query(
        "SELECT COUNT(*) AS total FROM battle_players WHERE room_code = ?",
        [roomCode]
    );

    const everyoneAnswered = answerCount[0].total === playerCount[0].total;
    let battleCompleted = false;

    const [leaderboard] = await db.query(
        `SELECT u.id, u.username, bp.score
         FROM battle_players bp
         JOIN users u ON u.id = bp.user_id
         WHERE bp.room_code = ?
         ORDER BY bp.score DESC`,
        [roomCode]
    );

    if (global.io) {
        global.io.to(roomCode).emit("battle:update-leaderboard", { leaderboard });
    }

    const manager = getManager();
    if (manager) {
        await manager.submitAnswer(roomCode, userId);
    }

    return { correct: isCorrect, score, everyoneAnswered, battleCompleted };
};

const getBattleLeaderboard = async (roomCode) => {
    const [rooms] = await db.query("SELECT id, status FROM battle_rooms WHERE room_code = ?", [roomCode]);
    if (rooms.length === 0) throw new Error("Room not found");

    const room = rooms[0];

    const [leaderboard] = await db.query(
        `SELECT u.id, u.username, u.role, bp.score
         FROM battle_players bp
         JOIN users u ON bp.user_id = u.id
         WHERE bp.room_code = ?
         ORDER BY bp.score DESC`,
        [roomCode]
    );

    return { status: room.status, leaderboard };
};

module.exports = {
    createBattle,
    joinBattle,
    getBattleRoom,
    getBattlePlayers,
    startBattle,
    getBattleQuestions,
    submitBattleAnswer,
    getBattleLeaderboard,
};
