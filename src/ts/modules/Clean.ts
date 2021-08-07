import { Message } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";


export default class Clean extends Module {

    commandName = "clean";


    constructor(sbot: SBot) {
        super(sbot);

    }

    async processCommand(msg: Message, args: string[]) {
        //let limit = Number.parseInt(args[0]);
        let limit = 10;
        let messages = await (await msg.channel.messages.fetch({limit: 100}))
            .filter((m,_k,_c) => m.author.id == msg.guild!.me!.id); // careful

        messages.forEach((message, _k,_m) => {
            // u could do this parallelly.

            if(limit > 0) {
                this.log('deleting message from ', message.author.username);
                message.delete();
                this.log("limit: ", limit);
            }
            limit--;
        });

        let response = await msg.channel.send(":ok_hand:");
        setTimeout(() => response.delete(), 5000);
    }

   
    


}

