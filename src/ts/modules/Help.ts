import { Message, MessageEmbed } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";
import * as yaml from "../util/yaml";
import fs from "fs";

export default class Help extends Module {

    commandName = "help";
    collections: any = {};
    commands: any = {};
    assetRequirements = [
        "./assets/Help/collections.yml"
    ]

    constructor(sbot: SBot) {
        super(sbot);

        // check asset requirements.
        for(let asset of this.assetRequirements) {
            if(!fs.existsSync(asset)) {
                this.enabled = false
                return;
            } 
        }

        
        // load collections.
        this.collections = yaml.load("assets/Help/collections.yml");
        // load commands
        for(let collection in this.collections) {
            for(let command in this.collections[collection].commands) {
                this.commands[command] = this.collections[collection].commands[command];
            }
        }
    }


    processCommand(msg: Message, args: string[]) {

        
        let prefix = this.sbot.botConfig.defaultPrefix;
        
        if(args.length == 0) { // show available modules.
            const embed = new MessageEmbed();
            embed.setColor("#ff9959");
            embed.addField(
                "Available Commands",
                "**.**"
                );

            for(let collection in this.collections) {
                let commands = Object.entries(this.collections[collection].commands)
                    .map(kv => "[" + kv[0] + "](https://discord.com)")
                    .join(" • ");

                embed.addField(
                    collection,
                    commands,
                    true // inline.
                );
            }
            embed.addField(
                ".\nSupport:",
                `[Support](${this.sbot.botConfig.supportServer})\n` + 
                `[Feedback](${this.sbot.botConfig.feedbackPage})\n\n`
            );

            embed.setFooter(
                `${prefix}help [command] for more Info • Ex: ${prefix}help puzzle`
            )
            
            msg.channel.send({embeds: [embed]});
            return;

        } else if (args.length == 1) {

            let commandName = args[0];

            if(commandName in this.commands) {

                let embed = new MessageEmbed();
                embed.setColor("#eca861");
                let description = "";

                
                description +=
                    `**${commandName}**\n` +
                    `${this.commands[commandName].description}\n\n` + 
                    "**Usage**:\n\n";

                for(let variant of this.commands[commandName].variations) {
                    description += 
                        "`" + prefix + variant["variant"] + "`\n" + 
                        `${variant["description"]}\n\n`
                }

                embed.setDescription(description);
                msg.channel.send({embeds: [embed]});

            } else msg.channel.send("That command does not exist.");

        } else msg.channel.send("too many arguments.");


   
    }


}

