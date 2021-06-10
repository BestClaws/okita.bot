import Discord from "discord.js";
import XBot from "../core/XBot";
import Module from "../core/Module";

export default class Ping extends Module {

    commandName = "ping";

    constructor(xbot: XBot) {
        super(xbot);
    }

    processCommand(msg: Discord.Message) {
        // immediately record module entering time.
        let latency = Date.now() - msg.createdTimestamp;
        console.log();
        msg.channel.send(`🏓 Pong! (${latency}ms)`);
    }

    processInteraction() {}

    processMessage() {}

}



