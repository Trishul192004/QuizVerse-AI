const BattleManager=require("./socket/battle.manager");

module.exports=(io)=>{

    const manager=new BattleManager(io);

    require("./socket/battle.socket")(io,manager);

};