// TODO: command processor would be good?
// TODO: create typings (for SBot, in this case)

import fs from "fs";
import { log } from "../util/logging";

import SBot from "./SBot";


export default class ModuleManager {

    sbot: SBot;

    constructor(sbot: SBot) {
        this.sbot = sbot
    
    }


    loadModules() {
        // runtime code, deals with js files, no ts present.
        
        // look for modules as files
        let moduleFiles = fs.readdirSync("./js/modules")
            .filter((file: string) => file.endsWith(".js"));
 

        // look for modules as folders
        let moreModuleFiles = fs.readdirSync("./js/modules", { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => dir.name + "/" + "main" + ".js");
        
        moduleFiles = moduleFiles.concat(moreModuleFiles);
        log("found modules: ", moduleFiles);


        for (const file of moduleFiles) {
            log("loading module: " + file);
            // modules are written in es6 ( with export default)
            // hence, access them via .default property when using require() 
            let moduleClass = require(`../modules/${file}`).default;
            let module = new moduleClass(this.sbot);
            if(module.enabled == true) {
                this.sbot.modules.push(module);
                log("done");
            } else
                log("assets requirements not met, skipping...")
        }

    }


    setupModules() {

        //TODO: add middleware (for guilds etc., - example configure prefix)

        // setup raw message processing.
        this.sbot.dClient.on("message", (msg)  => {

            // look for commands in message
            if(msg.author.bot == true) return;
            if(msg.content.startsWith(this.sbot.botConfig.defaultPrefix)) {

                let args = msg.content.trim().slice(1).split(/ +/);
                let commandName = args.shift();
                // give message to all modules with function processCommand
                for(let module of this.sbot.modules) {
                    if(module.commandName == commandName) {
                        module.processCommand(msg, args);
                    }
                }
            } else {
                for(let module of this.sbot.modules) {
                    module.processMessage(msg);
                }
            }

        });


    }




    start() {
        this.loadModules();
        this.setupModules();
    }
}

