// TODO: command processor would be good?
// TODO: create typings (for HBot, in this case)

import fs from "fs";

import HBot from "./HBot";


export default class ModuleManager {

    hbot: HBot;

    constructor(hbot: HBot) {
        this.hbot = hbot
    
    }


    loadModules() {
        // runtime code, deals with js files, no ts present.
        const moduleFiles = fs.readdirSync("./js/modules")
            .filter((file: string) => file.endsWith(".js"));
        
        console.log("found modules: ", moduleFiles);

        for (const file of moduleFiles) {
            console.log("loading module: " + file);
            // modules are written in es6 ( with export default)
            // hence, access them via .default property when using require() 
            let moduleClass = require(`../modules/${file}`).default;
            let module = new moduleClass(this.hbot);
            console.log("Done.");
            this.hbot.modules.push(module);
        }

    }


    setupModules() {

        // setup raw message processing.
        this.hbot.dClient.on("message", (msg)  => {

            // look for commands in message
            if(msg.author.bot == true) return;
            if(msg.content.startsWith(".")) {

                let args = msg.content.trim().slice(1).split(/ +/);
                let commandName = args.shift();
                // give message to all modules with function processCommand
                for(let module of this.hbot.modules) {
                    if(module.commandName == commandName) {
                        module.processCommand(msg, args);
                    }
                }
            } else {
                for(let module of this.hbot.modules) {
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

