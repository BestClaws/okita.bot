import SBot from "./SBot";
import { Message } from "discord.js";
import {log} from "../util/logging";


export default class Module {

    sbot: SBot;
    commandName = "moduleName [gets overriden]";
    meta = {
        status: "enabled"
    }

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

    log(...msg: any[]) {
        log(`[mod: ${this.constructor.name}]`, ...msg);
    }

}

