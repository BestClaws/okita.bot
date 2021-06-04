import { Message, MessageEmbed } from "discord.js";
import HBot from "../core/HBot";
import Module from "../core/Module";
import * as db from "../db/db-objects"; // this wpuld be better off as hbot member.

export default class Say extends Module {

    constructor(hbot: HBot) {
        super(hbot);
        this.commandName = "say";
    }


    async processCommand(msg: Message, args: string[]) {

        let subcmd = args[0];
        let reply = "";

        switch(subcmd) {
        case "-logs":

            // fetch 5 log entries.
            let logs = await db.Say.findAll({
                attributes: ["requested_by", "message"],
                limit: 5,
                order: [['createdAt', 'DESC']]
            });

            // remove old logs here, after a certain limit is reached
            // keep limit to mininum (maybe 1000 entries).

            for(let log of logs)
                reply += "<@" + log.requested_by + ">  *" + log.message.trim() + "*\n\n";
            
            let embed = new MessageEmbed();
            embed.setColor("#dd2e44");
            embed.setDescription(reply);            
            msg.channel.send(embed);

            break;

        default:
            msg.delete({ timeout: 0 });
            reply = "";
            for(let arg of args) reply += arg + " ";
            msg.channel.send(reply);
            this.recordLog(msg.author.id, reply);
        }
      
    }


    async recordLog(username: string, message: string) {
        await db.Say.create({
            requested_by: username,
            message: message,
        });
    }


}
