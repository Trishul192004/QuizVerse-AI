const battleService = require("../services/battle.service");

console.log("Battle Service:", battleService);
exports.createBattle = async (req, res) => {
  try {
    const { quizId, maxPlayers } = req.body;

    if (!quizId || !maxPlayers) {
      return res.status(400).json({
        success: false,
        message: "quizId and maxPlayers are required",
      });
    }

    const room = await battleService.createBattle(
      req.user.id,
      quizId,
      maxPlayers
    );

    return res.status(201).json({
      success: true,
      message: "Battle room created successfully",
      room,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getBattleRoom = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const room = await battleService.getBattleRoom(roomCode);

    return res.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBattlePlayers = async (req, res) => {
  try {
    const { roomCode } = req.params;

    const players = await battleService.getBattlePlayers(roomCode);

    res.json({
      success: true,
      players,
    });
  } catch (err) {
    console.error(err);

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.joinBattle = async (req, res) => {
    try {
        const { roomCode } = req.body;

        if (!roomCode) {
            return res.status(400).json({
                success: false,
                message: "Room code is required"
            });
        }

        const room = await battleService.joinBattle(
            req.user.id,
            roomCode
        );

        return res.json({
            success: true,
            message: "Joined battle successfully",
            room
        });

    } catch (err) {
        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
exports.startBattle = async (req, res) => {
  try {
    const { roomCode } = req.body;
    console.log("Body:", req.body);
    console.log("User:", req.user);
    const result = await battleService.startBattle(
      req.user.id,
      roomCode
    );

    return res.json({
      success: true,
      room: result,
    });

  } catch (err) {
    console.error(err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getBattleQuestions = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const questions = await battleService.getBattleQuestions(roomCode);

        return res.json({
            success: true,
            questions
        });

    } catch (err) {
        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.submitBattleAnswer = async (req, res) => {
    try {
        const result = await battleService.submitBattleAnswer(
            req.user.id,
            req.body
        );

        return res.json({
            success: true,
            message: "Answer submitted successfully",
            result
        });

    } catch (err) {
        console.error(err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getBattleLeaderboard = async (req, res) => {
    try {
        const result = await battleService.getBattleLeaderboard(
            req.params.roomCode
        );

        return res.json({
            success: true,
            leaderboard: result
        });

    } catch (err) {
  console.error("START BATTLE ERROR:");
  console.error(err);
  console.error(err.message);

  return res.status(400).json({
    success: false,
    message: err.message,
  });
}
};