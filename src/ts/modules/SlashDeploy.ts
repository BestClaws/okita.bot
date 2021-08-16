import { ApplicationCommand, Message, MessageEmbed } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

export default class SlashDeploy extends Module {

    meta = {
        status: "disabled"
    };

    commandName = "sd"

    constructor(sbot: SBot) {
        super(sbot);
    }


    async processCommand(msg: Message, args: string[]) {

        if (!msg.client.application?.owner) await msg.client.application?.fetch();

        if (msg.author.id === msg.client?.application?.owner?.id) {
            const data: any = [
                {
                    name: 'say',
                    description: 'make me say stuff',
                    options: [{
                        name: 'text',
                        type: 'STRING',
                        description: 'text to speak',
                        required: true,
                    }],
                }
            ];

            const command = await msg.guild?.commands.set(data);
            console.log(command);
        }
    }




}
