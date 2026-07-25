const BattleManager = require("./battle.manager");

module.exports = (io) => {
    const manager = new BattleManager(io);
    require("./battle.socket")(io, manager);
};
