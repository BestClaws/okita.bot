import { Message } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

export default class Ping extends Module {

    commandName = "ping";

    
    constructor(sbot: SBot) {
        super(sbot);
    }


    processCommand(msg: Message) {
        // immediately record module entering time.
        let latency = Date.now() - msg.createdTimestamp;
        this.log("latency", latency);
        msg.channel.send(`🏓 Pong! (${latency}ms)`);
    }
}



