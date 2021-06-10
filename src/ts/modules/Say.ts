import { Message, MessageEmbed } from "discord.js";
import XBot from "../core/XBot";
import Module from "../core/Module";

export default class Say extends Module {

    constructor(xbot: XBot) {
        super(xbot);
        this.commandName = "say";
    }


    async processCommand(msg: Message, args: string[]) {

        let subcmd = args[0];
        let reply = "";

        if (subcmd == "-logs") {
            // fetch 5 log entries.
            let logs = await this.xbot.db.Say.findAll({
                attributes: ["requested_by", "message"],
                limit: 5,
                order: [['createdAt', 'DESC']]
            });

            // remove old logs here, after a certain limit is reached
            // keep limit to mininum (maybe 1000 entries).

            for(let log of logs)
                reply += "<@" + log.requested_by + ">  *" + log.message.trim() + "*\n\n";
            
            let embed = new MessageEmbed();
            embed.setColor("#eca861");
            embed.setDescription(reply);            
            msg.channel.send(embed);
            return;

        }
        

        msg.delete({ timeout: 0 });
        reply = args.join(" ");
        if(reply == "") return;
        msg.channel.send(reply);
        this.recordLog(msg.author.id, reply);
        
      
    }


    async recordLog(username: string, message: string) {
        await this.xbot.db.Say.create({
            requested_by: username,
            message: message,
        });
    }


}
