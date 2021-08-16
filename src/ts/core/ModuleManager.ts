// TODO: command processor would be good?
// TODO: create typings (for SBot, in this case)
// TODO: maybe metadata should be a part of class?

import { MessageEmbed } from "discord.js";
import fs from "fs";
import path from "path";
import { log } from "../util/logging";

import SBot from "./SBot";


export default class ModuleManager {

    sbot: SBot;

    constructor(sbot: SBot) {
        this.sbot = sbot
    
    }

    start() {
        this.populateModules();
        this.setupProcsesing();
    }

    populateModules() {

        // runtime code, deals with js files, no ts present. (hence loading js files)
        let location = "js/modules";
        
        // look for modules as files
        let foundModules = fs.readdirSync(location)
            .filter(file => file.endsWith(".js"))
            .map(name => {
                return { meta: {
                    name: name.slice(0,-3),
                    path: path.join(location, name),
                    status: "unloaded"
                }}
            })
 

        // look for modules as folders
        let moreFoundModules = fs.readdirSync(location, { withFileTypes: true})
        .filter(dir => dir.isDirectory())
        .map(dir => {
            return { meta: {
                name: dir.name,
                path: path.join(location, dir.name + "/" + "main" + ".js"),
                status: "unloaded"
            }}
        });
        
        // populate all modules into sbot.modules.
        foundModules.push(...moreFoundModules);
        this.log("found modules: ", foundModules);
        this.sbot.modules = foundModules;

        // load all modules.
        this.log("loading all modules.")
        for (let i = 0; i < this.sbot.modules.length; ++i) {
            this.loadModule(i);
        
        }
        this.log('done');



    }


    setupProcsesing() {

        //TODO: add middleware (for guilds etc., - example configure prefix)

        // setup raw message processing.
        this.sbot.dClient.on("messageCreate", (msg)  => {

            // look for commands in message
            if(msg.author.bot == true) return;
            if(msg.content.startsWith(this.sbot.botConfig.defaultPrefix)) {

                let args = msg.content.trim().slice(1).split(/ +/);
                let commandName = args.shift() || "";

                // core module manager commands
                if(this.processCommand(commandName, args, msg.channel)) return;

                // give message to all modules with function processCommand
                for(let module of this.sbot.modules) {
                    if(module.meta.status == "enabled" && module.commandName == commandName) {
                        this.log(
                            "user [" + msg.author.username +
                            "] from [" + msg.guild?.name +
                            "] invoked [" + module.meta.name +
                            "]"
                        );
                        module.processCommand(msg, args);
                    }
                }

            } else { // process all regular messages.
                
                for(let module of this.sbot.modules) {
                    if(module.meta.status == "enabled") {
                        module.processMessage(msg);
                    }
                }
            }

        });



        this.sbot.dClient.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            for(let module of this.sbot.modules) {
                if(module.commandName == interaction.commandName) {
                    module.processInteraction(interaction);
                }
            }
 
         
        });

    }
    


    processCommand(commandName: string, args: string[], channel: any): boolean {
        // TODO: improve this method.
        // looks ugly tbh.

        // only accept these commands.
        if(![
            'mreload', "mload", "munload",
            "menable", "mdisable", "mlist"
        ].includes(commandName)) return false;
        
        // commands without arguments.
        // if(args.length == 0)
        switch (commandName) {

        case "mlist":
            let embed = this.listModules();
            channel.send({embeds: [embed]});
            return true;

        }

       
        // first argument is always moduleName
        // find module's index.
        let index = -1;
        for(let i = 0; i < this.sbot.modules.length; ++i) {
            if(this.sbot.modules[i].meta.name == args[0]) {
                index = i;
                break;
            }
        }
        // wrong module name specified.
       if(index == -1) {
           channel.send("Module not found.");
           return true;
       }

        switch(commandName) {

        case 'mreload':
            this.unloadModule(index) ?  
                (this.loadModule(index) ?
                    channel.send("Done.") :
                    channel.send("Failed - stage2: loading - module already loaded.")) :
                channel.send("Failed - stage1: unloading - module already unloaded.")
                    

            return true;

        case 'mload':
            this.loadModule(index) ?
                channel.send("Done") :
                channel.send("Failed - module already loaded")

            return true;

        case 'munload':
            this.unloadModule(index) ?
                channel.send("Done") :
                channel.send("Failed - module already disabled");
            return true;

        case 'menable':
            this.enableModule(index) ?
                channel.send("Done") :
                channel.send("Failed - only disabled modules can be enabled.");
            return true;

        case 'mdisable':
            this.disableModule(index) ?
                channel.send("Done") :
                channel.send("Failed - module already disabled");
            return true;
      
        }

        return false;

    }

    listModules() {
        let embed = new MessageEmbed();
        let desc = "";
        for(let mod of this.sbot.modules) {
            let status;
            if (mod.meta.status == "enabled") status = ":green_circle:";
            else if (mod.meta.status == "disabled") status = ":red_circle:";
            else if (mod.meta.status == "unloaded") status = ":black_circle:";
            else if (mod.meta.status  == "unstable") status = ":yellow_circle:";
            else status = "??";

            desc += `${status} **${mod.meta.name}**\n`;
        }
        embed.setTitle("Available Modules");
        embed.setDescription(desc);
        embed.setColor("#eca861");
        embed.setFooter("🟢 Online 🟡 Unstable 🔴 Offline ⚫ Unloaded")
        return embed;
    }


    loadModule(i: number) {

        let mod = this.sbot.modules[i];
        this.log("loading:", mod.meta.name);

        if(mod.meta.status != "unloaded") return false;
    

        // modules are written in es6 ( with export default)
        // hence, access them via .default property when using require() 
        let moduleClass = require('../../' + mod.meta.path).default;
        let module = new moduleClass(this.sbot);


        module.meta["name"] = mod.meta.name;
        module.meta["path"] = mod.meta.path;

        if(module.meta["status"] == "unloaded") {
            this.log("Module not loaded [requirements did not meet/Manually enforced]");
            return false;
        }

    
        this.sbot.modules.splice(i,1, module);
        
        
        this.log("Done.");
        return true;


    
    }



    disableModule(i: number) {
        let mod = this.sbot.modules[i];
        if(mod.meta.status == "enabled" || mod.meta.status == "unstable") {
            mod.meta.status = "disabled"
            return true;
        } else return false;
        
    }



    unloadModule(i: number) {
        let mod = this.sbot.modules[i];
        if(mod.meta.status == "unloaded") return false;

        // unlink module instance, but preserve metadata.
        mod = { meta: mod.meta }
        mod.meta["status"] = "unloaded";

        // clear require-cached instance..
        delete require.cache[require.resolve(`../../${mod.meta.path}`)];

        // replace module with unlinked instance.
        this.sbot.modules.splice(i,1, mod);
        return true;          
        
    }

    enableModule(i: number) {
        let mod = this.sbot.modules[i];
        if(mod.meta.status != "disabled") return false;
        mod.meta["status"] = "enabled";
        return true;          
    }







    log(...msg: any[]) {
        log(`[mod-man]`, ...msg);
    }
}

