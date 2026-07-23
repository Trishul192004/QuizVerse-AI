const db = require("../config/db");

class BattleManager {
    constructor(io) {
        this.io = io;
        this.battles = new Map();
    }

    async initializeBattle(roomCode) {

        const [rooms] = await db.query(
            "SELECT * FROM battle_rooms WHERE room_code=?",
            [roomCode]
        );

        if (!rooms.length)
            throw new Error("Battle room not found");

        const room = rooms[0];

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
                marks
            FROM questions
            WHERE quiz_id=?
            ORDER BY id
            `,
            [room.quiz_id]
        );

        this.battles.set(roomCode,{
            room,
            questions,
            currentQuestion:0,
            answered:new Set(),
            timer:null,
            duration:30
        });

        return this.battles.get(roomCode);
    }

    getBattle(roomCode){
        return this.battles.get(roomCode);
    }

    removeBattle(roomCode){
        this.battles.delete(roomCode);
    }
    startTimer(roomCode) {

    const battle = this.getBattle(roomCode);

    if (!battle) return;

    if (battle.timer)
        clearInterval(battle.timer);

    let remaining = battle.duration;

    this.io.to(roomCode).emit("battle:timer", {
        remaining
    });

    battle.timer = setInterval(async () => {

        remaining--;

        this.io.to(roomCode).emit("battle:timer", {
            remaining
        });

        if (remaining <= 0) {

            clearInterval(battle.timer);

            await this.nextQuestion(roomCode);

        }

    }, 1000);

}
async nextQuestion(roomCode) {

    const battle = this.getBattle(roomCode);

    if (!battle) return;

    battle.answered.clear();

    battle.currentQuestion++;

    if (battle.currentQuestion >= battle.questions.length) {

        return await this.finishBattle(roomCode);

    }

    const question = battle.questions[battle.currentQuestion];

    this.io.to(roomCode).emit(
        "battle:new-question",
        {
            questionNumber: battle.currentQuestion + 1,
            totalQuestions: battle.questions.length,
            question
        }
    );

    this.startTimer(roomCode);

}
async submitAnswer(roomCode, studentId) {

    const battle = this.getBattle(roomCode);

    if (!battle) return;

    // Prevent duplicate submissions
    if (battle.answered.has(studentId))
        return;

    battle.answered.add(studentId);

    // Get total players in room
    const [players] = await db.query(
        `
        SELECT COUNT(*) AS totalPlayers
        FROM battle_players
        WHERE room_id = ?
        `,
        [battle.room.id]
    );

    const totalPlayers = players[0].totalPlayers;

    // Everyone answered -> skip timer
    if (battle.answered.size >= totalPlayers) {

        if (battle.timer)
            clearInterval(battle.timer);

        await this.nextQuestion(roomCode);
    }

}
async broadcastLeaderboard(roomCode) {

    const battle = this.getBattle(roomCode);

    const [leaderboard] = await db.query(`
        SELECT
            u.username,
            bp.score
        FROM battle_players bp
        JOIN users u
            ON u.id = bp.student_id
        WHERE bp.room_id = ?
        ORDER BY
            bp.score DESC,
            bp.total_response_time_ms ASC
    `, [battle.room.id]);

    this.io.to(roomCode).emit(
        "battle:leaderboard",
        leaderboard
    );
}
async finishBattle(roomCode) {

    const battle = this.getBattle(roomCode);

    if (!battle) return;

    if (battle.timer)
        clearInterval(battle.timer);

    await db.query(
        `
        UPDATE battle_rooms
        SET status='completed'
        WHERE id=?
        `,
        [battle.room.id]
    );

    const [winner] = await db.query(
        `
        SELECT
            u.id,
            u.username,
            bp.score
        FROM battle_players bp
        JOIN users u
            ON bp.student_id = u.id
        WHERE bp.room_id = ?
        ORDER BY
            bp.score DESC,
            bp.total_response_time_ms ASC
        LIMIT 1
        `,
        [battle.room.id]
    );

    if (winner.length) {

        await db.query(
            `
            UPDATE users
            SET
                xp = xp + 50,
                coins = coins + 25
            WHERE id = ?
            `,
            [winner[0].id]
        );

    }

    this.io.to(roomCode).emit(
        "battle:finished",
        {
            winner: winner[0] || null
        }
    );

    this.removeBattle(roomCode);

}
}

module.exports = BattleManager;