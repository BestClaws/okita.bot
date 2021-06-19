import Discord from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

export default class Help extends Module {

    commandName = "help";

    constructor(sbot: SBot) {
        super(sbot);
    }


    processCommand(msg: Discord.Message, args: string[]) {
        const embed = new Discord.MessageEmbed();
        embed.setColor('#ff9959');
        embed.setTitle('Anime Puzzle Commands');
        embed.addField('*puzzle n', 'show a new puzzle.')
        embed.addField('*puzzle r', 'reveal a random tile in puzzle.');
        embed.addField('*puzzle <answer>', 'answer your guess (typos allowed)');
        msg.channel.send(embed);
    }


}

