module.exports = (io,manager) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    /*
    =================================
    PLAYER JOINS BATTLE
    =================================
    */
socket.on("battle:join", async ({ roomCode, username }) => {
  try {
    socket.join(roomCode);

    console.log(`${username} joined ${roomCode}`);

    let [roomRows] = await require("../config/db").query(
      "SELECT status FROM battle_rooms WHERE room_code = ?",
      [roomCode]
    );

    let battle = manager.getBattle(roomCode);
    if (!battle && roomRows.length) {
      if (roomRows[0].status === "active" || roomRows[0].status === "finished") {
        battle = await manager.initializeBattle(roomCode);
      }
    }

    if (battle && roomRows.length && roomRows[0].status === "active") {
      const question = battle.questions[battle.currentQuestion || 0];
      if (question) {
        io.to(roomCode).emit("battle:new-question", {
          questionNumber: (battle.currentQuestion || 0) + 1,
          totalQuestions: battle.questions.length,
          question,
        });
        manager.startTimer(roomCode);
      }
    }

    const players = await manager.getPlayers(roomCode);

    io.to(roomCode).emit("battle:player-list", {
      players,
    });

    io.to(roomCode).emit("battle:joined", {
      username,
      message: `${username} joined the battle`,
    });

  } catch (err) {
    console.error("battle:join error:", err);
  }
});

    /*
    =================================
    HOST STARTS BATTLE
    =================================
    */
socket.on("battle:start",async({roomCode})=>{

    try{

        const battle=await manager.initializeBattle(roomCode);

        io.to(roomCode).emit("battle:started");

        io.to(roomCode).emit(
            "battle:new-question",
            {
                questionNumber:1,
                totalQuestions:battle.questions.length,
                question:battle.questions[0]
            }
        );
        manager.startTimer(roomCode);

    }
    catch(err){
        console.log(err);
    }

});

    /*
    =================================
    SEND QUESTION TO ALL PLAYERS
    =================================
    */
    socket.on("battle:question", ({ roomCode, question }) => {
      io.to(roomCode).emit("battle:new-question", question);
    });

    /*
    =================================
    PLAYER SUBMITS ANSWER
    =================================
    */
   socket.on(
    "battle:submit",
    async ({ roomCode, userId }) => {

        await manager.submitAnswer(
            roomCode,
            userId
        );

    }
);

    /*
    =================================
    UPDATE LEADERBOARD
    =================================
    */
    socket.on("battle:leaderboard", ({ roomCode, leaderboard }) => {
      io.to(roomCode).emit(
        "battle:update-leaderboard",
        leaderboard
      );
    });

    /*
    =================================
    END BATTLE
    =================================
    */
    socket.on("battle:end", ({ roomCode }) => {
      io.to(roomCode).emit("battle:finished", {
        message: "Battle Finished!",
      });
    });

    /*
    =================================
    DISCONNECT
    =================================
    */
    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
};