const db = require("../config/db");

const generateRoomCode = require("../utils/roomCode");

const createBattle = async (hostId, quizId, maxPlayers) => {
  // Check quiz exists
  const [quiz] = await db.query(
    "SELECT id FROM quizzes WHERE id = ?",
    [quizId]
  );

  if (quiz.length === 0) {
    throw new Error("Quiz not found");
  }

  // Generate unique room code
  let roomCode;

  while (true) {
    roomCode = generateRoomCode();

    const [existing] = await db.query(
      "SELECT id FROM battle_rooms WHERE room_code = ?",
      [roomCode]
    );

    if (existing.length === 0) {
      break;
    }
  }

  // Create battle room
  const [result] = await db.query(
    `
    INSERT INTO battle_rooms
    (
      room_code,
      host_id,
      quiz_id,
      max_players,
      current_players,
      status
    )
    VALUES (?, ?, ?, ?, 1, 'waiting')
    `,
    [roomCode, hostId, quizId, maxPlayers]
  );

  // Add host as first player
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
    [result.insertId, hostId]
  );

  return {
    roomId: result.insertId,
    roomCode,
    quizId,
    hostId,
    maxPlayers,
    currentPlayers: 1,
    status: "waiting",
  };
};

const joinBattle = async (studentId, roomCode) => {

  const [rooms] = await db.query(
    "SELECT * FROM battle_rooms WHERE room_code = ?",
    [roomCode]
  );

  if (rooms.length === 0) {
    throw new Error("Room not found");
  }

  const room = rooms[0];
  const [existing] = await db.query(
`
SELECT id
FROM battle_answers
WHERE room_id = ?
AND student_id = ?
AND question_id = ?
`,
[
room.id,
studentId,
questionId
]
);

if(existing.length>0){
    throw new Error("Answer already submitted");
}

  if (room.status !== "waiting") {
    throw new Error("Battle already started");
  }

  if (room.current_players >= room.max_players) {
    throw new Error("Room is full");
  }



  if (existing.length > 0) {
    throw new Error("Already joined");
  }

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
    [room.id, studentId]
  );

  await db.query(
    `
    UPDATE battle_rooms
    SET current_players = current_players + 1
    WHERE id = ?
    `,
    [room.id]
  );

  return {
    roomId: room.id,
    roomCode: room.room_code,
    currentPlayers: room.current_players + 1,
    maxPlayers: room.max_players,
    status: room.status,
  };
};

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
      status,
      created_at
    FROM battle_rooms
    WHERE room_code = ?
    `,
    [roomCode]
  );

  if (rooms.length === 0) {
    throw new Error("Battle room not found");
  }

  const room = rooms[0];

  return {
    roomId: room.id,
    roomCode: room.room_code,
    hostId: room.host_id,
    quizId: room.quiz_id,
    maxPlayers: room.max_players,
    currentPlayers: room.current_players,
    status: room.status,
    createdAt: room.created_at,
  };
};

const getBattlePlayers = async (roomCode) => {

  const [rooms] = await db.query(
    "SELECT id FROM battle_rooms WHERE room_code = ?",
    [roomCode]
  );

  if (rooms.length === 0)
    throw new Error("Room not found");

  const roomId = rooms[0].id;

  const [players] = await db.query(
    `
    SELECT
      u.id,
      u.username,
      bp.score
    FROM battle_players bp
    JOIN users u
      ON bp.student_id = u.id
    WHERE bp.room_id = ?
    ORDER BY bp.score DESC
    `,
    [roomId]
  );

  return players;
};

const startBattle = async (hostId, roomCode) => {

  // Find room
  const [rooms] = await db.query(
    "SELECT * FROM battle_rooms WHERE room_code = ?",
    [roomCode]
  );

  if (rooms.length === 0)
    throw new Error("Room not found");

  const room = rooms[0];

  // Only host can start
  if (room.host_id !== hostId)
    throw new Error("Only the host can start the battle");

  // Already started?
  if (room.status !== "waiting")
    throw new Error("Battle already started");

  // Minimum 2 players
  if (room.current_players < 2)
    throw new Error("At least 2 players are required");

  // Start battle
  await db.query(
    `
    UPDATE battle_rooms
    SET status = 'in_progress'
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
  };
};

console.log("Exporting Battle Service");
console.log({
  createBattle,
  joinBattle,
  getBattleRoom,
  getBattlePlayers,
  startBattle,
});
const getBattleQuestions = async (roomCode) => {

    // Find room
    const [rooms] = await db.query(
        "SELECT * FROM battle_rooms WHERE room_code = ?",
        [roomCode]
    );

    if (rooms.length === 0) {
        throw new Error("Battle room not found");
    }

    const room = rooms[0];

    // Battle must be started
    if (room.status !== "in_progress") {
        throw new Error("Battle has not started yet");
    }

    // Get quiz questions
    const [questions] = await db.query(
        `
        SELECT
            id,
            question,
            option_a,
            option_b,
            option_c,
            option_d
        FROM questions
        WHERE quiz_id = ?
        ORDER BY id
        `,
        [room.quiz_id]
    );

    return questions;
};
const submitBattleAnswer = async (studentId, data) => {

    const {
        roomCode,
        questionId,
        selectedOption
    } = data;

    const [rooms] = await db.query(
        "SELECT * FROM battle_rooms WHERE room_code = ?",
        [roomCode]
    );

    if (rooms.length === 0)
        throw new Error("Room not found");

    const room = rooms[0];

    if (room.status !== "in_progress")
        throw new Error("Battle is not active");

    const [questions] = await db.query(
        `
        SELECT correct_option, marks
        FROM questions
        WHERE id = ?
        `,
        [questionId]
    );

    if (questions.length === 0)
        throw new Error("Question not found");

    const question = questions[0];

    const isCorrect = question.correct_option === selectedOption;

    const score = isCorrect ? question.marks : 0;

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
        studentId,
        questionId,
        selectedOption,
        isCorrect,
        0
    ]
);

    if (score > 0) {
        await db.query(
            `
            UPDATE battle_players
            SET score = score + ?
            WHERE room_id = ?
            AND student_id = ?
            `,
            [
                score,
                room.id,
                studentId
            ]
        );
    }
    if(isCorrect){

await db.query(
`
UPDATE users
SET
xp=xp+10,
coins=coins+5
WHERE id=?
`,
[studentId]
);

}


    return {
        correct: isCorrect,
        score
    };
};


const getBattleLeaderboard = async (roomCode) => {

    const [rooms] = await db.query(
        "SELECT id FROM battle_rooms WHERE room_code = ?",
        [roomCode]
    );

    if (rooms.length === 0)
        throw new Error("Room not found");

    const roomId = rooms[0].id;

    const [leaderboard] = await db.query(
        `
        SELECT
            u.id,
            u.username,
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
        [roomId]
    );

    return leaderboard;
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


   

