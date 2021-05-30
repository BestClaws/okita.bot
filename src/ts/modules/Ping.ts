import Discord from "discord.js";

export default class Ping {

    commandName = "ping";

    constructor() {

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



