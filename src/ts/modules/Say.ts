
import Discord from "discord.js";
import HBot from "../core/HBot";

import Module from "../core/Module";


import * as yaml from "../util/yaml";

export default class Say extends Module {

    commandName = "say";

    constructor(hbot: HBot) {
        super(hbot);
        
    }


    processCommand(msg: Discord.Message, args: string[]) {

        // log subcommand
        if(args[0] == "log") {
            let logs = yaml.load("../data/Say/log.yml");
            logs = logs.slice(0,5);
            let message = "";
            for(let log of logs)
                message += "<@" + log.requested_by + ">  *" + log.message.trim() + "*\n\n";
            let embed = new Discord.MessageEmbed();
            embed.setColor("#dd2e44");
            embed.setDescription(message);
            
            msg.channel.send(embed);
            return;
            // TODO: return should indicate success.
        } 

        // default behaviour
        msg.delete({ timeout: 0 });
        let message = "";
        for(let arg of args) message += arg + " ";
        msg.channel.send(message);
        this.recordLog(msg.author.id, message);
    
      
    }



    recordLog(username: string, message: string) {
        let logs = yaml.load("../data/Say/log.yml");
        logs.unshift({"requested_by": username, "message": message});
        yaml.save("../data/Say/log.yml", logs.slice(0,5));
    }


}
