import SBot from "./SBot";
import { Message } from "discord.js";


export default class Module {

    sbot: SBot;
    commandName = "moduleName [gets overriden]";
    enabled = true;

    constructor(sbot: SBot) {
        this.sbot = sbot;
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

