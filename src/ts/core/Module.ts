import HBot from "./HBot";
import { Message } from "discord.js";


export default class Module {

    hbot: HBot;
    commandName: string;

    constructor(hbot: HBot) {
        this.hbot = hbot;
        this.commandName = "moduleName [gets overriden]";
    }

    // processInteraction() {
    //     // this.log("method processInteraction() not implemented, skipping");
    // }


    processCommand(msg: Message, args: string[]) {
        // this.log("method processCommand() not implemented, skipping");
    }

    processMessage(msg: Message) {
        // this.log("method processMessage() not implemented, skipping");
    }

    // log(...msg: any[]) {
    //     console.log(`[${this.constructor.name} module]`, ...msg);
    // }

}

