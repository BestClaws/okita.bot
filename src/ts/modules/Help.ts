import Discord from "discord.js";
import HBot from "../core/HBot";
import Module from "../core/Module";

export default class Help extends Module {

    commandName = "help";

    constructor(hbot: HBot) {
        super(hbot);
    }


    processCommand(msg: Discord.Message, args: string[]) {
        const embed = new Discord.MessageEmbed();
        embed.setColor('#ff9959');
        embed.setTitle('Anime Puzzle Commands');
        embed.addField('.puzzle n', 'show a new puzzle.')
        embed.addField('.puzzle r', 'reveal a random tile in puzlze.');
        embed.addField('.puzzle <answer>', 'answer your guess (typos allowed)');
        msg.channel.send(embed);
    }


}

