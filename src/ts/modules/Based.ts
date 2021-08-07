import { Message, MessageEmbed } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";


export default class Based extends Module {

    commandName = "based";


    constructor(sbot: SBot) {
        super(sbot);

    }

    processMessage(msg: Message) {
        if(msg.content.startsWith("pls based")) {

            let embed = new MessageEmbed();
            embed.setColor("#00ff00");
            embed.setTitle("Based?");
            if(msg.mentions.users.first() != null) {
                embed.setDescription(`${msg.mentions.users!.first()!.username}, you're ${Math.round(Math.random() * 100)}% based`);
            }

            embed.setDescription(`${msg.author.username}, you're ${Math.round(Math.random() * 100)}% based`);
            msg.channel.send({embeds:[embed]});
        }
    }

   
    


}

