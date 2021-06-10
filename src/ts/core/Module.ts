import XBot from "./XBot";
import { Message } from "discord.js";


export default class Module {

    xbot: XBot;
    commandName = "moduleName [gets overriden]";
    enabled = true;

    constructor(xbot: XBot) {
        this.xbot = xbot;
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

