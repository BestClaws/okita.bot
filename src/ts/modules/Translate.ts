import { Message, MessageEmbed } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

import { v2 }  from "@google-cloud/translate";
const translate = new v2.Translate();

export default class Say extends Module {

    constructor(sbot: SBot) {
        super(sbot);
        this.commandName = "tr";

    }




    async processCommand(msg: Message, args: string[]) {

        let target = args.shift();

        if(!["vi", "en"].includes(target as string)) {
            msg.channel.send("that language is not enabled for now."); 
            return;
        }

        let message = args.join(" ");

        let result = await this.translateText(message, target as string);

        let embed = new MessageEmbed();
        embed.setDescription(result);
        embed.setAuthor(msg.author.username, msg.author.avatarURL() as string);
        embed.setColor("#eca861");
        this.log(result);
        msg.channel.send({embeds: [embed]});
     
        
      
    }

    async translateText(text: string, language: string) {

        let [translation]: any = await translate.translate(text, language);
        return translation
        
      }
      






}
