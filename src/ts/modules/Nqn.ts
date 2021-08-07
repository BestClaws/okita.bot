import { GuildEmoji, Message, TextChannel, Webhook } from "discord.js";
import SBot from "../core/SBot";
import Module from "../core/Module";

export default class Nqn extends Module {

    commandName = "nqn";

    channel: string = "794137845182365716";
    webhook!: Webhook; // sus (definite assignment)

    constructor(sbot: SBot) {
        super(sbot);
        this.sbot.dClient.fetchWebhook('861346155106402324')
        .then((wh) => {
            this.channel = wh.channelId;
            this.log("current webhook channel id:", this.channel)
            this.webhook = wh;
        });
    }


    async processCommand(msg: Message, args: string[]) {

        // weebs-server only feature.
        if(msg.guild?.id != "744209392056139938") return;



    }


    async processMessage(msg: Message) {
  
        // weebs server only feature.
        if(msg.guild?.id != "744209392056139938") return;
        // dont support larger messages
        if(msg.content.length > 100) return;


        // TODO: improve this 
        // unnecessary processing, if content doesnt have :emote:
        // possibly run a linear time check

        let response = msg.content.split(" ").map(token => {
            if(token.startsWith(":") && token.endsWith(":")) {
                let emote = this.findEmote(token.slice(1, token.length -1));
                
                if(emote)
                    return emote.animated ? 
                    `<a:${emote.name}:${emote?.id}>` : 
                    `<:${emote.name}:${emote?.id}>`
                else
                    return token;

            } else return token; // not an emote, return token

        }).join(" ");


        if(response == msg.content) return; // no changes.

        msg.delete();

        // TODO: each channel should have its own webhook to reduce audit-log spam.

        if(this.channel != msg.channel.id) {

            this.channel = msg.channel.id;

            // slow... `edit` resolves the `avatar` value into an base64 encoded image
            await this.webhook.edit({
                avatar: msg.author.avatarURL() as string,
                channel: msg.channel.id
                
            });

        } else {
            await this.webhook.edit({
                avatar: msg.author.avatarURL() as string,
            });
        }

        


        this.webhook.sendSlackMessage({
            'username': msg.author.username,
            'text': response
        }).catch(console.error);



       
    }

    async createWebhook(channel: TextChannel): Promise<Webhook> {
        let webhook = await channel.createWebhook('New Web Hook', {
        })
        this.log(`Created webhook ${webhook}`);
        return webhook;
    }


    findEmote(query: string): GuildEmoji | undefined {
        // TODO: consider if discord.js cache is fast enough
        // (whether searching through a collection of GuildEmoji is as fast as searching
        // through a hashset of strings)
        let results = this.sbot.dClient.emojis.cache.filter((emote, _k, _c) => 
            query == emote.name
        );
        if(results.size > 0)
            return  results.first();
        else
            return undefined;
    }


}

