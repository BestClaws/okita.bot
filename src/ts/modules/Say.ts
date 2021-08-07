import { Message, MessageEmbed, TextChannel } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";
import fetch from "node-fetch";
import util from 'util';

export default class Say extends Module {

    constructor(sbot: SBot) {
        super(sbot);
        this.commandName = "say";



        this.sbot.dClient.on('interactionCreate', async interaction => {


            if (!interaction.isCommand()) return;

            
        
            if (interaction.commandName == this.commandName) {


                let msg = interaction.options.getString('text') || "no string given";

                interaction.channel?.send(msg);
                this.recordLog(interaction.user.id, msg);
         

                let url = `https://discord.com/api/v8/interactions/${interaction.id}/${interaction.token}/callback`;
                
                let json = {
                    "type": 1
                }
                fetch(url,{
                    method: 'POST',
                    body:    JSON.stringify(json),
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(res => res.json())
                .then(json => console.log(util.inspect(json.errors.type)));


            }
         
        });


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
