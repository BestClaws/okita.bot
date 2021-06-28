// TODO: command processor would be good?
// TODO: create typings (for SBot, in this case)

import { DMChannel, TextChannel } from "discord.js";
import fs from "fs";
import { log } from "../util/logging";

import SBot from "./SBot";


export default class ModuleManager {

    sbot: SBot;

    constructor(sbot: SBot) {
        this.sbot = sbot
    
    }


    loadModules() {
        // runtime code, deals with js files, no ts present. (hence loading js files)
        
        // look for modules as files
        let moduleFiles = fs.readdirSync("./js/modules")
            .filter((file: string) => file.endsWith(".js"));
 

        // look for modules as folders
        let moreModuleFiles = fs.readdirSync("./js/modules", { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => dir.name + "/" + "main" + ".js");
        
        moduleFiles = moduleFiles.concat(moreModuleFiles);
        this.log("found modules: ", moduleFiles);


        for (const file of moduleFiles) {
            this.log("loading module: " + file);
            // modules are written in es6 ( with export default)
            // hence, access them via .default property when using require() 
            let moduleClass = require(`../modules/${file}`).default;
            let module = new moduleClass(this.sbot);
            module.moduleFile = file;
            if(module.enabled == true) {
                this.sbot.modules.push(module);
                this.log("done");
            } else {
                this.log("module is disabled (either requirements " + 
                "did not meet or enforced intentionally)...");
            }
        }

    }


    setupProcsesing() {

        //TODO: add middleware (for guilds etc., - example configure prefix)

        // setup raw message processing.
        this.sbot.dClient.on("message", (msg)  => {

            // look for commands in message
            if(msg.author.bot == true) return;
            if(msg.content.startsWith(this.sbot.botConfig.defaultPrefix)) {

                let args = msg.content.trim().slice(1).split(/ +/);
                let commandName = args.shift() || "";

                // core module manager commands
                if(this.processCommand(commandName, args, msg.channel)) return;

                // give message to all modules with function processCommand
                for(let module of this.sbot.modules) {
                    if(module.commandName == commandName) {
                        this.log(
                            "user [" + msg.author.username +
                            "] from [" + msg.guild?.name +
                            "] invoked [" + module.constructor.name +
                            "]"
                        );
                        module.processCommand(msg, args);
                    }
                }

            } else { // porcesss not command messages.
                
                for(let module of this.sbot.modules) {
                    module.processMessage(msg);
                }
            }

        });


    }


    processCommand(commandName: String, args: String[], channel: any): boolean {

        switch(commandName) {
            case 'reload':
                let moduleName = args[0];
                this.reloadModule(moduleName) ?
                    channel.send("Done.") :
                    channel.send("Failed: No module of such name.")

                return true;
        }

        return false;
    }


    reloadModule(moduleName: String): boolean {

        this.log("trying to reload module:", moduleName);

        // see if module is loaded
        for(let i = 0; i < this.sbot.modules.length; ++i) {
            if(this.sbot.modules[i].constructor.name == moduleName) {
                
                let moduleFile = this.sbot.modules[i].moduleFile;

                this.log("found module:", moduleName, "with path:", moduleFile);

                // delete previous cache
                delete require.cache[require.resolve(`../modules/${moduleFile}`)];

                // reload 
                let moduleClass = require(`../modules/${moduleFile}`).default;
                let module = new moduleClass(this.sbot);
                module.moduleFile = moduleFile;
                
                // replace old module with new module.
                this.sbot.modules.splice(i,1, module);
                this.log("done reloading module:", moduleName);
                return true;
            }
        }

        return false;
    }


    start() {
        this.loadModules();
        this.setupProcsesing();
    }



    log(...msg: any[]) {
        log(`[mod-man]`, ...msg);
    }
}

