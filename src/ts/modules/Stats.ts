import { Collection, Message, Snowflake, TextChannel } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";
import fs from "fs";

export default class QuickTest extends Module {
    
    commandName = "stats";
    assetRequirements = []
    meta = {
        status: "enabled"
    };
    
    constructor(sbot: SBot) {
        super(sbot);
    }

    async processCommand(msg: Message, args: string[]) {

        if(msg.author.id != "657243574995517450") return;

        // let boby = await msg.guild?.members.fetch("657243574995517450");
        // boby?.roles.remove("750372903165493388");
        this.sbot.dClient.guilds.cache.forEach(guild => {
            this.log(`${guild.name} | ${guild.id}`);
            guild.channels.cache.forEach(channel => {
                if(channel.name.includes("general")) {
                    this.log("channel: ", channel.name, " id: ", channel.id);

                }


                if(channel.id == "744209394358812726") {
                    this.fetchMessages(channel as TextChannel);
                }
            });
            
            this.log(guild.me?.permissions.has("ADMINISTRATOR"));

        })
        // let guild = this.sbot.dClient.guilds.cache.get("744209392056139938");
        // console.log(guild?.me?.hasPermission("SEND_MESSAGES"));

    }

    async fetchMessages(channel: TextChannel) {

        let last_id = undefined;
    
        while (true) {
      

    
            const messages: Collection<String, Message> = await channel.messages.fetch({limit: 100, before: last_id });
            let msgarr: Message[] = [];
            let msgtxt  = "";

            messages.forEach(message => {
                msgarr.push(message);
            })

            last_id = messages.last()!.id;

            for(let msg of msgarr) {
                msgtxt += msg.author.username + ": " + msg.content + "\n";
            }

            fs.appendFileSync("../chatlog.txt", msgtxt);
            
          
        }
    
    }




}


