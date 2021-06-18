import Discord from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

export default class Ping extends Module {

    commandName = "ping";

    constructor(sbot: SBot) {
        super(sbot);
    }

    processCommand(msg: Discord.Message) {
        // immediately record module entering time.
        let latency = Date.now() - msg.createdTimestamp;
        this.log("ping requested");
        msg.channel.send(`🏓 Pong! (${latency}ms)`);
    }

    processInteraction() {}

    processMessage() {}

}



