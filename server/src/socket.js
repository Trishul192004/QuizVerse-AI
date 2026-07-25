const BattleManager = require("./socket/battle.manager");

let manager;

module.exports = (io) => {
    manager = new BattleManager(io);

    require("./socket/battle.socket")(io, manager);
};

module.exports.getManager = () => manager;