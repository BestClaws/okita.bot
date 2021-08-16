import { Message, TextChannel } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";


export default class Clean extends Module {

    commandName = "clean";


    constructor(sbot: SBot) {
        super(sbot);

    }


    async processCommand(msg: Message, args: string[]) {
    // this command delete okita messages from last x messages
    // NOT delete x okita messages. (maybe prefer temporal recency?)

        let limit = Number.parseInt(args[0]) || 10; // default limit: 10


        let channel = msg.channel as TextChannel;

        let messages = (await msg.channel.messages.fetch({limit}))
            .filter(m => m.author.id == msg.guild?.me?.id);

        channel.bulkDelete(messages);

        // TODO: do better logging
        this.log('deleting a bulk of messages');

        let response = await msg.channel.send(":ok_hand:");
        setTimeout(() => response.delete(), 5000);
    }


}

