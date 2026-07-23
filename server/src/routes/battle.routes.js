const express = require("express");

const router = express.Router();

const battleController = require("../controllers/battle.controller");

const {
  verifyToken,
} = require("../middleware/auth.middleware");

/*
=================================
CREATE BATTLE
POST /api/battle/create
=================================
*/
router.get(
  "/:roomCode",
  verifyToken,
  battleController.getBattleRoom
);
router.get(
  "/:roomCode/players",
  verifyToken,
  battleController.getBattlePlayers
);
router.get(
    "/:roomCode/questions",
    verifyToken,
    battleController.getBattleQuestions
);
router.get(
    "/:roomCode/leaderboard",
    verifyToken,
    battleController.getBattleLeaderboard
);
router.post(
  "/create",
  verifyToken,
  battleController.createBattle
);
router.post(
  "/join",
  verifyToken,
  battleController.joinBattle
);
router.post(
  "/start",
  verifyToken,
  battleController.startBattle
);
router.post(
    "/submit-answer",
    verifyToken,
    battleController.submitBattleAnswer
);
module.exports = router;