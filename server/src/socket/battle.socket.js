module.exports = (io,manager) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    /*
    =================================
    PLAYER JOINS BATTLE
    =================================
    */
    socket.on("battle:join", ({ roomCode, username }) => {
      socket.join(roomCode);

      console.log(`${username} joined ${roomCode}`);

      const clients = io.sockets.adapter.rooms.get(roomCode);

      io.to(roomCode).emit("battle:player-list", {
        players: clients ? clients.size : 0,
      });

      io.to(roomCode).emit("battle:joined", {
        username,
        message: `${username} joined the battle`,
      });
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
    async ({ roomCode, studentId }) => {

        await manager.submitAnswer(
            roomCode,
            studentId
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