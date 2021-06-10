import { Message, MessageEmbed } from "discord.js";
import XBot from "../core/XBot";
import Module from "../core/Module";
import fetch from "node-fetch";

export default class Oxford extends Module {

    commandName = "ox";

    constructor(xbot: XBot) {
        super(xbot);
    }

    async processCommand(msg: Message, args: string[]) {

        let query = args.join(" ").toLowerCase();
     

        let app_id = "a89ceb24";
        let app_key = "a9985d1dd695f692a5785aaaff141707";
        let endpoint = "entries";
        let lang = "en-gb";
        let url =  `https://od-api.oxforddictionaries.com/api/v2/${endpoint}/${lang}/${query}`;
        let response = await fetch(url, {
            method: "GET",
            headers:{app_id, app_key}
        });

        let responseJson = await response.json();
       

        let base_definition: string;
        let base_example: string;

        try {
            base_definition = responseJson.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
            // let pronounciation = responseJson.results[0].lexicalEntries[0].entries[0].pronunciations[0].audioFile
       } 
        catch(e) {
            base_definition = "(none)";
        }
        
        try {
            base_example = responseJson.results[0].lexicalEntries[0].entries[0].senses[0].examples[0].text;

        } catch(e) {
            base_example = "(none)";
        }

        const embed = new MessageEmbed();
        embed.setColor("#eca861");
        embed.addField("definition", base_definition);
        embed.addField("example", base_example);
        msg.channel.send(embed);

       
    }


}