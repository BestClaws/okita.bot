import { Message } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";
import { channel } from "diagnostic_channel";

export default class QuickTest extends Module {
    
    commandName = "test";
    enabled = false;
    assetRequirements = [
        
    ]
    
    constructor(sbot: SBot) {
        super(sbot);
    }

    async processCommand(msg: Message, args: string[]) {

        // let boby = await msg.guild?.members.fetch("657243574995517450");
        // boby?.roles.remove("750372903165493388");
        this.sbot.dClient.guilds.cache.forEach(guild => {
            console.log(`${guild.name} | ${guild.id}`);
            guild.channels.cache.forEach(channel => {
                console.log("\t" + channel.name);
            });

        })
        // let guild = this.sbot.dClient.guilds.cache.get("744209392056139938");
        // console.log(guild?.me?.hasPermission("SEND_MESSAGES"));

    }

    async processMessage(msg: Message) {
        this.log("msg from :", msg.guild?.name);
    }


}
