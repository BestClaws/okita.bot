import { Message, MessageEmbed } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";
import cheerio from "cheerio";
import fetch from "node-fetch";

export default class NHentai extends Module {
    commandName = "nhentai";

    constructor(sbot: SBot) {
        super(sbot);
    }


    async processCommand(msg: Message, args: string[]) {
        
        msg.channel.startTyping();

        let code = args[0];
        let url = `https://nhentai.net/g/${code}`;

        let response = await fetch(url);

        if(response.status != 200) {
            msg.channel.send("Invalid Code.");
            msg.channel.stopTyping();
            return;
        }

        let html_data = await response.text();
        let $ = cheerio.load(html_data);
        
        // extract info
        let flat_txt = $('#info').text().split('\t') 
            .filter(x => x != '')
            .map(s => s.trim())
            .map(s => s.split(/\d{1,}[KM]?/)) // Altria Pendragon12kFujimaru
            .flat()
            .filter((s: any) => s != '');


        let section_header = "";
        let section_body = "";

        let embed = new MessageEmbed;
        embed.setColor("#ed2553");

        // skip title (i = 0)
        for(let i = 1; i < flat_txt.length; i++) {
            // ignore Groups and subsequent sections.
            if(flat_txt[i].endsWith("Groups:")) break;

            if(flat_txt[i].endsWith(":")) {
                // preserve previous section and body
                if(section_body != "" && section_header != "")
                    embed.addField(section_header, section_body);
                // start a new section and reset body
                section_header = flat_txt[i];
                section_body = "";
            } else 
                section_body += "" + this.PascalCase(flat_txt[i]) + ", ";
        }

        msg.channel.send(embed);
        msg.channel.stopTyping();

    }

    PascalCase(str: String): String {
       return  str.trim().split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
}
