import Discord from "discord.js";

export default class Ping {

    commandName = "ping";

    constructor() {

    }

    processCommand(msg: Discord.Message) {
        msg.reply("Pong!");
    }

    processInteraction() {}

    processMessage() {}

}



