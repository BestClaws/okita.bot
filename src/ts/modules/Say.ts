import { CommandInteraction, Message, MessageEmbed, TextChannel } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

export default class Say extends Module {

    constructor(sbot: SBot) {
        super(sbot);
        this.commandName = "say";




    }


    processInteraction(interaction: CommandInteraction) {
        let msg = interaction.options.getString('text') || "-";
        interaction.channel?.send(msg);
        // i wanted to ignore the interaction. but discord won't allow me to
        // so i reply to an interaction and then delete it immediately
        // kinda spoils the purpose of having a slash command then.
        this.recordLog(interaction.user.id, msg);
        interaction.reply({
            "content": "none"
        });
        interaction.deleteReply();
        this.recordLog(interaction.user.id, msg);
    }

    async processCommand(msg: Message, args: string[]) {

        let subcmd = args[0];
        let reply = "";

        if (subcmd == "-logs") {
            // fetch 5 log entries.
            let logs = await this.sbot.db.Say.findAll({
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
            msg.channel.send({embeds: [embed]});
            return;

        }
        

        msg.delete();
        reply = args.join(" ");
        if(reply == "") return;
        msg.channel.send(reply);
        this.recordLog(msg.author.id, reply);
        
      
    }


    async recordLog(username: string, message: string) {
        await this.sbot.db.Say.create({
            requested_by: username,
            message: message,
        });
    }


}
